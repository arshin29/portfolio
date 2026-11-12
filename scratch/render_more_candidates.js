const sharp = require('sharp');

// Let's create an "A" that shares Thoufik's EXACT design grammar:
// 1. Parallel ribbon lines
// 2. Semicircular / 180-deg rounded caps
// 3. Smooth continuous flow

// Let's create a single closed or continuous ribbon path for "A":
// Start at bottom of left leg: (70, 142)
// Curve up to apex: (97.5, 52)
// Descend right leg: (125, 142)
// With a capsule loop across: (50, 96) to (145, 96)
// And a top capsule loop or flourish!

const candidate6 = `
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
  <!-- Beautiful continuous ribbon 'A':
       Left leg rises, forms apex loop, descends to right foot,
       loops inward into a horizontal capsule crossbar with rounded ends,
       and ties into the left leg. -->
  <path
    d="M 68 140 L 92 60 C 94 52 101 52 103 60 L 127 140 M 46 102 C 46 94 53 88 61 88 H 134 C 142 88 149 94 149 102 C 149 110 142 116 134 116 H 61 C 53 116 46 110 46 102 Z"
    fill="none"
    stroke="url(#grad)"
    stroke-width="5.4"
    stroke-linecap="round"
    stroke-linejoin="round"
  />
</svg>
`;

// Candidate 7: A single UNBROKEN continuous stroke (one M command) that forms 'A':
// Starts at left foot (62, 140) -> goes up to apex (97.5, 48) -> rounds down to right foot (133, 140) ->
// curves up into right crossbar (144, 98) -> sweeps across to left crossbar (51, 98) ->
// loops into a rounded capsule loop (51, 108) -> sweeps back across to (120, 108)
const candidate7 = `
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
    d="M 58 140 L 93 50 C 95 44 100 44 102 50 L 137 140 C 139 146 148 142 147 136 L 140 102 C 139 96 134 92 127 92 H 68 C 60 92 54 98 54 106 C 54 114 60 120 68 120 H 126 C 133 120 138 116 138 110"
    fill="none"
    stroke="url(#grad)"
    stroke-width="5.4"
    stroke-linecap="round"
    stroke-linejoin="round"
  />
</svg>
`;

// Candidate 8: Ribbon Monogram 'A' with Thoufik-identical looping DNA
// Notice Thoufik's logo has two horizontal loop wings on a vertical backbone.
// For 'A', we have a left diagonal and right diagonal that meet at a rounded apex,
// with a horizontal loop wing in the center that creates an unmistakable 'A' and ribbon loop!
const candidate8 = `
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
  <!-- Outer Arch of A -->
  <path
    d="M 56 142 L 91.5 52 C 94 45 101 45 103.5 52 L 139 142"
    fill="none"
    stroke="url(#grad)"
    stroke-width="5.4"
    stroke-linecap="round"
    stroke-linejoin="round"
  />
  <!-- Looping Ribbon Crossbar extending outward with rounded pill ends -->
  <path
    d="M 45 100 C 45 92 52 86 61 86 H 134 C 143 86 150 92 150 100 C 150 108 143 114 134 114 H 61 C 52 114 45 108 45 100 Z"
    fill="none"
    stroke="url(#grad)"
    stroke-width="5.4"
    stroke-linecap="round"
    stroke-linejoin="round"
  />
</svg>
`;

// Candidate 9: Unified Single Path "A" where the crossbar loop and legs are one continuous closed ribbon:
// Trace:
// Bottom left (62, 142) -> up to apex (97.5, 48) -> down right leg to crossbar intersection (119, 93) ->
// loops right (145, 93) -> curves down to (145, 111) -> loops across left to (50, 111) ->
// curves up to (50, 93) -> loops to right to (76, 93) -> down left leg to (62, 142) ->
// wait, and right leg bottom (133, 142)
// Or a ribbon that forms the outline of an 'A'!

Promise.all([
  sharp(Buffer.from(candidate6)).png().toFile('scratch/logo_a6.png'),
  sharp(Buffer.from(candidate7)).png().toFile('scratch/logo_a7.png'),
  sharp(Buffer.from(candidate8)).png().toFile('scratch/logo_a8.png'),
]).then(() => {
  console.log('Candidates 6, 7, 8 rendered successfully');
});
