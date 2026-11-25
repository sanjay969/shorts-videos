// NVIDIA GAINED $1 TRILLION IN ONE DAY — shot list (Tall Tale 3D). Same generic CEO toon as the other two videos.
import * as THREE from 'three';
import { ctx, clamp, lerp, eo, eio, eob } from './core/lib.js';
import { L, Le, Wd, T } from './core/timing.js';
import * as WD from './core/world.js';
import * as PR from './core/props.js';
import { PROPS } from './core/toon.js';
import { V3, mix, talk, blink, person, P2, hook, ribbon, pill, stamp, calCard, counter, cashRain, confetti, flash, tint, speedLines, stars, mark, subscribe, chartCard, makeShoot, LK, boardroom, street, coaster, drawPrice } from './jh.js';

const PRICE = [[0, 0.72], [0.1, 0.76], [0.2, 0.66], [0.3, 0.6], [0.4, 0.5], [0.5, 0.44], [0.6, 0.38], [0.7, 0.34], [0.78, 0.36], [0.88, 0.8], [1, 0.92]];

export function buildShots(E) {
  const S = [], CUES = [], add = (o) => (S.push(o), o), cue = (t, type, o = {}) => CUES.push({ t: +Math.max(0, t).toFixed(3), type, ...o });
  const cut = (i) => (i === 0 ? 0 : L(i) - 0.06);
  const { shoot } = makeShoot(E);
  const shake = (t, t0, a = 0.08) => { const k = t - t0; if (k < 0 || k > 0.35) return V3(0, 0, 0); const f = (1 - k / 0.35) * a; return V3(Math.sin(k * 90) * f, Math.cos(k * 70) * f, 0); };

  // ── COASTER meadow + money stacks ──
  const CO = coaster(E, PRICE); const rider = person('ceo'), trader = person('trader'); CO.scene.add(rider.group, trader.group);
  const ride = (who, u) => { const p = CO.curve.getPointAt(clamp(u)), q = CO.curve.getPointAt(clamp(u + 0.01)); CO.cart.position.set(p.x, p.y + 0.24, p.z); CO.cart.rotation.z = Math.atan2(q.y - p.y, q.x - p.x); who.at(p.x, p.y + 0.3, p.z + 0.05); return p; };
  const stacks = [[-3.2, 2.0], [-1.6, 3.4], [1.4, 3.0], [3.0, 1.6], [0, 1.2]].map(([x, z]) => { const s = PR.moneyStack(40); s.position.set(x, 0, z); s.set(0); CO.scene.add(s); return s; });
  const setStacks = (n) => stacks.forEach((s, i) => s.set(n * [0.8, 1, 0.9, 0.7, 1.1][i]));

  // ── STREET ──
  const SHOPS = [['CAFE', '#E58A6A', 'wood', '#2E4E3F'], ['TECH HQ', '#3A4A5E', 'brick', '#4FB36A'], ['NEWS', '#F2D37A', 'wood', '#D8343F'], ['BANK', '#C7B79A', 'brick', null], ['STOCK EXCHANGE', '#E9E2D0', 'brick', '#3C6FB6'],
    ['DINER', '#C9603F', 'wood', '#D8343F'], ['BOOKS', '#7FA36A', 'wood', null], ['PIZZA', '#D9A34A', 'brick', '#3C6FB6']];
  const ST = street(E, SHOPS); const HQ = ST.buildings.find((b) => b.name === 'TECH HQ'); const HZ = HQ.z;
  ST.people.forEach((p) => { if (Math.abs(p.group.position.z - HZ) < 12) p.group.visible = false; });
  ST.sun.key.target.position.set(-2, 0, HZ + 2); ST.sun.key.position.set(5, 12, HZ + 8);
  const sCeo = person('ceo'); ST.scene.add(sCeo.group); const stPeople = () => [...ST.people, sCeo];

  // ── BOARDROOM ──
  const BR = boardroom(E);
  const chair = person('chair'), mem = ['m1', 'm2', 'm3'].map((k) => person(k)); const bCeo = person('ceo');
  [chair, ...mem, bCeo].forEach((p) => BR.scene.add(p.group));
  const brPeople = [chair, ...mem, bCeo];
  const seatMem = () => mem.forEach((p, i) => p.at([-1.9, 0.6, 1.8][i], 0, -5.45));
  const scr = (k) => BR.screen.draw((g, w, h) => drawPrice(g, w, h, PRICE, k, 'NVDA', ''));

  // ═══ SHOTS ═══
  // 1a · frame 0: the CEO toon at the top of a giant green price-line rollercoaster, cash raining; hook +$1 TRILLION?
  { const st = 0, wt = Wd('trillion', 0);
    add({ id: 'S01a', at: st, note: 'frame 0: CEO toon in a cart cresting the giant green price line, cash rain; hook +$1 TRILLION?', draw(lt, d, t, blit) {
      const k = clamp(lt / d); CO.draw(1); setStacks(0); trader.group.visible = false; rider.group.visible = true; CO.cart.visible = true;
      const p = ride(rider, lerp(0.9, 0.96, k)); rider.set({ mood: 'laugh', legs: 'sit', armL: [160, -10], armR: [160, -10], blink: 0 });
      shoot(CO.scene, [rider], V3(p.x - 2.2, p.y + 0.2, p.z + 4.6), V3(p.x - 1.6, p.y + 0.5, p.z + 3.6), V3(p.x, p.y + 1.0, p.z), null, eo(k), { ...LK.day, fov: 48 });
      blit(); cashRain(t, -1.2, 24); hook(['+$1', 'TRILLION?'], 1, { y: 330, hiLine: 1 });
    } });
    cue(0, 'sparkle', { gain: 0.5 }); cue(wt, 'stamp', { gain: 0.6 }); }
  // 1b · "dollars in one day." money stacks shoot up out of the grass, counter
  { const st = Wd('dollars', 0) - 0.12, wd = Wd('day', 0);
    add({ id: 'S01b', at: st, note: 'low angle in the meadow: five money stacks shoot up to the sky; ONE DAY calendar card', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); CO.draw(1); rider.group.visible = false; trader.group.visible = false; CO.cart.visible = false;
      setStacks(eo(clamp(lt / (d * 0.8))) * 38);
      shoot(CO.scene, [], V3(0, 0.5, 9), V3(0, 1.2, 8.0), V3(0, 2.5, 2), V3(0, 5.0, 2), k, { ...LK.day, fov: 56 });
      blit(); calCard('ONE', 'DAY', 540, 400, eob(clamp((t - wd + 0.1) / 0.3)), -0.06, '#2F7A3A');
    } });
    for (let i = 0; i < 8; i++) cue(Wd('dollars', 0) + i * 0.15, 'plop', { gain: 0.5 }); cue(wd, 'ding', { gain: 0.8 }); }

  // 2a · "And it took one man" hero walk toward camera on the street, low angle
  { const st = cut(1), wo = Wd('one', 1);
    add({ id: 'S02a', at: st, note: 'street, very low angle: the CEO toon walks straight at the camera, hero shot; pill ONE MAN', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); sCeo.at(-1.2, 0, lerp(HZ + 1, HZ + 3.2, clamp(lt / d))); sCeo.set({ mood: 'smug', legs: 'walk', phase: t * 5, armL: [14, 6], armR: [14, 6], look: [0, 0], blink: blink(t) });
      shoot(ST.scene, stPeople(), V3(-0.4, 0.4, HZ + 7.2), V3(-0.6, 0.5, HZ + 6.4), V3(-1.2, 1.9, HZ + 2), null, k, { ...LK.day, fov: 50 });
      blit(); pill('ONE MAN', (t - wo) / 0.25, 300, 'rgba(31,28,51,0.9)', 66);
    } });
    cue(st, 'whoosh'); cue(wo, 'tock', { gain: 0.6 }); }
  // 2b · "in a leather jacket." close-up on the jacket, sparkle
  { const st = Wd('leather', 1) - 0.12, wj = Wd('jacket', 1);
    add({ id: 'S02b', at: st, note: 'close-up tilt up the black jacket to his smug face; sparkle on "jacket"', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); sCeo.at(-1.2, 0, HZ + 3.2); sCeo.set({ mood: 'proud', armL: [20, 10], armR: [100, -90], look: [0.3, 0], blink: blink(t) });
      shoot(ST.scene, stPeople(), V3(-0.6, 1.0, HZ + 5.0), V3(-0.7, 1.6, HZ + 4.8), V3(-1.2, 1.0, HZ + 3.2), V3(-1.2, 1.75, HZ + 3.2), k, { ...LK.day, fov: 40 });
      blit(); stars(540, 760, (t - wj) / 0.8);
    } });
    cue(wj, 'sparkle', { gain: 0.7 }); }

  // 3a · "See, on November twelfth, its CEO," rewind: boardroom, ribbon NOV 12
  { const st = cut(2), wn = Wd('november', 2);
    add({ id: 'S03a', at: st, note: 'rewind flash: wide boardroom, the board seated; gold ribbon NOV 12', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); scr(0.25); seatMem(); chair.at(-0.6, 0, -5.45); bCeo.group.visible = true; bCeo.at(1.6, 0, -2.6);
      chair.set({ mood: 'neutral', armL: [10, 6], armR: [10, 6], blink: blink(t) }); mem.forEach((p, i) => p.set({ mood: 'neutral', armL: [10, 6], armR: [10, 6], blink: blink(t, i), look: [0.7, 0] }));
      bCeo.set({ mood: 'tired', armL: [20, 10], armR: [20, 10], look: [-0.6, 0.3], blink: blink(t) });
      shoot(BR.scene, brPeople, V3(-0.4, 2.5, 1.4), V3(0.2, 2.0, 0.4), V3(0.5, 1.4, -4.0), null, k, { ...LK.room, fov: 54 });
      blit(); ribbon('NOV 12', (t - wn + 0.1) / 0.3, 360); if (lt < 0.25) flash(1 - lt / 0.25, '#F4E3C0');
    } });
    cue(st, 'slide', { dur: 0.5, gain: 0.6 }); cue(Wd('twelfth', 2), 'stamp', { gain: 0.7 }); }
  // 3b · "Jensen Huang, quit," he slaps a letter on the table; QUIT stamp
  { const st = Wd('jensen', 2) - 0.12, wq = Wd('quit', 2);
    add({ id: 'S03b', at: st, note: 'medium: the CEO slaps a resignation letter down on "quit", the board flinches; red QUIT stamp', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); scr(0.25); seatMem(); chair.at(-0.6, 0, -5.45); bCeo.group.visible = true; bCeo.at(1.6, 0, -2.6); const sl = t > wq;
      bCeo.set({ mood: sl ? 'sad' : 'worried', armR: sl ? [50, 10] : [120, -40], holdR: sl ? null : PROPS.paper('RESIGN'), v: 'r' + sl, armL: [20, 10], lean: sl ? 10 : 0, blink: blink(t) });
      [chair, ...mem].forEach((p, i) => p.set({ mood: sl ? 'shock' : 'neutral', armL: [10, 6], armR: [10, 6], look: [0.8, 0] }));
      const sh = shake(t, wq, 0.1);
      shoot(BR.scene, brPeople, V3(2.8, 1.7, -0.6).add(sh), V3(2.6, 1.6, -1.2).add(sh), V3(1.2, 1.3, -3.4), null, k, { ...LK.room, fov: 46 }, undefined, -0.1);
      blit(); stamp(['QUIT'], (t - wq) / 0.2, { y: 470, size: 150 });
    } });
    cue(wq, 'slam', { gain: 0.9 }); cue(wq + 0.02, 'stamp', { gain: 0.8 }); }

  // 4 · "and the board said he was gone for good." the chair stamps GONE FOR GOOD; members shake heads
  { const st = cut(3), wg = Wd('gone', 3);
    add({ id: 'S04', at: st, note: 'low tilted angle on the board chair, he stands and points to the door; GONE FOR GOOD stamp', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); scr(0.3); seatMem(); bCeo.group.visible = false; chair.at(-0.6, 0, -5.45);
      chair.set({ mood: 'angry', armR: [100, 0], armL: [20, 10], talk: talk(t), blink: blink(t), lean: -6 });
      mem.forEach((p, i) => p.set({ mood: 'sly', look: [Math.sin(t * 8 + i) * 0.8, 0], armL: [10, 6], armR: [10, 6] }));
      shoot(BR.scene, brPeople, V3(-1.8, 1.4, -1.4), V3(-1.3, 1.3, -2.2), V3(-0.6, 1.7, -5.45), null, k, { ...LK.room, fov: 48 }, undefined, 0.12);
      blit(); stamp(['GONE', 'FOR GOOD'], (t - wg) / 0.2, { y: 470, size: 100 });
    } });
    cue(st, 'whoosh'); cue(wg, 'stamp', { gain: 1 }); }

  // 5a · "So the stock slid," a trader rides the cart down the red slope, red tint
  { const st = cut(4), ws = Wd('slid', 4);
    add({ id: 'S05a', at: st, note: 'coaster: a trader toon screams riding the cart down the long red drop; red tint', draw(lt, d, t, blit) {
      const k = clamp(lt / d); CO.draw(1); setStacks(0); rider.group.visible = false; trader.group.visible = true; CO.cart.visible = true;
      const p = ride(trader, lerp(0.15, 0.6, eio(k))); trader.set({ mood: 'shock', legs: 'sit', armL: [160, 20], armR: [160, 20], sweat: 1, blink: 0 });
      shoot(CO.scene, [trader], V3(p.x + 2.2, p.y + 1.2, p.z + 5.0), V3(p.x + 1.8, p.y + 1.0, p.z + 4.4), V3(p.x, p.y + 0.6, p.z), null, 0, { ...LK.day, fov: 50 });
      blit(); tint(clamp((t - ws) / 0.3)); speedLines(0.6, 5);
    } });
    cue(st, 'slide', { dur: 1.2, gain: 0.7 }); }
  // 5b · "about a fifth in one week." chart card with the drop, ABOUT -20%
  { const st = Wd('about', 4) - 0.12, wf = Wd('fifth', 4), ww = Wd('week', 4);
    add({ id: 'S05b', at: st, note: 'the trader lands dizzy at the bottom; a chart card draws the week drop; red ABOUT -20% stamp; 1 WEEK pill', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); CO.draw(1); setStacks(0); CO.cart.visible = true; trader.group.visible = true; rider.group.visible = false;
      const p = ride(trader, 0.66); trader.set({ mood: 'dizzy', legs: 'sit', armL: [40, 10], armR: [40, 10] });
      shoot(CO.scene, [trader], V3(p.x - 1.6, p.y + 1.6, p.z + 3.6), V3(p.x - 1.2, p.y + 1.5, p.z + 3.0), V3(p.x, p.y + 1.6, p.z), null, k, { ...LK.day, fov: 46 });
      blit(); chartCard([[0, 0.9], [0.25, 0.75], [0.5, 0.55], [0.7, 0.35], [0.92, 0.2]], lt / 0.8, { y: 330, h: 380, w: 760, title: 'NVDA · 1 WEEK', labels: [[0, '$155'], [4, '$125', '#E3262E']] });
      stamp(['ABOUT -20%'], (t - wf) / 0.2, { y: 640, size: 80, rot: -0.06 });
    } });
    cue(wf, 'stamp', { gain: 0.9 }); cue(ww, 'boing', { gain: 0.4 }); }

  // 6a · "Then on day eleven," calendar flips to DAY 11 on the street outside TECH HQ
  { const st = cut(5), we = Wd('eleven', 5);
    add({ id: 'S06a', at: st, note: 'TECH HQ street, crane down; calendar card flips to DAY 11', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); sCeo.at(-5.0, 0.18, HZ + 1.2); sCeo.set({ mood: 'worried', armL: [20, 10], armR: [20, 10], look: [0.5, -0.4], blink: blink(t) });
      shoot(ST.scene, stPeople(), V3(-0.5, 5.5, HZ + 8), V3(-1.8, 1.6, HZ + 5.0), V3(-5.0, 2.0, HZ), V3(-5.0, 1.4, HZ + 1.2), k, { ...LK.day, fov: 48 });
      blit(); const day = t < we ? 1 + Math.floor(clamp(lt / (we - st)) * 9.99) : 11; calCard('DAY', String(day), 540, 420, t > we ? eob(clamp((t - we) / 0.3)) : 0.9, -0.05, t > we ? '#2F7A3A' : '#D8343F');
    } });
    for (let i = 0; i < 6; i++) cue(cut(5) + i * 0.13, 'tock', { gain: 0.35 }); cue(we, 'ding', { gain: 0.8 }); }
  // 6b · "the board brought him back." the CEO strides into the boardroom, hands up, confetti
  { const st = Wd('board', 5) - 0.3, wb = Wd('back', 5);
    add({ id: 'S06b', at: st, note: 'boardroom: the CEO strides in, the board jumps up cheering, confetti; BACK! stamp', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); scr(0.8); seatMem(); chair.at(-0.6, 0, -5.45); bCeo.group.visible = true; const a = eo(clamp(lt / 0.8));
      bCeo.at(lerp(2.6, 0.8, a), 0, -2.6); bCeo.set({ mood: 'laugh', legs: a < 1 ? 'walk' : 'stand', phase: t * 7, armR: a < 1 ? [20, 10] : [150, 10], armL: [20, 10], blink: blink(t) });
      [chair, ...mem].forEach((p, i) => p.set({ mood: t > wb ? 'laugh' : 'shock', armL: t > wb ? [150, 10] : [10, 6], armR: t > wb ? [150, 10] : [10, 6], legs: t > wb && Math.sin(t * 9 + i) > 0.3 ? 'jump' : 'stand' }));
      shoot(BR.scene, brPeople, V3(1.4, 1.9, 0.8), V3(0.9, 1.8, 0.0), V3(0.6, 1.4, -4.2), null, k, { ...LK.room, fov: 52 });
      blit(); stamp(['BACK!'], (t - wb) / 0.2, { y: 430, col: '#2F7A3A', size: 140, fill: 'rgba(240,255,235,0.94)' }); confetti(t, wb, 50);
    } });
    cue(wb, 'stamp', { gain: 0.9 }); cue(wb + 0.05, 'sparkle', { gain: 0.6 }); }

  // 7 · "Subscribe for more crazy money stories." CEO points at the camera; subscribe button clicked
  { const st = cut(6);
    add({ id: 'S07', at: st, note: 'CEO grins and points at the camera, push-in; SUBSCRIBE button clicked at the top', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); scr(0.8); seatMem(); bCeo.group.visible = true; bCeo.at(1.5, 0, -2.6);
      bCeo.set({ mood: 'happy', armR: [95, 0], armL: [20, 10], talk: talk(t), blink: blink(t) });
      [chair, ...mem].forEach((p) => p.set({ mood: 'happy', armL: [10, 6], armR: [10, 6] }));
      shoot(BR.scene, brPeople, V3(1.2, 1.5, -0.6), V3(1.3, 1.5, -1.4), V3(1.5, 1.35, -2.6), null, k, { ...LK.room, fov: 44 }, 2.0);
      blit(); subscribe(lt / 0.5 + (lt > 0.8 ? (lt - 0.8) * 1.5 : 0), t, 330);
    } });
    cue(st, 'pop', { gain: 0.6 }); cue(cut(6) + 1.3, 'ding', { gain: 0.6 }); }

  // 8a · "And the stock rocketed" CEO in the cart blasts up the green climb
  { const st = cut(7), wr = Wd('rocketed', 7);
    add({ id: 'S08a', at: st, note: 'coaster: the CEO in the cart blasts up the green climb, speed lines, cash rain', draw(lt, d, t, blit) {
      const k = clamp(lt / d); CO.draw(1); setStacks(0); trader.group.visible = false; rider.group.visible = true; CO.cart.visible = true;
      const p = ride(rider, lerp(0.76, 0.88, eio(k))); rider.set({ mood: t > wr ? 'laugh' : 'shock', legs: 'sit', armL: [150, 10], armR: [150, 10], blink: 0 });
      shoot(CO.scene, [rider], V3(p.x - 2.6, p.y - 0.6, p.z + 4.8), V3(p.x - 2.0, p.y - 0.2, p.z + 4.0), V3(p.x, p.y + 0.9, p.z), null, 0, { ...LK.day, fov: 52 });
      blit(); speedLines(clamp((t - wr) / 0.2), 9); cashRain(t, wr, 20);
    } });
    cue(st, 'chug', { dur: 0.8, gain: 0.5 }); cue(wr, 'whoosh', { gain: 0.9 }); }
  // 8b · "thirty-one percent," +31% slams with a shake
  { const st = Wd('thirty', 7) - 0.12, w3 = Wd('thirty', 7);
    add({ id: 'S08b', at: st, note: 'punch-in at the top: +31% slams in with a camera shake', draw(lt, d, t, blit) {
      const k = clamp(lt / d); CO.draw(1); setStacks(0); CO.cart.visible = true; trader.group.visible = false; rider.group.visible = true; const p = ride(rider, lerp(0.88, 0.95, eo(k))); rider.set({ mood: 'laugh', legs: 'sit', armL: [160, -10], armR: [160, -10], blink: 0 });
      const sh = shake(t, w3, 0.25);
      shoot(CO.scene, [rider], V3(p.x - 1.6, p.y + 0.6, p.z + 3.8).add(sh), V3(p.x - 1.1, p.y + 0.8, p.z + 3.0).add(sh), V3(p.x, p.y + 0.9, p.z), null, eo(k), { ...LK.day, fov: 46 });
      blit(); cashRain(t, st - 0.8, 24); stamp(['+31%'], (t - w3) / 0.18, { y: 420, col: '#2F7A3A', size: 190, fill: 'rgba(240,255,235,0.95)' });
    } });
    cue(w3, 'slam', { gain: 0.9 }); cue(w3 + 0.02, 'stamp', { gain: 0.8 }); }

  // 9 · "one of the biggest one-day gains ever." the CEO rides a money stack up to the sky
  { const st = cut(8), wb = Wd('biggest', 8), we = Wd('ever', 8);
    add({ id: 'S09', at: st, note: 'meadow: the CEO stands on a money stack that shoots up past the camera, crane up; ONE OF THE BIGGEST EVER pill; confetti', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); CO.draw(1); CO.cart.visible = false; trader.group.visible = false; rider.group.visible = true;
      const n = eo(clamp((t - st) / (we - st + 0.3))) * 38; setStacks(n * 0.35); stacks[4].set(n);
      rider.at(0, n * 0.16, 1.2); rider.set({ mood: t > we ? 'laugh' : 'proud', legs: 'stand', armL: [150, 10], armR: [150, 10], blink: blink(t) });
      const y = n * 0.16; shoot(CO.scene, [rider], V3(0, y * 0.75 + 1.2, 7.4), V3(0, y * 0.95 + 1.6, 6.6), V3(0, y + 1.0, 1.2), null, k, { ...LK.day, fov: 50 });
      blit(); pill('ONE OF THE BIGGEST EVER', (t - wb) / 0.25, 300, 'rgba(31,28,51,0.9)', 54); confetti(t, we, 60);
    } });
    for (let i = 0; i < 8; i++) cue(cut(8) + 0.1 + i * 0.2, 'plop', { gain: 0.45 }); cue(we, 'sparkle', { gain: 0.8 }); }

  // 10 · "That's why on November twenty-third," calendar NOV 23 over the coaster crest (loops into frame 0)
  { const st = cut(9), wn = Wd('november', 9);
    add({ id: 'S10', at: st, note: 'back at the crest like frame 0, CEO cheering in the cart; calendar NOV 23 slams in', draw(lt, d, t, blit) {
      const k = clamp(lt / d); CO.draw(1); setStacks(0); rider.group.visible = true; CO.cart.visible = true;
      const p = ride(rider, lerp(0.84, 0.9, k)); rider.set({ mood: 'smug', legs: 'sit', armL: [150, 10], armR: [20, 10], blink: blink(t) });
      shoot(CO.scene, [rider], V3(p.x - 3.0, p.y + 0.0, p.z + 5.6), V3(p.x - 2.4, p.y + 0.2, p.z + 4.8), V3(p.x, p.y + 1.0, p.z), null, eo(k), { ...LK.day, fov: 48 });
      blit(); calCard('NOV', '23', 540, 420, eob(clamp((t - wn + 0.1) / 0.3)), 0.05, '#2F7A3A');
    } });
    cue(st, 'whoosh', { gain: 0.6 }); cue(wn, 'stamp', { gain: 0.8 }); }

  return { shots: S, cues: CUES };
}
