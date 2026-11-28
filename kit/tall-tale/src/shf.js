// Night campus city: lit office blocks, a two-storey entertainment complex with an outdoor escalator up to a neon BAR
// balcony, CCTV cameras, street lamps. Also an airport gate and a police video room. 2D: CCTV HUD, clock, ID card,
// departure board, missing poster.
import * as THREE from 'three';
import * as WD from './core/world.js';
import { ctx, clamp, lerp, eo, eob, rnd } from './core/lib.js';
import { INK } from './core/toon.js';
import { plane } from './core/props.js';

const M = (o) => WD.mat(o);
const add = (p, m, x = 0, y = 0, z = 0) => { m.position.set(x, y, z); m.castShadow = true; m.receiveShadow = true; p.add(m); return m; };
const B = (w, h, d, m) => new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m);
const winTex = (seed, cols = 8, rows = 12, base = '#1E2636') => WD.canvasTex('cw' + seed + cols + rows, 256, 384, (c) => { c.fillStyle = base; c.fillRect(0, 0, 256, 384);
  for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) { const on = rnd(seed * 31 + x * 7 + y * 13) > 0.55; c.fillStyle = on ? (rnd(x + y + seed) > 0.5 ? '#FFD98A' : '#BFE0FF') : '#2A3448'; c.fillRect(8 + x * (240 / cols), 8 + y * (368 / rows), 240 / cols - 8, 368 / rows - 10); } });
const glowMat = (col, k = 1.6) => new THREE.MeshBasicMaterial({ color: new THREE.Color(col).multiplyScalar(k), toneMapped: false });

/** neon sign plane */
export function neon(text, { w = 3, h = 0.9, col = '#FF4FA0' } = {}) {
  const tex = WD.canvasTex('neon' + text + col, 512, Math.round(512 * h / w), (c) => { c.clearRect(0, 0, 512, 200); c.font = `900 ${Math.round(512 * h / w * 0.7)}px Inter`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.shadowColor = col; c.shadowBlur = 24; c.fillStyle = '#FFFFFF'; c.strokeStyle = col; c.lineWidth = 10; c.strokeText(text, 256, 512 * h / w / 2); c.fillText(text, 256, 512 * h / w / 2); });
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: tex, transparent: true, toneMapped: false, color: new THREE.Color(1.4, 1.4, 1.4) }));
  const l = new THREE.PointLight(col, 6, 8, 1.6); l.position.z = 0.6; m.add(l); return m;
}
/** a CCTV camera on a bracket, pointing along -z of its group */
export function cctv() {
  const g = new THREE.Group(), body = M({ color: '#E8E8EE', roughness: 0.4 }), dark = M({ color: '#22242A' });
  add(g, B(0.08, 0.4, 0.08, dark), 0, 0.2, 0.1); const cam = add(g, B(0.22, 0.2, 0.5, body), 0, 0.42, -0.1); cam.rotation.x = 0.35;
  const lens = add(g, new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.04, 14), dark), 0, 0.33, -0.37); lens.rotation.x = Math.PI / 2 + 0.35;
  const led = new THREE.Mesh(new THREE.SphereGeometry(0.025, 8, 6), glowMat('#FF2A2A', 2.5)); led.position.set(0.08, 0.5, -0.3); g.add(led); g.led = led; return g;
}

