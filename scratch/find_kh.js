const fs = require('fs');
const code = fs.readFileSync('scratch/postcard_chunk.js', 'utf8');

const p = code.indexOf('function Kh(');
console.log('function Kh at:', p);
if (p !== -1) {
  console.log(code.slice(p, p + 1200));
} else {
  let idx = code.indexOf('Kh=');
  console.log('Kh= at:', idx);
  console.log(code.slice(idx - 50, idx + 1200));
}
