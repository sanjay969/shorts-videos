# Insights — 2026-11-28 (Sat), 2:07 PM IST run (updates the 9:07 AM run)

**2:07 PM update:** stats workflow re-run at 08:38 UTC — still skipped (`YT_ANALYTICS_REFRESH_TOKEN` not set), so still no view data. No new uploads since the morning run (last: D.B. Cooper long, 02:01 UTC = 9:01 PM ET 27 Nov). Nothing big broke in the trend picks, so the morning topic list and rules stand unchanged. Tonight's build: follow the rules below exactly.

**Data source: FALLBACK (no view numbers).** vidIQ is no longer used (Sanjay, 27 Nov). The new free stats workflow (`.github/workflows/channel-stats.yml` + `scripts/yt_stats.py`) was added today and run once: it skipped because the GitHub secret `YT_ANALYTICS_REFRESH_TOKEN` is not set yet. YouTube's public RSS feed is not reachable from this sandbox either. So the table below has upload times only (from queue/*/uploaded.json), not views.

## ⚠️ TIMING PROBLEM (top priority)
1. **27 Nov, 4:33–4:37 AM ET: 5 Shorts published within 4 minutes** (Nvidia CEO quit, Denny's dishwasher, Winchester stairs, JFK Babushka Lady, Voynich). This came from manual (workflow_dispatch) runs that flushed the backlog. 4:30 AM ET is dead time for a US audience, and 5 at once means they compete with each other. Expect most of them to have flopped.
2. **Because of that burst, ZERO Shorts went out on Black Friday night (27 Nov).** The uploader counts 6 uploads/day (ET) against the API quota; the 5 morning Shorts used the budget, so the 6:00 / 7:30 PM slots logged "holding the last upload of the day for the pending long video", and the last upload went to the D.B. Cooper long video (9:01 PM ET, fine).
3. Result: the 27 Nov queue (price pain, vibrating cave, attic man) is **still unpublished** and should take tonight's 6:00 / 7:30 / 9:00 PM ET slots.
- **Fix:** no manual/forced upload runs outside 5–10 PM ET. If a backlog builds up, let the scheduled slots drain it (1 Short per slot), or drop the oldest/weakest Shorts. Never flush a backlog.

## WIN / FLOP — Shorts from the last 3 days (no view data available)
| Published (ET) | Short | Type | Views / avg view % | Verdict |
|---|---|---|---|---|
| 27 Nov 4:37 AM (off-slot, burst) | No One Can Read This 600-Year-Old Book (GtUzds9Ox-8) | mystery | no data | likely FLOP (timing) |
| 27 Nov 4:36 AM (off-slot, burst) | The JFK Witness No One Ever Found (BJDfXIyBmNE) | US mystery | no data | likely FLOP (timing) |
| 27 Nov 4:35 AM (off-slot, burst) | Why She Built Stairs Into the Ceiling (1bThWQbjIa4) | US mystery | no data | likely FLOP (timing) |
| 27 Nov 4:34 AM (off-slot, burst) | He Washed Dishes at Denny's. Now He Runs Nvidia (f8w64YmA2KA) | business (off-niche) | no data | likely FLOP |
| 27 Nov 4:33 AM (off-slot, burst) | Nvidia's CEO Quit, Then Came Back in 11 Days (w8yOncZIrSw) | business (off-niche) | no data | likely FLOP |
| 26 Nov 6:16 PM (on slot) | Macy's Let Its Giant Balloons Fly Away (VRKBvkMlwn0) | US holiday true story | no data | n/a |
| 25 Nov 10:45 PM (late) | Black Friday Was Named by Angry Cops (gL7PGV1eOUI) | US holiday history | no data | n/a |
| 25 Nov 7:00 PM | A Crying Kid Started the Turkey Pardon (-wP4No1l0wc) | US holiday true story | no data | n/a |
| Long, 27 Nov 9:01 PM | He Jumped From a Jet With $200,000 and Vanished (aKttDFRpuCg, 9:44) | US mystery long | no data | n/a |

Last real data (7d to 23 Nov): ~14.1K views, 23 subs = 1.6 subs/1,000 views, US share 22.6%, 95% Shorts feed. Best launch ever: "What Thanksgiving Dinner Really Does to You" (2,537 in 5h, body what-if). Channel median ≈ 1,230 public views.

## Rules for the next build (2026-11-28)
1. **Timing:** tonight's 3 slots (6:00 / 7:30 / 9:00 PM ET = 23:00 / 00:30 / 02:00 UTC) belong to the 27 Nov queue (price pain → vibrating cave → attic man). Today's new Shorts will go out Sunday night. No manual upload runs before 5 PM ET.
2. **Topics:** Black Friday/Thanksgiving is over, so drop holiday angles. Do more US mysteries and strange true US stories (D.B. Cooper, Centralia, Einstein's brain style) plus one body/science what-if per day (the best format so far). **Stop:** business/Nvidia news, India topics, internet lore, cute history.
3. **Title formula (<50 chars, no emoji):** [specific person/thing] + [number] + [unexplained twist], e.g. "5 Planes Vanished, Then the Rescue Plane Did Too".
4. **Hook (first 2 sec):** the strangest fact plus a number, spoken AND on screen, no intro. **Length 25–30s** (hard cap 35s, ~70–80 words), one subscribe prompt just before the payoff, last-second payoff that loops back to the first line.
5. **Hashtags must match the topic** (2–3 + #shorts): only mysteries get #mystery #unsolved; science → #science #whatif; true story → #truestory #history.

Baseline kept: US target audience, English only (American English voice, titles, captions), one niche (curiosity / what-if / mystery), on-niche hashtags only, title <50 chars with curiosity gap, 20–30s so it loops, last-second payoff back to the start, one subscribe prompt, uploads one at a time at 6:00 / 7:30 / 9:00 PM ET.

## Topic ideas (ranked)
| # | Topic | Suggested title | First-line hook | Why now |
|---|---|---|---|---|
| 1 | Flight 19: 5 Navy bombers vanished off Florida on Dec 5, 1945, then a PBM Mariner rescue plane with 13 men also disappeared | 5 Planes Vanished, Then the Rescue Plane Did Too | "Five Navy bombers vanished in 1945, and the plane sent to find them vanished too." | 81st anniversary next Fri (Dec 5); origin of the Bermuda Triangle legend; US mystery (also a strong long-video pick) |
| 2 | Ann Hodges, Sylacauga AL, Nov 30, 1954: a meteorite crashed through her roof and hit her on the couch, the only confirmed person hit by one | A Meteorite Hit Her While She Napped | "In 1954, a rock from space smashed through her roof and hit her on the couch." | Anniversary Monday (Nov 30); strange true US story |
| 3 | Brian Shaffer vanished inside a Columbus, Ohio bar in 2006; cameras saw him go in and never come out | He Walked Into a Bar and Never Walked Out | "Cameras saw him walk into a bar, and no camera ever saw him leave." | Featured in the revived Unsolved Mysteries (Nov 2026 news); US mystery |
| 4 | Body what-if: what happens to your body if you stop sleeping (24h → 72h → 11 days, Randy Gardner 1964) | What 11 Days Without Sleep Does to You | "One teenager stayed awake for eleven days, and this is what happened to his brain." | Body what-if = best format; Randy Gardner is a US story |
| 5 | Mothman sightings in Point Pleasant, WV (1966–67), which ended with the Silver Bridge collapse on Dec 15, 1967 | People Saw a Winged Creature, Then a Bridge Fell | "For 13 months people reported a red-eyed winged creature, then the bridge fell." | Silver Bridge anniversary Dec 15; classic US legend (verify, present sightings as claims) |
| 6 | Body what-if: what happens if you swallowed gum (the "7 years" myth) | What Swallowed Gum Really Does Inside You | "Your mom said swallowed gum stays in you for seven years. Here's the truth." | Easy loop, kid-to-adult curiosity, US myth |

Backups: Two Civil War bullets that fused mid-air · What if you never cut your nails again? · Somerton Man (found Dec 1, 1948; Australia, so lower priority for US).
Re-verify every fact with a web search at build time. Topics already done (topics-done.txt) are excluded.

Sources: history.navy.mil/about-us/leadership/director/directors-corner/h-grams/h-gram-057/h-057-4.html · history.com/articles/the-mysterious-disappearance-of-flight-19 · encyclopediaofalabama.org/article/hodges-meteorite-strike-sylacauga-aerolite/ · astronomy.com (Nov. 30, 1954: first known human injury via a meteorite) · wosu.org/2026-11-16/true-crime-original-unsolved-mysteries-revived-with-new-host-puts-spotlight-on-columbus-case-joey-labute-brian-shaffer-jordan-murphy
