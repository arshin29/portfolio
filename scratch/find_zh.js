const fs = require('fs');
const code = fs.readFileSync('scratch/postcard_chunk.js', 'utf8');

const p = code.indexOf('function Zh(');
console.log('function Zh at:', p);
if (p !== -1) {
  console.log(code.slice(p, p + 2500));
} else {
  let idx = code.indexOf('Zh=');
  console.log('Zh= at:', idx);
  console.log(code.slice(idx - 50, idx + 2500));
}
