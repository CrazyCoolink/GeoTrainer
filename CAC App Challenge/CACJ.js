const STATES = [
["Alabama","Montgomery","AL"],["Alaska","Juneau","AK"],["Arizona","Phoenix","AZ"],
["Arkansas","Little Rock","AR"],["California","Sacramento","CA"],["Colorado","Denver","CO"],
["Connecticut","Hartford","CT"],["Delaware","Dover","DE"],["Florida","Tallahassee","FL"],
["Georgia","Atlanta","GA"],["Hawaii","Honolulu","HI"],["Idaho","Boise","ID"],
["Illinois","Springfield","IL"],["Indiana","Indianapolis","IN"],["Iowa","Des Moines","IA"],
["Kansas","Topeka","KS"],["Kentucky","Frankfort","KY"],["Louisiana","Baton Rouge","LA"],
["Maine","Augusta","ME"],["Maryland","Annapolis","MD"],["Massachusetts","Boston","MA"],
["Michigan","Lansing","MI"],["Minnesota","Saint Paul","MN"],["Mississippi","Jackson","MS"],
["Missouri","Jefferson City","MO"],["Montana","Helena","MT"],["Nebraska","Lincoln","NE"],
["Nevada","Carson City","NV"],["New Hampshire","Concord","NH"],["New Jersey","Trenton","NJ"],
["New Mexico","Santa Fe","NM"],["New York","Albany","NY"],["North Carolina","Raleigh","NC"],
["North Dakota","Bismarck","ND"],["Ohio","Columbus","OH"],["Oklahoma","Oklahoma City","OK"],
["Oregon","Salem","OR"],["Pennsylvania","Harrisburg","PA"],["Rhode Island","Providence","RI"],
["South Carolina","Columbia","SC"],["South Dakota","Pierre","SD"],["Tennessee","Nashville","TN"],
["Texas","Austin","TX"],["Utah","Salt Lake City","UT"],["Vermont","Montpelier","VT"],
["Virginia","Richmond","VA"],["Washington","Olympia","WA"],["West Virginia","Charleston","WV"],
["Wisconsin","Madison","WI"],["Wyoming","Cheyenne","WY"]
].map(([name,capital,abbr]) => ({name,capital,abbr}));

/* ======= ELEMENT HOOKS ======= */
const $ = s => document.querySelector(s);
const modeSelect = $('#modeSelect');
const countSelect = $('#countSelect');
const startBtn = $('#startBtn');
const skipBtn = $('#skipBtn');
const statsEl = $('#stats');
const promptEl = $('#prompt');
const helperEl = $('#helper');
const choicesEl = $('#choices');
const typingRow = $('#typingRow');
const typeInput = $('#typeInput');
const submitBtn = $('#submitBtn');
const feedbackEl = $('#feedback');
const endBox = $('#end');
const summaryEl = $('#summary');
const playAgain = $('#playAgain');

const mapWrap = $('#mapWrap');
const usMap = $('#usMap');

/* ======= GAME STATE ======= */
let mode = 'map';
let totalQs = 50;
let deck = []; // indices into STATES
let qIndex = 0; // displayed as 1..N
let score = 0;
let streak = 0;
let current = null; // current state record

/* ======= MAP HELPERS ======= */
const ABBR_TO_NAME = Object.fromEntries(STATES.map(s => [s.abbr, s.name]));
const NAME_TO_ABBR = Object.fromEntries(STATES.map(s => [s.name, s.abbr]));
function mapRegions(){ return usMap ? [...usMap.querySelectorAll('.region')] : []; }
function mapAbbrsAvailable(){ return new Set(mapRegions().map(n => n.id)); }
function clearMapHighlights(){
mapRegions().forEach(n => n.classList.remove('state-ok','state-bad'));
}
function setMapInteractive(on) {
mapRegions().forEach(n => {
if (on) n.classList.remove('inactive');
else n.classList.add('inactive');
});
}
function wireMapEvents(){
mapRegions().forEach(n => {
// Ensure accessibility attributes exist
if (!n.getAttribute('tabindex')) n.setAttribute('tabindex','0');
if (!n.getAttribute('role')) n.setAttribute('role','button');
if (!n.getAttribute('aria-label')) n.setAttribute('aria-label', n.dataset.name || n.id);

n.addEventListener('click', () => onMapPick(n.id));
n.addEventListener('keydown', (e) => {
if (e.key === 'Enter' || e.key === ' ') onMapPick(n.id);
});
});
}
function onMapPick(clickedAbbr){
// In map mode, the "answer string" is the full state name from the clicked shape.
const clickedName = ABBR_TO_NAME[clickedAbbr] || (usMap.querySelector('#'+CSS.escape(clickedAbbr))?.dataset.name) || '';
gradeAnswer(clickedName, current.name, null, clickedAbbr);
}

