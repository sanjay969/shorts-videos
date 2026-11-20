// THE BILLION DOLLAR GAME THAT TOOK 8 YEARS: the shot list (Tall Tale 3D).
// A shot: { id, at, note, draw(lt, d, t, blit) }. cut(i) = just before line i, Wd('word', i) = when that word is said.
// All people, places and props are original drawings: no real game characters, logos or cover art.
import * as THREE from 'three';
import { ctx, clamp, lerp, seg, eo, eio, eob } from './core/lib.js';
import { L, Le, Wd, T } from './core/timing.js';
import { camera } from './core/engine.js';
import * as WD from './core/world.js';
import * as PR from './core/props.js';
import { Toon, PROPS } from './core/toon.js';

const V3 = (x, y, z) => new THREE.Vector3(x, y, z);
const mix = (a, b, k) => a.clone().lerp(b, k);
const talk = (t, on = 1) => (on ? 0.25 + 0.75 * Math.abs(Math.sin(t * 13)) * (0.6 + 0.4 * Math.sin(t * 5.3)) : 0);
const blink = (t, off = 0) => (((t + off) % 3.3) < 0.12 ? 1 : 0);
const INK = '#1F1C33';

// ── the cast (original characters, Tall Tale recipe) ──
const LOOK = {
  kid: { body: '#F2C230', hat: 'beanie', hatCol: '#D8343F', pattern: 'overalls', patCol: '#3C6FB6', kid: true, extra: ['freckles'] },
  clerk: { body: '#4FB3A9', hat: 'visor', hatCol: '#2F8F5B', neck: 'collar', pattern: 'vest', patCol: '#2B5E73' },
  dev: { body: '#8C6FC9', hat: 'cap', hatCol: '#2E4E8A', neck: 'none', extra: ['glasses'] },
  dev2: { body: '#E8734A', hat: 'beanie', hatCol: '#3B3346', neck: 'scarf', neckCol: '#F2C230' },
  boss: { body: '#4A4560', hat: 'tophat', hatCol: '#2A2638', neck: 'bowtie', neckCol: '#D8343F', dots: 1, pattern: 'vest', patCol: '#2A2638', extra: ['monocle', 'mustache'] },
  analyst: { body: '#5C8FD6', hat: 'bowler', hatCol: '#3B3346', neck: 'tie', neckCol: '#D8343F', extra: ['glasses', 'mustache'] },
};
const person = (k, opts) => new Toon({ ...LOOK[k], extra: [...(LOOK[k].extra || [])] }, opts);

// ── 2D hand props ──
const P2 = {
  gamebox: (g, x, y) => { g.save(); g.translate(x + 6, y - 92); g.rotate(-0.08); g.strokeStyle = INK; g.lineWidth = 6;
    const gr = g.createLinearGradient(0, -90, 0, 90); gr.addColorStop(0, '#2B2F7A'); gr.addColorStop(1, '#0E1030'); g.fillStyle = gr; g.beginPath(); g.roundRect(-68, -92, 136, 184, 8); g.fill(); g.stroke();
    g.fillStyle = '#2E9BD8'; g.fillRect(-68, -92, 136, 22); g.strokeRect(-68, -92, 136, 22);
    g.fillStyle = '#FFC24A'; g.beginPath(); g.arc(22, 30, 30, 0, 7); g.fill();
    g.fillStyle = '#0E1030'; g.fillRect(-40, 40, 8, 46); g.beginPath(); g.ellipse(-36, 40, 26, 9, -0.3, 0, 7); g.fill();
    g.fillStyle = '#FFFFFF'; g.font = '900 40px Inter'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('GTA 6', 0, -32); g.restore(); },
  controller: (g, x, y) => { g.save(); g.translate(x, y - 34); g.strokeStyle = INK; g.lineWidth = 6; g.fillStyle = '#3B3F4A';
    g.beginPath(); g.moveTo(-70, -26); g.quadraticCurveTo(0, -40, 70, -26); g.quadraticCurveTo(100, 30, 78, 48); g.quadraticCurveTo(54, 56, 36, 20); g.lineTo(-36, 20); g.quadraticCurveTo(-54, 56, -78, 48); g.quadraticCurveTo(-100, 30, -70, -26); g.fill(); g.stroke();
    g.fillStyle = '#9AA0AE'; g.fillRect(-56, -10, 26, 8); g.fillRect(-47, -19, 8, 26);
    [['#D8343F', 50, -14], ['#4FB36A', 40, -2], ['#3C6FB6', 60, -2], ['#F2C230', 50, 10]].forEach(([c, bx, by]) => { g.fillStyle = c; g.beginPath(); g.arc(bx, by, 6, 0, 7); g.fill(); }); g.restore(); },
  cam: (g, x, y) => { g.save(); g.translate(x, y - 40); g.strokeStyle = INK; g.lineWidth = 6; g.fillStyle = '#2E3440'; g.beginPath(); g.roundRect(-58, -36, 116, 72, 10); g.fill(); g.stroke();
    g.fillStyle = '#5A6070'; g.fillRect(-30, -48, 34, 14); g.strokeRect(-30, -48, 34, 14); g.fillStyle = '#9CC7E4'; g.beginPath(); g.arc(4, 2, 24, 0, 7); g.fill(); g.stroke(); g.fillStyle = '#FFFFFF'; g.beginPath(); g.arc(-4, -6, 7, 0, 7); g.fill(); g.restore(); },
  notepad: (g, x, y) => { g.save(); g.translate(x, y - 60); g.rotate(0.1); g.strokeStyle = INK; g.lineWidth = 5; g.fillStyle = '#F7E27A'; g.beginPath(); g.rect(-50, -66, 100, 132); g.fill(); g.stroke();
    g.fillStyle = '#B5372E'; g.fillRect(-50, -66, 100, 16); g.strokeStyle = '#7A7A8A'; g.lineWidth = 3; for (let i = 0; i < 6; i++) { g.beginPath(); g.moveTo(-38, -34 + i * 16); g.lineTo(i === 3 ? 0 : 36, -34 + i * 16); g.stroke(); } g.restore(); },
  wrench: (g, x, y) => { g.save(); g.translate(x, y - 10); g.rotate(-0.6); g.strokeStyle = INK; g.lineWidth = 5; g.fillStyle = '#B8BCC6'; g.beginPath(); g.roundRect(-10, -120, 20, 130, 6); g.fill(); g.stroke();
    g.beginPath(); g.arc(0, -128, 26, 0.6, Math.PI * 2 - 0.6 + Math.PI); g.fill(); g.stroke(); g.fillStyle = '#FFFFFF'; g.fillRect(-6, -150, 12, 26); g.restore(); },
  folder: (g, x, y) => { g.save(); g.translate(x, y - 60); g.rotate(-0.12); g.strokeStyle = INK; g.lineWidth = 6; g.fillStyle = '#E3C16F'; g.beginPath(); g.roundRect(-80, -64, 160, 120, 6); g.fill(); g.stroke();
    g.fillStyle = '#D9B35A'; g.fillRect(-80, -78, 60, 16); g.strokeRect(-80, -78, 60, 16); g.strokeStyle = '#C8283A'; g.lineWidth = 5; g.strokeRect(-62, -26, 124, 44);
    g.fillStyle = '#C8283A'; g.font = '900 24px Inter'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('TOP SECRET', 0, -4); g.restore(); },
};

