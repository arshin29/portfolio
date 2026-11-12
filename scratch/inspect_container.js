const fs = require('fs');
const code = fs.readFileSync('scratch/postcard_chunk.js', 'utf8');

const idx = code.indexOf('project-postcards');
console.log(code.substring(idx - 100, idx + 400));
