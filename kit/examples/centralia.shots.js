// THE TOWN AMERICA LEFT BEHIND (Centralia, PA): the shot list (Tall Tale 3D). Lots of hand acting via TW.gesture().
import * as THREE from 'three';
import { ctx, clamp, lerp, seg, eo, eio, eob } from './core/lib.js';
import { L, Le, Wd, T } from './core/timing.js';
import { camera } from './core/engine.js';
import * as WD from './core/world.js';
import * as PR from './core/props.js';
import * as TW from './core/town.js';
import { Toon, PROPS } from './core/toon.js';

const V3 = (x, y, z) => new THREE.Vector3(x, y, z);
const mix = (a, b, k) => a.clone().lerp(b, k);
const talk = (t, on = 1) => (on ? 0.25 + 0.75 * Math.abs(Math.sin(t * 13)) * (0.6 + 0.4 * Math.sin(t * 5.3)) : 0);
const blink = (t, off = 0) => (((t + off) % 3.3) < 0.12 ? 1 : 0);
const G = TW.gesture;
const INK = '#1F1C33';

const LOOK = {
  host: { body: '#E8734A', hat: 'cap', hatCol: '#3B3346', neck: 'scarf', neckCol: '#F2C230' },
  fire1: { body: '#C8283A', hat: 'cap', hatCol: '#1F1C33', neck: 'none', pattern: 'overalls', patCol: '#2A2638' },
  fire2: { body: '#D8584A', hat: 'beanie', hatCol: '#1F1C33', extra: ['mustache'] },
  worker: { body: '#F2C230', hat: 'visor', hatCol: '#3B3346', pattern: 'overalls', patCol: '#3C6FB6' },
  kid: { body: '#5C8FD6', hat: 'beanie', hatCol: '#D8343F', kid: true, extra: ['freckles'] },
  cousin: { body: '#7FA36A', hat: 'cap', hatCol: '#6B4A2A', neck: 'scarf', neckCol: '#F2E6CF' },
  official: { body: '#4A4560', hat: 'tophat', hatCol: '#2A2638', neck: 'bowtie', neckCol: '#D8343F', pattern: 'vest', patCol: '#2A2638', extra: ['mustache'] },
  mom: { body: '#B98ACF', hat: 'bun', hatCol: '#7A4A2E', pattern: 'apron' },
  dad: { body: '#6FA35A', hat: 'boater', hatCol: '#E8C77A', band: '#B5372E', pattern: 'overalls', patCol: '#3E5FA8', extra: ['mustache'] },
  old: { body: '#8A7A6A', hat: 'cap', hatCol: '#4A3A2A', neck: 'scarf', neckCol: '#B5372E', extra: ['glasses', 'mustache'] },
};
const person = (k, opts) => new Toon({ ...LOOK[k], extra: [...(LOOK[k].extra || [])] }, opts);
const P2 = {
  shovel: (g, x, y) => { g.save(); g.translate(x, y); g.rotate(0.5); g.strokeStyle = INK; g.lineWidth = 6; g.fillStyle = '#9A6A43'; g.beginPath(); g.roundRect(-7, -140, 14, 230, 5); g.fill(); g.stroke(); g.fillStyle = '#9AA0AE'; g.beginPath(); g.moveTo(-34, 86); g.lineTo(34, 86); g.lineTo(26, 150); g.quadraticCurveTo(0, 170, -26, 150); g.closePath(); g.fill(); g.stroke(); g.restore(); },
  hose: (g, x, y) => { g.save(); g.translate(x, y - 10); g.strokeStyle = INK; g.lineWidth = 6; g.fillStyle = '#C9A13B'; g.beginPath(); g.roundRect(-14, -60, 28, 70, 6); g.fill(); g.stroke(); g.restore(); },
  match: (g, x, y) => { g.save(); g.translate(x, y - 30); g.strokeStyle = INK; g.lineWidth = 5; g.fillStyle = '#F2E6CF'; g.fillRect(-5, -60, 10, 70); g.strokeRect(-5, -60, 10, 70); g.fillStyle = '#FF7A2A'; g.beginPath(); g.ellipse(0, -76, 14, 24, 0, 0, 7); g.fill(); g.fillStyle = '#FFD24A'; g.beginPath(); g.ellipse(0, -70, 7, 13, 0, 0, 7); g.fill(); g.restore(); },
};

