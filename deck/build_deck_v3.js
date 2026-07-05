// Off Repeat — top-fellow DETAILED deck (modeled on the Claude Reflect reference density)
const pptxgen = require("pptxgenjs");
const p = new pptxgen();
p.layout = "LAYOUT_16x9"; // 10 x 5.625
p.author = "Arjun"; p.title = "Off Repeat — Spotify Discovery (detailed)";

const F="Arial";
const INK="1A1A1A", DGRN="0E6B37", GRN="1DB954", CORAL="B23A2E", AMBER="9A6A08", BLU="2C5FA8", MUT="5C6B62", LINE="CFCFCF";
const GT="EAF7EF", PT="FBEAE7", BT="EAF0FA", LAV="EFEAF7", AT="FBF3DE", WHITE="FFFFFF";

function slide(){ const s=p.addSlide(); s.background={color:WHITE}; return s; }
function head(s,title,sub){
  s.addShape(p.shapes.OVAL,{x:9.48,y:0.12,w:0.34,h:0.34,fill:{color:GRN}});
  s.addText("✦",{x:9.48,y:0.1,w:0.34,h:0.34,fontFace:F,fontSize:15,bold:true,color:"03240F",align:"center",valign:"middle",margin:0});
  s.addText(title,{x:0.25,y:0.09,w:9.05,h:0.42,fontFace:F,fontSize:17.5,bold:true,color:DGRN,margin:0,lineSpacingMultiple:0.95});
  s.addText(sub,{x:0.25,y:0.52,w:9.2,h:0.3,fontFace:F,fontSize:10,color:MUT,italic:true,margin:0});
}
function foot(s,txt){
  s.addShape(p.shapes.ROUNDED_RECTANGLE,{x:0.25,y:5.28,w:9.5,h:0.3,rectRadius:0.05,fill:{color:LAV}});
  s.addText([{text:"▶▶  ",options:{bold:true,color:DGRN}},{text:txt,options:{italic:true,color:DGRN}}],{x:0.4,y:5.27,w:9.2,h:0.31,fontFace:F,fontSize:9.5,valign:"middle",margin:0});
}
function db(s,x,y,w,h,color){ s.addShape(p.shapes.ROUNDED_RECTANGLE,{x,y,w,h,rectRadius:0.06,fill:{color:WHITE},line:{color:color||DGRN,width:1.25,dashType:"dash"}}); }
function fb(s,x,y,w,h,fill){ s.addShape(p.shapes.ROUNDED_RECTANGLE,{x,y,w,h,rectRadius:0.06,fill:{color:fill},line:{color:LINE,width:0.5}}); }
function kick(s,x,y,w,txt,color){ s.addText(txt.toUpperCase(),{x,y,w,h:0.24,fontFace:F,fontSize:9.5,bold:true,color:color||DGRN,charSpacing:0.8,margin:0}); }
function tx(s,x,y,w,h,t,fs,color,ls){ s.addText(t,{x,y,w,h,fontFace:F,fontSize:fs||8.5,color:color||INK,margin:0,lineSpacingMultiple:ls||1.04}); }
function rtx(s,x,y,w,h,runs,fs,ls){ s.addText(runs,{x,y,w,h,fontFace:F,fontSize:fs||8.5,margin:0,lineSpacingMultiple:ls||1.04}); }
function chip(s,x,y,w,txt,fill,color){ s.addShape(p.shapes.ROUNDED_RECTANGLE,{x,y,w,h:0.24,rectRadius:0.04,fill:{color:fill}}); s.addText(txt,{x,y,w,h:0.24,fontFace:F,fontSize:8,bold:true,color:color||WHITE,align:"center",valign:"middle",margin:0}); }
function bar(s,x,y,wmax,frac,val,label,color){
  s.addShape(p.shapes.ROUNDED_RECTANGLE,{x,y,w:Math.max(0.18,wmax*frac),h:0.2,rectRadius:0.03,fill:{color:color||DGRN}});
  s.addText(val,{x:x+0.04,y,w:0.7,h:0.2,fontFace:F,fontSize:8,bold:true,color:WHITE,valign:"middle",margin:0});
  s.addText(label,{x:x+wmax+0.08,y,w:2.4,h:0.2,fontFace:F,fontSize:8.5,color:INK,valign:"middle",margin:0});
}

/* ================= S1 — MARKET ================= */
let s=slide();
head(s,"Every music app perfects what to recommend; none give a reason to accept it",
  "The gap isn't accuracy — Spotify already leads there. It's acceptance: engaged listeners won't press play on the unfamiliar.");
kick(s,0.25,0.86,4.2,"Market gap — what each app offers vs what's missing",CORAL);
// competitor table
const cg=[["Spotify","Best-in-class recsys — Discover Weekly, DJ, Daylist","No reason to trust a new pick"],
["Apple Music","Human editorial curation","Not personal; no per-user 'why'"],
["YouTube Music","Huge catalog + video","Recs echo history; weak long-tail"],
["Gaana","Deep regional / Bollywood","Chart & popularity-led discovery"],
["JioSaavn","Regional scale + podcasts","No personalized narrative"]];
const trow=[[{text:"Platform",options:{bold:true,color:WHITE,fill:{color:DGRN}}},{text:"What they offer",options:{bold:true,color:WHITE,fill:{color:DGRN}}},{text:"What's missing",options:{bold:true,color:WHITE,fill:{color:CORAL}}}]]
  .concat(cg.map((r,i)=>[{text:r[0],options:{bold:true,color:i===0?DGRN:INK}},{text:r[1],options:{color:INK}},{text:r[2],options:{bold:true,color:CORAL}}]));
