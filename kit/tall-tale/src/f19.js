// Flight 19 pieces: a generic WWII-style single-engine Navy torpedo bomber (no markings beyond a plain star roundel),
// a twin-engine flying boat, an airfield, overlays (compass, Florida map, people counter, follow button, zoom blur).
import * as THREE from 'three';
import * as WD from './core/world.js';
import { ctx, clamp, lerp, eo, eob, rnd } from './core/lib.js';
import { INK } from './core/toon.js';
import { palm } from './core/props.js';

const M = (o) => WD.mat(o);
const add = (p, m) => { m.castShadow = true; m.receiveShadow = true; p.add(m); return m; };
const roundel = () => WD.canvasTex('roundel', 256, 256, (c) => { c.fillStyle = '#1E3A6E'; c.beginPath(); c.arc(128, 128, 120, 0, 7); c.fill(); c.fillStyle = '#FFFFFF';
  c.beginPath(); for (let i = 0; i < 10; i++) { const r = i % 2 ? 46 : 112, a = -Math.PI / 2 + i * Math.PI / 5; c.lineTo(128 + Math.cos(a) * r, 128 + Math.sin(a) * r); } c.closePath(); c.fill(); });

/** single-engine torpedo bomber, nose toward +x, ~12 m long, belly at y≈-1.  g.prop spins: g.update(t) */
export function bomber(col = '#4E6C8E') {
  const g = new THREE.Group(), body = M({ color: col, roughness: 0.55, metalness: 0.15 }), under = M({ color: '#C9D2DA', roughness: 0.6 }), dark = M({ color: '#24262C', roughness: 0.5, metalness: 0.4 });
  const pts = [[0, -5.6], [0.35, -5.0], [0.6, -3.5], [0.82, -1.5], [0.95, 0.5], [1.0, 2.5], [0.95, 4.2], [0.8, 4.8]].map(([r, y]) => new THREE.Vector2(r, y));
  const fus = add(g, new THREE.Mesh(new THREE.LatheGeometry(pts, 24), body)); fus.rotation.z = -Math.PI / 2;
  const cowl = add(g, new THREE.Mesh(new THREE.CylinderGeometry(0.92, 1.0, 1.3, 24, 1, true), dark)); cowl.rotation.z = Math.PI / 2; cowl.position.x = 5.1;
  const face = add(g, new THREE.Mesh(new THREE.CircleGeometry(0.92, 24), M({ color: '#3A3C44', metalness: 0.5 }))); face.rotation.y = Math.PI / 2; face.position.x = 5.7;
  const hub = add(g, new THREE.Mesh(new THREE.ConeGeometry(0.28, 0.6, 16), dark)); hub.rotation.z = -Math.PI / 2; hub.position.x = 6.0;
  const prop = new THREE.Group(); prop.position.x = 5.85; g.add(prop);
  for (let i = 0; i < 3; i++) { const b = add(prop, new THREE.Mesh(new THREE.BoxGeometry(0.06, 1.9, 0.26), dark)); b.position.y = 0.95; const p = new THREE.Group(); p.rotation.x = i * Math.PI * 2 / 3; p.add(b); prop.add(p); }
  const disc = new THREE.Mesh(new THREE.CircleGeometry(1.95, 32), new THREE.MeshBasicMaterial({ color: '#C8CCD4', transparent: true, opacity: 0.16, depthWrite: false, side: THREE.DoubleSide })); disc.rotation.y = Math.PI / 2; disc.position.x = 5.9; g.add(disc);
  // wings (slight taper) + underside colour
  [-1, 1].forEach((s) => { const w = add(g, new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.2, 7.8), body)); w.position.set(1.0, -0.4 + 0.12, s * 4.6); w.rotation.x = s * 0.06; w.geometry.translate(0, 0, 0);
    const tip = add(g, new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 1.9, 8), body)); tip.rotation.z = Math.PI / 2; tip.position.set(0.9, -0.28 + s * 0, s * 8.5);
    const r = add(g, new THREE.Mesh(new THREE.CircleGeometry(0.55, 20), M({ map: roundel() }))); r.rotation.x = -Math.PI / 2; r.position.set(1.0, -0.15 + Math.abs(s) * 0.38 * 0.6, s * 6.4); });
  // tail
  const st = add(g, new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.12, 5.4), body)); st.position.set(-5.0, 0.15, 0);
  const finS = new THREE.Shape(); finS.moveTo(0, 0); finS.lineTo(2.0, 0); finS.lineTo(0.9, 2.3); finS.lineTo(0.1, 2.3); finS.closePath();
  const fin = add(g, new THREE.Mesh(new THREE.ExtrudeGeometry(finS, { depth: 0.12, bevelEnabled: false }), body)); fin.position.set(-6.0, 0.2, -0.06);
  // long greenhouse canopy + ball turret
  const glass = new THREE.MeshStandardMaterial({ color: '#9FC6DA', roughness: 0.08, metalness: 0.3, transparent: true, opacity: 0.32, depthWrite: false });
  const can = new THREE.Mesh(new THREE.CapsuleGeometry(0.62, 3.6, 6, 16), glass); can.rotation.z = Math.PI / 2; can.position.set(1.4, 0.85, 0); can.scale.set(1, 1, 0.9); g.add(can);
  const frameM = M({ color: '#2A3442', metalness: 0.3 });
  for (let x of [-0.6, 0.6, 3.5]) { const fr = new THREE.Mesh(new THREE.TorusGeometry(0.6, 0.035, 6, 20, Math.PI), frameM); fr.rotation.y = Math.PI / 2; fr.position.set(x, 0.85, 0); fr.scale.set(1, 1, 0.92); g.add(fr); }
  const tur = add(g, new THREE.Mesh(new THREE.SphereGeometry(0.62, 18, 12), glass)); tur.position.set(-1.6, 1.05, 0);
  const turB = add(g, new THREE.Mesh(new THREE.CylinderGeometry(0.66, 0.7, 0.4, 18), body)); turB.position.set(-1.6, 0.75, 0);
  const rr = add(g, new THREE.Mesh(new THREE.CircleGeometry(0.42, 20), M({ map: roundel() }))); rr.position.set(-2.8, 0.1, 0.86); rr.rotation.y = 0.05;
  const rl = add(g, new THREE.Mesh(new THREE.CircleGeometry(0.42, 20), M({ map: roundel() }))); rl.position.set(-2.8, 0.1, -0.86); rl.rotation.y = Math.PI - 0.05;
  const belly = add(g, new THREE.Mesh(new THREE.BoxGeometry(5, 0.3, 1.0), under)); belly.position.set(0.5, -0.85, 0);
  g.prop = prop; g.disc = disc; g.update = (t) => { prop.rotation.x = t * 37; };
  return g;
}

