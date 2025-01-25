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
let hydrogen1 = 10;
let totalH1 = 10;
let hydrogen2 = 0;
let hydrogen3 = 0;
let helium3 = 0;
let helium4 = 0;
let unlockedElements = ['H']; // Start with hydrogen unlocked
const generators = Array.from({ length: 10 }, (_, i) => ({
    name: `Generator ${i + 1}`,
    cost: 10 * Math.pow(2, i), // Starts at 10 and scales
    production: Math.pow(1.5, i),
    count: 0,
}));
const achievements = [];

// FUNCTIONALITY
function updateDisplay() {
    document.getElementById('hydrogen1-count').textContent = hydrogen1.toFixed(1);
    document.getElementById('hydrogen2-count').textContent = hydrogen2.toFixed(1);
    document.getElementById('hydrogen3-count').textContent = hydrogen3.toFixed(1);
    document.getElementById('helium3-count').textContent = helium3.toFixed(1);
    document.getElementById('helium4-count').textContent = helium4.toFixed(1);
    updateGeneratorTable();
    updateAchievements();
    updatePeriodicTable();
}

function updateGeneratorTable() {
    const table = document.getElementById('generator-table');
    if (table) {
        table.innerHTML = generators
            .map((gen, i) => `
                <tr>
                    <td>${gen.name}</td>
                    <td>${gen.cost}</td>
                    <td>${gen.production}</td>
                    <td>${gen.count}</td>
                    <td><button onclick="buyGenerator(${i})">Buy</button></td>
                </tr>
            `).join('');
    }
}

function buyGenerator(index) {
    const gen = generators[index];
    if (hydrogen1 >= gen.cost) {
        hydrogen1 -= gen.cost;
        gen.count++;
        gen.cost = Math.ceil(gen.cost * 1.15);
        updateDisplay();
    }
}

function produceHydrogen() {
    const totalProduction = generators.reduce((sum, gen) => sum + gen.production * gen.count, 0);
    hydrogen1 += totalProduction / 10;

    const isotopeChance = Math.random();
    if (totalH1 > 10) {
        if (isotopeChance < 0.1) hydrogen2++; // 10% for Deuterium
        else if (isotopeChance < 0.13) hydrogen3++; // 3% for Tritium
    }
    updateDisplay();
}

// ACHIEVEMENTS
function updateAchievements() {
    // Achievement logic...
}

// FUSION
function fuse(isotope1, isotope2) {
    // Fusion logic...
}

// PERIODIC TABLE
function updatePeriodicTable() {
    // Periodic table logic...
}

// SETTINGS
function exportGame() {
    const data = JSON.stringify({ hydrogen1, hydrogen2, hydrogen3, helium3, helium4, unlockedElements });
    navigator.clipboard.writeText(data);
    alert('Game exported to clipboard!');
}

function importGame() {
    const data = prompt('Paste your saved game data:');
    if (data) {
        const parsed = JSON.parse(data);
        hydrogen1 = parsed.hydrogen1 || hydrogen1;
        hydrogen2 = parsed.hydrogen2 || hydrogen2;
        hydrogen3 = parsed.hydrogen3 || hydrogen3;
        helium3 = parsed.helium3 || helium3;
        helium4 = parsed.helium4 || helium4;
        unlockedElements = parsed.unlockedElements || unlockedElements;
        updateDisplay();
    }
}

// INTERVALS
setInterval(produceHydrogen, 100);

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    openTab('generator');
    updateDisplay();
});
