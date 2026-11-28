// Meteorite pieces: a 1950s living room (couch, console radio, quilt), a meteor with a fire trail, a roof hole with a
// light shaft and dust, a small Alabama street of houses, a museum plinth. Overlays come from f19.js.
import * as THREE from 'three';
import * as WD from './core/world.js';
import { house, palm } from './core/props.js';
import { ctx, clamp, lerp, eo, eob, rnd } from './core/lib.js';
import { INK } from './core/toon.js';

const M = (o) => WD.mat(o);
const add = (p, m, x = 0, y = 0, z = 0) => { m.position.set(x, y, z); m.castShadow = true; m.receiveShadow = true; p.add(m); return m; };
const B = (w, h, d, m) => new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m);

/** a rounded 50s couch facing +z, 2.4 wide; seat top at y 0.5 */
export function couch(col = '#5E8F8A') {
  const g = new THREE.Group(), m = M({ color: col, roughness: 0.9 }), dk = M({ color: '#3A2A22' });
  add(g, B(2.4, 0.35, 0.9, m), 0, 0.33, 0); add(g, B(2.4, 0.75, 0.25, m), 0, 0.75, -0.42);
  [-1, 1].forEach((s) => add(g, B(0.25, 0.62, 0.9, m), s * 1.25, 0.45, 0));
  [-0.6, 0.6].forEach((x) => { const c = add(g, B(1.1, 0.14, 0.78, M({ color: '#6FA39D', roughness: 0.9 })), x, 0.55, 0.04); c.geometry = new THREE.BoxGeometry(1.1, 0.14, 0.78); });
  [[-1.1, 0.35], [1.1, 0.35], [-1.1, -0.35], [1.1, -0.35]].forEach(([x, z]) => add(g, new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.03, 0.18, 8), dk), x, 0.09, z));
  return g;
}
/** patchwork quilt draped over the lap/front of the couch */
export function quilt() {
  const tex = WD.canvasTex('quilt', 256, 256, (c) => { const cols = ['#D8584A', '#F2C230', '#3C6FB6', '#F4EFE4', '#6FA39D', '#E58A9A']; for (let y = 0; y < 4; y++) for (let x = 0; x < 4; x++) { c.fillStyle = cols[(x + y * 3) % 6]; c.fillRect(x * 64, y * 64, 64, 64); c.strokeStyle = '#FFFFFF'; c.setLineDash([6, 6]); c.lineWidth = 3; c.strokeRect(x * 64 + 4, y * 64 + 4, 56, 56); } });
  const g = new THREE.Group(); const top = add(g, B(1.0, 0.05, 0.55, M({ map: tex })), 0, 0.7, 0.42); const drape = add(g, B(1.0, 0.32, 0.04, M({ map: tex })), 0, 0.54, 0.69); return g;
}
/** console radio cabinet, 1.0 tall */
export function consoleRadio() {
  const g = new THREE.Group(), wood = M({ map: WD.T.planks('#7A4A2A', [1, 1]) });
  const face = WD.canvasTex('radioface', 256, 256, (c) => { c.fillStyle = '#6B3E22'; c.fillRect(0, 0, 256, 256); c.fillStyle = '#E9D7A5'; c.beginPath(); c.roundRect(30, 26, 196, 60, 12); c.fill(); c.strokeStyle = '#6B3E22'; c.lineWidth = 3; for (let x = 46; x < 214; x += 14) { c.beginPath(); c.moveTo(x, 40); c.lineTo(x, x % 28 ? 56 : 66); c.stroke(); } c.fillStyle = '#D8343F'; c.fillRect(120, 32, 4, 48);
    c.fillStyle = '#C8A878'; c.beginPath(); c.roundRect(40, 104, 176, 120, 16); c.fill(); c.strokeStyle = 'rgba(80,50,30,0.5)'; c.lineWidth = 2; for (let y = 110; y < 224; y += 6) { c.beginPath(); c.moveTo(44, y); c.lineTo(212, y); c.stroke(); } });
  const body = add(g, new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.0, 0.45), [wood, wood, wood, wood, M({ map: face }), wood]), 0, 0.55, 0);
  [-0.3, 0.3].forEach((x) => add(g, new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.03, 0.1, 6), M({ color: '#3A2A22' })), x, 0.05, 0));
  const knob = (x) => { const k = add(g, new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.04, 12), M({ color: '#E9D7A5' })), x, 0.83, 0.24); k.rotation.x = Math.PI / 2; }; knob(-0.25); knob(0.25);
  g.body = body; return g;
}
/** the meteorite: dark lumpy rock. trail(true) adds a fire tail pointing up (+y) */
export function meteor(r = 0.17) {
  const g = new THREE.Group();
  const geo = new THREE.IcosahedronGeometry(r, 2); const p = geo.attributes.position; for (let i = 0; i < p.count; i++) { const v = new THREE.Vector3().fromBufferAttribute(p, i); const f = 1 + (Math.sin(v.x * 40) * Math.cos(v.y * 33) + Math.sin(v.z * 29)) * 0.09; v.multiplyScalar(f); p.setXYZ(i, v.x, v.y, v.z); } geo.computeVertexNormals();
  const rock = new THREE.Mesh(geo, M({ color: '#2E2A28', roughness: 0.95, flatShading: true })); rock.castShadow = true; g.add(rock); g.rock = rock;
  const glowM = new THREE.MeshBasicMaterial({ color: new THREE.Color('#FF8A3A').multiplyScalar(1.4), toneMapped: false, transparent: true, opacity: 0.85, depthWrite: false, blending: THREE.AdditiveBlending });
  const tail = new THREE.Group(); g.add(tail);
  for (let i = 0; i < 5; i++) { const c = new THREE.Mesh(new THREE.ConeGeometry(r * (1.25 - i * 0.12), r * (8 + i * 4), 12, 1, true), glowM.clone()); c.position.y = r * (4 + i * 2); c.material.opacity = 0.55 - i * 0.08; c.material.color.set(['#FFE6A0', '#FFC24A', '#FF8A3A', '#FF5A2A', '#C8341E'][i]).multiplyScalar(1.3); tail.add(c); }
  const halo = new THREE.Mesh(new THREE.SphereGeometry(r * 1.7, 16, 12), glowM.clone()); halo.material.opacity = 0.18; g.add(halo);
  const light = new THREE.PointLight('#FF9A4A', 0, 14, 1.4); g.add(light);
  g.tail = tail; g.halo = halo; g.light = light;
  g.fire = (k) => { tail.visible = halo.visible = k > 0.02; tail.scale.set(1, k, 1); halo.scale.setScalar(0.6 + k * 0.6); light.intensity = 5 * k; };
  g.fire(1); return g;
}
/** puffs of smoke/dust as sprites. g.update(t, amt) */
let puffT; const puffTex = () => puffT || (puffT = WD.canvasTex('mpuff', 128, 128, (c) => { const gr = c.createRadialGradient(64, 64, 4, 64, 64, 62); gr.addColorStop(0, 'rgba(255,255,255,0.9)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); c.fillStyle = gr; c.fillRect(0, 0, 128, 128); }));
export function dust(n = 14, col = '#D8CDBA', spread = 1) {
  const g = new THREE.Group(), ps = [];
  for (let i = 0; i < n; i++) { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: puffTex(), color: col, transparent: true, depthWrite: false })); g.add(s); ps.push(s); }
  g.update = (k) => ps.forEach((s, i) => { const a = rnd(i) * 6.28, r = (0.2 + rnd(i * 3) * 1.2) * spread * eo(clamp(k)); s.position.set(Math.cos(a) * r, -rnd(i * 5) * 1.5 * spread * eo(clamp(k)), Math.sin(a) * r * 0.6); const sc = (0.3 + 0.7 * k) * spread * (0.6 + rnd(i * 7)); s.scale.set(sc, sc, 1); s.material.opacity = 0.7 * (1 - clamp(k)) ; s.visible = k > 0 && k < 1; });
  g.update(0); return g;
}

/** the living room set. Returns { scene, sun, couch, radio, hole, beam, ann spot } */
export function livingRoom(E) {
  const R = WD.interior(E, { w: 8, depth: 6, h: 3.4, wall: '#C9B48A', motif: '#B89E70', floor: '#8A5A3A', ceiling: '#E8DCC0', signText: null, picture: true, counterOn: false, litter: false, bulbs: false });
  const s = R.scene; R.sun.key.target.position.set(0, 0, -3);
  const c = couch(); c.position.set(0.3, 0, -4.9); s.add(c);
  const q = quilt(); q.position.set(0.3, 0, -4.9); s.add(q);
  const rad = consoleRadio(); rad.position.set(2.0, 0, -5.3); s.add(rad);
  const rug = new THREE.Mesh(new THREE.CircleGeometry(1.6, 40), M({ color: '#9E3A3A' })); rug.rotation.x = -Math.PI / 2; rug.scale.set(1.4, 1, 1); rug.position.set(0, 0.01, -3.4); rug.receiveShadow = true; s.add(rug);
  const lamp = new THREE.Group(); lamp.position.set(-2.4, 0, -5.2); s.add(lamp); add(lamp, new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.5, 8), M({ color: '#C9A13B', metalness: 0.5 })), 0, 0.75, 0);
  const shade = add(lamp, new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.32, 0.35, 16, 1, true), M({ color: '#F4E2B8', side: THREE.DoubleSide, emissive: '#FFD98A', emissiveIntensity: 0.5 })), 0, 1.6, 0);
  // the roof hole: dark ragged disc under the ceiling + sky light shaft
  const holeTex = WD.canvasTex('holetex', 256, 256, (c2) => { c2.fillStyle = '#BFE4F7'; c2.beginPath(); for (let i = 0; i < 24; i++) { const a = i / 24 * 6.28, r = 90 + rnd(i) * 30; c2.lineTo(128 + Math.cos(a) * r, 128 + Math.sin(a) * r); } c2.closePath(); c2.fill(); c2.strokeStyle = '#3A2A22'; c2.lineWidth = 14; c2.stroke(); });
  const hole = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 1.0), new THREE.MeshBasicMaterial({ map: holeTex, transparent: true, toneMapped: false })); hole.rotation.x = Math.PI / 2; hole.position.set(1.0, 3.38, -5.0); s.add(hole);
  const beamM = new THREE.MeshBasicMaterial({ color: '#FFF3D0', transparent: true, opacity: 0.18, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide });
  const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.75, 3.4, 20, 1, true), beamM); beam.position.set(1.0, 1.7, -5.0); s.add(beam);
  const shaftLight = new THREE.SpotLight('#FFF0D0', 0, 8, 0.5, 0.6, 1.2); shaftLight.position.set(1.0, 3.6, -5.0); shaftLight.target.position.set(1.0, 0, -5.0); s.add(shaftLight, shaftLight.target);
  const debris = dust(16, '#E8DCC0', 0.8); debris.position.set(1.0, 3.2, -5.0); s.add(debris);
  const setHole = (k) => { hole.visible = k > 0; beam.visible = k > 0; beamM.opacity = 0.05 * k; shaftLight.intensity = 5 * k; };
  setHole(0);
  return { ...R, couch: c, radio: rad, hole, beam, setHole, debris };
}

