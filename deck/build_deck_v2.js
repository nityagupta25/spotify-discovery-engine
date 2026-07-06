const pptxgen = require("pptxgenjs");
const p = new pptxgen();
p.layout = "LAYOUT_16x9";  // 10 x 5.625
p.author = "Arjun"; p.title = "Off Repeat — Spotify Discovery (Top-Fellow format)";

// palette — Spotify-branded, light infographic (top-fellow density)
const BG="FAF6EF", BAR="0E6B37", GREEN="1DB954", DARK="17241D", MUTE="5C6B62";
const GT="E7F6EC", BT="E6EFF7", PT="FBE3DD", AT="FCF3D9", WHITE="FFFFFF", LINE="D8E5DC", DARKCARD="14110F";
const F="Arial";
const SECTIONS=["Market","Research","Persona & Journey","Problem","Solution","MVP","Architecture","Metrics","Risks"];
const sh=()=>({type:"outer",color:"6B6B6B",blur:7,offset:2,angle:90,opacity:0.22});

function head(s, txt){
  s.background={color:BG};
  s.addShape(p.shapes.RECTANGLE,{x:0,y:0,w:10,h:0.92,fill:{color:BAR}});
  s.addText(txt,{x:0.3,y:0.04,w:9.4,h:0.84,fontFace:F,fontSize:21,bold:true,color:WHITE,align:"center",valign:"middle",margin:0,lineSpacingMultiple:0.95});
}
function crumb(s, idx){
  s.addShape(p.shapes.RECTANGLE,{x:0,y:5.2,w:10,h:0.425,fill:{color:BAR}});
  const runs=[];
  SECTIONS.forEach((t,i)=>{
    runs.push({text:t,options:{color:WHITE,bold:i===idx,transparency:i===idx?0:45,fontSize:i===idx?10:8.5}});
    if(i<SECTIONS.length-1) runs.push({text:"   ",options:{color:WHITE,transparency:60,fontSize:8.5}});
  });
  s.addText(runs,{x:0.2,y:5.2,w:9.6,h:0.425,fontFace:F,align:"center",valign:"middle",margin:0});
}
function card(s,x,y,w,h,fill=WHITE){ s.addShape(p.shapes.ROUNDED_RECTANGLE,{x,y,w,h,rectRadius:0.07,fill:{color:fill},line:{color:LINE,width:1},shadow:sh()}); }
function kicker(s,x,y,w,txt,color=BAR){ s.addText(txt.toUpperCase(),{x,y,w,h:0.26,fontFace:F,fontSize:10,bold:true,color,charSpacing:1.5,margin:0}); }
function rich(s,x,y,w,h,runs,fs=11,ls=1.08){ s.addText(runs,{x,y,w,h,fontFace:F,fontSize:fs,margin:0,lineSpacingMultiple:ls}); }
function bodyText(s,x,y,w,h,t,fs=11,color=DARK,ls=1.08){ s.addText(t,{x,y,w,h,fontFace:F,fontSize:fs,color,margin:0,lineSpacingMultiple:ls}); }

// ============ S0 — COVER ============
{ const c=p.addSlide(); c.background={color:BAR};
  c.addShape(p.shapes.OVAL,{x:0.6,y:0.62,w:0.5,h:0.5,fill:{color:GREEN}});
  c.addText("✦",{x:0.6,y:0.6,w:0.5,h:0.5,fontFace:F,fontSize:22,bold:true,color:"03240F",align:"center",valign:"middle",margin:0});
  c.addText("NEXTLEAP PM FELLOWSHIP   ·   SPOTIFY · GROWTH TEAM",{x:1.25,y:0.7,w:8.2,h:0.35,fontFace:F,fontSize:11,bold:true,color:"BFE9CD",charSpacing:2,valign:"middle",margin:0});
  c.addText("Off Repeat",{x:0.58,y:1.55,w:9,h:1.1,fontFace:F,fontSize:54,bold:true,color:WHITE,margin:0});
  c.addShape(p.shapes.RECTANGLE,{x:0.64,y:2.72,w:2.6,h:0.07,fill:{color:GREEN}});
  c.addText("Spotify perfected recommendation. Discovery still stalls — because the gap was never accuracy. It's acceptance: a reason to press play on the unfamiliar.",{x:0.62,y:3.0,w:8.7,h:1.0,fontFace:F,fontSize:16,color:"F2FBF5",margin:0,lineSpacingMultiple:1.2});
  c.addText("You have On Repeat. Meet Off Repeat.",{x:0.62,y:4.05,w:8.7,h:0.4,fontFace:F,fontSize:14,bold:true,italic:true,color:"7DE0A0",margin:0});
  c.addText([{text:"▶ Live prototype + AI workflow   ·   ",options:{bold:true}},{text:"github.com/arjuncooliitr/spotify-discovery-engine",options:{}}],{x:0.62,y:4.72,w:8.8,h:0.3,fontFace:F,fontSize:10.5,color:WHITE,margin:0});
  c.addText("Figures: Spotify reported MAU / Premium; repeat-listening & genre-diversity from published personalization research. Reviews: 7,296 analyzed via an AI review engine.",{x:0.62,y:5.08,w:8.8,h:0.35,fontFace:F,fontSize:7.5,color:"9CC7AC",margin:0,lineSpacingMultiple:1.0});
}

