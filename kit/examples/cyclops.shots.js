// THE AMERICAN SHIP THAT VANISHED WITHOUT A TRACE (USS Cyclops, 1918): the shot list (Tall Tale 3D, serious tone).
// Original drawings only; real people are not drawn (the President's words appear as a quote card).
import * as THREE from 'three';
import { ctx, clamp, lerp, seg, eo, eio, eob } from './core/lib.js';
import { L, Le, Wd, T } from './core/timing.js';
import { camera } from './core/engine.js';
import * as WD from './core/world.js';
import * as PR from './core/props.js';
import * as SEA from './core/sea.js';
import * as TW from './core/town.js';
import { Toon, PROPS } from './core/toon.js';

const V3 = (x, y, z) => new THREE.Vector3(x, y, z);
const mix = (a, b, k) => a.clone().lerp(b, k);
const talk = (t, on = 1) => (on ? 0.25 + 0.75 * Math.abs(Math.sin(t * 13)) * (0.6 + 0.4 * Math.sin(t * 5.3)) : 0);
const blink = (t, off = 0) => (((t + off) % 3.3) < 0.12 ? 1 : 0);
const G = TW.gesture;
const INK = '#1F1C33';
const SALUTE = { armR: [150, -150], armL: [15, 8] };

const LOOK = {
  sailor: { body: '#F4EFE4', hat: 'boater', hatCol: '#FFFFFF', band: '#1F2A44', neck: 'scarf', neckCol: '#1F2A44' },
  sailor2: { body: '#2E4E8A', hat: 'beanie', hatCol: '#1F2A44', neck: 'scarf', neckCol: '#F4EFE4' },
  officer: { body: '#1F2A44', hat: 'mailcap', hatCol: '#121A30', neck: 'tie', neckCol: '#F2E6CF', extra: ['mustache'] },
  engineer: { body: '#7A6A5A', hat: 'cap', hatCol: '#2A2638', pattern: 'overalls', patCol: '#3C5A7A', extra: ['mustache'] },
  stoker: { body: '#C9603F', hat: 'beanie', hatCol: '#2A2638', pattern: 'overalls', patCol: '#2A2638' },
  radio: { body: '#5C8FD6', hat: 'none', neck: 'tie', neckCol: '#1F2A44', extra: ['glasses'] },
  newsboy: { body: '#E8C77A', hat: 'cap', hatCol: '#6B4A2A', kid: true, neck: 'scarf', neckCol: '#B5372E', extra: ['freckles'] },
  dock1: { body: '#F2C230', hat: 'boater', hatCol: '#E8C77A', band: '#D8343F' },
  dock2: { body: '#E58A6A', hat: 'flower', pattern: 'apron' },
};
const person = (k, opts) => new Toon({ ...LOOK[k], extra: [...(LOOK[k].extra || [])] }, opts);
const P2 = {
  binos: (g, x, y) => { g.save(); g.translate(x, y - 30); g.strokeStyle = INK; g.lineWidth = 6; g.fillStyle = '#2A2E36'; [-26, 26].forEach((dx) => { g.beginPath(); g.roundRect(dx - 20, -40, 40, 70, 10); g.fill(); g.stroke(); }); g.fillStyle = '#9CC7E4'; [-26, 26].forEach((dx) => { g.beginPath(); g.ellipse(dx, -40, 16, 7, 0, 0, 7); g.fill(); }); g.restore(); },
  phones: (g, x, y) => { g.save(); g.translate(x, y - 20); g.strokeStyle = INK; g.lineWidth = 6; g.fillStyle = '#3A3A40'; g.beginPath(); g.ellipse(0, 0, 26, 30, 0, 0, 7); g.fill(); g.stroke(); g.restore(); },
  wrench: (g, x, y) => { g.save(); g.translate(x, y - 10); g.rotate(-0.6); g.strokeStyle = INK; g.lineWidth = 5; g.fillStyle = '#B8BCC6'; g.beginPath(); g.roundRect(-10, -120, 20, 130, 6); g.fill(); g.stroke(); g.beginPath(); g.arc(0, -128, 26, 0.6, Math.PI * 2 - 0.6 + Math.PI); g.fill(); g.stroke(); g.restore(); },
};

