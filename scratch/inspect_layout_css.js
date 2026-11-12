const fs = require('fs');
const css = fs.readFileSync('scratch/all-thoufik.css', 'utf8');

function printAll(name) {
  let idx = 0;
  console.log(`=== ${name} ===`);
  while ((idx = css.indexOf(name, idx)) !== -1) {
    const start = Math.max(0, css.lastIndexOf('}', idx) + 1);
    const end = css.indexOf('}', idx);
    console.log(css.substring(start, end + 1).trim());
    idx = end + 1;
  }
}

printAll('.meadow-paper-reveal');
printAll('.meadow-contact-layout');
