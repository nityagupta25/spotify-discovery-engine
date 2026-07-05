"""
off_repeat_app.py — SELF-CONTAINED live "Off Repeat" MVP (one file).

Everything is in this single file — the Spotify UI (embedded HTML), the
candidate catalog, the live LLM story generation, and the Streamlit UI — so it
deploys anywhere (Streamlit Cloud, any laptop) with no sibling files needed.

Pick your taste -> it retrieves novel tracks, writes each "why you'll love it"
story LIVE with the LLM (grounded in the real track), assigns a trust cue by
rule (a named friend only if you supply friends), and renders the Spotify UI.

Run locally:   streamlit run off_repeat_app.py     (reads GROQ_API_KEY from .env)
On the cloud:  key comes from Settings -> Secrets (st.secrets).
"""
import os
import re
import json
import random

import streamlit as st
import streamlit.components.v1 as components

GENRES = ["Psych-pop", "Indie", "Lo-fi", "Electronic", "Hip-hop", "Jazz"]

# Real, genuinely lesser-known tracks — the catalog retrieval draws from.
# (genre, artist, track, origin)
CATALOG = [
    ("Psych-pop", "Crumb", "Locket", "Brooklyn"),
    ("Psych-pop", "Mild High Club", "Homage", "Los Angeles"),
    ("Psych-pop", "The Babe Rainbow", "The Wave of Love", "Australia"),
    ("Psych-pop", "Pond", "Paint Me Silver", "Perth"),
    ("Psych-pop", "Temples", "Shelter Song", "Kettering"),
    ("Psych-pop", "Melody's Echo Chamber", "Some Time Alone, Alone", "France"),
    ("Psych-pop", "Khruangbin", "Maria También", "Texas"),
    ("Psych-pop", "Unknown Mortal Orchestra", "Multi-Love", "Portland"),
    ("Indie", "Men I Trust", "Show Me How", "Montreal"),
    ("Indie", "Still Woozy", "Goodie Bag", "Oakland"),
    ("Indie", "Parcels", "Tieduprightnow", "Berlin"),
    ("Indie", "Boy Pablo", "Everytime", "Norway"),
    ("Indie", "Clairo", "Bags", "Atlanta"),
    ("Indie", "Beach Fossils", "Sleep Apnea", "Brooklyn"),
    ("Indie", "Homeshake", "Call Me Up", "Montreal"),
    ("Indie", "Steve Lacy", "Dark Red", "Los Angeles"),
    ("Lo-fi", "Tom Misch", "It Runs Through Me", "London"),
    ("Lo-fi", "Puma Blue", "Want Me", "London"),
    ("Lo-fi", "Jordan Rakei", "Wildfire", "London"),
    ("Lo-fi", "Nick Hakim", "Roller Skates", "Brooklyn"),
    ("Lo-fi", "Yellow Days", "A Little While", "Surrey"),
    ("Lo-fi", "Cosmo Pyke", "Chronic Sunshine", "London"),
    ("Lo-fi", "Rejjie Snow", "Egyptian Luvr", "Dublin"),
    ("Lo-fi", "Men I Trust", "Numb", "Montreal"),
    ("Electronic", "Bonobo", "Kerala", "UK"),
    ("Electronic", "Floating Points", "Silhouettes", "UK"),
    ("Electronic", "Jamie xx", "Gosh", "UK"),
    ("Electronic", "Four Tet", "Baby", "UK"),
    ("Electronic", "Caribou", "Odessa", "Canada"),
    ("Electronic", "Jon Hopkins", "Emerald Rush", "UK"),
    ("Electronic", "Rüfüs Du Sol", "Innerbloom", "Australia"),
    ("Electronic", "Moderat", "A New Error", "Berlin"),
    ("Hip-hop", "Saba", "Sirens", "Chicago"),
    ("Hip-hop", "Smino", "Anita", "St. Louis"),
    ("Hip-hop", "Mick Jenkins", "Jazz", "Chicago"),
    ("Hip-hop", "Isaiah Rashad", "Free Lunch", "Chattanooga"),
    ("Hip-hop", "EARTHGANG", "Up", "Atlanta"),
    ("Hip-hop", "Little Simz", "Venom", "London"),
    ("Hip-hop", "Denzel Curry", "RICKY", "Miami"),
    ("Hip-hop", "JID", "Never", "Atlanta"),
    ("Jazz", "GoGo Penguin", "Hopopono", "Manchester"),
    ("Jazz", "BadBadNotGood", "Time Moves Slow", "Toronto"),
    ("Jazz", "Yussef Kamaal", "Black Focus", "London"),
    ("Jazz", "Kamasi Washington", "Street Fighter Mas", "Los Angeles"),
    ("Jazz", "Nubya Garcia", "Source", "London"),
    ("Jazz", "Ezra Collective", "Quest for Coin", "London"),
    ("Jazz", "Robert Glasper", "So Beautiful", "Houston"),
    ("Jazz", "Alfa Mist", "Keep On", "London"),
]


def load_env(path=".env"):
    """Load KEY=VALUE pairs from a local .env (no-op on the cloud)."""
    if os.path.exists(path):
        for line in open(path, encoding="utf-8"):
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, v = line.split("=", 1)
                os.environ.setdefault(k.strip(), v.strip().strip('"').strip("'"))


def have_key():
    return bool(os.environ.get("GROQ_API_KEY"))


def generate_stories(taste, picks):
    """LIVE: one LLM call writes a grounded, friend-voice story per track.
    Returns a list aligned to picks, or None on no-key/failure (caller falls
    back). picks = list of (genre, artist, track, origin)."""
    key = os.environ.get("GROQ_API_KEY")
    if not key:
        return None
    block = "\n".join(f'{i}. {a} - "{t}" ({g}, {o})'
                      for i, (g, a, t, o) in enumerate(picks))
    prompt = (
        f"A listener loves {taste}. For each track below, write ONE short, vivid "
        "sentence (max 24 words) in the voice of a music-obsessed friend putting "
        "them on — connect it to their taste and give a concrete reason to press "
        "play. Use only real facts about the track; do not invent details. "
        "Return ONLY a JSON array of strings, in order.\n\n" + block)
    try:
        from groq import Groq
        resp = Groq(api_key=key).chat.completions.create(
            model="llama-3.1-8b-instant", temperature=0.8,
            messages=[{"role": "user", "content": prompt}])
        out = resp.choices[0].message.content
        out = out[out.find("["):out.rfind("]") + 1]
        stories = json.loads(out)
        if isinstance(stories, list) and len(stories) >= len(picks):
            return [str(s) for s in stories[:len(picks)]]
    except Exception:
        return None
    return None


