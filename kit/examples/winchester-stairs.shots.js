// WHY SHE BUILT STAIRS INTO THE CEILING (Sarah Winchester, San Jose, 1886-1922) — Tall Tale 3D, mystery tone, US audience.
// Generic toons only (a woman in a black mourning dress, no likeness). No guns drawn: the rifle company is just a factory sign.
import * as THREE from 'three';
import { ctx, clamp, lerp, eo, eio, eob, rnd } from './core/lib.js';
import { L, Le, Wd, T } from './core/timing.js';
import * as WD from './core/world.js';
import * as PR from './core/props.js';
import { smokeVent } from './core/town.js';
import { Toon, PROPS, INK } from './core/toon.js';
import { V3, talk, blink, hook, ribbon, pill, stamp, calCard, counter, cashRain, confetti, flash, tint, speedLines, stars, mark, subscribe, makeShoot, LK } from './jh.js';

const LOOKS = {
  sarah: { body: '#2A2230', pattern: 'plain', hat: 'bun', hatCol: '#8A8A94', neck: 'collar', neckCol: '#F4EFE4' },
  lawyer: { body: '#5C6F8F', hat: 'bowler', hatCol: '#2A2638', neck: 'tie', neckCol: '#2E8A5A', extra: ['mustache'] },
  b1: { body: '#C98A52', pattern: 'overalls', patCol: '#3C6FB6', hat: 'cap', hatCol: '#8A2E2E', extra: ['mustache'] },
  b2: { body: '#E8734A', pattern: 'overalls', patCol: '#2E4E3F', hat: 'beanie', hatCol: '#F2C230' },
  b3: { body: '#9BC46A', pattern: 'overalls', patCol: '#6B4A3A', hat: 'cap', hatCol: '#3C6FB6' },
  prof: { body: '#8C6FC9', hat: 'none', neck: 'bowtie', neckCol: '#F2C230', pattern: 'vest', patCol: '#5A4A8A', extra: ['glasses'] },
  ghost: { body: '#DDEEFF', pattern: 'plain', hat: 'none', neck: 'none' },
};
const mk = (k, o) => new Toon({ ...LOOKS[k], extra: [...(LOOKS[k].extra || [])] }, o);
const hammer = (g, x, y) => { g.save(); g.translate(x, y - 20); g.rotate(-0.3); g.strokeStyle = INK; g.lineWidth = 5; g.fillStyle = '#9A6A43'; g.fillRect(-6, -10, 12, 90); g.strokeRect(-6, -10, 12, 90); g.fillStyle = '#5A5A66'; g.beginPath(); g.rect(-34, -34, 68, 26); g.fill(); g.stroke(); g.restore(); };
const plans = (g, x, y) => { g.save(); g.translate(x, y - 60); g.rotate(-0.08); g.strokeStyle = INK; g.lineWidth = 5; g.fillStyle = '#3C6FB6'; g.beginPath(); g.rect(-90, -70, 180, 130); g.fill(); g.stroke(); g.strokeStyle = '#FFFFFF'; g.lineWidth = 3; g.strokeRect(-70, -50, 70, 50); g.strokeRect(0, -50, 60, 90); g.beginPath(); g.moveTo(-70, 20); for (let i = 0; i < 5; i++) { g.lineTo(-70 + i * 14, 20 - i * 12); g.lineTo(-56 + i * 14, 20 - i * 12); } g.stroke(); g.restore(); };

