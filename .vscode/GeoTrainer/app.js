const STATES = [

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


const feedback= document.getElementById('feedback')
//const stats
const norm = s => String(s).trim().toLowerCase();



let totalQuestion = 50;
let deck = []
let answer;
let current = null;
let score = 5;
let questionNum = 0;

submitBtn.onclick = gradeTyping
typeInput.onkeydown = (e)=>{ if(e.key === 'Enter') gradeTyping(); };

//function updateStats(){}
//Start round resets all attributes each time "Start!" is clicked. 
shuffle(STATES);
function startRound(array){
    score == 0; 
    questionNum == 0;
    for(let i = array.length - 1; i > 0; i--){
        const random = Math.floor(Math.random() * (i + 1));
    }

    
}
function createDeck(){

}
function nextQuestion(){
const index = deck[qIndex++];
current = STATES[index]


}

//Check whether answer is correct, update question, and remove state from being answered again
function gradeTyping(){
  const user = typeInput.value;

  const isRight = current.state

  const isCorrect = norm(user) === norm(isRight);
  if(isCorrect){

    score++; 
    feedback.textContent = 'Correct';
    
  }
    else{
        feedback.textContent ='Wrong, try again'
    }

}

