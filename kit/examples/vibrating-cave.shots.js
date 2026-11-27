// HE FOUND A VIBRATING CAVE, THEN VANISHED (Kenny Veach, Nevada, Nov 10 2014) — Tall Tale 3D, mystery tone, US audience.
// Respectful: a missing person, no speculation about his fate. Generic hiker toon (no likeness), generic white car.
import * as THREE from 'three';
import { ctx, clamp, lerp, eo, eio, eob, rnd } from './core/lib.js';
import { L, Le, Wd, T } from './core/timing.js';
import * as WD from './core/world.js';
import { Toon, PROPS, INK } from './core/toon.js';
import { V3, talk, blink, hook, ribbon, pill, stamp, calCard, counter, flash, tint, speedLines, stars, mark, subscribe, makeShoot, LK, P2 } from './jh.js';

const LOOKS = {
  hiker: { body: '#C9603F', pattern: 'check', patCol: '#8A3A2A', hat: 'cap', hatCol: '#3A4A3A', neck: 'none', extra: ['mustache'] },
  sr1: { body: '#F28C28', pattern: 'vest', patCol: '#F2C230', hat: 'cap', hatCol: '#F28C28', neck: 'none' },
  sr2: { body: '#F28C28', pattern: 'vest', patCol: '#F2C230', hat: 'beanie', hatCol: '#2E4E8A', neck: 'none', extra: ['glasses'] },
};
const mk = (k, o) => new Toon({ ...LOOKS[k], extra: [...(LOOKS[k].extra || [])] }, o);
const stick = (g, x, y) => { g.strokeStyle = '#7A4A2A'; g.lineWidth = 9; g.lineCap = 'round'; g.beginPath(); g.moveTo(x, y - 60); g.lineTo(x + 10, y + 120); g.stroke(); };
const torch = (g, x, y) => { g.save(); g.translate(x, y - 30); g.rotate(-0.4); g.strokeStyle = INK; g.lineWidth = 5; g.fillStyle = '#2A2E36'; g.beginPath(); g.roundRect(-12, -10, 24, 70, 6); g.fill(); g.stroke(); g.fillStyle = '#FFF3A0'; g.beginPath(); g.moveTo(-14, -10); g.lineTo(-60, -130); g.lineTo(60, -130); g.lineTo(14, -10); g.closePath(); g.globalAlpha = 0.5; g.fill(); g.restore(); };

// vibration rings drawn around a screen point
function vibes(x, y, a, t) { if (a <= 0) return; ctx.save(); ctx.strokeStyle = '#FFD43B'; ctx.lineCap = 'round'; ctx.lineWidth = 9; ctx.globalAlpha = Math.min(1, a);
  for (let s = -1; s <= 1; s += 2) for (let i = 0; i < 3; i++) { const r = 120 + i * 50 + (t * 200) % 50; ctx.beginPath(); ctx.arc(x, y, r, s > 0 ? -0.5 : Math.PI - 0.5, s > 0 ? 0.5 : Math.PI + 0.5); ctx.stroke(); }
  ctx.restore(); }
// a phone screen card with a post + comments
function phoneCard(k, t, lines, y = 560) { if (k <= 0) return; const a = eob(clamp(k)) * 0.78; ctx.save(); ctx.translate(360, y); ctx.scale(a, a); ctx.rotate(-0.03);
  ctx.fillStyle = '#1F1C33'; ctx.strokeStyle = INK; ctx.lineWidth = 10; ctx.beginPath(); ctx.roundRect(-250, -380, 500, 760, 50); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#FFFDF4'; ctx.beginPath(); ctx.roundRect(-220, -340, 440, 680, 26); ctx.fill();
  ctx.fillStyle = '#E3262E'; ctx.beginPath(); ctx.roundRect(-200, -320, 400, 190, 16); ctx.fill(); ctx.fillStyle = '#FFFFFF'; ctx.beginPath(); ctx.moveTo(-20, -255); ctx.lineTo(30, -225); ctx.lineTo(-20, -195); ctx.closePath(); ctx.fill();
  lines.forEach(([txt, col, at], i) => { const q = clamp((k - at) / 0.2); if (q <= 0) return; ctx.save(); ctx.globalAlpha = q; ctx.translate(0, -80 + i * 110 + (1 - q) * 20);
    ctx.fillStyle = col; ctx.beginPath(); ctx.arc(-170, 0, 30, 0, 7); ctx.fill(); ctx.fillStyle = '#EDE6D6'; ctx.beginPath(); ctx.roundRect(-125, -38, 320, 76, 18); ctx.fill();
    ctx.fillStyle = INK; ctx.font = '900 34px Inter'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillText(txt, -108, 2); ctx.restore(); });
  ctx.restore(); }

