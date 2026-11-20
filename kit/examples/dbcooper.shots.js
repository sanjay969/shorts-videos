// D.B. COOPER (Nov 24, 1971): the shot list (Tall Tale 3D, normal brightness, mystery tone).
// The hijacker is drawn as a generic cartoon man in a dark suit (no real likeness).
import * as THREE from 'three';
import { ctx, clamp, lerp, seg, eo, eio, eob } from './core/lib.js';
import { L, Le, Wd, T } from './core/timing.js';
import { camera } from './core/engine.js';
import * as WD from './core/world.js';
import * as PR from './core/props.js';
import * as TW from './core/town.js';
import * as W from './core/winter.js';
import * as SK from './core/sky.js';
import { Toon, PROPS } from './core/toon.js';

const V3 = (x, y, z) => new THREE.Vector3(x, y, z);
const mix = (a, b, k) => a.clone().lerp(b, k);
const talk = (t, on = 1) => (on ? 0.25 + 0.75 * Math.abs(Math.sin(t * 13)) * (0.6 + 0.4 * Math.sin(t * 5.3)) : 0);
const blink = (t, off = 0) => (((t + off) % 3.3) < 0.12 ? 1 : 0);
const G = TW.gesture;
const INK = '#1F1C33';
const NT = '#A8B4D4';

const LOOK = {
  cooper: { body: '#2A2638', hat: 'none', neck: 'tie', neckCol: '#111018', extra: ['glasses'] },
  fa: { body: '#3C6FB6', hat: 'bun', hatCol: '#5A3A24', neck: 'scarf', neckCol: '#D8343F' },
  clerk: { body: '#B5372E', hat: 'visor', hatCol: '#2E4E8A', neck: 'tie', neckCol: '#F2E6CF' },
  agent: { body: '#4A4560', hat: 'bowler', hatCol: '#2A2638', neck: 'tie', neckCol: '#B5372E', extra: ['glasses'] },
  agent2: { body: '#5A6A7A', hat: 'none', neck: 'tie', neckCol: '#2E4E8A', extra: ['mustache'] },
  boy: { body: '#E8734A', hat: 'cap', hatCol: '#2E4E8A', kid: true, extra: ['freckles'] },
  dad: { body: '#7FA36A', hat: 'cap', hatCol: '#6B4A2A', extra: ['mustache'] },
  mom: { body: '#B98ACF', hat: 'bun', hatCol: '#7A4A2E' },
};
const person = (k, opts) => new Toon({ ...LOOK[k], extra: [...(LOOK[k].extra || [])] }, opts);
const P2 = {
  case: (g, x, y) => { g.save(); g.translate(x, y + 10); g.strokeStyle = INK; g.lineWidth = 6; g.fillStyle = '#4A2E1E'; g.beginPath(); g.roundRect(-70, -50, 140, 100, 10); g.fill(); g.stroke(); g.fillStyle = '#C9A13B'; g.fillRect(-12, -62, 24, 14); g.restore(); },
  caseOpen: (g, x, y) => { g.save(); g.translate(x, y + 10); g.strokeStyle = INK; g.lineWidth = 6; g.fillStyle = '#4A2E1E'; g.beginPath(); g.roundRect(-80, -20, 160, 70, 10); g.fill(); g.stroke(); g.fillStyle = '#6A4A34'; g.beginPath(); g.roundRect(-80, -110, 160, 80, 10); g.fill(); g.stroke();
    [-40, -14, 12].forEach((dx) => { g.fillStyle = '#D8343F'; g.fillRect(dx, -12, 20, 52); g.strokeRect(dx, -12, 20, 52); }); g.fillStyle = '#2A2E36'; g.fillRect(40, 0, 30, 36); g.strokeStyle = '#F2C230'; g.lineWidth = 4; g.beginPath(); g.moveTo(-30, -12); g.bezierCurveTo(-10, -40, 30, -30, 55, 0); g.stroke(); g.strokeStyle = '#3C9FD8'; g.beginPath(); g.moveTo(0, -12); g.bezierCurveTo(10, -36, 40, -40, 60, 0); g.stroke(); g.restore(); },
  note: (g, x, y) => { g.save(); g.translate(x, y - 30); g.rotate(-0.2); g.strokeStyle = INK; g.lineWidth = 5; g.fillStyle = '#FFFDF4'; g.beginPath(); g.rect(-50, -36, 100, 72); g.fill(); g.stroke(); g.strokeStyle = '#7A7A8A'; g.lineWidth = 3; for (let i = 0; i < 4; i++) { g.beginPath(); g.moveTo(-36, -18 + i * 13); g.lineTo(36, -18 + i * 13); g.stroke(); } g.restore(); },
  cash: (g, x, y) => { g.save(); g.translate(x, y - 20); g.strokeStyle = INK; g.lineWidth = 5; g.fillStyle = '#8FD08A'; g.beginPath(); g.roundRect(-46, -22, 92, 44, 5); g.fill(); g.stroke(); g.fillStyle = '#2F5E33'; g.font = '900 30px Inter'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('$', 0, 2); g.restore(); },
  bag: (g, x, y) => { g.save(); g.translate(x, y + 20); g.strokeStyle = INK; g.lineWidth = 6; g.fillStyle = '#C9B48A'; g.beginPath(); g.moveTo(-50, -40); g.quadraticCurveTo(-70, 60, 0, 70); g.quadraticCurveTo(70, 60, 50, -40); g.closePath(); g.fill(); g.stroke(); g.fillStyle = '#8A6A3A'; g.fillRect(-30, -56, 60, 18); g.fillStyle = '#2F5E33'; g.font = '900 54px Inter'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('$', 0, 18); g.restore(); },
  pack: (g, x, y) => { g.save(); g.translate(x, y - 10); g.strokeStyle = INK; g.lineWidth = 6; g.fillStyle = '#5A6A3A'; g.beginPath(); g.roundRect(-55, -45, 110, 90, 14); g.fill(); g.stroke(); g.strokeStyle = '#C9B48A'; g.lineWidth = 8; g.beginPath(); g.moveTo(-40, -45); g.lineTo(-40, 45); g.moveTo(40, -45); g.lineTo(40, 45); g.stroke(); g.restore(); },
  stick: (g, x, y) => { g.save(); g.translate(x, y); g.rotate(0.6); g.strokeStyle = INK; g.lineWidth = 5; g.fillStyle = '#8A6A43'; g.beginPath(); g.roundRect(-6, -20, 12, 150, 5); g.fill(); g.stroke(); g.restore(); },
  bundles: (g, x, y) => { g.save(); g.translate(x, y - 20); g.strokeStyle = INK; g.lineWidth = 5; [[-38, 0], [0, -14], [38, 0]].forEach(([dx, dy]) => { g.fillStyle = '#9FB88A'; g.beginPath(); g.roundRect(dx - 30, dy - 18, 60, 36, 6); g.fill(); g.stroke(); g.fillStyle = '#6A7A5A'; g.fillRect(dx - 4, dy - 18, 8, 36); }); g.restore(); },
};

