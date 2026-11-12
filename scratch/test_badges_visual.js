const fs = require('fs');
const sharp = require('sharp');

// Canonical brand SVGs (16x16 or 15x15)
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
    <svg width="15" height="15" viewBox="0 0 128 128">
      <rect width="128" height="128" rx="20" fill="#3178c6"/>
      <path d="M57 54v48c0 5.4-3.5 6.3-9.4 6.3-4.3 0-8.6-.6-12.7-1.8V94.2c2.7.9 6.2 1.6 9.4 1.6 2.6 0 3.8-.5 3.8-2.6V54H33V42h39v12H57z" fill="#ffffff"/>
      <path d="M69 73.6c4.6-2.6 11.2-4.5 17.6-4.5 7.8 0 11.8 3.5 11.8 8.8 0 5-3.3 7.8-10.4 10.7-9.5 3.8-15.6 9.2-15.6 18.2 0 11.7 9.5 19.3 23.9 19.3 6.9 0 12.8-1.5 16.5-3.4v-12.4c-3.6 1.8-8.8 3.1-14.5 3.1-7.2 0-11-3.2-11-7.6 0-5.1 3.8-7.7 11.5-10.9 10.1-4.2 14.8-9.4 14.8-17.7 0-11.8-9.3-19.1-23.7-19.1-7 0-14.3 1.9-18.4 4.3l3.5 11.2z" fill="#ffffff"/>
    </svg>
  `,
  nodejs: `
    <svg width="15" height="15" viewBox="0 0 32 32">
      <path d="M16 2.5L3.5 9.7v14.6L16 31.5l12.5-7.2V9.7L16 2.5z" fill="#539e43"/>
      <path d="M16 6.5l8.5 4.9v9.8L16 26.1l-8.5-4.9V11.4L16 6.5z" fill="#1b251b"/>
      <path d="M13.2 13.8c-.4-.2-1.3-.5-2.2-.5-1.9 0-3.1 1-3.1 2.6 0 1.5.9 2.3 2.6 2.8l.8.2c1.2.4 1.6.8 1.6 1.4 0 .8-.8 1.3-2 1.3-1.1 0-2.1-.4-2.7-.8l-.5 1.5c.8.5 1.9.8 3.1.8 2.2 0 3.6-1.1 3.6-2.8 0-1.4-.9-2.2-2.5-2.7l-.8-.2c-1.1-.3-1.7-.7-1.7-1.4 0-.7.7-1.2 1.8-1.2.9 0 1.7.3 2.2.6l.4-1.7zM18.8 13.5h-1.8v9.8h1.8v-9.8z" fill="#83cd29"/>
    </svg>
  `,
  nestjs: `
    <svg width="15" height="15" viewBox="0 0 256 256" fill="none">
      <rect width="256" height="256" rx="54" fill="#1e1822"/>
      <path d="M216 87c-2.4-8.8-11-25.4-20.9-31.3-6-3.7-12.6-4.5-19.3-2.6-6.7 2-12.5 6.7-16.7 12.5l-25.8 35.2c-3.3 4.4-6.1 9.1-8.4 14l-15.9-33.2c-4-8.2-10.6-14.8-18.9-18.5-8.2-3.7-17.6-4-26.1-1-13.5 4.8-23.7 16.5-27.5 30.6-2.1 7.8-2 16 .4 23.7 2.4 7.7 7 14.5 13.1 19.6l62.1 52.6c4.4 3.7 9.9 5.8 15.7 5.8 5.8 0 11.3-2.1 15.7-5.8l62.1-52.6c6.1-5.1 10.6-11.9 13.1-19.6 2.4-7.7 2.6-15.9.5-23.7L216 87z" fill="#ea2845"/>
    </svg>
  `,
  postgresql: `
    <svg width="15" height="15" viewBox="0 0 128 128" fill="none">
      <rect width="128" height="128" rx="26" fill="#336791"/>
      <path d="M96 52c-1.5-11-9.5-19-20.5-21-14-2.5-28.5 3.5-35 15-4 7-5 15-3 23 1.8 7.5 6.5 14 13 18l-2.5 12c-.6 3 .8 6 3.5 7.5s6 1.3 8.5-.8l8.5-7.5c4 1.2 8 1.8 12 1.6 12-.4 23-7 28.5-17.5 5.5-9.5 5.8-21.5.5-31.5z" fill="#ffffff" fill-opacity="0.95"/>
      <circle cx="78" cy="54" r="4.5" fill="#336791"/>
      <path d="M60 84c-3 4-8 7-13 7" stroke="#336791" stroke-width="4" stroke-linecap="round"/>
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
      <rect width="90" height="26" rx="8" fill="rgba(255, 255, 255, 0.16)" stroke="rgba(255, 255, 255, 0.22)" stroke-width="1"/>
      <g transform="translate(6, 5.5)">${iconSvg}</g>
      <text x="27" y="17.5" fill="#f6f8fd" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="500">${name}</text>
    </g>
  `;
}

console.log('Rendering visual badges test...');
const testCanvas = `
<svg xmlns="http://www.w3.org/2000/svg" width="700" height="160" viewBox="0 0 700 160">
  <rect width="100%" height="100%" fill="#141c2b"/>
  <g transform="translate(20, 20)">
    <g transform="translate(0, 0)">${renderBadge('React', ICONS.react)}</g>
    <g transform="translate(98, 0)">${renderBadge('Next.js', ICONS.nextjs)}</g>
    <g transform="translate(196, 0)">${renderBadge('TypeScript', ICONS.typescript)}</g>
    <g transform="translate(300, 0)">${renderBadge('Node.js', ICONS.nodejs)}</g>
    <g transform="translate(400, 0)">${renderBadge('NestJS', ICONS.nestjs)}</g>
    <g transform="translate(498, 0)">${renderBadge('PostgreSQL', ICONS.postgresql)}</g>
    <g transform="translate(605, 0)">${renderBadge('Figma', ICONS.figma)}</g>
  </g>
</svg>
`;

sharp(Buffer.from(testCanvas)).png().toFile('scratch/badges_sample.png').then(() => {
  console.log('Saved scratch/badges_sample.png');
}).catch(console.error);