/** the night city. Returns { scene, key, escalator steps update, lamps } — complex front faces +z at z = 0, escalator rises along +x */
export function nightCity(E) {
  const scene = new THREE.Scene();
  WD.sky(scene, { top: '#060B1C', horizon: '#26304E', ground: '#26304E' });
  scene.fog = new THREE.Fog('#1A2238', 50, 300); scene.environment = E.envMap; scene.environmentIntensity = 0.12;
  scene.add(new THREE.HemisphereLight('#6E84B8', '#141822', 0.9));
  const key = new THREE.DirectionalLight('#9AB0E0', 0.9); key.position.set(-14, 24, 18); key.castShadow = true; key.shadow.mapSize.set(2048, 2048); Object.assign(key.shadow.camera, { left: -20, right: 20, top: 20, bottom: -20, near: 1, far: 90 }); key.shadow.bias = -0.0008; key.shadow.camera.updateProjectionMatrix(); scene.add(key, key.target);
  const asphalt = WD.canvasTex('asph', 256, 256, (c) => { c.fillStyle = '#2A2E36'; c.fillRect(0, 0, 256, 256); for (let i = 0; i < 900; i++) { c.fillStyle = `rgba(${60 + rnd(i) * 50},${60 + rnd(i) * 50},${70 + rnd(i) * 50},0.4)`; c.fillRect(rnd(i * 3) * 256, rnd(i * 5) * 256, 2, 2); } }, [60, 60]);
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(800, 800), M({ map: asphalt, roughness: 0.55, metalness: 0.1 })); ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; scene.add(ground);
  const walkM = M({ color: '#6A6E78', roughness: 0.8 });
  const walk = add(scene, B(80, 0.16, 6, walkM), 0, 0.08, 3);
  // lane markings
  for (let x = -60; x < 60; x += 6) { const l = new THREE.Mesh(new THREE.PlaneGeometry(3, 0.18), M({ color: '#E8D27A' })); l.rotation.x = -Math.PI / 2; l.position.set(x, 0.01, 11); scene.add(l); }
  // the complex: two storeys, glass ground floor, balcony at y 5 along the front, bar door upstairs
  const cx = new THREE.Group(); scene.add(cx);
  const wallM = M({ color: '#B9A58A', roughness: 0.8 }), glass = new THREE.MeshStandardMaterial({ color: '#7FB0D0', roughness: 0.1, metalness: 0.5, emissive: '#3A5A7A', emissiveIntensity: 0.6 });
  add(cx, B(26, 10, 10, wallM), 0, 5, -5);
  add(cx, B(24, 3.6, 0.1, glass), 0, 2, 0.02);
  const bal = add(cx, B(26, 0.3, 2.4, M({ color: '#5A5E68' })), 0, 5.0, 1.2);
  for (let x = -12.5; x <= 12.5; x += 0.9) add(cx, B(0.05, 1.0, 0.05, M({ color: '#C8CCD4', metalness: 0.6 })), x, 5.65, 2.35);
  add(cx, B(26, 0.06, 0.08, M({ color: '#C8CCD4', metalness: 0.6 })), 0, 6.15, 2.35);
  const upWin = add(cx, B(24, 3.2, 0.1, new THREE.MeshStandardMaterial({ map: winTex(3, 10, 3, '#3A2A3A'), emissive: '#FFFFFF', emissiveMap: winTex(3, 10, 3, '#3A2A3A'), emissiveIntensity: 0.5 })), 0, 7.3, 0.02);
  const door = add(cx, B(1.8, 2.6, 0.12, glowMat('#FFB070', 0.9)), 4.5, 6.45, 0.05);
  const sign = neon('BAR', { w: 3.6, h: 1.1, col: '#FF4FA0' }); sign.position.set(4.5, 8.7, 0.12); cx.add(sign);
  const sign2 = neon('OPEN', { w: 2.0, h: 0.6, col: '#4FD8FF' }); sign2.position.set(8.5, 7.6, 0.12); cx.add(sign2);
  // the escalator: an inclined truss from (−6, 0, 3.2) to (1.2, 5, 3.2), steps that move
  const esc = new THREE.Group(); esc.position.set(-6.5, 0, 3.4); cx.add(esc);
  const len = Math.hypot(7.6, 5.0), ang = Math.atan2(5.0, 7.6);
  const truss = add(esc, B(len, 0.5, 1.3, M({ color: '#8A8E98', metalness: 0.6, roughness: 0.35 })), 3.8, 2.3, 0); truss.rotation.z = ang;
  [-0.7, 0.7].forEach((z) => { const side = add(esc, B(len, 0.9, 0.08, new THREE.MeshStandardMaterial({ color: '#AFCDE0', roughness: 0.05, metalness: 0.3, transparent: true, opacity: 0.35 })), 3.8, 3.0, z); side.rotation.z = ang; const rail = add(esc, B(len, 0.08, 0.1, M({ color: '#1A1A20' })), 3.8, 3.45, z); rail.rotation.z = ang; });
  const steps = []; const stepM = M({ color: '#3A3E48', metalness: 0.5, roughness: 0.4 });
  for (let i = 0; i < 18; i++) { const s = add(esc, B(0.42, 0.28, 1.2, stepM), 0, 0, 0); steps.push(s); }
  add(esc, B(1.6, 0.2, 1.4, M({ color: '#5A5E68' })), -0.6, 0.1, 0); add(esc, B(1.6, 0.2, 1.4, M({ color: '#5A5E68' })), 8.4, 5.1, 0);
  const stepUpdate = (t) => steps.forEach((s, i) => { const u = ((i / steps.length) + t * 0.06) % 1; s.position.set(0.2 + u * 7.4, 0.2 + u * 4.9, 0); });
  stepUpdate(0);
  // cameras on the complex
  const cams = [[-8.5, 4.2, 0.4], [10, 4.4, 0.4], [0, 9.6, 0.4]].map(([x, y, z], i) => { const c = cctv(); c.position.set(x, y, z); c.rotation.y = Math.PI + (i - 1) * 0.4; cx.add(c); return c; });
  // street lamps
  const lamps = [-18, -9, 10, 22].map((x) => { const g = new THREE.Group(); g.position.set(x, 0, 5.8); scene.add(g); add(g, new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.09, 5, 8), M({ color: '#2A2E36' })), 0, 2.5, 0);
    const head = add(g, B(0.8, 0.14, 0.35, M({ color: '#2A2E36' })), 0.3, 5, 0); const bulb = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.04, 0.25), glowMat('#FFD9A0', 2)); bulb.position.set(0.3, 4.92, 0); g.add(bulb);
    const L = new THREE.PointLight('#FFC98A', 22, 14, 1.5); L.position.set(0.3, 4.6, 0); g.add(L); return g; });
  // other buildings around (lit windows)
  const blocks = [];
  for (let i = 0; i < 60; i++) { const a = rnd(i) * 6.283, r = 30 + rnd(i * 3) * 130; const x = Math.cos(a) * r, z = Math.sin(a) * r - 20; if (z > 6 && z < 40 && Math.abs(x) < 40) continue;
    const h = 8 + rnd(i * 7) * 40, w = 8 + rnd(i * 5) * 10; const tex = winTex(i % 9, 6 + (i % 4), 8 + Math.round(h / 4)); tex.repeat.set(1, 1);
    const m = new THREE.MeshStandardMaterial({ map: tex, emissive: '#FFFFFF', emissiveMap: tex, emissiveIntensity: 0.55, roughness: 0.7 });
    const b = add(scene, B(w, h, w, m), x, h / 2, z); blocks.push(b); }
  // trees on the sidewalk
  [-26, 14, 25, 31].forEach((x, i) => { const t = WD.tree(1.2, '#2E5A3A', 'round'); t.position.set(x, 0.16, 5.2); scene.add(t); });
  const update = (t) => { stepUpdate(t); cams.forEach((c, i) => (c.led.visible = Math.sin(t * 6 + i) > -0.2)); };
  return { scene, key, update, esc, cams, lamps, door, sign };
}