def _fallback_story(g, a, t):
    return f"{a}'s “{t}” — a {g.lower()} cut with the textures you keep coming back to."


def build_data(genres_sel, friends=None, n=10, seed=None):
    """Assemble a fresh LINER_DATA dict for the chosen taste."""
    friends = [f for f in (friends or []) if f] or ["Arjun"]
    genres_sel = genres_sel or GENRES
    rng = random.Random(seed)
    pool = [c for c in CATALOG if c[0] in genres_sel] or list(CATALOG)
    rng.shuffle(pool)
    picks = pool[:max(1, min(n, len(pool)))]
    taste = " · ".join(genres_sel)

    stories = generate_stories(taste, picks)
    if not stories:
        stories = [_fallback_story(g, a, t) for (g, a, t, o) in picks]

    songs = []
    for i, (g, a, t, o) in enumerate(picks):
        r = i % 3
        if r == 0 and friends:
            trust = {"type": "friend", "label": f"Liked by {rng.choice(friends)}"}
        elif r == 2:
            trust = {"type": "ai", "label": "Picked for you"}
        else:
            trust = {"type": "twin", "label": "Popular with your taste"}
        songs.append({
            "genre": g, "artist": a, "track": t, "origin": o,
            "story": stories[i] if i < len(stories) else _fallback_story(g, a, t),
            "trust": trust,
            "len": f"{2 + (i % 4)}:{(11 + i * 7) % 60:02d}",
        })

    used = []
    for s in songs:
        if s["genre"] not in used:
            used.append(s["genre"])
    return {"taste": taste, "genres": used or genres_sel, "songs": songs}


def inject_data(data):
    """Return the embedded Spotify UI with its hardcoded LINER_DATA replaced
    by freshly-built live data."""
    payload = "const LINER_DATA = " + json.dumps(data, ensure_ascii=False) + ";"
    new = re.sub(r"const LINER_DATA = \{.*?\n\};", lambda m: payload,
                 SPOTIFY_HTML, count=1, flags=re.S)
    if new == SPOTIFY_HTML:
        raise RuntimeError("LINER_DATA block not found in embedded HTML")
    return new


