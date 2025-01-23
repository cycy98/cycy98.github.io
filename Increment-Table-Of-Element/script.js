// TAB FUNCTIONALITY
function openTab(tabId) {
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach((content) => content.classList.remove('active'));

    const selectedTab = document.getElementById(tabId);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }
}

// GAME STATE
let hydrogen1 = 10; // Start with 10 Hydrogen1
let totalH1 = 10;   // Total Hydrogen1 that never decreases
let hydrogen2 = 0;
let hydrogen3 = 0;

const generators = Array.from({ length: 10 }, (_, i) => ({
    name: `Generator ${i + 1}`,
    cost: Math.pow(10, i + 1), // Exponential cost
    production: Math.pow(2, i), // Exponential production
    count: 0,
}));

const achievements = [];

// Function to update the resource display
function updateDisplay() {
    document.getElementById('hydrogen1-count').textContent = hydrogen1.toFixed(1);
    document.getElementById('hydrogen2-count').textContent = hydrogen2.toFixed(1);
    document.getElementById('hydrogen3-count').textContent = hydrogen3.toFixed(1);
    updateGeneratorTable();
    updateAchievements();
}

// Function to update the generator table
function updateGeneratorTable() {
    const generatorTable = document.getElementById('generator-table');
    if (generatorTable) {
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
            .join('');
    }
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

// Produce hydrogen every 0.1 second
function produceHydrogen() {
    const totalProduction = generators.reduce((sum, gen) => sum + gen.production * gen.count, 0);
    hydrogen1 += totalProduction / 10; // Add production over time

    // Generate isotopes randomly
    if (totalH1 > 10) {
        const isotopeChance = Math.random(); // Random number between 0 and 1

        // Deuterium (Hydrogen2): 5% chance
        if (isotopeChance < 0.05) {
            hydrogen2 += 1;
        }

        // Tritium (Hydrogen3): 2% chance
        if (isotopeChance >= 0.05 && isotopeChance < 0.07) {
            hydrogen3 += 1;
        }
    }

    updateDisplay();
}

// Achievements logic
function addAchievement(name, description) {
    if (!achievements.some((ach) => ach.name === name)) {
        achievements.push({ name, description });
        showAchievementPopup(name);
        updateAchievements();
    }
}

function updateAchievements() {
    const achievementList = document.getElementById('achievement-list');
    if (achievementList) {
        achievementList.innerHTML = achievements
            .map((ach) => `<p><strong>${ach.name}</strong>: ${ach.description}</p>`)
            .join('');
    }
}

function showAchievementPopup(name) {
    const popup = document.createElement('div');
    popup.id = 'achievement-popup';
    popup.textContent = `Achievement Unlocked: ${name}`;
    document.body.appendChild(popup);

    setTimeout(() => {
        popup.remove();
    }, 3000);
}

// Example achievements
function checkAchievements() {
    if (totalH1 >= 100) addAchievement("Starter", "Reach 100 total Hydrogen1.");
    if (totalH1 >= 1000) addAchievement("Hydrogen Hoarder", "Reach 1,000 total Hydrogen1.");
    if (hydrogen2 >= 10) addAchievement("Deuterium Discoverer", "Collect 10 Hydrogen2.");
    if (hydrogen3 >= 5) addAchievement("Tritium Collector", "Collect 5 Hydrogen3.");
}

// Call produceHydrogen every 0.1 second
setInterval(() => {
    produceHydrogen();
    checkAchievements();
}, 100);

// Initialize Display
document.addEventListener('DOMContentLoaded', () => {
    openTab('generator');
    updateDisplay();
});