// ============ S1 — MARKET ============
let s=p.addSlide(); head(s,"Spotify perfected recommendation. Discovery still stalls.");
const stats=[["~675M","monthly active users (reported)",GT],["263M","Premium subscribers",GT],["~30%","of listening is repeat / familiar",PT],["−12%","genre diversity in 6 mo · Discover Weekly (research)",PT]];
stats.forEach((st,i)=>{const x=0.3+i*2.4; card(s,x,1.05,2.25,1.35,st[2]);
  s.addText(st[0],{x:x+0.1,y:1.16,w:2.05,h:0.55,fontFace:F,fontSize:30,bold:true,color:DARK,align:"center",margin:0});
  s.addText(st[1],{x:x+0.12,y:1.74,w:2.0,h:0.6,fontFace:F,fontSize:9.5,color:MUTE,align:"center",margin:0,lineSpacingMultiple:1.0});});
card(s,0.3,2.55,5.7,2.5);
kicker(s,0.5,2.68,5.3,"The discovery paradox");
bodyText(s,0.5,2.98,5.4,0.6,"Spotify owns one of the world's best recommenders — so the bottleneck was never finding new music. It's that engaged listeners won't act on it.",11.5);
const para=[["Algorithm exploits familiarity","the more you listen, the tighter the loop"],["Unfamiliar = unrewarded","no reason to trust a new pick, so users skip"],["Loyalty backfires","heaviest users get the stalest discovery"]];
para.forEach((q,i)=>{const y=3.62+i*0.46; s.addShape(p.shapes.OVAL,{x:0.55,y:y+0.04,w:0.15,h:0.15,fill:{color:GREEN}});
  rich(s,0.8,y-0.05,5.1,0.42,[{text:q[0]+" — ",options:{bold:true,color:DARK}},{text:q[1],options:{color:MUTE}}],11);});
card(s,6.2,2.55,3.5,2.5,GT);
kicker(s,6.4,2.68,3.1,"What's missing",BAR);
bodyText(s,6.4,3.0,3.15,1.4,"Discover Weekly, AI DJ, SongDNA — every fix improves WHAT to recommend. None built the acceptance layer: a reason to press play on the unfamiliar.",12,DARK,1.12);
s.addText("The market gap is acceptance, not accuracy.",{x:6.4,y:4.5,w:3.15,h:0.45,fontFace:F,fontSize:11.5,bold:true,italic:true,color:BAR,margin:0,lineSpacingMultiple:1.05});
crumb(s,0);


// ============ S3 — RESEARCH ============
s=p.addSlide(); head(s,"We didn't survey 30 people. We analyzed 7,296 reviews.");
card(s,0.3,1.05,3.15,3.5,GT);
kicker(s,0.5,1.18,2.8,"AI review engine = research at scale",BAR);
bodyText(s,0.5,1.5,2.8,0.85,"App Store · Play Store · YouTube · Community → one grounded pipeline. Every claim cites a real review; no fabrication.",10.5,DARK,1.1);
const rfind=[["7,296","reviews analyzed"],["1,147","structured-labeled (LLM)"],["#1","frustration = stale / repetitive"],["1,933","negative (from ★ ratings)"]];
rfind.forEach((r,i)=>{const y=2.45+i*0.5; s.addText(r[0],{x:0.5,y,w:0.95,h:0.4,fontFace:F,fontSize:17,bold:true,color:BAR,margin:0});
  s.addText(r[1],{x:1.5,y:y+0.06,w:1.85,h:0.4,fontFace:F,fontSize:10,color:DARK,margin:0,lineSpacingMultiple:1.0});});
