// Sky kit (D.B. Cooper story): a Boeing 727-style tri-jet with a working aft airstair, a rainy night over forest,
// a parachute, a cabin interior, a river sand bar. All drawn in code, cartoon-simple.
//   jet727() .stair(k 0..1) .update(t)   nose at +x, ~30 long
//   nightRain(E) -> { scene, update(t, cam) }   storm sky, rain streaks around the camera, endless dark pine forest far below
//   parachute(col) · cabin(E) -> { scene, seats } · riverBar(E) -> { scene, update }
import * as THREE from 'three';
import { T, mat, canvasTex, signBoard } from './world.js';
import * as W from './winter.js';

const rnd = (i) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const box = (w, h, d, m, x = 0, y = 0, z = 0, parent) => { const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); b.position.set(x, y, z); b.castShadow = b.receiveShadow = true; if (parent) parent.add(b); return b; };
const cyl = (r1, r2, h, m, x, y, z, parent, seg = 18) => { const c = new THREE.Mesh(new THREE.CylinderGeometry(r1, r2, h, seg), m); c.position.set(x, y, z); c.castShadow = c.receiveShadow = true; if (parent) parent.add(c); return c; };
const glow = (col, k = 1) => new THREE.MeshBasicMaterial({ color: new THREE.Color(col).multiplyScalar(k), toneMapped: false });

export function jet727() {
  const g = new THREE.Group(), body = mat({ color: '#E8E6E0', roughness: 0.4, metalness: 0.2 }), red = mat({ color: '#B5372E' }), grey = mat({ color: '#9AA0AA', metalness: 0.4, roughness: 0.4 }), dark = mat({ color: '#2A2E36' });
  const L = 26, R = 1.35;
  const fus = cyl(R, R, L, body, 0, 0, 0, g, 28); fus.rotation.z = Math.PI / 2;
  const nose = new THREE.Mesh(new THREE.SphereGeometry(R, 28, 16, 0, Math.PI * 2, 0, Math.PI / 2), body); nose.rotation.z = -Math.PI / 2; nose.scale.set(1, 1.9, 1); nose.position.x = L / 2; g.add(nose);
  const tail = new THREE.Mesh(new THREE.ConeGeometry(R, 5, 28), body); tail.rotation.z = Math.PI / 2; tail.position.x = -L / 2 - 2.5; g.add(tail);
  // livery: window band + red/blue stripe, painted on a plane each side
  const lv = canvasTex('livery', 2048, 256, (c) => { c.clearRect(0, 0, 2048, 256); c.fillStyle = '#B5372E'; c.fillRect(0, 150, 2048, 26); c.fillStyle = '#2E4E8A'; c.fillRect(0, 182, 2048, 12);
    for (let x = 140; x < 1880; x += 34) { c.fillStyle = '#1F2A3A'; c.beginPath(); c.roundRect(x, 92, 18, 30, 8); c.fill(); } c.fillStyle = '#1F2A3A'; c.fillRect(1910, 70, 90, 60); });
  [1, -1].forEach((s) => { const p = new THREE.Mesh(new THREE.PlaneGeometry(L, 2.2), new THREE.MeshStandardMaterial({ map: lv, transparent: true, depthWrite: false })); p.position.set(0, 0.05, s * (R + 0.01)); if (s < 0) p.rotation.y = Math.PI; g.add(p); });
  // swept wings
  [1, -1].forEach((s) => { const sh = new THREE.Shape(); sh.moveTo(0, 0); sh.lineTo(-5.5, 12.5 * s); sh.lineTo(-8, 12.5 * s); sh.lineTo(-6, 0); sh.closePath();
    const w = new THREE.Mesh(new THREE.ExtrudeGeometry(sh, { depth: 0.28, bevelEnabled: false }), grey); w.rotation.x = -Math.PI / 2; w.position.set(3.0, -0.75, 0); w.castShadow = true; g.add(w); });
  // T-tail
  const fs = new THREE.Shape(); fs.moveTo(0, 0); fs.lineTo(-4.5, 6.5); fs.lineTo(-7, 6.5); fs.lineTo(-6, 0); fs.closePath();
  const fin = new THREE.Mesh(new THREE.ExtrudeGeometry(fs, { depth: 0.3, bevelEnabled: false }), red); fin.position.set(-L / 2 + 2, R * 0.6, -0.15); fin.castShadow = true; g.add(fin);
  [1, -1].forEach((s) => { const hs = new THREE.Shape(); hs.moveTo(0, 0); hs.lineTo(-1.8, 4.6 * s); hs.lineTo(-3.0, 4.6 * s); hs.lineTo(-2.6, 0); hs.closePath(); const h = new THREE.Mesh(new THREE.ExtrudeGeometry(hs, { depth: 0.18, bevelEnabled: false }), red); h.rotation.x = -Math.PI / 2; h.position.set(-L / 2 - 2.3, R * 0.6 + 6.5, 0); g.add(h); });
  // three rear engines: two pods + the centre intake on top
  [1, -1].forEach((s) => { const e = cyl(0.75, 0.6, 4.2, grey, -L / 2 + 1.5, 0.6, s * (R + 0.85), g, 18); e.rotation.z = Math.PI / 2; const ring = cyl(0.78, 0.78, 0.3, dark, -L / 2 + 3.5, 0.6, s * (R + 0.85), g, 18); ring.rotation.z = Math.PI / 2;
    const py = box(1.6, 0.25, 0.9, grey, -L / 2 + 1.5, 0.6, s * (R + 0.35), g); });
  const ci = cyl(0.7, 0.7, 2.4, grey, -L / 2 + 0.6, R + 0.55, 0, g, 18); ci.rotation.z = Math.PI / 2;
  // nav lights + beacon
  const navR = new THREE.Mesh(new THREE.SphereGeometry(0.16, 8, 6), glow('#FF3A3A', 1.2)); navR.position.set(-5, -0.6, -12.5); g.add(navR);
  const navG = new THREE.Mesh(new THREE.SphereGeometry(0.16, 8, 6), glow('#3AFF6A', 1.2)); navG.position.set(-5, -0.6, 12.5); g.add(navG);
  const beacon = new THREE.Mesh(new THREE.SphereGeometry(0.18, 8, 6), glow('#FF3A3A', 1.5)); beacon.position.set(2, R + 0.05, 0); g.add(beacon);
  // the aft airstair: a ramp hinged under the tail, swings down and back
  const hinge = new THREE.Group(); hinge.position.set(-L / 2 - 0.4, -R + 0.15, 0); g.add(hinge);
  const ramp = new THREE.Group(); hinge.add(ramp); box(4.2, 0.12, 1.1, mat({ color: '#6A6E78', metalness: 0.4 }), -2.1, 0, 0, ramp);
  for (let i = 0; i < 8; i++) box(0.08, 0.1, 1.0, dark, -0.4 - i * 0.48, 0.08, 0, ramp); [-0.55, 0.55].forEach((z) => box(4.2, 0.4, 0.06, mat({ color: '#9AA0AA' }), -2.1, 0.22, z, ramp));
  const doorLight = new THREE.PointLight('#FFE2B0', 0, 6, 1.6); doorLight.position.set(-1.0, 0.6, 0); hinge.add(doorLight);
  g.stair = (k) => { hinge.rotation.z = 0.62 * k; doorLight.intensity = 8 * k; };
  g.update = (t) => { beacon.visible = Math.sin(t * 6) > 0.6; };
  g.stair(0); g.hinge = hinge; g.L = L; return g;
}

