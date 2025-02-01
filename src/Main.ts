let lightDarkModeIcon = document.querySelector(
  ".dark-light-icon"
) as HTMLImageElement;

let headingName = document.querySelector("h1") as HTMLHeadElement;
let footerGame = document.querySelector(".footer") as HTMLDivElement;
const inputFields = document.querySelector(".inputs") as HTMLDivElement;
const startButton = document.querySelector(".start-btn") as HTMLButtonElement;
const startPopup = document.querySelector(".start-popup") as HTMLDivElement;
const difficultyLvl = document.querySelector(
  ".difficulty-select"
) as HTMLSelectElement;
const topicSpan = document.querySelector(".topic-span") as HTMLSpanElement;
const difficuiltyShowSpan = document.querySelector(".difficulty-show-span");

const checkingBtn = document.querySelector(".check") as HTMLButtonElement;
let finishMessage = document.querySelector(".finish") as HTMLDivElement;

let hintBtn = document.querySelector(".hint") as HTMLButtonElement;
let hintSpan = document.querySelector(".hint span") as HTMLSpanElement;

let succesSound = document.querySelector(".success-sound") as HTMLAudioElement;
let failSound = document.querySelector(".fail-sound") as HTMLAudioElement;

let trialNumberInput = document.querySelector(
  ".trials-number"
) as HTMLInputElement;
// Global Variables
let trialNumber: number;
let lettersNumber: number = 6;
let currentTrial: number = 1;
let difficultyLvlName: string;
let urlToFetch: string = "words.json";
let wordToGuess: string;
let hintsNumbers: number;

// Game Functions

// Fetching The JSON of words
let fetchWord = async function (
  url: string,
  difficuilty: string
): Promise<string[]> {
  let response = await fetch(url);
  let data = await response.json();
  let dataFromSelectedDifficuilty = data[difficuilty];
  let randomIndex: number = Math.floor(
    Math.random() * Object.keys(dataFromSelectedDifficuilty).length
  );
  const randomTopicValues: string[] = Object.values(
    dataFromSelectedDifficuilty
  )[randomIndex] as string[];
  const randomTopicKeys = Object.keys(dataFromSelectedDifficuilty)[randomIndex];

  if (topicSpan) {
    topicSpan.innerHTML = randomTopicKeys;
  }
  return randomTopicValues;
};

// Generate The Input Fields
let generateTheInputs = function () {
  for (let i = 1; i <= trialNumber; i++) {
    const divOfTrial = document.createElement("div") as HTMLDivElement;
    divOfTrial.classList.add(`Trial-${i}`);
    divOfTrial.innerHTML = `<span>Trial ${i}</span>`;

    if (i !== 1) divOfTrial.classList.add("disabled-inputs");

    for (let j = 1; j <= lettersNumber; j++) {
      let input = document.createElement("input") as HTMLInputElement;
      input.type = "text";
      input.id = `guess-${i}-letter-${j}`;

      input.setAttribute("maxlength", "1");
      divOfTrial.appendChild(input);
    }

    inputFields?.appendChild(divOfTrial);
  }
  (inputFields?.children[0].children[1] as HTMLInputElement).focus();
  const disabledInputs = Array.from(
    document.querySelectorAll(".disabled-inputs input")
  ) as HTMLInputElement[];

  disabledInputs.forEach((input) => {
    input.disabled = true;
  });

  const inputsCollection = document.querySelectorAll(
    "input"
  ) as unknown as HTMLInputElement[];
  inputsCollection.forEach((input, index) => {
    input.addEventListener("input", function () {
      this.value = this.value.toLowerCase();
      const nextInput = inputsCollection[index + 1];
      if (nextInput) nextInput.focus();
    });
    input.addEventListener("keydown", function (e) {
      const currentIndex = Array.from(inputsCollection).indexOf(
        e.target as HTMLInputElement
      );
      if (e.key === "ArrowRight") {
        const nextInput = currentIndex + 1;
        if (nextInput < inputsCollection.length)
          inputsCollection[nextInput].focus();
      }
      if (e.key === "ArrowLeft") {
        const previousInput = currentIndex - 1;
        if (previousInput < inputsCollection.length && previousInput >= 0)
          inputsCollection[previousInput].focus();
      }
    });
  });
};
const wonGame = function () {
  if (finishMessage) {
    finishMessage.innerHTML = `You Win After ${currentTrial} Trials with using ${
      2 - hintsNumbers
    } Hints`;
    if (hintsNumbers == 2) {
      finishMessage.innerHTML = `You Win After ${currentTrial} Trials without using any Hints`;
    }
  }
  finishMessage.classList.remove("bad");
  finishMessage.classList.add("good");
  finishMessage.style.display = "block";
  startPopup.style.display = "block";

  // Add Disabled Class
  let allTrials = document.querySelectorAll(".inputs > div");
  allTrials.forEach((trialDiv) => {
    trialDiv.classList.add("disabled-inputs");
  });

  // Disable Guess Button
  checkingBtn.disabled = true;
  hintBtn.disabled = true;

  succesSound.play();
};
const loseGame = function () {
  if (finishMessage) {
    finishMessage.innerHTML = `Unfortunately, You Have Lose. The Correct Word is ${wordToGuess}`;
  }
  finishMessage.style.display = "block";
  finishMessage.classList.remove("good");
  finishMessage.classList.add("bad");

  startPopup.style.display = "block";

  // Add Disabled Class
  let allTrials = document.querySelectorAll(".inputs > div");
  allTrials.forEach((trialDiv) => {
    trialDiv.classList.add("disabled-inputs");
  });
  checkingBtn.disabled = true;
  hintBtn.disabled = true;
  failSound.play();
};
const getAnotherTrial = function () {
  document
    .querySelector(`.Trial-${currentTrial}`)
    ?.classList.add("disabled-inputs");

  const currentTrialInputs = document.querySelectorAll(
    `.Trial-${currentTrial} input`
  ) as unknown as HTMLInputElement[];
  currentTrialInputs.forEach(
    (input) => ((input as HTMLInputElement).disabled = true)
  );

  ///////////////////////////////////////////
  // The Next Trial inputs

  currentTrial++;

  const nextTrialInputs = document.querySelectorAll(
    `.Trial-${currentTrial} input`
  ) as unknown as HTMLInputElement[];
  nextTrialInputs.forEach(
    (input) => ((input as HTMLInputElement).disabled = false)
  );

  let element = document.querySelector(
    `.Trial-${currentTrial}`
  ) as HTMLDivElement;
  if (element) {
    document
      .querySelector(`.Trial-${currentTrial}`)
      ?.classList.remove("disabled-inputs");
    (element.children[1] as HTMLInputElement).focus();
  } else {
    loseGame();
  }
};

