const fs = require('fs');
const js = fs.readFileSync('scratch/postcard_chunk.js', 'utf8');

const target = 'children:(0,J.jsx)(So,{size:18})';
const idx = js.indexOf(target);
console.log('Found icon usage at', idx);

// Search for definition of So or import of So
const idxSo = js.indexOf('So=');
if (idxSo !== -1) {
  console.log(js.substring(idxSo, idxSo + 200));
} else {
  console.log('Searching import of So');
  const importIdx = js.indexOf('So');
  console.log(js.substring(0, 1000));
}
