const fs = require('fs');
const js = fs.readFileSync('thoufik_main.js', 'utf8');

const p = js.indexOf('function $p(') !== -1 ? js.indexOf('function $p(') : js.indexOf('var $p=');
console.log('$p index in main.js:', p);
if (p !== -1) {
  console.log(js.slice(p, p + 1000));
} else {
  const m = js.match(/(?:function|var|let|const)\s+\$p[=\(]/);
  if (m) {
    console.log('Regex found $p:');
    console.log(js.slice(m.index, m.index + 1000));
  }
}
