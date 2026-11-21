# Daily Shorts Automation (channel: surya)

There are two scheduled tasks:

- **BUILD**: starts around 10:40 AM IST. It makes 3 shorts and pushes them to `queue/YYYY-MM-DD/`.
- **UPLOAD**: starts around 6:56 PM IST, does its checks, then waits until exactly 7:00 PM IST before uploading. The videos must go public at 7:00 PM, never earlier (the owner asked for this).

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
      - 45–60 s total
      - a hook in the first 2 s
      - 18–24 short lines
      - voice `am_michael`
      - music `tension` for mysteries
      - sources listed

      Numbers in caps use the `'shown~spoken'` form, e.g. `"$18~eighteen"`.
   3. Generate the voice and word timings: `$S/scripts/py $S/scripts/voice.py .` then `$S/scripts/py $S/scripts/words.py .`
   4. Write `src/shots.js`. Aim for about 25–30 shots: a cut every 1.5–2.5 s, hand gestures, and on-screen labels (ribbon/pill/counter/stamp). Keep overlays above y=1150.
   5. Check timing: `SOFTWARE_GL=1 QS='&res=0.6&aa=0&shadow=1024' node tools/capture.mjs check`
   6. Make the QA sheet: `node tools/capture.mjs sheet review/all.jpg 0.7 11`. Look at it, fix problems, then re-check key frames with `node tools/capture.mjs frames review/<newdir> "t1,t2"`. Use a new directory each time, because rm is blocked.
   7. Build sound: `node tools/capture.mjs cues`, then `$S/scripts/py tools/mix.py .`
   8. Render: `SOFTWARE_GL=1 QS='&res=1&aa=1&shadow=2048' FPS=24 node tools/capture.mjs video renders/final.mp4`. This takes about 75 min. Run it in the foreground in chunks, or in the background with sleep/poll inside the same turn. If time is short, use `res=0.8`.
   9. Make the share copy: `ffmpeg -i renders/final.mp4 -c:v libx264 -crf 27 -preset slow -c:a aac -b:a 128k renders/share.mp4`
   10. Do the final QA: `ffmpeg -i renders/share.mp4 -vf "fps=1,scale=150:-1,tile=11x6" -frames:v 1 renders/qa.jpg`. Look at it.
4. Copy each `share.mp4` to `queue/YYYY-MM-DD/N-<slug>.mp4` (N = 1, 2, 3).
5. Write `queue/YYYY-MM-DD/meta.json` as a list of `{file, title, description, tags}`:
   - The title is curiosity-driven, under 70 chars and has no clickbait lies.
   - The description is 1–2 lines with a question to the viewer and ends with 4–5 hashtags plus `#shorts`.
   - Tags are 5–8 words without `#`.
6. Append the topics to `topics-done.txt`.
7. Commit and push to `main`. Use `git -c push.negotiate=true push origin main`.
8. If a video fails, push the ones that worked. Never pad the queue with a low-quality video.

## UPLOAD

1. Run `git pull`, then read `queue/YYYY-MM-DD/meta.json` for today (IST date).
2. For each entry, the video URL is `https://raw.githubusercontent.com/sanjay969/shorts-videos/main/queue/YYYY-MM-DD/<file>`. Check it first with `curl -sSI` and expect a 200.
3. Wait until 19:00:00 IST (sleep) before the first upload call. Never upload earlier.
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

   Note: `publish_at` only works for YouTube Partner accounts, so this run uploads as public directly.
4. Write the returned video IDs to `queue/YYYY-MM-DD/uploaded.json`. Do not re-upload any entry already listed there.
5. Commit and push.
6. Report a short summary in Hinglish: titles and watch links. If the queue is missing or empty, say so and upload nothing.
