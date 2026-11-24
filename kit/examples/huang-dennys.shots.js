// HE WASHED DISHES AT DENNY'S. NOW HE RUNS NVIDIA — shot list (Tall Tale 3D). Same generic CEO toon; no logos.
import * as THREE from 'three';
import { ctx, clamp, lerp, eo, eio, eob } from './core/lib.js';
import { L, Le, Wd, T } from './core/timing.js';
import * as WD from './core/world.js';
import * as PR from './core/props.js';
import { PROPS, INK } from './core/toon.js';
import { V3, mix, talk, blink, person, P2, hook, ribbon, pill, stamp, calCard, counter, cashRain, confetti, flash, tint, speedLines, stars, mark, subscribe, makeShoot, LK, street, diner } from './jh.js';

const napkin = (g, x, y) => { g.save(); g.translate(x, y - 60); g.rotate(-0.1); g.strokeStyle = INK; g.lineWidth = 5; g.fillStyle = '#FFFDF4'; g.beginPath(); g.rect(-70, -70, 140, 140); g.fill(); g.stroke();
  g.strokeStyle = '#3C6FB6'; g.lineWidth = 4; g.strokeRect(-34, -34, 68, 68); for (let i = -2; i <= 2; i++) { g.beginPath(); g.moveTo(i * 13, -34); g.lineTo(i * 13, -50); g.moveTo(i * 13, 34); g.lineTo(i * 13, 50); g.moveTo(-34, i * 13); g.lineTo(-50, i * 13); g.moveTo(34, i * 13); g.lineTo(50, i * 13); g.stroke(); }
  g.fillStyle = '#3C6FB6'; g.font = '900 22px Inter'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('CHIP', 0, 2); g.restore(); };

