// Shared cast, sets and overlays for the 3 "CEO comeback" shorts (Nov 2026). One generic toon for the CEO in all 3
// videos (short dark hair, glasses, black jacket over a black tee). NOT a likeness: a plain Tall Tale cut-out.
import * as THREE from 'three';
import { ctx, clamp, lerp, eo, eio, eob, rnd } from './core/lib.js';
import { camera } from './core/engine.js';
import * as WD from './core/world.js';
import * as PR from './core/props.js';
import { Toon, PROPS, INK } from './core/toon.js';

export const V3 = (x, y, z) => new THREE.Vector3(x, y, z);
export const mix = (a, b, k) => a.clone().lerp(b, k);
export const talk = (t, on = 1) => (on ? 0.25 + 0.75 * Math.abs(Math.sin(t * 13)) * (0.6 + 0.4 * Math.sin(t * 5.3)) : 0);
export const blink = (t, off = 0) => (((t + off) % 3.3) < 0.12 ? 1 : 0);
export { INK };

export const LOOK = {
  ceo: { body: '#2B2A31', pattern: 'jacket', patCol: '#141318', hat: 'hair', hatCol: '#2A2630', extra: ['glasses'] },
  teen: { body: '#F4EFE4', pattern: 'apron', patCol: '#FFFFFF', hat: 'hair', hatCol: '#2A2630', neck: 'collar', neckCol: '#D8343F', extra: ['glasses'] },
  kid: { body: '#5C8FD6', pattern: 'plain', hat: 'hair', hatCol: '#2A2630', kid: true },
  chair: { body: '#4A4560', hat: 'none', neck: 'tie', neckCol: '#D8343F', pattern: 'vest', patCol: '#2A2638', extra: ['mustache'] },
  m1: { body: '#5C6F8F', hat: 'bowler', hatCol: '#2A2638', neck: 'tie', neckCol: '#2E8A5A', extra: ['glasses'] },
  m2: { body: '#8A5A6A', hat: 'bun', hatCol: '#6B4A3A', neck: 'collar', neckCol: '#F4EFE4' },
  m3: { body: '#6A7A5A', hat: 'none', neck: 'bowtie', neckCol: '#F2C230', extra: ['mustache'] },
  trader: { body: '#3C6FB6', hat: 'visor', hatCol: '#2F8F5B', neck: 'tie', neckCol: '#F2C230', pattern: 'vest', patCol: '#24467A' },
  reporter: { body: '#D8584A', hat: 'none', neck: 'scarf', neckCol: '#F2C230', extra: ['pencil'] },
  fan: { body: '#F2C230', hat: 'cap', hatCol: '#3C6FB6', pattern: 'stripes', patCol: '#E8A820' },
  friend1: { body: '#8C6FC9', hat: 'none', neck: 'none', extra: ['glasses', 'mustache'] },
  friend2: { body: '#4FB3A9', hat: 'cap', hatCol: '#2E4E8A', neck: 'collar' },
  official: { body: '#2E3A5A', hat: 'none', neck: 'tie', neckCol: '#3C6FB6', pattern: 'vest', patCol: '#1E2840' },
};
export const person = (k, opts) => new Toon({ ...LOOK[k], extra: [...(LOOK[k].extra || [])] }, opts);