// Check The Guessing process
const guessesHandling = function () {
  let succesGuess = true;
  for (let i = 1; i <= lettersNumber; i++) {
    const inputPlace = document.querySelector(
      `#guess-${currentTrial}-letter-${i}`
    ) as HTMLInputElement;
    const letter = inputPlace?.value.toLowerCase();
    const actualLetter = wordToGuess[i - 1];

    // Logic Of The Game
    if (letter === actualLetter) {
      inputPlace.classList.add("yes-totally-correct");
    } else if (wordToGuess.includes(letter) && letter !== "") {
      inputPlace.classList.add("no-wrong-placed");
      succesGuess = false;
    } else {
      inputPlace.classList.add("no-totally-incorrect");
      succesGuess = false;
    }
  }

  // Check Player Correctness
  if (succesGuess) {
    wonGame();
  } else {
    getAnotherTrial();
  }
};
const getAHint = function () {
  if (hintsNumbers > 0) {
    hintsNumbers--;
    hintSpan.innerHTML = hintsNumbers.toString();
  }
  if (hintsNumbers === 0) {
    hintBtn.disabled = true;
    hintBtn.classList.add("disable");
  }

  const enabledInputs = document.querySelectorAll("input:not([disabled])");

  const emptyEnabledInputs = Array.from(enabledInputs).filter(
    (input) => (input as HTMLInputElement).value === ""
  );
  if (emptyEnabledInputs.length > 0) {
    const randomIndex = Math.trunc(Math.random() * emptyEnabledInputs.length);
    const randomInput = emptyEnabledInputs[randomIndex];
    const toFillIndex = Array.from(enabledInputs).indexOf(randomInput);

    if (toFillIndex !== -1) {
      (randomInput as HTMLInputElement).value =
        wordToGuess[toFillIndex].toLowerCase();
    }
  }
};

// While Clicking Buttons
startButton.onclick = function (): void {
  if (
    typeof trialNumberInput.valueAsNumber === "number" &&
    trialNumberInput.valueAsNumber <= 10 &&
    trialNumberInput.valueAsNumber >= 1
  ) {
    trialNumber = trialNumberInput.valueAsNumber;
  } else {
    alert("Enter a Valid Number Between 1 and 10");
    return;
  }
  hintsNumbers = 2;
  if (hintSpan) {
    hintSpan.innerHTML = hintsNumbers.toString();
  }
  inputFields.innerHTML = "";
  checkingBtn.disabled = false;
  hintBtn.disabled = false;
  difficultyLvlName = difficultyLvl.value.toLowerCase();
  if (difficuiltyShowSpan) {
    difficuiltyShowSpan.innerHTML = difficultyLvl.value;
  }
  lettersNumber = 6;
  currentTrial = 1;
  startPopup.style.display = "none";
  fetchWord(urlToFetch, difficultyLvlName).then((selectedArr) => {
    wordToGuess =
      selectedArr[Math.floor(Math.random() * selectedArr.length)].toLowerCase();
    generateTheInputs();
  });
};
const backSpaceHandling = function (event: { key: string }) {
  if (event.key === "Backspace") {
    const inputs = document.querySelectorAll(
      "input:not([disabled])"
    ) as NodeListOf<HTMLInputElement>;
    let currentIndex: number = -1;
    if (inputs) {
      currentIndex = Array.from(inputs).indexOf(
        document.activeElement as HTMLInputElement
      );
    }
    if (currentIndex > 0) {
      const currentInputField = inputs[currentIndex];
      const previousInputField = inputs[currentIndex - 1];

      currentInputField.value = "";
      previousInputField.value = "";
      previousInputField.focus();
    }
  }
};
hintBtn.onclick = getAHint;
checkingBtn.onclick = guessesHandling;
document.addEventListener("keydown", backSpaceHandling);
/////////////////////////////////////////////////////////////////////////////////

// Initialize lightMode from localStorage
let lightMode = localStorage.getItem("lightMode") === "true";

// Function to toggle light and dark mode
const setLightDark = function () {
  if (lightMode) {
    lightDarkModeIcon.src = "dark-light/sun.png";
    document.body.classList.add("light-theme");
  } else {
    lightDarkModeIcon.src = "dark-light/moon.png";
    document.body.classList.remove("light-theme");
  }
};

// Event listener for light/dark mode toggle
lightDarkModeIcon.addEventListener("click", () => {
  lightMode = !lightMode;
  localStorage.setItem("lightMode", lightMode.toString());
  setLightDark();
});

// Initial call to set the correct mode on page load
setLightDark();