/** airport gate at night: big window with a parked plane, seats, a board. Returns { scene, seats } */
export function airportGate(E) {
  const R = WD.interior(E, { w: 10, depth: 7, h: 4.6, wall: '#8A98A8', motif: '#94A2B2', floor: '#B8B2A6', ceiling: '#D8DCE2', signText: null, picture: false, counterOn: false, litter: false, bulbs: false });
  R.window.material.color.set('#1A2238');
  const pl = plane('#F4EFE4', '#3C6FB6'); pl.position.set(0, 1.0, -16); pl.rotation.y = 0.3; pl.scale.setScalar(1.3); R.scene.add(pl);
  const apron = new THREE.Mesh(new THREE.PlaneGeometry(60, 30), M({ color: '#3A3E48' })); apron.rotation.x = -Math.PI / 2; apron.position.set(0, -0.3, -20); R.scene.add(apron);
  const pl2 = new THREE.PointLight('#FFE8C0', 10, 20, 1.2); pl2.position.set(0, 4, -12); R.scene.add(pl2);
  const seatM = M({ color: '#2E4E7A', roughness: 0.6 }), legM = M({ color: '#8A8E98', metalness: 0.6 });
  const seats = new THREE.Group(); R.scene.add(seats); seats.position.set(0, 0, -3.6);
  for (let i = 0; i < 5; i++) { const x = -2.4 + i * 1.2; add(seats, B(1.0, 0.12, 0.8, seatM), x, 0.5, 0); add(seats, B(1.0, 0.8, 0.12, seatM), x, 0.9, -0.42); add(seats, B(0.08, 0.5, 0.08, legM), x, 0.25, 0); }
  const fl = new THREE.PointLight('#F4F0FF', 8, 16, 1.2); fl.position.set(0, 4, -2); R.scene.add(fl);
  return { ...R, seats };
}

