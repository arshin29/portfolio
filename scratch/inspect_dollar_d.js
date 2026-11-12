const fs = require('fs');
const code = fs.readFileSync('scratch/postcard_chunk.js', 'utf8');

const idx = code.indexOf('function $d({id:e');
console.log(code.substring(idx, idx + 1200));
