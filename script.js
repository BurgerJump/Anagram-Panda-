/* =========================================================
   ANAGRAM PANDA
   ========================================================= */


/* =========================
   LETTERS
========================= */

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


/* =========================
   ELEMENTS
========================= */

const lettersDiv =
  document.getElementById("letters");

const wordSlots =
  document.getElementById("wordSlots");

const scoreText =
  document.getElementById("score");

const message =
  document.getElementById("message");

const roundBtn =
  document.getElementById("roundBtn");

const highScoreText =
  document.getElementById("highScore");

const deleteBtn =
  document.getElementById("deleteBtn");

const shuffleBtn =
  document.getElementById("shuffleBtn");

const clearBtn =
  document.getElementById("clearBtn");

const submitBtn =
  document.getElementById("submitBtn");

const keySound = new Audio("key.mp3");
keySound.preload = "auto";

const key2Sound = new Audio("key2.mp3");
key2Sound.preload = "auto";

const key3Sound = new Audio("key3.mp3");
key3Sound.preload = "auto";

const key4Sound = new Audio("key4.mp3");
key4Sound.preload = "auto";





function selectLetter(index){

  if(gameOver)
    return;

  // ...
}




/* =========================
   STATE
========================= */

let currentLetters = [];

let currentWord = "";

let score = 0;

let time = 90;

let timer = null;

let gameOver = false;

let currentRound = 1;

const totalRounds = 3;

let bonusRound = false;

let bonusTarget = "";

let roundScores = [0, 0, 0, 0];


/* =========================
   DICTIONARY
========================= */

let dictionary = [];

fetch("words.txt")
  .then(response => response.text())
  .then(text => {

    dictionary =
      text
        .split("\n")
        .map(word =>
          word.trim().toUpperCase()
        )
        .filter(word =>
          word.length > 0
        );

  })
  .catch(() => {

    dictionary = [];

  });


/* ========================= */
/* HIGH SCORE */
/* ========================= */

const highScore =
localStorage.getItem("highScore") || "0";

document.getElementById(
"highScore"
).textContent =
highScore;


/* =========================
   GENERATE LETTERS
========================= */