s.addTable(trow,{x:0.25,y:1.12,w:5.05,colW:[1.05,2.35,1.65],rowH:0.32,fontFace:F,fontSize:8,valign:"middle",border:{pt:0.5,color:LINE},align:"left",fill:{color:WHITE}});
s.addText("→ Even Spotify only serves the song — never a reason to try it.",{x:0.25,y:3.16,w:5.05,h:0.22,fontFace:F,fontSize:8.5,italic:true,bold:true,color:DGRN,margin:0});
// why spotify first
kick(s,5.5,0.86,4.2,"Why Spotify solves this first",DGRN);
const why=[["Biggest discovery surface","~675M MAU · 263M Premium — the most to gain from acceptance"],
["Accuracy already solved","Best recsys in market; the only frontier left is acceptance"],
["Native, no cold-start","Three-layer trust (friend → taste-twin → AI) fits Search & Home"]];
why.forEach((w,i)=>{const y=1.14+i*0.66; db(s,5.5,y,4.25,0.58,DGRN);
  s.addText(w[0],{x:5.62,y:y+0.05,w:4.0,h:0.24,fontFace:F,fontSize:9.5,bold:true,color:DGRN,margin:0});
  s.addText(w[1],{x:5.62,y:y+0.29,w:4.05,h:0.26,fontFace:F,fontSize:8.5,color:INK,margin:0,lineSpacingMultiple:1.0});});
// stats row
const st=[["~30%","of listening is repeat / familiar","↑"],["−12%","genre diversity in 6 mo · Discover Weekly (research)","↓"],["19.4%","of analyzed reviews cite repetition / discovery pain","•"]];
st.forEach((c,i)=>{const x=0.25+i*1.72; fb(s,x,3.5,1.62,0.72,GT);
  s.addText(c[0],{x,y:3.55,w:1.62,h:0.34,fontFace:F,fontSize:18,bold:true,color:DGRN,align:"center",margin:0});
  s.addText(c[1],{x:x+0.06,y:3.9,w:1.5,h:0.3,fontFace:F,fontSize:7,color:MUT,align:"center",margin:0,lineSpacingMultiple:0.95});});
db(s,5.35,3.5,4.4,0.72,BLU);
s.addText([{text:"Research:  ",options:{bold:true,color:BLU}},{text:"narrative 'transportation' raises willingness to try the unfamiliar — a story, not a score, drives acceptance (taste-broadening serendipity, 2024).",options:{italic:true,color:INK}}],{x:5.48,y:3.55,w:4.15,h:0.62,fontFace:F,fontSize:8.5,valign:"middle",margin:0,lineSpacingMultiple:1.03});
// problem / business / product
const bpp=[["PROBLEM STATEMENT",CORAL,"Spotify serves new music, but engaged users won't act on it — the unfamiliar arrives with no reason to trust it, so they skip back to the loop."],
["BUSINESS OUTCOME",DGRN,"Repetition → boredom → churn risk for the highest-LTV cohort. Discovery drives catalog breadth, the artist economy, and retention."],
["PRODUCT OUTCOME",BLU,"Move Spotify from 'serves the song' to 'earns the play' — own the acceptance layer no rival has built."]];
bpp.forEach((c,i)=>{const x=0.25+i*3.19; kick(s,x,4.34,3.1,c[0],c[1]);
  tx(s,x,4.58,3.05,0.64,c[2],8,INK,1.03);});
foot(s,"If the gap is real, does it show in real Spotify reviews? Let's look →");

/* ================= S2 — RESEARCH ================= */
s=slide();
head(s,"We didn't survey 30 people — we analyzed 7,296 reviews; repetition is the #1 pain",
  "AI review engine across App Store · Play Store · YouTube · Spotify Community. Every claim cites a real review — no fabrication.");
// 1 review findings
db(s,0.25,0.9,3.15,3.3,DGRN); kick(s,0.4,0.98,2.9,"1 · Review findings (n=7,296)",DGRN);
const rf=[["7,296","reviews analyzed"],["1,147","LLM-labeled"],["19.4%","cite discovery pain"],["#1","theme = stale/repetitive"]];
rf.forEach((r,i)=>{const x=0.4+(i%2)*1.5, y=1.26+Math.floor(i/2)*0.6; fb(s,x,y,1.42,0.52,GT);
  s.addText(r[0],{x,y:y+0.03,w:1.42,h:0.3,fontFace:F,fontSize:14,bold:true,color:DGRN,align:"center",margin:0});
  s.addText(r[1],{x:x+0.04,y:y+0.32,w:1.34,h:0.2,fontFace:F,fontSize:7,color:MUT,align:"center",margin:0});});
