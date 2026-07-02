"""
gen_liner_notes_data.py
Generates the real "Liner Notes" content for the MVP prototype:
for a curated set of genuinely lesser-known real tracks (across the genres the
demo user loves), the LLM writes a personalized one-line "why you'll like it"
story. Output: liner_notes_data.js  (window.LINER_DATA for the prototype).
"""
import os, re, json
from groq import Groq

def load_env(path=".env"):
    if os.path.exists(path):
        for line in open(path, encoding="utf-8"):
            line=line.strip()
            if line and not line.startswith("#") and "=" in line:
                k,v=line.split("=",1); os.environ.setdefault(k.strip(), v.strip().strip('"').strip("'"))
load_env()
client = Groq(api_key=os.environ["GROQ_API_KEY"])

TASTE = "woozy Tame-Impala psychedelia, dreamy indie textures, lo-fi warmth, and groove-driven electronic"

# Real, lesser-known tracks across the genres the user likes.
SONGS = [
 ["Psych-pop","Crumb","Locket","Brooklyn"],
 ["Psych-pop","Mild High Club","Homage","Los Angeles"],
 ["Psych-pop","The Babe Rainbow","The Wave of Love","Australia"],
 ["Indie","Men I Trust","Show Me How","Montreal"],
 ["Indie","Still Woozy","Goodie Bag","Oakland"],
 ["Indie","Parcels","Tieduprightnow","Berlin"],
 ["Lo-fi","Tom Misch","It Runs Through Me","London"],
 ["Lo-fi","Puma Blue","Want Me","London"],
 ["Lo-fi","Jordan Rakei","Wildfire","London"],
 ["Electronic","Bonobo","Kerala","UK"],
 ["Electronic","Floating Points","Silhouettes","UK"],
 ["Electronic","Jamie xx","Gosh","UK"],
 ["Hip-hop","Saba","Sirens","Chicago"],
 ["Hip-hop","Smino","Anita","St. Louis"],
 ["Hip-hop","Mick Jenkins","Jazz","Chicago"],
 ["Jazz","GoGo Penguin","Hopopono","Manchester"],
 ["Jazz","BadBadNotGood","Time Moves Slow","Toronto"],
 ["Jazz","Yussef Kamaal","Black Focus","London"],
]

block = "\n".join(f'{i}. {a} - "{t}" ({g}, {o})' for i,(g,a,t,o) in enumerate(SONGS))
prompt = (f"A listener loves {TASTE}. For each track below, write ONE short, vivid sentence "
          "(max 24 words) in the voice of a music-obsessed friend putting them on — connect it to "
          "their taste and give a reason to press play. Return ONLY a JSON array of strings, in order.\n\n" + block)

resp = client.chat.completions.create(model="llama-3.1-8b-instant", temperature=0.7,
    messages=[{"role":"user","content":prompt}])
out = resp.choices[0].message.content
out = out[out.find("["):out.rfind("]")+1]
stories = json.loads(out)

FRIENDS = ["Rahul","Priya","Aanya","Kabir","Meera","Dev"]
data=[]
for i,(g,a,t,o) in enumerate(SONGS):
    mod = i % 3
    if mod==0: trust={"type":"friend","label":f"Liked by {FRIENDS[i%len(FRIENDS)]}","sub":"your friend"}
    elif mod==1: trust={"type":"twin","label":"Loved by listeners just like you","sub":"taste-twin"}
    else: trust={"type":"ai","label":"AI pick for your taste","sub":""}
    data.append({"genre":g,"artist":a,"track":t,"origin":o,
                 "story":stories[i] if i<len(stories) else "",
                 "trust":trust,
                 "len":f"{2+(i%3)}:{(17+i*7)%60:02d}"})

genres = []
for d in data:
    if d["genre"] not in genres: genres.append(d["genre"])

with open("liner_notes_data.js","w",encoding="utf-8") as f:
    f.write("const LINER_DATA = " + json.dumps({"taste":"Tame Impala · lo-fi · indie","genres":genres,"songs":data}, ensure_ascii=False, indent=1) + ";\n")
print(f"Wrote liner_notes_data.js | {len(data)} songs across {len(genres)} genres")
for d in data[:3]: print(" ", d["artist"],"-",d["track"],"::",d["story"][:70])
