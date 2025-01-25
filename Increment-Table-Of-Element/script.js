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
let generators = [];

function initializeGenerators() {
    for (let i = 1; i <= 10; i++) {
        const cost = 10 * Math.pow(10, i-1); // Cost increases exponentially
        const production = i * Math.pow(10, i-1); // Slightly better production per cost

        generators.push({
            name: `Generator ${i}`,
            cost: cost,
            production: production,
            count: 0,
        });
    }
}

initializeGenerators();
const achievements = [];

// FUNCTIONALITY
function updateDisplay() {
    const hydrogen1Element = document.getElementById('hydrogen1-count');
    const hydrogen2Element = document.getElementById('hydrogen2-count');
    const hydrogen3Element = document.getElementById('hydrogen3-count');

    if (hydrogen1Element) hydrogen1Element.textContent = hydrogen1.toFixed(1);
    if (hydrogen2Element) hydrogen2Element.textContent = hydrogen2.toFixed(1);
    if (hydrogen3Element) hydrogen3Element.textContent = hydrogen3.toFixed(1);

    updateGeneratorTable();
}

function updateGeneratorTable() {
    const table = document.getElementById('generator-table');
    if (table) {
        table.innerHTML = generators
            .map((gen, i) => `
                <tr>
                    <td>${gen.name}</td>
                    <td>${gen.cost.toExponential(2)} (1H)</td>
                    <td>${gen.production.toExponential(2)} (1H/s)</td>
                    <td>${gen.count}</td>
                    <td><button onclick="buyGenerator(${i})">Buy</button></td>
                </tr>
            `)
            .join('');
    }
}


// Ensure this function is called during initialization
document.addEventListener('DOMContentLoaded', () => {
    openTab('generator');
    updateDisplay();
});


function buyGenerator(index) {
    const generator = generators[index];
    if (hydrogen1 >= generator.cost) {
        hydrogen1 -= generator.cost;
        generator.count += 1;
        generator.cost = Math.ceil(generator.cost * 1.5); // Increase cost for the next generator
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
