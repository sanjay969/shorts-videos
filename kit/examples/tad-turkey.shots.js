// A CRYING KID STARTED THE TURKEY PARDON (Tad Lincoln and Jack the turkey, 1863) — Tall Tale 3D, US audience.
// Generic cartoon toons only: "dad" is a tall man in a top hat, no likeness. No logos, no real seal.
import * as THREE from 'three';
import { ctx, clamp, lerp, eo, eio, eob } from './core/lib.js';
import { L, Le, Wd, T } from './core/timing.js';
import * as WD from './core/world.js';
import * as PR from './core/props.js';
import { Toon, PROPS, INK } from './core/toon.js';
import { V3, talk, blink, hook, ribbon, pill, stamp, calCard, confetti, flash, tint, speedLines, stars, mark, subscribe, makeShoot, LK } from './jh.js';
import { turkey, mansion, podium } from './xtra.js';

const LOOKS = {
  tad: { body: '#3C6FB6', pattern: 'plain', hat: 'cap', hatCol: '#7A4A2A', neck: 'collar', neckCol: '#F4EFE4', kid: true, extra: ['freckles'] },
  dad: { body: '#24232B', pattern: 'vest', patCol: '#3A3A44', hat: 'tophat', hatCol: '#1A1A20', neck: 'bowtie', neckCol: '#1A1A20' },
  cook: { body: '#F4EFE4', pattern: 'apron', patCol: '#FFFFFF', hat: 'beanie', hatCol: '#FFFFFF', extra: ['mustache'] },
  aide1: { body: '#4A4560', hat: 'none', neck: 'tie', neckCol: '#8A2E2E', pattern: 'vest', patCol: '#2A2638', extra: ['mustache'] },
  aide2: { body: '#5C6F8F', hat: 'bowler', hatCol: '#2A2638', neck: 'bowtie', neckCol: '#D8343F', extra: ['glasses'] },
  pres: { body: '#22304F', hat: 'none', neck: 'tie', neckCol: '#D8343F', pattern: 'jacket', patCol: '#F4EFE4' },
  press1: { body: '#D8584A', hat: 'none', neck: 'scarf', neckCol: '#F2C230', extra: ['glasses'] },
  press2: { body: '#4FB3A9', hat: 'cap', hatCol: '#2E4E8A' },
};
const mk = (k, o) => new Toon({ ...LOOKS[k], extra: [...(LOOKS[k].extra || [])] }, o);
// hand props
const pan = (g, x, y) => { g.save(); g.translate(x, y - 30); g.strokeStyle = INK; g.lineWidth = 6; g.fillStyle = '#3A3A44'; g.beginPath(); g.ellipse(0, 0, 95, 30, 0, 0, 7); g.fill(); g.stroke(); g.fillStyle = '#5A5A66'; g.beginPath(); g.ellipse(0, -8, 80, 20, 0, 0, 7); g.fill(); g.restore(); };
const fork = (g, x, y) => { g.save(); g.translate(x, y - 20); g.strokeStyle = INK; g.lineWidth = 5; g.fillStyle = '#B8BCC6'; g.fillRect(-6, -10, 12, 90); g.strokeRect(-6, -10, 12, 90); g.fillRect(-26, -60, 52, 14); g.strokeRect(-26, -60, 52, 14); [-20, -7, 7, 20].forEach((d) => { g.fillRect(d - 3, -100, 6, 44); g.strokeRect(d - 3, -100, 6, 44); }); g.restore(); };
const quill = (g, x, y) => { g.save(); g.translate(x, y - 40); g.rotate(0.4); g.strokeStyle = INK; g.lineWidth = 5; g.fillStyle = '#FFFDF4'; g.beginPath(); g.ellipse(0, -40, 16, 60, 0, 0, 7); g.fill(); g.stroke(); g.beginPath(); g.moveTo(0, -100); g.lineTo(0, 30); g.stroke(); g.restore(); };
const card = (g, x, y) => { g.save(); g.translate(x, y - 60); g.rotate(-0.1); g.strokeStyle = INK; g.lineWidth = 5; g.fillStyle = '#FFFDF4'; g.beginPath(); g.rect(-70, -50, 140, 100); g.fill(); g.stroke(); g.fillStyle = '#1F1C33'; g.font = '900 24px Inter'; g.textAlign = 'center'; g.fillText('PARDON', 0, -10); g.fillRect(-46, 12, 92, 5); g.fillRect(-46, 28, 70, 5); g.restore(); };

