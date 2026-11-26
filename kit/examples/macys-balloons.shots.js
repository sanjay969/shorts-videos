// MACY'S LET ITS GIANT BALLOONS FLY AWAY (1928-1932 balloon releases) — Tall Tale 3D, US audience, Thanksgiving day.
// Generic toons only. The balloon is an original striped cartoon cat (no real character). No crash shown: the plane recovers.
import * as THREE from 'three';
import { ctx, clamp, lerp, eo, eio, eob } from './core/lib.js';
import { L, Le, Wd, T } from './core/timing.js';
import * as WD from './core/world.js';
import * as PR from './core/props.js';
import * as SEA from './core/sea.js';
import { Toon, PROPS, INK } from './core/toon.js';
import { V3, talk, blink, hook, ribbon, pill, stamp, calCard, cashRain, confetti, flash, tint, speedLines, stars, mark, subscribe, makeShoot, LK } from './jh.js';
import { balloon, trainer, rewardTag } from './us.js';

const LOOKS = {
  hand1: { body: '#D8343F', pattern: 'stripes', patCol: '#F4EFE4', hat: 'cap', hatCol: '#1F2A5A', neck: 'bowtie', neckCol: '#F2C230' },
  hand2: { body: '#3C6FB6', pattern: 'vest', patCol: '#24467A', hat: 'cap', hatCol: '#D8343F', extra: ['mustache'] },
  kid: { body: '#F2C230', pattern: 'stripes', patCol: '#E8A820', hat: 'beanie', hatCol: '#3C6FB6', kid: true, extra: ['freckles'] },
  man: { body: '#6A7A5A', hat: 'bowler', hatCol: '#2A2638', neck: 'tie', neckCol: '#D8343F', extra: ['mustache'] },
  lady: { body: '#B98ACF', hat: 'flower', hatCol: '#F29BB5', neck: 'collar', neckCol: '#F4EFE4' },
  pilot: { body: '#8A5A3A', pattern: 'plain', hat: 'beanie', hatCol: '#5A3A22', neck: 'scarf', neckCol: '#F4EFE4', extra: ['glasses'] },
  coach: { body: '#5C6F8F', pattern: 'vest', patCol: '#3A4A6A', hat: 'cap', hatCol: '#2A2630', neck: 'tie', neckCol: '#2E8A5A', extra: ['mustache'] },
};
const mk = (k, o) => new Toon({ ...LOOKS[k], extra: [...(LOOKS[k].extra || [])] }, o);
// a rope = thin cylinder stretched between two points each frame
const rope = (scene) => { const m = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 1, 6), WD.mat({ color: '#3A3340' })); scene.add(m);
  m.span = (a, b) => { const d = b.clone().sub(a); m.position.copy(a).addScaledVector(d, 0.5); m.scale.set(1, d.length(), 1); m.quaternion.setFromUnitVectors(V3(0, 1, 0), d.normalize()); }; return m; };