card(s,3.6,1.05,3.15,3.5,WHITE);
kicker(s,3.8,1.18,2.8,"What real users said (cited)",BAR);
const quotes=[["“…it locks us into a comfortable but repetitive bubble.”","Community · #6077"],["“…stuck in a sink hole surrounded by my 2020 top songs.”","Community · #6072"],["“Repeating the same 30 songs out of 3000 isn't shuffle.”","App Store · #4896"]];
quotes.forEach((q,i)=>{const y=1.5+i*0.98; card(s,3.75,y,2.85,0.86,GT);
  s.addText(q[0],{x:3.9,y:y+0.07,w:2.6,h:0.55,fontFace:F,fontSize:10.5,italic:true,color:DARK,margin:0,lineSpacingMultiple:1.05});
  s.addText(q[1],{x:3.9,y:y+0.62,w:2.6,h:0.2,fontFace:F,fontSize:8.5,color:BAR,bold:true,margin:0});});
card(s,6.9,1.05,2.8,3.5,BT);
kicker(s,7.05,1.18,2.5,"Primary + secondary",BAR);
bodyText(s,7.05,1.5,2.5,1.0,"Planned: 5–6 interviews with Engaged Explorers (Premium power users).\n[ slot in verbatim quotes ]",10.5,DARK,1.1);
s.addShape(p.shapes.LINE,{x:7.05,y:2.65,w:2.5,h:0,line:{color:LINE,width:1}});
bodyText(s,7.05,2.75,2.5,1.6,"Secondary research:\n• Discover Weekly cut genre diversity ~12% in 6 mo\n• LLMs/algorithms narrow taste as engagement rises\n• Personalization → homogenization (popularity bias)",10,MUTE,1.12);
s.addText("Users aren't failing to discover — they're refusing to accept.",{x:0.3,y:4.62,w:9.4,h:0.5,fontFace:F,fontSize:13,bold:true,italic:true,color:BAR,align:"center",margin:0});
crumb(s,1);

// ============ S4 — PERSONA & JOURNEY ============
s=p.addSlide(); head(s,"Who they are — and the exact moment discovery breaks.");
// 2x2 behavioral segmentation (top-left)
kicker(s,0.3,1.0,3.6,"Behavioral segmentation");
const qx=0.35,qy=1.3,qw=1.72,qh=0.8,qg=0.06;
const quad=[["Comfort Seeker","loves the loop",PT],["Active Digger","self-discovers",GT],["Passive Repeater","skips new, no effort",PT],["Bubble-Trapped Explorer","WANTS new · can't accept",AT]];
[[qx,qy],[qx+qw+qg,qy],[qx,qy+qh+qg],[qx+qw+qg,qy+qh+qg]].forEach((pos,i)=>{
  card(s,pos[0],pos[1],qw,qh,quad[i][2]);
  if(i===3) s.addShape(p.shapes.ROUNDED_RECTANGLE,{x:pos[0],y:pos[1],w:qw,h:qh,rectRadius:0.07,fill:{type:"none"},line:{color:BAR,width:2.5}});
  s.addText(quad[i][0],{x:pos[0]+0.06,y:pos[1]+0.08,w:qw-0.12,h:0.42,fontFace:F,fontSize:9.5,bold:true,color:DARK,align:"center",margin:0,lineSpacingMultiple:0.9});
  s.addText(quad[i][1],{x:pos[0]+0.06,y:pos[1]+0.5,w:qw-0.12,h:0.26,fontFace:F,fontSize:7.5,italic:true,color:MUTE,align:"center",margin:0});});