s.addText("What reviewers ask for",{x:0.4,y:2.52,w:2.9,h:0.2,fontFace:F,fontSize:8.5,bold:true,color:INK,margin:0});
[["41%","More variety",0.41],["33%","Less repetition",0.33],["17%","A real shuffle",0.17],["9%","Better new-music",0.09]].forEach((b,i)=>{bar(s,0.4,2.76+i*0.3,1.1,b[2],b[0],b[1],DGRN);});
s.addText("Source: labeled review sample (Groq)",{x:0.4,y:4.0,w:3.0,h:0.18,fontFace:F,fontSize:7,italic:true,color:BLU,margin:0});
// 2 sentiment
db(s,3.5,0.9,2.85,3.3,AMBER); kick(s,3.65,0.98,2.6,"2 · Sentiment (from ★ ratings)",AMBER);
const sent=[["1,933","Negative",CORAL],["627","Neutral",AMBER],["3,449","Positive",DGRN]];
sent.forEach((c,i)=>{const y=1.3+i*0.62; fb(s,3.65,y,2.55,0.54,WHITE);
  s.addShape(p.shapes.OVAL,{x:3.75,y:y+0.15,w:0.24,h:0.24,fill:{color:c[2]}});
  s.addText(c[0],{x:4.1,y:y+0.05,w:1.0,h:0.44,fontFace:F,fontSize:15,bold:true,color:c[2],valign:"middle",margin:0});
  s.addText(c[1],{x:5.05,y:y+0.05,w:1.1,h:0.44,fontFace:F,fontSize:9,color:INK,valign:"middle",margin:0});});
s.addText("Discovery complaints skew negative — and come disproportionately from Premium power users.",{x:3.65,y:3.22,w:2.6,h:0.6,fontFace:F,fontSize:8,italic:true,color:INK,margin:0,lineSpacingMultiple:1.05});
s.addText("Source: 7,296 cleaned reviews",{x:3.65,y:4.0,w:2.6,h:0.18,fontFace:F,fontSize:7,italic:true,color:BLU,margin:0});
// 3 verbatim
db(s,6.45,0.9,3.3,3.3,CORAL); kick(s,6.6,0.98,3.0,"3 · What real users said (cited)",CORAL);
const vq=[["“…locks us into a comfortable but repetitive bubble.”","Community · #6077"],
["“…stuck in a sink hole surrounded by my 2020 top songs.”","Community · #6072"],
["“Repeating the same 30 songs out of 3000 isn't shuffle.”","App Store · #4896"]];
vq.forEach((q,i)=>{const y=1.3+i*0.92; fb(s,6.6,y,3.0,0.82,GT);
  s.addText(q[0],{x:6.72,y:y+0.06,w:2.78,h:0.5,fontFace:F,fontSize:9,italic:true,color:INK,margin:0,lineSpacingMultiple:1.03});
  s.addText(q[1],{x:6.72,y:y+0.58,w:2.78,h:0.2,fontFace:F,fontSize:7.5,bold:true,color:DGRN,margin:0});});
// secondary
fb(s,0.25,4.28,9.5,0.72,BT);
rtx(s,0.4,4.34,9.25,0.62,[{text:"Secondary research:  ",options:{bold:true,color:BLU}},
 {text:"personalization drives homogenization (popularity bias); Discover Weekly narrows genre diversity as engagement rises; narrative transportation lifts acceptance of the unfamiliar. ",options:{color:INK}},
 {text:"Adoption is outpacing acceptance — every accuracy upgrade widens the gap.",options:{bold:true,color:INK}}],8.5,1.05);
foot(s,"Reviews prove it. But who feels it most, and where does discovery break? →");

/* ================= S3 — PERSONA + JOURNEY ================= */
s=slide();
head(s,"Engaged Explorers want new music — they just won't gamble a skip on it",
  "Target: high-tenure Premium power users doing active discovery — the loudest, most-articulate discovery complaints in the reviews.");
fb(s,0.25,0.86,9.5,0.42,LAV);
rtx(s,0.4,0.88,9.25,0.38,[{text:"Why this segment:  ",options:{bold:true,color:DGRN}},
 {text:"highest LTV, feel the pain most, and are the most articulate — they drive the discovery complaints (19.4% of reviews). Win them, then expand to all Premium.",options:{color:INK}}],9,1.0);
// personas
const per=[["Aarav, 27 · Bengaluru","“The Looper” — Premium 4 yrs, 15 hrs/wk, 2,000+ saves","Trusts his own saves; skeptical of algorithmic 'new'.","A reason to believe a new track fits before he risks a listen.","Opens Discover Weekly, skims, retreats to the same 6 playlists.","“everything it shows me, I've basically already heard.”  — reviewer"],
["Priya, 24 · Mumbai","“The Curator” — Premium 3 yrs, shares constantly","Trusts friends & scenes, not black-box recs.","To know WHO and WHY behind a pick.","Only tries music friends share; ignores algo recs entirely.","“if a friend puts me on, I'll try almost anything.”  — reviewer"]];
per.forEach((c,i)=>{const x=0.25+i*4.8; db(s,x,1.34,4.6,1.86,DGRN);
  s.addText(c[0],{x:x+0.12,y:1.4,w:4.35,h:0.24,fontFace:F,fontSize:11,bold:true,color:DGRN,margin:0});
  s.addText(c[1],{x:x+0.12,y:1.63,w:4.35,h:0.22,fontFace:F,fontSize:8,italic:true,color:MUT,margin:0});
  rtx(s,x+0.12,1.86,4.4,0.3,[{text:"Trust pattern: ",options:{bold:true,color:INK}},{text:c[2],options:{color:INK}}],8);
  rtx(s,x+0.12,2.16,4.4,0.3,[{text:"Unmet need: ",options:{bold:true,color:CORAL}},{text:c[3],options:{color:INK}}],8);
  rtx(s,x+0.12,2.46,4.4,0.3,[{text:"Behavioral trap: ",options:{bold:true,color:AMBER}},{text:c[4],options:{color:INK}}],8);
  s.addText(c[5],{x:x+0.12,y:2.84,w:4.4,h:0.3,fontFace:F,fontSize:8.5,italic:true,bold:true,color:DGRN,margin:0});});
