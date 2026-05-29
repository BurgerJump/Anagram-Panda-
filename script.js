/* ========================= */
/* LETTERS */
/* ========================= */

const englishLetters = [
  "E","E","E","E","E","E","E",
  "T","T","T","T","T",
  "A","A","A","A","A",
  "O","O","O","O",
  "I","I","I","I",
  "N","N","N","N",
  "S","S","S",
  "H","H","H",
  "R","R","R",
  "D","D",
  "L","L",
  "U","U",
  "C","C",
  "M","M",
  "W","W",
  "F","F",
  "G","G",
  "Y","Y",
  "P","P",
  "B",
  "V",
  "K",
  "J",
  "X",
  "Q",
  "Z"
];

/* ========================= */
/* ELEMENTS */
/* ========================= */

const lettersDiv =
document.getElementById("letters");

const wordSlots =
document.getElementById("wordSlots");

const scoreText =
document.getElementById("score");

const timeText =
document.getElementById("time");

const message =
document.getElementById("message");

/* ========================= */
/* STATE */
/* ========================= */

let currentLetters = [];

let currentWord = "";

let score = 0;

let time = 90;

let timer = null;

let gameOver = false;

let wordHistory = [];

function saveTimeOverWord(word){

  wordHistory.push({
    word: word,
    type: "timeout"
  });

  console.log("TIME OVER WORD:", word);
}


/* ========================= */
/* DICTIONARY */
/* ========================= */

let dictionary = [];

fetch("words.txt")
.then(r => r.text())
.then(text => {

  dictionary = text
  .split("\n")
  .map(w => w.trim().toUpperCase());

});

/* ========================= */
/* GENERATE LETTERS */
/* ========================= */

function generateLetters(){

  currentLetters = [];

  const vowels = [
    "A","E","I","O","U"
  ];

  currentLetters.push(

    vowels[
      Math.floor(
        Math.random() *
        vowels.length
      )
    ]
  );

  for(let i=1;i<9;i++){

    currentLetters.push(

      englishLetters[
        Math.floor(
          Math.random() *
          englishLetters.length
        )
      ]
    );
  }

  shuffleArray(currentLetters);

  renderLetters();

  renderSlots();
}

/* ========================= */
/* SHUFFLE */
/* ========================= */

function shuffleArray(arr){

  for(

    let i = arr.length - 1;
    i > 0;
    i--

  ){

    const j = Math.floor(
      Math.random() * (i + 1)
    );

    [arr[i], arr[j]] =
    [arr[j], arr[i]];
  }
}

/* ========================= */
/* CLEAR WORD */
/* ========================= */

function clearWord() {

  if (gameOver) return;

  currentWord = "";

  const btns =
    document.querySelectorAll(".letterBtn");

  btns.forEach(btn => {

    btn.disabled = false;

    btn.style.opacity = 1;
  });

  renderSlots();
}

/* ========================= */
/* RENDER LETTERS */
/* ========================= */

function renderLetters(){

  lettersDiv.innerHTML = "";

  currentLetters.forEach(
    (letter,index)=>{

      const btn =
      document.createElement("button");

      btn.className =
      "letterBtn";

      btn.innerText =
      letter;

      btn.onclick =
      ()=>selectLetter(index);

      lettersDiv.appendChild(btn);
    }
  );
}

/* ========================= */
/* RENDER SLOTS */
/* ========================= */

function renderSlots(){

  wordSlots.innerHTML = "";

  for(let i=0;i<9;i++){

    const slot =
    document.createElement("div");

    slot.className =
    "slot";

    slot.innerText =
    currentWord[i] || "";

    wordSlots.appendChild(slot);
  }
}

/* ========================= */
/* SELECT LETTER */
/* ========================= */

function selectLetter(index){

  if(gameOver) return;

  const btns =
  document.querySelectorAll(".letterBtn");

  const btn =
  btns[index];

  if(btn.disabled) return;

  currentWord +=
  currentLetters[index];

  btn.disabled = true;

  btn.style.opacity = 0.3;

  renderSlots();
}

/* ========================= */
/* DELETE LETTER */
/* ========================= */

function deleteLetter(){

  if(gameOver) return;

  if(currentWord.length === 0)
  return;

  const last =
  currentWord[
    currentWord.length - 1
  ];

  currentWord =
  currentWord.slice(0,-1);

  const btns =
  document.querySelectorAll(".letterBtn");

  for(

    let i = btns.length - 1;
    i >= 0;
    i--

  ){

    if(

      currentLetters[i] === last &&
      btns[i].disabled

    ){

      btns[i].disabled = false;

      btns[i].style.opacity = 1;

      break;
    }
  }

  renderSlots();
}

/* ========================= */
/* SHUFFLE BUTTON */
/* ========================= */

