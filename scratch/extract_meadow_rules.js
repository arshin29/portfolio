const fs = require('fs');
const css = fs.readFileSync('scratch/all-thoufik.css', 'utf8');

const classNames = [
  'meadow-footer',
  'meadow-contact-layout',
  'meadow-closing',
  'meadow-connect',
  'meadow-contact',
  'meadow-socials',
  'meadow-label',
  'meadow-paper-reveal',
  'sky-paper-contact',
  'sky-contact-note',
  'sky-note-content',
  'sky-note-close',
  'sky-note-field',
  'sky-note-tape',
  'sky-note-error',
  'sky-note-honeypot',
  'meadow-credit'
];

let extracted = [];
classNames.forEach(cls => {
  let idx = 0;
  while ((idx = css.indexOf(cls, idx)) !== -1) {
    const start = Math.max(0, css.lastIndexOf('}', idx) + 1);
    const end = css.indexOf('}', idx);
    if (end !== -1) {
      const rule = css.substring(start, end + 1).trim();
      if (!extracted.includes(rule)) {
        extracted.push(rule);
      }
      idx = end + 1;
    } else {
      break;
    }
  }
});

fs.writeFileSync('scratch/exact_meadow_rules.css', extracted.join('\n\n'));
console.log('Saved', extracted.length, 'rules to scratch/exact_meadow_rules.css');