// ── overlays (all above the caption zone, y < 1150) ──
function ribbon(text, k, y = 380, size = 88) {
  if (k <= 0) return; const a = eob(clamp(k)); ctx.save(); ctx.translate(540, y); ctx.rotate(-0.03); ctx.scale(a, a); ctx.font = `900 ${size}px Inter`; const w = ctx.measureText(text).width + 90;
  ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.fillRect(-w / 2 + 12, -62, w, 140); ctx.fillStyle = '#F2C230'; ctx.strokeStyle = INK; ctx.lineWidth = 8; ctx.beginPath(); ctx.rect(-w / 2, -70, w, 140); ctx.fill(); ctx.stroke();
  ctx.fillStyle = INK; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(text, 0, 6); ctx.restore();
}
function pill(text, k, y = 250, bg = 'rgba(31,28,51,0.88)', size = 52) {
  if (k <= 0) return; ctx.save(); ctx.globalAlpha = clamp(k * 1.5); ctx.translate(540, y + (1 - eo(clamp(k))) * 30); ctx.font = `900 ${size}px Inter`; const w = ctx.measureText(text).width + 70;
  ctx.fillStyle = bg; ctx.beginPath(); ctx.roundRect(-w / 2, -size * 0.85, w, size * 1.7, size * 0.85); ctx.fill(); ctx.strokeStyle = '#F2C230'; ctx.lineWidth = 5; ctx.stroke();
  ctx.fillStyle = '#FFFFFF'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(text, 0, 4); ctx.restore();
}
function counter(n, k, label, y = 330, w = 520) {
  if (k <= 0) return; ctx.save(); ctx.globalAlpha = clamp(k * 2); ctx.translate(540, y); ctx.fillStyle = 'rgba(16,22,40,0.86)'; ctx.beginPath(); ctx.roundRect(-w / 2, -110, w, 220, 30); ctx.fill(); ctx.strokeStyle = '#F2C230'; ctx.lineWidth = 6; ctx.stroke();
  ctx.fillStyle = '#FFFFFF'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.font = '900 118px Inter'; ctx.fillText(String(n), 0, -14); ctx.font = '800 36px Inter'; ctx.fillStyle = '#F2C230'; ctx.fillText(label, 0, 72); ctx.restore();
}
function checklist(items, ts, t, k, y = 430) {
  if (k <= 0) return; ctx.save(); ctx.globalAlpha = clamp(k * 2); ctx.translate(540, y); ctx.fillStyle = 'rgba(16,22,40,0.88)'; ctx.beginPath(); ctx.roundRect(-380, -60 - items.length * 50, 760, items.length * 100 + 60, 28); ctx.fill(); ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = 5; ctx.stroke();
  items.forEach((it, i) => { const yy = (i - (items.length - 1) / 2) * 100; const on = clamp((t - ts[i]) / 0.18); ctx.globalAlpha = clamp(k * 2) * (0.35 + 0.65 * Math.min(1, on * 3 + (t > ts[i] - 0.4 ? 0.5 : 0)));
    ctx.fillStyle = '#FFFFFF'; ctx.font = '900 58px Inter'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillText(it, -230, yy + 4);
    ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = 6; ctx.strokeRect(-330, yy - 34, 68, 68);
    if (on > 0) { ctx.strokeStyle = '#FF4A4A'; ctx.lineWidth = 14; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-320, yy - 24); ctx.lineTo(lerp(-320, -272, on), lerp(yy - 24, yy + 24, on)); ctx.stroke(); if (on >= 1) { ctx.beginPath(); ctx.moveTo(-272, yy - 24); ctx.lineTo(-320, yy + 24); ctx.stroke(); } } });
  ctx.restore();
}
// a simple map: US east coast, the islands, Barbados → Baltimore route that stops at a "?"
function routeMap(k, d, y = 430, showQ = true) {
  if (k <= 0) return; const a = eo(clamp(k * 2)); ctx.save(); ctx.translate(540, y); ctx.scale(a, a);
  ctx.fillStyle = '#F4E3C0'; ctx.strokeStyle = INK; ctx.lineWidth = 8; ctx.beginPath(); ctx.roundRect(-400, -330, 800, 640, 26); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#9CC7E4'; ctx.fillRect(-376, -306, 752, 592);
  ctx.fillStyle = '#E9D7A5'; ctx.strokeStyle = '#B08A5A'; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.moveTo(-376, -306); ctx.lineTo(-120, -306); ctx.lineTo(-150, -250); ctx.lineTo(-210, -200); ctx.lineTo(-230, -130); ctx.lineTo(-290, -60); ctx.lineTo(-300, 20); ctx.lineTo(-260, 70); ctx.lineTo(-300, 90); ctx.lineTo(-376, 60); ctx.closePath(); ctx.fill(); ctx.stroke();
  [[-180, 120, 60, 14], [-60, 150, 40, 10], [20, 160, 26, 8], [80, 175, 14, 6], [140, 200, 10, 8], [190, 240, 8, 10], [230, 285, 10, 8]].forEach(([x, yy, w, h]) => { ctx.beginPath(); ctx.ellipse(x, yy, w, h, -0.2, 0, 7); ctx.fill(); ctx.stroke(); });
  const B = [-205, -185], S = [262, 262], P = [-60, -10];
  ctx.fillStyle = INK; ctx.beginPath(); ctx.arc(B[0], B[1], 12, 0, 7); ctx.fill(); ctx.beginPath(); ctx.arc(S[0], S[1], 12, 0, 7); ctx.fill();
  ctx.font = '900 34px Inter'; ctx.textAlign = 'left'; ctx.fillText('BALTIMORE', B[0] + 20, B[1] - 16); ctx.textAlign = 'right'; ctx.fillText('BARBADOS', S[0] - 18, S[1] + 40);
  const dd = clamp(d); const end = [lerp(S[0], P[0], dd), lerp(S[1], P[1], dd)];
  ctx.strokeStyle = '#D8343F'; ctx.lineWidth = 10; ctx.setLineDash([24, 16]); ctx.beginPath(); ctx.moveTo(S[0], S[1]); ctx.lineTo(end[0], end[1]); ctx.stroke(); ctx.setLineDash([]);
  ctx.strokeStyle = 'rgba(31,28,51,0.35)'; ctx.setLineDash([10, 14]); ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(P[0], P[1]); ctx.lineTo(B[0], B[1]); ctx.stroke(); ctx.setLineDash([]);
  ctx.fillStyle = '#D8343F'; ctx.beginPath(); ctx.arc(end[0], end[1], 14, 0, 7); ctx.fill();
  if (showQ && dd >= 1) { ctx.font = '900 120px Inter'; ctx.textAlign = 'center'; ctx.lineWidth = 10; ctx.strokeStyle = INK; ctx.strokeText('?', P[0] + 4, P[1] - 50); ctx.fillStyle = '#F2C230'; ctx.fillText('?', P[0] + 4, P[1] - 50); }
  ctx.restore();
}
function quoteCard(k, y = 520) {
  if (k <= 0) return; const a = eo(clamp(k)); ctx.save(); ctx.globalAlpha = clamp(k * 2); ctx.translate(540, y + (1 - a) * 40);
  ctx.fillStyle = 'rgba(244,235,214,0.96)'; ctx.strokeStyle = INK; ctx.lineWidth = 8; ctx.beginPath(); ctx.roundRect(-420, -250, 840, 500, 26); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#B5372E'; ctx.font = '900 150px Georgia, serif'; ctx.textAlign = 'left'; ctx.fillText('“', -390, -120);
  ctx.fillStyle = INK; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.font = '900 66px Inter';
  ['ONLY GOD', 'AND THE SEA KNOW', 'WHAT HAPPENED'].forEach((l, i) => ctx.fillText(l, 0, -110 + i * 86));
  ctx.font = '800 38px Inter'; ctx.fillStyle = '#5A5A6A'; ctx.fillText('— PRESIDENT WOODROW WILSON', 0, 190); ctx.restore();
}
function sonar(t, k, y = 520) {
  if (k <= 0) return; ctx.save(); ctx.globalAlpha = clamp(k * 2); ctx.translate(540, y); const R = 300;
  ctx.fillStyle = 'rgba(4,30,22,0.88)'; ctx.beginPath(); ctx.arc(0, 0, R + 20, 0, 7); ctx.fill(); ctx.strokeStyle = '#3CFF9A'; ctx.lineWidth = 4;
  [1, 0.66, 0.33].forEach((f) => { ctx.beginPath(); ctx.arc(0, 0, R * f, 0, 7); ctx.stroke(); }); ctx.beginPath(); ctx.moveTo(-R, 0); ctx.lineTo(R, 0); ctx.moveTo(0, -R); ctx.lineTo(0, R); ctx.stroke();
  const a = t * 2.2; const gr = ctx.createConicGradient ? ctx.createConicGradient(a - 0.8, 0, 0) : null;
  if (gr) { gr.addColorStop(0, 'rgba(60,255,154,0)'); gr.addColorStop(0.12, 'rgba(60,255,154,0.45)'); gr.addColorStop(0.13, 'rgba(60,255,154,0)'); ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(0, 0, R, 0, 7); ctx.fill(); }
  ctx.strokeStyle = '#9CFFCB'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(a) * R, Math.sin(a) * R); ctx.stroke();
  ctx.fillStyle = '#3CFF9A'; ctx.font = '900 54px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; if (Math.sin(t * 6) > -0.3) ctx.fillText('NO CONTACT', 0, R + 80); ctx.restore();
}

