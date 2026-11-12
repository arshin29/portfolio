import {
  $ as Le, $t as Re, A as ze, B as Be, Bt as Ve, C as He, Ct as Ue, Dt as We, E as Ge, Et as Ke, F as qe, Ft as Je, G as Ye, Gt as Xe, H as Ze, I as Qe, It as $e, J as et, K as tt, L as nt, M as rt, Mt as it, N as at, Nt as ot, O as st, Ot as ct, P as lt, Pt as ut, Qt as dt, R as ft, St as pt, T as mt, Tt as ht, U as gt, Ut as _t, V as vt, Vt as yt, W as bt, Wt as xt, X as St, Y as Ct, Z as wt, _ as Tt, at as Et, b as Dt, bt as Ot, c as kt, ct as At, d as jt, en as Mt, et as Nt, f as Pt, ft as Ft, g as It, h as Lt, it as Rt, j as zt, jt as Bt, k as Vt, kt as Ht, lt as Ut, mt as Wt, n as Gt, nn as Kt, nt as qt, o as Jt, ot as Yt, p as Xt, pt as Zt, q as Qt, qt as $t, rn as en, rt as tn, st as nn, t as rn, tn as an, tt as on, u as sn, vt as cn, w as ln, wt as un, x as dn, xt as fn, y as pn, yt as mn, z as hn, zt as gn
} from './three.module.js';
import { a as _n, i as vn, n as yn, o as bn, t as xn } from './ambient-dynamics.js';
import { n as Sn, r as Cn } from './activity.js';

