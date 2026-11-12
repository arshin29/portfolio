const fs = require('fs');
const code = fs.readFileSync('scratch/postcard_chunk.js', 'utf8');

const target = 'function im({ticket:e})';
const idx = code.indexOf(target);
console.log(code.substring(idx + 1500, idx + 2500));
