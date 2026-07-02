const pptxgen = require("pptxgenjs");
const p = new pptxgen();
p.layout = "LAYOUT_16x9";
p.author = "Arjun";
p.title = "Liner Notes — Spotify Discovery";

const BG = "0F0F10", PANEL = "1C1C1E", PANEL2 = "242427";
const GREEN = "1DB954", WHITE = "FFFFFF", MUTE = "A7A7A7", DIM = "6E6E73";
const RED = "E2483D", BLUE = "7FB0FF", PURPLE = "C9A8FF";
const HEAD = "Arial", BODY = "Arial";
const sh = () => ({ type: "outer", color: "000000", blur: 9, offset: 3, angle: 90, opacity: 0.35 });

function base(s) { s.background = { color: BG }; }
function footer(s, n) {
  s.addText("Liner Notes  ·  Spotify Growth Case", { x: 0.5, y: 5.28, w: 6, h: 0.3, fontFace: BODY, fontSize: 9, color: DIM, align: "left", margin: 0 });
  s.addText(n + " / 10", { x: 8.5, y: 5.28, w: 1, h: 0.3, fontFace: BODY, fontSize: 9, color: DIM, align: "right", margin: 0 });
}
function title(s, kicker, t) {
  if (kicker) s.addText(kicker.toUpperCase(), { x: 0.5, y: 0.42, w: 9, h: 0.3, fontFace: BODY, fontSize: 12, color: GREEN, bold: true, charSpacing: 3, margin: 0 });
  s.addText(t, { x: 0.5, y: 0.72, w: 9, h: 0.7, fontFace: HEAD, fontSize: 29, color: WHITE, bold: true, margin: 0 });
}
function card(s, x, y, w, h, fill = PANEL) {
  s.addShape(p.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.09, fill: { color: fill }, line: { color: "2E2E32", width: 1 }, shadow: sh() });
}
function dot(s, x, y, txt, color = GREEN, tcolor = "000000", d = 0.42) {
  s.addShape(p.shapes.OVAL, { x, y, w: d, h: d, fill: { color } });
  s.addText(txt, { x: x - 0.05, y: y - 0.02, w: d + 0.1, h: d, fontFace: HEAD, fontSize: 13, bold: true, color: tcolor, align: "center", valign: "middle", margin: 0 });
}

// ===== SLIDE 1 — TITLE =====
let s = p.addSlide(); base(s);
s.addShape(p.shapes.OVAL, { x: 7.6, y: 3.4, w: 4.2, h: 4.2, fill: { color: GREEN, transparency: 86 } });
s.addShape(p.shapes.OVAL, { x: -1.2, y: -1.6, w: 3.4, h: 3.4, fill: { color: GREEN, transparency: 90 } });
s.addText("SPOTIFY GROWTH · PRODUCT CASE", { x: 0.7, y: 1.05, w: 9, h: 0.35, fontFace: BODY, fontSize: 13, color: GREEN, bold: true, charSpacing: 3, margin: 0 });
s.addText("Liner Notes", { x: 0.65, y: 1.45, w: 9, h: 1.0, fontFace: HEAD, fontSize: 60, color: WHITE, bold: true, margin: 0 });
s.addText([
  { text: "Spotify doesn't have a recommendation problem.", options: { breakLine: true, color: WHITE } },
  { text: "It has an ", options: { color: WHITE } },
  { text: "acceptance", options: { color: GREEN, bold: true } },
  { text: " problem.", options: { color: WHITE } },
], { x: 0.7, y: 2.7, w: 8.6, h: 1.0, fontFace: HEAD, fontSize: 24, bold: true, margin: 0, lineSpacingMultiple: 1.05 });
s.addText("Re-igniting meaningful discovery for Spotify's most engaged listeners — by giving them a reason to press play.", { x: 0.7, y: 3.95, w: 8.4, h: 0.6, fontFace: BODY, fontSize: 14, color: MUTE, margin: 0 });
s.addText("Growth PM Case  ·  4-part build: AI review engine → research → problem → AI-native MVP", { x: 0.7, y: 4.95, w: 9, h: 0.3, fontFace: BODY, fontSize: 11, color: DIM, margin: 0 });

