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


// app.js (use type="module" in the <script> tag OR ensure this file is included only once)
window.addEventListener('DOMContentLoaded', () => {
console.log('script running');

const svg = document.getElementById('MapUS');
if (!svg) { console.error('No inline <svg id="MapUS"> found'); return; }

// Grab shapes
let paths = svg.querySelectorAll('path');
console.log('path count:', paths.length);

if (paths.length === 0) {
// fallback in case your export used polygons
paths = svg.querySelectorAll('polygon, polyline');
console.log('polygon/polyline count:', paths.length);
}



// If your export has 56 (states + DC/territories) and was sorted by STUSPS:
const ORDER56 = [
'AK','AL','AR','AS','AZ','CA','CO','CT','DC','DE','FL','GA','GU','HI','IA','ID','IL','IN','KS','KY',
'LA','MA','MD','ME','MI','MN','MO','MP','MS','MT','NC','ND','NE','NH','NJ','NM','NV','NY','OH','OK',
'OR','PA','PR','RI','SC','SD','TN','TX','UT','VA','VI','VT','WA','WI','WV','WY'
];

// Assign ids once if none exist yet
const hasAnyId = !!svg.querySelector('path[id], polygon[id], polyline[id]');
if (!hasAnyId) {
const order = (paths.length === 50) ? ORDER50 : (paths.length === 56 ? ORDER56 : null);
if (!order) {
console.warn('Unexpected number of shapes; cannot assign IDs by order.');
} else {
paths.forEach((el, i) => { if (order[i]) el.id = order[i]; });
console.log('IDs assigned.');
}
}

// Map from full name -> abbr (fill out the rest yourself)
const NAME_TO_ABBR= {
"alabama": "AL", "alaska": "AK", "arizona": "AZ", "arkansas": "AR",
"california": "CA","colorado": "CO", "connecticut": "CT","delaware": "DE",
"florida": "FL", "georgia": "GA", "hawaii": "HI", "idaho": "ID",
"illinois": "IL", "indiana": "IN", "iowa": "IA", "kansas": "KS",
"kentucky": "KY", "louisiana": "LA", "maine": "ME", "maryland": "MD",
"massachusetts":"MA","michigan":"MI", "minnesota":"MN", "mississippi":"MS",
"missouri":"MO", "montana":"MT", "nebraska":"NE", "nevada":"NV",
"new hampshire":"NH","new jersey":"NJ","new mexico":"NM", "new york":"NY",
"north carolina":"NC","north dakota":"ND","ohio":"OH", "oklahoma":"OK",
"oregon":"OR", "pennsylvania":"PA","rhode island":"RI","south carolina":"SC",
"south dakota":"SD","tennessee":"TN", "texas":"TX", "utah":"UT",
"vermont":"VT", "virginia":"VA", "washington":"WA", "west virginia":"WV",
"wisconsin":"WI", "wyoming":"WY"
};
});





//Variables


const feedback= document.getElementById('feedback');
const submit = document.getElementById('submitBtn');
const norm = s => String(s).trim().toLowerCase();
let result = document.getElementById('score');
const box = document.getElementById('box')
const form = document.getElementById('formu'); 

const located = new Set();

let totalQuestion = 50;
let deck = [];
//let answer = document.getElementById('Answer');
let score = 1;
let questionNum = 0;

function show(msg) {
  const fb = document.getElementById('feedback');
  if (fb) fb.textContent = msg;   
  console.log(msg);               
}

function updateStats(){
  

}
//Start round resets all attributes each time "Start!" is clicked. 
function startRound(){
    score == 0; 
    questionNum == 0;
    /*for(let i = array.length - 1; i > 0; i--){
        const random = Math.floor(Math.random() * (i + 1));
    }*/

    
}
function createDeck(){

}
if (form){
form.addEventListener('submit', e => {
  e.preventDefault();
  const guy = norm(box.value);
  if (!guy) return;

  const agree = STATESS.find(s => norm(s.state) === guy);
  if (agree) {
    
    result.textContent = `Score: ${score++}`;
    console.log(result)
    show('Feedback: Correct!')
  }
  else {
    show('Feedback: This is not a state'); return;

  }
  
  if (located.has(agree.state)){
    show (`${agree.state} already entered`); box.select(); return;
  }
  located.add(agree.state);
  
})
}





