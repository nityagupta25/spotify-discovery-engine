import pandas as pd
# Play Store reviews
playstore = pd.read_csv("spotify_reviews_filtered.csv")
# YouTube comments
youtube = pd.read_csv("youtube_comments.csv")
# Spotify Community
community = pd.read_excel("SpotifyCommunity.xlsx")
# Add source columns
playstore["Source"] = "Play Store"
youtube["Source"] = "YouTube"
community["Source"] = "Community"
# Combine
all_reviews = pd.concat(
   [playstore, youtube, community],
   ignore_index=True
)
# Save
all_reviews.to_csv("all_reviews.csv", index=False)
print("Merged rows:", len(all_reviews))