export function buildShots(E) {
  const S = [], CUES = [], add = (o) => (S.push(o), o), cue = (t, type, o = {}) => CUES.push({ t: +Math.max(0, t).toFixed(3), type, ...o });
  const cut = (i) => (i === 0 ? 0 : L(i) - 0.06);
  const { shoot } = makeShoot(E);
  const shake = (t, t0, a = 0.08) => { const k = t - t0; if (k < 0 || k > 0.35) return V3(0, 0, 0); const f = (1 - k / 0.35) * a; return V3(Math.sin(k * 90) * f, Math.cos(k * 70) * f, 0); };
  const buzz = (t, a) => V3(Math.sin(t * 97) * a, Math.cos(t * 83) * a, 0);

  // ── DESERT (golden hour) ──
  const sc = new THREE.Scene();
  WD.sky(sc, { top: '#3E5FA8', horizon: '#F6B985', ground: '#F6B985' });
  const sun = WD.sunlight(sc, E, { col: '#FFD3A0', i: 2.5, pos: [-9, 9, 5], target: [0, 0, -4], box: 14, sky: '#FFE2C4', ground: '#B8784A', hemi: 1.1 });
  WD.clouds(sc, [[-40, 26, -110, 14], [30, 34, -120, 18], [70, 22, -100, 10]], '#FFD0B8');
  const gr = new THREE.Mesh(new THREE.PlaneGeometry(400, 400), WD.mat({ map: WD.T.dirt('#D9A066', [60, 60], false) })); gr.rotation.x = -Math.PI / 2; gr.receiveShadow = true; sc.add(gr);
  // far ranges
  [[-60, -120, 40, 26], [0, -140, 55, 34], [60, -125, 45, 24], [-110, -110, 40, 18], [110, -115, 38, 20], [-25, -60, 18, 12], [35, -70, 22, 14]].forEach(([x, z, r, h], i) => {
    const m = new THREE.Mesh(new THREE.ConeGeometry(r, h, 7), WD.mat({ color: ['#B5734A', '#A35F3E', '#C4875A'][i % 3], flatShading: true })); m.position.set(x, h / 2 - 1, z); m.rotation.y = rnd(i) * 3; sc.add(m); });
  // the cliff with the M-shaped opening
  const rockM = WD.mat({ color: '#A8643A', flatShading: true });
  const cliff = new THREE.Group(); sc.add(cliff); cliff.position.set(0, 0, -8);
  const cb = new THREE.Mesh(new THREE.BoxGeometry(9, 5, 2.4), rockM); cb.position.set(0, 2.5, -0.6); cliff.add(cb);
  for (let i = 0; i < 9; i++) { const r = new THREE.Mesh(new THREE.DodecahedronGeometry(1.0 + rnd(i) * 0.9, 0), rockM); r.position.set(-4.4 + i * 1.1, 4.6 + rnd(i * 3) * 0.8, -0.6 + rnd(i * 5) * 0.4); r.rotation.set(rnd(i), rnd(i * 2), 0); r.castShadow = true; cliff.add(r); }
  const mTex = WD.canvasTex('mcave', 1024, 640, (g) => { g.fillStyle = '#A8643A'; g.fillRect(0, 0, 1024, 640); for (let i = 0; i < 900; i++) { g.fillStyle = `rgba(${90 + rnd(i) * 60},${50 + rnd(i * 2) * 30},30,0.35)`; g.fillRect(rnd(i * 3) * 1024, rnd(i * 7) * 640, 20 + rnd(i) * 40, 6 + rnd(i * 9) * 14); }
    g.fillStyle = '#120A08'; g.strokeStyle = '#5A3220'; g.lineWidth = 18; g.beginPath(); g.moveTo(280, 640); g.lineTo(300, 170); g.quadraticCurveTo(330, 120, 380, 170); g.lineTo(512, 360); g.lineTo(644, 170); g.quadraticCurveTo(694, 120, 724, 170); g.lineTo(744, 640); g.closePath(); g.fill(); g.stroke(); });
  const face = new THREE.Mesh(new THREE.PlaneGeometry(6.4, 4.0), WD.mat({ map: mTex })); face.position.set(0, 2.0, 0.62); cliff.add(face);
  cb.castShadow = true;
  // scattered rocks + cacti
  for (let i = 0; i < 26; i++) { const a = rnd(i * 4.1) * 6.28, r = 7 + rnd(i * 2.3) * 16; const x = Math.cos(a) * r, z = Math.sin(a) * r - 4; if (z > -10 && z < 2 && Math.abs(x) < 6) continue;
    const m = new THREE.Mesh(new THREE.DodecahedronGeometry(0.3 + rnd(i) * 0.7, 0), rockM); m.position.set(x, 0.1, z); m.castShadow = true; sc.add(m); }
  const cac = (x, z, s) => { const g = new THREE.Group(); const cm = WD.mat({ color: '#4E8A4A' }); const c1 = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.2, 2.2, 10), cm); c1.position.y = 1.1; g.add(c1);
    [[-1, 1.2], [1, 1.5]].forEach(([sx, y]) => { const a1 = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.5, 8), cm); a1.rotation.z = Math.PI / 2; a1.position.set(sx * 0.35, y, 0); g.add(a1); const a2 = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.7, 8), cm); a2.position.set(sx * 0.6, y + 0.3, 0); g.add(a2); });
    g.children.forEach((m) => (m.castShadow = true)); g.position.set(x, 0, z); g.scale.setScalar(s); sc.add(g); };
  [[-8.5, -9.5, 1.1], [7, -9, 1.3], [-11, -14, 1.4], [12, -3, 1.0], [-9, 2, 0.9]].forEach(([x, z, s]) => cac(x, z, s));
  // the parked car at the trailhead (far right) + the mine shaft (far left)
  const carM = WD.car('#F2F2EE'); carM.position.set(9, 0, 4); carM.rotation.y = -0.6; sc.add(carM); carM.children.forEach((m) => (m.castShadow = true));
  const mine = new THREE.Group(); const wood = WD.mat({ map: WD.T.planks('#7A4A2A') });
  const pit = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 1.6), new THREE.MeshBasicMaterial({ color: '#0E0806' })); pit.rotation.x = -Math.PI / 2; pit.position.y = 0.02; mine.add(pit);
  const sgn = WD.signBoard('OLD MINE', { w: 1.1, h: 0.4, bg: '#7A4A2A', fg: '#F2E6CF' }); sgn.position.set(1.4, 0.9, -0.6); mine.add(sgn); const sp = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.9, 0.08), wood); sp.position.set(1.4, 0.45, -0.66); mine.add(sp);
  [[0, -0.85, 1.9, 0.12], [0, 0.85, 1.9, 0.12]].forEach(([x, z, w, h]) => { const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.14), wood); b.position.set(x, h / 2, z); mine.add(b); });
  [[-0.85], [0.85]].forEach(([x]) => { const b = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.12, 1.9), wood); b.position.set(x, 0.06, 0); mine.add(b); });
  mine.children.forEach((m) => (m.castShadow = true)); mine.position.set(-12, 0, 3); sc.add(mine);
  const phone = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.03, 0.3), WD.mat({ color: '#2A2E36' })); phone.position.set(-10.4, 0.02, 4.3); phone.rotation.y = 0.5; sc.add(phone);
  const phoneG = new THREE.Mesh(new THREE.PlaneGeometry(0.13, 0.26), new THREE.MeshBasicMaterial({ color: '#7FE0FF' })); phoneG.rotation.x = -Math.PI / 2; phoneG.rotation.z = 0.5; phoneG.position.set(-10.4, 0.04, 4.3); sc.add(phoneG);

  const hiker = mk('hiker'), sr1 = mk('sr1'), sr2 = mk('sr2');
  const cast = [hiker, sr1, sr2]; cast.forEach((p) => sc.add(p.group));
  const only = (...keep) => cast.forEach((p) => { p.group.visible = keep.includes(p); p.mat.opacity = 1; });
  const CAVE = V3(0, 1.8, -7.4);
  const sunDir = (x, z) => { sun.key.target.position.set(x, 0, z); sun.key.position.set(x - 9, 9, z + 9); };

  // ── a small room for the online post ──
  const RM = WD.interior(E, { w: 8, depth: 6, h: 4, wall: '#4A5A7A', motif: '#5A6A8A', floor: '#8A5A3A', ceiling: '#2A3448', signText: null, picture: true, counterOn: false, litter: false });
  RM.sun.key.target.position.set(0, 0, -3); const hikerIn = mk('hiker'); RM.scene.add(hikerIn.group);

  // ═══ SHOTS ═══
  // 1a · frame 0: hiker shaking in front of the dark M-shaped cave; vibration rings; hook VIBRATING CAVE?
  { const st = 0, wv = Wd('vibrate,', 0);
    add({ id: 'S01a', at: st, note: 'frame 0: low angle push-in: the hiker shakes in front of a dark M-shaped cave in a golden desert cliff, yellow vibration rings; hook VIBRATING CAVE?', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); only(hiker); sunDir(0, -6);
      const j = 0.03 + 0.03 * k; hiker.at(-0.3 + Math.sin(t * 70) * j, 0, -5.0); hiker.set({ mood: 'shock', sweat: 1, armR: [150, -20], armL: [130, -40], lean: Math.sin(t * 50) * 4, look: [0, 0], blink: 0 });
      shoot(sc, cast, V3(0.6, 0.9, 0.2).add(buzz(t, 0.02)), V3(0.4, 1.1, -0.8).add(buzz(t, 0.03)), V3(-0.1, 2.0, -6.2), null, k, { ...LK.day, fov: 56 }, undefined, Math.sin(t * 40) * 0.01);
      blit(); hook(['VIBRATING', 'CAVE?'], 1, { y: 300, size: 132, hiLine: 1 }); vibes(500, 760, 0.6 + 0.4 * clamp((t - wv) / 0.3), t);
    } });
    cue(0, 'slam', { gain: 0.6 }); cue(wv, 'alarm', { dur: 0.6, gain: 0.25 }); }
  // 1a2 · "his whole body vibrate," closer: shaking hard
  { const st = Wd('whole', 0) - 0.1, wv = Wd('vibrate,', 0);
    add({ id: 'S01a2', at: st, note: 'punch-in medium shot: the hiker shakes hard in front of the dark cave mouth, sweat flying, big vibration rings; hook stays', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); only(hiker); sunDir(0, -6);
      hiker.at(-0.3 + Math.sin(t * 80) * 0.06, 0, -5.0); hiker.set({ mood: 'shock', sweat: 1, armR: [150, -150], armL: [150, -150], lean: Math.sin(t * 60) * 6, blink: 0 });
      shoot(sc, cast, V3(-0.6, 1.5, -2.6).add(buzz(t, 0.04)), V3(-0.4, 1.6, -3.1).add(buzz(t, 0.05)), V3(-0.3, 1.4, -5.0), null, k, { ...LK.day, fov: 54 }, undefined, -0.1);
      blit(); hook(['VIBRATING', 'CAVE?'], 1, { y: 300, size: 132, hiLine: 1 }); vibes(540, 820, 1, t);
    } });
    cue(st, 'whoosh', { gain: 0.4 }); }
  // 1b · "and then he vanished." the hiker fades away; dust; stamp VANISHED
  { const st = Wd('and', 0) - 0.08, wv = Wd('vanished.', 0);
    add({ id: 'S01b', at: st, note: 'wide pull-back: the hiker flickers and fades out in front of the cave; dust swirls; stamp VANISHED', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); only(hiker); sunDir(0, -6);
      hiker.at(-0.3, 0, -5.0); hiker.set({ mood: 'worried', armR: [20, 10], armL: [20, 10], blink: blink(t) }); const f = clamp((t - wv) / 0.4); hiker.mat.opacity = (1 - f) * (f > 0 && Math.sin(t * 60) > 0 ? 0.5 : 1);
      shoot(sc, cast, V3(0.5, 1.4, -1.6), V3(0.8, 2.2, 0.6), V3(0, 1.6, -6.4), null, k, { ...LK.day, fov: 54 });
      blit(); stamp(['VANISHED'], (t - wv) / 0.2, { y: 380, size: 110, col: '#E3262E' });
      for (let i = 0; i < 10; i++) { const q = clamp((t - wv) / 0.8); if (q <= 0) break; ctx.save(); ctx.globalAlpha = 0.6 * (1 - q); ctx.fillStyle = '#E8C8A0'; ctx.beginPath(); ctx.arc(520 + Math.cos(i) * 160 * q, 1000 - Math.sin(i * 2) * 120 * q, 30 + 30 * q, 0, 7); ctx.fill(); ctx.restore(); }
    } });
    cue(wv, 'whoosh', { gain: 0.6 }); cue(wv + 0.1, 'stamp', { gain: 0.6 }); }

  // 2a · "In 2014, Las Vegas hiker Kenny Veach" in a room with his phone; ribbon 2014 · LAS VEGAS
  { const st = cut(1), w14 = Wd('twenty', 1), wk = Wd('kenny', 1);
    add({ id: 'S02a', at: st, note: 'cosy evening room: the hiker (same toon) taps on his phone, grinning; ribbon 2014 · LAS VEGAS, then pill KENNY VEACH, HIKER', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d));
      hikerIn.at(-0.4, 0, -3.0); hikerIn.set({ mood: 'smug', armR: [80, -90], holdR: P2.phone, v: 'ph', armL: [20, 10], look: [0.5, 0.3], blink: blink(t) });
      shoot(RM.scene, [hikerIn], V3(1.2, 1.5, 0.8), V3(0.6, 1.5, 0.1), V3(-0.4, 1.4, -3.0), null, k, { ...LK.room, fov: 50 });
      blit(); if (lt < 0.18) speedLines(1 - lt / 0.18, 3); ribbon('2014 · LAS VEGAS', (t - w14) / 0.3, 300, 76); pill('KENNY VEACH, HIKER', (t - wk) / 0.25, 470, 'rgba(31,28,51,0.9)', 56);
    } });
    cue(st, 'whoosh', { gain: 0.5 }); cue(w14 + 0.2, 'stamp', { gain: 0.6 }); cue(wk, 'pop', { gain: 0.5 }); }
  // 2b · "wrote about it online," phone card pops up with a post about an M cave
  { const st = Wd('wrote', 1) - 0.1;
    add({ id: 'S02b', at: st, note: 'a giant phone pops up over the room: a video post and a comment card M-SHAPED CAVE...', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d));
      hikerIn.at(-0.4, 0, -3.0); hikerIn.set({ mood: 'happy', armR: [80, -90], holdR: P2.phone, v: 'ph', armL: [20, 10], talk: talk(t), blink: blink(t) });
      shoot(RM.scene, [hikerIn], V3(-0.2, 1.5, 0.3), V3(-0.4, 1.6, -0.2), V3(-0.75, 1.7, -3.0), null, k, { ...LK.room, fov: 50 });
      blit(); phoneCard((t - st) / 0.3, t, [['M-SHAPED CAVE...', '#C9603F', 1.2]]);
    } });
    cue(st, 'pop', { gain: 0.6 }); }

  // 3a · "a cave with an M-shaped entrance," crane up to the cave mouth; ribbon M-SHAPED ENTRANCE
  { const st = cut(2), wm = Wd('m-shaped', 2);
    add({ id: 'S03a', at: st, note: 'empty desert: slow crane-up and push toward the dark M-shaped cave mouth in the cliff; a big yellow M traces the opening; ribbon M-SHAPED ENTRANCE', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); only(); sunDir(0, -6);
      shoot(sc, cast, V3(1.2, 0.6, -0.5), V3(0.4, 1.6, -2.6), CAVE, null, k, { ...LK.day, fov: 52 });
      blit(); ribbon('M-SHAPED ENTRANCE', (t - wm) / 0.3, 300, 72);
      const q = clamp((t - wm) / 0.6); if (q > 0) { ctx.save(); ctx.strokeStyle = '#FFD43B'; ctx.lineWidth = 16; ctx.lineJoin = 'round'; ctx.setLineDash([2000]); ctx.lineDashOffset = 2000 * (1 - q); ctx.beginPath(); ctx.moveTo(300, 1000); ctx.lineTo(340, 640); ctx.lineTo(540, 840); ctx.lineTo(740, 640); ctx.lineTo(780, 1000); ctx.stroke(); ctx.restore(); }
    } });
    cue(st, 'slide', { dur: 0.6, gain: 0.4 }); cue(wm, 'zip', { dur: 0.5, gain: 0.5 }); }
  // 3b · "out in the Nevada desert." high aerial over the desert; pill NEVADA DESERT
  { const st = Wd('out', 2) - 0.1, wn = Wd('nevada', 2);
    add({ id: 'S03b', at: st, note: 'high aerial drone pull-out over the empty desert, cliff and cacti, mountains on the horizon; pill NEVADA DESERT', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); only(); sunDir(0, -4);
      shoot(sc, cast, V3(4, 6, 6), V3(7, 11, 12), V3(0, 0, -6), null, k, { ...LK.day, fov: 54 });
      blit(); pill('NEVADA DESERT', (t - wn) / 0.25, 300, 'rgba(31,28,51,0.9)', 62);
    } });
    cue(st, 'whoosh', { gain: 0.4 }); cue(wn, 'pop', { gain: 0.5 }); }

  // 4a · "The closer he got," the hiker walks toward the cave; a vibration meter rises
  { const st = cut(3), ws = Wd('stronger', 3);
    add({ id: 'S04a', at: st, note: 'tracking from behind-side: the hiker walks toward the cave with a stick, camera shakes more and more; VIBRATION meter rises', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); only(hiker); sunDir(0, -5);
      const z = lerp(-1.5, -4.2, clamp(lt / d)); hiker.at(-0.6, 0, z); hiker.set({ mood: 'worried', legs: 'walk', phase: t * 6, armR: [40, -30], holdR: stick, v: 's', armL: [20, 10], look: [0, 0.4], blink: blink(t) });
      const b = lerp(0.005, 0.05, clamp(lt / d)); shoot(sc, cast, V3(0.5, 1.7, z + 3.2).add(buzz(t, b)), V3(0.5, 1.7, z + 3.2).add(buzz(t, b)), V3(-0.5, 1.3, z - 2.8), null, 0, { ...LK.day, fov: 54 });
      blit(); const m = clamp(lt / d); ctx.save(); ctx.translate(540, 300); ctx.fillStyle = 'rgba(31,28,51,0.9)'; ctx.strokeStyle = INK; ctx.lineWidth = 6; ctx.beginPath(); ctx.roundRect(-330, -60, 660, 120, 60); ctx.fill(); ctx.stroke();
      ctx.fillStyle = m > 0.7 ? '#E3262E' : '#F2C230'; ctx.beginPath(); ctx.roundRect(-310, -40, 620 * Math.max(0.05, m), 80, 40); ctx.fill(); ctx.fillStyle = '#FFFFFF'; ctx.font = '900 46px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('VIBRATION', 0, 2); ctx.restore();
      vibes(540, 760, m, t);
    } });
    cue(st, 'alarm', { dur: 2.2, gain: 0.2 }); cue(ws, 'zip', { gain: 0.4 }); }
  // 4b · "it shook him," extreme close + Dutch, dizzy
  { const st = Wd('shook', 3) - 0.1;
    add({ id: 'S04b', at: st, note: 'close Dutch angle: the hiker shakes hard, dizzy face, stars; red tint pulse; heavy camera buzz', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); only(hiker); sunDir(0, -5);
      hiker.at(-0.6 + Math.sin(t * 80) * 0.05, 0, -4.2); hiker.set({ mood: 'dizzy', sweat: 1, armR: [150, -150], armL: [150, -150], lean: Math.sin(t * 60) * 8, blink: 0 });
      shoot(sc, cast, V3(0.4, 1.6, -1.6).add(buzz(t, 0.05)), V3(0.2, 1.6, -2.0).add(buzz(t, 0.05)), V3(-0.6, 1.5, -4.2), null, k, { ...LK.day, fov: 52 }, undefined, 0.15);
      blit(); tint(0.5 + 0.5 * Math.sin(t * 20), '#E3262E'); stars(540, 560, ((t - st) * 1.5) % 1);
    } });
    cue(st, 'thud', { gain: 0.6 }); }

  // 5 · "so he ran back to his car." runs away, speed lines, toward the white car
  { const st = cut(4), wc = Wd('car.', 4);
    add({ id: 'S05', at: st, note: 'wide whip-pan: the hiker sprints away from the cliff toward a white car at the trailhead, speed lines, dust puffs', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); only(hiker); sunDir(5, 0);
      const f = clamp(lt / d); hiker.at(lerp(2.0, 7.0, f), 0, lerp(-1.0, 2.6, f)); hiker.set({ mood: 'shock', legs: 'run', phase: t * 12, armR: [90, -60], armL: [90, -60], lean: 12, sweat: 1, blink: 0 });
      shoot(sc, cast, V3(2.0, 1.8, 7.6), V3(4.6, 1.6, 8.4), V3(lerp(2.6, 6.6, f), 1.0, lerp(-1, 2.4, f)), null, 0, { ...LK.day, fov: 54 });
      blit(); speedLines(0.7, Math.floor(t * 8)); pill('HE RAN', (t - st - 0.2) / 0.25, 300, 'rgba(31,28,51,0.9)', 62); stars(600, 900, (t - wc) / 0.5);
    } });
    cue(st, 'whoosh', { gain: 0.6 }); cue(wc, 'thud', { gain: 0.5 }); }

  // 6a · "People wanted proof," comments flood in on the phone card
  { const st = cut(5);
    add({ id: 'S06a', at: st, note: 'room: the hiker frowns at his phone; on a giant phone, comment bubbles flood in: PROOF?? / PICS OR IT\'S FAKE / WHERE IS IT?', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d));
      hikerIn.at(-0.4, 0, -3.0); hikerIn.set({ mood: 'angry', armR: [80, -90], holdR: P2.phone, v: 'ph', armL: [40, -40], blink: blink(t) });
      shoot(RM.scene, [hikerIn], V3(-0.6, 1.4, 0.6), V3(-0.4, 1.5, 0.0), V3(-0.75, 1.7, -3.0), null, k, { ...LK.room, fov: 50 });
      blit(); phoneCard(1 + lt * 1.6, t, [['PROOF??', '#3C6FB6', 1.0], ['PICS OR IT\'S FAKE', '#2FB35A', 1.25], ['WHERE IS IT?', '#8C6FC9', 1.5]]);
    } });
    cue(st, 'pop', { gain: 0.5 }); cue(st + 0.3, 'pop', { gain: 0.5 }); cue(st + 0.5, 'pop', { gain: 0.5 }); }
  // 6b · "so he went back to find it." hikes back toward the cliff with a stick; pill BACK TO FIND IT
  { const st = Wd('so', 5) - 0.1, wf = Wd('find', 5);
    add({ id: 'S06b', at: st, note: 'low angle: the hiker marches back across the desert toward the cliff with his stick, determined; pill HE WENT BACK', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); only(hiker); sunDir(-2, -2);
      hiker.at(lerp(-3.9, -2.6, clamp(lt / d)), 0, -1.6); hiker.set({ mood: 'proud', legs: 'walk', phase: t * 6, armR: [40, -30], holdR: stick, v: 's', armL: [30, -20], blink: blink(t) });
      shoot(sc, cast, V3(-1.0, 0.5, 2.0), V3(-0.6, 0.7, 1.4), V3(-3.2, 1.6, -2.4), null, k, { ...LK.day, fov: 54 });
      blit(); pill('HE WENT BACK', (t - wf + 0.2) / 0.25, 300, 'rgba(31,28,51,0.9)', 62);
    } });
    cue(st, 'whoosh', { gain: 0.4 }); cue(wf, 'pop', { gain: 0.5 }); }

  // 7a · "On November tenth, he set out again," calendar NOV 10, 2014; hiker walks off at sunset
  { const st = cut(6), wn = Wd('november', 6);
    add({ id: 'S07a', at: st, note: 'sunset tint: the hiker walks away from camera toward the mountains; calendar card NOV 10, 2014 slams in', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); only(hiker); sunDir(-4, -6);
      hiker.at(-3.0, 0, lerp(-3.0, -5.0, clamp(lt / d))); hiker.set({ mood: 'neutral', legs: 'walk', phase: t * 6, armR: [40, -30], holdR: stick, v: 's', armL: [20, 10], blink: blink(t) });
      shoot(sc, cast, V3(-1.6, 1.4, 1.2), V3(-2.0, 1.6, 0.4), V3(-3.2, 1.4, -4.4), null, k, { ...LK.day, fov: 52 });
      blit(); tint(0.9, '#E86A3A'); calCard('NOV', '10', 540, 400, eob(clamp((t - wn) / 0.25)), -0.06); pill('2014', (t - wn - 0.3) / 0.25, 640, 'rgba(31,28,51,0.9)', 60);
    } });
    cue(wn, 'slam', { gain: 0.7 }); }
  // 7b · "and never came home." empty desert at dusk, only his stick in the sand; stamp NEVER CAME HOME
  { const st = Wd('and', 6) - 0.1, wnv = Wd('never', 6);
    add({ id: 'S07b', at: st, note: 'same spot, now empty and darker blue: slow push-in on the empty trail toward the cliff; stamp NEVER CAME HOME', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); only(); sunDir(-4, -6);
      shoot(sc, cast, V3(-2.0, 1.6, 0.4), V3(-2.4, 1.5, -0.6), V3(-3.0, 1.6, -6.0), null, k, { ...LK.day, fov: 52 });
      blit(); tint(1, '#2A3A8A'); stamp(['NEVER', 'CAME HOME'], (t - wnv) / 0.2, { y: 420, size: 92, col: '#E3262E' });
    } });
    cue(wnv, 'stamp', { gain: 0.7 }); }

  // 8 · "Follow for more unsolved mysteries." a searcher points at the viewer; subscribe
  { const st = cut(7);
    add({ id: 'S08', at: st, note: 'a searcher in an orange vest turns to the viewer and points, desert behind; SUBSCRIBE button pressed', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); only(sr1); sunDir(4, 1);
      sr1.at(4.0, 0, 1.0); sr1.set({ mood: 'happy', armR: [95, 0], armL: [20, 10], talk: talk(t), blink: blink(t) });
      shoot(sc, cast, V3(4.6, 1.5, 4.2), V3(4.4, 1.5, 3.4), V3(4.0, 1.4, 1.0), null, k, { ...LK.day, fov: 50 });
      blit(); subscribe(lt / 0.45 + (lt > 0.8 ? (lt - 0.8) * 1.4 : 0), t, 330);
    } });
    cue(st, 'pop', { gain: 0.6 }); cue(st + 1.25, 'ding', { gain: 0.6 }); }

  // 9a · "Searchers found his car," two searchers by the white car; pill HIS CAR
  { const st = cut(8), wc = Wd('car,', 8);
    add({ id: 'S09a', at: st, note: 'orbit: two searchers in orange vests walk up to the empty white car at the trailhead, one with a flashlight; pill HIS CAR', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); only(sr1, sr2); sunDir(9, 4);
      sr1.at(lerp(5.6, 6.6, eo(clamp(lt / 0.8))), 0, 5.2); sr1.set({ mood: 'worried', legs: lt < 0.8 ? 'walk' : 'stand', phase: t * 7, armR: [70, -20], holdR: torch, v: 't', armL: [20, 10], blink: blink(t) });
      sr2.at(lerp(5.2, 6.0, eo(clamp(lt / 0.8))), 0, 6.6); sr2.set({ mood: 'sad', legs: lt < 0.8 ? 'walk' : 'stand', phase: t * 7 + 1, armR: [20, 10], armL: [20, 10], blink: blink(t, 1) });
      const a = lerp(0.2, -0.2, k), cp = V3(7.6 + Math.sin(a) * 7.0, 2.0, 5.0 + Math.cos(a) * 7.0); shoot(sc, cast, cp, cp, V3(6.7, 1.0, 5.6), null, 0, { ...LK.day, fov: 52 });
      blit(); pill('HIS CAR', (t - wc) / 0.25, 300, 'rgba(31,28,51,0.9)', 66);
    } });
    cue(st, 'slide', { dur: 0.6, gain: 0.4 }); cue(wc, 'pop', { gain: 0.5 }); }
  // 9b · "then his phone, near an old mine shaft." phone in the dirt beside a mine shaft
  { const st = Wd('then', 8) - 0.1, wp = Wd('phone,', 8), wm = Wd('mine', 8);
    add({ id: 'S09b', at: st, note: 'crane down to a phone lying in the dirt; pan to the wooden frame of an old mine shaft; pill HIS PHONE, then ribbon OLD MINE SHAFT', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); only(); sunDir(-11, 3);
      shoot(sc, cast, V3(-9.4, 1.6, 6.2), V3(-10.0, 2.2, 7.4), V3(-10.4, 0.1, 4.3), V3(-12, 0.8, 3), k, { ...LK.day, fov: 50 });
      blit(); pill('HIS PHONE', (t - wp) / 0.25, 300, 'rgba(31,28,51,0.9)', 66); stars(540, 900, (t - wp) / 0.6); ribbon('OLD MINE SHAFT', (t - wm) / 0.3, 460, 70);
    } });
    cue(wp, 'ding', { gain: 0.6 }); cue(wm, 'stamp', { gain: 0.5 }); }

  // 10a · "Kenny was never found," aerial search: searchers tiny in the vast desert; stamp NEVER FOUND
  { const st = cut(9), wn = Wd('found,', 9);
    add({ id: 'S10a', at: st, note: 'very high aerial: two tiny searchers in a huge empty desert, ? marks pop; stamp NEVER FOUND', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); only(sr1, sr2); sunDir(0, 0);
      sr1.at(-2.0, 0, 0.5); sr1.set({ mood: 'sad', armR: [60, -20], holdR: torch, v: 't', armL: [20, 10], blink: blink(t) }); sr2.at(1.4, 0, -0.6); sr2.set({ mood: 'worried', armL: [150, -120], armR: [20, 10], blink: blink(t, 1) });
      shoot(sc, cast, V3(0, 9, 9), V3(0, 13, 12), V3(0, 0, -1), null, k, { ...LK.day, fov: 54 });
      blit(); [[300, 760], [760, 700]].forEach(([x, y], i) => mark('?', x, y, (t - st - i * 0.2) / 0.3)); stamp(['NEVER FOUND'], (t - wn) / 0.2, { y: 400, size: 96, col: '#E3262E' });
    } });
    cue(st, 'whoosh', { gain: 0.5 }); cue(wn, 'stamp', { gain: 0.7 }); }
  // 10b · "and neither was the cave, the one where" push into the empty cave mouth; hook returns -> loops to frame 0
  { const st = Wd('and', 9) - 0.1, wc = Wd('cave,', 9);
    add({ id: 'S10b', at: st, note: 'loop: slow push into the empty M-shaped cave mouth, golden light; hook VIBRATING CAVE? returns', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); only(); sunDir(0, -6);
      shoot(sc, cast, V3(2.2, 0.7, 1.4), V3(0.4, 1.1, -1.4), V3(-0.1, 2.0, -6.4), null, k, { ...LK.day, fov: 56 }, undefined, lerp(0.1, 0, k));
      blit(); hook(['VIBRATING', 'CAVE?'], (t - wc) / 0.3, { y: 300, size: 132, hiLine: 1 }); vibes(540, 900, clamp((t - wc - 0.3) / 0.5) * 0.7, t);
    } });
    cue(st, 'slide', { dur: 0.6, gain: 0.4 }); cue(wc, 'pop', { gain: 0.6 }); }

  return { shots: S, cues: CUES };
}