// journey
kick(s,0.25,3.28,9.4,"User journey — what's hidden at every stage",DGRN);
const jr=[["Open","wants something new","limited time; won't gamble it"],["Served","familiar-leaning picks","recsys optimizes replay, not novelty"],["Unfamiliar","a new track appears","no story, no trust signal"],["Skip","skips in ~5s","no reason to risk the listen"],["Loop","back to the same playlist","algo reads skip as 'dislike' → narrows"]];
jr.forEach((j,i)=>{const x=0.25+i*1.92; const brk=i===3; fb(s,x,3.54,1.82,1.06,brk?PT:WHITE); if(!brk) s.addShape(p.shapes.ROUNDED_RECTANGLE,{x,y:3.54,w:1.82,h:1.06,rectRadius:0.05,fill:{type:"none"},line:{color:LINE,width:0.75}});
  s.addText((i+1)+" · "+j[0],{x:x+0.07,y:3.6,w:1.7,h:0.24,fontFace:F,fontSize:9.5,bold:true,color:brk?CORAL:DGRN,margin:0});
  s.addText(j[1],{x:x+0.08,y:3.86,w:1.68,h:0.3,fontFace:F,fontSize:8,color:INK,margin:0,lineSpacingMultiple:1.0});
  rtx(s,x+0.08,4.18,1.68,0.4,[{text:"Hidden: ",options:{bold:true,color:brk?CORAL:MUT}},{text:j[2],options:{italic:true,color:MUT}}],7.5,1.0);
  if(i<4) s.addText("→",{x:x+1.8,y:3.9,w:0.14,h:0.3,fontFace:F,fontSize:12,bold:true,color:GRN,align:"center",margin:0});});
rtx(s,0.25,4.72,9.5,0.42,[{text:"Core insight: ",options:{bold:true,color:DGRN}},{text:"the failure isn't a bad song — it's the silent skip. Discovery breaks at acceptance, not accuracy; every skip teaches the algorithm to narrow further.",options:{color:INK}}],9,1.03);
foot(s,"We know where trust breaks. Now let's frame the underlying problem →");

/* ================= S4 — PROBLEM FRAMING ================= */
s=slide();
head(s,"The problem isn't accuracy; it's that a new track arrives with no reason to trust it",
  "Problem-framing canvas — a structural diagnosis of the acceptance gap.");
db(s,0.25,0.9,3.05,2.0,CORAL); kick(s,0.4,0.98,2.8,"1 · What is the true problem?",CORAL);
tx(s,0.4,1.24,2.78,1.6,"Spotify serves the unfamiliar with no story and no signal, so engaged users can't tell a worth-it new track from a risky one — and they skip. It is not an accuracy problem (recs are good). It is an acceptance problem: no reason to say yes.",8.5,INK,1.08);
db(s,3.45,0.9,3.05,2.0,DGRN); kick(s,3.6,0.98,2.8,"2 · Who faces this problem?",DGRN);
tx(s,3.6,1.24,2.78,0.5,"Engaged Explorers — high-tenure Premium power users doing active discovery.",8.5,INK,1.05);
fb(s,3.6,1.72,2.78,0.48,GT); tx(s,3.68,1.76,2.64,0.42,"Persona 1 · The Looper — trusts own saves, skips algo 'new'.",8,INK,1.0);
fb(s,3.6,2.24,2.78,0.48,GT); tx(s,3.68,2.28,2.64,0.42,"Persona 2 · The Curator — trusts friends, ignores black-box recs.",8,INK,1.0);
s.addText("Largest, highest-LTV, most-articulate discovery cohort.",{x:3.6,y:2.75,w:2.78,h:0.13,fontFace:F,fontSize:7.5,italic:true,color:MUT,margin:0});
db(s,6.65,0.9,3.1,2.0,BLU); kick(s,6.8,0.98,2.85,"3 · How do we know it's a problem?",BLU);
[["Reviews","19.4% cite repetition; #1 theme"],["Sentiment","discovery skews negative"],["Verbatim","Community #6077 / #6072"],["Secondary","diversity drops on Discover Weekly"],["Market","no rival shows a 'why'"]].forEach((r,i)=>{const y=1.24+i*0.32; rtx(s,6.8,y,2.85,0.3,[{text:r[0]+": ",options:{bold:true,color:BLU}},{text:r[1],options:{color:INK}}],8,1.0);});
db(s,0.25,3.0,5.05,2.02,DGRN); kick(s,0.4,3.08,4.8,"4 · Value generated by solving this",DGRN);
s.addText("For Engaged Explorers",{x:0.4,y:3.34,w:2.3,h:0.2,fontFace:F,fontSize:8.5,bold:true,color:INK,margin:0});
tx(s,0.4,3.56,2.3,1.3,"Hear genuinely new music they'll love — without gambling a skip. Discovery becomes trustworthy, not a risk. The bubble finally widens.",8.5,INK,1.1);
s.addText("For Spotify",{x:2.9,y:3.34,w:2.3,h:0.2,fontFace:F,fontSize:8.5,bold:true,color:INK,margin:0});
tx(s,2.9,3.56,2.35,1.3,"Retain the highest-LTV cohort, deepen sessions, widen catalog & the artist economy, and own the acceptance layer as a durable moat.",8.5,INK,1.1);
db(s,5.45,3.0,4.3,2.02,AMBER); kick(s,5.6,3.08,4.05,"5 · Why should we solve this now?",AMBER);
[["Accuracy is saturating","every model upgrade improves recs and widens the acceptance gap — the unsolved half."],["AI unlocks it now","generative AI makes a grounded, personal 'why' per (user × track) possible at scale for the first time."],["First-mover window","no competitor shows a reason to accept — ship first and it becomes part of the brand."]].forEach((r,i)=>{const y=3.34+i*0.56; s.addText(r[0],{x:5.6,y,w:4.05,h:0.2,fontFace:F,fontSize:8.5,bold:true,color:AMBER,margin:0}); tx(s,5.6,y+0.2,4.05,0.34,r[1],8,INK,1.0);});
foot(s,"Problem framed. How many ways could we solve it — and which wins? →");