s.addText("◀ Target   ·   openness →   ·   effort ↓",{x:0.35,y:qy+2*qh+qg+0.03,w:2*qw+qg,h:0.24,fontFace:F,fontSize:8.5,bold:true,color:BAR,align:"center",margin:0});
// persona card (top-right)
card(s,4.1,1.05,5.6,2.0,WHITE);
s.addShape(p.shapes.OVAL,{x:4.28,y:1.24,w:0.66,h:0.66,fill:{color:GT},line:{color:GREEN,width:1.5}});
s.addText("AG",{x:4.28,y:1.24,w:0.66,h:0.66,fontFace:F,fontSize:17,bold:true,color:BAR,align:"center",valign:"middle",margin:0});
s.addText([{text:"Aarav G.  ",options:{bold:true,color:DARK}},{text:"· 27 · Bengaluru · “Bubble-Trapped Explorer”",options:{color:MUTE}}],{x:5.05,y:1.28,w:4.5,h:0.28,fontFace:F,fontSize:11,margin:0});
s.addText("Premium · 4 yrs · 15 hrs/wk · 2,000+ saved songs",{x:5.05,y:1.56,w:4.5,h:0.24,fontFace:F,fontSize:9,color:MUTE,margin:0});
rich(s,4.28,1.98,5.28,0.5,[{text:"JTBD  ",options:{bold:true,color:BAR}},{text:"“Hear something genuinely new I'll love — without gambling my limited listening time on a skip.”",options:{italic:true,color:DARK}}],9,1.06);
rich(s,4.28,2.54,5.28,0.5,[{text:"Trap  ",options:{bold:true,color:BAR}},{text:"recs feel like a rerun of his history · no reason to trust the unfamiliar · retreats to the same playlists.",options:{color:DARK}}],9,1.06);
// user journey strip (bottom) — every stage, and where it breaks
kicker(s,0.3,3.24,9.4,"The user journey — and where it breaks",BAR);
const jstage=[["1 · Open","wants something new","Hopeful"],["2 · Served","familiar-leaning picks","Neutral"],["3 · Unfamiliar","no signal, no story","Wary"],["4 · Skip","nothing to trust","Retreat"],["5 · Familiar","loop tightens","Stuck"]];
let jx=0.3, jw=1.86, jg=0.07;
jstage.forEach((st,i)=>{const x=jx+i*(jw+jg); card(s,x,3.54,jw,1.0,i===3?PT:WHITE);
  s.addText(st[0],{x:x+0.08,y:3.6,w:jw-0.16,h:0.26,fontFace:F,fontSize:10.5,bold:true,color:i===3?BAR:DARK,margin:0});
  s.addText(st[1],{x:x+0.09,y:3.88,w:jw-0.18,h:0.34,fontFace:F,fontSize:8.5,color:MUTE,margin:0,lineSpacingMultiple:1.0});
  s.addShape(p.shapes.ROUNDED_RECTANGLE,{x:x+0.09,y:4.24,w:jw-0.18,h:0.24,rectRadius:0.06,fill:{color:i===3?BAR:GT}});
  s.addText(st[2],{x:x+0.09,y:4.24,w:jw-0.18,h:0.24,fontFace:F,fontSize:8.5,bold:true,color:i===3?WHITE:DARK,align:"center",valign:"middle",margin:0});
  if(i<4) s.addShape(p.shapes.LINE,{x:x+jw+0.005,y:4.04,w:jg-0.01,h:0,line:{color:GREEN,width:2,endArrowType:"triangle"}});});
rich(s,0.3,4.68,9.4,0.42,[{text:"The failure is the silent skip at stage 4 — ",options:{bold:true,color:BAR}},{text:"the unfamiliar arrives with no story, no reason to risk a listen; the loop tightens and the algorithm reads the skip as 'dislike,' narrowing further.",options:{color:DARK}}],9,1.05);
crumb(s,2);

// ============ S6 — PROBLEM FRAMING ============
s=p.addSlide(); head(s,"The gap isn't accuracy. It's acceptance.");
const pf=[["The true problem","Recs arrive with no reason to trust them → users skip the unfamiliar and retreat to the familiar.",PT],["Who feels it","Engaged Explorers — high-tenure Premium power users who want new music but feel trapped.",WHITE],["Value · users","Hear genuinely new music they'll love, without gambling a skip.",GT],["Value · Spotify","Re-ignite discovery for the highest-LTV cohort → retention + session depth.",GT],["How we know","7,296 reviews: stale/repetitive = #1 discovery complaint; cross-source, cross-segment.",WHITE],["Why now","Every model upgrade improves accuracy & widens the acceptance gap. No one owns it yet.",WHITE]];
pf.forEach((c,i)=>{const x=0.3+(i%2)*3.05; const y=1.05+Math.floor(i/2)*1.05; card(s,x,y,2.9,0.95,c[2]);
  s.addText(c[0],{x:x+0.13,y:y+0.08,w:2.64,h:0.28,fontFace:F,fontSize:11,bold:true,color:BAR,margin:0});
  s.addText(c[1],{x:x+0.13,y:y+0.36,w:2.64,h:0.55,fontFace:F,fontSize:9.5,color:DARK,margin:0,lineSpacingMultiple:1.05});});
// TAM SAM SOM
card(s,6.5,1.05,3.2,3.15,WHITE);
kicker(s,6.65,1.16,2.9,"Opportunity sizing",BAR);
s.addShape(p.shapes.OVAL,{x:6.7,y:1.5,w:2.5,h:2.5,fill:{color:GT}});
s.addShape(p.shapes.OVAL,{x:6.95,y:1.95,w:1.85,h:1.85,fill:{color:"CDEBD7"}});
s.addShape(p.shapes.OVAL,{x:7.25,y:2.5,w:1.2,h:1.2,fill:{color:GREEN}});
s.addText("All listeners",{x:6.75,y:1.6,w:2.0,h:0.25,fontFace:F,fontSize:9,bold:true,color:DARK,margin:0});
s.addText("Premium ~263M",{x:7.0,y:2.05,w:1.8,h:0.25,fontFace:F,fontSize:9,bold:true,color:DARK,margin:0});
s.addText("Engaged\nExplorers",{x:7.25,y:2.78,w:1.2,h:0.6,fontFace:F,fontSize:8.5,bold:true,color:WHITE,align:"center",margin:0,lineSpacingMultiple:0.9});
s.addText("Start with Engaged Explorers: highest LTV, feel the pain most, most articulate. Win them → expand to all Premium.",{x:6.65,y:4.25,w:2.95,h:0.7,fontFace:F,fontSize:9,color:MUTE,margin:0,lineSpacingMultiple:1.08});
crumb(s,3);

