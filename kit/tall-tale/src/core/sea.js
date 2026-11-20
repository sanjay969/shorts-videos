// Sea kit for the Tall Tale world (night ocean, ships, ice, rockets). All built in code, cartoon-simple.
//   ocean(E, { dawn }) -> { scene, sun, water, update(t, cam) }   moonless starry night, or a pink dawn
//   liner(o) .portholes · steamer(o) · iceberg(s, seed) · rocket() .set(age) · lifeboat() · lifeRing()
//   deck(o) a ship's deck (planks, rail, funnel, mast) at y = 0, facing -z · wireless() .set(on) · bunk() · speakingTube() · bench()
import * as THREE from 'three';
import { T, mat, canvasTex, signBoard } from './world.js';

const rnd = (i) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const box = (w, h, d, m, x = 0, y = 0, z = 0, parent) => { const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); b.position.set(x, y, z); b.castShadow = b.receiveShadow = true; if (parent) parent.add(b); return b; };
const cyl = (r1, r2, h, m, x, y, z, parent, seg = 16) => { const c = new THREE.Mesh(new THREE.CylinderGeometry(r1, r2, h, seg), m); c.position.set(x, y, z); c.castShadow = c.receiveShadow = true; if (parent) parent.add(c); return c; };
const glowM = (col, k = 2.5) => new THREE.MeshBasicMaterial({ color: new THREE.Color(col).multiplyScalar(k), toneMapped: false, fog: false });

function skyDome(scene, top, hor, r = 450) {
  const m = new THREE.ShaderMaterial({ side: THREE.BackSide, depthWrite: false, fog: false, toneMapped: false,
    uniforms: { top: { value: new THREE.Color(top) }, hor: { value: new THREE.Color(hor) } },
    vertexShader: 'varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
    fragmentShader: 'uniform vec3 top, hor; varying vec3 vP; void main(){ float y = max(vP.y, 0.0); gl_FragColor = vec4(mix(hor, top, pow(clamp(y * 2.2, 0.0, 1.0), 0.6)), 1.0); }' });
  const s = new THREE.Mesh(new THREE.SphereGeometry(r, 32, 16), m); s.renderOrder = -10; scene.add(s); return s;
}

