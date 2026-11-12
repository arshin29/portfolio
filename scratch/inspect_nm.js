const fs = require('fs');
const code = fs.readFileSync('scratch/postcard_chunk.js', 'utf8');

const target = 'function nm(';
const idx = code.indexOf(target);
console.log(code.substring(idx - 200, idx + 600));
