const STATESS = [

      {state:"Alabama", capital:"Montgomery", abbr:"AL"},

      {state:"Alaska", capital:"Juneau", abbr:"AK"},

      {state:"Arizona", capital:"Phoenix", abbr:"AZ"},

      {state:"Arkansas", capital:"Little Rock", abbr:"AR"},

      {state:"California", capital:"Sacramento", abbr:"CA"},

      {state:"Colorado", capital:"Denver", abbr:"CO"},

      {state:"Connecticut", capital:"Hartford", abbr:"CT"},

      {state:"Delaware", capital:"Dover", abbr:"DE"},

      {state:"Florida", capital:"Tallahassee", abbr:"FL"},

      {state:"Georgia", capital:"Atlanta", abbr:"GA"},

      {state:"Hawaii", capital:"Honolulu", abbr:"HI"},

      {state:"Idaho", capital:"Boise", abbr:"ID"},

      {state:"Illinois", capital:"Springfield", abbr:"IL"},

      {state:"Indiana", capital:"Indianapolis", abbr:"IN"},

      {state:"Iowa", capital:"Des Moines", abbr:"IA"},

      {state:"Kansas", capital:"Topeka", abbr:"KS"},

      {state:"Kentucky", capital:"Frankfort", abbr:"KY"},

      {state:"Louisiana", capital:"Baton Rouge", abbr:"LA"},

      {state:"Maine", capital:"Augusta", abbr:"ME"},

      {state:"Maryland", capital:"Annapolis", abbr:"MD"},

      {state:"Massachusetts", capital:"Boston", abbr:"MA"},

      {state:"Michigan", capital:"Lansing", abbr:"MI"},

      {state:"Minnesota", capital:"Saint Paul", abbr:"MN"},

      {state:"Mississippi", capital:"Jackson", abbr:"MS"},

      {state:"Missouri", capital:"Jefferson City", abbr:"MO"},

      {state:"Montana", capital:"Helena", abbr:"MT"},

      {state:"Nebraska", capital:"Lincoln", abbr:"NE"},

      {state:"Nevada", capital:"Carson City", abbr:"NV"},

      {state:"New Hampshire", capital:"Concord", abbr:"NH"},

      {state:"New Jersey", capital:"Trenton", abbr:"NJ"},

      {state:"New Mexico", capital:"Santa Fe", abbr:"NM"},

      {state:"New York", capital:"Albany", abbr:"NY"},

      {state:"North Carolina", capital:"Raleigh", abbr:"NC"},

      {state:"North Dakota", capital:"Bismarck", abbr:"ND"},

      {state:"Ohio", capital:"Columbus", abbr:"OH"},

      {state:"Oklahoma", capital:"Oklahoma City", abbr:"OK"},

      {state:"Oregon", capital:"Salem", abbr:"OR"},

      {state:"Pennsylvania", capital:"Harrisburg", abbr:"PA"},

      {state:"Rhode Island", capital:"Providence", abbr:"RI"},

      {state:"South Carolina", capital:"Columbia", abbr:"SC"},

      {state:"South Dakota", capital:"Pierre", abbr:"SD"},

      {state:"Tennessee", capital:"Nashville", abbr:"TN"},

      {state:"Texas", capital:"Austin", abbr:"TX"},

      {state:"Utah", capital:"Salt Lake City", abbr:"UT"},

      {state:"Vermont", capital:"Montpelier", abbr:"VT"},

      {state:"Virginia", capital:"Richmond", abbr:"VA"},

      {state:"Washington", capital:"Olympia", abbr:"WA"},

      {state:"West Virginia", capital:"Charleston", abbr:"WV"},

      {state:"Wisconsin", capital:"Madison", abbr:"WI"},

      {state:"Wyoming", capital:"Cheyenne", abbr:"WY"}

]

//Variables


const feedback= document.getElementById('feedback');
const submit = document.getElementById('submitBtn');
const norm = s => String(s).trim().toLowerCase();
let result = document.getElementById('score');
//const box = document.getElementById('box')
//const form = document.getElementById('formu'); 

const located = new Set();

let totalQuestion = 50;
let deck = [];
//let answer = document.getElementById('Answer');
let score = 1;
let questionNum = 0;













