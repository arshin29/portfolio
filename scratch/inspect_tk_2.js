const fs = require('fs');
const code = fs.readFileSync('scratch/postcard_chunk.js', 'utf8');

const idx = code.indexOf('className:`tk`');
console.log(code.substring(idx + 1000, idx + 2000));
