// Extra pieces for the Nov 25 2026 build: a generic 2D cut-out (like Toon, any drawing), a cartoon turkey,
// a generic white mansion (no real building likeness beyond "white house with columns"), a podium.
import * as THREE from 'three';
import * as WD from './core/world.js';
import { INK } from './core/toon.js';

const blob = (() => { let t; return () => { if (t) return t; const c = document.createElement('canvas'); c.width = c.height = 128; const g = c.getContext('2d'); const gr = g.createRadialGradient(64, 64, 4, 64, 64, 62); gr.addColorStop(0, 'rgba(0,0,0,0.55)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(0, 0, 128, 128); t = new THREE.CanvasTexture(c); return t; }; })();

/** a flat cut-out that faces the camera. draw(g, W, H, st) paints on a W x H canvas whose bottom edge is the ground. */
export class Cut {
  constructor(draw, { w = 1, h = 1, px = 512 } = {}) {
    this.draw = draw; this.canvas = document.createElement('canvas'); this.canvas.width = px; this.canvas.height = Math.round(px * h / w); this.g = this.canvas.getContext('2d');
    this.tex = new THREE.CanvasTexture(this.canvas); this.tex.colorSpace = THREE.SRGBColorSpace; this.tex.anisotropy = 4;
    const geo = new THREE.PlaneGeometry(w, h); geo.translate(0, h / 2, 0);
    this.mat = new THREE.MeshBasicMaterial({ map: this.tex, transparent: true, alphaTest: 0.04, side: THREE.DoubleSide, toneMapped: false });
    this.mesh = new THREE.Mesh(geo, this.mat); this.mesh.castShadow = true;
    this.mesh.customDepthMaterial = new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking, map: this.tex, alphaTest: 0.5 });
    const b = new THREE.Mesh(new THREE.PlaneGeometry(w * 0.7, w * 0.25), new THREE.MeshBasicMaterial({ map: blob(), transparent: true, depthWrite: false, opacity: 0.5 })); b.rotation.x = -Math.PI / 2; b.position.y = 0.01;
    this.group = new THREE.Group(); this.pivot = new THREE.Group(); this.pivot.add(this.mesh); this.group.add(this.pivot, b); this.key = ''; this.set({});
  }
  set(st = {}) { const key = JSON.stringify(st, (k, v) => (typeof v === 'number' ? Math.round(v * 100) / 100 : v)); if (key === this.key) return this; this.key = key; this.st = st;
    const g = this.g; g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, this.canvas.width, this.canvas.height); if (st.flip) { g.translate(this.canvas.width, 0); g.scale(-1, 1); }
    this.draw(g, this.canvas.width, this.canvas.height, st); this.tex.needsUpdate = true; return this; }
  at(x, y, z) { this.group.position.set(x, y, z); return this; }
  face(cam) { const p = new THREE.Vector3(); this.group.getWorldPosition(p); this.pivot.rotation.y = Math.atan2(cam.position.x - p.x, cam.position.z - p.z) - this.group.rotation.y; return this; }
}

/** cartoon turkey, canvas 512 x 512. st: { mood: happy|shock|sad|smug, hop (0..1 lifts), flap (0..1 wings), look:[dx,dy], blink } */
export function drawTurkey(g, W, H, st = {}) {
  const s = W / 512; g.save(); g.scale(s, s); const lift = (st.hop || 0) * 40; g.translate(0, -lift);
  g.lineJoin = 'round'; g.lineCap = 'round'; g.strokeStyle = INK; g.lineWidth = 9;
  // legs
  g.strokeStyle = '#E08A1E'; g.lineWidth = 12; [[230, 0], [290, 0]].forEach(([x], i) => { g.beginPath(); g.moveTo(x, 400); g.lineTo(x + (lift ? (i ? 10 : -10) : 0), 500); g.stroke(); g.beginPath(); g.moveTo(x - 22, 500); g.lineTo(x + 22, 500); g.stroke(); });
  g.strokeStyle = INK; g.lineWidth = 9;
  // tail fan
  const cols = ['#7A4A2A', '#C9803A', '#F2C230', '#D8584A', '#7A4A2A', '#C9803A', '#F2C230', '#D8584A', '#7A4A2A'];
  for (let i = 0; i < 9; i++) { const a = -Math.PI * 0.95 + i * (Math.PI * 0.9 / 8); g.save(); g.translate(250, 300); g.rotate(a + Math.PI / 2); g.fillStyle = cols[i]; g.beginPath(); g.ellipse(0, -150, 46, 150, 0, 0, 7); g.fill(); g.stroke();
    g.fillStyle = '#FFF1D0'; g.beginPath(); g.ellipse(0, -265, 26, 30, 0, 0, 7); g.fill(); g.restore(); }
  // body
  g.fillStyle = '#8A5230'; g.beginPath(); g.ellipse(255, 330, 120, 100, 0, 0, 7); g.fill(); g.stroke();
  g.fillStyle = '#A8693E'; g.beginPath(); g.ellipse(270, 350, 70, 60, 0, 0, 7); g.fill();
  // wing
  const fl = (st.flap || 0); g.save(); g.translate(200, 320); g.rotate(-0.3 - fl * 0.9); g.fillStyle = '#6B3E22'; g.beginPath(); g.ellipse(-40, 10, 70, 40, 0.3, 0, 7); g.fill(); g.stroke(); g.restore();
  g.save(); g.translate(320, 320); g.rotate(0.3 + fl * 0.9); g.fillStyle = '#6B3E22'; g.beginPath(); g.ellipse(40, 10, 60, 36, -0.3, 0, 7); g.fill(); g.stroke(); g.restore();
  // neck + head
  g.fillStyle = '#F0A0A0'; g.beginPath(); g.moveTo(290, 270); g.quadraticCurveTo(300, 200, 285, 150); g.lineTo(335, 150); g.quadraticCurveTo(345, 210, 330, 280); g.closePath(); g.fill(); g.stroke();
  g.fillStyle = '#F4B6B0'; g.beginPath(); g.arc(310, 130, 58, 0, 7); g.fill(); g.stroke();
  // beak + wattle
  g.fillStyle = '#F2C230'; g.beginPath(); g.moveTo(355, 128); g.lineTo(400, 142); g.lineTo(355, 156); g.closePath(); g.fill(); g.stroke();
  g.fillStyle = '#D8343F'; g.beginPath(); g.ellipse(352, 182, 14, 30, 0.2, 0, 7); g.fill(); g.stroke();
  g.beginPath(); g.moveTo(345, 88); g.quadraticCurveTo(372, 100, 368, 140); g.lineWidth = 10; g.strokeStyle = '#D8343F'; g.stroke(); g.strokeStyle = INK; g.lineWidth = 9;
  // eyes
  const m = st.mood || 'happy', [lx, ly] = st.look || [0, 0];
  [[292, 118], [332, 118]].forEach(([x, y]) => {
    if (st.blink || m === 'happy' && st.closed) { g.beginPath(); g.moveTo(x - 14, y); g.quadraticCurveTo(x, y - 12, x + 14, y); g.stroke(); return; }
    const r = m === 'shock' ? 22 : 17; g.fillStyle = '#FFFFFF'; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); g.lineWidth = 5; g.stroke();
    g.fillStyle = INK; g.beginPath(); g.arc(x + lx * 6 + 3, y + ly * 6, m === 'shock' ? 6 : 8, 0, 7); g.fill(); g.lineWidth = 9;
    if (m === 'sad') { g.beginPath(); g.moveTo(x - 18, y - 26); g.lineTo(x + 14, y - 32); g.lineWidth = 6; g.stroke(); g.lineWidth = 9; }
  });
  if (m === 'sad' || st.tears) { g.fillStyle = '#7FD0FF'; g.beginPath(); g.ellipse(296, 160, 8, 14, 0, 0, 7); g.fill(); }
  if (m === 'shock') { g.fillStyle = INK; g.beginPath(); g.ellipse(316, 168, 9, 12, 0, 0, 7); g.fill(); }
  g.restore();
}
export const turkey = (size = 1) => new Cut(drawTurkey, { w: 1.0 * size, h: 1.0 * size, px: 512 });

