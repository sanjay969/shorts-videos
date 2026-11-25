// NVIDIA'S CEO QUIT, THEN CAME BACK IN 11 DAYS — shot list (Tall Tale 3D). Generic toon CEO, no logos, no likeness.
import * as THREE from 'three';
import { ctx, clamp, lerp, eo, eio, eob } from './core/lib.js';
import { L, Le, Wd, T } from './core/timing.js';
import * as WD from './core/world.js';
import * as PR from './core/props.js';
import { PROPS } from './core/toon.js';
import { V3, mix, talk, blink, person, P2, hook, ribbon, pill, stamp, calCard, counter, cashRain, confetti, flash, tint, speedLines, stars, mark, subscribe, makeShoot, LK, boardroom, street, coaster, drawPrice } from './jh.js';

const PRICE = [[0, 0.72], [0.1, 0.76], [0.2, 0.66], [0.3, 0.6], [0.4, 0.5], [0.5, 0.44], [0.6, 0.38], [0.7, 0.34], [0.78, 0.36], [0.88, 0.8], [1, 0.92]];

export function buildShots(E) {
  const S = [], CUES = [], add = (o) => (S.push(o), o), cue = (t, type, o = {}) => CUES.push({ t: +Math.max(0, t).toFixed(3), type, ...o });
  const cut = (i) => (i === 0 ? 0 : L(i) - 0.06);
  const { shoot } = makeShoot(E);
  const shake = (t, t0, a = 0.08) => { const k = t - t0; if (k < 0 || k > 0.35) return V3(0, 0, 0); const f = (1 - k / 0.35) * a; return V3(Math.sin(k * 90) * f, Math.cos(k * 70) * f, 0); };

  // ── STREET with the HQ ──
  const SHOPS = [['CAFE', '#E58A6A', 'wood', '#2E4E3F'], ['TECH HQ', '#3A4A5E', 'brick', '#4FB36A'], ['NEWS', '#F2D37A', 'wood', '#D8343F'], ['BANK', '#C7B79A', 'brick', null], ['CITY HALL', '#E9E2D0', 'brick', '#3C6FB6'],
    ['DINER', '#C9603F', 'wood', '#D8343F'], ['BOOKS', '#7FA36A', 'wood', null], ['PIZZA', '#D9A34A', 'brick', '#3C6FB6']];
  const ST = street(E, SHOPS); const HQ = ST.buildings.find((b) => b.name === 'TECH HQ'); const HZ = HQ.z;
  const CH0 = ST.buildings.find((b) => b.name === 'CITY HALL') || HQ;
  const pz = 4 - Math.round((4 - CH0.z) / 12) * 12; const CH = { ...CH0, z: Math.abs(CH0.z - pz) < 3 ? pz + (CH0.z >= pz ? 3.5 : -3.5) : CH0.z };
  ST.sun.key.target.position.set(-4, 0, HZ); ST.sun.key.position.set(5, 12, HZ + 6);
  ST.people.forEach((p) => { const z = p.group.position.z; if (Math.abs(z - HZ) < 12 || Math.abs(z - CH.z) < 9) p.group.visible = false; });
  const sCeo = person('ceo'); ST.scene.add(sCeo.group);
  const reps = ['reporter', 'm1', 'reporter', 'fan'].map((k) => { const p = person(k); ST.scene.add(p.group); return p; });
  const fans = WD.extras(ST.scene, [[-1.6, HZ + 3.2, 0], [-0.4, HZ + 4.0, 1], [0.8, HZ + 3.4, 2], [-2.4, HZ + 5.2, 3], [0.2, HZ + 5.6, 4], [1.6, HZ + 5.0, 5], [-1.0, HZ + 6.6, 6], [1.0, HZ + 7.0, 7]]);
  const fanHero = person('fan'); ST.scene.add(fanHero.group);
  const off = person('official'); ST.scene.add(off.group);
  const hideAll = () => { [...reps, ...fans, fanHero, off].forEach((p) => (p.group.visible = false)); };
  const stPeople = () => [...ST.people, sCeo, ...reps, ...fans, fanHero, off];

  // ── BOARDROOM ──
  const BR = boardroom(E);
  const chair = person('chair'), mem = ['m1', 'm2', 'm3'].map((k) => person(k)); const bCeo = person('ceo');
  [chair, ...mem, bCeo].forEach((p) => BR.scene.add(p.group));
  const seats = [[-1.8, -5.45], [-0.6, -5.45], [0.6, -5.45], [1.8, -5.45]]; [chair, ...mem].forEach((p, i) => p.at(seats[i][0], 0, seats[i][1]));
  const brPeople = [chair, ...mem, bCeo];
  const scr = (k, big) => BR.screen.draw((g, w, h) => drawPrice(g, w, h, PRICE, k, 'NVDA', big));

  // ── COASTER ──
  const CO = coaster(E, PRICE); const rider = person('ceo'); CO.scene.add(rider.group);
  const ride = (u) => { const p = CO.curve.getPointAt(clamp(u)), q = CO.curve.getPointAt(clamp(u + 0.01)); CO.cart.position.set(p.x, p.y + 0.24, p.z); CO.cart.rotation.z = Math.atan2(q.y - p.y, q.x - p.x); rider.at(p.x, p.y + 0.3, p.z + 0.05); return p; };

  // ═══ SHOTS ═══
  // 1a · "In just eleven days," CEO walks out of TECH HQ with a box. Hook text on frame 0.
  { const st = 0, we = Wd('eleven', 0);
    add({ id: 'S01a', at: st, note: 'frame 0: CEO toon walks out of TECH HQ carrying a box, low push-in; hook text GONE 11 DAYS?', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); hideAll(); sCeo.group.visible = true;
      sCeo.at(-5.0, 0.18, lerp(HZ - 0.2, HZ + 1.4, k)); sCeo.set({ mood: 'sad', legs: 'walk', phase: t * 7, armL: [60, -70], armR: [60, -70], holdL: P2.box, v: 'b', look: [0, 0.3], blink: blink(t) });
      shoot(ST.scene, stPeople(), V3(-2.6, 1.0, HZ + 5.2), V3(-3.1, 1.1, HZ + 4.0), V3(-5.0, 1.5, HZ + 0.6), V3(-5.0, 1.35, HZ + 1.2), k, { ...LK.day, fov: 46 });
      blit(); hook(['GONE', '11 DAYS?'], 1, { y: 330, hiLine: 1 });
    } });
    cue(0.0, 'whoosh', { gain: 0.5 }); cue(we, 'stamp', { gain: 0.7 }); }
  // 1b · "Nvidia's CEO quit" calendar pages fly 1→11 over a close-up of the worried CEO
  { const st = Wd('nvidia', 0) - 0.12, wq = Wd('quit', 0);
    add({ id: 'S01b', at: st, note: 'close-up of the CEO; calendar pages flip DAY 1 → DAY 11', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); hideAll(); sCeo.at(-5.0, 0.18, HZ + 1.4);
      sCeo.set({ mood: t > wq ? 'worried' : 'sad', sweat: t > wq ? 1 : 0, armL: [60, -70], holdL: P2.box, armR: [20, 10], v: 'b', look: [0.4, -0.4], blink: blink(t) });
      shoot(ST.scene, stPeople(), V3(-3.0, 1.5, HZ + 4.2), V3(-3.4, 1.45, HZ + 3.3), V3(-5.0, 1.45, HZ + 1.4), null, k, { ...LK.day, fov: 40 });
      blit(); const day = 1 + Math.min(10, Math.floor(clamp(lt / (d * 0.85)) * 10.99)); calCard('DAY', String(day), 540, 420, 1 - ((lt * 7) % 1) * 0.06, -0.05);
    } });
    for (let i = 0; i < 10; i++) cue(Wd('nvidia', 0) - 0.1 + i * 0.12, 'tock', { gain: 0.35 }); }
  // 1c · "and came back." he spins round and runs back in, stars + BACK! stamp
  { const st = Wd('and', 0) - 0.1, wb = Wd('back', 0);
    add({ id: 'S01c', at: st, note: 'he drops the box, spins and runs back into TECH HQ; stars and a green BACK! stamp', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); hideAll(); const r = clamp(lt / d);
      sCeo.at(-5.0, 0.18, lerp(HZ + 1.4, HZ - 0.6, eo(r))); sCeo.set({ mood: 'laugh', legs: 'run', phase: t * 12, armL: [150, 10], armR: [150, 10], flip: true, lean: -10, blink: 0 });
      shoot(ST.scene, stPeople(), V3(-1.4, 1.2, HZ + 5.0), V3(-2.0, 1.4, HZ + 3.8), V3(-5.0, 1.4, HZ + 1.0), V3(-5.2, 1.6, HZ), k, { ...LK.day, fov: 48 });
      blit(); speedLines(1 - r, 3); stamp(['BACK!'], (t - wb) / 0.2, { y: 480, col: '#2F7A3A', size: 130, fill: 'rgba(240,255,235,0.94)' }); stars(540, 480, (t - wb) / 0.8);
    } });
    cue(st, 'boing', { gain: 0.6 }); cue(wb, 'stamp', { gain: 0.9 }); }

  // 2a · "On November twelfth," ribbon NOV 12, the HQ doors, pan
  { const st = cut(1), wn = Wd('november', 1);
    add({ id: 'S02a', at: st, note: 'rewind: sunny street pan across to TECH HQ, gold ribbon NOV 12, 2026', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); hideAll(); sCeo.at(-5.2, 0.18, HZ - 0.4); sCeo.set({ mood: 'neutral', armL: [20, 10], armR: [20, 10], blink: blink(t) });
      shoot(ST.scene, stPeople(), V3(2.5, 3.6, HZ + 9), V3(0.5, 2.4, HZ + 6.5), V3(-6, 3.5, HZ - 4), V3(-5.5, 2.2, HZ), k, { ...LK.day, fov: 50 });
      blit(); ribbon('NOV 12, 2026', (t - wn + 0.1) / 0.3, 360);
      if (lt < 0.25) flash(1 - lt / 0.25, '#F4E3C0');
    } });
    cue(st, 'whoosh', { gain: 0.6 }); cue(Wd('twelfth', 1), 'stamp', { gain: 0.7 }); }
  // 2b · "Jensen Huang resigned," he lifts his box; RESIGNED stamp
  { const st = Wd('jensen', 1) - 0.12, wr = Wd('resigned', 1);
    add({ id: 'S02b', at: st, note: 'medium, tilted: the CEO toon lifts his box, head down; red RESIGNED stamp on "resigned"', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); hideAll(); sCeo.at(-5.0, 0.18, HZ + 0.4);
      sCeo.set({ mood: t > wr ? 'sad' : 'tired', armL: [lerp(20, 70, eo(clamp(lt / 0.5))), -70], armR: [lerp(20, 70, eo(clamp(lt / 0.5))), -70], holdL: P2.box, v: 'b2', look: [0, 0.6], lean: 6, blink: blink(t) });
      const sh = shake(t, wr);
      shoot(ST.scene, stPeople(), V3(-2.2, 1.3, HZ + 3.2).add(sh), V3(-2.8, 1.3, HZ + 2.6).add(sh), V3(-5.0, 1.2, HZ + 0.4), null, k, { ...LK.day, fov: 44, aperture: 0 }, undefined, -0.12);
      blit(); stamp(['RESIGNED'], (t - wr) / 0.2, { y: 470, rot: -0.12, size: 110 });
    } });
    cue(wr, 'stamp', { gain: 1 }); cue(wr + 0.05, 'thud', { gain: 0.5 }); }

  // 3a · "after a scandal and alleged spy ties," reporters swarm, camera flashes
  { const st = cut(2), wa = Wd('alleged', 2);
    add({ id: 'S03a', at: st, note: 'reporters with mics and phones rush in around him; camera flashes; pill ALLEGED', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); hideAll(); sCeo.at(-5.0, 0.18, HZ + 0.6);
      sCeo.set({ mood: 'shock', armL: [60, -40], armR: [60, -40], holdL: P2.box, v: 'b3', look: [0.6 * Math.sin(t * 6), 0], blink: blink(t) });
      reps.forEach((p, i) => { p.group.visible = true; const a = eo(clamp((lt - i * 0.12) / 0.6)); const sx = [-4.6, -3.0, -3.6, -4.4][i], sz = [HZ + 2.4, HZ + 3.6, HZ - 0.2, HZ - 1.0][i]; p.at(lerp(sx + 3, sx, a), 0, sz); p.set({ legs: a < 1 ? 'run' : 'stand', phase: t * 11 + i, mood: i % 2 ? 'shock' : 'happy', armR: [110, -60], holdR: i % 2 ? P2.phone : P2.mic, v: 'r' + i, look: [-0.8, 0], talk: talk(t + i) }); });
      shoot(ST.scene, stPeople(), V3(0.4, 1.8, HZ + 5.2), V3(0.0, 2.0, HZ + 4.2), V3(-3.8, 1.3, HZ + 1.0), null, k, { ...LK.day, fov: 52 });
      blit(); const fl = [0.4, 0.8, 1.15, 1.5].map((x) => clamp(1 - Math.abs(lt - x) / 0.08)); flash(Math.max(...fl) * 0.6);
      pill('ALLEGED', (t - wa) / 0.25, 300, 'rgba(31,28,51,0.9)', 64);
    } });
    cue(st, 'whoosh'); [0.4, 0.8, 1.15, 1.5].forEach((x) => cue(cut(2) + x, 'pop', { gain: 0.6 })); }
  // 3b · "which China denied." close on the worried CEO, pill CHINA DENIED IT
  { const st = Wd('which', 2) - 0.12, wc = Wd('china', 2);
    add({ id: 'S03b', at: st, note: 'extreme close-up: CEO sweating, eyes darting; pill CHINA DENIED IT', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); hideAll(); sCeo.at(-5.0, 0.18, HZ + 0.6); reps.forEach((p) => (p.group.visible = true));
      sCeo.set({ mood: 'worried', sweat: 1, armL: [60, -40], holdL: P2.box, v: 'b3', look: [Math.sin(t * 9) * 0.8, 0], blink: blink(t) });
      shoot(ST.scene, stPeople(), V3(-3.6, 1.75, HZ + 2.4), V3(-3.9, 1.8, HZ + 1.9), V3(-5.0, 1.75, HZ + 0.6), null, k, { ...LK.day, fov: 38 });
      blit(); pill('CHINA DENIED IT', (t - wc) / 0.25, 300, 'rgba(31,28,51,0.9)', 58);
    } });
    cue(wc, 'ding', { gain: 0.5 }); }

  // 4 · "The board said he was not coming back," boardroom, the chair slams the table; NOT COMING BACK
  { const st = cut(3), wn = Wd('not', 3);
    add({ id: 'S04', at: st, note: 'boardroom, low Dutch angle: the chair slams the table on "not"; red stamp NOT COMING BACK', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); bCeo.group.visible = false; scr(0.3, '');
      const sl = t > wn; chair.at(-0.6, 0, -5.45); chair.set({ mood: sl ? 'angry' : 'neutral', armL: sl ? [40, 10] : [100, -40], armR: sl ? [40, 10] : [100, -40], lean: sl ? 12 : 0, talk: talk(t), blink: blink(t) });
      mem.forEach((p, i) => { p.at([-1.9, 0.6, 1.8][i], 0, -5.45); p.set({ mood: sl ? 'shock' : 'neutral', armL: [10, 6], armR: [10, 6], look: [i === 0 ? 0.7 : -0.7, 0], blink: blink(t, i) }); });
      const sh = shake(t, wn, 0.12);
      shoot(BR.scene, brPeople, V3(-1.6, 1.75, -1.2).add(sh), V3(-1.0, 1.65, -2.0).add(sh), V3(-0.4, 1.55, -5.45), null, k, { ...LK.room, fov: 50 }, undefined, 0.14);
      blit(); stamp(['NOT COMING', 'BACK'], (t - wn) / 0.2, { y: 470, rot: -0.1, size: 96 });
    } });
    cue(st, 'whoosh'); cue(wn, 'slam', { gain: 0.9 }); cue(wn + 0.02, 'stamp', { gain: 0.8 }); }

  // 5 · "and Nvidia's stock slid." the wall screen: red line falls; members gasp; red tint
  { const st = cut(4), ws = Wd('slid', 4);
    add({ id: 'S05', at: st, note: 'push in past the board to the wall screen: the NVDA line falls red; red tint on "slid"', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); bCeo.group.visible = false; scr(lerp(0.15, 0.72, clamp(lt / d)), '');
      chair.at(-0.6, 0, -5.45); chair.set({ mood: 'worried', sweat: 1, look: [0, -0.8], armL: [20, 10], armR: [20, 10] });
      mem.forEach((p, i) => { p.at([-1.9, 0.6, 1.8][i], 0, -5.45); p.set({ mood: t > ws ? 'shock' : 'worried', armL: t > ws ? [130, 0] : [10, 6], armR: t > ws ? [130, 0] : [10, 6], look: [0, -0.8] }); });
      shoot(BR.scene, brPeople, V3(0, 1.9, -0.6), V3(0, 2.3, -4.6), V3(0, 2.0, -7.9), V3(0, 2.5, -7.9), k, { ...LK.room, fov: 50 });
      blit(); tint(clamp((t - ws) / 0.3));
    } });
    cue(st, 'slide', { dur: 1.4, gain: 0.6 }); cue(ws, 'boing', { gain: 0.5 }); }

  // 6a · "But a hundred eighty thousand people" crowd with signs, crane up; counter ticks
  { const st = cut(5), wp = Wd('people', 5);
    add({ id: 'S06a', at: st, note: 'crane up over a crowd of fans holding BRING HIM BACK signs; counter ticks to 180,000', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); hideAll(); sCeo.group.visible = false;
      fans.forEach((p, i) => { p.group.visible = true; p.set({ mood: i % 2 ? 'happy' : 'proud', armR: [150, 10], holdR: PROPS.sign(i % 2 ? 'BRING HIM BACK' : 'WE WANT HIM', i % 3 ? '#F2EDE0' : '#FFE08A'), v: 'sg' + i, bob: Math.abs(Math.sin(t * 5 + i)) * 6, legs: Math.sin(t * 6 + i * 1.3) > 0.6 ? 'jump' : 'stand' }); });
      shoot(ST.scene, stPeople(), V3(0.5, 1.4, HZ + 11), V3(0.2, 5.0, HZ + 12), V3(-0.4, 1.4, HZ + 5), V3(-0.4, 0.8, HZ + 4.5), k, { ...LK.day, fov: 52 });
      blit(); const n = Math.round(eo(clamp(lt / (wp - st + 0.2))) * 180) * 1000; counter(n.toLocaleString('en-US'), lt / 0.2, 'SIGNATURES', 330);
    } });
    for (let i = 0; i < 8; i++) cue(cut(5) + 0.1 + i * 0.16, 'pop', { gain: 0.4 }); cue(Wd('people', 5), 'ding', { gain: 0.7 }); }
  // 6b · "petitioned for him." one fan jumps with a clipboard petition, confetti
  { const st = Wd('petitioned', 5) - 0.12;
    add({ id: 'S06b', at: st, note: 'close: a fan jumps waving the PETITION clipboard, the crowd cheers', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); hideAll(); fans.forEach((p, i) => { p.group.visible = true; p.set({ mood: 'laugh', armL: [150, 10], armR: [150, 10], holdR: null, v: 'c' + i, legs: Math.sin(t * 9 + i) > 0.2 ? 'jump' : 'stand' }); });
      fanHero.group.visible = true; fanHero.at(-0.8, 0, HZ + 6.0); fanHero.set({ mood: 'laugh', armR: [160, -10], holdR: P2.clip, armL: [140, 10], v: 'clip', legs: Math.sin(t * 10) > 0 ? 'jump' : 'stand', squash: Math.sin(t * 10) < -0.8 ? 0.3 : 0 });
      shoot(ST.scene, stPeople(), V3(0.6, 1.2, HZ + 9.4), V3(0.2, 1.3, HZ + 8.6), V3(-0.8, 1.4, HZ + 6.0), null, k, { ...LK.day, fov: 44 });
      blit(); pill('PETITION', (t - st - 0.1) / 0.25, 300, 'rgba(31,28,51,0.9)', 60); confetti(t, st + 0.2, 40);
    } });
    cue(st, 'sparkle', { gain: 0.5 }); }

  // 7a · "Then U.S. officials said" an official walks up with a clipboard in front of CITY HALL
  { const st = cut(6), CZ = CH.z;
    add({ id: 'S07a', at: st, note: 'whip-pan to CITY HALL: a suited official walks forward reading a clipboard', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); hideAll(); off.group.visible = true; const x = CH.side < 0 ? -4.9 : 4.9;
      off.at(x, 0.18, lerp(CZ - 1.0, CZ + 0.6, clamp(lt / d))); off.set({ mood: 'neutral', legs: 'walk', phase: t * 6, armL: [60, -80], holdL: P2.clip, armR: [20, 10], v: 'o', look: [0, 0.5], blink: blink(t) });
      shoot(ST.scene, stPeople(), V3(x * 0.62, 1.6, CZ + 4.2), V3(x * 0.7, 1.5, CZ + 3.4), V3(x, 1.5, CZ + 0.2), null, k, { ...LK.day, fov: 46 });
      blit(); speedLines(1 - clamp(lt / 0.3), 7);
    } });
    cue(st, 'whoosh', { gain: 0.8 }); }
  // 7b · "he was no security risk," green stamp NO SECURITY RISK
  { const st = Wd('he', 6) - 0.1, wn = Wd('no', 6), CZ = CH.z;
    add({ id: 'S07b', at: st, note: 'low angle on the official; he stamps the clipboard: green NO SECURITY RISK', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); hideAll(); off.group.visible = true; const x = CH.side < 0 ? -4.9 : 4.9;
      off.at(x, 0.18, CZ + 0.6); off.set({ mood: t > wn ? 'smug' : 'neutral', armL: [70, -80], holdL: P2.clip, armR: t > wn ? [120, -30] : [60, -40], holdR: PROPS.rubberStamp, v: 'o2', talk: talk(t), blink: blink(t) });
      shoot(ST.scene, stPeople(), V3(x * 0.72, 0.9, CZ + 2.9), V3(x * 0.75, 0.8, CZ + 2.5), V3(x, 1.7, CZ + 0.6), null, k, { ...LK.day, fov: 44 });
      blit(); stamp(['NO SECURITY', 'RISK'], (t - wn) / 0.2, { y: 450, col: '#2F7A3A', size: 92, fill: 'rgba(240,255,235,0.94)' });
    } });
    cue(wn, 'stamp', { gain: 1 }); }

  // 8 · "so the board voted him back in." hands up, the CEO walks in, confetti
  { const st = cut(7), wv = Wd('voted', 7), wb = Wd('back', 7);
    add({ id: 'S08', at: st, note: 'boardroom: every hand shoots up on "voted"; the CEO strides in grinning; confetti; pill UNANIMOUS', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); scr(0.78, ''); const up = t > wv;
      chair.at(-0.6, 0, -5.45); chair.set({ mood: up ? 'happy' : 'neutral', armR: up ? [160, 0] : [10, 6], armL: [10, 6] });
      mem.forEach((p, i) => { p.at([-1.9, 0.6, 1.8][i], 0, -5.45); p.set({ mood: up ? 'happy' : 'neutral', armR: up && t > wv + i * 0.1 ? [160, 0] : [10, 6], armL: [10, 6] }); });
      bCeo.group.visible = true; const a = eo(clamp((t - wb + 0.3) / 0.6)); bCeo.at(lerp(2.6, 0.9, a), 0, -2.7); bCeo.set({ mood: 'smug', legs: a > 0 && a < 1 ? 'walk' : 'stand', phase: t * 7, armR: [20, 10], armL: [20, 10], look: [-0.7, 0], blink: blink(t) });
      shoot(BR.scene, brPeople, V3(1.2, 2.0, 0.6), V3(0.8, 1.85, -0.2), V3(0.6, 1.4, -4.4), null, k, { ...LK.room, fov: 52 });
      blit(); pill('UNANIMOUS VOTE', (t - wv) / 0.25, 300, 'rgba(31,28,51,0.9)', 58); if (t > wb) confetti(t, wb, 50);
    } });
    cue(wv, 'pop'); cue(wv + 0.1, 'pop'); cue(wv + 0.2, 'pop'); cue(wb, 'sparkle', { gain: 0.7 }); }

  // 9 · "Subscribe for more wild comebacks." CEO points at the camera; SUBSCRIBE button gets clicked
  { const st = cut(8);
    add({ id: 'S09', at: st, note: 'CEO in the boardroom points at camera, pull-out; a big SUBSCRIBE button gets clicked', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); scr(0.78, ''); bCeo.group.visible = true; bCeo.at(1.6, 0, -2.6);
      bCeo.set({ mood: 'happy', armR: [95, 0], armL: [20, 10], talk: talk(t), blink: blink(t) });
      shoot(BR.scene, brPeople, V3(1.3, 1.5, -1.0), V3(1.0, 1.6, 0.0), V3(1.6, 1.3, -2.6), null, k, { ...LK.room, fov: 44 }, 2.4);
      blit(); subscribe(lt / 0.5 + (lt > 0.8 ? (lt - 0.8) * 1.5 : 0), t, 330);
    } });
    cue(st, 'pop', { gain: 0.6 }); cue(cut(8) + 1.3, 'ding', { gain: 0.6 }); }

  // 10a · "And the stock jumped" the CEO rides a cart up the giant green line, speed lines
  { const st = cut(9), wj = Wd('jumped', 9);
    add({ id: 'S10a', at: st, note: 'meadow: the giant price line as a rollercoaster; the CEO rides a cart up the green climb, speed lines', draw(lt, d, t, blit) {
      const k = clamp(lt / d); CO.draw(1); const u = lerp(0.74, 0.9, eio(k)); const p = ride(u);
      rider.set({ mood: t > wj ? 'laugh' : 'shock', legs: 'sit', armL: [150, 10], armR: [150, 10], blink: 0 });
      shoot(CO.scene, [rider], V3(p.x - 2.8, p.y - 0.2, p.z + 5.2), V3(p.x - 2.2, p.y + 0.4, p.z + 4.4), V3(p.x, p.y + 0.8, p.z), null, 0, { ...LK.day, fov: 50 });
      blit(); speedLines(clamp((t - wj) / 0.2), 11); cashRain(t, wj, 22);
    } });
    cue(st, 'chug', { dur: 1.2, gain: 0.5 }); cue(wj, 'whoosh', { gain: 0.9 }); }
  // 10b · "thirty-one percent in one day!" punch-in, +31% slams, camera shake
  { const st = Wd('thirty', 9) - 0.12, w3 = Wd('thirty', 9), wd = Wd('day', 9);
    add({ id: 'S10b', at: st, note: 'top of the climb: punch-in on the cheering CEO; giant +31% slams in with a shake; IN ONE DAY pill', draw(lt, d, t, blit) {
      const k = clamp(lt / d); CO.draw(1); const u = lerp(0.9, 0.97, eo(k)); const p = ride(u);
      rider.set({ mood: 'laugh', legs: 'sit', armL: [160, -10], armR: [160, -10], blink: 0 });
      const sh = shake(t, w3, 0.25);
      shoot(CO.scene, [rider], V3(p.x - 1.8, p.y + 0.6, p.z + 4.2).add(sh), V3(p.x - 1.2, p.y + 0.8, p.z + 3.2).add(sh), V3(p.x, p.y + 0.9, p.z), null, eo(k), { ...LK.day, fov: 46 });
      blit(); cashRain(t, st - 0.6, 26); stamp(['+31%'], (t - w3) / 0.18, { y: 420, col: '#2F7A3A', size: 190, fill: 'rgba(240,255,235,0.95)' }); pill('IN ONE DAY', (t - wd) / 0.25, 640, 'rgba(31,28,51,0.9)', 58);
    } });
    cue(w3, 'slam', { gain: 0.9 }); cue(w3 + 0.02, 'stamp', { gain: 0.8 }); cue(wd, 'ding', { gain: 0.8 }); }

  // 11 · "The whole wild ride took..." back to the HQ street, same framing as frame 0 (loop)
  { const st = cut(10);
    add({ id: 'S11', at: st, note: 'back on the HQ street: the CEO walks out with his box again (loops into frame 0); calendar card ? DAYS', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); hideAll(); sCeo.group.visible = true;
      sCeo.at(-5.0, 0.18, lerp(HZ - 1.4, HZ - 0.2, k)); sCeo.set({ mood: 'smug', legs: 'walk', phase: t * 7, armL: [60, -70], armR: [60, -70], holdL: P2.box, v: 'b', look: [0, 0], blink: blink(t) });
      shoot(ST.scene, stPeople(), V3(-2.0, 1.1, HZ + 6.4), V3(-2.6, 1.0, HZ + 5.4), V3(-5.0, 1.6, HZ - 0.6), V3(-5.0, 1.5, HZ + 0.4), k, { ...LK.day, fov: 46 });
      blit(); calCard('DAYS', '?', 540, 420, eob(clamp((lt - 0.3) / 0.3)), 0.05); mark('?', 820, 300, (lt - 0.9) / 0.3);
    } });
    cue(st, 'whoosh', { gain: 0.6 }); cue(cut(10) + 0.4, 'pop'); }

  return { shots: S, cues: CUES };
}
