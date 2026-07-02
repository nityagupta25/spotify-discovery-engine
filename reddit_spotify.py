import requests
import pandas as pd
headers = {
   "User-Agent": "Mozilla/5.0"
}
url = "https://www.reddit.com/r/spotify/hot.json?limit=100"
response = requests.get(url, headers=headers)
print("Status code:", response.status_code)
posts = []
if response.status_code == 200:
   data = response.json()
   for post in data["data"]["children"]:
       p = post["data"]
       posts.append({
           "Source": "Reddit",
           "Title": p.get("title", ""),
           "User Comment": p.get("selftext", ""),
           "Subreddit": p.get("subreddit", "")
       })
df = pd.DataFrame(posts)
df.to_csv("reddit_spotify_posts.csv", index=False)
print("Posts fetched:", len(df))