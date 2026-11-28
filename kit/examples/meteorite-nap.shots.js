// WHY SHE PAID $500 FOR THE ROCK THAT HIT HER (Ann Hodges, Sylacauga AL, Nov 30 1954) — Tall Tale 3D, warm 1950s grade.
// Respectful: she was bruised, not badly hurt; no injury shown. Generic toons (no likeness of real people).
import * as THREE from 'three';
import { ctx, clamp, lerp, eo, eio, eob, rnd } from './core/lib.js';
import { L, Le, Wd, T } from './core/timing.js';
import * as WD from './core/world.js';
import { Toon, INK } from './core/toon.js';
import { V3, talk, blink, hook, ribbon, pill, stamp, calCard, flash, tint, speedLines, stars, mark, makeShoot, P2 } from './jh.js';
import { redCircle, redArrow, bigNum, followBtn, zoomBlur, haze, topShade } from './f19.js';
import { livingRoom, town, meteor, dust, paper, bubble, cashFly } from './met.js';

const LOOKS = {
  ann: { body: '#E58A9A', pattern: 'plain', hat: 'bun', hatCol: '#5A3A2A', neck: 'collar', neckCol: '#FFFFFF' },
  land: { body: '#7A5AA8', pattern: 'apron', patCol: '#E9D7F2', hat: 'bun', hatCol: '#A8A8B0', neck: 'none', extra: ['glasses'] },
  lawyer: { body: '#3A3A48', pattern: 'vest', patCol: '#2A2A34', hat: 'bowler', hatCol: '#22222A', neck: 'tie', neckCol: '#C8283A', extra: ['mustache'] },
  rep: { body: '#D8584A', hat: 'boater', hatCol: '#E9D7A5', neck: 'bowtie', neckCol: '#2E4E8A', extra: ['pencil'] },
  photo: { body: '#4E7A9A', hat: 'cap', hatCol: '#3A4A5A', neck: 'tie', neckCol: '#F2C230', extra: ['glasses'] },
};
const mk = (k, o) => new Toon({ ...LOOKS[k], extra: [...(LOOKS[k].extra || [])] }, o);
const WARM = { warm: 0.05, sat: 1.1, vignette: 0.26 };
const LKd = { bloom: 0.12, bloomThreshold: 1.08, aperture: 0.00012, maxblur: 0.003, ...WARM };
const LKr = { bloom: 0.12, bloomThreshold: 1.08, aperture: 0.0002, maxblur: 0.003, ...WARM };
const GL = () => document.getElementById('gl');
// the rock as a 2D hand prop
const ROCK = (g, x, y) => { g.save(); g.translate(x, y - 40); g.fillStyle = '#3A3430'; g.strokeStyle = INK; g.lineWidth = 6; g.beginPath(); for (let i = 0; i < 12; i++) { const a = i / 12 * 6.28, r = 46 + (i % 3) * 8; g.lineTo(Math.cos(a) * r * 1.2, Math.sin(a) * r); } g.closePath(); g.fill(); g.stroke(); g.fillStyle = '#5A524A'; g.beginPath(); g.arc(-14, -12, 12, 0, 7); g.fill(); g.restore(); };
const CAM = (g, x, y) => { g.save(); g.translate(x, y - 40); g.strokeStyle = INK; g.lineWidth = 5; g.fillStyle = '#2A2E36'; g.beginPath(); g.roundRect(-50, -34, 100, 68, 8); g.fill(); g.stroke(); g.fillStyle = '#8A9AAA'; g.beginPath(); g.arc(0, 0, 22, 0, 7); g.fill(); g.stroke(); g.fillStyle = '#E9E9EF'; g.beginPath(); g.arc(-40, -60, 22, 0, 7); g.fill(); g.stroke(); g.restore(); };