/** a generic big white mansion with columns (faces +z). ~14 m wide. */
export function mansion() {
  const g = new THREE.Group(), white = WD.mat({ color: '#F4F2EA', roughness: 0.8 }), shade = WD.mat({ color: '#E2DED2' });
  const bx = (w, h, d, m, x, y, z) => { const o = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); o.position.set(x, y, z); o.castShadow = o.receiveShadow = true; g.add(o); return o; };
  const winTex = WD.canvasTex('mansionwin', 128, 192, (c) => { c.fillStyle = '#F4F2EA'; c.fillRect(0, 0, 128, 192); c.fillStyle = '#3F5E7A'; c.fillRect(20, 20, 88, 152); c.fillStyle = '#F4F2EA'; c.fillRect(60, 20, 8, 152); c.fillRect(20, 92, 88, 8); c.fillStyle = '#C9C4B4'; c.fillRect(12, 8, 104, 10); });
  bx(14, 6, 6, white, 0, 3, 0); bx(14.4, 0.5, 6.4, shade, 0, 6.2, 0); bx(14.4, 0.6, 6.4, shade, 0, 0.3, 0);
  for (let x = -6.3; x <= 6.3; x += 0.5) { const b = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.5, 6), white); b.position.set(x, 6.7, 3.1); g.add(b); }
  bx(14.4, 0.12, 0.2, white, 0, 6.95, 3.1);
  [1.6, 4.4].forEach((y) => [-6, -4.5, -3, 3, 4.5, 6].forEach((x) => { const w = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 1.4), WD.mat({ map: winTex })); w.position.set(x, y, 3.01); g.add(w); }));
  // portico
  bx(5.2, 0.5, 2.6, shade, 0, 0.25, 4.2); bx(5.4, 0.5, 2.8, white, 0, 5.8, 4.2);
  [-2.2, -1.32, -0.44, 0.44, 1.32, 2.2].forEach((x) => { const c = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.24, 5.3, 16), white); c.position.set(x, 2.95, 5.2); c.castShadow = true; g.add(c); });
  const sh = new THREE.Shape(); sh.moveTo(-2.8, 0); sh.lineTo(0, 1.3); sh.lineTo(2.8, 0); sh.lineTo(-2.8, 0);
  const ped = new THREE.Mesh(new THREE.ExtrudeGeometry(sh, { depth: 2.8, bevelEnabled: false }), white); ped.position.set(0, 6.05, 2.8); ped.castShadow = true; g.add(ped);
  [-1.32, 0, 1.32].forEach((x) => { const w = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 1.6), WD.mat({ map: winTex })); w.position.set(x, 1.4, 3.01); g.add(w); });
  // hedges + flag pole
  [-1, 1].forEach((s) => { const h = new THREE.Mesh(new THREE.BoxGeometry(4, 0.8, 0.8), WD.mat({ color: '#3F8A3A' })); h.position.set(s * 5.2, 0.4, 3.8); h.castShadow = true; g.add(h); });
  return g;
}
/** a lectern with a round gold seal (generic) */
export function podium() {
  const g = new THREE.Group(); const wood = WD.mat({ color: '#5A3A24' });
  const b = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.15, 0.5), wood); b.position.y = 0.575; b.castShadow = true; g.add(b);
  const seal = WD.canvasTex('seal', 128, 128, (c) => { c.fillStyle = '#1F3A6A'; c.beginPath(); c.arc(64, 64, 60, 0, 7); c.fill(); c.strokeStyle = '#E2B33C'; c.lineWidth = 8; c.stroke(); c.fillStyle = '#E2B33C'; c.beginPath(); for (let j = 0; j < 10; j++) { const r = j % 2 ? 14 : 34, a = j / 10 * Math.PI * 2 - Math.PI / 2; c.lineTo(64 + Math.cos(a) * r, 64 + Math.sin(a) * r); } c.fill(); });
  const s = new THREE.Mesh(new THREE.CircleGeometry(0.22, 24), WD.mat({ map: seal })); s.position.set(0, 0.7, 0.252); g.add(s);
  return g;
}
