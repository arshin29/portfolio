const sharp = require('sharp');
const fs = require('fs');

// We test candidate ribbon monograms for "A" (Arshin)

// Candidate 1: Sleek Geometric Ribbon "A"
// Clean arch with rounded apex and horizontal looping crossbar
const a1 = `
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
    d="M 52 142 L 87 54 C 91 44 104 44 108 54 L 143 142 M 65 110 C 65 110 97.5 110 130 110"
    fill="none"
    stroke="url(#grad)"
    stroke-width="5.8"
    stroke-linecap="round"
    stroke-linejoin="round"
  />
</svg>
`;

// Candidate 2: Continuous Tubular Loop "A" (Single unbroken path with ribbon aesthetic)
// Left leg -> Apex loop -> Right leg -> Inward loop forming crossbar -> Left loop
const a2 = `
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
  <!-- Unbroken continuous ribbon forming 'A' with looping crossbar and feet -->
  <path
    d="M 56 142 C 48 142 44 134 49 124 L 88 50 C 92 42 103 42 107 50 L 146 124 C 151 134 147 142 139 142 C 131 142 126 136 122 127 L 110 102 H 85 L 73 127 C 69 136 64 142 56 142 Z M 89 85 H 106 L 97.5 64 Z"
    fill="none"
    stroke="url(#grad)"
    stroke-width="5.5"
    stroke-linecap="round"
    stroke-linejoin="round"
  />
</svg>
`;

// Candidate 3: Flowing Ribbon Monogram "A" - Like Thoufik's ribbon aesthetic with horizontal loops
// An elegant vertical/curved spine with a top loop and sweeping horizontal ribbon crossbar forming an 'A'
const a3 = `
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
  <!-- Stylized continuous line: Left arch up to loop apex, descends, loops through crossbar extending smoothly -->
  <path
    d="M 54 140 C 50 115 65 72 86 52 C 92 46 103 46 109 52 C 122 65 138 104 142 140 M 42 98 C 42 90 48 85 58 85 H 136 C 146 85 152 91 152 98 C 152 105 146 111 136 111 H 42"
    fill="none"
    stroke="url(#grad)"
    stroke-width="5.6"
    stroke-linecap="round"
    stroke-linejoin="round"
  />
</svg>
`;

// Candidate 4: Thoufik-style Continuous Ribbon Loop forming "A"
// Notice Thoufik's geometry: parallel tracks with rounded 180-deg capsules
// Let's create an "A" made of rounded capsule loops:
// Top capsule, middle crossbar capsule, and angled legs
const a4 = `
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
  <!-- Outer ribbon path forming A with looped apex and looped crossbar in one continuous stroke -->
  <path
    d="M 52 140 L 89 54 C 92 46 103 46 106 54 L 143 140 M 44 102 C 44 94 51 88 60 88 H 135 C 144 88 151 94 151 102 C 151 110 144 116 135 116 H 60 C 51 116 44 110 44 102 Z"
    fill="none"
    stroke="url(#grad)"
    stroke-width="5.4"
    stroke-linecap="round"
    stroke-linejoin="round"
  />
</svg>
`;

// Candidate 5: Single Unbroken Continuous Ribbon "A" (Mobius / Infinity style loop)
const a5 = `
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
    d="M 50 138 L 88 52 C 92 44 103 44 107 52 L 145 138 C 149 146 140 150 133 144 L 109 116 H 86 L 62 144 C 55 150 46 146 50 138 Z M 97.5 70 L 83 100 H 112 Z"
    fill="none"
    stroke="url(#grad)"
    stroke-width="5.4"
    stroke-linecap="round"
    stroke-linejoin="round"
  />
</svg>
`;

Promise.all([
  sharp(Buffer.from(a1)).png().toFile('scratch/logo_a1.png'),
  sharp(Buffer.from(a2)).png().toFile('scratch/logo_a2.png'),
  sharp(Buffer.from(a3)).png().toFile('scratch/logo_a3.png'),
  sharp(Buffer.from(a4)).png().toFile('scratch/logo_a4.png'),
  sharp(Buffer.from(a5)).png().toFile('scratch/logo_a5.png'),
]).then(() => {
  console.log('All candidate logos rendered successfully');
});