// ============ S7 — SOLUTION ============
s=p.addSlide(); head(s,"Three ways to break the bubble. Only one earns trust.");
const opts=[["Steerable agent","You tell discovery what you want in plain language. Powerful — but Spotify already shipped Prompted Playlist / AI DJ.",BT],["Social vouching","Show 'liked by a friend'. Strong trust — but Spotify's social graph is thin; cold-start kills it.",BT],["Off Repeat ✓","AI introduces each new track with a personalized story (why YOU'll like it) + trust layer. Earns acceptance.",GT]];
opts.forEach((o,i)=>{const x=0.3+i*2.35; card(s,x,1.05,2.2,2.15,o[2]);
  s.addText(o[0],{x:x+0.13,y:1.16,w:1.94,h:0.3,fontFace:F,fontSize:12,bold:true,color:i===2?BAR:DARK,margin:0});
  s.addText(o[2]===GT?"DECOMPOSE / PERSUADE":(i===0?"INSTRUCT":"VOUCH"),{x:x+0.13,y:1.46,w:1.94,h:0.22,fontFace:F,fontSize:8,bold:true,color:MUTE,charSpacing:1,margin:0});
  s.addText(o[1],{x:x+0.13,y:1.72,w:1.94,h:1.35,fontFace:F,fontSize:9.5,color:DARK,margin:0,lineSpacingMultiple:1.08});});
// scoring table
const rows=[
  [{text:"Basis",options:{bold:true,color:WHITE,fill:{color:BAR}}},{text:"Steerable",options:{bold:true,color:WHITE,fill:{color:BAR}}},{text:"Social",options:{bold:true,color:WHITE,fill:{color:BAR}}},{text:"Off Repeat",options:{bold:true,color:WHITE,fill:{color:BAR}}}],
  ["User insight","3","3","5"],["Trust earned","2","3","5"],["AI feasibility","5","4","4"],["Business moat","2","2","5"],
  [{text:"Total",options:{bold:true}},{text:"12",options:{bold:true}},{text:"12",options:{bold:true}},{text:"19",options:{bold:true,color:BAR}}]];
s.addTable(rows,{x:0.3,y:3.4,w:4.6,colW:[1.6,1.0,1.0,1.0],rowH:0.27,fontFace:F,fontSize:10,color:DARK,align:"center",valign:"middle",border:{pt:0.5,color:LINE},fill:{color:WHITE}});
card(s,5.1,3.4,4.6,1.6,GT);
kicker(s,5.3,3.5,4.2,"Why Off Repeat wins",BAR);
bodyText(s,5.3,3.78,4.25,1.15,"• Keeps the user the decider — supports judgment, doesn't replace it\n• Targets the real failure: the unfamiliar arriving with no reason to try it\n• Stakes-adaptive: light for casual, rich for high-intent discovery\n• Real moat: a personalized taste-narrative profile rivals can't copy",10,DARK,1.12);
crumb(s,4);

// ============ S8 — MVP ============
s=p.addSlide(); head(s,"You have On Repeat. Meet Off Repeat.");
bodyText(s,0.3,1.05,3.5,1.25,"Off Repeat is the friend who puts you on. Generative AI writes a unique, grounded reason to press play for every track — impossible to template or hand-author at scale. Recommendation picks the song; AI earns the play. Trust scales in three layers:",11,DARK,1.14);
const ly=[["❤  Real friend","“Liked by Nitya” — strongest trust",GREEN],["◑  AI taste-twin","“Popular with your taste”","2C7BE5"],["✎  AI story","always — works with zero friends","8A5CD1"]];
ly.forEach((l,i)=>{const y=2.3+i*0.62; card(s,0.3,y,3.5,0.52,WHITE);
  s.addText(l[0],{x:0.45,y:y+0.05,w:3.2,h:0.26,fontFace:F,fontSize:11,bold:true,color:l[2],margin:0});
  s.addText(l[1],{x:0.45,y:y+0.29,w:3.2,h:0.22,fontFace:F,fontSize:9,color:MUTE,margin:0});});