/* ================= S5 — HYPOTHESES + RICE ================= */
s=slide();
head(s,"If a new track arrives with a reason to trust it, engaged users will press play",
  "Three hypotheses tested against RICE (Reach × Impact × Confidence ÷ Effort). One chosen.");
const hy=[["H1 · User hypothesis",GRN,"The block is acceptance, not accuracy — a grounded, personal 'why' converts a skip into a play.","Fixes the CAUSE: users skip the unfamiliar because nothing tells them it's worth the risk.","Chosen"],
["H2 · Business hypothesis",AMBER,"Repetition drives churn/disengagement for high-LTV users; fixing discovery retains them.","Valid but derivative — retention is the EFFECT of the user problem H1 solves.",""],
["H3 · Market hypothesis",BLU,"No rival shows a 'why'; being first owns the trust position permanently.","True but passive — it's branding, not a change in behavior at the moment of choice.",""]];
hy.forEach((h,i)=>{const x=0.25+i*3.19; db(s,x,0.9,3.05,2.2,h[1]);
  s.addText(h[0],{x:x+0.12,y:0.97,w:2.2,h:0.24,fontFace:F,fontSize:10.5,bold:true,color:h[1],margin:0});
  if(h[4]) chip(s,x+2.35,0.97,0.6,"CHOSEN",GRN,"03240F");
  tx(s,x+0.12,1.28,2.8,0.9,h[2],9,INK,1.06);
  fb(s,x+0.12,2.22,2.8,0.8,i===0?GT:(i===1?AT:BT));
  tx(s,x+0.2,2.28,2.64,0.7,h[3],8,INK,1.05);});
// RICE table
kick(s,0.25,3.24,6.0,"RICE framework — why H1 wins",DGRN);
const rice=[["R",[10,4,6],["every listener, every session","needs multi-session data first","visible but passive"]],
["I",[9,6,3],["converts skip→play at decision","delayed — needs learning time","sounds good, no behavior change"]],
["C",[8,6,4],["7,296 reviews + segment","sound logic, no validation data","no proof positioning shifts trust"]],
["E",[7,5,6],["LLM + embeddings, prototyped","needs tracking + perso engine","branding effort, low intervention"]]];
let ry=3.44;
rice.forEach((row,ri)=>{ s.addText(row[0],{x:0.25,y:ry,w:0.2,h:0.34,fontFace:F,fontSize:9,bold:true,color:DGRN,valign:"middle",margin:0});
  [0,1,2].forEach(ci=>{const x=0.5+ci*1.95; const col=[GRN,AMBER,BLU][ci]; const frac=row[1][ci]/10;
    s.addShape(p.shapes.ROUNDED_RECTANGLE,{x,y:ry+0.02,w:0.35+1.4*frac,h:0.16,rectRadius:0.02,fill:{color:col}});
    s.addText(String(row[1][ci]),{x:x+0.03,y:ry+0.02,w:0.3,h:0.16,fontFace:F,fontSize:7.5,bold:true,color:WHITE,valign:"middle",margin:0});
    s.addText(row[2][ci],{x:x,y:ry+0.19,w:1.9,h:0.16,fontFace:F,fontSize:6.8,italic:true,color:MUT,margin:0});});
  ry+=0.37;});
s.addText("Score",{x:0.25,y:ry,w:0.25,h:0.2,fontFace:F,fontSize:8.5,bold:true,color:DGRN,margin:0});
[["116",GRN],["60",AMBER],["7",BLU]].forEach((sc,ci)=>{const x=0.5+ci*1.95; chip(s,x,ry,0.7,sc[0],sc[1],WHITE);});
// verdict
db(s,6.5,3.24,3.25,1.78,GRN);
s.addText("🏆  H1 wins by ~2× over H2 and ~16× over H3.",{x:6.65,y:3.34,w:2.95,h:0.4,fontFace:F,fontSize:10,bold:true,color:DGRN,margin:0,lineSpacingMultiple:1.0});
tx(s,6.65,3.8,2.95,1.1,"H1 attacks the cause — the moment a user decides whether to trust a new track. H2 is the business effect of solving H1; H3 is positioning. Next: the solutions that deliver H1.",8.5,INK,1.08);
foot(s,"Hypothesis locked. Four solutions explored — one chosen →");

/* ================= S6 — SOLUTION IDEATION ================= */
s=slide();
head(s,"Off Repeat wins — it gives a reason to try, not another way to search or shuffle",
  "Four solutions explored for H1. One chosen; three rejected with evidence.");
