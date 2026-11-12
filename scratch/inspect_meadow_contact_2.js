const fs = require('fs');
const js = fs.readFileSync('scratch/postcard_chunk.js', 'utf8');

const idx = js.indexOf('let M=(0,q.');
console.log(js.substring(idx, idx + 3500));
