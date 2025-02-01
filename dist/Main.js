"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let lightDarkModeIcon = document.querySelector(".dark-light-icon");
let headingName = document.querySelector("h1");
let footerGame = document.querySelector(".footer");
const inputFields = document.querySelector(".inputs");
const startButton = document.querySelector(".start-btn");
const startPopup = document.querySelector(".start-popup");
const difficultyLvl = document.querySelector(".difficulty-select");
const topicSpan = document.querySelector(".topic-span");
const difficuiltyShowSpan = document.querySelector(".difficulty-show-span");
const checkingBtn = document.querySelector(".check");
let finishMessage = document.querySelector(".finish");
let hintBtn = document.querySelector(".hint");
let hintSpan = document.querySelector(".hint span");
let succesSound = document.querySelector(".success-sound");
let failSound = document.querySelector(".fail-sound");
let trialNumberInput = document.querySelector(".trials-number");
// Global Variables
let trialNumber;
let lettersNumber = 6;
let currentTrial = 1;
let difficultyLvlName;
let urlToFetch = "words.json";
let wordToGuess;
let hintsNumbers;
// Game Functions
// Fetching The JSON of words
let fetchWord = function (url, difficuilty) {
    return __awaiter(this, void 0, void 0, function* () {
        let response = yield fetch(url);
        let data = yield response.json();
        let dataFromSelectedDifficuilty = data[difficuilty];
        let randomIndex = Math.floor(Math.random() * Object.keys(dataFromSelectedDifficuilty).length);
        const randomTopicValues = Object.values(dataFromSelectedDifficuilty)[randomIndex];
        const randomTopicKeys = Object.keys(dataFromSelectedDifficuilty)[randomIndex];
        if (topicSpan) {
            topicSpan.innerHTML = randomTopicKeys;
        }
        return randomTopicValues;
    });
};
// Generate The Input Fields
let generateTheInputs = function () {
    for (let i = 1; i <= trialNumber; i++) {
        const divOfTrial = document.createElement("div");
        divOfTrial.classList.add(`Trial-${i}`);
        divOfTrial.innerHTML = `<span>Trial ${i}</span>`;
        if (i !== 1)
            divOfTrial.classList.add("disabled-inputs");
        for (let j = 1; j <= lettersNumber; j++) {
            let input = document.createElement("input");
            input.type = "text";
            input.id = `guess-${i}-letter-${j}`;
            input.setAttribute("maxlength", "1");
            divOfTrial.appendChild(input);
        }
        inputFields === null || inputFields === void 0 ? void 0 : inputFields.appendChild(divOfTrial);
    }
    (inputFields === null || inputFields === void 0 ? void 0 : inputFields.children[0].children[1]).focus();
    const disabledInputs = Array.from(document.querySelectorAll(".disabled-inputs input"));
    disabledInputs.forEach((input) => {
        input.disabled = true;
    });
    const inputsCollection = document.querySelectorAll("input");
    inputsCollection.forEach((input, index) => {
        input.addEventListener("input", function () {
            this.value = this.value.toLowerCase();
            const nextInput = inputsCollection[index + 1];
            if (nextInput)
                nextInput.focus();
        });
        input.addEventListener("keydown", function (e) {
            const currentIndex = Array.from(inputsCollection).indexOf(e.target);
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
        finishMessage.innerHTML = `You Win After ${currentTrial} Trials with using ${2 - hintsNumbers} Hints`;
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
    var _a, _b;
    (_a = document
        .querySelector(`.Trial-${currentTrial}`)) === null || _a === void 0 ? void 0 : _a.classList.add("disabled-inputs");
    const currentTrialInputs = document.querySelectorAll(`.Trial-${currentTrial} input`);
    currentTrialInputs.forEach((input) => (input.disabled = true));
    ///////////////////////////////////////////
    // The Next Trial inputs
    currentTrial++;
    const nextTrialInputs = document.querySelectorAll(`.Trial-${currentTrial} input`);
    nextTrialInputs.forEach((input) => (input.disabled = false));
    let element = document.querySelector(`.Trial-${currentTrial}`);
    if (element) {
        (_b = document
            .querySelector(`.Trial-${currentTrial}`)) === null || _b === void 0 ? void 0 : _b.classList.remove("disabled-inputs");
        element.children[1].focus();
    }
    else {
        loseGame();
    }
};
// Check The Guessing process
const guessesHandling = function () {
    let succesGuess = true;
    for (let i = 1; i <= lettersNumber; i++) {
        const inputPlace = document.querySelector(`#guess-${currentTrial}-letter-${i}`);
        const letter = inputPlace === null || inputPlace === void 0 ? void 0 : inputPlace.value.toLowerCase();
        const actualLetter = wordToGuess[i - 1];
        // Logic Of The Game
        if (letter === actualLetter) {
            inputPlace.classList.add("yes-totally-correct");
        }
        else if (wordToGuess.includes(letter) && letter !== "") {
            inputPlace.classList.add("no-wrong-placed");
            succesGuess = false;
        }
        else {
            inputPlace.classList.add("no-totally-incorrect");
            succesGuess = false;
        }
    }
    // Check Player Correctness
    if (succesGuess) {
        wonGame();
    }
    else {
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
    const emptyEnabledInputs = Array.from(enabledInputs).filter((input) => input.value === "");
    if (emptyEnabledInputs.length > 0) {
        const randomIndex = Math.trunc(Math.random() * emptyEnabledInputs.length);
        const randomInput = emptyEnabledInputs[randomIndex];
        const toFillIndex = Array.from(enabledInputs).indexOf(randomInput);
        if (toFillIndex !== -1) {
            randomInput.value =
                wordToGuess[toFillIndex].toLowerCase();
        }
    }
};
// While Clicking Buttons
startButton.onclick = function () {
    if (typeof trialNumberInput.valueAsNumber === "number" &&
        trialNumberInput.valueAsNumber <= 10 &&
        trialNumberInput.valueAsNumber >= 1) {
        trialNumber = trialNumberInput.valueAsNumber;
    }
    else {
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
const backSpaceHandling = function (event) {
    if (event.key === "Backspace") {
        const inputs = document.querySelectorAll("input:not([disabled])");
        let currentIndex = -1;
        if (inputs) {
            currentIndex = Array.from(inputs).indexOf(document.activeElement);
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
    }
    else {
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