/** stormy night high over an endless pine forest. Rain streaks around the camera; occasional lightning */
export function nightRain(E) {
  const scene = new THREE.Scene();
  const m = new THREE.ShaderMaterial({ side: THREE.BackSide, depthWrite: false, fog: false, toneMapped: false,
    uniforms: { top: { value: new THREE.Color('#0A0F1E') }, hor: { value: new THREE.Color('#2A3446') }, flash: { value: 0 } },
    vertexShader: 'varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
    fragmentShader: 'uniform vec3 top, hor; uniform float flash; varying vec3 vP; void main(){ float y = max(vP.y, 0.0); vec3 c = mix(hor, top, pow(clamp(y * 2.0, 0.0, 1.0), 0.6)); gl_FragColor = vec4(c + flash * vec3(0.35, 0.38, 0.45), 1.0); }' });
  const sky = new THREE.Mesh(new THREE.SphereGeometry(380, 32, 16), m); sky.renderOrder = -10; scene.add(sky);
  scene.fog = new THREE.Fog('#1A2232', 40, 330);
  const hemi = new THREE.HemisphereLight('#8A9AC0', '#0A0E16', 1.2); scene.add(hemi);
  const key = new THREE.DirectionalLight('#B8C8E8', 1.0); key.position.set(-30, 60, 40); scene.add(key, key.target);
  // forest floor: dark ground + many low-poly pines (instanced cones)
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(4000, 4000), mat({ color: '#1E2A22' })); ground.rotation.x = -Math.PI / 2; scene.add(ground);
  const N = 2600, cone = new THREE.ConeGeometry(3, 12, 6); cone.translate(0, 6, 0);
  const trees = new THREE.InstancedMesh(cone, mat({ color: '#22402E', flatShading: true }), N); const d = new THREE.Object3D();
  for (let i = 0; i < N; i++) { d.position.set((rnd(i) - 0.5) * 1600, 0, (rnd(i * 3) - 0.5) * 1600); const s = 0.7 + rnd(i * 7) * 0.8; d.scale.set(s, s * (0.8 + rnd(i * 5) * 0.6), s); d.updateMatrix(); trees.setMatrixAt(i, d.matrix); }
  scene.add(trees);
  // rain: short streaks in a box that follows the camera
  const RN = 1800, pos = new Float32Array(RN * 6); const rg = new THREE.BufferGeometry(); rg.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const rain = new THREE.LineSegments(rg, new THREE.LineBasicMaterial({ color: '#9AB0D0', transparent: true, opacity: 0.45, fog: false })); scene.add(rain);
  const update = (t, cam, flashOn = true) => {
    sky.position.copy(cam.position); rain.position.copy(cam.position); const a = rg.attributes.position.array;
    for (let i = 0; i < RN; i++) { const x = (rnd(i) - 0.5) * 40, z = (rnd(i * 2) - 0.5) * 40, y = 20 - ((t * 30 + rnd(i * 3) * 40) % 40); a.set([x, y, z, x - 0.15, y - 1.2, z], i * 6); }
    rg.attributes.position.needsUpdate = true;
    const f = flashOn ? Math.max(0, Math.sin(t * 0.9) > 0.985 ? 1 : 0, (Math.sin(t * 2.3 + 1) > 0.995) ? 1 : 0) : 0; m.uniforms.flash.value = f; hemi.intensity = 1.2 + f * 2;
  };
  return { scene, update, key };
}

