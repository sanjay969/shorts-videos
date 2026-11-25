#!/usr/bin/env python3
"""Free YouTube uploader (no Zapier). Runs in GitHub Actions every 15 min in the US evening.

Shorts: one Short per slot, never more than the slots already passed today.
  12:00 and 15:00 ET = backlog slots (leftover Shorts from the last few days' queues)
  18:00, 19:30, 21:00 ET = prime slots (today's US Eastern queue/YYYY-MM-DD/ first)
  Records each upload in queue/<date>/uploaded.json.
Before uploading, the channel's public RSS feed is checked: anything already on the channel with the same
title (e.g. uploaded by hand) is recorded as done and skipped, so nothing is uploaded twice.
Each Short's description gets a link to the newest long video (Shorts -> long-form funnel).
Long videos: any entry in long/uploaded.json with "video_id": null and a local file gets uploaded
(one per run, only after 20:15 ET), then the entry is filled in.

Needs repo secrets YT_CLIENT_ID, YT_CLIENT_SECRET, YT_REFRESH_TOKEN (YouTube Data API v3, scope youtube.upload).
Set DRY_RUN=1 to only print what would happen.
"""
import json, os, sys, datetime as dt
from zoneinfo import ZoneInfo

ET = ZoneInfo('America/New_York')
PRIME = [(18, 0), (19, 30), (21, 0)]
BACKLOG = [(12, 0), (15, 0)]
SLOTS = sorted(PRIME + BACKLOG)
BACKLOG_DAYS = 4
MAX_PER_DAY = 6                                  # YouTube API free quota ~10,000 units = 6 uploads (1,600 each)
CHANNEL = 'UCPkLJW0NDXJoMjMCJikWYaw'
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DRY = os.environ.get('DRY_RUN') == '1'
FORCE = os.environ.get('FORCE') == '1'          # manual run: ignore the slot clock (still one video)


def load(p, default):
    try:
        with open(p) as f: return json.load(f)
    except FileNotFoundError: return default


def save(p, data):
    with open(p, 'w') as f: json.dump(data, f, indent=2, ensure_ascii=False); f.write('\n')


def youtube():
    from google.oauth2.credentials import Credentials
    from googleapiclient.discovery import build
    c = Credentials(None, refresh_token=os.environ['YT_REFRESH_TOKEN'], token_uri='https://oauth2.googleapis.com/token',
                    client_id=os.environ['YT_CLIENT_ID'], client_secret=os.environ['YT_CLIENT_SECRET'],
                    scopes=['https://www.googleapis.com/auth/youtube.upload'])
    return build('youtube', 'v3', credentials=c, cache_discovery=False)


def upload(path, title, description, tags, category='24', thumb=None):
    if DRY: print(f'DRY_RUN: would upload {path} as "{title}"'); return 'DRYRUN'
    from googleapiclient.http import MediaFileUpload
    yt = youtube()
    body = {'snippet': {'title': title[:100], 'description': description, 'tags': tags, 'categoryId': category,
                        'defaultLanguage': 'en', 'defaultAudioLanguage': 'en'},
            'status': {'privacyStatus': 'public', 'selfDeclaredMadeForKids': False, 'embeddable': True, 'license': 'youtube'}}
    req = yt.videos().insert(part='snippet,status', body=body, notifySubscribers=True,
                             media_body=MediaFileUpload(path, mimetype='video/mp4', chunksize=8 * 1024 * 1024, resumable=True))
    res = None
    while res is None:
        st, res = req.next_chunk()
        if st: print(f'  {int(st.progress() * 100)}%')
    vid = res['id']; priv = res.get('status', {}).get('privacyStatus'); print('uploaded', vid, priv)
    if priv != 'public':
        # new API projects stay "private-locked" until YouTube's API audit passes: stop so no more videos get wasted
        open(os.path.join(ROOT, 'UPLOAD_LOCKED'), 'w').write(f'{vid} came back {priv}. Pass the YouTube API audit, then delete this file.\n')
        print('::error::upload came back', priv, '- stopping further uploads (see UPLOAD_LOCKED)')
    if thumb and os.path.exists(thumb):
        try:
            from googleapiclient.http import MediaFileUpload as M
            yt.thumbnails().set(videoId=vid, media_body=M(thumb)).execute(); print('thumbnail set')
        except Exception as e: print('thumbnail failed (needs a verified channel):', e)
    return vid


