const fs = require('fs');
const js = fs.readFileSync('scratch/postcard_chunk.js', 'utf8');

const idx = js.indexOf('meadow-contact');
console.log(js.substring(Math.max(0, idx - 1000), idx + 2500));
