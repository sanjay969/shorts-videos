# Daily Shorts Automation (channel: surya)

Target audience: **United States** (owner's decision, 22 Nov 2026).

**MAIN GOAL (owner, 23 Nov 2026): win the US audience.** Every choice must serve American viewers:
- Pick stories Americans are talking about right now: US news, US companies, CEOs, markets, sports and pop culture, and US history. A global story is fine only if it is big in the US too.
- Use American English voice, words, units ($, miles, °F) and references.
- **NO BACKLOG (owner, 28 Nov 2026): upload ONLY the Shorts built for that US Eastern date, in the 6:00 / 7:30 / 9:00 PM ET slots. Never upload older queue days, never force-upload, never add extra/backlog slots. Old un-uploaded Shorts are dropped. Keep BACKLOG = [] and BACKLOG_DAYS = 0 in scripts/yt_upload.py.**
- **ONE VOICE EVERYWHERE (owner, 28 Nov 2026): Kokoro `af_heart` (female) for ALL Shorts, trailer Shorts AND long videos. Never am_michael or any other voice. Keep the same speed feel (about 1.05-1.1) so the channel sounds like one narrator.**
- Upload in US evening prime time (6:00 / 7:30 / 9:00 PM ET).
- Check the US share of views in `insights.md` / `stats.md`. Do more of what US viewers watch, and drop what they don't. All times below are **US Eastern (America/New_York)**, and the queue folder date is the US Eastern date (`TZ=America/New_York date +%F`).

Scheduled tasks:

- **BUILD**: starts ~3:43 PM IST (~5:13 AM ET). Makes 3 shorts and pushes them to `queue/YYYY-MM-DD/` before 5:00 PM ET.
- **UPLOAD** (since 25 Nov 2026): free GitHub Actions uploader (`.github/workflows/youtube-upload.yml`), no Zapier. One video per slot, never together: backlog Shorts 12:00 & 3:00 PM ET, today's Shorts **6:00 / 7:30 / 9:00 PM ET**, long video 8:15 PM ET. It skips anything already on the channel (same title). Shorts descriptions get a link to the newest long video automatically.

## GROWTH PLAYBOOK — US audience (owner asked 25 Nov 2026: "professional, go viral in the US")

Data so far (insights.md): US viewers watch longer (38 s vs 28 s), US-rooted stories convert best to subs (D.B. Cooper, Centralia, Titanic), staggered evening uploads all stayed alive, 95% of views come from the Shorts feed. So:

1. **Topic mix every day:** 2 US-rooted mysteries / strange true stories plus 1 timely US hook (holiday, news, anniversary this week). Never 3 of the same theme (no more single-person "pinned" days unless the owner pins them).
2. **First 1 second decides everything:** the strangest fact with a number, spoken and on screen, and frame 1 already in motion. No intro, no title card.
3. **Retention:** 20-30 s, a visual change every 1-2 s, captions on every word, and the last line loops into the first so the replay counts.
4. **Comment bait:** the description and the last on-screen beat ask one simple either/or question ("Would you have brought him back?"). Comments push Shorts in the feed.
5. **Subscriber conversion:** one 2-second subscribe beat at ~70%, phrased as a promise ("Follow for a new unsolved case every night"), never at the start.
6. **Series identity:** keep the same character style, caption style and music bed, so a viewer recognises the channel in 1 frame.
7. **Shorts → long funnel:** pick long-video topics that expand the best-performing Short, and reference that Short's story. The uploader links the newest long video in every Short's description.
8. **Titles:** under 50 characters, [specific person/thing] + [number] + [unexplained twist], no emoji, no clickbait that the video doesn't pay off.
9. **Kill what flops:** after 48 h, any topic type under half the channel median gets dropped for a week (the analysis job tracks this in insights.md).
10. **Never** re-upload the same video, upload several at once, or use copyrighted music/footage. These hurt reach more than any trick helps.

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
  - **broken shapes (owner complaint 24 Nov 2026)**: a head or arm with a flat, sliced edge; a body sliced by a table, counter or booth; two people overlapping each other; legs showing under a table; a wall screen overlapping a window frame; a cart passing through the track. Check every such frame at full size with `capture.mjs frames` before the final render.
- STAGING RULES (prevent broken shapes):
  - Leave at least 1.1 m between people's positions, and never put a person inside the footprint of a table, counter, booth or cart.
  - Boardroom table spans z -5.1 to -3.3. Seat people at z ≤ -5.4 (behind it) and walk people at z ≥ -2.9 (in front of it).
  - The camera stays at least 1.3 m from the nearest person. No face that fills more than half the frame, and no shot that ends inside a wall, a screen or a body (black frames).
  - Use `lean` of 12° or less, and keep raised arms inside the card. Toon cards now have a 128 px margin on each side, which stops edge clipping up to that.
- Topics must not repeat anything in `topics-done.txt`.

## ANIMATION RULES (owner asked 23 Nov 2026: "make the animation interesting")

Problem in past shorts: the toon mostly stands in the middle facing the camera, the same framing repeats, and one scene sits there for 3-4 s while only the caption changes. Fix it with these rules for every `shots.js`:

1. **The toon must act, not just stand.** In at least 60% of shots the toon is DOING something: `legs: 'walk'|'run'|'jump'`, pointing or grabbing with `armL/armR`, picking up or throwing a prop (`holdL/holdR`), leaning in (`lean`), squash-and-stretch on landings (`squash`). Change `mood` on every story beat (shock → worried → smug ...), and use `sweat`/`tears`/`look` for reactions. Never use the same pose in 2 shots in a row.
2. **Move the camera in every shot.** Use push-in, pull-out, pan, orbit, crane up/down, low angle for power and high angle for defeat, a tilted (Dutch) angle for tension, and a fast whip-pan or zoom-through to cut between scenes. No two shots in a row with the same framing (alternate wide / medium / close-up / extreme close-up on a prop or face).
3. **Something new every 1 s.** A cut, a new prop flying in, a label popping in with a bounce (`eob`), a counter ticking, a chart line drawing itself, or a reaction. A single setup may last at most 2 s.
4. **Make the numbers physical.** Money is a stack that grows or bursts. Stock moves are a giant line chart the toon rides like a rollercoaster or falls off. Days are calendar pages flying off. Big numbers slam in with a camera shake and an impact SFX.
5. **Cartoon FX.** Use speed lines when running, impact stars, a "!" or "?" above the head, a dust puff on landing, and confetti, sparks or money rain on big wins. Use a quick colour or light change for mood (a red tint on a crash, a warm glow on a comeback).
6. **Use 2+ characters when the story has them.** Boardroom, crowd, reporter or rival toons that react to the main toon (generic looks, never real likenesses).
7. **Sync sound to motion.** Every pop-in, slam, whoosh and landing gets its SFX cue (`node tools/capture.mjs cues` picks them up).
8. **Motion check (required).** On the final `share.mp4`, run
   `python3 kit/tall-tale/tools/motion_check.py <video>` (or the copy in the video folder's `tools/`). Any `DEAD` stretch (over 1 s with almost no motion) must be fixed with a camera move, action or new prop, then re-rendered. Also look at the QA sheet: if 3 frames in a row look the same, fix that too.

Long videos: apply rules 1-7 as well, with a visual change every 3-4 s.

## SMOOTHNESS + QUALITY RULES (owner asked 28 Nov 2026: "video smooth bane, quality aur animation improve")

Root causes found on 28 Nov: Shorts were rendered at 24 fps and the share copy was re-encoded at CRF 27 (~2 Mbps, blocky); the long video was 24 fps at 1.1 Mbps H.264 (squeezed under GitHub's 100 MB limit). Fixed in the kit:
1. **30 fps always** (`FPS=30`). Never 24.
2. **Motion blur:** `MBLUR=2` renders 2 sub-frames per frame and blends them, so fast camera moves and whip-pans look smooth instead of steppy. It doubles render time: use it whenever the build has time (at least for the 6 PM series Short); otherwise render with `MBLUR=1`.
3. **Final file:** `bash tools/finish.sh renders/final.mp4 renders/share.mp4 short` (upscales to 1440x2560 so YouTube uses its higher-quality encoder, x264 CRF 19, ~15-30 MB). Long videos: `bash tools/finish.sh renders/final.mp4 renders/share.mp4 long` (HEVC 2-pass sized for the 100 MB limit, about twice the quality of the old H.264 file at the same size). Never use CRF 27 or `-preset veryfast` for a final file again.
4. **Animation smoothness:**
   - Every move is eased (easeInOutCubic / easeOutBack for pop-ins). No linear starts or stops, no instant position jumps except a deliberate hard cut.
   - The camera never fully stops: even "still" shots get a slow 2-4% push-in or drift.
   - Cut on action: start the next shot already in motion; carry camera direction across the cut (pan left → next shot also moving left).
   - Overlapping action: hair, clothes, props and arms settle 2-4 frames after the body stops (small overshoot + settle).
   - Characters blink every 2-4 s, breathe (slight scale 1-2%), and their heads turn before their bodies.
   - Whip-pans and drone dives last 6-10 frames with motion blur; never a 1-frame teleport.
   - Text pops: scale 0 → 110% → 100% over ~8 frames, never just appear.
   - Check the QA sheet AND play the draft (`node tools/capture.mjs video renders/draft.mp4 --draft`) at full speed: any stutter, pop or frozen limb gets fixed before the final render.

## BUILD (one run = 3 videos)

0. **Lock (only one build per day).** Before anything else: `D=$(TZ=America/New_York date +%F)`. If `queue/$D/BUILD.lock` already exists on origin/main, or `queue/$D/meta.json` already lists 3 videos, STOP and build nothing (another build run already owns today). Otherwise create `queue/$D/BUILD.lock` (contents: start time), commit and `git push origin main`. If that push is rejected because main moved, `git pull --rebase` and re-check: if a lock now exists, STOP.
1. **Monitor first.** Read the last 7 days of `queue/*/uploaded.json` and `meta.json`. Get each video's views, likes and comments from `analytics/latest.json` (free YouTube API stats; vidIQ is NOT used any more, owner rule 27 Nov 2026). Append one line per video to `stats.md` (date, title, topic type, views, likes). Note which topic types are doing best (for example mystery vs funny history vs current news) and lean toward them when picking today's topics, but keep at least one different type so the channel keeps testing.
1b. **Pinned topics (owner requests).** If `pinned-topics.md` has entries for today's date that are not yet done, build those first, in the order listed (video 1, 2, 3). Pick topics as usual only for the slots left over. Pinned topics override the "keep one different topic type" rule. After building it, mark it `[done]` in `pinned-topics.md`.
2. **Find trending topics.** Do this every run; anniversaries alone are not enough:
   - insights.md (twice-daily analysis) and GROWTH_PLAN.md (daily mix: 6 PM "What Happens If You…" series, 7:30 PM strange true US story / Part 2, 9 PM Part 1 cliffhanger or a long video's trailer Short).
   - Web search (extended mode) for what is in the news or viral this week that has a story angle.
   - Anniversaries this week are a fallback or a tie-breaker.

   **SUPERSEDED (28 Nov 2026): data showed business/news Shorts flop (Nvidia CEO 5 views). Follow GROWTH_PLAN.md + insights.md instead; use news only as a hook for an on-niche mystery / true-story / what-if topic. Old text kept for reference:** Owner preference (23 Nov 2026): lead with big trending news. Every day, at least 2 of the 3 topics must come from the biggest US/global news stories of the last 1–3 days that people are searching for. Good examples are a famous CEO fired and rehired, a stock crash or surge, a huge company deal, a viral tech, business, sports or pop-culture moment, or a surprising court or government decision. Example: Nvidia CEO Jensen Huang out and back in 11 days, Nov 2026. Find them with web search (extended mode: "biggest news today", "stock market today", "trending this week")  Tell each one as a story: what happened, the twist, and the numbers. Verify every fact and number in 2 or more sources dated this week, and say "alleged" for anything not proven. The rule below still applies: skip deaths, disasters, violence, and stories that are mainly about a scandal in someone's private life. A big news story can fill 2–3 videos with different angles (the event, the money or market side, the person's backstory). Use the same toon for the same person across those videos. The 3rd slot can be a mystery or strange-history topic so the channel keeps testing.

   Pick 3 topics. Good topics are:
   - big trending news with a story angle (first choice; see above)
   - unsolved mysteries
   - strange true stories
   - anniversaries this week
   - viral "what happened to…" history

   Topics must be English-language and US/global appeal. They must not be in `topics-done.txt`. In the final summary, say for each topic why it was picked (the trend signal).
3. For each topic, use the faceless-shorts skill in the Tall Tale 3D style:
   1. Run `bash $S/scripts/new_video.sh tall-tale <slug>`. Then overlay this repo's kit:
      `cp -r kit/tall-tale/{tools,src,index.html,sheet.html} ~/faceless-shorts/<slug>/`
      The kit has the extra props, sea.js, town.js, winter.js and sky.js. See `kit/examples/*.shots.js` for full shot lists to learn from (don't copy them).
   2. Write script.json:
      - 20–30 s total (the last line leads back into the first so it loops)
      - the first line (0–1.5 s) is the most shocking fact or a direct question; no intro
      - 10–14 short lines, one short subscribe prompt ~70% through
      - voice `af_heart` (female voice, owner preference; never am_michael)
      - music `tension` for mysteries
      - sources listed

      Numbers in caps use the `'shown~spoken'` form, e.g. `"$18~eighteen"`.
   3. Generate the voice and word timings: `$S/scripts/py $S/scripts/voice.py .` then `$S/scripts/py $S/scripts/words.py .`
   4. Write `src/shots.js` following the **ANIMATION RULES** above. Aim for about 18–25 shots: something visibly changes every 1–2 s, hand gestures, and on-screen labels (ribbon/pill/counter/stamp). Keep overlays above y=1150.
   5. Check timing: `SOFTWARE_GL=1 QS='&res=0.6&aa=0&shadow=1024' node tools/capture.mjs check`
   6. Make the QA sheet: `node tools/capture.mjs sheet review/all.jpg 0.7 11`. Look at it, fix problems, then re-check key frames with `node tools/capture.mjs frames review/<newdir> "t1,t2"`. Use a new directory each time, because rm is blocked.
   7. Build sound: `node tools/capture.mjs cues`, then `$S/scripts/py tools/mix.py .`
   8. Render: `SOFTWARE_GL=1 QS='&res=1&aa=1&shadow=2048' FPS=30 MBLUR=2 node tools/capture.mjs video renders/final.mp4` (use `MBLUR=1` if time is short; see SMOOTHNESS rules). This takes about 75-150 min. Run it in the foreground in chunks, or in the background with sleep/poll inside the same turn. If time is short, use `res=0.8`.
   9. Make the upload file: `bash tools/finish.sh renders/final.mp4 renders/share.mp4 short` (1440x2560, high quality; never CRF 27).
   10. Do the final QA: `ffmpeg -i renders/share.mp4 -vf "fps=1,scale=150:-1,tile=11x6" -frames:v 1 renders/qa.jpg`. Look at it, and run `python3 tools/motion_check.py renders/share.mp4` (it must report no DEAD stretches).
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

**First read `UPLOAD_MODE` at the repo root.** If it says `actions`, do NOT upload anything. The free GitHub Actions uploader (`.github/workflows/youtube-upload.yml` + `scripts/yt_upload.py`) handles Shorts at 6:00 / 7:30 / 9:00 PM ET and pending long videos. Just report what `uploaded.json` shows. Follow the Zapier steps below only when it says `zapier`. If a file named `UPLOAD_LOCKED` exists, the YouTube API audit is still pending: tell the owner to upload manually.


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
