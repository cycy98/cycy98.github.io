document.addEventListener('DOMContentLoaded', () => {
    const lexiconTableBody = document.querySelector('#lexicon-table tbody');
    const addWordBtn = document.querySelector('#add-word-btn');
    const applyRulesBtn = document.querySelector('#apply-rules-btn');
    const soundRulesTextarea = document.querySelector('#sound-rules');
    const evolvedWordsList = document.querySelector('#evolved-words');

    const lexicon = []; // Array to store lexicon entries

    // Add Word to Lexicon
    addWordBtn.addEventListener('click', () => {
        const word = prompt('Enter a word:');
        const definition = prompt('Enter a definition:');
        const partOfSpeech = prompt('Enter part of speech:');

        if (word && definition && partOfSpeech) {
            lexicon.push({ word, definition, partOfSpeech });
            updateLexiconTable();
        }
    });

    // Update Lexicon Table
    function updateLexiconTable() {
        lexiconTableBody.innerHTML = '';
        lexicon.forEach((entry, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${entry.word}</td>
                <td>${entry.definition}</td>
                <td>${entry.partOfSpeech}</td>
                <td><button data-index="${index}" class="delete-word-btn">Delete</button></td>
            `;
            lexiconTableBody.appendChild(row);
        });

        // Add event listeners for delete buttons
        document.querySelectorAll('.delete-word-btn').forEach((btn) => {
            btn.addEventListener('click', (e) => {
                const index = e.target.dataset.index;
                lexicon.splice(index, 1);
                updateLexiconTable();
            });
        });
    }

    // Apply Sound Change Rules
    applyRulesBtn.addEventListener('click', () => {
        const rules = soundRulesTextarea.value.split('\n'); // Each rule on a new line
        evolvedWordsList.innerHTML = '';

        lexicon.forEach((entry) => {
            let evolvedWord = entry.word;
            rules.forEach((rule) => {
                const [from, to] = rule.split('->').map((s) => s.trim());
                if (from && to) {
                    const regex = new RegExp(from, 'g');
                    evolvedWord = evolvedWord.replace(regex, to);
                }
            });

            // Add evolved word to results
            const li = document.createElement('li');
            li.textContent = `${entry.word} -> ${evolvedWord}`;
            evolvedWordsList.appendChild(li);
        });
    });
});
