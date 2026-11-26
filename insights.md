# Insights — 2026-11-26 (Thu, Thanksgiving)

**NO FRESH ANALYTICS AGAIN (2nd day): vidIQ balance = 1 credit, every analytics/video/trend call costs 5. Credits reset on 22 Dec 2026 (17:02 UTC).** YouTube is blocked from this sandbox, so no public view counts either. Rules below are carried from 24 Nov (last real data) plus fixes from checking the repo's upload log. Until credits reset or are topped up, these runs can only check the repo + web.

## WIN / FLOP — shorts from the last 3 days
| Published (UTC) | Short | Type | Views | Verdict |
|---|---|---|---|---|
| 26 Nov 03:45 (10:45 PM ET, late) | Black Friday Was Named by Angry Cops (gL7PGV1eOUI) | US holiday history | no data | n/a — uploaded 1h45m after the 9 PM ET slot |
| 26 Nov 00:00 (7 PM ET) | A Crying Kid Started the Turkey Pardon (-wP4No1l0wc) | US holiday true story | no data | n/a |
| not uploaded yet (as of 04:09 UTC 26 Nov) | Why She Built Stairs Into the Ceiling (queue/2026-11-25/3) | US mystery | — | still in queue |
| 25 Nov 01:42 | Nvidia Gained Almost $1 Trillion in One Day (R-dVnvXFZhY) | pinned business | no data | n/a |
| 24 Nov (pinned set) | Jensen Huang 11 days / Denny's origin | pinned business | no data | n/a |
| 24 Nov 02:00 | A Doctor Stole Einstein's Brain for 43 Years | US strange true story | 761 in ~2h | WIN (last real data) |
| 24 Nov 00:30 | 115 Colonists Vanished and Left One Word | US mystery | 1,133 in ~3.5h | WIN |
| 23 Nov 23:00 | What Thanksgiving Dinner Really Does to You | US holiday body what-if | 2,537 in ~5h | WIN – best launch ever |

Last real snapshot (7d to 23 Nov): ~14.1K views, 23 subs = **1.6 subs/1,000 views**, **US share 22.6%**, traffic 95% Shorts feed. Channel median public views ≈ 1,230.

## Problems found in the repo today
1. **Upload timing slipped:** 25 Nov set went out at 00:00 UTC (7 PM ET) and 03:45 UTC (10:45 PM ET); short 3 (Winchester) has not uploaded yet. The 6:00 PM ET (23:00 UTC) slot was missed. The new "min 80 min gap" uploader change (2a74ed2) should stop bursts but check that all 3 slots fire tonight.
2. **Unrelated hashtags:** the turkey pardon and Black Friday descriptions used `#mystery #unsolved` — neither is a mystery. That breaks the baseline rule and confuses the feed about who to show it to.

## Rules for the next build (2026-11-26)
1. **Hashtags must match the topic** — 2–3 max, plus #shorts. History/holiday short → `#history #truestory #thanksgiving`; only mysteries get `#mystery #unsolved`.
2. **Timing:** 6:00 / 7:30 / 9:00 PM ET = 23:00 / 00:30 / 02:00 UTC. If Winchester (yesterday's short 3) is still in the queue, let it take tonight's 6 PM slot and drop today's weakest idea rather than stacking 4.
3. **Topics: tonight is Thanksgiving night, tomorrow Black Friday.** Lead with one timely US holiday short (parade/Black Friday angle), then two US mysteries / strange true stories. **Stop:** business news, India topics, non-US mysteries, internet lore, cute history.
4. **Title formula (<50 chars, no emoji):** [specific person/thing] + [number] + [unexplained twist]. **Hook (first 2 sec):** strangest fact + a number, spoken AND on screen, no intro.
5. **Length 25–30s (hard cap 35s, ~70–80 words)**, payoff in the last second loops to the first line, one subscribe prompt just before the payoff. Prefer US-rooted stories — they converted best for subs (D.B. Cooper, Centralia 3–4 subs each).

Baseline kept: US target audience, English only (American English voice, titles, captions), one niche (curiosity / what-if / mystery), no unrelated hashtags, title <50 chars with curiosity gap, 20–30s so it loops, last-second payoff back to the start, one clear subscribe prompt, uploads at 6:00 / 7:30 / 9:00 PM ET.

## Topic ideas (ranked)
| # | Topic | Suggested title | Why |
|---|---|---|---|
| 1 | Macy's parade balloons were let go into the sky after the parade (1928–1932), with a reward (~$100) for whoever found and returned them | Macy's Let Its Balloons Fly Away on Purpose | Parade is today; strange true US holiday story; verified (Untapped Cities, Mental Floss) |
| 2 | Body what-if for Black Friday: what a crowd/deal rush does to your brain (dopamine, stress) | What a Black Friday Crowd Does to Your Brain | Same format as best launch ever (Thanksgiving dinner body what-if); Black Friday is tomorrow |
| 3 | JFK "Babushka Lady" filmed the assassination; her film was never found | She Filmed JFK's Death and Then Vanished | Core US mystery, on Nov 2026 mystery lists |
| 4 | Dolly Oesterreich hid her lover in the attic (~1913–1922) | She Hid a Man in Her Attic for 10 Years | Earlier outlier: 6.9x, 62K views in 1 day at 24s |
| 5 | Kenny Veach vanished looking for the "M cave" in Nevada (Nov 10, 2014) | He Went Looking for a Cave and Vanished | US desert mystery, trending lists |
| 6 | Voynich manuscript (kept at Yale): ~600 years old, nobody can read it | No One Can Read This 600-Year-Old Book | Classic mystery, US location, easy loop |

Backups: Two Civil War bullets that collided mid-air · What if you never cut your nails again?
Re-verify every fact with a web search at build time.

Sources: untappedcities.com/2021/11/23/10-facts-macys-thanksgiving-day-parade-balloons/5/ · mentalfloss.com/holidays/thanksgiving/16-fun-facts-about-macys-thanksgiving-day-parade · history.com/articles/black-friday-thanksgiving-origins-history · buzzfeed.com/crystalro/terrifying-things-i-learned-november-2026