// ===== SLIDE 2 — PARADOX =====
s = p.addSlide(); base(s); title(s, "The tension", "The Paradox of the Perfect Algorithm");
s.addText([
  { text: "Spotify has acquired millions of users and built one of the world's most sophisticated recommendation systems.", options: { breakLine: true, color: WHITE, bold: true } },
  { text: "", options: { breakLine: true, fontSize: 6 } },
  { text: "Yet a large share of listening is still ", options: { color: MUTE } },
  { text: "repeat playlists, familiar artists, previously-discovered tracks.", options: { color: WHITE, bold: true } },
], { x: 0.5, y: 1.7, w: 5.1, h: 2.0, fontFace: BODY, fontSize: 15, margin: 0, lineSpacingMultiple: 1.12 });
s.addText("“The better the algorithm knows you, the smaller your musical world becomes.”", { x: 0.5, y: 3.9, w: 5.1, h: 1.0, fontFace: HEAD, fontSize: 17, italic: true, color: GREEN, bold: true, margin: 0, lineSpacingMultiple: 1.1 });
card(s, 5.95, 1.6, 3.55, 1.55);
s.addText("STRATEGIC GOAL", { x: 6.2, y: 1.78, w: 3.1, h: 0.3, fontFace: BODY, fontSize: 11, color: GREEN, bold: true, charSpacing: 2, margin: 0 });
s.addText([{ text: "↑  Increase meaningful discovery", options: { breakLine: true, color: WHITE } }, { text: "↓  Reduce repetitive listening", options: { color: WHITE } }], { x: 6.2, y: 2.15, w: 3.1, h: 0.9, fontFace: BODY, fontSize: 14, bold: true, margin: 0, lineSpacingMultiple: 1.2 });
card(s, 5.95, 3.35, 3.55, 1.55);
s.addText("−12%", { x: 6.2, y: 3.5, w: 3.1, h: 0.7, fontFace: HEAD, fontSize: 44, color: GREEN, bold: true, margin: 0 });
s.addText("genre diversity in 6 months under Discover Weekly — personalization quietly narrows taste (research).", { x: 6.2, y: 4.18, w: 3.1, h: 0.6, fontFace: BODY, fontSize: 10.5, color: MUTE, margin: 0 });
footer(s, 2);

// ===== SLIDE 3 — ENGINE =====
s = p.addSlide(); base(s); title(s, "Part 1 · the workflow (how it works)", "An AI engine that reads 7,296 reviews — and never makes one up");
const steps = [["1", "Collect", "App Store · Play\nYouTube · Community"], ["2", "Unify", "one clean schema\n7,296 reviews"], ["3", "Label", "per-review JSON\n(LLM)"], ["4", "Synthesize", "count labels →\n6 answers"], ["5", "Serve", "dashboard +\nsemantic RAG Q&A"]];
let bx = 0.5, bw = 1.62, gap = 0.245, by = 1.95, bh = 1.5;
steps.forEach((st, i) => {
  const x = bx + i * (bw + gap);
  card(s, x, by, bw, bh, PANEL);
  dot(s, x + bw / 2 - 0.21, by - 0.21, st[0]);
  s.addText(st[1], { x, y: by + 0.28, w: bw, h: 0.35, fontFace: HEAD, fontSize: 14, bold: true, color: (i === 2 || i === 4) ? GREEN : WHITE, align: "center", margin: 0 });
  s.addText(st[2], { x: x + 0.08, y: by + 0.66, w: bw - 0.16, h: 0.75, fontFace: BODY, fontSize: 9.5, color: MUTE, align: "center", margin: 0, lineSpacingMultiple: 1.05 });
  if (i < 4) s.addShape(p.shapes.LINE, { x: x + bw + 0.02, y: by + bh / 2, w: gap - 0.04, h: 0, line: { color: GREEN, width: 2, endArrowType: "triangle" } });
});
s.addText("⬤ stages 3 & 5 are AI (LLM + embeddings)", { x: 0.5, y: 3.55, w: 9, h: 0.3, fontFace: BODY, fontSize: 10, color: GREEN, margin: 0 });
card(s, 0.5, 3.95, 9, 0.95, PANEL2);
s.addText("WHY YOU CAN TRUST IT", { x: 0.7, y: 4.08, w: 8.6, h: 0.28, fontFace: BODY, fontSize: 10.5, color: GREEN, bold: true, charSpacing: 2, margin: 0 });
s.addText([
  { text: "Verbatim-cited evidence ", options: { color: WHITE, bold: true } }, { text: "(every quote = a real review)    ", options: { color: MUTE } },
  { text: "Sentiment from ★ ratings ", options: { color: WHITE, bold: true } }, { text: "(not a guessing lexicon)    ", options: { color: MUTE } },
  { text: "Zero fabrication ", options: { color: WHITE, bold: true } }, { text: "(guardrail-enforced)", options: { color: MUTE } },
], { x: 0.7, y: 4.36, w: 8.6, h: 0.45, fontFace: BODY, fontSize: 11, margin: 0 });
s.addText("Test the workflow →  github.com/arjuncooliitr/spotify-discovery-engine", { x: 0.5, y: 5.0, w: 9, h: 0.28, fontFace: BODY, fontSize: 10.5, color: GREEN, margin: 0 });
footer(s, 3);

