// THE SHIP THAT WATCHED TITANIC SINK: the shot list (Tall Tale 3D, serious night version).
// Original characters and ships drawn in code; no film scenes copied. Tone: respectful, no jokes about the victims.
import * as THREE from 'three';
import { ctx, clamp, lerp, seg, eo, eio, eob } from './core/lib.js';
import { L, Le, Wd, T } from './core/timing.js';
import { camera } from './core/engine.js';
import * as WD from './core/world.js';
import * as SEA from './core/sea.js';
import { Toon, PROPS } from './core/toon.js';

const V3 = (x, y, z) => new THREE.Vector3(x, y, z);
const mix = (a, b, k) => a.clone().lerp(b, k);
const talk = (t, on = 1) => (on ? 0.25 + 0.75 * Math.abs(Math.sin(t * 13)) * (0.6 + 0.4 * Math.sin(t * 5.3)) : 0);
const blink = (t, off = 0) => (((t + off) % 3.3) < 0.12 ? 1 : 0);
const INK = '#1F1C33';
const NIGHT_TINT = '#9AA8D8';

const LOOK = {
  officer: { body: '#2E4E8A', hat: 'mailcap', hatCol: '#1F2A44', neck: 'tie', neckCol: '#F2E6CF' },
  mate: { body: '#3B4A6B', hat: 'cap', hatCol: '#2A2638', neck: 'scarf', neckCol: '#D8343F' },
  captain: { body: '#1F2A44', hat: 'mailcap', hatCol: '#121A30', neck: 'bowtie', neckCol: '#F2E6CF', extra: ['mustache'] },
  operator: { body: '#7FA36A', hat: 'none', neck: 'collar', extra: ['glasses'] },
  crew: { body: '#F4EFE4', hat: 'mailcap', hatCol: '#1F2A44', neck: 'tie', neckCol: '#1F1C33' },
  judge: { body: '#2A2638', hat: 'none', neck: 'collar', extra: ['glasses'] },
  lady: { body: '#B98ACF', hat: 'bun', hatCol: '#7A4A2E', neck: 'scarf', neckCol: '#F2E6CF' },
  girl: { body: '#F2C230', hat: 'bow', hatCol: '#D8343F', kid: true },
  argA: { body: '#E8734A', hat: 'cap', hatCol: '#3B3346', extra: ['glasses'] },
  argB: { body: '#4FB3A9', hat: 'beanie', hatCol: '#2E4E8A' },
};
const person = (k, opts) => new Toon({ ...LOOK[k], extra: [...(LOOK[k].extra || [])] }, opts);

const P2 = {
  scope: (g, x, y) => { g.save(); g.translate(x, y - 20); g.rotate(-1.1); g.strokeStyle = INK; g.lineWidth = 6; g.fillStyle = '#C9A13B'; g.beginPath(); g.roundRect(-20, -150, 40, 170, 8); g.fill(); g.stroke(); g.fillStyle = '#8A6A2A'; g.fillRect(-24, -60, 48, 14); g.strokeRect(-24, -60, 48, 14); g.fillStyle = '#9CC7E4'; g.beginPath(); g.ellipse(0, -150, 20, 8, 0, 0, 7); g.fill(); g.stroke(); g.restore(); },
  gavel: (g, x, y) => { g.save(); g.translate(x, y - 20); g.rotate(-0.4); g.strokeStyle = INK; g.lineWidth = 6; g.fillStyle = '#7A4A2A'; g.beginPath(); g.roundRect(-8, -120, 16, 130, 6); g.fill(); g.stroke(); g.fillStyle = '#5A3420'; g.beginPath(); g.roundRect(-50, -150, 100, 40, 10); g.fill(); g.stroke(); g.restore(); },
  blanket: (g, x, y) => { g.save(); g.translate(x, y - 40); g.fillStyle = '#9C5A5A'; g.strokeStyle = INK; g.lineWidth = 6; g.beginPath(); g.roundRect(-90, -60, 180, 110, 18); g.fill(); g.stroke(); g.strokeStyle = '#C98A8A'; g.lineWidth = 4; for (let i = 0; i < 3; i++) { g.beginPath(); g.moveTo(-80, -30 + i * 30); g.lineTo(80, -30 + i * 30); g.stroke(); } g.restore(); },
};

