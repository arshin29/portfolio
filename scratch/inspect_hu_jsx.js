const fs = require('fs');
const s = fs.readFileSync('scratch/postcard_chunk.js', 'utf8');

const idx = s.indexOf('className:`sky-paper-contact`');
console.log(s.substring(idx - 50, idx + 4500));
