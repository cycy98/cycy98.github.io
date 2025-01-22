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
});

// GAME STATE
let hydrogen1 = 10; // Start with 10 Hydrogen1
let hydrogen2 = 0;
let hydrogen3 = 0;

const generators = [
    { name: "Basic Generator", cost: 10, production: 1, count: 0 },
    { name: "Advanced Generator", cost: 100, production: 10, count: 0 },
    { name: "Fusion Generator", cost: 1000, production: 100, count: 0 },
];

// DOM ELEMENTS
const hydrogen1CountDisplay = document.getElementById('hydrogen1-count');
const hydrogen2CountDisplay = document.getElementById('hydrogen2-count');
const hydrogen3CountDisplay = document.getElementById('hydrogen3-count');
const generatorTable = document.getElementById('generator-table');
const achievementsList = document.getElementById('achievements-list');

// Function to update the resource display
function updateDisplay() {
    hydrogen1CountDisplay.textContent = hydrogen1.toFixed(1);
    hydrogen2CountDisplay.textContent = hydrogen2 > 0 ? hydrogen2.toFixed(1) : '0'; // Show 0 if none
    hydrogen3CountDisplay.textContent = hydrogen3 > 0 ? hydrogen3.toFixed(1) : '0'; // Show 0 if none

    generatorTable.innerHTML = generators
        .map((gen, index) => `
            <tr>
                <td>${gen.name}</td>
                <td>${gen.cost}</td>
                <td>${gen.production}</td>
                <td>${gen.count}</td>
                <td>
                    <button onclick="buyGenerator(${index})">Buy</button>
                </td>
            </tr>
        `)
        .join("");
}

// Function to update achievements
function updateAchievements() {
    achievementsList.innerHTML = achievements
        .map((ach) => `<li>${ach}</li>`)
        .join("");
}

// Function to add an achievement
function addAchievement(name) {
    if (!achievements.includes(name)) {
        achievements.push(name);
        updateAchievements();
    }
}

// Function to buy a generator
function buyGenerator(index) {
    const generator = generators[index];
    if (hydrogen1 >= generator.cost) {
        hydrogen1 -= generator.cost;
        generator.count += 1;
        generator.cost = Math.ceil(generator.cost * 1.15); // Increment cost
        updateDisplay();
    }
}

// Function to produce Hydrogen and Isotopes (Hydrogen2 and Hydrogen3)
function produceHydrogen() {
    // Calculate total production from all generators
    const totalProduction = generators.reduce((sum, gen) => sum + gen.production * gen.count, 0);

    // Add Hydrogen1
    hydrogen1 += totalProduction / 10;

    // Generate isotopes based on Hydrogen1 production
    if (hydrogen1 >= 1) {
        const isotopeChance = Math.random();
        if (isotopeChance < 0.1) {
            hydrogen1 -= 1;
            hydrogen2 += 1; // Produce Deuterium (Hydrogen2)
        } else if (isotopeChance < 0.05) {
            hydrogen1 -= 1;
            hydrogen3 += 1; // Produce Tritium (Hydrogen3)
        }
    }

    // Add achievements for milestones
    if (hydrogen1 >= 1000) addAchievement("Reached 1,000 Hydrogen1");
    if (hydrogen2 >= 100) addAchievement("Collected 100 Hydrogen2");
    if (hydrogen3 >= 10) addAchievement("Collected 10 Hydrogen3");

    // Ensure no negative values
    hydrogen1 = Math.max(0, hydrogen1);
    updateDisplay();
}

// Start producing Hydrogen1 every 100ms
setInterval(produceHydrogen, 100);

// Initial display update
updateDisplay();
updateAchievements();
