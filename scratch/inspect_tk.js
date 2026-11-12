const fs = require('fs');
const code = fs.readFileSync('scratch/postcard_chunk.js', 'utf8');

const idx = code.indexOf('tk-body');
console.log(code.substring(Math.max(0, idx - 200), idx + 1200));
