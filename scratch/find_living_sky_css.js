const fs = require('fs');
const css = fs.readFileSync('scratch/all-thoufik.css', 'utf8');

const p = css.indexOf('.living-sky');
console.log('living-sky at:', p);
if (p !== -1) {
  console.log(css.slice(p - 50, p + 500));
}
