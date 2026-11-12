const fs = require('fs');
const js = fs.readFileSync('scratch/postcard_chunk.js', 'utf8');

const idx = js.indexOf('Explore my canvas');
console.log(js.substring(Math.max(0, idx - 1200), idx + 800));