/** police video room: a wall of CCTV monitors (canvas screens) over a desk */
export function videoRoom(E, screenFn) {
  const R = WD.interior(E, { w: 8, depth: 6, h: 3.6, wall: '#3A4250', motif: '#424A58', floor: '#4A4A52', ceiling: '#22262E', signText: null, picture: false, counterOn: false, litter: false, bulbs: false });
  R.window.visible = false;
  const wallB = add(R.scene, B(8, 3.6, 0.1, M({ color: '#2A303C' })), 0, 1.8, -5.85);
  const screens = [];
  for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) { const cv = document.createElement('canvas'); cv.width = 320; cv.height = 240; const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace;
    const m = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 1.05), new THREE.MeshBasicMaterial({ map: tex, toneMapped: false })); m.position.set(-2.4 + c * 1.6, 0.95 + r * 1.2, -5.75); R.scene.add(m);
    const fr = add(R.scene, B(1.55, 1.2, 0.08, M({ color: '#15171C' })), -2.4 + c * 1.6, 0.95 + r * 1.2, -5.8); screens.push({ cv, g: cv.getContext('2d'), tex, i: r * 4 + c }); }
  const desk = add(R.scene, B(6, 0.12, 1.2, M({ map: WD.T.planks('#5A4030', [2, 1]) })), 0, 0.9, -4.4); add(R.scene, B(5.8, 0.85, 0.1, M({ color: '#3A2A20' })), 0, 0.45, -3.85);
  const glow = new THREE.PointLight('#9AD0FF', 12, 10, 1.3); glow.position.set(0, 2.2, -4.2); R.scene.add(glow);
  const update = (t) => screens.forEach((s) => { screenFn(s.g, 320, 240, t, s.i); s.tex.needsUpdate = true; });
  return { ...R, screens, update };
}