// ── 2D hand props ──
export const P2 = {
  box: (g, x, y) => { g.save(); g.translate(x, y - 40); g.strokeStyle = INK; g.lineWidth = 6; g.fillStyle = '#C8935A'; g.beginPath(); g.rect(-80, -50, 160, 100); g.fill(); g.stroke();
    g.fillStyle = '#B9844E'; g.fillRect(-80, -50, 160, 18); g.fillStyle = '#2E9B5A'; g.beginPath(); g.ellipse(-30, -62, 16, 30, -0.3, 0, 7); g.fill(); g.stroke(); g.fillStyle = '#F4EFE4'; g.fillRect(18, -86, 40, 46); g.strokeRect(18, -86, 40, 46); g.restore(); },
  plate: (g, x, y) => { g.save(); g.translate(x, y - 30); g.strokeStyle = INK; g.lineWidth = 5; g.fillStyle = '#FFFFFF'; g.beginPath(); g.ellipse(0, 0, 62, 22, -0.2, 0, 7); g.fill(); g.stroke(); g.strokeStyle = '#9CC7E4'; g.beginPath(); g.ellipse(0, 0, 40, 13, -0.2, 0, 7); g.stroke();
    g.fillStyle = 'rgba(160,220,255,0.9)'; [[-30, -30], [10, -44], [40, -24]].forEach(([a, b]) => { g.beginPath(); g.arc(a, b, 10, 0, 7); g.fill(); g.lineWidth = 3; g.stroke(); }); g.restore(); },
  plates: (g, x, y) => { g.save(); g.translate(x, y - 20); g.strokeStyle = INK; g.lineWidth = 5; for (let i = 0; i < 5; i++) { g.fillStyle = '#FFFFFF'; g.beginPath(); g.ellipse(0, -i * 16, 60, 18, 0, 0, 7); g.fill(); g.stroke(); } g.restore(); },
  tray: (g, x, y) => { g.save(); g.translate(x, y - 50); g.strokeStyle = INK; g.lineWidth = 5; g.fillStyle = '#B8BCC6'; g.beginPath(); g.ellipse(0, 0, 90, 18, 0, 0, 7); g.fill(); g.stroke();
    g.fillStyle = '#F4EFE4'; g.beginPath(); g.roundRect(-60, -40, 40, 40, 6); g.fill(); g.stroke(); g.fillStyle = '#F2C230'; g.beginPath(); g.ellipse(30, -12, 34, 12, 0, 0, 7); g.fill(); g.stroke(); g.restore(); },
  coffee: (g, x, y) => PROPS.cup(g, x, y),
  phone: (g, x, y) => { g.save(); g.translate(x, y - 40); g.rotate(-0.15); g.strokeStyle = INK; g.lineWidth = 5; g.fillStyle = '#2A2E36'; g.beginPath(); g.roundRect(-28, -52, 56, 104, 10); g.fill(); g.stroke(); g.fillStyle = '#7FE0FF'; g.fillRect(-20, -42, 40, 80); g.restore(); },
  clip: (g, x, y) => { g.save(); g.translate(x, y - 60); g.rotate(0.12); g.strokeStyle = INK; g.lineWidth = 5; g.fillStyle = '#A8693E'; g.beginPath(); g.roundRect(-54, -72, 108, 144, 6); g.fill(); g.stroke(); g.fillStyle = '#FFFDF4'; g.fillRect(-44, -56, 88, 120);
    g.strokeStyle = '#7A7A8A'; g.lineWidth = 3; for (let i = 0; i < 6; i++) { g.beginPath(); g.moveTo(-34, -40 + i * 18); g.lineTo(34, -40 + i * 18); g.stroke(); } g.fillStyle = '#B8BCC6'; g.fillRect(-20, -80, 40, 16); g.restore(); },
  mic: (g, x, y) => { g.save(); g.translate(x, y - 20); g.strokeStyle = INK; g.lineWidth = 5; g.fillStyle = '#2A2E36'; g.fillRect(-7, -10, 14, 70); g.strokeRect(-7, -10, 14, 70); g.fillStyle = '#5A6070'; g.beginPath(); g.arc(0, -26, 24, 0, 7); g.fill(); g.stroke(); g.restore(); },
  sign: (txt, col = '#FFFDF4') => PROPS.sign(txt, col),
};

