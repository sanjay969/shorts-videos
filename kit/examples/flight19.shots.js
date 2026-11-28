// 27 MEN VANISHED OFF FLORIDA IN ONE NIGHT (Flight 19 + Training 49, Dec 5 1945) — Tall Tale 3D, cold teal mystery grade.
// Respectful: no wreck gore, no speculation as fact. Generic toons (no likeness), generic Navy planes.
import * as THREE from 'three';
import { ctx, clamp, lerp, eo, eio, eob, rnd } from './core/lib.js';
import { L, Le, Wd, T } from './core/timing.js';
import * as WD from './core/world.js';
import { Toon, INK } from './core/toon.js';
import { ocean, deck, wireless } from './core/sea.js';
import { flames } from './core/town.js';
import { V3, talk, blink, hook, ribbon, pill, stamp, calCard, flash, tint, mark, makeShoot, P2 } from './jh.js';
import { bomber, flyingBoat, airfield, compass, redArrow, floridaMap, people, bigNum, followBtn, zoomBlur, haze, topShade } from './f19.js';

const LOOKS = {
  pilot: { body: '#7A6248', pattern: 'plain', hat: 'pilot', hatCol: '#6B4A2E', neck: 'scarf', neckCol: '#F4EFE4' },
  crew1: { body: '#7A6248', pattern: 'plain', hat: 'pilot', hatCol: '#4A3A2A', neck: 'none', extra: ['mustache'] },
  crew2: { body: '#5E6A4A', pattern: 'plain', hat: 'pilot', hatCol: '#5A4030', neck: 'scarf', neckCol: '#D8C8A0' },
  radio: { body: '#F4EFE4', pattern: 'plain', hat: 'cap', hatCol: '#F4EFE4', neck: 'tie', neckCol: '#1E2A44', extra: ['glasses'] },
  sailor: { body: '#2E3A5A', pattern: 'plain', hat: 'beanie', hatCol: '#2E3A5A', band: '#2E3A5A', neck: 'scarf', neckCol: '#F4EFE4' },
};
const mk = (k, o) => new Toon({ ...LOOKS[k], extra: [...(LOOKS[k].extra || [])] }, o);
const COLD = { warm: -0.06, sat: 1.05, vignette: 0.32 };
const LKs = { bloom: 0.12, bloomThreshold: 1.08, aperture: 0.00012, maxblur: 0.003, ...COLD };
const LKr = { bloom: 0.1, bloomThreshold: 1.08, aperture: 0.0002, maxblur: 0.003, ...COLD };
const GL = () => document.getElementById('gl');