// ===== SLIDE 4 — FINDINGS =====
s = p.addSlide(); base(s); title(s, "Part 1 · findings", "What 7,296 reviews told us");
s.addText("Top discovery frustrations (labeled reviews)", { x: 0.5, y: 1.55, w: 5, h: 0.3, fontFace: BODY, fontSize: 12, color: MUTE, margin: 0 });
s.addChart(p.charts.BAR, [{ name: "Reviews", labels: ["Stale / repetitive", "Niche taste gap", "Search fails", "Can't steer"], values: [63, 14, 3, 2] }], {
  x: 0.4, y: 1.85, w: 5.0, h: 2.8, barDir: "bar", chartColors: [GREEN],
  chartArea: { fill: { color: BG } }, plotArea: { fill: { color: BG } },
  catAxisLabelColor: WHITE, catAxisLabelFontSize: 11, valAxisHidden: true, valGridLine: { style: "none" }, catGridLine: { style: "none" },
  showValue: true, dataLabelColor: WHITE, dataLabelFontSize: 11, dataLabelPosition: "outEnd", showLegend: false, showTitle: false, barGapWidthPct: 40,
});
s.addText("Repetition is the #1 discovery frustration — not 'too much choice.'", { x: 0.5, y: 4.7, w: 5, h: 0.45, fontFace: BODY, fontSize: 12, color: WHITE, bold: true, margin: 0 });
card(s, 5.8, 1.6, 3.7, 1.5, PANEL2);
s.addText("“Instead of opening doors to new discoveries, it locks us into a comfortable but repetitive bubble.”", { x: 6.0, y: 1.72, w: 3.3, h: 1.1, fontFace: HEAD, fontSize: 12.5, italic: true, color: WHITE, margin: 0, lineSpacingMultiple: 1.08 });
s.addText("— Spotify Community  ·  review #6077", { x: 6.0, y: 2.78, w: 3.3, h: 0.25, fontFace: BODY, fontSize: 9, color: GREEN, margin: 0 });
const finds = [["Discovery works for many", "praise is the most common label — it fails a specific, valuable few"], ["Trust is the blocker", "users won't try recs they don't believe are genuinely new"], ["Felt hardest by power users", "the more history, the tighter the loop"]];
finds.forEach((f, i) => {
  const y = 3.3 + i * 0.6;
  s.addShape(p.shapes.OVAL, { x: 5.85, y: y + 0.03, w: 0.16, h: 0.16, fill: { color: GREEN } });
  s.addText([{ text: f[0] + " — ", options: { color: WHITE, bold: true } }, { text: f[1], options: { color: MUTE } }], { x: 6.12, y: y - 0.06, w: 3.4, h: 0.55, fontFace: BODY, fontSize: 11, margin: 0, lineSpacingMultiple: 1.0 });
});
footer(s, 4);