// ── overlays (2D, kept above the caption zone y < 1150) ──
export function hook(lines, k, { y = 300, size = 132, col = '#FFFFFF', hi = '#FFD43B', hiLine = -1 } = {}) {
  // big curiosity text; k starts at 1 on frame 0 (no fade), small settle
  if (k <= 0) return; const s = lerp(1.12, 1, eo(clamp(k))); ctx.save(); ctx.translate(540, y); ctx.scale(s, s); ctx.rotate(-0.03);
  ctx.font = `900 ${size}px Inter`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
  lines.forEach((l, i) => { const yy = (i - (lines.length - 1) / 2) * size * 1.05; ctx.lineWidth = 26; ctx.strokeStyle = INK; ctx.strokeText(l, 0, yy); ctx.fillStyle = i === hiLine ? hi : col; ctx.fillText(l, 0, yy); });
  ctx.restore();
}
export function ribbon(text, k, y = 380, size = 84) {
  if (k <= 0) return; const a = eob(clamp(k)); ctx.save(); ctx.translate(540, y); ctx.rotate(-0.03); ctx.scale(a, a); ctx.font = `900 ${size}px Inter`; const w = ctx.measureText(text).width + 90;
  ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.fillRect(-w / 2 + 12, -62, w, 140); ctx.fillStyle = '#F2C230'; ctx.strokeStyle = INK; ctx.lineWidth = 8; ctx.beginPath(); ctx.rect(-w / 2, -70, w, 140); ctx.fill(); ctx.stroke();
  ctx.fillStyle = INK; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(text, 0, 6); ctx.restore();
}
export function pill(text, k, y = 250, bg = 'rgba(31,28,51,0.88)', size = 50) {
  if (k <= 0) return; ctx.save(); ctx.globalAlpha = clamp(k * 1.5); ctx.translate(540, y + (1 - eo(clamp(k))) * 30); ctx.font = `900 ${size}px Inter`; const w = ctx.measureText(text).width + 70;
  ctx.fillStyle = bg; ctx.beginPath(); ctx.roundRect(-w / 2, -size * 0.85, w, size * 1.7, size * 0.85); ctx.fill(); ctx.strokeStyle = '#F2C230'; ctx.lineWidth = 5; ctx.stroke();
  ctx.fillStyle = '#FFFFFF'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(text, 0, 4); ctx.restore();
}
export function stamp(lines, p, { x = 540, y = 520, rot = -0.08, col = '#C8283A', size = 84, fill = 'rgba(255,253,244,0.94)' } = {}) {
  if (p <= 0) return; ctx.save(); ctx.translate(x, y); ctx.rotate(rot); const s = lerp(2.3, 1, eo(clamp(p))); ctx.scale(s, s); ctx.globalAlpha = Math.min(1, p * 1.6);
  ctx.font = `900 ${size}px Inter`; const w = Math.max(...lines.map((l) => ctx.measureText(l).width)) + 80, h = lines.length * size * 1.08 + 50;
  if (fill) { ctx.fillStyle = fill; ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, 22); ctx.fill(); } ctx.strokeStyle = col; ctx.lineWidth = 12; ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, 22); ctx.stroke();
  ctx.fillStyle = col; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; lines.forEach((l, i) => ctx.fillText(l, 0, (i - (lines.length - 1) / 2) * size * 1.08 + 4)); ctx.restore();
}
export function calCard(top, big, x, y, s = 1, rot = 0, col = '#D8343F') {
  if (s <= 0) return; ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s); ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.fillRect(-150, -150, 320, 330);
  ctx.fillStyle = '#FFFDF4'; ctx.strokeStyle = INK; ctx.lineWidth = 8; ctx.beginPath(); ctx.roundRect(-160, -160, 320, 320, 18); ctx.fill(); ctx.stroke();
  ctx.fillStyle = col; ctx.beginPath(); ctx.roundRect(-160, -160, 320, 90, [18, 18, 0, 0]); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#FFFFFF'; ctx.font = '900 50px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(top, 0, -114);
  ctx.fillStyle = INK; ctx.font = `900 ${big.length > 3 ? 100 : 130}px Inter`; ctx.fillText(big, 0, 40); ctx.restore();
}
export function counter(n, k, label, y = 330, w = 600, col = '#F2C230') {
  if (k <= 0) return; ctx.save(); ctx.globalAlpha = clamp(k * 2); ctx.translate(540, y); ctx.fillStyle = 'rgba(16,22,40,0.88)'; ctx.beginPath(); ctx.roundRect(-w / 2, -110, w, 220, 30); ctx.fill(); ctx.strokeStyle = col; ctx.lineWidth = 6; ctx.stroke();
  ctx.fillStyle = '#FFFFFF'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.font = '900 110px Inter'; ctx.fillText(String(n), 0, -14); ctx.font = '800 36px Inter'; ctx.fillStyle = col; ctx.fillText(label, 0, 72); ctx.restore();
}
export function cashRain(t, t0, n = 26, dur = 99) {
  const k = t - t0; if (k < 0 || k > dur) return;
  for (let i = 0; i < n; i++) { const r = rnd(i * 1.3), r2 = rnd(i * 7.7); const y = -120 + (k * (520 + r2 * 380) - r * 0.6 * 520); if (y < -120 || y > 1200) continue;
    const x = 60 + r * 960 + Math.sin(k * 3 + i) * 40; ctx.save(); ctx.translate(x, y); ctx.rotate(Math.sin(k * 4 + i * 2) * 0.8); ctx.scale(1, 0.6 + 0.4 * Math.abs(Math.cos(k * 5 + i)));
    ctx.fillStyle = '#8FD08A'; ctx.strokeStyle = '#2F5E33'; ctx.lineWidth = 4; ctx.beginPath(); ctx.roundRect(-55, -27, 110, 54, 5); ctx.fill(); ctx.stroke(); ctx.fillStyle = '#2F5E33'; ctx.font = '900 34px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('$', 0, 2); ctx.restore(); }
}
export function confetti(t, t0, n = 60) {
  const k = t - t0; if (k < 0) return; const cols = ['#F2C230', '#D8343F', '#3C6FB6', '#4FB36A', '#FF7AB6', '#FFFFFF'];
  for (let i = 0; i < n; i++) { const r = rnd(i * 2.1), r2 = rnd(i * 5.9); const x = 540 + (r - 0.5) * 1400 * Math.min(1, k * 1.5), y = 260 + k * 300 * (0.6 + r2) - (1 - Math.min(1, k * 2)) * 300 * r2; if (y > 1180) continue;
    ctx.save(); ctx.translate(x, y); ctx.rotate(k * 6 + i); ctx.fillStyle = cols[i % cols.length]; ctx.fillRect(-12, -6, 24, 12); ctx.restore(); }
}
export const flash = (a, col = '#FFFFFF') => { if (a <= 0) return; ctx.save(); ctx.globalAlpha = Math.min(1, a) * 0.8; ctx.fillStyle = col; ctx.fillRect(0, 0, 1080, 1920); ctx.restore(); };
export const tint = (a, col = '#D8343F') => { if (a <= 0) return; ctx.save(); ctx.globalAlpha = Math.min(0.35, a * 0.35); ctx.fillStyle = col; ctx.fillRect(0, 0, 1080, 1920); ctx.restore(); };
export function speedLines(a, seed = 0) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha = clamp(a) * 0.7; ctx.strokeStyle = '#FFFFFF'; ctx.lineCap = 'round';
  for (let i = 0; i < 26; i++) { const ang = rnd(i + seed) * Math.PI * 2, r0 = 520 + rnd(i * 3 + seed) * 200; ctx.lineWidth = 4 + rnd(i * 5) * 8; ctx.beginPath(); ctx.moveTo(540 + Math.cos(ang) * r0, 760 + Math.sin(ang) * r0 * 1.4); ctx.lineTo(540 + Math.cos(ang) * (r0 + 300), 760 + Math.sin(ang) * (r0 + 300) * 1.4); ctx.stroke(); }
  ctx.restore();
}
export function stars(x, y, k) {
  if (k <= 0 || k >= 1) return; ctx.save(); ctx.translate(x, y); const s = eob(clamp(k * 2)); ctx.globalAlpha = 1 - clamp((k - 0.6) / 0.4); ctx.fillStyle = '#FFD43B'; ctx.strokeStyle = INK; ctx.lineWidth = 5;
  for (let i = 0; i < 5; i++) { const a = i / 5 * Math.PI * 2 + 0.3; ctx.save(); ctx.translate(Math.cos(a) * 120 * s, Math.sin(a) * 120 * s); ctx.rotate(k * 3); ctx.beginPath(); for (let j = 0; j < 10; j++) { const rr = j % 2 ? 12 : 28, b = j / 10 * Math.PI * 2; ctx.lineTo(Math.cos(b) * rr, Math.sin(b) * rr); } ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore(); }
  ctx.restore();
}
export function mark(ch, x, y, k, col = '#FFD43B') { const q = eob(clamp(k)); if (q <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(q, q); ctx.font = '900 170px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineWidth = 14; ctx.strokeStyle = INK; ctx.strokeText(ch, 0, 0); ctx.fillStyle = col; ctx.fillText(ch, 0, 0); ctx.restore(); }
export function subscribe(k, t, y = 980) {
  if (k <= 0) return; const a = eob(clamp(k)); ctx.save(); ctx.translate(540, y); ctx.scale(a, a);
  const pressed = k > 1.6 && k < 2.2; const s = pressed ? 0.93 : 1; ctx.scale(s, s);
  ctx.fillStyle = k > 1.8 ? '#5A5A66' : '#E3262E'; ctx.strokeStyle = INK; ctx.lineWidth = 8; ctx.beginPath(); ctx.roundRect(-270, -70, 540, 140, 70); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#FFFFFF'; ctx.font = '900 66px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(k > 1.8 ? 'SUBSCRIBED' : 'SUBSCRIBE', 0, 4);
  // cartoon hand
  const hx = lerp(260, 120, clamp((k - 0.8) / 0.8)), hy = lerp(220, 50, clamp((k - 0.8) / 0.8)); ctx.translate(hx, hy); ctx.rotate(-0.5); ctx.fillStyle = '#FFFFFF'; ctx.lineWidth = 7;
  ctx.beginPath(); ctx.roundRect(-34, -10, 68, 90, 22); ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.roundRect(-14, -80, 28, 90, 14); ctx.fill(); ctx.stroke(); ctx.restore();
}
// a stock chart panel (2D) that draws itself: pts = [[x0..1, y0..1]], k = how much is drawn
export function chartCard(pts, k, { x = 540, y = 500, w = 820, h = 520, title = 'NVDA', col = '#2FB35A', labels = [] } = {}) {
  if (k <= 0) return; ctx.save(); ctx.translate(x, y); const a = eo(clamp(k * 4)); ctx.scale(a, a);
  ctx.fillStyle = 'rgba(14,18,32,0.92)'; ctx.strokeStyle = '#F2C230'; ctx.lineWidth = 6; ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, 26); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#FFFFFF'; ctx.font = '900 46px Inter'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillText(title, -w / 2 + 34, -h / 2 + 50);
  ctx.strokeStyle = 'rgba(255,255,255,0.12)'; ctx.lineWidth = 2; for (let i = 1; i < 5; i++) { ctx.beginPath(); ctx.moveTo(-w / 2 + 30, -h / 2 + 90 + i * (h - 130) / 5); ctx.lineTo(w / 2 - 30, -h / 2 + 90 + i * (h - 130) / 5); ctx.stroke(); }
  const P = (p) => [-w / 2 + 40 + p[0] * (w - 80), h / 2 - 40 - p[1] * (h - 150)]; const n = clamp(k) * (pts.length - 1);
  ctx.lineWidth = 12; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  for (let i = 0; i < Math.ceil(n) && i < pts.length - 1; i++) { const f = Math.min(1, n - i), A = P(pts[i]), B0 = P(pts[i + 1]); const B = [lerp(A[0], B0[0], f), lerp(A[1], B0[1], f)];
    ctx.strokeStyle = pts[i + 1][1] >= pts[i][1] ? '#2FB35A' : '#E3262E'; ctx.beginPath(); ctx.moveTo(A[0], A[1]); ctx.lineTo(B[0], B[1]); ctx.stroke();
    if (i === Math.ceil(n) - 1) { ctx.fillStyle = '#FFFFFF'; ctx.beginPath(); ctx.arc(B[0], B[1], 14, 0, 7); ctx.fill(); } }
  labels.forEach(([i, txt, c]) => { if (n < i) return; const p = P(pts[i]); ctx.font = '900 40px Inter'; ctx.textAlign = 'center'; ctx.fillStyle = c || '#FFFFFF'; ctx.fillText(txt, p[0], p[1] + (c === '#E3262E' ? 50 : -44)); });
  ctx.restore();
}

// ── camera / shoot helper ──
export function makeShoot(E) {
  const cam = camera(40);
  const shoot = (scene, people, from, to, at, at2, k, look, focus, roll = 0) => {
    if (cam.fov !== (look.fov || 40)) { cam.fov = look.fov || 40; cam.updateProjectionMatrix(); }
    cam.position.copy(mix(from, to, k)); cam.up.set(Math.sin(roll), Math.cos(roll), 0); cam.lookAt(at2 ? mix(at, at2, k) : at);
    people.forEach((p) => p.face(cam));
    E.render(scene, cam, { ...look, focus: focus ?? cam.position.distanceTo(at2 ? mix(at, at2, k) : at) });
  };
  return { cam, shoot };
}
// brightness rules: bloom ~0.12, threshold 1.08, aperture <= 0.0002
export const LK = { day: { bloom: 0.12, bloomThreshold: 1.08, aperture: 0.00015, maxblur: 0.003 }, room: { bloom: 0.1, bloomThreshold: 1.08, aperture: 0.0002, maxblur: 0.003 } };

// a canvas texture on a plane that can be redrawn every frame (wall screens)
export function screen(w, h, px = 512) {
  const c = document.createElement('canvas'); c.width = px; c.height = Math.round(px * h / w); const g = c.getContext('2d');
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace;
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: tex, toneMapped: false }));
  const frame = new THREE.Mesh(new THREE.BoxGeometry(w + 0.16, h + 0.16, 0.08), new THREE.MeshStandardMaterial({ color: '#1F1C33', roughness: 0.5 })); frame.position.z = -0.05;
  const grp = new THREE.Group(); grp.add(frame, m);
  grp.draw = (fn) => { fn(g, c.width, c.height); tex.needsUpdate = true; };
  return grp;
}
// draw a price line on a screen canvas
export function drawPrice(g, W, H, pts, k, title = 'NVDA', big = '') {
  g.fillStyle = '#0E1220'; g.fillRect(0, 0, W, H); g.strokeStyle = 'rgba(255,255,255,0.12)'; g.lineWidth = 2;
  for (let i = 1; i < 5; i++) { g.beginPath(); g.moveTo(0, i * H / 5); g.lineTo(W, i * H / 5); g.stroke(); }
  g.fillStyle = '#FFFFFF'; g.font = `900 ${Math.round(H * 0.12)}px Inter`; g.textBaseline = 'top'; g.textAlign = 'left'; g.fillText(title, W * 0.04, H * 0.05);
  const n = clamp(k) * (pts.length - 1); const P = (p) => [W * 0.05 + p[0] * W * 0.9, H * 0.92 - p[1] * H * 0.7]; g.lineWidth = Math.max(4, H * 0.025); g.lineJoin = 'round'; g.lineCap = 'round';
  for (let i = 0; i < Math.ceil(n) && i < pts.length - 1; i++) { const f = Math.min(1, n - i), A = P(pts[i]), B0 = P(pts[i + 1]); g.strokeStyle = pts[i + 1][1] >= pts[i][1] ? '#2FD36A' : '#FF3B3B'; g.beginPath(); g.moveTo(A[0], A[1]); g.lineTo(lerp(A[0], B0[0], f), lerp(A[1], B0[1], f)); g.stroke(); }
  if (big) { g.font = `900 ${Math.round(H * 0.16)}px Inter`; g.textAlign = 'right'; g.fillStyle = big[0] === '-' ? '#FF3B3B' : '#2FD36A'; g.fillText(big, W * 0.96, H * 0.05); }
}