function shuffleLetters(){

  if(gameOver) return;

  shuffleArray(currentLetters);

  renderLetters();
}

/* ========================= */
/* CAN BUILD */
/* ========================= */

function canBuildWord(word){

  let temp = [...currentLetters];

  for(let letter of word){

    const idx =
    temp.indexOf(letter);

    if(idx === -1)
    return false;

    temp.splice(idx,1);
  }

  return true;
}

/* ========================= */
/* VALID WORD */
/* ========================= */

function isValidWord(word){

  return dictionary.includes(word);
}

/* ========================= */
/* FIND BEST WORD */
/* ========================= */

function findBestWord(){

  let best = "";

  dictionary.forEach(word=>{

    if(

      word.length <= 9 &&
      canBuildWord(word) &&
      word.length > best.length

    ){

      best = word;
    }
  });

  return best;
}

/* ========================= */
/* GET LONGEST WORDS */
/* ========================= */

function getLongestWords(bestWord){

  return [

    ...new Set(

      dictionary.filter(w =>

        w.length === bestWord.length &&
        w.length <= 9 &&
        canBuildWord(w)

      )

    )

  ].slice(0,3);
}

/* ========================= */
/* TIMER */
/* ========================= */


function startTimer(){

  clearInterval(timer);
  gameOver = false;

  timer = setInterval(()=>{

    if(gameOver) return;

    time--;
    timeText.innerText = time;

    if(time <= 0){

      time = 0;
      timeText.innerText = 0;

      clearInterval(timer);
      gameOver = true;

      const word = currentWord.trim().toUpperCase();

      if(word.length < 3){
        message.innerHTML = "❌ MIN 3 LETTERS";
        currentWord = "";
        renderSlots();
        return;
      }

      saveTimeOverWord(word);

      const bestWord = findBestWord();
      const longestWords = getLongestWords(bestWord);

      let letterPoints = word.length * 10;

      message.innerHTML =
        "<span style='color:#ffe600;font-size:22px'>" +
        word +
        "</span><br>" +
        "⭐ " + letterPoints + " POINTS<br><br>" +
        "🏆 LONGEST WORD (" +
        bestWord.length +
        ")<br>" +
        "<span style='color:#00ff99'>" +
        longestWords.join(" • ") +
        "</span>";

      currentWord = "";
      renderSlots();
    }

  }, 1000);
}

/* ========================= */
/* SUBMIT */
/* ========================= */

function submitWord(){

  if(gameOver) return;

  clearInterval(timer);

  const word =
  currentWord.toUpperCase();

  if(word.length < 3){

    message.innerHTML =
    "❌ MIN 3 LETTERS";

    startTimer();

    return;
  }

  if(!canBuildWord(word)){

    message.innerHTML =
    "❌ INVALID LETTERS";

    startTimer();

    return;
  }

  if(!isValidWord(word)){

    message.innerHTML =
    "❌ INVALID";

    startTimer();

    return;
  }

  const bestWord =
  findBestWord();

  const longestWords =
  getLongestWords(bestWord);

  let letterPoints =
  word.length * 10;

  let timeBonus =
  Math.floor(time / 10) - 4;

  if(timeBonus < 0){

    timeBonus = 0;
  }

  let longWordBonus = 0;

  let allLettersBonus = 0;

  if(word.length === 9){

    allLettersBonus = 100;
  }

  if(
    word.length ===
    bestWord.length
  ){

    longWordBonus = 100;
  }

  let points =

    letterPoints +
    timeBonus +
    longWordBonus +
    allLettersBonus;

  score += points;

  scoreText.innerText =
  score;

  message.innerHTML =

    "<span style='color:#ffe600;font-size:26px'>" +

    word +

    "</span>" +
    "✅ " +
    letterPoints +

    " POINTS  ";

  if(timeBonus > 0){

    message.innerHTML +=

      "⏳ BONUS +" +

      timeBonus;
  }

  if(longWordBonus > 0){

    message.innerHTML +=

      "<br>👑 LONGEST BONUS +100";
  }

  if(allLettersBonus > 0){

    message.innerHTML +=

      "🔥 9 LETTERS +100";
  }

  message.innerHTML +=

    "  TOTAL: " +

    points +

    "<br>" +
    "<span style='color:#00dd99'>" +
    "LONGEST (" +

    bestWord.length +

    ") " +

   "</span>"+

    longestWords.join(" • ") 

 ;

  currentWord = "";

  renderSlots();

  gameOver = true;
}

/* ========================= */
/* RESTART */
/* ========================= */

function restartGame(){

  clearInterval(timer);

  currentWord = "";

  time = 90;

  timeText.innerText = time;

  gameOver = false;

  message.innerHTML = "";

  generateLetters();

  startTimer();
}

/* ========================= */
/* START */
/* ========================= */

generateLetters();

startTimer();