// ===== SLIDE 5 — PRIMARY RESEARCH (spacing fixed) =====
s = p.addSlide(); base(s); title(s, "Part 2 · validation", "We pressure-tested it with real listeners");
card(s, 0.5, 1.6, 4.3, 3.35);
s.addText("WHO WE TALKED TO", { x: 0.75, y: 1.78, w: 3.8, h: 0.3, fontFace: BODY, fontSize: 11, color: GREEN, bold: true, charSpacing: 2, margin: 0 });
s.addText("5–6 “Engaged Explorers”", { x: 0.75, y: 2.08, w: 3.8, h: 0.4, fontFace: HEAD, fontSize: 18, color: WHITE, bold: true, margin: 0 });
s.addText([
  { text: "Premium subscribers", options: { bullet: true, breakLine: true } },
  { text: "2+ years on Spotify", options: { bullet: true, breakLine: true } },
  { text: "10+ hours / week", options: { bullet: true, breakLine: true } },
  { text: "Large libraries / many playlists", options: { bullet: true, breakLine: true } },
  { text: "Want new music but feel it repeats", options: { bullet: true } },
], { x: 0.8, y: 2.55, w: 3.8, h: 2.2, fontFace: BODY, fontSize: 13, color: WHITE, margin: 0, paraSpaceAfter: 8 });
card(s, 5.0, 1.6, 4.5, 3.35, PANEL2);
s.addText("WHAT WE TEST  →  fill with verbatim quotes", { x: 5.25, y: 1.78, w: 4.0, h: 0.3, fontFace: BODY, fontSize: 11, color: GREEN, bold: true, charSpacing: 1, margin: 0 });
const hyp = [["The acceptance hypothesis", "“What makes you press play vs. skip a new song?”"], ["The staleness pain", "“When did your recs last feel repetitive?”"], ["The trust signal", "“Would knowing who it's for change if you try it?”"]];
hyp.forEach((h, i) => {
  const y = 2.2 + i * 0.82;
  s.addText(h[0], { x: 5.25, y, w: 4.0, h: 0.3, fontFace: HEAD, fontSize: 13.5, bold: true, color: WHITE, margin: 0 });
  s.addText(h[1], { x: 5.25, y: y + 0.31, w: 4.0, h: 0.32, fontFace: BODY, fontSize: 11.5, italic: true, color: MUTE, margin: 0 });
});
s.addText("Expected signal: “I skip new music because I don't trust it's really for me.”", { x: 5.25, y: 4.62, w: 4.05, h: 0.28, fontFace: BODY, fontSize: 10.5, color: GREEN, margin: 0 });
footer(s, 5);

// ===== SLIDE 6 — PROBLEM =====
s = p.addSlide(); base(s); title(s, "Part 3 · the problem", "Acceptance, not Accuracy");
s.addText([
  { text: "The brief says it itself: Spotify already has a world-class recommender — ", options: { color: MUTE } },
  { text: "yet people still repeat.", options: { color: WHITE, bold: true } },
  { text: "  So the gap was never finding new music. It's that listeners ", options: { color: MUTE } },
  { text: "don't accept it.", options: { color: GREEN, bold: true } },
], { x: 0.5, y: 1.6, w: 9, h: 0.95, fontFace: BODY, fontSize: 15, margin: 0, lineSpacingMultiple: 1.15 });
const defs = [["ROOT CAUSE", "The algorithm maximizes engagement by exploiting the familiar → a tightening filter bubble, worst for the heaviest users.", WHITE], ["TARGET SEGMENT", "“Engaged Explorers” — long-tenure Premium power users who want to discover but feel trapped.", GREEN], ["THE REAL BOTTLENECK", "Not accuracy — acceptance. They won't try recs they don't trust enough to press play.", WHITE]];
defs.forEach((d, i) => {
  const x = 0.5 + i * 3.07;
  card(s, x, 2.75, 2.85, 1.6);
  s.addText(d[0], { x: x + 0.2, y: 2.9, w: 2.5, h: 0.3, fontFace: BODY, fontSize: 10.5, color: GREEN, bold: true, charSpacing: 1.5, margin: 0 });
  s.addText(d[1], { x: x + 0.2, y: 3.22, w: 2.5, h: 1.05, fontFace: BODY, fontSize: 11.5, color: d[2], margin: 0, lineSpacingMultiple: 1.08 });
});
s.addText("“Spotify's most valuable listeners want to explore — but the product that knows them best keeps handing them back themselves.”", { x: 0.5, y: 4.55, w: 9, h: 0.6, fontFace: HEAD, fontSize: 14, italic: true, bold: true, color: WHITE, align: "center", margin: 0, lineSpacingMultiple: 1.05 });
footer(s, 6);