// ── 2D overlays (kept above the caption zone) ──
function ribbon(text, k, y = 400, size = 92) {
  if (k <= 0) return; const a = eob(clamp(k)); ctx.save(); ctx.translate(540, y); ctx.rotate(-0.03); ctx.scale(a, a); ctx.font = `900 ${size}px Inter`; const w = ctx.measureText(text).width + 90;
  ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.fillRect(-w / 2 + 12, -62, w, 140);
  ctx.fillStyle = '#F2C230'; ctx.strokeStyle = INK; ctx.lineWidth = 8; ctx.beginPath(); ctx.rect(-w / 2, -70, w, 140); ctx.fill(); ctx.stroke();
  ctx.fillStyle = INK; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(text, 0, 6); ctx.restore();
}
function pill(text, k, y = 260, bg = 'rgba(15,20,45,0.85)', fg = '#FFFFFF', size = 56) {
  if (k <= 0) return; const a = clamp(k * 1.5); ctx.save(); ctx.globalAlpha = a; ctx.translate(540, y + (1 - eo(clamp(k))) * 30); ctx.font = `900 ${size}px Inter`; const w = ctx.measureText(text).width + 70;
  ctx.fillStyle = bg; ctx.beginPath(); ctx.roundRect(-w / 2, -size * 0.85, w, size * 1.7, size * 0.85); ctx.fill(); ctx.strokeStyle = '#F2C230'; ctx.lineWidth = 5; ctx.stroke();
  ctx.fillStyle = fg; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(text, 0, 4); ctx.restore();
}
function stamp(lines, p, { x = 540, y = 560, rot = -0.1, col = '#C8283A', size = 80, fill = 'rgba(255,253,244,0.94)' } = {}) {
  if (p <= 0) return; ctx.save(); ctx.translate(x, y); ctx.rotate(rot); const s = lerp(2.3, 1, eo(clamp(p))); ctx.scale(s, s); ctx.globalAlpha = Math.min(1, p * 1.6);
  ctx.font = `900 ${size}px Inter`; const w = Math.max(...lines.map((l) => ctx.measureText(l).width)) + 80, h = lines.length * size * 1.08 + 50;
  if (fill) { ctx.fillStyle = fill; ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, 22); ctx.fill(); }
  ctx.strokeStyle = col; ctx.lineWidth = 12; ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, 22); ctx.stroke();
  ctx.fillStyle = col; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; lines.forEach((l, i) => ctx.fillText(l, 0, (i - (lines.length - 1) / 2) * size * 1.08 + 4)); ctx.restore();
}
function bubble(text, k, x, y, size = 54) {
  if (k <= 0) return; const a = eob(clamp(k)); ctx.save(); ctx.translate(x, y); ctx.scale(a, a); ctx.font = `900 ${size}px Inter`; const w = ctx.measureText(text).width + 70, h = size * 1.9;
  ctx.fillStyle = '#FFFDF4'; ctx.strokeStyle = INK; ctx.lineWidth = 7; ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, 30); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-30, h / 2 - 4); ctx.lineTo(-60, h / 2 + 50); ctx.lineTo(10, h / 2 - 4); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.fillStyle = '#FFFDF4'; ctx.fillRect(-28, h / 2 - 10, 36, 10);
  ctx.fillStyle = INK; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(text, 0, 4); ctx.restore();
}
function zzz(t, x, y) { ctx.save(); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; for (let i = 0; i < 3; i++) { const k = ((t * 0.7 + i / 3) % 1); ctx.globalAlpha = Math.sin(k * Math.PI); ctx.fillStyle = '#FFFFFF'; ctx.strokeStyle = INK; ctx.lineWidth = 8; ctx.font = `900 ${50 + i * 14}px Inter`; ctx.strokeText('Z', x + k * 80 + i * 30, y - k * 160 - i * 40); ctx.fillText('Z', x + k * 80 + i * 30, y - k * 160 - i * 40); } ctx.restore(); }
function counter(n, k, label, y = 330) {
  if (k <= 0) return; ctx.save(); ctx.globalAlpha = clamp(k * 2); ctx.translate(540, y); ctx.fillStyle = 'rgba(10,14,36,0.82)'; ctx.beginPath(); ctx.roundRect(-230, -110, 460, 220, 30); ctx.fill(); ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = 6; ctx.stroke();
  ctx.fillStyle = '#FFFFFF'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.font = '900 120px Inter'; ctx.fillText(String(n), 0, -14); ctx.font = '800 36px Inter'; ctx.fillStyle = '#F2C230'; ctx.fillText(label, 0, 72); ctx.restore();
}
function routeMap(k, y = 420) {
  if (k <= 0) return; const a = eo(clamp(k * 2)); ctx.save(); ctx.translate(540, y); ctx.scale(a, a);
  ctx.fillStyle = '#F4E3C0'; ctx.strokeStyle = INK; ctx.lineWidth = 8; ctx.beginPath(); ctx.roundRect(-420, -220, 840, 420, 26); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#9CC7E4'; ctx.fillRect(-396, -196, 792, 372);
  for (let i = 0; i < 10; i++) { const x = -330 + (Math.sin(i * 7.1) * 0.5 + 0.5) * 620, yy = -150 + (Math.sin(i * 3.3) * 0.5 + 0.5) * 280; ctx.fillStyle = '#FFFFFF'; ctx.beginPath(); ctx.moveTo(x, yy - 18); ctx.lineTo(x + 20, yy + 12); ctx.lineTo(x - 18, yy + 12); ctx.closePath(); ctx.fill(); }
  const A = [-300, 110], B = [300, -110], d = clamp((k - 0.1) / 0.8);
  ctx.strokeStyle = '#D8343F'; ctx.lineWidth = 10; ctx.setLineDash([26, 18]); ctx.beginPath(); ctx.moveTo(A[0], A[1]); ctx.lineTo(lerp(A[0], B[0], d), lerp(A[1], B[1], d)); ctx.stroke(); ctx.setLineDash([]);
  ctx.fillStyle = '#1F2A44'; ctx.beginPath(); ctx.arc(A[0], A[1], 16, 0, 7); ctx.fill(); ctx.fillStyle = '#D8343F'; ctx.beginPath(); ctx.arc(B[0], B[1], 20, 0, 7); ctx.fill();
  ctx.fillStyle = INK; ctx.font = '900 34px Inter'; ctx.textAlign = 'center'; ctx.fillText('CARPATHIA', A[0] + 30, A[1] + 56); ctx.fillText('TITANIC', B[0], B[1] - 36);
  if (d > 0.4) { ctx.font = '900 68px Inter'; ctx.fillStyle = '#D8343F'; ctx.save(); ctx.translate(20, 40); ctx.rotate(-0.34); ctx.fillText('58 MILES', 0, 0); ctx.restore(); }
  ctx.restore();
}

