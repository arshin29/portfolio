const fs = require('fs');
const code = fs.readFileSync('scratch/postcard_chunk.js', 'utf8');

const p = code.indexOf('Sky options');
console.log('Sky options at:', p);
if (p !== -1) {
  console.log(code.slice(p - 200, p + 2500));
}
