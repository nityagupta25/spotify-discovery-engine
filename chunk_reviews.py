import pandas as pd
df = pd.read_csv("all_reviews.csv")
chunk_size = 1000
for i in range(0, len(df), chunk_size):
   chunk = df.iloc[i:i+chunk_size]
   chunk.to_csv(f"chunk_{i//chunk_size + 1}.csv", index=False)
print("Done!")