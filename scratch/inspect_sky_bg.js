const fs = require('fs');

const css = fs.readFileSync('scratch/all-thoufik.css', 'utf8');
const lines = css.split('\n');
console.log('--- CSS Body / Sky rules ---');
lines.forEach((l, i) => {
  if (l.includes('body{') || l.includes('#root') || l.includes('--sky-top') || l.includes('sky-backdrop') || l.includes('sky-canvas') || l.includes('.stars') || l.includes('fireworks')) {
    console.log((i + 1) + ': ' + l.slice(0, 150));
  }
});

const code = fs.readFileSync('scratch/postcard_chunk.js', 'utf8');
console.log('--- Postcard Chunk Sky JSX ---');
const idx = code.indexOf('id="sky"');
if (idx !== -1) {
  console.log('Found id="sky":', code.slice(idx - 100, idx + 200));
}
const idx2 = code.indexOf('canvas');
let p = 0;
while ((p = code.indexOf('<canvas', p)) !== -1) {
  console.log('canvas tag at', p, code.slice(p, p + 100));
  p += 8;
}
