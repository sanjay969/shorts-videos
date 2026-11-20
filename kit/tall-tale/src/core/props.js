// 3D props and buildings for the Tall Tale world. Each returns a THREE.Group (feet / base at y = 0) and, when it
// animates, an update function on the group (group.update(...)).
//   house({ wall, roof, trim }) .door (hinge group)   ·  signpost([['LEWISTON', 'r'], ...])   ·  platformScale() .set(lbs)
//   train() .update(t)  (locomotive + mail car + smoke)   ·  rails(len)   ·  cubbies(w, h)   ·  mailSack()   ·  parcel(w, h, d)
//   desk()   ·  poster(lines, opts)   ·  chickCrate() .update(t)
import * as THREE from 'three';
import { T, mat, canvasTex, signBoard, car } from './world.js';

const rnd = (i) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const box = (w, h, d, m, x = 0, y = 0, z = 0, parent) => { const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); b.position.set(x, y, z); b.castShadow = b.receiveShadow = true; if (parent) parent.add(b); return b; };
const cyl = (r1, r2, h, m, x, y, z, parent, seg = 16) => { const c = new THREE.Mesh(new THREE.CylinderGeometry(r1, r2, h, seg), m); c.position.set(x, y, z); c.castShadow = c.receiveShadow = true; if (parent) parent.add(c); return c; };
const INK = '#1F1C33';

/** a farmhouse facing +z: 6 wide, 4.5 deep. Porch in front. g.door is the door's hinge group (rotate .y to open) */
export function house({ wall = '#F2E6CF', roof = '#B5553C', trim = '#FFFFFF', door = '#3C6FB6' } = {}) {
  const g = new THREE.Group(), W = 6, D = 4.5, H = 3.2;
  const wm = mat({ map: T.siding(wall, [3, 2]) });
  box(W, H, D, wm, 0, H / 2, 0, g);
  // gable: a triangular prism
  const sh = new THREE.Shape(); sh.moveTo(-W / 2 - 0.4, 0); sh.lineTo(0, 2.0); sh.lineTo(W / 2 + 0.4, 0); sh.lineTo(-W / 2 - 0.4, 0);
  const gable = new THREE.Mesh(new THREE.ExtrudeGeometry(sh, { depth: D - 0.02, bevelEnabled: false }), wm); gable.position.set(0, H, -D / 2 + 0.01); gable.castShadow = true; g.add(gable);
  const rm = mat({ color: roof, map: T.planks(roof, [2, 2]) }), slope = Math.hypot(W / 2 + 0.6, 2.1);
  [-1, 1].forEach((s) => { const r = box(slope, 0.14, D + 0.8, rm, s * (W / 4 + 0.15), H + 1.02, 0, g); r.rotation.z = -s * Math.atan2(2.1, W / 2 + 0.6); });
  cyl(0.3, 0.3, 1.4, mat({ color: '#9E4A3A', map: T.brick('#9E4A3A', [0.5, 1]) }), 1.6, H + 1.6, -0.6, g, 4);
  // porch
  box(W + 0.4, 0.25, 1.8, mat({ map: T.planks('#A8693E', [2, 1]) }), 0, 0.12, D / 2 + 0.9, g);
  [-W / 2, -1, 1, W / 2].forEach((x) => box(0.14, 2.6, 0.14, mat({ color: trim }), x, 1.4, D / 2 + 1.7, g));
  const pr = box(W + 0.6, 0.12, 2.0, mat({ color: roof }), 0, 2.75, D / 2 + 0.9, g); pr.rotation.x = 0.12;
  for (let x = -W / 2; x <= W / 2; x += 0.35) if (Math.abs(x) > 0.9) box(0.06, 0.7, 0.06, mat({ color: trim }), x, 0.6, D / 2 + 1.75, g);
  [-1, 1].forEach((sd) => box(W / 2 - 0.9, 0.08, 0.08, mat({ color: trim }), sd * (W / 4 + 0.45), 0.95, D / 2 + 1.75, g));
  // windows
  const winTex = canvasTex('housewin', 128, 160, (c) => { c.fillStyle = trim; c.fillRect(0, 0, 128, 160); const gr = c.createLinearGradient(0, 0, 128, 160); gr.addColorStop(0, '#9CC7E4'); gr.addColorStop(1, '#3F6E9A'); c.fillStyle = gr; c.fillRect(12, 12, 104, 136); c.fillStyle = trim; c.fillRect(60, 12, 8, 136); c.fillRect(12, 76, 104, 8); c.fillStyle = '#E58A9A'; c.fillRect(12, 12, 20, 136); c.fillRect(96, 12, 20, 136); });
  [-1.9, 1.9].forEach((x) => { const w = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 1.15), mat({ map: winTex })); w.position.set(x, 1.7, D / 2 + 0.01); g.add(w); box(1.1, 0.1, 0.25, mat({ color: trim }), x, 1.07, D / 2 + 0.1, g); });
  // door on a hinge
  const hinge = new THREE.Group(); hinge.position.set(-0.5, 0.25, D / 2 + 0.03); g.add(hinge);
  const dTex = canvasTex('door' + door, 128, 256, (c) => { c.fillStyle = door; c.fillRect(0, 0, 128, 256); c.strokeStyle = 'rgba(0,0,0,0.25)'; c.lineWidth = 6; c.strokeRect(16, 16, 96, 100); c.strokeRect(16, 136, 96, 104); c.fillStyle = '#E2B33C'; c.beginPath(); c.arc(104, 136, 7, 0, 7); c.fill(); });
  const dm = box(1.0, 2.1, 0.08, [mat({ color: door }), mat({ color: door }), mat({ color: door }), mat({ color: door }), mat({ map: dTex }), mat({ color: door })], 0.5, 1.05, 0, hinge);
  const dark = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 2.1), new THREE.MeshBasicMaterial({ color: '#2A1E1A' })); dark.position.set(0, 1.3, D / 2 + 0.005); g.add(dark);
  box(1.2, 0.1, 0.1, mat({ color: trim }), 0, 2.4, D / 2 + 0.05, g);
  g.door = hinge; return g;
}