s.addText([{text:"▶ Live prototype + workflow",options:{bold:true,breakLine:true}},{text:"github.com/arjuncooliitr/spotify-discovery-engine",options:{}}],{x:0.3,y:4.3,w:3.55,h:0.65,fontFace:F,fontSize:9.5,color:BAR,margin:0,lineSpacingMultiple:1.05});
// dark mock card (real generated example)
s.addShape(p.shapes.ROUNDED_RECTANGLE,{x:4.05,y:1.05,w:5.65,h:3.95,rectRadius:0.1,fill:{color:DARKCARD},shadow:sh()});
s.addText("🎧 Off Repeat — for someone who loves Tame Impala + lo-fi",{x:4.3,y:1.2,w:5.2,h:0.3,fontFace:F,fontSize:11,bold:true,color:WHITE,margin:0});
const mock=[["Crumb — “Locket”","psych-pop · Brooklyn","the woozy Tame-Impala basslines you love — from a Brooklyn band you've never played.","❤  Liked by Nitya · your friend",GREEN],
["Mild High Club — “Homage”","psych-pop · Los Angeles","lush, jazzy psychedelia — that dreamy haze you love, at a Sunday tempo.","👥  Popular with your taste","6FB0FF"],
["Men I Trust — “Show Me How”","indie · Montreal","the hushed lo-fi groove you keep on repeat — still way under the radar.","✦  Picked for you","C9A8FF"]];
mock.forEach((m,i)=>{const y=1.6+i*1.08; s.addShape(p.shapes.ROUNDED_RECTANGLE,{x:4.3,y:y,w:5.15,h:0.98,rectRadius:0.07,fill:{color:"201C1A"}});
  s.addText(m[0],{x:4.45,y:y+0.07,w:3.6,h:0.26,fontFace:F,fontSize:11,bold:true,color:WHITE,margin:0});
  s.addShape(p.shapes.ROUNDED_RECTANGLE,{x:8.2,y:y+0.08,w:1.05,h:0.26,rectRadius:0.1,fill:{color:GREEN}});
  s.addText("NEW TO YOU",{x:8.2,y:y+0.08,w:1.05,h:0.26,fontFace:F,fontSize:7,bold:true,color:"000000",align:"center",valign:"middle",margin:0});
  s.addText(m[1],{x:4.45,y:y+0.31,w:4.7,h:0.2,fontFace:F,fontSize:8.5,color:"AFAFAF",margin:0});
  s.addText(m[2],{x:4.45,y:y+0.5,w:4.85,h:0.3,fontFace:F,fontSize:9,italic:true,color:"D8D8D8",margin:0,lineSpacingMultiple:1.0});
  s.addText(m[3],{x:4.45,y:y+0.76,w:4.85,h:0.2,fontFace:F,fontSize:8.5,bold:true,color:m[4],margin:0});});
crumb(s,5);

