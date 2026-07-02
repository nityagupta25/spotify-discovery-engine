from youtube_comment_downloader import YoutubeCommentDownloader
import pandas as pd
downloader = YoutubeCommentDownloader()
url = "https://www.youtube.com/watch?v=QK8mJJJvaes"
comments = []
for comment in downloader.get_comments_from_url(url):
   comments.append({
       "Source": "YouTube",
       "Comment": comment["text"]
   })
   if len(comments) >= 100:
       break
df = pd.DataFrame(comments)
df.to_csv("youtube_comments.csv", index=False)
print("Done!")
print("Comments fetched:", len(df))