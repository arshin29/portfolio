const fs = require('fs');

const code = fs.readFileSync('src/components/meadow/meadowEngine.js', 'utf8');

// Find all identifiers used in kd
const kdIndex = code.indexOf('function kd(');
const kdCode = code.slice(kdIndex);

// Let's look for functions called in kd: e.g. Td(
const calledFunctions = [...new Set(kdCode.match(/\b([a-zA-Z0-9_$]+)\s*\(/g))].map(s => s.replace('(', '').trim());

// Check if these functions exist in meadowEngine.js
const missing = [];
for (const fn of calledFunctions) {
  if (['Math', 'Uint8Array', 'Float32Array', 'Array', 'Set', 'Map', 'requestAnimationFrame', 'cancelAnimationFrame', 'setTimeout', 'clearTimeout', 'parseInt', 'parseFloat', 'normalize', 'copy', 'set', 'add', 'multiply', 'clone', 'push', 'slice', 'fill', 'getAttribute', 'setAttribute', 'addEventListener', 'removeEventListener', 'getBoundingClientRect', 'observe', 'disconnect', 'matchMedia', 'dispatchEvent', 'catch', 'then', 'indexOf', 'includes', 'toString'].includes(fn)) continue;
  
  const re = new RegExp('\\b(function|var|let|const|class)\\s+' + fn + '\\b');
  const importRe = new RegExp('\\b' + fn + '\\b', 'g');
  if (!code.match(re) && !code.slice(0, 500).match(importRe)) {
    missing.push(fn);
  }
}
console.log('Potentially missing functions in kd:', missing);
