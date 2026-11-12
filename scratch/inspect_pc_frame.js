const fs = require('fs');
const code = fs.readFileSync('scratch/postcard_chunk.js', 'utf8');

// Find function containing pc-frame
let idx = code.indexOf('pc-frame');
while (idx !== -1) {
  console.log('--- FOUND pc-frame at', idx);
  console.log(code.substring(Math.max(0, idx - 200), idx + 600));
  idx = code.indexOf('pc-frame', idx + 1);
}
