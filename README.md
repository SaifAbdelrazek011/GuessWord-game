# WordGuess Game 🌟  
**By [Saif Abdelrazek](https://github.com/SaifAbdelrazek011)**  

The game is a simple word-guessing game. Choose a difficulty level and number of trials, then start. You have two hints for every game. I have checked that you could continue playing the game without reloading the page. The game is responsive to make you able to test with different devices. The differences between the difficulties are some categories and the word hardness level. All the words are 6 letters to make it not easy or hard to find it out. And finally, don't forget to have fun.

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/SaifAbdelrazek011/speed-typing-game/blob/main/LICENSE)
![TypeScript](https://img.shields.io/badge/TypeScript-4.9%2B-3178C6.svg)

---

## 🚀 Features  
- **Theme Toggle** 🌙/☀️ - Switch between dark/light modes  
- **Custom Trials** 📏 - Adjust the number of allowed guesses  
- **Audio Feedback** 🔊 - Play success (`success.mp3`) or failure (`fail.mp3`) sounds  
- **Responsive Design** 📱 - Works seamlessly on all screen sizes  
- **Word Bank** 📝 - Customizable via `words.json`  
- **TypeScript Core** ⚙️ - Robust logic in `src/Main.ts`  

---

## 💁‍ Folder Structure  
```
.
├── audio/                   # Audio files for game feedback
│   ├── fail.mp3
│   └── success.mp3
├── dark-light/              # Theme toggle icons
│   ├── moon.png
│   └── sun.png
├── dist/                    # Compiled JavaScript (auto-generated)
│   └── Main.js
├── src/                     # TypeScript source code
│   └── Main.ts              # Core game logic
├── index.html               # Main HTML entry point
├── style.css                # CSS styling
├── tsconfig.json            # TypeScript configuration
└── words.json               # Word database (edit to add/remove words)
```

---

## 🚀 Quick Start  

### Prerequisites  
- Node.js (v14+)  
- npm (comes with Node.js)  
- TypeScript (installed globally)  

### Setup Steps  
1. **Clone the Repository**  
   ```bash
   git clone https://github.com/SaifAbdelrazek011/WordGuess-Game.git
   cd WordGuess-Game
   ```

2. **Install TypeScript Globally**  
   ```bash
   npm install -g typescript
   ```

3. **Compile TypeScript to JavaScript**  
   ```bash
   tsc --project tsconfig.json
   ```
   - This generates the `dist/Main.js` file.  

4. **Run the Game**  
   Use a static server (e.g., `live-server`) to avoid CORS issues:  
   ```bash
   npx live-server
   ```
   - The game will open automatically in your browser at `https://saifabdelrazek011.github.io/GuessWord-game/`.  

5. **Start Playing!**  
   - Toggle themes with the 🌙/☀️ icon.  
   - Adjust trials via the settings menu.  
   - Guess letters to reveal the hidden word!  

---

## ⚙️ Customization  
- **Add/Remove Words**: Edit `words.json`.  
- **Modify Game Logic**: Edit `src/Main.ts` and recompile with `tsc`.  
- **Update Icons**: Replace `moon.png` or `sun.png` in the `dark-light` folder.  
- **Change Styles**: Edit `style.css` for UI adjustments.  

---

## 📝 License  
**MIT License**  
Copyright © 2025 [Saif Abdelrazek](https://github.com/SaifAbdelrazek011)  



**Happy Coding!** 🎮✨
