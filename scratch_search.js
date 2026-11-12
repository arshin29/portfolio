const fs = require('fs');
const css = fs.readFileSync('thoufik_style.css', 'utf8');

const p = css.indexOf('.sky-timeline-item{grid-template-columns:');
console.log('mobile timeline index:', p);
if (p !== -1) {
  console.log(css.slice(p - 100, p + 800));
}