const sol=[["S1 · Prompted discovery","REJECTED","Tell discovery what you want in words.","Spotify already shipped AI DJ / Prompted Playlist — still serves, gives no reason to trust a new pick.","“everything it shows me I've already heard.”"],
["S2 · Social vouching only","REJECTED","Show only 'liked by a friend'.","Strong trust, but Spotify's social graph is thin — cold-start kills it for most tracks and users.","cold-start: no friends = no signal"],
["S3 · Facts & credits","REJECTED","Show song facts / credits (SongDNA-style).","Facts ≠ a reason to care; no personal 'why this, for you' — it informs, it doesn't persuade.","“…isn't shuffle.” — App Store #4896"]];
sol.forEach((c,i)=>{const x=0.25+i*3.19; db(s,x,0.9,3.05,1.86,CORAL);
  s.addText(c[0],{x:x+0.12,y:0.97,w:2.15,h:0.24,fontFace:F,fontSize:10,bold:true,color:INK,margin:0});
  chip(s,x+2.3,0.97,0.65,c[1],CORAL,WHITE);
  tx(s,x+0.12,1.26,2.8,0.34,c[2],8.5,INK,1.02);
  tx(s,x+0.12,1.62,2.8,0.72,"✗ "+c[3],8.5,CORAL,1.05);
  s.addText(c[4],{x:x+0.12,y:2.4,w:2.8,h:0.3,fontFace:F,fontSize:8,italic:true,color:MUT,margin:0,lineSpacingMultiple:1.0});});
// chosen
db(s,0.25,2.86,5.35,2.16,GRN);
s.addText("S4 · Off Repeat",{x:0.4,y:2.94,w:2.5,h:0.26,fontFace:F,fontSize:12,bold:true,color:DGRN,margin:0});
chip(s,2.9,2.96,0.65,"CHOSEN",GRN,"03240F");
tx(s,0.4,3.24,5.05,0.4,"AI introduces each new track with a short, grounded, personal story + a three-layer trust cue.",9,INK,1.05);
const comp=[["✎ AI story","always on — the reason to try, per (you × track)"],["👥 Taste-twin","'popular with your taste' — collaborative signal"],["❤ Real friend","'Liked by Nitya' — strongest trust when present"],["✦ New-to-you","novelty guarantee — never what you already play"]];
comp.forEach((c,i)=>{const x=0.4+(i%2)*2.55, y=3.66+Math.floor(i/2)*0.62; fb(s,x,y,2.45,0.54,GT);
  s.addText(c[0],{x:x+0.08,y:y+0.05,w:2.3,h:0.2,fontFace:F,fontSize:8.5,bold:true,color:DGRN,margin:0});
  s.addText(c[1],{x:x+0.08,y:y+0.25,w:2.3,h:0.26,fontFace:F,fontSize:7.5,color:INK,margin:0,lineSpacingMultiple:0.95});});
// why wins
db(s,5.75,2.86,4.0,2.16,DGRN); kick(s,5.9,2.94,3.7,"Why Off Repeat wins against each",DGRN);
[["Vs S1","gives a reason, not just steering — a story converts the skip."],["Vs S2","works with zero friends — the AI story is always on; social is a bonus."],["Vs S3","personal 'why this, for you' — not generic facts. Grounded, no fabrication."]].forEach((r,i)=>{const y=3.24+i*0.58; s.addText(r[0],{x:5.9,y,w:0.7,h:0.36,fontFace:F,fontSize:9,bold:true,color:GRN,valign:"middle",margin:0}); tx(s,6.55,y,3.1,0.52,r[1],8.5,INK,1.03);});
foot(s,"Solution chosen. Now see it work — the live prototype →");

/* ================= S7 — MVP WALKTHROUGH ================= */
s=slide();
head(s,"It's not theoretical — here's the live Off Repeat app, running in Spotify's UI",
  "Self-contained web app; AI writes each story live from your taste. Three screens, every button works.");
const shots=[["shot_home.png","① Home","One clear entry: 'You're on repeat — break out.'  Recently-played loop + a single tap into Off Repeat."],
["shot_search.png","② Search","Discovery lives in Search (not a bolt-on tab): a featured Off Repeat card + 'Browse all' taste tiles."],
["shot_disc.png","③ Off Repeat","A Spotify playlist page: cover, controls, and flat track rows — each with its AI story + trust cue."]];
shots.forEach((sh,i)=>{const cx=0.25+i*3.19; const px=cx+(3.05-1.28)/2;
  s.addText(sh[1],{x:cx,y:0.88,w:3.05,h:0.24,fontFace:F,fontSize:11,bold:true,color:DGRN,align:"center",margin:0});
  s.addImage({path:sh[0],x:px,y:1.16,w:1.28,h:2.44});
  tx(s,cx+0.05,3.66,2.95,0.7,sh[2],8.5,INK,1.06);});
// callout row
fb(s,0.25,4.42,9.5,0.5,GT);
rtx(s,0.4,4.46,9.25,0.42,[{text:"Every button works:  ",options:{bold:true,color:DGRN}},
 {text:"play · save · Save-all · 'Weirder' (deeper cuts) · Different-genre · Your Library. Trust cue is dynamic — 'Liked by Nitya', 'Popular with your taste', or 'Picked for you'.",options:{color:INK}}],8.5,1.03);
