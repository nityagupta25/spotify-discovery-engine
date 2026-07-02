from google_play_scraper import reviews
import pandas as pd
result, _ = reviews(
   'com.spotify.music',
   lang='en',
   country='us',
   count=3000
)
review_data = []
for review in result:
   if len(review['content']) > 40:
       review_data.append({
           "Review": review['content'],
           "Rating": review['score']
       })
df = pd.DataFrame(review_data)
df.to_csv("spotify_reviews_filtered.csv", index=False)
print("Done!")
print("Total reviews:", len(df))