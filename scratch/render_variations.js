const sharp = require('sharp');

// Variation 10: Elegant Single Unbroken Stroke "A"
// Starts at bottom-left foot, swoops up to apex, loops over top in a teardrop,
// sweeps down right leg, loops smoothly around into the horizontal crossbar,
// forming an iconic ribbon monogram.
const v10 = `
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
  <!-- Single continuous path: Left leg -> Apex -> Right leg -> Smooth looping crossbar -->
  <path
    d="M 54 140 L 92 50 C 94 44 101 44 103 50 L 141 140 C 143 146 137 151 130 146 L 115 130 C 105 120 90 102 70 102 C 55 102 45 108 45 116 C 45 124 55 130 70 130 H 132 C 144 130 152 122 152 110 C 152 98 144 90 132 90 H 62"
    fill="none"
    stroke="url(#grad)"
    stroke-width="5.4"
    stroke-linecap="round"
    stroke-linejoin="round"
  />
</svg>
`;

// Variation 11: Geometric Modernist Ribbon "A"
// Look at how Thoufik has a vertical spine with horizontal rounded capsule ribs.
// For "Arshin", what if the left spine is diagonal/vertical, with two horizontal rounded loops:
// Upper loop forms the top head of the 'A' / 'R' / 'P', and lower loop forms the crossbar!
// Wait! Think about "A" and "R" (Arshin):
// A monogram for "Arshin" with an "A" or "AR":
// If the left spine rises up, top loop curves right and back to spine (forming top lobe of A or R),
// and lower ribbon extends right and curves down to form the leg of R / foot of A!
// That's an "A"+"R" monogram for Arshin!
const v11 = `
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
  <!-- Arshin Monogram: Stylized continuous line ribbon forming 'A' & 'R' -->
  <path
    d="M 68 144 V 62 C 68 52 76 45 88 45 H 116 C 132 45 144 56 144 71 C 144 86 132 97 116 97 H 68 M 110 97 L 138 144 M 44 97 H 95"
    fill="none"
    stroke="url(#grad)"
    stroke-width="5.4"
    stroke-linecap="round"
    stroke-linejoin="round"
  />
</svg>
`;

// Variation 12: Continuous Geometric Ribbon Loop "A"
// Single continuous unbroken ribbon:
// Starts at bottom (78, 142) -> curves up to (78, 100) -> loops left to (45, 100) -> curves around to (45, 80) ->
// sweeps across to (125, 80) -> curves over top apex (125, 50) -> curves left to (97.5, 45) ->
// curves down to apex -> ...
// Let's create an iconic geometric "A" where the crossbar loops seamlessly into the legs:
const v12 = `
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
  <!-- Stylized Geometric A with continuous ribbon tracks -->
  <path
    d="M 52 142 L 91 50 C 93 44 102 44 104 50 L 143 142 M 56 122 C 46 122 40 114 40 102 C 40 90 46 82 56 82 H 139 C 149 82 155 90 155 102 C 155 114 149 122 139 122 H 56 Z"
    fill="none"
    stroke="url(#grad)"
    stroke-width="5.4"
    stroke-linecap="round"
    stroke-linejoin="round"
  />
</svg>
`;

// Variation 13: The pure continuous ribbon "A" (Mobius / Loop)
// It starts from the left foot, loops over the apex, crosses down,
// and loops through the center in an infinity knot or ribbon fold.
const v13 = `
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
    d="M 58 140 C 58 140 68 106 88 56 C 92 46 103 46 107 56 C 127 106 137 140 137 140 C 137 140 120 125 97.5 125 C 75 125 58 140 58 140 Z M 72 98 H 123"
    fill="none"
    stroke="url(#grad)"
    stroke-width="5.4"
    stroke-linecap="round"
    stroke-linejoin="round"
  />
</svg>
`;

// Variation 14: Let's design a TRUE THOUFIK-COUSIN "A" Monogram:
// Look at Thoufik's logo:
// A stem with two rounded horizontal loops.
// What if for "A", we have TWO symmetrical diagonal stems meeting at an apex loop,
// and the crossbar is an elongated capsule loop that weaves through them with rounded pills on BOTH sides!
// Look at Candidate 8:
// Outer Arch: M 56 142 L 91.5 52 C 94 45 101 45 103.5 52 L 139 142
// Looping Crossbar: M 45 100 C 45 92 52 86 61 86 H 134 C 143 86 150 92 150 100 C 150 108 143 114 134 114 H 61 C 52 114 45 108 45 100 Z
// But notice: in candidate 8, the height of the pill was 28px (from 86 to 114).
// What if the pill is thinner (e.g. 19.5px, identical to Thoufik's pill height 19.496px!)
// And the apex has a rounded loop!
const v14 = `
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
  <!-- Arch with rounded apex loop -->
  <path
    d="M 58 142 L 92.5 54 C 94.5 49 100.5 49 102.5 54 L 137 142"
    fill="none"
    stroke="url(#grad)"
    stroke-width="5.4"
    stroke-linecap="round"
    stroke-linejoin="round"
  />
  <!-- Exactly matching Thoufik's 19.5px capsule loop height and radius: (107.5 - 88 = 19.5) -->
  <path
    d="M 44 98 C 44 92.5 48.5 88 54 88 H 141 C 146.5 88 151 92.5 151 98 C 151 103.5 146.5 107.5 141 107.5 H 54 C 48.5 107.5 44 103.5 44 98 Z"
    fill="none"
    stroke="url(#grad)"
    stroke-width="5.4"
    stroke-linecap="round"
    stroke-linejoin="round"
  />
</svg>
`;

// Variation 15: An UNBROKEN SINGLE PATH "A" that traces the arch AND the capsule in one continuous stroke:
// Left foot (58, 142) -> up to (92.5, 54) -> apex loop to (102.5, 54) ->
// down right leg to crossbar intersection (120, 88) ->
// right loop to (151, 98) -> down to (141, 107.5) -> across to left loop (44, 98) ->
// up to (54, 88) -> across to (75, 88) -> down left leg to (58, 142)... wait, or with the right leg continuing to (137, 142)!
// Look at how Thoufik's path is drawn:
// It's literally a single closed path!
// Let's create an "A" that is ONE closed path!
// Path outline of an A:
// Start bottom left (50, 142) -> left outer edge to (92, 50) -> apex (97.5, 45) ->
// right outer edge to (145, 142) -> right foot bottom curve to (127, 142) ->
// up inner right edge to (114, 110) -> inner horizontal edge (81, 110) ->
// down inner left edge to (68, 142) -> bottom curve to (50, 142) Z
// AND inner triangle: (97.5, 68) to (87, 92) to (108, 92) Z!

Promise.all([
  sharp(Buffer.from(v10)).png().toFile('scratch/logo_v10.png'),
  sharp(Buffer.from(v11)).png().toFile('scratch/logo_v11.png'),
  sharp(Buffer.from(v12)).png().toFile('scratch/logo_v12.png'),
  sharp(Buffer.from(v14)).png().toFile('scratch/logo_v14.png'),
]).then(() => {
  console.log('Variations 10, 11, 12, 14 rendered successfully');
});
