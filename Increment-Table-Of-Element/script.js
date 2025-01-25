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
let helium = 0;
let unlockedElements = ['H']; // Start with hydrogen unlocked
const generators = Array.from({ length: 10 }, (_, i) => ({
    name: `Generator ${i + 1}`,
    cost: 5 * Math.pow(5, i), // Reduced cost scaling
    production: Math.pow(2, i),
    count: 0,
}));
const achievements = [];

// FUNCTIONALITY
function updateDisplay() {
    document.getElementById('hydrogen1-count').textContent = hydrogen1.toFixed(1);
    document.getElementById('hydrogen2-count').textContent = hydrogen2.toFixed(1);
    document.getElementById('hydrogen3-count').textContent = hydrogen3.toFixed(1);
    document.getElementById('helium-count').textContent = helium.toFixed(1);
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
        if (isotopeChance < 0.08) hydrogen2++;
        else if (isotopeChance < 0.1) hydrogen3++;
    }
    updateDisplay();
}

// FUSION
function fuse(isotope1, isotope2) {
    if (isotope1 === 'Hydrogen2' && isotope2 === 'Hydrogen2' && hydrogen2 >= 2) {
        hydrogen2 -= 2;
        helium++;
        if (!unlockedElements.includes('He')) {
            unlockedElements.push('He');
        }
        updateDisplay();
    }
}

// PERIODIC TABLE
function updatePeriodicTable() {
    const table = document.getElementById('periodic-table-container');
    if (table) {
        const elements = [
            'H', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'He',
            // Fill with placeholders for layout
        ];
        table.innerHTML = elements.map(el => `
            <div class="element ${unlockedElements.includes(el) ? 'unlocked' : ''}">
                ${el}
            </div>
        `).join('');
    }
}

// SETTINGS
function exportGame() {
    const data = JSON.stringify({ hydrogen1, hydrogen2, hydrogen3, helium, unlockedElements });
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
        helium = parsed.helium || helium;
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
