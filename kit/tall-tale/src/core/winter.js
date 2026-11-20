// Winter-night kit for the Tall Tale world (Sodder story). All drawn in code.
//   winterScene(E, { dawn }) -> { scene, sun, snow.update(t), lights[] }   snowy ground, pines, falling snow, night or pale dawn
//   house2(o) .setFire(k, t) .setLit(on) .upWin[]   two-storey wooden house with porch, chimney, Christmas lights
//   rubble() .update(t)   charred remains, smoking · wallPhone() .crank(a) · ladder(ghost) · coalTruck(col) .sputter(t,k)
//   billboard(lines) · fireStation() · pine(h) · bed(col)
import * as THREE from 'three';
import { T, mat, canvasTex, signBoard } from './world.js';
import * as TW from './town.js';

const rnd = (i) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const box = (w, h, d, m, x = 0, y = 0, z = 0, parent) => { const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); b.position.set(x, y, z); b.castShadow = b.receiveShadow = true; if (parent) parent.add(b); return b; };
const cyl = (r1, r2, h, m, x, y, z, parent, seg = 14) => { const c = new THREE.Mesh(new THREE.CylinderGeometry(r1, r2, h, seg), m); c.position.set(x, y, z); c.castShadow = c.receiveShadow = true; if (parent) parent.add(c); return c; };
const glow = (col, k = 2) => new THREE.MeshBasicMaterial({ color: new THREE.Color(col).multiplyScalar(k), toneMapped: false });

export function pine(h = 4, seed = 1) {
  const g = new THREE.Group(), green = mat({ color: '#2F5A3E', flatShading: true }), snow = mat({ color: '#F4F8FF', flatShading: true });
  cyl(0.14, 0.18, h * 0.25, mat({ color: '#5A3A24' }), 0, h * 0.12, 0, g, 6);
  for (let i = 0; i < 3; i++) { const r = (1.0 - i * 0.25) * h * 0.28, y = h * (0.28 + i * 0.22); const c = new THREE.Mesh(new THREE.ConeGeometry(r, h * 0.38, 8), green); c.position.y = y; c.castShadow = true; g.add(c);
    const s = new THREE.Mesh(new THREE.ConeGeometry(r * 0.72, h * 0.14, 8), snow); s.position.y = y + h * 0.13; g.add(s); }
  g.rotation.y = rnd(seed) * 6; return g;
}
export function winterScene(E, { dawn = false } = {}) {
  const scene = new THREE.Scene();
  const m = new THREE.ShaderMaterial({ side: THREE.BackSide, depthWrite: false, fog: false, toneMapped: false,
    uniforms: { top: { value: new THREE.Color(dawn ? '#8A9CC8' : '#0B1433') }, hor: { value: new THREE.Color(dawn ? '#F4C9B8' : '#33446E') } },
    vertexShader: 'varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
    fragmentShader: 'uniform vec3 top, hor; varying vec3 vP; void main(){ float y = max(vP.y, 0.0); gl_FragColor = vec4(mix(hor, top, pow(clamp(y * 2.2, 0.0, 1.0), 0.6)), 1.0); }' });
  const sky = new THREE.Mesh(new THREE.SphereGeometry(400, 32, 16), m); sky.renderOrder = -10; scene.add(sky);
  scene.fog = new THREE.Fog(dawn ? '#D8D2DA' : '#1E2A4A', 30, 220);
  scene.environment = E.envMap; scene.environmentIntensity = dawn ? 0.12 : 0.15;
  scene.add(new THREE.HemisphereLight(dawn ? '#FFE8E0' : '#8AA4E0', dawn ? '#6A6A80' : '#1A2240', dawn ? 1.0 : 1.15));
  const key = new THREE.DirectionalLight(dawn ? '#FFD8C0' : '#B8CCFF', dawn ? 1.5 : 1.1); key.position.set(-12, 22, 14); key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048); Object.assign(key.shadow.camera, { left: -22, right: 22, top: 22, bottom: -22, near: 1, far: 80 }); key.shadow.bias = -0.0008; key.shadow.camera.updateProjectionMatrix(); scene.add(key, key.target);
  // snowy ground with soft bumps
  const gg = new THREE.PlaneGeometry(260, 260, 80, 80); const p = gg.attributes.position;
  for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i), r = Math.hypot(x, y); p.setZ(i, r < 22 ? 0 : Math.sin(x * 0.07) * Math.cos(y * 0.06) * 2.2 * Math.min(1, (r - 22) / 30)); }
  gg.computeVertexNormals(); const ground = new THREE.Mesh(gg, mat({ color: dawn ? '#E6E9F0' : '#C9D2E6', roughness: 0.95 })); ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; scene.add(ground);
  for (let i = 0; i < 46; i++) { const a = rnd(i) * 6.28, r = 26 + rnd(i * 3) * 70; const t = pine(5 + rnd(i * 7) * 5, i); t.position.set(Math.cos(a) * r, 0, Math.sin(a) * r - 10); scene.add(t); }
  // falling snow
  const n = 1400, pos = new Float32Array(n * 3); for (let i = 0; i < n; i++) pos.set([(rnd(i) - 0.5) * 60, rnd(i * 2) * 20, (rnd(i * 3) - 0.5) * 60], i * 3);
  const sg = new THREE.BufferGeometry(); sg.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const flakes = new THREE.Points(sg, new THREE.PointsMaterial({ color: '#FFFFFF', size: 0.09, transparent: true, opacity: 0.9, depthWrite: false })); scene.add(flakes);
  const snow = { update(t, cam, amt = 1) { flakes.visible = amt > 0; flakes.position.set(cam.position.x, 0, cam.position.z); const a = sg.attributes.position.array;
    for (let i = 0; i < n; i++) { a[i * 3 + 1] = (20 - ((t * (0.9 + rnd(i * 5) * 0.6) + rnd(i * 2) * 20) % 20)); a[i * 3] = (rnd(i) - 0.5) * 60 + Math.sin(t * 0.8 + i) * 0.4; } sg.attributes.position.needsUpdate = true; } };
  return { scene, sun: { key }, snow, ground };
}