# The full Spotify-UI prototype, embedded so this file is self-contained.
SPOTIFY_HTML = r"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
<title>Spotify · Off Repeat (MVP)</title>
<style>
  :root{ --green:#1ed760; --bg:#000; --el:#181818; --el2:#1f1f1f; --txt:#fff; --mut:#b3b3b3; --dim:#7e7e7e; }
  *{ box-sizing:border-box; -webkit-tap-highlight-color:transparent; }
  body{ margin:0; background:#0a0a0a; font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif;
        min-height:100vh; display:flex; align-items:center; justify-content:center; padding:18px; color:var(--txt); }
  .wrap{ display:flex; gap:34px; align-items:center; flex-wrap:wrap; justify-content:center; }
  .phone{ width:390px; height:min(844px,94vh); background:var(--bg); border-radius:42px; overflow:hidden; position:relative;
          box-shadow:0 0 0 11px #000, 0 0 0 13px #2a2a2a, 0 30px 80px rgba(0,0,0,.6); display:flex; flex-direction:column; }
  .statusbar{ height:44px; flex:0 0 44px; display:flex; align-items:center; justify-content:space-between; padding:0 24px; font-size:14px; font-weight:700; z-index:30; }
  .statusbar .r{ display:flex; gap:6px; align-items:center; }
  .viewport{ flex:1; overflow:hidden; position:relative; }
  .screen{ position:absolute; inset:0; overflow-y:auto; padding:4px 16px 156px; display:none; }
  .screen.active{ display:block; }
  .screen::-webkit-scrollbar{ width:0; }
  #home{ background:linear-gradient(180deg, #1f3b2c 0, #11201a 150px, #0a0a0a 360px); }
  #search,#library,#discover{ background:#000; }
  h2{ font-size:22px; font-weight:800; margin:24px 0 14px; letter-spacing:-.4px; }
  .sub{ color:var(--mut); font-size:13px; }
  /* top bar (home chips / search header) */
  .hbar{ display:flex; align-items:center; gap:10px; margin:8px 0 12px; }
  .avatar{ width:32px; height:32px; border-radius:50%; flex:0 0 32px; background:linear-gradient(135deg,#b06ab3,#6a3093); display:flex; align-items:center; justify-content:center; font-size:14px; font-weight:800; }
  .chip{ flex:0 0 auto; border:none; background:#232323; color:#fff; border-radius:18px; padding:8px 15px; font-size:13.5px; font-weight:600; cursor:pointer; white-space:nowrap; }
  .chip.on{ background:var(--green); color:#000; font-weight:700; }
  .chip:active{ transform:scale(.97); }
  /* home quick grid */
  .grid2{ display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:6px; }
  .qcard{ display:flex; align-items:center; gap:10px; background:#242424; border-radius:6px; height:56px; overflow:hidden; cursor:pointer; font-weight:700; font-size:13px; }
  .qcard:active{ background:#2e2e2e; }
  .qcard .art{ width:56px; height:56px; flex:0 0 56px; }
  /* shelves */
  .row{ display:flex; gap:15px; overflow-x:auto; padding-bottom:4px; }
  .row::-webkit-scrollbar{ height:0; }
  .tile{ width:148px; flex:0 0 148px; cursor:pointer; }
  .tile .art{ width:148px; height:148px; border-radius:7px; box-shadow:0 8px 18px rgba(0,0,0,.45); }
  .tile.circ .art{ border-radius:50%; }
  .tile .t{ font-size:14px; font-weight:700; margin-top:8px; line-height:1.25; }
  .tile .d{ font-size:12px; color:var(--mut); margin-top:3px; line-height:1.3; }
  .shelfhead{ display:flex; align-items:baseline; justify-content:space-between; margin:24px 0 14px; }
  .shelfhead h2{ margin:0; }
  .shelfhead .all{ font-size:12px; font-weight:800; letter-spacing:.6px; color:var(--mut); cursor:pointer; }
  .art{ overflow:hidden; display:block; position:relative; background:#222; }
  .art svg{ display:block; width:100%; height:100%; }
  /* search */
  .searchhead{ display:flex; align-items:center; gap:12px; margin:6px 0 16px; }
  .searchhead h1{ font-size:25px; font-weight:800; margin:0; flex:1; }
  .ico{ cursor:pointer; }
  .searchbar{ background:#fff; color:#121212; border-radius:6px; height:48px; display:flex; align-items:center; gap:11px; padding:0 14px; font-weight:600; font-size:15.5px; cursor:text; }
  .feature{ margin:18px 0 6px; border-radius:11px; padding:16px; background:linear-gradient(115deg,#1ed760,#0a8f43 62%,#06351c); cursor:pointer; position:relative; overflow:hidden; min-height:108px; box-shadow:0 12px 28px rgba(13,140,67,.35); }
  .feature::after{ content:""; position:absolute; right:-26px; bottom:-30px; width:130px; height:130px; border-radius:50%; background:rgba(255,255,255,.12); }
  .feature .k{ font-size:10px; font-weight:800; letter-spacing:1.6px; color:#06351c; }
  .feature h3{ margin:8px 0 6px; font-size:21px; font-weight:800; color:#03240f; max-width:78%; line-height:1.1; }
  .feature p{ margin:0; font-size:12.5px; color:#0a3b1c; max-width:74%; line-height:1.4; font-weight:600; position:relative; }
  .feature .play{ position:absolute; right:16px; top:16px; width:46px; height:46px; border-radius:50%; background:#03240f; display:flex; align-items:center; justify-content:center; }
  .gtiles{ display:grid; grid-template-columns:1fr 1fr; gap:12px; }
  .gtile{ height:96px; border-radius:8px; padding:13px; font-weight:800; font-size:16px; position:relative; overflow:hidden; cursor:pointer; color:#fff; }
  .gtile:active{ filter:brightness(1.08); }
  .gtile .deco{ position:absolute; right:-14px; bottom:-12px; width:62px; height:62px; transform:rotate(25deg); border-radius:6px; box-shadow:-5px 6px 12px rgba(0,0,0,.45); overflow:hidden; }
  /* discover (playlist detail) */
  .dtop{ display:flex; align-items:center; gap:14px; height:40px; margin:2px 0 4px; }
  .back{ cursor:pointer; }
  .dhero{ display:flex; flex-direction:column; align-items:center; text-align:center; padding:6px 0 4px; }
  .dcover{ width:150px; height:150px; border-radius:6px; overflow:hidden; box-shadow:0 16px 40px rgba(0,0,0,.6); }
  .dtitle{ font-size:25px; font-weight:800; margin:16px 0 0; letter-spacing:-.4px; }
  .ddesc{ font-size:13px; color:var(--mut); margin:9px auto 0; max-width:300px; line-height:1.45; }
  .dmeta{ font-size:12px; color:var(--dim); font-weight:600; margin-top:11px; display:flex; align-items:center; gap:6px; justify-content:center; }
  .dmeta .sp{ display:flex; align-items:center; gap:5px; color:#fff; font-weight:700; }
  .dloop{ font-size:12.5px; color:#cdeed8; background:rgba(30,215,96,.12); border:1px solid rgba(30,215,96,.3); border-radius:9px; padding:9px 13px; margin:14px 0 2px; line-height:1.4; }
  .dloop b{ color:#fff; }
  .dctrls{ display:flex; align-items:center; gap:22px; margin:16px 2px 6px; }
  .dctrls .grow{ flex:1; }
  .dctrls .ic{ cursor:pointer; color:var(--mut); display:flex; }
  .dctrls .ic.on{ color:var(--green); }
  .shuffle{ cursor:pointer; }
  .pfab{ width:56px; height:56px; border-radius:50%; background:var(--green); display:flex; align-items:center; justify-content:center; cursor:pointer; box-shadow:0 6px 16px rgba(30,215,96,.4); }
  .pfab:active{ transform:scale(.94); }
  /* flat track row */
  .trk{ display:flex; gap:13px; align-items:flex-start; padding:11px 2px; cursor:pointer; }
  .trk:active{ background:rgba(255,255,255,.05); border-radius:8px; }
  .trk .art{ width:52px; height:52px; flex:0 0 52px; border-radius:4px; }
  .trk .mid{ flex:1; min-width:0; padding-top:1px; }
  .trk .tt{ font-size:15.5px; font-weight:600; color:#fff; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .trk .ar{ font-size:13px; color:var(--mut); margin-top:1px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .trk .why{ font-size:12.5px; color:#9b9b9b; margin-top:7px; line-height:1.4; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
  .trk .why .sp{ color:var(--green); font-weight:700; }
  .trk .who{ display:inline-flex; align-items:center; gap:6px; margin-top:8px; font-size:11.5px; font-weight:600; color:var(--mut); }
  .trk .who .av{ width:17px; height:17px; border-radius:50%; flex:0 0 17px; display:flex; align-items:center; justify-content:center; font-size:9px; font-weight:800; color:#fff; }
  .trk .add{ background:none; border:none; padding:4px 0 0; cursor:pointer; display:flex; align-self:center; }
  .trk .add:active{ transform:scale(.9); }
  /* library */
  .libhead{ display:flex; align-items:center; gap:13px; margin:8px 0 18px; }
  .libhead h1{ font-size:25px; font-weight:800; margin:0; }
  .liked{ display:flex; gap:13px; align-items:center; padding:6px 0 14px; cursor:pointer; }
  .liked .ic{ width:52px; height:52px; border-radius:5px; background:linear-gradient(135deg,#4500c9,#b388ff); display:flex; align-items:center; justify-content:center; flex:0 0 52px; }
  .lib-item{ display:flex; gap:13px; align-items:center; padding:8px 0; cursor:pointer; }
  .lib-item .art{ width:50px; height:50px; flex:0 0 50px; border-radius:4px; }
  .empty{ color:var(--dim); text-align:center; margin-top:48px; font-size:14px; line-height:1.7; }
  /* mini player */
  .mini{ position:absolute; left:8px; right:8px; bottom:66px; height:58px; border-radius:8px; display:none; align-items:center; gap:11px; padding:0 10px 0 8px; z-index:20;
         background:linear-gradient(90deg,#3a2a4a,#241a2e); box-shadow:0 8px 20px rgba(0,0,0,.5); }
  .mini.show{ display:flex; }
  .mini .art{ width:44px; height:44px; flex:0 0 44px; border-radius:5px; }
  .mini .mtxt{ flex:1; min-width:0; }
  .mini .mt{ font-size:13px; font-weight:700; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .mini .md{ font-size:11.5px; color:#cfcfcf; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .mini .ic{ cursor:pointer; display:flex; padding:4px; }
  .mini .prog{ position:absolute; left:8px; bottom:4px; height:2px; background:#fff; width:0; border-radius:2px; transition:width .3s linear; }
  /* bottom nav */
  .nav{ position:absolute; left:0; right:0; bottom:0; height:66px; background:linear-gradient(180deg,rgba(0,0,0,.55),#000 55%); display:flex; z-index:25; padding-bottom:4px; }
  .nav .item{ flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:4px; color:#a7a7a7; font-size:10px; font-weight:600; cursor:pointer; }
  .nav .item.on{ color:#fff; }
  .nav .item:active{ opacity:.7; }
  /* sheet/overlay/toast */
  .overlay{ position:absolute; inset:0; background:rgba(0,0,0,.55); display:none; z-index:40; }
  .overlay.show{ display:block; }
  .toast{ position:absolute; left:50%; transform:translateX(-50%) translateY(20px); bottom:138px; background:#fff; color:#121212; font-weight:700; font-size:13px; padding:11px 18px; border-radius:24px; opacity:0; transition:all .25s; z-index:60; pointer-events:none; box-shadow:0 8px 24px rgba(0,0,0,.5); max-width:84%; text-align:center; }
  .toast.show{ opacity:1; transform:translateX(-50%) translateY(0); }
  .caption{ text-align:center; color:#666; font-size:12.5px; max-width:300px; line-height:1.6; }
  .caption b{ color:var(--green); }
  svg{ display:block; }
</style>
</head>
<body>
<div class="wrap">
  <div class="phone">
    <div class="statusbar">
      <span>9:41</span>
      <span class="r"><svg width="17" height="11" viewBox="0 0 17 11"><rect x="0" y="7" width="3" height="4" rx="1" fill="#fff"/><rect x="4.5" y="5" width="3" height="6" rx="1" fill="#fff"/><rect x="9" y="2.5" width="3" height="8.5" rx="1" fill="#fff"/><rect x="13.5" y="0" width="3" height="11" rx="1" fill="#fff"/></svg>
      <span style="font-size:11px;font-weight:800">5G</span>
      <svg width="24" height="12" viewBox="0 0 24 12"><rect x="1" y="1" width="20" height="10" rx="3" fill="none" stroke="#fff" stroke-width="1"/><rect x="2.5" y="2.5" width="15" height="7" rx="1.5" fill="#fff"/><rect x="22" y="4" width="1.5" height="4" rx="1" fill="#fff"/></svg></span>
    </div>
    <div class="viewport">

      <!-- ===== HOME ===== -->
      <div class="screen active" id="home">
        <div class="hbar">
          <div class="avatar">N</div>
          <button class="chip on">All</button>
          <button class="chip" onclick="toast('Music')">Music</button>
          <button class="chip" onclick="toast('Podcasts')">Podcasts</button>
        </div>
        <div class="grid2" id="home-quick"></div>
        <div class="shelfhead"><h2>Discover something new</h2><span class="all" onclick="openDiscover('All')">SHOW ALL</span></div>
        <div class="row" id="home-discover"></div>
        <div class="shelfhead"><h2>Made for you</h2></div>
        <div class="row" id="home-made"></div>
      </div>

      <!-- ===== SEARCH ===== -->
      <div class="screen" id="search">
        <div class="searchhead">
          <div class="avatar">N</div>
          <h1>Search</h1>
          <span class="ico"><svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8"><path d="M3 8.5A1.5 1.5 0 0 1 4.5 7h2L8 5h8l1.5 2h2A1.5 1.5 0 0 1 21 8.5v9A1.5 1.5 0 0 1 19.5 19h-15A1.5 1.5 0 0 1 3 17.5z"/><circle cx="12" cy="12.5" r="3.2"/></svg></span>
        </div>
        <div class="searchbar" onclick="toast('Type an artist, song, or podcast')"><svg width="22" height="22" viewBox="0 0 20 20"><circle cx="8.5" cy="8.5" r="6" fill="none" stroke="#121212" stroke-width="2"/><line x1="13" y1="13" x2="18" y2="18" stroke="#121212" stroke-width="2" stroke-linecap="round"/></svg>What do you want to listen to?</div>
        <div class="feature" onclick="openDiscover('All')">
          <div class="k">✦ OFF REPEAT · NEW MUSIC FOR YOU</div>
          <h3>Break out of your loop</h3>
          <p id="search-loop">You replay 6 tracks 78% of the time. Here's what's next — each with the story of why.</p>
          <div class="play"><svg width="18" height="18" viewBox="0 0 16 16"><path d="M4 2l9 6-9 6z" fill="#1ed760"/></svg></div>
        </div>
        <h2>Browse all</h2>
        <div class="gtiles" id="search-tiles"></div>
      </div>

      <!-- ===== DISCOVER (playlist detail) ===== -->
      <div class="screen" id="discover">
        <div class="dtop"><span class="back" onclick="showScreen('search')"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg></span></div>
        <div class="dhero">
          <div class="dcover" id="d-cover"></div>
          <div class="dtitle" id="d-title">New Music for You</div>
          <div class="ddesc" id="d-desc"></div>
          <div class="dmeta"><span class="sp"><svg width="15" height="15" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#1ed760"/><path d="M6 9.5c4-1.2 8.5-.8 12 1.3M6.8 13c3.2-1 6.8-.6 9.6 1.1M7.6 16.2c2.5-.8 5.2-.5 7.4.9" stroke="#000" stroke-width="1.5" stroke-linecap="round" fill="none"/></svg>Off Repeat</span><span id="d-count">· 18 songs</span></div>
        </div>
        <div class="dloop" id="d-loop"></div>
        <div class="dctrls">
          <span class="ic" id="d-save" onclick="saveAll()" title="Save all"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8" stroke-linecap="round"/></svg></span>
          <span class="ic" onclick="toast('Downloaded for offline (demo)')"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v11m0 0l-4-4m4 4l4-4M5 19h14"/></svg></span>
          <span class="ic" onclick="toast('More')"><svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/></svg></span>
          <span class="grow"></span>
          <span class="shuffle" onclick="weirder()" title="Go weirder"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#b3b3b3" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M3 5h3l10 14h3M16 5h3M3 19h3l3.5-5"/><path d="M17 3l2 2-2 2M17 17l2 2-2 2"/></svg></span>
          <span class="pfab" onclick="playFirst()"><svg width="22" height="22" viewBox="0 0 16 16"><path d="M4 2l10 6-10 6z" fill="#000"/></svg></span>
        </div>
        <div id="d-list"></div>
        <div class="caption" style="margin:18px auto 6px">Every pick is <b>new to you</b>, comes with a <b>reason to try it</b>, and tells you <b>who it's for</b>.</div>
      </div>

      <!-- ===== LIBRARY ===== -->
      <div class="screen" id="library">
        <div class="libhead"><div class="avatar">N</div><h1>Your Library</h1></div>
        <div class="liked" onclick="showScreen('library')">
          <div class="ic"><svg width="26" height="26" viewBox="0 0 24 24"><path d="M12 21s-7-4.5-9.5-9C.5 8 2 4 5.5 4 8 4 9 6 12 6s3-2 6.5-2C22 4 23.5 8 21.5 12 19 16.5 12 21 12 21z" fill="#fff"/></svg></div>
          <div><div style="font-size:16px;font-weight:700">Discovered Songs</div><div class="sub" id="lib-sub">Playlist · saved from Off Repeat</div></div>
        </div>
        <div id="lib-list"></div>
      </div>

      <!-- mini player -->
      <div class="mini" id="mini">
        <div class="art" id="mini-art"></div>
        <div class="mtxt"><div class="mt" id="mini-t">—</div><div class="md" id="mini-d">—</div></div>
        <span class="ic" onclick="toast('Connect to a device')"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8"><rect x="3" y="5" width="18" height="11" rx="1.5"/><path d="M8 20h8" stroke-linecap="round"/><circle cx="17.5" cy="18.5" r="2.4" fill="#fff" stroke="none"/></svg></span>
        <span class="ic" id="mini-add" onclick="toggleSaveMini()"></span>
        <span class="ic" onclick="togglePlay()"><svg id="mini-pp" width="24" height="24" viewBox="0 0 24 24"><rect x="6" y="5" width="4" height="14" rx="1" fill="#fff"/><rect x="14" y="5" width="4" height="14" rx="1" fill="#fff"/></svg></span>
        <div class="prog" id="mini-prog"></div>
      </div>

      <!-- bottom nav (Spotify: 5 items) -->
      <div class="nav">
        <div class="item on" id="nav-home" onclick="showScreen('home')"><svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3.2L3 11h2.2v9.8h5.1v-6h3.4v6h5.1V11H21z"/></svg>Home</div>
        <div class="item" id="nav-search" onclick="showScreen('search')"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="10.5" cy="10.5" r="7"/><line x1="15.8" y1="15.8" x2="21" y2="21" stroke-linecap="round"/></svg>Search</div>
        <div class="item" id="nav-library" onclick="showScreen('library')"><svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><rect x="3.2" y="3" width="2.4" height="18" rx="1.2"/><rect x="8" y="3" width="2.4" height="18" rx="1.2"/><g transform="rotate(20 16 12)"><rect x="14.6" y="3.4" width="2.4" height="17.4" rx="1.2"/></g></svg>Your Library</div>
        <div class="item" id="nav-premium" onclick="toast('Spotify Premium')"><svg width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10.5" fill="currentColor"/><path d="M6.6 9.8c3.6-1 7.7-.7 10.8 1.2M7.2 12.9c2.9-.8 6.1-.5 8.7 1M7.8 15.8c2.2-.6 4.6-.4 6.5.8" stroke="#000" stroke-width="1.4" stroke-linecap="round" fill="none"/></svg>Premium</div>
        <div class="item" id="nav-create" onclick="toast('Create')"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><path d="M12 8.5v7M8.5 12h7"/></svg>Create</div>
      </div>

    </div>
    <div class="toast" id="toast"></div>
  </div>
  <div class="caption"><b>Spotify · Off Repeat — clickable MVP.</b><br>Discovery lives in <b>Search</b> → tap <b>"Break out of your loop"</b> or any genre tile. Real AI-written stories; cover art is generated (real covers are copyrighted).</div>
</div>

<script>
const LINER_DATA = {
 "taste": "Tame Impala · lo-fi · indie",
 "genres": ["Psych-pop","Indie","Lo-fi","Electronic","Hip-hop","Jazz"],
 "songs": [
  {"genre":"Psych-pop","artist":"Crumb","track":"Locket","origin":"Brooklyn","story":"Get ready to trip with Crumb's 'Locket', a swirling Brooklyn psych-pop track with infectious hooks.","trust":{"type":"friend","label":"Liked by Arjun"},"len":"2:17"},
  {"genre":"Psych-pop","artist":"Mild High Club","track":"Homage","origin":"Los Angeles","story":"Mild High Club's 'Homage' is a lush, jazzy ode to love, perfect for a psychedelic afternoon.","trust":{"type":"twin","label":"Popular with your taste"},"len":"3:24"},
  {"genre":"Psych-pop","artist":"The Babe Rainbow","track":"The Wave of Love","origin":"Australia","story":"The Babe Rainbow's 'The Wave of Love' is an Australian psych-pop gem with dreamy textures and a catchy beat.","trust":{"type":"ai","label":"Picked for you"},"len":"4:31"},
  {"genre":"Indie","artist":"Men I Trust","track":"Show Me How","origin":"Montreal","story":"Men I Trust's 'Show Me How' is a laid-back Montreal indie gem with a soothing melody and gentle vibes.","trust":{"type":"friend","label":"Liked by Arjun"},"len":"2:38"},
  {"genre":"Indie","artist":"Still Woozy","track":"Goodie Bag","origin":"Oakland","story":"Still Woozy's 'Goodie Bag' is a funky, lo-fi indie track with catchy hooks and a groovy vibe.","trust":{"type":"twin","label":"Popular with your taste"},"len":"3:45"},
  {"genre":"Indie","artist":"Parcels","track":"Tieduprightnow","origin":"Berlin","story":"Parcels' 'Tieduprightnow' is a catchy indie-dance track with a driving beat and infectious energy.","trust":{"type":"ai","label":"Picked for you"},"len":"4:52"},
  {"genre":"Lo-fi","artist":"Tom Misch","track":"It Runs Through Me","origin":"London","story":"Tom Misch's 'It Runs Through Me' is a laid-back London lo-fi track with soulful vocals and jazzy undertones.","trust":{"type":"friend","label":"Liked by Arjun"},"len":"2:59"},
  {"genre":"Lo-fi","artist":"Puma Blue","track":"Want Me","origin":"London","story":"Puma Blue's 'Want Me' is a melancholic London lo-fi track with soaring vocals and a haunting melody.","trust":{"type":"twin","label":"Popular with your taste"},"len":"3:06"},
  {"genre":"Lo-fi","artist":"Jordan Rakei","track":"Wildfire","origin":"London","story":"Jordan Rakei's 'Wildfire' is a soulful London lo-fi track with a catchy hook and emotional depth.","trust":{"type":"ai","label":"Picked for you"},"len":"4:13"},
  {"genre":"Electronic","artist":"Bonobo","track":"Kerala","origin":"UK","story":"Bonobo's 'Kerala' is an ethereal electronic journey with lush textures and a hypnotic beat.","trust":{"type":"friend","label":"Liked by Arjun"},"len":"2:20"},
  {"genre":"Electronic","artist":"Floating Points","track":"Silhouettes","origin":"UK","story":"Floating Points' 'Silhouettes' is a mesmerizing electronic track with a deep bassline and celestial sounds.","trust":{"type":"twin","label":"Popular with your taste"},"len":"3:27"},
  {"genre":"Electronic","artist":"Jamie xx","track":"Gosh","origin":"UK","story":"Jamie xx's 'Gosh' is an atmospheric electronic track with a driving beat and catchy hooks.","trust":{"type":"ai","label":"Picked for you"},"len":"4:34"},
  {"genre":"Hip-hop","artist":"Saba","track":"Sirens","origin":"Chicago","story":"Saba's 'Sirens' is a moody Chicago hip-hop track with a haunting hook and emotional depth.","trust":{"type":"friend","label":"Liked by Arjun"},"len":"2:41"},
  {"genre":"Hip-hop","artist":"Smino","track":"Anita","origin":"St. Louis","story":"Smino's 'Anita' is a soulful St. Louis hip-hop track with a catchy hook and jazzy undertones.","trust":{"type":"twin","label":"Popular with your taste"},"len":"3:48"},
  {"genre":"Hip-hop","artist":"Mick Jenkins","track":"Jazz","origin":"Chicago","story":"Mick Jenkins' 'Jazz' is a laid-back Chicago hip-hop track with a smooth flow and jazzy beats.","trust":{"type":"ai","label":"Picked for you"},"len":"4:55"},
  {"genre":"Jazz","artist":"GoGo Penguin","track":"Hopopono","origin":"Manchester","story":"GoGo Penguin's 'Hopopono' is a high-energy Manchester jazz track with a driving beat and soaring keys.","trust":{"type":"friend","label":"Liked by Arjun"},"len":"2:02"},
  {"genre":"Jazz","artist":"BadBadNotGood","track":"Time Moves Slow","origin":"Toronto","story":"BadBadNotGood's 'Time Moves Slow' is a melancholic Toronto jazz track with a haunting hook and depth.","trust":{"type":"twin","label":"Popular with your taste"},"len":"3:09"},
  {"genre":"Jazz","artist":"Yussef Kamaal","track":"Black Focus","origin":"London","story":"Yussef Kamaal's 'Black Focus' is a psychedelic London jazz track with a hypnotic beat and soaring horns.","trust":{"type":"ai","label":"Picked for you"},"len":"4:16"}
 ]
};
</script>
<script>
const PAL = {
  "Psych-pop":["#8b5cf6","#ec4899","#f9a8d4","#2a0f4d"],
  "Indie":["#27ae60","#a3e635","#34d399","#06281f"],
  "Lo-fi":["#6366f1","#a855f7","#67e8f9","#1e1b4b"],
  "Electronic":["#06b6d4","#3b82f6","#67e8f9","#082f49"],
  "Hip-hop":["#f59e0b","#ef4444","#fb923c","#3b1106"],
  "Jazz":["#f97316","#fbbf24","#f87171","#3f1208"]
};
const TILECOLOR = { "Psych-pop":"#8e44ad","Indie":"#27ae60","Lo-fi":"#3d46b9","Electronic":"#0e92b8","Hip-hop":"#d35400","Jazz":"#b7202e" };
const TRUST = {
  friend:{ c:"#1ed760", av:"#1ed760", ico:"♥" },
  twin:{ c:"#6fb0ff", av:"#3a6ea5", ico:"✦" },
  ai:{ c:"#c9a8ff", av:"#6a3093", ico:"✦" }
};
let SCOPE="All"; const SAVED=new Set(); let NOW=null, playing=false, progTimer=null;

function hsh(s){ let h=0; for(let i=0;i<s.length;i++) h=(h*31+s.charCodeAt(i))>>>0; return h; }
function cover(s){
  const p=PAL[s.genre]||["#777","#aaa","#ccc","#222"];
  const h=hsh(s.artist+s.track), id="g"+(h%99999), rid="r"+(h%99999), t=h%6;
  const c1=p[0],c2=p[1],acc=p[2],deep=p[3];
  let g=`<svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice"><defs>`+
    `<linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${deep}"/></linearGradient>`+
    `<radialGradient id="${rid}" cx="${28+h%40}%" cy="${20+(h>>3)%32}%" r="72%"><stop offset="0" stop-color="${c2}" stop-opacity="0.95"/><stop offset="1" stop-color="${c2}" stop-opacity="0"/></radialGradient>`+
    `</defs><rect width="100" height="100" fill="url(#${id})"/><rect width="100" height="100" fill="url(#${rid})"/>`;
  if(t===0) g+=`<circle cx="${30+h%40}" cy="${30+(h>>2)%28}" r="${22+h%16}" fill="${acc}" opacity="0.5"/>`;
  else if(t===1) g+=`<g transform="rotate(${(h%70)-35} 50 50)"><rect x="-22" y="40" width="150" height="17" fill="${acc}" opacity="0.45"/><rect x="-22" y="63" width="150" height="8" fill="${c2}" opacity="0.4"/></g>`;
  else if(t===2) g+=`<g fill="none" stroke="${acc}" stroke-width="6" opacity="0.45"><circle cx="20" cy="82" r="22"/><circle cx="20" cy="82" r="40"/><circle cx="20" cy="82" r="58"/></g>`;
  else if(t===3) g+=`<polygon points="0,100 40,${28+h%30} 80,100" fill="${acc}" opacity="0.45"/><polygon points="46,100 78,${48+(h>>2)%24} 100,100" fill="${c2}" opacity="0.4"/>`;
  else if(t===4){ for(let i=0;i<3;i++) g+=`<ellipse cx="${22+i*28+h%10}" cy="${38+(h>>i)%42}" rx="${30+h%16}" ry="${17+h%12}" fill="${i%2?acc:c2}" opacity="0.3"/>`; }
  else { for(let i=0;i<6;i++) g+=`<rect x="${9+i*14}" y="${52-(h>>i)%32}" width="9" height="${22+(h>>i)%38}" rx="2.5" fill="${i%2?acc:c2}" opacity="0.5"/>`; }
  g+=`<rect width="100" height="100" fill="black" opacity="0.05"/><rect x="0" y="66" width="100" height="34" fill="black" opacity="0.16"/></svg>`;
  return g;
}
function artDiv(s){ return `<div class="art">${cover(s)}</div>`; }
function brandCover(){
  return `<svg viewBox="0 0 100 100"><defs><linearGradient id="bc" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1ed760"/><stop offset="1" stop-color="#053d20"/></linearGradient></defs><rect width="100" height="100" fill="url(#bc)"/><circle cx="74" cy="26" r="34" fill="#fff" opacity="0.1"/><text x="50" y="46" font-size="30" text-anchor="middle" fill="#03240f" font-weight="900">✦</text><text x="50" y="66" font-size="11" text-anchor="middle" fill="#03240f" font-weight="800" letter-spacing="1.5">OFF</text><text x="50" y="80" font-size="11" text-anchor="middle" fill="#03240f" font-weight="800" letter-spacing="1.5">REPEAT</text></svg>`;
}
function key(s){ return s.artist+"|"+s.track; }

function showScreen(id){
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  ['home','search','library','premium','create'].forEach(n=>document.getElementById('nav-'+n).classList.remove('on'));
  const nm={home:'home',search:'search',discover:'search',library:'library'};
  document.getElementById('nav-'+(nm[id]||'home')).classList.add('on');
  document.getElementById(id).scrollTop=0;
}
function openDiscover(g){ SCOPE=g||"All"; renderDiscover(); showScreen('discover'); }
function discoverSongs(){ return LINER_DATA.songs.filter(s=>SCOPE==="All"||s.genre===SCOPE); }

function addIcon(saved){ return saved
  ? `<svg width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#1ed760"/><path d="M7.5 12.4l3 3 6-6.4" fill="none" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`
  : `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#b3b3b3" stroke-width="1.8"><circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8" stroke-linecap="round"/></svg>`; }

function trackRow(s, idx){
  const saved=SAVED.has(key(s)), tr=TRUST[s.trust.type];
  return `<div class="trk" onclick="play(${idx})">
    ${artDiv(s)}
    <div class="mid">
      <div class="tt">${s.track}</div>
      <div class="ar">${s.artist} · ${s.origin}</div>
      <div class="why"><span class="sp">✦</span> ${s.story}</div>
      <div class="who"><span class="av" style="background:${tr.av}">${tr.ico}</span><span style="color:${tr.c}">${s.trust.label}</span></div>
    </div>
    <button class="add" onclick="event.stopPropagation();toggleSave(${idx},this)">${addIcon(saved)}</button>
  </div>`;
}
function renderDiscover(){
  const list=discoverSongs();
  document.getElementById('d-cover').innerHTML = SCOPE==="All" ? brandCover() : cover(list[0]);
  document.getElementById('d-title').textContent = SCOPE==="All" ? "New Music for You" : "New in "+SCOPE;
  document.getElementById('d-desc').textContent = SCOPE==="All"
    ? "Songs you've never heard — each with the story of why you'll love it. Built for your "+LINER_DATA.taste+" taste."
    : "Fresh "+SCOPE+" you've never heard, introduced for your taste.";
  document.getElementById('d-count').textContent = "· "+list.length+" songs";
  const loop=document.getElementById('d-loop');
  if(SCOPE==="All"){ loop.style.display="block"; loop.innerHTML=`🔁 <b>You replay the same 6 tracks 78% of the time.</b> Here's what's next — woven into the sound you already love.`; }
  else { loop.style.display="none"; }
  document.getElementById('d-list').innerHTML=list.map(s=>trackRow(s, LINER_DATA.songs.indexOf(s))).join("");
  updateSaveAllIcon();
}
function updateSaveAllIcon(){
  const list=discoverSongs(), all=list.length>0 && list.every(s=>SAVED.has(key(s)));
  document.getElementById('d-save').classList.toggle('on', all);
}
function toggleSave(idx,btn){ const s=LINER_DATA.songs[idx],k=key(s);
  if(SAVED.has(k)){ SAVED.delete(k); btn.innerHTML=addIcon(false); }
  else { SAVED.add(k); btn.innerHTML=addIcon(true); toast("Added to Your Library"); }
  updateSaveAllIcon(); updateMiniAdd(); renderLibrary(); }
function saveAll(){ const list=discoverSongs(); let n=0; list.forEach(s=>{ if(!SAVED.has(key(s))){ SAVED.add(key(s)); n++; }});
  renderDiscover(); renderLibrary(); toast(n>0?`${n} songs added to Your Library`:"All already saved"); }
function weirder(){ LINER_DATA.songs.sort(()=>Math.random()-0.5); renderDiscover(); toast("Going weirder — deeper cuts"); }
function playFirst(){ const list=discoverSongs(); if(list.length) play(LINER_DATA.songs.indexOf(list[0])); }

function play(idx){ NOW=LINER_DATA.songs[idx]; playing=true;
  const m=document.getElementById('mini'); m.classList.add('show');
  const deep=(PAL[NOW.genre]||["","","","#333"])[3];
  m.style.background=`linear-gradient(90deg, ${deep}, #181818)`;
  document.getElementById('mini-art').innerHTML=cover(NOW);
  document.getElementById('mini-t').textContent=NOW.track;
  document.getElementById('mini-d').textContent=NOW.artist;
  setPP(true); updateMiniAdd(); runProgress(); }
function setPP(on){ playing=on;
  document.getElementById('mini-pp').innerHTML=on
    ?`<rect x="6" y="5" width="4" height="14" rx="1" fill="#fff"/><rect x="14" y="5" width="4" height="14" rx="1" fill="#fff"/>`
    :`<path d="M5 3l15 9-15 9z" fill="#fff"/>`; }
function togglePlay(){ setPP(!playing); if(playing) runProgress(); else clearInterval(progTimer); }
function runProgress(){ clearInterval(progTimer); let w=8; const b=document.getElementById('mini-prog'); b.style.width=w+"%";
  progTimer=setInterval(()=>{ if(!playing) return; w+=1.2; if(w>=100){w=100;clearInterval(progTimer);} b.style.width=w+"%"; },380); }
function updateMiniAdd(){ const f=NOW&&SAVED.has(key(NOW)); document.getElementById('mini-add').innerHTML=addIcon(f); }
function toggleSaveMini(){ if(!NOW) return; const k=key(NOW); if(SAVED.has(k)) SAVED.delete(k); else { SAVED.add(k); toast("Added to Your Library"); }
  updateMiniAdd(); renderDiscover(); renderLibrary(); }

function renderLibrary(){ const items=LINER_DATA.songs.filter(s=>SAVED.has(key(s)));
  document.getElementById('lib-sub').textContent=items.length?`Playlist · ${items.length} songs from Off Repeat`:"Playlist · saved from Off Repeat";
  document.getElementById('lib-list').innerHTML=items.length
    ? items.map(s=>`<div class="lib-item" onclick="play(${LINER_DATA.songs.indexOf(s)})">${artDiv(s)}<div style="min-width:0"><div style="font-size:15px;font-weight:600">${s.track}</div><div style="font-size:12.5px;color:#b3b3b3">${s.artist}</div></div></div>`).join("")
    : `<div class="empty">No saved songs yet.<br>Open <b style="color:#fff">Search → Break out of your loop</b> and tap ＋.</div>`; }

let toastTimer=null; function toast(m){ const t=document.getElementById('toast'); t.textContent=m; t.classList.add('show'); clearTimeout(toastTimer); toastTimer=setTimeout(()=>t.classList.remove('show'),1700); }

function init(){
  // home: recently played quick grid (familiar loop)
  document.getElementById('home-quick').innerHTML=FAMILIAR.slice(0,6).map(s=>`<div class="qcard" onclick="openDiscover('All')">${artDiv(s)}<span>${s.track}</span></div>`).join("");
  // home: discover shelf
  document.getElementById('home-discover').innerHTML=LINER_DATA.songs.slice(0,8).map(s=>`<div class="tile" onclick="openDiscover('All')">${artDiv(s)}<div class="t">${s.track}</div><div class="d">${s.artist}</div></div>`).join("");
  // home: made for you (genre playlists)
  document.getElementById('home-made').innerHTML=LINER_DATA.genres.map(g=>{ const ex=LINER_DATA.songs.find(s=>s.genre===g);
    return `<div class="tile" onclick="openDiscover('${g}')">${ex?artDiv(ex):''}<div class="t">${g} Discovery</div><div class="d">New ${g} for you</div></div>`; }).join("");
  // search tiles
  const tiles=LINER_DATA.genres.map(g=>({label:g,c:TILECOLOR[g],g})).concat([
    {label:"Charts",c:"#7e57c2",g:null},{label:"New Releases",c:"#537a2d",g:null}
  ]);
  document.getElementById('search-tiles').innerHTML=tiles.map(t=>{
    const ex=t.g?LINER_DATA.songs.find(s=>s.genre===t.g):LINER_DATA.songs[0];
    const click=t.g?`openDiscover('${t.g}')`:`toast('${t.label}')`;
    return `<div class="gtile" style="background:${t.c}" onclick="${click}">${t.label}<div class="deco">${cover(ex)}</div></div>`; }).join("");
  updateMiniAdd(); renderLibrary();
}
const FAMILIAR=[
 {artist:"Tame Impala",track:"The Less I Know the Better",genre:"Psych-pop",origin:"",len:"3:36"},
 {artist:"Mac DeMarco",track:"Chamber of Reflection",genre:"Indie",origin:"",len:"3:50"},
 {artist:"Glass Animals",track:"Gooey",genre:"Electronic",origin:"",len:"4:43"},
 {artist:"Rex Orange County",track:"Loving Is Easy",genre:"Indie",origin:"",len:"3:26"},
 {artist:"boy pablo",track:"Everytime",genre:"Lo-fi",origin:"",len:"3:11"},
 {artist:"Clairo",track:"Bags",genre:"Lo-fi",origin:"",len:"4:21"},
];
try { init(); } catch(e){ document.body.insertAdjacentHTML('beforeend','<div style="color:#f55;position:fixed;top:0;left:0;background:#000;padding:8px;z-index:999">Init error: '+e.message+'</div>'); }
</script>
</body>
</html>
"""


# ------------------------------- Streamlit UI -------------------------------
st.set_page_config(page_title="Off Repeat — live", page_icon="✦", layout="wide")

load_env()
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
    genres_sel = st.multiselect("Genres you love", GENRES,
                                default=["Psych-pop", "Indie", "Lo-fi"])
    friends_raw = st.text_input(
        "Your friends", "Arjun",
        help="Comma-separated names for the 'Liked by ___' cue. "
             "Defaults to Arjun.")
    n = st.slider("How many picks", 5, 18, 10)
    go = st.button("✦ Generate my Off Repeat", type="primary",
                   use_container_width=True)
    st.divider()
    if have_key():
        st.success("Live AI stories: ON")
    else:
        st.warning("No GROQ_API_KEY found — using fallback stories.\n\n"
                   "Add it in **Settings → Secrets** (cloud) or a local `.env`.")

friends = [f.strip() for f in friends_raw.split(",") if f.strip()]

if go or "or_data" not in st.session_state:
    with st.spinner("Retrieving new music and writing your stories…"):
        st.session_state.or_data = build_data(genres_sel or GENRES, friends, n)

data = st.session_state.or_data
try:
    components.html(inject_data(data), height=880, scrolling=False)
except Exception as e:
    st.error(f"Could not render the UI: {e}")

with st.expander("What just happened? (the AI, per pick)"):
    st.write(f"**Taste:** {data['taste']}  ·  **{len(data['songs'])} picks** "
             f"from a {len(CATALOG)}-track catalog, filtered to what you don't "
             "already play.")
    for s in data["songs"]:
        st.markdown(f"- **{s['artist']} — {s['track']}** _( {s['trust']['label']} )_  \n"
                    f"  ↳ {s['story']}")