var Vu=2.6,Hu=92,Uu=new Re(0,2.2,7.5),Wu=new Re(0,-.5,-22),Gu={x:-40,z:-60,w:80,d:68,cols:192,rows:164},Ku=100,qu=-.1,Q={x:-9,z:-5,w:19,d:11,cols:288,rows:168},Ju={cols:200,rows:170};function Yu(e,t){let n=(n,r,i,a,o)=>{let s=(e-n)/i,c=(t-r)/a;return o*Math.exp(-(s*s+c*c))},r=n(0,-30,13,8,5.2)+n(-26,-22,13,9,3)+n(25,-20,12,8,2.7);r+=n(-9,-7,5,3.5,1.1)+n(8,-9,5.5,3.5,1)+n(0,-12,14,5,.8),r+=n(-8,3.2,3.8,3,1)+n(9.5,3.5,3.2,2.6,.7);let i=Math.min(1,Math.max(0,(-t-45)/20));r+=i*i*(3-2*i)*(1.6+.8*Math.sin(e*.05+2.1)),r+=.08*Math.sin(e*.31+t*.17)+.06*Math.cos(t*.37-e*.12);let a=Math.min(1,Math.max(0,(-t-14)/10))*Math.min(1,r/1.5)*2;return r+=a*(.42*Math.sin(e*.29+t*.21)*Math.cos(t*.25-e*.12)+.18*Math.sin(e*.71-t*.58+1.3)*Math.cos(e*.43+t*.83)+.07*Math.sin(e*1.9+t*1.3)*Math.sin(t*2.1-e*.7)),r+Xu(e,t)}function Xu(e,t){let n=6.5+.8*Math.sin(t*1.1+.6)+.4*Math.sin(t*2.3),r=2.3+.4*Math.sin(e*.9+1.7)+.25*Math.sin(e*2.1),i=(e-.5)/n,a=(t-.4)/r,o=.06*Math.sin(e*3.1+t*1.7)+.045*Math.sin(e*5.3-t*2.9)+.035*Math.sin(e*9.7+t*6.1)+.025*Math.sin(e*17.3-t*11.9)+.015*Math.sin(e*29.1+t*23.7),s=Math.min(1,Math.max(0,(1.3-Math.sqrt(i*i+a*a)-o)/.8));return .18-1.15*s*s*(3-2*s)}var Zu=new Re(0,qu,-1),Qu=`
uniform float uTime;
uniform vec2 uWindDir;
uniform float uWind;
uniform float uGust;
uniform vec4 uField;
uniform sampler2D uTrail;
uniform float uHalfWidth;
uniform float uCamZ;
uniform float uScreen;
uniform float uRain;
uniform sampler2D uShadow;
uniform vec3 uSunDirV;

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p), u = f * f * (3. - 2. * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
}
float hill(vec2 p, vec2 c, vec2 r, float h){ vec2 q = (p - c) / r; return h * exp(-dot(q, q)); }
float terrain(vec2 p){
  float h = hill(p, vec2(0., -30.), vec2(13., 8.), 5.2) + hill(p, vec2(-26., -22.), vec2(13., 9.), 3.) + hill(p, vec2(25., -20.), vec2(12., 8.), 2.7);
  h += hill(p, vec2(-9., -7.), vec2(5., 3.5), 1.1) + hill(p, vec2(8., -9.), vec2(5.5, 3.5), 1.) + hill(p, vec2(0., -12.), vec2(14., 5.), .8);
  h += hill(p, vec2(-8., 3.2), vec2(3.8, 3.), 1.) + hill(p, vec2(9.5, 3.5), vec2(3.2, 2.6), .7);
  float far = clamp((-p.y - 45.) / 20., 0., 1.);
  h += far * far * (3. - 2. * far) * (1.6 + .8 * sin(p.x * .05 + 2.1));
  h += .08 * sin(p.x * .31 + p.y * .17) + .06 * cos(p.y * .37 - p.x * .12);
  float back = clamp((-p.y - 14.) / 10., 0., 1.) * min(1., h / 1.5) * 2.;
  h += back * (.42 * sin(p.x * .29 + p.y * .21) * cos(p.y * .25 - p.x * .12)
    + .18 * sin(p.x * .71 - p.y * .58 + 1.3) * cos(p.x * .43 + p.y * .83)
    + .07 * sin(p.x * 1.9 + p.y * 1.3) * sin(p.y * 2.1 - p.x * .7));
  float rx = 6.5 + .8 * sin(p.y * 1.1 + .6) + .4 * sin(p.y * 2.3);
  float rz = 2.3 + .4 * sin(p.x * .9 + 1.7) + .25 * sin(p.x * 2.1);
  float wobble = .06 * sin(p.x * 3.1 + p.y * 1.7) + .045 * sin(p.x * 5.3 - p.y * 2.9) + .035 * sin(p.x * 9.7 + p.y * 6.1) + .025 * sin(p.x * 17.3 - p.y * 11.9) + .015 * sin(p.x * 29.1 + p.y * 23.7);
  float t = clamp((1.3 - length(vec2((p.x - .5) / rx, (p.y - .4) / rz)) - wobble) / .8, 0., 1.);
  return h + .18 - 1.15 * t * t * (3. - 2. * t);
}
// Soft terrain shadow (1 lit, 0 shaded), precomputed toward the sun.
float shadowAt(vec2 p){
  vec2 uv = (p - uField.xy) / uField.zw;
  if (uv.x < 0. || uv.x > 1. || uv.y < 0. || uv.y > 1.) return 1.;
  return texture2D(uShadow, uv).r;
}
// Spread instances so screen density stays even: depth is log-distributed
// and lateral position follows the current frustum width.
vec2 rootFrom(vec2 seed, out float depth){
  depth = ${Vu.toFixed(2)} * pow(${(Hu/Vu).toFixed(4)}, seed.y);
  return vec2(seed.x * (depth * uHalfWidth + 1.2), uCamZ - depth);
}
// Springy displacement left by the pointer, in lean units.
vec2 trailAt(vec2 root){
  vec2 uv = (root - uField.xy) / uField.zw;
  if (uv.x < 0. || uv.x > 1. || uv.y < 0. || uv.y > 1.) return vec2(0.);
  return (texture2D(uTrail, uv).rg * 255. - 128.) / ${Ku.toFixed(1)};
}
// Horizontal lean of a stem: steady wind, slow travelling gusts, a gentle
// flutter that fades with distance (so far grass never shimmers), pointer ripple.
vec2 leanAt(vec2 root, float rnd, float stiffness, float depth, out float push){
  float gust = noise(root * .09 - uWindDir * uTime * .35);
  float flutter = sin(uTime * (1.1 + rnd * .5) + root.x * .5 + root.y * .4 + rnd * 6.2831);
  float nearness = 1. - smoothstep(8., 26., depth);
  vec2 lean = uWindDir * (.08 + uWind * (.1 + gust * .4) + uGust * gust * .22);
  lean += uWindDir.yx * vec2(-1., 1.) * flutter * (.025 + uWind * .035) * nearness;
  lean += vec2(rnd - .5, fract(rnd * 7.31) - .5) * .5;
  // Rain: stems shiver as drops strike them.
  float strike = hash(root * 3.1 + floor(uTime * 9. + rnd * 7.));
  lean += (vec2(strike, fract(strike * 13.7)) - .5) * uRain * .32 * nearness;
  vec2 trail = trailAt(root);
  push = min(length(trail), 1.);
  return (lean + trail) * stiffness;
}
// Never thinner than about two pixels, so distant grass resolves as smooth
// texture instead of grainy hair on dense screens.
float pixelWidth(float depth){ return 1.8 * depth / uScreen; }
`,$u=`
uniform float uLight;
uniform float uNight;
uniform vec3 uSun;
uniform vec3 uHaze;
uniform vec3 uSunDir;
uniform vec4 uPointer;
uniform float uRain;
uniform float uMirror;
// In the reflection pass, nothing below the water surface exists.
void clipToWater(vec3 world){ if (uMirror > .5 && world.y < ${qu.toFixed(2)} + .005) discard; }
// Daylight sky fill, plus cool moonlight and foliage scattering at night so colours dim gracefully instead of
// collapsing to black.
vec3 ambientLight(){
  vec3 day = mix(uHaze, vec3(.6, .7, .5), .45) * .5;
  vec3 night = vec3(.10, .14, .20) + vec3(.08, .15, .08);
  return mix(vec3(.05, .09, .14), day, uLight) + night * uNight;
}
vec3 pointLight(vec3 world, vec3 n, vec4 light, vec3 color, float falloff){
  vec3 L = light.xyz - world;
  float d2 = dot(L, L);
  float facing = abs(dot(n, L * inversesqrt(d2 + 1e-4))) * .6 + .4;
  return color * light.w * facing / (1. + d2 * falloff);
}
// After dark the pointer carries a soft lantern.
vec3 nightLights(vec3 world, vec3 n){
  return pointLight(world, n, uPointer, vec3(1., .93, .72), 6.) * 2.6 * uNight;
}
vec3 finish(vec3 color, float depth){
  color = 1. - exp(-color * 1.35);
  float luma = dot(color, vec3(.299, .587, .114));
  color = max(mix(vec3(luma), color, 1.02 + .08 * uLight), 0.);
  // Aerial perspective: contrast and colour fade toward the horizon haze.
  float air = (1. - exp(-max(depth - 12., 0.) * .028)) * .72;
  return mix(color, uHaze, air);
}
`,ed=`
void bladeStatic(vec4 seed, float bank, out vec2 root, out float depth, out float ground, out vec3 slope, out float height, out float width, out vec2 rest, out float clumpTint, out float macro){
  if (bank > .5) {
    // Extra blades in a ring all round the pond, where the bank slopes
    // toward the lens and would otherwise show bare ground.
    // Follow the pond's real, irregular outline (same radii as terrain()).
    float ang = seed.x * 3.14159;
    float ring = mix(.94, 1.3, seed.y);
    root = vec2(.5 + cos(ang) * 6.5 * ring, .4 + sin(ang) * 2.3 * ring);
    for (int k = 0; k < 2; k++) {
      float rx = 6.5 + .8 * sin(root.y * 1.1 + .6) + .4 * sin(root.y * 2.3);
      float rz = 2.3 + .4 * sin(root.x * .9 + 1.7) + .25 * sin(root.x * 2.1);
      root = vec2(.5 + cos(ang) * rx * ring, .4 + sin(ang) * rz * ring);
    }
    depth = max(uCamZ - root.y, .5);
  } else {
    root = rootFrom(seed.xy, depth);
  }
  float rnd = seed.z;
  float clump = noise(root * .32);
  // Distant blades grow a little larger, so the far meadow reads as soft,
  // lush cover rather than thinning to single hairs.
  // Short, lush lawn that shows the shape of the land; a few longer tufts.
  // One real size everywhere: blades shrink with distance as perspective
  // demands, and the far hills read as smooth, dense turf.
  // Varied blades: tall and slender, short and broad, and everything between.
  float form = fract(rnd * 5.7);
  height = (.2 + .3 * rnd * rnd + .3 * clump * clump) * mix(.7, 1.35, form);
  width = max(.026 * mix(1.25, .7, form) * (.8 + .4 * fract(rnd * 13.7)), pixelWidth(depth));
  ground = terrain(root);
  float e = .3;
  slope = normalize(vec3(terrain(root - vec2(e, 0.)) - terrain(root + vec2(e, 0.)), 2. * e, terrain(root - vec2(0., e)) - terrain(root + vec2(0., e))));
  // Hills: shorter on steep slopes and the windy crest; far grass varies by
  // clump so ridgelines are uneven tufts, not an even buzzcut.
  height *= mix(.82, 1., smoothstep(.65, .95, slope.y)) * (1. - smoothstep(2.5, 6., ground) * .12);
  // Slopes tilted toward the lens expose more ground: taller grass covers it.
  height *= 1. + clamp(slope.z * 2.2, 0., .7) * (1. - smoothstep(10., 22., depth)) * mix(.45, 1., smoothstep(.15, .6, ground - ${qu.toFixed(2)}));
  height *= mix(1., mix(.78, .92, noise(root * .15 + 2.)), smoothstep(16., 42., depth));
  // Far away, long outlier blades read as stray hairs: keep them in line.
  height = min(height, mix(9., .42, smoothstep(14., 30., depth)));
  // Shoreline: tall grass, then shorter scattered tufts, then wet soil. How
  // far the thinning reaches varies clump by clump, so the edge is irregular
  // and some tufts stay tall right to the water.
  float above = ground - ${qu.toFixed(2)};
  float reach = .05 + .38 * noise(root * 2.1 + 5.);
  height *= mix(.9, 1., smoothstep(0., reach + .2, above));
  // The first row grows from just under the surface, so its roots are hidden
  // by the water rather than standing on bare bank.
  height *= step(-.26, above);
  height += max(-above, 0.) * .6;

  // Every blade carries its own curl; at the water's edge the tufts lean out.
  float yawCurl = fract(rnd * 3.9) * 6.2831;
  rest = vec2(cos(yawCurl), sin(yawCurl)) * .3 * fract(rnd * 9.1);
  // Blades lean a little downhill, following the land.
  rest += slope.xz * .55;
  float shore = 1. - smoothstep(${qu.toFixed(2)} + .02, ${qu.toFixed(2)} + .2, ground);
  if (shore > 0.) {
    float ge = .15;
    vec2 grad = vec2(terrain(root + vec2(ge, 0.)) - terrain(root - vec2(ge, 0.)), terrain(root + vec2(0., ge)) - terrain(root - vec2(0., ge)));
    rest -= normalize(grad + 1e-5) * shore * .1;
  }
  clumpTint = noise(root * .09 + 11.) * .6 + noise(root * .045 + 3.) * .4;
  macro = clamp(noise(root * .05 + 8.) * .7 + (ground - 1.) * .08, 0., 1.);
}
`,td=`
${Qu}
${ed}
attribute vec4 aSeed;
uniform float uBank;
#ifdef BAKED
attribute vec2 aBake;
uniform sampler2D uBake0;
uniform sampler2D uBake1;
uniform sampler2D uBake2;
#endif
varying float vT;
varying float vRnd;
varying float vClump;
varying float vMacro;
varying float vGround;
varying float vShade;
varying float vPush;
varying float vDepth;
varying vec3 vNormal;
varying vec3 vWorld;
void main(){
  vec2 root, rest;
  float depth, ground, height, width, clumpTint, macro;
  vec3 slope;
#ifdef BAKED
  vec4 b0 = texture2D(uBake0, aBake), b1 = texture2D(uBake1, aBake), b2 = texture2D(uBake2, aBake);
  root = b0.xy; ground = b0.z; macro = b0.w;
  height = b1.x; width = b1.y; rest = b1.zw;
  slope = b2.xyz; clumpTint = b2.w;
  if (uBank > .5) depth = max(uCamZ - root.y, .5);
  else rootFrom(aSeed.xy, depth);
#else
  bladeStatic(aSeed, uBank, root, depth, ground, slope, height, width, rest, clumpTint, macro);
#endif
  float rnd = aSeed.z;
  float yaw = aSeed.w * 6.2831;
  vec2 side = normalize(mix(vec2(cos(yaw), sin(yaw)), vec2(1., 0.), .45));

  float push;
  vec2 lean = leanAt(root, rnd, 1., depth, push) + rest;
  float amount = length(lean);
  vec2 dir = lean / max(amount, 1e-4);
  float bend = clamp(amount * 1.15, .02, 1.25);

  // Constant-curvature arc keeps blade length while it bends.
  float t = position.y;
  float a = bend * t;
  float horizontal = height * (1. - cos(a)) / bend;
  float vertical = height * sin(a) / bend;
  vec3 tangent = normalize(vec3(dir * sin(a), cos(a)).xzy);
  vec3 s = vec3(side.x, 0., side.y);
  vec3 p = vec3(root.x, ground, root.y);
  p += vec3(dir.x * horizontal, vertical, dir.y * horizontal);
  // Bases flare out like a tuft, so neighbouring blades close the gaps.
  p += s * position.x * width * mix(2.1, 1., smoothstep(0., .4, t));

  vec3 n = normalize(cross(s, tangent));
  vNormal = normalize(n + s * sign(position.x) * .35);
  vT = t;
  vRnd = rnd;
  vClump = clumpTint;
  vGround = ground;
  vMacro = macro;
  // Sunlight on the blade: terrain shadow, how the slope faces the sun, and
  // drifting cloud shade. These follow the sun, so they stay per frame.
  float facing = clamp(dot(slope, uSunDirV) * 1.2 + .5, .55, 1.25);
  // Along the shore the grass is lit like the open bank all the way round,
  // so the pond's own hollow never casts a dark rim.
  float nearWater = 1. - smoothstep(.05, .7, ground - ${qu.toFixed(2)});
  facing = mix(facing, max(facing, 1.05), nearWater);
  vShade = mix(.8, 1.06, smoothstep(.25, .75, noise(root * .055 - uWindDir * uTime * .03))) * facing * mix(mix(.68, 1., shadowAt(root)), 1., nearWater);
  if (height < .005) gl_Position = vec4(2., 2., 2., 1.);
  vPush = push;
  vWorld = p;
  vec4 view = viewMatrix * vec4(p, 1.);
  vDepth = -view.z;
  if (height >= .005) gl_Position = projectionMatrix * view;
}
`,nd=`
precision highp float;
in vec3 position;
void main(){ gl_Position = vec4(position.xy, 0., 1.); }
`,rd=`
precision highp float;
precision highp int;
precision highp sampler2D;
#define texture2D texture
${Qu}
${ed}
uniform sampler2D uSeeds;
uniform float uBakeBank;
layout(location = 0) out vec4 bake0;
layout(location = 1) out vec4 bake1;
layout(location = 2) out vec4 bake2;
void main(){
  vec4 seed = texelFetch(uSeeds, ivec2(gl_FragCoord.xy), 0);
  vec2 root, rest;
  float depth, ground, height, width, clumpTint, macro;
  vec3 slope;
  bladeStatic(seed, uBakeBank, root, depth, ground, slope, height, width, rest, clumpTint, macro);
  bake0 = vec4(root, ground, macro);
  bake1 = vec4(height, width, rest);
  bake2 = vec4(slope, clumpTint);
}
`,id=`
${$u}
varying float vT;
varying float vRnd;
varying float vClump;
varying float vMacro;
varying float vGround;
varying float vShade;
varying float vPush;
varying float vDepth;
varying vec3 vNormal;
varying vec3 vWorld;
void main(){
  clipToWater(vWorld);
  vec3 n = normalize(vNormal) * (gl_FrontFacing ? 1. : -1.);
  vec3 view = normalize(cameraPosition - vWorld);
  vec3 deep = mix(vec3(.13, .29, .05), vec3(.2, .36, .07), vRnd);
  vec3 fresh = mix(vec3(.42, .66, .15), vec3(.56, .74, .21), vRnd);
  // Patches of paler, yellower grass and deeper green.
  fresh = mix(fresh, vec3(.74, .8, .32), smoothstep(.58, .9, vClump) * .55);
  fresh = mix(fresh, vec3(.3, .52, .12), smoothstep(.42, .12, vClump) * .45);
  fresh *= mix(.88, 1.08, vClump);
  // Broad patches: sunlit olive on exposed ground, deeper green in the dips.
  fresh = mix(fresh, vec3(.6, .66, .26), smoothstep(.55, .85, vMacro) * .45);
  fresh = mix(fresh, vec3(.24, .46, .12), smoothstep(.35, .1, vMacro) * .4);
  vec3 leaf = mix(deep, fresh, smoothstep(.05, 1., vT));
  // Up close each blade has its own shade; with distance they average into
  // a smooth, soft texture, as the eye and lens see a far meadow.
  float far = smoothstep(9., 26., vDepth);
  // Up close each blade has its own shade; with distance they average into
  // a smooth, soft texture, as the eye and lens see a far meadow.
  float ao = mix(mix(.55, 1., smoothstep(0., .35, vT)) * mix(.7, 1.05, fract(vRnd * 23.1)), .88, far * .8);
  leaf = mix(leaf, mix(deep, fresh, .7), far * .6);
  float diffuse = max(dot(n, uSunDir), 0.) * .6 + .4;
  float back = pow(max(dot(view, -uSunDir), 0.), 3.) * vT * .6;
  // Grass is matte: only a faint, broad highlight.
  // Grass is matte; brushed blades turn and catch a little more light.
  float sheen = pow(max(dot(n, normalize(uSunDir + view)), 0.), 6.) * (.025 + vPush * .07);
  vec3 sun = uSun * uLight * vShade;
  vec3 ambient = ambientLight() * mix(.6, 1., vT);
  vec3 color = leaf * (ambient + sun * (diffuse + back) * 1.95 + nightLights(vWorld, n)) * ao + sun * sheen;
  // Shoots standing at the water's edge have dark, wet roots.
  float shoreBand = 1. - smoothstep(${qu.toFixed(2)} + .05, ${qu.toFixed(2)} + .55, vGround);
  vec3 deepGreen = mix(vec3(.36, .5, .33), vec3(1.), smoothstep(0., .6, vT));
  color *= mix(vec3(1.), deepGreen, shoreBand);
  // Warm where the sun lands, cool in shade.
  color *= mix(vec3(.92, .97, 1.03), vec3(1.03, 1.01, .93), smoothstep(.55, 1.05, vShade));
  // Wet grass after rain: darker, with a cool sheen.
  color = mix(color, color * .72 + vec3(.02, .03, .04) * vT, uRain * .7);
  color += vec3(.03, .08, .06) * vPush * uNight;
  gl_FragColor = vec4(finish(color, vDepth), 1.);
}
`,ad=`
${Qu}
varying vec3 vNormal;
varying vec3 vWorld;
varying float vDepth;
varying float vSun;
void main(){
  vec2 xz = (modelMatrix * vec4(position, 1.)).xz;
  vSun = mix(shadowAt(xz), 1., 1. - smoothstep(.05, .7, terrain(xz) - ${qu.toFixed(2)}));
  float e = .25;
  vNormal = normalize(vec3(terrain(xz - vec2(e, 0.)) - terrain(xz + vec2(e, 0.)), 2. * e, terrain(xz - vec2(0., e)) - terrain(xz + vec2(0., e))));
  vWorld = vec3(xz.x, terrain(xz), xz.y);
  vec4 view = viewMatrix * vec4(vWorld, 1.);
  vDepth = -view.z;
  gl_Position = projectionMatrix * view;
}
`,od=`
${$u}
varying vec3 vNormal;
varying vec3 vWorld;
varying float vDepth;
varying float vSun;
// The ground is two meshes: a fine one around the pond, where the shore lip
// needs centimetre detail, and a coarse one everywhere else.
uniform vec4 uPatch;
uniform float uFine;
float gnoise(vec2 p){
  vec2 i = floor(p), f = fract(p), u = f * f * (3. - 2. * f);
  float a = fract(sin(dot(i, vec2(127.1, 311.7))) * 43758.5);
  float b = fract(sin(dot(i + vec2(1, 0), vec2(127.1, 311.7))) * 43758.5);
  float c = fract(sin(dot(i + vec2(0, 1), vec2(127.1, 311.7))) * 43758.5);
  float d = fract(sin(dot(i + vec2(1, 1), vec2(127.1, 311.7))) * 43758.5);
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}
void main(){
  bool inPatch = vWorld.x > uPatch.x && vWorld.x < uPatch.x + uPatch.z && vWorld.z > uPatch.y && vWorld.z < uPatch.y + uPatch.w;
  if (inPatch != (uFine > .5)) discard;
  clipToWater(vWorld);
  float patch1 = gnoise(vWorld.xz * .6) * .6 + gnoise(vWorld.xz * 2.1) * .4;
  vec3 far = mix(vec3(.2, .38, .08), vec3(.3, .48, .11), patch1);
  // Between blades the ground reads as dense, shaded turf: fine vertical
  // streaks in the colours of the blade bases.
  float streaks = gnoise(vec2(vWorld.x * 38., vWorld.z * 38. + vWorld.y * 60.)) * .6 + gnoise(vWorld.xz * 9.) * .4;
  vec3 turf = mix(vec3(.08, .2, .03), vec3(.16, .32, .06), streaks);
  vec3 soil = mix(turf, far * .92, smoothstep(6., 16., vDepth));
  float diffuse = max(dot(normalize(vNormal), uSunDir), 0.) * .6 + .4;
  vec3 color = soil * (ambientLight() * .8 + uSun * uLight * diffuse * 1.4 * mix(.5, 1., vSun) + nightLights(vWorld, normalize(vNormal)));
  // Wet soil: a narrow, uneven strip where the bank meets the water.
  float lip = vWorld.y - ${qu.toFixed(2)} + (gnoise(vWorld.xz * 7.) - .5) * .1;
  float reachWet = mix(.02, .14, gnoise(vWorld.xz * 1.3 + 4.));
  float wet = (1. - smoothstep(.0, reachWet, lip)) * step(-.03, vWorld.y - ${qu.toFixed(2)}) * smoothstep(.3, .62, gnoise(vWorld.xz * 2.4 + 9.));
  vec3 mud = mix(vec3(.11, .1, .06), vec3(.06, .055, .035), gnoise(vWorld.xz * 22.)) * mix(.8, 1.2, gnoise(vWorld.xz * 61.));
  color = mix(color, mud * (ambientLight() + uSun * uLight * .9), wet * .35);
  // On the bank, between the blades, the ground takes the grass's own colour.
  // All land under the grass reads as dense grass bases, never bare ground.
  float bank = 1. - smoothstep(30., 60., vDepth) * .4;
  float blades = gnoise(vec2(vWorld.x * 60., vWorld.z * 60. + vWorld.y * 90.));
  vec3 grassTone = mix(vec3(.08, .18, .035), vec3(.17, .32, .07), blades * .7 + gnoise(vWorld.xz * 9.) * .3) * (ambientLight() * .8 + uSun * uLight * diffuse * 1.15 * mix(.6, 1., vSun) + nightLights(vWorld, normalize(vNormal)));
  color = mix(color, grassTone, bank * step(${qu.toFixed(2)} + .01, vWorld.y));
  // Pond bed: dark silt, darker with depth.
  float under = clamp((${qu.toFixed(2)} - vWorld.y) / .6, 0., 1.);
  // Under water: mossy green on the shallow slope, darker silt with depth.
  float sub = ${qu.toFixed(2)} - vWorld.y;
  vec3 moss = mix(vec3(.15, .26, .08), vec3(.1, .18, .06), gnoise(vWorld.xz * 6.)) * (ambientLight() + uSun * uLight * .85);
  vec3 silt = vec3(.05, .08, .05) * (ambientLight() + uSun * uLight * .6);
  color = mix(color, mix(moss, silt, smoothstep(.22, .6, sub)), smoothstep(0., .03, sub));
  color *= 1. - uRain * .22;
  gl_FragColor = vec4(finish(color, vDepth), 1.);
}
`,sd=`
${Qu}
attribute float aPart;
attribute vec4 aSeed;
varying vec2 vUv;
varying float vPart;
varying float vKind;
varying float vRnd;
varying float vDepth;
varying vec3 vWorld;
void main(){
  float depth;
  vec2 root = rootFrom(vec2(aSeed.x, aSeed.y * .8), depth);
  float rnd = aSeed.z;
  // Irregular scatter: a loose sprinkle everywhere, thickening in places,
  // never in the water.
  float density = .1 + .32 * smoothstep(.35, .85, noise(root * .23 + 3.)) * noise(root * .9 + 11.);
  float visible = step(fract(rnd * 31.7), density) * (1. - step(26., depth)) * step(${qu.toFixed(2)} + .12, terrain(root));
  float species = noise(root * .16 + 7.);
  float kind = species < .55 ? 0. : species < .7 ? 2. : species < .76 ? 1. : species < .82 ? 3. : 0.;
  if (fract(rnd * 7.7) < .12) kind = 4.;
  vKind = kind;
  vRnd = rnd;
  vPart = aPart;
  float grow = (1. + depth * .03) * (1. + (1. - smoothstep(2.6, 5., depth)) * .2);
  // Most stems rise just above the grass; about a quarter stay tucked in it.
  float height = (fract(rnd * 11.3) < .25 ? .22 + .2 * rnd : .48 + .3 * rnd) * grow * (kind == 3. ? .7 : 1.);
  float push;
  vec2 lean = leanAt(root, rnd, .75, depth, push);
  float bend = clamp(length(lean) * 1.15, .02, 1.1);
  vec2 dir = lean / max(length(lean), 1e-4);
  float t = aPart > .5 ? 1. : position.y;
  float a = bend * t;
  vec3 p = vec3(root.x, terrain(root), root.y);
  p += vec3(dir * height * (1. - cos(a)) / bend, height * sin(a) / bend).xzy;
  vWorld = p;
  vec4 view = viewMatrix * vec4(p, 1.);
  if (aPart < .5) {
    view.x += position.x * max(.007, pixelWidth(depth) * .8);
    vUv = vec2(position.x + .5, t);
  } else {
    float size = (.09 + .05 * fract(rnd * 17.3)) * grow;
    size *= kind == 3. ? .4 : kind == 4. ? .38 : kind == 1. ? 1.15 : 1.;
    size = max(size, pixelWidth(depth) * 1.5);
    // Heads face the sky, so they are seen foreshortened from the low camera.
    float tilt = .32 + .42 * fract(rnd * 5.1);
    vec2 extent = kind == 4. ? vec2(size, size * 1.6) : vec2(size, size * tilt);
    vec2 offset = position.xy * extent;
    float spin = (fract(rnd * 3.3) - .5) * .4;
    offset = mat2(cos(spin), sin(spin), -sin(spin), cos(spin)) * offset;
    if (kind == 4.) offset.y += extent.y * .5;
    view.xy += offset;
    vUv = position.xy + .5;
  }
  vDepth = -view.z;
  gl_Position = visible > .5 ? projectionMatrix * view : vec4(2., 2., 2., 1.);
}
`,cd=`
${$u}
varying vec2 vUv;
varying float vPart;
varying float vKind;
varying float vRnd;
varying float vDepth;
varying vec3 vWorld;
float h1(float n){ return fract(sin(n * 91.345) * 47453.21); }
float vnoise(vec2 p){
  vec2 i = floor(p), f = fract(p), u = f * f * (3. - 2. * f);
  float a = fract(sin(dot(i, vec2(127.1, 311.7))) * 43758.5);
  float b = fract(sin(dot(i + vec2(1, 0), vec2(127.1, 311.7))) * 43758.5);
  float c = fract(sin(dot(i + vec2(0, 1), vec2(127.1, 311.7))) * 43758.5);
  float d = fract(sin(dot(i + vec2(1, 1), vec2(127.1, 311.7))) * 43758.5);
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}
// Signed coverage of one petal (positive inside) and its local coordinates.
float petal(vec2 p, float index, float count, float rot, float inner, float width, float notch, out vec2 q, out float len){
  float ac = index * 6.2831 / count - rot + (h1(index + vRnd * 13.) - .5) * .18;
  q = mat2(cos(ac), -sin(ac), sin(ac), cos(ac)) * p;
  len = mix(.8, 1., h1(index * 1.7 + vRnd * 7.));
  float x = (q.x - inner) / (len - inner);
  float profile = width * sqrt(clamp(x, 0., 1.)) * (1. - pow(clamp(x, 0., 1.), 3.2));
  float tip = notch * (.5 + .5 * cos(q.y / max(width, 1e-3) * 9.42)) * smoothstep(.75, 1., x);
  float inside = min(profile - abs(q.y), (len - tip * .08) - q.x);
  return x < 0. ? -1. : inside;
}
void main(){
  clipToWater(vWorld);
  vec3 sunLight = uSun * uLight;
  vec3 n = vec3(0., 1., 0.);
  vec3 lit = ambientLight() + sunLight * 1.1 + nightLights(vWorld, n);
  if (vPart < .5) {
    if (abs(vUv.x - .5) > .5) discard;
    vec3 stem = mix(vec3(.14, .3, .07), vec3(.34, .54, .16), vUv.y);
    gl_FragColor = vec4(finish(stem * lit, vDepth), 1.);
    return;
  }
  vec2 p = vUv * 2. - 1.;
  float r = length(p);
  float backlit = uLight * .35;
  vec3 color;
  float alpha;
  if (vKind == 4.) {
    // Closed bud: ovoid with green sepals hugging the base.
    float d = 1. - length(p / vec2(.55, .95));
    alpha = clamp(d / max(fwidth(d), 1e-4) + .5, 0., 1.);
    float sepal = smoothstep(-.1, -.45, p.y + .12 * cos(p.x * 9.));
    vec3 bud = mix(vec3(.28, .2, .3), vec3(.5, .38, .5), smoothstep(-.4, .9, p.y));
    color = mix(bud, vec3(.3, .5, .2), sepal) * (.8 + .28 * smoothstep(.6, -.4, p.x));
  } else if (vKind == 3.) {
    // Forget-me-not: five rounded petals and a pale eye.
    float a = atan(p.y, p.x) + vRnd * 6.2831;
    float edge = .62 + .38 * pow(abs(cos(a * 2.5)), .7);
    float d = edge - r;
    alpha = clamp(d / max(fwidth(d), 1e-4) + .5, 0., 1.);
    color = mix(vec3(.45, .62, .95), vec3(.66, .8, 1.), r);
    color = mix(vec3(1., .93, .62), color, smoothstep(.12, .24, r));
  } else {
    float count = vKind == 1. ? 8. : vKind == 2. ? 16. : 13. + floor(vRnd * 5.);
    float inner = vKind == 1. ? .14 : .2;
    float width = vKind == 1. ? .36 : vKind == 2. ? .13 : .14;
    float notch = vKind == 1. ? 1. : .25;
    float centre = vKind == 1. ? .17 : vKind == 2. ? .3 : .25;
    float rot = vRnd * 6.2831;
    float a = atan(p.y, p.x) + rot;
    float nearest = floor(a / 6.2831 * count + .5);
    float best = -1.;
    vec2 q = vec2(0.), bq = vec2(0.);
    float len = 1., blen = 1.;
    for (int k = -1; k <= 1; k++) {
      float v = petal(p, nearest + float(k), count, rot, inner * .6, width, notch, q, len);
      if (v > best) { best = v; bq = q; blen = len; }
    }
    float disc = centre - r;
    float d = max(best, disc);
    alpha = clamp(d / max(fwidth(d), 1e-4) + .5, 0., 1.);
    vec3 tint = vKind == 0. ? vec3(.98, .97, .94) : vKind == 2. ? mix(vec3(.98, .66, .54), vec3(1., .78, .66), h1(vRnd * 5.)) : mix(vec3(.94, .58, .74), vec3(.98, .77, .86), h1(vRnd * 5.));
    vec3 base = vKind == 0. ? vec3(.9, .91, .85) : vKind == 2. ? vec3(.96, .52, .4) : vec3(.8, .34, .54);
    float along = clamp((bq.x - inner * .6) / (blen - inner * .6), 0., 1.);
    vec3 petalColor = mix(base, tint, smoothstep(0., .55, along));
    petalColor *= .95 + .05 * cos(bq.y / width * 12.);
    petalColor *= mix(.8, 1., smoothstep(centre, centre + .22, r));
    petalColor += tint * backlit * smoothstep(.6, 1., along);
    petalColor *= .84 + .16 * smoothstep(-.8, .6, p.y);
    vec3 eye = vKind == 1. ? vec3(.95, .75, .2) : vKind == 2. ? vec3(.95, .46, .14) : vec3(.98, .76, .14);
    float dome = sqrt(max(0., 1. - pow(r / centre, 2.)));
    float grain = .82 + .18 * vnoise(p * 70. + vRnd * 40.);
    vec3 centreColor = eye * grain * (.6 + .45 * dome) * (.82 + .25 * smoothstep(.2, -.2, p.x - p.y));
    centreColor *= mix(.75, 1., smoothstep(centre, centre * .7, r));
    color = disc > best ? centreColor : petalColor;
  }
  if (alpha < .02) discard;
  gl_FragColor = vec4(finish(color * lit, vDepth), alpha);
}
`,ld=`
${Qu}
attribute float aSide;
attribute vec4 aSeed;
uniform float uDay;
varying vec2 vUv;
varying float vKind;
varying float vDepth;
vec3 path(float t, vec4 s){
  float id = s.x * 50.;
  float lane = sin(t * .37 + id) * .6 + sin(t * .91 + id * 2.3) * .25;
  float d = 4.5 + 9. * (.5 + .5 * sin(t * .23 + id * 1.7));
  vec2 root = vec2(lane * d * uHalfWidth, uCamZ - d);
  float y = max(terrain(root), ${qu.toFixed(2)}) + .55 + .3 * sin(t * 1.3 + id) + .08 * sin(t * 7.1 + id);
  return vec3(root.x, y, root.y);
}
void main(){
  float t = uTime * (.55 + .2 * aSeed.y) + aSeed.x * 40.;
  vec3 center = path(t, aSeed);
  vec3 ahead = path(t + .05, aSeed);
  vec3 fwd = normalize(vec3(ahead.x - center.x, 0., ahead.z - center.z) + vec3(1e-4, 0., 0.));
  vec3 right = normalize(cross(fwd, vec3(0., 1., 0.)));
  float glide = smoothstep(-.2, .6, sin(uTime * .9 + aSeed.x * 20.));
  float flap = mix(.15, sin(uTime * (15. + aSeed.z * 6.) + aSeed.x * 9.) * .95, glide) + .25;
  float size = .09 + .03 * aSeed.w;
  float span = position.x * size;
  vec3 p = center + right * aSide * cos(flap) * span + vec3(0., 1., 0.) * sin(flap) * span + fwd * position.y * size;
  vUv = vec2(position.x, position.y);
  vKind = aSeed.w < .5 ? 0. : aSeed.w < .8 ? 1. : 2.;
  vec4 view = viewMatrix * vec4(p, 1.);
  vDepth = -view.z;
  gl_Position = uDay > .05 ? projectionMatrix * view : vec4(2., 2., 2., 1.);
}
`,ud=`
${$u}
varying vec2 vUv;
varying float vKind;
varying float vDepth;
void main(){
  vec2 p = vUv;
  float fore = length((p - vec2(.48, .2)) / vec2(.52, .3));
  float hind = length((p - vec2(.34, -.2)) / vec2(.38, .28));
  float e = min(fore, hind);
  if (e > 1.) discard;
  float border = smoothstep(.68, .86, e);
  float vein = smoothstep(.06, .0, abs(sin(atan(p.y, p.x - .02) * 7.))) * (1. - border) * step(.12, p.x);
  vec3 base = vKind == 0. ? vec3(.95, .55, .15) : vKind == 1. ? vec3(.96, .94, .86) : vec3(.45, .64, .95);
  vec3 edgeCol = vKind == 1. ? vec3(.55, .55, .5) : vec3(.07, .05, .05);
  float edgeAmount = vKind == 1. ? border * step(.0, p.y) * .6 : border;
  vec3 color = mix(base, edgeCol, edgeAmount);
  color = mix(color, edgeCol, vein * (vKind == 1. ? .2 : .85));
  float spots = smoothstep(.35, .2, length(fract(vec2(atan(p.y, p.x) * 3.2, e * 7.)) - .5)) * border;
  color = mix(color, vec3(.97), spots * (vKind == 1. ? 0. : .9));
  if (p.x < .045) color = vec3(.1, .07, .05);
  gl_FragColor = vec4(finish(color * (ambientLight() + uSun * uLight * 1.1), vDepth), 1.);
}
`,dd=`
${Qu}
attribute vec4 aSeed;
uniform float uNight;
varying float vGlow;
void main(){
  float depth;
  float s = aSeed.z * 40.;
  vec2 root = rootFrom(vec2(aSeed.x * .85, .15 + aSeed.y * .6), depth);
  root += vec2(sin(uTime * .23 + s), cos(uTime * .19 + s * 1.3)) * .9;
  float y = max(terrain(root), ${qu.toFixed(2)}) + .3 + fract(aSeed.w * 3.) * 1.1 + sin(uTime * .7 + s) * .18;
  vec4 view = viewMatrix * vec4(root.x, y, root.y, 1.);
  gl_Position = projectionMatrix * view;
  float blink = smoothstep(.35, 1., sin(uTime * (.6 + fract(aSeed.w * 7.) * .7) + s));
  vGlow = blink * uNight;
  gl_PointSize = min(vGlow * .12 * uScreen / -view.z, uScreen * .02);
}
`,fd=`
uniform vec3 uGlowColor;
varying float vGlow;
void main(){
  float r = length(gl_PointCoord - .5) * 2.;
  if (r > 1.) discard;
  float glow = (exp(-r * r * 22.) + (1. - r) * (1. - r) * .32) * vGlow;
  gl_FragColor = vec4(uGlowColor, glow);
}
`,pd=`
uniform vec4 uLight4;
uniform float uNight;
uniform float uScreen;
uniform float uGlowSize;
varying float vGlow;
void main(){
  vec4 view = viewMatrix * vec4(uLight4.xyz, 1.);
  gl_Position = projectionMatrix * view;
  vGlow = uLight4.w * uNight;
  gl_PointSize = min(vGlow * uGlowSize * uScreen / -view.z, uScreen * .06);
}
`,md=`
uniform sampler2D tDepth;
uniform float uNearPlane;
uniform float uFarPlane;
uniform float uAperture;
uniform float uFocus;
uniform float uMaxCoc;
uniform vec2 uTexel;
float viewDepth(vec2 uv){
  float z = texture2D(tDepth, uv).x;
  return uNearPlane * uFarPlane / (uFarPlane - z * (uFarPlane - uNearPlane));
}
float coc(float d){ return min(uAperture * abs(d - uFocus) / d, uMaxCoc); }
`,hd=`
varying vec2 vUv;
void main(){ vUv = position.xy * .5 + .5; gl_Position = vec4(position.xy, 0., 1.); }
`,gd=`
${md}
varying vec2 vUv;
void main(){
  float m = 0.;
  for (int y = -3; y <= 3; y++) for (int x = -3; x <= 3; x++) {
    vec2 uv = vUv + vec2(float(x), float(y)) * uTexel * uMaxCoc / 3.;
    float d = viewDepth(uv);
    if (d < uFocus) m = max(m, coc(d));
  }
  gl_FragColor = vec4(m / uMaxCoc, 0., 0., 1.);
}
`,_d=`
${md}
uniform sampler2D tColor;
uniform sampler2D tNear;
varying vec2 vUv;
void main(){
  float cd = viewDepth(vUv);
  float cc = coc(cd);
  float R = max(cc, texture2D(tNear, vUv).r * uMaxCoc);
  vec4 centre = texture2D(tColor, vUv);
  if (R < .75) { gl_FragColor = centre; return; }
  const int N = 44;
  float area = R * R / float(N);
  vec4 bg = centre / max(cc * cc, .25);
  float bgW = 1. / max(cc * cc, .25);
  vec4 fg = vec4(0.);
  float fgW = 0.;
  for (int i = 0; i < N; i++) {
    float fi = float(i) + .5;
    float r = R * sqrt(fi / float(N));
    float a = fi * 2.39996;
    vec2 uv = vUv + vec2(cos(a), sin(a)) * r * uTexel;
    float td = viewDepth(uv);
    float tc = coc(td);
    vec4 c = texture2D(tColor, uv);
    if (td < cd - .3) {
      float w = clamp(tc - r + 1., 0., 1.) * area / max(tc * tc, .25);
      fg += c * w;
      fgW += w;
    } else {
      float reach = min(tc, cc);
      float w = clamp(reach - r + 1., 0., 1.) * area / max(reach * reach, .25);
      bg += c * w;
      bgW += w;
    }
  }
  vec4 back = bg / max(bgW, 1e-4);
  vec4 front = fg / max(fgW, 1e-4);
  gl_FragColor = mix(back, front, clamp(fgW, 0., 1.));
}
`,vd=`
${md}
${_n}
${Qu}
uniform mat4 uProjInv;
uniform mat4 uCamWorld;
vec3 worldAt(vec2 uv){
  vec4 v = uProjInv * vec4(uv * 2. - 1., texture2D(tDepth, uv).x * 2. - 1., 1.);
  return (uCamWorld * vec4(v.xyz / v.w, 1.)).xyz;
}
uniform vec4 uViewport;
uniform float uPixelRatio;
uniform vec4 uRainA;
uniform vec4 uRainB;
uniform sampler2D tColor;
uniform sampler2D tBlur;
uniform sampler2D tNear;
varying vec2 vUv;
void main(){
  float amount = max(coc(viewDepth(vUv)), texture2D(tNear, vUv).r * uMaxCoc);
  vec4 sharp = texture2D(tColor, vUv);
  vec4 soft = texture2D(tBlur, vUv);
  // Small blur stays at full resolution; the half-res layer takes over only
  // where the softness is clearly visible.
  vec4 color = mix(sharp, soft, smoothstep(1.4, 3.4, amount));
  // A gentle, narrow softening where the water meets the bank. Only the water
  // and the wet soil are touched (never the upright grass), so the edge melts
  // without smearing blades into flat sheets.
  vec3 w = worldAt(vUv);
  float shore = (1. - smoothstep(.0, .13, abs(terrain(w.xz) - ${qu.toFixed(2)}))) * (1. - smoothstep(${qu.toFixed(2)} + .05, ${qu.toFixed(2)} + .16, w.y));
  if (shore > .01) {
    vec4 sum = vec4(0.);
    float radius = 3.2 * uPixelRatio;
    for (int i = 0; i < 12; i++) {
      float fi = float(i) + .5;
      float a = fi * 2.39996;
      sum += texture2D(tColor, vUv + vec2(cos(a), sin(a)) * radius * sqrt(fi / 12.) * uTexel);
    }
    color = mix(color, sum / 12., shore * .9);
    // A soft, slightly darker meeting line, like wet ground in shade.
    color.rgb *= 1. - shore * .16;
  }
  // The page's rain continues over the land, in exactly the sky's pattern.
  if (uRainA.y > .001) {
    vec2 view = (gl_FragCoord.xy / uPixelRatio + uViewport.xy) / uViewport.zw;
    float streak = rainStreaks(vec2(view.x * uRainB.w, view.y), uRainA.x, uRainA.y, uRainA.z, uRainA.w, uRainB.x, uRainB.y);
    color.rgb = mix(color.rgb, rainColor(uRainB.z) * color.a, streak * color.a);
  }
  gl_FragColor = color;
}
`,yd=`
uniform mat4 uTextureMatrix;
varying vec3 vWorld;
varying vec4 vMirror;
varying float vDepth;
void main(){
  vec4 world = modelMatrix * vec4(position, 1.);
  vWorld = world.xyz;
  vMirror = uTextureMatrix * world;
  vec4 view = viewMatrix * world;
  vDepth = -view.z;
  gl_Position = projectionMatrix * view;
}
`,bd=`
${Qu}
${$u.replace(`uniform float uRain;
`,``)}
uniform sampler2D uReflection;
uniform sampler2D uRipples;
uniform vec4 uRipple;
uniform vec2 uRippleTexel;
uniform vec3 uSkyTop;
uniform vec3 uSkyBottom;
varying vec3 vWorld;
varying vec4 vMirror;
varying float vDepth;
float wavelets(vec2 p){
  vec2 drift = uWindDir * uTime;
  return noise(p * 2.2 - drift * .55) * .45 + noise(p * 5.3 + vec2(drift.y, -drift.x) * .8) * .35 + noise(p * 11. - drift * 1.6) * .2;
}
float rippleAt(vec2 uv){ return texture2D(uRipples, uv).r * 2. - 1.; }
void main(){
  vec2 p = vWorld.xz;
  float bed = terrain(p);
  float depthW = ${qu.toFixed(2)} - bed;
  if (depthW < -.01) discard;
  // Wind wavelets: barely there on a calm day, a fine shiver in a breeze.
  float e = .04;
  float h0 = wavelets(p);
  float strength = .004 + uWind * .022 + uRain * .03;
  vec2 slope = vec2(wavelets(p + vec2(e, 0.)) - h0, wavelets(p + vec2(0., e)) - h0) / e * strength;
  // Ripples from the simulation, sampled exactly where they were made.
  vec2 ruv = (p - uRipple.xy) / uRipple.zw;
  float inside = step(0., ruv.x) * step(ruv.x, 1.) * step(0., ruv.y) * step(ruv.y, 1.);
  vec2 rs = vec2(rippleAt(ruv + vec2(uRippleTexel.x, 0.)) - rippleAt(ruv - vec2(uRippleTexel.x, 0.)),
                 rippleAt(ruv + vec2(0., uRippleTexel.y)) - rippleAt(ruv - vec2(0., uRippleTexel.y)));
  slope += rs * .9 * inside;
  vec3 n = normalize(vec3(-slope.x, 1., -slope.y));
  vec3 v = normalize(cameraPosition - vWorld);
  // Planar reflection, bent by the surface.
  // Near the bank the mirror is calm and clear; it softens further out.
  float calm = smoothstep(.02, .35, depthW);
  vec2 uv = vMirror.xy / vMirror.w + n.xz * vec2(.02, .035) * calm;
  vec2 edge = smoothstep(vec2(0.), vec2(.04), uv) * smoothstep(vec2(1.), vec2(.96), uv);
  vec2 blur = vec2(.6, 1.) * (1. + 2. * calm) / vec2(textureSize(uReflection, 0));
  vec4 mirrored = (texture2D(uReflection, clamp(uv + blur * vec2(-1., -1.), 0., 1.)) + texture2D(uReflection, clamp(uv + blur * vec2(1., -1.), 0., 1.))
    + texture2D(uReflection, clamp(uv + blur * vec2(-1., 1.), 0., 1.)) + texture2D(uReflection, clamp(uv + blur, 0., 1.))) * .25 * edge.x * edge.y;
  float skyH = clamp(uv.y, 0., 1.);
  // A pond tinted by its green banks reflects a softer, greener sky.
  // The open water mirrors the real sky colour (blue by day, peach at dusk).
  vec3 sky = mix(uSkyBottom, uSkyTop, smoothstep(.0, 1., skyH) * .75) * (1. - uRain * .25);
  vec3 reflection = mix(sky, mirrored.rgb, mirrored.a);
  // Lights reflected in rippling water stretch into soft vertical streaks.
  vec3 streak = vec3(0.);
  for (int k = 1; k <= 6; k++) {
    float o = float(k) * .006 * (1. + calm);
    streak += max(texture2D(uReflection, clamp(uv + vec2(0., o), 0., 1.)).rgb - .25, 0.) + max(texture2D(uReflection, clamp(uv - vec2(0., o), 0., 1.)).rgb - .25, 0.);
  }
  reflection += streak * .06 * uNight;
  // Rain scatters the mirror into a dull, broken sheen.
  reflection = mix(reflection, mix(sky, reflection, .5) * .9, uRain * .45);
  float cosV = max(dot(n, v), 0.);
  float fresnel = mix(.55, .95, pow(1. - cosV, 3.));
  // Right at the bank the still water mirrors the grass cleanly.
  fresnel = mix(.94, fresnel, smoothstep(.0, .3, depthW));
  vec3 body = mix(vec3(.22, .36, .2), vec3(.08, .17, .14), clamp(depthW / .7, 0., 1.));
  body *= ambientLight() * 1.4 + uSun * uLight * .55 + nightLights(vWorld, n) * .6;
  body = 1. - exp(-body * 1.35);
  vec3 color = mix(body, reflection, fresnel);
  // Sun glints: the sun sits behind the meadow, so it sparkles back at us.
  vec3 r = reflect(-v, n);
  float glint = pow(max(dot(r, uSunDir), 0.), 220.) * 1.1 + pow(max(dot(r, uSunDir), 0.), 24.) * .05;
  color += uSun * uLight * glint * (1. - uRain * .7);
  // Small sparkles where wavelets catch the sun.
  float facet = noise(p * 46. + uWindDir * uTime * 1.3) * noise(p * 23. - uTime * .4);
  color += vec3(1., .98, .9) * pow(facet, 9.) * 1.5 * uLight * (1. - uRain * .8) * (.4 + uWind);
  // Only a faint darkening where grass meets water.
  color *= mix(.92, 1., smoothstep(0., .05, depthW));
  // Mostly opaque: the bank shows only faintly just below the surface.
  float alpha = smoothstep(0., .045, depthW) * mix(.78, .97, smoothstep(.04, .3, depthW));
  float air = (1. - exp(-max(vDepth - 18., 0.) * .03)) * .72;
  // The lantern over the pond: its mirror image in the water, broken up by the
  // ripples and wavelets, plus a faint warm sheen under the pointer.
  {
    vec3 toL = uPointer.xyz - vWorld;
    float dL = length(toL);
    vec3 Ld = toL / max(dL, .001);
    float align = max(dot(reflect(-v, n), Ld), 0.);
    float lanternRefl = pow(align, 220.) * 1.1 + pow(align, 34.) * .22 + pow(align, 7.) * .035;
    float lanternFall = 1. / (1. + dL * dL * 1.4);
    vec2 q = vWorld.xz - uPointer.xz;
    float sheen = exp(-dot(q, q) / .5) * .035;
    color += vec3(1., .86, .6) * uPointer.w * uNight * (lanternRefl * lanternFall + sheen) * (1. - uRain * .5);
  }
  gl_FragColor = vec4(mix(color, uHaze, air), alpha);
}
`,xd=`
${Qu}
attribute vec4 aSeed;
uniform vec3 uCamRight;
varying vec2 vUv;
varying float vFade;
void main(){
  float depth = 1.2 + 6. * aSeed.y * aSeed.y;
  vec2 xz = vec2(aSeed.x * (depth * uHalfWidth + .5), uCamZ - depth);
  float speed = 7. + 3. * aSeed.z;
  float span = 5.;
  float fall = fract(aSeed.w * 13.1 + uTime * speed / span);
  float floorY = max(terrain(xz), ${qu.toFixed(2)});
  float y = floorY + span * (1. - fall);
  vec2 drift = uWindDir * (.6 + uWind * 1.6);
  vec3 head = vec3(xz.x + drift.x * (1. - fall) * .9, y, xz.y);
  vec3 dir = normalize(vec3(-drift.x * .12, -1., 0.));
  float len = .1 + .06 * aSeed.z;
  float width = .007 + .003 * depth / 7.;
  vec3 pos = head - dir * len * position.y + uCamRight * position.x * width;
  vUv = position.xy;
  vFade = step(aSeed.w, uRain * .8) * smoothstep(0., .08, fall);
  vec4 view = viewMatrix * vec4(pos, 1.);
  gl_Position = vFade > 0. ? projectionMatrix * view : vec4(2., 2., 2., 1.);
}
`,Sd=`
uniform vec3 uSkyTop;
uniform float uLight;
varying vec2 vUv;
varying float vFade;
void main(){
  float a = (1. - abs(vUv.x) * 2.) * smoothstep(0., .4, vUv.y) * smoothstep(1., .6, vUv.y);
  gl_FragColor = vec4(vec3(.72, .80, .87) * (.42 + .58 * clamp(uLight, 0., 1.)), a * vFade * .32);
}
`,Cd=`
attribute float aSide;
attribute vec4 aState;   // position xyz, heading
attribute vec4 aLook;    // flap phase, size, kind, visibility
uniform float uTime;
varying vec2 vUv;
varying float vKind;
varying float vDepth;
void main(){
  vec3 fwd = vec3(cos(aState.w), 0., sin(aState.w));
  vec3 right = normalize(cross(fwd, vec3(0., 1., 0.)));
  float flap = sin(uTime * 17. + aLook.x) * .95 + .25;
  float size = aLook.y * aLook.w;
  float span = position.x * size;
  vec3 p = aState.xyz + right * aSide * cos(flap) * span + vec3(0., 1., 0.) * sin(flap) * span + fwd * position.y * size;
  vUv = position.xy;
  vKind = aLook.z;
  vec4 view = viewMatrix * vec4(p, 1.);
  vDepth = -view.z;
  gl_Position = aLook.w > .02 ? projectionMatrix * view : vec4(2., 2., 2., 1.);
}
`,wd=`
attribute vec4 aGlow;    // position xyz, brightness
uniform float uTime;
uniform float uScreen;
varying float vGlow;
void main(){
  vec4 view = viewMatrix * vec4(aGlow.xyz, 1.);
  gl_Position = projectionMatrix * view;
  vGlow = aGlow.w;
  gl_PointSize = min(vGlow * .14 * uScreen / -view.z, uScreen * .025);
}
`;function Td(e,t){let n=parseInt(String(e).replace(`#`,``),16);return t.set((n>>16&255)/255,(n>>8&255)/255,(n&255)/255)}function Ed(e){let light=Number.isFinite(e?.light)?e.light:.5,cloud=Number.isFinite(e?.cloud)?e.cloud:.2,rain=Number.isFinite(e?.rain)?e.rain:0,effLight=light*(1-cloud*.22-rain*.14);return{light:effLight,night:Math.max(0,Math.min(1,(.45-effLight)/.3)),day:Math.max(0,Math.min(1,(effLight-.55)/.25))*(1-Math.min(1,rain*2)),sun:Td(e?.glow||"#3a4b68",new Re),haze:Td(e?.bottom||"#2b3b56",new Re),skyTop:Td(e?.top||"#172340",new Re),rain:Math.min(1,rain),wind:Math.min(1.2,((e?.wind??5)/24)+rain*.15),gust:Math.min(1.2,((e?.windGust??e?.wind??5)/34)),windAngle:Math.atan2(.35,e?.windX??1)}}function Dd(e){let t=((e.sunX??.72)-.5)*2.6,n=Math.max(4,Math.min(70,e.solarAltitude??20))*Math.PI/180;return new Re(Math.cos(n)*Math.sin(t),Math.sin(n),-Math.cos(n)*Math.cos(t)).normalize()}function Od(e,t){let n=new Float32Array(e*4),r=t>>>0,i=()=>(r=r*1664525+1013904223>>>0)/4294967296;for(let e=0;e<n.length;e++)n[e]=i();for(let t=0;t<e;t++)n[t*4]=n[t*4]*2-1;return n}function kd(e,{settings:t,paused:n=!1,reduced:r=!1,surface:i}){let a=new Gt({canvas:e,antialias:!1,alpha:!0,powerPreference:`high-performance`});a.setClearColor(0,0);let o=new ut,s=new cn(34,1,.1,160);s.position.copy(Uu),s.lookAt(Wu),s.updateMatrixWorld();let c=Ed(t),l=c.windAngle,u=Gu.cols*Gu.rows,d=new Uint8Array(u*4).fill(128),f=new pn(d,Gu.cols,Gu.rows,ct);f.magFilter=f.minFilter=bt,f.colorSpace=``,f.needsUpdate=!0;let p=new Uint8Array(Ju.cols*Ju.rows*4).fill(255),m=Dd(t);function h(e){let t=Math.max(Math.hypot(e.x,e.z),.001),n=e.y/t,r=e.x/t,i=e.z/t,a=new Float32Array(Ju.cols*Ju.rows);for(let e=0;e<Ju.rows;e++)for(let t=0;t<Ju.cols;t++){let o=Gu.x+(t+.5)/Ju.cols*Gu.w,s=Gu.z+(e+.5)/Ju.rows*Gu.d,c=Math.max(Yu(o,s),qu),l=1;for(let e=.35;e<26;e*=1.12){let t=Yu(o+r*e,s+i*e)-(c+n*e);if(t>0&&(l=Math.min(l,1-Math.min(1,t/.35)),!l))break}a[e*Ju.cols+t]=l}for(let e=0;e<3;e++){let e=a.slice();for(let t=1;t<Ju.rows-1;t++)for(let n=1;n<Ju.cols-1;n++){let r=t*Ju.cols+n;a[r]=(e[r]*4+e[r-1]+e[r+1]+e[r-Ju.cols]+e[r+Ju.cols])/8}}for(let e=0;e<a.length;e++)p[e*4]=a[e]*255}h(m);let g=new pn(p,Ju.cols,Ju.rows,ct);g.magFilter=g.minFilter=bt,g.colorSpace=``,g.needsUpdate=!0;let _={uTime:{value:0},uShadow:{value:g},uRain:{value:c.rain},uMirror:{value:0},uBank:{value:0},uWindDir:{value:new dt(Math.cos(l),Math.sin(l))},uWind:{value:c.wind},uGust:{value:c.gust},uField:{value:new Mt(Gu.x,Gu.z,Gu.w,Gu.d)},uTrail:{value:f},uHalfWidth:{value:1},uCamZ:{value:Uu.z},uLight:{value:c.light},uNight:{value:c.night},uDay:{value:c.day},uSun:{value:c.sun.clone()},uHaze:{value:c.haze.clone()},uSunDir:{value:m.clone()},uScreen:{value:600},uPointer:{value:new Mt(0,0,0,0)}};_.uSunDirV=_.uSunDir;let v=[f,g],y=m.clone(),b=m.clone(),x=0;function S(){x||b.angleTo(y)<.05||(x=(window.requestIdleCallback||(e=>setTimeout(e,200)))(()=>{x=0,_n&&(b=y.clone(),h(b),g.needsUpdate=!0,Dn())},{timeout:2e3}))}function C(e,t,n){return e.frustumCulled=!1,o.add(e),v.push(t,n),e}let w=1024;function T(e,t,n,r){let i=Math.ceil(n/w),o=new Float32Array(w*i*4);o.set(t);let s=new pn(o,w,i,ct,Ge);s.magFilter=s.minFilter=nn,s.needsUpdate=!0;let c=new en(w,i,{count:3,type:Ge,format:ct,minFilter:nn,magFilter:nn,depthBuffer:!1,generateMipmaps:!1}),l=new Ht({glslVersion:st,uniforms:{..._,uSeeds:{value:s},uBakeBank:{value:r}},vertexShader:nd,fragmentShader:rd}),u=new Float32Array(n*2);for(let e=0;e<n;e++)u[e*2]=(e%w+.5)/w,u[e*2+1]=(Math.floor(e/w)+.5)/i;return e.setAttribute(`aBake`,new rt(u,2)),v.push(s,c,l),{uniforms:{uBake0:{value:c.textures[0]},uBake1:{value:c.textures[1]},uBake2:{value:c.textures[2]}},run(){vt.material=l,a.setRenderTarget(c),a.render(vt,yt),a.setRenderTarget(null)}}}let E=new Ot(170,110,170,110);E.rotateX(-Math.PI/2);let D=new Mt(Q.x,Q.z,Q.w,Q.d),O=new Je({uniforms:{..._,uPatch:{value:D},uFine:{value:0}},vertexShader:ad,fragmentShader:od,side:2}),k=C(new Nt(E,O),E,O);k.position.z=-48;let A=new Ot(Q.w,Q.d,Q.w*20,Q.d*20);A.rotateX(-Math.PI/2);let j=new Je({uniforms:{..._,uPatch:{value:D},uFine:{value:1}},vertexShader:ad,fragmentShader:od,side:2}),M=C(new Nt(A,j),A,j);M.position.set(Q.x+Q.w/2,0,Q.z+Q.d/2);let N=e.clientWidth<700,P=new at,F=[],I=[];for(let e=0;e<=4;e++){let t=e/4,n=(1-t)**.75*.5;F.push(-n,t,0,n,t,0),e<4&&I.push(e*2,e*2+1,e*2+2,e*2+1,e*2+3,e*2+2)}P.setAttribute(`position`,new mt(F,3)),P.setIndex(I);let L=N?8e4:17e4,R=Od(L,7);P.setAttribute(`aSeed`,new rt(R,4)),P.instanceCount=L;let z=a.capabilities.isWebGL2&&a.extensions.has(`EXT_color_buffer_float`),B=z&&T(P,R,L,0),V=new Je({uniforms:{..._,...B?.uniforms},defines:z?{BAKED:``}:{},vertexShader:td,fragmentShader:id,side:2});C(new Nt(P,V),P,V);let H=new at;H.setAttribute(`position`,P.getAttribute(`position`)),H.setIndex(P.getIndex());let ee=N?18e3:4e4,te=Od(ee,77);H.setAttribute(`aSeed`,new rt(te,4)),H.instanceCount=ee;let ne=z&&T(H,te,ee,1),re=new Je({uniforms:{..._,uBank:{value:1},...ne?.uniforms},defines:z?{BAKED:``}:{},vertexShader:td,fragmentShader:id,side:2});C(new Nt(H,re),H,re);let U=new at;U.setAttribute(`position`,new mt([-.5,0,0,.5,0,0,-.5,.5,0,.5,.5,0,-.5,1,0,.5,1,0,-.5,-.5,0,.5,-.5,0,-.5,.5,0,.5,.5,0],3)),U.setAttribute(`aPart`,new mt([0,0,0,0,0,0,1,1,1,1],1)),U.setIndex([0,1,2,1,3,2,2,3,4,3,5,4,6,7,8,7,9,8]);let ie=N?1400:3200;U.setAttribute(`aSeed`,new rt(Od(ie,91),4)),U.instanceCount=ie;let ae=new Je({uniforms:_,vertexShader:sd,fragmentShader:cd,side:2,transparent:!0});C(new Nt(U,ae),U,ae);let W=new at;W.setAttribute(`position`,new mt([0,-.5,0,1,-.5,0,0,.5,0,1,.5,0,0,-.5,0,1,-.5,0,0,.5,0,1,.5,0],3)),W.setAttribute(`aSide`,new mt([1,1,1,1,-1,-1,-1,-1],1)),W.setIndex([0,1,2,1,3,2,4,6,5,5,6,7]);let oe=N?3:5;W.setAttribute(`aSeed`,new rt(Od(oe,57).map(Math.abs),4)),W.instanceCount=oe;let G=new Je({uniforms:_,vertexShader:ld,fragmentShader:ud,side:2});C(new Nt(W,G),W,G);let se=(e,t,n={})=>new Je({uniforms:{..._,uGlowColor:{value:new Re(...t)},...n},vertexShader:e,fragmentShader:fd,transparent:!0,depthWrite:!1,blending:2}),ce=new Xt,le=N?40:80;ce.setAttribute(`position`,new mt(new Float32Array(le*3),3)),ce.setAttribute(`aSeed`,new mt(Od(le,23),4));let K=se(dd,[.86,1,.45]);C(new pt(ce,K),ce,K);let ue=new Xt;ue.setAttribute(`position`,new mt([0,0,0],3));let de=se(pd,[1,.94,.72],{uLight4:_.uPointer,uGlowSize:{value:.32}});C(new pt(ue,de),ue,de).renderOrder=20;let fe=Array.from({length:36},()=>({age:1,life:1,pos:new Re,vel:new Re,phase:0,size:0,kind:0,night:!1})),pe=new Float32Array(288),me=new Float32Array(288),he=new Float32Array(144),ge=new at;ge.setAttribute(`position`,W.getAttribute(`position`)),ge.setIndex([0,1,2,1,3,2]);let _e=new Float32Array(72).map((e,t)=>t%2?-1:1);ge.setAttribute(`aSide`,new rt(_e,1));let ve=new rt(pe,4).setUsage(He),ye=new rt(me,4).setUsage(He);ge.setAttribute(`aState`,ve),ge.setAttribute(`aLook`,ye),ge.instanceCount=72;let be=new Je({uniforms:_,vertexShader:Cd,fragmentShader:ud,side:2});C(new Nt(ge,be),ge,be);let xe=new Xt;xe.setAttribute(`position`,new mt(new Float32Array(108),3));let Se=new mt(he,4).setUsage(He);xe.setAttribute(`aGlow`,Se);let Ce=se(wd,[.86,1,.48]);C(new pt(xe,Ce),xe,Ce);let we=!1;function Te(e){let t=_.uRain.value,n=_.uNight.value>.5,r=(n?6:4)*(1-t*.9),i=Math.floor(r)+ +(Math.random()<r%1);for(let t=0;t<i;t++){let t=fe.find(e=>e.age>=e.life);if(!t)break;let r=Math.random()*Math.PI*2,i=.35+Math.random()*.5;t.pos.set(e.x+Math.cos(r)*.15,e.y+.3,e.z+Math.sin(r)*.15),t.vel.set(Math.cos(r)*i*(n?1.6:1),(n?1.3:.9)+Math.random()*.6,Math.sin(r)*i*(n?1.6:1)),t.age=0,t.life=n?4+Math.random()*3:3+Math.random()*2.5,t.phase=Math.random()*20,t.size=.1+Math.random()*.04,t.kind=Math.floor(Math.random()*3),t.night=n}i&&(we=!0)}function Ee(e){if(!we)return;let t=!1;fe.forEach((n,r)=>{n.age+=e;let i=n.age<n.life,a=i?Math.min(1,n.age/.25)*(1-Math.max(0,(n.age/n.life-.7)/.3)):0;if(i){t=!0;let r=n.age+n.phase;n.vel.y+=((n.night?.3:.25)-n.vel.y)*Math.min(1,e*1.2),n.vel.x+=Math.sin(r*(n.night?2.4:4.1))*e*(n.night?1.2:1.6),n.vel.z+=Math.cos(r*(n.night?2.1:3.7))*e*(n.night?1.2:1.6),n.vel.y+=Math.sin(r*6.3)*e*(n.night?.2:1.2),n.pos.addScaledVector(n.vel,e)}let o=Math.atan2(n.vel.z,n.vel.x);for(let e of[0,1]){let t=(r*2+e)*4;pe.set([n.pos.x,n.pos.y,n.pos.z,o],t),me.set([n.phase,n.size,n.kind,n.night?0:a],t)}let s=.55+.45*Math.sin(n.age*5+n.phase);he.set([n.pos.x,n.pos.y,n.pos.z,n.night?a*s:0],r*4)}),ve.needsUpdate=ye.needsUpdate=Se.needsUpdate=!0,we=t}let De=new en(1,1),Oe=s.clone(),ke=new Le,Ae=Q.cols*Q.rows,je=new Float32Array(Ae),Me=new Float32Array(Ae),Ne=new Uint8Array(Ae*4).fill(128),Pe=new pn(Ne,Q.cols,Q.rows,ct);Pe.magFilter=Pe.minFilter=bt,Pe.colorSpace=``,Pe.needsUpdate=!0,v.push(De,Pe);let Fe={..._,uReflection:{value:De.texture},uTextureMatrix:{value:ke},uRipples:{value:Pe},uRipple:{value:new Mt(Q.x,Q.z,Q.w,Q.d)},uRippleTexel:{value:new dt(1/Q.cols,1/Q.rows)},uSkyTop:{value:c.skyTop.clone()},uSkyBottom:_.uHaze},Ie=new Ot(Q.w+2,Q.d+2);Ie.rotateX(-Math.PI/2);let ze=new Je({uniforms:Fe,vertexShader:yd,fragmentShader:bd,transparent:!0}),Be=C(new Nt(Ie,ze),Ie,ze);Be.position.set(Q.x+Q.w/2,qu,Q.z+Q.d/2);let Ve=new at;Ve.setAttribute(`position`,new mt([-.5,0,0,.5,0,0,-.5,1,0,.5,1,0],3)),Ve.setIndex([0,1,2,1,3,2]);let Ue=N?260:600,We=Od(Ue,131);for(let e=0;e<Ue;e++)We[e*4+3]=Math.abs(We[e*4+3]);Ve.setAttribute(`aSeed`,new rt(We,4)),Ve.instanceCount=Ue;let Ke=new Je({uniforms:{..._,uCamRight:{value:new Re().setFromMatrixColumn(s.matrixWorld,0)},uSkyTop:Fe.uSkyTop},vertexShader:xd,fragmentShader:Sd,transparent:!0,depthWrite:!1}),qe=C(new Nt(Ve,Ke),Ve,Ke);function Ye(){Oe.copy(s),Oe.position.set(Uu.x,2*qu-Uu.y,Uu.z),Oe.up.set(0,1,0),Oe.lookAt(Wu.x,2*qu-Wu.y,Wu.z),Oe.updateMatrixWorld(),Oe.updateProjectionMatrix(),ke.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),ke.multiply(Oe.projectionMatrix).multiply(Oe.matrixWorldInverse)}let Xe=0,Ze=0;function Qe(e,t,n,r){let i=(e-Q.x)/Q.w*Q.cols,a=(t-Q.z)/Q.d*Q.rows,o=r/Q.w*Q.cols,s=r/Q.d*Q.rows;for(let e=Math.max(1,Math.floor(a-s));e<=Math.min(Q.rows-2,Math.ceil(a+s));e++)for(let t=Math.max(1,Math.floor(i-o));t<=Math.min(Q.cols-2,Math.ceil(i+o));t++){let r=Math.hypot((t-i)/o,(e-a)/s);r<1&&(je[e*Q.cols+t]-=n*(.5+.5*Math.cos(r*Math.PI)))}Xe=1}let $e=(e,t)=>Yu(e,t)<-.12000000000000001&&e>Q.x&&e<Q.x+Q.w&&t>Q.z&&t<Q.z+Q.d;function et(e){Ze+=e;let t=0;for(;Ze>1/50&&t<3;){if(Ze-=1/50,t++,Xe<.0015)continue;let e=Q.cols,n=0;for(let t=1;t<Q.rows-1;t++)for(let r=1;r<e-1;r++){let i=t*e+r,a=((je[i-1]+je[i+1]+je[i-e]+je[i+e])/2-Me[i])*.982;Me[i]=a;let o=a<0?-a:a;o>n&&(n=o)}[je,Me]=[Me,je],Xe=n}if(t){if(Xe<.0015){je.fill(0),Me.fill(0),Ne.fill(128),Pe.needsUpdate=!0;return}for(let e=0;e<Ae;e++)Ne[e*4]=Math.max(0,Math.min(255,128+je[e]*160));Pe.needsUpdate=!0}}let tt=new en(1,1,{samples:4});tt.depthTexture=new Dt(1,1);let nt=new en(1,1),it=new en(1,1),ot={tDepth:{value:tt.depthTexture},uNearPlane:{value:s.near},uFarPlane:{value:s.far},uAperture:{value:3},uFocus:{value:Uu.distanceTo(Zu)},uMaxCoc:{value:12},uTexel:{value:new dt}},lt=(e,t)=>new Je({uniforms:{...ot,...t},vertexShader:hd,fragmentShader:e,depthTest:!1,depthWrite:!1,blending:0}),ft=lt(gd,{}),ht=lt(_d,{tColor:{value:tt.texture},tNear:{value:nt.texture}}),gt=lt(vd,{tColor:{value:tt.texture},tBlur:{value:it.texture},tNear:{value:nt.texture},uViewport:{value:new Mt(0,0,1,1)},uPixelRatio:{value:1},uRainA:{value:new Mt},uRainB:{value:new Mt},uProjInv:{value:s.projectionMatrixInverse},uCamWorld:{value:s.matrixWorld}}),_t=new Ot(2,2),vt=new Nt(_t,ft);vt.frustumCulled=!1;let yt=new Wt(-1,1,1,-1,0,1);v.push(tt,tt.depthTexture,nt,it,ft,ht,gt,_t);let xt=new Float32Array(u),St=new Float32Array(u),Ct=new Float32Array(u),Tt=new Float32Array(u),Et=!1,kt=new Re,At=null;function jt(e,t){let n=t.x-e.x,r=t.z-e.z,i=Math.hypot(n,r);if(i<.001)return;let a=Uu.z-t.z,o=1.6+a*.06,s=Math.min(1,i/(.2+a*.015))*4.2*(1.7-_.uNight.value*.7),c=Gu.w/Gu.cols,l=Gu.d/Gu.rows,u=Math.max(1,Math.floor((Math.min(e.x,t.x)-o-Gu.x)/c)),d=Math.min(Gu.cols-2,Math.ceil((Math.max(e.x,t.x)+o-Gu.x)/c)),f=Math.max(1,Math.floor((Math.min(e.z,t.z)-o-Gu.z)/l)),p=Math.min(Gu.rows-2,Math.ceil((Math.max(e.z,t.z)+o-Gu.z)/l));for(let t=f;t<=p;t++)for(let a=u;a<=d;a++){let u=Gu.x+(a+.5)*c,d=Gu.z+(t+.5)*l,f=Math.max(0,Math.min(1,((u-e.x)*n+(d-e.z)*r)/(i*i))),p=u-(e.x+n*f),m=d-(e.z+r*f),h=Math.hypot(p,m);if(h>o)continue;let g=1-h/o,_=g*g*(3-2*g)*s,v=t*Gu.cols+a;Ct[v]+=(p/(h+.05)*.8+n/i*.45)*_,Tt[v]+=(m/(h+.05)*.8+r/i*.45)*_}Et=!0}function Pt(e){if(!Et)return;let t=e/2,n=6.5,r=Gu.cols,i=0;for(let e=0;e<2;e++){for(let e=r;e<u-r;e++){let i=xt[e-1]+xt[e+1]+xt[e-r]+xt[e+r]-4*xt[e],a=St[e-1]+St[e+1]+St[e-r]+St[e+r]-4*St[e];Ct[e]+=(-5*xt[e]-n*Ct[e]+2*i)*t,Tt[e]+=(-5*St[e]-n*Tt[e]+2*a)*t}for(let e=0;e<u;e++)xt[e]+=Ct[e]*t,St[e]+=Tt[e]*t}for(let e=0;e<u;e++){let t=Math.max(-1.25,Math.min(1.25,xt[e])),n=Math.max(-1.25,Math.min(1.25,St[e]));d[e*4]=128+t*Ku,d[e*4+1]=128+n*Ku,i=Math.max(i,Math.abs(t)+Math.abs(n)+Math.abs(Ct[e])*.2+Math.abs(Tt[e])*.2)}f.needsUpdate=!0,i<.004&&(xt.fill(0),St.fill(0),Ct.fill(0),Tt.fill(0),d.fill(128),Et=!1)}let Ft=new Bt,It=new dt;function Lt(e,t){It.set(e*2-1,1-t*2),Ft.setFromCamera(It,s);let{origin:n,direction:r}=Ft.ray,i=0;for(let e=.3;e<90;e+=.25){let t=n.x+r.x*e,a=n.y+r.y*e,o=n.z+r.z*e;if(a<=Math.max(Yu(t,o),qu)){let t=i,a=e;for(let e=0;e<6;e++){let e=(t+a)/2;n.y+r.y*e<=Math.max(Yu(n.x+r.x*e,n.z+r.z*e),qu)?a=e:t=e}return kt.copy(r).multiplyScalar(a).add(n)}i=e}return null}function Rt(e,t){vt.material=e,a.setRenderTarget(t),a.render(vt,yt)}let zt=0;function Vt(){zt++%tn.reflect===0&&(Be.visible=!1,P.instanceCount=Math.round(rn*.7),_.uMirror.value=1,qe.visible=!1,k.visible=M.visible=!1,a.setRenderTarget(De),a.clear(),a.render(o,Oe),k.visible=M.visible=!0,_.uMirror.value=0,qe.visible=!0,Be.visible=!0),P.instanceCount=rn,a.setRenderTarget(tt),a.clear(),a.render(o,s),Rt(ft,nt),Rt(ht,it),a.setRenderTarget(null),a.clear();let t=e.getBoundingClientRect(),n=gt.uniforms;n.uViewport.value.set(t.left,window.innerHeight-t.bottom,window.innerWidth,window.innerHeight),n.uPixelRatio.value=a.getPixelRatio(),n.uRainA.value.set(bn.time,bn.rain,bn.wind,bn.windX),n.uRainB.value.set(bn.gust,bn.seed,bn.light,window.innerWidth/window.innerHeight),Rt(gt,null),Jt(),Ut--<=0&&qt()}let Ut=0,Kt=null;function qt(){if(Ut=60,Kt)return;let e=a.getContext(),t=e.drawingBufferWidth,n=e.drawingBufferHeight,r=e.createBuffer();e.bindBuffer(e.PIXEL_PACK_BUFFER,r),e.bufferData(e.PIXEL_PACK_BUFFER,48*n*4,e.STREAM_READ);for(let r=0;r<48;r++){let i=Math.min(t-1,Math.round((r+.5)*t/48));e.readPixels(i,0,1,n,e.RGBA,e.UNSIGNED_BYTE,r*n*4)}e.bindBuffer(e.PIXEL_PACK_BUFFER,null),Kt={buffer:r,height:n,fence:e.fenceSync(e.SYNC_GPU_COMMANDS_COMPLETE,0)},e.flush()}function Jt(){if(!Kt)return;let t=a.getContext();if(t.clientWaitSync(Kt.fence,0,0)===t.TIMEOUT_EXPIRED)return;let{buffer:n,height:r,fence:i}=Kt,o=new Uint8Array(48*r*4);t.bindBuffer(t.PIXEL_PACK_BUFFER,n),t.getBufferSubData(t.PIXEL_PACK_BUFFER,0,o),t.bindBuffer(t.PIXEL_PACK_BUFFER,null),t.deleteBuffer(n),t.deleteSync(i),Kt=null;let s=r;for(let e=0;e<48&&s>0;e++){let t=0;for(;t<s&&o[(e*r+t)*4+3]===255;)t++;s=t}r===t.drawingBufferHeight&&vn(e,s/r*.97)}let Yt=new Re,Zt=0,Qt=[{blades:1,bank:1,pixels:32e5,reflect:1},{blades:1,bank:1,pixels:32e5,reflect:2},{blades:.75,bank:.8,pixels:24e5,reflect:2},{blades:.55,bank:.6,pixels:18e5,reflect:2},{blades:.4,bank:.45,pixels:13e5,reflect:2}],$t=0,tn=Qt[0],rn=L,an=1/0,on=0,sn=0,ln=0,un=-1,dn=[],fn=Qt.map(()=>0);function mn(t){$t=t;let n=tn.pixels;tn=Qt[$t],rn=Math.round(L*tn.blades),H.instanceCount=Math.round(ee*tn.bank),e.dataset.quality=$t,tn.pixels!==n&&kn()}function hn(e,t){if(t>2e3){dn.length=0,on=e;return}if(e<on||t<2||(dn.push(t),e-on<1e3))return;on=e;let n=dn.splice(0).sort((e,t)=>e-t);if(n.length<4)return;an=Math.min(an,n[Math.floor(n.length*.1)],1e3/29.5);let r=n.reduce((e,t)=>e+t,0)/n.length,i=n[Math.floor(n.length/2)];sn=r>an*1.25?sn+1:0,ln=i<an*1.1&&r<an*1.2?ln+1:0,sn>=6&&$t<Qt.length-1?(un===$t&&fn[$t]++,sn=ln=0,mn($t+1)):ln>=3&&$t>0&&fn[$t-1]<2&&(ln=sn=0,mn($t-1),un=$t)}let gn=0,_n=!0,yn=!1,xn=n,Sn=r,Cn=0,q=0,wn=0,Tn=6;function En(e){if(gn=0,!_n)return;Cn&&!xn&&!Sn&&hn(e,e-Cn);let t=Cn?Math.min((e-Cn)/1e3,.05):.016;Cn=e;let n=Sn?1:1-Math.exp(-t/.6),r=Sn?1:1-Math.exp(-t/3.5);_.uLight.value+=(c.light-_.uLight.value)*n,_.uNight.value+=(c.night-_.uNight.value)*n,_.uDay.value+=(c.day-_.uDay.value)*n,_.uWind.value+=(c.wind-_.uWind.value)*r,_.uGust.value+=(c.gust-_.uGust.value)*r;let i=Math.atan2(Math.sin(c.windAngle-l),Math.cos(c.windAngle-l));l+=i*r,_.uWindDir.value.set(Math.cos(l),Math.sin(l)),_.uSun.value.lerp(c.sun,n),_.uHaze.value.lerp(c.haze,n),_.uSunDir.value.lerp(y,n).normalize(),Fe.uSkyTop.value.lerp(c.skyTop,n),_.uRain.value=bn.rain;let a=_.uPointer.value,o=1-Math.exp(-t/.12);a.x+=(Yt.x-a.x)*o,a.y+=(Yt.y-a.y)*o,a.z+=(Yt.z-a.z)*o,a.w+=(Zt-a.w)*(1-Math.exp(-t/.35));let s=!xn&&!Sn;if(s){if(q+=t,Pt(t),_.uRain.value>.02)for(wn-=t*(8+_.uRain.value*90);wn<0;){wn+=1;let e=Q.x+Math.random()*Q.w,t=Q.z+Math.random()*Q.d;$e(e,t)&&Qe(e,t,.9+Math.random()*.8,.13+Math.random()*.06)}if(Tn-=t,Tn<0){Tn=9+Math.random()*12;let e=Q.x+Q.w*(.25+Math.random()*.5),t=Q.z+Q.d*(.3+Math.random()*.4);_.uRain.value<.1&&$e(e,t)&&Qe(e,t,1.1,.12)}et(t),Ee(t)}_.uTime.value=q,Vt();let u=Math.abs(c.light-_.uLight.value)>.002||_.uSun.value.distanceTo(c.sun)>.002||_.uHaze.value.distanceTo(c.haze)>.002||Math.abs(Zt-a.w)>.01;yn&&!document.hidden&&(s||u)&&!gn&&(gn=requestAnimationFrame(En))}function Dn(){_n&&yn&&!document.hidden&&!gn&&(Cn=0,dn.length=0,on=performance.now()+3e3,gn=requestAnimationFrame(En))}function On(){cancelAnimationFrame(gn),gn=0}function kn(){let t=e.getBoundingClientRect();if(!t.width||!t.height)return;let n=Math.min(window.devicePixelRatio||1,2,Math.sqrt(tn.pixels/(t.width*t.height)));a.setPixelRatio(n),a.setSize(t.width,t.height,!1);let r=Math.round(t.width*n),i=Math.round(t.height*n);tt.setSize(r,i),nt.setSize(Math.ceil(r/4),Math.ceil(i/4)),it.setSize(Math.ceil(r/2),Math.ceil(i/2)),ot.uTexel.value.set(1/r,1/i),s.aspect=t.width/t.height,s.fov=s.aspect<1.4?46:34,s.updateProjectionMatrix();let o=Math.tan(wt.degToRad(s.fov/2));_.uHalfWidth.value=o*s.aspect*1.08,_.uScreen.value=i/(2*o),B?.run(),ne?.run(),Ut=0,vn(e,0),De.setSize(Math.ceil(r*.75),Math.ceil(i*.75)),zt=0,Ye(),ot.uMaxCoc.value=Math.max(4,i*.014),ot.uAperture.value=ot.uMaxCoc.value/2.2,On(),Dn()}let An=new ResizeObserver(kn);An.observe(e);let jn=new IntersectionObserver(([e])=>{yn=e.isIntersecting,yn?Dn():On()},{rootMargin:`100% 0px`});jn.observe(e);let Mn=()=>{On(),Dn()};document.addEventListener(`visibilitychange`,Mn);let Nn=window.requestIdleCallback||(e=>setTimeout(e,1200)),Pn=window.cancelIdleCallback||clearTimeout,Fn=Nn(async()=>{try{await a.compileAsync(o,s);for(let e of[ft,ht,gt])vt.material=e,await a.compileAsync(vt,yt);_n&&!gn&&Vt()}catch{}},{timeout:4e3});function In(t){if(xn||Sn)return;let n=e.getBoundingClientRect(),r=(t.clientX-n.left)/n.width,i=(t.clientY-n.top)/n.height,a=r>=0&&r<=1&&i>=0&&i<=1?Lt(r,i):null;if(!a){At=null,Zt=0;return}let o=a.clone();$e(o.x,o.z)?t.type===`pointerdown`?Qe(o.x,o.z,2.6,.22):(!At||At.distanceTo(o)>.12)&&Qe(o.x,o.z,.35,.12):(t.type===`pointerdown`&&Te(o),At&&At.distanceTo(o)<6&&jt(At,o)),Zt||_.uPointer.value.set(o.x,o.y+.3,o.z,_.uPointer.value.w),Yt.set(o.x,o.y+.3,o.z),Zt=1,At=o,Dn()}let Ln=()=>{At=null,Zt=0,Dn()},Rn=i||e;return Rn.addEventListener(`pointermove`,In,{passive:!0}),Rn.addEventListener(`pointerdown`,In,{passive:!0}),Rn.addEventListener(`pointerleave`,Ln),Rn.addEventListener(`pointercancel`,Ln),{update(e){let t=Ed(e);Object.assign(c,{light:t.light,night:t.night,day:t.day,wind:t.wind,gust:t.gust,windAngle:t.windAngle,rain:t.rain}),c.sun.copy(t.sun),c.haze.copy(t.haze),c.skyTop.copy(t.skyTop),y.copy(Dd(e)),S(),Dn()},pause(e,t){xn=e,Sn=t,On(),Dn()},dispose(){_n=!1,On(),vn(null,0),Pn(Fn),An.disconnect(),jn.disconnect(),document.removeEventListener(`visibilitychange`,Mn),Rn.removeEventListener(`pointermove`,In),Rn.removeEventListener(`pointerdown`,In),Rn.removeEventListener(`pointerleave`,Ln),Rn.removeEventListener(`pointercancel`,Ln),v.forEach(e=>e.dispose()),a.dispose()}}}

export { kd as initMeadow };
