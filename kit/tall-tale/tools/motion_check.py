#!/usr/bin/env python3
"""Find "dead" stretches in a short: places where the picture barely moves.

Usage: python3 motion_check.py <video.mp4> [max_still_seconds=1.0] [threshold=2.5]

Samples the video at 8 fps in grayscale, ignores the caption band, and measures how much
each frame differs from the one before. A run of frames whose change is below the
threshold that lasts longer than max_still_seconds is reported as a DEAD stretch.
Exit code 1 if any dead stretch is found, so the build can fail on it.
"""
import subprocess, sys, json

FPS, W, H = 8, 144, 256


def frames(path):
    cmd = ["ffmpeg", "-loglevel", "error", "-i", path, "-vf", f"fps={FPS},scale={W}:{H},format=gray",
           "-f", "rawvideo", "-"]
    p = subprocess.Popen(cmd, stdout=subprocess.PIPE)
    n = W * H
    while True:
        b = p.stdout.read(n)
        if len(b) < n:
            break
        yield b
    p.wait()


def main():
    path = sys.argv[1]
    max_still = float(sys.argv[2]) if len(sys.argv) > 2 else 1.0
    thr = float(sys.argv[3]) if len(sys.argv) > 3 else 2.5
    # skip the caption band (big word captions sit around 60-75% of the height) so changing words don't count as motion
    y0, y1 = int(H * 0.60), int(H * 0.76)
    rows = [r for r in range(H) if not (y0 <= r < y1)]
    prev, diffs = None, []
    for f in frames(path):
        if prev is not None:
            s = 0
            for r in rows:
                o = r * W
                a, b = f[o:o + W], prev[o:o + W]
                s += sum(abs(x - y) for x, y in zip(a, b))
            diffs.append(s / (len(rows) * W))
        prev = f
    dead, start = [], None
    for i, d in enumerate(diffs + [999]):
        if d < thr:
            if start is None:
                start = i
        else:
            if start is not None and (i - start) / FPS > max_still:
                dead.append((round(start / FPS, 2), round(i / FPS, 2)))
            start = None
    total = len(diffs) / FPS
    still_time = sum(b - a for a, b in dead)
    print(json.dumps({"seconds": round(total, 1), "dead_stretches": dead,
                      "dead_seconds": round(still_time, 1),
                      "avg_motion": round(sum(diffs) / max(1, len(diffs)), 2)}))
    for a, b in dead:
        print(f"DEAD {a:.1f}s - {b:.1f}s ({b - a:.1f}s with almost no motion): add a camera move, character action or new prop")
    sys.exit(1 if dead else 0)


if __name__ == "__main__":
    main()
