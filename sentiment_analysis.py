import pandas as pd
from textblob import TextBlob
# Load reviews
df = pd.read_csv("all_reviews.csv")
# Find text column automatically
text_col = None
for col in df.columns:
   if "review" in col.lower() or "comment" in col.lower() or "text" in col.lower():
       text_col = col
       break
print("Using column:", text_col)
# Sentiment function
def get_sentiment(text):
   try:
       score = TextBlob(str(text)).sentiment.polarity
       if score > 0:
           return "Positive"
       elif score < 0:
           return "Negative"
       else:
           return "Neutral"
   except:
       return "Neutral"
# Apply sentiment
df["Sentiment"] = df[text_col].apply(get_sentiment)
# Save
df.to_csv("all_reviews_with_sentiment.csv", index=False)
print(df["Sentiment"].value_counts())
print("Done!")