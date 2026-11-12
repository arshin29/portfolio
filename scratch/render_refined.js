const sharp = require('sharp');

// Refined Option A:
// Perfect geometric proportions, subtle leg flare, rounded caps
const v16 = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="30 30 135 135" width="270" height="270">
  <rect width="100%" height="100%" fill="#0d1527"/>
  <defs>
    <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
      <stop stop-color="#e6f7ff"/>
      <stop offset="0.35" stop-color="#ffffff"/>
      <stop offset="0.68" stop-color="#c9a3e8"/>
      <stop offset="1" stop-color="#f6fbff"/>
    </linearGradient>
  </defs>
  <!-- Beautiful A arch -->
  <path
    d="M 55 140 C 60 126 72 96 92.5 52 C 94.5 47 100.5 47 102.5 52 C 123 96 135 126 140 140"
    fill="none"
    stroke="url(#grad)"
    stroke-width="5.39494"
    stroke-linecap="round"
    stroke-linejoin="round"
  />
  <!-- Looping capsule ribbon crossbar matching Thoufik's exact stroke & loop radius -->
  <path
    d="M 45 98 C 45 92.6 49.4 88.2 54.8 88.2 H 140.2 C 145.6 88.2 150 92.6 150 98 C 150 103.4 145.6 107.8 140.2 107.8 H 54.8 C 49.4 107.8 45 103.4 45 98 Z"
    fill="none"
    stroke="url(#grad)"
    stroke-width="5.39494"
    stroke-linecap="round"
    stroke-linejoin="round"
  />
</svg>
`;

// Refined Option B: Single continuous ribbon "A" (unbroken loop!)
// Notice Thoufik's logo:
// A single continuous line that doesn't cross over in 2 disconnected objects, but connects!
// What if the arch connects to the capsule?
// Trace:
// Start bottom left (55, 140) -> up to apex (97.5, 48) -> down right leg to crossbar (118, 88.2) ->
// turn right along top of capsule to (140.2, 88.2) -> loop around right end to (150, 98) -> (140.2, 107.8) ->
// across bottom of capsule to (54.8, 107.8) -> loop around left end to (45, 98) -> (54.8, 88.2) ->
// across to right leg intersection -> then right leg continues down to (140, 140)!
// That is ONE SINGLE continuous line path that draws BOTH the arch AND the loop!
const v17 = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="30 30 135 135" width="270" height="270">
  <rect width="100%" height="100%" fill="#0d1527"/>
  <defs>
    <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
      <stop stop-color="#e6f7ff"/>
      <stop offset="0.35" stop-color="#ffffff"/>
      <stop offset="0.68" stop-color="#c9a3e8"/>
      <stop offset="1" stop-color="#f6fbff"/>
    </linearGradient>
  </defs>
  <!-- Single unbroken continuous ribbon path -->
  <path
    d="M 55 140 C 60 126 72 96 92.5 52 C 94.5 47 100.5 47 102.5 52 C 111.5 71.5 119.5 90 126 107.8 H 54.8 C 49.4 107.8 45 103.4 45 98 C 45 92.6 49.4 88.2 54.8 88.2 H 140.2 C 145.6 88.2 150 92.6 150 98 C 150 103.4 145.6 107.8 140.2 107.8 L 140 140"
    fill="none"
    stroke="url(#grad)"
    stroke-width="5.39494"
    stroke-linecap="round"
    stroke-linejoin="round"
  />
</svg>
`;

// Refined Option C:
// In Option A (v16), having the arch and the capsule is SO clean and pristine!
// Let's also check if adding rounded feet to the bottom of the arch (subtle inward or outward curl) looks even more high-end:
const v18 = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="30 30 135 135" width="270" height="270">
  <rect width="100%" height="100%" fill="#0d1527"/>
  <defs>
    <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
      <stop stop-color="#e6f7ff"/>
      <stop offset="0.35" stop-color="#ffffff"/>
      <stop offset="0.68" stop-color="#c9a3e8"/>
      <stop offset="1" stop-color="#f6fbff"/>
    </linearGradient>
  </defs>
  <path
    d="M 52 140 C 58 140 62 134 66 122 L 93 52 C 95 47 100 47 102 52 L 129 122 C 133 134 137 140 143 140"
    fill="none"
    stroke="url(#grad)"
    stroke-width="5.39494"
    stroke-linecap="round"
    stroke-linejoin="round"
  />
  <path
    d="M 45 97 C 45 91.6 49.4 87.2 54.8 87.2 H 140.2 C 145.6 87.2 150 91.6 150 97 C 150 102.4 145.6 106.8 140.2 106.8 H 54.8 C 49.4 106.8 45 102.4 45 97 Z"
    fill="none"
    stroke="url(#grad)"
    stroke-width="5.39494"
    stroke-linecap="round"
    stroke-linejoin="round"
  />
</svg>
`;

Promise.all([
  sharp(Buffer.from(v16)).png().toFile('scratch/logo_v16.png'),
  sharp(Buffer.from(v17)).png().toFile('scratch/logo_v17.png'),
  sharp(Buffer.from(v18)).png().toFile('scratch/logo_v18.png'),
]).then(() => {
  console.log('v16, v17, v18 rendered');
});
