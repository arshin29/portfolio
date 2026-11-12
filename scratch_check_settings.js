const fs = require('fs');

const js = fs.readFileSync('thoufik_main.js', 'utf8');

// Find function Ed(
const idx = js.indexOf('function Ed(');
console.log('function Ed index:', idx);
if (idx !== -1) {
  console.log(js.slice(idx, idx + 800));
}

// Find function Dd(
const idx2 = js.indexOf('function Dd(');
console.log('function Dd index:', idx2);
if (idx2 !== -1) {
  console.log(js.slice(idx2, idx2 + 800));
}
