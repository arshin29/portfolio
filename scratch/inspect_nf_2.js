const fs = require('fs');
const code = fs.readFileSync('scratch/postcard_chunk.js', 'utf8');

const idx = code.indexOf('function nf({project:e}){');
console.log(code.substring(idx + 2400, idx + 4500));
