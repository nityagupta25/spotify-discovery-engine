from app_store_scraper import AppStore
import pandas as pd
# Create Spotify app object
spotify = AppStore(
   country='us',
   app_name='spotify-music-and-podcasts',
   app_id='324684580'
)
# Fetch reviews
spotify.review(how_many=1000)
# Convert to DataFrame
#df = pd.DataFrame(spotify.reviews)
df = pd.DataFrame(spotify.reviews)
print(df.columns)
print(df.head())
# Keep only useful columns
#df = df[['review', 'rating']]
# Save to CSV
df.to_csv('spotify_appstore_reviews.csv', index=False)
print("Done!")
print("Total reviews:", len(df))