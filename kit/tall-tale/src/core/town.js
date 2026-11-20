// Burning-town kit for the Tall Tale world (Centralia). Everything drawn in code.
//   smokeVent(n, s) .update(t) · flames(n, s) .update(t, k) · crack(len) · earthCut() .set(k) · sinkhole(r) · roadSign(lines) · hose()
//   gesture(name, t) -> { armL, armR, ... } hand acting for the cut-out people
import * as THREE from 'three';
import { T, mat, canvasTex } from './world.js';

const rnd = (i) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const box = (w, h, d, m, x = 0, y = 0, z = 0, parent) => { const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); b.position.set(x, y, z); b.castShadow = b.receiveShadow = true; if (parent) parent.add(b); return b; };
let puffT = null;
const puffTex = () => { if (puffT) return puffT; const c = document.createElement('canvas'); c.width = c.height = 128; const g = c.getContext('2d'); const gr = g.createRadialGradient(64, 64, 4, 64, 64, 60); gr.addColorStop(0, 'rgba(235,235,240,1)'); gr.addColorStop(0.6, 'rgba(215,215,225,0.8)'); gr.addColorStop(1, 'rgba(215,215,225,0)'); g.fillStyle = gr; g.fillRect(0, 0, 128, 128); puffT = new THREE.CanvasTexture(c); return puffT; };

/** rising white-grey smoke from a hole in the ground. g.update(t) */
export function smokeVent(n = 10, s = 1, col = '#E4E2E8') {
  const g = new THREE.Group(), puffs = [];
  for (let i = 0; i < n; i++) { const p = new THREE.Sprite(new THREE.SpriteMaterial({ map: puffTex(), transparent: true, depthWrite: false, color: col })); g.add(p); puffs.push(p); }
  g.update = (t, amt = 1) => puffs.forEach((p, i) => { const k = (t * 0.35 + i / n) % 1; p.position.set(Math.sin(i * 2.1 + t * 0.6) * 0.3 * s + k * 0.6 * s, k * 3.2 * s, Math.cos(i * 1.7) * 0.2 * s); const sc = (0.4 + k * 1.8) * s; p.scale.set(sc, sc, 1); p.material.opacity = Math.sin(k * Math.PI) * 0.45 * amt; p.visible = amt > 0.01; });
  g.update(0); return g;
}
/** cartoon flames: glowing cones that flicker. g.update(t, k) k = size 0..1 */
export function flames(n = 7, s = 1, lightK = 25) {
  const g = new THREE.Group(), fl = [];
  const cols = ['#FF5A1F', '#FF8A2A', '#FFC23A'];
  for (let i = 0; i < n; i++) { const m = new THREE.Mesh(new THREE.ConeGeometry(0.28 * s, 1.1 * s, 8), new THREE.MeshBasicMaterial({ color: new THREE.Color(cols[i % 3]).multiplyScalar(1.0), toneMapped: false, transparent: true, opacity: 0.92 }));
    const a = rnd(i) * 6.28, r = rnd(i * 3) * 0.7 * s; m.position.set(Math.cos(a) * r, 0, Math.sin(a) * r); g.add(m); fl.push(m); }
  const light = new THREE.PointLight('#FF8A3A', 0, 10, 1.4); light.position.y = 1 * s; g.add(light);
  g.update = (t, k = 1) => { fl.forEach((m, i) => { const f = 0.75 + 0.35 * Math.sin(t * 14 + i * 1.9) * Math.sin(t * 9.3 + i); m.scale.set(k, Math.max(0.001, k * f), k); m.position.y = 0.55 * s * k * f; }); light.intensity = lightK * k; g.visible = k > 0.01; };
  g.update(0, 1); return g;
}
/** a jagged dark crack painted on the ground (plane at y 0.02) */
export function crack(len = 3, seed = 1) {
  const t = canvasTex('crack' + seed, 512, 128, (c) => { c.strokeStyle = '#2A1A14'; c.lineCap = 'round'; c.lineWidth = 14; c.beginPath(); c.moveTo(10, 64); for (let i = 1; i <= 10; i++) c.lineTo(i * 50, 64 + (rnd(i * 7 + seed) - 0.5) * 70); c.stroke();
    c.lineWidth = 6; c.strokeStyle = '#FF7A2A'; c.globalAlpha = 0.7; c.beginPath(); c.moveTo(10, 64); for (let i = 1; i <= 10; i++) c.lineTo(i * 50, 64 + (rnd(i * 7 + seed) - 0.5) * 70); c.stroke(); });
  const m = new THREE.Mesh(new THREE.PlaneGeometry(len, len * 0.25), new THREE.MeshStandardMaterial({ map: t, transparent: true, emissive: '#FF6A2A', emissiveMap: t, emissiveIntensity: 0.6, depthWrite: false }));
  m.rotation.x = -Math.PI / 2; m.position.y = 0.025; return m;
}
/** a cross-section of the hill: grass on top, earth layers, black mine tunnels; burning coal glows along the tunnels.
 *  Front face at z = 0, 16 wide, from y = -8 to 0. g.set(k) spreads the fire from the left pit (k 0..1) */