// 2D fireball for the cover beat: black rock with an orange rim, flame trail toward the upper right, sparks
function fireball(x, y, s, t, ang = -0.95) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.save(); ctx.rotate(ang); const g = ctx.createLinearGradient(0, 0, 520, 0); g.addColorStop(0, 'rgba(255,240,170,0.95)'); g.addColorStop(0.25, 'rgba(255,170,50,0.85)'); g.addColorStop(0.7, 'rgba(230,70,30,0.45)'); g.addColorStop(1, 'rgba(200,40,20,0)');
  ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(0, -95); for (let i = 0; i <= 12; i++) { const u = i / 12; ctx.lineTo(u * 520, -95 * (1 - u) - Math.sin(u * 20 + t * 30) * 12 * (1 - u)); } for (let i = 12; i >= 0; i--) { const u = i / 12; ctx.lineTo(u * 520, 95 * (1 - u) + Math.sin(u * 17 + t * 27) * 12 * (1 - u)); } ctx.closePath(); ctx.fill(); ctx.restore();
  const hg = ctx.createRadialGradient(0, 0, 40, 0, 0, 170); hg.addColorStop(0, 'rgba(255,200,90,0.9)'); hg.addColorStop(1, 'rgba(255,120,40,0)'); ctx.fillStyle = hg; ctx.beginPath(); ctx.arc(0, 0, 170, 0, 7); ctx.fill();
  ctx.fillStyle = '#26211E'; ctx.strokeStyle = '#FF9A3A'; ctx.lineWidth = 12; ctx.beginPath(); for (let i = 0; i < 11; i++) { const a = i / 11 * 6.283, r = 80 + ((i * 37) % 23); ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r * 0.9); } ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#4A403A'; ctx.beginPath(); ctx.arc(-22, -20, 18, 0, 7); ctx.fill(); ctx.beginPath(); ctx.arc(26, 22, 12, 0, 7); ctx.fill();
  for (let i = 0; i < 10; i++) { const q = (t * 2 + rnd(i)) % 1; ctx.fillStyle = `rgba(255,${180 + rnd(i) * 60},80,${1 - q})`; ctx.beginPath(); ctx.arc(Math.cos(i * 2.1) * 120 * q + q * 150, -Math.sin(i * 1.3) * 100 * q - q * 120, 9, 0, 7); ctx.fill(); }
  ctx.restore();
}