export function signpost(arms = [['LEWISTON  73 MI', 'r'], ['GRANGEVILLE', 'l']]) {
  const g = new THREE.Group(); cyl(0.08, 0.1, 3, mat({ color: '#7A5236', map: T.planks('#7A5236', [0.3, 1]) }), 0, 1.5, 0, g, 8);
  arms.forEach(([txt, dir], i) => {
    const t = canvasTex('arm' + txt, 512, 128, (c) => { c.fillStyle = '#F2E6CF'; c.beginPath(); if (dir === 'r') { c.moveTo(0, 8); c.lineTo(440, 8); c.lineTo(504, 64); c.lineTo(440, 120); c.lineTo(0, 120); } else { c.moveTo(512, 8); c.lineTo(72, 8); c.lineTo(8, 64); c.lineTo(72, 120); c.lineTo(512, 120); } c.closePath(); c.fill(); c.strokeStyle = INK; c.lineWidth = 8; c.stroke(); c.fillStyle = INK; c.font = '700 54px Caladea, Georgia, serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(txt, 256, 68); });
    const m = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 0.45), new THREE.MeshStandardMaterial({ map: t, transparent: true, alphaTest: 0.5, side: THREE.DoubleSide, roughness: 0.8 }));
    m.position.set(dir === 'r' ? 0.85 : -0.85, 2.5 - i * 0.55, 0.1); m.rotation.y = (i ? -0.15 : 0.12); m.castShadow = true; g.add(m);
  });
  return g;
}

/** a post-office platform scale with a round dial (0-60 lb). g.set(lbs) moves the needle */
export function platformScale() {
  const g = new THREE.Group(), iron = mat({ color: '#2E3A35', roughness: 0.4, metalness: 0.4 }), brass = mat({ color: '#C9A13B', roughness: 0.3, metalness: 0.7 });
  box(0.9, 0.08, 0.7, brass, 0, 0.04, 0, g); box(0.95, 0.04, 0.75, iron, 0, 0.0, 0, g);
  box(0.08, 1.45, 0.08, iron, 0, 0.75, -0.3, g);
  const cv = document.createElement('canvas'); cv.width = cv.height = 512; const c = cv.getContext('2d');
  const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace;
  const dial = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.08, 40), [iron, new THREE.MeshStandardMaterial({ map: tex, roughness: 0.4 }), iron]);
  dial.rotation.x = Math.PI / 2; dial.position.set(0, 1.62, -0.28); dial.castShadow = true; g.add(dial);
  const ang = (v) => -Math.PI * 0.75 + (v / 60) * Math.PI * 1.5;
  g.set = (lbs) => {
    c.fillStyle = '#C9A13B'; c.fillRect(0, 0, 512, 512); c.fillStyle = '#FFF8E6'; c.beginPath(); c.arc(256, 256, 236, 0, 7); c.fill();
    c.strokeStyle = '#D8343F'; c.lineWidth = 34; c.beginPath(); c.arc(256, 256, 196, ang(50) - Math.PI / 2, ang(60) - Math.PI / 2); c.stroke();
    c.fillStyle = INK; c.font = '900 40px Inter'; c.textAlign = 'center'; c.textBaseline = 'middle';
    for (let v = 0; v <= 60; v += 5) { const a = ang(v) - Math.PI / 2, big = v % 10 === 0; c.strokeStyle = INK; c.lineWidth = big ? 8 : 4; c.beginPath(); c.moveTo(256 + Math.cos(a) * 214, 256 + Math.sin(a) * 214); c.lineTo(256 + Math.cos(a) * (big ? 176 : 192), 256 + Math.sin(a) * (big ? 176 : 192)); c.stroke(); if (big) c.fillText(String(v), 256 + Math.cos(a) * 140, 256 + Math.sin(a) * 140); }
    c.font = '900 30px Inter'; c.fillStyle = '#D8343F'; c.fillText('LIMIT', 256, 360); c.fillStyle = INK; c.fillText('POUNDS', 256, 400);
    const a = ang(lbs) - Math.PI / 2; c.strokeStyle = '#B5372E'; c.lineWidth = 12; c.lineCap = 'round'; c.beginPath(); c.moveTo(256 - Math.cos(a) * 30, 256 - Math.sin(a) * 30); c.lineTo(256 + Math.cos(a) * 200, 256 + Math.sin(a) * 200); c.stroke();
    c.fillStyle = INK; c.beginPath(); c.arc(256, 256, 18, 0, 7); c.fill();
    tex.needsUpdate = true;
  };
  g.set(0); g.dial = dial; return g;
}

