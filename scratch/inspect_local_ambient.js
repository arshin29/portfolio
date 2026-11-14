const fs = require('fs');
const code = fs.readFileSync('src/components/meadow/ambient-dynamics.js', 'utf8');
console.log('ambient-dynamics.js exports and functions:');
console.log(code);
