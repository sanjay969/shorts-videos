#!/usr/bin/env python3
"""Free YouTube uploader (no Zapier). Runs in GitHub Actions every 15 min in the US evening.

Shorts: today's US Eastern queue/YYYY-MM-DD/. Slots at 18:00, 19:30, 21:00 ET; one Short per slot,
never more Shorts than slots already passed. Records each upload in queue/<date>/uploaded.json.
Long videos: any entry in long/uploaded.json with "video_id": null and a local file gets uploaded
(one per run, only after 17:30 ET), then the entry is filled in.

Needs repo secrets YT_CLIENT_ID, YT_CLIENT_SECRET, YT_REFRESH_TOKEN (YouTube Data API v3, scope youtube.upload).
Set DRY_RUN=1 to only print what would happen.
"""
import json, os, sys, datetime as dt
from zoneinfo import ZoneInfo

ET = ZoneInfo('America/New_York')
SLOTS = [(18, 0), (19, 30), (21, 0)]
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


def do_short(now):
    day = now.strftime('%Y-%m-%d'); qd = os.path.join(ROOT, 'queue', day)
    meta = load(os.path.join(qd, 'meta.json'), None)
    if not meta: print('no queue for', day); return False
    upath = os.path.join(qd, 'uploaded.json'); done = load(upath, [])
    done_files = {d.get('file') for d in done}
    allowed = sum(1 for h, m in SLOTS if (now.hour, now.minute) >= (h, m))
    if FORCE: allowed = len(SLOTS)
    if len(done) >= allowed: print(f'shorts: {len(done)} uploaded, {allowed} slots passed -> nothing to do'); return False
    todo = [m for m in sorted(meta, key=lambda m: m['file']) if m['file'] not in done_files and os.path.exists(os.path.join(qd, m['file']))]
    if not todo: print('shorts: all uploaded'); return False
    m = todo[0]
    vid = upload(os.path.join(qd, m['file']), m['title'], m['description'], m.get('tags', []))
    if DRY: return False
    done.append({'file': m['file'], 'title': m['title'], 'video_id': vid, 'url': f'https://www.youtube.com/watch?v={vid}',
                 'privacy': 'public', 'made_for_kids': False, 'via': 'github-actions',
                 'uploaded_at': dt.datetime.now(dt.timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ')})
    save(upath, done); return True


def do_long(now):
    if (now.hour, now.minute) < (17, 30) and not FORCE: return False
    lp = os.path.join(ROOT, 'long', 'uploaded.json'); arr = load(lp, [])
    for e in arr:
        if e.get('video_id'): continue
        f = os.path.join(ROOT, e['file'])
        if not os.path.exists(f): continue
        meta = load(os.path.join(os.path.dirname(f), 'meta.json'), {})
        title = e.get('title') or meta.get('title'); desc = meta.get('description', ''); tags = meta.get('tags', [])
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
    changed = do_short(now)
    if not changed: changed = do_long(now)       # at most one upload per run
    sys.exit(0)
