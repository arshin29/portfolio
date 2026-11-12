const fs = require('fs');
const code = fs.readFileSync('thoufik_main.js', 'utf8');
const regex = /from\s*['"]([^'"]+)['"]/g;
let m;
while ((m = regex.exec(code.slice(0, 4000))) !== null) {
  const start = code.lastIndexOf('import', m.index);
  console.log(code.slice(start, m.index + m[0].length));
}