// ============ S9 — FULL ARCHITECTURE ============
s=p.addSlide(); head(s,"One grounded engine, twice — to find the problem, then fix it.");
function anode(x,y,w,h,title,desc,fill,tcolor){
  s.addShape(p.shapes.ROUNDED_RECTANGLE,{x,y,w,h,rectRadius:0.06,fill:{color:fill},line:{color:LINE,width:1},shadow:sh()});
  s.addText(title,{x:x+0.06,y:y+0.06,w:w-0.12,h:0.28,fontFace:F,fontSize:9.5,bold:true,color:tcolor,align:"center",valign:"middle",margin:0,lineSpacingMultiple:0.9});
  s.addText(desc,{x:x+0.06,y:y+0.33,w:w-0.12,h:h-0.38,fontFace:F,fontSize:7.5,color:MUTE,align:"center",margin:0,lineSpacingMultiple:1.0});
}
function arrow(x,y){ s.addText("→",{x,y,w:0.22,h:0.4,fontFace:F,fontSize:15,bold:true,color:"9AA6A0",align:"center",valign:"middle",margin:0}); }
// Row A — AI Review Engine
kicker(s,0.3,1.0,9.4,"① AI Review Engine — how we found the problem (research at scale)",BAR);
const A=[["Collect","App Store · Play Store\nYouTube · Community\n7,296 reviews","E7F6EC",DARK],
["Label","per-review LLM\ncoding (Groq)","E7F6EC",DARK],
["Embed + retrieve","MiniLM 384-d\nsemantic search","E7F6EC",DARK],
["Synthesize","grounded, cited\nQ&A · no fabrication","E7F6EC",DARK],
["💡 Insight","#1 pain = stale/repeat\n→ gap is ACCEPTANCE","CFEAD8",BAR]];
A.forEach((n,i)=>{const x=0.3+i*1.925; anode(x,1.34,1.7,0.86,n[0],n[1],n[2],n[3]); if(i<4) arrow(x+1.72,1.56);});
// bridge
s.addText("▼  the finding is the product spec",{x:0.3,y:2.3,w:9.4,h:0.26,fontFace:F,fontSize:10,bold:true,italic:true,color:BAR,align:"center",margin:0});
// Row B — Off Repeat MVP
kicker(s,0.3,2.6,9.4,"② Off Repeat MVP — how we act on it (live, per user)",BAR);
const B=[["Signals","listening history\nsaves · friends","E6EFF7",DARK],
["Taste vector","embed what\nyou love","E6EFF7",DARK],
["Retrieve + filter","novel, long-tail\ndrop the known","E6EFF7",DARK],
["Grounded story + trust","LLM writes the 'why' (RAG)\nfriend · twin · AI","E6EFF7",DARK],
["Serve + learn ↻","Spotify UI · learns\nwhat you adopt","C7DBFF",BAR]];
B.forEach((n,i)=>{const x=0.3+i*1.925; anode(x,2.94,1.7,0.86,n[0],n[1],n[2],n[3]); if(i<4) arrow(x+1.72,3.16);});
// shared backbone bar
s.addShape(p.shapes.ROUNDED_RECTANGLE,{x:0.3,y:4.02,w:9.4,h:0.6,rectRadius:0.06,fill:{color:"14110F"},shadow:sh()});
s.addText([{text:"Shared backbone   ",options:{bold:true,color:"7DE0A0"}},{text:"grounded generative AI · no-fabrication guardrail (RAG over real facts) · Groq LLM + sentence-transformer embeddings — the rigor that made the research trustworthy makes the feature trustworthy.",options:{color:"ECECEC"}}],{x:0.5,y:4.08,w:9.0,h:0.48,fontFace:F,fontSize:9,align:"center",valign:"middle",margin:0,lineSpacingMultiple:1.02});
// edge/guardrail micro-note
s.addText("Edge cases handled — hallucination → RAG grounding · cold-start → AI story works alone · story fatigue → one glanceable line, full story on tap.",{x:0.3,y:4.72,w:9.4,h:0.28,fontFace:F,fontSize:8,italic:true,color:MUTE,align:"center",margin:0});
crumb(s,6);

// ============ S10 — METRICS (North Star, detailed) ============
s=p.addSlide(); head(s,"Did they discover — or just get served?");
card(s,0.3,1.02,9.4,1.12,GT);
kicker(s,0.5,1.12,9.0,"★ North Star · Meaningful Discovery Rate",BAR);
rich(s,0.5,1.4,9.0,0.66,[{text:"= weekly listening on newly-adopted artists ÷ total.  ~0 → ",options:{color:DARK}},{text:"35% (M3) → 60% (M12)",options:{bold:true,color:BAR}},{text:".  Un-gameable — a discovery counts only when ",options:{color:DARK}},{text:"SURFACED",options:{bold:true,color:BAR}},{text:" (new to you) + ",options:{color:DARK}},{text:"TRIED",options:{bold:true,color:BAR}},{text:" (played ≥30s) + ",options:{color:DARK}},{text:"KEPT",options:{bold:true,color:BAR}},{text:" (saved & returned in 7d). Opening the feature and walking away is worth zero.",options:{color:DARK}}],9.5,1.12);
const mrows=[
 [{text:"Tier",options:{bold:true,color:WHITE,fill:{color:BAR}}},{text:"Metric",options:{bold:true,color:WHITE,fill:{color:BAR}}},{text:"Target",options:{bold:true,color:WHITE,fill:{color:BAR}}},{text:"Why it matters",options:{bold:true,color:WHITE,fill:{color:BAR}}}],
 [{text:"Leading",options:{bold:true}},"Story-attach try-rate — A/B: story vs no story",{text:"+25%",options:{bold:true}},"the story, not the song, earns the play"],
 [{text:"Leading",options:{bold:true}},"New-artist play-through vs control","↑","earliest demand signal"],
 [{text:"Lagging",options:{bold:true}},"New-artist save-rate · 7-day return","↑ by M3","real adoption, not curiosity"],
 [{text:"Lagging",options:{bold:true}},"Taste breadth — distinct new artists / month","+30% M6","the bubble is actually widening"],
 [{text:"Guardrail",options:{bold:true,color:BAR}},"Skip-rate · session time",{text:"flat/down",options:{bold:true,color:BAR}},"protect core listening"],
 [{text:"Guardrail",options:{bold:true,color:BAR}},"Unaided-exploration rate",{text:"not ↓",options:{bold:true,color:BAR}},"we are not building a crutch"],
];
s.addTable(mrows,{x:0.3,y:2.34,w:9.4,colW:[1.05,4.05,1.15,3.15],rowH:0.3,fontFace:F,fontSize:9,color:DARK,valign:"middle",border:{pt:0.5,color:LINE},fill:{color:WHITE},align:"left"});
bodyText(s,0.3,4.6,9.4,0.3,"Rollout — P1 (M0–3): shadow-test on 1% of Engaged Explorers · P2 (M3–6): 10% + guardrail gates · P3 (M6–12): all Premium if discovery-rate ↑ and skip-rate flat.",8.5,MUTE,1.05);
s.addText("The loop becomes a launchpad — Off Repeat doesn't chase better recs, it earns the play.",{x:0.3,y:4.92,w:9.4,h:0.24,fontFace:F,fontSize:10,bold:true,italic:true,color:BAR,align:"center",margin:0});
crumb(s,7);

