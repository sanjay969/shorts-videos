"""Free daily channel stats (YouTube Data API v3 + YouTube Analytics API v2).
Secrets: YT_ANALYTICS_REFRESH_TOKEN (scopes yt-analytics.readonly + youtube.readonly),
YT_ANALYTICS_CLIENT_ID / YT_ANALYTICS_CLIENT_SECRET (fall back to YT_CLIENT_ID / YT_CLIENT_SECRET)."""
import os, json, csv, datetime as dt
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
E = os.environ
cid = E.get('YT_ANALYTICS_CLIENT_ID') or E['YT_CLIENT_ID']
sec = E.get('YT_ANALYTICS_CLIENT_SECRET') or E['YT_CLIENT_SECRET']
c = Credentials(None, refresh_token=E['YT_ANALYTICS_REFRESH_TOKEN'], token_uri='https://oauth2.googleapis.com/token', client_id=cid, client_secret=sec)
yt = build('youtube', 'v3', credentials=c, cache_discovery=False)
ya = build('youtubeAnalytics', 'v2', credentials=c, cache_discovery=False)
today = dt.date.today(); out = {'generated_utc': dt.datetime.utcnow().isoformat() + 'Z', 'errors': []}
ch = yt.channels().list(mine=True, part='statistics,contentDetails').execute()['items'][0]
out['channel'] = ch['statistics']
up = ch['contentDetails']['relatedPlaylists']['uploads']
ids = [i['contentDetails']['videoId'] for i in yt.playlistItems().list(playlistId=up, part='contentDetails', maxResults=50).execute()['items']]
vids = []
for v in yt.videos().list(id=','.join(ids), part='snippet,statistics,contentDetails').execute()['items']:
    s = v['statistics']; vids.append({'id': v['id'], 'title': v['snippet']['title'], 'published': v['snippet']['publishedAt'], 'duration': v['contentDetails']['duration'], 'views': int(s.get('viewCount', 0)), 'likes': int(s.get('likeCount', 0)), 'comments': int(s.get('commentCount', 0))})
out['videos_public'] = vids
def q(name, days, metrics, dims=None, **kw):
    try:
        r = ya.reports().query(ids='channel==MINE', startDate=str(today - dt.timedelta(days=days)), endDate=str(today), metrics=metrics, dimensions=dims, **kw).execute()
        out[name] = {'cols': [h['name'] for h in r.get('columnHeaders', [])], 'rows': r.get('rows', [])}
    except Exception as e:
        out['errors'].append(f'{name}: {e}')
M = 'views,engagedViews,estimatedMinutesWatched,averageViewDuration,averageViewPercentage,subscribersGained,likes,shares,comments'
for d in (7, 28):
    q(f'by_video_{d}d', d, M, 'video', sort='-views', maxResults=50)
    if f'by_video_{d}d' not in out:
        q(f'by_video_{d}d', d, M.replace('engagedViews,', ''), 'video', sort='-views', maxResults=50)
q('daily_28d', 28, 'views,subscribersGained,subscribersLost', 'day', sort='day')
q('traffic_7d', 7, 'views', 'insightTrafficSourceType', sort='-views')
q('geography_7d', 7, 'views', 'country', sort='-views', maxResults=10)
q('retention_by_age_gender_7d', 7, 'viewerPercentage', 'ageGroup,gender')
os.makedirs('analytics', exist_ok=True)
for p in (f'analytics/{today}.json', 'analytics/latest.json'):
    json.dump(out, open(p, 'w'), indent=1)
new = not os.path.exists('analytics/views-history.csv')
with open('analytics/views-history.csv', 'a', newline='') as f:
    w = csv.writer(f)
    if new: w.writerow(['snapshot_utc', 'video_id', 'title', 'published', 'views', 'likes', 'comments'])
    for v in vids: w.writerow([out['generated_utc'], v['id'], v['title'], v['published'], v['views'], v['likes'], v['comments']])
print('ok', len(vids), 'videos; errors:', out['errors'])