export function buildShots(E) {
  const S = [], CUES = [], add = (o) => (S.push(o), o), cue = (t, type, o = {}) => CUES.push({ t: +Math.max(0, t).toFixed(3), type, ...o });
  const cut = (i) => (i === 0 ? 0 : L(i) - 0.06);
  const W = (w, l) => Wd(w, l);
  const { shoot, cam: CAMR } = makeShoot(E);
  const scr = (v) => { const p = v.clone().project(CAMR); return [(p.x + 1) / 2 * 1080, (1 - p.y) / 2 * 1920]; };
  const shake = (t, t0, a = 0.08) => { const k = t - t0; if (k < 0 || k > 0.4) return V3(0, 0, 0); const f = (1 - k / 0.4) * a; return V3(Math.sin(k * 90) * f, Math.cos(k * 70) * f, 0); };

  // ── sets ──
  const R = livingRoom(E); const rockIn = meteor(0.17); R.scene.add(rockIn);
  const ann = mk('ann'), land = mk('land'), lawyer = mk('lawyer'), annIn2 = mk('ann');
  [ann, land, lawyer].forEach((p) => R.scene.add(p.group));
  const TW = town(E); const rockOut = meteor(0.5); TW.scene.add(rockOut);
  const rep = mk('rep'), pho = mk('photo'), annOut = mk('ann'); [rep, pho, annOut].forEach((p) => TW.scene.add(p.group));
  // the sky for the drone dive: tall cloud layer above the town
  const hiClouds = WD.clouds(TW.scene, [[-40, 90, -20, 40], [30, 110, 10, 50], [-10, 140, 30, 60], [50, 160, -30, 60], [-60, 180, 20, 60]], '#FFF4E6');
  const roomOnly = (...keep) => [ann, land, lawyer].forEach((p) => (p.group.visible = keep.includes(p)));
  const townOnly = (...keep) => [rep, pho, annOut].forEach((p) => (p.group.visible = keep.includes(p)));
  const SEAT = [0.3, 0.12, -4.62];
  const annSit = (st) => { ann.at(...SEAT); ann.set({ legs: 'sit', ...st }); };
  const zz = (t, x, y, k = 1) => { if (k <= 0) return; ctx.save(); ctx.font = '900 70px Inter'; ctx.textAlign = 'center'; ctx.lineWidth = 12; ctx.strokeStyle = INK; ctx.fillStyle = '#FFFFFF'; for (let i = 0; i < 3; i++) { const q = ((t * 0.8 + i / 3) % 1); ctx.globalAlpha = Math.sin(q * Math.PI) * k; const s = 0.6 + q * 0.6; ctx.save(); ctx.translate(x + q * 120, y - q * 200); ctx.scale(s, s); ctx.strokeText('Z', 0, 0); ctx.fillText('Z', 0, 0); ctx.restore(); } ctx.restore(); };
  const HOME = V3(0, 0, 0);

  // ═══ SHOTS ═══
  // 0 · COVER: Ann on the couch in shock, a flaming rock bursts through the ceiling above her
  { const st = 0;
    add({ id: 'S00', at: st, note: 'COVER: low angle in the 50s living room: Ann on the couch, huge shocked face; a flaming rock bursts through a hole in the ceiling above her, light shaft, dust; red circle on the rock; text FROM SPACE?', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); roomOnly(ann); R.setHole(1); R.debris.update(0.3 + lt * 0.5);
      annSit({ mood: 'shock', sweat: 1, armL: [130, -50], armR: [120, -40], look: [0.3, -0.8], blink: 0 });
      rockIn.visible = false;
      shoot(R.scene, [ann], V3(lerp(0.58, 0.52, k), 1.0, lerp(-2.95, -3.15, k)), null, V3(0.62, 1.5, -4.9), null, 0, { ...LKr, fov: 66, aperture: 0.00004 }, 2.0);
      blit(); topShade(0.5); const fy = lerp(560, 640, k); fireball(lerp(790, 770, k), fy, 0.95, t); redCircle(lerp(790, 770, k), fy, 135, 130, 1); redArrow(lerp(790, 770, k) - 125, fy + 125, -0.95, 1, 200);
      hook(['FROM', 'SPACE?'], 1, { y: 260, size: 150, hiLine: 1, hi: '#FFD43B' });
    } });
    cue(0, 'boom', { gain: 0.8 }); }
  // 1 · "hit her on her couch," DRONE dive following the fireball down to the town
  { const st = W('hit', 0) - 0.12;
    add({ id: 'S01', at: st, note: 'DRONE: fast dive from above the clouds chasing a fireball down toward a little 1950s Alabama street of houses; zoom blur; haze', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); townOnly(); rockOut.visible = true; rockOut.fire(1);
      const rp = V3(lerp(-6, 0, k), lerp(150, 14, k), lerp(-6, 0, k)); rockOut.position.copy(rp); rockOut.rotation.set(t * 4, t * 3, 0);
      const cam = rp.clone().add(V3(lerp(6, 14, k), lerp(14, 10, k), lerp(16, 26, k)));
      shoot(TW.scene, [], cam, null, rp.clone().add(V3(0, lerp(-10, -10, k), 0)), null, 0, { ...LKd, fov: 55, aperture: 0 });
      blit(); zoomBlur(GL(), 1 - k * 0.6, { cy: 1100 }); haze((1 - k) * 0.15, '255,240,220'); topShade(0.35);
    } });
    cue(st, 'whoosh', { dur: 1.0, gain: 0.8 }); }
  // 2 · "and then she had to pay for it." on the porch: Ann holds the rock, money flies out of her hand; ? marks
  { const st = W('and', 0) - 0.1, wp = W('pay', 0);
    add({ id: 'S02', at: st, note: 'porch of the house, push-in: Ann holds the black rock, worried; dollar bills fly out of her hand to the right; ? marks pop', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); townOnly(annOut); rockOut.visible = false;
      annOut.at(0.4, 0, 5.0); annOut.set({ mood: 'worried', armR: [70, -60], holdR: ROCK, v: 'r', armL: [60, -30], blink: blink(t), look: [0.4, 0] });
      shoot(TW.scene, [annOut], V3(lerp(1.4, 1.0, k), 1.5, lerp(9.4, 8.4, k)), null, V3(0.4, 1.3, 5.0), null, 0, { ...LKd, fov: 44 });
      blit(); topShade(0.35); cashFly((t - wp + 0.1) / 0.9, 8, 720, 1150, 1060, 760); mark('?', 860, 560, (t - wp - 0.2) / 0.3);
      pill('SHE PAID?', (t - wp) / 0.25, 300, 'rgba(31,28,51,0.9)', 70);
    } });
    cue(st, 'whoosh', { gain: 0.4 }); cue(wp, 'ding', { gain: 0.5 }); }

  // 3a · "Sylacauga, Alabama," wide crane over the street
  { const st = cut(1), wa = W('alabama,', 1) + 0.1;
    add({ id: 'S03', at: st, note: 'wide crane down over a sunny 1950s Alabama street: white houses, trees, a teal car on the dirt road; ribbon SYLACAUGA, ALABAMA', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); townOnly(); rockOut.visible = false;
      shoot(TW.scene, [], V3(lerp(-4, 2, k), lerp(24, 9, k), lerp(36, 26, k)), null, V3(0, 2, 0), null, 0, { ...LKd, fov: 50 });
      blit(); topShade(0.35); ribbon('ALABAMA', (t - st - 0.05) / 0.3, 300, 84); pill('SYLACAUGA', (t - wa) / 0.25, 450, 'rgba(31,28,51,0.9)', 62);
    } });
    cue(st, 'whoosh', { gain: 0.5 }); cue(wa, 'pop', { gain: 0.5 }); }
  // 3b · "November thirtieth, 1954." push toward Ann's house; calendar
  { const st = W('nineteen', 1) - 0.1, wy = W('nineteen', 1) + 0.25;
    add({ id: 'S04', at: st, note: 'slow push toward the white house with the porch; calendar NOV 30 slams, pill 1954', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); townOnly(); rockOut.visible = false;
      shoot(TW.scene, [], V3(lerp(6, 3.5, k), lerp(2.2, 2.0, k), lerp(16, 12, k)), null, V3(0, 2.2, 0), null, 0, { ...LKd, fov: 46 });
      blit(); topShade(0.35); calCard('NOV', '30', 540, 470, eob(clamp((t - st) / 0.25)), -0.06, '#C8283A'); pill('1954', (t - wy) / 0.25, 700, 'rgba(31,28,51,0.9)', 64);
    } });
    cue(st, 'slam', { gain: 0.6 }); cue(wy, 'pop', { gain: 0.5 }); }

  // 4 · "Ann Hodges was napping under a quilt," dolly in on Ann asleep; Z z z
  { const st = cut(2), wa = W('ann', 2), wq = W('quilt,', 2);
    add({ id: 'S05', at: st, note: 'cosy afternoon living room, slow dolly-in and slight orbit: Ann asleep sitting on the couch under a patchwork quilt, console radio beside; Z z z; pill ANN HODGES', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); roomOnly(ann); R.setHole(0); rockIn.visible = false;
      annSit({ mood: 'tired', blink: 1, armL: [10, 10], armR: [10, 10], bob: Math.sin(t * 2) * 4 });
      shoot(R.scene, [ann], V3(lerp(2.2, 1.2, k), 1.5, lerp(-0.7, -1.7, k)), null, V3(0.7, 1.1, -4.8), null, 0, { ...LKr, fov: 48 });
      blit(); topShade(0.3); zz(t, 470, 640); pill('ANN HODGES', (t - wa) / 0.25, 300, 'rgba(31,28,51,0.9)', 66);
    } });
    cue(st, 'whoosh', { gain: 0.4 }); cue(wa, 'pop', { gain: 0.5 }); }

  // 5a · "when an eight-pound meteorite" fireball streaks down at the roof, low angle from the street
  { const st = cut(3), w8 = W('eight-pound', 3);
    add({ id: 'S06', at: st, note: 'low angle from the street: a fireball streaks down out of the sky straight at the house roof; riser; label 8.5 LB ROCK', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); townOnly(); rockOut.visible = true; rockOut.fire(1);
      const f = clamp(lt / d); rockOut.position.set(lerp(-9, 0.8, f), lerp(32, 5.4, f), lerp(-8, -0.4, f)); rockOut.rotation.set(t * 4, t * 3, 0);
      shoot(TW.scene, [], V3(lerp(5, 4.4, k), 0.8, 13), null, V3(0, lerp(9, 4, k), 0), null, 0, { ...LKd, fov: 56 });
      blit(); topShade(0.3); pill('8.5 LB ROCK', (t - w8) / 0.25, 300, 'rgba(31,28,51,0.9)', 66);
    } });
    cue(st, 'riser', { dur: 1.2, gain: 0.7 }); }
  // 5b · "punched through the roof," inside: ceiling bursts, light shaft, dust, shake
  { const st = W('punched', 3) - 0.1;
    add({ id: 'S07', at: st, note: 'inside, camera looks up: the ceiling bursts open, a flaming rock drops through a ragged hole, plaster dust, a shaft of daylight; camera shake; Ann below jerks awake', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); roomOnly(ann); R.setHole(clamp(lt / 0.1)); R.debris.update(lt / 1.0); rockIn.visible = true; rockIn.fire(1); rockIn.scale.setScalar(1);
      rockIn.position.set(lerp(1.0, 1.7, clamp(lt / d)), lerp(3.4, 1.9, clamp(lt / d)), -5.0); rockIn.rotation.set(t * 5, t * 3, 0);
      annSit({ mood: 'shock', armL: [100, -40], armR: [100, -40], look: [0.4, -0.9], blink: 0 });
      shoot(R.scene, [ann], V3(0.9, 0.8, -1.6).add(shake(t, st, 0.12)), null, V3(1.4, 2.4, -5.0), null, 0, { ...LKr, fov: 54 });
      blit(); flash((1 - lt / 0.15) * 0.5, '#FFE6B0'); stars(700, 420, (t - st) / 0.6);
    } });
    cue(st, 'boom', { gain: 1.0 }); }

  // 6 · "bounced off her radio," the rock bounces off the console radio
  { const st = cut(4), wb = W('bounced', 4);
    add({ id: 'S08', at: st, note: 'close orbit on the wooden console radio: the flaming rock hits its top and bounces off in an arc toward the couch; impact stars; label BOING', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); roomOnly(); R.setHole(1); rockIn.visible = true; rockIn.fire(0.5); rockIn.scale.setScalar(1);
      const f = clamp((t - wb) / 0.9); const x = lerp(2.0, 0.6, f), y = f < 0.25 ? lerp(1.7, 1.15, f / 0.25) : 1.15 + Math.sin((f - 0.25) / 0.75 * Math.PI) * 0.6 - (f - 0.25) * 0.2; rockIn.position.set(x, y, -5.2); rockIn.rotation.set(t * 6, t * 4, 0);
      const a = lerp(-0.5, 0.2, k); shoot(R.scene, [], V3(1.5 + Math.sin(a) * 2.4, 1.6, -5.2 + Math.cos(a) * 2.4).add(shake(t, wb + 0.2, 0.05)), null, V3(1.4, 1.15, -5.2), null, 0, { ...LKr, fov: 48 });
      blit(); stars(620, 900, (t - wb - 0.2) / 0.6); bubble('BOING!', (t - wb - 0.2) / 0.25, 560, 420, { size: 80, col: '#FFD43B' });
    } });
    cue(wb + 0.2, 'boing', { gain: 0.7 }); }
  // 7 · "and slammed into her hip." Ann jolts; impact; shake
  { const st = cut(5), wh = W('hip.', 5);
    add({ id: 'S09', at: st, note: 'punch-in on Ann on the couch: the rock smacks into her side, she jolts with a huge shocked face, impact stars, whip zoom and shake; label OUCH!', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); roomOnly(ann); R.setHole(1); rockIn.visible = t < wh + 0.05; rockIn.fire(0.3); rockIn.halo.visible = false; rockIn.scale.setScalar(1);
      rockIn.position.set(lerp(1.2, 0.6, clamp((t - st) / (wh - st + 0.01))), lerp(1.4, 0.75, clamp((t - st) / (wh - st + 0.01))), -4.3);
      annSit({ mood: t > wh ? 'shock' : 'worried', sweat: t > wh ? 1 : 0, armL: t > wh ? [150, -120] : [40, -20], armR: t > wh ? [150, -120] : [40, -20], lean: t > wh ? -8 : 0, blink: 0, squash: t > wh && t < wh + 0.2 ? -0.1 : 0 });
      shoot(R.scene, [ann], V3(lerp(1.2, 0.9, k), 1.4, lerp(-2.1, -2.7, k)).add(shake(t, wh, 0.1)), null, V3(0.4, 1.2, -4.7), null, 0, { ...LKr, fov: 46 });
      blit(); stars(480, 980, (t - wh) / 0.6); bubble('OUCH!', (t - wh) / 0.2, 760, 520, { size: 90, col: '#FFFFFF', tail: -1 }); if (t > wh) flash((1 - (t - wh) / 0.12) * 0.4);
    } });
    cue(wh, 'thud', { gain: 0.9 }); cue(wh + 0.05, 'boing', { gain: 0.3 }); }

  // 9 · "But that's not the weird part." dark orbit around the rock on the coffee table; riser
  { const st = cut(6), ww = W('weird', 6);
    add({ id: 'S12', at: st, note: 'room goes dim: fast eased orbit around the black rock sitting on the rug, rim light; ? marks; riser', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); roomOnly(); R.setHole(0.6); rockIn.visible = true; rockIn.fire(0); rockIn.scale.setScalar(1); rockIn.position.set(0.1, 0.17, -3.3); rockIn.rotation.set(0, t * 0.6, 0);
      const a = lerp(-1.0, 0.8, k); shoot(R.scene, [], V3(0.1 + Math.sin(a) * 1.1, 0.55, -3.3 + Math.cos(a) * 1.1), null, V3(0.1, 0.2, -3.3), null, 0, { ...LKr, fov: 46, exposure: 0.7 }, undefined, lerp(-0.08, 0.08, k));
      blit(); tint(0.6, '#1A1030'); [[260, 660], [820, 600]].forEach(([x, y], i) => mark('?', x, y, (t - ww - i * 0.15) / 0.3));
    } });
    cue(st, 'riser', { dur: 1.4, gain: 0.7 }); }

  // 10 · "Her landlady said the rock was hers," landlady storms in, points, MINE!
  { const st = cut(7), wh = W('hers,', 7), wl = W('landlady', 7);
    add({ id: 'S13', at: st, note: 'whip-pan to the living room: the landlady in an apron and glasses storms in from the left, angry, pointing at the rock in Ann\'s hands; bubble MINE!; pill HER LANDLADY', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); roomOnly(ann, land); R.setHole(1); rockIn.visible = false;
      ann.at(0.9, 0, -3.4); ann.set({ mood: 'shock', armR: [70, -60], holdR: ROCK, v: 'r', armL: [40, -20], blink: 0 });
      land.at(lerp(-2.6, -0.6, eo(clamp(lt / 0.6))), 0, -3.2); land.set({ mood: 'angry', legs: lt < 0.6 ? 'walk' : 'stand', phase: t * 9, armR: [95, 0], armL: [40, -60], talk: talk(t), blink: blink(t), lean: lt < 0.6 ? 8 : 0 });
      shoot(R.scene, [ann, land], V3(lerp(0.6, 0.2, k), 1.5, lerp(1.4, 0.8, k)), null, V3(0.15, 1.2, -3.3), null, 0, { ...LKr, fov: 48 });
      blit(); topShade(0.3); pill('HER LANDLADY', (t - wl) / 0.25, 300, 'rgba(31,28,51,0.9)', 62); bubble('MINE!', (t - wh) / 0.2, 330, 560, { size: 96, col: '#FFFFFF', tail: 1 });
    } });
    cue(st, 'whoosh', { gain: 0.6 }); cue(wh, 'slam', { gain: 0.6 }); }
  // 11 · "and got a lawyer." lawyer slides in, smug; stamp LAWYER
  { const st = cut(8), wl = W('lawyer.', 8);
    add({ id: 'S14', at: st, note: 'push-in: a smug lawyer in a bowler hat slides in beside the landlady holding papers; Ann sweats; stamp LAWYER', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); roomOnly(ann, land, lawyer); R.setHole(1); rockIn.visible = false;
      ann.at(1.4, 0, -3.6); ann.set({ mood: 'worried', sweat: 1, armR: [70, -60], holdR: ROCK, v: 'r', armL: [40, -20], blink: blink(t) });
      land.at(-1.6, 0, -3.8); land.set({ mood: 'smug', armR: [20, 10], armL: [60, -110], blink: blink(t) });
      lawyer.at(lerp(-1.5, -0.1, eo(clamp(lt / 0.35))), 0, -2.6); lawyer.set({ mood: 'sly', armR: [80, -60], holdR: P2.clip, v: 'c', armL: [20, 10], blink: blink(t, 2) });
      shoot(R.scene, [ann, land, lawyer], V3(lerp(0.2, 0.0, k), 1.4, lerp(2.2, 1.6, k)), null, V3(-0.05, 1.2, -3.2), null, 0, { ...LKr, fov: 50 });
      blit(); topShade(0.3); stamp(['LAWYER'], (t - wl) / 0.2, { y: 340, size: 110, col: '#C8283A' });
    } });
    cue(st, 'zip', { gain: 0.5 }); cue(wl, 'stamp', { gain: 0.7 }); }

  // 12 · follow: the reporter points at the viewer
  { const st = cut(9);
    add({ id: 'S15', at: st, note: 'street: the reporter turns and points at the viewer; FOLLOW FOR MORE button gets pressed', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); townOnly(rep); rockOut.visible = false; rep.at(2.4, 0, 7.2); rep.set({ mood: 'happy', armR: [95, 0], armL: [20, 10], talk: talk(t), blink: blink(t) });
      shoot(TW.scene, [rep], V3(lerp(3.4, 3.0, k), 1.5, lerp(11.4, 10.6, k)), null, V3(2.4, 1.4, 7.2), null, 0, { ...LKd, fov: 48 });
      blit(); followBtn(lt / 0.4 + (lt > 0.8 ? (lt - 0.8) * 1.3 : 0), t, 340);
    } });
    cue(st, 'pop', { gain: 0.6 }); cue(st + 1.3, 'ding', { gain: 0.6 }); }

  // 13 · "In the end, Ann paid her landlady five hundred dollars," cash flies; $500
  { const st = cut(10), w5 = W('five', 10);
    add({ id: 'S16', at: st, note: 'living room, slow orbit: Ann reluctantly hands over cash, bills fly to the grinning landlady; $500 slams in', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); roomOnly(ann, land); R.setHole(1); rockIn.visible = false;
      ann.at(0.9, 0, -3.5); ann.set({ mood: 'sad', armR: [95, -10], armL: [60, -40], holdL: ROCK, v: 'r2', blink: blink(t) });
      land.at(-0.8, 0, -3.5); land.set({ mood: 'laugh', armL: [95, -10], armR: [60, -60], blink: blink(t, 1) });
      const a = lerp(0.35, -0.2, k); shoot(R.scene, [ann, land], V3(0.05 + Math.sin(a) * 4.6, 1.5, -3.5 + Math.cos(a) * 4.6), null, V3(0.05, 1.2, -3.5), null, 0, { ...LKr, fov: 48 });
      blit(); topShade(0.35); cashFly((t - st) / 1.8, 12, 680, 860, 380, 840); bigNum('$500', (t - w5) / 0.25, { y: 360, size: 210, col: '#7FD07A' });
    } });
    cue(st, 'whoosh', { gain: 0.4 }); cue(w5, 'ding', { gain: 0.7 }); }
  // 13b · "five hundred dollars," punch-in on the grinning landlady, cash raining, $500
  { const st = W('five', 10) - 0.1;
    add({ id: 'S16b', at: st, note: 'punch-in on the landlady laughing as dollar bills rain down; $500 slams in with a shake', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); roomOnly(ann, land); R.setHole(1); rockIn.visible = false;
      land.at(-0.8, 0, -3.5); land.set({ mood: 'laugh', armL: [150, -20], armR: [150, -20], blink: 0, bob: Math.sin(t * 14) * 6 });
      ann.at(0.9, 0, -3.5); ann.set({ mood: 'sad', armR: [20, 10], armL: [60, -40], holdL: ROCK, v: 'r2', blink: blink(t), tears: 1 });
      shoot(R.scene, [ann, land], V3(lerp(-0.4, -0.6, k), 1.45, lerp(-1.2, -1.6, k)).add(shake(t, st + 0.1, 0.05)), null, V3(-0.7, 1.35, -3.5), null, 0, { ...LKr, fov: 46 });
      blit(); topShade(0.35); for (let i = 0; i < 14; i++) { const q = ((t * 0.8 + rnd(i)) % 1); ctx.save(); ctx.translate(100 + rnd(i * 3) * 880, -80 + q * 1500); ctx.rotate(t * 3 + i); ctx.fillStyle = '#7FBF7A'; ctx.strokeStyle = '#2E5A2E'; ctx.lineWidth = 4; ctx.fillRect(-55, -28, 110, 56); ctx.strokeRect(-55, -28, 110, 56); ctx.restore(); }
      bigNum('$500', 1, { y: 360, size: 210, col: '#7FD07A' });
    } });
    cue(st, 'slam', { gain: 0.6 }); }
  // 14 · "just to keep" push into the rock in Ann's hands; fire glints → loops to "This rock from space"
  { const st = cut(11);
    add({ id: 'S17', at: st, note: 'loop: fast push-in on the black rock on the rug under the light shaft from the roof hole, it glows hot again; leads into the cover', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); roomOnly(); R.setHole(1); rockIn.visible = true; rockIn.fire(clamp(lt / d) * 0.45); rockIn.halo.visible = false; rockIn.scale.setScalar(1); rockIn.position.set(1.5, 0.18, -4.3); rockIn.rotation.set(0, t, 0);
      shoot(R.scene, [], V3(1.5, lerp(1.6, 0.7, k), lerp(-2.1, -3.3, k)), null, V3(1.5, 0.2, -4.3), null, 0, { ...LKr, fov: 46 });
      blit(); zoomBlur(GL(), k * 0.6, { cy: 1100 });
    } });
    cue(st, 'riser', { dur: 0.8, gain: 0.5 }); }

  return { shots: S, cues: CUES };
}
