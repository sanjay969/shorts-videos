// Extras for the 26 Nov 2026 build: a generic cartoon parade balloon (an original striped cat, no real character),
// a small 1930s training plane, a reward tag overlay. All drawn in code.
import * as THREE from 'three';
import { ctx, clamp, lerp, eo, eob } from './core/lib.js';
import * as WD from './core/world.js';
import { INK } from './core/toon.js';
import { Cut } from './xtra.js';

/** parade balloon: a round orange striped cat with a big grin. canvas W x H, bottom edge = where ropes end.
 * st: { ropes (0..1 visible), squash (0 full .. 1 flat), rip (0..1 torn), mood: happy|shock, wob, tag } */
export function drawBalloon(g, W, H, st = {}) {
  const s = W / 512; g.save(); g.scale(s, s); const Hh = H / s;
  const sq = clamp(st.squash || 0), rip = clamp(st.rip || 0), wob = st.wob || 0;
  const cx = 256, cy = 230 + sq * 150, rx = 190 * (1 + sq * 0.25), ry = 200 * (1 - sq * 0.7);
  // ropes
  if ((st.ropes ?? 1) > 0 && sq < 0.6) { g.strokeStyle = '#3A3340'; g.lineWidth = 5; g.globalAlpha = st.ropes ?? 1;
    [-110, -40, 40, 110].forEach((dx, i) => { g.beginPath(); g.moveTo(cx + dx * 0.9, cy + ry * 0.85); g.quadraticCurveTo(cx + dx * 0.7 + Math.sin(wob + i) * 20, (cy + Hh) / 2 + 40, cx + dx * 0.5, Hh - 4); g.stroke(); }); g.globalAlpha = 1; }
  g.save(); g.translate(cx, cy); g.rotate(Math.sin(wob) * 0.05);
  g.lineWidth = 9; g.strokeStyle = INK; g.lineJoin = 'round';
  // ears
  [-1, 1].forEach((sd) => { g.fillStyle = '#F29A3A'; g.beginPath(); g.moveTo(sd * rx * 0.45, -ry * 0.75); g.lineTo(sd * rx * 0.85, -ry * 1.08); g.lineTo(sd * rx * 0.85, -ry * 0.4); g.closePath(); g.fill(); g.stroke();
    g.fillStyle = '#F6C7A8'; g.beginPath(); g.moveTo(sd * rx * 0.55, -ry * 0.72); g.lineTo(sd * rx * 0.78, -ry * 0.94); g.lineTo(sd * rx * 0.78, -ry * 0.52); g.closePath(); g.fill(); });
  // head
  const grd = g.createRadialGradient(-rx * 0.3, -ry * 0.35, 10, 0, 0, rx * 1.1); grd.addColorStop(0, '#FFC06A'); grd.addColorStop(1, '#E8832A');
  g.fillStyle = grd; g.beginPath(); g.ellipse(0, 0, rx, ry, 0, 0, 7); g.fill(); g.stroke();
  g.save(); g.beginPath(); g.ellipse(0, 0, rx - 4, ry - 4, 0, 0, 7); g.clip(); g.fillStyle = '#7A3A1A';
  [-0.75, -0.45, 0.45, 0.75].forEach((x) => { g.beginPath(); g.moveTo(x * rx - 14, -ry); g.quadraticCurveTo(x * rx + 20, -ry * 0.6, x * rx - 4, -ry * 0.3); g.lineTo(x * rx + 10, -ry); g.fill(); });
  [-1, 1].forEach((sd) => [0.1, 0.35].forEach((y) => { g.beginPath(); g.moveTo(sd * rx, y * ry * 2 - ry * 0.2); g.lineTo(sd * rx * 0.62, y * ry * 2 - ry * 0.12); g.lineTo(sd * rx, y * ry * 2 - ry * 0.05); g.fill(); }));
  g.restore();
  // muzzle
  g.fillStyle = '#FFF3E0'; g.beginPath(); g.ellipse(0, ry * 0.38, rx * 0.5, ry * 0.32, 0, 0, 7); g.fill(); g.lineWidth = 6; g.stroke();
  // eyes
  const shock = st.mood === 'shock';
  [-1, 1].forEach((sd) => { g.fillStyle = '#FFFFFF'; g.beginPath(); g.ellipse(sd * rx * 0.33, -ry * 0.12, 34, shock ? 44 : 38 * (1 - sq * 0.6), 0, 0, 7); g.fill(); g.lineWidth = 6; g.stroke();
    if (sq < 0.8) { g.fillStyle = INK; g.beginPath(); g.arc(sd * rx * 0.33 + 6, -ry * 0.08, shock ? 12 : 16, 0, 7); g.fill(); } });
  g.fillStyle = '#E0526A'; g.beginPath(); g.moveTo(-18, ry * 0.18); g.lineTo(18, ry * 0.18); g.lineTo(0, ry * 0.32); g.closePath(); g.fill(); g.lineWidth = 5; g.stroke();
  g.lineWidth = 7; g.beginPath(); if (shock) { g.ellipse(0, ry * 0.5, 26, 22, 0, 0, 7); g.fillStyle = '#7A1E2A'; g.fill(); g.stroke(); } else { g.arc(0, ry * 0.36, 60, 0.3, Math.PI - 0.3); g.stroke(); }
  g.lineWidth = 4; [-1, 1].forEach((sd) => [-0.05, 0.05].forEach((a) => { g.beginPath(); g.moveTo(sd * rx * 0.3, ry * 0.42); g.lineTo(sd * rx * 0.7, ry * (0.36 + a * 3)); g.stroke(); }));
  // shine
  g.fillStyle = 'rgba(255,255,255,0.55)'; g.beginPath(); g.ellipse(-rx * 0.55, -ry * 0.5, 26, 46, 0.6, 0, 7); g.fill();
  // rip: jagged tear + flapping pieces
  if (rip > 0) { g.fillStyle = 'rgba(31,28,51,0.9)'; g.beginPath(); g.moveTo(-rx * 0.1, -ry); for (let i = 0; i <= 8; i++) g.lineTo((i % 2 ? 30 : -30) * rip, -ry + i * ry * 0.22 * rip); g.lineTo(0, -ry + ry * 1.8 * rip); g.lineTo(40 * rip, -ry); g.closePath(); g.fill(); }
  g.restore();
  // reward tag hanging off a rope
  if (st.tag) { g.save(); g.translate(cx + 120, cy + ry + 70); g.rotate(0.15 + Math.sin(wob * 2) * 0.1); g.fillStyle = '#FFFDF4'; g.lineWidth = 5; g.strokeStyle = INK; g.beginPath(); g.rect(-50, 0, 100, 64); g.fill(); g.stroke();
    g.fillStyle = '#B5372E'; g.font = '900 30px Inter'; g.textAlign = 'center'; g.fillText('$100', 0, 44); g.restore(); }
  g.restore();
}
export const balloon = (size = 6) => new Cut(drawBalloon, { w: size, h: size * 1.5, px: 512 });