db(s,0.25,4.96,9.5,0.26,BLU);
rtx(s,0.4,4.96,9.25,0.26,[{text:"▶ Live app + workflow: ",options:{bold:true,color:BLU}},{text:"github.com/arjuncooliitr/spotify-discovery-engine",options:{color:INK}},{text:"    ·   How to use: pick your taste → stories generate live → play & save.",options:{italic:true,color:MUT}}],8,1.0);
foot(s,"Now the system under the hood — data flow, nudges, edge cases →");

/* ================= S8 — ARCHITECTURE ================= */
s=slide();
head(s,"Two engines, one grounded backbone — find the acceptance gap, then close it",
  "How it works under the hood: data flow, research grounding, behavioral nudges, and edge cases.");
// left: two pipelines
kick(s,0.25,0.88,4.6,"Data flow — research engine → product engine",DGRN);
const eng=[["① Review engine","Collect (4 sources) → LLM label → embed + retrieve (MiniLM 384-d) → grounded synthesis → 💡 insight: acceptance gap"],
["② Off Repeat MVP","Signals → taste vector → retrieve novel → novelty filter → grounded story + trust (LLM/RAG) → serve + learn ↻"]];
eng.forEach((e,i)=>{const y=1.14+i*0.82; db(s,0.25,y,4.6,0.72,i===0?BLU:GRN);
  s.addText(e[0],{x:0.37,y:y+0.05,w:4.35,h:0.22,fontFace:F,fontSize:9.5,bold:true,color:i===0?BLU:DGRN,margin:0});
  tx(s,0.37,y+0.28,4.4,0.42,e[1],8,INK,1.04);});
fb(s,0.25,2.86,4.6,0.9,LAV);
rtx(s,0.37,2.92,4.4,0.8,[{text:"How it works:  ",options:{bold:true,color:DGRN}},{text:"user opens Off Repeat → retrieval picks novel, taste-matched tracks → one LLM call writes a grounded story per track (RAG over real artist facts) → trust assigned by rule → rendered in the Spotify UI; adoption feeds back. Added latency ~1–2s; cached per taste.",options:{color:INK}}],8,1.05);
kick(s,0.25,3.86,4.6,"Behavioral nudges built in",AMBER);
[["Break-the-loop card","the first pick bridges from the familiar loop"],["One-line story default","glanceable; full story on tap — no fatigue"],["Save-all + 'Weirder'","low-friction commitment + deeper exploration"]].forEach((r,i)=>{const y=4.12+i*0.36; rtx(s,0.25,y,4.6,0.34,[{text:"• "+r[0]+" — ",options:{bold:true,color:INK}},{text:r[1],options:{color:MUT}}],8,1.0);});
// right: why each component + edge cases
kick(s,5.0,0.88,4.75,"Why each component exists — traced to reviews",DGRN);
const wc=[["Grounded story","review #1 pain = repetition; users want a reason, not a score"],["Trust layer","reviewers trust friends & 'people like me', not black-box recs"],["Novelty filter","'same 30 songs' (#4896) → must be genuinely new to you"],["No-fabrication guardrail","a trust feature can't lie → RAG over real artist facts"]];
wc.forEach((r,i)=>{const y=1.14+i*0.52; rtx(s,5.0,y,4.75,0.5,[{text:r[0]+":  ",options:{bold:true,color:DGRN}},{text:r[1],options:{italic:true,color:INK}}],8.5,1.02);});
db(s,5.0,3.28,4.75,1.74,CORAL); kick(s,5.15,3.36,4.5,"Edge cases handled",CORAL);
[["E1 Background listening","Off Repeat is opt-in / lean-in only — never interrupts passive play."],["E2 Cold start","AI story works alone; taste-twin fills in; friend is a bonus."],["E3 Thin long-tail data","confidence-gate; fall back to safe cues; never invent facts."],["E4 Latency/cost at scale","cache per taste; batch; live gen for high-intent surfaces only."]].forEach((r,i)=>{const y=3.62+i*0.35; rtx(s,5.15,y,4.5,0.33,[{text:r[0]+": ",options:{bold:true,color:CORAL}},{text:r[1],options:{color:INK}}],7.8,1.0);});
foot(s,"System designed. Now success metrics, leading indicators & guardrails →");

/* ================= S9 — METRICS ================= */
s=slide();
head(s,"One North Star for the behavior shift, four indicators to prove it, guardrails to protect it",
  "Every threshold derived from our review analysis (n=7,296) with secondary research woven in.");
db(s,0.25,0.9,9.5,1.02,DGRN);
s.addText("★ North Star",{x:0.4,y:1.0,w:1.5,h:0.24,fontFace:F,fontSize:11,bold:true,color:DGRN,margin:0});
s.addText("Meaningful Discovery Rate",{x:0.4,y:1.24,w:2.4,h:0.4,fontFace:F,fontSize:12,bold:true,color:INK,margin:0,lineSpacingMultiple:0.95});
s.addText([{text:"35% (M3) → 60% (M12)",options:{bold:true,color:DGRN}}],{x:0.4,y:1.6,w:2.4,h:0.24,fontFace:F,fontSize:10,margin:0});
rtx(s,2.95,1.0,6.75,0.9,[{text:"Definition:  ",options:{bold:true,color:DGRN}},{text:"% of weekly listening on newly-adopted artists. Un-gameable — counts only when SURFACED (new to you) + TRIED (≥30s) + KEPT (saved & returned in 7d).  ",options:{color:INK}},
 {text:"Why:  ",options:{bold:true,color:DGRN}},{text:"opening the feature and walking away is worth zero — we measure a behavior change, not a click.  ",options:{color:INK}},
 {text:"If it stalls:  ",options:{bold:true,color:CORAL}},{text:"Off Repeat is informational, not persuasive → strengthen the story & the break-the-loop bridge.",options:{color:INK}}],8.5,1.06);
