const fs = require('fs');
const js = fs.readFileSync('scratch/postcard_chunk.js', 'utf8');

const target = 'ra=';
const idx = js.indexOf(target);
console.log(js.substring(idx - 50, idx + 300));
