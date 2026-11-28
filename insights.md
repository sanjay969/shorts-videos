# Insights — 2026-11-28 (Sat), 2:07 PM IST run + 3:38 PM REAL DATA update

**Data source: API ✅** — `YT_ANALYTICS_REFRESH_TOKEN` added by Sanjay; stats workflow ran 10:06 UTC. Public views are live; Analytics API (avg view %, subs, geo) lags to ~24 Nov, so the newest Shorts have public views only.

## Channel snapshot
- 46 subs, 41,140 total views. Geography, careful with windows: Analytics data only reaches 24 Nov, so the API 'last 7d' = really **21–24 Nov: US 72.6%** (10,338 of ~14.2K), IN 7.8%. Studio **last 28 days: US 38.9%, India 28.0%** (Sanjay's screenshot) because mid-Nov had heavy India views. The trend is right (US rising since the US-only switch), but the channel overall is still ~39% US. Target: US >60% over 28 days.
- Traffic 7d: Shorts feed 95% (13,577), YT search 460, channel page 60, subscriber feed 11.
- Subs 7d ≈ 15 on ~14.2K views ≈ **1.1 subs / 1,000 views** (low; fix the subscribe prompt).
- Viewers 7d: 25–34 M 18%, 13–17 M 17%, 35–44 22% (M+F), 18–24 M 10%.
- Channel median ≈ 1,230 public views per Short.

## ⚠️ TIMING PROBLEM — confirmed by data
The 5-Short burst at 4:33–4:37 AM ET on 27 Nov flopped as a group: **Nvidia CEO quit 5 views (dead), JFK Babushka Lady 266, Voynich 713**, Denny's 987, Winchester 1,094. Only 2 of the 5 got near median, and the burst used the day's quota, so nothing went out Black Friday night. Rule: never flush a backlog; 1 Short per slot at 6:00 / 7:30 / 9:00 PM ET only.

## WIN / FLOP — Shorts from the last 3 days (public views as of 10:06 UTC 28 Nov)
| Published (ET) | Short | Views | Avg view % | Verdict |
|---|---|---|---|---|
| 25 Nov 10:46 PM (late) | Black Friday Was Named by Angry Cops (30s) | 1,210 | **95.8%** | WIN (loops) |
| 25 Nov 7:00 PM | A Crying Kid Started the Turkey Pardon (25s) | 918 | 69.6% (early) | FLOP (below median) |
| 26 Nov 6:17 PM | Macy's Let Its Giant Balloons Fly Away (27s) | 1,043 | n/a yet | borderline FLOP |
| 27 Nov 4:35 AM (burst) | Why She Built Stairs Into the Ceiling (31s) | 1,094 | n/a | borderline (best of burst) |
| 27 Nov 4:35 AM (burst) | He Washed Dishes at Denny's. Now He Runs Nvidia | 987 | n/a | FLOP (off-niche) |
| 27 Nov 4:37 AM (burst) | No One Can Read This 600-Year-Old Book | 713 | n/a | FLOP (timing) |
| 27 Nov 4:36 AM (burst) | The JFK Witness No One Ever Found | 266 | n/a | FLOP (timing) |
| 27 Nov 4:33 AM (burst) | Nvidia's CEO Quit, Then Came Back in 11 Days | **5** | n/a | FLOP — dead (off-niche + burst) |

Top 7d by Analytics: What Thanksgiving Dinner Really Does to You 3,024 (66.9%, 3 subs) · TV Dinner (1 min) 1,480 (71.3%) · Einstein's brain 1,455 (61.1%, 3 subs) · Roanoke 115 colonists 1,360 (51.6%, 3 subs).

## Long videos — diagnosis (28 Nov)
D.B. Cooper long: 2 views in 8h, **CTR 11.1%, avg view duration 4:44 of 9:44 (~49%)**. Packaging and retention are GOOD; YouTube is simply giving it ~20 impressions. Same for King Tut long (3 views) and Roanoke long (5). Root causes:
1. **No long-form audience.** 99.9% of viewers are new, 0.3% subscribed; Shorts viewers are not shown long videos. A channel with zero long-form watch history gets almost no Browse/Suggested tests.
2. **No bridge from Shorts.** Each long has a matching Short with ~1.3K views (The Man Who Jumped 2oSlRLq-mcI, King Tut 3pqEJ8mLsiA, Roanoke c5kuP38fqKU), but the longs got ~0 Shorts traffic → the Shorts are not linked. Related video can only be set in Studio (no API), so Sanjay must do it by hand.
3. **Story titles, not search titles.** New long channels grow from Search first. "He Jumped From a Jet With $200,000 and Vanished" doesn't match what people type ("what happened to DB Cooper"). And the topics (D.B. Cooper, King Tut, Roanoke) have huge competition from big channels/Netflix.
4. **Channel identity is mixed.** The channel still has old Hindi personal long videos public: "Inside My Office | Complete Workplace Tour in Bhopal 2025" (MortE31P1yc), "Garba Jane Nikle The… Bhopal Vlog" (dvjw3Sotilc), "AMUL ki Kahani…" (Njl5w5xBTBA). For YouTube's long-form system the channel's long videos = Hindi vlogs + English US mysteries, so it can't tell who to show the longs to. Recommend Sanjay sets these 3 to **Unlisted** (not delete) in Studio.
Traffic check (28d, API): the 3 mystery longs got 0 views from Shorts / Suggested; only 2 from search, 2 from subscribers, 2 from channel page. Geography 28d: US 12,050 vs IN 9,577 (~37% US), matching Studio.
Rules for long videos:
- In Studio, set **Related video** on every matching Short → its long (now: 2oSlRLq-mcI → aKttDFRpuCg, 3pqEJ8mLsiA → iHvBQoR0ue0, c5kuP38fqKU → SecdUa-ai6Y), and on every future topic Short.
- Every long gets a **new trailer Short** posted the next day in a 6–9 PM ET slot: "Full story on the channel", Related video = the long.
- Long titles = searchable question + hook, e.g. "What Really Happened to D.B. Cooper?"; put the search phrase in the first 5 words.
- Pick long topics with search demand but fewer big-channel videos (lesser-known US mysteries), not the most famous cases.
- Keep making long videos (4/week); each one gets a search-first title + its own trailer Short (bridge). Success check = impressions + views from Shorts/Search, not a fixed view count.

## Rules for the next build (2026-11-28)
1. **Timing:** tonight's 3 slots (6:00 / 7:30 / 9:00 PM ET = 23:00 / 00:30 / 02:00 UTC) belong to the 27 Nov queue (price pain → vibrating cave → attic man). Today's new Shorts will go out Sunday night. No manual upload runs before 5 PM ET.
2. **Topics:** Black Friday/Thanksgiving is over, so drop holiday angles. Do more US mysteries and strange true US stories (D.B. Cooper, Centralia, Einstein's brain style) plus one body/science what-if per day (the best format so far). **Stop:** business/Nvidia news, India topics, internet lore, cute history.
3. **Title formula (<50 chars, no emoji):** [specific person/thing] + [number] + [unexplained twist], e.g. "5 Planes Vanished, Then the Rescue Plane Did Too".
4. **Hook (first 2 sec):** the strangest fact plus a number, spoken AND on screen, no intro. **Length 25–30s** (hard cap 35s, ~70–80 words), one subscribe prompt just before the payoff, last-second payoff that loops back to the first line.
5. **Hashtags must match the topic** (2–3 + #shorts): only mysteries get #mystery #unsolved; science → #science #whatif; true story → #truestory #history.

- **Data rule (new):** body/food what-if and US true-history with a clear loop win (Thanksgiving 3,024; Black Friday 95.8% avg view). Off-niche business/Nvidia = dead (5 views). Keep 25–30s; the 1-min Shorts also hold ~65–71%, so length isn't the problem.
- **Subscribe prompt:** only 1.1 subs/1K views. Put one short spoken line right before the payoff: "Follow for one strange true story every night."

- **Returning viewers = 0 (Studio, 28 Nov): 99.9% new, 0.1% casual, 0% regular.** People watch one Short and leave. The only video Studio rates "Moderate" for bringing viewers back is the body what-if ("What If You Eat On…"); all others are "Low". So: make **one body what-if every day as a named series** — same title start ("What Happens If You…"), same look, same closing line "Part 2 tomorrow / follow for the next one". Give the mystery Shorts the same treatment: same spoken sign-off every time, so viewers recognize the channel.

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