/** a small 1950s Alabama street: three houses, trees, an old car. Returns { scene, sun, home } (home = Ann's house at origin) */
export function town(E) {
  const scene = new THREE.Scene();
  WD.sky(scene, { top: '#4F8FD0', horizon: '#F2DCC0', ground: '#F2DCC0' });
  scene.fog = new THREE.Fog('#E8D8C0', 80, 420);
  const sun = WD.sunlight(scene, E, { col: '#FFE4BE', i: 2.6, pos: [-10, 14, 12], target: [0, 0, 0], box: 22, sky: '#D8ECFF', ground: '#8A7A5A', hemi: 1.2 });
  WD.clouds(scene, [[-60, 40, -160, 22], [40, 50, -170, 30], [120, 36, -150, 18], [-140, 30, -140, 16], [0, 60, -120, 20]]);
  const grass = new THREE.Mesh(new THREE.PlaneGeometry(900, 900), M({ map: WD.T.grass('#7FAE58', [120, 120]) })); grass.rotation.x = -Math.PI / 2; grass.receiveShadow = true; scene.add(grass);
  const road = new THREE.Mesh(new THREE.PlaneGeometry(500, 6), M({ map: WD.T.dirt('#B89A72', [80, 1], false) })); road.rotation.x = -Math.PI / 2; road.position.set(0, 0.02, 8); road.receiveShadow = true; scene.add(road);
  const homes = [[0, 0, '#F2E6CF', '#5A6A7A'], [-11, 0, '#CFE3E0', '#8A4A3A'], [11, 0, '#F2D7D0', '#4A5A4A'], [-22, 0, '#E8E0B8', '#6A4A4A'], [22, 0, '#D8E6F2', '#7A3A2A']].map(([x, z, w, r]) => { const h = house({ wall: w, roof: r }); h.position.set(x, 0, z); scene.add(h); return h; });
  [[-5.5, -6], [6, -7], [-16, -5], [16, -6], [-28, -3], [28, -4], [-5, 14], [7, 15], [-18, 16]].forEach(([x, z], i) => { const t = WD.tree(1.4 + rnd(i) * 0.6, i % 2 ? '#4E8A3C' : '#5E9A44', i % 3 ? 'round' : 'round'); t.position.set(x, 0, z); scene.add(t); });
  const car = WD.car('#7AA6A0'); car.position.set(-7, 0, 8); car.rotation.y = Math.PI / 2; scene.add(car); car.children.forEach((m) => (m.castShadow = true));
  [[-30, 30], [30, 30], [-60, 10], [60, 12]].forEach(([x, z], i) => { const t = WD.tree(2 + rnd(i), '#4E8A3C', 'round'); t.position.set(x, 0, -z); scene.add(t); });
  return { scene, sun, home: homes[0] };
}