/* ======= GENERAL HELPERS ======= */
function randInt(n){ return Math.floor(Math.random() * n); }
function shuffle(a){ for (let i=a.length-1; i>0; i--) { const j = randInt(i+1); [a[i],a[j]] = [a[j],a[i]]; } return a; }
function normalize(s){ return String(s).trim().toLowerCase(); }
function pickDistinct(n, max, excludeIdx){
const set = new Set();
while (set.size < n) {
const k = randInt(max);
if (k !== excludeIdx) set.add(k);
}
return [...set];
}

/* ======= CORE LOOP ======= */
function startRound() {
// 1) Read settings
mode = modeSelect.value;
totalQs = parseInt(countSelect.value, 10);

// 2) Build deck
let indices = [...Array(STATES.length).keys()];

if (mode === 'map') {
// Only ask states that actually exist in your SVG (by postal code id)
const available = mapAbbrsAvailable();
indices = indices.filter(i => available.has(STATES[i].abbr));
// If player picked more questions than available states, cap it
if (totalQs > indices.length) totalQs = indices.length;
}
deck = shuffle(indices).slice(0, totalQs);

// 3) Reset state + UI
score = 0; streak = 0; qIndex = 0; current = null;
feedbackEl.textContent = '';
choicesEl.innerHTML = '';
typingRow.style.display = 'none';
endBox.style.display = 'none';
summaryEl.textContent = '';
clearMapHighlights();
mapWrap.hidden = (mode !== 'map');

// 4) Lock controls during round
modeSelect.disabled = true;
countSelect.disabled = true;
skipBtn.disabled = false;
startBtn.textContent = 'Restart';

// 5) First question
updateStats();
nextQuestion();
}

function nextQuestion(){
if (qIndex >= totalQs) return endRound();

const idx = deck[qIndex];
current = STATES[idx];
qIndex++;

if (mode === 'map') {
promptEl.textContent = `Find: ${current.name}`;
helperEl.textContent = 'Click the state on the map (or use Tab + Enter).';
choicesEl.innerHTML = '';
typingRow.style.display = 'none';
clearMapHighlights();
setMapInteractive(true);
// number hotkeys off in map mode
document.onkeydown = null;
} else if (mode === 'state-capital') {
promptEl.textContent = `What is the capital of ${current.name}?`;
helperEl.textContent = 'Choose the correct answer (1–4).';
renderChoices(current.capital, idx);
} else if (mode === 'capital-state') {
promptEl.textContent = `Which state has the capital ${current.capital}?`;
helperEl.textContent = 'Choose the correct answer (1–4).';
renderChoices(current.name, idx);
} else if (mode === 'abbr-state') {
promptEl.textContent = `Which state uses the postal code ${current.abbr}?`;
helperEl.textContent = 'Choose the correct answer (1–4).';
renderChoices(current.name, idx);
} else if (mode === 'typing') {
promptEl.textContent = `Type the capital of ${current.name}`;
helperEl.textContent = 'Press Enter to submit. Spelling matters.';
renderTyping(current.capital);
}

feedbackEl.textContent = '';
updateStats();
}

