const fs = require('fs');
const code = fs.readFileSync('scratch/postcard_chunk.js', 'utf8');

// remember at index 959:
// import { a as we, c as Te, d as Ee, f as De, i as Oe, l as ke, n as Ae, o as je, r as Me, s as Ne, t as Pe, u as Fe } from "./style-Eyv2w6QB.js";
// So Ee is `d` from style-Eyv2w6QB.js!
const styleCode = fs.readFileSync('thoufik_style.js', 'utf8');
const p = styleCode.indexOf('export{');
console.log('style exports:', styleCode.slice(p));