export function earthCut() {
  const W = 16, H = 8, g = new THREE.Group();
  const tunnels = [[-7.4, -1.2, 1.4, 1.4], [-6.6, -2.6, 4.2, 0.7], [-2.6, -2.6, 0.7, 3.4], [-2.6, -5.2, 6.4, 0.7], [3.2, -5.2, 0.7, 2.4], [3.2, -3.4, 4.4, 0.7], [-0.4, -4.0, 0.7, 1.4], [5.4, -6.8, 2.2, 0.7], [-5.4, -6.4, 3.4, 0.7], [-5.4, -6.4, 0.7, 1.4]];
  const tex = canvasTex('earthcut', 1024, 512, (c) => {
    const lay = [['#8A5A3A', 0], ['#7A4E34', 0.18], ['#6B442E', 0.4], ['#3A2A24', 0.62], ['#5A3C2A', 0.82]];
    lay.forEach(([col, y], i) => { c.fillStyle = col; c.fillRect(0, y * 512, 1024, 512); });
    for (let i = 0; i < 900; i++) { c.fillStyle = `rgba(0,0,0,${0.08 + rnd(i) * 0.12})`; c.beginPath(); c.arc(rnd(i * 3) * 1024, rnd(i * 7) * 512, 2 + rnd(i * 11) * 6, 0, 7); c.fill(); }
    c.fillStyle = '#1B1414'; tunnels.forEach(([x, y, w, h]) => c.fillRect((x + W / 2) / W * 1024, -(y) / H * 512 - h / H * 512, w / W * 1024, h / H * 512));
    c.fillStyle = '#5DA83E'; c.fillRect(0, 0, 1024, 18); });
  const front = new THREE.Mesh(new THREE.PlaneGeometry(W, H), mat({ map: tex })); front.position.set(0, -H / 2, 0); g.add(front);
  const top = box(W, 0.2, 6, mat({ map: T.grass('#6DBB4A', [8, 3]) }), 0, -0.1, -3, g);
  box(W, H, 0.1, mat({ color: '#3A2A24' }), 0, -H / 2, -6, g);
  // glowing fire segments, one per tunnel, in order of spreading
  const glows = tunnels.map(([x, y, w, h], i) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w * 0.92, h * 0.7), new THREE.MeshBasicMaterial({ color: new THREE.Color(i % 2 ? '#FF6A1F' : '#FF9A2A').multiplyScalar(1.8), toneMapped: false, transparent: true }));
    m.position.set(x + w / 2, y + h / 2, 0.02); g.add(m); return m; });
  const order = [0, 1, 9, 8, 2, 6, 3, 4, 5, 7];
  const pl = new THREE.PointLight('#FF7A2A', 0, 14, 1.2); pl.position.set(0, -4, 2); g.add(pl);
  g.set = (k, t = 0) => { order.forEach((ti, j) => { const a = Math.max(0, Math.min(1, k * order.length - j)); const m = glows[ti]; m.visible = a > 0; m.material.opacity = a * (0.8 + 0.2 * Math.sin(t * 8 + j)); }); pl.intensity = 40 * k; };
  g.set(0); g.W = W; g.H = H; return g;
}
/** a dark smoking hole in the ground (radius r): a black disc with a rough rim */
export function sinkhole(r = 0.9) {
  const g = new THREE.Group();
  const hole = new THREE.Mesh(new THREE.CircleGeometry(r, 28), new THREE.MeshBasicMaterial({ color: '#0E0A0A' })); hole.rotation.x = -Math.PI / 2; hole.position.y = 0.03; g.add(hole);
  const rim = new THREE.Mesh(new THREE.RingGeometry(r, r * 1.35, 28), mat({ color: '#5A3C2A' })); rim.rotation.x = -Math.PI / 2; rim.position.y = 0.035; g.add(rim);
  for (let i = 0; i < 9; i++) { const a = i / 9 * 6.28; const c = box(0.25, 0.12, 0.2, mat({ color: '#6B4A33' }), Math.cos(a) * r * 1.2, 0.06, Math.sin(a) * r * 1.2, g); c.rotation.y = a; }
  const glow = new THREE.PointLight('#FF6A2A', 6, 4, 1.5); glow.position.y = -0.3; g.add(glow);
  return g;
}
/** a warning sign on a post (lines of text) */
export function roadSign(lines = ['DANGER'], { bg = '#F2C230', fg = '#1F1C33', w = 1.4, h = 1.0 } = {}) {
  const g = new THREE.Group();
  const t = canvasTex('rs' + lines.join('|') + bg, 400, Math.round(400 * h / w), (c, cw, ch) => { c.fillStyle = bg; c.fillRect(0, 0, cw, ch); c.strokeStyle = fg; c.lineWidth = 14; c.strokeRect(14, 14, cw - 28, ch - 28); c.fillStyle = fg; c.textAlign = 'center'; c.textBaseline = 'middle';
    lines.forEach((l, i) => { let fs = ch / (lines.length + 0.8); c.font = `900 ${fs}px Inter`; while (c.measureText(l).width > cw * 0.84) { fs -= 2; c.font = `900 ${fs}px Inter`; } c.fillText(l, cw / 2, ch * (i + 1) / (lines.length + 1) + 4); }); });
  box(0.08, 2.0, 0.08, mat({ color: '#8A8A90', metalness: 0.4 }), 0, 1.0, -0.05, g);
  const p = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat({ map: t, side: THREE.DoubleSide })); p.position.y = 2.0; p.castShadow = true; g.add(p);
  return g;
}