// ===== SLIDE 7 — SOLUTION =====
s = p.addSlide(); base(s); title(s, "Part 4 · the MVP", "“Liner Notes” — the friend who puts you on");
s.addText("An AI that introduces unfamiliar music with a short, personalized story — engineered so engaged users actually press play. Trust scales in 3 layers:", { x: 0.5, y: 1.55, w: 4.4, h: 1.0, fontFace: BODY, fontSize: 14, color: WHITE, margin: 0, lineSpacingMultiple: 1.15 });
const layers = [["❤", "Real friend", "“Liked by Priya”", GREEN], ["◑", "AI taste-twin", "“Loved by listeners just like you”", BLUE], ["✎", "AI story", "always — so it works with zero friends", PURPLE]];
layers.forEach((l, i) => {
  const y = 2.7 + i * 0.74;
  s.addShape(p.shapes.OVAL, { x: 0.55, y, w: 0.42, h: 0.42, fill: { color: l[3], transparency: 70 } });
  s.addText(l[0], { x: 0.55, y: y - 0.01, w: 0.42, h: 0.42, fontFace: BODY, fontSize: 14, color: l[3], align: "center", valign: "middle", margin: 0 });
  s.addText([{ text: l[1] + "  ", options: { color: WHITE, bold: true } }, { text: l[2], options: { color: MUTE } }], { x: 1.1, y: y + 0.02, w: 3.8, h: 0.45, fontFace: BODY, fontSize: 12, margin: 0 });
});
card(s, 5.25, 1.55, 4.25, 3.35, PANEL);
s.addText([{ text: "Mndsgn — “Sunset Drift”", options: { color: WHITE, bold: true } }], { x: 5.5, y: 1.75, w: 2.9, h: 0.3, fontFace: HEAD, fontSize: 14, margin: 0 });
s.addShape(p.shapes.ROUNDED_RECTANGLE, { x: 8.35, y: 1.78, w: 0.95, h: 0.3, rectRadius: 0.12, fill: { color: GREEN } });
s.addText("NEW TO YOU", { x: 8.35, y: 1.78, w: 0.95, h: 0.3, fontFace: BODY, fontSize: 8, bold: true, color: "000000", align: "center", valign: "middle", margin: 0 });
s.addText("chillwave · California", { x: 5.5, y: 2.06, w: 3.6, h: 0.25, fontFace: BODY, fontSize: 10.5, color: MUTE, margin: 0 });
s.addText("“Lush synths and a laid-back groove — the same carefree spirit as Tame Impala's upbeat tracks, at golden hour.”", { x: 5.5, y: 2.4, w: 3.7, h: 0.95, fontFace: BODY, fontSize: 12, color: "D8D8D8", italic: true, margin: 0, lineSpacingMultiple: 1.1 });
s.addText("✍  AI pick for your taste", { x: 5.5, y: 3.42, w: 3.6, h: 0.3, fontFace: BODY, fontSize: 11, color: PURPLE, bold: true, margin: 0 });
s.addShape(p.shapes.LINE, { x: 5.5, y: 3.8, w: 3.75, h: 0, line: { color: "33333A", width: 1 } });
s.addText("❤  Liked by Rahul", { x: 5.5, y: 3.92, w: 2.2, h: 0.3, fontFace: BODY, fontSize: 11, color: GREEN, bold: true, margin: 0 });
s.addText("when a real friend likes it too", { x: 7.0, y: 3.94, w: 2.3, h: 0.3, fontFace: BODY, fontSize: 9.5, color: MUTE, margin: 0 });
s.addText("Generated live by the prototype", { x: 5.5, y: 4.45, w: 3.7, h: 0.3, fontFace: BODY, fontSize: 9.5, color: DIM, italic: true, margin: 0 });
s.addText("Live prototype → deploying to Streamlit Cloud", { x: 0.5, y: 4.95, w: 4.6, h: 0.3, fontFace: BODY, fontSize: 10.5, color: GREEN, margin: 0 });
footer(s, 7);