/** twin-engine gull-wing flying boat, nose +x, ~24 m long */
export function flyingBoat(col = '#5A7594') {
  const g = new THREE.Group(), body = M({ color: col, roughness: 0.55, metalness: 0.15 }), under = M({ color: '#D6DCE2' }), dark = M({ color: '#24262C', metalness: 0.4 });
  const hull = add(g, new THREE.Mesh(new THREE.CapsuleGeometry(1.5, 15, 8, 18), body)); hull.rotation.z = Math.PI / 2; hull.scale.set(1.25, 1, 1);
  const keel = add(g, new THREE.Mesh(new THREE.BoxGeometry(14, 0.8, 1.6), under)); keel.position.set(0.5, -1.5, 0);
  const tailB = add(g, new THREE.Mesh(new THREE.ConeGeometry(1.4, 7, 16), body)); tailB.rotation.z = Math.PI / 2; tailB.position.set(-11, 0.6, 0);
  const nose = add(g, new THREE.Mesh(new THREE.SphereGeometry(1.5, 18, 12), body)); nose.position.set(8.6, 0.1, 0); nose.scale.set(1.4, 1, 1);
  const glass = new THREE.MeshStandardMaterial({ color: '#9FC6DA', roughness: 0.08, metalness: 0.3, transparent: true, opacity: 0.45 });
  const ck = new THREE.Mesh(new THREE.SphereGeometry(1.0, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2), glass); ck.position.set(7.2, 1.25, 0); ck.scale.set(1.5, 0.7, 1.1); g.add(ck);
  // gull wing: two inner panels up, two outer panels level
  [-1, 1].forEach((s) => {
    const inner = add(g, new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.35, 6.5), body)); inner.position.set(1.5, 2.6, s * 3.6); inner.rotation.x = -s * 0.32;
    const outer = add(g, new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.3, 11), body)); outer.position.set(1.5, 3.6, s * 12);
    const nac = add(g, new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.6, 4.2, 16), body)); nac.rotation.z = Math.PI / 2; nac.position.set(2.6, 3.3, s * 6.8);
    const pr = new THREE.Mesh(new THREE.CircleGeometry(1.7, 28), new THREE.MeshBasicMaterial({ color: '#C8CCD4', transparent: true, opacity: 0.18, depthWrite: false, side: THREE.DoubleSide })); pr.rotation.y = Math.PI / 2; pr.position.set(4.8, 3.3, s * 6.8); g.add(pr);
    const hubm = add(g, new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.6, 12), dark)); hubm.rotation.z = -Math.PI / 2; hubm.position.set(4.9, 3.3, s * 6.8);
    const fl = add(g, new THREE.Mesh(new THREE.CapsuleGeometry(0.35, 1.8, 4, 10), under)); fl.rotation.z = Math.PI / 2; fl.position.set(1.6, 1.2, s * 15);
    const strut = add(g, new THREE.Mesh(new THREE.BoxGeometry(0.15, 2.3, 0.15), dark)); strut.position.set(1.6, 2.4, s * 15);
    const r = add(g, new THREE.Mesh(new THREE.CircleGeometry(0.9, 20), M({ map: roundel() }))); r.rotation.x = -Math.PI / 2; r.position.set(1.5, 3.76, s * 13);
  });
  const stab = add(g, new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.2, 9), body)); stab.position.set(-12.5, 1.6, 0); stab.rotation.x = 0;
  [-1, 1].forEach((s) => { const f = add(g, new THREE.Mesh(new THREE.BoxGeometry(2.2, 3.0, 0.18), body)); f.position.set(-12.6, 2.9, s * 4.4); });
  const sr = add(g, new THREE.Mesh(new THREE.CircleGeometry(0.8, 20), M({ map: roundel() }))); sr.position.set(-3, 0.4, 1.9);
  return g;
}