export function buildShots(E) {
  const S = [], CUES = [], add = (o) => (S.push(o), o), cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut = (i) => (i === 0 ? 0 : L(i) - 0.06);
  const cam = camera(36);
  const LK = { sea: { bloom: 0.9, bloomThreshold: 1.08, aperture: 0.0004, maxblur: 0.005 }, dawn: { bloom: 0.2, bloomThreshold: 1.3, aperture: 0.0004, maxblur: 0.005 }, room: { bloom: 0.3, bloomThreshold: 1.08, aperture: 0.001, maxblur: 0.008 } };
  let T_now = 0;
  const shoot = (scene, people, from, to, at, at2, k, look, focus) => {
    if (cam.fov !== (look.fov || 36)) { cam.fov = look.fov || 36; cam.updateProjectionMatrix(); }
    cam.position.copy(mix(from, to, k)); cam.lookAt(at2 ? mix(at, at2, k) : at);
    people.forEach((p) => p.face(cam));
    if (scene === NI.scene) NI.update(T_now, cam); if (scene === DA.scene) DA.update(T_now, cam);
    E.render(scene, cam, { ...look, focus: focus ?? cam.position.distanceTo(at2 ? mix(at, at2, k) : at) });
  };
  const wrap = (o) => { const d0 = o.draw; o.draw = (lt, d, t, blit) => { T_now = t; d0(lt, d, t, blit); }; return add(o); };

  // ═════ NIGHT SEA ═════
  const NI = SEA.ocean(E);
  const TP = V3(0, 0, -150);
  const tit = SEA.liner(); tit.position.copy(TP); NI.scene.add(tit);
  const CP = V3(-90, 0, 40);
  const cal = SEA.steamer(); cal.position.copy(CP); cal.rotation.y = 0.5; NI.scene.add(cal);
  const addBerg = (x, z, s, i) => { const b = SEA.iceberg(s, i); b.position.set(x, -0.3, z); NI.scene.add(b); };
  for (let i = 0; i < 22; i++) { const a = i * 2.4, r = 14 + (i % 5) * 7; addBerg(CP.x + Math.cos(a) * r, CP.z + Math.sin(a) * r, 0.8 + (i % 4) * 0.7, i); }
  [[30, -170, 3.2], [-40, -130, 2], [60, -120, 2.4], [-25, -40, 1.4], [18, -60, 1.8], [-14, -14, 1.1], [16, -22, 1.3]].forEach(([x, z, s], i) => addBerg(x, z, s, 40 + i));
  const DK = SEA.deck({ funnelCol: '#D8846A' }); DK.position.set(0, 3.5, 0); NI.scene.add(DK);
  { const hull = new THREE.Mesh(new THREE.BoxGeometry(14, 4, 9), WD.mat({ color: '#1E1E26' })); hull.position.set(0, 1.4, 1.6); NI.scene.add(hull); }
  const dOff = person('officer'), dMate = person('mate'); [dOff, dMate].forEach((p) => { p.tint(NIGHT_TINT); NI.scene.add(p.group); });
  const TD = V3(400, 3.5, 0);
  const DK2 = SEA.deck({ funnelCol: '#E3A848' }); DK2.position.copy(TD); NI.scene.add(DK2);
  { const hull = new THREE.Mesh(new THREE.BoxGeometry(14, 4, 9), WD.mat({ color: '#1E1E26' })); hull.position.set(TD.x, 1.4, 1.6); NI.scene.add(hull); }
  const tCrew = person('crew'), tLady = person('lady'), tGirl = person('girl', { height: 1.3 }); [tCrew, tLady, tGirl].forEach((p) => { p.tint(NIGHT_TINT); NI.scene.add(p.group); });
  const farR = [0, 1, 2, 3].map(() => { const r = SEA.rocket(34); r.position.set(TP.x + 4, 6, TP.z); NI.scene.add(r); return r; });
  const nearR = [0, 1].map(() => { const r = SEA.rocket(26); r.position.set(TD.x + 0.4, TD.y + 1, TD.z - 3); NI.scene.add(r); return r; });
  const setRockets = (pool, launches, t) => { const past = launches.filter((l) => l <= t).slice(-pool.length); pool.forEach((r, i) => r.set(past[i] != null ? t - past[i] : -1)); };
  let FAR = [], NEAR = [];
  const rocketsAt = (t) => { setRockets(farR, FAR, t); setRockets(nearR, NEAR, t); };
  const cal2 = SEA.steamer(); cal2.position.set(-60, 0, -70); cal2.rotation.y = 0.8; NI.scene.add(cal2);
  const sink = (k) => { tit.rotation.set(0, 0, -0.04 - k * 0.1); tit.position.y = -0.4 - k * 1.4; };

  // ═════ DAWN SEA ═════
  const DA = SEA.ocean(E, { dawn: true });
  const ring = SEA.lifeRing(); ring.position.set(0, 0.15, -4); DA.scene.add(ring);
  const deb = []; [[1.6, -6, 0.3], [-2.2, -9, -0.4], [3.4, -12, 0.8]].forEach(([x, z, r]) => { const c = WD.crate(0.7); c.position.set(x, -0.2, z); c.rotation.set(0.2, r, 0.1); DA.scene.add(c); deb.push(c); });
  const carp = SEA.liner({ funnels: 1, len: 22, funnelCol: '#D8343F', lights: false }); carp.position.set(-30, 0, -70); DA.scene.add(carp);
  [[-12, -40, 2.4], [14, -55, 3], [-30, -30, 1.6], [26, -110, 2], [-8, -90, 4], [40, -80, 3.5]].forEach(([x, z, s], i) => { const b = SEA.iceberg(s, 70 + i); b.position.set(x, -0.3, z); DA.scene.add(b); });
  const boat = SEA.lifeboat(); boat.position.set(6, 0.15, -14); boat.rotation.y = -0.4; DA.scene.add(boat);
  const bLady = person('lady'), bGirl = person('girl', { height: 1.3 }), bCrew = person('crew'); [bLady, bGirl, bCrew].forEach((p) => DA.scene.add(p.group));
  const calFar = SEA.steamer({ lights: false }); calFar.position.set(50, 0, -150); calFar.rotation.y = 0.3; DA.scene.add(calFar);
  const bob = (o, t, y0 = 0.1, ph = 0) => { o.position.y = y0 + Math.sin(t * 1.3 + ph) * 0.12; o.rotation.z = Math.sin(t * 1.1 + ph) * 0.05; };

  // ═════ ROOMS ═════
  const RR = WD.interior(E, { w: 5, depth: 4, h: 3, wall: '#34465A', motif: '#3E5268', floor: '#7A5A44', ceiling: '#222C3A', signText: null, picture: false, counterOn: false, litter: false });
  RR.scene.background = new THREE.Color('#0A0F22'); RR.window.material.color.set('#0F1838');
  const ws = SEA.wireless(); ws.position.set(0.6, 0, -3.3); RR.scene.add(ws);
  const rBunk = SEA.bunk('#5C8FD6'); rBunk.position.set(-1.3, 0, -1.6); rBunk.rotation.y = Math.PI / 2; RR.scene.add(rBunk);
  const rOp = person('operator'); RR.scene.add(rOp.group);
  const rLights = []; RR.scene.traverse((o) => { if (o.isPointLight || o.isDirectionalLight || o.isHemisphereLight) rLights.push([o, o.intensity]); });
  const dimRoom = (L0, k) => L0.forEach(([o, i0]) => (o.intensity = i0 * k));

  const CB = WD.interior(E, { w: 5, depth: 4, h: 3, wall: '#5A3A2A', motif: '#664433', floor: '#6B4A33', ceiling: '#2A1E18', signText: null, picture: true, counterOn: false, litter: false });
  CB.scene.background = new THREE.Color('#0A0F22'); CB.window.material.color.set('#0F1838');
  const cBunk = SEA.bunk('#2E4E8A'); cBunk.position.set(-0.6, 0, -3.0); CB.scene.add(cBunk);
  const tube = SEA.speakingTube(); tube.position.set(1.6, 0, -3.85); CB.scene.add(tube);
  const cCap = person('captain'); CB.scene.add(cCap.group);
  const cLights = []; CB.scene.traverse((o) => { if (o.isPointLight || o.isDirectionalLight || o.isHemisphereLight) cLights.push([o, o.intensity]); });

  const IQ = WD.interior(E, { w: 8, depth: 6.5, h: 4.4, wall: '#6B3E26', motif: '#7A4A30', floor: '#5A3A2A', ceiling: '#2A1E18', signText: null, picture: false, counterOn: false, litter: false });
  IQ.window.material.color.set('#3A2A20'); IQ.window.material.map = null;
  const bnch = SEA.bench(4); bnch.position.set(0, 0, -4.6); IQ.scene.add(bnch);
  { const fl = WD.signBoard('INQUIRY INTO THE LOSS OF THE TITANIC', { w: 4.6, h: 0.45, bg: '#2A1E18', fg: '#E2B33C' }); fl.position.set(0, 3.7, -6.38); IQ.scene.add(fl); }
  const iJudge = person('judge'), iCap = person('captain'), iA = person('argA'), iB = person('argB'); [iJudge, iCap, iA, iB].forEach((p) => IQ.scene.add(p.group));
  iJudge.at(0, 0.75, -5.3);

  FAR = [0.6, Wd('rockets', 2) - 0.2, Wd('sky', 2) - 1.0, L(3) - 0.4, L(4) + 0.2, L(5) - 0.3, Wd('see', 5) - 1.0, L(10) - 0.2, L(10) + 0.5, L(10) + 1.0, L(10) + 1.5, Wd('eight', 10) - 1.0, Wd('rockets', 10) - 0.6, L(25) - 0.8, L(25) + 0.4];
  NEAR = [Wd('firing', 2) - 0.2, L(3) - 0.5];

  // ═════════════ SHOTS ═════════════
  { const st = cut(0), wy = Wd('1912', 0);
    wrap({ id: 'S01', at: st, note: 'starry night: camera glides low over the waves toward the lit liner; ribbon APRIL 1912', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); sink(0); rocketsAt(t);
      shoot(NI.scene, [], V3(-30, 3, -60), V3(-22, 4.5, -100), V3(0, 4, -150), null, k, { ...LK.sea, fov: 40 }, 60);
      blit(); ribbon('APRIL 1912', (t - wy + 0.1) / 0.3, 380);
    } });
    cue(0.1, 'whoosh', { gain: 0.4 }); cue(wy, 'stamp', { gain: 0.6 }); }

  { const st = cut(1), ws2 = Wd('sinking', 1);
    wrap({ id: 'S02', at: st, note: 'side view: the bow dips lower into the black water on "sinking"', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); sink(eio(clamp((t - st) / (d + 1)))); rocketsAt(t);
      shoot(NI.scene, [], V3(18, 2.5, -118), V3(10, 2.2, -122), V3(4, 1.6, -150), V3(10, 0.5, -150), k, { ...LK.sea, fov: 42 }, 30);
      blit();
    } });
    cue(st, 'whoosh', { gain: 0.4 }); cue(ws2, 'thud', { gain: 0.5 }); }

  { const st = cut(2);
    wrap({ id: 'S03', at: st, note: "Titanic's deck: a crewman fires a rocket; it streaks up past the funnel", draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); rocketsAt(t);
      tCrew.at(TD.x - 1.0, TD.y, TD.z - 1.6); tLady.group.visible = tGirl.group.visible = false; tCrew.group.visible = true;
      const fired = t > NEAR[0]; tCrew.set({ mood: fired ? 'shock' : 'worried', armL: [fired ? 150 : 40, 0], armR: [fired ? 150 : 60, -40], look: [0, fired ? -1 : 0], sweat: 1, blink: blink(t) });
      shoot(NI.scene, [tCrew], V3(TD.x + 1.6, TD.y + 1.3, TD.z + 2.6), V3(TD.x + 1.4, TD.y + 1.1, TD.z + 2.0), V3(TD.x - 0.6, TD.y + 1.6, TD.z - 1.6), V3(TD.x - 0.3, TD.y + 3.4, TD.z - 2.5), k, { ...LK.sea, fov: 62 }, 4);
      blit();
    } });
    cue(NEAR[0], 'whoosh', { gain: 0.8 }); cue(NEAR[0] + 1.1, 'pop', { gain: 0.8 }); }
  { const st = Wd('sky', 2) - 0.45;
    wrap({ id: 'S03b', at: st, note: 'wide: white star bursts bloom high above the tilted liner', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); sink(0.35 + k * 0.1); rocketsAt(t);
      shoot(NI.scene, [], V3(-26, 2, -100), V3(-24, 3, -104), V3(0, 18, -150), V3(0, 24, -150), k, { ...LK.sea, fov: 52 }, 50);
      blit();
    } });
    cue(st, 'whoosh', { gain: 0.3 }); cue(FAR[2] + 1.1, 'pop', { gain: 0.6 }); }

  { const st = cut(3), wh = Wd('help', 3);
    wrap({ id: 'S04', at: st, note: 'a mother and her girl on the deck look up as a rocket bursts; worried faces', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); rocketsAt(t); [tCrew, tLady, tGirl].forEach((p) => (p.group.visible = true));
      tLady.at(TD.x + 0.4, TD.y, TD.z - 1.2); tGirl.at(TD.x + 1.2, TD.y, TD.z - 0.9); tCrew.at(TD.x - 1.4, TD.y, TD.z - 1.8);
      tLady.set({ mood: 'worried', armL: [40, -60], armR: [120, 10], look: [0, -0.8], tears: t > wh ? 1 : 0 }); tGirl.set({ mood: 'sad', armL: [150, 10], armR: [150, 10], look: [0, -0.8], tears: 1 });
      tCrew.set({ mood: 'worried', armR: [150, 0], armL: [20, 10], look: [0, -0.9], sweat: 1 });
      shoot(NI.scene, [tCrew, tLady, tGirl], V3(TD.x + 0.6, TD.y + 1.1, TD.z + 3.2), V3(TD.x + 0.4, TD.y + 1.0, TD.z + 2.4), V3(TD.x + 0.2, TD.y + 1.2, TD.z - 1.2), null, k, { ...LK.sea, fov: 46 });
      blit();
    } });
    cue(wh, 'heartbeat', { gain: 0.6 }); }

  { const st = cut(4);
    wrap({ id: 'S05', at: st, note: 'slow turn away from the sinking liner, out across the black water toward the horizon', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); sink(0.5); rocketsAt(t);
      shoot(NI.scene, [], V3(-6, 2.6, -128), V3(-8, 2.8, -124), V3(0, 3, -150), V3(-60, 3, -70), k, { ...LK.sea, fov: 44 }, 60);
      blit();
    } });
    cue(st, 'heartbeat', { gain: 0.7 }); cue(st + 0.8, 'heartbeat', { gain: 0.7 }); }

  { const st = cut(5), wse = Wd('see', 5);
    wrap({ id: 'S06', at: st, note: "the Californian's deck: an officer at the rail; distant rockets beyond him; punch-in on \"see\"", draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); rocketsAt(t); sink(0.55);
      dOff.at(-1.6, 3.5, -1.7); dMate.group.visible = false;
      dOff.set({ mood: t > wse ? 'shock' : 'neutral', armR: [100, -70], holdR: P2.scope, armL: [60, -80], v: 'sc', look: [-0.6, -0.4], blink: blink(t) });
      const punch = eo(clamp((t - wse) / 0.3));
      shoot(NI.scene, [dOff], mix(V3(1.0, 5.4, 3.6), V3(-0.6, 5.0, 0.8), punch), mix(V3(0.8, 5.3, 3.0), V3(-0.7, 5.0, 0.6), punch), V3(-8.3, 9, -40), V3(-1.6, 5.0, -1.7), punch * 0.85, { ...LK.sea, fov: 56 }, lerp(6, 2.4, punch));
      blit(); pill('ANOTHER SHIP', (t - st - 0.2) / 0.3, 250);
    } });
    cue(st, 'whoosh', { gain: 0.4 }); cue(wse, 'boing', { gain: 0.35 }); }

  { const st = cut(6), wc = Wd('californian', 6);
    wrap({ id: 'S07', at: st, note: 'wide: the small steamer, engines stopped, among icebergs; label SS CALIFORNIAN', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); rocketsAt(t);
      shoot(NI.scene, [], V3(CP.x + 30, 6, CP.z + 30), V3(CP.x + 22, 5, CP.z + 26), V3(CP.x, 2, CP.z), null, k, { ...LK.sea, fov: 44 }, 36);
      blit(); pill('SS CALIFORNIAN', (t - wc + 0.1) / 0.3, 260);
    } });
    cue(st, 'whoosh', { gain: 0.4 }); }

  { const st = cut(7), wi = Wd('ice', 7);
    wrap({ id: 'S08', at: st, note: 'crane down from high above: icebergs all around the stopped ship', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); rocketsAt(t);
      shoot(NI.scene, [], V3(CP.x - 10, 40, CP.z + 40), V3(CP.x - 20, 8, CP.z + 22), V3(CP.x, 0, CP.z), V3(CP.x + 6, 2, CP.z - 6), k, { ...LK.sea, fov: 50 }, 40);
      blit();
    } });
    cue(st, 'slide', { dur: 1.4, gain: 0.4 }); cue(wi, 'tock', { gain: 0.5 }); }

  { const st = cut(8), wsw = Wd('switched', 8);
    wrap({ id: 'S09', at: st, note: 'radio room: the tired operator flips the switch on "switched"; valves and lamp go dark', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); const off = t > wsw + 0.1; ws.set(!off); dimRoom(rLights, off ? 0.35 : 1);
      rOp.at(0.9, 0, -2.4); rOp.set({ mood: 'tired', armR: [off ? 60 : 80, -70], armL: [20, 10], look: [0.4, 0.4], blink: blink(t) });
      shoot(RR.scene, [rOp], V3(-0.8, 1.6, 0.9), V3(-0.5, 1.55, 0.4), V3(0.8, 1.3, -2.8), null, k, { ...LK.room, fov: 46 });
      blit(); pill(off ? 'RADIO: OFF' : 'RADIO: ON', 1, 260, off ? 'rgba(120,20,30,0.9)' : 'rgba(20,90,50,0.9)');
    } });
    cue(wsw + 0.1, 'thud', { gain: 0.7 }); }

  { const st = cut(9);
    wrap({ id: 'S10', at: st, note: 'the operator asleep in his bunk, room dark, Zzz', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); ws.set(false); dimRoom(rLights, 0.35);
      rOp.at(-1.25, -0.42, -2.35); rOp.set({ mood: 'tired', blink: 1, armL: [8, 6], armR: [8, 6] });
      shoot(RR.scene, [rOp], V3(0.4, 1.4, 0.2), V3(0.1, 1.35, -0.3), V3(-1.25, 1.0, -2.35), null, k, { ...LK.room, fov: 44 });
      blit(); zzz(t, 640, 640);
    } });
    cue(st, 'slide', { dur: 0.6, gain: 0.3 }); }

  { const st = cut(10), we = Wd('eight', 10);
    wrap({ id: 'S11', at: st, note: 'deck: officer and mate look up at the distant bursts; a counter ticks up to 8', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); rocketsAt(t); sink(0.6);
      dOff.at(-0.6, 3.5, -1.7); dMate.group.visible = true; dMate.at(0.7, 3.5, -1.5);
      dOff.set({ mood: 'shock', armR: [150, 10], armL: [20, 10], look: [-0.4, -0.7] }); dMate.set({ mood: 'worried', armL: [70, -60], armR: [40, -30], look: [-0.6, -0.6], sweat: 1 });
      const near = t > we - 0.6;
      shoot(NI.scene, [dOff, dMate], near ? V3(1.4, 4.9, 1.2) : V3(2.6, 5.4, 3.8), near ? V3(1.0, 4.8, 0.8) : V3(2.0, 5.2, 3.0), near ? V3(0.6, 5.0, -1.5) : V3(-3, 6.5, -30), null, k, { ...LK.sea, fov: 46 }, near ? 2.5 : 6);
      blit(); const n = Math.min(8, 1 + Math.floor(clamp((t - st) / (we - st)) * 7.99)); counter(n, (t - st) / 0.3, 'WHITE ROCKETS');
    } });
    for (let i = 0; i < 8; i++) cue(cut(10) + (i * (Wd('eight', 10) - cut(10))) / 7.99 + 0.01, 'tock', { gain: 0.5 }); }

  { const st = cut(11);
    wrap({ id: 'S12', at: st, note: "captain's cabin: a call comes down the brass speaking tube; the captain stirs", draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); dimRoom(cLights, 1);
      cCap.at(-0.55, -0.15, -2.55); cCap.set({ mood: 'tired', armL: [20, 10], armR: [40, -30], look: [0.8, 0], blink: blink(t) });
      shoot(CB.scene, [cCap], V3(1.3, 1.7, 0.8), V3(1.0, 1.6, 0.3), V3(-0.15, 1.2, -2.8), null, k, { ...LK.room, fov: 52 });
      blit(); bubble('ROCKETS, SIR!', (t - st - 0.1) / 0.25, 700, 360, 50);
    } });
    cue(st + 0.1, 'ding', { gain: 0.5 }); }

  { const st = cut(12), wc = Wd('company', 12);
    wrap({ id: 'S13', at: st, note: 'close on the drowsy captain; bubble COMPANY SIGNALS? on "company"', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); dimRoom(cLights, 0.8);
      cCap.at(-0.55, -0.15, -2.55); cCap.set({ mood: t > wc ? 'sly' : 'tired', talk: talk(t, t > wc - 0.3 && t < Le(12)), armR: [70, -90], armL: [20, 10], look: [0.3, 0], blink: blink(t) });
      shoot(CB.scene, [cCap], V3(-0.2, 1.45, -0.6), V3(-0.35, 1.4, -1.0), V3(-0.55, 1.25, -2.55), null, k, LK.room, 1.6);
      blit(); bubble('COMPANY SIGNALS?', (t - wc + 0.05) / 0.25, 560, 420, 50);
    } });
    cue(Wd('company', 12), 'pop', { gain: 0.5 }); }

  { const st = cut(13);
    wrap({ id: 'S14', at: st, note: 'the captain lies back down; the lamp dims; Zzz', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); dimRoom(cLights, lerp(0.8, 0.3, eo(clamp(lt / 0.6))));
      cCap.at(-0.55, -0.62, -2.6); cCap.set({ mood: 'tired', blink: 1, armL: [8, 6], armR: [8, 6] });
      shoot(CB.scene, [cCap], V3(0.9, 1.5, -0.2), V3(0.7, 1.4, -0.7), V3(-0.6, 0.8, -2.8), null, k, LK.room);
      blit(); zzz(t, 560, 700);
    } });
    cue(st, 'slide', { dur: 0.6, gain: 0.3 }); }

  { const st = cut(14), wg = Wd('gone', 14);
    wrap({ id: 'S15', at: st, note: 'pink dawn rises over a calm, empty sea; GONE', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); [bLady, bGirl, bCrew].forEach((p) => (p.group.visible = false)); boat.visible = false; carp.visible = false; calFar.visible = false;
      bob(ring, t, 0.15); shoot(DA.scene, [], V3(0, 6, 14), V3(0, 3, 8), V3(-20, 8, -200), V3(0, 1, -40), k, { ...LK.dawn, fov: 48 }, 60);
      blit(); stamp(['GONE'], (t - wg - 0.05) / 0.25, { y: 520, size: 120, col: '#1F2A44', fill: 'rgba(255,253,244,0.88)' });
    } });
    cue(st, 'whoosh', { gain: 0.3 }); cue(wg, 'thud', { gain: 0.6 }); }

  { const st = cut(15), wf = Wd('fifteen', 15);
    wrap({ id: 'S16', at: st, note: 'close: a lone life ring drifting among debris; card 1,500+ LIVES LOST', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); boat.visible = false; carp.visible = false; calFar.visible = false; [bLady, bGirl, bCrew].forEach((p) => (p.group.visible = false));
      bob(ring, t, 0.15); deb.forEach((c, i) => bob(c, t, -0.2, i));
      shoot(DA.scene, [], V3(1.8, 1.4, -0.6), V3(1.2, 1.2, -1.4), V3(0, 0.1, -4), null, k, { ...LK.dawn, fov: 44 }, 3);
      blit(); ctx.save(); ctx.globalAlpha = clamp((t - wf + 0.1) / 0.4); ctx.fillStyle = 'rgba(10,14,36,0.85)'; ctx.beginPath(); ctx.roundRect(190, 250, 700, 300, 30); ctx.fill();
      ctx.fillStyle = '#FFFFFF'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.font = '900 150px Inter'; ctx.fillText('1,500+', 540, 375); ctx.font = '800 46px Inter'; ctx.fillStyle = '#FFB394'; ctx.fillText('LIVES LOST', 540, 490); ctx.restore();
    } });
    cue(wf, 'heartbeat', { gain: 0.6 }); }

  { const st = cut(16), wc = Wd('carpathia', 16);
    wrap({ id: 'S17', at: st, note: 'the Carpathia steams fast across the dawn sea; label RMS CARPATHIA', draw(lt, d, t, blit) {
      const k = clamp(lt / d); carp.visible = true; carp.rotation.y = 0.2; carp.position.set(-40 + (t - st) * 6, 0, -70); boat.visible = false; calFar.visible = false;
      shoot(DA.scene, [], V3(carp.position.x + 30, 6, -30), V3(carp.position.x + 26, 5, -34), V3(carp.position.x + 2, 3, -70), null, eio(k), { ...LK.dawn, fov: 44 }, 45);
      blit(); pill('RMS CARPATHIA', (t - wc + 0.1) / 0.3, 260);
    } });
    cue(st, 'whoosh', { gain: 0.5 }); cue(st + 0.1, 'chug', { dur: 1.8, gain: 0.5 }); }

  { const st = cut(17);
    wrap({ id: 'S18', at: st, note: 'map card: a red dashed route of 58 MILES through the ice; the ship pushes past icebergs behind it', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); carp.visible = true; carp.rotation.y = -0.5; carp.position.set(-30 + (t - st) * 5, 0, -40 - (t - st) * 3);
      shoot(DA.scene, [], V3(-6, 3, -18), V3(-2, 3, -22), V3(carp.position.x, 3, carp.position.z), null, k, { ...LK.dawn, fov: 50 }, 25);
      blit(); routeMap((t - st + 0.1) / (Le(17) - st));
    } });
    cue(st, 'slide', { dur: 1.6, gain: 0.5 }); cue(Wd('miles', 17), 'stamp', { gain: 0.6 }); }

  { const st = cut(18);
    wrap({ id: 'S19', at: st, note: 'a lifeboat: a mother, her girl and a crewman look up with relief as the rescue ship looms; 705 RESCUED', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); boat.visible = true; [bLady, bGirl, bCrew].forEach((p) => (p.group.visible = true)); carp.visible = true; carp.rotation.y = 0.9; carp.position.set(-6, 0, -34);
      bob(boat, t, 0.15); const by = boat.position.y;
      bLady.at(5.4, by - 0.75, -14.1); bGirl.at(6.1, by - 0.55, -14.3); bCrew.at(6.9, by - 0.8, -14.6);
      bLady.set({ mood: 'sad', armL: [60, -80], holdL: P2.blanket, v: 'b', look: [-0.5, -0.4], tears: 1 }); bGirl.set({ mood: 'happy', armR: [150, 10], armL: [20, 10], look: [-0.6, -0.5] }); bCrew.set({ mood: 'tired', armL: [130, 0], look: [-0.6, -0.4] });
      shoot(DA.scene, [bLady, bGirl, bCrew], V3(11.5, 2.4, -6.5), V3(11.0, 2.4, -7.5), V3(5.8, 1.2, -14.3), V3(4, 2, -18), k, { ...LK.dawn, fov: 48 }, 9);
      blit(); pill('705 RESCUED', (t - st - 0.3) / 0.3, 260, 'rgba(20,70,50,0.9)');
    } });
    cue(st + 0.2, 'sparkle', { gain: 0.35 }); }

  { const st = cut(19), wc = Wd('californian', 19);
    wrap({ id: 'S20', at: st, note: 'push in on the small steamer sitting on the horizon at dawn; a big question mark', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); boat.visible = false; carp.visible = false; [bLady, bGirl, bCrew].forEach((p) => (p.group.visible = false)); calFar.visible = true;
      shoot(DA.scene, [], V3(30, 2.2, -60), V3(40, 2.6, -95), V3(50, 3, -150), null, k, { ...LK.dawn, fov: 34 }, 60);
      blit(); const q = eob(clamp((t - wc) / 0.35)); if (q > 0) { ctx.save(); ctx.translate(540, 470); ctx.scale(q, q); ctx.font = '900 300px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineWidth = 16; ctx.strokeStyle = INK; ctx.strokeText('?', 0, 0); ctx.fillStyle = '#F2C230'; ctx.fillText('?', 0, 0); ctx.restore(); }
    } });
    cue(wc, 'heartbeat', { gain: 0.6 }); }

  { const st = cut(20), wy = Wd('yes', 20);
    wrap({ id: 'S21', at: st, note: 'inquiry room: the judge raises the gavel and bangs it on "yes"', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); iCap.group.visible = iA.group.visible = iB.group.visible = false;
      const hit = clamp((t - wy + 0.12) / 0.12); iJudge.set({ mood: t > wy ? 'angry' : 'neutral', armR: [lerp(150, 70, hit), lerp(-10, -40, hit)], holdR: P2.gavel, armL: [20, 10], v: 'g', blink: blink(t) });
      shoot(IQ.scene, [iJudge], V3(0.2, 2.0, -0.6), V3(0.1, 2.1, -1.4), V3(0, 2.1, -5.2), null, k, LK.room);
      blit(); pill('US + BRITISH INQUIRIES, 1912', (t - st - 0.1) / 0.3, 250, 'rgba(42,30,24,0.9)', '#FFFFFF', 44);
    } });
    cue(wy, 'thud', { gain: 1 }); cue(wy + 0.02, 'slam', { gain: 0.5 }); }

  { const st = cut(21);
    wrap({ id: 'S22', at: st, note: 'wide on the bench; verdict stamp MANY, IF NOT ALL, COULD HAVE BEEN SAVED', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); iJudge.set({ mood: 'angry', armR: [70, -40], holdR: P2.gavel, armL: [20, 10], v: 'g' });
      shoot(IQ.scene, [iJudge], V3(-1.6, 2.2, 1.6), V3(-1.2, 2.2, 1.0), V3(0, 1.8, -4.6), null, k, { ...LK.room, fov: 46 });
      blit(); stamp(['MANY, IF NOT ALL,', 'COULD HAVE', 'BEEN SAVED'], (t - st - 0.05) / 0.25, { y: 560, size: 68 });
    } });
    cue(st + 0.05, 'stamp', { gain: 0.9 }); }

  { const st = cut(22), wd = Wd('denied', 22);
    wrap({ id: 'S23', at: st, note: 'the captain at the inquiry shakes his head, arms folded; bubble on "denied"', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); iCap.group.visible = true; iA.group.visible = iB.group.visible = false; iCap.at(-1.2, 0, -2.4);
      const shake = t > wd && t < wd + 1.4 ? Math.sin(t * 16) * 0.7 : 0;
      iCap.set({ mood: t > wd ? 'angry' : 'neutral', armL: [70, 100], armR: [70, 100], look: [shake, 0], blink: blink(t) });
      iJudge.set({ mood: 'neutral', armR: [20, 10], armL: [20, 10] });
      shoot(IQ.scene, [iJudge, iCap], V3(0.4, 1.7, 0.8), V3(0.1, 1.65, 0.2), V3(-1.2, 1.4, -2.4), null, k, LK.room);
      blit(); bubble('I DID NOTHING WRONG!', (t - wd) / 0.25, 600, 330, 46);
    } });
    cue(st, 'whoosh', { gain: 0.3 }); }

  { const st = cut(23);
    wrap({ id: 'S24', at: st, note: 'the calm sea; a year counter spins 1912 → 2026', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); boat.visible = carp.visible = calFar.visible = false; [bLady, bGirl, bCrew].forEach((p) => (p.group.visible = false)); bob(ring, t, 0.15);
      shoot(DA.scene, [], V3(-4, 2, 6), V3(-1, 4, 2), V3(0, 0.5, -4), V3(-20, 8, -200), k, { ...LK.dawn, fov: 48 }, 20);
      blit(); const yr = Math.round(lerp(1912, 2026, eio(clamp((t - st) / (d * 0.85))))); counter(yr, (t - st) / 0.3, 'AND COUNTING', 340);
    } });
    for (let i = 0; i < 6; i++) cue(cut(23) + 0.1 + i * 0.25, 'tock', { gain: 0.35 }); }

  { const st = cut(24);
    wrap({ id: 'S25', at: st, note: 'two modern people argue in the old inquiry room: HE COULD HAVE! vs TOO FAR AWAY!', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); iCap.group.visible = false; iA.group.visible = iB.group.visible = true; iA.at(-0.5, 0, -2.0); iB.at(0.5, 0, -2.0);
      iA.set({ mood: 'angry', armR: [80, -10], armL: [20, 10], talk: talk(t, Math.sin(t * 3) > 0), look: [0.8, 0] }); iB.set({ mood: 'angry', armL: [80, -10], armR: [20, 10], talk: talk(t, Math.sin(t * 3) <= 0), look: [-0.8, 0] });
      shoot(IQ.scene, [iJudge, iA, iB], V3(0, 1.6, 2.2), V3(0, 1.6, 1.6), V3(0, 1.3, -2.0), null, k, { ...LK.room, fov: 50 });
      blit(); bubble('HE COULD HAVE!', (t - st - 0.1) / 0.25, 300, 330, 44); bubble('TOO FAR AWAY!', (t - st - 0.6) / 0.25, 780, 520, 44);
    } });
    cue(st + 0.1, 'pop', { gain: 0.5 }); cue(st + 0.6, 'pop', { gain: 0.5 }); }

  { const st = cut(25), wy = Wd('you', 25);
    wrap({ id: 'S26', at: st, note: "the Californian's night deck again; rockets burst far away; the officer turns to camera, worried", draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); rocketsAt(t); sink(0.6); dMate.group.visible = false;
      dOff.at(-1.6, 3.5, -1.7); dOff.set({ mood: t > wy ? 'worried' : 'neutral', armL: [20, 10], armR: [20, 10], look: t > wy ? [0, 0] : [-0.7, -0.4], sweat: t > wy ? 1 : 0, blink: blink(t) });
      shoot(NI.scene, [dOff], V3(1.0, 5.4, 3.6), V3(-0.4, 5.0, 1.0), V3(-8.3, 9, -40), V3(-1.6, 5.0, -1.7), k, { ...LK.sea, fov: 56 }, lerp(6, 2.8, k));
      blit();
    } });
    cue(wy, 'heartbeat', { gain: 0.7 }); }

  return { shots: S, cues: CUES };
}