export function buildShots(E) {
  const S = [], CUES = [], add = (o) => (S.push(o), o), cue = (t, type, o = {}) => CUES.push({ t: +Math.max(0, t).toFixed(3), type, ...o });
  const cut = (i) => (i === 0 ? 0 : L(i) - 0.06);
  const { shoot } = makeShoot(E);
  const shake = (t, t0, a = 0.08) => { const k = t - t0; if (k < 0 || k > 0.35) return V3(0, 0, 0); const f = (1 - k / 0.35) * a; return V3(Math.sin(k * 90) * f, Math.cos(k * 70) * f, 0); };

  // ── DINER ──
  const D = diner(E);
  const teen = person('teen'), dCeo = person('ceo'), fr1 = person('friend1'), fr2 = person('friend2'), cust = person('m2'), cust2 = person('fan');
  [teen, dCeo, fr1, fr2, cust, cust2].forEach((p) => D.scene.add(p.group));
  const dPeople = [teen, dCeo, fr1, fr2, cust, cust2];
  const only = (...keep) => dPeople.forEach((p) => (p.group.visible = keep.includes(p)));
  const SINK = V3(2.35, 0, -2.3); D.dishes.position.set(3.0, 1.2, -1.5);

  // ── MEADOW: Taiwan / Kentucky ──
  const M = WD.meadow(E, { fenceOn: true });
  const kid = person('kid', { height: 1.2 }); M.scene.add(kid.group);
  const school = PR.house({ wall: '#E9D7A5', roof: '#8A2E2E', door: '#2E4E8A' }); school.position.set(3.2, 0, -6.5); school.rotation.y = -0.4; M.scene.add(school);
  const sp = PR.signpost([['KENTUCKY', 'r'], ['SCHOOL', 'r']]); sp.position.set(0.6, 0, -2.6); M.scene.add(sp);
  const jet = PR.plane(); M.scene.add(jet); jet.scale.setScalar(0.6);
  M.sun.key.target.position.set(1, 0, -3); M.sun.key.position.set(7, 12, 4);

  // ── STREET ──
  const SHOPS = [['CAFE', '#E58A6A', 'wood', '#2E4E3F'], ['STOCK EXCHANGE', '#E9E2D0', 'brick', '#3C6FB6'], ['NEWS', '#F2D37A', 'wood', '#D8343F'], ['BANK', '#C7B79A', 'brick', null], ['TECH HQ', '#3A4A5E', 'brick', '#4FB36A'],
    ['DINER', '#C9603F', 'wood', '#D8343F'], ['BOOKS', '#7FA36A', 'wood', null], ['PIZZA', '#D9A34A', 'brick', '#3C6FB6']];
  const ST = street(E, SHOPS); const SE = ST.buildings.find((b) => b.name === 'STOCK EXCHANGE'); const SZ = SE.z;
  ST.people.forEach((p) => { if (Math.abs(p.group.position.z - SZ) < 12) p.group.visible = false; });
  ST.sun.key.target.position.set(-2, 0, SZ + 2); ST.sun.key.position.set(5, 12, SZ + 8);
  const traders = ['trader', 'm1', 'trader', 'm3', 'chair'].map((k) => { const p = person(k); ST.scene.add(p.group); return p; });
  const sCeo = person('ceo'); ST.scene.add(sCeo.group);
  const stPeople = () => [...ST.people, ...traders, sCeo];

  // ═══ SHOTS ═══
  // 1a · frame 0: the teen at the diner sink, a tower of dirty dishes; hook DISHWASHER TO CEO?
  { const st = 0, wd = Wd('dishes', 0);
    add({ id: 'S01a', at: st, note: 'frame 0: teen toon in an apron scrubbing a plate at the diner sink, tall dish tower wobbling; hook DISHWASHER TO CEO?', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); only(teen); D.plaque.visible = false; D.dishes.visible = true; D.dishes.rotation.z = Math.sin(t * 6) * 0.04;
      teen.at(SINK.x, 0, SINK.z); teen.set({ mood: 'tired', sweat: 1, armL: [70 + Math.sin(t * 14) * 15, -60], armR: [60, -50 + Math.sin(t * 14) * 20], holdL: P2.plate, v: 'p', look: [0, 0.5], blink: blink(t) });
      shoot(D.scene, dPeople, V3(0.4, 1.5, 0.8), V3(0.8, 1.55, 0.2), V3(2.4, 1.3, -2.1), null, k, { ...LK.room, fov: 46 });
      blit(); hook(['DISHWASHER', 'TO CEO?'], 1, { y: 320, size: 120, hiLine: 1 });
    } });
    cue(0, 'pop', { gain: 0.5 }); cue(wd, 'plop', { gain: 0.6 }); }
  // 1b · "and now he runs Nvidia." poof: the teen becomes the CEO in the black jacket, cash rain
  { const st = Wd('and', 0) - 0.12, wn = Wd('now', 0), wv = Wd('nvidia', 0);
    add({ id: 'S01b', at: st, note: 'push-in; on "now" a white poof and the teen is now the CEO toon in the black jacket, smug; cash rain on "Nvidia"', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); const now = t > wn; only(now ? dCeo : teen); D.dishes.visible = true;
      teen.at(SINK.x, 0, SINK.z); teen.set({ mood: 'shock', armL: [60, -60], holdL: P2.plate, armR: [60, -50], v: 'p2' });
      dCeo.at(SINK.x, 0, SINK.z); dCeo.set({ mood: 'smug', armL: [20, 10], armR: [100, -90], look: [0, 0], blink: blink(t) });
      shoot(D.scene, dPeople, V3(0.8, 1.55, 0.2), V3(1.4, 1.6, -0.6), V3(2.35, 1.45, -2.3), null, k, { ...LK.room, fov: 44 });
      blit(); flash(clamp(1 - Math.abs(t - wn) / 0.12)); stars(540, 700, (t - wn) / 0.8); cashRain(t, wv - 0.1, 22);
    } });
    cue(wn, 'boing', { gain: 0.8 }); cue(wn + 0.05, 'sparkle', { gain: 0.6 }); cue(wv, 'ding', { gain: 0.7 }); }

  // 2 · "Jensen Huang was born in Taiwan," rewind: a sunny meadow, a little kid; ribbon BORN IN TAIWAN
  { const st = cut(1), wt = Wd('taiwan', 1);
    add({ id: 'S02', at: st, note: 'rewind: crane down a sunny meadow onto a little kid toon who waves; gold ribbon BORN IN TAIWAN', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); jet.visible = false; school.visible = sp.visible = false; kid.at(-0.8, 0, -1.0); kid.set({ mood: 'happy', armR: [140 + Math.sin(t * 10) * 20, 10], armL: [20, 10], blink: blink(t) });
      shoot(M.scene, [kid], V3(1.0, 5.5, 6.0), V3(0.2, 1.1, 3.0), V3(-0.8, 0.6, -2), V3(-0.8, 0.8, -1.0), k, { ...LK.day, fov: 48 });
      blit(); ribbon('BORN IN TAIWAN', (t - wt + 0.1) / 0.3, 360, 76); if (lt < 0.25) flash(1 - lt / 0.25, '#F4E3C0');
    } });
    cue(st, 'slide', { dur: 0.6, gain: 0.6 }); cue(wt, 'stamp', { gain: 0.7 }); }

  // 3a · "and at nine, he was sent" the kid with a suitcase, a plane sweeps overhead; AGE 9
  { const st = cut(2), w9 = Wd('nine', 2);
    add({ id: 'S03a', at: st, note: 'low angle: the kid holds a suitcase box and looks up as a plane sweeps over; pill AGE 9', draw(lt, d, t, blit) {
      const k = clamp(lt / d); jet.visible = true; school.visible = sp.visible = true; jet.position.set(-14 + k * 26, 9 - k * 1.5, -10); jet.rotation.set(0, -Math.PI / 2, 0.08);
      kid.at(-0.4, 0, -1.0); kid.set({ mood: 'worried', armL: [40, -30], holdL: P2.box, v: 'k1', armR: [20, 10], look: [0.3, -0.9], blink: blink(t) });
      shoot(M.scene, [kid], V3(0.4, 0.5, 2.4), V3(0.1, 0.45, 2.0), V3(-0.4, 1.6, -1.0), V3(0, 3.0, -4), eio(k), { ...LK.day, fov: 54 });
      blit(); pill('AGE 9', (t - w9) / 0.25, 300, 'rgba(31,28,51,0.9)', 66);
    } });
    cue(st, 'whoosh', { gain: 0.7 }); cue(w9, 'tock', { gain: 0.7 }); }
  // 3b · "to school in Kentucky." the kid walks past the KENTUCKY signpost toward the school house
  { const st = Wd('to', 2) - 0.12, wk = Wd('kentucky', 2);
    add({ id: 'S03b', at: st, note: 'wide: the kid walks past the KENTUCKY signpost toward a little school house; ribbon KENTUCKY, USA', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); jet.visible = false; school.visible = sp.visible = true; kid.at(lerp(-1.6, 1.2, clamp(lt / d)), 0, lerp(-1.4, -3.6, clamp(lt / d))); kid.set({ mood: 'neutral', legs: 'walk', phase: t * 8, armL: [40, -30], holdL: P2.box, v: 'k1', armR: [20, 10], blink: blink(t) });
      shoot(M.scene, [kid], V3(-2.6, 1.6, 3.6), V3(-1.4, 1.8, 3.0), V3(0.8, 1.2, -3.0), V3(1.6, 1.4, -4.6), k, { ...LK.day, fov: 52 });
      blit(); ribbon('KENTUCKY, USA', (t - wk + 0.1) / 0.3, 360, 76);
    } });
    cue(wk, 'stamp', { gain: 0.7 }); }

  // 4 · "At fifteen, he got a job at Denny's," the teen walks into the diner tying his apron; AGE 15
  { const st = cut(3), w15 = Wd('fifteen', 3), wj = Wd('job', 3);
    add({ id: 'S04', at: st, note: 'diner wide, pan: the teen walks in proudly, apron on; pill AGE 15; ding on "job"', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); only(teen, cust); D.dishes.visible = true; const a = clamp(lt / (d * 0.8));
      teen.at(lerp(-1.0, 1.6, a), 0, -1.6); teen.set({ mood: t > wj ? 'proud' : 'happy', legs: a < 1 ? 'walk' : 'stand', phase: t * 7, armL: [20, 10], armR: t > wj ? [150, 10] : [20, 10], blink: blink(t) });
      cust.at(-2.9, 0, -3.4); cust.set({ mood: 'neutral', legs: 'sit', armL: [60, -60], armR: [20, 10], holdL: P2.coffee, v: 'c' });
      shoot(D.scene, dPeople, V3(-2.2, 1.9, 2.4), V3(-0.4, 1.8, 2.2), V3(0, 1.3, -2.4), V3(1.4, 1.3, -2.0), k, { ...LK.room, fov: 54 });
      blit(); pill('AGE 15', (t - w15) / 0.25, 300, 'rgba(31,28,51,0.9)', 66);
    } });
    cue(st, 'whoosh'); cue(w15, 'tock', { gain: 0.7 }); cue(wj, 'ding', { gain: 0.7 }); }

  // 5a · "washing dishes," scrub scrub at the sink, bubbles
  { const st = cut(4), ww = Wd('washing', 4);
    add({ id: 'S05a', at: st, note: 'close on the sink: the teen scrubs fast, soap bubbles pop; dish tower grows', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); only(teen); D.dishes.visible = true; D.dishes.scale.y = 1 + clamp(lt / d) * 0.6;
      teen.at(SINK.x, 0, SINK.z); teen.set({ mood: 'tired', sweat: 1, armL: [70 + Math.sin(t * 18) * 18, -60], armR: [60, -50 + Math.sin(t * 18) * 25], holdL: P2.plate, v: 'p', look: [0, 0.6], blink: blink(t) });
      shoot(D.scene, dPeople, V3(1.2, 1.6, -0.2), V3(1.5, 1.6, -0.6), V3(2.4, 1.3, -2.2), null, k, { ...LK.room, fov: 44 });
      D.dishes.scale.y = 1; blit();
      for (let i = 0; i < 9; i++) { const bt = (lt * 1.6 + i * 0.37) % 1; ctx.save(); ctx.globalAlpha = 1 - bt; ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = 5; ctx.fillStyle = 'rgba(190,230,255,0.5)'; ctx.beginPath(); ctx.arc(380 + (i * 61) % 340, 1000 - bt * 420, 18 + (i % 3) * 10, 0, 7); ctx.fill(); ctx.stroke(); ctx.restore(); }
    } });
    cue(ww, 'pop', { gain: 0.5 }); cue(ww + 0.3, 'pop', { gain: 0.4 }); cue(ww + 0.6, 'pop', { gain: 0.4 }); }
  // 5b · "then busing" the teen runs across with a stack of plates, speed lines
  { const st = Wd('then', 4) - 0.12;
    add({ id: 'S05b', at: st, note: 'whip-pan: the teen runs across the diner with a wobbly stack of plates, speed lines', draw(lt, d, t, blit) {
      const k = clamp(lt / d); only(teen, cust); const x = lerp(2.0, -1.4, eio(k));
      teen.at(x, 0, -2.2); teen.set({ mood: 'worried', legs: 'run', phase: t * 13, armL: [90, -80], armR: [90, -80], holdL: P2.plates, v: 'ps', lean: 10, flip: true, blink: 0 });
      cust.at(-2.9, 0, -3.4); cust.set({ mood: 'shock', legs: 'sit', armL: [20, 10], armR: [20, 10], look: [0.8, 0] });
      shoot(D.scene, dPeople, V3(x + 0.8, 1.5, 1.4), V3(x + 0.5, 1.5, 1.2), V3(x, 1.2, -2.2), null, 0, { ...LK.room, fov: 48 });
      blit(); speedLines(0.8, 2);
    } });
    cue(st, 'whoosh', { gain: 0.8 }); }
  // 5c · "and waiting tables." he serves a tray to a customer at the booth, ding
  { const st = Wd('waiting', 4) - 0.12, wt = Wd('tables', 4);
    add({ id: 'S05c', at: st, note: 'booth: the teen sets down a tray of food for a customer, who gives a thumbs-up laugh', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); only(teen, cust, cust2);
      teen.at(-1.1, 0, -4.2); teen.set({ mood: 'happy', armR: [lerp(120, 80, eo(clamp((t - wt) / 0.3))), -40], holdR: P2.tray, v: 't', armL: [20, 10], talk: talk(t), blink: blink(t) });
      cust.at(-2.8, 0, -5.4); cust.set({ mood: t > wt ? 'laugh' : 'happy', legs: 'sit', armL: [20, 10], armR: t > wt ? [130, -60] : [20, 10] });
      cust2.at(-2.0, 0, -5.4); cust2.set({ mood: 'happy', legs: 'sit', armL: [20, 10], armR: [20, 10], look: [0.6, 0] });
      shoot(D.scene, dPeople, V3(0.8, 1.7, -2.2), V3(0.6, 1.6, -2.8), V3(-2.0, 1.1, -4.8), null, k, { ...LK.room, fov: 48 });
      blit();
    } });
    cue(wt, 'ding', { gain: 0.7 }); }

  // 6a · "In 1993," ribbon 1993; three friends squeeze into the booth with coffee
  { const st = cut(5), wy = Wd('1993', 5);
    add({ id: 'S06a', at: st, note: 'the booth, crane down: the CEO toon and two engineer friends in the booth with coffee cups; gold ribbon 1993', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); only(dCeo, fr1, fr2); D.plaque.visible = false;
      dCeo.at(-2.4, 0, -3.5); fr1.at(-3.7, 0, -4.4); fr2.at(-1.9, 0, -5.3);
      dCeo.set({ mood: 'happy', legs: 'sit', armR: [60, -60], holdR: P2.coffee, v: 'cf', armL: [20, 10], look: [0, -0.3], blink: blink(t) });
      fr1.set({ mood: 'smug', legs: 'sit', armL: [60, -60], armR: [20, 10], blink: blink(t, 1) }); fr2.set({ mood: 'happy', legs: 'sit', armL: [20, 10], armR: [60, -60], holdR: P2.coffee, v: 'c2', blink: blink(t, 2) });
      shoot(D.scene, dPeople, V3(2.6, 2.5, -4.2), V3(2.2, 1.6, -4.4), V3(-2.4, 0.9, -4.4), V3(-2.4, 1.1, -4.4), k, { ...LK.room, fov: 56 });
      blit(); ribbon('1993', (t - wy + 0.1) / 0.3, 360); if (lt < 0.25) flash(1 - lt / 0.25, '#F4E3C0');
    } });
    cue(st, 'slide', { dur: 0.5, gain: 0.6 }); cue(wy, 'stamp', { gain: 0.8 }); }
  // 6b · "he planned Nvidia with two friends" he holds up a napkin chip sketch, ! pops, friends lean in
  { const st = Wd('he', 5) - 0.12, wp = Wd('planned', 5), wf = Wd('friends', 5);
    add({ id: 'S06b', at: st, note: 'close: the CEO toon holds up a napkin with a chip sketch; ! pops; the friends lean in excited', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); only(dCeo, fr1, fr2);
      dCeo.at(-2.4, 0, -3.5); fr1.at(-3.7, 0, -4.4); fr2.at(-1.9, 0, -5.3);
      dCeo.set({ mood: t > wp ? 'proud' : 'happy', legs: 'sit', armR: [140, -20], holdR: napkin, v: 'nap', armL: [20, 10], talk: talk(t), blink: blink(t) });
      fr1.set({ mood: t > wf ? 'laugh' : 'shock', legs: 'sit', lean: 10, armL: t > wf ? [150, 10] : [20, 10], armR: [20, 10] }); fr2.set({ mood: t > wf ? 'laugh' : 'shock', legs: 'sit', lean: -10, armR: t > wf ? [150, 10] : [20, 10], armL: [20, 10] });
      shoot(D.scene, dPeople, V3(2.4, 1.5, -4.4), V3(2.0, 1.45, -4.4), V3(-2.4, 1.1, -4.4), null, k, { ...LK.room, fov: 56 });
      blit(); mark('!', 760, 330, (t - wp) / 0.25); pill('+ TWO ENGINEER FRIENDS', (t - wf) / 0.25, 1080, 'rgba(31,28,51,0.9)', 46);
    } });
    cue(wp, 'boing', { gain: 0.7 }); cue(wf, 'pop', { gain: 0.6 }); }

  // 7 · "in a Denny's booth in San Jose." orbit round the booth; pill SAN JOSE, CALIFORNIA
  { const st = cut(6), wj = Wd('jose', 6);
    add({ id: 'S07', at: st, note: 'camera orbits the booth: the three friends laughing over coffee; pill SAN JOSE, CALIFORNIA', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); only(dCeo, fr1, fr2);
      dCeo.at(-2.4, 0, -3.5); fr1.at(-3.7, 0, -4.4); fr2.at(-1.9, 0, -5.3);
      [dCeo, fr1, fr2].forEach((p, i) => p.set({ mood: 'laugh', legs: 'sit', armL: [20, 10], armR: [60, -60], holdR: P2.coffee, v: 'o' + i, bob: Math.abs(Math.sin(t * 8 + i)) * 4 }));
      const a = lerp(1.95, 1.3, k), c = V3(-2.4, 1.0, -4.4); const cp = V3(c.x + Math.sin(a) * 4.0, 2.0, c.z + Math.cos(a) * 4.0);
      shoot(D.scene, dPeople, cp, cp, c, null, 0, { ...LK.room, fov: 50 });
      blit(); pill('SAN JOSE, CALIFORNIA', (t - wj + 0.4) / 0.25, 300, 'rgba(31,28,51,0.9)', 52);
    } });
    cue(st, 'whoosh', { gain: 0.6 }); cue(wj, 'ding', { gain: 0.5 }); }

  // 8 · "Subscribe for more wild true stories." CEO points at the camera from the booth; subscribe button
  { const st = cut(7);
    add({ id: 'S08', at: st, note: 'the CEO toon stands by the booth and points at the camera; SUBSCRIBE button clicked', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); only(dCeo); dCeo.at(-0.8, 0, -3.0);
      dCeo.set({ mood: 'happy', armR: [95, 0], armL: [20, 10], talk: talk(t), blink: blink(t) });
      shoot(D.scene, dPeople, V3(-0.6, 1.5, 0.0), V3(-0.7, 1.5, -0.8), V3(-0.8, 1.35, -3.0), null, k, { ...LK.room, fov: 44 }, 2.4);
      blit(); subscribe(lt / 0.5 + (lt > 0.8 ? (lt - 0.8) * 1.5 : 0), t, 330);
    } });
    cue(st, 'pop', { gain: 0.6 }); cue(cut(7) + 1.3, 'ding', { gain: 0.6 }); }

  // 9 · "Today, that booth has a plaque," empty booth, push-in to a gold plaque; ribbon TODAY
  { const st = cut(8), wp = Wd('plaque', 8);
    add({ id: 'S09', at: st, note: 'empty booth, slow push-in to a gold plaque on the wall above it; sparkle; ribbon TODAY', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); only(); D.plaque.visible = true; D.cups.forEach((c) => (c.visible = false));
      shoot(D.scene, dPeople, V3(-1.2, 1.6, -1.6), V3(-2.0, 1.9, -3.8), V3(-2.4, 1.6, -5.6), V3(-2.4, 1.95, -5.6), k, { ...LK.room, fov: 48 });
      D.cups.forEach((c) => (c.visible = true)); blit(); ribbon('TODAY', (t - st - 0.05) / 0.3, 360); stars(540, 760, (t - wp) / 0.9);
    } });
    cue(st, 'whoosh', { gain: 0.5 }); cue(wp, 'sparkle', { gain: 0.8 }); }

  // 10a · "and this month, Wall Street" Wall Street traders kneel and beg with COME BACK signs
  { const st = cut(9), ww = Wd('wall', 9), wb = Wd('begged', 9);
    add({ id: 'S10a', at: st, note: 'street by the STOCK EXCHANGE: traders kneel with COME BACK signs, begging; tears; pill NOV 2026', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); sCeo.group.visible = false; const x = SE.side < 0 ? -1 : 1;
      traders.forEach((p, i) => { p.group.visible = true; p.at(x * (2.2 + (i % 2) * 1.2), 0, SZ + 1.4 + i * 0.9); p.set({ mood: t > wb ? 'sad' : 'worried', tears: t > wb ? 1 : 0, armL: [150, 0], armR: [150, 0], holdR: i % 2 ? PROPS.sign('COME BACK!', '#FFE08A') : null, v: 'tb' + i, bob: Math.abs(Math.sin(t * 6 + i)) * 5, legs: 'sit' }); });
      shoot(ST.scene, stPeople(), V3(x * -0.6, 1.4, SZ + 9), V3(x * 0.2, 1.8, SZ + 7.6), V3(x * 2.8, 1.2, SZ + 3), null, k, { ...LK.day, fov: 52 });
      blit(); pill('WALL STREET · NOV 2026', (t - ww) / 0.25, 300, 'rgba(31,28,51,0.9)', 50);
    } });
    cue(st, 'whoosh'); cue(wb, 'boing', { gain: 0.5 }); }
  // 10b · "to come back." the CEO walks in, traders jump, confetti
  { const st = Wd('to', 9) - 0.12, wb = Wd('back', 9);
    add({ id: 'S10b', at: st, note: 'the CEO toon strides in, the traders leap up cheering, confetti', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); const x = SE.side < 0 ? -1 : 1; sCeo.group.visible = true; const a = eo(clamp(lt / 0.6));
      sCeo.at(x * lerp(0.0, 1.3, a), 0, SZ + 3.4); sCeo.set({ mood: 'smug', legs: a < 1 ? 'walk' : 'stand', phase: t * 7, armL: [20, 10], armR: t > wb ? [150, 10] : [20, 10], blink: blink(t) });
      traders.forEach((p, i) => { p.group.visible = true; p.at(x * (2.2 + (i % 2) * 1.2), 0, SZ + 1.4 + i * 0.9); p.set({ mood: 'laugh', tears: 0, armL: [150, 10], armR: [150, 10], holdR: null, v: 'tc' + i, legs: Math.sin(t * 9 + i) > 0.2 ? 'jump' : 'stand', bob: 0 }); });
      shoot(ST.scene, stPeople(), V3(x * 0.6, 1.6, SZ + 8.4), V3(x * 0.6, 1.5, SZ + 7.4), V3(x * 1.4, 1.3, SZ + 3), null, k, { ...LK.day, fov: 50 });
      blit(); confetti(t, wb - 0.2, 60);
    } });
    cue(wb, 'sparkle', { gain: 0.8 }); }

  // 11 · "Not bad for a guy who..." back at the diner sink: the CEO toon washes one plate and winks (loops to frame 0)
  { const st = cut(10);
    add({ id: 'S11', at: st, note: 'back at the diner sink like frame 0: the CEO toon in his jacket scrubs a plate and gives a sly wink', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); only(dCeo); D.plaque.visible = false; D.dishes.visible = true;
      dCeo.at(SINK.x, 0, SINK.z); dCeo.set({ mood: lt > d * 0.5 ? 'sly' : 'smug', armL: [70 + Math.sin(t * 14) * 15, -60], armR: [60, -50 + Math.sin(t * 14) * 20], holdL: P2.plate, v: 'pc', look: [0, 0], blink: lt > d * 0.5 ? 0 : blink(t) });
      shoot(D.scene, dPeople, V3(0.0, 1.6, 1.4), V3(0.5, 1.6, 0.7), V3(2.4, 1.35, -2.2), null, k, { ...LK.room, fov: 46 });
      blit(); mark('?', 820, 330, (lt - 0.6) / 0.3);
    } });
    cue(st, 'whoosh', { gain: 0.5 }); cue(cut(10) + 0.6, 'pop'); }

  return { shots: S, cues: CUES };
}