export function buildShots(E) {
  const S = [], CUES = [], add = (o) => (S.push(o), o), cue = (t, type, o = {}) => CUES.push({ t: +Math.max(0, t).toFixed(3), type, ...o });
  const cut = (i) => (i === 0 ? 0 : L(i) - 0.06);
  const { shoot } = makeShoot(E);
  const shake = (t, t0, a = 0.08) => { const k = t - t0; if (k < 0 || k > 0.35) return V3(0, 0, 0); const f = (1 - k / 0.35) * a; return V3(Math.sin(k * 90) * f, Math.cos(k * 70) * f, 0); };

  // ── HALL (inside the mansion) ──
  const H = WD.interior(E, { w: 9, depth: 7, h: 4.2, wall: '#6A3A4A', motif: '#7E4A5A', floor: '#7A4A2E', ceiling: '#B8957A', signText: null, picture: false, counterOn: false, litter: false });
  const wood = WD.mat({ map: WD.T.planks('#8A5A3A', [1, 0.3]) }), rail = WD.mat({ color: '#5A3420' });
  const stairs = new THREE.Group(); const N = 14;
  for (let i = 0; i < N; i++) { const s = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.3 * (i + 1), 0.35), wood); s.position.set(0, 0.15 * (i + 1), -i * 0.35); s.castShadow = s.receiveShadow = true; stairs.add(s);
    const post = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.9, 0.06), rail); post.position.set(-0.68, 0.3 * (i + 1) + 0.45, -i * 0.35); stairs.add(post); }
  const hr = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, N * 0.37), rail); hr.position.set(-0.68, 0.3 * N / 2 + 0.95, -(N - 1) * 0.35 / 2); hr.rotation.x = Math.atan2(0.3, 0.35); stairs.add(hr);
  stairs.position.set(2.6, 0, -1.6); H.scene.add(stairs);   // the top step (y 4.2) runs straight into the ceiling at z ~ -6.1
  const STOP = V3(2.6, 4.2, -1.6 - (N - 1) * 0.35);
  // the door that opens onto a wall (left wall x -4.5)
  const brick = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 2.1), WD.mat({ map: WD.T.brick('#9E4A3A', [1, 2]) })); brick.position.set(-4.38, 1.05, -3.2); brick.rotation.y = Math.PI / 2; H.scene.add(brick);
  const frameM = WD.mat({ color: '#3A2418' }); [[-0.55, 1.1, 0.1, 2.3], [0.55, 1.1, 0.1, 2.3], [0, 2.2, 1.2, 0.12]].forEach(([dz, y, w, h]) => { const f = new THREE.Mesh(new THREE.BoxGeometry(0.12, h, w), frameM); f.position.set(-4.36, y, -3.2 + dz); H.scene.add(f); });
  const hinge = new THREE.Group(); hinge.position.set(-4.34, 0, -3.2 + 0.5); H.scene.add(hinge);
  const doorP = new THREE.Mesh(new THREE.BoxGeometry(0.06, 2.1, 1.0), WD.mat({ color: '#B5853A' })); doorP.position.set(0, 1.05, -0.5); doorP.castShadow = true; hinge.add(doorP);
  const knob = new THREE.Mesh(new THREE.SphereGeometry(0.05, 10, 8), WD.mat({ color: '#E2B33C', metalness: 0.6 })); knob.position.set(0.06, 1.0, -0.88); hinge.add(knob);
  // the window in the floor
  const fw = new THREE.Group(); const glow = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 1.2), new THREE.MeshBasicMaterial({ map: WD.canvasTex('floorwin', 256, 256, (c) => { const gr = c.createLinearGradient(0, 0, 256, 256); gr.addColorStop(0, '#9CC7E4'); gr.addColorStop(1, '#3F6E9A'); c.fillStyle = gr; c.fillRect(0, 0, 256, 256); c.fillStyle = '#5A3420'; c.fillRect(122, 0, 12, 256); c.fillRect(0, 122, 256, 12); c.fillStyle = 'rgba(255,255,255,0.5)'; c.beginPath(); c.moveTo(20, 60); c.lineTo(60, 20); c.lineTo(80, 20); c.lineTo(20, 80); c.fill(); }) }));
  glow.rotation.x = -Math.PI / 2; glow.position.y = 0.012; fw.add(glow);
  [[0, -0.64, 1.4, 0.1], [0, 0.64, 1.4, 0.1], [-0.64, 0, 0.1, 1.4], [0.64, 0, 0.1, 1.4]].forEach(([x, z, w, d]) => { const f = new THREE.Mesh(new THREE.BoxGeometry(w, 0.04, d), frameM); f.position.set(x, 0.02, z); fw.add(f); });
  fw.position.set(-1.4, 0, -4.4); H.scene.add(fw);
  H.sun.key.target.position.set(0, 0, -3); H.sun.key.position.set(-2, 6, -12);
  const sarah = mk('sarah'), g1 = mk('ghost', { res: 1 }), g2 = mk('ghost', { res: 1 }), g3 = mk('ghost', { res: 1 });
  [g1, g2, g3].forEach((g) => { g.mat.opacity = 0.6; g.tint('#CFE4FF'); });
  const hall = [sarah, g1, g2, g3]; hall.forEach((p) => H.scene.add(p.group));
  const onlyH = (...keep) => hall.forEach((p) => (p.group.visible = keep.includes(p)));

  // ── OUTSIDE: meadow (farmhouse that grows into a sprawl) + a factory ──
  const M = WD.meadow(E, { fenceOn: true });
  const parts = []; const addPart = (o, x, z, ry = 0, s = 1) => { o.position.set(x, 0, z); o.rotation.y = ry; o.userData.s = s; o.scale.setScalar(s); M.scene.add(o); parts.push(o); return o; };
  addPart(PR.house({ wall: '#E9D7A5', roof: '#6A4A6A', door: '#7A2E2E' }), 0, -10);
  const tower = (h, col) => { const g = new THREE.Group(); const c = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.1, h, 16), WD.mat({ map: WD.T.siding(col, [3, h / 2]) })); c.position.y = h / 2; c.castShadow = true; g.add(c);
    const r = new THREE.Mesh(new THREE.ConeGeometry(1.4, 2.4, 16), WD.mat({ color: '#5A3A5A' })); r.position.y = h + 1.2; r.castShadow = true; g.add(r); return g; };
  [[PR.house({ wall: '#D9C48A', roof: '#5A4A6A' }), -6.5, -11, 0.3, 1], [tower(8, '#E9D7A5'), 4.2, -12, 0, 1], [PR.house({ wall: '#F2E6CF', roof: '#7A3A5A' }), 7.5, -14, -0.4, 1.1],
    [tower(11, '#D9C48A'), -3.6, -15, 0, 1], [PR.house({ wall: '#E9D7A5', roof: '#6A4A6A' }), -10, -16, 0.5, 1.2], [PR.house({ wall: '#D9C48A', roof: '#5A3A5A' }), 2.5, -18, 0, 1.4], [tower(9, '#F2E6CF'), 10.5, -18, 0, 1],
    [PR.house({ wall: '#F2E6CF', roof: '#6A4A6A' }), -7, -21, 0.2, 1.3], [tower(13, '#E9D7A5'), 0.5, -23, 0, 1.1], [PR.house({ wall: '#E9D7A5', roof: '#7A3A5A' }), 8, -24, -0.3, 1.5]].forEach(([o, x, z, r, s]) => addPart(o, x, z, r, s));
  const grow = (n) => parts.forEach((p, i) => { const a = clamp(n - i); p.visible = a > 0; p.scale.setScalar(p.userData.s * (i === 0 ? 1 : eob(a))); });
  const fac = new THREE.Group(); const fb = new THREE.Mesh(new THREE.BoxGeometry(9, 5, 5), WD.mat({ map: WD.T.brick('#9E4A3A', [3, 2]) })); fb.position.y = 2.5; fb.castShadow = true; fac.add(fb);
  [-2.5, 0.5, 3].forEach((x) => { const ch = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.5, 4, 12), WD.mat({ map: WD.T.brick('#7A3A2E', [1, 2]) })); ch.position.set(x, 7, -1); ch.castShadow = true; fac.add(ch); });
  const fsign = WD.signBoard('RIFLE CO.', { w: 4.2, h: 0.9, bg: '#2E4E3F', fg: '#F2D37A' }); fsign.position.set(0, 4.2, 2.56); fac.add(fsign);
  fac.position.set(30, 0, -12); M.scene.add(fac);
  const smokes = [-2.5, 0.5, 3].map((x) => { const s = smokeVent(10, 1.2, '#D4D0D8'); s.position.set(30 + x, 9, -13); M.scene.add(s); return s; });
  const crates = []; for (let i = 0; i < 6; i++) { const c = WD.crate(0.7); c.position.set(27 + (i % 3) * 0.8, 0.7 * Math.floor(i / 3), -8.5); M.scene.add(c); crates.push(c); }
  M.sun.key.target.position.set(0, 0, -8); M.sun.key.position.set(10, 14, 4);
  const msarah = mk('sarah'), lawyer = mk('lawyer'), b1 = mk('b1'), b2 = mk('b2'), b3 = mk('b3'), prof = mk('prof');
  const out = [msarah, lawyer, b1, b2, b3, prof]; out.forEach((p) => M.scene.add(p.group));
  const money = PR.moneyStack(26); money.position.set(1.0, 0, -4.2); M.scene.add(money);
  const onlyM = (...keep) => { out.forEach((p) => (p.group.visible = keep.includes(p))); money.visible = keep.includes(money); };
  const smokeAll = (t) => smokes.forEach((s) => s.update(t));

  // ═══ SHOTS ═══
  // 1a · frame 0: low angle up the stairs that run into the ceiling; Sarah at the bottom; hook STAIRS TO NOWHERE?
  { const st = 0, ws = Wd('stairs', 0);
    add({ id: 'S01a', at: st, note: 'frame 0: low angle up a staircase whose top step runs into the ceiling; a woman in black (Sarah toon) stands at its foot looking up; hook STAIRS TO NOWHERE?', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); onlyH(sarah); hinge.rotation.y = 0;
      sarah.at(1.3, 0, -1.2); sarah.set({ mood: 'sly', look: [0.4, -0.8], armL: [20, 10], armR: [100, -30], blink: blink(t) });
      shoot(H.scene, hall, V3(-0.6, 0.7, 2.2), V3(-0.4, 0.8, 1.6), V3(2.0, 2.5, -3.6), V3(2.4, 3.0, -4.4), k, { ...LK.room, fov: 60 });
      blit(); hook(['STAIRS TO', 'NOWHERE?'], 1, { y: 300, size: 136, hiLine: 1 });
    } });
    cue(0, 'pop', { gain: 0.5 }); cue(ws, 'tock', { gain: 0.5 }); }
  // 1b · "that lead into the ceiling?" crane up the stairs to the top step jammed against the ceiling; ? pops
  { const st = Wd('lead', 0) - 0.15, wc = Wd('ceiling', 0);
    add({ id: 'S01b', at: st, note: 'camera climbs the staircase to the top step, which runs flat into the ceiling; a big ? bounces in on "ceiling"', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); onlyH();
      shoot(H.scene, hall, V3(2.2, 1.6, 0.6), V3(2.0, 3.0, -2.0), V3(2.6, 2.6, -4.0), V3(STOP.x, 4.1, STOP.z), k, { ...LK.room, fov: 56 }, undefined, lerp(0, 0.1, k));
      blit(); mark('?', 540, 520, (t - wc) / 0.3); pill('DEAD END', (t - wc - 0.2) / 0.25, 300, 'rgba(160,30,40,0.92)', 64);
    } });
    cue(st, 'slide', { dur: 0.8, gain: 0.5 }); cue(wc, 'boing', { gain: 0.7 }); }

  // 2 · "Sarah Winchester did." Sarah turns to camera, sly smile; pill SARAH WINCHESTER
  { const st = cut(1), wd = Wd('did', 1);
    add({ id: 'S02', at: st, note: 'push-in: Sarah turns to the camera at the foot of the stairs with a sly smile; pill SARAH WINCHESTER', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); onlyH(sarah);
      sarah.at(1.3, 0, -1.6); sarah.set({ mood: t > wd ? 'smug' : 'sly', armL: [20, 10], armR: t > wd ? [130, -100] : [20, 10], talk: talk(t), blink: blink(t) });
      shoot(H.scene, hall, V3(-0.6, 1.5, 2.6), V3(0.0, 1.5, 1.6), V3(1.3, 1.4, -1.6), null, k, { ...LK.room, fov: 48 });
      blit(); pill('SARAH WINCHESTER', (t - st - 0.1) / 0.25, 300, 'rgba(31,28,51,0.9)', 62);
    } });
    cue(st + 0.1, 'pop', { gain: 0.6 }); }

  // 3a · "Her late husband's family" Sarah in black mourning in the meadow, sad
  { const st = cut(2), wl = Wd('late', 2);
    add({ id: 'S03a', at: st, note: 'outside under grey-pink sky: Sarah in her black mourning dress lowers her head, sad; pill WIDOW', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); onlyM(msarah); grow(0); smokeAll(t);
      msarah.at(-1.0, 0, -3.8); msarah.set({ mood: 'sad', tears: 1, look: [0, 0.6], armL: [60, -80], armR: [60, -80], blink: blink(t) });
      shoot(M.scene, out, V3(1.4, 1.8, 0.4), V3(0.6, 1.6, -0.2), V3(-1.0, 1.3, -3.8), null, k, { ...LK.day, fov: 48 });
      blit(); pill('A YOUNG WIDOW', (t - wl) / 0.25, 300, 'rgba(31,28,51,0.9)', 58);
    } });
    cue(st, 'whoosh', { gain: 0.5 }); }
  // 3b · "made the Winchester rifle," the big brick factory, smoke, crates stack up; ribbon THE WINCHESTER RIFLE
  { const st = Wd('made', 2) - 0.12, wr = Wd('rifle', 2);
    add({ id: 'S03b', at: st, note: 'wide crane on a big brick factory with smoking chimneys and a RIFLE CO. sign; crates stack up out front; gold ribbon WINCHESTER RIFLES', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); onlyM(); smokeAll(t); crates.forEach((c, i) => (c.visible = lt > 0.15 + i * 0.15));
      shoot(M.scene, out, V3(24, 2.0, 2.0), V3(25, 5.0, 4.0), V3(30, 3.4, -12), null, k, { ...LK.day, fov: 54 });
      blit(); ribbon('WINCHESTER RIFLES', (t - wr + 0.1) / 0.3, 330, 76);
    } });
    cue(st, 'slide', { dur: 0.6, gain: 0.5 }); cue(wr, 'stamp', { gain: 0.7 }); }

  // 4a · "and she inherited" a lawyer hands Sarah the will
  { const st = cut(3), wi = Wd('inherited', 3);
    add({ id: 'S04a', at: st, note: 'a lawyer toon in a bowler hands Sarah a paper marked WILL; she looks at it in shock; ! pops', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); onlyM(msarah, lawyer); grow(0); crates.forEach((c) => (c.visible = false));
      lawyer.at(1.0, 0, -4.4); lawyer.set({ mood: 'proud', armL: [100, -20], holdL: PROPS.paper('WILL'), v: 'w', armR: [20, 10], talk: talk(t), blink: blink(t) });
      msarah.at(-0.6, 0, -4.0); msarah.set({ mood: t > wi ? 'shock' : 'sad', armL: [20, 10], armR: t > wi ? [140, 10] : [20, 10], look: [0.6, 0], blink: 0 });
      shoot(M.scene, out, V3(-0.2, 1.5, 0.8), V3(0.2, 1.45, 0.0), V3(0.2, 1.3, -4.2), null, k, { ...LK.day, fov: 50 });
      blit(); mark('!', 380, 360, (t - wi) / 0.25);
    } });
    cue(wi, 'pop', { gain: 0.6 }); }
  // 4b · "about twenty million dollars." a money stack rockets up, counter, cash rain
  { const st = Wd('about', 3) - 0.12, wm = Wd('twenty', 3);
    add({ id: 'S04b', at: st, note: 'a money stack grows taller than Sarah with a camera shake; counter $20 MILLION; cash rain', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); onlyM(msarah, money); grow(0); money.set(lerp(0, 26, eo(clamp((t - wm + 0.2) / 0.8))));
      msarah.at(-0.6, 0, -4.0); msarah.set({ mood: 'happy', armL: [150, 10], armR: [150, 10], look: [0.6, -0.6], blink: blink(t) });
      shoot(M.scene, out, V3(-0.2, 0.8, 1.2).add(shake(t, wm + 0.3)), V3(0.0, 1.0, 0.4), V3(0.3, 2.0, -4.2), null, k, { ...LK.day, fov: 56 });
      blit(); counter('$' + Math.round(lerp(0, 20, eo(clamp((t - wm) / 0.8)))) + ' MILLION', (t - wm + 0.1) / 0.3, 'ABOUT, IN THE 1880s', 330, 760); cashRain(t, wm, 20);
    } });
    cue(wm, 'ding', { gain: 0.7 }); cue(wm + 0.3, 'slam', { gain: 0.6 }); }

  // 5a · "In eighteen eighty-six," crane down on a small farmhouse; calendar 1886
  { const st = cut(4), wy = Wd('eighteen', 4);
    add({ id: 'S05a', at: st, note: 'crane down from the sky onto a little farmhouse in a field; calendar card 1886 slams', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); onlyM(); grow(1); money.visible = false;
      shoot(M.scene, out, V3(3, 12, 8).add(shake(t, wy + 0.15)), V3(2.0, 2.6, 3.0), V3(0, 1, -10), V3(0, 2.4, -10), k, { ...LK.day, fov: 52 });
      blit(); calCard('THE YEAR', '1886', 540, 450, eob(clamp((t - wy) / 0.25)), -0.06);
    } });
    cue(st, 'slide', { dur: 0.6, gain: 0.5 }); cue(wy + 0.15, 'slam', { gain: 0.7 }); }
  // 5b · "she bought a farmhouse in San Jose," Sarah walks up to the house holding a SOLD sign
  { const st = Wd('she', 4) - 0.12, wj = Wd('jose', 4);
    add({ id: 'S05b', at: st, note: 'Sarah walks up the path to the farmhouse holding a SOLD sign; pill SAN JOSE, CALIFORNIA', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); onlyM(msarah); grow(1); const a = clamp(lt / d);
      msarah.at(lerp(-2.6, -0.8, a), 0, lerp(-2.4, -5.0, a)); msarah.set({ mood: 'proud', legs: 'walk', phase: t * 7, armR: [150, 0], holdR: PROPS.sign('SOLD!', '#FFE08A'), v: 's', armL: [20, 10], blink: blink(t) });
      shoot(M.scene, out, V3(-3.6, 1.6, 1.8), V3(-2.4, 1.8, 0.6), V3(-1.4, 1.6, -4.2), V3(-0.6, 2.0, -8), k, { ...LK.day, fov: 52 });
      blit(); pill('SAN JOSE, CALIFORNIA', (t - wj + 0.4) / 0.25, 300, 'rgba(31,28,51,0.9)', 54);
    } });
    cue(wj, 'ding', { gain: 0.5 }); }

  // 6a · "and kept building" builders hammer, new wings pop up with dust
  { const st = cut(5), wb = Wd('building', 5);
    add({ id: 'S06a', at: st, note: 'three builder toons hammer away; new wings and a tower pop up behind them with a bounce; stars on each pop', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); onlyM(b1, b2, b3); grow(1 + clamp((t - wb + 0.2) / 0.8) * 2.2);
      [b1, b2, b3].forEach((p, i) => { p.at(-2.4 + i * 1.6, 0, -4.6 - (i % 2) * 0.6); p.set({ mood: ['happy', 'smug', 'laugh'][i], armR: [lerp(60, 150, Math.abs(Math.sin(t * 12 + i))), -20], holdR: hammer, v: 'h', armL: [20, 10], bob: Math.abs(Math.sin(t * 12 + i)) * 3 }); });
      shoot(M.scene, out, V3(-1.2, 1.4, 1.6), V3(-0.6, 2.2, 2.4), V3(-0.8, 2.4, -9), null, k, { ...LK.day, fov: 54 });
      blit(); stars(380, 520, (t - wb) / 0.7); stars(720, 460, (t - wb - 0.4) / 0.7);
    } });
    cue(st, 'thud', { gain: 0.4 }); cue(wb, 'pop', { gain: 0.6 }); cue(wb + 0.4, 'pop', { gain: 0.6 }); }
  // 6b · "for thirty-six years." calendar pages fly; counter 1886 -> 1922
  { const st = Wd('for', 5) - 0.1, wy = Wd('thirty', 5);
    add({ id: 'S06b', at: st, note: 'low angle: builders keep hammering at dusk light; calendar pages fly off as the year counter ticks 1886 to 1922; badge 36 YEARS', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); onlyM(b1, b2); grow(3.2 + k * 1.5);
      b1.at(-1.4, 0, -5.0); b1.set({ mood: 'tired', sweat: 1, armR: [lerp(60, 150, Math.abs(Math.sin(t * 12))), -20], holdR: hammer, v: 'h', armL: [20, 10] });
      b2.at(0.6, 0, -5.6); b2.set({ mood: 'tired', armL: [lerp(60, 150, Math.abs(Math.sin(t * 12 + 1))), -20], holdL: hammer, v: 'h2', armR: [20, 10], legs: 'stand' });
      shoot(M.scene, out, V3(0.6, 0.6, 0.0), V3(-0.4, 0.7, -0.4), V3(-0.4, 2.6, -8), null, k, { ...LK.day, fov: 56 });
      blit(); const yr = Math.round(lerp(1886, 1922, eo(clamp((t - st) / (d * 0.9)))));
      for (let i = 0; i < 4; i++) { const pk = (lt * 2.4 + i * 0.25) % 1; calCard('YEAR', String(yr), 540 + pk * 500 * (i % 2 ? 1 : -1), 450 - pk * 300, 1 - pk * 0.4, pk * 2 * (i % 2 ? 1 : -1)); }
      calCard('YEAR', String(yr), 540, 450, 1, -0.04); pill('36 YEARS', (t - wy - 0.2) / 0.25, 720, 'rgba(160,30,40,0.92)', 64);
    } });
    cue(st, 'zip', { gain: 0.4 }); cue(wy, 'tock', { gain: 0.6 }); }

  // 7a · "It grew to about" aerial pull-back over the sprawling mansion as wings keep popping in
  { const st = cut(6), wg = Wd('grew', 6);
    add({ id: 'S07a', at: st, note: 'aerial pull-back: the farmhouse has become a huge sprawl of wings and towers, more popping in', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); onlyM(); grow(4.7 + clamp(lt / d) * 6.3);
      shoot(M.scene, out, V3(2, 6, 4), V3(4, 14, 14), V3(0, 2, -15), V3(0, 3, -17), k, { ...LK.day, fov: 54 });
      blit(); if (lt < 0.15) speedLines(1 - lt / 0.15, 2);
    } });
    cue(st, 'whoosh', { gain: 0.6 }); cue(wg, 'pop', { gain: 0.5 }); cue(wg + 0.4, 'pop', { gain: 0.5 }); }
  // 7b · "a hundred and sixty rooms," orbit + counter ticking to 160
  { const st = Wd('hundred', 6) - 0.25, wh = Wd('hundred', 6);
    add({ id: 'S07b', at: st, note: 'slow orbit over the finished sprawl; counter ticks up to 160 ROOMS with a slam', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); onlyM(); grow(11);
      const a = lerp(0.5, 0.1, k), c = V3(0, 3, -16); const cp = V3(c.x + Math.sin(a) * 26, 11, c.z + Math.cos(a) * 26);
      shoot(M.scene, out, cp.add(shake(t, wh + 0.7)), cp, c, null, 0, { ...LK.day, fov: 52 });
      blit(); counter(String(Math.round(lerp(1, 160, eo(clamp((t - wh) / 0.7))))), (t - st) / 0.25, 'ROOMS (ABOUT)', 330, 520);
    } });
    cue(wh + 0.7, 'slam', { gain: 0.8 }); }

  // 8 · "with doors that open onto walls," Sarah opens a door: bricks; ? pops
  { const st = cut(7), wo = Wd('open', 7), ww = Wd('walls', 7);
    add({ id: 'S08', at: st, note: 'hall: Sarah swings open a door on the side wall and finds solid brick behind it; she shrugs; ? pops on "walls"', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); onlyH(sarah); hinge.rotation.y = -lerp(0, 1.7, eo(clamp((t - wo + 0.1) / 0.4)));
      sarah.at(-3.3, 0, -1.8); sarah.set({ mood: t > ww ? 'smug' : 'neutral', armL: t > ww ? [100, 60] : [100, -20], armR: t > ww ? [100, 60] : [20, 10], look: [-0.7, 0], blink: blink(t) });
      shoot(H.scene, hall, V3(-1.0, 1.5, -3.9), V3(-1.3, 1.5, -3.6), V3(-4.3, 1.1, -2.7), null, k, { ...LK.room, fov: 56 });
      blit(); mark('?', 700, 380, (t - ww) / 0.3);
    } });
    cue(wo, 'zip', { gain: 0.5 }); cue(ww, 'thud', { gain: 0.6 }); }
  // 9 · "and a window in the floor." high angle: Sarah peers down through a window set in the floor
  { const st = cut(8), wf = Wd('floor', 8);
    add({ id: 'S09', at: st, note: 'top-down: Sarah leans over a glass window set in the floor and peers down; pill A WINDOW... IN THE FLOOR', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); onlyH(sarah); hinge.rotation.y = 0;
      sarah.at(-1.4, 0, -3.1); sarah.set({ mood: 'shock', lean: 12, look: [0, 0.9], armL: [60, -40], armR: [60, -40], blink: 0 });
      shoot(H.scene, hall, V3(0.2, 3.6, -1.6), V3(-0.4, 3.4, -2.2), V3(-1.4, 0, -4.2), null, k, { ...LK.room, fov: 56 }, undefined, lerp(0, 0.1, k));
      blit(); pill('A WINDOW... IN THE FLOOR', (t - wf) / 0.25, 300, 'rgba(31,28,51,0.9)', 52);
    } });
    cue(wf, 'ding', { gain: 0.5 }); }

  // 10 · "Subscribe for more strange true stories." Sarah on the stairs points at the viewer
  { const st = cut(9);
    add({ id: 'S10', at: st, note: 'Sarah stands on the bottom steps and points at the viewer; SUBSCRIBE button pressed', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); onlyH(sarah);
      sarah.at(1.3, 0, -1.2); sarah.set({ mood: 'happy', armR: [95, 0], armL: [20, 10], talk: talk(t), blink: blink(t) });
      shoot(H.scene, hall, V3(0.2, 1.5, 2.4), V3(0.4, 1.5, 1.6), V3(1.3, 1.3, -1.2), null, k, { ...LK.room, fov: 46 });
      blit(); subscribe(lt / 0.45 + (lt > 0.8 ? (lt - 0.8) * 1.4 : 0), t, 330);
    } });
    cue(st, 'pop', { gain: 0.6 }); cue(st + 1.25, 'ding', { gain: 0.6 }); }

  // 11a · "Legend says spirits" blue light, ghost toons float around Sarah
  { const st = cut(10), ws = Wd('spirits', 10);
    add({ id: 'S11a', at: st, note: 'the hall turns moody blue; three pale see-through ghost toons float up around Sarah; she looks up, worried', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); onlyH(sarah, g1, g2); const up = eo(clamp((t - ws + 0.2) / 0.6));
      sarah.at(-0.2, 0, -3.0); sarah.set({ mood: 'worried', sweat: 1, look: [0, -0.6], armL: [60, -80], armR: [60, -80], blink: blink(t) });
      [[g1, -1.3, -3.9], [g2, 1.0, -4.0]].forEach(([g, x, z], i) => { g.at(x, lerp(-1.6, 0.3, up) + Math.sin(t * 3 + i) * 0.12, z); g.set({ mood: 'sly', armL: [110, -20], armR: [110, -20], look: [i === 0 ? 0.6 : -0.6, 0] }); });
      shoot(H.scene, hall, V3(0.3, 1.4, 2.6), V3(0.1, 1.6, 1.6), V3(-0.2, 1.5, -3.8), null, k, { ...LK.room, fov: 60 });
      blit(); tint(0.9, '#2A4AA0');
    } });
    cue(ws, 'inhale', { dur: 1.0, gain: 0.5 }); }
  // 11b · "told her to never stop building." ghosts point; stamp NEVER STOP!
  { const st = Wd('told', 10) - 0.12, wn = Wd('never', 10);
    add({ id: 'S11b', at: st, note: 'close: the ghosts lean in and point at the stairs, Dutch tilt; stamp NEVER STOP BUILDING!', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); onlyH(sarah, g1, g2);
      sarah.at(-0.2, 0, -3.0); sarah.set({ mood: 'shock', armL: [150, 10], armR: [150, 10], blink: 0 });
      g1.at(-1.2, 0.3 + Math.sin(t * 3) * 0.1, -3.6); g1.set({ mood: 'sly', armR: [95, 0], armL: [20, 10], talk: talk(t), lean: 10 });
      g2.at(1.0, 0.3 + Math.sin(t * 3 + 1) * 0.1, -3.9); g2.set({ mood: 'sly', armL: [95, 0], armR: [20, 10], talk: talk(t + 0.4), lean: -10 });
      shoot(H.scene, hall, V3(-0.2, 1.5, 1.4).add(shake(t, wn)), V3(-0.2, 1.6, 0.6), V3(-0.1, 1.6, -3.4), null, k, { ...LK.room, fov: 56 }, undefined, lerp(-0.06, -0.14, k));
      blit(); tint(0.9, '#2A4AA0'); stamp(['NEVER STOP', 'BUILDING!'], (t - wn) / 0.2, { y: 420, size: 84, col: '#E3262E' });
    } });
    cue(wn, 'slam', { gain: 0.8 }); }

  // 12a · "Historians think" a historian toon with a book shakes his head; pill HISTORIANS
  { const st = cut(11), wh = Wd('historians', 11);
    add({ id: 'S12a', at: st, note: 'daylight again: a historian toon with glasses holds an open book and raises a finger; pill MOST HISTORIANS SAY...', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); onlyM(prof); grow(11);
      prof.at(-0.6, 0, -4.0); prof.set({ mood: 'smug', armL: [100, -40], holdL: PROPS.book('HISTORY', 1), v: 'bk', armR: [150, 0], talk: talk(t), blink: blink(t) });
      shoot(M.scene, out, V3(1.2, 1.6, 0.0), V3(0.6, 1.5, -0.8), V3(-0.4, 1.4, -4.0), null, k, { ...LK.day, fov: 48 });
      blit(); pill('HISTORIANS SAY...', (t - wh) / 0.25, 300, 'rgba(31,28,51,0.9)', 60);
    } });
    cue(wh, 'pop', { gain: 0.6 }); }
  // 12b · "she just loved designing." Sarah proudly unrolls blueprints; hearts of sparkles
  { const st = Wd('she', 11) - 0.12, wd = Wd('designing', 11);
    add({ id: 'S12b', at: st, note: 'Sarah holds up blueprints proudly in front of her sprawling house, sparkles on "designing"', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); onlyM(msarah); grow(11);
      msarah.at(0.4, 0, -4.6); msarah.set({ mood: 'proud', armR: [150, 0], holdR: plans, v: 'pl', armL: [100, -30], blink: blink(t) });
      shoot(M.scene, out, V3(-1.2, 1.0, 0.4), V3(-0.4, 1.2, -0.4), V3(0.4, 1.8, -5.0), null, k, { ...LK.day, fov: 54 });
      blit(); stars(540, 560, (t - wd) / 0.9);
    } });
    cue(wd, 'sparkle', { gain: 0.7 }); }

  // 13 · "But nobody knows for sure, so..." back to the stairs (loop), hook returns
  { const st = cut(12), wn = Wd('nobody', 12);
    add({ id: 'S13', at: st, note: 'loop: back in the hall, Sarah at the foot of the stairs to the ceiling shrugs; a ? then the hook STAIRS TO NOWHERE? returns', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); onlyH(sarah); hinge.rotation.y = 0;
      sarah.at(1.3, 0, -1.2); sarah.set({ mood: 'sly', look: [0.4, -0.8], armL: [100, 60], armR: [100, 60], blink: blink(t) });
      shoot(H.scene, hall, V3(-0.9, 0.9, 3.2), V3(-0.6, 0.7, 2.2), V3(2.0, 2.2, -3.4), null, k, { ...LK.room, fov: 58 });
      blit(); mark('?', 760, 640, (t - wn) / 0.3); hook(['STAIRS TO', 'NOWHERE?'], (lt - 0.8) / 0.4, { y: 300, size: 136, hiLine: 1 });
    } });
    cue(st, 'whoosh', { gain: 0.5 }); cue(wn, 'boing', { gain: 0.5 }); }

  return { shots: S, cues: CUES };
}