/** a parachute canopy (striped dome + lines) with its harness point at the origin; the canopy sits ~5 above */
export function parachute(a = '#F2E6CF', b = '#D8584A') {
  const g = new THREE.Group();
  const t = canvasTex('chute' + a + b, 512, 64, (c) => { for (let i = 0; i < 12; i++) { c.fillStyle = i % 2 ? a : b; c.fillRect(i * 512 / 12, 0, 512 / 12 + 1, 64); } });
  const dome = new THREE.Mesh(new THREE.SphereGeometry(3, 24, 10, 0, Math.PI * 2, 0, Math.PI / 2.4), mat({ map: t, side: THREE.DoubleSide })); dome.scale.y = 0.6; dome.position.y = 5; g.add(dome);
  const lm = new THREE.LineBasicMaterial({ color: '#D8D8D8' }); const pts = []; for (let i = 0; i < 12; i++) { const an = i / 12 * Math.PI * 2; pts.push(new THREE.Vector3(0, 0, 0), new THREE.Vector3(Math.cos(an) * 2.6, 5.3, Math.sin(an) * 2.6)); }
  g.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(pts), lm));
  return g;
}

/** the cabin of a 1970s jet: a long narrow room with seat rows and oval windows; camera down the aisle (aisle along z, front at -z) */
export function cabin(E) {
  const scene = new THREE.Scene(); scene.background = new THREE.Color('#1A1E28');
  scene.environment = E.envMap; scene.environmentIntensity = 0.25;
  scene.add(new THREE.HemisphereLight('#FFF4E0', '#5A5048', 1.4));
  const key = new THREE.DirectionalLight('#FFF0D8', 1.0); key.position.set(2, 6, 6); key.castShadow = true; key.shadow.mapSize.set(1024, 1024); Object.assign(key.shadow.camera, { left: -6, right: 6, top: 10, bottom: -10 }); key.shadow.camera.updateProjectionMatrix(); scene.add(key, key.target);
  const W2 = 3.6, LEN = 18;
  const floor = box(W2, 0.1, LEN, mat({ map: T.planks('#4A5A7A', [2, 8]) }), 0, -0.05, -LEN / 2 + 2, scene);
  const carpet = box(0.8, 0.02, LEN, mat({ color: '#B5372E' }), 0, 0.01, -LEN / 2 + 2, scene);
  const wallT = canvasTex('cabinwall', 1024, 256, (c) => { c.fillStyle = '#E8E2D4'; c.fillRect(0, 0, 1024, 256); for (let x = 40; x < 1024; x += 128) { c.fillStyle = '#C9C2B0'; c.beginPath(); c.roundRect(x - 4, 66, 58, 86, 26); c.fill(); c.fillStyle = '#1A2436'; c.beginPath(); c.roundRect(x, 70, 50, 78, 24); c.fill(); } c.fillStyle = '#B5372E'; c.fillRect(0, 190, 1024, 10); });
  [-1, 1].forEach((s) => { const w = new THREE.Mesh(new THREE.PlaneGeometry(LEN, 2.4), mat({ map: wallT })); w.position.set(s * W2 / 2, 1.2, -LEN / 2 + 2); w.rotation.y = -s * Math.PI / 2; scene.add(w); });
  const ceil = box(W2, 0.1, LEN, mat({ color: '#F2EEE4' }), 0, 2.45, -LEN / 2 + 2, scene);
  [-1, 1].forEach((s) => box(0.7, 0.35, LEN, mat({ color: '#E0DACC' }), s * (W2 / 2 - 0.35), 2.2, -LEN / 2 + 2, scene));
  for (let i = 0; i < 10; i++) { const l = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.18), glow('#FFF4D8', 1.0)); l.rotation.x = Math.PI / 2; l.position.set(0, 2.39, 1 - i * 1.8); scene.add(l); }
  const blue = mat({ color: '#2E4E8A' }), head = mat({ color: '#F2EEE4' }); const seats = [];
  for (let r = 0; r < 9; r++) [-1, 1].forEach((s) => [0, 1].forEach((k) => { const g = new THREE.Group(); g.position.set(s * (0.75 + k * 0.6), 0, 1 - r * 1.6); scene.add(g); box(0.55, 0.45, 0.55, blue, 0, 0.35, 0, g); box(0.55, 0.75, 0.14, blue, 0, 0.9, 0.3, g); box(0.5, 0.18, 0.04, head, 0, 1.18, 0.23, g); seats.push(g); }));
  const front = box(W2, 2.5, 0.1, mat({ color: '#D8D2C2' }), 0, 1.25, -LEN + 2, scene);
  return { scene, seats, key };
}

