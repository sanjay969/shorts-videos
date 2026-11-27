// HE LIVED IN HER ATTIC FOR 10 YEARS (Dolly Oesterreich & Otto Sanhuber, Milwaukee 1913 -> Los Angeles, exposed 1930) — Tall Tale 3D, mystery tone, US audience.
// Respectful: the 1922 death is shown only as a dark house, a date and a hat on the floor. No weapon, no victim. Generic toons, no likeness.
import * as THREE from 'three';
import { ctx, clamp, lerp, eo, eio, eob, rnd } from './core/lib.js';
import { L, Le, Wd, T } from './core/timing.js';
import * as WD from './core/world.js';
import * as PR from './core/props.js';
import { Toon, PROPS, INK } from './core/toon.js';
import { V3, talk, blink, hook, ribbon, pill, stamp, calCard, counter, flash, tint, speedLines, stars, mark, subscribe, makeShoot, LK } from './jh.js';

const LOOKS = {
  otto: { body: '#5C6F8F', pattern: 'vest', patCol: '#3A4A6A', hat: 'cap', hatCol: '#2A2638', neck: 'none' },
  dolly: { body: '#D86A8A', pattern: 'apron', patCol: '#F4EFE4', hat: 'bun', hatCol: '#5A3A2A', neck: 'collar', neckCol: '#FFFFFF' },
  fred: { body: '#4A4560', pattern: 'vest', patCol: '#2A2638', hat: 'bowler', hatCol: '#1F1C33', neck: 'tie', neckCol: '#B5372E', extra: ['mustache'] },
  cop: { body: '#24365C', pattern: 'vest', patCol: '#1A2440', hat: 'mailcap', hatCol: '#1E2A48', neck: 'tie', neckCol: '#1E2A48' },
  news: { body: '#E8734A', pattern: 'stripes', patCol: '#F2C230', hat: 'cap', hatCol: '#7A4A2A', kid: true, extra: ['freckles'] },
};
const mk = (k, o) => new Toon({ ...LOOKS[k], extra: [...(LOOKS[k].extra || [])] }, o);
const broom = function broom(g, x, y) { g.save(); g.translate(x, y); g.rotate(0.35); g.strokeStyle = '#7A4A2A'; g.lineWidth = 10; g.lineCap = 'round'; g.beginPath(); g.moveTo(0, -80); g.lineTo(0, 150); g.stroke(); g.fillStyle = '#E2B33C'; g.strokeStyle = INK; g.lineWidth = 5; g.beginPath(); g.moveTo(-40, 210); g.lineTo(-18, 145); g.lineTo(18, 145); g.lineTo(40, 210); g.closePath(); g.fill(); g.stroke(); g.restore(); };
const quill = function quill(g, x, y) { g.save(); g.translate(x, y - 40); g.rotate(-0.5); g.fillStyle = '#FFFDF4'; g.strokeStyle = INK; g.lineWidth = 4; g.beginPath(); g.ellipse(0, -30, 14, 50, 0, 0, 7); g.fill(); g.stroke(); g.beginPath(); g.moveTo(0, 20); g.lineTo(0, 50); g.stroke(); g.restore(); };
const toolbox = function toolbox(g, x, y) { g.save(); g.translate(x, y - 20); g.strokeStyle = INK; g.lineWidth = 5; g.fillStyle = '#B5372E'; g.beginPath(); g.rect(-60, -20, 120, 60); g.fill(); g.stroke(); g.beginPath(); g.arc(0, -20, 24, Math.PI, 0); g.stroke(); g.restore(); };
const notepad = function notepad(g, x, y) { g.save(); g.translate(x, y - 50); g.rotate(0.1); g.fillStyle = '#FFFDF4'; g.strokeStyle = INK; g.lineWidth = 5; g.beginPath(); g.rect(-40, -55, 80, 110); g.fill(); g.stroke(); g.fillStyle = '#9B958A'; for (let i = 0; i < 4; i++) g.fillRect(-28, -30 + i * 20, 56, 6); g.restore(); };
const paperBat = function paperBat(g, x, y) { PROPS.paper('BAT MAN!')(g, x, y); };

// a big newspaper flying in (2D)
function newspaper(k, head, sub, y = 560) { if (k <= 0) return; const a = eob(clamp(k)); ctx.save(); ctx.translate(540, y); ctx.rotate(lerp(-3, -0.06, eo(clamp(k)))); ctx.scale(a, a);
  ctx.fillStyle = '#F2EDE0'; ctx.strokeStyle = INK; ctx.lineWidth = 10; ctx.beginPath(); ctx.rect(-360, -300, 720, 600); ctx.fill(); ctx.stroke();
  ctx.fillStyle = INK; ctx.font = '900 40px Caladea, serif'; ctx.textAlign = 'center'; ctx.fillText('THE DAILY NEWS · 1930', 0, -240); ctx.fillRect(-320, -220, 640, 6);
  ctx.font = '900 130px Inter'; ctx.fillText(head, 0, -80); ctx.font = '900 44px Inter'; ctx.fillStyle = '#B5372E'; ctx.fillText(sub, 0, 0);
  ctx.fillStyle = '#9B958A'; for (let i = 0; i < 6; i++) { ctx.fillRect(-320, 50 + i * 36, 300, 14); ctx.fillRect(20, 50 + i * 36, 300, 14); } ctx.restore(); }

