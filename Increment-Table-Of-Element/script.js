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
    cost: Math.pow(10, i + 1), // Powers of 10: 10, 100, 1,000, etc.
    production: Math.pow(10, i) * 1.2, // Slightly better production scaling
    count: 0,
}));
const achievements = [];

// FUNCTIONALITY
function updateDisplay() {
    document.getElementById('1H-count').textContent = hydrogen1.toFixed(1);
    document.getElementById('2H-count').textContent = hydrogen2.toFixed(1);
    document.getElementById('3H-count').textContent = hydrogen3.toFixed(1);
    document.getElementById('3He-count').textContent = helium3.toFixed(1);
    document.getElementById('4He-count').textContent = helium4.toFixed(1);
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
                    <td>${gen.production.toFixed(1)}</td>
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
        if (isotopeChance < 0.15) hydrogen2++; // 15% for Deuterium
        else if (isotopeChance < 0.18) hydrogen3++; // 3% for Tritium
    }
    updateDisplay();
}

// ACHIEVEMENTS
function updateAchievements() {
    const achievementList = document.getElementById('achievement-list');
    if (achievementList) {
        achievementList.innerHTML = achievements
            .map((ach) => `<p>${ach}</p>`)
            .join('');
    }
}

// FUSION
function fuse(isotope1, isotope2) {
    if (isotope1 === '2H' && isotope2 === '2H' && hydrogen2 >= 2) {
        hydrogen2 -= 2;
        helium4++;
    } else if (isotope1 === '3H' && isotope2 === '2H' && hydrogen3 >= 1 && hydrogen2 >= 1) {
        hydrogen3--;
        hydrogen2--;
        helium3++;
    }
    updateDisplay();
}

// PERIODIC TABLE
function updatePeriodicTable() {
    const container = document.getElementById('periodic-table-container');
    if (container) {
        const elements = [
            { symbol: 'H', atomicNumber: 1 },
            { symbol: '', atomicNumber: 2 }, // Spacer
            { symbol: 'He', atomicNumber: 2 },
            // Additional elements can be added here
        ];
        container.innerHTML = elements
            .map((el) => `
                <div class="element ${unlockedElements.includes(el.symbol) ? 'unlocked' : ''}">
                    ${el.symbol}
                </div>
            `)
            .join('');
    }
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
