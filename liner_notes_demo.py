"""
liner_notes_demo.py — tiny proof-of-concept of the "Liner Notes" feature.
Given a user's taste, the AI introduces 3 genuinely lesser-known songs, each
with a short, personalized story that makes you want to press play.
"""
import os, re, json
from groq import Groq

def load_env(path=".env"):
    if os.path.exists(path):
        for line in open(path):
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, v = line.split("=", 1)
                os.environ.setdefault(k.strip(), v.strip().strip('"').strip("'"))

load_env()
client = Groq(api_key=os.environ["GROQ_API_KEY"])

SEEDS = "Tame Impala and lo-fi beats"   # the user's taste

SYSTEM = ("You are the friend everyone wishes they had: a music obsessive who 'puts "
          "people on' to underground artists they'll love before anyone else. You write "
          "short, vivid introductions that connect new music to the listener's exact taste.")

PROMPT = f"""I love {SEEDS}. Introduce me to 3 genuinely lesser-known artists/songs I've
almost certainly never heard (NOT the ones I named, no megastars).
Return ONLY a JSON array of 3 objects with keys:
"track", "artist", "tag" (genre + place/era), "story" (2 sentences: connect it to my
taste AND give a vivid reason to press play right now)."""

def get(model):
    r = client.chat.completions.create(model=model, temperature=0.7,
        messages=[{"role": "system", "content": SYSTEM},
                  {"role": "user", "content": PROMPT}])
    return r.choices[0].message.content

try:
    out = get("llama-3.3-70b-versatile")
except Exception:
    out = get("llama-3.1-8b-instant")   # fall back if 70B daily cap is hit

out = out.replace("```json", "").replace("```", "").strip()
data = json.loads(out[out.find("["):out.rfind("]") + 1])
for i, d in enumerate(data, 1):
    print(f"\n#{i}  {d['artist']} — “{d['track']}”   [{d['tag']}]")
    print(f"     {d['story']}")
print("\n---RAWJSON---")
print(json.dumps(data))