export function ocean(E, { dawn = false, day = false, storm = false } = {}) {
  const scene = new THREE.Scene();
  if (day || storm) {
    skyDome(scene, storm ? '#4A525E' : '#3D8EE0', storm ? '#8E98A6' : '#CBEAF8');
    scene.fog = new THREE.Fog(storm ? '#8E98A6' : '#C4E2F2', storm ? 30 : 90, storm ? 160 : 380);
    scene.environment = E.envMap; scene.environmentIntensity = 0.4;
    scene.add(new THREE.HemisphereLight(storm ? '#C8D0DC' : '#FFFFFF', storm ? '#3A4450' : '#5A8AB0', storm ? 1.3 : 1.6));
    const key = new THREE.DirectionalLight(storm ? '#D8E0EA' : '#FFF0D6', storm ? 1.2 : 2.6); key.position.set(20, 30, 25); key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048); Object.assign(key.shadow.camera, { left: -30, right: 30, top: 30, bottom: -30, near: 1, far: 120 }); key.shadow.bias = -0.0008; key.shadow.camera.updateProjectionMatrix(); scene.add(key, key.target);
    if (!storm) { const tex = canvasTex('cloudpuff', 256, 128, (c) => { c.fillStyle = '#FFFFFF'; [[60, 80, 40], [110, 60, 52], [170, 78, 40], [130, 90, 36]].forEach(([x, y, r]) => { c.beginPath(); c.arc(x, y, r, 0, 7); c.fill(); }); });
      for (let i = 0; i < 9; i++) { const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, fog: false, depthWrite: false })); const a = i * 0.7 - 2.6; sp.position.set(Math.sin(a) * 300, 40 + (i % 3) * 18, -Math.cos(a) * 300); sp.scale.set(70, 35, 1); scene.add(sp); } }
    const seg = 90, size = 320, geo = new THREE.PlaneGeometry(size, size, seg, seg); geo.rotateX(-Math.PI / 2);
    const water = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: storm ? '#36566E' : '#2A7FB8', roughness: 0.3, metalness: 0.1, flatShading: true })); water.receiveShadow = true; scene.add(water);
    const base = geo.attributes.position.array.slice(); const amp = storm ? 2.2 : 1;
    const update = (t, cam) => { const cx = Math.round(cam.position.x / (size / seg)) * (size / seg), cz = Math.round(cam.position.z / (size / seg)) * (size / seg); water.position.set(cx, 0, cz); const p = geo.attributes.position.array;
      for (let i = 0; i < p.length; i += 3) { const x = base[i] + cx, z = base[i + 2] + cz; p[i + 1] = (Math.sin(x * 0.18 + t * 1.1) * 0.22 + Math.cos(z * 0.23 - t * 0.9) * 0.18 + Math.sin((x + z) * 0.5 + t * 2) * 0.05) * amp; }
      geo.attributes.position.needsUpdate = true; geo.computeVertexNormals(); };
    return { scene, sun: { key }, water, update };
  }
  const sky = skyDome(scene, dawn ? '#6A6FB8' : '#070B22', dawn ? '#FFB394' : '#22336A');
  scene.fog = new THREE.Fog(dawn ? '#E8A8A0' : '#1A2650', 60, 330);
  if (!dawn) {
    const n = 900, pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) { const a = rnd(i) * 6.283, e = 0.05 + rnd(i * 3.1) * 1.4, r = 420; pos.set([Math.cos(a) * Math.cos(e) * r, Math.sin(e) * r, Math.sin(a) * Math.cos(e) * r], i * 3); }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const st = new THREE.Points(g, new THREE.PointsMaterial({ color: new THREE.Color(1.6, 1.6, 1.8), size: 1.6, sizeAttenuation: false, fog: false, toneMapped: false })); scene.add(st);
  } else {
    const sunDisc = new THREE.Mesh(new THREE.CircleGeometry(14, 40), new THREE.MeshBasicMaterial({ color: new THREE.Color('#FFE2A8').multiplyScalar(1.5), fog: false, toneMapped: false }));
    sunDisc.position.set(-60, 6, -380); scene.add(sunDisc);
  }
  scene.environment = E.envMap; scene.environmentIntensity = dawn ? 0.35 : 0.18;
  const hemi = new THREE.HemisphereLight(dawn ? '#FFD3C0' : '#6F8CD0', dawn ? '#5A4A6A' : '#0A1020', dawn ? 1.5 : 1.35); scene.add(hemi);
  const key = new THREE.DirectionalLight(dawn ? '#FFC9A0' : '#B9CCFF', dawn ? 2.2 : 1.4); key.position.set(20, 30, 25); key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048); Object.assign(key.shadow.camera, { left: -30, right: 30, top: 30, bottom: -30, near: 1, far: 120 }); key.shadow.bias = -0.0008; key.shadow.camera.updateProjectionMatrix();
  scene.add(key, key.target);
  // water: a faceted plane that follows the camera, waves in world coords
  const seg = 90, size = 320, geo = new THREE.PlaneGeometry(size, size, seg, seg); geo.rotateX(-Math.PI / 2);
  const water = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: dawn ? '#3E6FA0' : '#163A6E', roughness: 0.32, metalness: 0.15, flatShading: true }));
  water.receiveShadow = true; scene.add(water);
  const base = geo.attributes.position.array.slice();
  const update = (t, cam) => {
    const cx = Math.round(cam.position.x / (size / seg)) * (size / seg), cz = Math.round(cam.position.z / (size / seg)) * (size / seg);
    water.position.set(cx, 0, cz); const p = geo.attributes.position.array;
    for (let i = 0; i < p.length; i += 3) { const x = base[i] + cx, z = base[i + 2] + cz; p[i + 1] = Math.sin(x * 0.18 + t * 1.1) * 0.22 + Math.cos(z * 0.23 - t * 0.9) * 0.18 + Math.sin((x + z) * 0.5 + t * 2) * 0.05; }
    geo.attributes.position.needsUpdate = true; geo.computeVertexNormals();
  };
  return { scene, sun: { key }, water, update };
}

