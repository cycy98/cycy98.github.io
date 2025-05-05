function runCode() {
  const code = document.getElementById('code').value;
  const lines = code.split('\n');
  const output = [];
  const variables = {};
  let i = 0;
  let conditionMatched = false;

  function print(msg) {
    output.push(msg);
  }

  function evalCondition(expr) {
    const match = expr.match(/^(.+?)\s*(==|!=|>|<)\s*(.+)$/);
    if (!match) return false;
    let [, left, op, right] = match.map(s => s.trim());

    left = variables.hasOwnProperty(left) ? variables[left] : (left === 'true' ? true : left === 'false' ? false : left);
    right = variables.hasOwnProperty(right) ? variables[right] : (right === 'true' ? true : right === 'false' ? false : right);

    if (!isNaN(left)) left = Number(left);
    if (!isNaN(right)) right = Number(right);

    switch (op) {
      case '==': return left == right;
      case '!=': return left != right;
      case '>': return left > right;
      case '<': return left < right;
      default: return false;
    }
  }

  function tokenize(line) {
    const tokens = [];
    let currentToken = '';
    let inQuotes = false;

    for (let char of line) {
      if (char === '"' || char === "'") {
        inQuotes = !inQuotes; // Toggle inQuotes state
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
    if (line === '' || line.startsWith('//') || line.startsWith('#')) return;

    const tokens = tokenize(line);

    // Handle declarations
    if (['int', 'str', 'bool'].includes(tokens[0])) {
      const [, type, name, valueRaw] = tokens;
      let value = valueRaw;
      if (type === 'int') variables[name] = parseInt(value);
      else if (type === 'bool') variables[name] = value === 'true';
      else if (type === 'str') {
        const match = value.match(/^\"(.*)\"$/);
        if (match) variables[name] = match[1];
        else output.push(`<span class="error">Invalid string value -> "${line}"</span>`);
      }
      return;
    }

    // Handle print
    if (tokens[0] === 'print') {
      const val = tokens.slice(1).join(' ').trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        print(`<span class="string">${val.slice(1, -1)}</span>`);
      } else if (variables.hasOwnProperty(val)) {
        print(`<span class="variable">${variables[val]}</span>`);
      } else {
        output.push(`<span class="error">Reference Error: '${val}' is not defined</span>`);
      }
      return;
    }

    // Handle unknown commands
    output.push(`<span class="error">Syntax Error: Unknown command -> "${line}"</span>`);
  }

  while (i < lines.length) {
    const line = lines[i].trim();
    if (line === '' || line.startsWith('//') || line.startsWith('#')) {
      i++;
      continue;
    }

    if (line.startsWith('if')) {
      const cond = line.match(/\((.+)\)/);
      const condition = cond ? cond[1] : '';
      const result = evalCondition(condition);
      conditionMatched = result;
      const block = runBlock(i);
      if (result) block.forEach(executeLine);
      i += block.length + 2;
      continue;
    }

    if (line.startsWith('elif')) {
      if (conditionMatched) {
        i++;
        continue;
      }
      const cond = line.match(/\((.+)\)/);
      const condition = cond ? cond[1] : '';
      const result = evalCondition(condition);
      conditionMatched = result;
      const block = runBlock(i);
      if (result) block.forEach(executeLine);
      i += block.length + 2;
      continue;
    }

    if (line.startsWith('else')) {
      if (conditionMatched) {
        i++;
        continue;
      }
      const block = runBlock(i);
      block.forEach(executeLine);
      i += block.length + 2;
      continue;
    }

    executeLine(line);
    i++;
  }

  document.getElementById('output').innerHTML = output.join('\n');
}
