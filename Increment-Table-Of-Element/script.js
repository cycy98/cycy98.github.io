// script.js

// TAB FUNCTIONALITY
function openTab(tabId) {
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach((content) => content.classList.remove('active'));

    const selectedTab = document.getElementById(tabId);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }
}

// Set the default tab (Hydrogen Generator)
document.addEventListener('DOMContentLoaded', () => {
    openTab('generator');
    updateDisplay();
    updateAchievements();
});

// GAME STATE
let hydrogen1 = 10; // Start with 10 Hydrogen1
let totalH1 = 10;   // Total Hydrogen1 that never decreases
let hydrogen2 = 0;
let hydrogen3 = 0;

const generators = [
    { name: "Basic Generator", cost: 10, production: 1, count: 0 },
    { name: "Advanced Generator", cost: 100, production: 10, count: 0 },
    { name: "Fusion Generator", cost: 1000, production: 100, count: 0 },
    { name: "Quantum Generator", cost: 10000, production: 1000, count: 0 },
];

const fusionReactor = {
    cost: 5000,
    production: 50,
    count: 0,
};

// ACHIEVEMENTS
let achievements = []; // Initialize achievements as an empty array

// DOM ELEMENTS
const hydrogen1CountDisplay = document.getElementById('hydrogen1-count');
const hydrogen2CountDisplay = document.getElementById('hydrogen2-count');
const hydrogen3CountDisplay = document.getElementById('hydrogen3-count');
const generatorTable = document.getElementById('generator-table');
const achievementsList = document.getElementById('achievements-list');
const achievementPopup = document.getElementById('achievement-popup');
const fusionStatusDisplay = document.getElementById('fusion-status');

// Function to update the resource display
function updateDisplay() {
    if (hydrogen1CountDisplay) hydrogen1CountDisplay.textContent = hydrogen1.toFixed(1);
    if (hydrogen2CountDisplay) hydrogen2CountDisplay.textContent = hydrogen2.toFixed(1);
    if (hydrogen3CountDisplay) hydrogen3CountDisplay.textContent = hydrogen3.toFixed(1);

    // Update generator table
    generatorTable.innerHTML = generators
        .map((gen, index) => `
            <tr>
                <td>${gen.name}</td>
                <td>${gen.cost}</td>
                <td>${gen.production}</td>
                <td>${gen.count}</td>
                <td><button onclick="buyGenerator(${index})">Buy</button></td>
            </tr>
        `)
        .join("");

    // Fusion status
    if (fusionStatusDisplay) {
        fusionStatusDisplay.textContent = `Fusion Reactor: ${fusionReactor.count} active`;
    }
}

// Function to update achievements
function updateAchievements() {
    achievementsList.innerHTML = `
        <h3>Achievement List</h3> <!-- Title for achievement list -->
        ${achievements
            .map((ach) => `<li>${ach}</li>`)
            .join("")}
    `;
}

// Function to add an achievement
function addAchievement(name) {
    if (!achievements.includes(name)) {
        achievements.push(name);
        updateAchievements();
        showAchievementPopup(name);
    }
}

// Function to show achievement popup
function showAchievementPopup(name) {
    achievementPopup.textContent = `Achievement Unlocked: ${name}`;
    achievementPopup.style.display = "block";
    setTimeout(() => {
        achievementPopup.style.display = "none";
    }, 3000);
}

// Function to buy a generator
function buyGenerator(index) {
    const generator = generators[index];
    if (hydrogen1 >= generator.cost) {
        hydrogen1 -= generator.cost;
        totalH1 += generator.production;
        generator.count += 1;
        generator.cost = Math.ceil(generator.cost * 1.15); // Increment cost
        updateDisplay();
    }
}

// Function to buy a fusion reactor
function buyFusionReactor() {
    if (hydrogen1 >= fusionReactor.cost) {
        hydrogen1 -= fusionReactor.cost;
        fusionReactor.count += 1;
        fusionReactor.cost = Math.ceil(fusionReactor.cost * 1.2); // Increment cost
        addAchievement("Fusion Reactor Unlocked");
        updateDisplay();
    }
}

// Function to produce Hydrogen and Isotopes (Hydrogen2 and Hydrogen3)
function produceHydrogen() {
    const totalProduction = generators.reduce((sum, gen) => sum + gen.production * gen.count, 0);
    hydrogen1 += totalProduction / 10; // Add Hydrogen1

    // Generate isotopes based on Hydrogen1 production, only if totalH1 > 10
    if (totalH1 > 10) {
        const isotopeChance = Math.random();

        // Deuterium is more common than Tritium (Hydrogen2 has a higher chance)
        if (isotopeChance < 0.03) {
            hydrogen1 -= 1;
            hydrogen2 += 1; // Produce Deuterium (Hydrogen2)
        } else if (isotopeChance < 0.06) {
            hydrogen1 -= 1;
            hydrogen3 += 1; // Produce Tritium (Hydrogen3)
        }
    }

    // Add achievements for milestones
    if (hydrogen1 >= 1000) addAchievement("Reached 1,000 Hydrogen1");
    if (hydrogen2 >= 100) addAchievement("Collected 100 Hydrogen2");
    if (hydrogen3 >= 10) addAchievement("Collected 10 Hydrogen3");

    updateDisplay();
}

// Start producing Hydrogen1 every 100ms
setInterval(produceHydrogen, 100);

// Export Game State to JSON
function exportGameState() {
    const gameState = {
        hydrogen1: hydrogen1,
        totalH1: totalH1,
        hydrogen2: hydrogen2,
        hydrogen3: hydrogen3,
        generators: generators,
        achievements: achievements,
        fusionReactor: fusionReactor,
    };
    const gameStateJSON = JSON.stringify(gameState);
    const blob = new Blob([gameStateJSON], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'gameState.json';
    link.click();
}

// Import Game State from JSON
function importGameState(fileInput) {
    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function(event) {
        const gameState = JSON.parse(event.target.result);
        hydrogen1 = gameState.hydrogen1;
        totalH1 = gameState.totalH1;
        hydrogen2 = gameState.hydrogen2;
        hydrogen3 = gameState.hydrogen3;
        generators = gameState.generators;
        achievements = gameState.achievements;
        fusionReactor = gameState.fusionReactor;
        updateDisplay();
        updateAchievements();
    };

    reader.readAsText(file);
}

// Initial display update
updateDisplay();
updateAchievements();
