/* =========================
/ LETTERS /
/ ========================= */

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
/ ELEMENTS /
/ ========================= */

const lettersDiv =
  document.getElementById("letters");

const wordSlots =
  document.getElementById("wordSlots");

const scoreText =
  document.getElementById("score");

const timeText =
  document.getElementById("time") || {
    innerText: ""
  };
  
  
const message =
  document.getElementById("message");

const roundBtn =
  document.getElementById("roundBtn");

const highScoreText =
  document.getElementById("highScore");

/* =========================
/ STATE /
/ ========================= */

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
/ DICTIONARY /
/ ========================= */

let dictionary = [];

fetch("words.txt")
  .then(r => r.text())
  .then(text => {

    dictionary = text
      .split("\n")
      .map(w => w.trim().toUpperCase())
      .filter(w => w.length > 0);

  })
  .catch(() => {

    dictionary = [];

  });

/* =========================
/ SAVE HIGH SCORE /
/ ========================= */

function saveHighScore(points) {

  const oldHighScore =
    Number(
      localStorage.getItem("highScore") || 0
    );

  if(points <= oldHighScore){
    return;
  }

  localStorage.setItem(
    "highScore",
    points
  );
}

/* =========================
/ LOAD HIGH SCORE /
/ ========================= */

function loadHighScore(){

  if(!highScoreText)
    return;

  highScoreText.innerText =
    Number(
      localStorage.getItem("highScore") || 0
    );

}

/* =========================
/ GENERATE NORMAL LETTERS /
/ ========================= */

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
        Math.random() *
        vowels.length
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
/ GENERATE BONUS LETTERS /
/ ========================= */

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
/ SHUFFLE ARRAY /
/ ========================= */

function shuffleArray(arr){

  for(
    let i = arr.length - 1;
    i > 0;
    i--
  ){

    const j =
      Math.floor(
        Math.random() *
        (i + 1)
      );

    [arr[i], arr[j]] =
    [arr[j], arr[i]];

  }

}

/* =========================
/ CLEAR WORD /
/ ========================= */

function clearWord(){

  if(gameOver)
    return;

  currentWord = "";

  const btns =
    document.querySelectorAll(
      ".letterBtn"
    );

  btns.forEach(btn => {

    btn.disabled = false;

    btn.style.opacity = 1;

  });

  renderSlots();

}

/* =========================
/ RENDER LETTERS /
/ ========================= */

function renderLetters(){

  lettersDiv.innerHTML = "";

  currentLetters.forEach(
    (letter,index) => {

      const btn =
        document.createElement(
          "button"
        );

      btn.className =
        "letterBtn";

      btn.innerText =
        letter;

      btn.onclick =
        () => selectLetter(index);

      lettersDiv.appendChild(btn);

    }
  );

}

/* =========================
/ RENDER SLOTS /
/ ========================= */

function renderSlots(){

  wordSlots.innerHTML = "";

  for(let i = 0; i < 9; i++){

    const slot =
      document.createElement(
        "div"
      );

    slot.className =
      "slot";

    slot.innerText =
      currentWord[i] || "";

    wordSlots.appendChild(slot);

  }

}

/* =========================
/ VIBRATION /
/ ========================= */

function vibrate(){

  const vibration =
    localStorage.getItem(
      "vibration"
    );

  if(
    vibration === "off" ||
    vibration === "false"
  ){
    return;
  }

  if(
    navigator.vibrate
  ){

    navigator.vibrate(20);

  }

}

/* =========================
/ KEY SOUND /
/ ========================= */

function playKeySound(){

  const audioSetting =
    localStorage.getItem(
      "audio"
    );

  if(
    audioSetting === "off" ||
    audioSetting === "false"
  ){
    return;
  }

  const audio =
    new Audio("audio/key.mp3");

  audio.volume = 0.5;

  audio.play()
    .catch(() => {});

}

/* =========================
/ SELECT LETTER /
/ ========================= */

function selectLetter(index){

  if(gameOver)
    return;

  const btns =
    document.querySelectorAll(
      ".letterBtn"
    );

  const btn =
    btns[index];

  if(!btn || btn.disabled)
    return;

  if(currentWord.length >= 9)
    return;

  currentWord +=
    currentLetters[index];

  btn.disabled = true;

  btn.style.opacity = 0.3;

  playKeySound();

  vibrate();

  renderSlots();

}

/* =========================
/ DELETE LETTER /
/ ========================= */

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
    currentWord.slice(0,-1);

  const btns =
    document.querySelectorAll(
      ".letterBtn"
    );

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

/* =========================
/ SHUFFLE BUTTON /
/ ========================= */

function shuffleLetters(){

  if(gameOver)
    return;

  shuffleArray(currentLetters);

  renderLetters();

}