// ── SETS ──
export function boardroom(E) {
  const R = WD.interior(E, { w: 10, depth: 8, h: 4.4, wall: '#24324F', motif: '#2C3C5E', floor: '#5A4232', ceiling: '#1A2238', signText: null, picture: false, counterOn: false, litter: false });
  const table = new THREE.Group(); const wood = WD.mat({ map: WD.T.planks('#5A3420', [2, 1]) });
  const top = new THREE.Mesh(new THREE.BoxGeometry(5.6, 0.12, 1.8), wood); top.position.y = 0.86; top.castShadow = top.receiveShadow = true; table.add(top);
  [[-2.4, -0.6], [2.4, -0.6], [-2.4, 0.6], [2.4, 0.6]].forEach(([x, z]) => { const l = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.8, 0.14), wood); l.position.set(x, 0.4, z); l.castShadow = true; table.add(l); });
  // modesty panel on the camera side so legs of people seated behind the table are hidden
  const pnl = new THREE.Mesh(new THREE.BoxGeometry(5.4, 0.74, 0.06), wood); pnl.position.set(0, 0.45, 0.82); pnl.castShadow = pnl.receiveShadow = true; table.add(pnl);
  // table spans z -5.1 .. -3.3: seat people at z <= -5.4 (behind) and walk people at z >= -2.9 (in front); never in between
  table.position.set(0, 0, -4.2); R.scene.add(table);
  // screen sits in front of the window frame (frame front is z -7.8) and covers the whole window, so they never overlap
  const scr = screen(4.2, 2.3); scr.position.set(0, 2.1, -7.7); R.scene.add(scr);
  R.sun.key.target.position.set(0, 0, -4); R.sun.key.position.set(3, 6, 0);
  return { ...R, table, screen: scr };
}
export function street(E, shops) {
  const S = WD.mainStreet(E, { shops, cars: true, people: true });
  return S;
}
// giant 3D price line (a rollercoaster track) over the meadow
export function coaster(E, pts) {
  const M = WD.meadow(E, { fenceOn: false, flowers: true });
  const curvePts = pts.map(([x, y]) => V3(-14 + x * 28, 0.6 + y * 9, -6));
  const curve = new THREE.CatmullRomCurve3(curvePts, false, 'catmullrom', 0.2);
  const N = 400, geo = new THREE.TubeGeometry(curve, N, 0.22, 10, false);
  // vertex colours: green when rising, red when falling
  const cols = []; const pos = geo.attributes.position; const segs = 10 + 1;
  for (let i = 0; i <= N; i++) { const u = i / N, a = curve.getPointAt(Math.max(0, u - 0.01)), b = curve.getPointAt(Math.min(1, u + 0.01)); const c = new THREE.Color(b.y >= a.y ? '#2FB35A' : '#E3262E'); for (let j = 0; j < segs; j++) cols.push(c.r, c.g, c.b); }
  geo.setAttribute('color', new THREE.Float32BufferAttribute(cols.slice(0, pos.count * 3), 3));
  const tube = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.4, metalness: 0.1 })); tube.castShadow = true; M.scene.add(tube);
  const posts = []; for (let i = 0; i <= 28; i++) { const p = curve.getPointAt(i / 28); const h = p.y; const post = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, h, 6), WD.mat({ color: '#B8BCC6' })); post.position.set(p.x, h / 2, p.z); post.castShadow = true; M.scene.add(post); posts.push(post); }
  const cart = new THREE.Group(); const body = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.45, 0.8), WD.mat({ color: '#F2C230' })); body.position.y = 0.2; body.castShadow = true; cart.add(body);
  const stripe = new THREE.Mesh(new THREE.BoxGeometry(1.12, 0.1, 0.82), WD.mat({ color: '#D8343F' })); stripe.position.y = 0.32; cart.add(stripe); M.scene.add(cart);
  const draw = (u) => { geo.setDrawRange(0, Math.floor(clamp(u) * N) * 10 * 6); };
  M.sun.key.target.position.set(0, 0, -6); M.sun.key.position.set(6, 16, 4);
  return { ...M, curve, tube, cart, draw };
}
export function diner(E) {
  const R = WD.interior(E, { w: 9, depth: 7, h: 4.0, wall: '#C9603F', motif: '#D8734A', floor: '#E9D7A5', ceiling: '#7A2E24', signText: 'DINER · OPEN 24 HOURS', picture: true, counterOn: true, litter: false });
  const red = WD.mat({ color: '#B5372E', roughness: 0.6 }), tbl = WD.mat({ color: '#F2E6CF', roughness: 0.5 });
  const booth = new THREE.Group();
  [[-1.0], [1.0]].forEach(([z]) => { const seat = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.5, 0.6), red); seat.position.set(0, 0.25, z); const back = new THREE.Mesh(new THREE.BoxGeometry(2.0, 1.2, 0.25), red); back.position.set(0, 0.6, z + Math.sign(z) * 0.4); [seat, back].forEach((m) => { m.castShadow = m.receiveShadow = true; booth.add(m); }); });
  const t = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.08, 1.0), tbl); t.position.y = 0.78; t.castShadow = true; booth.add(t); const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.76), WD.mat({ color: '#B8BCC6' })); leg.position.y = 0.38; booth.add(leg);
  booth.position.set(-2.4, 0, -4.4); R.scene.add(booth);
  const cups = []; [[-0.5, -0.2], [0.1, 0.25], [0.6, -0.15]].forEach(([x, z]) => { const c = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.07, 0.16, 12), WD.mat({ color: '#FFFFFF' })); c.position.set(-2.4 + x, 0.9, -4.4 + z); c.castShadow = true; R.scene.add(c); cups.push(c); });
  const plaque = PR.poster(['THE BOOTH', 'WHERE IT', 'ALL BEGAN'], { w: 1.0, h: 0.7, bg: '#E2B33C', fg: '#1F1C33' }); plaque.position.set(-2.4, 1.95, -5.62); R.scene.add(plaque); plaque.visible = false;
  // sink + dish stack on the right counter
  const sink = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.25, 0.7), WD.mat({ color: '#B8BCC6', metalness: 0.5, roughness: 0.3 })); sink.position.set(3.2, 1.25, -2.0); R.scene.add(sink);
  const dishes = new THREE.Group(); for (let i = 0; i < 14; i++) { const d = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.18, 0.04, 20), WD.mat({ color: i % 2 ? '#FFFFFF' : '#F2EDE0' })); d.position.y = i * 0.05; d.rotation.z = (rnd(i) - 0.5) * 0.15; d.castShadow = true; dishes.add(d); }
  dishes.position.set(3.2, 1.2, -3.0); R.scene.add(dishes);
  R.sun.key.target.position.set(0, 0, -3.5); R.sun.key.position.set(2, 6, 0);
  return { ...R, booth, cups, plaque, dishes, sink };
}
