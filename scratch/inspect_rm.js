const fs = require('fs');
const code = fs.readFileSync('scratch/postcard_chunk.js', 'utf8');

const target = 'function rm({value:e})';
const idx = code.indexOf(target);
console.log(code.substring(idx, idx + 600));