const sidingTex = (col) => canvasTex('siding' + col, 512, 512, (c) => { c.fillStyle = col; c.fillRect(0, 0, 512, 512); for (let y = 0; y < 512; y += 32) { c.fillStyle = 'rgba(0,0,0,0.12)'; c.fillRect(0, y + 28, 512, 4); c.fillStyle = 'rgba(255,255,255,0.08)'; c.fillRect(0, y, 512, 3); } });
const winTex = (lit) => canvasTex('win' + lit, 128, 160, (c) => { c.fillStyle = '#F4EFE4'; c.fillRect(0, 0, 128, 160); c.fillStyle = lit ? '#FFD27A' : '#22304A'; c.fillRect(14, 14, 100, 132); c.fillStyle = '#F4EFE4'; c.fillRect(60, 14, 8, 132); c.fillRect(14, 76, 100, 8); if (lit) { c.fillStyle = 'rgba(255,240,200,0.6)'; c.fillRect(18, 18, 40, 56); } });
/** a two-storey wooden farmhouse facing +z, ~8 wide, ~7.5 tall. setFire(k, t) 0..1, setLit(on) */
export function house2({ wall = '#C9A27A', roof = '#3A3A44', trim = '#F4EFE4' } = {}) {
  const g = new THREE.Group(), W = 8, D = 6, H1 = 3, H2 = 2.8;
  const wm = mat({ map: sidingTex(wall) }); const body = box(W, H1 + H2, D, wm, 0, (H1 + H2) / 2, 0, g);
  box(W + 0.1, 0.18, D + 0.1, mat({ color: trim }), 0, H1, 0, g);
  // gable roof
  const sh = new THREE.Shape(); sh.moveTo(-W / 2 - 0.5, 0); sh.lineTo(0, 2.6); sh.lineTo(W / 2 + 0.5, 0); sh.closePath();
  const rg = new THREE.ExtrudeGeometry(sh, { depth: D + 1, bevelEnabled: false }); rg.translate(0, H1 + H2, -(D + 1) / 2);
  const rf = new THREE.Mesh(rg, mat({ color: roof, flatShading: true })); rf.castShadow = true; g.add(rf);
  const snowRoof = new THREE.Mesh(rg.clone(), mat({ color: '#F4F8FF', flatShading: true })); snowRoof.scale.set(1.01, 1.02, 0.98); snowRoof.position.y = 0.06; g.add(snowRoof); g.snowRoof = snowRoof;
  const chim = box(0.8, 2.4, 0.8, mat({ map: T.brick('#8A4A3A') }), 2.2, H1 + H2 + 2.2, -0.6, g);
  // windows (front), 3 down + 3 up; door
  const winsDown = [], winsUp = [];
  [-2.8, 2.8].forEach((x) => { const w = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 1.4), mat({ map: winTex(true) })); w.position.set(x, 1.6, D / 2 + 0.02); g.add(w); winsDown.push(w); });
  [-2.8, 0, 2.8].forEach((x) => { const w = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 1.3), mat({ map: winTex(true) })); w.position.set(x, H1 + 1.4, D / 2 + 0.02); g.add(w); winsUp.push(w); });
  box(1.2, 2.2, 0.08, mat({ color: '#6B3E26' }), 0, 1.1, D / 2 + 0.04, g);
  // porch + steps + posts
  box(W, 0.25, 1.8, mat({ map: T.planks('#8A6A4A') }), 0, 0.12, D / 2 + 0.9, g); box(W + 0.2, 0.14, 2.0, mat({ color: roof }), 0, 2.7, D / 2 + 0.95, g);
  [-3.8, -1.2, 1.2, 3.8].forEach((x) => box(0.16, 2.5, 0.16, mat({ color: trim }), x, 1.4, D / 2 + 1.7, g));
  // Christmas lights along the porch roof and eaves
  const bulbs = []; const cols = ['#FF4A4A', '#4AFF7A', '#4A9AFF', '#FFD24A'];
  for (let i = 0; i < 22; i++) { const b = new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 6), glow(cols[i % 4], 1.0)); b.position.set(-W / 2 + 0.2 + i * (W - 0.4) / 21, 2.58 - Math.abs(Math.sin(i * 0.9)) * 0.08, D / 2 + 1.92); g.add(b); bulbs.push(b); }
  const inside = new THREE.PointLight('#FFC27A', 3, 9, 1.6); inside.position.set(0, 1.6, D / 2 + 1.2); g.add(inside);
  // wreath on the door
  const wr = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.09, 8, 20), mat({ color: '#2F6B3A' })); wr.position.set(0, 1.6, D / 2 + 0.12); g.add(wr);
  // fire: flames in windows and on the roof, orange lights, smoke
  const fires = [[-2.8, 1.2, D / 2 + 0.3], [2.8, 1.2, D / 2 + 0.3], [-2.8, H1 + 1.0, D / 2 + 0.3], [0, H1 + 1.0, D / 2 + 0.3], [2.8, H1 + 1.0, D / 2 + 0.3], [-1.5, H1 + H2 + 1.4, 0], [1.8, H1 + H2 + 1.0, 1.2]].map(([x, y, z], i) => { const f = TW.flames(6, i > 4 ? 1.6 : 0.9, 2.5); f.position.set(x, y, z); g.add(f); return f; });
  const fl1 = new THREE.PointLight('#FF7A2A', 0, 30, 1.2); fl1.position.set(0, 4, D / 2 + 3); g.add(fl1);
  const smoke = TW.smokeVent(12, 2.2, '#2E2E36'); smoke.position.set(0, H1 + H2 + 2.4, 0); g.add(smoke);
  g.setLit = (on) => { [...winsDown, ...winsUp].forEach((w) => (w.material.map = winTex(on))); inside.intensity = on ? 3 : 0; bulbs.forEach((b) => (b.visible = on)); };
  g.setFire = (k, t = 0) => { fires.forEach((f, i) => f.update(t, Math.max(0, Math.min(1, k * 1.6 - i * 0.12)))); fl1.intensity = 12 * k * (0.85 + 0.15 * Math.sin(t * 13)); smoke.update(t, k * 0.7); g.snowRoof.visible = k < 0.35; };
  g.setFire(0); g.winsUp = winsUp; g.D = D; g.H1 = H1; return g;
}
/** charred remains: a low black heap, a standing chimney, smoke */
export function rubble() {
  const g = new THREE.Group(), ch = mat({ color: '#1E1A1A', roughness: 1, flatShading: true }), ash = mat({ color: '#4A4648', roughness: 1, flatShading: true });
  const base = box(8.4, 0.3, 6.4, ash, 0, 0.15, 0, g);
  for (let i = 0; i < 26; i++) { const b = box(0.2 + rnd(i) * 0.3, 0.2 + rnd(i * 2) * 0.25, 2 + rnd(i * 3) * 2.6, ch, (rnd(i * 5) - 0.5) * 7, 0.4 + rnd(i * 7) * 0.4, (rnd(i * 9) - 0.5) * 5, g); b.rotation.set(rnd(i) * 0.6, rnd(i * 4) * 3, rnd(i * 6) * 0.5); }
  box(0.8, 3.4, 0.8, mat({ map: T.brick('#5A3A30') }), 2.2, 1.7, -0.6, g);
  const embers = []; for (let i = 0; i < 14; i++) { const e = new THREE.Mesh(new THREE.SphereGeometry(0.06, 6, 4), glow('#FF6A2A', 1.0)); e.position.set((rnd(i * 11) - 0.5) * 6, 0.35, (rnd(i * 13) - 0.5) * 4); g.add(e); embers.push(e); }
  const sm = [[-2, 0], [1, 1], [2.4, -1.2]].map(([x, z], i) => { const s = TW.smokeVent(8, 0.8, '#55555E'); s.position.set(x, 0.3, z); g.add(s); return s; });
  g.update = (t) => { sm.forEach((s) => s.update(t, 0.28)); embers.forEach((e, i) => (e.material.color.setScalar(0).add(new THREE.Color('#FF6A2A').multiplyScalar(0.8 + Math.sin(t * 5 + i) * 0.2)))); };
  return g;
}
/** an old wooden wall telephone with a crank handle: g.crank(angle) */
export function wallPhone() {
  const g = new THREE.Group(), wood = mat({ map: T.planks('#7A4A2A') }), br = mat({ color: '#C9A13B', metalness: 0.7, roughness: 0.3 }), blk = mat({ color: '#1F1C24' });
  box(0.5, 0.9, 0.22, wood, 0, 0, 0, g); [-0.1, 0.1].forEach((x) => { const b = new THREE.Mesh(new THREE.SphereGeometry(0.07, 10, 8), br); b.position.set(x, 0.38, 0.12); g.add(b); });
  const mouth = cyl(0.03, 0.03, 0.22, blk, 0, 0.12, 0.2, g, 8); mouth.rotation.x = Math.PI / 2; const cone = cyl(0.11, 0.05, 0.12, blk, 0, 0.12, 0.34, g, 12); cone.rotation.x = Math.PI / 2;
  const rec = cyl(0.06, 0.06, 0.24, blk, -0.34, 0.05, 0.08, g, 10); const hook = box(0.06, 0.04, 0.12, br, -0.28, 0.22, 0.06, g);
  const cr = new THREE.Group(); cr.position.set(0.28, -0.05, 0.05); g.add(cr); box(0.04, 0.22, 0.04, br, 0, 0.1, 0, cr); const kn = cyl(0.03, 0.03, 0.08, blk, 0, 0.21, 0.05, cr, 8); kn.rotation.x = Math.PI / 2;
  g.crank = (a) => (cr.rotation.x = a); return g;
}
/** a wooden ladder; ghost = faint dotted outline (the missing ladder) */
export function ladder(h = 5, ghost = false) {
  const g = new THREE.Group(), m = ghost ? new THREE.MeshBasicMaterial({ color: '#FFFFFF', transparent: true, opacity: 0.35, wireframe: false, depthWrite: false }) : mat({ color: '#9A6A43' });
  [-0.3, 0.3].forEach((x) => box(0.08, h, 0.08, m, x, h / 2, 0, g)); for (let y = 0.4; y < h; y += 0.45) box(0.6, 0.06, 0.06, m, 0, y, 0, g);
  if (ghost) g.traverse((o) => { if (o.isMesh) o.castShadow = false; });
  return g;
}
/** a 1940s coal truck facing +x. sputter(t, k): exhaust puffs */
export function coalTruck(col = '#7A2E2E') {
  const g = new THREE.Group(), c = mat({ color: col }), dk = mat({ color: '#1F1C24' }), ch = mat({ color: '#2A2A30' });
  box(5.0, 0.3, 1.8, ch, 0, 0.75, 0, g); box(1.6, 1.3, 1.8, c, 1.6, 1.55, 0, g); const hood = box(1.2, 0.8, 1.5, c, 2.9, 1.3, 0, g);
  box(1.0, 0.6, 1.82, mat({ color: '#9CC7E4' }), 1.6, 1.85, 0, g); box(3.0, 1.0, 1.9, mat({ color: '#5A4A3A' }), -0.9, 1.4, 0, g);
  const coal = box(2.8, 0.25, 1.7, mat({ color: '#18161A', flatShading: true }), -0.9, 2.0, 0, g);
  [[2.6, 0.95], [2.6, -0.95], [-1.4, 0.95], [-1.4, -0.95]].forEach(([x, z]) => { const w = cyl(0.42, 0.42, 0.3, dk, x, 0.42, z, g, 16); w.rotation.x = Math.PI / 2; });
  const snowTop = box(1.6, 0.08, 1.8, mat({ color: '#F4F8FF' }), 1.6, 2.24, 0, g);
  [-1, 1].forEach((s) => { const h = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 6), glow('#FFE7A0', 0.9)); h.position.set(3.52, 1.3, s * 0.55); g.add(h); });
  const ex = TW.smokeVent(6, 0.5, '#6A6A72'); ex.position.set(-2.6, 0.6, -0.7); g.add(ex);
  g.sputter = (t, k) => ex.update(t, k); g.sputter(0, 0); return g;
}
/** a roadside billboard: canvas lines + five faceless child silhouettes (no real likenesses) */
export function billboard(lines = ['WHAT HAPPENED', 'TO OUR CHILDREN?']) {
  const g = new THREE.Group(), wood = mat({ color: '#6B4A2A' });
  [-3.4, 3.4].forEach((x) => box(0.25, 6, 0.25, wood, x, 3, -0.2, g));
  const t = canvasTex('billboard' + lines.join('|'), 1024, 512, (c) => { c.fillStyle = '#F4EFE4'; c.fillRect(0, 0, 1024, 512); c.strokeStyle = '#1F1C33'; c.lineWidth = 18; c.strokeRect(9, 9, 1006, 494);
    c.fillStyle = '#1F1C33'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.font = '900 64px Inter'; lines.forEach((l, i) => c.fillText(l, 512, 70 + i * 74));
    for (let i = 0; i < 5; i++) { const x = 130 + i * 191, y = 330; c.fillStyle = '#E3D9C4'; c.fillRect(x - 70, y - 90, 140, 190); c.strokeStyle = '#1F1C33'; c.lineWidth = 6; c.strokeRect(x - 70, y - 90, 140, 190);
      c.fillStyle = '#5A6A8A'; c.beginPath(); c.arc(x, y - 20, 34 - (i === 4 ? 6 : 0), 0, 7); c.fill(); c.beginPath(); c.ellipse(x, y + 70, 50, 40, 0, Math.PI, 0); c.fill(); }
    c.fillStyle = '#B5372E'; c.font = '900 40px Inter'; c.fillText('REWARD · CALL ANY TIME', 512, 478); });
  const face = new THREE.Mesh(new THREE.PlaneGeometry(7.4, 3.7), mat({ map: t })); face.position.set(0, 4.2, 0); face.castShadow = true; g.add(face);
  box(7.6, 3.9, 0.15, wood, 0, 4.2, -0.1, g); g.face = face; return g;
}
export function fireStation() {
  const g = new THREE.Group(); box(7, 4, 6, mat({ map: T.brick('#A8483A') }), 0, 2, 0, g); box(7.4, 0.3, 6.4, mat({ color: '#3A3A44' }), 0, 4.15, 0, g);
  const door = box(3.2, 3, 0.1, mat({ color: '#2A2E3A' }), -1.2, 1.5, 3.02, g);
  const s = signBoard('FIRE DEPT.', { w: 3.6, h: 0.6, bg: '#F4EFE4', fg: '#B5372E' }); s.position.set(0, 3.5, 3.06); g.add(s);
  const snowT = box(7.4, 0.12, 6.4, mat({ color: '#F4F8FF' }), 0, 4.36, 0, g);
  const lamp = new THREE.PointLight('#FFD8A0', 0, 6, 1.8); lamp.position.set(2.2, 3.0, 3.6); g.add(lamp); g.lamp = lamp;
  return g;
}
export function bed(col = '#5C8FD6') {
  const g = new THREE.Group(), wood = mat({ map: T.planks('#7A4A2A') });
  box(1.1, 0.45, 2.1, wood, 0, 0.22, 0, g); box(1.0, 0.25, 1.6, mat({ color: col }), 0, 0.55, 0.22, g); box(0.8, 0.18, 0.4, mat({ color: '#FFFDF4' }), 0, 0.55, -0.78, g); box(1.1, 0.9, 0.1, wood, 0, 0.45, -1.05, g);
  return g;
}
