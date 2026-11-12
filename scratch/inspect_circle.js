const fs = require('fs');
const code = fs.readFileSync('scratch/postcard_chunk.js', 'utf8');

const target = 'circle`,{cx:`50`,cy:`50`,r:`28`';
const idx = code.indexOf(target);
console.log(code.substring(idx - 100, idx + 500));