// ===== SLIDE 8 — WHY ONLY AI + COMPETITOR TEARDOWN =====
s = p.addSlide(); base(s); title(s, "Part 4 · why AI", "Why only AI — and not the incumbents");
// left: incumbents
s.addText("THE INCUMBENTS — AND WHY THEY FALL SHORT", { x: 0.5, y: 1.55, w: 4.5, h: 0.3, fontFace: BODY, fontSize: 10.5, color: GREEN, bold: true, charSpacing: 1, margin: 0 });
const comp = [["Discover Weekly / Daylist", "personalize you into a tighter loop"], ["AI DJ / Prompted Playlist", "let you ask — but still just serve, generic, not personal to your history"], ["SongDNA / Smart Shuffle", "facts & reshuffles — no reason to care"]];
comp.forEach((c, i) => {
  const y = 1.95 + i * 0.83;
  card(s, 0.5, y, 4.4, 0.72, PANEL);
  s.addText(c[0], { x: 0.7, y: y + 0.08, w: 4.05, h: 0.28, fontFace: HEAD, fontSize: 12.5, bold: true, color: WHITE, margin: 0 });
  s.addText(c[1], { x: 0.7, y: y + 0.36, w: 4.05, h: 0.32, fontFace: BODY, fontSize: 10.5, color: MUTE, margin: 0 });
});
s.addText("All optimize SERVING music. None optimize ACCEPTANCE.", { x: 0.5, y: 4.5, w: 4.5, h: 0.4, fontFace: HEAD, fontSize: 12.5, bold: true, italic: true, color: GREEN, margin: 0 });
// right: what AI unlocks
s.addText("WHAT ONLY AI UNLOCKS", { x: 5.2, y: 1.55, w: 4.3, h: 0.3, fontFace: BODY, fontSize: 10.5, color: GREEN, bold: true, charSpacing: 1, margin: 0 });
const unlocks = [["Personal narrative", "an LLM writes a story linking a NEW artist to YOUR taste — impossible for classic recsys"], ["Guaranteed novelty + a 'why'", "excludes what you know, and tells you why it's worth a listen"], ["UX shift", "passive feed you can't argue with → a trusted, explained introduction"]];
unlocks.forEach((u, i) => {
  const y = 1.95 + i * 0.83;
  s.addShape(p.shapes.OVAL, { x: 5.25, y: y + 0.04, w: 0.16, h: 0.16, fill: { color: GREEN } });
  s.addText(u[0], { x: 5.5, y: y - 0.04, w: 4.0, h: 0.3, fontFace: HEAD, fontSize: 12.5, bold: true, color: WHITE, margin: 0 });
  s.addText(u[1], { x: 5.5, y: y + 0.26, w: 4.0, h: 0.5, fontFace: BODY, fontSize: 10.5, color: MUTE, margin: 0, lineSpacingMultiple: 1.05 });
});
card(s, 5.2, 4.45, 4.3, 0.5, PANEL2);
s.addText([{ text: "Not “AI DJ with captions”: ", options: { color: GREEN, bold: true } }, { text: "written, personal, fact-grounded, measured by adoption.", options: { color: WHITE } }], { x: 5.4, y: 4.55, w: 4.0, h: 0.32, fontFace: BODY, fontSize: 10.5, margin: 0 });
footer(s, 8);

