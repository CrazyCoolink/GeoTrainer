  



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


// This runs after the HTML is parsed because of "defer"
 startBtn = document.getElementById('startBtn');
startBtn.addEventListener('click', () => {
  console.log('Start clicked');   // replace with startRound();
})



// ======= ELEMENT HOOKS ======= 

const $ = s => document.querySelector(s);

const modeSelect  = $('#modeSelect');

const countSelect = $('#countSelect');

const startBtn    = $('#startBtn');

const skipBtn     = $('#skipBtn');

const statsEl     = $('#stats');

const promptEl    = $('#prompt');

const helperEl    = $('#helper');

const choicesEl   = $('#choices');

const typingRow   = $('#typingRow');

const typeInput   = $('#typeInput');

const submitBtn   = $('#submitBtn');

const feedbackEl  = $('#feedback');

const endBox      = $('#end');

const summaryEl   = $('#summary');

const playAgain   = $('#playAgain');



/* ======= GAME STATE ======= */

let mode = 'state-capital';

let totalQs = 50;

let deck = [];         // indices into STATES

let qIndex = 0;        // 0..totalQs-1 (displayed as 1..totalQs)

let score = 0;

let streak = 0;

let current = null;    // current STATES item



/* ======= HELPERS ======= */

function randInt(n){ return Math.floor(Math.random() * n); }

function shuffle(a){ for (let i=a.length-1; i>0; i--) { const j = randInt(i+1); [a[i],a[j]] = [a[j],a[i]]; } return a; }

function normalize(s){ return s.trim().toLowerCase(); }



/* pick n distinct random indices from 0..max-1, excluding one index */

function pickDistinct(n, max, excludeIdx) {

  const set = new Set();

  while (set.size < n) {

    const k = randInt(max);

    if (k !== excludeIdx) set.add(k);

  }

  return Array.from(set);

}



/* ======= CORE LOOP ======= */

function startRound() {

  // 1) Read settings

  mode = modeSelect.value;

  totalQs = parseInt(countSelect.value, 10);



  // 2) Build deck: 0..49 shuffled, then slice

  deck = shuffle([...Array(STATES.length).keys()]).slice(0, totalQs);



  // 3) Reset state

   score = 0; streak = 0; qIndex = 0; current = null;

  feedbackEl.textContent = '';

  choicesEl.innerHTML = '';

  typingRow.style.display = 'none';

  endBox.style.display = 'none';

  summaryEl.textContent = '';
 


  // 4) Lock controls during round

  modeSelect.disabled = true;

  countSelect.disabled = true;

  skipBtn.disabled = false;

  startBtn.textContent = 'Restart';



  // 5) Show first question

  updateStats();

  nextQuestion();

}



function nextQuestion() {

  if (qIndex >= totalQs) return endRound();



  // pull next item

  const idx = deck[qIndex];

  current = STATES[idx];

  qIndex++;



  // prompt text

  if (mode === 'state-capital') {

    promptEl.textContent = `What is the capital of ${current.name}?`;

    helperEl.textContent = 'Choose the correct answer (1–4).';

    renderChoices(current.capital, STATES.map(s => s.capital), idx);

  } else if (mode === 'capital-state') {

    promptEl.textContent = `Which state has the capital ${current.capital}?`;

    helperEl.textContent = 'Choose the correct answer (1–4).';

    renderChoices(current.name, STATES.map(s => s.name), idx);

  } else if (mode === 'abbr-state') {

    promptEl.textContent = `Which state uses the postal code ${current.abbr}?`;

    helperEl.textContent = 'Choose the correct answer (1–4).';

    renderChoices(current.name, STATES.map(s => s.name), idx);

  } else if (mode === 'typing') {

    promptEl.textContent = `Type the capital of ${current.name}`;

    helperEl.textContent = 'Press Enter to submit. Spelling matters.';

    renderTyping(current.capital);

  }



  feedbackEl.textContent = '';

  updateStats();

}