/** a 1940s Navy airfield: concrete apron, hangar, control tower, palms. Returns { scene, sun, parked:[bombers] } */
export function airfield(E) {
  const scene = new THREE.Scene();
  WD.sky(scene, { top: '#4F86C0', horizon: '#D6E8F0', ground: '#D6E8F0' });
  scene.fog = new THREE.Fog('#CFE2EC', 60, 260);
  const sun = WD.sunlight(scene, E, { col: '#FFF1DC', i: 2.6, pos: [-14, 18, 12], target: [0, 0, 0], box: 22, sky: '#D8ECFF', ground: '#9A9A8A', hemi: 1.2 });
  WD.clouds(scene, [[-60, 40, -160, 22], [40, 50, -170, 30], [120, 36, -150, 18], [-140, 30, -140, 16]]);
  const conc = WD.canvasTex('apron', 512, 512, (c) => { c.fillStyle = '#B9B6AA'; c.fillRect(0, 0, 512, 512); for (let i = 0; i < 1600; i++) { c.fillStyle = `rgba(${120 + rnd(i) * 60},${118 + rnd(i * 2) * 60},${108 + rnd(i * 3) * 50},0.25)`; c.fillRect(rnd(i * 5) * 512, rnd(i * 7) * 512, 3, 3); }
    c.strokeStyle = 'rgba(80,78,70,0.5)'; c.lineWidth = 3; for (let x = 0; x <= 512; x += 128) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, 512); c.stroke(); c.beginPath(); c.moveTo(0, x); c.lineTo(512, x); c.stroke(); } }, [30, 30]);
  const ap = new THREE.Mesh(new THREE.PlaneGeometry(240, 240), M({ map: conc })); ap.rotation.x = -Math.PI / 2; ap.receiveShadow = true; scene.add(ap);
  const grass = new THREE.Mesh(new THREE.PlaneGeometry(900, 900), M({ map: WD.T.grass('#7FB060', [90, 90]) })); grass.rotation.x = -Math.PI / 2; grass.position.y = -0.02; scene.add(grass);
  // hangar
  const hg = new THREE.Group(); hg.position.set(-50, 0, 0); hg.rotation.y = Math.PI / 2; scene.add(hg);
  const hb = add(hg, new THREE.Mesh(new THREE.BoxGeometry(40, 10, 22), M({ map: WD.T.siding('#9AA4A8', [8, 3]) }))); hb.position.y = 5;
  const roof = add(hg, new THREE.Mesh(new THREE.CylinderGeometry(12, 12, 40, 24, 1, false, -Math.PI / 2.6, Math.PI / 1.3), M({ color: '#6E777C', metalness: 0.3, side: THREE.DoubleSide }))); roof.rotation.z = Math.PI / 2; roof.position.y = 3.2;
  const door = add(hg, new THREE.Mesh(new THREE.PlaneGeometry(28, 8.5), M({ color: '#2A2E34' }))); door.position.set(0, 4.25, 11.05);
  const sgn = WD.signBoard('U.S. NAVY', { w: 12, h: 1.6, bg: '#1E3A6E', fg: '#F2D37A', font: 'Inter' }); sgn.position.set(0, 9.5, 11.2); hg.add(sgn);
  // control tower
  const tw = new THREE.Group(); tw.position.set(-36, 0, 48); scene.add(tw);
  add(tw, new THREE.Mesh(new THREE.BoxGeometry(4, 12, 4), M({ color: '#E8E2D2' }))).position.y = 6;
  const cab = add(tw, new THREE.Mesh(new THREE.BoxGeometry(6, 3, 6), new THREE.MeshStandardMaterial({ color: '#5E7F94', roughness: 0.1, metalness: 0.5 }))); cab.position.y = 13.5;
  add(tw, new THREE.Mesh(new THREE.BoxGeometry(6.8, 0.4, 6.8), M({ color: '#E8E2D2' }))).position.y = 15.2;
  // windsock pole + palms
  [[-30, -14], [-34, 6], [40, -8], [44, 14], [-26, 30], [34, 30]].forEach(([x, z], i) => { const p = palm(7 + rnd(i) * 2, 0.15); p.position.set(x, 0, z); p.scale.setScalar(1.4); scene.add(p); });
  return { scene, sun };
}

