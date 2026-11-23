# Insights — 2026-11-23 (Mon)

Data: vidIQ / YouTube Analytics, 7d = 16–23 Nov, 28d = 26 Oct–23 Nov. Analytics lags 2–3 days, so 21 + 22 Nov shorts use PUBLIC views/likes (no engaged views / retention yet).
Channel medians: engaged views (7d, all shorts with data) ≈ 445; public views of recent shorts ≈ 1,230.

## Snapshot (last 7 days)
- Views 12,628 · engaged 6,366 · subs gained 22 → **1.7 subs per 1,000 views**
- Traffic: Shorts feed 94.7%, YouTube search 4.1%, everything else ~1%
- **US share: 9.8% of views (1,240)** — India 60.5% (7,639), UK 2.9%, South Africa 2.7%, Canada 1.1%
- US viewers watch longer: avg view duration **41s US vs 28s India**
- Mystery / true-story shorts convert 3–4 subs each (~3.3/1k); old India what-ifs converted 0–3 (India-jump short: 1,561 views, 0 subs)

## WIN / FLOP — shorts from the last 3 days
| Published (UTC) | Short | Type | Len | Views | Engaged | Avg view % | Subs | Likes | Verdict |
|---|---|---|---|---|---|---|---|---|---|
| 22 Nov 13:30 | The TV Dinner Was Born From 260 Tons of Leftover Turkey | US holiday/food history | 60s | 1,416 (public) | n/a | n/a | n/a | 44 (3.1%) | **WIN** – best like rate on the channel |
| 22 Nov 13:30 | Agatha Christie Vanished for 11 Days and Never Explained Why | mystery / true story | 60s | 1,139 (public) | n/a | n/a | n/a | 29, 3 comments | FLOP (borderline, below median, still 1 day old) |
| 22 Nov 13:30 | The Time Traveler Who Came Back for a 1975 Computer | internet mystery | 61s | 13 (public) | n/a | n/a | n/a | 1 | **FLOP – dead on arrival** |
| 21 Nov 13:23 | The Curse of King Tut Skipped the Man Who Opened the Tomb | mystery / curse | 60s | 1,368 (public) | n/a | n/a | n/a | 33 (2.4%) | **WIN** |
| 21 Nov 13:23 | The Ghost Ship Found Sailing With No One On Board | unsolved mystery | 60s | 1,068 (public) | n/a | n/a | n/a | 26 | FLOP (below median) |
| 21 Nov 13:23 | The First Pilots in History Were a Sheep, a Duck and a Rooster | funny history | 59s | 8 (public) | n/a | n/a | n/a | 2 | **FLOP – dead on arrival** |
| 20 Nov 19:28 | The Man Who Jumped Out of a Plane With $200,000 (D.B. Cooper) | US true crime mystery | 61s | 1,224 | 614 | **70.5%** | **4** | 25 | **WIN** – best retention (42s avg) |
| 20 Nov 13:31 | This Town Has Been On Fire Since 1962 🔥 #shorts (Centralia) | US strange place | 56s | 1,139 | 522 | 47.9% | 4 | 22 | WIN (marginal: views ok, retention weak) |
| 20 Nov 13:34 | The US Navy Ship That Vanished With 306 People 🚢❓ | US mystery | 57s | 89 | 34 | 48.0% | 0 | 2 | **FLOP – dead on arrival** |

### Patterns
1. **Every day, one of the three shorts dies (8–102 views).** All three go public within ~11 seconds of each other at 13:30 UTC (= 7:00 PM IST = **8:30 AM US Eastern**). YouTube pushes 1–2 and buries the third. The only short published alone at a different time (D.B. Cooper, 19:28 UTC) got the best retention and subs. The 6:00 / 7:30 / 9:00 PM ET baseline is NOT being followed by the UPLOAD job (RUNBOOK still says 7:00 PM IST for all three).
2. **Topic:** US true crime/mystery (D.B. Cooper, Centralia) and US holiday/food history (TV dinner, Thanksgiving week) win. Obscure internet lore (John Titor) and cutesy history (balloon animals) flop.
3. **Length:** every new short is 55–61s → avg view % stuck at 48–70%. The 38–42s what-ifs held ~60%. 25–30s will push % up and make it loop.
4. **Title:** winners name a concrete thing + a specific number + a twist ("260 Tons of Leftover Turkey", "$200,000", "Skipped the Man"). Emoji / #shorts titles did not help.
5. **Audience:** 60% India comes from the old India/Hinglish uploads. US is only ~10% but watches 46% longer — US topics are the right bet; India-only topics (Amul, Maggi, India jump) must stop.

## Rules for the next build (2026-11-23)
1. **Stagger uploads — never publish all three together.** Target 6:00 PM / 7:30 PM / 9:00 PM US Eastern = 23:00 / 00:30 / 02:00 UTC = 4:30 / 6:00 / 7:30 AM IST. (Needs the UPLOAD task changed by Sanjay; until then, at minimum space uploads ≥90 min apart.)
2. **Length 25–30s, hard cap 35s.** ~70–80 spoken words. Last line pays off and loops back into the first line.
3. **Topics:** do more US true crime / unsolved US mysteries and US holiday/food history (Thanksgiving is Thu 26 Nov — ship one Thanksgiving short today and tomorrow). Stop: India-specific topics, Hinglish, obscure internet lore, cute/funny history.
4. **Title formula (<50 chars, no emoji, no #shorts):** [Specific person/thing] + [number] + [unexplained twist]. e.g. "117 Colonists Vanished and Left One Word".
5. **Hook (first 2 sec):** open on the strangest fact with a number, spoken + on-screen text, no intro ("In 1953, Swanson was stuck with 260 tons of turkey."). One subscribe prompt only, right before the payoff.

Baseline kept: US target audience, English only (American English voice, titles, captions), one niche (curiosity / what-if / mystery), no unrelated hashtags, title <50 chars with curiosity gap, payoff in the last second that leads back to the start, one clear subscribe prompt.

## Topic ideas (ranked) — from this week's over-performing English Shorts
| # | Topic | Suggested title | Why |
|---|---|---|---|
| 1 | What a Thanksgiving dinner does to your body (≈3,000 kcal, "turkey coma" myth) | What Thanksgiving Dinner Really Does to You | Thanksgiving = 26 Nov; "What Thanksgiving Dinner Does To Your Body" 8K views in 1 day on a 729-sub channel; body what-ifs trending |
| 2 | Lost Colony of Roanoke (1587, "CROATOAN") | 117 Colonists Vanished and Left One Word | 39x outlier (13K views, 5.6K-sub channel); core US mystery |
| 3 | Einstein's brain stolen by Dr. Thomas Harvey (1955) | A Doctor Stole Einstein's Brain for 20 Years | 23x outlier (30K views, 265-sub channel); US true story |
| 4 | Dolly Oesterreich hid her lover in the attic (1913–1922, LA) | She Hid a Man in Her Attic for 10 Years | 6.9x outlier, 62K views in 1 day at 24s length |
| 5 | Civil War bullets that fused mid-air ("Gettysburg/Petersburg"), H.L. Hunley as backup | Two Civil War Bullets Collided Mid-Air | 32K views in 2 days on a 563-sub US channel |
| 6 | What if you never cut your nails again? | What If You Never Cut Your Nails Again? | 80K views, 16% engagement, US channel, 34s |
