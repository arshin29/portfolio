const fs = require('fs');

const mainJs = fs.readFileSync('thoufik_main.js', 'utf8');
const contentJs = fs.readFileSync('thoufik_content.js', 'utf8');

console.log('--- 1. ROTATING TEXT SEARCH ---');
// Let's find phrases like "crafts with taste" or "thinks in systems" or animations
const textMatches = contentJs.match(/A product designer who [^<"'\n]+/g);
console.log('Subtitle matches:', textMatches);

// Search for rotating words array
const wordMatches = mainJs.match(/\["crafts[^\]]+"\]|\["thinks[^\]]+"\]/g);
console.log('Words array in main.js:', wordMatches);

// Search for rotating animation CSS or classes
const rotMatches = mainJs.match(/rotate|flipping|carousel|ticker|cycle/gi);
console.log('Rotate matches count:', rotMatches ? rotMatches.length : 0);

console.log('\n--- 2. BUTTON SEARCH ---');
const btnMatches = mainJs.match(/Let's talk[^]{0,300}/g);
console.log('Button matches in main.js:', btnMatches ? btnMatches.slice(0, 3) : null);

console.log('\n--- 3. GRASS / MEADOW SEARCH ---');
// Look for canvas, webgl, threejs, or shader code in main.js
const webglMatches = mainJs.match(/three|canvas|gl|grass|meadow/gi);
console.log('WebGL/Grass terms count in main.js:', webglMatches ? webglMatches.length : 0);
const grassInContent = contentJs.match(/grass[^]{0,300}/gi);
console.log('Grass in content.js:', grassInContent ? grassInContent.slice(0, 3) : null);

console.log('\n--- 4. NOTE / CONTACT SEARCH ---');
const noteMatches = contentJs.match(/note[^]{0,300}/gi);
console.log('Note in content.js:', noteMatches ? noteMatches.slice(0, 3) : null);
