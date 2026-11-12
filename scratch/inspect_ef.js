const fs = require('fs');
const code = fs.readFileSync('scratch/postcard_chunk.js', 'utf8');

const target = 'function ef({logo:e,label:t}){';
const idx = code.indexOf(target);
console.log(code.substring(idx, idx + 1000));
