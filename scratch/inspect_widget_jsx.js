const fs = require('fs');
const code = fs.readFileSync('src/components/InteractiveSkyWidget.tsx', 'utf8');

// print lines 410 to 520
const lines = code.split('\n');
console.log(lines.slice(405, 520).join('\n'));
