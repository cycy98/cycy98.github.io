document.addEventListener('DOMContentLoaded', () => {
    // Define custom mode for Conlang syntax
    CodeMirror.defineSimpleMode("conlang", {
        start: [
            { regex: /\b(trait|class|encodes|\$)\b/, token: "keyword" },
            { regex: /\b(Place|Manner|Voice)\b/, token: "atom" },
            { regex: /[C|V]/, token: "variable" },
            { regex: /\{|\}/, token: "bracket" },
            { regex: /\/.*?\//, token: "string" },
        ],
        meta: {
            lineComment: "//"
        }
    });

    // Initialize CodeMirror Editor
    const editor = CodeMirror.fromTextArea(document.getElementById('code-editor'), {
        mode: 'conlang', // Custom mode for conlang syntax
        lineNumbers: true,
        theme: 'material-darker',
        tabSize: 4,
    });

    // Button to handle parsing (basic functionality)
    document.getElementById('parse-button').addEventListener('click', () => {
        const code = editor.getValue();

        // Parse and validate the custom conlang syntax
        try {
            if (code.includes('$') && code.includes('trait')) {
                alert('Syntax is valid!');
            } else {
                alert('Syntax validation failed!');
            }
        } catch (error) {
            console.error('Parsing error:', error);
        }
    });
});