const portTex = (n, rows, seed) => canvasTex('ports' + n + rows + seed, 1024, 128, (c) => { c.fillStyle = '#000'; c.fillRect(0, 0, 1024, 128);
  for (let r = 0; r < rows; r++) for (let i = 0; i < n; i++) if (rnd(i * 7 + r * 31 + seed) > 0.18) { c.fillStyle = '#FFD98A'; c.beginPath(); c.arc(12 + i * (1000 / n), 26 + r * (80 / Math.max(1, rows - 1)), 5, 0, 7); c.fill(); } });

/** an ocean liner along +x (bow at +x). funnels = 4 (Titanic look) or 1. ~28 long. Waterline at y 0 */
export function liner({ funnels = 4, len = 28, funnelCol = '#E3A848', hull = '#1E1E26', lights = true } = {}) {
  const g = new THREE.Group(), hm = mat({ color: hull, roughness: 0.6 }), white = mat({ color: '#F4EFE4' }), red = mat({ color: '#9E2E2E' });
  const W = len * 0.11;
  // hull with a pointed bow
  const sh = new THREE.Shape(); sh.moveTo(-len / 2, -W / 2); sh.lineTo(len / 2 - 3, -W / 2); sh.quadraticCurveTo(len / 2, -W * 0.2, len / 2 + 0.6, 0); sh.quadraticCurveTo(len / 2, W * 0.2, len / 2 - 3, W / 2); sh.lineTo(-len / 2, W / 2); sh.quadraticCurveTo(-len / 2 - 0.9, 0, -len / 2, -W / 2);
  const hullGeo = new THREE.ExtrudeGeometry(sh, { depth: 3.0, bevelEnabled: false }); hullGeo.rotateX(-Math.PI / 2); hullGeo.translate(0, -1.0, 0);
  const H = new THREE.Mesh(hullGeo, hm); H.castShadow = true; g.add(H);
  const band = new THREE.Mesh(new THREE.ExtrudeGeometry(sh, { depth: 0.6, bevelEnabled: false }).rotateX(-Math.PI / 2).translate(0, -0.25, 0), red); band.scale.set(1.002, 1, 1.01); g.add(band);
  const top = box(len * 0.98, 0.22, W * 1.02, mat({ color: '#B98A5A' }), -0.2, 2.1, 0, g);
  // superstructure decks
  [[len * 0.62, 0.9, -1.2], [len * 0.5, 0.8, -1.6]].forEach(([l, h, x], i) => box(l, h, W * 0.8, white, x, 2.2 + h / 2 + i * 0.9, 0, g));
  if (lights) { const pm = new THREE.MeshBasicMaterial({ map: portTex(60, 3, 1), transparent: true, blending: THREE.AdditiveBlending, toneMapped: false, color: new THREE.Color(2, 2, 2) });
    [1, -1].forEach((s) => { const p = new THREE.Mesh(new THREE.PlaneGeometry(len * 0.85, 1.6), pm); p.position.set(-0.5, 1.0, s * (W / 2 + 0.02)); if (s < 0) p.rotation.y = Math.PI; g.add(p);
      const q = new THREE.Mesh(new THREE.PlaneGeometry(len * 0.6, 1.3), new THREE.MeshBasicMaterial({ map: portTex(40, 2, 5), transparent: true, blending: THREE.AdditiveBlending, toneMapped: false, color: new THREE.Color(2, 2, 2) })); q.position.set(-1.2, 3.1, s * (W * 0.4 + 0.02)); if (s < 0) q.rotation.y = Math.PI; g.add(q); }); }
  const fm = mat({ color: funnelCol }), blk = mat({ color: '#1A1A1E' });
  for (let i = 0; i < funnels; i++) { const x = funnels === 1 ? -1 : len * 0.26 - i * len * 0.16; const f = new THREE.Group(); f.position.set(x, 3.6, 0); f.rotation.z = 0.1; g.add(f);
    const c = cyl(0.75, 0.8, 3.4, fm, 0, 1.7, 0, f, 20); c.scale.z = 0.8; const t = cyl(0.78, 0.78, 0.7, blk, 0, 3.2, 0, f, 20); t.scale.z = 0.8; }
  [len * 0.43, -len * 0.42].forEach((x) => { const m = cyl(0.06, 0.08, 9, mat({ color: '#6B4A2A' }), x, 6.2, 0, g, 6); m.rotation.z = 0.08; });
  const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.18, 8, 6), glowM('#FFE7A0', 3)); lamp.position.set(len * 0.43, 10.4, 0); g.add(lamp);
  return g;
}
export const steamer = (o = {}) => liner({ funnels: 1, len: 16, funnelCol: '#D8846A', ...o });