// ── 2D ──
/** grainy CCTV look over the whole frame + HUD */
export function cctvHud(t, stamp, { cam = 'CAM 03', rec = true, a = 1, desat = 0.75 } = {}) {
  ctx.save(); ctx.globalAlpha = a;
  ctx.globalCompositeOperation = 'saturation'; ctx.fillStyle = `rgba(0,0,0,${desat})`; ctx.fillRect(0, 0, 1080, 1920); ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = 'rgba(40,90,70,0.16)'; ctx.fillRect(0, 0, 1080, 1920);
  for (let y = 0; y < 1920; y += 6) { ctx.fillStyle = 'rgba(0,0,0,0.12)'; ctx.fillRect(0, y, 1080, 2); }
  for (let i = 0; i < 300; i++) { ctx.fillStyle = `rgba(255,255,255,${rnd(i + Math.floor(t * 24) * 7) * 0.12})`; ctx.fillRect(rnd(i * 3 + Math.floor(t * 24)) * 1080, rnd(i * 5 + Math.floor(t * 24) * 3) * 1920, 3, 3); }
  ctx.strokeStyle = 'rgba(255,255,255,0.85)'; ctx.lineWidth = 6; [[60, 200, 1], [1020, 200, -1]].forEach(([x, y, s]) => { ctx.beginPath(); ctx.moveTo(x, y + 80); ctx.lineTo(x, y); ctx.lineTo(x + s * 80, y); ctx.stroke(); });
  [[60, 1180, 1], [1020, 1180, -1]].forEach(([x, y, s]) => { ctx.beginPath(); ctx.moveTo(x, y - 80); ctx.lineTo(x, y); ctx.lineTo(x + s * 80, y); ctx.stroke(); });
  ctx.font = '700 46px "Courier New", monospace'; ctx.textBaseline = 'middle'; ctx.fillStyle = '#FFFFFF'; ctx.textAlign = 'left'; ctx.fillText(cam, 90, 250);
  if (rec && Math.sin(t * 6) > -0.3) { ctx.fillStyle = '#FF2A2A'; ctx.beginPath(); ctx.arc(820, 250, 16, 0, 7); ctx.fill(); ctx.fillStyle = '#FFFFFF'; ctx.fillText('REC', 850, 252); }
  ctx.textAlign = 'center'; ctx.font = '700 50px "Courier New", monospace'; ctx.fillStyle = '#FFFFFF'; ctx.fillText(stamp, 540, 1130);
  ctx.restore();
}
/** analog clock face, time in minutes past midnight */
export function clockFace(k, mins, { x = 540, y = 600, s = 1, label = '' } = {}) {
  if (k <= 0) return; const a = eob(clamp(k)) * s; ctx.save(); ctx.translate(x, y); ctx.scale(a, a);
  ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.beginPath(); ctx.arc(10, 14, 230, 0, 7); ctx.fill(); ctx.fillStyle = '#FFFDF4'; ctx.strokeStyle = INK; ctx.lineWidth = 14; ctx.beginPath(); ctx.arc(0, 0, 230, 0, 7); ctx.fill(); ctx.stroke();
  for (let i = 0; i < 12; i++) { const b = i / 12 * 6.283; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(Math.sin(b) * 180, -Math.cos(b) * 180); ctx.lineTo(Math.sin(b) * 210, -Math.cos(b) * 210); ctx.stroke(); }
  const hA = (mins / 720) * 6.283, mA = (mins % 60) / 60 * 6.283; ctx.lineCap = 'round'; ctx.lineWidth = 18; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.sin(hA) * 110, -Math.cos(hA) * 110); ctx.stroke();
  ctx.strokeStyle = '#E3262E'; ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.sin(mA) * 170, -Math.cos(mA) * 170); ctx.stroke(); ctx.fillStyle = INK; ctx.beginPath(); ctx.arc(0, 0, 18, 0, 7); ctx.fill();
  if (label) { ctx.font = '900 90px Inter'; ctx.textAlign = 'center'; ctx.lineWidth = 18; ctx.strokeStyle = INK; ctx.strokeText(label, 0, 320); ctx.fillStyle = '#FFD43B'; ctx.fillText(label, 0, 320); }
  ctx.restore();
}
/** case file card */
export function idCard(k, lines, { y = 560 } = {}) {
  if (k <= 0) return; const a = eob(clamp(k)); ctx.save(); ctx.translate(540, y); ctx.rotate(-0.04); ctx.scale(a, a);
  ctx.fillStyle = 'rgba(0,0,0,0.4)'; ctx.fillRect(-370, -200, 760, 420); ctx.fillStyle = '#E9DFC6'; ctx.strokeStyle = INK; ctx.lineWidth = 8; ctx.beginPath(); ctx.rect(-380, -210, 760, 420); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#C8283A'; ctx.fillRect(-380, -210, 760, 70); ctx.fillStyle = '#FFFFFF'; ctx.font = '900 46px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('MISSING PERSON', 0, -174);
  ctx.fillStyle = '#B9AE94'; ctx.fillRect(-340, -110, 220, 280); ctx.fillStyle = '#5A5246'; ctx.beginPath(); ctx.arc(-230, -10, 62, 0, 7); ctx.fill(); ctx.beginPath(); ctx.ellipse(-230, 150, 96, 80, 0, Math.PI, 0); ctx.fill();
  ctx.fillStyle = '#FFFFFF'; ctx.font = '900 110px Inter'; ctx.fillText('?', -230, -10);
  ctx.textAlign = 'left'; lines.forEach(([txt, at], i) => { const q = clamp((k - at) / 0.2); if (q <= 0) return; ctx.globalAlpha = q; ctx.fillStyle = i === 0 ? INK : '#3A3430'; ctx.font = i === 0 ? '900 58px Inter' : '800 46px Inter'; ctx.fillText(txt, -80, -70 + i * 80); ctx.globalAlpha = 1; });
  ctx.restore();
}
/** departure board */
export function board(k, rows, { y = 470, blink = 0 } = {}) {
  if (k <= 0) return; const a = eob(clamp(k)); ctx.save(); ctx.translate(540, y); ctx.scale(a, a);
  ctx.fillStyle = '#10131A'; ctx.strokeStyle = '#3A3E48'; ctx.lineWidth = 10; ctx.beginPath(); ctx.roundRect(-440, -170, 880, 120 + rows.length * 90, 20); ctx.fill(); ctx.stroke();
  ctx.font = '900 46px Inter'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillStyle = '#F2C230'; ctx.fillText('DEPARTURES', -400, -115);
  rows.forEach(([city, st, col], i) => { const yy = -30 + i * 90; ctx.fillStyle = '#1E232E'; ctx.fillRect(-410, yy - 36, 820, 72); ctx.font = '800 52px "Courier New", monospace'; ctx.fillStyle = '#FFFFFF'; ctx.fillText(city, -390, yy + 2);
    if (!(col && blink && Math.sin(blink * 10) < 0)) { ctx.fillStyle = col || '#7FE08A'; ctx.textAlign = 'right'; ctx.fillText(st, 390, yy + 2); ctx.textAlign = 'left'; } });
  ctx.restore();
}
/** missing poster */
export function poster2(k, { x = 540, y = 640, rot = 0.03 } = {}) {
  if (k <= 0) return; const a = eob(clamp(k)); ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(a, a);
  ctx.fillStyle = 'rgba(0,0,0,0.4)'; ctx.fillRect(-300, -380, 620, 780); ctx.fillStyle = '#F4F0E4'; ctx.strokeStyle = INK; ctx.lineWidth = 8; ctx.beginPath(); ctx.rect(-310, -390, 620, 780); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#C8283A'; ctx.font = '900 120px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('MISSING', 0, -300);
  ctx.fillStyle = '#C8C0AC'; ctx.fillRect(-180, -220, 360, 380); ctx.fillStyle = '#6A6256'; ctx.beginPath(); ctx.arc(0, -70, 90, 0, 7); ctx.fill(); ctx.beginPath(); ctx.ellipse(0, 160, 150, 110, 0, Math.PI, 0); ctx.fill();
  ctx.fillStyle = INK; ctx.font = '900 52px Inter'; ctx.fillText('SINCE APRIL 2006', 0, 220); ctx.font = '700 38px Inter'; ctx.fillStyle = '#5A5246'; ctx.fillText('COLUMBUS, OHIO', 0, 290); ctx.fillText('HAVE YOU SEEN HIM?', 0, 340);
  ctx.restore();
}