// ── overlays (all above the caption zone) ──
function ribbon(text, k, y = 380, size = 84) {
  if (k <= 0) return; const a = eob(clamp(k)); ctx.save(); ctx.translate(540, y); ctx.rotate(-0.03); ctx.scale(a, a); ctx.font = `900 ${size}px Inter`; const w = ctx.measureText(text).width + 90;
  ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.fillRect(-w / 2 + 12, -62, w, 140); ctx.fillStyle = '#F2C230'; ctx.strokeStyle = INK; ctx.lineWidth = 8; ctx.beginPath(); ctx.rect(-w / 2, -70, w, 140); ctx.fill(); ctx.stroke();
  ctx.fillStyle = INK; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(text, 0, 6); ctx.restore();
}
function pill(text, k, y = 250, bg = 'rgba(31,28,51,0.88)', size = 50) {
  if (k <= 0) return; ctx.save(); ctx.globalAlpha = clamp(k * 1.5); ctx.translate(540, y + (1 - eo(clamp(k))) * 30); ctx.font = `900 ${size}px Inter`; const w = ctx.measureText(text).width + 70;
  ctx.fillStyle = bg; ctx.beginPath(); ctx.roundRect(-w / 2, -size * 0.85, w, size * 1.7, size * 0.85); ctx.fill(); ctx.strokeStyle = '#F2C230'; ctx.lineWidth = 5; ctx.stroke();
  ctx.fillStyle = '#FFFFFF'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(text, 0, 4); ctx.restore();
}
function counter(n, k, label, y = 330, w = 560) {
  if (k <= 0) return; ctx.save(); ctx.globalAlpha = clamp(k * 2); ctx.translate(540, y); ctx.fillStyle = 'rgba(16,22,40,0.86)'; ctx.beginPath(); ctx.roundRect(-w / 2, -110, w, 220, 30); ctx.fill(); ctx.strokeStyle = '#F2C230'; ctx.lineWidth = 6; ctx.stroke();
  ctx.fillStyle = '#FFFFFF'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.font = '900 110px Inter'; ctx.fillText(String(n), 0, -14); ctx.font = '800 36px Inter'; ctx.fillStyle = '#F2C230'; ctx.fillText(label, 0, 72); ctx.restore();
}
function stamp(lines, p, { x = 540, y = 520, rot = -0.08, col = '#2F7A3A', size = 84, fill = 'rgba(240,255,235,0.94)' } = {}) {
  if (p <= 0) return; ctx.save(); ctx.translate(x, y); ctx.rotate(rot); const s = lerp(2.3, 1, eo(clamp(p))); ctx.scale(s, s); ctx.globalAlpha = Math.min(1, p * 1.6);
  ctx.font = `900 ${size}px Inter`; const w = Math.max(...lines.map((l) => ctx.measureText(l).width)) + 80, h = lines.length * size * 1.08 + 50;
  ctx.fillStyle = fill; ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, 22); ctx.fill(); ctx.strokeStyle = col; ctx.lineWidth = 12; ctx.stroke();
  ctx.fillStyle = col; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; lines.forEach((l, i) => ctx.fillText(l, 0, (i - (lines.length - 1) / 2) * size * 1.08 + 4)); ctx.restore();
}
function noteCard(k, y = 520) {
  if (k <= 0) return; const a = eob(clamp(k)); ctx.save(); ctx.translate(540, y); ctx.rotate(-0.05); ctx.scale(a, a);
  ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.fillRect(-330, -170, 680, 360); ctx.fillStyle = '#FFFDF4'; ctx.strokeStyle = INK; ctx.lineWidth = 8; ctx.beginPath(); ctx.rect(-340, -180, 680, 360); ctx.fill(); ctx.stroke();
  ctx.strokeStyle = '#9CC7E4'; ctx.lineWidth = 3; for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.moveTo(-310, -110 + i * 52); ctx.lineTo(310, -110 + i * 52); ctx.stroke(); }
  ctx.fillStyle = '#1F2A5A'; ctx.font = 'italic 800 64px Georgia, serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('I have a bomb', 0, -60); ctx.fillText('in my briefcase.', 0, 30);
  ctx.restore();
}
function ticket(k, y = 500) {
  if (k <= 0) return; const a = eob(clamp(k)); ctx.save(); ctx.translate(540, y); ctx.rotate(0.04); ctx.scale(a, a);
  ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.fillRect(-370, -150, 760, 320); ctx.fillStyle = '#F4EFE4'; ctx.strokeStyle = INK; ctx.lineWidth = 8; ctx.beginPath(); ctx.roundRect(-380, -160, 760, 320, 18); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#B5372E'; ctx.fillRect(-380, -160, 760, 70); ctx.fillStyle = '#FFFFFF'; ctx.font = '900 40px Inter'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillText('FLIGHT 305 · PORTLAND → SEATTLE', -350, -124);
  ctx.fillStyle = INK; ctx.font = '800 34px Inter'; ctx.fillText('PASSENGER', -350, -40); ctx.font = '900 80px Inter'; ctx.fillText('DAN COOPER', -350, 30); ctx.font = '800 34px Inter'; ctx.fillText('ONE WAY · PAID CASH', -350, 110);
  ctx.setLineDash([12, 10]); ctx.beginPath(); ctx.moveTo(210, -90); ctx.lineTo(210, 160); ctx.stroke(); ctx.setLineDash([]); ctx.font = '900 70px Inter'; ctx.textAlign = 'center'; ctx.fillText('18C', 295, 40); ctx.restore();
}
function chutes(n, k, y = 330) {
  if (k <= 0) return; ctx.save(); ctx.translate(540, y); ctx.globalAlpha = clamp(k * 2); ctx.fillStyle = 'rgba(16,22,40,0.86)'; ctx.beginPath(); ctx.roundRect(-420, -120, 840, 240, 30); ctx.fill(); ctx.strokeStyle = '#F2C230'; ctx.lineWidth = 6; ctx.stroke();
  for (let i = 0; i < 4; i++) { const p = eob(clamp((k * 4 - i) * 1.2)); if (p <= 0) continue; ctx.save(); ctx.translate(-300 + i * 200, -10); ctx.scale(p, p);
    ctx.fillStyle = i % 2 ? '#F2E6CF' : '#D8584A'; ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(0, -10, 70, Math.PI, 0); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = '#D8D8D8'; ctx.lineWidth = 3; [-60, -20, 20, 60].forEach((dx) => { ctx.beginPath(); ctx.moveTo(dx, -10); ctx.lineTo(0, 80); ctx.stroke(); }); ctx.fillStyle = '#FFFFFF'; ctx.beginPath(); ctx.arc(0, 86, 10, 0, 7); ctx.fill(); ctx.restore(); }
  ctx.restore();
}
function routeMap(k, d, y = 470) {
  if (k <= 0) return; const a = eo(clamp(k * 2)); ctx.save(); ctx.translate(540, y); ctx.scale(a, a);
  ctx.fillStyle = '#F4E3C0'; ctx.strokeStyle = INK; ctx.lineWidth = 8; ctx.beginPath(); ctx.roundRect(-330, -360, 660, 700, 26); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#9CC7E4'; ctx.fillRect(-306, -336, 612, 652);
  ctx.fillStyle = '#E9D7A5'; ctx.strokeStyle = '#B08A5A'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(-200, -336); ctx.lineTo(306, -336); ctx.lineTo(306, 316); ctx.lineTo(60, 316); ctx.lineTo(40, 220); ctx.lineTo(-30, 150); ctx.lineTo(-110, 60); ctx.lineTo(-160, -60); ctx.lineTo(-190, -200); ctx.closePath(); ctx.fill(); ctx.stroke();
  const A = [-150, -260], P = [-165, -175], M = [80, 270]; ctx.fillStyle = INK; [A, P, M].forEach(([x, yy]) => { ctx.beginPath(); ctx.arc(x, yy, 12, 0, 7); ctx.fill(); });
  ctx.font = '900 32px Inter'; ctx.textAlign = 'left'; ctx.fillText('SEATTLE', A[0] + 22, A[1] + 4); ctx.fillText('PORTLAND', P[0] + 22, P[1] + 10); ctx.fillText('MEXICO', M[0] + 22, M[1] + 4);
  const e = [lerp(A[0], M[0], clamp(d)), lerp(A[1], M[1], clamp(d))]; ctx.strokeStyle = '#D8343F'; ctx.lineWidth = 10; ctx.setLineDash([24, 16]); ctx.beginPath(); ctx.moveTo(A[0], A[1]); ctx.lineTo(e[0], e[1]); ctx.stroke(); ctx.setLineDash([]);
  ctx.restore();
}
function suspects(k, t, y = 470) {
  if (k <= 0) return; ctx.save(); ctx.translate(540, y); const n = Math.floor(clamp(k) * 35);
  for (let i = 0; i < n; i++) { const c = i % 7, r = Math.floor(i / 7); const x = -390 + c * 130, yy = -300 + r * 150; ctx.save(); ctx.translate(x, yy); ctx.rotate((Math.sin(i * 7.3)) * 0.08);
    ctx.fillStyle = '#F4EFE4'; ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.fillRect(-52, -64, 104, 128); ctx.strokeRect(-52, -64, 104, 128); ctx.fillStyle = ['#5A6A8A', '#6A5A4A', '#4A5A4A', '#7A5A6A'][i % 4]; ctx.beginPath(); ctx.arc(0, -16, 24, 0, 7); ctx.fill(); ctx.beginPath(); ctx.ellipse(0, 44, 38, 30, 0, Math.PI, 0); ctx.fill();
    if (i % 3 === 0) { ctx.strokeStyle = '#D8343F'; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(-40, -50); ctx.lineTo(40, 50); ctx.moveTo(40, -50); ctx.lineTo(-40, 50); ctx.stroke(); } ctx.restore(); }
  ctx.restore();
}
function bigQ(k, y = 470) { const q = eob(clamp(k)); if (q <= 0) return; ctx.save(); ctx.translate(540, y); ctx.scale(q, q); ctx.font = '900 300px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineWidth = 16; ctx.strokeStyle = INK; ctx.strokeText('?', 0, 0); ctx.fillStyle = '#F2C230'; ctx.fillText('?', 0, 0); ctx.restore(); }
const fade = (a) => { if (a <= 0) return; ctx.save(); ctx.globalAlpha = clamp(a); ctx.fillStyle = '#000'; ctx.fillRect(0, 0, 1080, 1920); ctx.restore(); };

export function buildShots(E) {
  const S = [], CUES = [], add = (o) => (S.push(o), o), cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut = (i) => (i === 0 ? 0 : L(i) - 0.06);
  const cam = camera(36);
  const LK = { day: { bloom: 0.12, bloomThreshold: 1.08, aperture: 0.00015, maxblur: 0.003 }, night: { bloom: 0.12, bloomThreshold: 1.08, aperture: 0.0001, maxblur: 0.002 } };
  let T_now = 0; const ups = [];
  const shoot = (scene, people, from, to, at, at2, k, look, focus) => {
    if (cam.fov !== (look.fov || 36)) { cam.fov = look.fov || 36; cam.updateProjectionMatrix(); }
    cam.position.copy(mix(from, to, k)); cam.lookAt(at2 ? mix(at, at2, k) : at);
    people.forEach((p) => p.face(cam)); ups.forEach((u) => { if (u.scene === scene) u.update(T_now, cam); });
    E.render(scene, cam, { ...look, focus: focus ?? cam.position.distanceTo(at2 ? mix(at, at2, k) : at) });
  };
  const wrap = (o) => { const d0 = o.draw; o.draw = (lt, d, t, blit) => { T_now = t; d0(lt, d, t, blit); }; return add(o); };

  // ═════ TARMAC (day, for the terminal window view) ═════
  const TM = WD.meadow(E, { fenceOn: false, flowers: false });
  { const ap = new THREE.Mesh(new THREE.PlaneGeometry(200, 60), WD.mat({ color: '#7A7E88' })); ap.rotation.x = -Math.PI / 2; ap.position.set(0, 0.05, -18); TM.scene.add(ap); const j = SK.jet727(); j.position.set(0, 2.4, -18); j.rotation.y = 0.15; TM.scene.add(j); }
  const tview = (() => { const c = new THREE.PerspectiveCamera(40, 4 / 3, 0.1, 800); c.position.set(0, 4, 14); c.lookAt(0, 3, -18); const t = WD.snapshot(E, TM.scene, c); t.wrapS = THREE.RepeatWrapping; return t; })();

  // ═════ TERMINAL ═════
  const TR = WD.interior(E, { w: 8, depth: 6, h: 3.6, wall: '#C9B48A', motif: '#D4C098', floor: '#8A8A90', ceiling: '#3A4A5A', signText: 'TICKETS · FLIGHT 305', picture: false, counterOn: true, litter: false, view: tview });
  const tClerk = person('clerk'), tCoop = person('cooper'); [tClerk, tCoop].forEach((p) => TR.scene.add(p.group));
  const tExtras = WD.extras(TR.scene, [[-2.6, -3.4, 0], [-1.4, -4.2, 1], [-3.2, -1.6, 2]]);

  // ═════ CABIN ═════
  const CB = SK.cabin(E);
  const cCoop = person('cooper'), cFA = person('fa'); [cCoop, cFA].forEach((p) => CB.scene.add(p.group));
  const pax = WD.extras(CB.scene, [[-0.75, -1.6, 0], [1.35, -3.2, 1], [-1.35, -4.8, 2], [0.75, -6.4, 3], [-0.75, -8.0, 4], [1.35, -9.6, 5]]); pax.forEach((p) => (p.group.position.y = -0.35));
  const seatC = V3(-0.75, 0, 1.0);                                  // Cooper's rear aisle seat

  // ═════ NIGHT (rain over forest; a Seattle apron near the origin) ═════
  const NR = SK.nightRain(E); ups.push(NR);
  const jet = SK.jet727(); NR.scene.add(jet);
  const apron = new THREE.Group(); NR.scene.add(apron);
  { const ap = new THREE.Mesh(new THREE.PlaneGeometry(160, 60), WD.mat({ color: '#3A3E48' })); ap.rotation.x = -Math.PI / 2; ap.position.y = 0.05; apron.add(ap);
    for (let i = 0; i < 26; i++) { const l = new THREE.Mesh(new THREE.SphereGeometry(0.15, 8, 6), new THREE.MeshBasicMaterial({ color: new THREE.Color(i % 2 ? '#FFD27A' : '#7AB8FF'), toneMapped: false })); l.position.set(-60 + i * 4.8, 0.2, 12); apron.add(l); }
    const tw = new THREE.Mesh(new THREE.BoxGeometry(4, 16, 4), WD.mat({ color: '#6A6E78' })); tw.position.set(-30, 8, -24); apron.add(tw); const cab = new THREE.Mesh(new THREE.BoxGeometry(6, 3, 6), WD.mat({ color: '#2A3446' })); cab.position.set(-30, 17, -24); apron.add(cab);
    const fl = new THREE.PointLight('#FFE2B0', 40, 60, 1.2); fl.position.set(0, 14, 14); apron.add(fl); }
  const nCoop = person('cooper'), nFA = person('fa'); [nCoop, nFA].forEach((p) => { p.tint(NT); NR.scene.add(p.group); });
  const leavers = WD.extras(NR.scene, Array.from({ length: 8 }, (_, i) => [0, 0, i])); leavers.forEach((p) => p.tint(NT));
  const chute = SK.parachute(); NR.scene.add(chute);
  const treeChute = SK.parachute('#E8E2D4', '#B5553C'); NR.scene.add(treeChute); treeChute.position.set(221.5, 7, 161); treeChute.rotation.set(0.3, 0, 0.4);
  { const pn = W.pine(14, 4); pn.position.set(222, 0, 160); NR.scene.add(pn); }
  const parkJet = () => { jet.position.set(0, 2.6, 0); jet.rotation.set(0, 0, 0); };
  const flyJet = (x, y, z, ry = 0) => { jet.position.set(x, y, z); jet.rotation.set(0, ry, -0.02); };

  // ═════ FBI ═════
  const FB = WD.interior(E, { w: 7, depth: 5, h: 3.4, wall: '#4A5A6A', motif: '#566878', floor: '#6B5A4A', ceiling: '#2A3038', signText: null, picture: false, counterOn: false, litter: false });
  if (FB.window) { FB.window.visible = false; }
  { const wp = PR.poster(['WANTED', 'HIJACKER', 'AIR PIRACY', 'NOV 24, 1971'], { w: 1.3, h: 1.8, bg: '#F4EFE4' }); wp.position.set(-1.6, 2.0, -2.45); FB.scene.add(wp);
    const map = new THREE.Mesh(new THREE.PlaneGeometry(2.0, 1.4), WD.mat({ map: WD.canvasTex('searchmap', 512, 360, (c) => { c.fillStyle = '#C9D8A8'; c.fillRect(0, 0, 512, 360); c.strokeStyle = '#3C7AB0'; c.lineWidth = 16; c.beginPath(); c.moveTo(0, 280); c.bezierCurveTo(160, 240, 300, 330, 512, 260); c.stroke(); c.fillStyle = 'rgba(216,52,63,0.3)'; c.beginPath(); c.ellipse(280, 150, 140, 80, -0.3, 0, 7); c.fill(); c.strokeStyle = '#D8343F'; c.lineWidth = 5; c.stroke(); c.fillStyle = '#D8343F'; for (let i = 0; i < 12; i++) { c.beginPath(); c.arc(180 + Math.sin(i * 4.1) * 110, 150 + Math.cos(i * 2.3) * 60, 7, 0, 7); c.fill(); } c.strokeStyle = '#1F1C33'; c.lineWidth = 10; c.strokeRect(5, 5, 502, 350); }) }));
    map.position.set(1.0, 2.0, -2.46); FB.scene.add(map); const dk = PR.desk(2.2); dk.position.set(0, 0, -0.6); FB.scene.add(dk); }
  const fA1 = person('agent'), fA2 = person('agent2'); [fA1, fA2].forEach((p) => FB.scene.add(p.group));

  // ═════ RIVER (Feb 1980) ═════
  const RV = SK.riverBar(E); ups.push(RV);
  const rBoy = person('boy', { height: 1.3 }), rDad = person('dad'), rMom = person('mom'); [rBoy, rDad, rMom].forEach((p) => RV.scene.add(p.group));
  const fire = TW.flames(5, 0.5, 2); fire.position.set(2.6, 0.05, 3.2); RV.scene.add(fire);
  const hole = new THREE.Mesh(new THREE.CircleGeometry(0.45, 20), WD.mat({ color: '#8A7450' })); hole.rotation.x = -Math.PI / 2; hole.position.set(0.2, 0.06, 2.4); RV.scene.add(hole);
  const blanket = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 1.6), WD.mat({ map: WD.canvasTex('picnic', 256, 192, (c) => { for (let y = 0; y < 6; y++) for (let x = 0; x < 8; x++) { c.fillStyle = (x + y) % 2 ? '#D8343F' : '#F4EFE4'; c.fillRect(x * 32, y * 32, 32, 32); } }) })); blanket.rotation.x = -Math.PI / 2; blanket.position.set(-2.6, 0.06, 3.0); RV.scene.add(blanket);

  const nightReset = () => { chute.visible = false; nCoop.group.visible = false; nFA.group.visible = false; leavers.forEach((p) => (p.group.visible = false)); apron.visible = false; };

  // ═════════════ SHOTS ═════════════
  // 1a · "In November 1971," the airport terminal, a jet waiting outside the window
  { const st = cut(0), wy = Wd('1971', 0);
    wrap({ id: 'S01', at: st, note: 'the airport terminal, a 727 waiting outside the big window; ribbon NOV 24, 1971', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); tCoop.group.visible = false; tClerk.at(3.4, 0, -1.6); tClerk.set({ mood: 'happy', armL: [20, 10], armR: [20, 10], blink: blink(t) });
      shoot(TR.scene, [tClerk, ...tExtras], V3(-2.6, 2.0, 2.6), V3(-1.6, 1.9, 1.8), V3(0, 1.8, -6), null, k, { ...LK.day, fov: 52 });
      blit(); ribbon('NOV 24, 1971', (t - wy + 0.1) / 0.3); pill('PORTLAND, OREGON', (t - st - 0.4) / 0.3, 560);
    } });
    cue(0.05, 'whoosh', { gain: 0.3 }); cue(Wd('1971', 0), 'stamp', { gain: 0.6 }); }
  // 1b · "a calm man in a suit" Cooper walks in with his briefcase
  { const st = Wd('calm', 0) - 0.2;
    wrap({ id: 'S01b', at: st, note: 'a calm man in a dark suit and dark glasses walks in, briefcase in hand', draw(lt, d, t, blit) {
      const k = clamp(lt / d); tClerk.at(3.4, 0, -1.6); tCoop.group.visible = true; tCoop.at(lerp(-2.4, 1.6, eio(k)), 0, -1.0);
      tCoop.set({ mood: 'neutral', legs: k < 0.95 ? 'walk' : 'stand', phase: t * 6, armR: [20, 10], holdR: P2.case, armL: [20, 10], v: 'c', look: [0.6, 0] });
      shoot(TR.scene, [tCoop, tClerk, ...tExtras], V3(-0.4, 1.5, 2.6), V3(0.6, 1.5, 2.2), V3(-1.0, 1.3, -1.0), V3(1.4, 1.3, -1.0), eio(k), { ...LK.day, fov: 48 });
      blit(); pill('CALM · DARK SUIT · BRIEFCASE', (t - st - 0.2) / 0.3, 250, 'rgba(31,28,51,0.88)', 42);
    } });
    cue(st, 'tock', { gain: 0.3 }); cue(st + 0.5, 'tock', { gain: 0.3 }); }
  // 1c · "bought a plane ticket for eighteen dollars," cash slides across the counter
  { const st = Wd('bought', 0) - 0.15, we = Wd('eighteen', 0);
    wrap({ id: 'S01c', at: st, note: 'at the counter he slides cash across; the clerk hands back a ticket; pill $18 · CASH', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); tClerk.at(3.4, 0, -1.6); tCoop.group.visible = true; tCoop.at(2.0, 0, -1.6);
      tCoop.set({ mood: 'neutral', legs: 'stand', armR: [80, -30], holdR: t < we ? P2.cash : null, armL: [20, 10], holdL: P2.case, v: 'k' + (t < we), look: [0.8, 0] }); tClerk.set({ mood: 'happy', armL: [80, -30], holdL: t > we ? P2.note : null, v: 'cl' + (t > we), talk: talk(t), look: [-0.8, 0] });
      shoot(TR.scene, [tCoop, tClerk], V3(0.0, 1.8, 1.4), V3(0.2, 1.75, 1.0), V3(2.7, 1.4, -1.6), null, k, { ...LK.day, fov: 60 }, 3.5);
      blit(); pill('$18 TICKET · PAID CASH', (t - we + 0.1) / 0.3);
    } });
    cue(Wd('eighteen', 0), 'ding', { gain: 0.5 }); }

  // 2 · "under the name Dan Cooper." the ticket card
  { const st = cut(1);
    wrap({ id: 'S02', at: st, note: 'the ticket card pops up: PASSENGER DAN COOPER · ONE WAY · PAID CASH; he smiles, sly', draw(lt, d, t, blit) {
      tClerk.at(3.4, 0, -1.6); const k = eio(clamp(lt / d)); tCoop.at(2.0, 0, -1.6); tCoop.set({ mood: 'sly', armR: [20, 10], holdR: null, armL: [20, 10], holdL: P2.case, v: 's', look: [-0.3, 0] });
      shoot(TR.scene, [tCoop, tClerk], V3(1.2, 1.65, 0.6), V3(1.4, 1.62, 0.1), V3(2.0, 1.5, -1.6), null, k, { ...LK.day, fov: 46 }, 2);
      blit(); ticket((t - st) / 0.3, 560);
    } });
    cue(st + 0.05, 'pop', { gain: 0.6 }); }

  // 3a · "Right after takeoff," the jet climbs into the rain
  { const st = cut(2);
    wrap({ id: 'S03', at: st, note: 'dusk rain: the jet climbs away from the runway lights', draw(lt, d, t, blit) {
      const k = clamp(lt / d); nightReset(); apron.visible = true; jet.stair(0); flyJet(-20 + k * 40, 6 + k * 14, 0, 0); jet.rotation.z = 0.16;
      shoot(NR.scene, [], V3(10, 4, 75), V3(14, 6, 72), V3(jet.position.x, jet.position.y, 0), null, 0, { ...LK.night, fov: 44 }, 70);
      blit(); pill('FLIGHT 305 · 2:50 PM', (t - st - 0.2) / 0.3, 250);
    } });
    cue(st, 'whoosh', { dur: 1.4, gain: 0.7 }); }
  // 3b · "he handed the flight attendant a note:" cabin, rear row
  { const st = Wd('handed', 2) - 0.2;
    wrap({ id: 'S03b', at: st, note: 'cabin, last row: Cooper hands a folded note to the flight attendant', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); cCoop.at(seatC.x, -0.35, seatC.z); cFA.at(0.15, 0, 0.0);
      cCoop.set({ mood: 'neutral', armR: [80, -20], holdR: P2.note, armL: [20, 10], v: 'n', look: [0.6, -0.2], blink: blink(t) }); cFA.set({ mood: 'happy', armL: [70, -20], armR: [20, 10], look: [-0.6, 0.2] });
      shoot(CB.scene, [cCoop, cFA, ...pax], V3(0.5, 1.6, -2.8), V3(0.4, 1.55, -2.2), V3(-0.3, 1.1, 0.6), null, k, { ...LK.day, fov: 50 }, 3);
      blit();
    } });
    cue(st + 0.3, 'pop', { gain: 0.4 }); }

  // 4 · "I have a bomb in my briefcase." the note card
  { const st = cut(3);
    wrap({ id: 'S04', at: st, note: 'the note fills the screen in neat handwriting: "I have a bomb in my briefcase."; behind it the case opens', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); cCoop.at(seatC.x, -0.35, seatC.z); cFA.at(0.15, 0, 0.0); cFA.set({ mood: 'shock', ...G('head', t), sweat: 1 }); cCoop.set({ mood: 'neutral', armR: [20, 10], holdR: null, armL: [70, -60], holdL: P2.caseOpen, v: 'o' });
      shoot(CB.scene, [cCoop, cFA, ...pax], V3(0.6, 1.5, -1.8), V3(0.5, 1.5, -1.4), V3(-0.3, 1.1, 0.6), null, k, { ...LK.day, fov: 48 }, 2.4);
      blit(); noteCard((t - st) / 0.25, 470);
    } });
    cue(st + 0.05, 'stamp', { gain: 0.5 }); cue(Wd('bomb', 3), 'heartbeat', { gain: 0.7 }); }

  // 5 · "He wanted two hundred thousand dollars,"
  { const st = cut(4), wt = Wd('two', 4);
    wrap({ id: 'S05', at: st, note: 'close on Cooper, calm, explaining with his hands; stamp $200,000 IN $20 BILLS', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); cCoop.at(seatC.x, -0.35, seatC.z); cCoop.set({ mood: 'smug', holdL: null, ...G('explain', t), talk: talk(t), look: [0.4, 0] });
      shoot(CB.scene, [cCoop, cFA, ...pax], V3(0.2, 1.3, -1.0), V3(0.1, 1.3, -0.6), V3(-0.75, 1.0, 1.0), null, k, { ...LK.day, fov: 46 }, 1.8);
      blit(); stamp(['$200,000', 'IN $20 BILLS'], (t - wt) / 0.25, { y: 460, size: 90 });
    } });
    cue(Wd('two', 4), 'stamp', { gain: 0.8 }); }

  // 6 · "and four parachutes."
  { const st = cut(5), wf = Wd('four', 5);
    wrap({ id: 'S06', at: st, note: 'the flight attendant writes fast on her pad; four parachute icons pop in a row', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); cFA.at(0.15, 0, 0.0); cFA.set({ mood: 'worried', armL: [70, -60], holdL: P2.note, armR: [60, -60], v: 'w', sweat: 1, look: [0, 0.5] });
      shoot(CB.scene, [cCoop, cFA, ...pax], V3(1.0, 1.6, -1.8), V3(0.8, 1.6, -1.4), V3(0.15, 1.4, 0), null, k, { ...LK.day, fov: 48 }, 2);
      blit(); chutes(4, (t - wf + 0.1) / 0.6, 330);
    } });
    for (let i = 0; i < 4; i++) cue(Wd('four', 5) + i * 0.15, 'pop', { gain: 0.45 }); }

  // 7 · "In Seattle, he got them,"
  { const st = cut(6);
    wrap({ id: 'S07', at: st, note: 'Seattle, night rain: the jet parked under floodlights, aft stairs down; the attendant carries a money bag over', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); nightReset(); apron.visible = true; parkJet(); jet.stair(1); nFA.group.visible = true;
      nFA.at(lerp(-24, -19, eo(k)), 0, 2.0); nFA.set({ mood: 'worried', legs: k < 0.9 ? 'walk' : 'stand', phase: t * 6, armL: [60, -80], armR: [60, -80], holdR: P2.bag, v: 'b' });
      shoot(NR.scene, [nFA], V3(-12, 2.6, 11), V3(-13, 2.5, 9.5), V3(-18, 1.6, 1.5), null, k, { ...LK.night, fov: 52 }, 9);
      blit(); pill('SEATTLE · RANSOM DELIVERED', (t - st - 0.2) / 0.3, 250, 'rgba(31,28,51,0.88)', 44);
    } });
    cue(st, 'whoosh', { gain: 0.3 }); }

  // 8 · "let all thirty-six passengers go,"
  { const st = cut(7), wt = Wd('thirty', 7);
    wrap({ id: 'S08', at: st, note: 'passengers walk off across the wet apron; counter 36 PASSENGERS FREED', draw(lt, d, t, blit) {
      const k = clamp(lt / d); nightReset(); apron.visible = true; parkJet(); jet.stair(1);
      leavers.forEach((p, i) => { p.group.visible = true; const a = clamp(k * 1.4 - i * 0.08); p.at(-19 - a * 8 - (i % 2) * 0.8, 0, 2 + a * 8 + (i % 3) * 0.7); p.set({ mood: 'happy', legs: 'walk', phase: t * 7 + i }); });
      shoot(NR.scene, leavers, V3(-15, 2.4, 15), V3(-16, 2.4, 14), V3(-23, 1.2, 5), null, eio(k), { ...LK.night, fov: 52 }, 10);
      blit(); counter(Math.round(lerp(1, 36, eo(clamp((t - wt + 0.2) / 0.8)))), (t - st) / 0.3, 'PASSENGERS FREED');
    } });
    for (let i = 0; i < 5; i++) cue(Wd('thirty', 7) - 0.2 + i * 0.16, 'tock', { gain: 0.35 }); }

  // 9 · "and told the pilots to fly to Mexico."
  { const st = cut(8);
    wrap({ id: 'S09', at: st, note: 'the jet roars off into the rain; a map: dashed route SEATTLE → MEXICO', draw(lt, d, t, blit) {
      const k = clamp(lt / d); nightReset(); apron.visible = true; jet.stair(0); flyJet(-10 + k * 50, 3 + k * 20, 0, 0); jet.rotation.z = 0.18;
      shoot(NR.scene, [], V3(20, 4, 80), V3(24, 6, 76), V3(jet.position.x, jet.position.y, 0), null, 0, { ...LK.night, fov: 44 }, 75);
      blit(); routeMap((t - st) / 0.3, (t - st - 0.3) / (d - 0.4), 560);
    } });
    cue(st, 'whoosh', { dur: 1.6, gain: 0.7 }); }

  // 10a · "But somewhere over the dark, rainy forests"
  { const st = cut(9);
    wrap({ id: 'S10', at: st, note: 'high over an endless black pine forest in the storm; the jet slides past, lightning flickers', draw(lt, d, t, blit) {
      const k = clamp(lt / d); nightReset(); jet.stair(0); flyJet(-40 + k * 30, 120, 0, 0);
      shoot(NR.scene, [], V3(10, 132, 46), V3(16, 128, 40), V3(jet.position.x, 116, 0), null, 0, { ...LK.night, fov: 46 }, 40);
      blit(); pill('OVER WASHINGTON · 8 PM', (t - st - 0.3) / 0.3, 250);
    } });
    cue(st, 'chug', { dur: 2.4, gain: 0.3 }); }
  // 10b · "of Washington," Cooper straps on a parachute
  { const st = Wd('washington', 9) - 0.35;
    wrap({ id: 'S10b', at: st, note: 'the dim empty cabin: Cooper straps on a parachute pack', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); pax.forEach((p) => (p.group.visible = false)); cFA.group.visible = false; cCoop.at(0, 0, 0.6);
      cCoop.set({ mood: 'smug', armL: [60, -80], armR: [60, -80], holdR: P2.pack, holdL: null, v: 'p', look: [0, 0] });
      const ki = CB.key.intensity; CB.key.intensity = ki * 0.5; shoot(CB.scene, [cCoop], V3(0, 1.5, -2.6), V3(0, 1.45, -2.0), V3(0, 1.2, 0.6), null, k, { ...LK.day, fov: 48 }, 3); CB.key.intensity = ki;
      blit(); pax.forEach((p) => (p.group.visible = true)); cFA.group.visible = true;
    } });
    cue(st, 'zip', { gain: 0.5 }); }

  // 11 · "he lowered the back stairs of the jet,"
  { const st = cut(10), ws = Wd('stairs', 10);
    wrap({ id: 'S11', at: st, note: 'close under the tail in the rain: the aft airstair swings down, light spilling out', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); nightReset(); flyJet(0, 120, 0, 0); jet.stair(eo(clamp((t - st - 0.2) / (ws - st + 0.4))));
      shoot(NR.scene, [], V3(-24, 114, 10), V3(-23, 114.5, 9), V3(-15, 118, 0), null, k, { ...LK.night, fov: 50 }, 12);
      blit(); pill('THE BACK STAIRS', (t - ws) / 0.3, 250);
    } });
    cue(st + 0.2, 'slide', { dur: 1.2, gain: 0.6 }); cue(Wd('stairs', 10), 'thud', { gain: 0.5 }); }

  // 12 · "and jumped out into the night."
  { const st = cut(11), wj = Wd('jumped', 11); const tip = V3();
    wrap({ id: 'S12', at: st, note: 'Cooper at the end of the lowered stair in the rain; on "jumped" he drops away into the dark', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); nightReset(); flyJet(0, 120, 0, 0); jet.stair(1); jet.updateMatrixWorld(true); nCoop.group.visible = true;
      jet.hinge.localToWorld(tip.set(-3.6, 0.1, 0));
      const fall = Math.max(0, t - wj); nCoop.at(tip.x - fall * 2, tip.y - fall * fall * 9, 0);
      nCoop.set({ mood: fall > 0 ? 'happy' : 'smug', armL: fall > 0 ? [160, 10] : [60, -80], armR: fall > 0 ? [160, 10] : [60, -80], holdR: fall > 0 ? null : P2.bag, v: 'j' + (fall > 0) });
      shoot(NR.scene, [nCoop], V3(tip.x - 4, tip.y + 0.4, 9), V3(tip.x - 4, tip.y + 0.1, 8.4), V3(tip.x + 0.5, tip.y, 0), null, k, { ...LK.night, fov: 50 }, 9);
      blit();
    } });
    cue(Wd('jumped', 11), 'whoosh', { gain: 0.9 }); }

  // 13 · "He was never seen again."
  { const st = cut(12), wn = Wd('never', 12);
    wrap({ id: 'S13', at: st, note: 'far below: a tiny parachute drifts down into the black forest in the rain; pill NEVER SEEN AGAIN', draw(lt, d, t, blit) {
      const k = clamp(lt / d); nightReset(); flyJet(0, -500, 0, 0); chute.visible = true; chute.position.set(-30 + k * 3, lerp(60, 14, eio(k)), 10); chute.rotation.z = Math.sin(t * 2) * 0.1;
      shoot(NR.scene, [], V3(-10, 70, 60), V3(-14, 50, 56), V3(-30, 50, 10), V3(-28, 14, 10), eio(k), { ...LK.night, fov: 48 }, 50);
      blit(); pill('NEVER SEEN AGAIN', (t - wn + 0.1) / 0.3, 250, 'rgba(140,25,35,0.92)');
    } });
    cue(st + 0.2, 'heartbeat', { gain: 0.8 }); }

  // 14 · "The FBI searched for forty-five years,"
  { const st = cut(13);
    wrap({ id: 'S14', at: st, note: 'FBI office: WANTED poster, a search map full of pins; two agents point and argue; counter 1971 → 2016', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); fA1.at(-0.7, 0, -1.4); fA2.at(0.7, 0, -1.4); fA1.set({ mood: 'angry', ...G('pointR', t), talk: talk(t) }); fA2.set({ mood: 'worried', ...G('explain', t, 1), look: [-0.6, 0] });
      shoot(FB.scene, [fA1, fA2], V3(0, 1.8, 2.2), V3(0.2, 1.9, 1.4), V3(0, 1.6, -2.4), null, k, { ...LK.day, fov: 56 });
      blit(); counter(Math.round(lerp(1971, 2016, eio(clamp((t - st) / (d * 0.9))))), (t - st) / 0.3, 'YEARS OF SEARCHING');
    } });
    for (let i = 0; i < 6; i++) cue(cut(13) + 0.1 + i * 0.35, 'tock', { gain: 0.35 }); }
  // 15 · "checked hundreds of suspects,"
  { const st = cut(14);
    wrap({ id: 'S15', at: st, note: 'a wall of suspect cards fills up fast, many crossed out in red; agent holds his head', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); fA1.set({ mood: 'tired', ...G('head', t) });
      shoot(FB.scene, [fA1, fA2], V3(-0.3, 1.7, 1.6), V3(-0.5, 1.7, 1.0), V3(-0.7, 1.4, -1.4), null, k, { ...LK.day, fov: 50 });
      blit(); suspects((t - st) / (d * 0.8), t, 470);
    } });
    for (let i = 0; i < 8; i++) cue(cut(14) + 0.1 + i * 0.2, 'pop', { gain: 0.3 }); }
  // 16 · "and found almost nothing, except one thing:"
  { const st = cut(15), we = Wd('except', 16) - 0.05;
    wrap({ id: 'S16', at: st, note: 'both agents shrug ... then one raises a finger on "except one thing"', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); const one = t > we;
      fA1.set({ mood: one ? 'sly' : 'sad', ...(one ? G('pointUp', t) : G('shrug', t)) }); fA2.set({ mood: one ? 'shock' : 'sad', ...G('shrug', t, 1) });
      shoot(FB.scene, [fA1, fA2], V3(0, 1.6, 1.8), V3(0, 1.6, 1.2), V3(0, 1.3, -1.4), null, k, { ...LK.day, fov: 50 });
      blit(); pill(one ? 'EXCEPT ONE THING...' : 'ALMOST NOTHING', one ? (t - we) / 0.2 : (t - st) / 0.3, 250);
    } });
    cue(Wd('except', 16), 'ding', { gain: 0.5 }); }

  // 17a · "in 1980, an eight-year-old boy"
  { const st = cut(17), wy = Wd('1980', 17);
    wrap({ id: 'S17', at: st, note: 'a river sand bar: a family picnic, a small campfire; ribbon FEB 1980; pill COLUMBIA RIVER', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); fire.update(t, 1); rBoy.at(0.8, 0, 2.2); rDad.at(2.0, 0, 2.6); rMom.at(-2.4, 0, 3.2);
      rBoy.set({ mood: 'happy', ...G('wave', t) }); rDad.set({ mood: 'happy', ...G('explain', t), talk: talk(t) }); rMom.set({ mood: 'happy', armL: [20, 10], armR: [20, 10], blink: blink(t) });
      shoot(RV.scene, [rBoy, rDad, rMom], V3(0, 4, 14), V3(0, 2.6, 10), V3(0, 0.8, 0), V3(0, 1.0, 2.6), k, { ...LK.day, fov: 48 });
      blit(); ribbon('FEB 1980', (t - wy + 0.1) / 0.3); pill('COLUMBIA RIVER', (t - st - 0.5) / 0.3, 560);
    } });
    cue(st, 'whoosh', { gain: 0.3 }); }
  // 17b · "digging by a river"
  { const st = Wd('digging', 17) - 0.15;
    wrap({ id: 'S17b', at: st, note: 'close: the boy digs in the sand with a stick', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); fire.update(t, 1); rBoy.at(0.6, 0, 2.6); rBoy.set({ mood: 'happy', ...G('dig', t), holdR: P2.stick, v: 'd', look: [0, 0.8] });
      shoot(RV.scene, [rBoy, rDad, rMom], V3(1.4, 1.2, 5.6), V3(1.2, 1.1, 5.0), V3(0.4, 0.5, 2.4), null, k, { ...LK.day, fov: 48 }, 3);
      blit(); pill('8-YEAR-OLD BRIAN', (t - st - 0.2) / 0.3, 250);
    } });
    cue(st + 0.1, 'thud', { gain: 0.3 }); cue(st + 0.5, 'thud', { gain: 0.3 }); }

  // 18a · "found five thousand eight hundred dollars"
  { const st = cut(18), wf = Wd('five', 18);
    wrap({ id: 'S18', at: st, note: 'the boy jumps up holding three soggy bundles of $20 bills; dad gasps; counter $5,800', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); fire.update(t, 1); rBoy.at(0.6, 0, 2.6); rDad.at(1.8, 0, 2.2);
      rBoy.set({ mood: 'shock', armL: [150, -10], armR: [150, -10], holdR: P2.bundles, v: 'u', legs: Math.sin(t * 9) > 0.4 ? 'jump' : 'stand' }); rDad.set({ mood: 'shock', ...G('head', t), look: [-0.6, 0] });
      shoot(RV.scene, [rBoy, rDad, rMom], V3(1.4, 1.5, 6.6), V3(1.2, 1.4, 5.8), V3(1.0, 1.0, 2.4), null, k, { ...LK.day, fov: 48 }, 4);
      blit(); counter('$' + Math.round(lerp(0, 5800, eo(clamp((t - wf + 0.1) / 0.9)))).toLocaleString('en-US'), (t - st) / 0.3, 'FOUND IN THE SAND');
    } });
    cue(Wd('five', 18), 'ding', { gain: 0.6 }); cue(Wd('five', 18) + 0.1, 'sparkle', { gain: 0.4 }); }
  // 18b · "of the ransom money."
  { const st = Wd('ransom', 18) - 0.25;
    wrap({ id: 'S18b', at: st, note: 'stamp: SERIAL NUMBERS MATCH over the bundles', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); fire.update(t, 1); rBoy.set({ mood: 'proud', armR: [100, -40], holdR: P2.bundles, armL: [20, 10], v: 'p', legs: 'stand' });
      shoot(RV.scene, [rBoy, rDad, rMom], V3(1.0, 1.2, 4.2), V3(0.9, 1.15, 3.8), V3(0.7, 0.9, 2.6), null, k, { ...LK.day, fov: 46 }, 1.6);
      blit(); stamp(['SERIAL NUMBERS', 'MATCH!'], (t - st - 0.05) / 0.25, { y: 400, size: 76, col: '#B5372E', fill: 'rgba(255,253,244,0.94)' });
    } });
    cue(st + 0.05, 'stamp', { gain: 0.7 }); }

  // 19 · "The rest of the money? Still missing."
  { const st = cut(19), ws = Wd('still', 19);
    wrap({ id: 'S19', at: st, note: 'the empty dig hole on the sand bar, camera rises toward the dark hills; counter $194,200 STILL MISSING', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); [rBoy, rDad, rMom].forEach((p) => (p.group.visible = false)); fire.update(t, 0.6);
      shoot(RV.scene, [], V3(0.4, 1.4, 5.2), V3(0.2, 3.2, 8.5), V3(0.2, 0.1, 2.4), V3(0, 2, -60), k, { ...LK.day, fov: 50 });
      [rBoy, rDad, rMom].forEach((p) => (p.group.visible = true));
      blit(); counter('$194,200', (t - ws + 0.1) / 0.3, 'STILL MISSING', 330, 620);
    } });
    cue(Wd('still', 19), 'heartbeat', { gain: 0.7 }); }

  // 20 · "So did D.B. Cooper die that night,"
  { const st = cut(20), wd = Wd('die', 20);
    wrap({ id: 'S20', at: st, note: 'an empty parachute snagged in a tall pine in the rain, swinging slightly', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); nightReset(); treeChute.rotation.z = 0.4 + Math.sin(t * 1.5) * 0.04;
      shoot(NR.scene, [], V3(229, 6, 180), V3(228, 7, 176), V3(222.5, 9.5, 161), null, k, { ...LK.night, fov: 42 }, 18);
      blit(); pill('DIED IN THE JUMP?', (t - wd + 0.1) / 0.3, 250);
    } });
    cue(st + 0.2, 'slide', { dur: 1.0, gain: 0.3 }); }

  // 21 · "or get away with the perfect crime?"
  { const st = cut(21), wp = Wd('perfect', 21);
    wrap({ id: 'S21', at: st, note: 'a figure in a dark suit walks away into the rainy forest, money bag in hand; big question mark', draw(lt, d, t, blit) {
      const k = clamp(lt / d); nightReset(); nCoop.group.visible = true; nCoop.at(-40, 0, 40 - lt * 1.4); nCoop.set({ mood: 'smug', legs: 'walk', phase: t * 6, armR: [20, 10], holdR: P2.bag, armL: [20, 10], v: 'w' });
      shoot(NR.scene, [nCoop], V3(-40.4, 1.5, 43.4), V3(-40.4, 1.6, 43), V3(-40, 1.1, 38), null, eio(k), { ...LK.night, fov: 46 }, 6);
      blit(); pill('OR GOT AWAY?', (t - st - 0.2) / 0.3, 250); bigQ((t - wp) / 0.35, 520); fade((t - Le(21) - 0.7) / 0.6);
    } });
    cue(Wd('perfect', 21), 'heartbeat', { gain: 0.8 }); }

  return { shots: S, cues: CUES };
}