export function rails(len = 200) {
  const g = new THREE.Group(), steel = mat({ color: '#6E6A6A', roughness: 0.4, metalness: 0.6 });
  [-0.72, 0.72].forEach((z) => box(len, 0.1, 0.08, steel, 0, 0.17, z, g));
  const ties = new THREE.InstancedMesh(new THREE.BoxGeometry(0.25, 0.1, 2.2), mat({ color: '#5A3E2A' }), Math.floor(len / 0.7)), m4 = new THREE.Matrix4();
  for (let i = 0; i < ties.count; i++) { m4.makeTranslation(-len / 2 + i * 0.7, 0.07, 0); ties.setMatrixAt(i, m4); } ties.receiveShadow = true; g.add(ties);
  const bed = box(len, 0.06, 3.0, mat({ map: T.dirt('#9C8A78', [len / 4, 1], false) }), 0, 0.02, 0, g); bed.castShadow = false;
  return g;
}

let smokeT = null;
function smokeTex() { if (smokeT) return smokeT; const c = document.createElement('canvas'); c.width = c.height = 128; const g = c.getContext('2d'); const gr = g.createRadialGradient(64, 64, 4, 64, 64, 60); gr.addColorStop(0, 'rgba(240,240,245,1)'); gr.addColorStop(0.7, 'rgba(225,225,235,0.85)'); gr.addColorStop(1, 'rgba(225,225,235,0)'); g.fillStyle = gr; g.fillRect(0, 0, 128, 128); smokeT = new THREE.CanvasTexture(c); return smokeT; }

/** an old steam locomotive pulling a green U.S. MAIL car, running along +x. g.update(t) puffs smoke + turns wheels */
export function train() {
  const g = new THREE.Group(), black = mat({ color: '#25242B', roughness: 0.45, metalness: 0.3 }), red = mat({ color: '#B5372E', roughness: 0.5 }), brass = mat({ color: '#C9A13B', metalness: 0.7, roughness: 0.3 });
  const loco = new THREE.Group(); g.add(loco);
  const boiler = cyl(0.62, 0.62, 3.4, black, 1.0, 1.55, 0, loco, 24); boiler.rotation.z = Math.PI / 2;
  [0.2, 1.0, 1.8].forEach((x) => { const b = cyl(0.64, 0.64, 0.08, brass, x, 1.55, 0, loco, 24); b.rotation.z = Math.PI / 2; });
  const front = cyl(0.5, 0.5, 0.1, mat({ color: '#3A3940' }), 2.72, 1.55, 0, loco, 24); front.rotation.z = Math.PI / 2;
  const lampM = new THREE.MeshStandardMaterial({ color: '#FFF3C8', emissive: '#FFE7A0', emissiveIntensity: 1 }); const lp = new THREE.Mesh(new THREE.SphereGeometry(0.16, 12, 8), lampM); lp.position.set(2.75, 2.3, 0); loco.add(lp);
  cyl(0.2, 0.32, 0.9, black, 2.2, 2.55, 0, loco); cyl(0.36, 0.2, 0.25, black, 2.2, 3.05, 0, loco);
  cyl(0.22, 0.22, 0.4, brass, 1.2, 2.3, 0, loco);
  box(1.6, 1.9, 1.7, red, -1.3, 1.95, 0, loco); box(1.9, 0.12, 1.95, black, -1.3, 2.95, 0, loco);
  [-0.86, 0.86].forEach((z) => { const w = new THREE.Mesh(new THREE.PlaneGeometry(0.7, 0.6), mat({ color: '#F2D37A', emissive: '#F2C060', emissiveIntensity: 0.25 })); w.position.set(-1.3, 2.2, z * 1.001); w.rotation.y = z > 0 ? 0 : Math.PI; loco.add(w); });
  box(4.6, 0.3, 1.5, black, 0.2, 0.75, 0, loco);
  const cc = new THREE.Mesh(new THREE.ConeGeometry(0.8, 0.9, 4), red); cc.rotation.set(0, Math.PI / 4, Math.PI / 2); cc.position.set(3.0, 0.55, 0); cc.scale.set(1, 1, 0.5); loco.add(cc);
  const wheels = [];
  [[-1.3, 0.55], [0.0, 0.55], [1.0, 0.55], [2.1, 0.38]].forEach(([x, r]) => [-0.72, 0.72].forEach((z) => { const w = cyl(r, r, 0.12, red, x, r + 0.2, z, loco, 20); w.rotation.x = Math.PI / 2; wheels.push(w); const hub = cyl(r * 0.3, r * 0.3, 0.14, brass, x, r + 0.2, z, loco, 10); hub.rotation.x = Math.PI / 2; }));
  // mail car
  const car = new THREE.Group(); car.position.x = -6.2; g.add(car);
  const green = mat({ color: '#2E5A44', roughness: 0.6, map: T.planks('#2E5A44', [2, 1]) });
  box(7.0, 2.4, 2.2, green, 0, 2.0, 0, car); box(7.3, 0.2, 2.5, black, 0, 3.3, 0, car); box(7.0, 0.3, 1.6, black, 0, 0.75, 0, car);
  [1, -1].forEach((s) => { const sb = signBoard('U.S. MAIL', { w: 3.2, h: 0.55, bg: '#2E5A44', fg: '#F2D37A' }); sb.position.set(0, 2.6, s * 1.13); if (s < 0) sb.rotation.y = Math.PI; car.add(sb); for (let x = -3; x <= 3; x += 2) if (Math.abs(x) > 1.5) { const w = new THREE.Mesh(new THREE.PlaneGeometry(0.7, 0.6), mat({ color: '#F2D37A', emissive: '#F2C060', emissiveIntensity: 0.3 })); w.position.set(x, 2.0, s * 1.115); if (s < 0) w.rotation.y = Math.PI; car.add(w); } });
  [-2.6, -1.8, 1.8, 2.6].forEach((x) => [-0.72, 0.72].forEach((z) => { const w = cyl(0.4, 0.4, 0.12, black, x, 0.6, z, car, 18); w.rotation.x = Math.PI / 2; wheels.push(w); }));
  // smoke
  const puffs = []; for (let i = 0; i < 14; i++) { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: smokeTex(), transparent: true, depthWrite: false, color: '#EEEEF4' })); g.add(s); puffs.push(s); }
  g.update = (t, speed = 6) => {
    wheels.forEach((w) => { w.rotation.y = -t * speed * 1.6; });
    puffs.forEach((p, i) => { const age = ((t * 1.4 + i / puffs.length) % 1); const k = age; p.position.set(2.2 - k * speed * 0.9 - k * 1.5, 3.2 + k * 2.6, (rnd(i) - 0.5) * k * 1.4); const sc = 0.5 + k * 2.4; p.scale.set(sc, sc, 1); p.material.opacity = (1 - k) * 0.9; });
  };
  g.update(0); return g;
}

