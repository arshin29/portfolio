const fs = require('fs');
const css = fs.readFileSync('scratch/all-thoufik.css', 'utf8');

const classes = [
  '.sky-extra-options',
  '.sky-weather-options',
  '.sky-segments',
  '.sky-motion-row',
  '.sky-motion-switch',
  '.sky-volume-control',
  '.sky-volume-slider'
];

classes.forEach(cls => {
  const p = css.indexOf(cls);
  console.log(cls, 'at:', p);
  if (p !== -1) {
    console.log(css.slice(p, p + 300));
    console.log('---');
  }
});