// ── overlays (above the caption zone) ──
function ribbon(text, k, y = 400, size = 92) {
  if (k <= 0) return; const a = eob(clamp(k)); ctx.save(); ctx.translate(540, y); ctx.rotate(-0.03); ctx.scale(a, a); ctx.font = `900 ${size}px Inter`; const w = ctx.measureText(text).width + 90;
  ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.fillRect(-w / 2 + 12, -62, w, 140); ctx.fillStyle = '#F2C230'; ctx.strokeStyle = INK; ctx.lineWidth = 8; ctx.beginPath(); ctx.rect(-w / 2, -70, w, 140); ctx.fill(); ctx.stroke();
  ctx.fillStyle = INK; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(text, 0, 6); ctx.restore();
}
function pill(text, k, y = 260, bg = 'rgba(31,28,51,0.88)', size = 54) {
  if (k <= 0) return; ctx.save(); ctx.globalAlpha = clamp(k * 1.5); ctx.translate(540, y + (1 - eo(clamp(k))) * 30); ctx.font = `900 ${size}px Inter`; const w = ctx.measureText(text).width + 70;
  ctx.fillStyle = bg; ctx.beginPath(); ctx.roundRect(-w / 2, -size * 0.85, w, size * 1.7, size * 0.85); ctx.fill(); ctx.strokeStyle = '#F2C230'; ctx.lineWidth = 5; ctx.stroke();
  ctx.fillStyle = '#FFFFFF'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(text, 0, 4); ctx.restore();
}
function stamp(lines, p, { x = 540, y = 560, rot = -0.1, col = '#C8283A', size = 84, fill = 'rgba(255,253,244,0.94)' } = {}) {
  if (p <= 0) return; ctx.save(); ctx.translate(x, y); ctx.rotate(rot); const s = lerp(2.3, 1, eo(clamp(p))); ctx.scale(s, s); ctx.globalAlpha = Math.min(1, p * 1.6);
  ctx.font = `900 ${size}px Inter`; const w = Math.max(...lines.map((l) => ctx.measureText(l).width)) + 80, h = lines.length * size * 1.08 + 50;
  if (fill) { ctx.fillStyle = fill; ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, 22); ctx.fill(); }
  ctx.strokeStyle = col; ctx.lineWidth = 12; ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, 22); ctx.stroke();
  ctx.fillStyle = col; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; lines.forEach((l, i) => ctx.fillText(l, 0, (i - (lines.length - 1) / 2) * size * 1.08 + 4)); ctx.restore();
}
function counter(n, k, label, y = 330) {
  if (k <= 0) return; ctx.save(); ctx.globalAlpha = clamp(k * 2); ctx.translate(540, y); ctx.fillStyle = 'rgba(31,28,51,0.85)'; ctx.beginPath(); ctx.roundRect(-250, -110, 500, 220, 30); ctx.fill(); ctx.strokeStyle = '#F2C230'; ctx.lineWidth = 6; ctx.stroke();
  ctx.fillStyle = '#FFFFFF'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.font = '900 120px Inter'; ctx.fillText(String(n), 0, -14); ctx.font = '800 36px Inter'; ctx.fillStyle = '#F2C230'; ctx.fillText(label, 0, 72); ctx.restore();
}
function envelope(k, cross, y = 520) {
  if (k <= 0) return; const a = eob(clamp(k)); ctx.save(); ctx.translate(540, y); ctx.rotate(-0.06); ctx.scale(a, a);
  ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.fillRect(-370, -200, 760, 420); ctx.fillStyle = '#FFFDF4'; ctx.strokeStyle = INK; ctx.lineWidth = 8; ctx.beginPath(); ctx.rect(-380, -210, 760, 420); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-380, -210); ctx.lineTo(0, 30); ctx.lineTo(380, -210); ctx.stroke(); ctx.fillStyle = '#D8343F'; ctx.fillRect(250, -180, 90, 110); ctx.strokeRect(250, -180, 90, 110);
  ctx.fillStyle = INK; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.font = '800 46px Inter'; ctx.fillText('CENTRALIA, PA', 0, 90); ctx.font = '900 92px Inter'; ctx.fillText('17927', 0, 170);
  if (cross > 0) { ctx.strokeStyle = '#C8283A'; ctx.lineWidth = 18; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-140, 120); ctx.lineTo(lerp(-140, 140, clamp(cross * 2)), lerp(120, 220, clamp(cross * 2))); ctx.stroke();
    if (cross > 0.5) { ctx.beginPath(); ctx.moveTo(140, 120); ctx.lineTo(lerp(140, -140, clamp(cross * 2 - 1)), lerp(120, 220, clamp(cross * 2 - 1))); ctx.stroke(); } }
  ctx.restore();
}
function water(t, t0, x0, y0, x1, y1) { const k = t - t0; if (k < 0) return; ctx.save(); for (let i = 0; i < 30; i++) { const f = ((k * 1.6 + i / 30) % 1); const x = lerp(x0, x1, f) + Math.sin(i * 3) * 18 * f, y = lerp(y0, y1, f) - Math.sin(f * Math.PI) * 120; ctx.fillStyle = i % 2 ? '#5AD1E8' : '#3C9FD8'; ctx.beginPath(); ctx.arc(x, y, 10 + (i % 3) * 4, 0, 7); ctx.fill(); } ctx.restore(); }

