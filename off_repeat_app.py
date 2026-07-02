"""
off_repeat_app.py — the LIVE, dynamic "Off Repeat" MVP (Streamlit).

Pick your taste → the app retrieves novel tracks, writes each story LIVE with
the LLM, assigns a trust cue by rule, and renders the polished Spotify UI.
Nothing is a fixed feed.

Run locally:   streamlit run off_repeat_app.py     (reads GROQ_API_KEY from .env)
On the cloud:  the key comes from Settings → Secrets (st.secrets).
"""
import os
import streamlit as st
import streamlit.components.v1 as components
import off_repeat_core as core

st.set_page_config(page_title="Off Repeat — live", page_icon="✦", layout="wide")

# Key: local .env first, then Streamlit Cloud secrets.
core.load_env()
try:
    if not os.environ.get("GROQ_API_KEY") and "GROQ_API_KEY" in st.secrets:
        os.environ["GROQ_API_KEY"] = st.secrets["GROQ_API_KEY"]
except Exception:
    pass

st.markdown("## ✦ Off Repeat — generated live, for *you*")
st.caption("Pick your taste → the songs, the stories, and who-it's-for are all "
           "generated fresh. Stories are written live by the LLM and grounded in "
           "real tracks. Nothing here is hardcoded.")

with st.sidebar:
    st.header("Your taste")
    genres_sel = st.multiselect("Genres you love", core.GENRES,
                                default=["Psych-pop", "Indie", "Lo-fi"])
    friends_raw = st.text_input(
        "Your friends (optional)", "",
        help="Comma-separated names. Used for the 'Liked by ___' cue. "
             "Leave blank and it will never invent a name.")
    n = st.slider("How many picks", 5, 18, 10)
    go = st.button("✦ Generate my Off Repeat", type="primary",
                   use_container_width=True)
    st.divider()
    if core.have_key():
        st.success("Live AI stories: ON")
    else:
        st.warning("No GROQ_API_KEY found — using fallback stories.\n\n"
                   "Add it in **Settings → Secrets** (cloud) or a local `.env`.")

friends = [f.strip() for f in friends_raw.split(",") if f.strip()]

if go or "or_data" not in st.session_state:
    with st.spinner("Retrieving new music and writing your stories…"):
        st.session_state.or_data = core.build_data(
            genres_sel or core.GENRES, friends, n)

data = st.session_state.or_data
try:
    html = core.inject_data("spotify_mvp.html", data)
    components.html(html, height=880, scrolling=False)
except Exception as e:
    st.error(f"Could not render the UI: {e}")

with st.expander("What just happened? (the AI, per pick)"):
    st.write(f"**Taste:** {data['taste']}  ·  **{len(data['songs'])} picks** "
             f"retrieved from a {len(core.CATALOG)}-track catalog, filtered to "
             "what you don't already play.")
    for s in data["songs"]:
        st.markdown(f"- **{s['artist']} — {s['track']}** _( {s['trust']['label']} )_  \n"
                    f"  ↳ {s['story']}")
