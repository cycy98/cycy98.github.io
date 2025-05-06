// Define Custom Language Mode
function defineCustomLanguageMode() {
    CodeMirror.defineMode("customLang", function() {
        return {
            token: function(stream) {
                if (stream.match(/\/\/.*/)) {
                    return "comment";
                }
                if (stream.match(/"(?:[^\\"]|\\.)*"?/)) {
                    return "string";
                }
                if (stream.match(/\b(int|str|bool|if|elif|else|print|true|false)\b/)) {
                    return "keyword";
                }
                if (stream.match(/\b\d+\b/)) {
                    return "number";
                }
                if (stream.match(/\b[a-zA-Z_]\w*\b/)) {
                    return "variable";
                }
                stream.next();
                return null;
            }
        };
    });
}

// Initialize CodeMirror
function initializeCodeMirror() {
    return CodeMirror(document.getElementById('codeEditor'), {
        value: `
int x = 5;
bool valid = true;
str name = "Alex";

if (x == 5) {
    print("x is 5");
} elif (valid == false) {
    print("invalid");
} else {
    print(name);
}`,
        mode: "customLang",
        lineNumbers: true,
        theme: "custom-dark",
        indentUnit: 4,
        matchBrackets: true,
    });
}

// Main Function to Run Code
function runCode() {
    const code = editor.getValue();
    const lines = code.split('\n');
    const output = [];
    const variables = {};
    let conditionMatched = false;

    function print(msg) {
        output.push(msg);
    }

    function evalCondition(expr) {
        const match = expr.match(/^(.+?)\s*(==|!=|>|<)\s*(.+)$/);
        if (!match) return false;

        let [ , left, op, right ] = match.map(s => s.trim());
        left = resolveValue(left);
        right = resolveValue(right);

        switch (op) {
            case '==': return left == right;
            case '!=': return left != right;
            case '>': return left > right;
            case '<': return left < right;
            default: return false;
        }
    }

    function resolveValue(value) {
        if (variables.hasOwnProperty(value)) return variables[value];
        if (value === 'true') return true;
        if (value === 'false') return false;
        if (!isNaN(value)) return Number(value);
        return value;
    }

    function runBlock(startIndex) {
        const blockLines = [];
        let depth = 0;

        for (let i = startIndex + 1; i < lines.length; i++) {
            const line = lines[i].trim();

            if (line === '{') {
                depth++;
            } else if (line === '}') {
                if (depth === 0) break;
                depth--;
            }

            if (depth > 0 || (line !== '{' && line !== '}')) {
                blockLines.push(line);
            }
        }

        return blockLines;
    }

    function tokenize(line) {
        const tokens = [];
        let currentToken = '';
        let inQuotes = false;

        for (const char of line) {
            if (char === '"' || char === "'") {
                inQuotes = !inQuotes;
                currentToken += char;
                continue;
            }

            if (char === ' ' && !inQuotes) {
                if (currentToken) tokens.push(currentToken);
                currentToken = '';
            } else {
                currentToken += char;
            }
        }

        if (currentToken) tokens.push(currentToken);
        return tokens;
    }

    function executeLine(line) {
        line = line.trim();
        if (!line || line.startsWith('//') || line.startsWith('#')) return;

        const tokens = tokenize(line);

        switch (tokens[0]) {
            case 'int':
            case 'str':
            case 'bool':
                declareVariable(tokens);
                break;
            case 'print':
                handlePrint(tokens);
                break;
            default:
                output.push(`Syntax Error: Unknown command -> "${line}"`);
        }
    }

    function declareVariable(tokens) {
        const [type, name, valueRaw] = tokens;
        let value = valueRaw;

        switch (type) {
            case 'int':
                variables[name] = parseInt(value);
                break;
            case 'bool':
                variables[name] = value === 'true';
                break;
            case 'str':
                const match = value.match(/^"(.*)"$/);
                if (match) {
                    variables[name] = match[1];
                } else {
                    output.push(`Invalid string value -> "${value}"`);
                }
                break;
        }
    }

    function handlePrint(tokens) {
        const val = tokens.slice(1).join(' ').trim();

        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
            print(val.slice(1, -1));
        } else if (variables.hasOwnProperty(val)) {
            print(variables[val]);
        } else {
            output.push(`Reference Error: '${val}' is not defined`);
        }
    }

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        if (line.startsWith('if')) {
            const condition = extractCondition(line);
            conditionMatched = evalCondition(condition);

            if (conditionMatched) {
                const block = runBlock(i);
                block.forEach(executeLine);
                i += block.length + 1;
            }
            continue;
        }

        if (line.startsWith('elif')) {
            if (!conditionMatched) {
                const condition = extractCondition(line);
                conditionMatched = evalCondition(condition);

                if (conditionMatched) {
                    const block = runBlock(i);
                    block.forEach(executeLine);
                    i += block.length + 1;
                }
            }
            continue;
        }

        if (line.startsWith('else')) {
            if (!conditionMatched) {
                const block = runBlock(i);
                block.forEach(executeLine);
                i += block.length + 1;
            }
            continue;
        }

        executeLine(line);
    }

    document.getElementById('output').innerHTML = output.join('\n');
}

function extractCondition(line) {
    const match = line.match(/\((.+)\)/);
    return match ? match[1] : '';
}

// Initialize and Run
defineCustomLanguageMode();
const editor = initializeCodeMirror();