/** a sandy river bank in daylight: sand, a wide slow river, far hills, a few pines */
export function riverBar(E) {
  const scene = new THREE.Scene();
  const m = new THREE.ShaderMaterial({ side: THREE.BackSide, depthWrite: false, fog: false, toneMapped: false, uniforms: { top: { value: new THREE.Color('#7FA8D0') }, hor: { value: new THREE.Color('#D6E4EE') } },
    vertexShader: 'varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
    fragmentShader: 'uniform vec3 top, hor; varying vec3 vP; void main(){ float y = max(vP.y, 0.0); gl_FragColor = vec4(mix(hor, top, pow(clamp(y * 2.0, 0.0, 1.0), 0.6)), 1.0); }' });
  const sky = new THREE.Mesh(new THREE.SphereGeometry(500, 32, 16), m); sky.renderOrder = -10; scene.add(sky);
  scene.fog = new THREE.Fog('#C8D6E0', 60, 300); scene.environment = E.envMap; scene.environmentIntensity = 0.3;
  scene.add(new THREE.HemisphereLight('#F4F0E8', '#7A6A50', 1.3)); const key = new THREE.DirectionalLight('#FFF0D8', 1.8); key.position.set(10, 16, 12); key.castShadow = true; key.shadow.mapSize.set(2048, 2048); Object.assign(key.shadow.camera, { left: -15, right: 15, top: 15, bottom: -15 }); key.shadow.camera.updateProjectionMatrix(); scene.add(key, key.target);
  const sand = new THREE.Mesh(new THREE.PlaneGeometry(200, 60, 60, 20), mat({ color: '#D8C49A', flatShading: true })); const p = sand.geometry.attributes.position; for (let i = 0; i < p.count; i++) p.setZ(i, Math.sin(p.getX(i) * 0.2) * 0.15 + Math.cos(p.getY(i) * 0.3) * 0.1); sand.geometry.computeVertexNormals(); sand.rotation.x = -Math.PI / 2; sand.position.z = 10; sand.receiveShadow = true; scene.add(sand);
  const river = new THREE.Mesh(new THREE.PlaneGeometry(400, 160, 60, 30), new THREE.MeshStandardMaterial({ color: '#4A7A8A', roughness: 0.25, metalness: 0.1, flatShading: true })); river.rotation.x = -Math.PI / 2; river.position.set(0, -0.15, -100); scene.add(river);
  const rb = river.geometry.attributes.position.array.slice();
  const hills = new THREE.Mesh(new THREE.CylinderGeometry(260, 260, 30, 40, 1, true, Math.PI * 0.8, Math.PI * 1.4), mat({ color: '#5A7A5A', side: THREE.BackSide })); hills.position.set(0, 0, -40); hills.scale.y = 0.6; scene.add(hills);
  for (let i = 0; i < 18; i++) { const tr = W.pine(5 + rnd(i) * 4, i); tr.traverse((o) => { if (o.isMesh && o.material.color && o.material.color.getHexString() === 'f4f8ff') o.visible = false; }); tr.position.set(-60 + i * 7 + rnd(i * 3) * 3, 0, 30 + rnd(i * 5) * 8); scene.add(tr); }
  const update = (t) => { const a = river.geometry.attributes.position.array; for (let i = 0; i < a.length; i += 3) a[i + 2] = Math.sin(rb[i] * 0.15 + t) * 0.12 + Math.cos(rb[i + 1] * 0.2 - t * 0.8) * 0.1; river.geometry.attributes.position.needsUpdate = true; river.geometry.computeVertexNormals(); };
  return { scene, update, key };
}
