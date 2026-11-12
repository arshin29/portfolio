const fs = require('fs');
const sharp = require('sharp');

const { ICONS } = require('./test_badges_refined.js');

function renderBadgeLight(name, iconSvg) {
  return `
    <g class="badge">
      <rect width="92" height="26" rx="8" fill="rgba(255, 255, 255, 0.5)" stroke="rgba(255, 255, 255, 0.65)" stroke-width="1"/>
      <g transform="translate(6, 5.5)">${iconSvg}</g>
      <text x="27" y="17.5" fill="#162332" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="500">${name}</text>
    </g>
  `;
}

// Light sky gradient background like 9:15 AM
const testLightCanvas = `
<svg xmlns="http://www.w3.org/2000/svg" width="720" height="80" viewBox="0 0 720 80">
  <defs>
    <linearGradient id="sky_grad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#73a9dc"/>
      <stop offset="100%" stop-color="#b8d5f0"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#sky_grad)"/>
  <g transform="translate(15, 26)">
    <g transform="translate(0, 0)">${renderBadgeLight('React', ICONS.react)}</g>
    <g transform="translate(100, 0)">${renderBadgeLight('Next.js', ICONS.nextjs)}</g>
    <g transform="translate(202, 0)">${renderBadgeLight('TypeScript', ICONS.typescript)}</g>
    <g transform="translate(312, 0)">${renderBadgeLight('Node.js', ICONS.nodejs)}</g>
    <g transform="translate(414, 0)">${renderBadgeLight('NestJS', ICONS.nestjs)}</g>
    <g transform="translate(514, 0)">${renderBadgeLight('PostgreSQL', ICONS.postgresql)}</g>
    <g transform="translate(624, 0)">${renderBadgeLight('Figma', ICONS.figma)}</g>
  </g>
</svg>
`;

sharp(Buffer.from(testLightCanvas)).png().toFile('scratch/badges_light_preview.png').then(() => {
  console.log('Saved scratch/badges_light_preview.png');
}).catch(console.error);