// ── 2D ──
/** newspaper front page */
export function paper(k, head, sub, { x = 540, y = 620, rot = -0.06 } = {}) {
  if (k <= 0) return; const a = eob(clamp(k)); ctx.save(); ctx.translate(x, y); ctx.rotate(rot + (1 - clamp(k)) * 2); ctx.scale(a, a);
  ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.fillRect(-330, -400, 680, 820); ctx.fillStyle = '#F2EBDA'; ctx.strokeStyle = INK; ctx.lineWidth = 8; ctx.beginPath(); ctx.rect(-340, -410, 680, 820); ctx.fill(); ctx.stroke();
  ctx.fillStyle = INK; ctx.textAlign = 'center'; ctx.font = '900 54px Caladea, serif'; ctx.fillText('THE DAILY HOME', 0, -330); ctx.fillRect(-300, -305, 600, 6); ctx.fillRect(-300, -290, 600, 2);
  ctx.font = '900 92px Inter'; head.forEach((l, i) => ctx.fillText(l, 0, -190 + i * 96)); ctx.font = '700 40px Inter'; ctx.fillStyle = '#5A4A3A'; ctx.fillText(sub, 0, -190 + head.length * 96 + 10);
  ctx.fillStyle = '#C9BFA8'; ctx.fillRect(-300, 30, 280, 300); for (let i = 0; i < 9; i++) ctx.fillRect(20, 40 + i * 32, 280 - (i % 3) * 40, 14);
  ctx.fillStyle = '#2E2A28'; ctx.beginPath(); ctx.arc(-160, 180, 70, 0, 7); ctx.fill(); ctx.restore();
}
/** speech bubble */
export function bubble(text, k, x, y, { size = 76, col = '#FFFFFF', tail = -1 } = {}) {
  if (k <= 0) return; const a = eob(clamp(k)); ctx.save(); ctx.translate(x, y); ctx.scale(a, a); ctx.font = `900 ${size}px Inter`; const w = ctx.measureText(text).width + 80, h = size + 60;
  ctx.fillStyle = col; ctx.strokeStyle = INK; ctx.lineWidth = 9; ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, 40); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(tail * 40, h / 2 - 4); ctx.lineTo(tail * 90, h / 2 + 60); ctx.lineTo(tail * 100 + 60 * -tail, h / 2 - 4); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.fillRect(tail * 40 - 6, h / 2 - 14, 60 * -tail + 12, 14);
  ctx.fillStyle = INK; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(text, 0, 4); ctx.restore();
}
/** cash bills flying from a to b */
export function cashFly(k, n = 10, x0 = 300, y0 = 900, x1 = 780, y1 = 860) {
  for (let i = 0; i < n; i++) { const q = clamp((k - i * 0.06) / 0.5); if (q <= 0 || q >= 1) continue; const x = lerp(x0, x1, q), y = lerp(y0, y1, q) - Math.sin(q * Math.PI) * 200; ctx.save(); ctx.translate(x, y); ctx.rotate(q * 6 + i);
    ctx.fillStyle = '#7FBF7A'; ctx.strokeStyle = '#2E5A2E'; ctx.lineWidth = 4; ctx.fillRect(-60, -30, 120, 60); ctx.strokeRect(-60, -30, 120, 60); ctx.fillStyle = '#2E5A2E'; ctx.font = '900 34px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('$', 0, 2); ctx.restore(); }
}