export function iceberg(s = 1, seed = 1) {
  const geo = new THREE.IcosahedronGeometry(1, 1), p = geo.attributes.position;
  for (let i = 0; i < p.count; i++) { const k = 0.75 + rnd(i * 13 + seed * 7) * 0.5; p.setXYZ(i, p.getX(i) * k, Math.max(-0.3, p.getY(i)) * k * (1.2 + rnd(seed) * 0.6), p.getZ(i) * k); }
  geo.computeVertexNormals();
  const m = new THREE.Mesh(geo, mat({ color: '#EAF6FF', emissive: '#3A6A9A', emissiveIntensity: 0.25, roughness: 0.4, flatShading: true }));
  m.scale.setScalar(s); m.castShadow = m.receiveShadow = true; return m;
}

/** a distress rocket: a streak up, then a burst of white stars. g.set(age seconds; <0 = not yet) */
export function rocket(height = 30) {
  const g = new THREE.Group(), trail = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.02, 1, 6), glowM('#FFF4D8', 4)); g.add(trail);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.25, 8, 6), glowM('#FFFFFF', 6)); g.add(head);
  const stars = []; for (let i = 0; i < 26; i++) { const s = new THREE.Mesh(new THREE.SphereGeometry(0.22, 6, 4), glowM('#FFFFFF', 5)); g.add(s); const a = rnd(i) * 6.283, e = (rnd(i * 3) - 0.3) * 2.2; stars.push([s, new THREE.Vector3(Math.cos(a) * Math.cos(e), Math.sin(e), Math.sin(a) * Math.cos(e))]); }
  const flash = new THREE.PointLight('#FFF4E0', 0, 140, 1.2); g.add(flash);
  g.set = (age) => {
    const up = 1.1, vis = age >= 0 && age < up + 2.6; g.visible = vis; if (!vis) return;
    if (age < up) { const k = age / up, y = height * (1 - (1 - k) * (1 - k)); trail.visible = head.visible = true; trail.scale.y = Math.min(y, 8); trail.position.y = y - trail.scale.y / 2; head.position.y = y; stars.forEach(([s]) => (s.visible = false)); flash.intensity = 0; }
    else { const b = age - up; trail.visible = head.visible = false; stars.forEach(([s, d]) => { s.visible = true; const r = 1 - Math.exp(-b * 2.6); s.position.set(d.x * r * 9, height + d.y * r * 9 - b * b * 1.2, d.z * r * 9); s.scale.setScalar(Math.max(0.01, 1 - b / 2.6)); });
      flash.position.y = height; flash.intensity = 900 * Math.exp(-b * 1.8); }
  };
  g.set(-1); return g;
}
export function lifeboat(col = '#F4EFE4') {
  const g = new THREE.Group(), wood = mat({ map: T.planks('#9A6337', [1, 0.3]) });
  const sh = new THREE.Shape(); sh.moveTo(-1.4, 0); sh.quadraticCurveTo(-1.6, 0.5, -1.1, 0.5); sh.lineTo(1.1, 0.5); sh.quadraticCurveTo(1.6, 0.5, 1.4, 0); sh.lineTo(-1.4, 0);
  const hull = new THREE.Mesh(new THREE.ExtrudeGeometry(sh, { depth: 1.0, bevelEnabled: false }), mat({ color: col })); hull.position.set(0, -0.15, -0.5); hull.castShadow = true; g.add(hull);
  box(2.6, 0.08, 1.04, wood, 0, 0.36, 0, g); [-0.6, 0.4].forEach((x) => box(0.16, 0.06, 0.9, wood, x, 0.2, 0, g));
  return g;
}
export function lifeRing() {
  const t = canvasTex('ring', 512, 64, (c) => { for (let i = 0; i < 8; i++) { c.fillStyle = i % 2 ? '#F4EFE4' : '#D8343F'; c.fillRect(i * 64, 0, 64, 64); } });
  const m = new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.17, 12, 32), mat({ map: t, roughness: 0.6 })); m.rotation.x = -Math.PI / 2; m.castShadow = true; const g = new THREE.Group(); g.add(m); return g;
}
/** a ship's deck at y 0 (planks, white rail along the far edge at z = -2.2, a funnel and a mast behind) */
export function deck({ funnelCol = '#D8846A', w = 14 } = {}) {
  const g = new THREE.Group(); const fl = box(w, 0.3, 8, mat({ map: T.planks('#9A6A43', [w / 2.5, 3]) }), 0, -0.15, 1.4, g); fl.material.map.rotation = Math.PI / 2;
  const rail = mat({ color: '#F4EFE4' });
  for (let x = -w / 2; x <= w / 2; x += 1.1) box(0.08, 1.05, 0.08, rail, x, 0.52, -2.4, g);
  [0.5, 1.05].forEach((y) => box(w, 0.08, 0.1, rail, 0, y, -2.4, g));
  box(w, 0.9, 0.2, mat({ color: '#1E1E26' }), 0, -0.6, -2.5, g);
  const house = box(3.6, 2.6, 2.4, mat({ color: '#F4EFE4' }), 3.8, 1.3, 3.6, g);
  const win = canvasTex('housewin2', 256, 64, (c) => { c.fillStyle = '#F4EFE4'; c.fillRect(0, 0, 256, 64); for (let i = 0; i < 4; i++) { c.fillStyle = '#FFD98A'; c.fillRect(16 + i * 62, 16, 40, 32); } });
  const wp = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 0.9), new THREE.MeshBasicMaterial({ map: win, toneMapped: false, color: new THREE.Color(1.3, 1.3, 1.3) })); wp.position.set(3.8, 1.7, 2.39); wp.rotation.y = Math.PI; g.add(wp);
  const f = cyl(0.9, 1.0, 4.5, mat({ color: funnelCol }), 3.8, 4.8, 3.8, g, 20); cyl(0.95, 0.95, 0.8, mat({ color: '#1A1A1E' }), 3.8, 6.8, 3.8, g, 20);
  cyl(0.07, 0.09, 10, mat({ color: '#6B4A2A' }), -4.5, 5, 3.0, g, 6);
  const lamp = new THREE.PointLight('#FFD9A0', 14, 12, 1.5); lamp.position.set(0, 3.2, 1.5); g.add(lamp); g.lamp = lamp;
  return g;
}
/** the wireless set on a desk: g.set(on) lights its valves */
export function wireless() {
  const g = new THREE.Group(), wood = mat({ map: T.planks('#6B3E26') });
  box(1.8, 0.08, 0.8, wood, 0, 0.84, 0, g); [-0.8, 0.8].forEach((x) => box(0.1, 0.84, 0.7, wood, x, 0.42, 0, g));
  const face = canvasTex('wface', 512, 256, (c) => { c.fillStyle = '#2A2A30'; c.fillRect(0, 0, 512, 256); [[90, 110], [230, 110], [370, 110]].forEach(([x, y]) => { c.fillStyle = '#E9DCC0'; c.beginPath(); c.arc(x, y, 46, 0, 7); c.fill(); c.strokeStyle = '#1F1C33'; c.lineWidth = 6; c.beginPath(); c.moveTo(x, y); c.lineTo(x + 30, y - 22); c.stroke(); });
    c.fillStyle = '#C9A13B'; c.font = '900 34px Inter'; c.textAlign = 'center'; c.fillText('MARCONI', 256, 220); });
  box(1.4, 0.7, 0.45, [mat({ color: '#2A2A30' }), mat({ color: '#2A2A30' }), mat({ color: '#2A2A30' }), mat({ color: '#2A2A30' }), mat({ map: face }), mat({ color: '#2A2A30' })], 0, 1.23, -0.15, g);
  const valves = [-0.45, -0.15, 0.15, 0.45].map((x) => { const v = new THREE.Mesh(new THREE.SphereGeometry(0.07, 10, 8), new THREE.MeshBasicMaterial({ color: '#FFB25A', toneMapped: false })); v.position.set(x, 1.66, -0.15); g.add(v); return v; });
  const sw = new THREE.Group(); sw.position.set(0.55, 0.95, 0.15); g.add(sw); box(0.06, 0.22, 0.06, mat({ color: '#C9A13B', metalness: 0.6 }), 0, 0.1, 0, sw);
  const lightUp = new THREE.PointLight('#FFB25A', 4, 3, 1.6); lightUp.position.set(0, 1.8, 0.3); g.add(lightUp);
  g.set = (on) => { valves.forEach((v) => v.material.color.set(on ? new THREE.Color(3, 1.8, 0.8) : new THREE.Color('#3A2A20'))); sw.rotation.x = on ? -0.6 : 0.6; lightUp.intensity = on ? 4 : 0; };
  g.set(true); return g;
}
/** a bunk: a person placed at y -0.55 behind it shows only the head on the pillow */
export function bunk(col = '#5C8FD6') {
  const g = new THREE.Group(), wood = mat({ map: T.planks('#7A4A2A') });
  box(2.2, 0.5, 1.0, wood, 0, 0.25, 0, g); box(2.0, 0.5, 0.9, mat({ color: col }), 0.15, 0.62, 0.05, g); box(0.5, 0.25, 0.8, mat({ color: '#FFFDF4' }), -0.8, 0.62, 0, g); box(0.1, 1.3, 1.0, wood, -1.1, 0.65, 0, g);
  return g;
}
export function speakingTube() {
  const g = new THREE.Group(), brass = mat({ color: '#C9A13B', metalness: 0.7, roughness: 0.3 });
  cyl(0.06, 0.06, 2.6, brass, 0, 2.4, 0, g, 10); const m = cyl(0.18, 0.06, 0.3, brass, 0, 1.0, 0.0, g, 14);
  const bend = cyl(0.06, 0.06, 0.4, brass, 0, 1.2, 0.0, g, 10); m.rotation.x = Math.PI / 2; m.position.set(0, 1.12, 0.2);
  return g;
}
/** a raised judge's bench (desk front faces +z), top at y 1.5 */
export function bench(w = 4) {
  const g = new THREE.Group(), wood = mat({ map: T.planks('#6B3E26', [2, 1]) });
  box(w, 1.5, 1.0, wood, 0, 0.75, 0, g); box(w + 0.2, 0.1, 1.2, mat({ color: '#4A2A1A' }), 0, 1.52, 0, g); box(w * 0.7, 0.35, 0.6, wood, 0, 0.18, 1.2, g);
  const seal = canvasTex('seal', 256, 256, (c) => { c.fillStyle = '#C9A13B'; c.beginPath(); c.arc(128, 128, 120, 0, 7); c.fill(); c.fillStyle = '#6B3E26'; c.beginPath(); c.arc(128, 128, 96, 0, 7); c.fill(); c.fillStyle = '#E2B33C'; c.font = '900 40px Inter'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('INQUIRY', 128, 110); c.fillText('1912', 128, 156); });
  const s = new THREE.Mesh(new THREE.CircleGeometry(0.45, 32), mat({ map: seal })); s.position.set(0, 0.8, 0.51); g.add(s);
  return g;
}

