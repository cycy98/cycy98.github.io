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

  function runBlock(startIndex) {
    let blockLines = [];
    let depth = 0;
    for (let j = startIndex; j < lines.length; j++) {
      let line = lines[j].trim();
      if (line === '{') {
        if (depth++ === 0) continue;
      }
      if (line === '}') {
        if (--depth === 0) break;
      }
      if (depth > 0) blockLines.push(line);
    }
    return blockLines;
  }

  function isLineIgnorable(line) {
    return line === '' || line.startsWith('//') || line.startsWith('#');
  }

  function isSemicolonRequired(line) {
    const trimmed = line.trim();
    if (trimmed === '' || trimmed.endsWith(';') || trimmed.endsWith('{') || trimmed.endsWith('}') || trimmed.startsWith('if') || trimmed.startsWith('elif') || trimmed.startsWith('else')) return false;
    const quotes = [...trimmed.matchAll(/["']/g)];
    return quotes.length % 2 === 0; // even number of quotes
  }

  function executeLine(line) {
    line = line.trim();
    if (isLineIgnorable(line)) return;
    if (isSemicolonRequired(line)) {
      output.push(`Syntax Error: Missing semicolon -> "${line}"`);
      return;
    }

    if (line.endsWith(';')) line = line.slice(0, -1);

    const decl = line.match(/^(int|str|bool)\s+(\w+)\s*=\s*(.+)$/);
    if (decl) {
      const [, type, name, valueRaw] = decl;
      let value = valueRaw.trim();
      if (type === 'int') variables[name] = parseInt(value);
      else if (type === 'bool') variables[name] = value === 'true';
      else if (type === 'str') {
        const match = value.match(/^\"(.*)\"$/);
        if (match) variables[name] = match[1];
        else output.push(`Invalid string value -> "${line}"`);
      }
      return;
    }

    const printMatch = line.match(/^print\((.+)\)$/);
    if (printMatch) {
      let val = printMatch[1].trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        print(val.slice(1, -1));
      } else if (variables.hasOwnProperty(val)) {
        print(variables[val]);
      } else {
        output.push(`Reference Error: '${val}' is not defined`);
      }
      return;
    }

    output.push(`Syntax Error: Unknown command -> "${line}"`);
  }

  while (i < lines.length) {
    let line = lines[i].trim();
    if (isLineIgnorable(line)) {
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
