// THE SODDER CHILDREN (Christmas Eve 1945): the shot list (Tall Tale 3D, serious, respectful).
// No child is ever shown in the fire; the billboard uses faceless silhouettes, not real photos.
import * as THREE from 'three';
import { ctx, clamp, lerp, seg, eo, eio, eob } from './core/lib.js';
import { L, Le, Wd, T } from './core/timing.js';
import { camera } from './core/engine.js';
import * as WD from './core/world.js';
import * as PR from './core/props.js';
import * as TW from './core/town.js';
import * as W from './core/winter.js';
import { Toon, PROPS } from './core/toon.js';

const V3 = (x, y, z) => new THREE.Vector3(x, y, z);
const mix = (a, b, k) => a.clone().lerp(b, k);
const talk = (t, on = 1) => (on ? 0.25 + 0.75 * Math.abs(Math.sin(t * 13)) * (0.6 + 0.4 * Math.sin(t * 5.3)) : 0);
const blink = (t, off = 0) => (((t + off) % 3.3) < 0.12 ? 1 : 0);
const G = TW.gesture;
const INK = '#1F1C33';
const NT = '#AEB8DC';                                   // night tint for the cut-out people outdoors

const LOOK = {
  dad: { body: '#6B5A4A', hat: 'cap', hatCol: '#3B3346', neck: 'scarf', neckCol: '#B5372E', extra: ['mustache'] },
  mom: { body: '#9C5A5A', hat: 'bun', hatCol: '#3A2A20', pattern: 'apron' },
  teenG: { body: '#5C8FD6', hat: 'bow', hatCol: '#F4EFE4' },
  teenB: { body: '#7FA36A', hat: 'cap', hatCol: '#3B3346' },
  boy: { body: '#E8734A', hat: 'beanie', hatCol: '#2E4E8A', kid: true },
  girl: { body: '#F2C230', hat: 'bow', hatCol: '#D8343F', kid: true },
  chief: { body: '#2A2638', hat: 'mailcap', hatCol: '#B5372E', neck: 'tie', neckCol: '#F2C230', extra: ['mustache'] },
  sleeper: { body: '#F4EFE4', hat: 'none', kid: true },
};
const person = (k, opts) => new Toon({ ...LOOK[k], extra: [...(LOOK[k].extra || [])] }, opts);
const P2 = {
  shovel: (g, x, y) => { g.save(); g.translate(x, y); g.rotate(0.5); g.strokeStyle = INK; g.lineWidth = 6; g.fillStyle = '#9A6A43'; g.beginPath(); g.roundRect(-7, -140, 14, 230, 5); g.fill(); g.stroke(); g.fillStyle = '#9AA0AE'; g.beginPath(); g.moveTo(-34, 86); g.lineTo(34, 86); g.lineTo(26, 150); g.quadraticCurveTo(0, 170, -26, 150); g.closePath(); g.fill(); g.stroke(); g.restore(); },
  clipboard: (g, x, y) => { g.save(); g.translate(x, y - 50); g.rotate(-0.1); g.strokeStyle = INK; g.lineWidth = 5; g.fillStyle = '#9A6A43'; g.beginPath(); g.roundRect(-55, -70, 110, 140, 6); g.fill(); g.stroke(); g.fillStyle = '#FFFDF4'; g.fillRect(-45, -55, 90, 115); g.strokeStyle = '#7A7A8A'; g.lineWidth = 3; for (let i = 0; i < 5; i++) { g.beginPath(); g.moveTo(-36, -38 + i * 20); g.lineTo(30, -38 + i * 20); g.stroke(); } g.restore(); },
  letter: (g, x, y) => { g.save(); g.translate(x, y - 40); g.rotate(0.15); g.strokeStyle = INK; g.lineWidth = 5; g.fillStyle = '#FFFDF4'; g.beginPath(); g.rect(-60, -40, 120, 80); g.fill(); g.stroke(); g.beginPath(); g.moveTo(-60, -40); g.lineTo(0, 6); g.lineTo(60, -40); g.stroke(); g.restore(); },
  candle: (g, x, y) => { g.save(); g.translate(x, y - 30); g.strokeStyle = INK; g.lineWidth = 5; g.fillStyle = '#F4EFE4'; g.fillRect(-12, -50, 24, 70); g.strokeRect(-12, -50, 24, 70); g.fillStyle = '#FFB23A'; g.beginPath(); g.ellipse(0, -64, 9, 16, 0, 0, 7); g.fill(); g.restore(); },
};

