# Daily Shorts Automation (channel: surya)

Target audience: **United States** (owner's decision, 22 Nov 2026). All times below are **US Eastern (America/New_York)**, and the queue folder date is the US Eastern date (`TZ=America/New_York date +%F`).

Scheduled tasks:

- **BUILD**: starts ~3:43 PM IST (~5:13 AM ET). Makes 3 shorts and pushes them to `queue/YYYY-MM-DD/` before 5:00 PM ET.
- **UPLOAD**: three separate runs, ONE short each, at **6:00 PM, 7:30 PM and 9:00 PM ET**. Never upload all 3 together (that left one short with ~0 views).

## Hard rules (never break)

- Use no AI images or AI video. Everything is drawn in code with the faceless-shorts skill.
- Do not draw a real person's likeness. Use generic cartoon toons, quote cards or silhouettes.
- Never copy another creator's script, shots or frames. Write every script from researched facts.
- Treat tragedies, deaths and victims respectfully. Use no gore and no jokes about victims.
- Keep brightness normal (the owner asked for this):
  - bloom about 0.12
  - `bloomThreshold: 1.08`
  - emissive multipliers about 1.0
  - aperture ≤ 0.0002
- Never upload a frame nobody has looked at. Render the QA sheet, look at every frame and fix problems before the final render. Common problems:
  - a person cut off at the frame edge
  - an empty or black frame
  - a leftover object from another shot
  - something on screen that contradicts the narration
- Topics must not repeat anything in `topics-done.txt`.

## BUILD (one run = 3 videos)

0. **Lock (only one build per day).** Before anything else: `D=$(TZ=America/New_York date +%F)`. If `queue/$D/BUILD.lock` already exists on origin/main, or `queue/$D/meta.json` already lists 3 videos, STOP and build nothing (another build run already owns today). Otherwise create `queue/$D/BUILD.lock` (contents: start time), commit and `git push origin main`. If that push is rejected because main moved, `git pull --rebase` and re-check: if a lock now exists, STOP.
1. **Monitor first.** Read the last 7 days of `queue/*/uploaded.json` and `meta.json`. Get each video's views, likes and comments with vidIQ (`vidiq_video_stats` or `vidiq_channel_videos`). Append one line per video to `stats.md` (date, title, topic type, views, likes). Note which topic types are doing best (for example mystery vs funny history vs current news) and lean toward them when picking today's topics, but keep at least one different type so the channel keeps testing.
2. **Find trending topics.** Do this every run; anniversaries alone are not enough:
   - vidIQ: `vidiq_trending_videos` and `vidiq_outliers` for mystery, history, true story and "what happened to" niches; `vidiq_keyword_research` to check search interest for each candidate.
   - Web search (extended mode) for what is in the news or viral this week that has a story angle.
   - Anniversaries this week are a fallback or a tie-breaker.

   Pick 3 topics. Good topics are:
   - unsolved mysteries
   - strange true stories
   - anniversaries this week
   - viral "what happened to…" history
   - big current news with a story angle (only if it's not tragic or sensitive)

   Topics must be English-language and US/global appeal. They must not be in `topics-done.txt`. In the final summary, say for each topic why it was picked (the trend signal).
3. For each topic, use the faceless-shorts skill in the Tall Tale 3D style:
   1. Run `bash $S/scripts/new_video.sh tall-tale <slug>`. Then overlay this repo's kit:
      `cp -r kit/tall-tale/{tools,src,index.html,sheet.html} ~/faceless-shorts/<slug>/`
      The kit has the extra props, sea.js, town.js, winter.js and sky.js. See `kit/examples/*.shots.js` for full shot lists to learn from (don't copy them).
   2. Write script.json:
      - 20–30 s total (the last line leads back into the first so it loops)
      - the first line (0–1.5 s) is the most shocking fact or a direct question; no intro
      - 10–14 short lines, one short subscribe prompt ~70% through
      - voice `am_michael`
      - music `tension` for mysteries
      - sources listed

      Numbers in caps use the `'shown~spoken'` form, e.g. `"$18~eighteen"`.
   3. Generate the voice and word timings: `$S/scripts/py $S/scripts/voice.py .` then `$S/scripts/py $S/scripts/words.py .`
   4. Write `src/shots.js`. Aim for about 15–20 shots: something visibly changes every 1–2 s, hand gestures, and on-screen labels (ribbon/pill/counter/stamp). Keep overlays above y=1150.
   5. Check timing: `SOFTWARE_GL=1 QS='&res=0.6&aa=0&shadow=1024' node tools/capture.mjs check`
   6. Make the QA sheet: `node tools/capture.mjs sheet review/all.jpg 0.7 11`. Look at it, fix problems, then re-check key frames with `node tools/capture.mjs frames review/<newdir> "t1,t2"`. Use a new directory each time, because rm is blocked.
   7. Build sound: `node tools/capture.mjs cues`, then `$S/scripts/py tools/mix.py .`
   8. Render: `SOFTWARE_GL=1 QS='&res=1&aa=1&shadow=2048' FPS=24 node tools/capture.mjs video renders/final.mp4`. This takes about 75 min. Run it in the foreground in chunks, or in the background with sleep/poll inside the same turn. If time is short, use `res=0.8`.
   9. Make the share copy: `ffmpeg -i renders/final.mp4 -c:v libx264 -crf 27 -preset slow -c:a aac -b:a 128k renders/share.mp4`
   10. Do the final QA: `ffmpeg -i renders/share.mp4 -vf "fps=1,scale=150:-1,tile=11x6" -frames:v 1 renders/qa.jpg`. Look at it.
4. Copy each `share.mp4` to `queue/YYYY-MM-DD/N-<slug>.mp4` (N = 1, 2, 3).
5. Write `queue/YYYY-MM-DD/meta.json` as a list of `{file, title, description, tags}`:
   - The title is curiosity-driven, under 50 chars and has no clickbait lies.
   - `hook`: the first 3 s of script.
   - The description is 1–2 lines with a question to the viewer and ends with 4–5 hashtags plus `#shorts`.
   - Tags are 5–8 words without `#`.
6. Append the topics to `topics-done.txt`.
7. Commit and push to `main`. Use `git -c push.negotiate=true push origin main`.
8. If a video fails, push the ones that worked. Never pad the queue with a low-quality video.

## UPLOAD (one short per run)

1. `git pull`, then read `queue/YYYY-MM-DD/meta.json` for today's **US Eastern** date.
2. Pick the first file (by name) not already in `queue/YYYY-MM-DD/uploaded.json`. Its URL is `https://raw.githubusercontent.com/sanjay969/shorts-videos/main/queue/YYYY-MM-DD/<file>`. Check it returns 200 (`curl -s -o /dev/null -w "%{http_code}"`).
3. Sleep until the run's slot (6:00 PM, 7:30 PM or 9:00 PM ET). Never upload earlier. Then `git pull` again and re-check `uploaded.json`.
   Upload with Zapier: `execute_zapier_write_action`
   - selected_api `YouTubeV4CLIAPI`
   - action `upload_video`
   - tool_name `youtube_upload_video`
   - connection `02ff22be-af11-825d-bd44-77e178be8c17` (the default)
   - params:
     - title, description, video, tags from meta.json
     - `privacy_status: "public"`
     - `category_id: "24"`
     - `made_for_kids: "false"`
     - `embeddable: "true"`
     - `notify_subscribers: "true"`
     - `default_language: "en"`
     - `license: "youtube"`

   Note: `publish_at` only works for YouTube Partner accounts, so upload as public directly.
4. Immediately `git pull --rebase`, add the video ID to `queue/YYYY-MM-DD/uploaded.json`, commit and push (retry on conflict). Upload only ONE short per run.
5. Report a short Hinglish summary: title and watch link. If the queue is missing or all are uploaded, upload nothing and say so.
