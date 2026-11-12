const fs = require('fs');
const sharp = require('sharp');

// Highly refined, pixel-precise SVGs
const ICONS = {
  react: `
    <svg width="15" height="15" viewBox="-11.5 -10.23174 23 20.46348">
      <circle cx="0" cy="0" r="2.05" fill="#61dafb"/>
      <g stroke="#61dafb" stroke-width="1.1" fill="none">
        <ellipse rx="11" ry="4.2"/>
        <ellipse rx="11" ry="4.2" transform="rotate(60)"/>
        <ellipse rx="11" ry="4.2" transform="rotate(120)"/>
      </g>
    </svg>
  `,
  nextjs: `
    <svg width="15" height="15" viewBox="0 0 180 180" fill="none">
      <circle cx="90" cy="90" r="90" fill="#000000" stroke="rgba(255,255,255,0.2)" stroke-width="4"/>
      <path d="M149.5 157.5L69.1 54H54v72h12.1V69.4l73.9 95.4c3.3-2.2 6.5-4.7 9.5-7.3z" fill="url(#next_g)"/>
      <rect x="115" y="54" width="12" height="72" fill="#ffffff"/>
      <defs>
        <linearGradient id="next_g" x1="109" y1="116.5" x2="144.5" y2="160.5" gradientUnits="userSpaceOnUse">
          <stop stop-color="#ffffff"/>
          <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
        </linearGradient>
      </defs>
    </svg>
  `,
  typescript: `
    <svg width="15" height="15" viewBox="0 0 100 100">
      <rect width="100" height="100" rx="16" fill="#3178c6"/>
      <path d="M43 38H21v9h6.8v37h9.5V47H43V38zm39.7 15.3c-2.3-1.6-5.8-2.8-9.8-2.8-5.7 0-9.2 2.6-9.2 6.7 0 3.7 2.8 5.7 8.3 7.6 7.4 2.6 11.5 6.1 11.5 12.3 0 7.8-6.6 13.3-16.7 13.3-5.2 0-9.8-1.2-12.8-2.7l2.2-8.3c2.7 1.4 6.7 2.4 10.6 2.4 4.8 0 7.4-2.1 7.4-5.1 0-3.4-2.7-5.1-8.5-7.1-7.1-2.5-11.2-6.1-11.2-12.4 0-7.7 6.3-13.1 15.8-13.1 4.7 0 8.6.9 11.3 2l-2.4 7.2z" fill="#ffffff"/>
    </svg>
  `,
  nodejs: `
    <svg width="15" height="15" viewBox="0 0 256 256">
      <path d="M128 6.5L16.5 70.9v128.6L128 263.8l111.5-64.3V70.9L128 6.5z" fill="#539e43"/>
      <path d="M128 32l89.2 51.5v103L128 238l-89.2-51.5v-103L128 32z" fill="#182318"/>
      <path d="M108 116c-3-1.5-9-3.5-15-3.5-13 0-21 7-21 17.5 0 10.5 6 15.5 17.5 19l5.5 1.5c8 2.5 11 5.5 11 9.5 0 5.5-5.5 9-13.5 9-7.5 0-14-2.5-18.5-5.5l-3.5 10c5.5 3.5 13 5.5 21 5.5 15 0 24.5-7.5 24.5-19 0-9.5-6-15-17-18.5l-5.5-1.5c-7.5-2-11.5-5-11.5-9.5 0-5 5-8 12.5-8 6 0 11.5 2 15 4l4-10.5zm38-2h-12v64h12v-64z" fill="#83cd29"/>
    </svg>
  `,
  nestjs: `
    <svg width="15" height="15" viewBox="0 0 256 256" fill="none">
      <rect width="256" height="256" rx="54" fill="#1b1c24"/>
      <path d="M216.5 86.8c-1.7-6.2-7.8-17.9-14.7-22.1-4.2-2.6-8.9-3.2-13.6-1.8-4.7 1.4-8.8 4.7-11.8 8.8l-18.2 24.8c-2.3 3.1-4.3 6.4-5.9 9.9l-11.2-23.4c-2.8-5.8-7.5-10.4-13.3-13-5.8-2.6-12.4-2.8-18.4-.7-9.5 3.4-16.7 11.6-19.4 21.6-1.5 5.5-1.4 11.3.3 16.7 1.7 5.4 4.9 10.2 9.2 13.8l43.8 37.1c3.1 2.6 7 4.1 11.1 4.1 4.1 0 8-1.5 11.1-4.1l43.8-37.1c4.3-3.6 7.5-8.4 9.2-13.8 1.7-5.4 1.8-11.2.3-16.7l-4.9-17.2z" fill="#ea2845"/>
    </svg>
  `,
  postgresql: `
    <svg width="15" height="15" viewBox="0 0 64 64" fill="none">
      <rect width="64" height="64" rx="14" fill="#336791"/>
      <path d="M47.7 28.2c-.4-4.8-3.4-8.8-7.9-10.5-5.9-2.2-12.8-.7-17 3.9-3.5 3.8-5 9.1-4.1 14.1.7 4 3 7.5 6.3 9.8l-1.3 7.2c-.3 1.8.6 3.6 2.2 4.5 1.6.9 3.6.7 4.9-.5l5.5-5c2.5.7 5.1 1 7.7.8 7.3-.4 14.1-4.4 17.5-10.9 2.5-4.8 2.6-10.5.4-15.4l-4.2 2z" fill="#ffffff"/>
      <circle cx="39" cy="30" r="2.8" fill="#336791"/>
      <path d="M29 49c-1.8 2.5-4.7 4.2-7.8 4.6" stroke="#336791" stroke-width="2.5" stroke-linecap="round"/>
    </svg>
  `,
  figma: `
    <svg width="15" height="15" viewBox="0 0 38 57" fill="none">
      <path d="M19 28.5C19 23.2533 23.2533 19 28.5 19C33.7467 19 38 23.2533 38 28.5C38 33.7467 33.7467 38 28.5 38C23.2533 38 19 33.7467 19 28.5Z" fill="#1ABCFE"/>
      <path d="M0 47.5C0 42.2533 4.25329 38 9.5 38H19V47.5C19 52.7467 14.7467 57 9.5 57C4.25329 57 0 52.7467 0 47.5Z" fill="#0ACF83"/>
      <path d="M19 0V19H28.5C33.7467 19 38 14.7467 38 9.5C38 4.25329 33.7467 0 28.5 0H19Z" fill="#FF7262"/>
      <path d="M0 9.5C0 14.7467 4.25329 19 9.5 19H19V0H9.5C4.25329 0 0 4.25329 0 9.5Z" fill="#F24E1E"/>
      <path d="M0 28.5C0 33.7467 4.25329 38 9.5 38H19V19H9.5C4.25329 19 0 23.2533 0 28.5Z" fill="#A259FF"/>
    </svg>
  `
};