def norm(t): return ''.join(ch for ch in (t or '').lower() if ch.isalnum())


def channel_feed():
    """{normalized title: (video_id, published)} for the newest ~15 public videos; {} if the feed can't be read."""
    import urllib.request, re
    try:
        x = urllib.request.urlopen(f'https://www.youtube.com/feeds/videos.xml?channel_id={CHANNEL}', timeout=20).read().decode()
    except Exception as e: print('feed unavailable:', e); return {}
    out = {}
    for e in re.findall(r'<entry>(.*?)</entry>', x, re.S):
        import html
        t = html.unescape(re.search(r'<title>(.*?)</title>', e, re.S).group(1)); v = re.search(r'<yt:videoId>(.*?)<', e).group(1)
        out[norm(t)] = (v, re.search(r'<published>(.*?)<', e).group(1))
    print(f'channel feed: {len(out)} recent videos'); return out


def utcnow(): return dt.datetime.now(dt.timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ')


def queue_days(now):
    return [(now - dt.timedelta(days=k)).strftime('%Y-%m-%d') for k in range(BACKLOG_DAYS + 1)]   # today first


def reconcile(now, feed):
    """record queue/long items that are already on the channel (uploaded by hand) so they are skipped"""
    changed = False
    for day in queue_days(now):
        qd = os.path.join(ROOT, 'queue', day); meta = load(os.path.join(qd, 'meta.json'), None)
        if not meta: continue
        upath = os.path.join(qd, 'uploaded.json'); done = load(upath, []); have = {d.get('file') for d in done}
        for m in meta:
            hit = feed.get(norm(m['title']))
            if m['file'] not in have and hit:
                done.append({'file': m['file'], 'title': m['title'], 'video_id': hit[0], 'url': f'https://www.youtube.com/watch?v={hit[0]}',
                             'privacy': 'public', 'via': 'already-on-channel', 'uploaded_at': hit[1]})
                print('already on channel, skipping:', day, m['file']); changed = True
        if changed and not DRY: save(upath, done)
    lp = os.path.join(ROOT, 'long', 'uploaded.json'); arr = load(lp, []); lc = False
    for e in arr:
        hit = feed.get(norm(e.get('title')))
        if not e.get('video_id') and hit:
            e.update({'video_id': hit[0], 'url': f'https://www.youtube.com/watch?v={hit[0]}', 'privacy': 'public',
                      'via': 'already-on-channel', 'uploaded_at': hit[1]}); e.pop('status', None)
            print('long already on channel, skipping:', e.get('file')); lc = True
    if lc and not DRY: save(lp, arr)
    return changed or lc


def actions_uploads_today(now):
    """uploads this uploader made today (ET), across all queue folders + long"""
    n = 0; day = now.strftime('%Y-%m-%d')
    recs = []
    for d in queue_days(now): recs += load(os.path.join(ROOT, 'queue', d, 'uploaded.json'), [])
    recs += load(os.path.join(ROOT, 'long', 'uploaded.json'), [])
    for r in recs:
        if r.get('via') != 'github-actions' or not r.get('uploaded_at'): continue
        t = dt.datetime.strptime(r['uploaded_at'], '%Y-%m-%dT%H:%M:%SZ').replace(tzinfo=dt.timezone.utc).astimezone(ET)
        if t.strftime('%Y-%m-%d') == day: n += 1
    return n


def pending(day):
    qd = os.path.join(ROOT, 'queue', day); meta = load(os.path.join(qd, 'meta.json'), None) or []
    have = {d.get('file') for d in load(os.path.join(qd, 'uploaded.json'), [])}
    return [(day, m) for m in sorted(meta, key=lambda m: m['file']) if m['file'] not in have and os.path.exists(os.path.join(qd, m['file']))]


def latest_long_url():
    arr = [e for e in load(os.path.join(ROOT, 'long', 'uploaded.json'), []) if e.get('url')]
    return arr[-1]['url'] if arr else None


def short_description(m):
    d = m.get('description', '').rstrip()
    if '#shorts' not in d.lower(): d += ' #shorts'
    lu = latest_long_url()
    if lu: d += f'\n\n🎬 Full-length mystery: {lu}\n🔔 New true stories every day at 6, 7:30 & 9 PM ET.'
    return d


def do_short(now):
    def et_day(r): return dt.datetime.strptime(r['uploaded_at'], '%Y-%m-%dT%H:%M:%SZ').replace(tzinfo=dt.timezone.utc).astimezone(ET).strftime('%Y-%m-%d')
    shorts_today = sum(1 for d in queue_days(now) for r in load(os.path.join(ROOT, 'queue', d, 'uploaded.json'), [])
                       if r.get('via') == 'github-actions' and r.get('uploaded_at') and et_day(r) == now.strftime('%Y-%m-%d'))
    passed = [s for s in SLOTS if (now.hour, now.minute) >= s]
    allowed = len(SLOTS) if FORCE else len(passed)
    if shorts_today >= allowed: print(f'shorts: {shorts_today} uploaded today, {allowed} slots passed -> wait'); return False
    if actions_uploads_today(now) >= MAX_PER_DAY: print('daily quota cap reached'); return False
    today = now.strftime('%Y-%m-%d'); backlog = [x for d in reversed(queue_days(now)[1:]) for x in pending(d)]   # oldest first
    prime_time = bool(passed) and passed[-1] in PRIME
    cands = (pending(today) + backlog) if prime_time else (backlog + pending(today) if (now.hour, now.minute) >= (12, 0) else [])
    if not cands: print('shorts: nothing pending'); return False
    day, m = cands[0]; qd = os.path.join(ROOT, 'queue', day)
    print(f'slot {passed[-1] if passed else "force"}: uploading {day}/{m["file"]}')
    vid = upload(os.path.join(qd, m['file']), m['title'], short_description(m), m.get('tags', []))
    if DRY: return False
    upath = os.path.join(qd, 'uploaded.json'); done = load(upath, [])
    done.append({'file': m['file'], 'title': m['title'], 'video_id': vid, 'url': f'https://www.youtube.com/watch?v={vid}',
                 'privacy': 'public', 'made_for_kids': False, 'via': 'github-actions', 'uploaded_at': utcnow()})
    save(upath, done); return True


def do_long(now):
    if (now.hour, now.minute) < (20, 15) and not FORCE: return False      # long-form at 8:15 PM ET prime time
    lp = os.path.join(ROOT, 'long', 'uploaded.json'); arr = load(lp, [])
    for e in arr:
        if e.get('video_id'): continue
        f = os.path.join(ROOT, e['file'])
        if not os.path.exists(f): continue
        meta = load(os.path.join(os.path.dirname(f), 'meta.json'), {})
        title = e.get('title') or meta.get('title'); desc = meta.get('description', ''); tags = meta.get('tags', [])
        if actions_uploads_today(now) >= MAX_PER_DAY: print('daily quota cap reached'); return False
        vid = upload(f, title, desc, tags, thumb=os.path.join(os.path.dirname(f), 'thumbnail.jpg'))
        if DRY: return False
        e.update({'video_id': vid, 'url': f'https://www.youtube.com/watch?v={vid}', 'privacy': 'public', 'via': 'github-actions',
                  'uploaded_at': dt.datetime.now(dt.timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ')}); e.pop('status', None)
        save(lp, arr); return True
    return False


if __name__ == '__main__':
    mode = open(os.path.join(ROOT, 'UPLOAD_MODE')).read().strip() if os.path.exists(os.path.join(ROOT, 'UPLOAD_MODE')) else 'zapier'
    if mode != 'actions' and not DRY: print('UPLOAD_MODE is', mode, '- Zapier jobs handle uploads, skipping'); sys.exit(0)
    if os.path.exists(os.path.join(ROOT, 'UPLOAD_LOCKED')) and not DRY: print('::warning::UPLOAD_LOCKED exists - skipping'); sys.exit(0)
    now = dt.datetime.now(ET); print('now ET', now.strftime('%Y-%m-%d %H:%M'))
    reconcile(now, channel_feed())
    changed = do_short(now)
    if not changed: changed = do_long(now)       # at most one upload per run
    sys.exit(0)
