// THE JFK WITNESS NO ONE EVER FOUND (the "Babushka Lady", Dallas, Nov 22 1963) — Tall Tale 3D, mystery tone, US audience.
// Respectful: no shooting, no victims, no real likeness. The motorcade is three plain dark cars seen from a distance.
// The woman's face is always hidden behind her camera (she was never identified).
import * as THREE from 'three';
import { ctx, clamp, lerp, eo, eio, eob } from './core/lib.js';
import { L, Le, Wd, T } from './core/timing.js';
import * as WD from './core/world.js';
import * as PR from './core/props.js';
import { Toon, PROPS, INK } from './core/toon.js';
import { V3, talk, blink, hook, ribbon, pill, stamp, calCard, flash, tint, speedLines, stars, mark, subscribe, makeShoot, LK } from './jh.js';

const LOOKS = {
  lady: { body: '#B8946A', pattern: 'plain', hat: 'scarf', hatCol: '#C9B79A', neck: 'none' },
  c1: { body: '#5C6F8F', hat: 'bowler', hatCol: '#2A2638', neck: 'tie', neckCol: '#D8343F' },
  c2: { body: '#D8584A', hat: 'none', neck: 'collar', neckCol: '#F4EFE4' },
  c3: { body: '#4FB3A9', hat: 'cap', hatCol: '#2E4E8A', kid: true },
  c4: { body: '#8C6FC9', hat: 'bun', hatCol: '#6B4A3A', neck: 'collar', neckCol: '#F4EFE4' },
  c5: { body: '#6A7A5A', hat: 'boater', hatCol: '#E9D7A5', neck: 'bowtie', neckCol: '#F2C230', extra: ['glasses'] },
  agent: { body: '#2E3A5A', pattern: 'vest', patCol: '#1E2840', hat: 'bowler', hatCol: '#1A1A20', neck: 'tie', neckCol: '#1A1A20', extra: ['mustache'] },
  claim: { body: '#E07AA0', pattern: 'plain', hat: 'bow', hatCol: '#F2C230', neck: 'collar', neckCol: '#FFFFFF' },
  inv1: { body: '#5C6F8F', pattern: 'vest', patCol: '#3A4A6A', hat: 'none', neck: 'tie', neckCol: '#2E8A5A', extra: ['glasses'] },
  inv2: { body: '#8A5A6A', hat: 'bun', hatCol: '#3A2A22', neck: 'collar', neckCol: '#F4EFE4', extra: ['glasses'] },
};
const mk = (k, o) => new Toon({ ...LOOKS[k], extra: [...(LOOKS[k].extra || [])] }, o);
const mag = (g, x, y) => { g.save(); g.translate(x, y - 50); g.strokeStyle = INK; g.lineWidth = 6; g.fillStyle = '#7A4A2A'; g.save(); g.rotate(0.6); g.fillRect(-8, 20, 16, 70); g.strokeRect(-8, 20, 16, 70); g.restore();
  g.fillStyle = 'rgba(190,230,255,0.7)'; g.beginPath(); g.arc(0, 0, 40, 0, 7); g.fill(); g.lineWidth = 9; g.strokeStyle = '#C9A13B'; g.stroke(); g.restore(); };

