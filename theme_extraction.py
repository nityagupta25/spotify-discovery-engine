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
 
import pandas as pd

df = pd.read_csv("all_reviews_with_sentiment.csv")

# Find text column automatically

text_col = None

for col in df.columns:

    if "review" in col.lower() or "comment" in col.lower() or "text" in col.lower():

        text_col = col

        break

themes = {

    "Repetitive recommendations":

        ["same songs","same artist","repeat","repetitive"],

    "Discover Weekly stale":

        ["discover weekly","weekly playlist"],

    "Hard to find new music":

        ["new music","discover music","find songs"],

    "Too much mainstream music":

        ["popular songs","mainstream"],

    "Need mood recommendations":

        ["mood","vibe"],

    "Playlist fatigue":

        ["playlist"]

}

results=[]

for theme,keywords in themes.items():

    count=0

    for review in df[text_col].astype(str):

        review=review.lower()

        if any(keyword in review for keyword in keywords):

            count+=1

    results.append({

        "Theme":theme,

        "Occurrences":count

    })

result_df=pd.DataFrame(results)

print(result_df)

result_df.to_csv("theme_results.csv",index=False)

print("Done")
 