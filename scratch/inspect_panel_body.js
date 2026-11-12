const fs = require('fs');
const code = fs.readFileSync('src/components/InteractiveSkyWidget.tsx', 'utf8');

const lines = code.split('\n');
console.log(lines.slice(520, 680).join('\n'));