export function buildShots(E) {
  const S = [], CUES = [], add = (o) => (S.push(o), o), cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut = (i) => (i === 0 ? 0 : L(i) - 0.06);
  const cam = camera(36);
  const LK = { sea: { bloom: 0.35, bloomThreshold: 1.08, aperture: 0.0003, maxblur: 0.004 }, night: { bloom: 0.8, bloomThreshold: 1.08, aperture: 0.0003, maxblur: 0.004 }, room: { bloom: 0.3, bloomThreshold: 1.08, aperture: 0.001, maxblur: 0.008 } };
  let T_now = 0; const seas = [];
  const shoot = (scene, people, from, to, at, at2, k, look, focus) => {
    if (cam.fov !== (look.fov || 36)) { cam.fov = look.fov || 36; cam.updateProjectionMatrix(); }
    cam.position.copy(mix(from, to, k)); cam.lookAt(at2 ? mix(at, at2, k) : at);
    people.forEach((p) => p.face(cam)); seas.forEach((s) => { if (s.scene === scene) s.update(T_now, cam); });
    E.render(scene, cam, { ...look, focus: focus ?? cam.position.distanceTo(at2 ? mix(at, at2, k) : at) });
  };
  const wrap = (o) => { const d0 = o.draw; o.draw = (lt, d, t, blit) => { T_now = t; d0(lt, d, t, blit); }; return add(o); };
  const ride = (ship, t, y0, ph = 0) => { ship.position.y = y0 + Math.sin(t * 0.9 + ph) * 0.12; ship.rotation.x = Math.sin(t * 0.7 + ph) * 0.012; ship.rotation.z = Math.sin(t * 0.55 + ph) * 0.008; };

  // ═════ DAY SEA + Barbados harbour (shore at -x, dock at +z) ═════
  const DY = SEA.ocean(E, { day: true }); seas.push(DY);
  const cyc = SEA.collier(); DY.scene.add(cyc);
  const DECK = 2.14;                                             // deck height above the ship's origin
  const shore = new THREE.Group(); DY.scene.add(shore); shore.position.set(-70, 0, 0);
  { const sand = new THREE.Mesh(new THREE.BoxGeometry(40, 1.2, 120), WD.mat({ color: '#E8D29A' })); sand.position.set(-12, 0.3, 0); sand.receiveShadow = true; shore.add(sand);
    const cols = ['#F2B8C6', '#9FD8E8', '#F2D37A', '#BFE0A0', '#F4EFE4', '#E8A07A'];
    for (let i = 0; i < 9; i++) { const h = PR.house({ wall: cols[i % 6], roof: ['#B5553C', '#3E5FA8', '#7A3E24'][i % 3] }); h.scale.setScalar(0.9); h.position.set(-16 - (i % 2) * 8, 0.9, -40 + i * 10); h.rotation.y = Math.PI / 2; shore.add(h); }
    for (let i = 0; i < 12; i++) { const p = PR.palm(6 + (i % 3), 0.15); p.position.set(-4 - (i % 3) * 2.5, 0.9, -48 + i * 8.5); p.rotation.y = i; shore.add(p); } }
  const dock = new THREE.Group(); DY.scene.add(dock); dock.position.set(-40, 0, 9);
  { const pl = new THREE.Mesh(new THREE.BoxGeometry(34, 0.4, 5), WD.mat({ map: WD.T.planks('#9A6A43', [10, 1.5]) })); pl.position.set(0, 1.4, 0); pl.castShadow = pl.receiveShadow = true; dock.add(pl);
    for (let x = -16; x <= 16; x += 3) [-2.2, 2.2].forEach((z) => { const c = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 3, 8), WD.mat({ color: '#6B4A2A' })); c.position.set(x, 0.1, z); dock.add(c); });
    for (let i = 0; i < 4; i++) { const b = WD.barrel(); b.position.set(-10 + i * 1.1, 1.6, 1.4); dock.add(b); const c = WD.crate(0.8); c.position.set(6 + i * 1.2, 1.6, 1.2); dock.add(c); }
    const sb = WD.signBoard('BRIDGETOWN · BARBADOS', { w: 5, h: 0.7, bg: '#2E4E3F', fg: '#F2E6CF' }); sb.position.set(-12, 3.6, 1.8); dock.add(sb); [-14.4, -9.6].forEach((x) => { const p = new THREE.Mesh(new THREE.BoxGeometry(0.15, 2.4, 0.15), WD.mat({ color: '#6B4A2A' })); p.position.set(x, 2.6, 1.8); dock.add(p); }); }
  const dk1 = person('dock1'), dk2 = person('dock2'), dk3 = person('newsboy', { height: 1.35 }); [dk1, dk2, dk3].forEach((p) => DY.scene.add(p.group));
  const sw1 = person('sailor'), sw2 = person('sailor2'), sOff = person('officer'), sw3 = person('sailor'); [sw1, sw2, sOff, sw3].forEach((p) => DY.scene.add(p.group));
  const ore = new THREE.Group(); DY.scene.add(ore);
  { const rm = WD.mat({ color: '#3A3436', roughness: 0.9, flatShading: true }); for (let i = 0; i < 70; i++) { const r = new THREE.Mesh(new THREE.IcosahedronGeometry(0.35 + (i % 4) * 0.08, 0), rm); const a = i * 2.39, rr = Math.sqrt(i / 70) * 2.6; r.position.set(Math.cos(a) * rr * 1.6, 0, Math.sin(a) * rr * 0.6); r.userData.h = (1 - rr / 2.6) * 1.6 + 0.2; r.castShadow = true; ore.add(r); } }
  const setOre = (k) => ore.children.forEach((r, i) => { const a = clamp(k * 1.3 - (i / ore.children.length) * 0.3); r.visible = a > 0; r.position.y = r.userData.h * a; r.scale.setScalar(Math.max(0.01, a)); });
  const hatch = new THREE.Mesh(new THREE.BoxGeometry(6, 0.3, 3.2), WD.mat({ color: '#141418' })); DY.scene.add(hatch);
  const searchers = [SEA.steamer({ lights: false }), SEA.steamer({ lights: false })]; searchers.forEach((s) => { s.scale.setScalar(0.8); DY.scene.add(s); });
  const sDeck = new THREE.Group(); { const dk = SEA.deck({ funnelCol: '#D8846A' }); sDeck.add(dk); const hl = new THREE.Mesh(new THREE.BoxGeometry(14, 3, 9), WD.mat({ color: '#5E6670' })); hl.position.set(0, -1.6, 1.6); sDeck.add(hl); } sDeck.position.set(0, 1.0, 6.4); DY.scene.add(sDeck);
  const shipAt = (x, z, ry, y = 1.2) => { cyc.visible = z > -150; cyc.position.set(x, y, z); cyc.rotation.y = ry; hatch.visible = false; setOre(0); searchers.forEach((q) => (q.visible = false)); sDeck.visible = false; };
  const onDeck = (p, dx, dz) => { const v = V3(dx, DECK, dz).applyEuler(new THREE.Euler(0, cyc.rotation.y, 0)).add(cyc.position); p.group.position.copy(v); };
  const hideDeck = () => [sw1, sw2, sOff, sw3, dk1, dk2, dk3].forEach((p) => (p.group.visible = false));

  // ═════ STORM / FOG SEA ═════
  const ST = SEA.ocean(E, { storm: true }); seas.push(ST);
  const cyc2 = SEA.collier(); ST.scene.add(cyc2);
  const fogTo = (sc, near, far) => { sc.fog.near = near; sc.fog.far = far; };

  // ═════ NIGHT SEA (1941 sisters, creepy part) ═════
  const NI = SEA.ocean(E); seas.push(NI);
  const sis = ['PROTEUS', 'NEREUS'].map((n, i) => { const s = SEA.collier({ name: n, hull: '#4A5058' }); s.position.set(i * 24 - 12, 1.0, -i * 30); s.rotation.y = 0.15; NI.scene.add(s);
    const lamp = new THREE.PointLight('#FFE7A0', 6, 20, 1.5); lamp.position.set(8, 8, 0); s.add(lamp); return s; });

  // ═════ ROOMS ═════
  const RD = WD.interior(E, { w: 5, depth: 4, h: 3, wall: '#34465A', motif: '#3E5268', floor: '#7A5A44', ceiling: '#222C3A', signText: 'U.S. NAVY RADIO', picture: false, counterOn: false, litter: false });
  const wset = SEA.wireless(); wset.position.set(0.4, 0, -3.3); RD.scene.add(wset); const rOp = person('radio'); RD.scene.add(rOp.group);
  const ER = WD.interior(E, { w: 9, depth: 7, h: 4.4, wall: '#55585E', motif: '#5E6168', floor: '#3A3A40', ceiling: '#2A2A30', signText: null, picture: false, counterOn: false, litter: false });
  ER.scene.background = new THREE.Color('#1A1A1E'); ER.window.material.color.set('#2A2A30');
  const engine = (x) => { const g = new THREE.Group(); g.position.set(x, 0, -4.2); ER.scene.add(g); const m = WD.mat({ color: '#4A5A6A', metalness: 0.4, roughness: 0.5 }), br = WD.mat({ color: '#C9A13B', metalness: 0.7, roughness: 0.3 });
    const b = new THREE.Mesh(new THREE.BoxGeometry(2.6, 1.4, 2.4), m); b.position.y = 0.7; b.castShadow = true; g.add(b);
    for (let i = 0; i < 3; i++) { const c = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 1.6, 18), m); c.position.set(-0.8 + i * 0.8, 2.2, 0); c.castShadow = true; g.add(c); const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.46, 0.46, 0.14, 18), br); cap.position.set(-0.8 + i * 0.8, 3.05, 0); g.add(cap); }
    const fw = new THREE.Mesh(new THREE.TorusGeometry(0.9, 0.14, 10, 24), WD.mat({ color: '#2A2A30', metalness: 0.5 })); fw.position.set(0, 1.2, 1.3); g.add(fw); for (let i = 0; i < 4; i++) { const s = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.08, 0.08), fw.material); s.rotation.z = i * Math.PI / 4; fw.add(s); }
    const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.16, 12, 8), new THREE.MeshBasicMaterial({ color: new THREE.Color(0.4, 2.2, 0.6), toneMapped: false })); lamp.position.set(1.1, 1.6, 1.22); g.add(lamp);
    const sm = TW.smokeVent(10, 0.8, '#55555E'); sm.position.set(0, 3.1, 0); g.add(sm);
    const lbl = WD.signBoard(x < 0 ? 'PORT ENGINE' : 'STARBOARD ENGINE', { w: 2.2, h: 0.36, bg: '#1F1C33', fg: '#F2E6CF' }); lbl.position.set(0, 0.9, 1.22); g.add(lbl);
    return { g, fw, lamp, sm }; };
  const eL = engine(-2.4), eR = engine(2.4);
  { const l1 = new THREE.PointLight('#FFE2B0', 30, 14, 1.2); l1.position.set(0, 3.6, -1); ER.scene.add(l1); const l2 = new THREE.PointLight('#B0C8FF', 14, 12, 1.4); l2.position.set(0, 2.5, 3); ER.scene.add(l2); }
  const eng1 = person('engineer'), eng2 = person('stoker'); [eng1, eng2].forEach((p) => ER.scene.add(p.group));

  const MH = WD.interior(E, { w: 8, depth: 6, h: 4.2, wall: '#2E4E8A', motif: '#3A5E9C', ceiling: '#1F2440', floor: '#6B4A33', signText: null, picture: false, counterOn: false, litter: false });
  MH.window.material.color.set('#24385F'); MH.window.material.map = null;
  { const pl = PR.poster(['USS CYCLOPS', '!306 LOST AT SEA', 'MARCH 1918', 'NEVER FOUND'], { w: 1.8, h: 2.2, bg: '#C9A13B', fg: '#1F1C33', accent: '#1F1C33' }); pl.position.set(0, 2.0, -5.85); MH.scene.add(pl);
    const wr = new THREE.Mesh(new THREE.TorusGeometry(0.6, 0.18, 10, 28), WD.mat({ color: '#2F6B3A' })); wr.position.set(0, 0.5, -5.5); wr.rotation.x = -0.3; MH.scene.add(wr);
    const bow = new THREE.Mesh(new THREE.SphereGeometry(0.16, 10, 8), WD.mat({ color: '#B5372E' })); bow.position.set(0, 0.0, -5.3); MH.scene.add(bow);
    const fl = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 0.9), WD.mat({ map: WD.canvasTex('flag', 380, 240, (c) => { for (let i = 0; i < 13; i++) { c.fillStyle = i % 2 ? '#FFFFFF' : '#B5372E'; c.fillRect(0, i * 240 / 13, 380, 240 / 13 + 1); } c.fillStyle = '#2E3E7A'; c.fillRect(0, 0, 160, 130); c.fillStyle = '#FFFFFF'; for (let i = 0; i < 20; i++) { c.beginPath(); c.arc(16 + (i % 5) * 32, 16 + Math.floor(i / 5) * 32, 5, 0, 7); c.fill(); } }) })); fl.position.set(-2.6, 2.9, -5.85); MH.scene.add(fl); }
  const mS1 = person('sailor'), mS2 = person('sailor2'), mOff = person('officer'); [mS1, mS2, mOff].forEach((p) => MH.scene.add(p.group));

  const NS = WD.mainStreet(E, { people: true, cars: false, shops: [['NEWS', '#C9603F', 'brick', '#D8343F'], ['BARBER', '#E3C16F', 'wood', '#3C6FB6'], ['BANK', '#C7B79A', 'brick', null], ['GENERAL STORE', '#6FA3B8', 'wood', null], ['TAILOR', '#B98ACF', 'wood', '#2E4E3F'], ['NAVY RECRUITING', '#7FA36A', 'brick', '#2E4E8A'], ['CAFE', '#E58A6A', 'wood', '#2E4E3F'], ['PHARMACY', '#5FA39A', 'wood', '#D8343F']] });
  const nBoy = person('newsboy', { height: 1.35 }); NS.scene.add(nBoy.group);

  // underwater
  const UW = new THREE.Scene(); UW.background = new THREE.Color('#06223C'); UW.fog = new THREE.Fog('#06223C', 4, 45);
  UW.add(new THREE.HemisphereLight('#5AA8D8', '#0A1A2A', 1.4)); { const k = new THREE.DirectionalLight('#7FC8F0', 1.2); k.position.set(4, 20, 6); UW.add(k);
    const sand = new THREE.Mesh(new THREE.PlaneGeometry(200, 200, 60, 60), WD.mat({ color: '#B9A47A', flatShading: true })); const p = sand.geometry.attributes.position; for (let i = 0; i < p.count; i++) p.setZ(i, Math.sin(p.getX(i) * 0.3) * 0.4 + Math.cos(p.getY(i) * 0.25) * 0.5); sand.geometry.computeVertexNormals(); sand.rotation.x = -Math.PI / 2; UW.add(sand);
    for (let i = 0; i < 30; i++) { const r = new THREE.Mesh(new THREE.IcosahedronGeometry(0.5 + (i % 4) * 0.4, 0), WD.mat({ color: '#5A6470', flatShading: true })); r.position.set(Math.sin(i * 7.3) * 30, 0.2, -Math.abs(Math.cos(i * 3.1)) * 40); UW.add(r); }
    const pg = new THREE.BufferGeometry(); const pp = new Float32Array(600 * 3); for (let i = 0; i < 600; i++) pp.set([Math.sin(i * 12.9) * 20, Math.abs(Math.sin(i * 3.7)) * 12, -Math.abs(Math.cos(i * 5.1)) * 30], i * 3); pg.setAttribute('position', new THREE.BufferAttribute(pp, 3)); UW.add(new THREE.Points(pg, new THREE.PointsMaterial({ color: '#BFE6F5', size: 0.06 }))); }

  // ═════════════ SHOTS ═════════════
  // 1a · "In March 1918," aerial over the colourful Barbados harbour; ribbon MARCH 1918
  { const st = cut(0), wy = Wd('1918', 0);
    wrap({ id: 'S01', at: st, note: 'aerial: palm-lined Barbados shore, the grey collier at the dock; ribbon MARCH 1918', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); hideDeck(); shipAt(-40, 0, 0); ride(cyc, t, 1.2); setOre(0); hatch.visible = false; searchers.forEach((s) => (s.visible = false));
      shoot(DY.scene, [], V3(-10, 34, 60), V3(-20, 22, 44), V3(-50, 0, -6), V3(-40, 2, 0), k, { ...LK.sea, fov: 46 }, 50);
      blit(); ribbon('MARCH 1918', (t - wy + 0.1) / 0.3);
    } });
    cue(0.05, 'whoosh', { gain: 0.4 }); cue(wy, 'stamp', { gain: 0.6 }); }
  // 1b · "a giant US Navy ship" low angle along the hull: CYCLOPS, the derricks towering
  { const st = Wd('giant', 0) - 0.15;
    wrap({ id: 'S01b', at: st, note: 'low angle along the giant grey hull, derricks towering overhead', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); hideDeck(); shipAt(-40, 0, 0); ride(cyc, t, 1.2);
      shoot(DY.scene, [], V3(-14, 0.8, 8), V3(-18, 1.0, 7), V3(-40, 6, 0), V3(-34, 7, 0), k, { ...LK.sea, fov: 52 }, 20);
      blit(); pill('U.S. NAVY', (t - Wd('navy', 0) + 0.1) / 0.3);
    } });
    cue(st, 'whoosh', { gain: 0.4 }); }
  // 1c · "sailed out of Barbados," people on the dock wave as the ship pulls away
  { const st = Wd('sailed', 0) - 0.15;
    wrap({ id: 'S01c', at: st, note: 'on the dock locals wave goodbye as the ship slides away to sea', draw(lt, d, t, blit) {
      const k = clamp(lt / d); hideDeck(); [dk1, dk2, dk3].forEach((p) => (p.group.visible = true)); shipAt(-40 + (t - st) * 3, -6 - (t - st) * 1.5, -0.12); ride(cyc, t, 1.2);
      dk1.at(-44, 1.6, 8.6); dk2.at(-42.6, 1.6, 8.8); dk3.at(-41.4, 1.6, 8.4);
      dk1.set({ mood: 'happy', ...G('wave', t) }); dk2.set({ mood: 'happy', ...G('wave', t, 1.5) }); dk3.set({ mood: 'happy', ...G('cheer', t), legs: Math.sin(t * 8) > 0.3 ? 'jump' : 'stand' });
      shoot(DY.scene, [dk1, dk2, dk3], V3(-46, 3.4, 15), V3(-45, 3.3, 14), V3(-42.5, 2.6, 8.6), V3(-36, 3, -4), eio(k), { ...LK.sea, fov: 50 }, 7);
      blit(); pill('BARBADOS → BALTIMORE', (t - Wd('barbados', 0) + 0.1) / 0.3);
    } });
    cue(st, 'chug', { dur: 1.6, gain: 0.3 }); }

  // 2 · "with three hundred and six people on board," the crew on deck; counter 306
  { const st = cut(1), wn = Wd('three', 1);
    wrap({ id: 'S02', at: st, note: 'on deck: sailors and an officer at the rail wave and salute; counter 306 ON BOARD', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); hideDeck(); shipAt(0, 0, 0); ride(cyc, t, 1.2); [sw1, sw2, sOff, sw3].forEach((p) => (p.group.visible = true));
      onDeck(sOff, 4, 1.2); onDeck(sw1, 2.2, 1.4); onDeck(sw2, 0.4, 1.3); onDeck(sw3, -1.6, 1.5);
      sOff.set({ mood: 'proud', ...SALUTE, blink: blink(t) }); sw1.set({ mood: 'happy', ...G('wave', t) }); sw2.set({ mood: 'happy', ...G('explain', t, 1), talk: talk(t) }); sw3.set({ mood: 'happy', ...G('wave', t, 2) });
      shoot(DY.scene, [sw1, sw2, sOff, sw3], V3(4, 4.6, 9.5), V3(1.5, 4.4, 8.5), V3(1.2, 4.4, 1.3), null, k, { ...LK.sea, fov: 48 });
      blit(); counter(Math.round(lerp(1, 306, eo(clamp((t - wn + 0.2) / 0.9)))), (t - st) / 0.3, 'PEOPLE ON BOARD');
    } });
    for (let i = 0; i < 5; i++) cue(Wd('three', 1) - 0.2 + i * 0.18, 'tock', { gain: 0.35 }); }

  // 3 · "and then it simply vanished." storm fog swallows the ship
  { const st = cut(2), wv = Wd('vanished', 2);
    wrap({ id: 'S03', at: st, note: 'grey squall: fog rolls in and the ship melts away on "vanished"', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); cyc2.position.set(0, 1.2, -40); cyc2.rotation.y = 0.35; ride(cyc2, t, 1.2); cyc2.visible = true;
      const f = eo(clamp((t - wv + 0.3) / 1.2)); fogTo(ST.scene, lerp(30, 2, f), lerp(160, 36, f));
      shoot(ST.scene, [], V3(-18, 5, 6), V3(-16, 5.4, 4), V3(0, 4, -40), null, k, { ...LK.sea, fov: 44 }, 40);
      blit();
    } });
    cue(Wd('vanished', 2), 'whoosh', { gain: 0.6 }); cue(Wd('vanished', 2) + 0.2, 'heartbeat', { gain: 0.6 }); }

  // 4 · "No distress call, no wreckage, no bodies," checklist over the empty grey sea
  { const st = cut(3), w1 = Wd('distress', 3), w2 = Wd('wreckage', 3), w3 = Wd('bodies', 3);
    wrap({ id: 'S04', at: st, note: 'empty grey sea; a checklist: NO SOS / NO WRECKAGE / NO ONE FOUND, a red X on each word', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); cyc2.visible = false; fogTo(ST.scene, 20, 120);
      shoot(ST.scene, [], V3(0, 4, 10), V3(6, 3.6, 4), V3(0, 1, -40), V3(20, 1, -40), k, { ...LK.sea, fov: 48 }, 40);
      blit(); checklist(['SOS CALL', 'WRECKAGE', 'SURVIVORS'], [w1, w2, w3], t, (t - st) / 0.3);
    } });
    [Wd('distress', 3), Wd('wreckage', 3), Wd('bodies', 3)].forEach((w) => cue(w, 'stamp', { gain: 0.6 })); }

  // 5 · "nothing, ever." Navy radio room: the operator listens to silence, shakes his head
  { const st = cut(4), wn = Wd('nothing', 4);
    wrap({ id: 'S05', at: st, note: 'a Navy radio room: the operator presses his headphone, hears nothing, shrugs', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); rOp.at(0.6, 0, -2.4);
      rOp.set({ mood: 'worried', ...(t > wn + 0.4 ? G('shrug', t) : { armR: [150, -150], armL: [40, -60] }), holdR: t > wn + 0.4 ? null : P2.phones, v: 'p' + (t > wn + 0.4), look: [Math.sin(t * 3) * 0.5, 0], blink: blink(t) });
      shoot(RD.scene, [rOp], V3(-0.6, 1.6, 1.0), V3(-0.3, 1.6, 0.4), V3(0.5, 1.35, -2.6), null, k, { ...LK.room, fov: 46 });
      blit(); pill('SILENCE', (t - wn) / 0.3, 250, 'rgba(120,20,30,0.9)');
    } });
    cue(st, 'whoosh', { gain: 0.3 }); }

  // 6 · "She was the USS Cyclops," hero shot: the bow with her name
  { const st = cut(5), wc = Wd('cyclops', 5);
    wrap({ id: 'S06', at: st, note: 'hero shot: camera arcs around the bow, the name CYCLOPS; pill USS CYCLOPS', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); hideDeck(); shipAt(0, 0, 0); ride(cyc, t, 1.2); setOre(0); hatch.visible = false;
      const a = lerp(0.9, 0.35, k); shoot(DY.scene, [], V3(12 + Math.cos(a) * 12, 2.4, Math.sin(a) * 14), V3(12 + Math.cos(a) * 12, 2.4, Math.sin(a) * 14), V3(10, 2.6, 0), null, 0, { ...LK.sea, fov: 50 }, 14);
      blit(); pill('USS CYCLOPS', (t - wc + 0.1) / 0.3);
    } });
    cue(st, 'whoosh', { gain: 0.5 }); }

  // 7a · "a coal ship carrying" wide side view, the derricks
  { const st = cut(6), wa = Wd('almost', 6), we = Wd('eleven', 6);
    wrap({ id: 'S07', at: st, note: 'top-down: an open hatch; dark ore rocks pile up; counter climbs to 11,000 TONS', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); hideDeck(); shipAt(0, 0, 0); ride(cyc, t, 1.2); hatch.visible = true;
      const hp = V3(-2, DECK + 0.01, 0).add(cyc.position); hatch.position.copy(hp); ore.position.copy(hp);
      setOre(clamp((t - st) / (we - st + 0.6)));
      sw1.group.visible = true; onDeck(sw1, -6.2, 1.2); sw1.set({ mood: 'shock', ...G('pointR', t), look: [0.6, 0.4] });
      shoot(DY.scene, [sw1], V3(-6, 10, 7), V3(-4.5, 8.5, 5.5), V3(-2.4, DECK + 1.2, 0), null, k, { ...LK.sea, fov: 50 }, 9);
      blit(); counter(Math.round(lerp(0, 11000, eo(clamp((t - st - 0.2) / (we - st + 0.4))))).toLocaleString('en-US'), (t - st) / 0.3, 'TONS OF ORE', 320, 600);
    } });
    for (let i = 0; i < 8; i++) cue(cut(6) + 0.3 + i * 0.28, 'plop', { gain: 0.45 }); }
  // 7b · "of heavy ore," the derrick swings a load in; sailor wipes sweat
  { const st = Wd('heavy', 6) - 0.15;
    wrap({ id: 'S07b', at: st, note: 'close: the ore heap fills the hatch; a sailor holds his head', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); hideDeck(); shipAt(0, 0, 0); ride(cyc, t, 1.2); hatch.visible = true; const hp = V3(-2, DECK + 0.01, 0).add(cyc.position); hatch.position.copy(hp); ore.position.copy(hp); setOre(1);
      sw2.group.visible = true; onDeck(sw2, -4.0, 1.9); sw2.set({ mood: 'worried', ...G('head', t), sweat: 1 });
      shoot(DY.scene, [sw2], V3(-8.5, 5.8, 6.2), V3(-8, 5.6, 5.4), V3(-3.4, DECK + 1.4, 0.6), null, k, { ...LK.sea, fov: 48 });
      blit(); pill('MANGANESE ORE', (t - st - 0.1) / 0.3);
    } });
    cue(st, 'thud', { gain: 0.5 }); }

  // 8 · "so heavy she sat below her safety line." the hull sinks; the safety-line mark goes under
  { const st = cut(7), wl = Wd('line', 7);
    wrap({ id: 'S08', at: st, note: 'close on the hull: the ship settles lower until the safety-line mark sinks under water; pill OVERLOADED', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); hideDeck(); shipAt(0, 0, 0); hatch.visible = false; setOre(0);
      const sink = eo(clamp((t - st - 0.2) / (wl - st + 0.2))); ride(cyc, t, lerp(1.2, -0.75, sink));
      shoot(DY.scene, [], V3(0.5, 1.4, 6.0), V3(0.3, 1.2, 5.4), V3(0, 0.6, 2.1), null, k, { ...LK.sea, fov: 50 }, 4);
      blit(); pill('SAFETY LINE', clamp((t - st) / 0.3) * (t < wl ? 1 : 0), 250, 'rgba(31,28,51,0.88)'); if (t >= wl) pill('OVERLOADED', (t - wl) / 0.25, 250, 'rgba(160,30,40,0.92)');
    } });
    cue(st + 0.2, 'slide', { dur: 1.6, gain: 0.4 }); cue(Wd('line', 7), 'thud', { gain: 0.7 }); }

  // 9 · "And one of her two engines was broken," engine room: the starboard engine sputters, lamp turns red
  { const st = cut(8), wb = Wd('broken', 8);
    wrap({ id: 'S09', at: st, note: 'engine room: two engines; on "broken" the starboard one coughs smoke, stops, its lamp turns red; engineer grabs his head', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); const bad = t > wb;
      eL.fw.rotation.z = -t * 6; eR.fw.rotation.z = bad ? -wb * 6 : -t * 6; eL.sm.update(t, 0); eR.sm.update(t, bad ? 1 : 0);
      eR.lamp.material.color.set(bad ? new THREE.Color(2.6, 0.3, 0.3) : new THREE.Color(0.4, 2.2, 0.6));
      eng1.at(1.2, 0, -2.2); eng2.at(-1.0, 0, -2.0);
      eng1.set({ mood: bad ? 'shock' : 'neutral', ...(bad ? G('head', t) : { armR: [80, -60], holdR: P2.wrench, armL: [20, 10] }), v: 'w' + bad, sweat: bad ? 1 : 0, blink: blink(t) });
      eng2.set({ mood: bad ? 'worried' : 'happy', ...(bad ? G('pointR', t) : G('explain', t, 1)), look: [0.8, 0] });
      shoot(ER.scene, [eng1, eng2], V3(0, 2.6, 6.0), V3(0.7, 2.4, 5.0), V3(0, 1.8, -4), V3(1.0, 1.8, -4), k, { ...LK.room, fov: 60 });
      blit(); if (bad) pill('1 OF 2 ENGINES: CRACKED', (t - wb) / 0.3, 250, 'rgba(160,30,40,0.92)', 46);
    } });
    cue(Wd('broken', 8), 'slam', { gain: 0.6 }); cue(Wd('broken', 8) + 0.05, 'alarm', { dur: 0.8, gain: 0.25 }); }

  // 10 · "so she limped north toward Baltimore on just one." route map: the line crawls north... and stops at "?"
  { const st = cut(9), wb = Wd('baltimore', 9);
    wrap({ id: 'S10', at: st, note: 'the ship crawls low in the water; a map: a red route creeps from BARBADOS toward BALTIMORE and stops at a "?"', draw(lt, d, t, blit) {
      const k = clamp(lt / d); hideDeck(); shipAt((t - st) * 1.2, 0, -0.4); ride(cyc, t, -0.75);
      shoot(DY.scene, [], V3(30, 3, 26), V3(28, 3, 24), V3(cyc.position.x, 3, 0), null, eio(k), { ...LK.sea, fov: 44 }, 36);
      blit(); routeMap((t - st) / 0.3, clamp((t - st - 0.2) / (Le(9) - st - 0.3)), 450, false);
    } });
    cue(st, 'slide', { dur: 2.4, gain: 0.4 }); }

  // 11 · "The Navy searched and searched," lookouts with binoculars on two search ships
  { const st = cut(10);
    wrap({ id: 'S11', at: st, note: 'search ships cross an empty sea; on deck sailors sweep the horizon with binoculars and point', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); hideDeck(); shipAt(0, -200, 0); sDeck.visible = true; searchers.forEach((s, i) => { s.visible = true; s.position.set(-20 + i * 26 + (t - st) * 2, 0.4, -30 - i * 18); s.rotation.y = 0.2; ride(s, t, 0.4, i); });
      sw1.group.visible = true; sw2.group.visible = true; sw1.at(-1.0, 1.0, 4); sw2.at(0.6, 1.0, 4.4);
      sw1.set({ mood: 'worried', armR: [100, -70], armL: [100, -70], holdR: P2.binos, look: [Math.sin(t * 1.5) * 0.8, 0], v: 'b' }); sw2.set({ mood: 'neutral', ...G('pointL', t), look: [-0.8, 0] });
      shoot(DY.scene, [sw1, sw2], V3(-0.2, 2.6, 8.5), V3(0.4, 2.6, 8.0), V3(-0.2, 2.4, 4), V3(4, 2.2, -20), k, { ...LK.sea, fov: 50 });
      blit(); pill('SEARCH', (t - st - 0.1) / 0.3);
    } });
    cue(st, 'whoosh', { gain: 0.4 }); }
  // 12 · "but found nothing." the empty horizon; the lookouts shrug
  { const st = cut(11);
    wrap({ id: 'S12', at: st, note: 'the lookouts lower their binoculars and shrug at the empty horizon', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); shipAt(0, -200, 0); sDeck.visible = true; sw1.group.visible = true; sw2.group.visible = true; sw1.at(-1.0, 1.0, 4); sw2.at(0.6, 1.0, 4.4);
      sw1.set({ mood: 'sad', ...G('shrug', t) }); sw2.set({ mood: 'sad', ...G('shrug', t, 1) });
      shoot(DY.scene, [sw1, sw2], V3(-0.2, 2.2, 7.6), V3(-0.2, 2.6, 9.0), V3(-0.2, 2.0, 4), null, k, { ...LK.sea, fov: 50 });
      blit();
    } });
    cue(st, 'tock', { gain: 0.3 }); }

  // 13a · "Even President Wilson said" a newsboy shouts with the headline
  { const st = cut(12), ws = Wd('said', 12);
    wrap({ id: 'S13', at: st, note: 'a 1918 street: a newsboy waves the paper CYCLOPS LOST and shouts', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); nBoy.at(-4.6, 0.18, -5.6);
      nBoy.set({ mood: 'shock', armR: [150 + Math.sin(t * 9) * 12, 0], holdR: PROPS.paper('CYCLOPS LOST'), armL: [70, -60], talk: talk(t), v: 'n', legs: Math.sin(t * 7) > 0.5 ? 'jump' : 'stand' });
      shoot(NS.scene, [...NS.people, nBoy], V3(-2.2, 1.5, -2.0), V3(-2.6, 1.45, -2.6), V3(-4.6, 1.3, -5.6), null, k, { bloom: 0.2, bloomThreshold: 1.08, aperture: 0.0012, maxblur: 0.008, fov: 46 });
      blit(); pill('1918', (t - st - 0.1) / 0.3);
    } });
    cue(st + 0.1, 'pop', { gain: 0.5 }); }
  // 13b · "only God and the sea know what happened to her." quote card over the stormy sea
  { const st = Wd('only', 12) - 0.2;
    wrap({ id: 'S13b', at: st, note: 'slow drift over the grey storm sea; the quote card fades up', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); cyc2.visible = false; fogTo(ST.scene, 20, 120);
      shoot(ST.scene, [], V3(0, 8, 10), V3(0, 3, 4), V3(0, 1, -40), null, k, { ...LK.sea, fov: 48 }, 40);
      blit(); quoteCard((t - st) / 0.4);
    } });
    cue(st, 'slide', { dur: 1.0, gain: 0.3 }); }

  // 14 · "But here's the creepy part:" night sea, slow push, heartbeat
  { const st = cut(13);
    wrap({ id: 'S14', at: st, note: 'starry night sea, empty; slow push toward the black horizon', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); sis.forEach((s) => (s.visible = false));
      shoot(NI.scene, [], V3(0, 3, 30), V3(0, 2.4, 22), V3(0, 4, -100), null, k, { ...LK.night, fov: 46 }, 60);
      blit();
    } });
    cue(st, 'heartbeat', { gain: 0.8 }); cue(st + 0.8, 'heartbeat', { gain: 0.8 }); }

  // 15 · "in 1941, two of her sister ships," two identical colliers at night; ribbon 1941; names
  { const st = cut(14), wy = Wd('1941', 14), wt = Wd('two', 14);
    wrap({ id: 'S15', at: st, note: 'two identical grey colliers steam through the night; ribbon 1941; labels PROTEUS and NEREUS', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); fogTo(NI.scene, 60, 330); sis.forEach((s, i) => { s.visible = true; s.position.x = i * 24 - 12 + (t - st) * 1.5; ride(s, t, 1.0, i); });
      shoot(NI.scene, [], V3(20, 8, 42), V3(14, 7, 36), V3(0, 4, -12), null, k, { ...LK.night, fov: 46 }, 50);
      blit(); ribbon('1941', (t - wy + 0.1) / 0.3, 360); if (t > wt) { pill('PROTEUS', (t - wt) / 0.3, 560); pill('NEREUS', (t - wt - 0.25) / 0.3, 700); }
    } });
    cue(Wd('1941', 14), 'stamp', { gain: 0.6 }); }
  // 16 · "also carrying heavy ore," close along a sister's deck: ore heaped in the hatches
  { const st = cut(15);
    wrap({ id: 'S16', at: st, note: "close along the sister ship's hull, lights in her bridge, riding low", draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); sis.forEach((s, i) => { s.visible = true; ride(s, t, -0.4, i); });
      const p = sis[0].position; shoot(NI.scene, [], V3(p.x + 18, 2.2, p.z + 9), V3(p.x + 12, 2.4, p.z + 8), V3(p.x, 3, p.z), null, k, { ...LK.night, fov: 48 }, 16);
      blit(); pill('HEAVY ORE · RIDING LOW', (t - st - 0.1) / 0.3);
    } });
    cue(st, 'chug', { dur: 1.4, gain: 0.3 }); }
  // 17 · "vanished too, without a trace." the night swallows them one after the other
  { const st = cut(16), wv = Wd('vanished', 16);
    wrap({ id: 'S17', at: st, note: 'wide: one sister, then the other, fades into the dark until the sea is empty', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); sis.forEach((s, i) => { const f = clamp((t - wv - i * 0.6) / 0.5); s.visible = f < 1; s.position.y = 1.0 - f * 6; ride(s, t, 1.0 - eo(f) * 7, i); });
      shoot(NI.scene, [], V3(16, 7, 40), V3(14, 6.4, 38), V3(0, 3, -12), null, k, { ...LK.night, fov: 46 }, 50);
      blit();
    } });
    cue(Wd('vanished', 16), 'whoosh', { gain: 0.6 }); cue(Wd('vanished', 16) + 0.6, 'whoosh', { gain: 0.6 }); }

  // 18a · "It's still the Navy's biggest loss of life" memorial plaque; sailors salute
  { const st = cut(17), wc = Wd('combat', 17);
    wrap({ id: 'S18', at: st, note: 'a memorial: brass plaque USS CYCLOPS · 306 LOST, a wreath, the flag; two sailors and an officer salute', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); mS1.at(-2.3, 0, -3.9); mOff.at(-1.3, 0, -3.4); mS2.at(1.6, 0, -3.6);
      [mS1, mS2, mOff].forEach((p, i) => p.set({ mood: 'sad', ...SALUTE, blink: blink(t, i) }));
      shoot(MH.scene, [mS1, mS2, mOff], V3(0, 1.8, 2.4), V3(0, 1.9, 1.2), V3(0, 1.7, -5), null, k, { ...LK.room, fov: 52 });
      blit();
    } });
  }
  { const st = Wd('biggest', 17) - 0.15, wc = Wd('combat', 17);
    wrap({ id: 'S18b', at: st, note: 'close on the brass plaque and the wreath; pill BIGGEST NON-COMBAT LOSS', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); [mS1, mS2, mOff].forEach((p, i) => p.set({ mood: 'sad', ...SALUTE }));
      shoot(MH.scene, [mS1, mS2, mOff], V3(0.6, 2.0, -2.2), V3(0.3, 2.0, -2.8), V3(0, 1.8, -5.85), null, k, { ...LK.room, fov: 48 }, 3);
      blit(); pill('BIGGEST NON-COMBAT LOSS · U.S. NAVY', (t - st - 0.1) / 0.3, 250, 'rgba(31,28,51,0.9)', 38);
    } });
    cue(st, 'slide', { dur: 1, gain: 0.3 }); }

  // 19 · "and more than a hundred years later," year counter over a calm empty sea
  { const st = cut(18);
    wrap({ id: 'S19', at: st, note: 'calm empty blue sea; a year counter spins 1918 → 2026', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); hideDeck(); shipAt(0, -200, 0); cyc.visible = false; searchers.forEach((s) => (s.visible = false));
      shoot(DY.scene, [], V3(0, 3, 10), V3(0, 6, 4), V3(0, 2, -60), V3(0, 4, -80), k, { ...LK.sea, fov: 48 }, 40);
      blit(); counter(Math.round(lerp(1918, 2026, eio(clamp((t - st) / (d * 0.85))))), (t - st) / 0.3, 'AND STILL MISSING');
    } });
    for (let i = 0; i < 6; i++) cue(cut(18) + 0.1 + i * 0.25, 'tock', { gain: 0.35 }); }

  // 20 · "no one has ever found her." the dark sea floor; sonar sweeps: NO CONTACT
  { const st = cut(19);
    wrap({ id: 'S20', at: st, note: 'the dark ocean floor; a sonar screen sweeps: NO CONTACT', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); cam.fov = 50; cam.updateProjectionMatrix(); cam.position.copy(mix(V3(0, 4, 8), V3(2, 3, 2), k)); cam.lookAt(0, 0.5, -20);
      E.render(UW, cam, { bloom: 0.2, bloomThreshold: 1.08, aperture: 0.0004, maxblur: 0.005, focus: 15 });
      blit(); sonar(t, (t - st) / 0.3);
    } });
    cue(st, 'bubbles', { dur: 1.4, gain: 0.4 }); }

  // 21 · "So... where did the Cyclops go?" the ship drifts into fog; a question mark
  { const st = cut(20), ww = Wd('where', 20);
    wrap({ id: 'S21', at: st, note: 'the grey ship sails slowly into a wall of fog; a big question mark on "where"', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); cyc2.visible = true; cyc2.position.set(-6 + (t - st) * 1.5, 1.2, -26); cyc2.rotation.y = 0.5; ride(cyc2, t, 1.2);
      const f = eo(clamp((t - st) / d)); fogTo(ST.scene, lerp(14, 2, f), lerp(90, 30, f));
      shoot(ST.scene, [], V3(-20, 4, 10), V3(-16, 4.4, 6), V3(0, 4, -26), null, k, { ...LK.sea, fov: 44 }, 30);
      blit(); const q = eob(clamp((t - ww) / 0.35)); if (q > 0) { ctx.save(); ctx.translate(540, 470); ctx.scale(q, q); ctx.font = '900 300px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineWidth = 16; ctx.strokeStyle = INK; ctx.strokeText('?', 0, 0); ctx.fillStyle = '#F2C230'; ctx.fillText('?', 0, 0); ctx.restore(); }
    } });
    cue(Wd('where', 20), 'heartbeat', { gain: 0.7 }); }

  return { shots: S, cues: CUES };
}
