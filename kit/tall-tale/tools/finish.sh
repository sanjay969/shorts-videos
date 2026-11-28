#!/usr/bin/env bash
# Final upload file. Usage: tools/finish.sh renders/final.mp4 renders/share.mp4 [short|long]
# short: upscale to 1440x2560 (YouTube then uses its higher-quality VP9/AV1 encode), x264 medium, ~15-30 MB for 30 s.
# long:  1920x1080 HEVC 2-pass sized to fit GitHub's 100 MB limit (about 2x the quality of H.264 at the same size).
set -euo pipefail
in=$1; out=$2; kind=${3:-short}
if [ "$kind" = short ]; then
  ffmpeg -v error -y -i "$in" -vf "scale=1440:2560:flags=lanczos,fps=30" -c:v libx264 -preset medium -tune animation -crf 19 \
    -maxrate 18M -bufsize 36M -profile:v high -pix_fmt yuv420p -c:a aac -b:a 192k -ar 48000 -movflags +faststart "$out"
else
  dur=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$in")
  kbps=$(python3 -c "print(int(92*8*1024/float('$dur') - 160))")
  tmp=$(mktemp -d)
  ffmpeg -v error -y -i "$in" -vf "fps=30" -c:v libx265 -preset fast -b:v ${kbps}k -x265-params pass=1:stats=$tmp/x265.log:log-level=error -an -f null /dev/null
  ffmpeg -v error -y -i "$in" -vf "fps=30" -c:v libx265 -preset fast -b:v ${kbps}k -x265-params pass=2:stats=$tmp/x265.log:log-level=error \
    -tag:v hvc1 -pix_fmt yuv420p -c:a aac -b:a 160k -ar 48000 -movflags +faststart "$out"
  rm -rf "$tmp"
fi
ls -lh "$out" | awk '{print $5, $9}'