/* =========================
/ CAN BUILD WORD /
/ ========================= */

function canBuildWord(word){

  let temp =
    [...currentLetters];

  for(
    let letter of word
  ){

    const idx =
      temp.indexOf(letter);

    if(idx === -1)
      return false;

    temp.splice(idx,1);

  }

  return true;

}

/* =========================
/ VALID WORD /
/ ========================= */

function isValidWord(word){

  return dictionary.includes(word);

}

/* =========================
/ FIND BEST WORD /
/ ========================= */

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
/ GET LONGEST WORDS /
/ ========================= */

function getLongestWords(bestWord){

  if(!bestWord)
    return [];

  return [
    ...new Set(
      dictionary.filter(
        w =>
          w.length === bestWord.length &&
          w.length <= 9 &&
          canBuildWord(w)
      )
    )
  ].slice(0,5);

}

/* =========================
/ TIME BONUS /
/ ========================= */

function getTimeBonus(){

  let bonus =
    Math.floor(time / 10) - 4;

  if(bonus < 0)
    bonus = 0;

  return bonus;

}

/* =========================
/ NORMAL WORD SCORE /
/ ========================= */

function calculateWordScore(word){

  const bestWord =
    findBestWord();

  let letterPoints =
    word.length * 10;

  let timeBonus =
    getTimeBonus();

  let longWordBonus = 0;

  let allLettersBonus = 0;

  if(
    word.length === 9
  ){

    allLettersBonus = 100;

  }

  if(
    bestWord &&
    word.length === bestWord.length
  ){

    longWordBonus = 100;

  }

  return {
    points:
      letterPoints +
      timeBonus +
      longWordBonus +
      allLettersBonus,

    letterPoints,
    timeBonus,
    longWordBonus,
    allLettersBonus,
    bestWord
  };

}

/* =========================
/ NORMAL MESSAGE /
/ ========================= */

function showNormalResult(
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
      "  +" +
      result.timeBonus;

  }

  if(result.longWordBonus > 0){

    message.innerHTML +=
      "<br>LONGEST BONUS +100";

  }

  if(result.allLettersBonus > 0){

    message.innerHTML +=
      "<br>9 LETTERS +100";

  }

  message.innerHTML +=
    "<br><strong>+" +
    result.points +
    " POINTS</strong>";

  if(
    result.bestWord &&
    longestWords.length
  ){

    message.innerHTML +=
      "<br><span style='font-size:13px'>" +
      "LONGEST (" +
      result.bestWord.length +
      ") " +
      longestWords.join(" • ") +
      "</span>";

  }

}

/* =========================
/ SUBMIT NORMAL WORD /
/ ========================= */

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
    calculateWordScore(word);

  score +=
    result.points;

  roundScores[
    currentRound - 1
  ] +=
    result.points;

  scoreText.innerText =
    score;

  showNormalResult(
    word,
    result
  );

  currentWord = "";

  renderSlots();

gameOver = true;
roundBtn.innerText = "NEXT ROUND";
clearInterval(timer);


  const btns =
    document.querySelectorAll(
      ".letterBtn"
    );

  btns.forEach(btn => {

    btn.disabled = false;

    btn.style.opacity = 1;

  });

  return true;

}

/* =========================
/ SUBMIT BONUS /
/ ========================= */

function submitBonusWord(word){

  if(word.length < 9){

    message.innerHTML =
      "GUESS THE 9-LETTER WORD";

    return false;

  }

  if(word !== bonusTarget){

    message.innerHTML =
      "INCORRECT";

    return false;

  }

  const timeBonus =
    getTimeBonus();

  const bonusPoints =
    150 +
    timeBonus;

  score +=
    bonusPoints;

  roundScores[3] =
    bonusPoints;

  scoreText.innerText =
    score;

  message.innerHTML =
    "<span style='font-size:26px'>" +
    word +
    "</span>" +
    " <br>" +
    "+150 POINTS";

  if(timeBonus > 0){

    message.innerHTML +=
      "  +" +
      timeBonus;

  }

  message.innerHTML +=
    "<br><strong>+" +
    bonusPoints +
    " TOTAL</strong>";

  finishBonusRound();

  return true;

}

/* =========================
/ SUBMIT /
/ ========================= */

function submitWord(){

  if(gameOver)
    return;

  clearInterval(timer);

  const word =
    currentWord.toUpperCase();

  if(bonusRound){

    const success =
      submitBonusWord(word);

    if(!success){

      startTimer();

    }

    return;

  }

  const success =
    submitNormalWord(word);

  if(success){

    startTimer();

  }else{

    startTimer();

  }

}

/* =========================
/ AUTO SUBMIT AT TIME 0 /
/ ========================= */