kick(s,0.25,2.02,4.0,"😀 Leading indicators",CORAL);
const li=[["> 25%  Story-attach try-rate","A/B: story vs no story. 45% of reviewers ask for a 'reason'.","Below 15% → the story isn't persuading; rewrite & vary voice."],
["> 30%  New-artist save-rate uplift","vs control. Proves adoption, not curiosity.","Below target → refresh the candidate pool; tune retrieval."],
["> 40%  7-day return on adopted artists","they came back — real taste change, not a one-off.","Below 30% → novelty decay; rotate stories, deepen catalog."],
["+30%  Taste breadth by M6","distinct new artists / month — the bubble widening.","Flat → retrieval too safe; push further from the loop."]];
li.forEach((r,i)=>{const x=0.25+(i%2)*4.85, y=2.3+Math.floor(i/2)*1.3; db(s,x,y,4.6,1.18,DGRN);
  s.addText(r[0],{x:x+0.12,y:y+0.06,w:4.35,h:0.24,fontFace:F,fontSize:10,bold:true,color:DGRN,margin:0});
  tx(s,x+0.12,y+0.32,4.35,0.44,r[1],8.5,INK,1.05);
  s.addText(r[2],{x:x+0.12,y:y+0.8,w:4.35,h:0.32,fontFace:F,fontSize:8,bold:true,color:CORAL,margin:0,lineSpacingMultiple:1.0});});
foot(s,"We know what success looks like. Now what could go wrong →");

/* ================= S10 — RISKS ================= */
s=slide();
head(s,"Seven ways this could fail — and the guardrails to catch them",
  "Honest risk assessment with research-backed thresholds and specific mitigations.");
kick(s,0.25,0.88,6.0,"Failure modes & mitigations",CORAL);
const risk=[["Acceptance ≠ the real driver — 'won't play' is often mood/effort, not missing trust.","Validate the driver in Part-2 interviews; ship to lean-in surfaces only; measure by moment.","CRIT"],
["Trust is fragile — one salesy or wrong story and users tune the layer out for good.","RAG grounding + no-fabrication guardrail; style variety; QA on samples.","CRIT"],
["Payola & gaming — pressure to inject promoted tracks; stream-farming the metric.","Firewall from promotion; reward saved+returned, never raw plays.","CRIT"],
["AI becomes a crutch — users stop exploring unaided; a new trust proxy.","Measure unaided exploration; ease off narration as adoption grows.","HIGH"],
["Novelty decay — the first-try lift fades once the story feels normal.","Track 30/90-day adoption retention; refresh story styles.","HIGH"],
["Cold-start / long tail — thin metadata where obscure tracks matter most.","Confidence-gate; safe fallback cues; enrich long-tail data.","HIGH"]];
const rr=[[{text:"What could go wrong",options:{bold:true,color:WHITE,fill:{color:CORAL}}},{text:"How it's handled",options:{bold:true,color:WHITE,fill:{color:DGRN}}},{text:"Sev",options:{bold:true,color:WHITE,fill:{color:INK}}}]]
 .concat(risk.map(r=>[{text:r[0],options:{color:INK}},{text:r[1],options:{color:INK}},{text:r[2],options:{bold:true,color:r[2]==="CRIT"?CORAL:AMBER,align:"center"}}]));
s.addTable(rr,{x:0.25,y:1.14,w:6.0,colW:[2.95,2.5,0.55],rowH:0.5,fontFace:F,fontSize:7.8,valign:"middle",border:{pt:0.5,color:LINE},align:"left",fill:{color:WHITE}});
// guardrails
kick(s,6.45,0.88,3.3,"Guardrails",DGRN);
const gr=[["< 3% false 'why' (hallucination)","the highest-risk failure — strictest threshold; drop invented claims.","CRIT"],
["Skip-rate flat / down","protect core listening — Off Repeat must not raise skips."," "],
["Unaided-exploration not falling","proof we're not creating a crutch."," "],
["Reward saved + returned, not plays","kills stream-farming incentives at the metric level."," "]];
gr.forEach((g,i)=>{const y=1.16+i*0.92; db(s,6.45,y,3.3,0.84,g[2]==="CRIT"?CORAL:DGRN);
  if(g[2]==="CRIT") chip(s,6.57,y+0.08,0.7,"CRITICAL",CORAL,WHITE);
  s.addText(g[0],{x:6.57,y:g[2]==="CRIT"?y+0.34:y+0.08,w:3.05,h:0.24,fontFace:F,fontSize:9,bold:true,color:DGRN,margin:0});
  tx(s,6.57,g[2]==="CRIT"?y+0.56:y+0.32,3.05,0.24,g[1],7.8,INK,1.0);});
fb(s,0.25,5.28,9.5,0.3,PT);
s.addText([{text:"Off Repeat doesn't eliminate the loop — ",options:{bold:true,color:CORAL}},{text:"it earns the play. The riskiest failures are the ones users don't notice, so we de-risk the acceptance driver in interviews before we build.",options:{color:INK}}],{x:0.4,y:5.27,w:9.2,h:0.31,fontFace:F,fontSize:8.5,valign:"middle",margin:0});

p.writeFile({fileName:"off_repeat_deck_v3.pptx"}).then(f=>console.log("WROTE",f));