// old-photo look: sepia wash + white border + a red circle around a point
function photoLook(k, cx, cy, ring) {
  if (k <= 0) return; ctx.save(); ctx.globalAlpha = Math.min(1, k) * 0.45; ctx.fillStyle = '#8A6A3A'; ctx.globalCompositeOperation = 'color'; ctx.fillRect(0, 0, 1080, 1920); ctx.restore();
  ctx.save(); ctx.globalAlpha = Math.min(1, k); ctx.strokeStyle = '#FFFDF4'; ctx.lineWidth = 60; ctx.strokeRect(30, 30, 1020, 1860); ctx.restore();
  if (ring > 0) { ctx.save(); ctx.strokeStyle = '#E3262E'; ctx.lineWidth = 12; ctx.lineCap = 'round'; ctx.beginPath(); ctx.ellipse(cx, cy, 120, 190, -0.1, -1.6, -1.6 + Math.PI * 2 * clamp(ring)); ctx.stroke(); ctx.restore(); }
}
// a big home-movie camera card with a label
function camCard(k, label, x = 540, y = 560) {
  if (k <= 0) return; const a = eob(clamp(k)); ctx.save(); ctx.translate(x, y); ctx.scale(a, a); ctx.rotate(-0.05); ctx.strokeStyle = INK; ctx.lineWidth = 10;
  ctx.fillStyle = '#3A3A44'; ctx.beginPath(); ctx.roundRect(-230, -140, 380, 280, 26); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#5A5A66'; ctx.beginPath(); ctx.roundRect(-170, -220, 200, 90, 14); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#22222A'; ctx.beginPath(); ctx.roundRect(150, -90, 140, 180, 16); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#7FB6E0'; ctx.beginPath(); ctx.arc(220, 0, 56, 0, 7); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#F2C230'; ctx.beginPath(); ctx.roundRect(-225, 40, 350, 70, 12); ctx.fill(); ctx.lineWidth = 6; ctx.stroke();
  ctx.fillStyle = INK; ctx.font = '900 46px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(label, -50, 77); ctx.restore();
}

