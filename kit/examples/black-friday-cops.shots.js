// BLACK FRIDAY WAS NAMED BY ANGRY COPS (Philadelphia, 1950s-1961) — Tall Tale 3D, US audience. Generic toons, no brands.
import * as THREE from 'three';
import { ctx, clamp, lerp, eo, eio, eob, rnd } from './core/lib.js';
import { L, Le, Wd, T } from './core/timing.js';
import * as WD from './core/world.js';
import * as PR from './core/props.js';
import { Toon, PROPS, INK } from './core/toon.js';
import { V3, talk, blink, hook, ribbon, pill, stamp, calCard, chartCard, cashRain, confetti, flash, tint, speedLines, stars, mark, subscribe, makeShoot, LK } from './jh.js';

const LOOKS = {
  cop: { body: '#24365C', pattern: 'vest', patCol: '#1A2440', hat: 'mailcap', hatCol: '#1E2A48', neck: 'tie', neckCol: '#1E2A48', extra: ['mustache'] },
  cop2: { body: '#24365C', pattern: 'vest', patCol: '#1A2440', hat: 'mailcap', hatCol: '#1E2A48', neck: 'tie', neckCol: '#1E2A48' },
  boss: { body: '#7A3E5A', pattern: 'vest', patCol: '#4A2438', hat: 'none', neck: 'bowtie', neckCol: '#F2C230', extra: ['mustache', 'glasses'] },
  s1: { body: '#E8734A', hat: 'flower', hatCol: '#F2B8C6', neck: 'collar' },
  s2: { body: '#5C8FD6', hat: 'bowler', hatCol: '#3B3346', neck: 'tie', neckCol: '#D8343F' },
  s3: { body: '#F2B8C6', hat: 'bun', hatCol: '#6B4A3A', pattern: 'apron' },
  s4: { body: '#9BC46A', hat: 'boater', hatCol: '#E8C77A', extra: ['glasses'] },
  army: { body: '#4A5A3A', hat: 'beanie', hatCol: '#F2C230', pattern: 'stripes', patCol: '#3A4A2A' },
  navy: { body: '#1F3A6A', hat: 'cap', hatCol: '#F2C230', pattern: 'stripes', patCol: '#F4EFE4' },
};
const mk = (k, o) => new Toon({ ...LOOKS[k], extra: [...(LOOKS[k].extra || [])] }, o);
const whistle = (g, x, y) => { g.save(); g.translate(x, y - 20); g.strokeStyle = INK; g.lineWidth = 5; g.fillStyle = '#C9CED8'; g.beginPath(); g.roundRect(-30, -18, 50, 30, 10); g.fill(); g.stroke(); g.beginPath(); g.arc(18, 4, 16, 0, 7); g.fill(); g.stroke(); g.restore(); };
const bags = (g, x, y) => { [['#D8343F', -30], ['#F2C230', 10], ['#3C6FB6', 44]].forEach(([c, dx], i) => { g.save(); g.translate(x + dx, y + 10 - i * 6); g.strokeStyle = INK; g.lineWidth = 5; g.fillStyle = c; g.beginPath(); g.rect(-26, -10, 52, 60); g.fill(); g.stroke(); g.beginPath(); g.arc(0, -10, 14, Math.PI, 0); g.stroke(); g.restore(); }); };

// overlays
function football(x, y, k, rot) { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(k, k); ctx.fillStyle = '#8A4A26'; ctx.strokeStyle = INK; ctx.lineWidth = 8; ctx.beginPath(); ctx.ellipse(0, 0, 120, 72, 0, 0, 7); ctx.fill(); ctx.stroke();
  ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(-50, 0); ctx.lineTo(50, 0); ctx.stroke(); for (let i = -2; i <= 2; i++) { ctx.beginPath(); ctx.moveTo(i * 18, -14); ctx.lineTo(i * 18, 14); ctx.stroke(); } ctx.restore(); }
function clock(x, y, k, spin) { if (k <= 0) return; const a = eob(clamp(k)); ctx.save(); ctx.translate(x, y); ctx.scale(a, a); ctx.fillStyle = '#FFFDF4'; ctx.strokeStyle = INK; ctx.lineWidth = 12; ctx.beginPath(); ctx.arc(0, 0, 150, 0, 7); ctx.fill(); ctx.stroke();
  ctx.fillStyle = INK; for (let i = 0; i < 12; i++) { const b = i / 12 * Math.PI * 2; ctx.beginPath(); ctx.arc(Math.cos(b) * 118, Math.sin(b) * 118, 9, 0, 7); ctx.fill(); }
  ctx.lineCap = 'round'; ctx.lineWidth = 14; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.sin(spin) * 100, -Math.cos(spin) * 100); ctx.stroke(); ctx.lineWidth = 18; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.sin(spin / 12) * 64, -Math.cos(spin / 12) * 64); ctx.stroke(); ctx.restore(); }