// big parchment pardon card overlay
function pardonCard(k, x = 540, y = 560) {
  if (k <= 0) return; const a = eob(clamp(k)); ctx.save(); ctx.translate(x, y); ctx.rotate(-0.05); ctx.scale(a, a);
  ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.fillRect(-300, -190, 620, 400); ctx.fillStyle = '#F4EBD6'; ctx.strokeStyle = INK; ctx.lineWidth = 8; ctx.beginPath(); ctx.rect(-310, -200, 620, 400); ctx.fill(); ctx.stroke();
  ctx.strokeStyle = '#B5372E'; ctx.lineWidth = 4; ctx.strokeRect(-285, -175, 570, 350);
  ctx.fillStyle = '#1F1C33'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.font = '900 76px Inter'; ctx.fillText('PARDON', 0, -95);
  ctx.font = '800 42px Inter'; ctx.fillText('for JACK the turkey', 0, -10); ctx.font = 'italic 700 38px Caladea'; ctx.fillText('He is not to be cooked.', 0, 60);
  ctx.strokeStyle = '#1F1C33'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(-120, 130); ctx.bezierCurveTo(-60, 100, -20, 160, 40, 120); ctx.bezierCurveTo(80, 100, 100, 140, 140, 118); ctx.stroke();
  ctx.restore();
}
const heart = (x, y, k) => { if (k <= 0 || k >= 1) return; ctx.save(); ctx.translate(x, y - k * 160); ctx.globalAlpha = 1 - k; const s = eob(clamp(k * 3)) * 1.2; ctx.scale(s, s); ctx.fillStyle = '#FF5A7A'; ctx.strokeStyle = INK; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(0, 20); ctx.bezierCurveTo(-50, -10, -30, -50, 0, -28); ctx.bezierCurveTo(30, -50, 50, -10, 0, 20); ctx.fill(); ctx.stroke(); ctx.restore(); };
const camFlashes = (t, t0) => { for (let i = 0; i < 4; i++) { const tt = t - t0 - i * 0.37; if (tt > 0 && tt < 0.12) { ctx.save(); ctx.globalAlpha = 0.85 * (1 - tt / 0.12); ctx.fillStyle = '#FFFFFF'; ctx.beginPath(); ctx.arc([220, 860, 380, 760][i], [420, 520, 900, 300][i], 140, 0, 7); ctx.fill(); ctx.restore(); } } };