export function buildShots(E) {
  const S = [], CUES = [], add = (o) => (S.push(o), o), cue = (t, type, o = {}) => CUES.push({ t: +Math.max(0, t).toFixed(3), type, ...o });
  const cut = (i) => (i === 0 ? 0 : L(i) - 0.06);
  const { shoot } = makeShoot(E);
  const shake = (t, t0, a = 0.08) => { const k = t - t0; if (k < 0 || k > 0.35) return V3(0, 0, 0); const f = (1 - k / 0.35) * a; return V3(Math.sin(k * 90) * f, Math.cos(k * 70) * f, 0); };

  // ── PLAZA: grass, a road along x at z -7, brick buildings behind, crowd on both sides ──
  const M = WD.meadow(E, { fenceOn: false, flowers: false, treesOn: false });
  const road = new THREE.Mesh(new THREE.PlaneGeometry(120, 5), WD.mat({ color: '#6A6A72' })); road.rotation.x = -Math.PI / 2; road.position.set(0, 0.03, -7); road.receiveShadow = true; M.scene.add(road);
  [-1, 1].forEach((s) => { const c = new THREE.Mesh(new THREE.BoxGeometry(120, 0.12, 0.25), WD.mat({ color: '#D9D2C2' })); c.position.set(0, 0.06, -7 + s * 2.6); M.scene.add(c); });
  for (let i = 0; i < 6; i++) { const h = 10 + (i % 3) * 3; const b = new THREE.Mesh(new THREE.BoxGeometry(9, h, 7), WD.mat({ map: WD.T.brick(['#9E4A3A', '#B5653C', '#8A3A2E'][i % 3], [3, h / 3]) })); b.position.set(-40 + i * 16, h / 2, -48); b.castShadow = true; M.scene.add(b); }
  [[-9, -16], [8, -15], [16, -18], [-17, -17]].forEach(([x, z]) => { const t = WD.tree(1.2, '#4E9A3C'); t.position.set(x, 0, z); M.scene.add(t); });
  M.sun.key.target.position.set(0, 0, -5); M.sun.key.position.set(8, 14, 6);
  const cars = ['#1E2230', '#1E2230', '#2A2E3A'].map((c) => { const v = WD.car(c); v.rotation.y = Math.PI / 2; M.scene.add(v); return v; });
  const motorcade = (x0) => cars.forEach((v, i) => v.position.set(x0 - i * 5.5, 0, -7.4));
  const lady = mk('lady'), crowd = ['c1', 'c2', 'c3', 'c4', 'c5', 'c1', 'c4'].map((k) => mk(k, k === 'c3' ? { height: 1.35 } : {}));
  const agent = mk('agent'), claim = mk('claim');
  const ppl = [lady, ...crowd, agent, claim]; ppl.forEach((p) => M.scene.add(p.group));
  const CROWD = [[-5.2, -3.6], [-3.6, -3.9], [-1.9, -3.5], [2.4, -3.8], [4.0, -3.5], [-4.2, -10.6], [3.2, -10.8]];
  const placeCrowd = (t, wave = 1) => crowd.forEach((p, i) => { p.group.visible = true; p.at(CROWD[i][0], 0, CROWD[i][1]); p.set({ mood: 'happy', armR: wave ? [lerp(110, 160, Math.abs(Math.sin(t * 6 + i))), 10] : [20, 10], armL: [20, 10], blink: blink(t, i) }); });
  const only = (...keep) => ppl.forEach((p) => (p.group.visible = keep.includes(p)));
  const LADY = V3(0.4, 0, -3.7);

  // ── OFFICE (1979 investigators) ──
  const R = WD.interior(E, { w: 9, depth: 7, h: 4.0, wall: '#3A4A5A', motif: '#44566A', floor: '#6A4A32', ceiling: '#2A3442', signText: null, picture: false, counterOn: false, litter: false });
  [[-3.2, -5.6], [-2.4, -5.8], [-3.0, -5.6, 0.7], [2.8, -5.6], [3.4, -5.0]].forEach(([x, z, y = 0]) => { const b = WD.crate(0.7); b.position.set(x, y, z); R.scene.add(b); });
  R.sun.key.target.position.set(0, 0, -4); R.sun.key.position.set(2, 6, 0);
  const inv1 = mk('inv1'), inv2 = mk('inv2'); const office = [inv1, inv2]; office.forEach((p) => R.scene.add(p.group));

  // ═══ SHOTS ═══
  // 1a · frame 0: the woman in a headscarf films with her camera over her face; cars pass behind; hook WHO IS SHE?
  { const st = 0, wj = Wd('jfk', 0);
    add({ id: 'S01a', at: st, note: 'frame 0: a woman in a tan coat and headscarf holds a home-movie camera over her face on the grass; three dark cars glide past behind; crowd waving; hook WHO IS SHE?', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); only(lady, ...crowd); placeCrowd(t); motorcade(lerp(-2, 6, clamp(t / 4.4)));
      lady.at(LADY.x, 0, LADY.z); lady.set({ mood: 'neutral', faceCam: 1, armL: [20, 10], armR: [20, 10] });
      shoot(M.scene, ppl, V3(1.2, 1.4, 0.6), V3(0.9, 1.5, -0.4), V3(0.2, 1.5, -4.4), null, k, { ...LK.day, fov: 52 });
      blit(); hook(['WHO IS', 'SHE?'], 1, { y: 300, size: 150, hiLine: 1 });
    } });
    cue(0, 'tock', { gain: 0.5 }); cue(wj, 'heartbeat', { gain: 0.5 }); }
  // 1b · "up close, and nobody knows who she was." orbit around her, big ? on "nobody", pill NEVER IDENTIFIED
  { const st = Wd('up', 0) - 0.1, wn = Wd('nobody', 0);
    add({ id: 'S01b', at: st, note: 'camera orbits to her other side, still filming with her face hidden; a big ? pops on "nobody"; pill NEVER IDENTIFIED', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); only(lady, ...crowd); placeCrowd(t); motorcade(lerp(2, 9, clamp(lt / d)));
      lady.at(LADY.x, 0, LADY.z); lady.set({ mood: 'neutral', faceCam: 1, armL: [20, 10], armR: [20, 10] });
      const a = lerp(-0.7, -0.25, k), cp = V3(LADY.x + Math.sin(a) * 3.2, 1.5, LADY.z + Math.cos(a) * 3.2);
      shoot(M.scene, ppl, cp, cp, V3(LADY.x, 1.4, LADY.z), null, 0, { ...LK.day, fov: 48 }, undefined, lerp(0, -0.06, k));
      blit(); mark('?', 800, 420, (t - wn) / 0.3); pill('NEVER IDENTIFIED', (t - wn - 0.2) / 0.25, 300, 'rgba(160,30,40,0.92)', 60);
    } });
    cue(wn, 'boing', { gain: 0.5 }); }

  // 2a · "Dallas," aerial crane down over the plaza; ribbon DALLAS, TEXAS
  { const st = cut(1), wd = Wd('dallas', 1);
    add({ id: 'S02a', at: st, note: 'high crane down over the grassy plaza, the road, brick buildings and the waving crowd; gold ribbon DALLAS, TEXAS', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); only(lady, ...crowd); placeCrowd(t); motorcade(-12 + lt * 3);
      lady.at(LADY.x, 0, LADY.z); lady.set({ faceCam: 1, armL: [20, 10], armR: [20, 10] });
      shoot(M.scene, ppl, V3(-6, 16, 10), V3(-4, 8, 7), V3(0, 0, -8), null, k, { ...LK.day, fov: 54 });
      blit(); ribbon('DALLAS, TEXAS', (t - wd) / 0.3, 330, 80);
    } });
    cue(st, 'whoosh', { gain: 0.5 }); cue(wd + 0.1, 'stamp', { gain: 0.6 }); }
  // 2b · "November twenty-second, nineteen sixty-three." the dark cars roll past at street level; calendar NOV 22 -> 1963
  { const st = Wd('november', 1) - 0.1, wy = Wd('nineteen', 1);
    add({ id: 'S02b', at: st, note: 'street level: three dark cars roll slowly past the crowd, camera tracks with them; calendar card NOV 22 slams, then 1963', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); only(...crowd); placeCrowd(t); crowd.forEach((p, i) => (p.group.visible = i >= 5)); const x0 = lerp(-6, 4, clamp(lt / d)); motorcade(x0);
      shoot(M.scene, ppl, V3(x0 - 9, 1.2, -1.0).add(shake(t, wy + 0.1)), V3(x0 - 7, 1.0, -1.2), V3(x0 - 5, 1.0, -7.4), null, k, { ...LK.day, fov: 50 });
      blit(); calCard(t < wy ? 'NOV' : 'NOV 22', t < wy ? '22' : '1963', 540, 440, eob(clamp((t - st - 0.1) / 0.25)), -0.05);
    } });
    cue(st + 0.1, 'slam', { gain: 0.6 }); cue(wy + 0.1, 'slam', { gain: 0.7 }); }

  // 3a · "In the photos," freeze into an old photo: sepia, white border, red circle drawn around her
  { const st = cut(2), wp = Wd('photos', 2);
    add({ id: 'S03a', at: st, note: 'the scene freezes into an old photo (sepia wash, white border) from across the road; a red circle draws itself around the woman in the headscarf', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); only(lady, ...crowd); placeCrowd(st, 1); motorcade(30);
      lady.at(LADY.x, 0, LADY.z); lady.set({ faceCam: 1, armL: [20, 10], armR: [20, 10] });
      shoot(M.scene, ppl, V3(1.0, 1.6, -12.5), V3(0.8, 1.6, -11.8), V3(0.2, 1.0, -3.6), null, k, { ...LK.day, fov: 46 });
      blit(); if (lt < 0.12) flash(1 - lt / 0.12); photoLook(1, 470, 860, (t - wp) / 0.5);
    } });
    cue(st, 'tock', { gain: 0.7 }); cue(wp, 'slide', { dur: 0.5, gain: 0.4 }); }
  // 3b · "a woman in a tan coat and headscarf" push in on her, labels pop: TAN COAT / HEADSCARF
  { const st = Wd('woman', 2) - 0.1, wc = Wd('coat', 2), wh = Wd('headscarf', 2);
    add({ id: 'S03b', at: st, note: 'still in sepia: push in on the woman; pills TAN COAT and HEADSCARF pop in on their words', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); only(lady, ...crowd); placeCrowd(st, 1); motorcade(30);
      lady.at(LADY.x, 0, LADY.z); lady.set({ faceCam: 1, armL: [20, 10], armR: [20, 10] });
      shoot(M.scene, ppl, V3(0.9, 1.4, -8.6), V3(0.6, 1.3, -6.6), V3(LADY.x, 1.1, LADY.z), null, k, { ...LK.day, fov: 46 });
      blit(); photoLook(1, 0, 0, 0); pill('TAN COAT', (t - wc) / 0.25, 300, 'rgba(31,28,51,0.9)', 62); pill('HEADSCARF', (t - wh) / 0.25, 400, 'rgba(31,28,51,0.9)', 62);
    } });
    cue(wc, 'pop', { gain: 0.6 }); cue(wh, 'pop', { gain: 0.6 }); }

  // 4 · "holds a camera up to her face." extreme close on the camera; lens flashes
  { const st = cut(3), wc = Wd('camera', 3);
    add({ id: 'S04', at: st, note: 'back to color, close-up from the front: the camera lens covers her face, the lens glints; ! pops', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); only(lady); motorcade(60); lady.at(LADY.x, 0, LADY.z); lady.set({ faceCam: (t > wc && t < wc + 0.25) ? 2 : 1, armL: [20, 10], armR: [20, 10] });
      shoot(M.scene, ppl, V3(LADY.x + 0.4, 1.6, LADY.z + 3.3), V3(LADY.x + 0.1, 1.6, LADY.z + 2.6), V3(LADY.x, 1.55, LADY.z), null, k, { ...LK.day, fov: 44 }, undefined, lerp(0.04, -0.04, k));
      blit(); mark('!', 820, 360, (t - wc) / 0.25);
    } });
    cue(st, 'whoosh', { gain: 0.5 }); cue(wc, 'tock', { gain: 0.7 }); }

  // 5 · "People call her the Babushka Lady." low angle, ribbon "BABUSHKA LADY"
  { const st = cut(4), wb = Wd('babushka', 4);
    add({ id: 'S05', at: st, note: 'low angle from the side: she keeps filming, face hidden; gold ribbon "BABUSHKA LADY" slams in', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); only(lady, ...crowd); placeCrowd(t, 0); motorcade(30);
      lady.at(LADY.x, 0, LADY.z); lady.set({ faceCam: 1, armL: [20, 10], armR: [20, 10], lean: lerp(0, -6, k) });
      shoot(M.scene, ppl, V3(-1.6, 0.5, -1.4).add(shake(t, wb + 0.05)), V3(-1.2, 0.6, -2.0), V3(LADY.x, 1.6, LADY.z), null, k, { ...LK.day, fov: 54 });
      blit(); ribbon('"BABUSHKA LADY"', (t - wb) / 0.3, 330, 76);
    } });
    cue(wb + 0.05, 'stamp', { gain: 0.7 }); }

  // 6 · "She never came forward." she walks away; an agent searches with a magnifying glass, ? over him
  { const st = cut(5), wn = Wd('never', 5);
    add({ id: 'S06', at: st, note: 'wide: she walks away across the grass; a man in a dark suit in front searches with a magnifying glass, ? pops; pill NEVER CAME FORWARD', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); only(lady, agent); motorcade(30); const a = clamp(lt / d);
      lady.at(lerp(0.0, -3.0, a), 0, lerp(-3.7, -2.0, a)); lady.set({ legs: 'walk', phase: t * 6, armL: [20, 10], armR: [20, 10], faceCam: 1 });
      agent.at(1.3, 0, -1.6); agent.set({ mood: 'worried', look: [Math.sin(t * 3) * 0.8, 0], armL: [20, 10], armR: [60, -60], holdR: mag, v: 'm', blink: blink(t) });
      shoot(M.scene, ppl, V3(2.6, 1.6, 4.0), V3(2.0, 1.7, 3.2), V3(-0.2, 1.2, -2.4), null, k, { ...LK.day, fov: 54 });
      blit(); mark('?', 760, 430, (t - wn) / 0.3); pill('NEVER CAME FORWARD', (t - wn - 0.15) / 0.25, 300, 'rgba(160,30,40,0.92)', 56);
    } });
    cue(wn, 'boing', { gain: 0.5 }); }

  // 7 · "Follow for a new unsolved case every night." the agent points at the viewer
  { const st = cut(6);
    add({ id: 'S07', at: st, note: 'the man in the dark suit faces the viewer and points, sly; SUBSCRIBE button pressed', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); only(agent); motorcade(30);
      agent.at(1.0, 0, -2.0); agent.set({ mood: 'sly', armR: [95, 0], armL: [20, 10], talk: talk(t), blink: blink(t) });
      shoot(M.scene, ppl, V3(0.4, 1.5, 1.6), V3(0.7, 1.5, 0.8), V3(1.0, 1.4, -2.0), null, k, { ...LK.day, fov: 48 });
      blit(); subscribe(lt / 0.45 + (lt > 0.8 ? (lt - 0.8) * 1.4 : 0), t, 330);
    } });
    cue(st, 'pop', { gain: 0.6 }); cue(st + 1.25, 'ding', { gain: 0.6 }); }

  // 8a · "In nineteen seventy," calendar 1970 over the empty plaza in warm light
  { const st = cut(7), wy = Wd('nineteen', 7);
    add({ id: 'S08a', at: st, note: 'time jump: the plaza in warm evening light, empty road; calendar card 1970 slams in; speed lines', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); only(); motorcade(60);
      shoot(M.scene, ppl, V3(-4, 3, 6).add(shake(t, wy + 0.1)), V3(-2, 2.2, 4), V3(0, 1, -8), null, k, { ...LK.day, fov: 54 });
      blit(); tint(0.8, '#F28A4A'); if (lt < 0.25) speedLines(1 - lt / 0.25, 8); calCard('THE YEAR', '1970', 540, 440, eob(clamp((t - wy) / 0.25)), 0.05);
    } });
    cue(st, 'whoosh', { gain: 0.6 }); cue(wy + 0.1, 'slam', { gain: 0.7 }); }
  // 8b · "a woman said it was her," a different woman steps forward, hand on chest; pill "IT WAS ME!"
  { const st = Wd('woman', 7) - 0.12, wh = Wd('her', 7);
    add({ id: 'S08b', at: st, note: 'a different woman (pink dress, yellow bow) steps forward with a hand on her chest, proud; pill "IT WAS ME!"', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); only(claim); motorcade(60);
      claim.at(lerp(-1.2, -0.2, eo(clamp(lt / 0.6))), 0, -2.4); claim.set({ mood: 'proud', armR: [70, -120], armL: [20, 10], talk: talk(t), blink: blink(t), legs: lt < 0.6 ? 'walk' : 'stand', phase: t * 7 });
      shoot(M.scene, ppl, V3(1.0, 1.5, 1.2), V3(0.6, 1.5, 0.6), V3(-0.3, 1.4, -2.4), null, k, { ...LK.day, fov: 48 });
      blit(); tint(0.8, '#F28A4A'); pill('"IT WAS ME!"', (t - wh + 0.2) / 0.25, 300, 'rgba(31,28,51,0.9)', 66);
    } });
    cue(wh - 0.2, 'pop', { gain: 0.6 }); }

  // 9a · "but her camera model" big camera card HER CAMERA
  { const st = cut(8), wc = Wd('camera', 8);
    add({ id: 'S09a', at: st, note: 'low close: the woman looks smug; a big home-movie camera card labeled HER CAMERA bounces in above her', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); only(claim); motorcade(60);
      claim.at(-0.2, 0, -2.4); claim.set({ mood: 'smug', armR: [20, 10], armL: [20, 10], blink: blink(t) });
      shoot(M.scene, ppl, V3(-0.8, 1.2, 0.6), V3(-0.5, 1.3, 0.0), V3(-0.2, 1.6, -2.4), null, k, { ...LK.day, fov: 52 });
      blit(); tint(0.8, '#F28A4A'); camCard((t - wc + 0.1) / 0.3, 'HER CAMERA', 540, 520);
    } });
    cue(wc, 'pop', { gain: 0.6 }); }
  // 9b · "wasn't made until sixty-nine." calendar MADE IN 1969 + stamp NOT MADE IN 1963!
  { const st = Wd('wasn', 8) - 0.1, w9 = Wd('sixty', 8);
    add({ id: 'S09b', at: st, note: 'Dutch tilt: the woman sweats, worried; calendar card MADE IN 1969 slams, then stamp NOT MADE IN 1963!', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); only(claim); motorcade(60);
      claim.at(-0.2, 0, -2.4); claim.set({ mood: 'worried', sweat: 1, armL: [60, -80], armR: [60, -80], look: [0.5, 0] });
      shoot(M.scene, ppl, V3(1.0, 1.0, 0.8).add(shake(t, w9 + 0.4)), V3(0.6, 1.2, 0.2), V3(-0.2, 1.5, -2.4), null, k, { ...LK.day, fov: 50 }, undefined, lerp(0.05, 0.12, k));
      blit(); tint(0.8, '#F28A4A'); calCard('MADE IN', '1969', 540, 470, eob(clamp((t - w9) / 0.25)), -0.06);
      stamp(['NOT MADE', 'IN 1963!'], (t - w9 - 0.4) / 0.2, { y: 820, size: 70, col: '#E3262E' });
    } });
    cue(w9, 'slam', { gain: 0.6 }); cue(w9 + 0.4, 'stamp', { gain: 0.7 }); }

  // 10a · "Congress investigators searched for the film," office: two investigators dig through boxes
  { const st = cut(9), wc = Wd('congress', 9);
    add({ id: 'S10a', at: st, note: 'an office full of file boxes: two investigators with glasses search, one with a magnifying glass, papers flying; pill 1979: HOUSE COMMITTEE', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); inv2.group.visible = true;
      inv1.at(-0.8, 0, -2.4); inv1.set({ mood: 'worried', armR: [lerp(60, 120, Math.abs(Math.sin(t * 5))), -30], holdR: mag, v: 'm', armL: [40, -40], lean: 8, blink: blink(t) });
      inv2.at(0.8, 0, -2.8); inv2.set({ mood: 'shock', armL: [140, 0], holdL: PROPS.paper('FILE'), v: 'p', armR: [lerp(40, 140, Math.abs(Math.sin(t * 6))), -20], blink: blink(t, 1) });
      shoot(R.scene, office, V3(-1.0, 1.6, 3.6), V3(0.2, 1.7, 3.0), V3(0, 1.3, -3.2), null, k, { ...LK.room, fov: 54 });
      blit(); pill('1979: HOUSE COMMITTEE', (t - wc) / 0.25, 300, 'rgba(31,28,51,0.9)', 54);
      for (let i = 0; i < 4; i++) { const q = ((lt * 1.3 + i * 0.27) % 1); ctx.save(); ctx.translate(300 + i * 160 + Math.sin(q * 6 + i) * 40, 900 - q * 500); ctx.rotate(q * 4 + i); ctx.fillStyle = '#FFFDF4'; ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.globalAlpha = 1 - q; ctx.fillRect(-40, -50, 80, 100); ctx.strokeRect(-40, -50, 80, 100); ctx.restore(); }
    } });
    cue(st, 'slide', { dur: 0.6, gain: 0.5 }); cue(wc, 'pop', { gain: 0.6 }); }
  // 10b · "and never found it." the investigator lowers his glass; stamp FILM NOT FOUND
  { const st = Wd('never', 9) - 0.12, wf = Wd('found', 9);
    add({ id: 'S10b', at: st, note: 'close: the investigator lowers his magnifying glass, sad, empty-handed; red stamp FILM NOT FOUND', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); inv2.group.visible = false;
      inv1.at(-0.3, 0, -2.6); inv1.set({ mood: 'sad', armR: [30, -10], holdR: mag, v: 'm', armL: [100, 70], blink: blink(t) });
      shoot(R.scene, office, V3(0.8, 1.3, 0.6), V3(0.4, 1.4, 0.0), V3(-0.3, 1.5, -2.6), null, k, { ...LK.room, fov: 50 });
      blit(); tint(0.6, '#2A3A6A'); stamp(['FILM', 'NOT FOUND'], (t - wf) / 0.2, { y: 420, size: 88, col: '#E3262E' });
    } });
    cue(wf, 'stamp', { gain: 0.8 }); }

  // 11 · "So all we really know is this:" back to the opening picture -> loops into "She filmed..."
  { const st = cut(10), wk = Wd('know', 10);
    add({ id: 'S11', at: st, note: 'loop: back on the grass, push in on the woman filming with her face hidden as the cars pass; hook WHO IS SHE? slams back', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); only(lady, ...crowd); placeCrowd(t); motorcade(lerp(-6, -2, k));
      lady.at(LADY.x, 0, LADY.z); lady.set({ mood: 'neutral', faceCam: 1, armL: [20, 10], armR: [20, 10] });
      shoot(M.scene, ppl, V3(2.4, 1.0, 3.0), V3(1.6, 1.2, 1.6), V3(0.2, 1.6, -4.4), null, k, { ...LK.day, fov: 52 });
      blit(); if (lt < 0.2) speedLines(1 - lt / 0.2, 4); hook(['WHO IS', 'SHE?'], (t - wk) / 0.3, { y: 300, size: 150, hiLine: 1 });
    } });
    cue(st, 'whoosh', { gain: 0.5 }); cue(wk, 'tock', { gain: 0.6 }); }

  return { shots: S, cues: CUES };
}
