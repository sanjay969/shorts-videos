// HE WALKED INTO A BAR AND NEVER WALKED OUT (Brian Shaffer, Columbus OH, April 1 2006) — Tall Tale 3D, cold night grade.
// Respectful: a missing person; no speculation about what happened. Generic toons (no likeness), generic bar (no real name).
import * as THREE from 'three';
import { ctx, clamp, lerp, eo, eio, eob, rnd } from './core/lib.js';
import { L, Le, Wd, T } from './core/timing.js';
import * as WD from './core/world.js';
import { Toon, INK } from './core/toon.js';
import { V3, talk, blink, hook, ribbon, pill, stamp, calCard, flash, tint, mark, makeShoot, P2 } from './jh.js';
import { redCircle, redArrow, bigNum, followBtn, zoomBlur, haze, topShade } from './f19.js';
import { nightCity, airportGate, videoRoom, cctvHud, clockFace, idCard, board, poster2 } from './shf.js';

const LOOKS = {
  brian: { body: '#3C6FB6', pattern: 'check', patCol: '#2A4E8A', hat: 'hair', hatCol: '#3A2A22', neck: 'none' },
  w1: { body: '#D8584A', pattern: 'plain', hat: 'bun', hatCol: '#E8C070', neck: 'none' },
  w2: { body: '#8C6FC9', pattern: 'plain', hat: 'bun', hatCol: '#2A2226', neck: 'collar', neckCol: '#F4EFE4' },
  gf: { body: '#4FB3A9', pattern: 'plain', hat: 'bun', hatCol: '#6B4A3A', neck: 'scarf', neckCol: '#F2C230' },
  det: { body: '#5A5248', pattern: 'vest', patCol: '#3A342E', hat: 'none', neck: 'tie', neckCol: '#2E4E8A', extra: ['mustache', 'glasses'] },
};
const mk = (k, o) => new Toon({ ...LOOKS[k], extra: [...(LOOKS[k].extra || [])] }, o);
const COLD = { warm: -0.06, sat: 1.05, vignette: 0.34 };
const LKn = { bloom: 0.12, bloomThreshold: 1.08, aperture: 0.00012, maxblur: 0.003, ...COLD };
const LKr = { bloom: 0.1, bloomThreshold: 1.08, aperture: 0.0002, maxblur: 0.003, ...COLD };
const GL = () => document.getElementById('gl');
const BOOK = (g, x, y) => { g.save(); g.translate(x, y - 40); g.rotate(-0.2); g.strokeStyle = INK; g.lineWidth = 5; g.fillStyle = '#C8283A'; g.fillRect(-40, -54, 80, 108); g.strokeRect(-40, -54, 80, 108); g.fillStyle = '#F4EFE4'; g.fillRect(-28, -30, 56, 16); g.restore(); };
const BAG = (g, x, y) => { g.save(); g.translate(x, y + 10); g.strokeStyle = INK; g.lineWidth = 5; g.fillStyle = '#F2C230'; g.beginPath(); g.roundRect(-60, -10, 120, 150, 14); g.fill(); g.stroke(); g.beginPath(); g.moveTo(-20, -10); g.lineTo(-20, -40); g.lineTo(20, -40); g.lineTo(20, -10); g.stroke(); g.restore(); };
const TIME = (m) => { const h = Math.floor(m / 60), mm = Math.floor(m % 60); return `04-01-2006  ${String(h === 0 ? 12 : h).padStart(2, '0')}:${String(mm).padStart(2, '0')}:${String(Math.floor((m * 60) % 60)).padStart(2, '0')} AM`; };