function downArrow(t) { const b = Math.sin(t * 8) * 14; ctx.save(); ctx.translate(250, 860 + b); ctx.fillStyle = '#FFD43B'; ctx.strokeStyle = INK; ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(-30, -120); ctx.lineTo(30, -120); ctx.lineTo(30, 0); ctx.lineTo(70, 0); ctx.lineTo(0, 80); ctx.lineTo(-70, 0); ctx.lineTo(-30, 0); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.font = '900 46px Inter'; ctx.textAlign = 'center'; ctx.lineWidth = 12; ctx.strokeText('HUSBAND', 0, 150); ctx.fillStyle = '#FFFFFF'; ctx.fillText('HUSBAND', 0, 150); ctx.strokeText('BELOW', 0, 200); ctx.fillText('BELOW', 0, 200); ctx.restore(); }
export function buildShots(E) {
  const S = [], CUES = [], add = (o) => (S.push(o), o), cue = (t, type, o = {}) => CUES.push({ t: +Math.max(0, t).toFixed(3), type, ...o });
  const cut = (i) => (i === 0 ? 0 : L(i) - 0.06);
  const { shoot } = makeShoot(E);
  const shake = (t, t0, a = 0.08) => { const k = t - t0; if (k < 0 || k > 0.35) return V3(0, 0, 0); const f = (1 - k / 0.35) * a; return V3(Math.sin(k * 90) * f, Math.cos(k * 70) * f, 0); };

  // ── ATTIC (slanted roof, candle, cot, trapdoor) ──
  const A = new THREE.Scene(); A.background = new THREE.Color('#120C0A'); A.environment = E.envMap; A.environmentIntensity = 0.25;
  const wood = (c, r) => WD.mat({ map: WD.T.planks(c, r) });
  const fl = new THREE.Mesh(new THREE.PlaneGeometry(7, 8), wood('#8A5A34', [3, 3])); fl.rotation.x = -Math.PI / 2; fl.position.z = -2; fl.receiveShadow = true; A.add(fl);
  [-1, 1].forEach((s) => { const r = new THREE.Mesh(new THREE.BoxGeometry(4.4, 0.12, 8), wood('#6B4226', [2, 3])); r.position.set(s * 1.7, 1.75, -2); r.rotation.z = -s * 0.86; r.receiveShadow = true; A.add(r);
    for (let i = 0; i < 5; i++) { const b = new THREE.Mesh(new THREE.BoxGeometry(4.4, 0.16, 0.14), wood('#4E2E1A')); b.position.set(s * 1.62, 1.7, -5.4 + i * 1.6); b.rotation.z = -s * 0.86; A.add(b); } });
  const gsh = new THREE.Shape(); gsh.moveTo(-3.4, 0); gsh.lineTo(0, 3.35); gsh.lineTo(3.4, 0); gsh.closePath(); const hole = new THREE.Path(); hole.absarc(0, 1.9, 0.42, 0, Math.PI * 2, true); gsh.holes.push(hole);
  const gable = new THREE.Mesh(new THREE.ShapeGeometry(gsh), wood('#5A3820', [3, 2])); gable.position.set(0, 0, -5.6); A.add(gable);
  const win = new THREE.Mesh(new THREE.CircleGeometry(0.42, 32), new THREE.MeshBasicMaterial({ color: '#2A3A6A' })); win.position.set(0, 1.9, -5.65); A.add(win);
  const winF = new THREE.Mesh(new THREE.TorusGeometry(0.44, 0.05, 8, 32), wood('#3A2414')); winF.position.set(0, 1.9, -5.58); A.add(winF);
  const cot = new THREE.Group();
  const cotB = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.35, 1.9), wood('#7A4A2A')); cotB.position.set(0, 0.18, 0); cot.add(cotB); const mat2 = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.14, 1.8), WD.mat({ color: '#B8A27A' })); mat2.position.set(0, 0.42, 0); cot.add(mat2);
  cot.position.set(-1.9, 0, -3.6); cot.rotation.y = 0.1; cot.children.forEach((m) => (m.castShadow = true)); A.add(cot);
  const crate = WD.crate(0.6); crate.position.set(1.7, 0, -3.0); A.add(crate);
  const candle = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.22, 10), WD.mat({ color: '#FFF3D6' })); candle.position.set(1.7, 0.71, -3.0); A.add(candle);
  const flameM = new THREE.Mesh(new THREE.SphereGeometry(0.05, 10, 8), new THREE.MeshBasicMaterial({ color: '#FFD27A' })); flameM.scale.y = 1.8; flameM.position.set(1.7, 0.88, -3.0); A.add(flameM);
  const cl = new THREE.PointLight('#FFB060', 9, 9, 1.5); cl.position.set(1.6, 1.2, -2.6); cl.castShadow = true; cl.shadow.mapSize.set(1024, 1024); A.add(cl);
  A.add(new THREE.HemisphereLight('#FFD9B0', '#3A2414', 0.9));
  const moon = new THREE.DirectionalLight('#9FB8FF', 0.6); moon.position.set(0, 3, -9); A.add(moon);
  const papers = new THREE.Group(); for (let i = 0; i < 8; i++) { const p = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.03, 0.42), WD.mat({ color: '#F2EDE0' })); p.position.set(0, i * 0.035, 0); p.rotation.y = rnd(i) * 0.3; papers.add(p); } papers.position.set(1.0, 0, -3.3); A.add(papers);
  const trap = new THREE.Group(); trap.position.set(-0.2, 0.01, -1.4); A.add(trap);
  const trapHole = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.9), new THREE.MeshBasicMaterial({ color: '#FFE7B0' })); trapHole.rotation.x = -Math.PI / 2; trap.add(trapHole);
  const lidP = new THREE.Group(); lidP.position.set(0, 0.02, -0.45); trap.add(lidP); const lid = new THREE.Mesh(new THREE.BoxGeometry(0.92, 0.05, 0.92), wood('#5A3820')); lid.position.set(0, 0, 0.46); lidP.add(lid);
  const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.6, 3.2, 20, 1, true), new THREE.MeshBasicMaterial({ color: '#FFE7B0', transparent: true, opacity: 0.08, side: THREE.DoubleSide, depthWrite: false })); beam.position.set(-0.2, 1.6, -1.4); A.add(beam);
  const otto = mk('otto'), dollyA = mk('dolly'); [otto, dollyA].forEach((p) => A.add(p.group));
  const resetA = (night = true) => { lidP.rotation.x = 0; trapHole.visible = false; beam.visible = false; cl.intensity = 9 * (0.9 + 0.1 * Math.sin(performance.now() * 0)); papers.children.forEach((p, i) => (p.visible = true)); win.material.color.set(night ? '#2A3A6A' : '#9CC7E4'); dollyA.group.visible = false; };
  const setFlick = (t) => { cl.intensity = 8 + 1.2 * Math.sin(t * 17) + 0.6 * Math.sin(t * 31); flameM.scale.y = 1.8 + 0.3 * Math.sin(t * 23); };

  // ── OUTSIDE (house on a quiet street; palms for Los Angeles) ──
  const O = WD.meadow(E, { flowers: false, fenceOn: false, treesOn: false });
  const hs = PR.house({ wall: '#F2E6CF', roof: '#7A3E2E', door: '#2E4E3F' }); hs.position.set(0, 0, -6); hs.traverse((m) => { if (m.isMesh) { m.castShadow = true; m.receiveShadow = true; } }); O.scene.add(hs);
  const aw = new THREE.Mesh(new THREE.CircleGeometry(0.32, 24), new THREE.MeshBasicMaterial({ color: '#FFD27A' })); aw.position.set(0, 3.95, -6 + 2.27); O.scene.add(aw);
  const awF = new THREE.Mesh(new THREE.TorusGeometry(0.34, 0.05, 8, 24), WD.mat({ color: '#FFFFFF' })); awF.position.copy(aw.position); O.scene.add(awF);
  const palms = [[-5.2, -4.0, 6], [5.4, -4.6, 7], [-7.5, -9, 8], [8, -10, 7.5]].map(([x, z, h]) => { const p = PR.palm(h, 0.12); p.position.set(x, 0, z); O.scene.add(p); return p; });
  const elms = [[-5.4, -5, 1.3], [5.6, -6, 1.4]].map(([x, z, s]) => { const tr = WD.tree(s); tr.position.set(x, 0, z); O.scene.add(tr); return tr; });
  const path = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 6), WD.mat({ color: '#D9C9A8' })); path.rotation.x = -Math.PI / 2; path.position.set(0, 0.01, 0.6); O.scene.add(path);
  const dollyO = mk('dolly'), ottoO = mk('otto'), fredO = mk('fred'), copO = mk('cop'), news = mk('news', { height: 1.3 }); const castO = [dollyO, ottoO, fredO, copO, news]; castO.forEach((p) => O.scene.add(p.group));
  const onlyO = (...keep) => castO.forEach((p) => (p.group.visible = keep.includes(p)));
  const town = (la, night = false) => { palms.forEach((p) => (p.visible = la)); elms.forEach((e) => (e.visible = !la)); aw.material.color.set(night ? '#2A2A40' : '#FFD27A'); hs.door.rotation.y = 0; O.sun.key.intensity = night ? 0.5 : 2.6; };
  const HOUSE = V3(0, 2.2, -6);

  // ── LIVING ROOM (with a closet) ──
  const R = WD.interior(E, { w: 9, depth: 7, h: 4, wall: '#7A5A8A', motif: '#8A6A9A', floor: '#9A6A44', ceiling: '#3A2A3A', signText: null, picture: true, counterOn: false, litter: false });
  R.sun.key.target.position.set(0, 0, -3);
  const closet = new THREE.Group(); const cw = wood('#6B3E26', [1, 2]);
  const cBack = new THREE.Mesh(new THREE.BoxGeometry(1.8, 2.6, 0.1), cw); cBack.position.set(0, 1.3, -0.6); closet.add(cBack);
  [-1, 1].forEach((s) => { const sd = new THREE.Mesh(new THREE.BoxGeometry(0.1, 2.6, 1.2), cw); sd.position.set(s * 0.9, 1.3, 0); closet.add(sd); });
  const cTop = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.12, 1.3), cw); cTop.position.set(0, 2.62, 0); closet.add(cTop);
  const inner = new THREE.Mesh(new THREE.PlaneGeometry(1.7, 2.5), new THREE.MeshBasicMaterial({ color: '#2A1A14' })); inner.position.set(0, 1.3, -0.54); closet.add(inner);
  const cDoorP = new THREE.Group(); cDoorP.position.set(0.88, 0, 0.6); closet.add(cDoorP); const cDoor = new THREE.Mesh(new THREE.BoxGeometry(1.74, 2.5, 0.08), wood('#8A5A34', [1, 2])); cDoor.position.set(-0.87, 1.27, 0); cDoorP.add(cDoor);
  const knob = new THREE.Mesh(new THREE.SphereGeometry(0.06, 10, 8), WD.mat({ color: '#E2B33C', metalness: 0.6 })); knob.position.set(-1.6, 1.2, 0.07); cDoorP.add(knob);
  closet.position.set(2.4, 0, -4.6); closet.children.forEach((m) => (m.castShadow = true)); R.scene.add(closet);
  const hat = new THREE.Group(); const hb = new THREE.Mesh(new THREE.SphereGeometry(0.16, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2), WD.mat({ color: '#1F1C33' })); hat.add(hb); const hbr = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.26, 0.02, 24), WD.mat({ color: '#1F1C33' })); hat.add(hbr); hat.position.set(-0.6, 0.01, -2.8); hat.rotation.z = 0.2; R.scene.add(hat);
  const chair = new THREE.Group(); const chs = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.12, 0.7), wood('#7A4A2A')); chs.position.y = 0.5; chair.add(chs); const chb = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.9, 0.1), wood('#7A4A2A')); chb.position.set(0, 0.95, -0.3); chair.add(chb);
  [[-0.3, -0.3], [0.3, -0.3], [-0.3, 0.3], [0.3, 0.3]].forEach(([x, z]) => { const l = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.5, 0.07), wood('#5A3820')); l.position.set(x, 0.25, z); chair.add(l); }); chair.position.set(-2.2, 0, -4.4); chair.rotation.y = 0.4; chair.children.forEach((m) => (m.castShadow = true)); R.scene.add(chair);
  const ottoR = mk('otto'), dollyR = mk('dolly'), fredR = mk('fred'), copR = mk('cop'); const castR = [ottoR, dollyR, fredR, copR]; castR.forEach((p) => R.scene.add(p.group));
  const onlyR = (...keep) => castR.forEach((p) => (p.group.visible = keep.includes(p)));
  const resetR = () => { cDoorP.rotation.y = 0; hat.visible = false; };

  // ═══ SHOTS ═══
  // 1a · frame 0: Otto crouched in the candle-lit attic, finger to lips; hook 10 YEARS IN HER ATTIC?
  { const st = 0, wy = Wd('years,', 0);
    add({ id: 'S01a', at: st, note: 'frame 0: candle-lit attic under a slanted roof; a young man leans in with a finger to his lips (shh), cot and papers behind; hook 10 YEARS / IN HER ATTIC?', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); resetA(); setFlick(t);
      otto.at(0.2, 0, -2.6); otto.set({ mood: 'sly', armR: [45, -10], armL: [110, -130], lean: 8, look: [0.3, 0.6], blink: blink(t + 0.5) });
      shoot(A, [otto], V3(0.9, 1.1, 0.6), V3(0.6, 1.25, -0.3), V3(0.1, 1.35, -2.8), null, k, { ...LK.room, fov: 54 }, undefined, lerp(0.05, -0.02, k));
      blit(); hook(['ATTIC MAN', '10 YEARS?'], 1, { y: 300, size: 120, hiLine: 1 }); mark('!', 820, 640, (t - wy) / 0.3); downArrow(t);
    } });
    cue(0, 'slam', { gain: 0.6 }); cue(wy, 'boing', { gain: 0.4 }); }
  // 1a2 · "for ten years," closer on the candle and the stack of papers, Otto blows out... no: Otto peeks over the crate
  { const st = Wd('for', 0) - 0.1, wt = Wd('ten', 0);
    add({ id: 'S01a2', at: st, note: 'low close angle past the flickering candle and paper stack to Otto, who peers toward the trapdoor; counter 10 YEARS slams', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); resetA(); setFlick(t);
      otto.at(0.2, 0, -2.6); otto.set({ mood: 'worried', armR: [60, -70], armL: [20, 10], lean: -6, look: [-0.6, 0.4], blink: blink(t) });
      shoot(A, [otto], V3(2.2, 1.0, -0.8), V3(2.0, 1.1, -1.3), V3(0.3, 1.25, -2.7), null, k, { ...LK.room, fov: 52 }, undefined, -0.06);
      blit(); counter('10 YEARS', (t - wt) / 0.25, 'HIDDEN', 330, 600);
    } });
    cue(st, 'whoosh', { gain: 0.4 }); cue(wt + 0.1, 'slam', { gain: 0.6 }); }
  // 1b · "and her husband never found him." downstairs: husband stares up at the ceiling, ? marks; Otto's shadow
  { const st = Wd('and', 0) - 0.08, wn = Wd('never', 0);
    add({ id: 'S01b', at: st, note: 'cut downstairs: the husband in a bowler stares up at the ceiling, puzzled; dust sprinkles down; ? pops; pill HUSBAND NEVER KNEW', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); onlyR(fredR); resetR();
      fredR.at(-0.6, 0, -3.0); fredR.set({ mood: 'worried', look: [0.2, -1], armR: [150, -140], armL: [20, 10], blink: blink(t) });
      shoot(R.scene, castR, V3(-0.2, 0.7, 0.4), V3(-0.4, 0.9, -0.4), V3(-0.6, 2.0, -3.0), null, k, { ...LK.room, fov: 54 });
      blit(); mark('?', 760, 420, (t - wn) / 0.3); pill('HUSBAND NEVER KNEW', (t - wn + 0.1) / 0.25, 250, 'rgba(31,28,51,0.9)', 54);
      for (let i = 0; i < 14; i++) { const q = ((lt * 0.9 + i / 14) % 1); ctx.save(); ctx.globalAlpha = 0.7 * (1 - q); ctx.fillStyle = '#E8DCC0'; ctx.beginPath(); ctx.arc(380 + rnd(i) * 360, q * 900, 5, 0, 7); ctx.fill(); ctx.restore(); }
    } });
    cue(st, 'whoosh', { gain: 0.4 }); cue(wn, 'pop', { gain: 0.5 }); }

  // 2a · "In 1913, Dolly Oesterreich" Milwaukee house, Dolly on the porch path; ribbon 1913 · MILWAUKEE
  { const st = cut(1), w13 = Wd('nineteen', 1), wd = Wd('dolly', 1);
    add({ id: 'S02a', at: st, note: 'sunny small-town house with a round attic window: crane down as Dolly walks out on the path; ribbon 1913 · MILWAUKEE, pill DOLLY OESTERREICH', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); onlyO(dollyO); town(false);
      dollyO.at(lerp(-0.8, -0.2, eo(clamp(lt / 1.2))), 0, 0.3); dollyO.set({ mood: 'happy', legs: lt < 1.2 ? 'walk' : 'stand', phase: t * 6, armR: [20, 10], armL: [20, 10], blink: blink(t) });
      shoot(O.scene, castO, V3(1.6, 4.4, 7.4), V3(1.0, 1.8, 5.6), HOUSE, V3(-0.2, 1.5, 0), k, { ...LK.day, fov: 52 });
      blit(); ribbon('1913 · MILWAUKEE', (t - w13) / 0.3, 300, 76); pill('DOLLY OESTERREICH', (t - wd) / 0.25, 470, 'rgba(31,28,51,0.9)', 54);
    } });
    cue(st, 'whoosh', { gain: 0.5 }); cue(w13 + 0.2, 'stamp', { gain: 0.6 }); cue(wd, 'pop', { gain: 0.5 }); }
  // 2b · "met Otto, a young repairman," Otto walks up with a toolbox; hearts; pill OTTO, REPAIRMAN
  { const st = Wd('met', 1) - 0.1, wo = Wd('otto,', 1);
    add({ id: 'S02b', at: st, note: 'two-shot on the path: a young repairman with a red toolbox walks up and tips his cap; Dolly smiles; pill OTTO, A REPAIRMAN', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); onlyO(dollyO, ottoO); town(false);
      dollyO.at(-0.9, 0, 0.6); dollyO.set({ mood: 'sly', armR: [20, 10], armL: [60, -80], look: [0.6, 0], blink: blink(t) });
      ottoO.at(lerp(1.6, 0.4, eo(clamp(lt / 1.0))), 0, 0.8); ottoO.set({ mood: 'happy', legs: lt < 1.0 ? 'walk' : 'stand', phase: t * 7, armL: [40, -30], holdL: toolbox, v: 'tb', armR: lt > 1.0 ? [150, -120] : [20, 10], look: [-0.6, 0], blink: blink(t, 1) });
      shoot(O.scene, castO, V3(-0.6, 1.4, 5.2), V3(-0.2, 1.5, 4.4), V3(-0.2, 1.3, 0.6), null, k, { ...LK.day, fov: 50 });
      blit(); pill('OTTO, A REPAIRMAN', (t - wo) / 0.25, 300, 'rgba(31,28,51,0.9)', 58);
    } });
    cue(wo, 'pop', { gain: 0.5 }); }

  // 3 · "and hid him upstairs." crane up the house front to the attic window; stamp SHHH!
  { const st = cut(2), wu = Wd('upstairs.', 2);
    add({ id: 'S03', at: st, note: 'fast crane-up the front of the house to the little round attic window, which lights up; arrow points up; stamp SHHH!', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); onlyO(); town(false); aw.material.color.set(lt > 0.5 ? '#FFD27A' : '#5A4A3A');
      shoot(O.scene, castO, V3(0.6, 1.2, 4.6), V3(0.3, 4.2, 2.4), V3(0, 1.6, -3.6), V3(0, 3.9, -3.7), k, { ...LK.day, fov: 50 });
      blit(); stamp(['SHHH!'], (t - wu) / 0.2, { y: 360, size: 110, col: '#3C6FB6' }); if (lt < 0.6) speedLines((0.6 - lt) / 0.6, 7);
    } });
    cue(st, 'zip', { dur: 0.6, gain: 0.5 }); cue(wu, 'stamp', { gain: 0.6 }); }

  // 4a · "By day, he cleaned her house." living room, Otto sweeping; dust; pill BY DAY
  { const st = cut(3), wc = Wd('cleaned', 3);
    add({ id: 'S04a', at: st, note: 'sunny living room: Otto sweeps the floor with a broom, humming; dust puffs; pill BY DAY: CHORES', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); onlyR(ottoR); resetR();
      ottoR.at(lerp(-1.2, -0.2, clamp(lt / d)), 0, -3.2); ottoR.set({ mood: 'happy', legs: 'walk', phase: t * 5, armR: [40 + 20 * Math.sin(t * 8), -40], holdR: broom, v: 'br', armL: [50, -60], lean: 6, blink: blink(t) });
      shoot(R.scene, castR, V3(1.4, 1.5, 0.6), V3(0.8, 1.3, 0.2), V3(-0.4, 1.1, -3.4), null, k, { ...LK.room, fov: 52 });
      blit(); pill('BY DAY: CHORES', (t - wc) / 0.25, 300, 'rgba(31,28,51,0.9)', 62);
      for (let i = 0; i < 6; i++) { const q = ((lt * 1.5 + i / 6) % 1); ctx.save(); ctx.globalAlpha = 0.5 * (1 - q); ctx.fillStyle = '#E8DCC0'; ctx.beginPath(); ctx.arc(560 + i * 30, 1120 - q * 200, 20 + q * 30, 0, 7); ctx.fill(); ctx.restore(); }
    } });
    cue(st, 'whoosh', { gain: 0.4 }); cue(wc, 'pop', { gain: 0.4 }); }
  // 4b · "By night, he wrote stories." attic by candle, writing, pages fly; pill BY NIGHT: STORIES
  { const st = Wd('night,', 3) - 0.25, ws = Wd('stories.', 3);
    add({ id: 'S04b', at: st, note: 'attic at night: Otto writes with a quill by the candle, pages fly up around him; blue night tint; pill BY NIGHT: STORIES', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); resetA(); setFlick(t);
      otto.at(0.4, 0, -2.6); otto.set({ mood: 'smug', armR: [lerp(60, 110, Math.abs(Math.sin(t * 9))), -60], holdR: quill, v: 'q', armL: [40, -30], holdL: PROPS.paper('CH. 1'), v2: 'p', lean: 6, look: [0.4, 0.3], blink: blink(t) });
      shoot(A, [otto], V3(-0.8, 1.5, 0.4), V3(-0.5, 1.6, -0.2), V3(0.4, 1.3, -2.8), null, k, { ...LK.room, fov: 52 });
      blit(); tint(0.6, '#2A3A8A'); pill('BY NIGHT: STORIES', (t - ws) / 0.25, 300, 'rgba(31,28,51,0.9)', 62);
      for (let i = 0; i < 5; i++) { const q = ((lt * 1.2 + i * 0.2) % 1); ctx.save(); ctx.translate(300 + i * 120 + Math.sin(q * 6 + i) * 40, 1000 - q * 560); ctx.rotate(q * 4 + i); ctx.fillStyle = '#FFFDF4'; ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.globalAlpha = 1 - q; ctx.fillRect(-40, -50, 80, 100); ctx.strokeRect(-40, -50, 80, 100); ctx.restore(); }
    } });
    cue(st, 'zip', { dur: 0.5, gain: 0.4 }); cue(ws, 'sparkle', { gain: 0.5 }); }

  // 5a · "When they moved to Los Angeles," same house among palm trees; ribbon LOS ANGELES
  { const st = cut(4), wl = Wd('los', 4);
    add({ id: 'S05a', at: st, note: 'whip to a sunny Los Angeles street: the house now framed by palm trees, Dolly and her husband walk up the path with luggage; ribbon LOS ANGELES', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); onlyO(dollyO, fredO); town(true);
      dollyO.at(-0.9, 0, lerp(3.2, 1.6, clamp(lt / d))); dollyO.set({ mood: 'happy', legs: 'walk', phase: t * 6, armR: [20, 10], armL: [40, -30], holdL: PROPS.purse, v: 'pu', blink: blink(t) });
      fredO.at(0.6, 0, lerp(3.4, 1.8, clamp(lt / d))); fredO.set({ mood: 'proud', legs: 'walk', phase: t * 6 + 1, armR: [40, -30], holdR: toolbox, v: 'tb', armL: [20, 10], blink: blink(t, 1) });
      shoot(O.scene, castO, V3(3.0, 2.2, 9.0), V3(1.8, 1.8, 8.0), V3(0, 1.6, -2.0), null, k, { ...LK.day, fov: 54 });
      blit(); if (lt < 0.18) speedLines(1 - lt / 0.18, 2); ribbon('LOS ANGELES', (t - wl) / 0.3, 300, 84);
    } });
    cue(st, 'whoosh', { gain: 0.5 }); cue(wl + 0.2, 'stamp', { gain: 0.6 }); }
  // 5b · "he got a new attic." new attic: Otto unpacks smugly, sunny window; pill NEW ATTIC
  { const st = Wd('he', 4) - 0.1, wn = Wd('new', 4);
    add({ id: 'S05b', at: st, note: 'the new attic, warm daylight through the round window: Otto drops a crate and stretches, smug; pill NEW ATTIC!', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); resetA(false); setFlick(t); papers.children.forEach((p, i) => (p.visible = i < 2));
      otto.at(-0.4, 0, -2.4); otto.set({ mood: 'laugh', armR: [150, 20], armL: [150, 20], legs: lt > 0.5 && lt < 1.0 ? 'jump' : 'stand', phase: clamp((lt - 0.5) * 2), blink: blink(t) });
      shoot(A, [otto], V3(0.8, 2.0, 0.6), V3(0.4, 1.6, 0.0), V3(-0.3, 1.3, -2.6), null, k, { ...LK.room, fov: 54 });
      blit(); pill('NEW ATTIC!', (t - wn) / 0.25, 300, 'rgba(46,138,90,0.95)', 66); stars(540, 640, (t - wn) / 0.7);
    } });
    cue(wn, 'boing', { gain: 0.5 }); }

  // 6a · "Then, in 1922," night: dark house, calendar AUG 1922 slams
  { const st = cut(5), w22 = Wd('nineteen', 5);
    add({ id: 'S06a', at: st, note: 'night: slow push toward the dark house under the palms, cold blue tint; calendar card AUG 1922 slams with a shake', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); onlyO(); town(true, true);
      shoot(O.scene, castO, V3(-2.0, 1.4, 9.0).add(shake(t, w22 + 0.1)), V3(-1.2, 1.6, 7.0), V3(0, 2.2, -5), null, k, { ...LK.day, fov: 54 });
      blit(); tint(1.4, '#1A2460'); tint(0.8, '#000010'); calCard('AUG', '1922', 540, 440, eob(clamp((t - w22) / 0.25)), -0.05);
    } });
    cue(w22 + 0.1, 'slam', { gain: 0.7 }); }
  // 6b · "her husband was shot," his bowler hat on the floor, low and dark
  { const st = Wd('her', 5) - 0.1, ws = Wd('shot,', 5);
    add({ id: 'S06b', at: st, note: 'respectful: a low, dark push-in on the husband\'s bowler hat lying on the living-room floor; red tint; pill HER HUSBAND, FRED', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); onlyR(); resetR(); hat.visible = true;
      shoot(R.scene, castR, V3(0.4, 0.6, -0.6), V3(0.0, 0.45, -1.4), V3(-0.6, 0.1, -2.8), null, k, { ...LK.room, fov: 50 }, undefined, 0.08);
      blit(); tint(1.2, '#2A0A10'); pill('HER HUSBAND, FRED', (t - st - 0.2) / 0.25, 300, 'rgba(160,30,40,0.92)', 58);
    } });
    cue(ws, 'thud', { gain: 0.5 }); }

  // 7a · "and police found Dolly" a cop walks up to the closet; knocking ! marks
  { const st = cut(6), wp = Wd('police', 6);
    add({ id: 'S07a', at: st, note: 'living room: a policeman walks up to a tall wooden closet as it thumps; ! marks pop by the door; pill POLICE', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); onlyR(copR); resetR();
      copR.at(lerp(-0.4, 0.8, eo(clamp(lt / 0.9))), 0, -3.2); copR.set({ mood: 'worried', legs: lt < 0.9 ? 'walk' : 'stand', phase: t * 6, armR: [20, 10], armL: [20, 10], look: [0.6, 0], blink: blink(t) });
      shoot(R.scene, castR, V3(-0.6, 1.5, 0.8), V3(-0.2, 1.6, 0.2), V3(1.1, 1.4, -4.0), null, k, { ...LK.room, fov: 54 });
      blit(); [[760, 620], [860, 760]].forEach(([x, y], i) => mark('!', x, y, ((t - st - i * 0.3) % 0.6) / 0.3)); pill('POLICE', (t - wp) / 0.25, 300, 'rgba(31,28,51,0.9)', 62);
    } });
    cue(st + 0.2, 'thud', { gain: 0.5 }); cue(st + 0.5, 'thud', { gain: 0.5 }); }
  // 7b · "locked in a closet." the door swings open: Dolly inside; stamp LOCKED IN
  { const st = Wd('locked', 6) - 0.15, wc = Wd('closet.', 6);
    add({ id: 'S07b', at: st, note: 'front-on: the closet door swings open revealing Dolly inside, hands up, shocked; the cop jumps; stamp LOCKED IN', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); onlyR(dollyR); resetR(); cDoorP.rotation.y = lerp(0, 1.9, eo(clamp(lt / 0.5)));
      dollyR.at(2.4, 0, -4.65); dollyR.set({ mood: 'shock', armR: [150, 20], armL: [150, 20], tears: 1, blink: 0 });
      copR.at(0.6, 0, -3.0); copR.set({ mood: 'shock', armR: [120, -60], armL: [20, 10], look: [0.6, 0], blink: 0 });
      shoot(R.scene, castR, V3(2.0, 1.5, -1.2), V3(2.3, 1.5, -1.9), V3(2.4, 1.3, -4.6), null, k, { ...LK.room, fov: 52 });
      blit(); stamp(['LOCKED IN!'], (t - wc) / 0.2, { y: 340, size: 100, col: '#E3262E' });
    } });
    cue(st, 'slide', { dur: 0.5, gain: 0.4 }); cue(wc, 'stamp', { gain: 0.7 }); }

  // 8 · "Follow for more strange true stories." the cop points at the viewer; subscribe
  { const st = cut(7);
    add({ id: 'S08', at: st, note: 'the policeman turns to the viewer and points; SUBSCRIBE button pressed', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); onlyR(copR); resetR();
      copR.at(-0.6, 0, -2.6); copR.set({ mood: 'happy', armR: [95, 0], armL: [20, 10], talk: talk(t), blink: blink(t) });
      shoot(R.scene, castR, V3(0.0, 1.5, 0.6), V3(-0.3, 1.5, -0.1), V3(-0.6, 1.4, -2.6), null, k, { ...LK.room, fov: 50 });
      blit(); subscribe(lt / 0.45 + (lt > 0.8 ? (lt - 0.8) * 1.4 : 0), t, 330);
    } });
    cue(st, 'pop', { gain: 0.6 }); cue(st + 1.25, 'ding', { gain: 0.6 }); }

  // 9a · "The case went cold for eight years," attic: Otto still there, calendar years flip 1922 -> 1930
  { const st = cut(8), we = Wd('eight', 8);
    add({ id: 'S09a', at: st, note: 'attic: Otto paces by the candle, still hiding; a calendar card flips through the years 1922 to 1930 with a counter 8 YEARS', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); resetA(); setFlick(t);
      otto.at(lerp(-0.8, 0.6, (Math.sin(lt * 2.2) + 1) / 2), 0, -2.8); otto.set({ mood: 'tired', legs: 'walk', phase: t * 5, armR: [20, 10], armL: [20, 10], blink: blink(t) });
      shoot(A, [otto], V3(0.0, 2.2, 0.8), V3(0.0, 1.9, 0.2), V3(0, 1.75, -2.8), null, k, { ...LK.room, fov: 56 });
      blit(); tint(0.7, '#2A3A8A'); const yr = Math.min(1930, 1922 + Math.floor(clamp((t - st) / (we + 0.4 - st)) * 8)); calCard('YEAR', String(yr), 540, 300, 1, Math.sin(t * 12) * 0.04);
      counter('8 YEARS', (t - we) / 0.25, 'IN THE DARK', 540, 560);
    } });
    cue(st, 'zip', { dur: 1.0, gain: 0.4 }); cue(we, 'ding', { gain: 0.6 }); }
  // 9b · "until the secret came out." the trapdoor bursts open, light floods up; Otto shocked; stamp FOUND OUT
  { const st = Wd('until', 8) - 0.1, wo = Wd('out.', 8);
    add({ id: 'S09b', at: st, note: 'attic: the floor trapdoor flips open, a beam of light floods up; Otto jumps back, shocked; flash; stamp SECRET OUT', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); resetA(); setFlick(t); const o = eo(clamp(lt / 0.35)); lidP.rotation.x = -o * 1.9; trapHole.visible = beam.visible = o > 0.05;
      otto.at(1.2, 0, -2.8); otto.set({ mood: 'shock', armR: [150, 20], armL: [150, 20], lean: -10, legs: lt < 0.4 ? 'jump' : 'stand', phase: clamp(lt / 0.4), sweat: 1, blink: 0 });
      shoot(A, [otto], V3(1.1, 1.5, 1.0).add(shake(t, st + 0.1)), V3(0.9, 1.6, 0.5), V3(0.8, 1.2, -2.5), null, k, { ...LK.room, fov: 54 });
      blit(); flash(1 - clamp(lt / 0.25), '#FFF3C8'); stamp(['SECRET OUT!'], (t - wo) / 0.2, { y: 360, size: 100, col: '#E3262E' });
    } });
    cue(st + 0.1, 'slam', { gain: 0.7 }); cue(wo, 'stamp', { gain: 0.6 }); }

  // 10a · "Otto confessed," on the porch: Otto talks to a cop taking notes; pill HE CONFESSED
  { const st = cut(9), wc = Wd('confessed,', 9);
    add({ id: 'S10a', at: st, note: 'daylight in front of the house: Otto, head down, talks to a policeman writing in a notepad; pill HE CONFESSED (1930)', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); onlyO(ottoO, copO); town(true);
      ottoO.at(-0.7, 0, 1.0); ottoO.set({ mood: 'sad', armR: [20, 10], armL: [20, 10], talk: talk(t), look: [0.6, -0.3], blink: blink(t) });
      copO.at(0.7, 0, 1.2); copO.set({ mood: 'angry', armR: [80, -90], holdR: notepad, v: 'n', armL: [20, 10], look: [-0.6, 0], blink: blink(t, 1) });
      shoot(O.scene, castO, V3(1.4, 1.2, 5.2), V3(0.6, 1.4, 4.4), V3(0, 1.3, 1.0), null, k, { ...LK.day, fov: 50 });
      blit(); pill('HE CONFESSED (1930)', (t - wc) / 0.25, 300, 'rgba(31,28,51,0.9)', 58);
    } });
    cue(st, 'whoosh', { gain: 0.4 }); cue(wc, 'pop', { gain: 0.5 }); }
  // 10b · "and the papers named him the Bat Man," newsboy waves a paper; giant newspaper spins in: THE BAT MAN
  { const st = Wd('papers', 9) - 0.35, wb = Wd('bat', 9);
    add({ id: 'S10b', at: st, note: 'a newsboy on the street waves a paper; a giant front page spins in: THE BAT MAN / MAN LIVED IN ATTIC', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); onlyO(news); town(true);
      news.at(0.0, 0, 2.4); news.set({ mood: 'laugh', armR: [150, -20 + 30 * Math.sin(t * 10)], holdR: paperBat, v: 'pb', armL: [20, 10], talk: talk(t), blink: blink(t) });
      shoot(O.scene, castO, V3(-0.4, 0.9, 5.4), V3(0.2, 1.0, 4.8), V3(0, 1.1, 2.4), null, k, { ...LK.day, fov: 50 });
      blit(); newspaper((t - wb + 0.25) / 0.35, 'THE BAT MAN', 'HID IN AN ATTIC FOR YEARS', 560);
    } });
    cue(st, 'whoosh', { gain: 0.4 }); cue(wb, 'slam', { gain: 0.7 }); }
  // 10c · "because" loop: back to the frame-0 attic shot, hook returns -> "A man lived in her attic for ten years..."
  { const st = Wd('because', 9) - 0.1;
    add({ id: 'S10c', at: st, note: 'loop: snap back to the frame-0 attic: Otto leans in, finger to lips, by the candle; hook 10 YEARS / IN HER ATTIC? returns', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); resetA(); setFlick(t);
      otto.at(0.2, 0, -2.6); otto.set({ mood: 'sly', armR: [45, -10], armL: [110, -130], lean: 8, look: [0.3, 0.6], blink: blink(t + 0.5) });
      shoot(A, [otto], V3(1.4, 1.0, 1.4), V3(0.9, 1.1, 0.6), V3(0.1, 1.35, -2.8), null, k, { ...LK.room, fov: 54 }, undefined, 0.05);
      blit(); if (lt < 0.2) speedLines(1 - lt / 0.2, 4); hook(['ATTIC MAN', '10 YEARS?'], (t - st) / 0.3, { y: 300, size: 120, hiLine: 1 });
    } });
    cue(st, 'whoosh', { gain: 0.5 }); }

  return { shots: S, cues: CUES };
}