function renderChoices(correctLabel, currentIdx){
// Build wrong options depending on mode
const wrongIdxs = pickDistinct(3, STATES.length, currentIdx);
const wrongs = wrongIdxs.map(i => {
if (mode === 'state-capital') return STATES[i].capital;
if (mode === 'capital-state') return STATES[i].name;
if (mode === 'abbr-state') return STATES[i].name;
return '';
});
// Ensure uniqueness; regenerate if needed
const unique = new Set([correctLabel, ...wrongs]);
if (unique.size < 4) return renderChoices(correctLabel, currentIdx);

const options = shuffle([correctLabel, ...wrongs]);

choicesEl.innerHTML = '';
typingRow.style.display = 'none';
mapWrap.hidden = (mode !== 'map');

options.forEach((txt, i) => {
const btn = document.createElement('button');
btn.className = 'choice';
btn.textContent = `${i+1}. ${txt}`;
btn.setAttribute('role','option');
btn.addEventListener('click', () => gradeAnswer(txt, correctLabel, btn, null));
btn.addEventListener('keydown', (e) => {
if (e.key === 'Enter' || e.key === ' ') gradeAnswer(txt, correctLabel, btn, null);
});
choicesEl.appendChild(btn);
});

// number key hotkeys 1–4
document.onkeydown = (e) => {
const n = parseInt(e.key, 10);
if (n>=1 && n<=4 && choicesEl.children[n-1]) choicesEl.children[n-1].click();
};
}

function renderTyping(correctLabel){
choicesEl.innerHTML = '';
typingRow.style.display = 'flex';
mapWrap.hidden = (mode !== 'map');
typeInput.value = '';
typeInput.focus();

const submit = () => gradeAnswer(typeInput.value, correctLabel, null, null);
submitBtn.onclick = submit;
typeInput.onkeydown = (e) => { if (e.key === 'Enter') submit(); };
document.onkeydown = null; // no number hotkeys here
}

function gradeAnswer(userValue, correctValue, buttonRef, clickedAbbr){
const isRight = normalize(userValue) === normalize(correctValue);

if (mode === 'map') {
// Map feedback: color shapes
setMapInteractive(false);
const correctAbbr = NAME_TO_ABBR[correctValue];
if (clickedAbbr) {
const clickedEl = usMap.querySelector('#'+CSS.escape(clickedAbbr));
if (clickedEl) clickedEl.classList.add(isRight ? 'state-ok' : 'state-bad');
}
const correctEl = usMap.querySelector('#'+CSS.escape(correctAbbr));
if (correctEl) correctEl.classList.add('state-ok');
} else {
// Button feedback
if (buttonRef) buttonRef.classList.add(isRight ? 'ok' : 'bad');
if (!isRight) {
[...choicesEl.children].forEach(btn => {
const label = btn.textContent.replace(/^\d+\.\s*/, '');
if (normalize(label) === normalize(correctValue)) btn.classList.add('ok');
});
}
}

if (isRight) {
score++; streak++;
feedbackEl.textContent = 'Correct!';
} else {
streak = 0;
feedbackEl.textContent = `Wrong — correct: ${correctValue}`;
}

updateStats();
setTimeout(nextQuestion, 800);
}

function updateStats(){
statsEl.textContent = `Score ${score} · Streak ${streak} · Q ${Math.min(qIndex, totalQs)}/${totalQs}`;
}

function endRound(){
skipBtn.disabled = true;
modeSelect.disabled = false;
countSelect.disabled = false;
setMapInteractive(false);
document.onkeydown = null;

const pct = Math.round((score/totalQs)*100);
summaryEl.innerHTML = `
<p>You answered <b>${score}</b> of <b>${totalQs}</b> correctly (${pct}%).</p>
<p class="muted">Mode: ${modeLabel(mode)}</p>
`;
endBox.style.display = 'block';
}

function modeLabel(m){
if (m === 'map') return 'Map: Find the State';
if (m === 'state-capital') return 'State → Capital';
if (m === 'capital-state') return 'Capital → State';
if (m === 'abbr-state') return 'Abbreviation → State';
if (m === 'typing') return 'Typing (State → Capital)';
return m;
}

/* ======= WIRES ======= */
startBtn.addEventListener('click', startRound);
skipBtn.addEventListener('click', nextQuestion);
playAgain.addEventListener('click', startRound);
wireMapEvents(); // make the inline SVG interactive on load

// initial UI
helperEl.textContent = '';