function generateLetters(){

  currentLetters = [];

  const vowels = [
    "A",
    "E",
    "I",
    "O",
    "U"
  ];

  currentLetters.push(
    vowels[
      Math.floor(
        Math.random() * vowels.length
      )
    ]
  );

  for(let i = 1; i < 9; i++){

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


/* =========================
   BONUS LETTERS
========================= */

function generateBonusRound(){

  const nineLetterWords =
    dictionary.filter(
      word =>
        word.length === 9
    );

  if(nineLetterWords.length === 0){

    bonusTarget = "";

    generateLetters();

    return;

  }

  bonusTarget =
    nineLetterWords[
      Math.floor(
        Math.random() *
        nineLetterWords.length
      )
    ];

  currentLetters =
    [...bonusTarget];

  shuffleArray(currentLetters);

  renderLetters();

  renderSlots();

}


/* =========================
   SHUFFLE ARRAY
========================= */

function shuffleArray(arr){

  for(
    let i = arr.length - 1;
    i > 0;
    i--
  ){

    const j =
      Math.floor(
        Math.random() * (i + 1)
      );

    [arr[i], arr[j]] =
    [arr[j], arr[i]];

  }

}


/* =========================
   RENDER LETTERS
========================= */

function renderLetters(){

  lettersDiv.innerHTML = "";

  currentLetters.forEach(
    (letter, index) => {

      const button =
        document.createElement("button");

      button.className =
        "letterBtn";

      button.type =
        "button";

      button.innerText =
        letter;

      button.onclick =
        () => selectLetter(index);

      lettersDiv.appendChild(button);

    }
  );

}


/* =========================
   RENDER SLOTS
========================= */

function renderSlots(){

  wordSlots.innerHTML = "";

  for(let i = 0; i < 9; i++){

    const slot =
      document.createElement("div");

    slot.className =
      "slot";

    slot.innerText =
      currentWord[i] || "";

    wordSlots.appendChild(slot);

  }

}


/* =========================
   RESET LETTER BUTTONS
========================= */

function resetLetterButtons(){

  const buttons =
    document.querySelectorAll(
      ".letterBtn"
    );

  buttons.forEach(button => {

    button.disabled = false;

    button.style.opacity = 1;

  });

}


/* =========================
   SELECT LETTER
========================= */

function selectLetter(index){

  if(gameOver)
    return;

  const buttons =
    document.querySelectorAll(
      ".letterBtn"
    );

  const button =
    buttons[index];

  if(!button)
    return;

  if(button.disabled)
    return;

  if(currentWord.length >= 9)
    return;

  currentWord +=
    currentLetters[index];

  button.disabled = true;

  button.style.opacity = 0.3;

  playKeySound();

  vibrate();

  renderSlots();

}


/* =========================
   DELETE
========================= */

function deleteLetter(){

  if(gameOver)
    return;

  if(currentWord.length === 0)
    return;

  const last =
    currentWord[
      currentWord.length - 1
    ];

  currentWord =
    currentWord.slice(0, -1);

  const buttons =
    document.querySelectorAll(
      ".letterBtn"
    );

  for(
    let i = buttons.length - 1;
    i >= 0;
    i--
  ){

    if(
      currentLetters[i] === last &&
      buttons[i].disabled
    ){

      buttons[i].disabled = false;

      buttons[i].style.opacity = 1;

      break;

    }

  }

  renderSlots();

}


/* =========================
   CLEAR
========================= */

function clearWord(){

  if(gameOver)
    return;

  currentWord = "";

  resetLetterButtons();

  renderSlots();

}


/* =========================
   SHUFFLE
========================= */

function shuffleLetters(){

  if(gameOver)
    return;

  shuffleArray(currentLetters);

  renderLetters();

}


/* =========================
   SOUND
========================= */

function playSound(sound){

  const audioSetting =
    localStorage.getItem("audio");

  if(
    audioSetting === "off" ||
    audioSetting === "false"
  ){
    return;
  }

  sound.currentTime = 0;
  sound.volume = 1.0;

  sound.play()
    .catch(() => {});

}


function playKeySound(){

  playSound(keySound);

}


function playActionSound(){

  playSound(key2Sound);

}


function playSubmitSound(){

  playSound(key3Sound);

}


function playRestartSound(){

  playSound(key4Sound);

}

/* =========================
   VIBRATION
========================= */

function vibrate(){

  const vibration =
    localStorage.getItem("vibration");

  if(
    vibration === "off" ||
    vibration === "false"
  ){

    return;

  }

  if(navigator.vibrate){

    navigator.vibrate(20);

  }

}


/* =========================
   CAN BUILD WORD
========================= */

function canBuildWord(word){

  const available =
    [...currentLetters];

  for(
    const letter of word
  ){

    const index =
      available.indexOf(letter);

    if(index === -1)
      return false;

    available.splice(index, 1);

  }

  return true;

}


/* =========================
   VALID WORD
========================= */

function isValidWord(word){

  return dictionary.includes(word);

}


/* =========================
   FIND BEST WORD
========================= */

function findBestWord(){

  let best = "";

  dictionary.forEach(word => {

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


/* =========================
   LONGEST WORDS
========================= */

function getLongestWords(bestWord){

  if(!bestWord)
    return [];

  return [
    ...new Set(
      dictionary.filter(word =>
        word.length === bestWord.length &&
        word.length <= 9 &&
        canBuildWord(word)
      )
    )
  ].slice(0, 5);

}


/* =========================
   TIME BONUS
========================= */

function getTimeBonus(){

  let bonus =
    Math.floor(time / 10) - 4;

  if(bonus < 0)
    bonus = 0;

  return bonus;

}


/* =========================
   TIMER DISPLAY
========================= */

function showTimer(){

  if(bonusRound){

    message.innerHTML =
      "TIME " +
      '<span id="gameTimer">' +
      time +
      "</span><br>" +
      "GUESS THE 9-LETTER WORD";

  }else{

    message.innerHTML =
      "TIME " +
      '<span id="gameTimer">' +
      time +
      "</span><br>" +
      "ROUND " +
      currentRound +
      " OF " +
      totalRounds;

  }

  const timerText =
    document.getElementById(
      "gameTimer"
    );

  if(timerText){

    if(time <= 10){

      timerText.style.color =
        "#b23b3b";

      timerText.style.fontWeight =
        "900";

      timerText.style.animation =
        "timerBlink .6s infinite";

    }else{

      timerText.style.color = "";

      timerText.style.fontWeight = "";

      timerText.style.animation = "";

    }

  }

}


/* =========================
   TIMER CSS
========================= */

const timerStyle =
  document.createElement("style");

timerStyle.innerHTML = `
@keyframes timerBlink {
  0%,100% { opacity:1; }
  50% { opacity:.35; }
}
`;

document.head.appendChild(timerStyle);


/* =========================
   SCORE CALCULATION
========================= */

function calculateScore(word){

  const bestWord =
    findBestWord();

  const letterPoints =
    word.length * 10;

  const timeBonus =
    getTimeBonus();

  let longestBonus = 0;

  let nineLetterBonus = 0;

  if(
    bestWord &&
    word.length === bestWord.length
  ){

    longestBonus = 100;

  }

  if(word.length === 9){

    nineLetterBonus = 100;

  }

  return {

    points:
      letterPoints +
      timeBonus +
      longestBonus +
      nineLetterBonus,

    letterPoints,

    timeBonus,

    longestBonus,

    nineLetterBonus,

    bestWord

  };

}


/* =========================
   SHOW VALID WORD RESULT
========================= */

function showValidWordResult(
  word,
  result
){

  const longestWords =
    getLongestWords(
      result.bestWord
    );

  message.innerHTML =
    "<span style='font-size:26px'>" +
    word +
    "</span>" +
    "  +" +
    result.letterPoints;

  if(result.timeBonus > 0){

    message.innerHTML +=
      "  BONUS +" +
      result.timeBonus;

  }

  if(result.longestBonus > 0){

    message.innerHTML +=
      "<br>LONGEST BONUS +100";

  }

  if(result.nineLetterBonus > 0){

    message.innerHTML +=
      "<br>9 LETTERS +100";

  }

  message.innerHTML +=
    "<br><strong> " +
    result.points +
    " POINTS</strong>";

  if(longestWords.length){

    message.innerHTML +=
      "<br><br>" +
      "<span style='font-size:13px'>" +
      "LONGEST (" +
      result.bestWord.length +
      ") " +
      longestWords.join(" � ") +
      "</span>";

  }

}


/* =========================
   FINISH NORMAL ROUND
========================= */

function finishNormalRound(){

  clearInterval(timer);

  gameOver = true;

  roundScores[
    currentRound - 1
  ] = score;

  roundBtn.innerText =
    "NEXT ROUND";

}


/* =========================
   VALID NORMAL SUBMIT
========================= */

function submitNormalWord(word){

  if(word.length < 3){

    message.innerHTML =
      "MIN 3 LETTERS";

    return false;

  }

  if(!canBuildWord(word)){

    message.innerHTML =
      "INVALID WORD";

    return false;

  }

  if(!isValidWord(word)){

    message.innerHTML =
      "INVALID WORD";

    return false;

  }

  const result =
    calculateScore(word);

  score +=
    result.points;

  scoreText.innerText =
    score;

  showValidWordResult(
    word,
    result
  );

  currentWord = "";

  renderSlots();

  resetLetterButtons();

  /*
    A VALID SUBMIT ENDS THE ROUND.
  */

  finishNormalRound();

  return true;

}


/* =========================
   BONUS SUBMIT
========================= */

function submitBonusWord(word){

  if(word !== bonusTarget){

    message.innerHTML =
      "INCORRECT";

    return false;

  }

  const timeBonus =
    getTimeBonus();

  const points =
    150 +
    timeBonus;

  score += points;

  roundScores[3] =
    points;

  scoreText.innerText =
    score;

  /*
    ONLY WORD + POINTS.
    No "BONUS ROUND OVER".
  */

  message.innerHTML =
    "<span style='font-size:26px'>" +
    bonusTarget +
    "</span>" +
    " <br>" +
    "+150 POINTS";

  if(timeBonus > 0){

    message.innerHTML +=
      "<br>TIME BONUS +" +
      timeBonus;

  }

  message.innerHTML +=
    "<br><strong> " +
    points +
    " POINTS</strong>";

  finishBonusRound();

  return true;

}


/* =========================
   SUBMIT
========================= */

function submitWord(){

  if(gameOver)
    return;

  const word =
    currentWord.toUpperCase();

  /*
    BONUS ROUND
  */

  if(bonusRound){

    if(
      submitBonusWord(word)
    ){

      return;

    }

    /*
      Invalid bonus guess:
      timer continues.
    */

    startTimer();

    return;

  }

  /*
    NORMAL ROUND
  */

  submitNormalWord(word);

}


/* =========================
   TIME UP � NORMAL
========================= */

function timeUpNormalRound(){

  clearInterval(timer);

  /*
    If a valid word was already entered
    when the timer reaches zero, submit it.
  */

  const word =
    currentWord.toUpperCase();

  if(
    word.length >= 3 &&
    canBuildWord(word) &&
    isValidWord(word)
  ){

    const result =
      calculateScore(word);

    score +=
      result.points;

    scoreText.innerText =
      score;

    showValidWordResult(
      word,
      result
    );

    currentWord = "";

    renderSlots();

    resetLetterButtons();

    finishNormalRound();

    return;

  }

  /*
    TIME UP is only shown when
    there was no valid word.
  */

  gameOver = true;

  const bestWord =
    findBestWord();

  const longestWords =
    getLongestWords(
      bestWord
    );

  message.innerHTML =
    "<strong>TIME UP</strong>";

  if(longestWords.length){

    message.innerHTML +=
      "<br><br>" +
      "<span style='font-size:13px'>" +
      "LONGEST (" +
      bestWord.length +
      ") " +
      longestWords.join(" � ") +
      "</span>";

  }

  message.innerHTML +=
    "<br><br>ROUND " +
    currentRound +
    " COMPLETE";

  roundBtn.innerText =
    "NEXT ROUND";

}


/* =========================
   TIME UP � BONUS
========================= */

function timeUpBonusRound(){

  clearInterval(timer);

  gameOver = true;

  /*
    If there was no successful guess,
    show the target and zero points.
  */

  message.innerHTML =
    "<span style='font-size:26px'>" +
    bonusTarget +
    "</span>" +
    "<br>0 POINTS";

  roundBtn.innerText =
    "NEW GAME";

  saveHighScore(score);

  loadHighScore();

}


/* =========================
   TIMER
========================= */

function startTimer(){

  clearInterval(timer);

  showTimer();

  timer =
    setInterval(
      () => {

        if(time > 0){

          time--;

          showTimer();

        }

        if(time <= 0){

          clearInterval(timer);

          if(bonusRound){

            timeUpBonusRound();

          }else{

            timeUpNormalRound();

          }

        }

      },
      1000
    );

}


/* =========================
   START BONUS ROUND
========================= */

function startBonusRound(){

  clearInterval(timer);

  bonusRound = true;

  gameOver = false;

  currentWord = "";

  time = 90;

  roundBtn.innerText =
    "NEW GAME";

  generateBonusRound();

  showTimer();

  startTimer();

}


/* =========================
   FINISH BONUS
========================= */

function finishBonusRound(){

  clearInterval(timer);

  gameOver = true;

  roundBtn.innerText =
    "NEW GAME";

  saveHighScore(score);

  loadHighScore();

}


/* =========================
   NEXT ROUND / NEW GAME
========================= */

function nextRound(){

  if(!gameOver)
    return;

  /*
    After BONUS:
    NEW GAME
  */

  if(bonusRound){

    restartGame();

    return;

  }

  /*
    ROUND 1  2
    ROUND 2  3
  */

  if(
    currentRound < totalRounds
  ){

    currentRound++;

    currentWord = "";

    time = 90;

    gameOver = false;

    generateLetters();

    roundBtn.innerText =
      "NEXT ROUND";

    startTimer();

    return;

  }

  /*
    ROUND 3  BONUS
  */

  startBonusRound();

}


/* =========================
   NEW GAME
========================= */

function restartGame(){

  clearInterval(timer);

  currentLetters = [];

  currentWord = "";

  score = 0;

  time = 90;

  gameOver = false;

  currentRound = 1;

  bonusRound = false;

  bonusTarget = "";

  roundScores =
    [0,0,0,0];

  scoreText.innerText =
    "0";

  roundBtn.innerText =
    "NEXT ROUND";

  generateLetters();

  startTimer();

}


/* =========================
   BUTTONS
========================= */

if(deleteBtn){

  deleteBtn.onclick = () => {

    playActionSound();
    vibrate();

    deleteLetter();

  };

}

if(shuffleBtn){

  shuffleBtn.onclick = () => {

    playActionSound();
    vibrate();

    shuffleLetters();

  };

}

if(clearBtn){

  clearBtn.onclick = () => {

    playActionSound();
    vibrate();

    clearWord();

  };

}

if(submitBtn){

  submitBtn.onclick = () => {

    playSubmitSound();
    vibrate();

    submitWord();

  };

}

if(roundBtn){

  roundBtn.onclick = () => {

    playRestartSound();
    vibrate();

    nextRound();

  };

}
/* =========================
   START GAME
========================= */

loadHighScore();

generateLetters();

startTimer();