const fs = require('fs');
const src = fs.readFileSync('scratch/postcard_chunk.js', 'utf8');
const matches = src.match(/[\/\w-]+\.(jpg|jpeg|png|webp|avif)/gi) || [];
const unique = Array.from(new Set(matches));
console.log('Images in postcard_chunk.js:', unique.filter(u => u.includes('project') || u.includes('zyephr') || u.includes('airtribe') || u.includes('cover') || u.includes('shot')));
