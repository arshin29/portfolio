const fs = require('fs');

const html = fs.readFileSync('thoufik_dump.html', 'utf8');
const mainCss = fs.readFileSync('thoufik_main.css', 'utf8');

console.log('HTML length:', html.length);
console.log('Main CSS length:', mainCss.length);

// 1. Search for intro subtitle in HTML
const heroSection = html.slice(0, 2500);
console.log('--- Hero in HTML ---');
console.log(heroSection);

// 2. Search for grass/meadow in HTML
const grassIndex = html.indexOf('grass');
console.log('\n--- Grass in HTML ---');
if (grassIndex !== -1) {
  console.log(html.slice(Math.max(0, grassIndex - 200), grassIndex + 400));
} else {
  console.log('No "grass" in HTML');
}