/** a Navy collier (Cyclops look): grey hull, bridge forward, tall funnel aft, a forest of coaling derricks. Bow at +x.
 *  ~34 long. g.plimsoll = the safety-line mark on the hull side (world y of its line ≈ g.position.y + 0.6) */
export function collier({ name = 'CYCLOPS', hull = '#5E6670', len = 34 } = {}) {
  const g = new THREE.Group(), W = 4.2, hm = mat({ color: hull, roughness: 0.55 }), dark = mat({ color: '#2A2E36' }), white = mat({ color: '#EDEAE2' }), red = mat({ color: '#8A2E2E' });
  const sh = new THREE.Shape(); sh.moveTo(-len / 2, -W / 2); sh.lineTo(len / 2 - 4, -W / 2); sh.quadraticCurveTo(len / 2, -W * 0.25, len / 2 + 0.8, 0); sh.quadraticCurveTo(len / 2, W * 0.25, len / 2 - 4, W / 2); sh.lineTo(-len / 2, W / 2); sh.quadraticCurveTo(-len / 2 - 1.2, 0, -len / 2, -W / 2);
  const hg = new THREE.ExtrudeGeometry(sh, { depth: 3.6, bevelEnabled: false }); hg.rotateX(-Math.PI / 2); hg.translate(0, -1.6, 0); const H = new THREE.Mesh(hg, hm); H.castShadow = H.receiveShadow = true; g.add(H);
  const bt = new THREE.Mesh(new THREE.ExtrudeGeometry(sh, { depth: 1.0, bevelEnabled: false }).rotateX(-Math.PI / 2).translate(0, -1.62, 0), red); bt.scale.set(1.003, 1, 1.012); g.add(bt);
  box(len * 0.97, 0.18, W * 0.98, mat({ map: T.planks('#9A7A5A', [8, 1]) }), -0.2, 2.05, 0, g);
  // bridge forward, poop house + funnel aft
  box(3.0, 1.6, W * 0.8, white, len * 0.3, 2.9, 0, g); box(2.4, 0.9, W * 0.85, white, len * 0.3, 4.1, 0, g); box(2.8, 0.1, W * 0.95, dark, len * 0.3, 4.6, 0, g);
  const bw = canvasTex('bridgewin', 256, 64, (c) => { c.fillStyle = '#EDEAE2'; c.fillRect(0, 0, 256, 64); for (let i = 0; i < 6; i++) { c.fillStyle = '#2B4A70'; c.fillRect(10 + i * 41, 16, 30, 32); } });
  [1, -1].forEach((s) => { const p = new THREE.Mesh(new THREE.PlaneGeometry(2.3, 0.6), mat({ map: bw })); p.position.set(len * 0.3, 4.15, s * (W * 0.425 + 0.01)); if (s < 0) p.rotation.y = Math.PI; g.add(p); });
  const fw = new THREE.Mesh(new THREE.PlaneGeometry(W * 0.8, 0.6), mat({ map: bw })); fw.position.set(len * 0.3 + 1.21, 4.15, 0); fw.rotation.y = Math.PI / 2; g.add(fw);
  box(5.5, 1.8, W * 0.85, white, -len * 0.4, 3.0, 0, g);
  const f = new THREE.Group(); f.position.set(-len * 0.4, 3.8, 0); f.rotation.z = 0.08; g.add(f); const fc = cyl(0.8, 0.85, 5.2, mat({ color: '#2A2E36' }), 0, 2.6, 0, f, 20); fc.scale.z = 0.8; const fb = cyl(0.84, 0.84, 0.5, mat({ color: '#B9A47A' }), 0, 4.2, 0, f, 20); fb.scale.z = 0.8;
  // coaling derricks: pairs of kingposts with crosstrees and slanted booms
  const post = mat({ color: '#4A4F58' });
  for (let i = 0; i < 6; i++) { const x = len * 0.18 - i * 3.6; [-1, 1].forEach((s) => { cyl(0.11, 0.13, 6.5, post, x, 5.2, s * 1.3, g, 8); });
    box(0.15, 0.15, 3.0, post, x, 8.2, 0, g); const boom = cyl(0.06, 0.08, 5.2, post, x - 1.6, 4.6, 0, g, 6); boom.rotation.z = 1.05;
    const wire = cyl(0.015, 0.015, 4.4, dark, x - 1.2, 6.4, 0, g, 4); wire.rotation.z = -0.5; }
  cyl(0.12, 0.15, 11, post, len * 0.43, 7.0, 0, g, 8); cyl(0.12, 0.15, 10, post, -len * 0.47, 6.5, 0, g, 8);
  // name on both bows + safety line (Plimsoll) mark mid-ship
  const nt = canvasTex('name' + name, 512, 96, (c) => { c.fillStyle = 'rgba(0,0,0,0)'; c.clearRect(0, 0, 512, 96); c.fillStyle = '#F2EDE0'; c.font = '900 72px Inter'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(name, 256, 52); });
  [1, -1].forEach((s) => { const p = new THREE.Mesh(new THREE.PlaneGeometry(4.0, 0.75), new THREE.MeshStandardMaterial({ map: nt, transparent: true })); p.position.set(len * 0.36, 1.2, s * (W / 2 + 0.02)); if (s < 0) p.rotation.y = Math.PI; g.add(p); });
  const pt = canvasTex('plimsoll', 256, 256, (c) => { c.clearRect(0, 0, 256, 256); c.strokeStyle = '#F2EDE0'; c.lineWidth = 14; c.beginPath(); c.arc(128, 128, 80, 0, 7); c.stroke(); c.fillStyle = '#F2EDE0'; c.fillRect(20, 120, 216, 16); });
  const pm = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 1.6), new THREE.MeshStandardMaterial({ map: pt, transparent: true })); pm.position.set(0, 0.0, W / 2 + 0.04); g.add(pm); g.plimsoll = pm;
  // plate seams, rivet lines and a row of portholes on both sides
  const st = canvasTex('hullside' + len, 2048, 256, (c) => { c.clearRect(0, 0, 2048, 256); c.strokeStyle = 'rgba(30,34,40,0.35)'; c.lineWidth = 3;
    for (let x = 0; x < 2048; x += 110) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, 256); c.stroke(); } [70, 150].forEach((y) => { c.beginPath(); c.moveTo(0, y); c.lineTo(2048, y); c.stroke(); });
    c.fillStyle = 'rgba(30,34,40,0.4)'; for (let x = 6; x < 2048; x += 14) [64, 144].forEach((y) => { c.beginPath(); c.arc(x, y, 2, 0, 7); c.fill(); });
    for (let x = 160; x < 1900; x += 90) { c.fillStyle = '#1E2228'; c.beginPath(); c.arc(x, 30, 11, 0, 7); c.fill(); c.strokeStyle = '#B9BEC6'; c.lineWidth = 4; c.stroke(); } });
  [1, -1].forEach((s) => { const p = new THREE.Mesh(new THREE.PlaneGeometry(len * 0.92, 3.4), new THREE.MeshStandardMaterial({ map: st, transparent: true, depthWrite: false })); p.position.set(-0.6, 0.3, s * (W / 2 + 0.02)); if (s < 0) p.rotation.y = Math.PI; g.add(p); });
  // rails along the deck edge
  [1, -1].forEach((s) => { box(len * 0.95, 0.06, 0.06, white, -0.2, 2.75, s * (W / 2 - 0.05), g); for (let x = -len / 2 + 1; x < len / 2 - 2; x += 1.6) box(0.05, 0.7, 0.05, white, x, 2.4, s * (W / 2 - 0.05), g); });
  return g;
}