/** a wall of wooden mail cubbies with letters poking out (w x h metres, faces +z) */
export function cubbies(w = 3, h = 1.8) {
  const g = new THREE.Group(), wood = mat({ map: T.planks('#8A5A36', [1, 1]) });
  box(w, h, 0.4, mat({ color: '#4A2E1E' }), 0, h / 2, 0, g);
  const nx = Math.round(w / 0.32), ny = Math.round(h / 0.26);
  for (let i = 0; i <= nx; i++) box(0.03, h, 0.42, wood, -w / 2 + i * w / nx, h / 2, 0.01, g);
  for (let j = 0; j <= ny; j++) box(w, 0.03, 0.42, wood, 0, j * h / ny, 0.01, g);
  const lm = [mat({ color: '#FFFDF4' }), mat({ color: '#F2E6CF' }), mat({ color: '#E9D7A5' })];
  for (let i = 0; i < nx; i++) for (let j = 0; j < ny; j++) if (rnd(i * 17 + j) > 0.35) { const l = box(w / nx * 0.7, h / ny * (0.4 + rnd(i + j * 3) * 0.4), 0.02, lm[(i + j) % 3], -w / 2 + (i + 0.5) * w / nx, j * h / ny + 0.03 + h / ny * 0.25, 0.12, g); l.rotation.z = (rnd(i * j) - 0.5) * 0.2; }
  return g;
}
export function mailSack(s = 1, col = '#C9B48A') {
  const g = new THREE.Group(); const m = new THREE.Mesh(new THREE.SphereGeometry(0.4 * s, 16, 12), mat({ color: col, roughness: 1 })); m.scale.set(1, 1.2, 0.85); m.position.y = 0.42 * s; m.castShadow = m.receiveShadow = true; g.add(m);
  const tie = cyl(0.08 * s, 0.14 * s, 0.25 * s, mat({ color: col }), 0, 0.98 * s, 0, g, 10);
  const lab = canvasTex('sacklab', 128, 64, (c) => { c.fillStyle = '#F2E6CF'; c.fillRect(0, 0, 128, 64); c.fillStyle = '#2E4E8A'; c.font = '900 26px Inter'; c.textAlign = 'center'; c.fillText('U.S. MAIL', 64, 42); });
  const l = new THREE.Mesh(new THREE.PlaneGeometry(0.4 * s, 0.2 * s), mat({ map: lab })); l.position.set(0, 0.45 * s, 0.35 * s); g.add(l); return g;
}
export function parcel(w = 0.5, h = 0.35, d = 0.4, label = true) {
  const t = canvasTex('parcel', 256, 256, (c) => { c.fillStyle = '#C8935A'; c.fillRect(0, 0, 256, 256); c.fillStyle = '#B07A48'; for (let i = 0; i < 30; i++) c.fillRect(rnd(i) * 256, rnd(i * 3) * 256, 40, 2); c.fillStyle = '#E9D7A5'; c.fillRect(120, 0, 16, 256); c.fillRect(0, 120, 256, 16); if (label) { c.fillStyle = '#FFFDF4'; c.fillRect(150, 150, 90, 70); c.fillStyle = '#D8343F'; c.fillRect(214, 156, 20, 24); } });
  const g = new THREE.Group(); box(w, h, d, mat({ map: t }), 0, h / 2, 0, g); return g;
}
export function desk(w = 2.2) {
  const g = new THREE.Group(), wood = mat({ map: T.planks('#6B3E26', [1, 1]) });
  box(w, 0.08, 1.0, mat({ map: T.felt('#2E5A44') }), 0, 0.84, 0, g); box(w + 0.1, 0.06, 1.1, wood, 0, 0.78, 0, g);
  box(0.5, 0.76, 0.95, wood, -w / 2 + 0.3, 0.38, 0, g); box(0.5, 0.76, 0.95, wood, w / 2 - 0.3, 0.38, 0, g); box(w - 1, 0.6, 0.06, wood, 0, 0.45, -0.45, g);
  return g;
}
/** a printed notice on paper (plane). g.mesh to animate */
export function poster(lines = ['NOTICE'], { w = 1.6, h = 2.0, bg = '#F4EBD6', fg = '#1F1C33', accent = '#B5372E' } = {}) {
  const t = canvasTex('poster' + lines.join('|'), Math.round(w * 300), Math.round(h * 300), (c, cw, ch) => {
    c.fillStyle = bg; c.fillRect(0, 0, cw, ch); c.strokeStyle = fg; c.lineWidth = 8; c.strokeRect(16, 16, cw - 32, ch - 32);
    c.textAlign = 'center'; c.textBaseline = 'middle'; let y = ch * 0.16;
    lines.forEach((l, i) => { const big = i === 0 || l.startsWith('!'); const txt = l.replace(/^!/, ''); let fs = big ? ch * 0.12 : ch * 0.065; c.font = `${big ? 900 : 800} ${fs}px Inter`; while (c.measureText(txt).width > cw * 0.84) { fs -= 2; c.font = `${big ? 900 : 800} ${fs}px Inter`; } c.fillStyle = l.startsWith('!') ? accent : fg; c.fillText(txt, cw / 2, y); y += fs * 1.35; if (i === 0) { c.fillStyle = accent; c.fillRect(cw * 0.2, y - fs * 0.3, cw * 0.6, 8); y += 24; } });
  });
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat({ map: t, side: THREE.DoubleSide })); m.castShadow = true; const g = new THREE.Group(); g.add(m); g.mesh = m; return g;
}
/** a crate of peeping baby chicks (2D cut-outs that bob). g.update(t) */
export function chickCrate(n = 6) {
  const g = new THREE.Group();
  const holes = canvasTex('crate', 256, 128, (c) => { c.fillStyle = '#C8935A'; c.fillRect(0, 0, 256, 128); c.fillStyle = '#5A3E2A'; for (let i = 0; i < 5; i++) { c.beginPath(); c.arc(30 + i * 49, 64, 12, 0, 7); c.fill(); } c.fillStyle = '#D8343F'; c.font = '900 22px Inter'; c.textAlign = 'center'; c.fillText('LIVE CHICKS', 128, 112); c.fillText('THIS SIDE UP', 128, 26); });
  const wood = mat({ color: '#C8935A' }), fm = mat({ map: holes });
  box(1.0, 0.36, 0.6, [wood, wood, wood, wood, fm, wood], 0, 0.18, 0, g);
  const ct = canvasTex('chick', 256, 256, (c) => { c.lineWidth = 9; c.strokeStyle = INK; c.fillStyle = '#F6D54A'; c.beginPath(); c.ellipse(128, 160, 88, 80, 0, 0, 7); c.fill(); c.stroke(); c.beginPath(); c.arc(128, 92, 62, 0, 7); c.fill(); c.stroke(); c.fillStyle = '#F6D54A'; c.beginPath(); c.moveTo(118, 32); c.quadraticCurveTo(128, 6, 140, 34); c.fill(); c.stroke(); c.fillStyle = INK; [-1, 1].forEach((s) => { c.beginPath(); c.ellipse(128 + s * 24, 86, 8, 11, 0, 0, 7); c.fill(); }); c.fillStyle = '#F2913A'; c.beginPath(); c.moveTo(114, 104); c.lineTo(142, 104); c.lineTo(128, 124); c.closePath(); c.fill(); c.lineWidth = 5; c.stroke(); c.fillStyle = 'rgba(240,120,130,0.4)'; [-1, 1].forEach((s) => { c.beginPath(); c.ellipse(128 + s * 44, 112, 12, 7, 0, 0, 7); c.fill(); }); });
  const chicks = [];
  for (let i = 0; i < n; i++) { const s = new THREE.Mesh(new THREE.PlaneGeometry(0.22, 0.22), new THREE.MeshBasicMaterial({ map: ct, transparent: true, alphaTest: 0.1 })); s.position.set(-0.38 + i * 0.76 / (n - 1), 0.4, -0.05 + (i % 2) * 0.1); g.add(s); chicks.push(s); }
  g.update = (t) => chicks.forEach((c, i) => { c.position.y = 0.38 + Math.max(0, Math.sin(t * 7 + i * 1.7)) * 0.07; c.rotation.z = Math.sin(t * 5 + i) * 0.15; });
  g.chicks = chicks; return g;
}