export function buildShots(E) {
  const S = [], CUES = [], add = (o) => (S.push(o), o), cue = (t, type, o = {}) => CUES.push({ t: +Math.max(0, t).toFixed(3), type, ...o });
  const cut = (i) => (i === 0 ? 0 : L(i) - 0.06);
  const { shoot } = makeShoot(E);
  const shake = (t, t0, a = 0.08) => { const k = t - t0; if (k < 0 || k > 0.35) return V3(0, 0, 0); const f = (1 - k / 0.35) * a; return V3(Math.sin(k * 90) * f, Math.cos(k * 70) * f, 0); };

  // ── LAWN (1863) + the press lawn (today) in one meadow ──
  const M = WD.meadow(E, { fenceOn: false });
  const wh = mansion(); wh.position.set(0, 0, -17); M.scene.add(wh);
  const tad = mk('tad', { height: 1.35 }), cook = mk('cook'), jack = turkey(1.0);
  const pres = mk('pres'), pr1 = mk('press1'), pr2 = mk('press2'), jack2 = turkey(1.0);
  const lawn = [tad, cook, jack, pres, pr1, pr2, jack2]; lawn.forEach((p) => M.scene.add(p.group));
  const pod = podium(); pod.position.set(9, 0, -6); M.scene.add(pod);
  const table = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.8, 0.8), WD.mat({ color: '#F4EFE4' })); table.position.set(10.2, 0.4, -6); table.castShadow = true; M.scene.add(table);
  const crate = WD.crate(0.6); crate.position.set(-1.2, 0, -3.4); M.scene.add(crate);
  M.sun.key.target.position.set(2, 0, -4); M.sun.key.position.set(9, 13, 4);
  const onlyL = (...keep) => lawn.forEach((p) => (p.group.visible = keep.includes(p)));
  const HUG = V3(-0.4, 0, -2.6);

  // ── OFFICE (1863) ──
  const O = WD.interior(E, { w: 9, depth: 7, h: 4.2, wall: '#2E5A44', motif: '#3A6B52', floor: '#8A5A3A', ceiling: '#1F3A30', signText: null, picture: true, counterOn: false, litter: false });
  const dsk = PR.desk(2.4); dsk.position.set(0.9, 0, -5.0); O.scene.add(dsk);
  const dad = mk('dad', { height: 2.0 }), a1 = mk('aide1'), a2 = mk('aide2'), otad = mk('tad', { height: 1.35 });
  const off = [dad, a1, a2, otad]; off.forEach((p) => O.scene.add(p.group));
  O.sun.key.target.position.set(0, 0, -4); O.sun.key.position.set(-2, 6, -12);
  const DAD = V3(-1.5, 0, -4.6);

  // ═══ SHOTS ═══
  // 1a · frame 0: Tad hugs Jack, crying; a cook with a roasting pan looms behind. Hook KID VS. PRESIDENT
  { const st = 0, wc = Wd('crying', 0);
    add({ id: 'S01a', at: st, note: 'frame 0: low angle, Tad (kid toon) hugs Jack the turkey in tears on the lawn; the cook walks in behind with a roasting pan; hook KID VS. PRESIDENT', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); onlyL(tad, jack, cook); crate.visible = false;
      tad.at(HUG.x - 0.45, 0, HUG.z); tad.set({ mood: 'sad', tears: 1, armL: [80, -40], armR: [70, -30], lean: 8, bob: Math.sin(t * 9) * 3, blink: blink(t) });
      jack.at(HUG.x + 0.55, 0, HUG.z - 0.1); jack.set({ mood: 'shock', look: [-0.5, 0], flap: Math.abs(Math.sin(t * 10)) * 0.4 });
      cook.at(lerp(1.3, 0.8, k), 0, HUG.z - 2.4); cook.set({ mood: 'smug', legs: 'walk', phase: t * 6, armL: [80, -60], armR: [80, -60], holdR: pan, v: 'pan', blink: blink(t) });
      shoot(M.scene, lawn, V3(-0.3, 0.8, 1.6), V3(-0.2, 0.85, 1.0), V3(-0.25, 0.95, -2.8), null, k, { ...LK.day, fov: 52 });
      blit(); hook(['KID VS.', 'PRESIDENT'], 1, { y: 300, size: 132, hiLine: 1 });
    } });
    cue(0, 'pop', { gain: 0.5 }); cue(wc, 'plop', { gain: 0.5 }); }
  // 1b · "started the turkey pardon." today: a president at a podium, PARDONED stamp slams
  { const st = Wd('started', 0) - 0.12, wp = Wd('pardon', 0);
    add({ id: 'S01b', at: st, note: 'whip to today: a generic president toon at a podium on the lawn raises a hand over a turkey on a table; camera flashes; PARDONED stamp slams on "pardon"', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); onlyL(pres, jack2);
      pres.at(9, 0, -6.6); pres.set({ mood: t > wp ? 'happy' : 'proud', armR: [lerp(40, 140, eo(clamp((t - wp + 0.3) / 0.3))), 0], armL: [20, 10], talk: talk(t), blink: blink(t) });
      jack2.at(10.2, 0.8, -6.0); jack2.set({ mood: t > wp ? 'happy' : 'shock', flap: t > wp ? Math.abs(Math.sin(t * 12)) : 0 });
      pr1.at(7.7, 0, -3.4); pr1.set({ mood: 'happy', armL: [100, -80], armR: [100, -80], holdR: PROPS.cup, v: 'c', look: [0.4, -0.2] }); pr2.at(11.5, 0, -3.6); pr2.set({ mood: 'shock', armL: [20, 10], armR: [140, -10], look: [-0.4, -0.2] });
      shoot(M.scene, lawn, V3(9.2, 1.5, 1.6), V3(9.6, 1.6, 0.6), V3(9.6, 1.25, -6.2), null, k, { ...LK.day, fov: 48 }, undefined, lerp(0.06, 0, k));
      blit(); camFlashes(t, st + 0.1); stamp(['PARDONED!'], (t - wp) / 0.2, { y: 420, size: 96 }); if (lt < 0.15) speedLines(1 - lt / 0.15, 3);
    } });
    cue(st, 'whoosh', { gain: 0.7 }); cue(wp, 'stamp', { gain: 0.9 }); }

  // 2 · "In eighteen sixty-three," crane down over the white mansion; calendar 1863 slams
  { const st = cut(1), wy = Wd('eighteen', 1);
    add({ id: 'S02', at: st, note: 'rewind: crane down from the sky to the white mansion on a sunny lawn; calendar card 1863 slams in', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); onlyL(); crate.visible = false;
      shoot(M.scene, lawn, V3(4, 12, 8).add(shake(t, wy + 0.15)), V3(1.5, 3.0, 6.0), V3(0, 2, -17), V3(0, 3.2, -17), k, { ...LK.day, fov: 52 });
      blit(); calCard('THE YEAR', '1863', 540, 470, eob(clamp((t - wy) / 0.25)), -0.06); if (lt < 0.2) flash(1 - lt / 0.2, '#F4E3C0');
    } });
    cue(st, 'slide', { dur: 0.6, gain: 0.6 }); cue(wy + 0.15, 'slam', { gain: 0.7 }); }

  // 3a · "a live turkey was sent" a crate on the lawn bursts open, Jack pops out
  { const st = cut(2), wt = Wd('turkey', 2);
    add({ id: 'S03a', at: st, note: 'a wooden crate on the lawn; on "turkey" Jack pops out of it flapping; impact stars', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); onlyL(jack); crate.visible = true; const up = eob(clamp((t - wt) / 0.35));
      jack.at(-1.2, lerp(-0.4, 0.6, up), -3.4); jack.group.visible = t > wt - 0.05; jack.set({ mood: 'shock', flap: Math.abs(Math.sin(t * 14)), hop: 0 });
      shoot(M.scene, lawn, V3(0.2, 1.0, 1.0), V3(-0.2, 1.2, 0.2), V3(-1.2, 1.0, -3.4), null, k, { ...LK.day, fov: 50 });
      blit(); stars(540, 760, (t - wt) / 0.8);
    } });
    cue(wt, 'boing', { gain: 0.8 }); }
  // 3b · "to the White House for dinner." Jack in front of the mansion; the cook with a fork; pill FOR DINNER
  { const st = Wd('to', 2) - 0.12, wd = Wd('dinner', 2);
    add({ id: 'S03b', at: st, note: 'wide pull-back: Jack stands on the lawn before the white mansion; the cook toon steps in with a giant fork; pill FOR DINNER', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); onlyL(jack, cook); crate.visible = false;
      jack.at(-0.3, 0, -4); jack.set({ mood: t > wd ? 'shock' : 'happy', look: [0.6, 0], hop: Math.max(0, Math.sin(t * 9)) * 0.5 });
      cook.at(1.0, 0, -4.6); cook.set({ mood: 'sly', armR: [130, -20], holdR: fork, v: 'f', armL: [60, -50], talk: talk(t), blink: blink(t) });
      shoot(M.scene, lawn, V3(0.2, 1.4, 0.4), V3(0.2, 2.0, 2.8), V3(0.2, 1.2, -4.2), V3(0.2, 2.2, -8), k, { ...LK.day, fov: 50 });
      blit(); pill('FOR DINNER', (t - wd) / 0.25, 300, 'rgba(160,30,40,0.92)', 64);
    } });
    cue(wd, 'ding', { gain: 0.6 }); }

  // 4a · "But Lincoln's son, Tad," Tad runs in, speed lines; pill
  { const st = cut(3), wt = Wd('tad', 3);
    add({ id: 'S04a', at: st, note: 'tracking: Tad (kid toon) runs across the lawn toward Jack, speed lines; pill LINCOLN\'S SON, AGE 10', draw(lt, d, t, blit) {
      const k = clamp(lt / d); onlyL(tad, jack); const x = lerp(-4.0, -1.2, eo(k));
      tad.at(x, 0, -3.0); tad.set({ mood: 'happy', legs: 'run', phase: t * 13, armL: [70, -60], armR: [150, 10], lean: 10, blink: 0 });
      jack.at(0.4, 0, -3.4); jack.set({ mood: 'happy', look: [-0.6, 0] });
      shoot(M.scene, lawn, V3(x - 0.6, 1.1, 0.4), V3(x + 0.4, 1.1, 0.2), V3(x + 0.6, 0.9, -3.2), null, 0, { ...LK.day, fov: 50 });
      blit(); speedLines(0.6, 1); pill("LINCOLN'S SON, AGE 10", (t - wt) / 0.25, 300, 'rgba(31,28,51,0.9)', 54);
    } });
    cue(st, 'whoosh', { gain: 0.8 }); cue(wt, 'pop', { gain: 0.6 }); }
  // 4b · "named him Jack," Tad holds up a sign JACK next to the turkey; ribbon JACK
  { const st = Wd('named', 3) - 0.12, wj = Wd('jack', 3);
    add({ id: 'S04b', at: st, note: 'medium: Tad holds up a hand-painted sign JACK beside the turkey, proud; gold ribbon JACK bounces in', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); onlyL(tad, jack);
      tad.at(-1.0, 0, -3.0); tad.set({ mood: 'proud', armR: [150, 0], holdR: PROPS.sign('JACK', '#FFE08A'), v: 'sj', armL: [20, 10], talk: talk(t), blink: blink(t) });
      jack.at(0.3, 0, -3.3); jack.set({ mood: t > wj ? 'happy' : 'shock', look: [-0.6, -0.4], flap: t > wj ? Math.abs(Math.sin(t * 12)) * 0.6 : 0 });
      shoot(M.scene, lawn, V3(1.4, 1.2, 0.6), V3(0.6, 1.25, 0.3), V3(-0.4, 1.0, -3.1), null, k, { ...LK.day, fov: 46 });
      blit(); ribbon('JACK', (t - wj + 0.05) / 0.3, 330, 96);
    } });
    cue(wj, 'stamp', { gain: 0.7 }); }

  // 5 · "and made him his pet." Tad and Jack walk side by side, hearts pop
  { const st = cut(4), wp = Wd('pet', 4);
    add({ id: 'S05', at: st, note: 'wide side tracking: Tad walks Jack across the lawn like a puppy, Jack hopping; hearts pop on "pet"', draw(lt, d, t, blit) {
      const k = clamp(lt / d); onlyL(tad, jack); const x = lerp(-2.5, -0.5, k);
      tad.at(x, 0, -3.6); tad.set({ mood: 'laugh', legs: 'walk', phase: t * 8, armL: [20, 10], armR: [40, -20], blink: blink(t) });
      jack.at(x + 1.2, 0, -3.5); jack.set({ mood: 'happy', hop: Math.abs(Math.sin(t * 8)) });
      shoot(M.scene, lawn, V3(x - 1.0, 1.6, 2.2), V3(x + 0.2, 1.4, 1.8), V3(x + 0.5, 0.9, -3.6), null, eio(k), { ...LK.day, fov: 48 });
      blit(); [0, 0.2, 0.4].forEach((o, i) => heart(460 + i * 90, 640 - i * 30, (t - wp - o) / 0.9));
    } });
    cue(wp, 'sparkle', { gain: 0.6 }); }

  // 6a · "Then Tad heard" Tad spins round: ! pops; the cook waves fork and pan in the distance
  { const st = cut(5), wh2 = Wd('heard', 5);
    add({ id: 'S06a', at: st, note: 'over Tad\'s shoulder: the cook in the distance waves the giant fork and roasting pan; Tad throws his arms up, ! pops on "heard"', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); onlyL(tad, cook, jack);
      tad.at(-1.2, 0, -2.4); tad.set({ mood: t > wh2 ? 'shock' : 'happy', armL: t > wh2 ? [150, 10] : [20, 10], armR: t > wh2 ? [150, 10] : [20, 10], look: [0.6, 0], blink: 0 });
      jack.at(-0.1, 0, -2.6); jack.set({ mood: 'happy', look: [-0.4, 0] });
      cook.at(2.4, 0, -6.2); cook.set({ mood: 'laugh', armR: [150, 0], holdR: fork, armL: [90, -60], holdL: pan, v: 'fp', talk: talk(t), bob: Math.abs(Math.sin(t * 8)) * 4 });
      shoot(M.scene, lawn, V3(-3.2, 1.6, 1.8), V3(-2.8, 1.6, 1.2), V3(1.0, 1.2, -5.0), V3(1.8, 1.3, -6.0), k, { ...LK.day, fov: 44 }, 6.5);
      blit(); mark('!', 330, 360, (t - wh2) / 0.25);
    } });
    cue(wh2, 'boing', { gain: 0.7 }); }
  // 6b · "was about to be cooked." close on Jack, red tint, stamp ON THE MENU
  { const st = Wd('was', 5) - 0.12, wc = Wd('cooked', 5);
    add({ id: 'S06b', at: st, note: 'push-in close on Jack with wide eyes; red tint, Dutch tilt; stamp ON THE MENU slams on "cooked"', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); onlyL(jack); jack.at(-0.1, 0, -2.6); jack.set({ mood: 'shock', look: [0.3, 0.2], flap: Math.abs(Math.sin(t * 20)) * 0.3 });
      shoot(M.scene, lawn, V3(0.6, 0.9, 0.4).add(shake(t, wc)), V3(0.3, 0.95, -0.9), V3(-0.1, 0.75, -2.6), null, k, { ...LK.day, fov: 46 }, undefined, lerp(0, 0.12, k));
      blit(); tint(clamp((t - wc + 0.3) / 0.3), '#D8343F'); stamp(['ON THE', 'MENU!'], (t - wc) / 0.2, { y: 400, size: 92 });
    } });
    cue(wc, 'slam', { gain: 0.8 }); }

  // 7a · "He burst in on his dad," whip into the office: Tad runs in, the men startled
  { const st = cut(6), wb = Wd('burst', 6);
    add({ id: 'S07a', at: st, note: 'office: whip-pan as Tad bursts in running; his dad (tall top-hat toon) and two aides by the desk jump in shock', draw(lt, d, t, blit) {
      const k = clamp(lt / d); otad.group.visible = true; a1.group.visible = a2.group.visible = true; const x = lerp(-3.6, -0.6, eo(k));
      otad.at(x, 0, -2.6); otad.set({ mood: 'sad', tears: 1, legs: 'run', phase: t * 13, armL: [150, 10], armR: [150, 10], lean: 10, blink: 0 });
      dad.at(DAD.x, 0, DAD.z); dad.set({ mood: 'shock', armL: [60, -40], armR: [60, -40], look: [0.3, 0.3] });
      a1.at(1.9, 0, -5.8); a1.set({ mood: 'shock', armL: [150, 10], armR: [20, 10] }); a2.at(3.1, 0, -5.0); a2.set({ mood: 'shock', legs: 'jump', armL: [150, 10], armR: [150, 10] });
      shoot(O.scene, off, V3(lerp(-2.0, 0.6, eo(k)), 1.6, 1.4), V3(0.4, 1.6, 1.2), V3(lerp(-2.4, -0.4, eo(k)), 1.2, -3.6), null, 0, { ...LK.room, fov: 54 });
      blit(); speedLines(clamp(1 - lt / 0.5), 4); mark('!', 760, 360, (t - wb - 0.1) / 0.25);
    } });
    cue(st, 'whoosh', { gain: 0.9 }); cue(wb, 'thud', { gain: 0.6 }); }
  // 7b · "sobbing," close on Tad crying, Dutch tilt
  { const st = Wd('sobbing', 6) - 0.15;
    add({ id: 'S07b', at: st, note: 'close-up on Tad sobbing, big tears, camera tilts and pushes in', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); otad.at(-0.6, 0, -2.6); otad.set({ mood: 'sad', tears: 1, armL: [120, -110], armR: [120, -110], bob: Math.sin(t * 14) * 4, blink: 0 });
      dad.group.visible = false; a1.group.visible = a2.group.visible = false;
      shoot(O.scene, off, V3(0.6, 1.1, -0.6), V3(0.3, 1.0, -1.0), V3(-0.6, 0.95, -2.6), null, k, { ...LK.room, fov: 44 }, undefined, lerp(-0.05, -0.14, k));
      blit();
    } });
    cue(st, 'plop', { gain: 0.4 }); }

  // 8 · "begging him to save Jack." high angle over the tall dad: Tad on his knees, arms up
  { const st = cut(7), ws = Wd('save', 7);
    add({ id: 'S08', at: st, note: 'high angle from behind the dad\'s shoulder: Tad kneels with both arms up begging; pill PLEASE SAVE JACK!', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); dad.group.visible = a1.group.visible = a2.group.visible = true; otad.at(-0.4, 0, -3.0); otad.set({ mood: 'sad', tears: 1, legs: 'sit', armL: [150, 0], armR: [150, 0], bob: Math.abs(Math.sin(t * 7)) * 5, look: [0, -0.7] });
      dad.at(-1.6, 0, -4.7); dad.set({ mood: 'worried', armL: [20, 10], armR: [60, -60], look: [0.3, 0.6] });
      a1.at(1.9, 0, -5.8); a1.set({ mood: 'sad', armL: [20, 10], armR: [20, 10] }); a2.at(3.1, 0, -5.0); a2.set({ mood: 'worried', armL: [20, 10], armR: [60, -60] });
      shoot(O.scene, off, V3(0.2, 2.5, -0.2), V3(0.0, 2.4, -0.7), V3(-0.8, 0.35, -3.6), null, k, { ...LK.room, fov: 58 });
      blit(); pill('PLEASE SAVE JACK!', (t - ws + 0.2) / 0.25, 300, 'rgba(31,28,51,0.9)', 62);
    } });
    cue(ws, 'pop', { gain: 0.6 }); }

  // 9 · "Subscribe for more wild true stories." Jack hops toward camera; SUBSCRIBE button pressed
  { const st = cut(8);
    add({ id: 'S09', at: st, note: 'lawn: Jack the turkey hops toward the camera, Tad waving behind; SUBSCRIBE button pops and gets pressed', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); onlyL(tad, jack); jack.at(-0.2, 0, lerp(-3.8, -3.0, k)); jack.set({ mood: 'happy', hop: Math.abs(Math.sin(t * 9)), flap: Math.abs(Math.sin(t * 9)) * 0.6 });
      tad.at(-1.6, 0, -4.4); tad.set({ mood: 'laugh', armR: [150 + Math.sin(t * 12) * 15, 10], armL: [20, 10], blink: blink(t) });
      shoot(M.scene, lawn, V3(0.4, 1.0, 0.4), V3(-0.2, 1.1, -0.3), V3(-0.6, 0.8, -3.6), null, k, { ...LK.day, fov: 48 });
      blit(); subscribe(lt / 0.45 + (lt > 0.8 ? (lt - 0.8) * 1.4 : 0), t, 330);
    } });
    cue(st, 'pop', { gain: 0.6 }); cue(st + 1.25, 'ding', { gain: 0.6 }); }

  // 10a · "So the President wrote" office: the dad writes with a quill, push-in
  { const st = cut(9), ww = Wd('wrote', 9);
    add({ id: 'S10a', at: st, note: 'office: the dad leans over the desk writing with a feather quill; Tad wipes his tears and watches; push-in', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); a1.group.visible = a2.group.visible = false;
      dad.at(-0.6, 0, -5.8); dad.set({ mood: 'smug', lean: 10, armR: [70 + Math.sin(t * 16) * 6, -50], holdR: quill, v: 'q', armL: [40, -40], look: [0.4, 0.6], blink: blink(t) });
      otad.at(-2.0, 0, -4.6); otad.set({ mood: 'worried', tears: 1, armL: [20, 10], armR: [120, -120], look: [0.6, 0.2], blink: blink(t, 1) });
      shoot(O.scene, off, V3(-1.5, 1.6, -0.2), V3(-1.3, 1.5, -1.0), V3(-1.3, 1.2, -5.2), null, k, { ...LK.room, fov: 54 });
      blit();
    } });
    cue(ww, 'zip', { gain: 0.4 }); }
  // 10b · "the turkey a pardon," a big PARDON card slams into view
  { const st = Wd('turkey', 9) - 0.2, wp = Wd('pardon', 9);
    add({ id: 'S10b', at: st, note: 'the dad holds up the little pardon card, smiling; a big parchment PARDON for JACK the turkey slams onto the screen', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); a1.group.visible = a2.group.visible = false;
      dad.at(-0.6, 0, -5.8); dad.set({ mood: 'happy', armR: [150, 0], holdR: card, v: 'cd', armL: [20, 10], talk: talk(t), blink: blink(t) });
      otad.at(-2.0, 0, -4.6); otad.set({ mood: t > wp ? 'laugh' : 'shock', tears: 0, armL: t > wp ? [150, 10] : [20, 10], armR: t > wp ? [150, 10] : [20, 10] });
      shoot(O.scene, off, V3(-1.4, 1.4, -0.4).add(shake(t, wp)), V3(-1.3, 1.45, -1.0), V3(-1.3, 1.3, -5.2), null, k, { ...LK.room, fov: 54 });
      blit(); pardonCard((t - wp) / 0.3, 540, 520);
    } });
    cue(wp, 'stamp', { gain: 0.9 }); }

  // 11 · "and Jack got to live." Tad and Jack jump, confetti
  { const st = cut(10), wl = Wd('live', 10);
    add({ id: 'S11', at: st, note: 'lawn, crane up: Tad and Jack jump for joy in front of the white mansion; confetti on "live"', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); onlyL(tad, jack); crate.visible = false;
      tad.at(-1.0, 0, -4.0); tad.set({ mood: 'laugh', legs: Math.sin(t * 9) > 0 ? 'jump' : 'stand', armL: [150, 10], armR: [150, 10], squash: Math.max(0, -Math.sin(t * 9)) * 0.2 });
      jack.at(0.4, 0, -4.1); jack.set({ mood: 'happy', hop: Math.abs(Math.sin(t * 9 + 1)), flap: Math.abs(Math.sin(t * 12)) });
      shoot(M.scene, lawn, V3(-0.4, 1.0, 0.0), V3(-0.2, 2.4, 1.0), V3(-0.3, 1.0, -4.0), V3(-0.3, 1.4, -6), k, { ...LK.day, fov: 50 });
      blit(); confetti(t, wl - 0.25, 60);
    } });
    cue(wl, 'sparkle', { gain: 0.8 }); }

  // 12a · "So next time a President pardons a turkey," today again: podium, flashes
  { const st = cut(11), wp = Wd('pardons', 11);
    add({ id: 'S12a', at: st, note: 'today: orbit the podium; the president toon pardons a turkey, reporters snap photos (flashes)', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); onlyL(pres, jack2);
      pres.at(9, 0, -6.6); pres.set({ mood: 'happy', armR: [140, 0], armL: [20, 10], talk: talk(t), blink: blink(t) });
      jack2.at(10.2, 0.8, -6.0); jack2.set({ mood: 'happy', flap: Math.abs(Math.sin(t * 10)) * 0.5 });
      pr1.at(7.7, 0, -3.4); pr1.set({ mood: 'happy', armL: [100, -80], armR: [100, -80], holdR: PROPS.cup, v: 'c' }); pr2.at(11.5, 0, -3.6); pr2.set({ mood: 'laugh', armL: [20, 10], armR: [140, -10] });
      const a = lerp(-0.3, 0.2, k), c = V3(9.6, 1.2, -6.2); const cp = V3(c.x + Math.sin(a) * 6.6, 1.8, c.z + Math.cos(a) * 6.6);
      shoot(M.scene, lawn, cp, cp, c, null, 0, { ...LK.day, fov: 48 });
      blit(); camFlashes(t, st + 0.2); camFlashes(t, wp);
    } });
    cue(st, 'whoosh', { gain: 0.6 }); cue(wp, 'pop', { gain: 0.5 }); }
  // 12b · "remember:" back to frame 0 (loop)
  { const st = Wd('remember', 11) - 0.15;
    add({ id: 'S12b', at: st, note: 'loop: back to the opening framing, Tad hugging Jack in tears, the cook walking in; hook KID VS. PRESIDENT returns', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); onlyL(tad, jack, cook); crate.visible = false;
      tad.at(HUG.x - 0.45, 0, HUG.z); tad.set({ mood: 'sad', tears: 1, armL: [80, -40], armR: [70, -30], lean: 8, bob: Math.sin(t * 9) * 3, blink: blink(t) });
      jack.at(HUG.x + 0.55, 0, HUG.z - 0.1); jack.set({ mood: 'shock', look: [-0.5, 0], flap: Math.abs(Math.sin(t * 10)) * 0.4 });
      cook.at(lerp(1.6, 1.3, k), 0, HUG.z - 2.4); cook.set({ mood: 'smug', legs: 'walk', phase: t * 6, armL: [80, -60], armR: [80, -60], holdR: pan, v: 'pan', blink: blink(t) });
      shoot(M.scene, lawn, V3(-0.5, 1.1, 2.6), V3(-0.3, 0.8, 1.6), V3(-0.25, 0.95, -2.8), null, k, { ...LK.day, fov: 52 });
      blit(); hook(['KID VS.', 'PRESIDENT'], (lt - 0.2) / 0.4, { y: 300, size: 132, hiLine: 1 });
    } });
    cue(st, 'whoosh', { gain: 0.5 }); cue(st + 0.3, 'pop', { gain: 0.5 }); }

  return { shots: S, cues: CUES };
}