function renderBadge(name, iconSvg) {
  return `
    <g class="badge">
      <rect width="92" height="26" rx="8" fill="rgba(255, 255, 255, 0.16)" stroke="rgba(255, 255, 255, 0.22)" stroke-width="1"/>
      <g transform="translate(6, 5.5)">${iconSvg}</g>
      <text x="27" y="17.5" fill="#f6f8fd" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="500">${name}</text>
    </g>
  `;
}

const testCanvas = `
<svg xmlns="http://www.w3.org/2000/svg" width="720" height="80" viewBox="0 0 720 80">
  <rect width="100%" height="100%" fill="#141c2b"/>
  <g transform="translate(15, 26)">
    <g transform="translate(0, 0)">${renderBadge('React', ICONS.react)}</g>
    <g transform="translate(100, 0)">${renderBadge('Next.js', ICONS.nextjs)}</g>
    <g transform="translate(202, 0)">${renderBadge('TypeScript', ICONS.typescript)}</g>
    <g transform="translate(312, 0)">${renderBadge('Node.js', ICONS.nodejs)}</g>
    <g transform="translate(414, 0)">${renderBadge('NestJS', ICONS.nestjs)}</g>
    <g transform="translate(514, 0)">${renderBadge('PostgreSQL', ICONS.postgresql)}</g>
    <g transform="translate(624, 0)">${renderBadge('Figma', ICONS.figma)}</g>
  </g>
</svg>
`;

sharp(Buffer.from(testCanvas)).png().toFile('scratch/badges_refined.png').then(() => {
  console.log('Saved scratch/badges_refined.png');
}).catch(console.error);

module.exports = { ICONS };