// ---------- added for "The Billion Dollar Game" ----------
//   palm(h) · moneyStack() .set(n) (n bundles high, grows upward) · gear(r, teeth, col) · globe() .pins (show with .visible)
//   plane() · workDesk() .screen (emissive monitor) · policeCar() .update(t) · cityModel() · bigCrate(text)
export function palm(h = 5, lean = 0.15) {
  const g = new THREE.Group(), bark = mat({ color: '#9A7448' });
  for (let i = 0; i < 9; i++) { const y = i * h / 9; const c = cyl(0.17 - i * 0.008, 0.19 - i * 0.008, h / 9 + 0.02, bark, Math.sin(i / 9 * 1.4) * lean * h * 0.4, y + h / 18, 0, g, 8); c.rotation.z = -lean * 0.4; }
  const top = new THREE.Vector3(Math.sin(1.4) * lean * h * 0.4, h, 0), leaf = mat({ color: '#3F9A46', side: THREE.DoubleSide });
  for (let i = 0; i < 8; i++) {
    const sh = new THREE.Shape(); sh.moveTo(0, 0); sh.quadraticCurveTo(1.0, 0.38, 2.3, 0); sh.quadraticCurveTo(1.0, -0.1, 0, 0);
    const m = new THREE.Mesh(new THREE.ShapeGeometry(sh, 8), leaf); m.position.copy(top); m.rotation.set(-Math.PI / 2 + 0.55, 0, i / 8 * Math.PI * 2); m.rotation.order = 'ZXY';
    const p = new THREE.Group(); p.position.copy(top); p.rotation.y = i / 8 * Math.PI * 2; m.position.set(0, 0, 0); m.rotation.set(0.6 + rnd(i) * 0.3, 0, 0); m.rotation.y = 0; const q = new THREE.Group(); q.rotation.z = -0.5 - rnd(i * 3) * 0.3; q.add(m); m.rotation.set(-Math.PI / 2, 0, 0); p.add(q); m.castShadow = true; g.add(p);
  }
  [0, 2, 4].forEach((i) => { const n = new THREE.Mesh(new THREE.SphereGeometry(0.13, 8, 6), mat({ color: '#6B4A2A' })); n.position.copy(top).add(new THREE.Vector3(Math.cos(i) * 0.18, -0.15, Math.sin(i) * 0.18)); g.add(n); });
  return g;
}
const billTex = () => canvasTex('billside', 256, 64, (c) => { c.fillStyle = '#7FBF7A'; c.fillRect(0, 0, 256, 64); for (let y = 0; y < 64; y += 4) { c.fillStyle = y % 8 ? '#6FAE6A' : '#8FD08A'; c.fillRect(0, y, 256, 2); } c.fillStyle = '#E9D7A5'; c.fillRect(110, 0, 36, 64); });
const billTop = () => canvasTex('billtop', 256, 128, (c) => { c.fillStyle = '#8FD08A'; c.fillRect(0, 0, 256, 128); c.strokeStyle = '#3E7A42'; c.lineWidth = 8; c.strokeRect(12, 12, 232, 104); c.fillStyle = '#3E7A42'; c.beginPath(); c.arc(128, 64, 30, 0, 7); c.fill(); c.fillStyle = '#E9F5DF'; c.font = '900 40px Inter'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('$', 128, 66); c.fillStyle = '#E9D7A5'; c.fillRect(110, 0, 36, 128); });
/** a pile of cash bundles: 2 x 2 bundles per layer. g.set(n) shows n layers (fractional = the top layer pops in) */
export function moneyStack(maxLayers = 30) {
  const g = new THREE.Group(), side = mat({ map: billTex() }), top = mat({ map: billTop() }), m = [side, side, top, side, side, side];
  const bw = 0.62, bh = 0.16, bd = 0.3, layers = [];
  for (let l = 0; l < maxLayers; l++) { const L = new THREE.Group(); L.position.y = l * bh + bh / 2; g.add(L); layers.push(L);
    [[-0.32, -0.16], [0.32, -0.16], [-0.32, 0.16], [0.32, 0.16]].forEach(([x, z], k) => { const b = box(bw, bh * 0.94, bd, m, x + (rnd(l * 4 + k) - 0.5) * 0.04, 0, z, L); b.rotation.y = (rnd(l * 7 + k) - 0.5) * 0.08; }); }
  g.set = (n) => layers.forEach((L, i) => { const a = Math.max(0, Math.min(1, n - i)); L.visible = a > 0; L.scale.setScalar(a > 0 ? 0.6 + 0.4 * a : 1); });
  g.layerH = bh; g.set(maxLayers); return g;
}
export function gear(r = 1, teeth = 12, col = '#C9A13B', depth = 0.25) {
  const sh = new THREE.Shape(), n = teeth * 4;
  for (let i = 0; i <= n; i++) { const a = i / n * Math.PI * 2, out = (i % 4 === 1 || i % 4 === 2) ? r * 1.18 : r; const x = Math.cos(a) * out, y = Math.sin(a) * out; i ? sh.lineTo(x, y) : sh.moveTo(x, y); }
  const hole = new THREE.Path(); hole.absarc(0, 0, r * 0.3, 0, Math.PI * 2, true); sh.holes.push(hole);
  const m = new THREE.Mesh(new THREE.ExtrudeGeometry(sh, { depth, bevelEnabled: true, bevelSize: 0.03, bevelThickness: 0.03, bevelSegments: 1 }), mat({ color: col, roughness: 0.35, metalness: 0.6 }));
  m.position.z = -depth / 2; m.castShadow = m.receiveShadow = true; const g = new THREE.Group(); g.add(m); return g;
}
export function globe(r = 0.8) {
  const t = canvasTex('globe', 1024, 512, (c) => { c.fillStyle = '#3C86C9'; c.fillRect(0, 0, 1024, 512); c.fillStyle = '#6DBB4A';
    const blob = (pts) => { c.beginPath(); pts.forEach(([x, y], i) => (i ? c.lineTo(x, y) : c.moveTo(x, y))); c.closePath(); c.fill(); };
    blob([[120, 110], [300, 90], [330, 170], [250, 230], [230, 300], [180, 250], [130, 190]]); blob([[250, 290], [320, 300], [300, 420], [260, 440], [240, 360]]);
    blob([[470, 100], [600, 80], [760, 110], [820, 180], [700, 230], [600, 210], [520, 180], [480, 140]]); blob([[480, 220], [560, 230], [580, 330], [520, 380], [480, 300]]);
    blob([[760, 300], [860, 290], [880, 360], [800, 370]]); c.fillStyle = '#F4EFE4'; c.fillRect(0, 470, 1024, 42); c.fillRect(0, 0, 1024, 26); });
  const g = new THREE.Group(), stand = mat({ color: '#7A3E24', map: T.planks('#7A3E24') }), brass = mat({ color: '#C9A13B', metalness: 0.7, roughness: 0.3 });
  cyl(0.35, 0.45, 0.12, stand, 0, 0.06, 0, g); cyl(0.04, 0.05, 0.5, brass, 0, 0.35, 0, g);
  const ball = new THREE.Mesh(new THREE.SphereGeometry(r, 40, 24), mat({ map: t, roughness: 0.5 })); ball.position.y = 0.6 + r; ball.castShadow = true; g.add(ball);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(r * 1.08, 0.025, 8, 48, Math.PI), brass); ring.position.y = 0.6 + r; ring.rotation.z = Math.PI / 2; ring.rotation.y = Math.PI / 2; g.add(ring);
  // pins at lat/lon of studios (Edinburgh, New York, San Diego, Toronto, Leeds, Lincoln, Bengaluru, ...)
  const pins = [[56, -3], [41, -74], [33, -117], [44, -79], [54, -1.5], [53, -0.5], [13, 77.6], [40, -86], [49, 8]].map(([la, lo]) => {
    const p = new THREE.Group(); const head = new THREE.Mesh(new THREE.SphereGeometry(0.07, 10, 8), mat({ color: '#D8343F', emissive: '#D8343F', emissiveIntensity: 0.3 })); head.position.y = 0.18; p.add(head);
    p.add(cyl(0.012, 0.012, 0.18, mat({ color: '#DDDDDD' }), 0, 0.09, 0, null, 6)); p.children[1] && (p.children[1].position.y = 0.09);
    const phi = (90 - la) * Math.PI / 180, th = (lo + 180) * Math.PI / 180;
    p.position.set(-r * Math.sin(phi) * Math.cos(th), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(th)); p.lookAt(p.position.clone().multiplyScalar(2)); p.rotateX(Math.PI / 2); ball.add(p); return p; });
  g.ball = ball; g.pins = pins; return g;
}
export function plane(col = '#F4EFE4', stripe = '#D8343F') {
  const g = new THREE.Group(), m = mat({ color: col, roughness: 0.4 }), s = mat({ color: stripe });
  const body = cyl(0.55, 0.45, 7, m, 0, 0, 0, g, 20); body.rotation.z = Math.PI / 2;
  const nose = new THREE.Mesh(new THREE.SphereGeometry(0.55, 16, 12), m); nose.scale.set(1.4, 1, 1); nose.position.x = 3.5; g.add(nose);
  const tail = new THREE.Mesh(new THREE.ConeGeometry(0.45, 1.6, 16), m); tail.rotation.z = Math.PI / 2; tail.position.x = -4.2; g.add(tail);
  box(1.6, 0.1, 8, m, 0.3, -0.15, 0, g); box(0.9, 0.08, 2.6, m, -4.3, 0.1, 0, g); const fin = box(1.1, 1.4, 0.08, s, -4.3, 0.8, 0, g); fin.rotation.z = 0.3;
  box(6.6, 0.14, 1.12, s, 0, -0.05, 0, g);
  for (let x = -2.6; x <= 2.6; x += 0.6) [-1, 1].forEach((z) => { const w = new THREE.Mesh(new THREE.CircleGeometry(0.1, 10), mat({ color: '#2B4A70' })); w.position.set(x, 0.22, z * 0.53); w.rotation.y = z > 0 ? 0 : Math.PI; g.add(w); });
  [-2.2, 2.2].forEach((z) => { const e = cyl(0.28, 0.28, 1.0, mat({ color: '#9A9AA6', metalness: 0.5 }), 0.6, -0.4, z, g, 14); e.rotation.z = Math.PI / 2; });
  return g;
}
const screenTex = (seed) => canvasTex('scr' + seed, 256, 160, (c) => { const gr = c.createLinearGradient(0, 0, 0, 160); gr.addColorStop(0, ['#FF7AB6', '#5AD1E8', '#F2A33C', '#8C6FC9'][seed % 4]); gr.addColorStop(1, ['#3B2F8F', '#1F5A8A', '#B5372E', '#2E4E8A'][seed % 4]); c.fillStyle = gr; c.fillRect(0, 0, 256, 160);
  if (seed % 2) { c.fillStyle = '#1F1C33'; for (let i = 0; i < 6; i++) { const h = 30 + rnd(seed + i) * 70; c.fillRect(20 + i * 38, 150 - h, 28, h); } c.fillStyle = '#FFE08A'; c.beginPath(); c.arc(200, 40, 18, 0, 7); c.fill(); }
  else { c.strokeStyle = 'rgba(255,255,255,0.8)'; c.lineWidth = 4; for (let i = 0; i < 7; i++) { c.beginPath(); c.moveTo(20, 24 + i * 18); c.lineTo(40 + rnd(seed * 3 + i) * 190, 24 + i * 18); c.stroke(); } } });