export function buildShots(E) {
  const S = [], CUES = [], add = (o) => (S.push(o), o), cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut = (i) => (i === 0 ? 0 : L(i) - 0.06);
  const cam = camera(36);
  const LK = { day: { bloom: 0.35, bloomThreshold: 1.08, aperture: 0.0012, maxblur: 0.008 }, fire: { bloom: 0.8, bloomThreshold: 1.08, aperture: 0.0008, maxblur: 0.006 } };
  const shoot = (scene, people, from, to, at, at2, k, look, focus) => {
    if (cam.fov !== (look.fov || 36)) { cam.fov = look.fov || 36; cam.updateProjectionMatrix(); }
    cam.position.copy(mix(from, to, k)); cam.lookAt(at2 ? mix(at, at2, k) : at);
    people.forEach((p) => p.face(cam));
    E.render(scene, cam, { ...look, focus: focus ?? cam.position.distanceTo(at2 ? mix(at, at2, k) : at) });
  };
  const ups = []; const tick = (t) => ups.forEach((f) => f(t));

  // ═════ STREET: Centralia, smoke from the cracks ═════
  const SHOPS = [['DINER', '#E58A6A', 'wood', '#D8343F'], ['HARDWARE', '#B5553C', 'brick', '#F2C230'], ['BARBER', '#E3C16F', 'wood', '#3C6FB6'], ['BANK', '#C7B79A', 'brick', null],
    ['GENERAL STORE', '#6FA3B8', 'wood', null], ['POST OFFICE', '#7FA36A', 'brick', '#2E4E8A'], ['TAVERN', '#9E4A3A', 'brick', null], ['CAFE', '#F2B8C6', 'wood', '#2E4E3F'],
    ['THEATER', '#A3485A', 'brick', '#F2C230'], ['SHOES', '#D9A34A', 'wood', null], ['PHARMACY', '#5FA39A', 'wood', '#D8343F'], ['GROCER', '#C9603F', 'brick', null]];
  const ST = WD.mainStreet(E, { shops: SHOPS, people: false });
  ST.sun.key.target.position.set(0, 0, -8); ST.sun.key.position.set(8, 13, -2);
  const PO = ST.buildings.find((b) => b.name === 'POST OFFICE');
  const stVents = [[0.6, -6], [-1.4, -12], [1.8, -18], [-0.6, -26], [0.4, -34], [-2.2, -3]].map(([x, z], i) => { const v = TW.smokeVent(10, 1 + (i % 3) * 0.3); v.position.set(x, 0, z); ST.scene.add(v); const c = TW.crack(3 + (i % 2), i + 1); c.position.set(x, 0, z); c.rotation.z = i; ST.scene.add(c); return v; });
  ups.push((t) => stVents.forEach((v) => v.update(t)));
  const welcome = new THREE.Group(); { [-1.6, 1.6].forEach((x) => { const p = new THREE.Mesh(new THREE.BoxGeometry(0.15, 3, 0.15), WD.mat({ color: '#6B4A2A' })); p.position.set(x, 1.5, 0); welcome.add(p); });
    const sb = WD.signBoard('CENTRALIA', { w: 3.6, h: 0.9, bg: '#2E4E3F', fg: '#F2E6CF' }); sb.position.set(0, 2.6, 0.05); welcome.add(sb); const s2 = WD.signBoard('EST. 1866', { w: 1.6, h: 0.35, bg: '#F2E6CF', fg: '#2E4E3F' }); s2.position.set(0, 1.95, 0.05); welcome.add(s2); }
  welcome.position.set(-3.0, 0, 7.5); welcome.rotation.y = 0.25; ST.scene.add(welcome);
  const sHost = person('host'), sOff = person('official'), sMom = person('mom'), sDad = person('dad'), sKid = person('kid', { height: 1.35 });
  [sHost, sOff, sMom, sDad, sKid].forEach((p) => ST.scene.add(p.group));
  const stMoney = PR.moneyStack(14); stMoney.position.set(-2.4, 0, -4.2); stMoney.set(0); ST.scene.add(stMoney);
  const truck = WD.car('#7A2E2E'); truck.scale.set(1.2, 1.3, 1.6); ST.scene.add(truck);
  const stAll = () => [sHost, sOff, sMom, sDad, sKid];
  const stOnly = (...keep) => stAll().forEach((p) => (p.group.visible = keep.includes(p)));

  // ═════ PIT: May 1962, the landfill fire ═════
  const PT = WD.meadow(E, { fenceOn: false }); PT.sun.key.position.set(8, 12, 8); PT.sun.key.target.position.set(0, 0, -3);
  const pit = new THREE.Mesh(new THREE.CylinderGeometry(3.2, 2.2, 0.6, 32, 1, true), WD.mat({ color: '#5A3C2A', side: THREE.DoubleSide })); pit.position.set(0, -0.25, -3); PT.scene.add(pit);
  const pitFloor = new THREE.Mesh(new THREE.CircleGeometry(3.15, 32), WD.mat({ color: '#3A2A24' })); pitFloor.rotation.x = -Math.PI / 2; pitFloor.position.set(0, 0.02, -3); PT.scene.add(pitFloor);
  const trash = []; for (let i = 0; i < 12; i++) { const o = i % 3 === 0 ? WD.barrel() : i % 3 === 1 ? WD.crate(0.5) : PR.parcel(0.5, 0.3, 0.4, false); const a = i * 2.1, r = 0.4 + (i % 4) * 0.45; o.position.set(Math.cos(a) * r, 0.02, -3 + Math.sin(a) * r); o.rotation.y = i; o.scale.setScalar(0.8); PT.scene.add(o); trash.push(o); }
  const pitFire = TW.flames(9, 1.4); pitFire.position.set(0, 0.1, -3); PT.scene.add(pitFire);
  const pitSmoke = TW.smokeVent(12, 1.8, '#9A9AA4'); pitSmoke.position.set(0, 1, -3); PT.scene.add(pitSmoke);
  const pSign = TW.roadSign(['TOWN', 'DUMP'], { bg: '#F2E6CF' }); pSign.position.set(-4.2, 0, -1.2); pSign.rotation.y = 0.5; PT.scene.add(pSign);
  const pF1 = person('fire1'), pF2 = person('fire2'); [pF1, pF2].forEach((p) => PT.scene.add(p.group));

  // ═════ CUT: the hill in cross-section ═════
  const CT = WD.meadow(E, { fenceOn: false, flowers: false, treesOn: false }); CT.sun.key.position.set(6, 12, 10); CT.sun.key.target.position.set(0, 0, -2);
  const earth = TW.earthCut(); earth.position.set(0, 0.05, 2); CT.scene.add(earth);
  CT.scene.children.slice().forEach((o) => { if ((o.isMesh && o.geometry && (o.geometry.type === 'CircleGeometry' || o.geometry.type === 'PlaneGeometry')) || o.isInstancedMesh) o.visible = false; });
  { const deep = new THREE.Mesh(new THREE.BoxGeometry(16, 14, 8), WD.mat({ color: '#4A3226' })); deep.position.set(0, -15, -2); CT.scene.add(deep); const back = new THREE.Mesh(new THREE.PlaneGeometry(400, 400), WD.mat({ map: WD.T.grass('#6DBB4A', [60, 60]) })); back.rotation.x = -Math.PI / 2; back.position.set(0, 0.0, -206); CT.scene.add(back); }
  const cHouses = [[-3, -1.2, '#F2E6CF', '#B5553C'], [0.6, -1.6, '#F2C9D6', '#3E5FA8'], [4.2, -1.0, '#BFE0D0', '#7A3E24']].map(([x, z, w, r]) => { const h = PR.house({ wall: w, roof: r }); h.scale.setScalar(0.4); h.position.set(x, 0.05, z); CT.scene.add(h); return h; });
  const cPitHole = TW.sinkhole(0.6); cPitHole.position.set(-6.7, 0.05, 1.2); CT.scene.add(cPitHole);
  const cVents = [[-5.6, 0.6], [-1.6, 0.2], [2.2, 0.4], [5.6, 0.8]].map(([x, z], i) => { const v = TW.smokeVent(8, 0.8); v.position.set(x, 0.05, z); CT.scene.add(v); return v; });
  const cW1 = person('worker'), cW2 = person('worker'), cW3 = person('fire1'); [cW1, cW2, cW3].forEach((p) => CT.scene.add(p.group));
  cW2.restyle({ body: '#F28C4A', hatCol: '#2E4E8A' });

  // ═════ YARD: February 1981 ═════
  const YD = WD.meadow(E, { fenceOn: true }); YD.sun.key.position.set(8, 12, 8); YD.sun.key.target.position.set(0, 0, -2);
  const gHouse = PR.house({ wall: '#F2E6CF', roof: '#7A3E24', door: '#2E4E8A' }); gHouse.position.set(-3.5, 0, -8); YD.scene.add(gHouse);
  const yTree = WD.tree(1.1); yTree.position.set(1.4, 0, -3.4); YD.scene.add(yTree);
  const hole = TW.sinkhole(0.75); hole.position.set(0.2, 0, -2.6); YD.scene.add(hole);
  const root = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.06, 1.4, 6), WD.mat({ color: '#6B4A2A' })); root.position.set(0.8, 0.12, -2.9); root.rotation.z = 1.25; YD.scene.add(root);
  const hSmoke = TW.smokeVent(10, 1.0); hSmoke.position.set(0.2, 0, -2.6); YD.scene.add(hSmoke);
  const yKid = person('kid', { height: 1.35 }), yCous = person('cousin', { height: 1.6 }); [yKid, yCous].forEach((p) => YD.scene.add(p.group));

  // ═════ GHOST: empty streets today ═════
  const GH = WD.meadow(E, { fenceOn: false }); GH.sun.key.position.set(8, 12, 8); GH.sun.key.target.position.set(0, 0, -6);
  Object.assign(GH.sun.key.shadow.camera, { left: -20, right: 20, top: 20, bottom: -20 }); GH.sun.key.shadow.camera.updateProjectionMatrix();
  [[0, -6, 3, 40, 0], [0, -8, 30, 3, 0]].forEach(([x, z, w, d]) => { const r = new THREE.Mesh(new THREE.PlaneGeometry(w, d), WD.mat({ map: T_dirt(w, d) })); r.rotation.x = -Math.PI / 2; r.position.set(x, 0.03, z); r.receiveShadow = true; GH.scene.add(r); });
  function T_dirt(w, d) { return WD.T.dirt('#9C8A78', [w / 6, d / 6], false); }
  const gHouses = [[-5, -3, '#F2E6CF', '#B5553C'], [5, -3.5, '#F2C9D6', '#3E5FA8'], [-5, -13, '#BFE0D0', '#7A3E24'], [5.5, -13.5, '#F2D37A', '#2E4E8A'], [-12, -10, '#E8C0A0', '#5A3A2A'], [12, -10, '#F2E6CF', '#3E5FA8']].map(([x, z, w, r], i) => { const h = PR.house({ wall: w, roof: r }); h.scale.setScalar(0.7); h.position.set(x, 0, z); h.rotation.y = x < 0 ? Math.PI / 2 : -Math.PI / 2; GH.scene.add(h); return h; });
  const lastHouse = gHouses[0];
  const gVents = [[0.4, -2], [-0.8, -9], [1, -16], [-6, -8], [7, -8.5], [-1, -24]].map(([x, z], i) => { const v = TW.smokeVent(10, 1.1); v.position.set(x, 0.03, z); GH.scene.add(v); const c = TW.crack(3, i + 10); c.position.set(x, 0.01, z); GH.scene.add(c); return v; });
  const closed = TW.roadSign(['ROAD', 'CLOSED'], { bg: '#F2E6CF', fg: '#C8283A' }); closed.position.set(2.4, 0, 4); closed.rotation.y = -0.3; GH.scene.add(closed);
  const dust = TW.smokeVent(10, 2.2, '#C9B48A'); GH.scene.add(dust);
  const five = [[-2.2, -2.0], [2.4, -3.0], [-2.4, -8.5], [2.6, -9.5], [0.4, -13]].map(([x, z], i) => { const p = new Toon({ body: ['#5C8FD6', '#E8734A', '#B98ACF', '#9BC46A', '#8A7A6A'][i], hat: ['cap', 'bun', 'boater', 'beanie', 'cap'][i], hatCol: '#3B3346' }, { height: 1.7 }); p.at(x, 0, z); GH.scene.add(p.group); return p; });
  const gOld = person('old'); GH.scene.add(gOld.group);
  ups.push((t) => { gVents.forEach((v) => v.update(t)); cVents.forEach((v) => v.update(t)); hSmoke.update(t); pitSmoke.update(t); });

  // ═════════════ SHOTS ═════════════
  // 1 · "Imagine a town where the ground is so hot," crane down a quiet street, smoke from cracks
  { const st = cut(0);
    add({ id: 'S01', at: st, note: 'crane down an old main street: smoke curls out of glowing cracks in the road', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); tick(t); stOnly(); truck.visible = false;
      shoot(ST.scene, [], V3(0, 12, 14), V3(1.2, 2.4, 3), V3(0, 1, -30), V3(0, 1.2, -10), k, { ...LK.day, fov: 46 });
      blit();
    } });
    cue(0.05, 'whoosh', { gain: 0.5 }); cue(Wd('hot', 0), 'sizzle', { dur: 1.0, gain: 0.4 }); }

  // 2 · "smoke pours out of the cracks in the road." the host jumps back, hands up
  { const st = cut(1), ws = Wd('smoke', 1);
    add({ id: 'S02', at: st, note: 'the host steps near a crack; smoke bursts up and he jumps back, palms out', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); tick(t); stOnly(sHost); truck.visible = false;
      const jump = t > ws; sHost.at(lerp(-1.2, -1.9, eo(clamp((t - ws) / 0.3))), 0, -3.2);
      sHost.set({ mood: jump ? 'shock' : 'neutral', ...(jump ? G('stop', t) : G('explain', t)), legs: jump && t < ws + 0.3 ? 'jump' : 'stand', look: [0.6, 0.4], blink: blink(t) });
      shoot(ST.scene, [sHost], V3(1.8, 1.1, 1.0), V3(1.4, 1.3, 0.2), V3(-1.4, 1.2, -3.2), V3(-1.0, 1.0, -3.5), k, { ...LK.day, fov: 50 });
      blit();
    } });
    cue(Wd('smoke', 1), 'whoosh', { gain: 0.6 }); cue(Wd('smoke', 1) + 0.05, 'boing', { gain: 0.4 }); }

  // 3 · "Well, that town is real." host talks to camera with his hands, then points at the smoke
  { const st = cut(2), wr = Wd('real', 2);
    add({ id: 'S03', at: st, note: 'host explains to camera with both hands, then points hard at the smoking street on "real"', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); tick(t); stOnly(sHost); sHost.at(-1.9, 0, -3.2);
      sHost.set({ mood: t > wr ? 'smug' : 'happy', ...(t > wr - 0.1 ? G('pointR', t) : G('explain', t)), talk: talk(t), look: t > wr ? [0.8, 0] : [0, 0], blink: blink(t) });
      shoot(ST.scene, [sHost], V3(-0.6, 1.5, 0.4), V3(-0.8, 1.5, -0.2), V3(-1.6, 1.4, -3.2), null, k, LK.day);
      blit();
    } });
    cue(Wd('real', 2), 'ding', { gain: 0.5 }); }

  // 4 · "It's Centralia, Pennsylvania," the welcome sign; host presents it with both arms
  { const st = cut(3), wc = Wd('centralia', 3);
    add({ id: 'S04', at: st, note: 'the old CENTRALIA welcome sign; the host presents it with open arms; pill PENNSYLVANIA, USA', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); tick(t); stOnly(sHost); welcome.visible = true; sHost.at(-1.2, 0, 8.6);
      sHost.set({ mood: 'happy', armL: [110 + Math.sin(t * 4) * 6, -20], armR: [40, -30], talk: talk(t), look: [-0.7, -0.2], blink: blink(t) });
      shoot(ST.scene, [sHost], V3(0.6, 2.0, 16), V3(0.0, 2.0, 14.4), V3(-2.4, 2.0, 7.6), null, k, { ...LK.day, fov: 50 });
      blit(); pill('PENNSYLVANIA, USA', (t - wc) / 0.3, 260);
    } });
    cue(st, 'whoosh', { gain: 0.5 }); }

  // 5 · "and it's been burning underground since 1962." the hill cut open: fire glowing in the tunnels
  { const st = cut(4), wy = Wd('1962', 4);
    add({ id: 'S05', at: st, note: 'the hill cut open like a cake: little houses on top, fire glowing in the tunnels below; ribbon SINCE 1962', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); tick(t); earth.set(0.75, t); [cW1, cW2, cW3].forEach((p) => (p.group.visible = false));
      shoot(CT.scene, [], V3(0, 3, 22), V3(0, -1, 17), V3(0, 1, 0), V3(0, -2.6, 0), k, { ...LK.fire, fov: 46 }, 16);
      blit(); ribbon('SINCE 1962', (t - wy + 0.1) / 0.3, 360);
    } });
    cue(st, 'slide', { dur: 1.2, gain: 0.5 }); cue(wy, 'stamp', { gain: 0.7 }); }

  // 6 · "See, it most likely started with a trash fire," May 1962, firefighters light the dump
  { const st = cut(5), wf = Wd('fire', 5);
    add({ id: 'S06', at: st, note: 'May 1962: two firefighters at the town dump; one strikes a match, flames rise on "fire"', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); pitSmoke.update(t); const fk = eo(clamp((t - wf + 0.3) / 0.6)); pitFire.update(t, fk * 0.6);
      pF1.at(-1.0, 0, 0.8); pF2.at(1.0, 0, 0.9);
      pF1.set({ mood: 'happy', armR: [90, -40], holdR: t < wf ? P2.match : null, armL: [30, -20], v: 'm' + (t < wf), look: [0.6, 0.3], blink: blink(t) });
      pF2.set({ mood: t > wf ? 'shock' : 'neutral', ...(t > wf ? G('stop', t) : G('explain', t, 1)), talk: talk(t, t < wf), look: [-0.6, 0.2] });
      shoot(PT.scene, [pF1, pF2], V3(0.4, 2.0, 5.2), V3(0.2, 1.8, 4.2), V3(0, 1, -1.5), null, k, { ...LK.fire, fov: 50 });
      blit(); ribbon('MAY 1962', (t - st - 0.15) / 0.3, 360);
    } });
    cue(Wd('fire', 5) - 0.2, 'sizzle', { dur: 1.6, gain: 0.6 }); }

  // 7 · "when the town burned garbage in an old mine pit," wide: the burning pit
  { const st = cut(6), wp = Wd('pit', 6);
    add({ id: 'S07', at: st, note: 'crane up: the whole pit of garbage burning; the firefighters gesture at it; sign TOWN DUMP', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); pitSmoke.update(t); pitFire.update(t, 0.8 + 0.2 * k);
      pF1.at(-1.3, 0, 1.6); pF2.at(1.3, 0, 1.7);
      pF1.set({ mood: 'proud', ...G('pointR', t), look: [0.8, 0.2] }); pF2.set({ mood: 'worried', ...G('head', t), look: [-0.7, 0.2], sweat: 1 });
      shoot(PT.scene, [pF1, pF2], V3(0, 2.4, 7), V3(0, 7, 6), V3(0, 1, -3), V3(0, 0, -3), k, { ...LK.fire, fov: 52 });
      blit(); if (t > wp - 0.1) pill('OLD MINE PIT', (t - wp + 0.1) / 0.3, 260);
    } });
    cue(st, 'sizzle', { dur: 2.4, gain: 0.5 }); }

  // 8 · "and the flames slipped into the coal tunnels below." cut-away: fire creeps from the pit into the tunnels
  { const st = cut(7), ws = Wd('slipped', 7);
    add({ id: 'S08', at: st, note: 'cut-away: the glow slips from the pit into the black tunnels and creeps along them', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); tick(t); earth.set(clamp((t - ws + 0.2) / (Le(7) - ws + 0.3)) * 0.45, t); [cW1, cW2, cW3].forEach((p) => (p.group.visible = false));
      shoot(CT.scene, [], V3(-4.5, 0.5, 15), V3(-1.5, -1.5, 15), V3(-5, -1.5, 0), V3(-1.5, -3.5, 0), k, { ...LK.fire, fov: 50 }, 15);
      blit();
    } });
    cue(Wd('slipped', 7), 'slide', { dur: 1.6, gain: 0.5 }); cue(Wd('slipped', 7) + 0.1, 'sizzle', { dur: 1.4, gain: 0.4 }); }

  // 9 · "They dug, they flooded, they tried everything," workers dig, spray water, then grab their heads
  { const st = cut(8), wd = Wd('dug', 8), wfl = Wd('flooded', 8), we = Wd('everything', 8);
    add({ id: 'S09', at: st, note: 'on the hilltop workers dig ("dug"), spray water ("flooded"), then grab their heads ("everything") while the glow spreads below', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); tick(t); earth.set(0.45 + k * 0.15, t); [cW1, cW2, cW3].forEach((p) => (p.group.visible = true));
      cW1.at(-3.0, 0.05, 0.6); cW2.at(-1.2, 0.05, 0.4); cW3.at(0.8, 0.05, 0.6);
      const gv = t > we ? 'head' : null;
      cW1.set({ mood: gv ? 'worried' : 'proud', ...(gv ? G('head', t) : G('dig', t)), holdR: gv ? null : P2.shovel, v: 's' + !!gv, sweat: 1 });
      cW2.set({ mood: gv ? 'shock' : 'happy', ...(gv ? G('head', t) : G('dig', t, 2)), holdR: gv ? null : P2.shovel, v: 's' + !!gv });
      cW3.set({ mood: gv ? 'sad' : 'proud', ...(t > wfl && !gv ? { armR: [95, -20], armL: [80, -40] } : gv ? G('head', t) : G('explain', t)), holdR: t > wfl && !gv ? P2.hose : null, v: 'h' + (t > wfl) + !!gv });
      shoot(CT.scene, [cW1, cW2, cW3], V3(-1.1, 1.6, 10), V3(-1.1, 0.8, 9), V3(-1.1, 0.4, 0), V3(-1.1, -1.0, 0), k, { ...LK.fire, fov: 56 }, 9);
      blit(); if (t > wfl && t < we) water(t, wfl, 720, 760, 600, 980);
    } });
    cue(Wd('dug', 8), 'thud', { gain: 0.5 }); cue(Wd('dug', 8) + 0.25, 'thud', { gain: 0.4 }); cue(Wd('flooded', 8), 'bubbles', { dur: 1.0, gain: 0.5 }); cue(Wd('everything', 8), 'boing', { gain: 0.4 }); }

  // 10 · "but the fire just kept spreading." glow races through every tunnel
  { const st = cut(9), wsp = Wd('spreading', 9);
    add({ id: 'S10', at: st, note: 'wide cut-away: the glow races through every tunnel under the houses', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); tick(t); earth.set(0.6 + 0.4 * eo(clamp((t - st) / (wsp - st + 0.4))), t);
      [cW1, cW2, cW3].forEach((p, i) => p.set({ mood: 'sad', ...G('shrug', t, i) }));
      shoot(CT.scene, [cW1, cW2, cW3], V3(0, 0.5, 16), V3(0, -1.2, 19), V3(0, -2.5, 0), null, k, { ...LK.fire, fov: 48 }, 18);
      blit();
    } });
    cue(st, 'slide', { dur: 1.2, gain: 0.5 }); }

  // 11 · "Then in 1981, the ground opened up" grandma's backyard; a hole cracks open
  { const st = cut(10), wo = Wd('opened', 10), wy = Wd('1981', 10);
    add({ id: 'S11', at: st, note: 'Feb 1981, a backyard: a boy walks by the tree; on "opened" a smoking hole rips open', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); const ho = eob(clamp((t - wo) / 0.35)); hole.scale.setScalar(Math.max(0.001, ho)); hSmoke.update(t, ho);
      yCous.group.visible = false; yKid.at(lerp(-2.2, -0.6, clamp((t - st) / (wo - st))), 0, -2.4);
      yKid.set({ mood: t > wo ? 'shock' : 'happy', legs: t < wo ? 'walk' : 'stand', phase: t * 8, ...(t > wo ? G('head', t) : G('default', t)), look: [0.5, 0.6], blink: blink(t) });
      shoot(YD.scene, [yKid], V3(-1, 1.6, 4.4), V3(-0.6, 1.4, 3.2), V3(-0.6, 0.9, -2.5), null, k, LK.day);
      blit(); ribbon('FEBRUARY 1981', (t - wy + 0.1) / 0.3, 360, 84);
    } });
    cue(Wd('opened', 10), 'thud', { gain: 0.9 }); cue(Wd('opened', 10) + 0.05, 'slam', { gain: 0.5 }); }

  // 12 · "under a twelve-year-old boy." he drops into the hole up to his chest
  { const st = cut(11), wb = Wd('boy', 11);
    add({ id: 'S12', at: st, note: 'the boy drops into the smoking hole up to his chest, arms flung up', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); hole.scale.setScalar(1); hSmoke.update(t); yCous.group.visible = false;
      const fall = eo(clamp((t - st - 0.1) / 0.4)); yKid.at(0.2, lerp(0, -0.55, fall), -2.6);
      yKid.set({ mood: 'shock', ...G('head', t), armL: [160, -20], armR: [160, -20], blink: 0 });
      shoot(YD.scene, [yKid], V3(0.3, 1.4, 2.2), V3(0.3, 1.2, 1.4), V3(0.2, 0.5, -2.6), null, k, { ...LK.day, fov: 46 });
      blit(); pill('12 YEARS OLD', (t - wb + 0.1) / 0.3, 260);
    } });
    cue(st + 0.1, 'whoosh', { gain: 0.7 }); }

  // 13 · "He grabbed a tree root," a hand shoots out and grips the root
  { const st = cut(12), wr = Wd('root', 12);
    add({ id: 'S13', at: st, note: 'close: the boy, chest-deep, grabs the tree root with one hand on "root"', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); hSmoke.update(t); yCous.group.visible = false; yKid.at(0.2, -0.55, -2.6);
      const g = t > wr - 0.2; yKid.set({ mood: g ? 'worried' : 'shock', armR: g ? [110, -10] : [150, 0], armL: [150, -30], sweat: 1 });
      shoot(YD.scene, [yKid], V3(-0.4, 1.0, 0.2), V3(-0.2, 0.95, -0.3), V3(0.5, 0.45, -2.7), null, k, { ...LK.day, fov: 50 }, 2.4);
      blit();
    } });
    cue(Wd('root', 12) - 0.2, 'pop', { gain: 0.7 }); }

  // 14 · "and his cousin pulled him out just in time." the cousin hauls him up
  { const st = cut(13), wp = Wd('pulled', 13), wt = Wd('time', 13);
    add({ id: 'S14', at: st, note: 'the cousin runs in, grabs his arms and pulls; the boy pops out on "pulled"; both relieved', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); hSmoke.update(t); yCous.group.visible = true;
      const run = clamp((t - st) / (wp - st)); yCous.at(lerp(3.2, 1.2, eo(run)), 0, -2.3);
      const up = eob(clamp((t - wp) / 0.4)); yKid.at(lerp(0.2, 0.0, up), lerp(-0.55, 0, up), lerp(-2.6, -2.0, up));
      yCous.set({ mood: t > wt ? 'happy' : 'worried', legs: run < 1 ? 'run' : 'stand', phase: t * 10, ...G(run < 1 ? 'default' : 'pull', t), sweat: 1 });
      yKid.set({ mood: t > wt ? 'happy' : 'worried', armR: [100, -10], armL: up > 0.5 ? [40, -20] : [150, -20], tears: t > wt ? 1 : 0 });
      shoot(YD.scene, [yKid, yCous], V3(0.4, 1.4, 3.6), V3(0.6, 1.3, 3.0), V3(0.6, 0.7, -2.4), null, k, { ...LK.day, fov: 48 });
      blit(); if (t > wt) pill('SAVED BY HIS COUSIN', (t - wt) / 0.3, 260, 'rgba(20,90,50,0.9)');
    } });
    cue(Wd('pulled', 13), 'boing', { gain: 0.6 }); cue(Wd('time', 13), 'sparkle', { gain: 0.4 }); }

  // 15 · "So the government paid forty-two million dollars" an official stacks cash
  { const st = cut(14), wm = Wd('forty', 14);
    add({ id: 'S15', at: st, note: 'main street: a government official gestures as cash stacks up beside him; stamp $42 MILLION', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); tick(t); stOnly(sOff); truck.visible = false; sOff.at(-0.9, 0, -4.2);
      stMoney.set(eo(clamp((t - st - 0.2) / (wm - st + 0.4))) * 14);
      sOff.set({ mood: 'proud', ...(t > wm ? G('pointL', t) : G('explain', t)), talk: talk(t), look: [-0.4, 0], blink: blink(t) });
      shoot(ST.scene, [sOff], V3(-0.6, 1.7, 1.2), V3(-1.2, 1.8, 0.4), V3(-1.6, 1.5, -4.2), null, k, { ...LK.day, fov: 46 });
      blit(); stamp(['$42 MILLION'], (t - wm) / 0.25, { y: 470, col: '#2F7A3A', fill: 'rgba(240,255,235,0.93)' });
    } });
    for (let i = 0; i < 6; i++) cue(cut(14) + 0.3 + i * 0.25, 'plop', { gain: 0.4 }); cue(Wd('forty', 14), 'stamp', { gain: 0.8 }); }

  // 16 · "to move everyone out." a family carries boxes to a truck and waves goodbye
  { const st = cut(15);
    add({ id: 'S16', at: st, note: 'a family carries boxes to a moving truck; the kid waves goodbye', draw(lt, d, t, blit) {
      const k = clamp(lt / d); tick(t); stOnly(sMom, sDad, sKid); truck.visible = true; truck.position.set(2.0, 0, -9); truck.rotation.y = 0;
      sDad.at(lerp(-3.2, -0.8, k), 0, -7.4); sMom.at(lerp(-3.8, -1.6, k), 0, -6.6); sKid.at(lerp(-2.6, -0.6, k), 0, -5.8);
      sDad.set({ mood: 'sad', legs: 'walk', phase: t * 7, armL: [70, -110], armR: [70, -110], holdR: PROPS.parcels, v: 'p' }); sMom.set({ mood: 'sad', legs: 'walk', phase: t * 7 + 2, armL: [60, -80], armR: [60, -80], tears: 1 });
      sKid.set({ mood: 'sad', legs: 'walk', phase: t * 9, ...G('wave', t) });
      shoot(ST.scene, [sMom, sDad, sKid], V3(1.0, 1.5, -1.0), V3(0.6, 1.5, -1.6), V3(-1.4, 1.1, -6.6), null, eio(k), { ...LK.day, fov: 48 });
      blit();
    } });
    cue(st, 'whoosh', { gain: 0.4 }); cue(st + 0.6, 'chug', { dur: 0.8, gain: 0.3 }); }

  // 17 · "Houses were torn down," houses squash flat one after another in puffs of dust
  { const st = cut(16), wt = Wd('torn', 16);
    add({ id: 'S17', at: st, note: 'empty blocks: houses squash flat one by one in puffs of dust', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); tick(t); five.forEach((p) => (p.group.visible = false)); gOld.group.visible = false;
      gHouses.forEach((h, i) => { const a = clamp((t - wt + 0.2 - i * 0.18) / 0.25); h.scale.set(0.7, Math.max(0.02, 0.7 * (1 - eo(a))), 0.7); h.visible = a < 1; });
      const di = Math.min(gHouses.length - 1, Math.max(0, Math.floor((t - wt + 0.2) / 0.18))); dust.position.copy(gHouses[di].position); dust.update(t, t > wt - 0.2 ? 1 : 0);
      shoot(GH.scene, [], V3(0, 7, 10), V3(0, 5, 6), V3(0, 0, -8), null, k, { ...LK.day, fov: 52 });
      blit();
    } });
    for (let i = 0; i < 6; i++) cue(Wd('torn', 16) - 0.2 + i * 0.18, 'thud', { gain: 0.5 }); }

  // 18 · "and the town even lost its ZIP code." the post office; the ZIP gets crossed out
  { const st = cut(17), wz = Wd('zip', 17);
    add({ id: 'S18', at: st, note: 'the post office front; an envelope pops up and its ZIP 17927 is crossed out in red on "ZIP"', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); tick(t); stOnly(); truck.visible = false; welcome.visible = false;
      shoot(ST.scene, [], V3(-1.0, 2.4, PO.z + 6), V3(-2.2, 2.2, PO.z + 3.5), V3(-6.2, 2.6, PO.z), null, k, { ...LK.day, fov: 44 });
      blit(); envelope((t - st - 0.1) / 0.3, (t - wz) / 0.5); if (t > wz + 0.5) pill('ZIP CODE REMOVED · 2002', (t - wz - 0.5) / 0.3, 260, 'rgba(120,20,30,0.9)', 46);
    } });
    cue(Wd('zip', 17), 'zip', { gain: 0.6 }); }

  // 19 · "Today, only about five people live there," five tiny people wave from far apart
  { const st = cut(18), wf = Wd('five', 18);
    add({ id: 'S19', at: st, note: 'aerial over the empty, smoking grid; five lone people pop up far apart and wave; counter 5 PEOPLE LEFT', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); tick(t); gHouses.forEach((h, i) => { h.visible = i === 0 || i === 3; h.scale.setScalar(0.7); }); dust.update(t, 0); gOld.group.visible = false;
      five.forEach((p, i) => { const a = clamp((t - wf + 0.3 - i * 0.12) / 0.2); p.group.visible = a > 0; p.group.scale.setScalar(Math.max(0.01, eob(a))); p.set({ mood: 'happy', ...G('wave', t, i) }); });
      shoot(GH.scene, five, V3(0, 8, 6), V3(0, 6.5, 3.5), V3(0, 0, -7), V3(0, 0, -8), k, { ...LK.day, fov: 54 });
      blit(); counter(t > wf ? 5 : 1000, (t - st) / 0.3, t > wf ? 'PEOPLE LEFT (2020)' : 'PEOPLE (1980)');
    } });
    for (let i = 0; i < 5; i++) cue(Wd('five', 18) - 0.3 + i * 0.12, 'pop', { gain: 0.5 }); }

  // 20 · "and the fire could keep burning" the cut-away, every tunnel aglow
  { const st = cut(19);
    add({ id: 'S20', at: st, note: 'cut-away: every tunnel blazing under the last houses; camera pushes into the glow', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); tick(t); earth.set(1, t); [cW1, cW2, cW3].forEach((p) => (p.group.visible = false));
      shoot(CT.scene, [], V3(0, -1, 16), V3(2, -3.5, 9), V3(0, -3, 0), V3(3, -4.5, 0), k, { ...LK.fire, fov: 48 }, 10);
      blit();
    } });
    cue(st, 'sizzle', { dur: 1.4, gain: 0.5 }); }

  // 21 · "for another two hundred and fifty years." year counter races ahead
  { const st = cut(20), wy = Wd('years', 20);
    add({ id: 'S21', at: st, note: 'the glowing cut-away; a year counter races from 2026 to 2276', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); tick(t); earth.set(1, t);
      shoot(CT.scene, [], V3(-3, 2, 18), V3(-2, 0.5, 15), V3(0, -2, 0), null, k, { ...LK.fire, fov: 48 }, 15);
      blit(); const yr = Math.round(lerp(2026, 2276, eio(clamp((t - st) / (wy - st + 0.3))))); counter(yr, (t - st) / 0.3, '250 MORE YEARS?', 330);
    } });
    for (let i = 0; i < 7; i++) cue(cut(20) + 0.1 + i * 0.3, 'tock', { gain: 0.35 }); }

  // 22 · "So... would you have stayed?" the last resident on his porch shrugs at camera
  { const st = cut(21), ws = Wd('stayed', 21);
    add({ id: 'S22', at: st, note: 'the last resident on his porch, smoke drifting past; he shrugs at camera on "stayed"', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); tick(t); gHouses.forEach((h, i) => { h.visible = i === 0; h.scale.setScalar(0.7); }); five.forEach((p) => (p.group.visible = false)); dust.update(t, 0);
      gOld.group.visible = true; const hp = lastHouse.position; gOld.at(hp.x + 3.6, 0, hp.z + 1.0);
      gOld.set({ mood: t > ws ? 'sly' : 'neutral', ...(t > ws - 0.2 ? G('shrug', t) : G('explain', t)), talk: talk(t, t < ws + 0.4), look: [0, 0], blink: blink(t) });
      shoot(GH.scene, [gOld], V3(1.8, 1.6, 0.8), V3(1.1, 1.55, 0.0), V3(hp.x + 3.4, 1.3, hp.z + 0.6), null, k, { ...LK.day, fov: 48 });
      blit();
    } });
    cue(Wd('stayed', 21), 'boing', { gain: 0.4 }); }

  return { shots: S, cues: CUES };
}
