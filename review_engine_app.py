import streamlit as st
import pandas as pd
import json
import plotly.express as px
# --------------------------------------------------
# PAGE CONFIG
# --------------------------------------------------
st.set_page_config(
   page_title="Spotify Review Intelligence Engine",
   page_icon="🎵",
   layout="wide"
)
# --------------------------------------------------
# LOAD DATA
# --------------------------------------------------
sentiment_df = pd.read_csv("all_reviews_with_sentiment.csv")
with open("dashboard_data.json", "r", encoding="utf-8") as f:
   dashboard_data = json.load(f)
# --------------------------------------------------
# SENTIMENT COUNTS
# --------------------------------------------------
total_reviews = len(sentiment_df)
positive_count = len(
   sentiment_df[sentiment_df["Sentiment"] == "Positive"]
)
negative_count = len(
   sentiment_df[sentiment_df["Sentiment"] == "Negative"]
)
neutral_count = len(
   sentiment_df[sentiment_df["Sentiment"] == "Neutral"]
)
positive_pct = round(positive_count / total_reviews * 100)
negative_pct = round(negative_count / total_reviews * 100)
neutral_pct = round(neutral_count / total_reviews * 100)
# --------------------------------------------------
# TITLE
# --------------------------------------------------
st.title("🎵 Spotify Review Intelligence Engine")
st.write(
   "Analyze user feedback from Play Store Reviews, YouTube Comments and Spotify Community discussions."
)

# --------------------------------------------------
# TABS
# --------------------------------------------------
tab1, tab2, tab3, tab4, tab5 = st.tabs([
   "📄 Executive Summary",
   "🎯 Discovery Problems",
   "👥 User Segments",
   "⭐ Unmet Needs",
   "🎧 Listening Behaviors"

])
# ==================================================
# TAB 1
# ==================================================
with tab1:
   st.subheader("Overview")
   col1, col2, col3, col4, col5, col6 = st.columns(6)
   col1.metric("Reviews", total_reviews)
   col2.metric("Sources", 3)
   col3.metric("Chunks", 8)
   col4.metric("Positive", f"{positive_pct}%")
   col5.metric("Negative", f"{negative_pct}%")
   col6.metric("Neutral", f"{neutral_pct}%")
   st.markdown("---")
   # Sentiment chart
   pie_df = pd.DataFrame({
       "Sentiment": ["Positive", "Negative", "Neutral"],
       "Count": [positive_count, negative_count, neutral_count]
   })
   fig = px.pie(
       pie_df,
       names="Sentiment",
       values="Count",
       hole=0.5,
       title="Sentiment Distribution"
   )
   st.plotly_chart(fig, use_container_width=True)
   st.markdown("---")
   st.subheader("📌 Executive Summary")
   st.success(
   dashboard_data["executive_summary"]
)
   
   st.markdown("---")
   st.subheader("🔍 Key Findings")
   for item in dashboard_data["key_findings"]:
    st.info(
       f"{item['title']}\n\n{item['description']}"
   )
   st.markdown("---")
   st.subheader("💬 Representative User Quotes")
   for quote in dashboard_data["representative_quotes"]:
    st.info(
       quote["quote"]
   )
# ==================================================
# TAB 2
# ==================================================
with tab2:
    st.subheader("🎯 Discovery Problems")
    for item in dashboard_data["discovery_problems"]:
     st.error(
       f"{item['title']}\n\n{item['description']}"
   )
# ==================================================
# TAB 3
# ==================================================
with tab3:
   st.header("👥 User Segments")
   for segment in dashboard_data["user_segments"]:
       st.success(
           f"{segment['title']}\n\n{segment['description']}"
       )
   
# ==================================================
# TAB 4
# ==================================================
with tab4:
   st.header("⭐ Unmet Needs")
   for need in dashboard_data["unmet_needs"]:
    st.info(
           f"{need['title']}\n\n{need['description']}"
       )
# ==================================================
# TAB 5
# ==================================================
with tab5:
   st.header("🎧 Listening Behaviors")
   for behavior in dashboard_data["listening_behaviors"]:
       st.success(
           f"{behavior['title']}\n\n{behavior['description']}"
       )
