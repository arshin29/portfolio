const fs = require('fs');
const s = fs.readFileSync('scratch/postcard_chunk.js', 'utf8');

const idx = s.indexOf('function Hu(');
console.log('Hu length from function Hu(:');
console.log(s.substring(idx, idx + 4500));