export function buildShots(E) {
  const S = [], CUES = [], add = (o) => (S.push(o), o), cue = (t, type, o = {}) => CUES.push({ t: +Math.max(0, t).toFixed(3), type, ...o });
  const cut = (i) => (i === 0 ? 0 : L(i) - 0.06);
  const { shoot, cam } = makeShoot(E);
  const shake = (t, t0, a = 0.08) => { const k = t - t0; if (k < 0 || k > 0.35) return V3(0, 0, 0); const f = (1 - k / 0.35) * a; return V3(Math.sin(k * 90) * f, Math.cos(k * 70) * f, 0); };

  // ── PARADE STREET ──
  const P = WD.mainStreet(E, { cars: false, people: true });
  P.sun.key.target.position.set(0, 0, -12); P.sun.key.position.set(9, 16, -2);
  const B1 = balloon(6); B1.at(0, 0, -13); P.scene.add(B1.group);
  const h1 = mk('hand1'), h2 = mk('hand2'); const street = [B1, h1, h2]; [h1, h2].forEach((p) => P.scene.add(p.group));
  const holdPose = (t) => { h1.at(-1.6, 0, -11.6); h2.at(1.6, 0, -11.4);
    h1.set({ mood: 'happy', armR: [150, 0], armL: [120, -10], lean: -6, blink: blink(t) }); h2.set({ mood: 'smug', armL: [150, 0], armR: [120, -10], lean: 6, blink: blink(t, 1) }); };

  // ── NEIGHBORHOOD (meadow + houses) ──
  const M = WD.meadow(E, { fenceOn: false });
  const hs = PR.house({ wall: '#F2E6CF', roof: '#6A4A6A', door: '#7A2E2E' }); hs.position.set(0, 0, -10); M.scene.add(hs);
  const hs2 = PR.house({ wall: '#E9D7A5', roof: '#B5553C' }); hs2.position.set(-9, 0, -13); hs2.rotation.y = 0.3; M.scene.add(hs2);
  const hs3 = PR.house({ wall: '#CFE0EA', roof: '#2E4E3F' }); hs3.position.set(9, 0, -14); hs3.rotation.y = -0.3; M.scene.add(hs3);
  M.sun.key.target.position.set(0, 0, -6); M.sun.key.position.set(8, 14, 6);
  const B2 = balloon(4); M.scene.add(B2.group);
  const c1 = mk('kid', { height: 1.35 }), c2 = mk('man'), c3 = mk('lady'), r1 = mk('man'), r2 = mk('hand2');
  const hood = [B2, c1, c2, c3, r1, r2]; [c1, c2, c3, r1, r2].forEach((p) => M.scene.add(p.group));
  const ropeA = rope(M.scene), ropeB = rope(M.scene);
  const onlyM = (...keep) => { hood.forEach((p) => (p.group.visible = keep.includes(p))); ropeA.visible = ropeB.visible = keep.includes('ropes'); };

  // ── RIVER ──
  const O = SEA.ocean(E, { day: true });
  const B3 = balloon(4); O.scene.add(B3.group);
  const tug = SEA.steamer({ lights: false, hull: '#7A2E2E', funnelCol: '#F2C230' }); tug.scale.setScalar(0.6); O.scene.add(tug);
  const skyline = new THREE.Group(); for (let i = 0; i < 18; i++) { const h = 6 + ((i * 37) % 11) * 2.2; const b = new THREE.Mesh(new THREE.BoxGeometry(5, h, 5), WD.mat({ color: ['#9AA6B8', '#B8A88E', '#8A96A8', '#C9B79A'][i % 4] })); b.position.set(-60 + i * 7, h / 2, -70 - (i % 3) * 6); skyline.add(b); } O.scene.add(skyline);

  // ── AIRFIELD + SKY ──
  const A = WD.meadow(E, { fenceOn: false, flowers: false });
  A.sun.key.target.position.set(0, 0, -5); A.sun.key.position.set(8, 14, 6);
  const pl = trainer(); A.scene.add(pl); const B4 = balloon(5); A.scene.add(B4.group);
  const pilot = mk('pilot'), coach = mk('coach'); const air = [B4, pilot, coach]; [pilot, coach].forEach((p) => A.scene.add(p.group));
  const onlyA = (...keep) => air.forEach((p) => (p.group.visible = keep.includes(p)));
  const HIGH = 40;   // flight altitude

  // ═══ SHOTS ═══
  // 1a · frame 0: giant cat balloon over the parade street, handlers straining on the ropes; hook LET THEM FLY?
  { const st = 0, wf = Wd('fly', 0) - 0.1;
    add({ id: 'S01a', at: st, note: 'frame 0: low angle up at a giant orange cartoon cat balloon over a parade street, two handlers pulling its ropes, crowd on the boardwalks; hook LET THEM FLY?', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); B1.group.visible = true; B1.at(0, Math.sin(t * 2) * 0.15, -13); B1.set({ wob: t * 2, ropes: 1 }); h1.group.visible = h2.group.visible = true; holdPose(t);
      shoot(P.scene, street, V3(-1.2, 0.9, -2.5), V3(-0.6, 1.0, -4.2), V3(0, 5.0, -13), V3(0, 5.6, -13), k, { ...LK.day, fov: 62 });
      blit(); hook(['LET THEM', 'FLY?'], 1, { y: 300, size: 140, hiLine: 1 });
    } });
    cue(0, 'pop', { gain: 0.5 }); cue(wf, 'whoosh', { gain: 0.5 }); }
  // 1b · "fly away, on purpose." the handlers let go, the balloon shoots up, camera tilts after it; stamp ON PURPOSE!
  { const st = Wd('fly', 0) - 0.1, wp = Wd('purpose', 0);
    add({ id: 'S01b', at: st, note: 'the handlers throw their hands up and let go; the balloon rockets up into blue sky, camera tilts up after it; stamp ON PURPOSE!', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)), up = eo(clamp(lt / 1.6)); B1.at(0, up * 22, -13); B1.set({ wob: t * 3, ropes: 1, mood: 'shock' }); h1.group.visible = h2.group.visible = true;
      h1.at(-1.6, 0, -11.6); h2.at(1.6, 0, -11.4); h1.set({ mood: 'laugh', armR: [160, 0], armL: [160, 0], legs: 'jump', phase: clamp(lt * 2) }); h2.set({ mood: 'happy', armL: [160, 0], armR: [150, 10] });
      shoot(P.scene, street, V3(0.8, 1.4, -3.0), V3(0.4, 1.2, -4.0), V3(0, 4, -12), V3(0, 18, -13), k, { ...LK.day, fov: 60 }, undefined, lerp(0, 0.08, k));
      blit(); if (lt < 0.3) speedLines(1 - lt / 0.3, 1); stamp(['ON', 'PURPOSE!'], (t - wp) / 0.2, { y: 470, size: 90, col: '#E3262E' });
    } });
    cue(st + 0.1, 'whoosh', { gain: 0.7 }); cue(wp, 'stamp', { gain: 0.7 }); }

  // 2a · "After the parade," wide crane over the street, the crowd waves at a tiny balloon high up; calendar 1928
  { const st = cut(1), wy = Wd('after', 1);
    add({ id: 'S02a', at: st, note: 'wide crane down the street: the crowd looks up at the balloon now small and high; calendar card NOV 1928 slams in', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); B1.at(0, 24 + lt * 3, -22); B1.set({ wob: t * 2, ropes: 1 }); h1.group.visible = h2.group.visible = false;
      shoot(P.scene, street, V3(3, 9, 8).add(shake(t, wy + 0.15)), V3(2, 6, 4), V3(0, 6, -16), V3(0, 14, -20), k, { ...LK.day, fov: 56 });
      blit(); calCard('NOV', '1928', 540, 440, eob(clamp((t - wy) / 0.25)), -0.06);
    } });
    cue(st, 'slide', { dur: 0.5, gain: 0.5 }); cue(wy + 0.15, 'slam', { gain: 0.7 }); }
  // 2b · "they just let them go," close on a handler waving bye-bye, balloon tiny behind
  { const st = Wd('they', 1) - 0.1, wg = Wd('go', 1);
    add({ id: 'S02b', at: st, note: 'medium: the striped handler waves goodbye with both arms, grinning; the balloon is a speck in the sky behind; pill BYE-BYE!', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); B1.at(-4, 30, -40); B1.set({ wob: t * 2, ropes: 1 }); h1.group.visible = true; h2.group.visible = false;
      h1.at(0, 0, -9); h1.set({ mood: 'laugh', armR: [lerp(120, 165, Math.abs(Math.sin(t * 8))), 20], armL: [lerp(165, 120, Math.abs(Math.sin(t * 8))), 20], look: [0, -0.5], blink: blink(t) });
      shoot(P.scene, street, V3(1.6, 1.1, -5.2), V3(1.1, 1.0, -6.2), V3(-0.6, 2.8, -11), null, k, { ...LK.day, fov: 54 });
      blit(); pill('BYE-BYE!', (t - wg) / 0.25, 300, 'rgba(31,28,51,0.9)', 64);
    } });
    cue(wg, 'boing', { gain: 0.6 }); }

  // 3 · "with a reward of a hundred dollars for each one." balloon drifting among clouds; reward tag slams; cash rain
  { const st = cut(2), wr = Wd('reward', 2), wh = Wd('hundred', 2);
    add({ id: 'S03', at: st, note: 'in the sky: the cat balloon drifts past clouds, camera orbits it; a big tag RETURN TO MACY\'S $100 pops in; cash rains on "hundred"', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); onlyA(B4); pl.visible = false; B4.at(0, HIGH, -10); B4.set({ wob: t * 2, ropes: 1 });
      const a = lerp(-0.4, 0.3, k), cp = V3(Math.sin(a) * 12, HIGH + 2.5, -10 + Math.cos(a) * 12); shoot(A.scene, air, cp, cp, V3(0, HIGH + 4.5, -10), null, 0, { ...LK.day, fov: 54 });
      blit(); rewardTag((t - wr + 0.1) / 0.3, 540, 990); cashRain(t, wh, 22);
    } });
    cue(wr, 'pop', { gain: 0.7 }); cue(wh, 'ding', { gain: 0.7 }); }

  // 4a · "So people chased them" low angle: a kid, a man in a bowler and a lady run toward camera looking up; ! pops
  { const st = cut(3), wc = Wd('chased', 3);
    add({ id: 'S04a', at: st, note: 'low angle in a neighborhood: a kid, a man in a bowler and a lady sprint toward the camera, pointing up; speed lines; ! pops', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); onlyM(c1, c2, c3); const run = lt * 2.2;
      [[c1, -0.75, 0], [c2, 0.1, -1.0], [c3, 0.9, -0.3]].forEach(([p, x, dz], i) => { p.at(x, 0, -1.8 + dz + run); p.set({ mood: ['happy', 'shock', 'laugh'][i], legs: 'run', phase: t * 9 + i, armR: i === 1 ? [150, 0] : [70, -60], armL: i === 1 ? [60, -40] : [150, 0], look: [0, -0.6], lean: 8 }); });
      shoot(M.scene, hood, V3(0.3, 0.6, 4.6), V3(0.1, 0.7, 5.6), V3(0, 1.5, -1 + run), null, k, { ...LK.day, fov: 58 });
      blit(); speedLines(0.6, 3); mark('!', 760, 380, (t - wc) / 0.25);
    } });
    cue(st, 'zip', { gain: 0.5 }); cue(wc, 'pop', { gain: 0.6 }); }
  // 4b · "across rooftops," high angle: the balloon skims low over the houses, chasers far below
  { const st = Wd('across', 3) - 0.1;
    add({ id: 'S04b', at: st, note: 'high angle over the rooftops: the cat balloon drifts low over the houses toward the purple-roof house; the three chasers run across the lawn below', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); onlyM(B2, c1, c2, c3); B2.at(lerp(-8, -1, k), lerp(7, 4.5, k), -11); B2.set({ wob: t * 2, ropes: 0.6 });
      [[c1, -3], [c2, -1.6], [c3, -0.2]].forEach(([p, x], i) => { p.at(x + k * 2.5, 0, -3.4 - i * 0.3); p.set({ mood: 'happy', legs: 'run', phase: t * 9 + i, armR: [150, 0], look: [0, -0.8], lean: 8 }); });
      shoot(M.scene, hood, V3(-6, 9, 6), V3(-2, 10, 5), V3(-3, 4, -8), V3(0, 4.5, -9), k, { ...LK.day, fov: 56 });
      blit();
    } });
    cue(st, 'whoosh', { gain: 0.5 }); }

  // 5 · "fought over one on a roof," balloon stuck on the roof, two men tug it apart; it rips; stamp RIPPED!
  { const st = cut(4), wr = Wd('roof', 4);
    add({ id: 'S05', at: st, note: 'the balloon sits stuck on the roof ridge; two men in the yard pull ropes in opposite directions, leaning back; on "roof" it rips, stars burst; stamp RIPPED!', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); onlyM(B2, r1, r2, 'ropes'); const rp = clamp((t - wr) / 0.3);
      B2.at(0, 2.9 - rp * 0.4, -10); B2.set({ ropes: 0, mood: rp > 0 ? 'shock' : 'happy', rip: rp, squash: rp * 0.4, wob: Math.sin(t * 20) * 0.6 });
      r1.at(-2.0 - rp * 0.3, 0, -4.4); r2.at(2.0 + rp * 0.3, 0, -4.6);
      r1.set({ mood: 'angry', armR: [100, 30], armL: [100, 30], lean: -12, sweat: 1 }); r2.set({ mood: 'angry', armL: [100, 30], armR: [100, 30], lean: 12, sweat: 1, flip: true });
      ropeA.span(V3(-0.5, 5.4, -9.8), V3(-1.5 - rp * 0.3, 1.25, -4.4)); ropeB.span(V3(0.5, 5.4, -9.8), V3(1.5 + rp * 0.3, 1.25, -4.6));
      shoot(M.scene, hood, V3(0, 2.0, 7.0).add(shake(t, wr, 0.12)), V3(0, 2.4, 5.6), V3(0, 3.0, -7), null, k, { ...LK.day, fov: 58 }, undefined, lerp(-0.04, 0.04, k));
      blit(); stars(540, 470, (t - wr) / 0.7); stamp(['RIPPED!'], (t - wr - 0.1) / 0.2, { y: 330, size: 96, col: '#E3262E' });
    } });
    cue(st, 'slide', { dur: 0.5, gain: 0.4 }); cue(wr, 'slam', { gain: 0.8 }); }

  // 6a · "and tugboats raced after one" river: half-deflated balloon floating, a red tugboat speeds in
  { const st = cut(5), wt = Wd('tugboats', 5);
    add({ id: 'S06a', at: st, note: 'river with a city skyline: a half-deflated cat balloon bobs on the water; a red tugboat with a yellow funnel speeds in from the left; speed lines', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); O.update(t, cam); B3.at(4, -0.6 + Math.sin(t * 2) * 0.1, -8); B3.set({ ropes: 0, squash: 0.45, mood: 'shock', wob: t });
      tug.position.set(lerp(-10, -2, eo(clamp(lt / d))), 0, -10); tug.rotation.y = 0.15;
      shoot(O.scene, [B3], V3(-4, 2.2, 8), V3(0, 2.0, 6), V3(-6, 1.5, -10), V3(1, 1.5, -10), k, { ...LK.day, fov: 54 });
      blit(); speedLines(0.4, 5); mark('!', 300, 380, (t - wt) / 0.25);
    } });
    cue(wt, 'whoosh', { gain: 0.6 }); }
  // 6b · "in the East River." low near the water, the tug passes close; ribbon EAST RIVER, NYC
  { const st = Wd('east', 5) - 0.12, we = Wd('east', 5);
    add({ id: 'S06b', at: st, note: 'water-level close shot: the tug pushes past right next to the floating balloon, waves splash; gold ribbon EAST RIVER, NEW YORK', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); O.update(t, cam); B3.at(1.5, -0.6 + Math.sin(t * 2) * 0.1, -6); B3.set({ ropes: 0, squash: 0.45, mood: 'shock', wob: t });
      tug.position.set(lerp(-5, 2, k), 0, -10.5); tug.rotation.y = 0.1;
      shoot(O.scene, [B3], V3(5, 0.9, 2), V3(4, 1.1, 0.6), V3(0, 1.4, -8), null, k, { ...LK.day, fov: 56 }, undefined, lerp(0.05, -0.03, k));
      blit(); ribbon('EAST RIVER, NEW YORK', (t - we) / 0.3, 330, 66);
    } });
    cue(we, 'ding', { gain: 0.5 }); }

  // 7 · "Follow for more strange true stories." handler points at the viewer, a new balloon over the street
  { const st = cut(6);
    add({ id: 'S07', at: st, note: 'back on the street: the striped handler points at the viewer, grinning, a new balloon held behind; SUBSCRIBE button pressed', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); B1.at(0, Math.sin(t * 2) * 0.15, -21); B1.set({ wob: t * 2, ropes: 1 }); h2.group.visible = false; h1.group.visible = true;
      h1.at(0.6, 0, -8.6); h1.set({ mood: 'happy', armR: [95, 0], armL: [20, 10], talk: talk(t), blink: blink(t) });
      shoot(P.scene, street, V3(-0.4, 1.5, -4.6), V3(0.0, 1.5, -5.6), V3(0.4, 1.9, -9), null, k, { ...LK.day, fov: 52 });
      blit(); subscribe(lt / 0.45 + (lt > 0.8 ? (lt - 0.8) * 1.4 : 0), t, 330);
    } });
    cue(st, 'pop', { gain: 0.6 }); cue(st + 1.25, 'ding', { gain: 0.6 }); }

  // 8a · "Then, in nineteen thirty-two," airfield: a little yellow plane, calendar 1932 slams
  { const st = cut(7), wy = Wd('nineteen', 7);
    add({ id: 'S08a', at: st, note: 'crane down onto a grass airfield with a little yellow high-wing plane, propeller spinning; calendar 1932 slams in', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); onlyA(); pl.visible = true; pl.position.set(0, 1.0, -6); pl.rotation.set(0, 0.5, 0); pl.prop.rotation.x = t * 30;
      shoot(A.scene, air, V3(6, 7, 4).add(shake(t, wy + 0.15)), V3(4, 2.2, 2), V3(0, 1, -6), null, k, { ...LK.day, fov: 54 });
      blit(); calCard('THE YEAR', '1932', 540, 440, eob(clamp((t - wy) / 0.25)), 0.05);
    } });
    cue(st, 'slide', { dur: 0.5, gain: 0.5 }); cue(wy + 0.15, 'slam', { gain: 0.7 }); }
  // 8b · "a student pilot" the student pilot in goggles walks to the plane, proud; pill STUDENT PILOT
  { const st = Wd('student', 7) - 0.12;
    add({ id: 'S08b', at: st, note: 'a young woman pilot in a leather cap and goggles walks past the plane, chin up, proud; pill STUDENT PILOT', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); onlyA(pilot); pl.visible = true; pl.position.set(0, 1.0, -6); pl.rotation.set(0, 0.5, 0); pl.prop.rotation.x = t * 30;
      pilot.at(lerp(-2.6, -1.2, k), 0, -2.6); pilot.set({ mood: 'proud', legs: 'walk', phase: t * 7, armL: [20, 10], armR: [150, 0], blink: blink(t) });
      shoot(A.scene, air, V3(-3.6, 1.3, 2.2), V3(-2.8, 1.4, 1.4), V3(-1.6, 1.4, -3), null, k, { ...LK.day, fov: 50 });
      blit(); pill('STUDENT PILOT', (t - st - 0.1) / 0.25, 300, 'rgba(31,28,51,0.9)', 64);
    } });
    cue(st + 0.1, 'pop', { gain: 0.6 }); }
  // 8c · "flew into one." chase camera: the plane heads straight at a balloon; ! on "one"
  { const st = Wd('flew', 7) - 0.1, wo = Wd('one', 7);
    add({ id: 'S08c', at: st, note: 'in the sky, chase camera behind the little plane as it flies straight at a floating cat balloon; the balloon looks shocked; ! pops', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); onlyA(B4); pl.visible = true; const x = lerp(-14, -3.4, clamp(lt / d)); pl.position.set(x, HIGH + 2.6, -10); pl.rotation.set(0, 0, 0.05); pl.prop.rotation.x = t * 30;
      B4.at(0, HIGH - 1.0, -10); B4.set({ wob: t * 2, ropes: 1, mood: 'shock' });
      shoot(A.scene, air, V3(x - 8, HIGH + 4.5, -4), V3(x - 6, HIGH + 4.0, -5), V3(x + 4, HIGH + 3, -10), null, 0, { ...LK.day, fov: 54 });
      blit(); speedLines(0.5, 7); mark('!', 720, 420, (t - wo) / 0.25);
    } });
    cue(st, 'zip', { dur: 0.6, gain: 0.5 }); cue(wo, 'thud', { gain: 0.7 }); }

  // 9a · "It wrapped around her wing," the balloon drapes over the wing, the plane wobbles
  { const st = cut(8), ww = Wd('wing', 8);
    add({ id: 'S09a', at: st, note: 'side view in the sky: the deflating balloon is wrapped over the plane\'s left wing; the plane wobbles; pill WRAPPED ON THE WING', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); onlyA(B4); pl.visible = true; pl.position.set(0, HIGH, -10); pl.rotation.set(Math.sin(t * 9) * 0.25, 0, Math.sin(t * 6) * 0.1); pl.prop.rotation.x = t * 30;
      B4.at(0.6, HIGH - 3.5, -10 - 2.5); B4.set({ ropes: 0, squash: 0.35, mood: 'shock', wob: t * 6 });
      shoot(A.scene, air, V3(-2, HIGH + 1.2, 6), V3(-1, HIGH + 1.6, 4.6), V3(0.4, HIGH + 0.3, -9), null, k, { ...LK.day, fov: 56 });
      blit(); pill('WRAPPED ON THE WING', (t - ww) / 0.25, 300, 'rgba(160,30,40,0.92)', 56);
    } });
    cue(st, 'whoosh', { gain: 0.5 }); cue(ww, 'thud', { gain: 0.6 }); }
  // 9b · "and the plane spun down." tailspin: camera rolls, red tint, stamp TAILSPIN!
  { const st = Wd('and', 8) - 0.1, ws = Wd('spun', 8);
    add({ id: 'S09b', at: st, note: 'the little plane spins nose-down through the sky, camera rolling with it, red warning tint; stamp TAILSPIN!', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); onlyA(); pl.visible = true; const y = HIGH - lt * 6; pl.position.set(0, y, -10); pl.rotation.set(lt * 9, 0, -1.0); pl.prop.rotation.x = t * 30;
      shoot(A.scene, air, V3(-12, y + 4, 2), V3(-11, y + 2, 3), V3(0, y, -10), null, k, { ...LK.day, fov: 58 }, undefined, Math.sin(lt * 5) * 0.3);
      blit(); tint(1, '#D8343F'); speedLines(0.5, 9); stamp(['TAILSPIN!'], (t - ws) / 0.2, { y: 360, size: 96, col: '#E3262E' });
    } });
    cue(st, 'whoosh', { dur: 1.0, gain: 0.7 }); cue(ws, 'slam', { gain: 0.6 }); }

  // 10a · "Her instructor saved it," the plane levels out and climbs; stars
  { const st = cut(9), wsv = Wd('saved', 9);
    add({ id: 'S10a', at: st, note: 'the plane pulls out of the dive and levels off, the torn balloon falling away below; gold stars pop; pill SAVED!', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); onlyA(B4); pl.visible = true; const lev = eo(clamp(lt / 0.8)); pl.position.set(lerp(-4, 4, k), HIGH - 10 + lev * 2, -10); pl.rotation.set(lerp(0.8, 0, lev), 0, lerp(-0.6, 0.15, lev)); pl.prop.rotation.x = t * 30;
      B4.at(-3, HIGH - 14 - lt * 4, -12); B4.set({ ropes: 0, squash: 0.7, rip: 1, mood: 'shock', wob: t * 3 });
      shoot(A.scene, air, V3(-2, HIGH - 8, 6), V3(1, HIGH - 7, 5), V3(-4, HIGH - 9, -10), V3(4, HIGH - 8, -10), k, { ...LK.day, fov: 56 });
      blit(); stars(540, 640, (t - wsv) / 0.7); pill('SAVED!', (t - wsv) / 0.25, 300, 'rgba(46,138,90,0.94)', 72);
    } });
    cue(wsv, 'sparkle', { gain: 0.7 }); }
  // 10b · "barely." on the ground: instructor wipes his brow, the student pilot dizzy
  { const st = Wd('barely', 9) - 0.15;
    add({ id: 'S10b', at: st, note: 'back on the grass: the instructor with a mustache wipes his brow, sweating; the student pilot beside him looks dizzy; pill ...BARELY', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); onlyA(pilot, coach); pl.visible = true; pl.position.set(-1, 1.0, -11); pl.rotation.set(0, 0.5, 0); pl.prop.rotation.x = 0;
      coach.at(-0.5, 0, -3.4); coach.set({ mood: 'tired', sweat: 1, armR: [150, -110], armL: [20, 10], blink: blink(t) });
      pilot.at(0.9, 0, -3.2); pilot.set({ mood: 'dizzy', armL: [60, -40], armR: [60, -40], bob: Math.sin(t * 6) * 4 });
      shoot(A.scene, air, V3(-0.2, 1.5, 1.9), V3(0.1, 1.5, 1.1), V3(0.2, 1.4, -3.3), null, k, { ...LK.day, fov: 50 });
      blit(); pill('...BARELY.', (t - st - 0.05) / 0.25, 300, 'rgba(31,28,51,0.9)', 66);
    } });
    cue(st, 'boing', { gain: 0.5 }); }

  // 11a · "Now they deflate them." street: the balloon sags flat, handlers fold it; pill TODAY: DEFLATED
  { const st = cut(10), wd = Wd('deflate', 10);
    add({ id: 'S11a', at: st, note: 'parade street today: the cat balloon sags and flattens to the ground while both handlers press it down; pill TODAY: DEFLATED', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); const sq = eo(clamp((t - wd + 0.2) / 0.7)); B1.at(0, -sq * 2.2, -13); B1.set({ ropes: 1 - sq, squash: sq, wob: t });
      h1.group.visible = h2.group.visible = true; h1.at(-1.8, 0, -11.2); h2.at(1.8, 0, -11.0);
      h1.set({ mood: 'smug', armR: [80, -20], armL: [80, -20], lean: 10 }); h2.set({ mood: 'happy', armL: [80, -20], armR: [80, -20], lean: -10 });
      shoot(P.scene, street, V3(3.0, 2.6, -1.5), V3(2.4, 2.4, -2.8), V3(0, 2.4, -12), null, k, { ...LK.day, fov: 56 });
      blit(); pill('TODAY: DEFLATED', (t - wd) / 0.25, 300, 'rgba(31,28,51,0.9)', 62);
    } });
    cue(wd, 'inhale', { dur: 0.7, gain: 0.5 }); }
  // 11b · "But back then," straight back to the frame-0 setup: loop
  { const st = Wd('but', 10) - 0.1, wb = Wd('back', 10);
    add({ id: 'S11b', at: st, note: 'loop: whip back to the opening picture: the full balloon over the street held by both handlers, the hook LET THEM FLY? slams back in', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); B1.at(0, Math.sin(t * 2) * 0.15, -13); B1.set({ wob: t * 2, ropes: 1 }); h1.group.visible = h2.group.visible = true; holdPose(t);
      shoot(P.scene, street, V3(-2.2, 1.0, 1.0), V3(-1.2, 0.9, -2.5), V3(0, 5.6, -13), V3(0, 5.0, -13), k, { ...LK.day, fov: 62 });
      blit(); if (lt < 0.2) speedLines(1 - lt / 0.2, 4); hook(['LET THEM', 'FLY?'], (t - wb) / 0.3, { y: 300, size: 140, hiLine: 1 });
    } });
    cue(st, 'whoosh', { gain: 0.6 }); cue(wb, 'pop', { gain: 0.6 }); }

  return { shots: S, cues: CUES };
}
