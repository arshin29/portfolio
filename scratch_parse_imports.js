const fs = require('fs');

const mainJs = fs.readFileSync('thoufik_main.js', 'utf8');

const threeImports = {};
const matchThree = mainJs.match(/import\{([^}]+)\}from"\.\/three\.module-i9PMC45e\.js"/);
if (matchThree) {
  matchThree[1].split(',').forEach(item => {
    const parts = item.trim().split(/\s+as\s+/);
    if (parts.length === 2) {
      threeImports[parts[1]] = parts[0];
    }
  });
}
console.log('Three imports mapped:', Object.keys(threeImports).length);

const matchAmbient = mainJs.match(/import\{([^}]+)\}from"\.\/ambient-dynamics-Cdbg4ktG\.js"/);
if (matchAmbient) {
  console.log('Ambient imports:', matchAmbient[1]);
}

const matchActivity = mainJs.match(/import\{([^}]+)\}from"\.\/activity-DuowrmOI\.js"/);
if (matchActivity) {
  console.log('Activity imports:', matchActivity[1]);
}
