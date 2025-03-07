const bowls = [
  {
    name: "El Jefe",
    ingredients: ["Brown Rice", "Kale", "Black Beans", "Corn", "Red Onions", "Avocado", "Pita Chips", "Feta"]
  },
  {
    name: "Pesto Caesar",
    ingredients: ["Kale", "Bulgur", "Tomatoes", "Pita", "LPO", "Parm"]
  },
  {
    name: "Southern",
    ingredients: ["Roots Rice", "Kale", "Chickpeas", "Cucumbers", "Grape Tomatoes", "Red Onions", "Pita Chips", "Feta"]
  },
  {
    name: "Corner Cobb",
    ingredients: ["Arcadian", "Kale", "Roots Rice", "Sweet Potato", "Corn", "Red Onions", "Cucumbers", "Avocado", "Hard Boiled Egg"]
  },
  {
    name: "Balboa",
    ingredients: ["Brown Rice", "Sweet Potato", "Corn", "Avocado", "Pita Chips", "Feta", "Lime-Pickled Onions"]
  },
  {
    name: "Roots Bowl",
    ingredients: ["Roots Rice", "Spinach", "Sweet Potato", "Pita Chips", "Red Onions", "Goat Cheese", "Dried Cranberries"]
  },
  {
    name: "Tamari",
    ingredients: ["Brown Rice", "Kale", "Broccoli", "Red Onions", "Carrots", "Jalapenos", "Cabbage", "Almonds"]
  },
  {
    name: "Mad Bowl",
    ingredients: ["Cannellini Beans", "Broccoli", "Red Onions", "Grape Tomatoes", "Cucumbers", "Parmesan"]
  },
  {
    name: "Mayweather",
    ingredients: ["Kale", "Bulgur", "Grape Tomatoes", "Pita Chips", "Lime-Pickled Onions", "Parmesan"]
  },
  {
    name: "Apollo",
    ingredients: ["Brown Rice", "Spinach", "Chickpeas", "Cucumbers", "Grape Tomatoes", "Red Onions", "Pita Chips", "Feta"]
  }
];


let selectedBowl;
let playerName = "";
let lives = 3;
let timeRemaining = 60;
let timerInterval;
let playerData = JSON.parse(localStorage.getItem("playerData")) || {};

const playerNameInput = document.getElementById("playerName");
const bowlNameEl = document.getElementById("bowlName");
const ingredientListEl = document.getElementById("ingredientList");
const gameGridEl = document.getElementById("gameGrid");
const statusEl = document.getElementById("status");
const showIngredientsButton = document.getElementById("showIngredientsButton");
const startButton = document.getElementById("startButton");
const showDataButton = document.getElementById("showDataButton");
const dataSection = document.getElementById("dataSection");
const lossScreen = document.getElementById("lossScreen");
const returnToStartButton = document.getElementById("returnToStartButton");
const winScreen = document.getElementById("winScreen");
const winMessage = document.getElementById("winMessage");
const continueButton = document.getElementById("continueButton");
const returnHomeButton = document.getElementById("returnHomeButton");

startButton.addEventListener("click", () => {
  playerName = playerNameInput.value.trim();
  if (!playerName) {
    alert("Please enter your name before starting!");
    return;
  }
  lossScreen.style.display = "none";
  winScreen.style.display = "none";
  startGame();
});

returnToStartButton.addEventListener("click", returnToStartScreen);
continueButton.addEventListener("click", () => {
  winScreen.style.display = "none";
  startGame();
});
returnHomeButton.addEventListener("click", returnToStartScreen);

showIngredientsButton.addEventListener("click", () => {
  ingredientListEl.style.display = ingredientListEl.style.display === "none" ? "block" : "none";
});

showDataButton.addEventListener("click", showPlayerData);

function startGame() {
  selectedBowl = bowls[Math.floor(Math.random() * bowls.length)];
  bowlNameEl.textContent = selectedBowl.name;
  ingredientListEl.innerHTML = "";
  selectedBowl.ingredients.forEach(ingredient => {
    const li = document.createElement("li");
    li.textContent = ingredient;
    ingredientListEl.appendChild(li);
  });
  ingredientListEl.style.display = "none";

  const gridIngredients = Array.from(new Set(bowls.flatMap(bowl => bowl.ingredients))).sort();

  gameGridEl.innerHTML = "";
  gridIngredients.forEach(ingredient => {
    const card = document.createElement("div");
    card.className = "card";
    card.textContent = ingredient;
    card.addEventListener("click", () => handleCardClick(card, ingredient));
    gameGridEl.appendChild(card);
  });

  lives = 3;
  timeRemaining = 60;
  statusEl.textContent = `Lives: ${lives} | Time: ${timeRemaining}s`;
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timeRemaining--;
    statusEl.textContent = `Lives: ${lives} | Time: ${timeRemaining}s`;
    if (timeRemaining <= 0) {
      updatePlayerData(false);
      showLossScreen();
    }
  }, 1000);
}

function handleCardClick(card, ingredient) {
  if (selectedBowl.ingredients.includes(ingredient)) {
    card.classList.add("matched");
    checkWinCondition();
  } else {
    card.classList.add("incorrect");
    lives--;
    statusEl.textContent = `Lives: ${lives} | Time: ${timeRemaining}s`;
    if (lives <= 0) {
      updatePlayerData(false);
      showLossScreen();
    }
  }
}

function checkWinCondition() {
  const matchedCards = document.querySelectorAll(".card.matched");
  const matchedIngredients = Array.from(matchedCards).map(card => card.textContent);
  const allMatched = selectedBowl.ingredients.every(ingredient => matchedIngredients.includes(ingredient));

  if (allMatched) {
    clearInterval(timerInterval);
    updatePlayerData(true);
    showWinScreen();
  }
}

function showWinScreen() {
  winMessage.textContent = `🎉 Congratulations! You correctly completed the ${selectedBowl.name} bowl!`;
  winScreen.style.display = "block";
  gameGridEl.innerHTML = "";
  bowlNameEl.textContent = "";
}

function updatePlayerData(won) {
  if (!playerName) return;
  if (!playerData[playerName]) {
    playerData[playerName] = { levelsCompleted: 0, bowls: [] };
  }
  if (won) {
    playerData[playerName].levelsCompleted++;
    playerData[playerName].bowls.push(selectedBowl.name);
  }
  localStorage.setItem("playerData", JSON.stringify(playerData));
}

function showPlayerData() {
  dataSection.innerHTML = "<h2>Player Data</h2>";
  for (const [name, data] of Object.entries(playerData)) {
    const playerInfo = document.createElement("div");
    playerInfo.innerHTML = `<strong>${name}</strong>: ${data.levelsCompleted} bowls completed<br>Bowls: ${data.bowls.join(", ")}`;
    dataSection.appendChild(playerInfo);
  }
  dataSection.style.display = "block";
}

function returnToStartScreen() {
  lossScreen.style.display = "none";
  winScreen.style.display = "none";
  playerNameInput.value = "";
  bowlNameEl.textContent = "";
  ingredientListEl.innerHTML = "";
  gameGridEl.innerHTML = "";
  statusEl.textContent = "";
  dataSection.style.display = "none";
}

function showLossScreen() {
  clearInterval(timerInterval);
  lossScreen.style.display = "block";
  gameGridEl.innerHTML = "";
  bowlNameEl.textContent = "";
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