// app.js — robust, self-contained
(() => {
'use strict';

/* ===== Data (top so there’s no “already declared” collision) ===== */
const ORDER50 = [
'AK','AL','AR','AZ','CA','CO','CT','DE','FL','GA',
'HI','IA','ID','IL','IN','KS','KY','LA','MA','MD',
'ME','MI','MN','MO','MS','MT','NC','ND','NE','NH',
'NJ','NM','NV','NY','OH','OK','OR','PA','RI','SC',
'SD','TN','TX','UT','VA','VT','WA','WI','WV','WY'
];
const ORDER56 = [
'AK','AL','AR','AS','AZ','CA','CO','CT','DC','DE','FL','GA','GU','HI','IA','ID','IL','IN','KS','KY',
'LA','MA','MD','ME','MI','MN','MO','MP','MS','MT','NC','ND','NE','NH','NJ','NM','NV','NY','OH','OK',
'OR','PA','PR','RI','SC','SD','TN','TX','UT','VA','VI','VT','WA','WI','WV','WY'
];
const NAME_TO_ABBR = {
"alabama":"AL","alaska":"AK","arizona":"AZ","arkansas":"AR","california":"CA","colorado":"CO",
"connecticut":"CT","delaware":"DE","florida":"FL","georgia":"GA","hawaii":"HI","idaho":"ID",
"illinois":"IL","indiana":"IN","iowa":"IA","kansas":"KS","kentucky":"KY","louisiana":"LA",
"maine":"ME","maryland":"MD","massachusetts":"MA","michigan":"MI","minnesota":"MN",
"mississippi":"MS","missouri":"MO","montana":"MT","nebraska":"NE","nevada":"NV",
"new hampshire":"NH","new jersey":"NJ","new mexico":"NM","new york":"NY","north carolina":"NC",
"north dakota":"ND","ohio":"OH","oklahoma":"OK","oregon":"OR","pennsylvania":"PA",
"rhode island":"RI","south carolina":"SC","south dakota":"SD","tennessee":"TN","texas":"TX",
"utah":"UT","vermont":"VT","virginia":"VA","washington":"WA","west virginia":"WV","wisconsin":"WI","wyoming":"WY"
};
const NON_STATES = new Set(["DC","PR","GU","VI","AS","MP"]); // if your SVG has 56 features






/* ===== Helpers ===== */
const norm = s => String(s||'').trim().toLowerCase().replace(/\s+/g,' ');
const toAbbr = input => {
const t = norm(input);
if (!t) return null;
if (/^[a-z]{2}$/i.test(t)) return t.toUpperCase();
return NAME_TO_ABBR[t] || null;
};
const show = msg => {
const el = document.getElementById('feedback');
if (el) el.textContent = msg;
console.log('[Geo]', msg);
};

function colorState(abbr){
const svg = document.getElementById('MapUS');
if (!svg) return false;
let node = svg.querySelector(`#${CSS.escape(abbr)}`) || svg.querySelector(`[id="${abbr}"]`);
if (!node) return false;
node.classList.add('state-ok');
// force fill for paths inside a group too
const paint = el => el.setAttribute('fill', '#22c55e');
if (node.tagName.toLowerCase() === 'g') {
node.querySelectorAll('path,polygon,polyline').forEach(paint);
} else {
paint(node);
}
return true;
}

function updateStats(foundCount, total=50){
const left = total - foundCount;
const c = document.getElementById('stat-correct');
const r = document.getElementById('stat-remaining');
const bar = document.querySelector('#progress .progress__bar');
if (c) c.textContent = `${foundCount} / ${total}`;
if (r) r.textContent = String(left);
if (bar) bar.style.setProperty('--p', Math.max(0, Math.min(1, foundCount/total)));
}

// Pick the main layer and detect whether states are <path> or <g> per state.
function findStateNodes(svg){
// choose the <g> that has the most state-like children
const groups = Array.from(svg.querySelectorAll('g'));
let layer = svg, bestScore = -1;
for (const g of groups) {
const kids = Array.from(g.children);
const score = kids.filter(n => /^(path|g|polygon|polyline)$/i.test(n.tagName)).length;
if (score > bestScore) { bestScore = score; layer = g; }
}
// direct children only (avoid nested artifacts/defs)
let direct = Array.from(layer.children).filter(n => !n.closest('defs'));
let gNodes = direct.filter(n => n.tagName.toLowerCase()==='g');
let pNodes = direct.filter(n => /^(path|polygon|polyline)$/i.test(n.tagName));

let nodes = (gNodes.length >= 50 && gNodes.length >= pNodes.length) ? gNodes : pNodes;

// drop zero-area shapes
nodes = nodes.filter(n => {
try { const b = n.getBBox(); return b.width > 0 && b.height > 0; }
catch { return true; }
});

// If there are more than 56, keep the largest 56 by area (or 50 if you filtered territories)
const target = (nodes.length >= 56) ? 56 : 50;
if (nodes.length > target) {
nodes = nodes
.map(n => { let a=0; try{const b=n.getBBox(); a=b.width*b.height;}catch{} return {n,a}; })
.sort((a,b)=>b.a-a.a)
.slice(0, target)
.map(x=>x.n);
}
return nodes;
}

function assignIdsIfMissing(svg){
// If any element already has a two-letter id, assume IDs exist
if (svg.querySelector('path[id][id^="A"], g[id="CA"], [id="NY"]')) return;

const nodes = findStateNodes(svg);
const n = nodes.length;
const order = (n === 50) ? ORDER50 : (n === 56 ? ORDER56 : null);
if (!order) {
console.warn('[Geo] Unexpected number of shapes:', n, '— cannot assign IDs by order.');
return;
}
nodes.forEach((node, i) => { if (order[i]) node.id = order[i]; });
console.log('[Geo] Assigned IDs by order:', order.length);
}

/* ===== Main wiring ===== */
window.addEventListener('DOMContentLoaded', () => {
const svg = document.getElementById('MapUS');
if (!svg) { console.error('No inline <svg id="MapUS"> found'); return; }

assignIdsIfMissing(svg);

// Click-to-mark (nice UX boost)
svg.addEventListener('click', (e) => {
const target = e.target.closest('path, g, polygon, polyline');
if (!target || !target.id) return;
const abbr = target.id;
if (!ORDER50.includes(abbr)) return; // ignore territories if present
if (target.classList.contains('state-ok')) return;
colorState(abbr);
// also bump stats if you want clicks to count:
const cEl = document.getElementById('stat-correct');
if (cEl) {
const m = cEl.textContent.match(/(\d+)\s*\/\s*(\d+)/);
if (m) updateStats(Math.min(Number(m[1])+1, 50), Number(m[2]));
}
});

// Form grading
const form = document.getElementById('answerForm');
const input = document.getElementById('answer');
const found = new Set();

if (form && input) {
form.addEventListener('submit', (e) => {
e.preventDefault();
const abbr = toAbbr(input.value);
if (!abbr) { show('Not recognized. Try full name or 2-letter code.'); return; }
if (!ORDER50.includes(abbr)) { show(`${abbr} isn’t in the 50-state set.`); input.select(); return; }
if (found.has(abbr)) { show(`${abbr} already entered.`); input.select(); return; }

const ok = colorState(abbr);
if (!ok) { show(`Couldn’t find ${abbr} on the map (id mismatch).`); return; }

found.add(abbr);
updateStats(found.size, 50);
show(`✅ ${abbr} — ${found.size}/50`);
input.value = '';
input.focus();

if (found.size === 50) show('🏁 You got all 50!');
});
}
 // <- set to true if you want the click behavior

function handleClickToMark(e) {
  const target = e.target.closest('path, g, polygon, polyline');
  if (!target || !target.id) return;
  const abbr = target.id;
  if (!ENABLE_CLICK_COLORING) return;     // <-- block coloring when false
  if (target.classList.contains('state-ok')) return;
  colorState(abbr);
  // (optional) updateStats(...) if you want clicks to count
}

svg.addEventListener('click', handleClickToMark);
// Init stats
updateStats(0, 50);
// Log shape count for debugging
const shapeCount = svg.querySelectorAll('path, polygon, polyline').length;
console.log('[Geo] Shape count in SVG:', shapeCount);
});

// expose only if you want to call from console
window.GeoApp = { colorState };

})();




