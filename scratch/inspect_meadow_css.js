const fs = require('fs');
const css = fs.readFileSync('scratch/all-thoufik.css', 'utf8');

const patterns = [
  'meadow-footer',
  'meadow-contact-layout',
  'meadow-closing',
  'meadow-connect',
  'meadow-contact',
  'meadow-socials',
  'meadow-label',
  'sky-contact-panel',
  'meadow-paper-reveal',
  'meadow-spawn-stars',
  'gooey'
];

patterns.forEach(pat => {
  let idx = 0;
  console.log(`\n=================== SEARCH: ${pat} ===================`);
  while ((idx = css.indexOf(pat, idx)) !== -1) {
    const start = Math.max(0, css.lastIndexOf('}', idx) + 1);
    const end = css.indexOf('}', idx);
    if (end !== -1) {
      console.log(css.substring(start, end + 1).trim());
      idx = end + 1;
    } else {
      break;
    }
  }
});