// ── overlays (above the caption zone) ──
function ribbon(text, k, y = 380, size = 84) {
  if (k <= 0) return; const a = eob(clamp(k)); ctx.save(); ctx.translate(540, y); ctx.rotate(-0.03); ctx.scale(a, a); ctx.font = `900 ${size}px Inter`; const w = ctx.measureText(text).width + 90;
  ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.fillRect(-w / 2 + 12, -62, w, 140); ctx.fillStyle = '#F2C230'; ctx.strokeStyle = INK; ctx.lineWidth = 8; ctx.beginPath(); ctx.rect(-w / 2, -70, w, 140); ctx.fill(); ctx.stroke();
  ctx.fillStyle = INK; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(text, 0, 6); ctx.restore();
}
function pill(text, k, y = 250, bg = 'rgba(31,28,51,0.88)', size = 50) {
  if (k <= 0) return; ctx.save(); ctx.globalAlpha = clamp(k * 1.5); ctx.translate(540, y + (1 - eo(clamp(k))) * 30); ctx.font = `900 ${size}px Inter`; const w = ctx.measureText(text).width + 70;
  ctx.fillStyle = bg; ctx.beginPath(); ctx.roundRect(-w / 2, -size * 0.85, w, size * 1.7, size * 0.85); ctx.fill(); ctx.strokeStyle = '#F2C230'; ctx.lineWidth = 5; ctx.stroke();
  ctx.fillStyle = '#FFFFFF'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(text, 0, 4); ctx.restore();
}
function counter(n, k, label, y = 330, w = 520) {
  if (k <= 0) return; ctx.save(); ctx.globalAlpha = clamp(k * 2); ctx.translate(540, y); ctx.fillStyle = 'rgba(16,22,40,0.86)'; ctx.beginPath(); ctx.roundRect(-w / 2, -110, w, 220, 30); ctx.fill(); ctx.strokeStyle = '#F2C230'; ctx.lineWidth = 6; ctx.stroke();
  ctx.fillStyle = '#FFFFFF'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.font = '900 118px Inter'; ctx.fillText(String(n), 0, -14); ctx.font = '800 36px Inter'; ctx.fillStyle = '#F2C230'; ctx.fillText(label, 0, 72); ctx.restore();
}
function clock(hour, k, label, y = 420) {     // a round clock face; hour can be fractional (1.0 → 7.0)
  if (k <= 0) return; const a = eob(clamp(k)); ctx.save(); ctx.translate(540, y); ctx.scale(a, a); const R = 170;
  ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.beginPath(); ctx.arc(10, 12, R + 14, 0, 7); ctx.fill();
  ctx.fillStyle = '#FFFDF4'; ctx.strokeStyle = INK; ctx.lineWidth = 14; ctx.beginPath(); ctx.arc(0, 0, R, 0, 7); ctx.fill(); ctx.stroke();
  ctx.fillStyle = INK; for (let i = 0; i < 12; i++) { const an = i / 12 * Math.PI * 2; ctx.save(); ctx.rotate(an); ctx.fillRect(-5, -R + 16, 10, i % 3 ? 18 : 32); ctx.restore(); }
  const hA = (hour % 12) / 12 * Math.PI * 2, mA = (hour % 1) * Math.PI * 2; ctx.lineCap = 'round';
  ctx.strokeStyle = INK; ctx.lineWidth = 16; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.sin(hA) * R * 0.5, -Math.cos(hA) * R * 0.5); ctx.stroke();
  ctx.strokeStyle = '#B5372E'; ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.sin(mA) * R * 0.78, -Math.cos(mA) * R * 0.78); ctx.stroke();
  ctx.fillStyle = INK; ctx.beginPath(); ctx.arc(0, 0, 14, 0, 7); ctx.fill();
  if (label) { ctx.font = '900 64px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineWidth = 10; ctx.strokeStyle = INK; ctx.strokeText(label, 0, R + 70); ctx.fillStyle = '#F2C230'; ctx.fillText(label, 0, R + 70); }
  ctx.restore();
}
function distMap(k, y = 440) {
  if (k <= 0) return; const a = eo(clamp(k * 2)); ctx.save(); ctx.translate(540, y); ctx.scale(a, a);
  ctx.fillStyle = '#F4EFE4'; ctx.strokeStyle = INK; ctx.lineWidth = 8; ctx.beginPath(); ctx.roundRect(-400, -220, 800, 420, 26); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#E3EBF5'; ctx.fillRect(-376, -196, 752, 372);
  for (let i = 0; i < 12; i++) { const x = -330 + (Math.sin(i * 7.1) * 0.5 + 0.5) * 660, yy = -160 + (Math.sin(i * 3.3) * 0.5 + 0.5) * 300; ctx.fillStyle = '#4A7A5A'; ctx.beginPath(); ctx.moveTo(x, yy - 22); ctx.lineTo(x + 16, yy + 10); ctx.lineTo(x - 16, yy + 10); ctx.closePath(); ctx.fill(); }
  const A = [-260, 90], B = [270, -90], d = clamp((k - 0.15) / 0.7);
  ctx.strokeStyle = '#8A8A96'; ctx.lineWidth = 26; ctx.beginPath(); ctx.moveTo(A[0], A[1]); ctx.bezierCurveTo(-60, 120, 60, -130, B[0], B[1]); ctx.stroke();
  ctx.strokeStyle = '#D8343F'; ctx.lineWidth = 10; ctx.setLineDash([24, 16]); ctx.beginPath(); ctx.moveTo(A[0], A[1]); const steps = 30; for (let i = 1; i <= steps * d; i++) { const u = i / steps, x = (1 - u) ** 3 * A[0] + 3 * (1 - u) ** 2 * u * -60 + 3 * (1 - u) * u * u * 60 + u ** 3 * B[0], yy = (1 - u) ** 3 * A[1] + 3 * (1 - u) ** 2 * u * 120 + 3 * (1 - u) * u * u * -130 + u ** 3 * B[1]; ctx.lineTo(x, yy); } ctx.stroke(); ctx.setLineDash([]);
  ctx.fillStyle = '#C9A27A'; ctx.strokeStyle = INK; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(A[0] - 34, A[1] + 26); ctx.lineTo(A[0] - 34, A[1] - 10); ctx.lineTo(A[0], A[1] - 40); ctx.lineTo(A[0] + 34, A[1] - 10); ctx.lineTo(A[0] + 34, A[1] + 26); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#A8483A'; ctx.fillRect(B[0] - 36, B[1] - 30, 72, 56); ctx.strokeRect(B[0] - 36, B[1] - 30, 72, 56);
  ctx.fillStyle = INK; ctx.font = '900 32px Inter'; ctx.textAlign = 'center'; ctx.fillText('HOME', A[0], A[1] + 64); ctx.fillText('FIRE STATION', B[0], B[1] - 46);
  if (d > 0.5) { ctx.font = '900 76px Inter'; ctx.fillStyle = '#D8343F'; ctx.lineWidth = 8; ctx.strokeStyle = '#FFFDF4'; ctx.strokeText('2.5 MILES', 0, 150); ctx.fillText('2.5 MILES', 0, 150); }
  ctx.restore();
}
function bigQ(k, y = 470) { const q = eob(clamp(k)); if (q <= 0) return; ctx.save(); ctx.translate(540, y); ctx.scale(q, q); ctx.font = '900 300px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineWidth = 16; ctx.strokeStyle = INK; ctx.strokeText('?', 0, 0); ctx.fillStyle = '#F2C230'; ctx.fillText('?', 0, 0); ctx.restore(); }
function zzz(t, x, y) { ctx.save(); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; for (let i = 0; i < 3; i++) { const k = ((t * 0.7 + i / 3) % 1); ctx.globalAlpha = Math.sin(k * Math.PI); ctx.fillStyle = '#FFFFFF'; ctx.strokeStyle = INK; ctx.lineWidth = 8; ctx.font = `900 ${46 + i * 12}px Inter`; ctx.strokeText('Z', x + k * 80 + i * 30, y - k * 160 - i * 40); ctx.fillText('Z', x + k * 80 + i * 30, y - k * 160 - i * 40); } ctx.restore(); }
const fade = (a, col = '#000') => { if (a <= 0) return; ctx.save(); ctx.globalAlpha = clamp(a); ctx.fillStyle = col; ctx.fillRect(0, 0, 1080, 1920); ctx.restore(); };

export function buildShots(E) {
  const S = [], CUES = [], add = (o) => (S.push(o), o), cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut = (i) => (i === 0 ? 0 : L(i) - 0.06);
  const cam = camera(36);
  const LK = { out: { bloom: 0.12, bloomThreshold: 1.08, aperture: 0.00015, maxblur: 0.003 }, room: { bloom: 0.1, bloomThreshold: 1.08, aperture: 0.0002, maxblur: 0.003 } };
  let T_now = 0; const winters = [];
  const shoot = (scene, people, from, to, at, at2, k, look, focus) => {
    if (cam.fov !== (look.fov || 36)) { cam.fov = look.fov || 36; cam.updateProjectionMatrix(); }
    cam.position.copy(mix(from, to, k)); cam.lookAt(at2 ? mix(at, at2, k) : at);
    people.forEach((p) => p.face(cam)); winters.forEach((w) => { if (w.scene === scene) w.snow.update(T_now, cam); });
    E.render(scene, cam, { ...look, focus: focus ?? cam.position.distanceTo(at2 ? mix(at, at2, k) : at) });
  };
  const wrap = (o) => { const d0 = o.draw; o.draw = (lt, d, t, blit) => { T_now = t; d0(lt, d, t, blit); }; return add(o); };

  // ═════ NIGHT: the house in the snow ═════
  const NI = W.winterScene(E); winters.push(NI);
  const house = W.house2(); NI.scene.add(house);
  const HZ = house.D / 2;                                     // front wall z
  const trucks = [W.coalTruck('#7A2E2E'), W.coalTruck('#2E4E7A')]; trucks.forEach((tr, i) => { tr.position.set(-11 - i * 0.4, 0, 2 + i * 3.4); tr.rotation.y = 0.3; NI.scene.add(tr); });
  const ghost = W.ladder(5.4, true); ghost.position.set(4.2, 0, -1.2); ghost.rotation.set(0.0, -Math.PI / 2, -0.18); NI.scene.add(ghost);
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.15, 7, 8), WD.mat({ color: '#6B4A2A' })); pole.position.set(7, 3.5, 6); NI.scene.add(pole);
  const fam = { dad: person('dad'), mom: person('mom'), tg: person('teenG', { height: 1.6 }), tb: person('teenB', { height: 1.65 }), boy: person('boy', { height: 1.3 }), girl: person('girl', { height: 1.2 }) };
  Object.values(fam).forEach((p) => { p.tint(NT); NI.scene.add(p.group); });
  const famAll = () => Object.values(fam);
  const famOnly = (...keep) => famAll().forEach((p) => (p.group.visible = keep.includes(p)));
  const station = W.fireStation(); station.position.set(70, 0, -40); station.rotation.y = -0.5; NI.scene.add(station);
  const fTruck = WD.car('#B5372E'); fTruck.scale.set(1.2, 1.3, 1.7); fTruck.position.set(68.5, 0, -36.5); fTruck.rotation.y = -0.5 + Math.PI / 2; NI.scene.add(fTruck);
  const getaway = WD.car('#2A2E3A'); NI.scene.add(getaway);
  { const tl = [-0.55, 0.55].map((z) => { const m = new THREE.Mesh(new THREE.SphereGeometry(0.13, 8, 6), new THREE.MeshBasicMaterial({ color: new THREE.Color(1.0, 0.15, 0.15), toneMapped: false })); getaway.add(m); return m; });
    getaway.userData.tail = tl; }
  const road = new THREE.Mesh(new THREE.PlaneGeometry(6, 300), WD.mat({ color: '#5A5E6A' })); road.rotation.x = -Math.PI / 2; road.position.set(-30, 0.02, -60); NI.scene.add(road);
  const setFire = (k, t) => { house.setFire(k, t); house.setLit(k <= 0 ? litState : false); };
  let litState = true;

  // ═════ DAWN: ash, the official, the dig ═════
  const DA = W.winterScene(E, { dawn: true }); winters.push(DA);
  const ruin = W.rubble(); DA.scene.add(ruin);
  const dFam = { dad: person('dad'), mom: person('mom'), chief: person('chief') }; Object.values(dFam).forEach((p) => DA.scene.add(p.group));
  const lot = new THREE.Group(); DA.scene.add(lot); lot.position.set(0, 0, -60);
  { for (let x = -6; x <= 6; x += 1.5) { const p = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.1, 0.12), WD.mat({ color: '#8A6A4A' })); p.position.set(x, 0.55, 4); lot.add(p); } const rail = new THREE.Mesh(new THREE.BoxGeometry(12.2, 0.1, 0.1), WD.mat({ color: '#8A6A4A' })); rail.position.set(0, 0.9, 4); lot.add(rail); const pn = W.pine(6, 3); pn.position.set(1, 0, 0); lot.add(pn); }
  // billboard by a highway (dawn scene, far side)
  const bbRoad = new THREE.Mesh(new THREE.PlaneGeometry(7, 300), WD.mat({ color: '#5A5E6A' })); bbRoad.rotation.x = -Math.PI / 2; bbRoad.position.set(60, 0.02, 0); DA.scene.add(bbRoad);
  const bb = W.billboard(['WHAT HAPPENED TO', 'OUR 5 CHILDREN?']); bb.position.set(52, 0, -8); bb.rotation.y = 0.5; DA.scene.add(bb);
  const passCar = WD.car('#3C6FB6'); passCar.visible = false; DA.scene.add(passCar);
  DA.scene.children.slice().forEach((o) => { if (o.isGroup && o !== bb && o !== lot && o !== passCar && o.position.y === 0 && (Math.hypot(o.position.x - 52, o.position.z + 8) < 24 || Math.hypot(o.position.x, o.position.z + 50) < 16)) DA.scene.remove(o); });
  const bbDad = person('dad'), bbMom = person('mom'); [bbDad, bbMom].forEach((p) => { p.group.visible = false; DA.scene.add(p.group); });

  // ═════ ROOMS ═════
  const LV = WD.interior(E, { w: 7, depth: 5, h: 3.2, wall: '#7A3E3A', motif: '#8A4A44', floor: '#7A5A44', ceiling: '#3A2A24', signText: null, picture: true, counterOn: false, litter: false });
  LV.scene.background = new THREE.Color('#0A1030'); LV.window.material.color.set('#2A3A6A');
  const xtree = new THREE.Group(); LV.scene.add(xtree); xtree.position.set(2.2, 0, -3.6);
  { const tr = W.pine(2.6, 9); xtree.add(tr); const cols = ['#FF4A4A', '#4AFF7A', '#4A9AFF', '#FFD24A']; for (let i = 0; i < 18; i++) { const a = i * 2.4, y = 0.6 + (i / 18) * 1.6, r = (1 - (y - 0.4) / 2.2) * 0.75; const b = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 6), new THREE.MeshBasicMaterial({ color: new THREE.Color(cols[i % 4]).multiplyScalar(1.0), toneMapped: false })); b.position.set(Math.cos(a) * r, y, Math.sin(a) * r); xtree.add(b); }
    const star = new THREE.Mesh(new THREE.OctahedronGeometry(0.16), new THREE.MeshBasicMaterial({ color: new THREE.Color(1.0, 0.85, 0.3), toneMapped: false })); star.position.y = 2.65; xtree.add(star);
    [[0.5, 0.15, 0.6, '#D8343F'], [-0.5, 0.15, 0.5, '#3C6FB6'], [0.1, 0.12, 0.8, '#F2C230']].forEach(([x, h, z, c]) => { const g = PR.parcel(0.45, h * 2, 0.4, true); g.position.set(x, 0, z); xtree.add(g); }); }
  const lamp = new THREE.PointLight('#FFC27A', 6, 8, 1.6); lamp.position.set(-1.5, 2.2, -2.5); LV.scene.add(lamp);
  const lDad = person('dad'), lMom = person('mom'); [lDad, lMom].forEach((p) => LV.scene.add(p.group));
  const phone = W.wallPhone(); phone.position.set(-3.45, 1.7, -2.2); phone.rotation.y = Math.PI / 2; LV.scene.add(phone);
  const letters = []; { const tbl = PR.desk(1.8); tbl.position.set(-1.2, 0, -2.6); LV.scene.add(tbl); for (let i = 0; i < 7; i++) { const p = new THREE.Mesh(new THREE.PlaneGeometry(0.3, 0.22), WD.mat({ color: '#FFFDF4' })); p.rotation.set(-Math.PI / 2, 0, (i - 3) * 0.3); p.position.set(-1.2 + (i - 3) * 0.2, 0.86, -2.6 + Math.sin(i) * 0.12); LV.scene.add(p); letters.push(p); }
    const map = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 1.1), WD.mat({ map: WD.canvasTex('usmap', 512, 352, (c) => { c.fillStyle = '#F4E3C0'; c.fillRect(0, 0, 512, 352); c.fillStyle = '#C9B48A'; c.beginPath(); c.moveTo(40, 80); c.lineTo(470, 60); c.lineTo(480, 200); c.lineTo(400, 300); c.lineTo(300, 270); c.lineTo(200, 300); c.lineTo(60, 260); c.closePath(); c.fill(); c.fillStyle = '#D8343F'; for (let i = 0; i < 14; i++) { c.beginPath(); c.arc(80 + (Math.sin(i * 5.1) * 0.5 + 0.5) * 360, 100 + (Math.sin(i * 3.7) * 0.5 + 0.5) * 160, 9, 0, 7); c.fill(); } c.strokeStyle = '#1F1C33'; c.lineWidth = 10; c.strokeRect(5, 5, 502, 342); }) }));
    map.position.set(-1.2, 1.9, -4.9); LV.scene.add(map); }
  const BR = WD.interior(E, { w: 7, depth: 5, h: 2.8, wall: '#4A5A7A', motif: '#566890', floor: '#7A5A44', ceiling: '#2A2E44', signText: null, picture: false, counterOn: false, litter: false });
  BR.scene.background = new THREE.Color('#0A1030'); BR.window.material.color.set('#1A2650');
  const kidBeds = [-2.6, -1.3, 0, 1.3, 2.6].map((x, i) => { const b = W.bed(['#B5372E', '#3C6FB6', '#4FB36A', '#F2C230', '#B98ACF'][i]); b.position.set(x, 0, -3.4); BR.scene.add(b); return b; });
  const sleepers = kidBeds.map((b, i) => { const p = new Toon({ body: '#F4EFE4', hat: ['none', 'bow', 'none', 'bow', 'bow'][i], hatCol: ['#000', '#D8343F', '#000', '#F2C230', '#3C6FB6'][i], kid: true }, { height: 1.25 }); p.at(b.position.x, -0.05, -4.18); BR.scene.add(p.group); return p; });
  const nightL = new THREE.PointLight('#8AA4FF', 4, 8, 1.6); nightL.position.set(0, 2.3, -1.5); BR.scene.add(nightL);

  // ═════════════ SHOTS ═════════════
  // 1 · "On Christmas Eve, 1945," crane down through falling snow to the lit house
  { const st = cut(0), wy = Wd('1945', 0);
    wrap({ id: 'S01', at: st, note: 'starry snowy night: crane down past pines to the two-storey house glowing with Christmas lights; ribbon DEC 24, 1945', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); famOnly(); litState = true; setFire(0, t); ghost.visible = false; getaway.visible = false;
      shoot(NI.scene, [], V3(10, 16, 34), V3(6, 4.5, 20), V3(0, 6, -20), V3(0, 3.6, 0), k, { ...LK.out, fov: 44 }, 20);
      blit(); ribbon('DEC 24, 1945', (t - wy + 0.1) / 0.3);
    } });
    cue(0.05, 'whoosh', { gain: 0.3 }); cue(Wd('1945', 0), 'stamp', { gain: 0.6 }); }
  // 1b · "in a small West Virginia town," wide valley; house small among the pines
  { const st = Wd('small', 0) - 0.35;
    wrap({ id: 'S01b', at: st, note: 'high wide shot: the lone lit house in a snowy valley of pines; pill FAYETTEVILLE, WEST VIRGINIA', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); famOnly(); setFire(0, t);
      shoot(NI.scene, [], V3(-40, 24, 50), V3(-34, 20, 44), V3(0, 2, 0), null, k, { ...LK.out, fov: 40 }, 60);
      blit(); pill('FAYETTEVILLE, WEST VIRGINIA', (t - Wd('west', 0) + 0.1) / 0.3, 250, 'rgba(31,28,51,0.88)', 44);
    } });
    cue(st, 'slide', { dur: 1.4, gain: 0.3 }); }

  // 2 · "the Sodder family went to bed," living room: parents by the tree; dad turns down the lamp
  { const st = cut(1), wb = Wd('bed', 1);
    wrap({ id: 'S02', at: st, note: 'living room by the Christmas tree: mom and dad yawn; dad reaches for the lamp and the room dims on "bed"', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); const dim = eo(clamp((t - wb) / 0.4)); lamp.intensity = lerp(6, 2, dim);
      lDad.at(-0.8, 0, -1.8); lMom.at(0.6, 0, -2.0);
      lDad.set({ mood: 'tired', armR: [100, -20], armL: [20, 10], look: [-0.6, 0], blink: blink(t) }); lMom.set({ mood: 'happy', ...G('explain', t), talk: talk(t, t < wb), blink: blink(t, 1) });
      shoot(LV.scene, [lDad, lMom], V3(0.2, 1.7, 2.8), V3(0.1, 1.65, 2.0), V3(0.4, 1.3, -2.4), null, k, { ...LK.room, fov: 54 });
      blit();
    } });
    cue(Wd('bed', 1), 'tock', { gain: 0.4 }); }

  // 3 · "with nine of their ten children at home." the kids asleep upstairs; counter 9 of 10
  { const st = cut(2), wn = Wd('nine', 2);
    wrap({ id: 'S03', at: st, note: 'upstairs bedroom, moonlit: kids asleep in a row of beds, Zzz; counter 9 OF 10 KIDS HOME', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); sleepers.forEach((p, i) => p.set({ mood: 'happy', blink: 1, armL: [8, 6], armR: [8, 6] }));
      shoot(BR.scene, sleepers, V3(-2.2, 2.0, 0.8), V3(1.6, 2.0, 0.6), V3(-1.4, 0.6, -3.8), V3(1.4, 0.6, -3.8), k, { ...LK.room, fov: 48 });
      blit(); zzz(t, 700, 760); counter(t > wn ? '9 OF 10' : '', (t - wn + 0.1) / 0.3, 'CHILDREN AT HOME', 300, 560);
    } });
    cue(st, 'slide', { dur: 1.0, gain: 0.25 }); }

  // 4 · "But around one in the morning," dark house, the clock reads 1:00
  { const st = cut(3);
    wrap({ id: 'S04', at: st, note: 'the house now dark and silent under snow; a clock swings in at 1:00 AM', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); famOnly(); litState = false; setFire(0, t);
      shoot(NI.scene, [], V3(-4, 3, 22), V3(-3, 3.2, 18), V3(0, 4, 0), null, k, { ...LK.out, fov: 44 }, 20);
      blit(); clock(lerp(0.9, 1.0, eo(clamp(lt / d))), (t - st) / 0.3, '1:00 AM', 430);
    } });
    cue(st + 0.1, 'tock', { gain: 0.6 }); cue(st + 0.7, 'tock', { gain: 0.6 }); }

  // 5 · "their house caught fire." flames burst from the windows and roof
  { const st = cut(4), wf = Wd('fire', 4);
    wrap({ id: 'S05', at: st, note: 'on "fire" flames burst out of the windows and climb the roof; orange glow on the snow', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); famOnly(); const f = eo(clamp((t - wf + 0.25) / 0.8)); setFire(f, t);
      shoot(NI.scene, [], V3(3, 2.6, 19), V3(1, 3.0, 16), V3(0, 4, 0), null, k, { ...LK.out, fov: 46 }, 18);
      blit();
    } });
    cue(Wd('fire', 4) - 0.2, 'sizzle', { dur: 2.0, gain: 0.7 }); cue(Wd('fire', 4), 'whoosh', { gain: 0.7 }); }

  // 6 · "The parents and four of the kids got out," they run out into the snow
  { const st = cut(5), wf = Wd('four', 5);
    wrap({ id: 'S06', at: st, note: 'parents and four kids rush off the porch into the snow, lit orange by the fire; pill 4 GOT OUT', draw(lt, d, t, blit) {
      const k = clamp(lt / d); setFire(1, t); famOnly(...famAll());
      const run = (p, x0, x1, z0, z1, ph) => { const a = eo(clamp((lt - ph) / (d * 0.8))); p.at(lerp(x0, x1, a), 0, lerp(z0, z1, a)); return a; };
      const r = [run(fam.dad, -1.2, -3.6, HZ + 1.6, HZ + 7.5, 0), run(fam.mom, 0.4, -1.4, HZ + 1.4, HZ + 8.2, 0.1), run(fam.tg, 1.4, 1.2, HZ + 1.6, HZ + 8.8, 0.2), run(fam.tb, -0.4, 3.0, HZ + 1.5, HZ + 7.8, 0.15), run(fam.boy, 0.8, -0.2, HZ + 1.8, HZ + 9.2, 0.25), run(fam.girl, -2.2, 0.8, HZ + 1.8, HZ + 9.6, 0.3)];
      famAll().forEach((p, i) => p.set({ mood: i < 2 ? 'shock' : 'worried', legs: r[i] < 1 ? 'run' : 'stand', phase: t * 10 + i, ...G(i < 2 ? 'pointL' : 'head', t, i), look: [0, 0] }));
      shoot(NI.scene, famAll(), V3(2, 2.4, HZ + 16), V3(1.4, 2.2, HZ + 14), V3(0, 2.4, HZ + 4), null, eio(k), { ...LK.out, fov: 50 }, 10);
      blit(); pill('PARENTS + 4 KIDS GOT OUT', (t - wf + 0.1) / 0.3, 250, 'rgba(20,90,50,0.9)', 44);
    } });
    cue(st, 'sizzle', { dur: 2.2, gain: 0.5 }); }

  // 7 · "but five of them never came out." the upstairs windows blaze; mom's hands to her head
  { const st = cut(6), wf = Wd('five', 6);
    wrap({ id: 'S07', at: st, note: 'low: mom in the foreground, hands to her head, tears; the burning upstairs windows behind; pill 5 STILL INSIDE', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); setFire(1, t); famOnly(fam.mom); fam.mom.at(-1.2, 0, HZ + 6);
      fam.mom.set({ mood: 'sad', ...G('head', t), tears: 1, look: [0, -0.4] });
      shoot(NI.scene, [fam.mom], V3(-0.6, 1.2, HZ + 10), V3(-0.8, 1.15, HZ + 9.0), V3(-0.4, 3.4, 0), V3(-0.4, 3.8, 0), k, { ...LK.out, fov: 50 }, 4);
      blit(); pill('5 CHILDREN STILL UPSTAIRS', (t - wf + 0.1) / 0.3, 250, 'rgba(140,25,35,0.92)', 44);
    } });
    cue(Wd('five', 6), 'heartbeat', { gain: 0.8 }); }

  // 8 · "And that night, everything went wrong." dad alone before the fire, camera pushes in
  { const st = cut(7), ww = Wd('wrong', 7);
    wrap({ id: 'S08', at: st, note: 'dad stands alone before the blaze, then grabs his head on "wrong"; slow push in', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); setFire(1, t); famOnly(fam.dad); fam.dad.at(0.6, 0, HZ + 6.5);
      fam.dad.set({ mood: t > ww ? 'shock' : 'worried', ...(t > ww - 0.1 ? G('head', t) : G('explain', t)), sweat: 1 });
      shoot(NI.scene, [fam.dad], V3(1.0, 1.6, HZ + 14), V3(0.8, 1.6, HZ + 10.5), V3(0.6, 1.6, HZ + 6.5), V3(0.4, 2.4, 0), k, { ...LK.out, fov: 48 }, 5);
      blit();
    } });
    cue(Wd('wrong', 7), 'slam', { gain: 0.5 }); }

  // 9 · "The phone line was dead," a crank wall phone: cranking, nothing; pill PHONE: DEAD
  { const st = cut(8), wd = Wd('dead', 8);
    wrap({ id: 'S09', at: st, note: 'close on an old crank wall phone: a hand cranks and cranks; nothing; pill PHONE LINE: DEAD (later found cut)', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); lamp.intensity = 4; phone.crank(t * 9); lDad.at(-2.6, 0, -1.4); lMom.group.visible = false;
      lDad.set({ mood: t > wd ? 'shock' : 'worried', armL: [80 + Math.sin(t * 9) * 25, -40], armR: [120, -150], look: [-0.8, 0], sweat: 1 });
      shoot(LV.scene, [lDad], V3(-0.4, 1.8, 0.6), V3(-0.8, 1.75, 0.0), V3(-3.0, 1.55, -1.9), null, k, { ...LK.room, fov: 50 }, 3.2);
      blit(); pill('PHONE LINE: DEAD', (t - wd + 0.1) / 0.3, 250, 'rgba(140,25,35,0.92)'); lMom.group.visible = true;
    } });
    for (let i = 0; i < 4; i++) cue(cut(8) + 0.15 + i * 0.28, 'tock', { gain: 0.4 }); }

  // 10 · "the ladder was missing," dad points at the empty wall where the ladder always stood
  { const st = cut(9), wm = Wd('missing', 9);
    wrap({ id: 'S10', at: st, note: 'side of the burning house: a dotted ghost outline where the ladder always leaned; dad points at it, stunned', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); setFire(1, t); ghost.visible = false; famOnly(fam.dad); fam.dad.at(6.4, 0, 1.6);
      fam.dad.set({ mood: 'shock', ...G('pointL', t), look: [-0.8, 0] });
      shoot(NI.scene, [fam.dad], V3(11, 2.4, 7), V3(10.4, 2.4, 6.2), V3(4.6, 2.6, -0.6), null, k, { ...LK.out, fov: 48 }, 8);
      blit(); pill('LADDER: GONE', (t - wm + 0.1) / 0.3, 250, 'rgba(140,25,35,0.92)'); ghost.visible = false;
    } });
    cue(Wd('missing', 9), 'pop', { gain: 0.5 }); }

  // 11 · "and the trucks wouldn't start." the coal trucks cough once and die
  { const st = cut(10), ws = Wd('start', 10);
    wrap({ id: 'S11', at: st, note: 'two coal trucks in the snow: a puff of exhaust, then nothing; dad throws up his hands', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); setFire(1, t); famOnly(fam.dad); fam.dad.at(-7.2, 0, 7.6);
      trucks[0].sputter(t, t < ws - 0.1 ? 1 : 0); trucks[1].sputter(t, 0);
      fam.dad.set({ mood: t > ws ? 'angry' : 'worried', ...(t > ws ? G('shrug', t) : G('pull', t)), sweat: 1 });
      shoot(NI.scene, [fam.dad], V3(-2.6, 2.2, 15), V3(-3.4, 2.1, 14), V3(-9, 1.4, 4.6), null, k, { ...LK.out, fov: 52 }, 9);
      blit(); pill("TRUCKS: WON'T START", (t - ws + 0.1) / 0.3, 250, 'rgba(140,25,35,0.92)', 46);
    } });
    cue(cut(10) + 0.1, 'chug', { dur: 0.6, gain: 0.5 }); cue(Wd('start', 10), 'thud', { gain: 0.6 }); }

  // 12 · "The fire station was just two and a half miles away," map: home ↔ station, 2.5 MILES
  { const st = cut(11);
    wrap({ id: 'S12', at: st, note: 'the dark fire station in the snow; a map card draws the road HOME → FIRE STATION: 2.5 MILES', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); famOnly(); station.lamp.intensity = 0;
      shoot(NI.scene, [], V3(62, 3, -24), V3(64, 3.4, -26), V3(70, 2.4, -40), null, k, { ...LK.out, fov: 46 }, 18);
      blit(); distMap((t - st) / (Le(11) - st) * 1.1, 460);
    } });
    cue(st, 'slide', { dur: 1.8, gain: 0.4 }); cue(Wd('miles', 11), 'stamp', { gain: 0.6 }); }

  // 13 · "but help didn't come until seven in the morning." the clock spins from 1 to 7
  { const st = cut(12), ws = Wd('seven', 12);
    wrap({ id: 'S13', at: st, note: 'the fire station stays dark while a clock spins from 1:00 to 7:00 AM; lights finally come on', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); famOnly(); station.lamp.intensity = t > ws ? 8 : 0;
      shoot(NI.scene, [], V3(64, 3.4, -26), V3(65, 3.0, -29), V3(70, 2.4, -40), null, k, { ...LK.out, fov: 46 }, 14);
      blit(); const h = lerp(1, 7, eio(clamp((t - st) / (ws - st + 0.2)))); clock(h, (t - st) / 0.25, t > ws ? '7:00 AM' : '', 420);
    } });
    for (let i = 0; i < 6; i++) cue(cut(12) + 0.2 + i * (Wd('seven', 12) - cut(12)) / 6, 'tock', { gain: 0.45 }); cue(Wd('seven', 12), 'ding', { gain: 0.5 }); }

  // 14 · "By then, the house was ash." pale dawn: only a smoking heap and a chimney
  { const st = cut(13), wa = Wd('ash', 13);
    wrap({ id: 'S14', at: st, note: 'pale pink dawn: only a black smoking heap and the lone brick chimney; the parents stand in the snow', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); ruin.update(t); passCar.visible = false; bbDad.group.visible = bbMom.group.visible = false; dFam.chief.group.visible = false; dFam.dad.at(-2.4, 0, 6); dFam.mom.at(-1.4, 0, 6.3);
      dFam.dad.set({ mood: 'sad', armL: [20, 10], armR: [40, -30] }); dFam.mom.set({ mood: 'sad', tears: 1, armL: [60, -80], armR: [20, 10] });
      shoot(DA.scene, [dFam.dad, dFam.mom], V3(4, 4, 16), V3(2, 2.6, 13), V3(0, 1, 0), null, k, { ...LK.out, fov: 46 }, 12);
      blit();
    } });
    cue(st, 'whoosh', { gain: 0.3 }); }

  // 15 · "Officials said the five children died in the fire," the chief with his clipboard
  { const st = cut(14), wd = Wd('died', 14);
    wrap({ id: 'S15', at: st, note: 'the fire chief with a clipboard explains; the parents shake their heads; card OFFICIAL RULING: DIED IN THE FIRE', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); ruin.update(t); dFam.chief.group.visible = true; dFam.chief.at(0.9, 0, 5.6); dFam.dad.at(-1.6, 0, 6.2); dFam.mom.at(-0.6, 0, 6.6);
      dFam.chief.set({ mood: 'neutral', armL: [70, -60], holdL: P2.clipboard, ...{ armR: G('explain', t).armR }, talk: talk(t), v: 'c', look: [-0.6, 0] });
      dFam.dad.set({ mood: 'angry', ...G('stop', t), look: [0.7, 0] }); dFam.mom.set({ mood: 'sad', tears: 1, look: [0.6, 0], armL: [20, 10], armR: [20, 10] });
      shoot(DA.scene, [dFam.chief, dFam.dad, dFam.mom], V3(-0.2, 1.6, 11.4), V3(-0.2, 1.6, 10.4), V3(-0.2, 1.3, 5.8), null, k, { ...LK.out, fov: 50 }, 5);
      blit(); pill('OFFICIAL RULING: DIED IN THE FIRE', (t - wd + 0.1) / 0.3, 250, 'rgba(31,28,51,0.9)', 40);
    } });
    cue(Wd('died', 14), 'stamp', { gain: 0.5 }); }

  // 16 · "but no remains were ever found." dad digs through the ashes; NO REMAINS FOUND
  { const st = cut(15), wf = Wd('found', 15);
    wrap({ id: 'S16', at: st, note: 'dad digs through the ashes with a shovel, searching; card NO REMAINS FOUND', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); ruin.update(t); dFam.chief.group.visible = false; dFam.mom.group.visible = false; dFam.dad.at(-1.4, 0, 3.8);
      dFam.dad.set({ mood: t > wf ? 'sad' : 'worried', ...(t > wf ? G('shrug', t) : G('dig', t)), holdR: t > wf ? null : P2.shovel, v: 's' + (t > wf), sweat: 1 });
      shoot(DA.scene, [dFam.dad], V3(1.4, 1.6, 8.4), V3(0.8, 1.5, 7.6), V3(-1.2, 1.0, 3.2), null, k, { ...LK.out, fov: 48 }, 5);
      blit(); pill('NO REMAINS FOUND', (t - wf + 0.1) / 0.3, 250, 'rgba(140,25,35,0.92)'); dFam.mom.group.visible = true;
    } });
    cue(cut(15) + 0.2, 'thud', { gain: 0.4 }); cue(cut(15) + 0.6, 'thud', { gain: 0.4 }); }

  // 17 · "So their parents never stopped searching." kitchen table of letters, a map full of pins
  { const st = cut(16), ws = Wd('searching', 16);
    wrap({ id: 'S17', at: st, note: 'night, a table piled with letters and a map stuck with red pins; mom reads a letter, dad points at the map', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); lamp.intensity = 6; lDad.at(-2.0, 0, -3.6); lMom.at(-0.2, 0, -1.8);
      lDad.set({ mood: 'worried', ...G('pointR', t), look: [0.6, -0.2], blink: blink(t) }); lMom.set({ mood: 'sad', armL: [80, -70], holdL: P2.letter, armR: [40, -40], v: 'l', look: [0, 0.6] });
      shoot(LV.scene, [lDad, lMom], V3(-0.2, 2.2, 1.4), V3(-0.6, 2.0, 0.6), V3(-1.2, 1.4, -3.4), null, k, { ...LK.room, fov: 50 });
      blit(); pill('THEY NEVER STOPPED', (t - ws + 0.1) / 0.3, 250);
    } });
    cue(st, 'slide', { dur: 1.2, gain: 0.3 }); }

  // 18 · "They put up a billboard by the highway," dawn highway: the billboard of five silhouettes, a car drives past
  { const st = cut(17), wb = Wd('billboard', 17);
    wrap({ id: 'S18', at: st, note: 'a snowy highway: the big billboard with five faceless child silhouettes; a car drives past; the parents stand under it', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); bbDad.group.visible = bbMom.group.visible = true; passCar.visible = true; passCar.position.set(61.5, 0, 30 - (t - st) * 14); passCar.rotation.y = Math.PI;
      bbDad.at(49.6, 0, -5.6); bbMom.at(50.8, 0, -5.0); bbDad.set({ mood: 'proud', ...G('pointUp', t), look: [0, -0.6] }); bbMom.set({ mood: 'sad', armL: [20, 10], armR: [20, 10], look: [0, -0.6] });
      shoot(DA.scene, [bbDad, bbMom], V3(62, 3.4, 16), V3(60, 4.2, 12), V3(52, 4, -8), null, k, { ...LK.out, fov: 46 }, 20);
      blit(); pill('ROUTE 16, WEST VIRGINIA', (t - wb + 0.1) / 0.3, 250, 'rgba(31,28,51,0.88)', 44);
    } });
    cue(st + 0.2, 'whoosh', { gain: 0.6 }); }

  // 19 · "and it stood there for almost forty years." orbit the billboard; counter to ~40
  { const st = cut(18), wf = Wd('forty', 18);
    wrap({ id: 'S19', at: st, note: 'slow orbit around the billboard as snow falls; counter climbs to ~40 YEARS', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); passCar.visible = false; bbDad.group.visible = bbMom.group.visible = false;
      const a = lerp(-0.2, 0.5, k); shoot(DA.scene, [], V3(52 + Math.sin(a) * 18, 5, -8 + Math.cos(a) * 18), V3(52 + Math.sin(a) * 18, 5, -8 + Math.cos(a) * 18), V3(52, 4.2, -8), null, 0, { ...LK.out, fov: 44 }, 18);
      blit(); counter(Math.round(lerp(0, 40, eo(clamp((t - st) / (wf - st + 0.3))))), (t - st) / 0.3, 'YEARS ON THE HIGHWAY');
    } });
    for (let i = 0; i < 6; i++) cue(cut(18) + 0.1 + i * 0.3, 'tock', { gain: 0.35 }); }

  // 20 · "Now, more than eighty years later," the empty lot today; counter 1945 → 2026
  { const st = cut(19);
    wrap({ id: 'S20', at: st, note: 'an empty snowy lot with a little fence and one pine where the house stood; counter 1945 → 2026', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); [dFam.dad, dFam.mom, dFam.chief].forEach((p) => (p.group.visible = false));
      shoot(DA.scene, [], V3(-3, 3, -42), V3(-1, 2.6, -46), V3(0, 2, -60), null, k, { ...LK.out, fov: 46 }, 16);
      blit(); counter(Math.round(lerp(1945, 2026, eio(clamp((t - st) / (d * 0.85))))), (t - st) / 0.3, 'STILL NO ANSWERS');
      [dFam.dad, dFam.mom].forEach((p) => (p.group.visible = true));
    } });
    for (let i = 0; i < 6; i++) cue(cut(19) + 0.1 + i * 0.25, 'tock', { gain: 0.35 }); }

  // 21a · "nobody knows what really happened" the night house as it was; upstairs windows go dark one by one
  { const st = cut(20);
    wrap({ id: 'S21', at: st, note: 'the house as it was, lit, in the snow; camera rises to the upstairs windows, which go dark one by one', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); famOnly(); house.setFire(0, t); house.setLit(true);
      house.winsUp.forEach((w, i) => { const off = lt > 0.6 + i * 0.45; w.material.map = WD.canvasTex('winU' + off, 128, 160, (c) => { c.fillStyle = '#F4EFE4'; c.fillRect(0, 0, 128, 160); c.fillStyle = off ? '#22304A' : '#FFD27A'; c.fillRect(14, 14, 100, 132); c.fillStyle = '#F4EFE4'; c.fillRect(60, 14, 8, 132); c.fillRect(14, 76, 100, 8); }); });
      shoot(NI.scene, [], V3(0, 2.4, 14), V3(0, 4.6, 11), V3(0, 3.0, 0), V3(0, 4.4, 0), k, { ...LK.out, fov: 46 }, 11);
      blit();
    } });
    for (let i = 0; i < 3; i++) cue(cut(20) + 0.6 + i * 0.45, 'tock', { gain: 0.4 }); }
  // 21b · "to the Sodder children." the billboard silhouettes close; a question mark
  { const st = Wd('sodder', 20) - 0.2;
    wrap({ id: 'S21b', at: st, note: 'close on the five faceless silhouettes on the billboard; a big question mark', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); passCar.visible = false; bbDad.group.visible = bbMom.group.visible = false;
      shoot(DA.scene, [], V3(56.4, 3.6, -1.4), V3(55.8, 3.5, -2.2), V3(52, 3.5, -8), null, k, { ...LK.out, fov: 40 }, 7);
      blit(); bigQ((t - st - 0.2) / 0.35, 420);
    } });
    cue(st + 0.2, 'heartbeat', { gain: 0.6 }); }

  // 22a · "So... were they lost in the fire," the burning house, wide
  { const st = cut(21), wo = Wd('or', 21);
    wrap({ id: 'S22', at: st, note: 'the house burning in the night, wide and still', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); famOnly(); setFire(1, t);
      shoot(NI.scene, [], V3(-6, 2, 22), V3(-5, 2.2, 19), V3(0, 4, 0), null, k, { ...LK.out, fov: 44 }, 20);
      blit();
    } });
    cue(st, 'sizzle', { dur: 1.4, gain: 0.4 }); }
  // 22b · "or taken that night?" a dark car's red tail-lights slide away down the snowy road
  { const st = Wd('or', 21) - 0.12, wn = Wd('night', 21);
    wrap({ id: 'S22b', at: st, note: 'a dark car drives away down the snowy road, red tail-lights shrinking into the night; question mark on "night"', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); famOnly(); setFire(0.6, t); getaway.visible = true; getaway.position.set(-30, 0, -10 - (t - st) * 9); getaway.rotation.y = Math.PI;
      shoot(NI.scene, [], V3(-29, 1.6, 4), V3(-29.5, 1.8, 2), V3(-30, 1, -30), null, k, { ...LK.out, fov: 44 }, 16);
      blit(); bigQ((t - wn) / 0.35, 440); fade((t - Le(21) - 0.6) / 0.6);
    } });
    cue(Wd('night', 21), 'heartbeat', { gain: 0.8 }); }

  return { shots: S, cues: CUES };
}
