"""
off_repeat_core.py — the dynamic engine behind the "Off Repeat" MVP.

Nothing here is a fixed feed: given a listener's taste (chosen genres) it
RETRIEVES novel tracks from a real candidate catalog, asks the LLM to write
each "why you'll love it" story LIVE (grounded in the real artist/track), and
assigns the trust cue by rule (a named friend only if the listener supplies
friends — otherwise taste-twin / AI, never a fake name).

Kept free of Streamlit so it can be unit-tested on its own.
Key comes from the environment (GROQ_API_KEY); the Streamlit app also falls
back to st.secrets on the cloud.
"""
import os, re, json, random

GENRES = ["Psych-pop", "Indie", "Lo-fi", "Electronic", "Hip-hop", "Jazz"]

# Real, genuinely lesser-known tracks — the "catalog" retrieval draws from.
# (genre, artist, track, origin)
CATALOG = [
    # Psych-pop
    ("Psych-pop", "Crumb", "Locket", "Brooklyn"),
    ("Psych-pop", "Mild High Club", "Homage", "Los Angeles"),
    ("Psych-pop", "The Babe Rainbow", "The Wave of Love", "Australia"),
    ("Psych-pop", "Pond", "Paint Me Silver", "Perth"),
    ("Psych-pop", "Temples", "Shelter Song", "Kettering"),
    ("Psych-pop", "Melody's Echo Chamber", "Some Time Alone, Alone", "France"),
    ("Psych-pop", "Khruangbin", "Maria También", "Texas"),
    ("Psych-pop", "Unknown Mortal Orchestra", "Multi-Love", "Portland"),
    # Indie
    ("Indie", "Men I Trust", "Show Me How", "Montreal"),
    ("Indie", "Still Woozy", "Goodie Bag", "Oakland"),
    ("Indie", "Parcels", "Tieduprightnow", "Berlin"),
    ("Indie", "Boy Pablo", "Everytime", "Norway"),
    ("Indie", "Clairo", "Bags", "Atlanta"),
    ("Indie", "Beach Fossils", "Sleep Apnea", "Brooklyn"),
    ("Indie", "Homeshake", "Call Me Up", "Montreal"),
    ("Indie", "Steve Lacy", "Dark Red", "Los Angeles"),
    # Lo-fi
    ("Lo-fi", "Tom Misch", "It Runs Through Me", "London"),
    ("Lo-fi", "Puma Blue", "Want Me", "London"),
    ("Lo-fi", "Jordan Rakei", "Wildfire", "London"),
    ("Lo-fi", "Nick Hakim", "Roller Skates", "Brooklyn"),
    ("Lo-fi", "Yellow Days", "A Little While", "Surrey"),
    ("Lo-fi", "Cosmo Pyke", "Chronic Sunshine", "London"),
    ("Lo-fi", "Rejjie Snow", "Egyptian Luvr", "Dublin"),
    ("Lo-fi", "Men I Trust", "Numb", "Montreal"),
    # Electronic
    ("Electronic", "Bonobo", "Kerala", "UK"),
    ("Electronic", "Floating Points", "Silhouettes", "UK"),
    ("Electronic", "Jamie xx", "Gosh", "UK"),
    ("Electronic", "Four Tet", "Baby", "UK"),
    ("Electronic", "Caribou", "Odessa", "Canada"),
    ("Electronic", "Jon Hopkins", "Emerald Rush", "UK"),
    ("Electronic", "Rüfüs Du Sol", "Innerbloom", "Australia"),
    ("Electronic", "Moderat", "A New Error", "Berlin"),
    # Hip-hop
    ("Hip-hop", "Saba", "Sirens", "Chicago"),
    ("Hip-hop", "Smino", "Anita", "St. Louis"),
    ("Hip-hop", "Mick Jenkins", "Jazz", "Chicago"),
    ("Hip-hop", "Isaiah Rashad", "Free Lunch", "Chattanooga"),
    ("Hip-hop", "EARTHGANG", "Up", "Atlanta"),
    ("Hip-hop", "Little Simz", "Venom", "London"),
    ("Hip-hop", "Denzel Curry", "RICKY", "Miami"),
    ("Hip-hop", "JID", "Never", "Atlanta"),
    # Jazz
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
    Returns a list aligned to `picks`, or None if no key / failure (caller
    falls back). picks = list of (genre, artist, track, origin)."""
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
    friends = [f for f in (friends or []) if f]
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


def inject_data(html_template_path, data):
    """Return the Spotify UI HTML with its hardcoded LINER_DATA replaced by
    freshly-built data (single source of truth = the shipped prototype)."""
    html = open(html_template_path, encoding="utf-8").read()
    payload = "const LINER_DATA = " + json.dumps(data, ensure_ascii=False) + ";"
    new = re.sub(r"const LINER_DATA = \{.*?\n\};", lambda m: payload, html,
                 count=1, flags=re.S)
    if new == html:
        raise RuntimeError("LINER_DATA block not found in template")
    return new