// ===== SLIDE 9 — BUSINESS CASE + KPI TREE =====
s = p.addSlide(); base(s); title(s, "Part 3 · why it matters & how we measure", "The business case — and the KPI tree");
const biz = [["Highest-LTV users", "engaged Premium = the most expensive churn to lose"], ["Reverses a real decay", "personalization narrows taste ~12% — we lift it back"], ["Monetizable via artists", "long-tail adoption plugs into artist-first AI deals"]];
biz.forEach((b, i) => {
  const y = 1.6 + i * 1.13;
  card(s, 0.5, y, 3.5, 1.0);
  s.addText(b[0], { x: 0.7, y: y + 0.12, w: 3.15, h: 0.3, fontFace: HEAD, fontSize: 13, bold: true, color: WHITE, margin: 0 });
  s.addText(b[1], { x: 0.7, y: y + 0.44, w: 3.15, h: 0.5, fontFace: BODY, fontSize: 10.5, color: MUTE, margin: 0, lineSpacingMultiple: 1.05 });
});
card(s, 4.3, 1.6, 5.2, 3.35, PANEL2);
s.addText("NORTH-STAR  ·  KPI TREE", { x: 4.55, y: 1.75, w: 4.7, h: 0.3, fontFace: BODY, fontSize: 11, color: GREEN, bold: true, charSpacing: 1.5, margin: 0 });
s.addText("Meaningful Discovery Rate", { x: 4.55, y: 2.05, w: 4.7, h: 0.32, fontFace: HEAD, fontSize: 16, bold: true, color: WHITE, margin: 0 });
s.addText("% of weekly listening on newly-adopted artists (new in 90 days · saved + replayed)", { x: 4.55, y: 2.4, w: 4.7, h: 0.4, fontFace: BODY, fontSize: 10, color: MUTE, margin: 0, lineSpacingMultiple: 1.05 });
const kpi = [["Exposure", "new artists surfaced / user / week", MUTE], ["Acceptance", "try-rate (played ≥30s)   ← Liner Notes moves this", GREEN], ["Adoption", "save-rate + 7-day return to new artist", MUTE], ["Guardrail", "session time · skip-rate (protect core listening)", MUTE]];
kpi.forEach((k, i) => {
  const y = 2.92 + i * 0.49;
  s.addShape(p.shapes.OVAL, { x: 4.6, y: y + 0.03, w: 0.14, h: 0.14, fill: { color: k[2] === GREEN ? GREEN : DIM } });
  s.addText([{ text: k[0] + "  ", options: { color: k[2] === GREEN ? GREEN : WHITE, bold: true } }, { text: k[1], options: { color: k[2] === GREEN ? GREEN : MUTE } }], { x: 4.85, y: y - 0.06, w: 4.5, h: 0.35, fontFace: BODY, fontSize: 11, margin: 0 });
});
footer(s, 9);

// ===== SLIDE 10 — IMPACT & ROADMAP =====
s = p.addSlide(); base(s);
s.addShape(p.shapes.OVAL, { x: 7.4, y: -1.4, w: 4.2, h: 4.2, fill: { color: GREEN, transparency: 88 } });
title(s, "Impact & roadmap", "Prove it, then scale it");
const road = [["Prove", "A/B: same song with a story vs. without. Measure try-rate & 7-day save-rate."], ["Pilot", "Ship “Liner Notes” to Engaged Explorers; ground every story in real artist data."], ["Scale", "Cache stories per (song × taste-cluster); open to all; add the social vouch layer."]];
road.forEach((r, i) => {
  const x = 0.5 + i * 3.07;
  card(s, x, 1.7, 2.85, 1.9);
  dot(s, x + 0.2, 1.9, String(i + 1));
  s.addText(r[0], { x: x + 0.72, y: 1.92, w: 2, h: 0.4, fontFace: HEAD, fontSize: 16, bold: true, color: GREEN, margin: 0 });
  s.addText(r[1], { x: x + 0.2, y: 2.5, w: 2.5, h: 1.0, fontFace: BODY, fontSize: 11.5, color: MUTE, margin: 0, lineSpacingMultiple: 1.1 });
});
s.addText("“The better Spotify knows you, the smaller your world gets — the fix isn't a smarter algorithm, it's a reason to say yes.”", { x: 0.5, y: 3.95, w: 9, h: 0.7, fontFace: HEAD, fontSize: 16, italic: true, bold: true, color: WHITE, align: "center", margin: 0, lineSpacingMultiple: 1.08 });
s.addText("Workflow → github.com/arjuncooliitr/spotify-discovery-engine        Prototype → deploying to Streamlit Cloud", { x: 0.5, y: 4.85, w: 9, h: 0.3, fontFace: BODY, fontSize: 10.5, color: GREEN, align: "center", margin: 0 });
footer(s, 10);

p.writeFile({ fileName: "spotify_deck.pptx" }).then(f => console.log("WROTE", f));