export function workDesk(seed = 0) {
  const g = desk(1.8); const dark = mat({ color: '#25242B', roughness: 0.5 });
  [-0.42, 0.42].forEach((x, i) => { box(0.08, 0.3, 0.08, dark, x, 1.03, -0.3, g); const fr = box(0.82, 0.52, 0.06, dark, x, 1.38, -0.3, g); fr.rotation.y = -x * 0.35;
    const sc = new THREE.Mesh(new THREE.PlaneGeometry(0.74, 0.44), new THREE.MeshStandardMaterial({ map: screenTex(seed * 2 + i), emissive: '#FFFFFF', emissiveMap: screenTex(seed * 2 + i), emissiveIntensity: 0.9 })); sc.position.set(x, 1.38, -0.265); sc.rotation.y = -x * 0.35; g.add(sc); });
  box(0.5, 0.03, 0.18, dark, 0, 0.9, 0.1, g);
  return g;
}
export function policeCar() {
  const g = car('#F4EFE4'); const blk = mat({ color: '#1F1C33' }); box(1.52, 0.2, 1.4, blk, 0, 0.85, 0, g);
  const r = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.14, 0.24), new THREE.MeshStandardMaterial({ color: '#FF3A4A', emissive: '#FF3A4A', emissiveIntensity: 2 })); r.position.set(-0.22, 1.88, -0.3); g.add(r);
  const b = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.14, 0.24), new THREE.MeshStandardMaterial({ color: '#3A7BFF', emissive: '#3A7BFF', emissiveIntensity: 2 })); b.position.set(0.22, 1.88, -0.3); g.add(b);
  g.update = (t) => { const on = Math.sin(t * 14) > 0; r.material.emissiveIntensity = on ? 3 : 0.2; b.material.emissiveIntensity = on ? 0.2 : 3; };
  return g;
}
/** a tabletop city: little blocks, a road grid, tiny palms. Grows from the table with g.set(k 0..1) */
export function cityModel() {
  const g = new THREE.Group(), blocks = [];
  box(3.2, 0.06, 2.2, mat({ color: '#5E6A72' }), 0, 0.03, 0, g);
  const cols = ['#F2B8C6', '#5AD1E8', '#F2D37A', '#F4EFE4', '#8C6FC9', '#FF9E6E'];
  for (let i = -3; i <= 3; i++) for (let j = -2; j <= 2; j++) { if (i === 0 || j === 0) continue; const h = 0.15 + rnd(i * 13 + j * 7) * (Math.abs(i) < 2 ? 0.9 : 0.4);
    const b = box(0.32, h, 0.3, mat({ color: cols[(i * 5 + j * 3 + 30) % cols.length] }), i * 0.42, h / 2 + 0.06, j * 0.4, g); b.userData.h = h; blocks.push(b); }
  for (let k = 0; k < 7; k++) { const p = palm(5, 0.12); p.scale.setScalar(0.07); p.position.set(-1.45 + k * 0.48, 0.06, 1.0); g.add(p); }
  g.set = (k) => blocks.forEach((b, i) => { const a = Math.max(0, Math.min(1, k * 1.6 - (i / blocks.length) * 0.6)); b.scale.y = Math.max(0.001, a); b.position.y = b.userData.h * a / 2 + 0.06; });
  return g;
}
export function bigCrate(text = 'BIG GAME', col = '#8A2E2E') {
  const t = canvasTex('crate' + text, 512, 512, (c) => { const p = T.planks('#B07A48').image; c.drawImage(p, 0, 0, 512, 512); c.strokeStyle = '#5A3E2A'; c.lineWidth = 26; c.strokeRect(13, 13, 486, 486); c.beginPath(); c.moveTo(20, 20); c.lineTo(492, 492); c.stroke();
    c.fillStyle = col; c.fillRect(40, 190, 432, 132); c.fillStyle = '#F2E6CF'; c.textAlign = 'center'; c.textBaseline = 'middle'; let fs = 70; c.font = `900 ${fs}px Inter`; while (c.measureText(text).width > 400) { fs -= 2; c.font = `900 ${fs}px Inter`; } c.fillText(text, 256, 258); });
  const g = new THREE.Group(); box(2, 2, 2, mat({ map: t }), 0, 1, 0, g); return g;
}
