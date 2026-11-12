const fs = require('fs');

fs.mkdirSync('src/components/meadow', { recursive: true });
fs.copyFileSync('thoufik_three.js', 'src/components/meadow/three.module.js');
fs.copyFileSync('ambient-dynamics-Cdbg4ktG.js', 'src/components/meadow/ambient-dynamics.js');
fs.copyFileSync('activity-DuowrmOI.js', 'src/components/meadow/activity.js');

const header = `import * as THREE from './three.module.js';
import {
  $, $t, A, B, Bt, C, Ct, Dt, E, Et, F, Ft, G, Gt, H, I, It, J, K, L, M, Mt, N, Nt, O, Ot, P, Pt, Q, Qt, R, Rt, S, St, T, Tt, U, Ut, V, Vt, W, Wt, X, Xt, Y, Yt, Z, Zt, _, _t, a, at, b, bt, c, ct, d, dt, en, et, f, ft, g, gt, h, ht, i, it, j, jt, k, kt, l, lt, m, mt, n, nn, nt, o, ot, p, pt, q, qt, r, rn, rt, s, st, t, tn, tt, u, ut, v, vt, w, wt, x, xt, y, yt, z, zt
} from './three.module.js';
import { _n, vn, yn, bn, xn } from './ambient-dynamics.js';
import { Sn, Cn } from './activity.js';
`;

const body = fs.readFileSync('scratch_meadow_thoufik.js', 'utf8');
const footer = `
export { kd as initMeadow };
`;

fs.writeFileSync('src/components/meadow/meadowEngine.js', header + '\n' + body + '\n' + footer);
console.log('Saved src/components/meadow/meadowEngine.js');