/** small 1930s two-seat training monoplane (high wing). Nose along +x. .prop spins. */
export function trainer(col = '#F2C230', trim = '#B5372E') {
  const g = new THREE.Group(), m = WD.mat({ color: col, roughness: 0.5 }), tm = WD.mat({ color: trim, roughness: 0.5 }), dk = WD.mat({ color: '#2A2630' });
  const add = (geo, mat, x, y, z) => { const o = new THREE.Mesh(geo, mat); o.position.set(x, y, z); o.castShadow = true; g.add(o); return o; };
  const body = add(new THREE.CylinderGeometry(0.42, 0.18, 4.2, 16), m, 0, 0, 0); body.rotation.z = Math.PI / 2;
  const cowl = add(new THREE.CylinderGeometry(0.45, 0.45, 0.6, 16), tm, 2.2, 0, 0); cowl.rotation.z = Math.PI / 2;
  add(new THREE.BoxGeometry(1.3, 0.09, 7.2), m, 0.6, 0.62, 0);                       // wing on top
  [-1.6, 1.6].forEach((z) => { const s = add(new THREE.CylinderGeometry(0.03, 0.03, 1.0), dk, 0.6, 0.15, z * 0.7); s.rotation.x = z > 0 ? -0.6 : 0.6; });
  add(new THREE.BoxGeometry(0.06, 0.66, 0.52), dk, 0.75, 0.32, 0);                    // windshield post
  add(new THREE.BoxGeometry(0.7, 0.06, 2.0), m, -2.0, 0.05, 0);                       // tailplane
  const fin = add(new THREE.BoxGeometry(0.7, 0.8, 0.06), tm, -2.05, 0.4, 0); fin.rotation.z = 0.25;
  [-0.6, 0.6].forEach((z) => { add(new THREE.CylinderGeometry(0.2, 0.2, 0.1, 14), dk, 1.3, -0.9, z).rotation.x = Math.PI / 2; const leg = add(new THREE.CylinderGeometry(0.03, 0.03, 0.8), dk, 1.3, -0.5, z * 0.6); leg.rotation.x = z > 0 ? -0.5 : 0.5; });
  const prop = new THREE.Group(); prop.position.set(2.55, 0, 0); g.add(prop);
  const blade = new THREE.Mesh(new THREE.BoxGeometry(0.06, 1.7, 0.12), WD.mat({ color: '#7A4A2A' })); prop.add(blade);
  g.prop = prop; return g;
}

/** a big white reward tag overlay */
export function rewardTag(k, x = 540, y = 520, rot = -0.06) {
  if (k <= 0) return; const a = eob(clamp(k)); ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(a, a);
  ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.fillRect(-250, -150, 520, 320);
  ctx.fillStyle = '#FFFDF4'; ctx.strokeStyle = INK; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(-260, -160); ctx.lineTo(200, -160); ctx.lineTo(260, 0); ctx.lineTo(200, 160); ctx.lineTo(-260, 160); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.arc(190, 0, 18, 0, 7); ctx.stroke();
  ctx.fillStyle = '#1F1C33'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.font = '900 48px Inter'; ctx.fillText('FOUND ME?', -40, -90);
  ctx.font = '800 32px Inter'; ctx.fillText('RETURN TO MACY\'S', -40, -36);
  ctx.fillStyle = '#B5372E'; ctx.font = '900 110px Inter'; ctx.fillText('$100', -40, 70); ctx.restore();
}