// ============ S11 — FAILURE MODES & RISK ============
s=p.addSlide(); head(s,"We'd rather name how it fails than pretend it won't.");
function riskcard(x,y,sev,sc,title,why,mit){
  card(s,x,y,4.6,1.16,WHITE);
  s.addShape(p.shapes.ROUNDED_RECTANGLE,{x:x+0.15,y:y+0.14,w:1.0,h:0.24,rectRadius:0.04,fill:{color:sc}});
  s.addText(sev,{x:x+0.15,y:y+0.14,w:1.0,h:0.24,fontFace:F,fontSize:7.5,bold:true,color:WHITE,align:"center",valign:"middle",margin:0});
  s.addText(title,{x:x+1.25,y:y+0.12,w:3.2,h:0.28,fontFace:F,fontSize:10.5,bold:true,color:DARK,valign:"middle",margin:0});
  s.addText(why,{x:x+0.16,y:y+0.44,w:4.3,h:0.34,fontFace:F,fontSize:8.5,color:MUTE,margin:0,lineSpacingMultiple:1.02});
  s.addText("→ "+mit,{x:x+0.16,y:y+0.79,w:4.3,h:0.3,fontFace:F,fontSize:8.5,bold:true,color:BAR,margin:0,lineSpacingMultiple:1.02});
}
const RCRIT="C0392B", RHIGH="C57211";
const risks=[
 [RCRIT,"CRITICAL","Acceptance ≠ the real driver","Much 'won't press play' is mood & effort, not missing trust — a story can add friction.","Validate the driver in Part-2 interviews; lean-in surfaces only."],
 [RCRIT,"CRITICAL","Trust is fragile","One salesy or slightly-wrong story and users tune the layer out for good.","RAG grounding + no-fabrication guardrail; style variety; sample QA."],
 [RCRIT,"CRITICAL","Payola & gaming","Pressure to inject promoted tracks; stream-farming the metric.","Firewall from promotion; reward saved + returned, never raw plays."],
 [RHIGH,"HIGH","AI becomes a crutch","Users stop exploring unaided — a new trust proxy that solves nothing.","Measure unaided exploration; ease off narration as adoption grows."],
 [RHIGH,"HIGH","Novelty decay","The first-try lift fades once the story feels normal.","Track 30/90-day adoption retention; refresh story styles."],
 [RHIGH,"HIGH","Cold-start / long tail","Thin metadata on the obscure tracks that matter most → hallucination risk.","Confidence-gate; safe fallback cues; enrich long-tail data."],
];
risks.forEach((rk,i)=>{const col=i%2,row=Math.floor(i/2); riskcard(0.3+col*4.8, 1.05+row*1.28, rk[1],rk[0],rk[2],rk[3],rk[4]);});
s.addShape(p.shapes.ROUNDED_RECTANGLE,{x:0.3,y:4.82,w:9.4,h:0.34,rectRadius:0.05,fill:{color:"FBE9E7"}});
s.addText([{text:"Most likely failure — ",options:{bold:true,color:RCRIT}},{text:"the story moves behavior in fewer moments than we hope. So we de-risk before building: validate the acceptance driver in interviews, ship only to lean-in moments, and design the feature to make itself unnecessary.",options:{color:DARK}}],{x:0.48,y:4.82,w:9.05,h:0.34,fontFace:F,fontSize:8.5,valign:"middle",margin:0,lineSpacingMultiple:1.0});
crumb(s,8);

p.writeFile({fileName:"spotify_deck_v2.pptx"}).then(f=>console.log("WROTE",f));