function bigX(x, y, k) { if (k <= 0) return; const a = eob(clamp(k)); ctx.save(); ctx.translate(x, y); ctx.scale(a, a); ctx.lineCap = 'round'; ctx.strokeStyle = INK; ctx.lineWidth = 64; ctx.beginPath(); ctx.moveTo(-150, -150); ctx.lineTo(150, 150); ctx.moveTo(150, -150); ctx.lineTo(-150, 150); ctx.stroke();
  ctx.strokeStyle = '#E3262E'; ctx.lineWidth = 40; ctx.stroke(); ctx.restore(); }
function honk(x, y, k) { if (k <= 0 || k >= 1) return; ctx.save(); ctx.translate(x, y); ctx.rotate(-0.15); const s = eob(clamp(k * 3)); ctx.scale(s, s); ctx.globalAlpha = 1 - clamp((k - 0.7) / 0.3); ctx.font = '900 70px Inter'; ctx.textAlign = 'center'; ctx.lineWidth = 12; ctx.strokeStyle = INK; ctx.strokeText('HONK!', 0, 0); ctx.fillStyle = '#FFD43B'; ctx.fillText('HONK!', 0, 0); ctx.restore(); }

export function buildShots(E) {
  const S = [], CUES = [], add = (o) => (S.push(o), o), cue = (t, type, o = {}) => CUES.push({ t: +Math.max(0, t).toFixed(3), type, ...o });
  const cut = (i) => (i === 0 ? 0 : L(i) - 0.06);
  const { shoot } = makeShoot(E);
  const shake = (t, t0, a = 0.08) => { const k = t - t0; if (k < 0 || k > 0.35) return V3(0, 0, 0); const f = (1 - k / 0.35) * a; return V3(Math.sin(k * 90) * f, Math.cos(k * 70) * f, 0); };

  // ── STREET (downtown, 1950s) ──
  const SHOPS = [['DEPT STORE', '#C9603F', 'brick', '#D8343F'], ['TOYS', '#E3C16F', 'wood', '#3C6FB6'], ['SHOES', '#D9A34A', 'wood', null], ['GRAND HOTEL', '#9E4A3A', 'brick', null], ['FIVE & DIME', '#6FA3B8', 'wood', '#D8343F'],
    ['CAFE', '#E58A6A', 'wood', '#2E4E3F'], ['BANK', '#C7B79A', 'brick', null], ['RADIO SHOP', '#7FA36A', 'wood', null], ['TAILOR', '#B98ACF', 'wood', '#2E4E3F'], ['THEATER', '#A3485A', 'brick', '#F2C230']];
  const ST = WD.mainStreet(E, { shops: SHOPS, cars: false, people: true });
  const DS = ST.buildings.find((b) => b.name === 'DEPT STORE' && b.side > 0);   // right side, x +6.2 front
  ST.sun.key.target.position.set(1, 0, -4); ST.sun.key.position.set(9, 13, 6);
  const cop = mk('cop'), cop2 = mk('cop2'), boss = mk('boss');
  const shop = ['s1', 's2', 's3', 's4', 's1', 's2'].map((k) => mk(k, { res: 1 })); const fans = ['army', 'navy', 'army', 'navy'].map((k) => mk(k, { res: 1 }));
  const cast = [cop, cop2, boss, ...shop, ...fans]; cast.forEach((p) => ST.scene.add(p.group));
  const all = () => [...ST.people, ...cast];
  const only = (...keep) => cast.forEach((p) => (p.group.visible = keep.includes(p)));
  const cars = [['#2C3A4A', 2.2, -9], ['#7A2E2E', -2.2, -10], ['#2E5A44', 2.2, -14.5], ['#D9A34A', -2.2, -15.5], ['#3C6FB6', 2.2, -20], ['#E8E2D0', -2.2, -21], ['#7A2E2E', 2.2, -25.5], ['#2C3A4A', -2.2, -26.5]]
    .map(([c, x, z]) => { const v = WD.car(c); v.position.set(x, 0, z); v.userData.z0 = z; if (x < 0) v.rotation.y = Math.PI; ST.scene.add(v); return v; });
  const jam = (t, crawl = 0.3) => cars.forEach((v, i) => { v.position.z = v.userData.z0 + Math.sin(t * 2 + i) * 0.06 + (v.position.x > 0 ? 1 : -1) * crawl * Math.max(0, Math.sin(t * 1.3 + i)); v.position.y = Math.abs(Math.sin(t * 17 + i * 3)) * 0.02; });
  const banner = PR.poster(['BIG FRIDAY!'], { w: 3.4, h: 0.9, bg: '#F2C230', fg: '#1F1C33' }); banner.rotation.y = -Math.PI / 2; ST.scene.add(banner);
  const BX = DS.x - 0.08, BZ = DS.z; banner.position.set(BX, 3.6, BZ); banner.visible = false;
  // crowd placement helpers (boardwalk on the store side is x 4..6, y 0.18)
  const crowdRun = (t, k0, dir = 1) => shop.forEach((p, i) => { p.group.visible = true; const ph = (k0 + i * 0.17) % 1; p.at(lerp(-3.4, 3.6, (i % 3) / 2) + Math.sin(i) * 0.3, 0, lerp(-1, -11, ph)); p.set({ mood: i % 2 ? 'happy' : 'smug', legs: 'run', phase: t * 11 + i, armL: [70, -50], holdL: i % 2 ? bags : PROPS.purse, armR: [40, -20], v: 'b' + i, lean: 8 }); });

  // ═══ SHOTS ═══
  // 1a · frame 0: angry cop in a jammed street blowing a whistle, hand up; hook NAMED BY COPS?!
  { const st = 0, wn = Wd('named', 0);
    add({ id: 'S01a', at: st, note: 'frame 0: low angle, a red-faced cop toon in the middle of a jammed 1950s street, hand up, whistle; cars and shoppers behind; hook NAMED BY COPS?!', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); only(cop, ...shop.slice(0, 3)); jam(t);
      shop.slice(0, 3).forEach((p, i) => { p.at([-3.0, 3.2, -1.2][i], 0, [-6, -7.5, -12][i]); p.set({ mood: 'shock', legs: 'run', phase: t * 11 + i, armL: [70, -50], holdL: bags, armR: [40, -20], v: 'f' + i }); });
      cop.at(0, 0, -3.2); cop.set({ mood: 'angry', sweat: 1, armR: [150, 0], armL: [80, -110], holdL: whistle, v: 'w', bob: Math.sin(t * 14) * 3, blink: 0 });
      shoot(ST.scene, all(), V3(0.4, 0.8, 0.6), V3(0.2, 0.9, 0.0), V3(0, 1.4, -3.4), null, k, { ...LK.day, fov: 54 });
      blit(); hook(['NAMED BY', 'COPS?!'], 1, { y: 300, size: 140, hiLine: 1 }); tint(0.35 + Math.sin(t * 8) * 0.1, '#D8343F');
    } });
    cue(0, 'alarm', { dur: 0.6, gain: 0.35 }); cue(wn, 'pop', { gain: 0.5 }); }
  // 1b · "by angry cops." push in on the angry face, BLACK FRIDAY stamp in black
  { const st = Wd('by', 0) - 0.12, wc = Wd('cops', 0);
    add({ id: 'S01b', at: st, note: 'punch-in on the cop\'s furious face (steam, sweat); a second cop steps in, also angry; black stamp BLACK FRIDAY slams', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); only(cop, cop2); jam(t);
      cop.at(0, 0, -3.2); cop.set({ mood: 'angry', sweat: 1, armL: [150, 10], armR: [150, 10], bob: Math.sin(t * 14) * 3 });
      cop2.at(1.3, 0, -4.4); cop2.set({ mood: 'angry', armL: [60, -110], armR: [20, 10], legs: 'walk', phase: t * 8 });
      shoot(ST.scene, all(), V3(0.6, 1.5, 0.4).add(shake(t, wc)), V3(0.4, 1.55, -0.8), V3(0.3, 1.5, -3.6), null, k, { ...LK.day, fov: 50 }, undefined, lerp(0, -0.08, k));
      blit(); stamp(['BLACK', 'FRIDAY'], (t - wc) / 0.2, { y: 420, size: 100, col: '#111111' });
    } });
    cue(wc, 'stamp', { gain: 0.9 }); }

  // 2 · "Not by stores." the store owner in front of the DEPT STORE shakes his head; big red X
  { const st = cut(1), wn = Wd('stores', 1);
    add({ id: 'S02', at: st, note: 'the store owner toon on the boardwalk in front of the DEPT STORE shrugs, smug; big red X slams over him', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); only(boss); jam(t);
      boss.at(DS.x - 1.1, 0.18, DS.z); boss.set({ mood: 'smug', armL: [100, 60], armR: [100, 60], look: [-0.4, 0], talk: talk(t), blink: blink(t) });
      shoot(ST.scene, all(), V3(0.2, 1.6, DS.z + 3.6), V3(1.0, 1.5, DS.z + 2.6), V3(DS.x - 1.1, 1.4, DS.z), null, k, { ...LK.day, fov: 50 });
      blit(); bigX(540, 640, (t - wn) / 0.25);
    } });
    cue(st, 'whoosh', { gain: 0.6 }); cue(wn, 'thud', { gain: 0.8 }); }

  // 3a · "In the nineteen fifties," crane down the whole street; calendar 1950s slams
  { const st = cut(2), wy = Wd('nineteen', 2);
    add({ id: 'S03a', at: st, note: 'crane down over the busy downtown street, bunting, cars; calendar card 1950s slams in', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); only(); jam(t);
      shoot(ST.scene, all(), V3(0, 11, 6).add(shake(t, wy + 0.15)), V3(0, 4.0, 3.5), V3(0, 1, -24), V3(0, 2, -20), k, { ...LK.day, fov: 54 });
      blit(); calCard('THE', '1950s', 540, 470, eob(clamp((t - wy) / 0.25)), -0.06); if (lt < 0.2) flash(1 - lt / 0.2, '#F4E3C0');
    } });
    cue(st, 'slide', { dur: 0.6, gain: 0.6 }); cue(wy + 0.15, 'slam', { gain: 0.7 }); }
  // 3b · "in Philadelphia," pan along the shop fronts; pill PHILADELPHIA, PA
  { const st = Wd('philadelphia', 2) - 0.35, wp = Wd('philadelphia', 2);
    add({ id: 'S03b', at: st, note: 'side pan along the shop fronts (TOYS, SHOES, GRAND HOTEL) with shoppers on the boardwalk; pill PHILADELPHIA, PA', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); only(...shop.slice(0, 4)); jam(t);
      shop.slice(0, 4).forEach((p, i) => { p.at(4.8 + (i % 2) * 0.6, 0.18, -2 - i * 2.4 + (lt * 1.2)); p.set({ mood: 'happy', legs: 'walk', phase: t * 8 + i, armL: [50, -30], holdL: bags, armR: [20, 10], v: 'p' + i }); });
      shoot(ST.scene, all(), V3(0.5, 1.8, lerp(3, -2, k)), V3(0.5, 1.8, lerp(3, -2, k)), V3(6.2, 2.4, lerp(-2, -7, k)), null, 0, { ...LK.day, fov: 52 });
      blit(); pill('PHILADELPHIA, PA', (t - wp) / 0.25, 300, 'rgba(31,28,51,0.9)', 62);
    } });
    cue(wp, 'ding', { gain: 0.5 }); }

  // 4a · "the day after Thanksgiving" the cop, stuffed and sleepy, pats his belly; ribbon DAY AFTER THANKSGIVING
  { const st = cut(3), wt = Wd('thanksgiving', 3);
    add({ id: 'S04a', at: st, note: 'the cop toon yawns on the empty corner, tired and full; gold ribbon THE DAY AFTER THANKSGIVING', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); only(cop); jam(t, 0);
      cop.at(-3.2, 0, -5.0); cop.set({ mood: 'tired', armL: [40, -100], armR: [40, -100], bob: Math.sin(t * 3) * 4, blink: lt > 0.5 ? 1 : 0 });
      shoot(ST.scene, all(), V3(-1.2, 1.5, -1.6), V3(-1.8, 1.5, -2.2), V3(-3.2, 1.3, -5.0), null, k, { ...LK.day, fov: 48 });
      blit(); ribbon('DAY AFTER THANKSGIVING', (t - wt + 0.1) / 0.3, 330, 60);
    } });
    cue(wt, 'stamp', { gain: 0.6 }); }
  // 4b · "was total chaos." the crowd stampedes past, Dutch tilt, shake, stamp CHAOS!
  { const st = Wd('was', 3) - 0.12, wc = Wd('chaos', 3);
    add({ id: 'S04b', at: st, note: 'the cop spins as a stampede of shoppers runs past him; Dutch tilt + shake; stamp CHAOS!', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); only(cop, ...shop); jam(t, 0.6); crowdRun(t, lt * 0.8);
      cop.at(-3.2, 0, -5.0); cop.set({ mood: 'shock', sweat: 1, armL: [150, 10], armR: [150, 10], legs: 'jump' });
      shoot(ST.scene, all(), V3(-0.6, 1.4, 0.4).add(shake(t, wc, 0.12)), V3(-1.2, 1.5, -0.4), V3(-1.6, 1.2, -6.0), null, k, { ...LK.day, fov: 56 }, undefined, lerp(0.05, 0.16, k));
      blit(); speedLines(0.5, 2); stamp(['CHAOS!'], (t - wc) / 0.2, { y: 400, size: 110 });
    } });
    cue(st, 'whoosh', { gain: 0.8 }); cue(wc, 'slam', { gain: 0.9 }); }

  // 5a · "Shoppers flooded" low angle: shoppers charge at the camera with bags
  { const st = cut(4), wf = Wd('flooded', 4);
    add({ id: 'S05a', at: st, note: 'ground-level: a wave of shopper toons charges toward camera with shopping bags, speed lines', draw(lt, d, t, blit) {
      const k = clamp(lt / d); only(...shop); jam(t);
      shop.forEach((p, i) => { p.at(lerp(-2.6, 2.6, (i % 3) / 2) + (i > 2 ? 0.55 : 0), 0, lerp(-9, -4.2, k) - (i > 2 ? 1.6 : 0) - (i % 3) * 0.5); p.set({ mood: i % 2 ? 'laugh' : 'smug', legs: 'run', phase: t * 12 + i, armL: [70, -50], holdL: bags, armR: [140, 0], v: 'r' + i, lean: -8 }); });
      shoot(ST.scene, all(), V3(0, 0.5, 0.2), V3(0, 0.6, -0.4), V3(0, 1.5, -6), null, eio(k), { ...LK.day, fov: 58 });
      blit(); speedLines(0.7, 5);
    } });
    cue(st, 'whoosh', { gain: 0.7 }); cue(wf, 'bubbles', { dur: 0.6, gain: 0.25 }); }
  // 5b · "downtown," overhead: the DEPT STORE door swamped by the crowd
  { const st = Wd('downtown', 4) - 0.12;
    add({ id: 'S05b', at: st, note: 'high angle on the DEPT STORE door: shoppers squeeze in, the store owner beams with arms open', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); only(boss, ...shop); jam(t);
      boss.at(DS.x - 0.9, 0.18, DS.z + 2.2); boss.set({ mood: 'laugh', armL: [150, 10], armR: [150, 10], blink: blink(t) });
      shop.forEach((p, i) => { p.at(lerp(2.8, 4.9, ((lt * 0.9 + i * 0.13) % 1)), i > 2 ? 0 : 0, DS.z - 1.6 + (i % 3) * 1.2 - (i > 2 ? 0.55 : 0)); p.set({ mood: 'happy', legs: 'walk', phase: t * 10 + i, armL: [70, -50], holdL: bags, armR: [20, 10], v: 'd' + i }); });
      shoot(ST.scene, all(), V3(-1.2, 6.5, DS.z + 6), V3(-0.6, 5.5, DS.z + 5), V3(4.4, 0.8, DS.z), null, k, { ...LK.day, fov: 54 });
      blit(); pill('DOWNTOWN', (lt - 0.15) / 0.25, 300, 'rgba(31,28,51,0.9)', 60);
    } });
    cue(st, 'pop', { gain: 0.5 }); }

  // 6a · "and football fans poured in" Army and Navy fans jump with pennant signs
  { const st = cut(5), wf = Wd('football', 5);
    add({ id: 'S06a', at: st, note: 'fans in green and navy stripes pour down the street jumping with ARMY / NAVY signs; a football spins across', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); only(...fans); jam(t);
      fans.forEach((p, i) => { p.at(lerp(-2.5, 2.5, i / 3), 0, lerp(-9, -7, k) - (i % 2) * 1.2); p.set({ mood: 'laugh', legs: Math.sin(t * 10 + i * 1.7) > 0 ? 'jump' : 'run', phase: t * 11, armR: [150, 0], holdR: PROPS.sign(i % 2 ? 'NAVY!' : 'ARMY!', i % 2 ? '#BFD4F2' : '#E8E2A0'), armL: [150, 10], v: 'fan' + i }); });
      shoot(ST.scene, all(), V3(-1.0, 1.2, -2.0), V3(0.8, 1.3, -2.4), V3(0, 1.4, -8), null, k, { ...LK.day, fov: 56 });
      blit(); const fk = clamp((t - wf) / 1.0); if (fk > 0 && fk < 1) football(lerp(-150, 1230, fk), 620 - Math.sin(fk * Math.PI) * 260, 0.9, fk * 9);
    } });
    cue(wf, 'whoosh', { gain: 0.6 }); }
  // 6b · "for the Army-Navy game." ribbon ARMY-NAVY GAME, fans cheer, confetti
  { const st = Wd('army', 5) - 0.2, wg = Wd('game', 5);
    add({ id: 'S06b', at: st, note: 'close on two fans (Army, Navy) shouting at each other playfully, confetti; gold ribbon ARMY-NAVY GAME', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); only(fans[0], fans[1]); jam(t);
      fans[0].at(-0.8, 0, -6.4); fans[0].set({ mood: 'laugh', armR: [150, 0], holdR: PROPS.sign('ARMY!', '#E8E2A0'), armL: [100, -30], talk: talk(t), v: 'a', lean: 8 });
      fans[1].at(0.6, 0, -6.6); fans[1].set({ mood: 'smug', armL: [150, 0], holdL: PROPS.sign('NAVY!', '#BFD4F2'), armR: [100, -30], talk: talk(t + 0.5), v: 'n', lean: -8 });
      shoot(ST.scene, all(), V3(0.6, 1.3, -2.6), V3(-0.4, 1.4, -3.0), V3(-0.1, 1.3, -6.5), null, k, { ...LK.day, fov: 48 });
      blit(); ribbon('ARMY-NAVY GAME', (t - wg + 0.3) / 0.3, 330, 76); confetti(t, wg - 0.2, 50);
    } });
    cue(wg, 'sparkle', { gain: 0.6 }); }

  // 7 · "Police couldn't take the day off," calendar DAY OFF crossed out, cop sad
  { const st = cut(6), wo = Wd('off', 6);
    add({ id: 'S07', at: st, note: 'push-in on the cop, sad and droopy; a calendar card DAY OFF gets a big red X on "off"', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); only(cop, cop2); jam(t);
      cop.at(-0.6, 0, -4.0); cop.set({ mood: 'sad', armL: [20, 10], armR: [20, 10], look: [0, 0.5], blink: blink(t) });
      cop2.at(0.8, 0, -4.6); cop2.set({ mood: 'sad', tears: 1, armL: [20, 10], armR: [60, -60] });
      shoot(ST.scene, all(), V3(0.4, 1.9, 1.2), V3(0.1, 1.7, 0.4), V3(0.1, 1.3, -4.3), null, k, { ...LK.day, fov: 50 });
      blit(); calCard('FRIDAY', 'OFF', 540, 470, eob(clamp((t - st - 0.1) / 0.25)), 0.05, '#3C6FB6'); bigX(540, 500, (t - wo) / 0.25);
    } });
    cue(st + 0.1, 'pop', { gain: 0.5 }); cue(wo, 'thud', { gain: 0.8 }); }

  // 8a · "and worked extra-long shifts" clock hands spin, the cop directs traffic, sweating
  { const st = cut(7), we = Wd('extra', 7);
    add({ id: 'S08a', at: st, note: 'the cop directs traffic in the middle of the road, arms swinging, sweating; a big clock pops up and its hands spin fast; pill EXTRA-LONG SHIFTS', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); only(cop); jam(t, 0.5);
      cop.at(0, 0, -5.2); cop.set({ mood: 'tired', sweat: 1, armL: [lerp(30, 150, (Math.sin(t * 7) + 1) / 2), 0], armR: [lerp(150, 30, (Math.sin(t * 7) + 1) / 2), 0], blink: blink(t) });
      shoot(ST.scene, all(), V3(-2.2, 2.2, 0.2), V3(-1.4, 1.9, -0.8), V3(0, 1.2, -6), null, k, { ...LK.day, fov: 52 }, undefined, lerp(0, 0.06, k));
      blit(); clock(540, 470, (t - we + 0.2) / 0.3, (t - we) * 14); pill('EXTRA-LONG SHIFTS', (t - we - 0.3) / 0.25, 720, 'rgba(31,28,51,0.9)', 56);
    } });
    cue(we, 'tock', { gain: 0.6 }); cue(we + 0.25, 'tock', { gain: 0.5 }); cue(we + 0.5, 'tock', { gain: 0.5 }); }
  // 8b · "in the traffic jams." top-down crane over the jam; HONK! bubbles
  { const st = Wd('traffic', 7) - 0.15, wj = Wd('jams', 7);
    add({ id: 'S08b', at: st, note: 'crane up over the gridlocked cars with the tiny cop in the middle; HONK! bubbles pop', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); only(cop); jam(t, 0.5);
      cop.at(0, 0, -11.8); cop.set({ mood: 'angry', sweat: 1, armL: [150, 10], armR: [150, 10], legs: Math.sin(t * 8) > 0 ? 'jump' : 'stand' });
      shoot(ST.scene, all(), V3(-3.0, 4.0, -4.5), V3(-2.0, 8.5, -5.5), V3(0, 0, -13), V3(0, 0, -15), k, { ...LK.day, fov: 54 });
      blit(); honk(300, 520, (t - st - 0.1) / 0.8); honk(780, 700, (t - wj) / 0.8); honk(560, 360, (t - st - 0.6) / 0.8);
    } });
    cue(st + 0.1, 'boing', { gain: 0.4 }); cue(wj, 'boing', { gain: 0.5 }); }

  // 9 · "So they called it Black Friday." the cops grumble; screen darkens, big BLACK FRIDAY slam
  { const st = cut(8), wb = Wd('black', 8);
    add({ id: 'S09', at: st, note: 'two cops lean in and grumble; the light drops to dark and BLACK FRIDAY slams in white on a black stamp', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); only(cop, cop2); jam(t);
      cop.at(-0.6, 0, -4.2); cop.set({ mood: 'angry', armL: [60, -80], armR: [20, 10], talk: talk(t), lean: 10 });
      cop2.at(0.6, 0, -4.4); cop2.set({ mood: 'sly', armR: [60, -80], armL: [20, 10], talk: talk(t + 0.3), lean: -10 });
      shoot(ST.scene, all(), V3(0, 1.4, -0.6).add(shake(t, wb)), V3(0, 1.5, -1.4), V3(0, 1.4, -4.3), null, k, { ...LK.day, fov: 48 });
      blit(); const dk = clamp((t - wb + 0.2) / 0.3); if (dk > 0) { ctx.save(); ctx.globalAlpha = dk * 0.35; ctx.fillStyle = '#000'; ctx.fillRect(0, 0, 1080, 1920); ctx.restore(); }
      stamp(['BLACK FRIDAY'], (t - wb) / 0.2, { y: 440, size: 100, col: '#FFFFFF', fill: 'rgba(10,10,14,0.95)' });
    } });
    cue(wb, 'slam', { gain: 1.0 }); }

  // 10 · "Subscribe for more weird history." the cop points at the viewer, subscribe button
  { const st = cut(9);
    add({ id: 'S10', at: st, note: 'the cop toon on the corner points at the viewer, then blows the whistle; SUBSCRIBE button pressed', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); only(cop); jam(t);
      cop.at(-0.4, 0, -4.6); cop.set({ mood: lt > 1.1 ? 'happy' : 'sly', armR: [95, 0], armL: lt > 1.1 ? [80, -110] : [20, 10], holdL: lt > 1.1 ? whistle : null, v: lt > 1.1 ? 'w' : 'n', talk: talk(t), blink: blink(t) });
      shoot(ST.scene, all(), V3(1.0, 1.4, -1.0), V3(0.2, 1.5, -1.8), V3(-0.4, 1.35, -4.6), null, k, { ...LK.day, fov: 46 });
      blit(); subscribe(lt / 0.45 + (lt > 0.8 ? (lt - 0.8) * 1.4 : 0), t, 330);
    } });
    cue(st, 'pop', { gain: 0.6 }); cue(st + 1.25, 'ding', { gain: 0.6 }); }

  // 11a · "Stores hated that name," the store owner tears up a BLACK FRIDAY newspaper, angry
  { const st = cut(10), wh = Wd('hated', 10);
    add({ id: 'S11a', at: st, note: 'the store owner on his boardwalk reads a newspaper BLACK FRIDAY, turns red and shakes it; angry steam marks', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); only(boss); jam(t);
      boss.at(DS.x - 1.1, 0.18, DS.z); boss.set({ mood: t > wh ? 'angry' : 'worried', armR: [120, -40], holdR: PROPS.paper('BLACK FRIDAY'), v: 'np', armL: [120, -40], bob: t > wh ? Math.sin(t * 20) * 4 : 0, sweat: t > wh ? 1 : 0 });
      shoot(ST.scene, all(), V3(2.4, 1.5, DS.z + 2.6), V3(2.8, 1.6, DS.z + 1.6), V3(DS.x - 1.1, 1.5, DS.z), null, k, { ...LK.day, fov: 50 }, undefined, lerp(0, -0.1, k));
      blit(); tint(clamp((t - wh) / 0.3) * 0.6); mark('!', 760, 360, (t - wh) / 0.25, '#E3262E');
    } });
    cue(wh, 'thud', { gain: 0.7 }); }
  // 11b · "and in nineteen sixty-one," calendar 1961
  { const st = Wd('nineteen', 10) - 0.25, wy = Wd('nineteen', 10);
    add({ id: 'S11b', at: st, note: 'wide on the DEPT STORE: workers roll out a banner; calendar card 1961 slams', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); only(boss); jam(t); banner.visible = false;
      boss.at(DS.x - 1.2, 0.18, DS.z + 1.6); boss.set({ mood: 'sly', armL: [20, 10], armR: [140, -10], blink: blink(t) });
      shoot(ST.scene, all(), V3(-1.0, 1.8, DS.z + 5.5), V3(-0.6, 2.2, DS.z + 4.6), V3(DS.x - 0.6, 2.4, DS.z), null, k, { ...LK.day, fov: 54 });
      blit(); calCard('THE YEAR', '1961', 540, 430, eob(clamp((t - wy) / 0.25)), 0.06);
    } });
    cue(wy, 'slam', { gain: 0.7 }); }
  // 11c · "tried Big Friday." the BIG FRIDAY banner drops onto the store; the owner poses proudly, confetti
  { const st = Wd('tried', 10) - 0.12, wb = Wd('big', 10);
    add({ id: 'S11c', at: st, note: 'a yellow BIG FRIDAY! banner drops onto the store front; the owner throws his arms up proudly; confetti', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); only(boss); jam(t); banner.visible = true; banner.position.y = lerp(7, 3.6, eob(clamp((t - wb + 0.1) / 0.35)));
      boss.at(DS.x - 1.2, 0.18, DS.z + 1.6); boss.set({ mood: 'proud', armL: [150, 10], armR: [150, 10], blink: blink(t) });
      shoot(ST.scene, all(), V3(-0.6, 2.2, DS.z + 4.6), V3(0.0, 2.0, DS.z + 4.2), V3(DS.x - 0.6, 2.6, DS.z), null, k, { ...LK.day, fov: 52 });
      blit(); confetti(t, wb, 40); ribbon('BIG FRIDAY!', (t - wb) / 0.3, 330, 96);
    } });
    cue(wb, 'boing', { gain: 0.7 }); cue(wb + 0.1, 'sparkle', { gain: 0.5 }); }

  // 12 · "It flopped." the banner falls off and bonks him; FLOP stamp
  { const st = cut(11), wf = Wd('flopped', 11);
    add({ id: 'S12', at: st, note: 'the BIG FRIDAY banner tips and drops onto the owner; he goes dizzy; red stamp FLOP!', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); only(boss); jam(t); banner.visible = true; const f = clamp((t - wf) / 0.35); banner.position.y = lerp(3.6, 1.0, f * f); banner.rotation.x = f * 0.5;
      boss.at(DS.x - 1.2, 0.18, DS.z + 1.6); boss.set({ mood: f > 0.8 ? 'dizzy' : 'shock', armL: [150, 10], armR: [150, 10], squash: f > 0.9 ? 0.2 : 0 });
      shoot(ST.scene, all(), V3(0.4, 1.6, DS.z + 4.2).add(shake(t, wf + 0.35)), V3(0.8, 1.5, DS.z + 3.8), V3(DS.x - 1.0, 1.6, DS.z + 1.0), null, k, { ...LK.day, fov: 52 });
      banner.rotation.x = 0; blit(); stamp(['FLOP!'], (t - wf - 0.3) / 0.2, { y: 420, size: 120 }); stars(540, 760, (t - wf - 0.35) / 0.8);
    } });
    cue(wf + 0.35, 'thud', { gain: 0.9 }); }

  // 13a · "Years later, stores spun a happier story" the owner smugly shows a rising chart IN THE BLACK
  { const st = cut(12), wh = Wd('happier', 12);
    add({ id: 'S13a', at: st, note: 'years later: the owner (now smug) stands by his store; a chart card draws a line that goes from red to black/green: IN THE BLACK', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); only(boss); jam(t); banner.visible = false;
      boss.at(DS.x - 1.1, 0.18, DS.z - 1.8); boss.set({ mood: 'smug', armR: [95, 0], armL: [20, 10], talk: talk(t), blink: blink(t) });
      shoot(ST.scene, all(), V3(1.6, 1.4, DS.z + 0.6), V3(2.2, 1.5, DS.z - 0.2), V3(DS.x - 1.1, 1.3, DS.z - 1.8), null, k, { ...LK.day, fov: 52 });
      blit(); chartCard([[0, 0.35], [0.25, 0.2], [0.5, 0.15], [0.75, 0.55], [1, 0.95]], (t - wh + 0.4) / 1.0, { y: 520, w: 760, h: 480, title: 'STORE PROFITS', labels: [[2, 'RED', '#E3262E'], [4, 'BLACK!', '#FFFFFF']] });
    } });
    cue(wh, 'zip', { gain: 0.5 }); }
  // 13b · "about profits," cash rain, the owner laughs; pill IN THE BLACK = PROFIT
  { const st = Wd('about', 12) - 0.12, wp = Wd('profits', 12);
    add({ id: 'S13b', at: st, note: 'low angle: the owner laughs under falling cash; pill "IN THE BLACK" = PROFIT', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); only(boss); jam(t);
      boss.at(DS.x - 1.1, 0.18, DS.z - 1.8); boss.set({ mood: 'laugh', armL: [150, 10], armR: [150, 10], holdR: PROPS.stack, v: 's', bob: Math.abs(Math.sin(t * 9)) * 5 });
      shoot(ST.scene, all(), V3(3.0, 0.8, DS.z + 0.2), V3(3.2, 0.7, DS.z - 0.4), V3(DS.x - 1.1, 1.7, DS.z - 1.8), null, k, { ...LK.day, fov: 52 });
      blit(); cashRain(t, st, 22); pill('"IN THE BLACK" = PROFIT', (t - wp) / 0.25, 300, 'rgba(31,28,51,0.9)', 50);
    } });
    cue(st, 'ding', { gain: 0.6 }); }

  // 14 · "but the truth is:" back to frame 0 (loop): the angry cop, hook returns
  { const st = cut(13);
    add({ id: 'S14', at: st, note: 'loop: back to the angry cop in the jammed street; hook NAMED BY COPS?! returns', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); only(cop, ...shop.slice(0, 3)); jam(t);
      shop.slice(0, 3).forEach((p, i) => { p.at([-3.0, 3.2, -1.2][i], 0, [-6, -7.5, -12][i]); p.set({ mood: 'shock', legs: 'run', phase: t * 11 + i, armL: [70, -50], holdL: bags, armR: [40, -20], v: 'f' + i }); });
      cop.at(0, 0, -3.2); cop.set({ mood: 'angry', sweat: 1, armR: [150, 0], armL: [80, -110], holdL: whistle, v: 'w', bob: Math.sin(t * 14) * 3, blink: 0 });
      shoot(ST.scene, all(), V3(0.8, 1.0, 1.8), V3(0.4, 0.8, 0.6), V3(0, 1.4, -3.4), null, k, { ...LK.day, fov: 54 });
      blit(); hook(['NAMED BY', 'COPS?!'], (lt - 0.15) / 0.35, { y: 300, size: 140, hiLine: 1 }); tint(clamp(lt / 0.4) * (0.35 + Math.sin(t * 8) * 0.1), '#D8343F');
    } });
    cue(st, 'whoosh', { gain: 0.5 }); cue(st + 0.3, 'alarm', { dur: 0.5, gain: 0.3 }); }

  return { shots: S, cues: CUES };
}