// ── 2D overlays ──
/** a big compass card. ang = needle angle (rad); broken = red X; x,y,s */
export function compass(k, ang, { x = 540, y = 760, s = 1, broken = 0, circle = 0 } = {}) {
  if (k <= 0) return; const a = eob(clamp(k)) * s; ctx.save(); ctx.translate(x, y); ctx.scale(a, a);
  ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.beginPath(); ctx.arc(10, 16, 250, 0, 7); ctx.fill();
  ctx.fillStyle = '#2A2E36'; ctx.strokeStyle = INK; ctx.lineWidth = 12; ctx.beginPath(); ctx.arc(0, 0, 250, 0, 7); ctx.fill(); ctx.stroke();
  const gr = ctx.createRadialGradient(-40, -60, 20, 0, 0, 220); gr.addColorStop(0, '#FFF8E6'); gr.addColorStop(1, '#D9CDAE'); ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(0, 0, 214, 0, 7); ctx.fill();
  ctx.strokeStyle = INK; ctx.lineWidth = 4; for (let i = 0; i < 36; i++) { const b = i / 36 * Math.PI * 2, r0 = i % 9 ? 192 : 172; ctx.beginPath(); ctx.moveTo(Math.cos(b) * r0, Math.sin(b) * r0); ctx.lineTo(Math.cos(b) * 210, Math.sin(b) * 210); ctx.stroke(); }
  ctx.fillStyle = INK; ctx.font = '900 64px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; [['N', 0, -132], ['E', 134, 0], ['S', 0, 134], ['W', -134, 0]].forEach(([l, px, py]) => { ctx.fillStyle = l === 'N' ? '#C8283A' : INK; ctx.fillText(l, px, py); });
  ctx.save(); ctx.rotate(ang); ctx.fillStyle = '#E3262E'; ctx.strokeStyle = INK; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(0, -170); ctx.lineTo(26, 0); ctx.lineTo(-26, 0); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#F4EFE4'; ctx.beginPath(); ctx.moveTo(0, 170); ctx.lineTo(26, 0); ctx.lineTo(-26, 0); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore();
  ctx.fillStyle = INK; ctx.beginPath(); ctx.arc(0, 0, 16, 0, 7); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.beginPath(); ctx.ellipse(-70, -110, 90, 40, -0.5, 0, 7); ctx.fill();
  if (broken > 0) { const q = clamp(broken); ctx.strokeStyle = '#E3262E'; ctx.lineWidth = 34; ctx.lineCap = 'round'; ctx.globalAlpha = q; ctx.beginPath(); ctx.moveTo(-150, -150); ctx.lineTo(-150 + 300 * q, -150 + 300 * q); ctx.stroke(); ctx.beginPath(); ctx.moveTo(150, -150); ctx.lineTo(150 - 300 * q, -150 + 300 * q); ctx.stroke(); ctx.globalAlpha = 1; }
  if (circle > 0) redCircle(0, 0, 290, 290, circle);
  ctx.restore();
}
/** hand-drawn red circle (thumbnail style) */
export function redCircle(x, y, rx, ry, k) { const q = clamp(k); if (q <= 0) return; ctx.save(); ctx.strokeStyle = '#FF2A2A'; ctx.lineWidth = 18; ctx.lineCap = 'round'; ctx.shadowColor = 'rgba(0,0,0,0.5)'; ctx.shadowBlur = 12;
  ctx.beginPath(); for (let i = 0; i <= 60 * q; i++) { const a = -1.9 + i / 60 * Math.PI * 2.15; const w = 1 + 0.04 * Math.sin(i * 0.7); ctx.lineTo(x + Math.cos(a) * rx * w, y + Math.sin(a) * ry * w); } ctx.stroke(); ctx.restore(); }