// ── 2D overlays (kept above the caption zone, y < 1150) ──
function ribbon(text, k, y = 420) {      // gold date ribbon that slides in
  if (k <= 0) return; const a = eob(clamp(k)); ctx.save(); ctx.translate(540, y); ctx.rotate(-0.04); ctx.scale(a, a);
  ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.fillRect(-300, -64, 620, 140);
  ctx.fillStyle = '#B8862F'; [[-1, -330], [1, 330]].forEach(([s, x]) => { ctx.beginPath(); ctx.moveTo(x - s * 40, -50); ctx.lineTo(x + s * 30, -50); ctx.lineTo(x + s * 6, 10); ctx.lineTo(x + s * 30, 70); ctx.lineTo(x - s * 40, 70); ctx.fill(); });
  ctx.fillStyle = '#F2C230'; ctx.strokeStyle = INK; ctx.lineWidth = 8; ctx.beginPath(); ctx.rect(-300, -72, 600, 144); ctx.fill(); ctx.stroke();
  ctx.fillStyle = INK; ctx.font = '900 104px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(text, 0, 6); ctx.restore();
}
function stamp(lines, p, { x = 540, y = 560, rot = -0.14, col = '#C8283A', size = 92, fill = null } = {}) {
  if (p <= 0) return; ctx.save(); ctx.translate(x, y); ctx.rotate(rot); const s = lerp(2.4, 1, eo(clamp(p))); ctx.scale(s, s); ctx.globalAlpha = Math.min(1, p * 1.6);
  ctx.font = `900 ${size}px Inter`; const w = Math.max(...lines.map((l) => ctx.measureText(l).width)) + 80, h = lines.length * size * 1.05 + 50;
  if (fill) { ctx.fillStyle = fill; ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, 22); ctx.fill(); }
  ctx.strokeStyle = col; ctx.lineWidth = 14; ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, 22); ctx.stroke();
  ctx.fillStyle = col; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; lines.forEach((l, i) => ctx.fillText(l, 0, (i - (lines.length - 1) / 2) * size * 1.05 + 4)); ctx.restore();
}
function calCard(top, big, x, y, s = 1, rot = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s); ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.fillRect(-150, -150, 320, 330);
  ctx.fillStyle = '#FFFDF4'; ctx.strokeStyle = INK; ctx.lineWidth = 8; ctx.beginPath(); ctx.roundRect(-160, -160, 320, 320, 18); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#D8343F'; ctx.beginPath(); ctx.roundRect(-160, -160, 320, 90, [18, 18, 0, 0]); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#FFFFFF'; ctx.font = '900 54px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(top, 0, -114);
  ctx.fillStyle = INK; ctx.font = '900 130px Inter'; ctx.fillText(big, 0, 40); ctx.restore();
}
function cashRain(t, t0, n = 26) {
  const k = t - t0; if (k < 0) return;
  for (let i = 0; i < n; i++) { const r = (Math.sin(i * 91.7) * 0.5 + 0.5), r2 = (Math.sin(i * 37.3) * 0.5 + 0.5); const y = -120 + (k * (520 + r2 * 380) - r * 0.6 * 520); if (y < -120 || y > 1250) continue;
    const x = 60 + r * 960 + Math.sin(k * 3 + i) * 40; ctx.save(); ctx.translate(x, y); ctx.rotate(Math.sin(k * 4 + i * 2) * 0.8); ctx.scale(1, 0.6 + 0.4 * Math.abs(Math.cos(k * 5 + i)));
    ctx.fillStyle = '#8FD08A'; ctx.strokeStyle = '#2F5E33'; ctx.lineWidth = 4; ctx.beginPath(); ctx.roundRect(-55, -27, 110, 54, 5); ctx.fill(); ctx.stroke(); ctx.fillStyle = '#2F5E33'; ctx.font = '900 34px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('$', 0, 2); ctx.restore(); }
}
function confetti(t, t0, n = 60) {
  const k = t - t0; if (k < 0) return; const cols = ['#F2C230', '#D8343F', '#3C6FB6', '#4FB36A', '#FF7AB6', '#FFFFFF'];
  for (let i = 0; i < n; i++) { const r = Math.sin(i * 51.3) * 0.5 + 0.5, r2 = Math.sin(i * 17.9) * 0.5 + 0.5; const x = 540 + (r - 0.5) * 1400 * Math.min(1, k * 1.5), y = 260 + k * 300 * (0.6 + r2) - (1 - Math.min(1, k * 2)) * 300 * r2; if (y > 1220) continue;
    ctx.save(); ctx.translate(x, y); ctx.rotate(k * 6 + i); ctx.fillStyle = cols[i % cols.length]; ctx.fillRect(-12, -6, 24, 12); ctx.restore(); }
}
const flash = (a) => { if (a <= 0) return; ctx.save(); ctx.globalAlpha = Math.min(1, a) * 0.85; ctx.fillStyle = '#FFFFFF'; ctx.fillRect(0, 0, 1080, 1920); ctx.restore(); };

export function buildShots(E) {
  const S = [], CUES = [], add = (o) => (S.push(o), o), cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut = (i) => (i === 0 ? 0 : L(i) - 0.06);
  const cam = camera(36);
  const LOOKS = { night: { bloom: 0.45, bloomThreshold: 1.08, aperture: 0.0012, maxblur: 0.008 }, street: { bloom: 0.15, bloomThreshold: 1.08, aperture: 0.0012, maxblur: 0.008 }, room: { bloom: 0.3, bloomThreshold: 1.08, aperture: 0.001, maxblur: 0.008 } };
  const shoot = (scene, people, from, to, at, at2, k, look, focus) => {
    if (cam.fov !== (look.fov || 36)) { cam.fov = look.fov || 36; cam.updateProjectionMatrix(); }
    cam.position.copy(mix(from, to, k)); cam.lookAt(at2 ? mix(at, at2, k) : at);
    people.forEach((p) => p.face(cam));
    E.render(scene, cam, { ...look, focus: focus ?? cam.position.distanceTo(at2 ? mix(at, at2, k) : at) });
  };
  const palms = (scene, zs, xs = [-4.0, 4.0], h = 5.5, skip = null) => zs.forEach((z, i) => xs.forEach((x, j) => { if (skip && skip(x, z)) return; const p = PR.palm(h + ((i + j) % 3) * 0.6, 0.12); p.position.set(x, 0, z); p.rotation.y = i * 1.3 + j; scene.add(p); }));

  // ── NIGHT street: launch night at the game store ──
  const NIGHT_SHOPS = [['DINER', '#E58A6A', 'wood', '#D8343F'], ['SURF SHOP', '#5FA39A', 'wood', '#F2C230'], ['MOTEL', '#F2B8C6', 'brick', null], ['PIZZA', '#C9603F', 'brick', '#3C6FB6'],
    ['ARCADE', '#8C6FC9', 'brick', '#F2C230'], ['GAME STORE', '#2E9BD8', 'brick', '#D8343F'], ['ICE CREAM', '#F2D37A', 'wood', '#FF7AB6'], ['RECORDS', '#9E4A3A', 'brick', null],
    ['CINEMA', '#A3485A', 'brick', '#F2C230'], ['TACOS', '#D9A34A', 'wood', '#2E4E3F'], ['HOTEL', '#C7B79A', 'brick', null], ['JUICE BAR', '#7FA36A', 'wood', '#F2C230']];
  const NS = WD.mainStreet(E, { dusk: true, shops: NIGHT_SHOPS, people: false });
  const GS = NS.buildings.find((b) => b.name === 'GAME STORE');
  NS.sun.key.target.position.set(-4, 0, GS.z); NS.sun.key.position.set(4, 7, GS.z - 10);
  palms(NS.scene, [8, -6, -18, -30, -42], [-4.0, 4.0], 5.5, (x, z) => x < 0 && Math.abs(z - GS.z) < 12);
  { const sb = WD.signBoard('LAUNCH NIGHT', { w: 3.0, h: 0.5, bg: '#D8343F', fg: '#FFFFFF' }); sb.position.set(-5.95, 3.4, GS.z); sb.rotation.y = Math.PI / 2; NS.scene.add(sb);
    for (let i = 0; i < 6; i++) { const b = new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 6), new THREE.MeshStandardMaterial({ color: '#FFE7A0', emissive: ['#FF7AB6', '#5AD1E8', '#FFE7A0'][i % 3], emissiveIntensity: 3 })); b.position.set(-5.9, 3.85, GS.z - 1.5 + i * 0.6); NS.scene.add(b); }
    const glow = new THREE.PointLight('#FF8FD0', 8, 9, 1.4); glow.position.set(-4.2, 3.2, GS.z); NS.scene.add(glow); const glow2 = new THREE.PointLight('#7FE0FF', 6, 9, 1.4); glow2.position.set(-3.5, 2.4, GS.z + 3); NS.scene.add(glow2); }
  // the queue: cheap extras on the boardwalk, behind the kid
  const queue = WD.extras(NS.scene, [[-5.0, GS.z + 2.0, 0], [-4.8, GS.z + 2.9, 1], [-5.1, GS.z + 3.8, 2], [-4.9, GS.z + 4.7, 3], [-5.0, GS.z + 5.6, 4], [-4.8, GS.z + 6.5, 5], [-5.1, GS.z + 7.4, 6]]);
  queue.forEach((p) => { p.tint('#E8D0E8'); p.group.position.y = 0.18; });
  const nKid = person('kid', { height: 1.4 }), nClerk = person('clerk');
  [nKid, nClerk].forEach((p) => NS.scene.add(p.group));
  const posters = []; [0, 1, 2].forEach((i) => { const p = PR.poster(i === 1 ? ['COMING', '!SOON', 'NOV 19'] : ['NEW', '!GAME', 'PRE-ORDER'], { w: 1.4, h: 1.9, bg: ['#FFE08A', '#FFFDF4', '#B9F0FF'][i] }); p.position.set(5.92, 2.3, GS.z - 3 - i * 2.2); p.rotation.y = -Math.PI / 2; NS.scene.add(p); posters.push(p); });
  const nightPeople = () => [...queue, nKid, nClerk];
  const qBob = (t) => queue.forEach((p, i) => p.set({ mood: i % 3 ? 'happy' : 'neutral', armL: [8, 6], armR: [8, 6], bob: Math.abs(Math.sin(t * 3 + i)) * 3, blink: blink(t, i) }));
  const qCheer = (t) => queue.forEach((p, i) => p.set({ mood: i % 2 ? 'laugh' : 'happy', armL: [150, 10], armR: [150, 10], legs: Math.sin(t * 9 + i * 1.7) > 0.2 ? 'jump' : 'stand' }));

  // ── DAY street: Miami, 2015 ──
  const DAY_SHOPS = [['BEACH HOTEL', '#F2B8C6', 'brick', null], ['CAFE CUBANO', '#F2D37A', 'wood', '#2E4E3F'], ['SURF', '#5FA39A', 'wood', '#F2C230'], ['NIGHT CLUB', '#8C6FC9', 'brick', '#FF7AB6'],
    ['DINER', '#E58A6A', 'wood', '#D8343F'], ['ART DECO', '#B9F0FF', 'brick', null], ['SHOES', '#D9A34A', 'wood', null], ['ICE CREAM', '#F2D37A', 'wood', '#FF7AB6']];
  const DS = WD.mainStreet(E, { shops: DAY_SHOPS, cars: false });
  DS.sun.key.target.position.set(0, 0, -10); DS.sun.key.position.set(9, 13, -4);
  palms(DS.scene, [6, -4, -14, -24, -34, -44], [-4.0, 4.0], 5.5, (x, z) => x < 0 && z > -16 && z < -2);
  const cop = PR.policeCar(); DS.scene.add(cop);
  const jet = PR.plane(); DS.scene.add(jet);
  const dDev = person('dev'), dDev2 = person('dev2'); [dDev, dDev2].forEach((p) => DS.scene.add(p.group));
  const dayPeople = () => [...DS.people, dDev, dDev2];
  const view = (scene, from, look) => { const c = new THREE.PerspectiveCamera(42, 4 / 3, 0.1, 800); c.position.copy(from); c.lookAt(look); const t = WD.snapshot(E, scene, c); t.wrapS = THREE.RepeatWrapping; return t; };

  // ── STUDIO: rows of desks, the giant crate ──
  const SU = WD.interior(E, { w: 12, depth: 11, h: 4.6, wall: '#2B3A67', motif: '#34477A', floor: '#6B5A4A', ceiling: '#1F2440', signText: null, picture: false, counterOn: false, litter: false,
    view: view(DS.scene, V3(0, 3, 8), V3(0, 4, -40)) });
  { const sb = WD.signBoard('GAME STUDIO', { w: 3.2, h: 0.55, bg: '#1F1C33', fg: '#5AD1E8' }); sb.position.set(0, 3.95, -10.86); SU.scene.add(sb); }
  const deskSpots = []; [-3.2, -5.8, -8.4].forEach((z, r) => [-4.2, -1.6, 1.0].forEach((x, c) => { const d = PR.workDesk(r * 3 + c); d.position.set(x, 0, z); SU.scene.add(d); deskSpots.push([x, z]); }));
  const coworkers = WD.extras(SU.scene, deskSpots.slice(1).map(([x, z], i) => [x + 0.3, z + 0.75, i]));
  const uDev = person('dev'), uDev2 = person('dev2'); [uDev, uDev2].forEach((p) => SU.scene.add(p.group));
  const crate = PR.bigCrate('RED DEAD 2', '#8A2E2E'); crate.position.set(3.9, 0, -5.6); SU.scene.add(crate);
  const suPeople = () => [...coworkers, uDev, uDev2];

  // ── LAB: the city model, the engine, the globe ──
  const LB = WD.interior(E, { w: 9, depth: 7, h: 4.2, wall: '#4A3A6B', motif: '#57467A', floor: '#7A5A44', ceiling: '#2A2240', signText: null, picture: false, counterOn: false, litter: false,
    view: view(NS.scene, V3(0, 4, 12), V3(0, 4, -40)) });
  const table = PR.desk(3.6); table.position.set(-0.6, 0, -2.8); LB.scene.add(table);
  const city = PR.cityModel(); city.position.set(-0.6, 0.88, -2.8); LB.scene.add(city);
  const gears = [[0, 0, 1.0, 14, '#C9A13B'], [1.62, 0.55, 0.62, 10, '#B8BCC6'], [-1.2, 1.1, 0.5, 8, '#D8584A']].map(([x, y, r, n, c]) => { const g = PR.gear(r, n, c); g.position.set(2.6 + x * 0.8, 1.6 + y * 0.8, -5.2); g.scale.setScalar(0.8); LB.scene.add(g); g.userData = { r, base: g.position.clone() }; return g; });
  const ball = new THREE.Mesh(new THREE.SphereGeometry(0.22, 20, 14), WD.mat({ color: '#D8343F', roughness: 0.4 })); ball.castShadow = true; LB.scene.add(ball); ball.visible = false;
  const world = PR.globe(0.75); world.position.set(-3.0, 0, -4.6); LB.scene.add(world);
  const lDev = person('dev'), lDev2 = person('dev2'); [lDev, lDev2].forEach((p) => LB.scene.add(p.group));
  const labPeople = [lDev, lDev2];
  const labLights = []; LB.scene.traverse((o) => { if (o.isPointLight) labLights.push([o, o.intensity]); });

  // ── OFFICE: the boss, the analyst, the money ──
  const OF = WD.interior(E, { w: 8, depth: 6, h: 4.2, wall: '#2E4E8A', motif: '#3A5E9C', ceiling: '#2A2638', floor: '#7A3E24', signText: null, counterOn: false, picture: true, litter: false,
    view: view(NS.scene, V3(0, 7, 8), V3(0, 4, -40)) });
  const oDesk = PR.desk(2.4); oDesk.position.set(-0.6, 0, -3.2); OF.scene.add(oDesk);
  const oBoss = person('boss'), oAn = person('analyst'); oBoss.at(-0.6, 0, -3.95); [oBoss, oAn].forEach((p) => OF.scene.add(p.group));
  const stacks = [[1.9, -2.6], [2.9, -3.6], [1.1, -4.4], [-3.0, -4.3]].map(([x, z]) => { const s = PR.moneyStack(26); s.position.set(x, 0, z); s.set(0); OF.scene.add(s); return s; });
  const tiny = PR.moneyStack(3); tiny.position.set(-2.2, 0, -2.2); tiny.set(0); OF.scene.add(tiny);
  const ofPeople = [oBoss, oAn];

  // ═════════════ SHOTS ═════════════
  // 1 · "Today, after a thirteen-year wait," crane down the neon street to the queue
  { const st = cut(0);
    add({ id: 'S01', at: st, note: 'launch night: crane down the neon street to a long queue outside the GAME STORE', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); const z = GS.z; qBob(t);
      nKid.at(-4.9, 0.18, z + 1.1); nKid.set({ mood: 'tired', armL: [10, 6], armR: [10, 6], blink: blink(t), bob: Math.sin(t * 2) * 2 });
      nClerk.group.visible = false;
      shoot(NS.scene, nightPeople(), V3(1.5, 7.5, z + 18), V3(-1.6, 1.9, z + 6.5), V3(-3.5, 3.5, z), V3(-4.8, 1.3, z + 2), k, { ...LOOKS.night, fov: 44 });
      blit();
    } });
    cue(st + 0.05, 'whoosh', { gain: 0.6 }); cue(Wd('thirteen', 0), 'tock', { gain: 0.8 }); cue(Wd('wait', 0), 'tock', { gain: 0.8 }); }

  // 2 · "GTA 6 finally came out," the clerk hands the kid the box
  { const st = cut(1), wc = Wd('came', 1);
    add({ id: 'S02', at: st, note: 'store door opens: the clerk hands the kid the box, the kid jumps', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); const z = GS.z; qBob(t); nClerk.group.visible = true;
      nClerk.at(-5.4, 0.18, z - 0.2); nKid.at(-4.7, 0.18, z + 0.6);
      const got = t > wc;
      nClerk.set({ mood: 'happy', armR: got ? [20, 10] : [lerp(30, 80, eo(clamp(lt / 0.5))), -40], holdR: got ? null : P2.gamebox, v: 'c' + got, blink: blink(t) });
      nKid.set({ mood: got ? 'laugh' : 'shock', armL: got ? [150, -10] : [60, -40], armR: got ? [150, 10] : [60, -40], holdL: got ? P2.gamebox : null, legs: got && Math.sin((t - wc) * 10) > -0.2 ? 'jump' : 'stand', v: 'k' + got });
      shoot(NS.scene, nightPeople(), V3(-2.4, 1.6, z + 3.3), V3(-2.7, 1.5, z + 2.6), V3(-5.0, 1.3, z + 0.2), null, k, LOOKS.night);
      blit();
    } });
    cue(st, 'whoosh'); cue(wc, 'ding', { gain: 0.8 }); cue(wc + 0.1, 'sparkle', { gain: 0.6 }); }

  // 3 · "and it might be the most expensive game ever made." punch in, cash rains
  { const st = cut(2), we = Wd('expensive', 2);
    add({ id: 'S03', at: st, note: 'close on the kid with the box; on "expensive" cash rains down and he gasps', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); const z = GS.z; qBob(t); nClerk.group.visible = false;
      nKid.at(-4.7, 0.18, z + 0.6); nKid.set({ mood: t > we ? 'shock' : 'happy', armL: [70, -60], holdL: P2.gamebox, armR: [20, 10], look: [0, t > we ? -0.6 : 0], v: 'k3', blink: blink(t) });
      const punch = eo(clamp((t - we) / 0.25));
      shoot(NS.scene, nightPeople(), V3(-2.6, 1.4, z + 2.9), mix(V3(-3.0, 1.35, z + 2.3), V3(-3.7, 1.25, z + 1.7), punch), V3(-4.7, 1.0, z + 0.6), null, k, LOOKS.night);
      blit(); cashRain(t, we - 0.1);
    } });
    cue(st, 'whoosh'); cue(we, 'ding', { gain: 0.9 }); cue(we + 0.05, 'sparkle', { dur: 1.5, gain: 0.5 }); }

  // 4 · "See, it all started in 2015," rewind to a sunny Miami street, ribbon 2015
  { const st = cut(3), wy = Wd('2015', 3);
    add({ id: 'S04', at: st, note: 'rewind: a sunny palm street, gold ribbon 2015 lands on the year', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); dDev.group.visible = dDev2.group.visible = false; jet.visible = false; cop.visible = false;
      shoot(DS.scene, dayPeople(), V3(0.5, 9, 10), V3(0.0, 3.2, 2), V3(0, 3, -30), V3(0, 2.4, -20), k, { ...LOOKS.street, fov: 46 });
      blit(); ribbon('2015', (t - wy + 0.1) / 0.3);
      if (lt < 0.35) { ctx.save(); ctx.globalAlpha = 1 - lt / 0.35; ctx.fillStyle = '#F4E3C0'; ctx.fillRect(0, 0, 1080, 1920); ctx.restore(); }
    } });
    cue(st - 0.1, 'slide', { dur: 0.5, gain: 0.7 }); cue(wy, 'stamp', { gain: 0.8 }); }

  // 5 · "when a small team flew to Miami" a jet sweeps over the palms
  { const st = cut(4), wm = Wd('miami', 4);
    add({ id: 'S05', at: st, note: 'a jet sweeps low over the palm street toward camera, ribbon MIAMI', draw(lt, d, t, blit) {
      const k = clamp(lt / d); jet.visible = true; jet.position.set(-6 + k * 14, 12 - k * 2, -40 + k * 34); jet.rotation.set(0, Math.atan2(14, 34) - Math.PI / 2, -0.15);
      dDev.group.visible = dDev2.group.visible = false; cop.visible = false;
      shoot(DS.scene, dayPeople(), V3(1.5, 2.2, 6), V3(1.2, 2.0, 5), V3(0, 7, -20), V3(4, 10, -10), eio(k), { ...LOOKS.street, fov: 50, aperture: 0.0004 }, 25);
      blit(); ribbon('MIAMI', (t - wm + 0.1) / 0.3, 380);
    } });
    cue(st, 'whoosh', { gain: 0.5 }); cue(st + 0.2, 'slide', { dur: 1.8, gain: 0.5 }); cue(wm, 'ding', { gain: 0.6 }); }

  // 6 · "just to study its streets, its nightlife, and even its police." devs with camera + notepad, police car on "police"
  { const st = cut(5), ws = Wd('streets', 5), wn = Wd('nightlife', 5), wp = Wd('police', 5);
    add({ id: 'S06', at: st, note: 'two devs walk the boardwalk snapping photos (flash) and taking notes; a police car rolls past on "police"', draw(lt, d, t, blit) {
      const k = clamp(lt / d); jet.visible = false; dDev.group.visible = dDev2.group.visible = true;
      const zz = -10 + k * 3; dDev.at(-4.8, 0.18, zz); dDev2.at(-5.4, 0.18, zz - 0.9);
      const snap = (w) => clamp(1 - Math.abs(t - w) / 0.12);
      dDev.set({ legs: 'walk', phase: t * 6, mood: t > wp ? 'shock' : 'happy', armR: [90, -70], holdR: P2.cam, armL: [20, 10], look: [0.7, -0.2], v: 'cam', blink: blink(t) });
      dDev2.set({ legs: 'walk', phase: t * 6 + 2, mood: 'smug', armL: [60, -80], holdL: P2.notepad, armR: [50, -60], v: 'np', look: [0.6, 0.4] });
      const ck = clamp((t - wp + 0.9) / 1.4); cop.visible = ck > 0 && ck < 1; cop.position.set(-1.9, 0, lerp(zz - 16, zz - 1, ck)); cop.rotation.y = 0; cop.update(t);
      shoot(DS.scene, dayPeople(), V3(0.4, 2.0, zz + 5.6), V3(0.6, 1.9, zz + 5.0), V3(-3.3, 1.2, zz - 1.2), null, eio(k), { ...LOOKS.street, fov: 56 });
      blit(); flash(Math.max(snap(ws), snap(wn)) * 0.7);
    } });
    cue(st, 'whoosh'); cue(ws, 'pop', { gain: 0.9 }); cue(wn, 'pop', { gain: 0.9 }); cue(wp - 0.6, 'whoosh', { gain: 0.5 }); cue(wp, 'alarm', { dur: 1.0, gain: 0.25 }); }

  // 7 · "But Red Dead Redemption 2 got so big" the crate swells across the studio
  const suFront = (t) => { uDev.at(1.3, 0, -2.45); uDev2.at(-1.3, 0, -2.45); };
  { const st = cut(6), wb = Wd('big', 6);
    add({ id: 'S07', at: st, note: 'studio: a crate stamped RED DEAD 2 swells huge on "big"; everyone gasps', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); suFront(t);
      const s = lerp(0.35, 0.8, eo(clamp(lt / 0.6))) + eob(clamp((t - wb + 0.1) / 0.35)) * 0.95; crate.scale.setScalar(s); crate.visible = true;
      const sh = t > wb; coworkers.forEach((p, i) => p.set({ mood: sh ? 'shock' : 'neutral', armL: sh ? [120, 0] : [8, 6], armR: sh ? [120, 0] : [8, 6], look: [0.8, 0] }));
      uDev.set({ mood: sh ? 'shock' : 'neutral', armL: [sh ? 130 : 10, 0], armR: [sh ? 130 : 10, 0], look: [0.8, -0.2] }); uDev2.set({ mood: sh ? 'shock' : 'worried', armL: [20, 10], armR: [20, 10], look: [0.9, -0.2], sweat: 1 });
      shoot(SU.scene, suPeople(), V3(-2.2, 2.6, 3.0), V3(-1.4, 2.2, 1.6), V3(2.6, 1.6, -5.4), null, k, { ...LOOKS.room, fov: 46 });
      blit();
    } });
    cue(st, 'whoosh'); cue(wb, 'boing', { gain: 0.9 }); cue(wb + 0.1, 'thud', { gain: 0.6 }); }

  // 8 · "that almost everyone was pulled onto it," the team marches to the crate, one dev left behind
  { const st = cut(7);
    add({ id: 'S08', at: st, note: 'coworkers slide over toward the crate; one dev is left alone at his desk', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); crate.scale.setScalar(1.75);
      coworkers.forEach((p, i) => { const [x, z] = deskSpots[i + 1]; const a = eio(clamp((lt - i * 0.06) / (d * 0.8))); p.at(lerp(x + 0.3, 2.0 + (i % 3) * 0.5, a), 0, lerp(z + 0.75, -3.0 - Math.floor(i / 3) * 0.9, a)); p.set({ mood: 'happy', legs: a > 0 && a < 1 ? 'walk' : 'stand', phase: t * 7 + i, armL: [8, 6], armR: [8, 6] }); });
      uDev2.at(lerp(-1.3, 1.6, k), 0, -2.45); uDev2.set({ legs: k < 1 ? 'walk' : 'stand', phase: t * 7, mood: 'happy' });
      uDev.at(-4.2, 0, -2.45); uDev.set({ mood: 'worried', armL: [20, 10], armR: [20, 10], look: [0.9, 0], sweat: 1, blink: blink(t) });
      shoot(SU.scene, suPeople(), V3(-4.5, 2.0, 1.2), V3(-4.0, 1.9, 0.4), V3(-1.0, 1.4, -3.5), V3(-3.6, 1.3, -2.6), k, { ...LOOKS.room, fov: 48 });
      blit();
    } });
    cue(st, 'whoosh'); cue(st + 0.2, 'slide', { dur: 1.4, gain: 0.5 }); }

  // 9 · "so the real work only began in 2018." crate gone, the team is back, ribbon 2018
  { const st = cut(8), wy = Wd('2018', 8);
    add({ id: 'S09', at: st, note: 'crate shipped out; everyone back at their desks, dev grins; ribbon 2018', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); crate.visible = false;
      coworkers.forEach((p, i) => { const [x, z] = deskSpots[i + 1]; p.at(x + 0.3, 0, z + 0.75); p.set({ mood: 'happy', armL: [8, 6], armR: [8, 6], blink: blink(t, i) }); });
      uDev.at(-4.2 + 0.3, 0, -3.2 + 0.75); uDev2.at(1.3, 0, -2.45);
      uDev.set({ mood: t > wy ? 'smug' : 'happy', armL: [100, -100], armR: [100, -100], blink: blink(t) }); uDev2.set({ mood: 'proud', armR: [150, 10] });
      shoot(SU.scene, suPeople(), V3(-1.0, 1.9, 1.5), V3(-1.6, 1.85, 0.6), V3(-2.2, 1.35, -3.5), null, k, LOOKS.room);
      blit(); ribbon('2018', (t - wy + 0.1) / 0.3);
    } });
    cue(st, 'whoosh'); cue(wy, 'stamp', { gain: 0.9 }); }

  // 10 · "And they didn't just build a city," the tabletop city grows
  { const st = cut(9), wc = Wd('city', 9);
    add({ id: 'S10', at: st, note: 'lab: a little palm-tree city rises block by block on the table, camera orbits', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); city.set(clamp((t - st) / (wc - st + 0.3))); gears.forEach((g) => (g.visible = false));
      lDev.at(-2.4, 0, -1.9); lDev2.at(1.0, 0, -1.9);
      lDev.set({ mood: 'happy', armL: [70, -50], armR: [70, -50], look: [0.6, 0.5], blink: blink(t) }); lDev2.set({ mood: 'proud', armL: [60, -60], look: [-0.6, 0.5] });
      const a = lerp(-0.5, 0.35, k); const c = V3(-0.6, 0.9, -2.8);
      const cp = V3(c.x + Math.sin(a) * 4.6, 3.1, c.z + Math.cos(a) * 4.6); shoot(LB.scene, labPeople, cp, cp, V3(-0.6, 1.2, -2.8), null, 0, { ...LOOKS.room, fov: 58 });
      blit();
    } });
    cue(st, 'whoosh'); for (let i = 0; i < 6; i++) cue(cut(9) + 0.25 + i * 0.22, 'pop', { gain: 0.5 }); }

  // 11 · "they reportedly rebuilt their whole game engine," gears rise and lock together
  { const st = cut(10), we = Wd('engine', 10);
    add({ id: 'S11', at: st, note: 'big gears fly up into place and start turning on "engine"; dev with a wrench, smug', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d));
      gears.forEach((g, i) => { g.visible = true; const a = eob(clamp((t - st - 0.2 - i * 0.35) / 0.4)); g.position.copy(g.userData.base).add(V3(0, (1 - a) * -3, 0)); g.scale.setScalar(0.8 * Math.max(0.01, a));
        g.rotation.z = t > we ? (i % 2 ? -1 : 1) * (t - we) * 1.6 / g.userData.r : 0; });
      lDev2.at(1.3, 0, -3.6); lDev2.set({ mood: t > we ? 'smug' : 'neutral', armR: [110, -40], holdR: P2.wrench, armL: [20, 10], v: 'w', look: [0.6, -0.3], blink: blink(t) });
      lDev.group.visible = false;
      shoot(LB.scene, labPeople, V3(0.4, 1.8, 1.0), V3(0.9, 1.9, 0.0), V3(2.6, 2.2, -5.0), null, k, LOOKS.room);
      blit(); lDev.group.visible = true;
    } });
    cue(st, 'whoosh'); [0, 1, 2].forEach((i) => cue(cut(10) + 0.25 + i * 0.35, 'plop', { gain: 0.7 })); cue(we, 'boing'); cue(we + 0.1, 'chug', { dur: 1.6, gain: 0.4 }); }

  // 12 · "physics, lighting, animation, everything." ball bounces, lights flare, dev dances, sparkle
  { const st = cut(11), wp = Wd('physics', 11), wl = Wd('lighting', 11), wa = Wd('animation', 11), wv = Wd('everything', 11);
    add({ id: 'S12', at: st, note: 'physics: a ball bounces · lighting: the room flares · animation: the dev dances · everything: gears spin fast', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); const sp = t > wv ? 4 : 1.6;
      gears.forEach((g, i) => { g.position.copy(g.userData.base); g.scale.setScalar(0.8); g.rotation.z = (i % 2 ? -1 : 1) * (t - st) * sp / g.userData.r; });
      ball.visible = t > wp - 0.05; const bt = Math.max(0, t - wp); ball.position.set(0.6 - bt * 0.4, 0.22 + Math.abs(Math.cos(bt * 5)) * 1.4 * Math.exp(-bt * 0.6), -3.0);
      const lf = t > wl ? 1 + 2.5 * Math.exp(-(t - wl) * 3) : 1; labLights.forEach(([o, i0]) => (o.intensity = i0 * lf));
      const dance = t > wa;
      lDev.at(-1.0, 0, -3.3); lDev.set({ mood: dance ? 'laugh' : 'happy', armL: dance ? [120 + Math.sin(t * 12) * 30, 20] : [20, 10], armR: dance ? [120 - Math.sin(t * 12) * 30, 20] : [20, 10], legs: dance && Math.sin(t * 12) > 0 ? 'jump' : 'stand', lean: dance ? Math.sin(t * 12) * 8 : 0 });
      lDev2.at(1.3, 0, -3.6); lDev2.set({ mood: t > wv ? 'laugh' : 'smug', armR: [110, -40], holdR: P2.wrench, v: 'w' });
      shoot(LB.scene, labPeople, V3(-0.8, 1.7, 1.8), V3(-0.2, 1.8, 0.8), V3(0.8, 1.5, -3.8), null, k, { ...LOOKS.room, fov: 46 });
      blit(); labLights.forEach(([o, i0]) => (o.intensity = i0));
    } });
    cue(wp, 'boing', { gain: 0.6 }); cue(wp + 0.31, 'boing', { gain: 0.4 }); cue(wl, 'ding', { gain: 0.6 }); cue(wa, 'pop'); cue(wa + 0.2, 'pop'); cue(wv, 'sparkle', { gain: 0.7 }); }

  // 13 · "Thousands of developers," crane up over the rows of desks
  { const st = cut(12);
    add({ id: 'S13', at: st, note: 'crane up over row after row of desks and glowing screens', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); crate.visible = false;
      coworkers.forEach((p, i) => { const [x, z] = deskSpots[i + 1]; p.at(x + 0.3, 0, z + 0.75); p.set({ mood: ['happy', 'smug', 'neutral'][i % 3], armL: [70, -60], armR: [70, -60], bob: Math.abs(Math.sin(t * 8 + i)) * 3 }); });
      uDev.at(-3.9, 0, -2.45); uDev.set({ mood: 'happy', armL: [70, -60], armR: [70, -60] }); uDev2.at(1.3, 0, -2.45); uDev2.set({ mood: 'happy', armL: [70, -60], armR: [70, -60] });
      shoot(SU.scene, suPeople(), V3(-1.5, 1.6, 1.6), V3(-1.5, 4.2, 1.2), V3(-1.5, 1.4, -3), V3(-1.5, 0.6, -6.5), k, { ...LOOKS.room, fov: 52 });
      blit();
    } });
    cue(st, 'whoosh'); cue(st + 0.1, 'slide', { dur: 1.2, gain: 0.4 }); }

  // 14 · "in studios around the world," the globe spins, pins pop
  { const st = cut(13);
    add({ id: 'S14', at: st, note: 'the globe spins; red pins pop up one after another', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); world.ball.rotation.y = 1.4 + (t - st) * 1.2;
      world.pins.forEach((p, i) => { const a = eob(clamp((lt - 0.15 - i * 0.12) / 0.2)); p.scale.setScalar(Math.max(0.001, a)); });
      lDev.at(-1.8, 0, -3.9); lDev.set({ mood: 'happy', armL: [20, 10], armR: [100, -20], look: [-0.7, 0], blink: blink(t) }); lDev2.group.visible = false;
      shoot(LB.scene, labPeople, V3(-2.0, 2.4, -1.6), V3(-2.4, 2.25, -2.3), V3(-3.0, 1.4, -4.6), null, k, { ...LOOKS.room, fov: 40 }, 2.2);
      blit(); lDev2.group.visible = true;
    } });
    cue(st, 'whoosh'); for (let i = 0; i < 9; i++) cue(cut(13) + 0.15 + i * 0.12, 'pop', { gain: 0.45 }); }

  // 15 · "spent about eight years on it." tired dev, calendar flips 2018 → 2026
  { const st = cut(14), we = Wd('eight', 14);
    add({ id: 'S15', at: st, note: 'close on the tired dev at his desk; a calendar flips 2018 → 2026 above him', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d));
      coworkers.forEach((p, i) => { const [x, z] = deskSpots[i + 1]; p.at(x + 0.3, 0, z + 0.75); p.set({ mood: 'tired', armL: [8, 6], armR: [8, 6] }); });
      uDev.at(-3.9, 0, -2.45); uDev.set({ mood: 'tired', armL: [10, 6], armR: [10, 6], lean: Math.sin(t * 2) * 4, blink: blink(t) });
      shoot(SU.scene, suPeople(), V3(-3.0, 1.55, 0.9), V3(-3.3, 1.5, 0.3), V3(-3.9, 1.15, -2.45), null, k, LOOKS.room, 2.8);
      blit();
      const yr = 2018 + Math.min(8, Math.floor(clamp((t - st) / (we - st + 0.6)) * 8.999)); const flip = ((t - st) * 6) % 1;
      calCard('YEAR', String(yr), 540, 330, 0.95 - (yr < 2026 ? flip * 0.05 : 0), -0.05);
      if (t > we + 0.3) stamp(['8 YEARS'], (t - we - 0.3) / 0.2, { y: 1090, rot: -0.1, size: 80, fill: 'rgba(255,253,244,0.95)' });
    } });
    for (let i = 0; i < 8; i++) cue(cut(14) + (i + 1) * (Wd('eight', 14) - cut(14) + 0.6) / 8.999, 'tock', { gain: 0.6 }); cue(Wd('eight', 14) + 0.3, 'stamp', { gain: 0.8 }); }

  // 16 · "So how much did it cost?" the boss's office, he sweats
  { const st = cut(15);
    add({ id: 'S16', at: st, note: 'the boss behind his desk; camera pushes in, he sweats', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); stacks.forEach((s) => s.set(0)); tiny.set(0); oAn.group.visible = false;
      oBoss.set({ mood: 'worried', sweat: 1, armL: [20, 10], armR: [20, 10], look: [0, 0.2], blink: blink(t) });
      shoot(OF.scene, ofPeople, V3(-0.6, 1.8, 1.6), V3(-0.6, 1.65, -0.6), V3(-0.6, 1.5, -4), null, k, LOOKS.room);
      blit(); oAn.group.visible = true;
    } });
    cue(st, 'whoosh'); cue(Wd('cost', 15), 'boing', { gain: 0.5 }); }

  // 17 · "Rockstar has never said," a TOP SECRET folder, sly shake of the head
  { const st = cut(16);
    add({ id: 'S17', at: st, note: 'the boss hugs a TOP SECRET folder and shakes his head, sly', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); oAn.group.visible = false;
      oBoss.set({ mood: 'sly', armL: [60, -80], holdL: P2.folder, armR: [40, -90], look: [Math.sin(t * 9) * 0.7, 0], v: 'f', blink: blink(t) });
      shoot(OF.scene, ofPeople, V3(0.4, 1.7, -0.4), V3(0.1, 1.7, -1.0), V3(-0.6, 1.45, -3.95), null, k, LOOKS.room);
      blit(); oAn.group.visible = true;
    } });
    cue(st, 'whoosh'); cue(st + 0.3, 'zip', { gain: 0.6 }); }

  // 18 · "but analysts guess one to one and a half billion dollars," the analyst + money rising
  { const st = cut(17), wb = Wd('billion', 17);
    add({ id: 'S18', at: st, note: 'the analyst holds up his sign; money stacks climb from the floor, peaking on "billion"', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); const wa = Wd('analysts', 17); const g = clamp((t - st - 0.3) / (wb - st)); stacks[0].set(g * 10); stacks[1].set(g * 8); stacks[2].set(0); stacks[3].set(0);
      oAn.at(0.6, 0, -1.7); oAn.set({ mood: t > wb ? 'shock' : 'smug', armL: [150, 10], armR: [20, 10], v: 's', talk: 0, blink: blink(t) });
      oBoss.set({ mood: 'worried', sweat: 1, look: [0.8, 0] });
      shoot(OF.scene, ofPeople, V3(-1.9, 2.0, 2.4), V3(-1.4, 2.2, 1.7), V3(0.9, 1.8, -2.4), null, k, { ...LOOKS.room, fov: 44 });
      blit(); stamp(['$1 - 1.5', 'BILLION'], (t - wa) / 0.22, { y: 470, rot: -0.06, col: '#2F7A3A', size: 100, fill: 'rgba(240,255,235,0.93)' });
    } });
    cue(st, 'whoosh'); cue(Wd('analysts', 17), 'stamp', { gain: 0.7 }); for (let i = 0; i < 8; i++) cue(cut(17) + 0.4 + i * (Wd('billion', 17) - cut(17)) / 9, 'plop', { gain: 0.5 }); cue(Wd('billion', 17), 'ding'); }

  // 19 · "that's over eight thousand crore rupees!" big gold stamp ₹8,000+ CRORE
  { const st = cut(18), we = Wd('eight', 18);
    add({ id: 'S19', at: st, note: 'punch-in on the stacks; a big gold stamp: ₹8,000+ CRORE', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); stacks[0].set(10); stacks[1].set(8);
      oAn.at(0.6, 0, -1.7); oAn.set({ mood: 'shock', armL: [140, 10], armR: [140, 10], legs: 'jump', bob: 0 });
      shoot(OF.scene, ofPeople, V3(-0.4, 1.6, 0.6), V3(0.0, 1.7, -0.2), V3(1.6, 1.4, -2.8), null, k, LOOKS.room);
      blit(); stamp(['₹8,000+', 'CRORE'], (t - we) / 0.22, { y: 560, rot: -0.1, col: '#B8862F', size: 120, fill: 'rgba(255,248,220,0.92)' });
    } });
    cue(st, 'whoosh'); cue(we, 'stamp', { gain: 1 }); cue(we + 0.05, 'slam', { gain: 0.5 }); }

  // 20 · "Some even say three billion" stacks shoot to the ceiling
  { const st = cut(19), wt = Wd('three', 19);
    add({ id: 'S20', at: st, note: 'every stack shoots up to the ceiling on "three"; camera tilts up', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); const g = eo(clamp((t - wt + 0.1) / 0.6));
      stacks[0].set(lerp(10, 26, g)); stacks[1].set(lerp(8, 25, g)); stacks[2].set(lerp(0, 24, g)); stacks[3].set(lerp(0, 26, g));
      oAn.at(0.6, 0, -1.7); oAn.set({ mood: 'dizzy', armL: [40, 10], armR: [40, 10], look: [0, -0.8] }); oBoss.set({ mood: 'shock', sweat: 1, look: [0.6, -0.6] });
      shoot(OF.scene, ofPeople, V3(-0.6, 1.4, 1.8), V3(-0.6, 1.5, 1.4), V3(0.6, 1.4, -3), V3(0.8, 3.4, -3.6), k, { ...LOOKS.room, fov: 52 });
      blit();
    } });
    cue(st, 'whoosh'); cue(wt, 'slide', { dur: 0.6, gain: 0.8 }); cue(wt + 0.6, 'boing'); }

  // 21 · "once you add marketing," posters slap onto the night street
  { const st = cut(20);
    add({ id: 'S21', at: st, note: 'night street: posters slap onto the walls one by one (marketing)', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); qBob(t); nClerk.group.visible = false; nKid.at(-4.7, 0.18, GS.z + 0.6); nKid.set({ mood: 'happy', look: [0.8, 0], armL: [10, 6], armR: [10, 6] });
      posters.forEach((p, i) => { const a = eob(clamp((lt - 0.1 - i * 0.28) / 0.22)); p.scale.setScalar(Math.max(0.001, a)); });
      shoot(NS.scene, nightPeople(), V3(1.0, 2.2, GS.z + 1.0), V3(0.8, 2.3, GS.z - 0.5), V3(5.9, 2.2, GS.z - 3), V3(5.9, 2.2, GS.z - 7), k, LOOKS.night);
      blit();
    } });
    [0, 1, 2].forEach((i) => cue(cut(20) + 0.12 + i * 0.28, 'stamp', { gain: 0.6 })); }

  // 22 · "while GTA 5 cost about a quarter of a billion." a tiny stack next to the giants
  { const st = cut(21), wq = Wd('quarter', 21);
    add({ id: 'S22', at: st, note: 'a tiny "GTA 5" stack next to the giant ones; the analyst laughs', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); stacks.forEach((s, i) => s.set([26, 25, 24, 26][i])); tiny.set(eob(clamp((t - st - 0.2) / 0.3)) * 1.6);
      oAn.at(-0.8, 0, -2.0); oAn.set({ mood: t > wq ? 'laugh' : 'smug', armR: [80, -10], armL: [20, 10], holdL: PROPS.sign('GTA 5', '#F2E6CF'), v: 'g5', look: [-0.6, 0.6] });
      shoot(OF.scene, ofPeople, V3(-0.9, 1.5, 1.6), V3(-1.2, 1.7, 0.9), V3(-1.8, 0.9, -2.6), V3(-1.6, 1.6, -3.0), k, { ...LOOKS.room, fov: 52 });
      blit();
    } });
    cue(st, 'whoosh'); cue(st + 0.25, 'pop'); cue(wq, 'boing', { gain: 0.5 }); }

  // 23 · "And after two delays," two calendar cards get DELAYED stamps; the kid waits, tired
  { const st = cut(22), w2 = Wd('two', 22), wd = Wd('delays', 22);
    add({ id: 'S23', at: st, note: 'the kid waits; FALL 2025 and MAY 2026 cards get DELAYED stamps', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); qBob(t); nClerk.group.visible = false; nKid.at(-4.7, 0.18, GS.z + 0.6); nKid.set({ mood: 'tired', armL: [10, 6], armR: [10, 6], lean: 6, blink: blink(t) });
      shoot(NS.scene, nightPeople(), V3(-2.4, 1.5, GS.z + 3.6), V3(-2.7, 1.4, GS.z + 3.0), V3(-4.7, 1.0, GS.z + 0.6), null, k, LOOKS.night);
      blit();
      calCard('FALL', '2025', 300, 560, 0.85, -0.1); calCard('MAY', '2026', 780, 560, 0.85, 0.08);
      stamp(['DELAYED'], (t - w2) / 0.2, { x: 300, y: 600, rot: -0.3, size: 58 }); stamp(['DELAYED'], (t - wd) / 0.2, { x: 780, y: 600, rot: -0.2, size: 58 });
    } });
    cue(w2, 'stamp', { gain: 0.9 }); cue(wd, 'stamp', { gain: 0.9 }); }

  // 24 · "it finally landed today," the crowd cheers, confetti, NOV 19 card
  { const st = cut(23), wt = Wd('today', 23);
    add({ id: 'S24', at: st, note: 'the queue cheers and jumps, confetti, the kid lifts the box; card NOV 19 2026', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); qCheer(t); nClerk.group.visible = true; nClerk.at(-5.4, 0.18, GS.z - 0.2); nClerk.set({ mood: 'laugh', armL: [150, 10], armR: [150, 10] });
      nKid.at(-4.7, 0.18, GS.z + 0.6); nKid.set({ mood: 'laugh', armL: [160, -10], holdL: P2.gamebox, armR: [150, 10], legs: Math.sin(t * 10) > 0 ? 'jump' : 'stand', v: 'k24' });
      shoot(NS.scene, nightPeople(), V3(-1.2, 2.2, GS.z + 7.5), V3(-1.8, 1.9, GS.z + 5.5), V3(-4.8, 1.5, GS.z + 2.5), null, k, { ...LOOKS.night, fov: 44 });
      blit(); confetti(t, st + 0.1);
      if (t > wt - 0.15) { const p = eob(clamp((t - wt + 0.15) / 0.3)); calCard('NOV 19', '2026', 540, 520, 0.9 * p, -0.05); }
    } });
    cue(st, 'sparkle', { dur: 1.2, gain: 0.6 }); cue(Wd('today', 23), 'ding', { gain: 0.9 }); }

  // 25 · "so the only question is..." the kid turns to camera, sly
  { const st = cut(24);
    add({ id: 'S25', at: st, note: 'close on the kid, box under his arm, giving the camera a sly look', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); qBob(t); nClerk.group.visible = false; nKid.at(-4.7, 0.18, GS.z + 0.6);
      nKid.set({ mood: 'sly', armL: [40, -60], holdL: P2.gamebox, armR: [20, 10], look: [0, 0], v: 'k25', blink: blink(t) });
      shoot(NS.scene, nightPeople(), V3(-3.0, 1.35, GS.z + 2.6), V3(-3.5, 1.3, GS.z + 2.0), V3(-4.7, 1.05, GS.z + 0.6), null, k, LOOKS.night);
      blit();
    } });
    cue(st, 'whoosh', { gain: 0.5 }); }

  // 26 · "are you playing tonight?" controller up, punch-in, laugh
  { const st = cut(25), wt = Wd('tonight', 25);
    add({ id: 'S26', at: st, note: 'the kid whips out a controller and laughs; punch-in on "tonight"', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); qCheer(t); nKid.at(-4.7, 0.18, GS.z + 0.6);
      nKid.set({ mood: t > wt ? 'laugh' : 'smug', armL: [110, -60], armR: [60, -80], holdR: P2.controller, v: 'k26', bob: t > wt ? Math.abs(Math.sin(t * 9)) * 6 : 0 });
      const punch = eo(clamp((t - wt) / 0.25));
      shoot(NS.scene, nightPeople(), V3(-3.4, 1.35, GS.z + 2.2), mix(V3(-3.6, 1.3, GS.z + 2.0), V3(-3.8, 1.25, GS.z + 1.85), punch), V3(-4.7, 1.0, GS.z + 0.6), null, k, LOOKS.night);
      blit();
    } });
    cue(st, 'pop'); cue(wt, 'boing', { gain: 0.9 }); cue(wt + 0.15, 'sparkle', { gain: 0.6 }); }

  return { shots: S, cues: CUES };
}
