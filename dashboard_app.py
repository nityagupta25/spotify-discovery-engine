import streamlit as st
import json
# Page settings
st.set_page_config(
   page_title="Spotify Voice of Customer Dashboard",
   page_icon="🎵",
   layout="wide"
)
# Load JSON file
with open("dashboard_data.json", "r", encoding="utf-8") as f:
   data = json.load(f)
# Title
st.title("🎵 Spotify Voice of Customer Dashboard")
st.markdown("---")
# Executive Summary
st.header("📋 Executive Summary")
st.info(data["executive_summary"])
st.markdown("---")
# Two columns
col1, col2 = st.columns(2)
# Left column
with col1:
   st.header("🔍 Key Findings")
   for item in data["key_findings"]:
       st.subheader(item["title"])
       st.write(item["description"])
   st.header("💬 Representative Quotes")
   for item in data["representative_quotes"]:
    st.info(item["quote"])

# Right column
with col2:
   st.header("⚠️ Discovery Problems")
   for item in data["discovery_problems"]:
       st.subheader(item["title"])
       st.write(item["description"])
   st.header("❗ Unmet Needs")
   for item in data["unmet_needs"]:
       st.subheader(item["title"])
       st.write(item["description"])
st.markdown("---")
# Tabs
tab1, tab2 = st.tabs(
   ["👥 User Segments", "🎧 Listening Behaviors"]
)
with tab1:
   st.header("👥 User Segments")
   for item in data["user_segments"]:
       st.subheader(item["title"])
       st.write(item["description"])
with tab2:
   st.header("🎧 Listening Behaviors")
   for item in data["listening_behaviors"]:
       st.subheader(item["title"])
       st.write(item["description"])