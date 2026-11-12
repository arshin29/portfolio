const fs = require('fs');
const css = fs.readFileSync('thoufik_main.css', 'utf8');

const p = css.indexOf('@media (width<=600px){.tk{aspect-ratio:auto}');
console.log(css.slice(p + 1200, p + 2500));
