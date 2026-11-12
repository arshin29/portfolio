const fs = require('fs');
const three = fs.readFileSync('src/components/meadow/three.module.js', 'utf8');

const needed = ['Ft', 'Pt', 'Qt', 'W', 'bt', 'en', 'et', 'g', 'mt', 'n', 'rn'];
const found = {};
needed.forEach(k => {
  const p = three.indexOf('as ' + k + ',');
  const p2 = three.indexOf('as ' + k + '}');
  found[k] = (p !== -1 || p2 !== -1);
});
console.log('Three exports found:', found);

const ambient = fs.readFileSync('src/components/meadow/ambient-dynamics.js', 'utf8');
const ambientNeeded = ['a', 'n', 'o', 'r'];
const ambientFound = {};
ambientNeeded.forEach(k => {
  const p = ambient.indexOf('as ' + k + ',');
  const p2 = ambient.indexOf('as ' + k + '}');
  ambientFound[k] = (p !== -1 || p2 !== -1);
});
console.log('Ambient exports found:', ambientFound);
