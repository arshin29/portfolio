const fs = require('fs');
const code = fs.readFileSync('thoufik_style.js', 'utf8');

// find function c
const regex = /(?:function\s+c\b|(?:var|let|const)\s+c\b)/g;
let m;
while ((m = regex.exec(code)) !== null) {
  console.log('Match at', m.index, code.slice(m.index, m.index + 200));
}
