const fs = require('fs');
const code = fs.readFileSync('scratch/postcard_chunk.js', 'utf8');

const p = code.indexOf('sky-app');
console.log('sky-app at:', p);
if (p !== -1) {
  console.log(code.slice(p - 100, p + 500));
}

// search for background or backdrop
let idx = 0;
while ((idx = code.indexOf('sky-backdrop', idx)) !== -1) {
  console.log('sky-backdrop at:', idx, code.slice(idx - 50, idx + 200));
  idx += 12;
}