/** hand acting: returns arm angles (and extras) for a named gesture at time t */
export function gesture(name, t, ph = 0) {
  const s = Math.sin(t * 6 + ph), c = Math.sin(t * 6 + ph + 1.6);
  switch (name) {
    case 'explain': return { armL: [55 + s * 18, -70 + c * 25], armR: [55 - c * 18, -70 - s * 25] };            // both hands talking
    case 'pointR': return { armR: [100 + s * 4, -5], armL: [20, 10] };                                       // point to screen right
    case 'pointL': return { armL: [100 + s * 4, -5], armR: [20, 10] };
    case 'pointUp': return { armR: [160, -10], armL: [25, 10] };
    case 'shrug': return { armL: [70, -110 + s * 6], armR: [70, -110 - s * 6], bob: -Math.abs(s) * 6 };
    case 'head': return { armL: [165, -120], armR: [165, -120] };                                           // hands on head
    case 'stop': return { armR: [95, -40], armL: [20, 10] };                                                 // palm out
    case 'wave': return { armR: [150 + s * 20, 10], armL: [20, 10] };
    case 'count': return { armR: [80 + s * 6, -90], armL: [70, -60] };
    case 'pull': return { armL: [100 + s * 10, -20], armR: [100 + s * 10, -20], lean: -8 + s * 3 };
    case 'dig': return { armL: [60 + s * 30, -40], armR: [80 + s * 30, -60], lean: 6 + s * 6 };
    case 'cheer': return { armL: [160 + s * 10, 10], armR: [160 - s * 10, 10] };
    default: return { armL: [20, 10], armR: [20, 10] };
  }
}
