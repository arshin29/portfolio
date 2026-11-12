const fs = require('fs');
const js = fs.readFileSync('thoufik_main.js', 'utf8');

const p = js.indexOf('function Qp(') !== -1 ? js.indexOf('function Qp(') : js.indexOf('var Qp=');
console.log('Qp index:', p);
if (p !== -1) {
  console.log(js.slice(p, p + 800));
}

const p2 = js.indexOf('Zp=');
console.log('Zp= index:', p2);
if (p2 !== -1) {
  console.log(js.slice(p2 - 50, p2 + 200));
}