/** red arrow pointing at x,y from the direction ang */
export function redArrow(x, y, ang, k, len = 230) { const q = eob(clamp(k)); if (q <= 0) return; ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.scale(q, q); ctx.shadowColor = 'rgba(0,0,0,0.5)'; ctx.shadowBlur = 14;
  ctx.fillStyle = '#FF2A2A'; ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-90, -70); ctx.lineTo(-90, -28); ctx.lineTo(-len, -28); ctx.lineTo(-len, 28); ctx.lineTo(-90, 28); ctx.lineTo(-90, 70); ctx.closePath(); ctx.stroke(); ctx.fill(); ctx.restore(); }

/** Florida + Bahamas map card. k = in; pin = [x,y] in card px; route draws 0..1; cross on the keys */
const FL = [[300, 120], [345, 118], [372, 170], [400, 250], [430, 330], [452, 410], [460, 480], [450, 540], [420, 570], [395, 540], [372, 470], [338, 410], [300, 360], [280, 300], [262, 230], [235, 170], [180, 150], [110, 140], [60, 120], [60, 60], [300, 60]];
export function floridaMap(k, { route = 0, pinA = 0, pinB = 0, cross = 0 } = {}) {
  if (k <= 0) return; const a = eob(clamp(k)); ctx.save(); ctx.translate(540, 660); ctx.rotate(-0.025); ctx.scale(a * 1.3, a * 1.3); ctx.translate(-330, -330);
  ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.fillRect(16, 20, 660, 660);
  ctx.fillStyle = '#16405E'; ctx.strokeStyle = INK; ctx.lineWidth = 10; ctx.beginPath(); ctx.roundRect(0, 0, 660, 660, 30); ctx.fill(); ctx.stroke();
  ctx.save(); ctx.beginPath(); ctx.roundRect(8, 8, 644, 644, 24); ctx.clip();
  ctx.strokeStyle = 'rgba(255,255,255,0.08)'; ctx.lineWidth = 2; for (let i = 60; i < 660; i += 60) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, 660); ctx.stroke(); ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(660, i); ctx.stroke(); }
  ctx.fillStyle = '#E8D9A8'; ctx.strokeStyle = '#7A6A40'; ctx.lineWidth = 5; ctx.beginPath(); FL.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath(); ctx.fill(); ctx.stroke();
  // keys
  [[400, 590], [372, 606], [344, 618], [316, 626], [290, 630]].forEach(([x, y]) => { ctx.beginPath(); ctx.ellipse(x, y, 16, 6, -0.3, 0, 7); ctx.fill(); ctx.stroke(); });
  // bahamas
  [[560, 300, 30, 14], [590, 380, 20, 40], [540, 440, 14, 30], [610, 470, 26, 12]].forEach(([x, y, rx, ry]) => { ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0.4, 0, 7); ctx.fill(); ctx.stroke(); });
  ctx.fillStyle = '#1F1C33'; ctx.font = '900 36px Inter'; ctx.textAlign = 'center'; ctx.fillText('FLORIDA', 330, 260);
  ctx.fillStyle = '#9FC6DA'; ctx.font = '900 28px Inter'; ctx.fillText('ATLANTIC', 560, 170);
  // route from Fort Lauderdale (442, 470) out east
  if (route > 0) { const P = [[450, 470], [560, 420], [600, 330], [520, 300], [470, 250]]; const n = clamp(route) * (P.length - 1); ctx.strokeStyle = '#FFD43B'; ctx.lineWidth = 9; ctx.setLineDash([22, 16]); ctx.beginPath(); ctx.moveTo(...P[0]);
    for (let i = 0; i < Math.ceil(n); i++) { const f = Math.min(1, n - i); ctx.lineTo(lerp(P[i][0], P[i + 1][0], f), lerp(P[i][1], P[i + 1][1], f)); } ctx.stroke(); ctx.setLineDash([]); }
  const pin = (x, y, q, col, label) => { if (q <= 0) return; const s = eob(clamp(q)); ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = col; ctx.strokeStyle = INK; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(0, 0); ctx.bezierCurveTo(-40, -50, -36, -100, 0, -100); ctx.bezierCurveTo(36, -100, 40, -50, 0, 0); ctx.fill(); ctx.stroke(); ctx.fillStyle = '#FFF'; ctx.beginPath(); ctx.arc(0, -66, 14, 0, 7); ctx.fill();
    ctx.font = '900 34px Inter'; const w = ctx.measureText(label).width + 30; ctx.fillStyle = col; ctx.beginPath(); ctx.roundRect(-w / 2, -176, w, 60, 16); ctx.fill(); ctx.stroke(); ctx.fillStyle = '#FFF'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(label, 0, -145); ctx.restore(); };
  pin(345, 615, pinA, '#2F7DD8', 'HE THOUGHT');
  if (cross > 0) { const q = clamp(cross); ctx.strokeStyle = '#E3262E'; ctx.lineWidth = 22; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(290, 560); ctx.lineTo(290 + 110 * q, 560 + 110 * q); ctx.stroke(); ctx.beginPath(); ctx.moveTo(400, 560); ctx.lineTo(400 - 110 * q, 560 + 110 * q); ctx.stroke(); }
  pin(505, 215, pinB, '#E3262E', 'OPEN OCEAN');
  ctx.restore(); ctx.restore();
}
/** row(s) of little man icons: n shown of total, lit = how many are red (lost) */
export function people(n, total, { y = 560, lit = 0, cols = 7, size = 1 } = {}) {
  ctx.save(); const sp = 120 * size, rows = Math.ceil(total / cols), x0 = 540 - (Math.min(cols, total) - 1) * sp / 2;
  for (let i = 0; i < Math.min(n, total); i++) { const r = Math.floor(i / cols), c = i % cols, x = x0 + c * sp, yy = y + r * sp * 1.25 - (rows - 1) * sp * 0.6; const q = clamp(n - i);
    ctx.save(); ctx.translate(x, yy); ctx.scale(eob(q) * size, eob(q) * size); ctx.fillStyle = i < lit ? '#E3262E' : '#F4EFE4'; ctx.strokeStyle = INK; ctx.lineWidth = 7;
    ctx.beginPath(); ctx.arc(0, -40, 24, 0, 7); ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.roundRect(-30, -10, 60, 64, [24, 24, 8, 8]); ctx.fill(); ctx.stroke(); ctx.restore(); }
  ctx.restore();
}
/** a big counter number with label underneath */
export function bigNum(txt, k, { y = 360, size = 220, col = '#FFFFFF', label = '', lcol = '#FFD43B' } = {}) {
  if (k <= 0) return; const s = lerp(1.6, 1, eo(clamp(k * 1.5))); ctx.save(); ctx.translate(540, y); ctx.scale(s, s); ctx.rotate(-0.03);
  ctx.font = `900 ${size}px Inter`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round'; ctx.lineWidth = 30; ctx.strokeStyle = INK; ctx.strokeText(txt, 0, 0); ctx.fillStyle = col; ctx.fillText(txt, 0, 0);
  if (label) { ctx.font = '900 72px Inter'; ctx.lineWidth = 18; ctx.strokeText(label, 0, size * 0.62); ctx.fillStyle = lcol; ctx.fillText(label, 0, size * 0.62); }
  ctx.restore();
}
/** follow button: max 3 words */
export function followBtn(k, t, y = 380) {
  if (k <= 0) return; const a = eob(clamp(k)); ctx.save(); ctx.translate(540, y); ctx.scale(a, a); const pressed = k > 1.6 && k < 2.0; if (pressed) ctx.scale(0.93, 0.93);
  ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.beginPath(); ctx.roundRect(-330, -76, 670, 160, 80); ctx.fill();
  ctx.fillStyle = k > 1.8 ? '#3A3A46' : '#E3262E'; ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = 8; ctx.beginPath(); ctx.roundRect(-340, -86, 670, 160, 80); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#FFFFFF'; ctx.font = '900 70px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(k > 1.8 ? 'FOLLOWING ✓' : 'FOLLOW FOR MORE', -5, 0);
  const hx = lerp(300, 160, clamp((k - 0.8) / 0.8)), hy = lerp(240, 60, clamp((k - 0.8) / 0.8)); ctx.translate(hx, hy); ctx.rotate(-0.5); ctx.fillStyle = '#FFFFFF'; ctx.strokeStyle = INK; ctx.lineWidth = 7;
  ctx.beginPath(); ctx.roundRect(-34, -10, 68, 90, 22); ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.roundRect(-14, -80, 28, 90, 14); ctx.fill(); ctx.stroke(); ctx.restore();
}
/** zoom/motion blur of the frame just blitted: copies of the canvas scaled about (cx, cy) */
export function zoomBlur(cv, a, { cx = 540, cy = 960, n = 4, spread = 0.035 } = {}) {
  if (a <= 0.01) return; ctx.save();
  for (let i = 1; i <= n; i++) { const s = 1 + spread * a * i / n; ctx.globalAlpha = 0.22 * a; ctx.drawImage(cv, cx - cx * s, cy - cy * s, 1080 * s, 1920 * s); }
  ctx.restore();
}
/** horizontal smear for whip pans */
export function smear(cv, a, dx = 1) { if (a <= 0.01) return; ctx.save(); for (let i = 1; i <= 5; i++) { ctx.globalAlpha = 0.2 * a; ctx.drawImage(cv, dx * i * 28 * a, 0, 1080, 1920); } ctx.restore(); }
/** soft haze/fog band */
export function haze(a, col = '200,220,235') { if (a <= 0) return; ctx.save(); const g = ctx.createLinearGradient(0, 0, 0, 1920); g.addColorStop(0, `rgba(${col},${0.0})`); g.addColorStop(0.45, `rgba(${col},${0.55 * a})`); g.addColorStop(1, `rgba(${col},${0.25 * a})`); ctx.fillStyle = g; ctx.fillRect(0, 0, 1080, 1920); ctx.restore(); }
/** cinematic letter-dark top/bottom so overlays read */
export function topShade(a = 0.5) { ctx.save(); const g = ctx.createLinearGradient(0, 0, 0, 700); g.addColorStop(0, `rgba(0,0,0,${a})`); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, 1080, 700); ctx.restore(); }
