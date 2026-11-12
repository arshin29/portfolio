const fs = require('fs');
const code = fs.readFileSync('scratch/postcard_chunk.js', 'utf8');

const idx = code.indexOf('className:`tk`');
// Look backwards to see the parent component
console.log(code.substring(Math.max(0, idx - 800), idx));