export function buildShots(E) {
  const S = [], CUES = [], add = (o) => (S.push(o), o), cue = (t, type, o = {}) => CUES.push({ t: +Math.max(0, t).toFixed(3), type, ...o });
  const cut = (i) => (i === 0 ? 0 : L(i) - 0.06);
  const { shoot } = makeShoot(E);
  const shake = (t, t0, a = 0.3) => { const k = t - t0; if (k < 0 || k > 0.4) return V3(0, 0, 0); const f = (1 - k / 0.4) * a; return V3(Math.sin(k * 90) * f, Math.cos(k * 70) * f, 0); };
  const buzz = (t, a) => V3(Math.sin(t * 37) * a, Math.cos(t * 29) * a, Math.sin(t * 23) * a * 0.5);

  // ── formation: five bombers in a loose V, flying +x ──
  const SLOTS = [[0, 0, 0], [-9, -1.2, 10], [-9, 0.8, -10], [-18, -0.6, 20], [-18, 1.2, -20]];
  const formation = (scene, col) => { const grp = new THREE.Group(); scene.add(grp); const pl = SLOTS.map(([x, y, z]) => { const b = bomber(col); b.position.set(x, y, z); grp.add(b); return b; }); return { grp, pl }; };
  const SPEED = 55, ALT = 55;
  const fpos = (t) => V3(t * SPEED, ALT, 0);
  const bobPl = (pl, t) => pl.forEach((b, i) => { b.position.y = SLOTS[i][1] + Math.sin(t * 1.3 + i) * 0.35; b.rotation.x = Math.sin(t * 0.9 + i * 2) * 0.05; b.update(t); });
  const keyFollow = (sea, p) => { sea.sun.key.position.set(p.x + 20, p.y + 30, p.z + 25); sea.sun.key.target.position.copy(p); };

  // DAY sea (afternoon), STORM sea (lost at dusk), NIGHT sea (the ship)
  const DAY = ocean(E, { day: true }); WD.clouds(DAY.scene, [[-80, 70, -200, 40], [60, 80, -220, 50], [160, 66, -180, 34], [-200, 60, -160, 30], [260, 70, -120, 30]]);
  const FD = formation(DAY.scene, '#4E6C8E');
  const ST = ocean(E, { storm: true });
  const FS = formation(ST.scene, '#4A6684');
  WD.clouds(ST.scene, [[120, 62, -40, 60], [260, 58, 30, 70], [520, 62, -60, 90], [620, 60, -80, 80], [760, 62, -40, 90]], '#9AA6B4');
  const boat = flyingBoat('#56708E'); ST.scene.add(boat);
  const boatMats = []; boat.traverse((m) => { if (m.material) { m.material = m.material.clone(); m.material.transparent = true; boatMats.push([m.material, m.material.opacity]); } });
  const boatFade = (f) => boatMats.forEach(([m, o]) => { m.opacity = o * (1 - f); m.depthWrite = f < 0.05; });
  const NT = ocean(E, {});
  const ship = deck({ funnelCol: '#7A3A2A', w: 14 }); ship.position.set(0, 3, 0); NT.scene.add(ship);
  const fire = flames(9, 3.0, 90); fire.position.set(-6, 0.2, -70); NT.scene.add(fire);
  const fire2 = flames(6, 1.8, 30); fire2.position.set(3, 0.2, -74); NT.scene.add(fire2);
  const glowM = new THREE.MeshBasicMaterial({ color: new THREE.Color('#FF7A2A').multiplyScalar(0.9), transparent: true, opacity: 0.35, depthWrite: false, toneMapped: false });
  const glow = new THREE.Mesh(new THREE.CircleGeometry(16, 32), glowM); glow.rotation.x = -Math.PI / 2; glow.position.set(-3, 0.35, -72); NT.scene.add(glow);
  const sailor = mk('sailor'); NT.scene.add(sailor.group);

  // cockpit pilots ride in the lead bombers
  const pilotS = mk('pilot', { height: 1.55 }); FS.pl[0].add(pilotS.group); pilotS.at(2.5, 0.05, 0);
  const pilotD = mk('pilot', { height: 1.55 }); FD.pl[0].add(pilotD.group); pilotD.at(2.5, 0.05, 0);

  // airfield
  const AF = airfield(E); const parked = [-38, -19, 0, 19, 38].map((z) => { const b = bomber('#4E6C8E'); b.position.set(0, 1.25, z); b.rotation.z = 0.08; b.disc.visible = false; AF.scene.add(b); return b; });
  const c1 = mk('pilot'), c2 = mk('crew1'), c3 = mk('crew2'); [c1, c2, c3].forEach((p) => AF.scene.add(p.group));

  // radio room
  const RM = WD.interior(E, { w: 8, depth: 6, h: 4, wall: '#3E5048', motif: '#4A5E54', floor: '#5A4A3A', ceiling: '#1E2A26', signText: null, picture: false, counterOn: false, litter: false });
  RM.sun.key.target.position.set(0, 0, -3);
  const wset = wireless(); wset.position.set(0.9, 0, -4.4); RM.scene.add(wset);
  const radioman = mk('radio'); RM.scene.add(radioman.group);

  const W = (w, l) => Wd(w, l);

  // ═══ SHOTS ═══
  // 0a · COVER (frame 0)
  { const st = 0;
    add({ id: 'S00', at: st, note: 'COVER: storm sky, close on the shocked pilot in the glass canopy, sweat; huge spinning compass with red circle; text WHERE DID THEY GO?', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); const p = fpos(t + 30); FS.grp.position.copy(p); bobPl(FS.pl, t); keyFollow(ST, p); boat.visible = false;
      pilotS.set({ mood: 'shock', sweat: 1, armL: [120, -60], armR: [40, -20], look: [0.3, -0.2], blink: 0 });
      const lead = FS.pl[0].position.clone().add(p); const cam = lead.clone().add(V3(lerp(5.4, 4.9, k), 2.15, lerp(2.7, 2.35, k))).add(buzz(t, 0.02)); ST.update(t, { position: cam });
      shoot(ST.scene, [pilotS], cam, null, lead.clone().add(V3(2.5, 1.05, 0)), null, 0, { ...LKs, fov: 36, exposure: 1.05 }, undefined, -0.06);
      blit(); topShade(0.55); compass(1, t * 9, { x: 790, y: 960, s: 0.68, circle: 1 });
      hook(['WHERE DID', 'THEY GO?'], 1, { y: 330, size: 150, hiLine: 1, hi: '#FF3B3B' });
    } });
    cue(0, 'boom', { gain: 0.8 }); }
  // 0b · "took off," DRONE dive
  { const st = W('took', 0) - 0.12;
    add({ id: 'S01', at: st, note: 'DRONE: fast dive from high in the sky down onto five Navy bombers in a V over a sunlit teal sea, zoom blur, haze; pill 5 NAVY BOMBERS', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); const p = fpos(t); FD.grp.position.copy(p); bobPl(FD.pl, t); keyFollow(DAY, p);
      const cam = p.clone().add(V3(lerp(-40, -34, k), lerp(150, 14, k), lerp(70, 26, k))); DAY.update(t, { position: cam });
      shoot(DAY.scene, [pilotD], cam, null, p.clone().add(V3(-6, 0, 0)), null, 0, { ...LKs, fov: 52, aperture: 0 });
      blit(); zoomBlur(GL(), (1 - k) * 1.2, { cy: 1000 }); haze((1 - k) * 0.6); topShade(0.4);
      pill('5 NAVY BOMBERS', (t - st - 0.15) / 0.25, 300, 'rgba(14,24,40,0.9)', 66);
    } });
    cue(st, 'whoosh', { dur: 0.9, gain: 0.8 }); }
  // 0c · "not one was ever found."
  { const st = W('not', 0) - 0.1, wf = W('found.', 0);
    add({ id: 'S02', at: st, note: 'side tracking shot at dusk: the five bombers fly into a grey cloud bank and fade; stamp NEVER FOUND', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); const p = V3(lerp(60, 160, clamp(lt / d)), ALT, 0); FS.grp.position.copy(p); bobPl(FS.pl, t); keyFollow(ST, p); boat.visible = false;
      const cam = V3(lerp(30, 70, k), ALT + 6, 70); ST.update(t, { position: cam });
      shoot(ST.scene, [pilotS], cam, null, V3(lerp(80, 150, k), ALT, -10), null, 0, { ...LKs, fov: 46, exposure: 0.95 });
      blit(); haze(0.25 + 0.5 * clamp((t - wf + 0.4) / 0.6), '150,165,180'); stamp(['NEVER FOUND'], (t - wf) / 0.2, { y: 400, size: 108, col: '#E3262E' });
    } });
    cue(st, 'slide', { dur: 0.8, gain: 0.4 }); cue(wf, 'stamp', { gain: 0.7 }); }

  // 1 · airfield crane-up
  { const st = cut(1), wd = W('december', 1), wy = W('nineteen', 1);
    add({ id: 'S03', at: st, note: 'crane-up over a sunny 1940s Navy airfield: five bombers parked wingtip to wingtip, hangar, palms; ribbon FLORIDA, calendar DEC 5 + pill 1945', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); parked.forEach((b) => b.update(t * 0.3)); [c1, c2, c3].forEach((p) => (p.group.visible = false));
      shoot(AF.scene, [], V3(lerp(26, 34, k), lerp(2.0, 14, k), lerp(14, 30, k)), null, V3(0, 1.5, 6), V3(-4, 1, 0), k, { ...LKs, fov: 50, warm: -0.02 });
      blit(); topShade(0.35); ribbon('FLORIDA', (t - st - 0.1) / 0.3, 300, 84); calCard('DEC', '5', 540, 560, eob(clamp((t - wd) / 0.25)), -0.06, '#1E3A6E'); pill('1945', (t - wy) / 0.25, 790, 'rgba(14,24,40,0.9)', 64);
    } });
    cue(st, 'whoosh', { gain: 0.6 }); cue(wd, 'slam', { gain: 0.6 }); cue(wy, 'pop', { gain: 0.5 }); }

  // 2 · three flyers walk toward camera; 14 icons
  { const st = cut(2), wt = W('training', 2);
    add({ id: 'S04', at: st, note: 'low-angle slow push: three flyers in leather helmets walk toward camera from the parked bombers; 14 little-man icons pop in; pill TRAINING FLIGHT', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); const f = clamp(lt / d);
      [[c1, 0, 'smug'], [c2, -1.6, 'happy'], [c3, 1.6, 'neutral']].forEach(([p, z, m], i) => { p.group.visible = true; p.at(lerp(9.5, 12.5, f) - Math.abs(z) * 0.4, 0, z); p.set({ mood: m, legs: 'walk', phase: t * 7 + i, armR: [30 + i * 10, -20], armL: [20, 10], blink: blink(t, i), holdR: i === 0 ? P2.clip : undefined, v: 'c' + i }); });
      shoot(AF.scene, [c1, c2, c3], V3(lerp(20, 18.2, k), 0.55, lerp(2.6, 1.8, k)), null, V3(10, 1.4, 0), null, 0, { ...LKs, fov: 48, warm: -0.02 });
      blit(); topShade(0.45); people(clamp((t - st) / 0.9) * 14, 14, { y: 330, cols: 7, size: 0.8 }); pill('TRAINING FLIGHT', (t - wt) / 0.25, 560, 'rgba(14,24,40,0.9)', 58);
    } });
    for (let i = 0; i < 4; i++) cue(st + 0.1 + i * 0.2, 'pop', { gain: 0.35 }); cue(wt, 'pop', { gain: 0.5 }); }

  // 3a · leader radioes
  { const st = cut(3), wr = W('radioed,', 3);
    add({ id: 'S05', at: st, note: 'orbiting close on the leader in the canopy over a grey sea: he holds the mic and talks, worried; yellow radio arcs; pill THE LEADER', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); const p = fpos(t + 40); FS.grp.position.copy(p); bobPl(FS.pl, t); keyFollow(ST, p); boat.visible = false;
      pilotS.set({ mood: 'worried', armR: [100, -110], holdR: P2.mic, v: 'mic', armL: [30, 10], talk: talk(t), look: [0.4, 0], blink: blink(t) });
      const lead = FS.pl[0].position.clone().add(p); const a = lerp(0.9, 0.35, k);
      const cam = lead.clone().add(V3(2.5 + Math.sin(a) * 4.2, 2.1, Math.cos(a) * 4.2)); ST.update(t, { position: cam });
      shoot(ST.scene, [pilotS], cam.add(buzz(t, 0.02)), null, lead.clone().add(V3(2.5, 1.05, 0)), null, 0, { ...LKs, fov: 38 });
      blit(); topShade(0.4); const q = clamp((t - wr) / 0.3); if (q > 0) { ctx.save(); ctx.strokeStyle = '#FFD43B'; ctx.lineWidth = 12; ctx.lineCap = 'round'; for (let i = 0; i < 3; i++) { const r = 70 + i * 55 + (t * 160) % 55; ctx.globalAlpha = q * (1 - i * 0.25); ctx.beginPath(); ctx.arc(620, 780, r, -0.9, 0.1); ctx.stroke(); } ctx.restore(); }
      pill('THE LEADER', (t - st - 0.1) / 0.25, 300, 'rgba(14,24,40,0.9)', 62);
    } });
    cue(st, 'whoosh', { gain: 0.5 }); cue(wr, 'chirp', { dur: 0.6, gain: 0.4 }); }
  // 3b · compasses out
  { const st = W('both', 3) - 0.1, wc = W('compasses', 3), wo = W('out.', 3);
    add({ id: 'S06', at: st, note: 'Dutch-angle punch-in on the panicking pilot; a giant compass spins wildly then gets a red X; red tint pulse; stamp COMPASSES OUT', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); const p = fpos(t + 40); FS.grp.position.copy(p); bobPl(FS.pl, t); keyFollow(ST, p); boat.visible = false;
      pilotS.set({ mood: 'shock', sweat: 1, armR: [150, -140], armL: [150, -140], look: [0, -0.3], blink: 0 });
      const lead = FS.pl[0].position.clone().add(p); const cam = lead.clone().add(V3(lerp(5.6, 4.6, k), 1.9, lerp(2.2, 1.7, k))); ST.update(t, { position: cam });
      shoot(ST.scene, [pilotS], cam.add(buzz(t, 0.05)), null, lead.clone().add(V3(2.5, 1.1, 0)), null, 0, { ...LKs, fov: 40 }, undefined, 0.16);
      blit(); tint(0.4 + 0.4 * Math.sin(t * 18)); compass(clamp((t - st) / 0.25), t * 14 + Math.sin(t * 5) * 3, { x: 540, y: 1110, s: 0.62, broken: (t - wo) / 0.25 });
      stamp(['COMPASSES OUT'], (t - wo - 0.15) / 0.2, { y: 330, size: 84, col: '#E3262E' });
    } });
    cue(st, 'zip', { gain: 0.5 }); cue(wc, 'alarm', { dur: 1.2, gain: 0.25 }); cue(wo, 'thud', { gain: 0.7 }); }

  // 4 · map: he thought Keys
  { const st = cut(4), wk = W('keys.', 4);
    add({ id: 'S07', at: st, note: 'slow push behind the formation over the grey sea (soft focus), a big Florida map card flips in: dotted route; blue pin HE THOUGHT on the Keys', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); const p = fpos(t + 50); FS.grp.position.copy(p); bobPl(FS.pl, t); keyFollow(ST, p); boat.visible = false;
      const cam = p.clone().add(V3(lerp(-46, -38, k), 10, lerp(8, 4, k))); ST.update(t, { position: cam });
      shoot(ST.scene, [pilotS], cam, null, p.clone().add(V3(0, -2, 0)), null, 0, { ...LKs, fov: 48, aperture: 0.0006, maxblur: 0.006, focus: 5 });
      blit(); topShade(0.4); floridaMap(clamp((t - st) / 0.3), { route: clamp((t - st - 0.2) / 1.2), pinA: (t - wk) / 0.25 });
    } });
    cue(st, 'slide', { dur: 0.5, gain: 0.5 }); cue(wk, 'pop', { gain: 0.6 }); }
  // 5 · He wasn't
  { const st = cut(5), ww = W('wasn\'t.', 5);
    add({ id: 'S08', at: st, note: 'punch-in on the map with a shake: red X over the Keys, red pin OPEN OCEAN drops far out east', draw(lt, d, t, blit) {
      const p = fpos(t + 50); FS.grp.position.copy(p); bobPl(FS.pl, t); keyFollow(ST, p); boat.visible = false;
      const cam = p.clone().add(V3(-36, 10, 4)).add(shake(t, st, 0.6)); ST.update(t, { position: cam });
      shoot(ST.scene, [pilotS], cam, null, p.clone().add(V3(0, -2, 0)), null, 0, { ...LKs, fov: 44, aperture: 0.0006, maxblur: 0.006, focus: 5 });
      blit(); topShade(0.4); ctx.save(); const z = lerp(1, 1.12, eo(clamp((t - st) / 0.3))); ctx.translate(540, 640); ctx.scale(z, z); ctx.translate(-540, -640);
      floridaMap(1, { route: 1, pinA: 1, cross: (t - st) / 0.2, pinB: (t - ww) / 0.25 }); ctx.restore();
    } });
    cue(st, 'thud', { gain: 0.7 }); cue(ww, 'boing', { gain: 0.4 }); }

  // 6 · strangest part: storm orbit
  { const st = cut(6), ws_ = W('strangest', 6);
    add({ id: 'S09', at: st, note: 'fast eased orbit around the formation in a dark storm at dusk, lightning flash, ? marks pop; riser builds', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); const p = fpos(t + 60); FS.grp.position.copy(p); bobPl(FS.pl, t); keyFollow(ST, p); boat.visible = false;
      const a = lerp(-1.2, 0.6, k); const cam = p.clone().add(V3(Math.cos(a) * 34 - 9, 6 + 4 * k, Math.sin(a) * 34)); ST.update(t, { position: cam });
      shoot(ST.scene, [pilotS], cam, null, p.clone().add(V3(-9, 0, 0)), null, 0, { ...LKs, fov: 50, exposure: 0.8 }, undefined, lerp(-0.1, 0.1, k));
      blit(); const fl = (t - ws_) > 0 && (t - ws_) < 0.12 ? 1 : 0; flash(fl * 0.8, '#DDE8FF'); tint(0.5, '#0A1830');
      [[260, 700], [820, 640]].forEach(([x, y], i) => mark('?', x, y, (t - ws_ - i * 0.15) / 0.3, '#FFD43B'));
    } });
    cue(st, 'riser', { dur: 1.6, gain: 0.7 }); cue(ws_, 'boom', { gain: 0.5 }); }

  // 7 · rescue plane DRONE
  { const st = cut(7), w13 = W('thirteen', 7);
    add({ id: 'S10', at: st, note: 'DRONE: high wide fly-over that sweeps down beside a big twin-engine flying boat over the dusk sea, haze; pill RESCUE PLANE, then 13 men icons', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); FS.grp.position.set(0, -500, 0); boat.visible = true; boatFade(0); const bp = V3(400 + t * 45, ALT - 5, 0); boat.position.copy(bp); boat.rotation.x = Math.sin(t) * 0.03; keyFollow(ST, bp);
      const cam = bp.clone().add(V3(lerp(-60, 10, k), lerp(70, 8, k), lerp(-30, 44, k))); ST.update(t, { position: cam });
      shoot(ST.scene, [], cam, null, bp.clone(), null, 0, { ...LKs, fov: 50, aperture: 0, exposure: 0.92 });
      blit(); zoomBlur(GL(), (1 - k) * 0.8, { cy: 900 }); haze(0.35 * (1 - k) + 0.1, '150,165,180'); topShade(0.45);
      pill('RESCUE PLANE', (t - st - 0.1) / 0.25, 300, 'rgba(14,24,40,0.9)', 66); people(clamp((t - w13) / 0.5) * 13, 13, { y: 520, cols: 7, size: 0.7 });
    } });
    cue(st, 'whoosh', { dur: 1.0, gain: 0.8 }); for (let i = 0; i < 3; i++) cue(w13 + i * 0.15, 'pop', { gain: 0.35 }); }
  // 8 · vanished too
  { const st = cut(8), wv = W('vanished', 8);
    add({ id: 'S11', at: st, note: 'slow push: the flying boat flies into a grey cloud wall and fades away; boom; stamp VANISHED TOO', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); FS.grp.position.set(0, -500, 0); boat.visible = true; const bp = V3(lerp(480, 540, clamp(lt / d)), ALT - 5, -14); boat.position.copy(bp); keyFollow(ST, bp);
      const f = clamp((t - wv) / 0.5); boatFade(f);
      const cam = V3(lerp(452, 462, k), ALT + 1, 40); ST.update(t, { position: cam });
      shoot(ST.scene, [], cam, null, V3(lerp(490, 520, k), ALT - 4, -14), null, 0, { ...LKs, fov: 44, exposure: 0.85 });
      blit(); haze(0.3 + 0.5 * f, '140,155,170'); stamp(['VANISHED', 'TOO'], (t - wv - 0.1) / 0.2, { y: 420, size: 110, col: '#E3262E' });
    } });
    cue(wv, 'boom', { gain: 0.9 }); cue(wv + 0.12, 'stamp', { gain: 0.6 }); }

  // 9 · follow
  { const st = cut(9);
    add({ id: 'S12', at: st, note: 'warm-lit Navy radio room at night: the radioman by the glowing wireless set points at the viewer; button FOLLOW FOR MORE gets pressed', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); wset.set(true);
      radioman.at(-0.6, 0, -3.6); radioman.set({ mood: 'happy', armR: [95, 0], armL: [20, 10], talk: talk(t), blink: blink(t) });
      shoot(RM.scene, [radioman], V3(lerp(0.9, 0.4, k), 1.5, lerp(0.6, -0.2, k)), null, V3(-0.2, 1.4, -3.8), null, 0, { ...LKr, fov: 48, warm: 0.02 });
      blit(); followBtn(lt / 0.4 + (lt > 0.8 ? (lt - 0.8) * 1.3 : 0), t, 340);
    } });
    cue(st, 'whoosh', { gain: 0.5 }); cue(st + 0.1, 'pop', { gain: 0.6 }); cue(st + 1.3, 'ding', { gain: 0.6 }); }

  // 10 · ship saw flames
  { const st = cut(10), wf = W('flames', 10);
    add({ id: 'S13', at: st, note: 'night, crane-down on a ship deck: a sailor at the rail turns in shock and points; far out, orange flames burn on the dark water', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); ship.visible = true; sailor.group.visible = true; fire.update(t, 1); fire2.update(t * 1.2, 1); glowM.opacity = 0.06;
      sailor.at(-0.9, 3, -1.6); sailor.set({ mood: t > wf ? 'shock' : 'worried', armR: [110, 0], armL: [20, 10], look: [0.3, 0], blink: blink(t), sweat: t > wf ? 1 : 0 });
      const cam = V3(lerp(1.5, 0.8, k), lerp(7.5, 5.2, k), lerp(5.2, 4.2, k)); NT.update(t, { position: cam });
      shoot(NT.scene, [sailor], cam, null, V3(-2, 3.6, -20), V3(-3, 2.6, -40), k, { ...LKs, fov: 50, aperture: 0.0002, focus: 6 });
      blit(); { const gx = lerp(600, 560, k), gy = lerp(840, 950, k), g = ctx.createRadialGradient(gx, gy, 10, gx, gy, 330); g.addColorStop(0, 'rgba(255,150,60,0.45)'); g.addColorStop(1, 'rgba(255,120,40,0)'); ctx.fillStyle = g; ctx.fillRect(0, 500, 1080, 900); } topShade(0.4); pill('A PASSING SHIP', (t - st - 0.1) / 0.25, 300, 'rgba(14,24,40,0.9)', 62); redArrow(660, 1000, -2.3, (t - wf) / 0.3, 200);
    } });
    cue(st, 'slide', { dur: 0.8, gain: 0.5 }); cue(wf, 'sizzle', { dur: 1.2, gain: 0.5 }); }
  // 10b · push to flames
  { const st = W('on', 10) - 0.08;
    add({ id: 'S14', at: st, note: 'low fast dolly over dark waves toward the burning patch of sea, sparks rising, orange light on the water', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); ship.visible = true; fire.update(t, 1); fire2.update(t * 1.2, 1); glowM.opacity = 0.35 + 0.08 * Math.sin(t * 9);
      const cam = V3(lerp(4, 2, k), lerp(2.4, 1.6, k), lerp(-40, -54, k)); NT.update(t, { position: cam });
      shoot(NT.scene, [], cam, null, V3(-3, 1.5, -72), null, 0, { ...LKs, fov: 46, aperture: 0.0002, focus: 18 });
      blit(); topShade(0.35); for (let i = 0; i < 14; i++) { const q = ((t * 0.7 + rnd(i)) % 1); ctx.fillStyle = `rgba(255,${150 + rnd(i * 2) * 80},60,${(1 - q) * 0.9})`; ctx.beginPath(); ctx.arc(420 + rnd(i * 3) * 260 + Math.sin(t * 3 + i) * 20, 1040 - q * 420, 5 + rnd(i) * 5, 0, 7); ctx.fill(); }
    } });
    cue(st, 'whoosh', { gain: 0.4 }); }

  // 11 · 27 men gone
  { const st = cut(11), wg = W('gone', 11);
    add({ id: 'S15', at: st, note: 'crane-up from the black waves to an empty night sky with stars; counter 27 MEN slams in, 27 little-man icons turn red', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); fire.update(t, 0); fire2.update(t, 0); glowM.opacity = 0; sailor.group.visible = false; ship.visible = false;
      const cam = V3(-20 + lerp(-6, 6, k), lerp(1.5, 16, k), lerp(-84, -100, k)); NT.update(t, { position: cam });
      shoot(NT.scene, [], cam, null, V3(-20, lerp(1, 8, k), -170), null, 0, { ...LKs, fov: 50, aperture: 0 }, undefined, lerp(-0.08, 0.06, k));
      blit(); const cnt = Math.round(27 * clamp((t - st) / 0.9)); bigNum(String(cnt), (t - st) / 0.25, { y: 360, size: 260, label: 'MEN' }); people(clamp((t - st) / 0.9) * 27, 27, { y: 840 + Math.sin(t * 9) * 6, cols: 9, size: 0.7, lit: clamp((t - wg) / 0.7) * 27 });
      if (t > wg) { const q = (t - wg) % 0.5 / 0.5; ctx.save(); ctx.globalAlpha = 0.25 * (1 - q); ctx.fillStyle = '#E3262E'; ctx.fillRect(0, 0, 1080, 1920); ctx.restore(); }
    } });
    cue(st, 'slam', { gain: 0.8 }); cue(wg, 'heartbeat', { gain: 0.5 }); }
  // 12a · no wreckage
  { const st = cut(12), wn = W('never', 12);
    add({ id: 'S16', at: st, note: 'slow push over the empty grey sea at first light, nothing on the water; stamp NO WRECKAGE', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); FS.grp.position.set(0, -500, 0); boat.visible = false;
      const cam = V3(1000 + lerp(0, 14, k), lerp(9, 6, k), 0); ST.update(t, { position: cam }); keyFollow(ST, V3(1000, 0, 0));
      shoot(ST.scene, [], cam, null, V3(1060, 0, -6), null, 0, { ...LKs, fov: 50, aperture: 0, exposure: 0.95 });
      blit(); haze(0.3, '160,175,190'); stamp(['NO WRECKAGE'], (t - wn) / 0.2, { y: 420, size: 104, col: '#E3262E' });
    } });
    cue(st, 'slide', { dur: 0.8, gain: 0.4 }); cue(wn, 'stamp', { gain: 0.7 }); }
  // 12b · loop back to the cockpit
  { const st = W('single', 12) - 0.1;
    add({ id: 'S17', at: st, note: 'loop: crane up from the empty sea into the stormy sky, the five bombers emerge from the clouds, push toward the lead cockpit (matches the cover)', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); boat.visible = false; const p = fpos(t + 30); FS.grp.position.copy(p); bobPl(FS.pl, t); keyFollow(ST, p);
      pilotS.set({ mood: 'worried', armL: [60, -20], armR: [40, -20], blink: blink(t) });
      const lead = FS.pl[0].position.clone().add(p); const cam = lead.clone().add(V3(lerp(-45, 5.4, k), lerp(22, 2.15, k), lerp(34, 2.7, k))); ST.update(t, { position: cam });
      shoot(ST.scene, [pilotS], cam, null, lead.clone().add(V3(lerp(-9, 2.5, k), lerp(0, 1.05, k), 0)), null, 0, { ...LKs, fov: lerp(55, 36, k) });
      blit(); zoomBlur(GL(), (1 - k) * 0.8); haze((1 - k) * 0.5, '150,165,180');
    } });
    cue(st, 'riser', { dur: 1.0, gain: 0.5 }); }

  return { shots: S, cues: CUES };
}