function show(msg) {
  const fb = document.getElementById('feedback');
  if (fb) fb.textContent = msg;   
  console.log(msg);               
}

function updateStats(){
  

}

// Coloring helper (works whether path has inline styles or not)
function colorState(abbr){
const el = document.getElementById(abbr) || document.querySelector(`#MapUS [id="${abbr}"]`);
if (!el) return false;
el.classList.add('state-ok');
el.setAttribute('fill', '#22c55e'); // force green
return true;
}

// Update stats + progress bar (call after each correct answer)
/*function updateStats(foundCount, total=50){
const left = total - foundCount;
document.getElementById('stat-correct').textContent = `${foundCount} / ${total}`;
document.getElementById('stat-remaining').textContent = `${left}`;
const p = Math.max(0, Math.min(1, foundCount/total));
const bar = document.querySelector('#progress .progress__bar');
if (bar) bar.style.setProperty('--p', p);
}*/
//Start round resets all attributes each time "Start!" is clicked. 
function startRound(){
    score == 0; 
    questionNum == 0;
  
} 

/*
let time = clock * 60;
const Timer = document.getElementById("Time")

setInterval(updateCountdown, 1000);


function updateCountdown() {
  const min = Math.floor(time/60);
  let sec = time % 60;

  sec = sec < .15 ? '0' + sec : sec;


  Timer.innerHTML = `${min}: ${sec}`;
  time--;

  if (Timer<0) {
    clearInterval(refreshIntervalId)
  }
}      
*/




