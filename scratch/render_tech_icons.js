const sharp = require('sharp');

const icons = {
  react: `
    <svg width="15" height="15" viewBox="-11.5 -10.23174 23 20.46348" fill="none">
      <circle cx="0" cy="0" r="2.05" fill="#61dafb"/>
      <g stroke="#61dafb" stroke-width="1" fill="none">
        <ellipse rx="11" ry="4.2"/>
        <ellipse rx="11" ry="4.2" transform="rotate(60)"/>
        <ellipse rx="11" ry="4.2" transform="rotate(120)"/>
      </g>
    </svg>
  `,
  nextjs: `
    <svg width="15" height="15" viewBox="0 0 180 180" fill="none">
      <mask id="mask0" mask-type="alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="180" height="180">
        <circle cx="90" cy="90" r="90" fill="black"/>
      </mask>
      <g mask="url(#mask0)">
        <circle cx="90" cy="90" r="90" fill="black"/>
        <path d="M149.508 157.52L69.142 54H54V125.97H66.1136V69.3836L139.999 164.845C143.333 162.614 146.509 160.165 149.508 157.52Z" fill="url(#next_grad)"/>
        <rect x="115" y="54" width="12" height="72" fill="white"/>
      </g>
      <defs>
        <linearGradient id="next_grad" x1="109" y1="116.5" x2="144.5" y2="160.5" gradientUnits="userSpaceOnUse">
          <stop stop-color="white"/>
          <stop offset="1" stop-color="white" stop-opacity="0"/>
        </linearGradient>
      </defs>
    </svg>
  `,
  typescript: `
    <svg width="15" height="15" viewBox="0 0 128 128">
      <rect width="128" height="128" rx="20" fill="#3178c6"/>
      <path d="M56.8 54.3v47.9c0 5.4-3.5 6.3-9.4 6.3-4.3 0-8.6-.6-12.7-1.8v-12.3c2.7.9 6.2 1.6 9.4 1.6 2.6 0 3.8-.5 3.8-2.6V54.3H32.6v-12h39.5v12H56.8z" fill="white" transform="translate(8, 0) scale(0.85)"/>
      <path d="M68.5 73.6c4.6-2.6 11.2-4.5 17.6-4.5 7.8 0 11.8 3.5 11.8 8.8 0 5-3.3 7.8-10.4 10.7-9.5 3.8-15.6 9.2-15.6 18.2 0 11.7 9.5 19.3 23.9 19.3 6.9 0 12.8-1.5 16.5-3.4v-12.4c-3.6 1.8-8.8 3.1-14.5 3.1-7.2 0-11-3.2-11-7.6 0-5.1 3.8-7.7 11.5-10.9 10.1-4.2 14.8-9.4 14.8-17.7 0-11.8-9.3-19.1-23.7-19.1-7 0-14.3 1.9-18.4 4.3l3.5 11.2z" fill="white" transform="translate(8, 0) scale(0.85)"/>
    </svg>
  `,
  nodejs: `
    <svg width="15" height="15" viewBox="0 0 32 32">
      <path d="M16 2.5L3.5 9.7v14.6L16 31.5l12.5-7.2V9.7L16 2.5z" fill="#539e43"/>
      <path d="M16 5.8l9.6 5.5v11.1L16 27.9l-9.6-5.5V11.3L16 5.8z" fill="#333333"/>
      <path d="M13.2 14.2c-.4-.2-1.3-.5-2.2-.5-1.9 0-3.1 1-3.1 2.6 0 1.5.9 2.3 2.6 2.8l.8.2c1.2.4 1.6.8 1.6 1.4 0 .8-.8 1.3-2 1.3-1.1 0-2.1-.4-2.7-.8l-.5 1.5c.8.5 1.9.8 3.1.8 2.2 0 3.6-1.1 3.6-2.8 0-1.4-.9-2.2-2.5-2.7l-.8-.2c-1.1-.3-1.7-.7-1.7-1.4 0-.7.7-1.2 1.8-1.2.9 0 1.7.3 2.2.6l.4-1.7zM18.8 13.9h-1.8v9.4h1.8v-9.4z" fill="#83cd29"/>
    </svg>
  `,
  nestjs: `
    <svg width="15" height="15" viewBox="0 0 256 256" fill="none">
      <path d="M128 0C57.308 0 0 57.308 0 128c0 70.692 57.308 128 128 128 70.692 0 128-57.308 128-128C256 57.308 198.692 0 128 0z" fill="#1b1d23"/>
      <path d="M208.5 86.8c-1.7-6.2-7.8-17.9-14.7-22.1-4.2-2.6-8.9-3.2-13.6-1.8-4.7 1.4-8.8 4.7-11.8 8.8l-18.2 24.8c-2.3 3.1-4.3 6.4-5.9 9.9l-11.2-23.4c-2.8-5.8-7.5-10.4-13.3-13-5.8-2.6-12.4-2.8-18.4-.7-9.5 3.4-16.7 11.6-19.4 21.6-1.5 5.5-1.4 11.3.3 16.7 1.7 5.4 4.9 10.2 9.2 13.8l43.8 37.1c3.1 2.6 7 4.1 11.1 4.1 4.1 0 8-1.5 11.1-4.1l43.8-37.1c4.3-3.6 7.5-8.4 9.2-13.8 1.7-5.4 1.8-11.2.3-16.7l-4.9-17.2z" fill="#e0234e"/>
    </svg>
  `,
  postgresql: `
    <svg width="15" height="15" viewBox="0 0 64 64" fill="none">
      <path d="M32 4C16.536 4 4 16.536 4 32s12.536 28 28 28 28-12.536 28-28S47.464 4 32 4z" fill="#336791"/>
      <path d="M44.5 25.5c-1-3-3.5-5.5-7-6.5-4-1-8.5 0-11.5 2.5-3 2.5-4.5 6.5-4.5 10.5 0 3 .5 6 1.5 8.5 1 2.5 3 4.5 5.5 5.5 2 .8 4.5.8 6.5 0 2-.8 3.5-2.2 4.5-4l3.5-6.5h-5.5l-2 4c-.5.8-1.2 1.2-2 1.2s-1.5-.4-2-1c-.5-.6-.8-1.5-.8-2.7 0-1.5.5-3 1.2-4.5.8-1.5 2-2.5 3.5-3.2 1.5-.7 3.2-.8 4.8-.4 1.5.4 2.8 1.4 3.5 2.8l2-3.8z" fill="#ffffff"/>
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

console.log('Rendering icons test...');
const combined = \`
<svg xmlns="http://www.w3.org/2000/svg" width="300" height="60" viewBox="0 0 300 60">
  <rect width="100%" height="100%" fill="#1a2333"/>
  <g transform="translate(15, 20)">\${icons.react}</g>
  <g transform="translate(50, 20)">\${icons.nextjs}</g>
  <g transform="translate(85, 20)">\${icons.typescript}</g>
  <g transform="translate(120, 20)">\${icons.nodejs}</g>
  <g transform="translate(155, 20)">\${icons.nestjs}</g>
  <g transform="translate(190, 20)">\${icons.postgresql}</g>
  <g transform="translate(225, 20)">\${icons.figma}</g>
</svg>
\`;

sharp(Buffer.from(combined)).png().toFile('scratch/tech_icons_test.png').then(() => {
  console.log('Saved scratch/tech_icons_test.png');
});
