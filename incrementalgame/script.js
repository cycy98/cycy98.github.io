let coins = 0;
let clickPower = 1;
let clickPowerLevel = 1;
let clickUpgradeCost = 50;

let workers = 0;
let workerCost = 10;
let prestigeMultiplier = 1;

document.getElementById("clicker").onclick = () => {
  coins += clickPower * prestigeMultiplier;
  updateDisplay();
};

function buyWorker() {
  if (coins >= workerCost) {
    coins -= workerCost;
    workers++;
    workerCost = Math.floor(workerCost * 1.5);
    updateDisplay();
  }
}

function upgradeClickPower() {
  if (coins >= clickUpgradeCost) {
    coins -= clickUpgradeCost;
    clickPowerLevel++;
    clickPower = Math.pow(2, clickPowerLevel - 1);
    clickUpgradeCost = Math.floor(clickUpgradeCost * 2);
    updateDisplay();
  }
}

function prestige() {
  if (coins >= 1000) {
    prestigeMultiplier++;
    coins = 0;
    clickPower = 1;
    clickPowerLevel = 1;
    clickUpgradeCost = 50;
    workers = 0;
    workerCost = 10;
    updateDisplay();
  }
}

function updateDisplay() {
  document.getElementById("coins").textContent = Math.floor(coins);
  document.getElementById("workers").textContent = workers;
  document.getElementById("workerCost").textContent = workerCost;
  document.getElementById("clickPowerLevel").textContent = clickPowerLevel;
  document.getElementById("clickUpgradeCost").textContent = clickUpgradeCost;
  document.getElementById("prestigeBonus").textContent = `${prestigeMultiplier}x`;
}

// Passive income
setInterval(() => {
  coins += workers * prestigeMultiplier;
  updateDisplay();
}, 1000);

// Save/Load
function saveGame() {
  const saveData = {
    coins, clickPowerLevel, clickUpgradeCost,
    workers, workerCost, prestigeMultiplier
  };
  localStorage.setItem('incrementalSave', JSON.stringify(saveData));
  alert("Game saved!");
}

function loadGame() {
  const data = JSON.parse(localStorage.getItem('incrementalSave'));
  if (data) {
    coins = data.coins;
    clickPowerLevel = data.clickPowerLevel;
    clickPower = Math.pow(2, clickPowerLevel - 1);
    clickUpgradeCost = data.clickUpgradeCost;
    workers = data.workers;
    workerCost = data.workerCost;
    prestigeMultiplier = data.prestigeMultiplier;
    updateDisplay();
    alert("Game loaded!");
  }
}

window.onload = updateDisplay;
