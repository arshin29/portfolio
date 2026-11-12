const fs = require('fs');
const css = fs.readFileSync('scratch/all-thoufik.css', 'utf8');

const patterns = [
  'sky-paper-contact',
  'sky-contact-note',
  'sky-note-content',
  'sky-note-close',
  'sky-note-field',
  'sky-note-tape',
  'sky-note-error',
  'sky-note-honeypot',
  'meadow-label-connect',
  'meadow-label-note',
  'meadow-contact-icons'
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
