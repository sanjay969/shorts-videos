"""Apply safe channel edits from edits/pending.json: titles, descriptions, tags, playlists,
thumbnails, comment replies, holding spam comments, channel description/keywords/country, captions.
Never deletes videos, never changes privacy, never re-uploads.
Token: YT_ANALYTICS_REFRESH_TOKEN with scope youtube.force-ssl (+ yt-analytics.readonly)."""
import os, json, datetime as dt
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
E = os.environ
c = Credentials(None, refresh_token=E['YT_ANALYTICS_REFRESH_TOKEN'], token_uri='https://oauth2.googleapis.com/token',
                client_id=E.get('YT_ANALYTICS_CLIENT_ID') or E['YT_CLIENT_ID'],
                client_secret=E.get('YT_ANALYTICS_CLIENT_SECRET') or E['YT_CLIENT_SECRET'])
yt = build('youtube', 'v3', credentials=c, cache_discovery=False)
P = 'edits/pending.json'
ops = json.load(open(P)) if os.path.exists(P) else []
if not ops: print('no pending edits'); raise SystemExit
log = []
def playlist_id(title):
    req = yt.playlists().list(mine=True, part='snippet', maxResults=50)
    while req:
        r = req.execute()
        for p in r['items']:
            if p['snippet']['title'] == title: return p['id']
        req = yt.playlists().list_next(req, r)
    p = yt.playlists().insert(part='snippet,status', body={'snippet': {'title': title, 'defaultLanguage': 'en'}, 'status': {'privacyStatus': 'public'}}).execute()
    return p['id']
for o in ops:
    rec = {'at': dt.datetime.utcnow().isoformat() + 'Z', **o}
    try:
        if o['op'] in ('update_title', 'update_description', 'update_tags'):
            v = yt.videos().list(id=o['video_id'], part='snippet').execute()['items'][0]
            s = v['snippet']; rec['old'] = {'title': s['title'], 'description': s.get('description', ''), 'tags': s.get('tags', [])}
            if o['op'] == 'update_title': s['title'] = o['title'][:100]
            if o['op'] == 'update_description': s['description'] = o['description']
            if o['op'] == 'update_tags': s['tags'] = o['tags']
            body = {'id': o['video_id'], 'snippet': {k: s[k] for k in ('title', 'description', 'tags', 'categoryId', 'defaultLanguage', 'defaultAudioLanguage') if k in s}}
            yt.videos().update(part='snippet', body=body).execute()
        elif o['op'] == 'playlist_add':
            pid = playlist_id(o['playlist_title']); rec['playlist_id'] = pid
            have = set()
            req = yt.playlistItems().list(playlistId=pid, part='contentDetails', maxResults=50)
            while req:
                r = req.execute(); have |= {i['contentDetails']['videoId'] for i in r['items']}
                req = yt.playlistItems().list_next(req, r)
            for vid in o['video_ids']:
                if vid not in have:
                    yt.playlistItems().insert(part='snippet', body={'snippet': {'playlistId': pid, 'resourceId': {'kind': 'youtube#video', 'videoId': vid}}}).execute()
        elif o['op'] == 'set_thumbnail':  # image file in repo, <2MB jpg/png
            from googleapiclient.http import MediaFileUpload
            yt.thumbnails().set(videoId=o['video_id'], media_body=MediaFileUpload(o['file'])).execute()
        elif o['op'] == 'reply_comment':  # reply to a top-level comment thread
            yt.comments().insert(part='snippet', body={'snippet': {'parentId': o['comment_id'], 'textOriginal': o['text']}}).execute()
        elif o['op'] == 'comment':  # new top-level comment on a video (from the channel)
            yt.commentThreads().insert(part='snippet', body={'snippet': {'videoId': o['video_id'], 'topLevelComment': {'snippet': {'textOriginal': o['text']}}}}).execute()
        elif o['op'] == 'hold_comment':  # spam/abuse only: hold for review (not delete)
            yt.comments().setModerationStatus(id=o['comment_id'], moderationStatus='heldForReview').execute()
        elif o['op'] == 'channel_update':  # description, keywords, country, defaultLanguage
            ch = yt.channels().list(mine=True, part='brandingSettings').execute()['items'][0]
            b = ch['brandingSettings']; rec['old'] = b.get('channel', {})
            for k in ('description', 'keywords', 'country', 'defaultLanguage', 'unsubscribedTrailer'):
                if k in o: b.setdefault('channel', {})[k] = o[k]
            yt.channels().update(part='brandingSettings', body={'id': ch['id'], 'brandingSettings': {'channel': b['channel']}}).execute()
        elif o['op'] == 'upload_caption':  # .srt/.vtt in repo, English
            from googleapiclient.http import MediaFileUpload
            yt.captions().insert(part='snippet', body={'snippet': {'videoId': o['video_id'], 'language': o.get('language', 'en'), 'name': o.get('name', 'English')}}, media_body=MediaFileUpload(o['file'])).execute()
        else:
            raise ValueError('unknown op')
        rec['result'] = 'ok'
    except Exception as e:
        rec['result'] = f'error: {e}'
    log.append(rec); print(rec['op'], o.get('video_id', o.get('playlist_title')), rec['result'])
with open('edits/log.jsonl', 'a') as f:
    for r in log: f.write(json.dumps(r) + '\n')
json.dump([], open(P, 'w'))