export function buildShots(E) {
  const S = [], CUES = [], add = (o) => (S.push(o), o), cue = (t, type, o = {}) => CUES.push({ t: +Math.max(0, t).toFixed(3), type, ...o });
  const cut = (i) => (i === 0 ? 0 : L(i) - 0.06);
  const W = (w, l) => Wd(w, l);
  const { shoot, cam: CAMR } = makeShoot(E);
  const scr = (v) => { const p = v.clone().project(CAMR); return [(p.x + 1) / 2 * 1080, (1 - p.y) / 2 * 1920]; };
  const shake = (t, t0, a = 0.08) => { const k = t - t0; if (k < 0 || k > 0.4) return V3(0, 0, 0); const f = (1 - k / 0.4) * a; return V3(Math.sin(k * 90) * f, Math.cos(k * 70) * f, 0); };

  const C = nightCity(E);
  const brian = mk('brian'), w1 = mk('w1'), w2 = mk('w2'); [brian, w1, w2].forEach((p) => C.scene.add(p.group));
  const only = (...k) => [brian, w1, w2].forEach((p) => (p.group.visible = k.includes(p)));
  // a point on the escalator: u 0..1 → world (step top)
  const escAt = (u) => V3(-6.5 + 0.2 + u * 7.4, 0.2 + u * 4.9 + 0.15, 3.4);
  const AG = airportGate(E); const gf = mk('gf'); AG.scene.add(gf.group);
  const screenFn = (g, w, h, t, i) => { g.fillStyle = '#1A2A24'; g.fillRect(0, 0, w, h); for (let k = 0; k < 6; k++) { g.fillStyle = `rgba(160,200,180,${0.15 + rnd(i * 9 + k) * 0.2})`; g.fillRect(rnd(i + k) * w, rnd(i * 3 + k) * h * 0.6 + h * 0.2, 40 + rnd(k + i * 2) * 120, 30 + rnd(k * 3 + i) * 80); }
    g.strokeStyle = 'rgba(200,230,210,0.5)'; g.lineWidth = 4; g.beginPath(); g.moveTo(w * 0.2, h); g.lineTo(w * 0.55, h * 0.3); g.lineTo(w * 0.7, h * 0.3); g.stroke();
    for (let y = 0; y < h; y += 4) { g.fillStyle = 'rgba(0,0,0,0.18)'; g.fillRect(0, y, w, 1); }
    g.fillStyle = '#FFFFFF'; g.font = '700 22px monospace'; g.fillText('CAM ' + String(i + 1).padStart(2, '0'), 10, 26); if (Math.sin(t * 6 + i) > 0) { g.fillStyle = '#FF3030'; g.beginPath(); g.arc(w - 20, 18, 7, 0, 7); g.fill(); } };
  const VR = videoRoom(E, screenFn); const det = mk('det'); VR.scene.add(det.group);

  // ═══ SHOTS ═══
  // 0 · COVER: CCTV view, Brian rides the escalator up toward the neon BAR; red circle; STILL MISSING
  { const st = 0;
    add({ id: 'S00', at: st, note: 'COVER: high CCTV angle on the night escalator: Brian rides up toward the glowing BAR sign, glancing back at the camera; red circle on him; CCTV HUD 1:15 AM; text STILL MISSING', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); only(brian); C.update(t); const u = lerp(0.42, 0.5, clamp(lt / d)); const p = escAt(u);
      brian.at(p.x, p.y, p.z); brian.set({ mood: 'neutral', armR: [20, 10], armL: [30, -10], look: [0.3, -0.4], blink: 0 });
      shoot(C.scene, [brian], p.clone().add(V3(lerp(1.7, 1.5, k), 3.0, lerp(4.8, 4.4, k))), null, p.clone().add(V3(0, 0.75, 0)), null, 0, { ...LKn, fov: 40, exposure: 1.3 });
      blit(); cctvHud(t, TIME(75 + lt / 60), { cam: 'CAM 03', desat: 0.35 }); { const [bx, by] = scr(p.clone().add(V3(0, 0.95, 0))); redCircle(bx, by + 60, 250, 400, 1); } { const g = ctx.createRadialGradient(980, 700, 20, 980, 700, 700); g.addColorStop(0, 'rgba(255,60,160,0.35)'); g.addColorStop(1, 'rgba(255,60,160,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, 1080, 1920); }
      hook(['STILL', 'MISSING'], 1, { y: 330, size: 150, hiLine: 1, hi: '#FF3B3B' });
    } });
    cue(0, 'boom', { gain: 0.8 }); }
  // 1 · "riding up to this bar," DRONE: high over the night city diving to the neon bar
  { const st = W('riding', 0) - 0.12;
    add({ id: 'S01', at: st, note: 'DRONE: fast descending dive from high over a night city of lit office towers down to the two-storey complex with the outdoor escalator and pink neon BAR; zoom blur, fog', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); only(); C.update(t);
      shoot(C.scene, [], V3(lerp(-40, -6, k), lerp(110, 9, k), lerp(110, 22, k)), null, V3(lerp(0, 0, k), lerp(0, 5, k), lerp(-10, 0, k)), null, 0, { ...LKn, fov: 55, aperture: 0 });
      blit(); zoomBlur(GL(), (1 - k) * 1.1, { cy: 1000 }); haze((1 - k) * 0.35, '40,50,80'); topShade(0.3);
    } });
    cue(st, 'whoosh', { dur: 1.0, gain: 0.8 }); }
  // 2 · "and he never came back down." CCTV: empty escalator, clock running; stamp
  { const st = W('and', 0) - 0.1, wn = W('never', 0);
    add({ id: 'S02', at: st, note: 'CCTV wide: the escalator runs with nobody on it, timestamp races from 1:55 to 3:00 AM; stamp NEVER CAME DOWN', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); only(); C.update(t * 4);
      shoot(C.scene, [], V3(4.5, 8.2, 11.5), V3(4.0, 8.0, 10.8), V3(-2.5, 2.8, 3), null, k, { ...LKn, fov: 46 });
      blit(); cctvHud(t, TIME(lerp(115, 180, clamp(lt / d)))); stamp(['NEVER', 'CAME DOWN'], (t - wn) / 0.2, { y: 520, size: 104, col: '#E3262E' });
    } });
    cue(wn, 'stamp', { gain: 0.7 }); }

  // 3 · "Columbus, Ohio, 2006." crane over the night street
  { const st = cut(1), wy = W('two', 1);
    add({ id: 'S03', at: st, note: 'slow crane-down along the night street: street lamps, lit towers, the complex with the escalator; ribbon COLUMBUS, OHIO; pill 2006', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); only(); C.update(t);
      shoot(C.scene, [], V3(lerp(18, 12, k), lerp(12, 3, k), lerp(22, 18, k)), null, V3(0, lerp(3, 4, k), 0), null, 0, { ...LKn, fov: 50 });
      blit(); topShade(0.4); ribbon('COLUMBUS, OHIO', (t - st - 0.1) / 0.3, 300, 78); pill('2006', (t - wy) / 0.25, 460, 'rgba(14,20,36,0.92)', 66);
    } });
    cue(st, 'slide', { dur: 0.8, gain: 0.5 }); cue(wy, 'pop', { gain: 0.5 }); }

  // 4a · "Brian Shaffer," Brian walks along the sidewalk toward the complex, book under arm
  { const st = cut(2), wb = W('brian', 2);
    add({ id: 'S04', at: st, note: 'tracking dolly beside Brian walking along the lamp-lit sidewalk with a red textbook, relaxed; pill BRIAN SHAFFER', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); only(brian); C.update(t); const x = lerp(-15, -12.4, clamp(lt / d));
      brian.at(x, 0.16, 5.0); brian.set({ mood: 'happy', legs: 'walk', phase: t * 7, armR: [40, -40], holdR: BOOK, v: 'b', armL: [20, 10], blink: blink(t) });
      shoot(C.scene, [brian], V3(x + 1.6, 1.5, 9.6), null, V3(x + 0.2, 1.3, 5), null, 0, { ...LKn, fov: 44 });
      blit(); topShade(0.4); pill('BRIAN SHAFFER', (t - wb) / 0.25, 300, 'rgba(14,20,36,0.92)', 66);
    } });
    cue(st, 'whoosh', { gain: 0.5 }); cue(wb, 'pop', { gain: 0.5 }); }
  // 4b · "a 27-year-old med student," case card
  { const st = W('a', 2) - 0.1;
    add({ id: 'S05', at: st, note: 'push-in on Brian under a street lamp, he smiles; a MISSING PERSON case card flips in: AGE 27 / MED STUDENT', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); only(brian); C.update(t);
      brian.at(-12.0, 0.16, 5.0); brian.set({ mood: 'smug', armR: [40, -40], holdR: BOOK, v: 'b', armL: [20, 10], blink: blink(t), look: [0.3, 0] });
      shoot(C.scene, [brian], V3(lerp(-10.6, -11.1, k), 1.8, lerp(8.6, 7.8, k)), null, V3(-12.0, 1.85, 5), null, 0, { ...LKn, fov: 44, aperture: 0.0006, maxblur: 0.006 });
      blit(); topShade(0.4); idCard((t - st) / 0.3, [['BRIAN, 27', 0.4], ['MED STUDENT', 0.9], ['OHIO STATE', 1.3]], { y: 400 });
    } });
    cue(st, 'slide', { dur: 0.5, gain: 0.5 }); cue(W('med', 2), 'pop', { gain: 0.5 }); }

  // 5 · "rode the escalator up at 1:15 AM." side tracking shot up the escalator; clock 1:15
  { const st = cut(3), w1_ = W('one', 3);
    add({ id: 'S06', at: st, note: 'crane-up tracking shot alongside the escalator as Brian rides up toward the neon BAR sign, hand on the rail; clock card 1:15 AM pops in', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); only(brian); C.update(t); const u = lerp(0.15, 0.75, clamp(lt / d)); const p = escAt(u);
      brian.at(p.x, p.y, p.z); brian.set({ mood: 'happy', armR: [40, -10], armL: [20, 10], look: [0.4, -0.3], blink: blink(t) });
      shoot(C.scene, [brian], p.clone().add(V3(1.4, 0.6, 6.0)), null, p.clone().add(V3(0.6, 1.4, 0)), null, 0, { ...LKn, fov: 46 });
      blit(); topShade(0.4); clockFace((t - w1_ + 0.2) / 0.3, 75, { x: 540, y: 470, s: 0.75, label: '1:15 AM' });
    } });
    cue(st, 'slide', { dur: 1.2, gain: 0.4 }); cue(w1_, 'tock', { gain: 0.8 }); }

  // 6a · "Forty minutes later," clock spins 1:15 → 1:55 over the balcony
  { const st = cut(4), wf = W('forty', 4);
    add({ id: 'S07', at: st, note: 'slow push along the upstairs balcony under the BAR sign at night; big clock spins from 1:15 to 1:55, label 40 MINUTES', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); only(); C.update(t);
      shoot(C.scene, [], V3(lerp(9, 7.5, k), 6.4, 9), null, V3(3.5, 6.2, 0.8), null, 0, { ...LKn, fov: 48 });
      blit(); topShade(0.4); clockFace(clamp((t - st) / 0.25), lerp(75, 115, eio(clamp((t - st) / 0.8))), { x: 540, y: 620, s: 0.85, label: '40 MINUTES' });
    } });
    cue(st, 'tock', { gain: 0.6 }); cue(st + 0.25, 'zip', { gain: 0.5 }); }
  // 6b · "he was seen talking to two women." CCTV: Brian chats with two women on the balcony
  { const st = W('he', 4) - 0.1, ww = W('women.', 4);
    add({ id: 'S08', at: st, note: 'CCTV view of the balcony outside the bar: Brian talks with two women, laughing; HUD 1:55 AM; red arrow on Brian; pill LAST SEEN', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); only(brian, w1, w2); C.update(t);
      brian.at(3.2, 5.15, 1.4); brian.set({ mood: 'happy', armR: [60, -60], armL: [20, 10], talk: talk(t), blink: blink(t) });
      w1.at(4.45, 5.15, 1.3); w1.set({ mood: 'laugh', armL: [40, -40], armR: [20, 10], blink: blink(t, 1) });
      w2.at(5.65, 5.15, 1.5); w2.set({ mood: 'happy', armR: [70, -100], armL: [20, 10], talk: talk(t + 1), blink: blink(t, 2) });
      shoot(C.scene, [brian, w1, w2], V3(lerp(1.0, 1.5, k), 9.4, lerp(7.6, 7.2, k)), null, V3(4.3, 6.0, 1.3), null, 0, { ...LKn, fov: 40 });
      blit(); cctvHud(t, TIME(115 + lt / 60), { cam: 'CAM 07' }); { const [bx, by] = scr(V3(3.2, 6.9, 1.4)); redArrow(bx + 10, by - 110, 1.35, (t - st - 0.2) / 0.3, 200); } pill('LAST SEEN', (t - ww + 0.3) / 0.25, 340, 'rgba(200,30,40,0.92)', 70);
    } });
    cue(st, 'whoosh', { gain: 0.4 }); cue(ww - 0.3, 'pop', { gain: 0.6 }); }

  // 7 · "But that's not the strangest part." monitor wall, static glitch, riser
  { const st = cut(5), ws = W('strangest', 5);
    add({ id: 'S09', at: st, note: 'dark police video room: fast eased push into a wall of 12 CCTV monitors, static glitches; ? marks; riser', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); VR.update(t); det.group.visible = false;
      shoot(VR.scene, [], V3(lerp(1.2, 0.2, k), lerp(1.6, 2.0, k), lerp(0.5, -2.6, k)), null, V3(-0.2, 2.1, -5.7), null, 0, { ...LKr, fov: 48 }, undefined, lerp(0.08, -0.04, k));
      blit(); if (Math.sin(t * 23) > 0.7) { ctx.fillStyle = 'rgba(255,255,255,0.12)'; ctx.fillRect(0, rnd(Math.floor(t * 30)) * 1900, 1080, 40); }
      [[260, 700], [820, 640]].forEach(([x, y], i) => mark('?', x, y, (t - ws - i * 0.15) / 0.3));
    } });
    cue(st, 'riser', { dur: 1.5, gain: 0.7 }); }

  // 8 · "Two days later, he was due to fly to Miami." airport gate: girlfriend waits with a bag; board MIAMI
  { const st = cut(6), wm = W('miami.', 6);
    add({ id: 'S10', at: st, note: 'airport gate at night, plane outside the big window: a young woman waits by the seats with a yellow bag, checking her watch; departure board MIAMI · BOARDING slides in', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); gf.at(-0.6, 0, -2.6); gf.set({ mood: 'happy', armR: [60, -120], armL: [20, 10], holdL: BAG, v: 'bag', look: [0.5, 0.4], blink: blink(t) });
      shoot(AG.scene, [gf], V3(lerp(2.2, 1.4, k), 1.5, lerp(1.8, 1.0, k)), null, V3(-0.3, 1.4, -3.2), null, 0, { ...LKr, fov: 50 });
      blit(); topShade(0.35); board(clamp((t - st) / 0.3), [['MIAMI', 'BOARDING', '#7FE08A'], ['CHICAGO', 'ON TIME']], { y: 380 }); pill('2 DAYS LATER', (t - st - 0.2) / 0.25, 800, 'rgba(14,20,36,0.92)', 58);
    } });
    cue(st, 'whoosh', { gain: 0.5 }); cue(wm, 'ding', { gain: 0.6 }); }
  // 9 · "He never showed up." empty seat beside her; she's worried; board FINAL CALL blinking
  { const st = cut(7), wn = W('never', 7);
    add({ id: 'S11', at: st, note: 'push-in: she sits alone, worried, beside an empty seat (red circle on the empty seat); board MIAMI FINAL CALL blinks; stamp NEVER SHOWED', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); gf.at(-1.2, 0, -3.5); gf.set({ mood: 'worried', legs: 'sit', armR: [30, -40], armL: [20, 10], holdL: undefined, v: 'n', look: [0.6, 0], sweat: 1, blink: blink(t) });
      shoot(AG.scene, [gf], V3(lerp(-0.5, -0.6, k), 1.4, lerp(1.4, 0.7, k)), null, V3(-0.6, 1.0, -3.6), null, 0, { ...LKr, fov: 50 });
      blit(); topShade(0.35); board(1, [['MIAMI', 'FINAL CALL', '#FF5A5A']], { y: 330, blink: t }); { const [sx, sy] = scr(V3(0, 0.75, -3.6)); redCircle(sx, sy, 150, 140, (t - st - 0.15) / 0.4); } stamp(['NEVER SHOWED'], (t - wn) / 0.2, { y: 600, size: 96, col: '#E3262E' });
    } });
    cue(st, 'thud', { gain: 0.5 }); cue(wn, 'stamp', { gain: 0.7 }); }

  // 10 · follow: the detective turns and points
  { const st = cut(8);
    add({ id: 'S12', at: st, note: 'video room: a detective in front of the monitor wall turns and points at the viewer; FOLLOW FOR MORE button pressed', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); VR.update(t); det.group.visible = true; det.at(0.4, 0, -3.0); det.set({ mood: 'smug', armR: [95, 0], armL: [20, 10], talk: talk(t), blink: blink(t) });
      shoot(VR.scene, [det], V3(lerp(1.2, 0.8, k), 1.6, lerp(1.2, 0.6, k)), null, V3(0.3, 1.5, -3.2), null, 0, { ...LKr, fov: 50 });
      blit(); followBtn(lt / 0.4 + (lt > 0.8 ? (lt - 0.8) * 1.3 : 0), t, 340);
    } });
    cue(st, 'pop', { gain: 0.6 }); cue(st + 1.3, 'ding', { gain: 0.6 }); }

  // 11 · "Not one camera ever caught him leaving." monitors, red X on each exit; detective leans in
  { const st = cut(9), wl = W('leaving.', 9);
    add({ id: 'S13', at: st, note: 'over the shoulder of the detective leaning toward the monitor wall; red X marks slam onto the screens one by one; stamp NOT ON TAPE', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); VR.update(t); det.group.visible = true; det.at(-1.6, 0, -4.0); det.set({ mood: 'worried', armR: [80, -40], armL: [60, -120], lean: 10, blink: blink(t), sweat: 1 });
      shoot(VR.scene, [det], V3(lerp(0.4, 0.0, k), 1.8, lerp(-0.6, -1.4, k)), null, V3(-0.4, 1.9, -5.7), null, 0, { ...LKr, fov: 50 });
      blit(); const n = clamp((t - st) / 1.4) * 8; for (let i = 0; i < Math.floor(n); i++) { const x = 280 + (i % 4) * 175, y = 560 + Math.floor(i / 4) * 200; ctx.save(); ctx.strokeStyle = '#FF2A2A'; ctx.lineWidth = 16; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x - 45, y - 45); ctx.lineTo(x + 45, y + 45); ctx.moveTo(x + 45, y - 45); ctx.lineTo(x - 45, y + 45); ctx.stroke(); ctx.restore(); }
      stamp(['NOT ON TAPE'], (t - wl) / 0.2, { y: 330, size: 96, col: '#E3262E' });
    } });
    for (let i = 0; i < 8; i++) cue(st + 0.18 * i, 'tock', { gain: 0.5 }); cue(wl, 'stamp', { gain: 0.7 }); }

  // 12a · "Brian has never been found," missing poster on a lamp post at night, slow push
  { const st = cut(10), wf = W('found,', 10);
    add({ id: 'S14', at: st, note: 'night street, empty sidewalk under a lamp: slow push-in; a MISSING poster flaps in and fills the frame; stamp NEVER FOUND', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); only(); C.update(t);
      shoot(C.scene, [], V3(lerp(-7, -8.2, k), 1.6, lerp(12, 9.5, k)), null, V3(-9, 2.4, 5.8), null, 0, { ...LKn, fov: 48 });
      blit(); topShade(0.35); poster2((t - st) / 0.35, { y: 680 }); stamp(['NEVER FOUND'], (t - wf) / 0.2, { y: 1120, size: 96, col: '#E3262E' });
    } });
    cue(st, 'whoosh', { gain: 0.5 }); cue(wf, 'stamp', { gain: 0.7 }); }
  // 12b · "and the last time anyone saw him," back to the CCTV escalator (matches the cover → loop)
  { const st = W('and', 10) - 0.1;
    add({ id: 'S15', at: st, note: 'loop: CCTV view again, the escalator, Brian steps onto it and rides up; HUD 1:15 AM; flows into the cover frame', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); only(brian); C.update(t); const u = lerp(0.2, 0.42, clamp(lt / d)); const p = escAt(u);
      brian.at(p.x, p.y, p.z); brian.set({ mood: 'neutral', armR: [20, 10], armL: [30, -10], look: [0.3, -0.4], blink: blink(t) });
      shoot(C.scene, [brian], p.clone().add(V3(lerp(2.6, 1.7, k), lerp(3.6, 3.0, k), lerp(6.4, 4.8, k))), null, p.clone().add(V3(0, 0.75, 0)), null, 0, { ...LKn, fov: 40, exposure: lerp(1, 1.3, k) });
      blit(); cctvHud(t, TIME(74 + lt / 60), { cam: 'CAM 03', desat: lerp(0.75, 0.35, k) });
    } });
    cue(st, 'slide', { dur: 1.0, gain: 0.4 }); cue(st + 0.8, 'riser', { dur: 1.0, gain: 0.5 }); }

  return { shots: S, cues: CUES };
}