function renderChoices(correctLabel, allLabels, currentIdx) {

  // Build 3 distinct wrong options

  const wrongIdxs = pickDistinct(3, STATES.length, currentIdx);

  const wrongs = wrongIdxs.map(i => {

    // choose label set according to mode

    if (mode === 'state-capital') return STATES[i].capital;

    if (mode === 'capital-state') return STATES[i].name;

    if (mode === 'abbr-state')    return STATES[i].name;

    return ''; // not used

  });



  // ensure uniqueness (in rare case of text collision)

  const set = new Set([correctLabel, ...wrongs]);

  if (set.size < 4) {

    // regenerate wrongs until unique (very unlikely with these datasets)

    return renderChoices(correctLabel, allLabels, currentIdx);

  }



  const options = shuffle([correctLabel, ...wrongs]);



  choicesEl.innerHTML = '';

  typingRow.style.display = 'none';



  options.forEach((txt, i) => {

    const btn = document.createElement('button');

    btn.className = 'choice';

    btn.textContent = `${i+1}. ${txt}`;

    btn.setAttribute('role','option');

    btn.addEventListener('click', () => gradeAnswer(txt, correctLabel, btn));

    btn.addEventListener('keydown', (e) => {

      if (e.key === 'Enter' || e.key === ' ') gradeAnswer(txt, correctLabel, btn);

    });

    choicesEl.appendChild(btn);

  });



  // number key hotkeys 1–4

  document.onkeydown = (e) => {

    const n = parseInt(e.key, 10);

    if (n>=1 && n<=4 && choicesEl.children[n-1]) choicesEl.children[n-1].click();

  };

}



function renderTyping(correctLabel) {

  choicesEl.innerHTML = '';

  typingRow.style.display = 'flex';

  typeInput.value = '';

  typeInput.focus();



  const submit = () => {

    const user = typeInput.value;

    gradeAnswer(user, correctLabel, null);

  };

  submitBtn.onclick = submit;

  typeInput.onkeydown = (e) => { if (e.key === 'Enter') submit(); };



  // remove number hotkeys during typing mode

  document.onkeydown = null;

}



function gradeAnswer(userValue, correctValue, buttonRef) {

  const isRight = normalize(userValue) === normalize(correctValue);



  if (isRight) {

    score++; streak++;

    feedbackEl.textContent = 'Correct!';

    if (buttonRef) buttonRef.classList.add('ok');

  } else {

    streak = 0;

    feedbackEl.textContent = `Wrong — correct: ${correctValue}`;

    if (buttonRef) buttonRef.classList.add('bad');

    // also highlight the correct one if in MCQ mode

    [...choicesEl.children].forEach(btn => {

      const label = btn.textContent.replace(/^\d+\.\s*/, '');

      if (normalize(label) === normalize(correctValue)) btn.classList.add('ok');

    });

  }



  updateStats();

  setTimeout(nextQuestion, 750);

}



function updateStats() {

  statsEl.textContent = `Score ${score} · Streak ${streak} · Q ${Math.min(qIndex, totalQs)}/${totalQs}`;

}



function endRound() {

  skipBtn.disabled = true;

  modeSelect.disabled = false;

  countSelect.disabled = false;



  const pct = Math.round((score / totalQs) * 100);

  summaryEl.innerHTML = `

    <p>You answered <b>${score}</b> out of <b>${totalQs}</b> correctly (${pct}%).</p>

    <p class="muted">Mode: ${modeLabel(mode)}</p>

  `;

  endBox.style.display = 'block';

  document.onkeydown = null; // clear hotkeys

}



function modeLabel(m) {

  if (m === 'state-capital') return 'State → Capital';

  if (m === 'capital-state') return 'Capital → State';

  if (m === 'abbr-state')    return 'Abbreviation → State';

  if (m === 'typing')        return 'Typing (State → Capital)';

  return m;

}



/* ======= WIRES ======= */

startBtn.addEventListener('click', startRound);

skipBtn.addEventListener('click', nextQuestion);

playAgain.addEventListener('click', startRound);



// initial UI state

helperEl.textContent = '';