function autoSubmitAtTime(){

  if(currentWord.length >= 3){

    const word =
      currentWord.toUpperCase();

    if(bonusRound){

      if(
        word === bonusTarget
      ){

        submitBonusWord(word);

        return;

      }

    }else{

      submitNormalWord(word);

    }

  }

  currentWord = "";

  renderSlots();

}

/* =========================
/ END NORMAL ROUND /
/ ========================= */

function endNormalRound(){

  clearInterval(timer);

  autoSubmitAtTime();

  gameOver = true;

  message.innerHTML +=
    "<br><br><strong>ROUND " +
    currentRound +
    " COMPLETE</strong>" +
    "<br>ROUND SCORE: " +
    roundScores[
      currentRound - 1
    ];

  roundBtn.innerText =
    "NEXT ROUND";

}

/* =========================
/ START BONUS ROUND /
/ ========================= */

function startBonusRound(){

  bonusRound = true;

  gameOver = false;

  currentWord = "";

  time = 90;

  timeText.innerText =
    time;

  generateBonusRound();

  message.innerHTML =
    "GUESS THE 9-LETTER WORD";

  roundBtn.innerText =
    "NEW GAME";

  startTimer();

}

/* =========================
/ FINISH BONUS ROUND /
/ ========================= */

function finishBonusRound(){

  clearInterval(timer);

  gameOver = true;

  saveHighScore(score);

  loadHighScore();

  roundBtn.innerText =
    "NEW GAME";

}

/* =========================
/ START NEXT ROUND /
/ ========================= */

function nextRound(){

  if(
    !gameOver
  ){

    return;

  }

  if(
    bonusRound
  ){

    restartGame();

    return;

  }

  if(
    currentRound < totalRounds
  ){

    currentRound++;

    gameOver = false;

    currentWord = "";

    time = 90;

    timeText.innerText =
      time;

    generateLetters();

    message.innerHTML =
      "TIME 90<br>" +
      "ROUND " +
      currentRound +
      " OF " +
      totalRounds;

    roundBtn.innerText =
      "NEXT ROUND";

    startTimer();

    return;

  }

  startBonusRound();

}

/* =========================
/ TIMER DISPLAY /
/ ========================= */

function updateTimerDisplay(){

  timeText.innerText =
    time;

  if(time <= 10){

    timeText.style.color =
      "#b23b3b";

    timeText.style.fontWeight =
      "900";

    timeText.style.animation =
      "timerBlink .6s infinite";

  }else{

    timeText.style.color = "";

    timeText.style.fontWeight = "";

    timeText.style.animation = "";

  }

}

/* =========================
/ TIMER /
/ ========================= */

function startTimer(){

  clearInterval(timer);

  timer =
    setInterval(
      () => {

        if(time > 0){

          time--;

          updateTimerDisplay();

        }

        if(time <= 0){

          clearInterval(timer);

          endNormalRound();

        }

      },
      1000
    );

}

/* =========================
/ RESTART / NEW GAME /
/ ========================= */

function restartGame(){

  clearInterval(timer);

  currentWord = "";

  score = 0;

  time = 90;

  currentRound = 1;

  bonusRound = false;

  bonusTarget = "";

  gameOver = false;

  roundScores =
    [0,0,0,0];

  scoreText.innerText =
    0;

  timeText.innerText =
    90;

  updateTimerDisplay();

  roundBtn.innerText =
    "NEXT ROUND";

  message.innerHTML =
    "TIME 90<br>" +
    "ROUND 1 OF 3";

  generateLetters();

  startTimer();

}

/* =========================
/ BUTTON CONNECTIONS /
/ ========================= */

const deleteBtn =
  document.getElementById(
    "deleteBtn"
  );

const shuffleBtn =
  document.getElementById(
    "shuffleBtn"
  );

const clearBtn =
  document.getElementById(
    "clearBtn"
  );

const submitBtn =
  document.getElementById(
    "submitBtn"
  );

if(deleteBtn){

  deleteBtn.onclick =
    deleteLetter;

}

if(shuffleBtn){

  shuffleBtn.onclick =
    shuffleLetters;

}

if(clearBtn){

  clearBtn.onclick =
    clearWord;

}

if(submitBtn){

  submitBtn.onclick =
    submitWord;

}

if(roundBtn){

  roundBtn.onclick =
    nextRound;

}

/* =========================
/ TIMER BLINK CSS /
/ ========================= */

const timerStyle =
  document.createElement(
    "style"
  );

timerStyle.innerHTML = `
@keyframes timerBlink {
  0%,100% { opacity:1; }
  50% { opacity:.35; }
}
`;

document.head.appendChild(
  timerStyle
);

/* =========================
/ START /
/ ========================= */

loadHighScore();

generateLetters();

updateTimerDisplay();

message.innerHTML =
  "TIME 90<br>" +
  "ROUND 1 OF 3";

startTimer();