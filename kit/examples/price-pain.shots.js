// YOUR BRAIN FEELS PRICES LIKE PAIN (Knutson et al. 2007, Neuron, "Neural predictors of purchases") — Tall Tale 3D, US audience, Black Friday.
// Generic toons, invented products, no brands. Brain drawn in code (cartoon, not medical imagery).
import * as THREE from 'three';
import { ctx, clamp, lerp, eo, eio, eob, rnd } from './core/lib.js';
import { L, Le, Wd, T } from './core/timing.js';
import * as WD from './core/world.js';
import { Toon, PROPS, INK } from './core/toon.js';
import { V3, talk, blink, hook, ribbon, pill, stamp, counter, chartCard, confetti, flash, tint, speedLines, stars, mark, subscribe, makeShoot, LK } from './jh.js';

const LOOKS = {
  shop: { body: '#E8734A', pattern: 'stripes', patCol: '#F2C230', hat: 'beanie', hatCol: '#2E8A5A', extra: ['freckles'] },
  sci: { body: '#F4EFE4', pattern: 'apron', patCol: '#FFFFFF', hat: 'bun', hatCol: '#3A2A22', neck: 'collar', neckCol: '#3C6FB6', extra: ['glasses'] },
  c1: { body: '#5C8FD6', hat: 'cap', hatCol: '#D8343F', neck: 'none' },
  c2: { body: '#8C6FC9', hat: 'flower', hatCol: '#F2B8C6', neck: 'collar' },
  c3: { body: '#4FB3A9', hat: 'none', neck: 'scarf', neckCol: '#F2C230', extra: ['glasses'] },
};
const mk = (k, o) => new Toon({ ...LOOKS[k], extra: [...(LOOKS[k].extra || [])] }, o);
const bags = (g, x, y) => { [['#D8343F', -30], ['#F2C230', 10], ['#3C6FB6', 44]].forEach(([c, dx], i) => { g.save(); g.translate(x + dx, y + 10 - i * 6); g.strokeStyle = INK; g.lineWidth = 5; g.fillStyle = c; g.beginPath(); g.rect(-26, -10, 52, 60); g.fill(); g.stroke(); g.beginPath(); g.arc(0, -10, 14, Math.PI, 0); g.stroke(); g.restore(); }); };
const TAG999 = function tag999(g, x, y) { g.save(); g.translate(x, y - 90); g.rotate(-0.12); g.strokeStyle = INK; g.lineWidth = 7; g.fillStyle = '#FFFDF4'; g.beginPath(); g.moveTo(-110, -60); g.lineTo(80, -60); g.lineTo(130, 0); g.lineTo(80, 60); g.lineTo(-110, 60); g.closePath(); g.fill(); g.stroke(); g.beginPath(); g.arc(90, 0, 10, 0, 7); g.stroke(); g.fillStyle = '#D8343F'; g.font = '900 64px Inter'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('$999', -20, 4); g.restore(); };

// ── 2D cartoon brain (side view, facing right) with glow spots ──
function brain(x, y, s, k, { reward = 0, insula = 0, t = 0 } = {}) {
  if (k <= 0) return; const a = eob(clamp(k)); ctx.save(); ctx.translate(x, y); ctx.scale(s * a, s * a);
  ctx.fillStyle = 'rgba(14,18,40,0.88)'; ctx.strokeStyle = '#7FE0FF'; ctx.lineWidth = 6; ctx.beginPath(); ctx.roundRect(-300, -250, 600, 500, 40); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#F4A6B8'; ctx.strokeStyle = INK; ctx.lineWidth = 10;
  ctx.beginPath(); ctx.moveTo(-200, 40); ctx.bezierCurveTo(-260, -60, -200, -190, -60, -190); ctx.bezierCurveTo(40, -230, 200, -170, 220, -60); ctx.bezierCurveTo(260, 20, 220, 90, 140, 90);
  ctx.bezierCurveTo(90, 120, 20, 110, -10, 90); ctx.bezierCurveTo(-60, 120, -170, 120, -200, 40); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#E8889E'; ctx.beginPath(); ctx.moveTo(-40, 90); ctx.quadraticCurveTo(-30, 180, 10, 200); ctx.lineTo(40, 190); ctx.quadraticCurveTo(10, 150, 30, 95); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.ellipse(-120, 100, 70, 40, 0.1, 0, 7); ctx.fill(); ctx.stroke();
  ctx.strokeStyle = '#C9607A'; ctx.lineWidth = 7; ctx.lineCap = 'round';
  [[-170, -40, -100, -120, -30, -80], [-60, -170, 0, -110, 60, -160], [90, -150, 60, -80, 150, -60], [-150, 30, -60, -10, 0, 40], [40, -40, 110, 0, 190, -20], [-40, -60, 20, -20, 60, -60]].forEach(([a1, b1, a2, b2, a3, b3]) => { ctx.beginPath(); ctx.moveTo(a1, b1); ctx.quadraticCurveTo(a2, b2, a3, b3); ctx.stroke(); });
  const glow = (gx, gy, col, v) => { if (v <= 0) return; const p = 0.8 + 0.2 * Math.sin(t * 14); const r = 90 * v * p; const gr = ctx.createRadialGradient(gx, gy, 4, gx, gy, r); gr.addColorStop(0, col); gr.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(gx, gy, r, 0, 7); ctx.fill(); ctx.fillStyle = '#FFFFFF'; ctx.beginPath(); ctx.arc(gx, gy, 14 * v, 0, 7); ctx.fill(); };
  glow(90, 20, 'rgba(80,255,140,0.95)', reward); glow(-10, -30, 'rgba(255,60,60,0.95)', insula);
  if (insula > 0.5) { ctx.strokeStyle = '#FFD43B'; ctx.lineWidth = 9; for (let i = 0; i < 6; i++) { const an = i / 6 * 6.283 + t * 2; const r0 = 70, r1 = 140 + 20 * Math.sin(t * 20 + i); ctx.beginPath(); ctx.moveTo(-10 + Math.cos(an) * r0, -30 + Math.sin(an) * r0); ctx.lineTo(-10 + Math.cos(an + 0.15) * (r0 + r1) / 2, -30 + Math.sin(an + 0.15) * (r0 + r1) / 2); ctx.lineTo(-10 + Math.cos(an) * r1, -30 + Math.sin(an) * r1); ctx.stroke(); } }
  ctx.restore();
}
function heart(x, y, k) { if (k <= 0 || k > 1) return; ctx.save(); ctx.translate(x, y - k * 260); ctx.globalAlpha = 1 - k; const s = eob(clamp(k * 3)); ctx.scale(s, s); ctx.fillStyle = '#E3262E'; ctx.strokeStyle = INK; ctx.lineWidth = 7;
  ctx.beginPath(); ctx.moveTo(0, 30); ctx.bezierCurveTo(-60, -10, -40, -60, 0, -30); ctx.bezierCurveTo(40, -60, 60, -10, 0, 30); ctx.fill(); ctx.stroke(); ctx.restore(); }
function bolt(x, y, s, rot) { if (s <= 0) return; ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s); ctx.fillStyle = '#FFD43B'; ctx.strokeStyle = INK; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(-10, -70); ctx.lineTo(30, -70); ctx.lineTo(8, -10); ctx.lineTo(36, -10); ctx.lineTo(-24, 80); ctx.lineTo(-6, 10); ctx.lineTo(-34, 10); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore(); }
function buyBtn(k, pressed, glowK, x = 540, y = 820) { if (k <= 0) return; const a = eob(clamp(k)); ctx.save(); ctx.translate(x, y); ctx.scale(0.8, 0.8); ctx.scale(a, a); if (glowK > 0) { ctx.shadowColor = '#7FFFA0'; ctx.shadowBlur = 60 * glowK; }
  const s = pressed ? 0.9 : 1; ctx.scale(s, s); ctx.fillStyle = pressed ? '#1E8A44' : '#2FB35A'; ctx.strokeStyle = INK; ctx.lineWidth = 10; ctx.beginPath(); ctx.roundRect(-230, -90, 460, 180, 90); ctx.fill(); ctx.stroke(); ctx.shadowBlur = 0;
  ctx.fillStyle = '#FFFFFF'; ctx.font = '900 96px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('BUY', 0, 6); ctx.restore(); }

export function buildShots(E) {
  const S = [], CUES = [], add = (o) => (S.push(o), o), cue = (t, type, o = {}) => CUES.push({ t: +Math.max(0, t).toFixed(3), type, ...o });
  const cut = (i) => (i === 0 ? 0 : L(i) - 0.06);
  const { shoot } = makeShoot(E);
  const shake = (t, t0, a = 0.08) => { const k = t - t0; if (k < 0 || k > 0.35) return V3(0, 0, 0); const f = (1 - k / 0.35) * a; return V3(Math.sin(k * 90) * f, Math.cos(k * 70) * f, 0); };

  // ── STORE (Black Friday sale) ──
  const R = WD.interior(E, { w: 10, depth: 8, h: 4.4, wall: '#2E5A8A', motif: '#3C6FB6', floor: '#B07A48', ceiling: '#1F3A5A', signText: 'BLACK FRIDAY SALE', picture: false, counterOn: false, litter: false });
  R.sun.key.target.position.set(0, 0, -3); R.sun.key.position.set(2, 6, 1);
  const shelfM = WD.mat({ color: '#E9E2D0' });
  [-1, 1].forEach((side) => { for (let r = 0; r < 3; r++) { const sh = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.08, 0.5), shelfM); sh.position.set(side * 3.3, 0.5 + r * 0.8, -7.6); R.scene.add(sh);
    for (let i = 0; i < 7; i++) { const h = 0.35 + rnd(side * 9 + r * 30 + i) * 0.25; const b = new THREE.Mesh(new THREE.BoxGeometry(0.3, h, 0.36), WD.mat({ color: ['#D8343F', '#F2C230', '#2FB35A', '#E8734A', '#8C6FC9'][(i + r) % 5] })); b.position.set(side * 3.3 - 1.1 + i * 0.36, 0.54 + r * 0.8 + h / 2, -7.6); b.castShadow = true; R.scene.add(b); } } });
  // pedestal with the shiny product (a big gift box) + a hanging 3D price tag
  const ped = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.5, 0.9, 24), WD.mat({ color: '#F4EFE4' })); ped.position.set(1.0, 0.45, -4.2); ped.castShadow = true; R.scene.add(ped);
  const gift = new THREE.Group(); const gb = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.5, 0.6), WD.mat({ color: '#D8343F' })); gift.add(gb);
  const rib1 = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.52, 0.1), WD.mat({ color: '#F2C230' })); gift.add(rib1); const rib2 = rib1.clone(); rib2.rotation.y = Math.PI / 2; gift.add(rib2);
  gift.position.set(1.0, 1.15, -4.2); gift.children.forEach((m) => (m.castShadow = true)); R.scene.add(gift);
  const tagTex = (txt, col) => WD.canvasTex('tag' + txt, 512, 256, (c) => { c.fillStyle = col; c.strokeStyle = INK; c.lineWidth = 14; c.beginPath(); c.moveTo(20, 20); c.lineTo(400, 20); c.lineTo(492, 128); c.lineTo(400, 236); c.lineTo(20, 236); c.closePath(); c.fill(); c.stroke(); c.fillStyle = '#D8343F'; c.font = '900 130px Inter'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(txt, 220, 135); });
  const tags = { q: tagTex('$ ?', '#FFFDF4'), hi: tagTex('$999', '#FFFDF4'), lo: tagTex('-50%', '#F2C230') };
  const tagM = new THREE.MeshStandardMaterial({ map: tags.q, roughness: 0.8, side: THREE.DoubleSide }); const tag = new THREE.Mesh(new THREE.PlaneGeometry(0.7, 0.35), tagM);
  const tagP = new THREE.Group(); tagP.position.set(1.0, 1.42, -3.86); tag.position.set(0.3, -0.25, 0); tagP.add(tag); R.scene.add(tagP);
  const setTag = (k) => { if (tagM.map !== tags[k]) { tagM.map = tags[k]; tagM.needsUpdate = true; } };
  const shopper = mk('shop'), sci = mk('sci'), c1 = mk('c1', { res: 1 }), c2 = mk('c2', { res: 1 }), c3 = mk('c3', { res: 1 });
  const castR = [shopper, c1, c2, c3]; castR.forEach((p) => R.scene.add(p.group));
  const onlyR = (...keep) => castR.forEach((p) => (p.group.visible = keep.includes(p)));
  const resetR = () => { tagP.rotation.set(0, 0, 0); gift.rotation.y = 0.4; ped.visible = gift.visible = tagP.visible = true; };

  // ── LAB (scanner + monitor) ──
  const LB = WD.interior(E, { w: 10, depth: 8, h: 4.2, wall: '#DDE6EE', motif: '#C9D6E2', floor: '#8A9AAA', ceiling: '#AEBBC8', signText: null, picture: false, counterOn: false, litter: false, bulbs: false });
  LB.sun.key.target.position.set(0, 0, -4); LB.sun.key.position.set(-3, 7, 1);
  const scan = new THREE.Group(); const wh = WD.mat({ color: '#F4F6F8', roughness: 0.4 });
  const body = new THREE.Mesh(new THREE.BoxGeometry(2.8, 2.6, 1.4), wh); body.position.y = 1.3; scan.add(body);
  const ringM = WD.mat({ color: '#3C6FB6', emissive: '#3C6FB6', emissiveIntensity: 0 });
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.62, 0.12, 16, 40), ringM); ring.position.set(0, 1.3, 0.72); scan.add(ring);
  const hole = new THREE.Mesh(new THREE.CircleGeometry(0.6, 40), new THREE.MeshBasicMaterial({ color: '#1A2030' })); hole.position.set(0, 1.3, 0.71); scan.add(hole);
  const bed = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.14, 2.0), WD.mat({ color: '#9FB8D0' })); bed.position.set(0, 0.95, 1.6); scan.add(bed);
  const leg = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.9, 0.5), wh); leg.position.set(0, 0.45, 1.9); scan.add(leg);
  scan.children.forEach((m) => (m.castShadow = true)); scan.position.set(-1.6, 0, -5.2); LB.scene.add(scan);
  const stripe = new THREE.Mesh(new THREE.BoxGeometry(2.82, 0.16, 1.42), WD.mat({ color: '#3C6FB6' })); stripe.position.set(-1.6, 2.2, -5.2); LB.scene.add(stripe);
  const mon = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.0, 0.1), WD.mat({ color: '#2A2E36' })); mon.position.set(2.0, 1.9, -6.0); LB.scene.add(mon);
  const scr = new THREE.Mesh(new THREE.PlaneGeometry(1.44, 0.86), new THREE.MeshBasicMaterial({ color: '#7FE0FF' })); scr.position.set(2.0, 1.9, -5.94); LB.scene.add(scr);
  const stand = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.4, 0.12), WD.mat({ color: '#5A6070' })); stand.position.set(2.0, 0.7, -6.0); LB.scene.add(stand);
  LB.scene.add(sci.group);

  // ═══ SHOTS ═══
  // 1a · frame 0: shopper holding a giant $999 tag, shocked, lightning around the head; hook PRICE = PAIN?
  { const st = 0, wp = Wd('pain.', 0);
    add({ id: 'S01a', at: st, note: 'frame 0: low push-in on the shocked shopper in a Black Friday store holding a giant $999 tag, yellow pain bolts around the head; hook PRICE = PAIN?', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); onlyR(shopper); resetR(); setTag('hi');
      shopper.at(-0.6, 0, -2.6); shopper.set({ mood: 'shock', sweat: 1, armR: [150, -10], holdR: TAG999, v: 'tag', armL: [120, -120], lean: -6, blink: 0 });
      shoot(R.scene, castR, V3(-0.2, 1.1, 0.9), V3(-0.4, 1.3, 0.1), V3(-0.6, 1.4, -2.6), null, k, { ...LK.room, fov: 52 }, undefined, lerp(-0.06, 0.04, k));
      blit(); hook(['PRICE', '= PAIN?'], 1, { y: 300, size: 140, hiLine: 1 }); [[330, 560, -0.4], [760, 540, 0.4], [700, 700, 0.8]].forEach(([x, y, r], i) => bolt(x, y, 0.9 + 0.15 * Math.sin(t * 20 + i), r + Math.sin(t * 9 + i) * 0.1));
    } });
    cue(0, 'slam', { gain: 0.6 }); }
  // 1b · "like pain." punch-in, red tint, stamp OUCH!
  { const st = Wd('like', 0) - 0.05, wp = Wd('pain.', 0);
    add({ id: 'S01b', at: st, note: 'punch-in close on the shopper grabbing his head with both hands, red tint, stars spin, stamp OUCH!', draw(lt, d, t, blit) {
      const k = eo(clamp(lt / d)); onlyR(shopper); resetR(); setTag('hi');
      shopper.at(-0.6, 0, -2.6); shopper.set({ mood: 'worried', tears: 1, armR: [150, -150], armL: [150, -150], lean: 4, blink: 0 });
      shoot(R.scene, castR, V3(-0.4, 1.5, -0.2).add(shake(t, wp)), V3(-0.5, 1.55, -0.8), V3(-0.6, 1.5, -2.6), null, k, { ...LK.room, fov: 50 }, undefined, 0.1);
      blit(); tint(1, '#E3262E'); stars(540, 560, (t - st) / 0.6); stamp(['OUCH!'], (t - wp) / 0.2, { y: 380, size: 120, col: '#E3262E' });
    } });
    cue(wp, 'stamp', { gain: 0.7 }); }

  // 2a · "In 2007, Stanford scientists" lab: scientist walks in past the scanner; ribbon STANFORD, 2007
  { const st = cut(1), w7 = Wd('two', 1);
    add({ id: 'S02a', at: st, note: 'whip into a white lab: a scientist with glasses walks past a big brain scanner, paper in hand; ribbon STANFORD, 2007', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); scr.material.color.set('#7FE0FF');
      sci.at(lerp(1.6, 0.6, eo(clamp(lt / 1.0))), 0, -3.0); sci.set({ mood: 'smug', legs: lt < 1.0 ? 'walk' : 'stand', phase: t * 7, armR: [110, -60], holdR: PROPS.paper('DATA'), v: 'p', armL: [20, 10], blink: blink(t) });
      shoot(LB.scene, [sci], V3(2.6, 1.6, 1.2), V3(1.6, 1.7, 0.6), V3(-0.4, 1.4, -4.2), null, k, { ...LK.room, fov: 52 });
      blit(); if (lt < 0.18) speedLines(1 - lt / 0.18, 3); ribbon('STANFORD, 2007', (t - w7) / 0.3, 330, 80);
    } });
    cue(st, 'whoosh', { gain: 0.5 }); cue(w7 + 0.2, 'stamp', { gain: 0.6 }); }
  // 2b · "scanned people's brains" push toward the scanner; brain card pops
  { const st = Wd('scanned', 1) - 0.1, wb = Wd('brains', 1);
    add({ id: 'S02b', at: st, note: 'slow push toward the scanner opening, blue ring pulses; cartoon brain card pops up; pill BRAIN SCANNER', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); ringM.emissiveIntensity = 0.5 + 0.5 * Math.sin(t * 10);
      sci.at(0.6, 0, -3.0); sci.set({ mood: 'happy', armL: [95, 0], armR: [20, 10], look: [-0.6, 0], blink: blink(t) });
      shoot(LB.scene, [sci], V3(-0.4, 1.5, 0.8), V3(-1.2, 1.4, -1.0), V3(-1.6, 1.3, -4.5), null, k, { ...LK.room, fov: 50 });
      ringM.emissiveIntensity = 0;
      blit(); pill('BRAIN SCANNER', (t - st) / 0.25, 250, 'rgba(31,28,51,0.9)', 58); brain(540, 640, 0.7, (t - st - 0.3) / 0.3, { t });
    } });
    cue(st, 'slide', { dur: 0.5, gain: 0.4 }); cue(wb, 'pop', { gain: 0.6 }); }
  // 2c · "while they shopped." the monitor: products sliding by
  { const st = Wd('while', 1) - 0.1, wsh = Wd('shopped.', 1);
    add({ id: 'S02c', at: st, note: 'over the scientist\'s shoulder to the monitor: product cards slide across an on-screen shop window', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); scr.material.color.set('#BFF0FF');
      sci.at(-0.3, 0, -4.6); sci.set({ mood: 'neutral', armL: [20, 10], armR: [60, -60], look: [0.5, 0.3], blink: blink(t) });
      shoot(LB.scene, [sci], V3(0.2, 1.8, -1.2), V3(0.8, 1.9, -2.6), V3(2.0, 1.8, -6.0), null, k, { ...LK.room, fov: 48 });
      blit(); ctx.save(); ctx.fillStyle = 'rgba(14,18,40,0.9)'; ctx.strokeStyle = '#F2C230'; ctx.lineWidth = 8; ctx.beginPath(); ctx.roundRect(110, 440, 860, 420, 30); ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.rect(120, 450, 840, 400); ctx.clip();
      ['#D8343F', '#2FB35A', '#F2C230', '#8C6FC9', '#E8734A'].forEach((c, i) => { const x = 980 - ((lt * 520 + i * 240) % 1200); ctx.fillStyle = '#FFFDF4'; ctx.strokeStyle = INK; ctx.lineWidth = 6; ctx.beginPath(); ctx.roundRect(x, 500, 200, 300, 20); ctx.fill(); ctx.stroke(); ctx.fillStyle = c; ctx.beginPath(); ctx.roundRect(x + 30, 530, 140, 150, 14); ctx.fill(); ctx.stroke(); ctx.fillStyle = INK; ctx.font = '900 40px Inter'; ctx.textAlign = 'center'; ctx.fillText('$' + (20 + i * 35), x + 100, 750); });
      ctx.restore(); pill('SHOPPING IN A SCANNER', (t - wsh) / 0.25, 960, 'rgba(31,28,51,0.9)', 48);
    } });
    cue(st, 'whoosh', { gain: 0.4 }); cue(wsh, 'ding', { gain: 0.5 }); }

  // 3 · "First, they saw something they wanted," shopper walks to the gift; hearts
  { const st = cut(2), ww = Wd('wanted,', 2);
    add({ id: 'S03', at: st, note: 'store: the shopper walks up to a red gift on a pedestal and reaches for it, dreamy; hearts float up; sparkle', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); onlyR(shopper); resetR(); setTag('q'); tagP.rotation.z = Math.sin(t * 3) * 0.1; gift.rotation.y = t * 0.8;
      shopper.at(lerp(-1.6, -0.5, eo(clamp(lt / 1.2))), 0, -3.6); shopper.set({ mood: 'happy', legs: lt < 1.2 ? 'walk' : 'stand', phase: t * 7, armR: [lt > 1.0 ? 90 : 30, -10], armL: [20, 10], look: [0.7, 0], blink: blink(t) });
      shoot(R.scene, castR, V3(1.3, 1.5, -0.2), V3(0.7, 1.5, -0.8), V3(-0.3, 1.3, -3.8), null, k, { ...LK.room, fov: 56 });
      blit(); for (let i = 0; i < 4; i++) heart(400 + i * 90, 760, ((t - st) * 0.8 + i * 0.25) % 1.2); stars(640, 640, (t - ww) / 0.7);
    } });
    cue(st, 'whoosh', { gain: 0.4 }); cue(ww, 'sparkle', { gain: 0.6 }); }
  // 4 · "and a reward spot deep in the brain lit up." brain card, green spot
  { const st = cut(3), wr = Wd('reward', 3), wl = Wd('lit', 3);
    add({ id: 'S04', at: st, note: 'the shopper laughing behind a big brain card: a green reward spot glows brighter and pulses; pill REWARD SPOT; confetti on "lit"', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); onlyR(shopper); resetR(); setTag('q');
      shopper.at(-0.5, 0, -3.6); shopper.set({ mood: 'laugh', armR: [90, -10], armL: [120, -60], look: [0.7, 0], blink: blink(t) });
      shoot(R.scene, castR, V3(-0.1, 1.75, -0.4), V3(-0.3, 1.75, -0.9), V3(-0.5, 1.7, -3.6), null, k, { ...LK.room, fov: 50 });
      blit(); const g = clamp((t - wr) / 0.5) * 0.6 + clamp((t - wl) / 0.3) * 0.6; brain(540, 520, lerp(0.66, 0.72, k), (t - st) / 0.3, { reward: g, t }); pill('REWARD SPOT', (t - wr) / 0.25, 240, 'rgba(30,140,70,0.95)', 64);
      if (t > wl) confetti(t, wl, 30);
    } });
    cue(st, 'pop', { gain: 0.5 }); cue(wl, 'sparkle', { gain: 0.7 }); }

  // 5 · "Then they saw the price." tag spins; counter ticks up
  { const st = cut(4), wp = Wd('price.', 4);
    add({ id: 'S05', at: st, note: 'close on the hanging tag as it spins around; a counter ticks up fast to $999; the shopper leans in behind it', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); onlyR(shopper); resetR(); setTag(lt > 0.4 ? 'hi' : 'q'); tagP.rotation.y = lerp(Math.PI * 2, 0, eo(clamp(lt / 0.8)));
      shopper.at(-0.4, 0, -3.5); shopper.set({ mood: 'worried', lean: 10, armR: [30, -10], armL: [20, 10], look: [0.7, 0.2], blink: blink(t) });
      shoot(R.scene, castR, V3(1.9, 1.6, -2.2), V3(1.6, 1.5, -2.7), V3(1.1, 1.2, -3.9), null, k, { ...LK.room, fov: 48 });
      blit(); counter('$' + Math.round(lerp(0, 999, eo(clamp((t - st) / 1.1)))), (t - st) / 0.25, 'THE PRICE', 300, 640);
    } });
    cue(st, 'zip', { dur: 1.0, gain: 0.5 }); cue(wp, 'tock', { gain: 0.5 }); }
  // 6a · "Too high," stamp with shake, shopper jumps back
  { const st = cut(5), wh2 = Wd('high,', 5);
    add({ id: 'S06a', at: st, note: 'wide Dutch angle: the shopper jumps back from the pedestal in shock, $999 tag swinging; stamp TOO HIGH! with a camera shake', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); onlyR(shopper); resetR(); setTag('hi'); tagP.rotation.z = Math.sin(t * 9) * 0.3 * (1 - k);
      shopper.at(lerp(-0.5, -1.4, eo(clamp(lt / 0.4))), 0, -3.4); shopper.set({ mood: 'shock', legs: lt < 0.4 ? 'jump' : 'stand', phase: clamp(lt / 0.4), armR: [150, 20], armL: [150, 20], lean: -10, blink: 0 });
      shoot(R.scene, castR, V3(0.2, 1.3, 1.0).add(shake(t, wh2)), V3(-0.1, 1.4, 0.4), V3(-0.3, 1.2, -3.8), null, k, { ...LK.room, fov: 54 }, undefined, -0.14);
      blit(); stamp(['TOO HIGH!'], (t - wh2) / 0.2, { y: 380, size: 110, col: '#E3262E' });
    } });
    cue(wh2, 'slam', { gain: 0.8 }); }
  // 6b · "and the insula fired," brain card, red spot
  { const st = Wd('and', 5) - 0.1, wi = Wd('insula', 5);
    add({ id: 'S06b', at: st, note: 'brain card over a red-tinted store: a red spot in the middle of the brain flares with yellow sparks; pill THE INSULA', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); onlyR(shopper); resetR(); setTag('hi');
      shopper.at(-1.4, 0, -3.4); shopper.set({ mood: 'worried', sweat: 1, armR: [150, -150], armL: [40, 0], blink: blink(t) });
      shoot(R.scene, castR, V3(-0.6, 1.75, 0.4), V3(-0.9, 1.75, -0.2), V3(-1.4, 1.7, -3.4), null, k, { ...LK.room, fov: 50 });
      blit(); tint(clamp((t - wi) / 0.3), '#E3262E'); brain(540, 520, lerp(0.72, 0.66, k), (t - st) / 0.25, { insula: clamp((t - wi) / 0.3), t }); pill('THE INSULA', (t - wi) / 0.25, 240, 'rgba(200,40,50,0.95)', 64);
    } });
    cue(wi, 'zip', { dur: 0.4, gain: 0.6 }); }
  // 6c · "an area linked to pain." high angle slump
  { const st = Wd('area', 5) - 0.3, wp = Wd('pain.', 5);
    add({ id: 'S06c', at: st, note: 'high angle: the shopper slumps holding his head, tears, stars circling; pill LINKED TO PAIN', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); onlyR(shopper); resetR(); setTag('hi');
      shopper.at(-1.4, 0, -3.4); shopper.set({ mood: 'sad', tears: 1, armR: [150, -150], armL: [150, -150], lean: 6, blink: 0 });
      shoot(R.scene, castR, V3(-1.2, 3.4, -0.4), V3(-1.3, 3.0, -1.0), V3(-1.4, 1.0, -3.4), null, k, { ...LK.room, fov: 50 });
      blit(); tint(0.8, '#E3262E'); stars(540, 640, ((t - st) * 1.2) % 1); pill('LINKED TO PAIN', (t - wp + 0.3) / 0.25, 300, 'rgba(200,40,50,0.95)', 64);
    } });
    cue(wp, 'thud', { gain: 0.6 }); }

  // 7 · subscribe
  { const st = cut(6);
    add({ id: 'S07', at: st, note: 'lab: the scientist turns to the viewer and points, grinning; SUBSCRIBE button pressed', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); scr.material.color.set('#7FE0FF');
      sci.at(0.4, 0, -2.6); sci.set({ mood: 'happy', armR: [95, 0], armL: [20, 10], talk: talk(t), blink: blink(t) });
      shoot(LB.scene, [sci], V3(1.0, 1.5, 0.6), V3(0.7, 1.5, -0.1), V3(0.3, 1.4, -2.6), null, k, { ...LK.room, fov: 50 });
      blit(); subscribe(lt / 0.45 + (lt > 0.8 ? (lt - 0.8) * 1.4 : 0), t, 330);
    } });
    cue(st, 'pop', { gain: 0.6 }); cue(st + 1.25, 'ding', { gain: 0.6 }); }

  // 8 · "The scans could even predict what people would buy," chart
  { const st = cut(7), wp = Wd('predict', 7), wb = Wd('buy,', 7);
    add({ id: 'S08', at: st, note: 'orbit past the scanner to the monitor; a green prediction chart draws itself; stamp PREDICTED', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); scr.material.color.set('#BFF0FF');
      sci.at(0.7, 0, -4.4); sci.set({ mood: 'proud', armL: [130, -20], armR: [20, 10], look: [0.6, 0.2], blink: blink(t) });
      const a = lerp(-0.5, 0.2, k), cp = V3(0.6 + Math.sin(a) * 3.6, 1.7, -4.6 + Math.cos(a) * 3.6); shoot(LB.scene, [sci], cp, cp, V3(1.0, 1.6, -5.2), null, 0, { ...LK.room, fov: 50 });
      blit(); chartCard([[0, 0.1], [0.2, 0.25], [0.4, 0.35], [0.6, 0.55], [0.8, 0.7], [1, 0.9]], (t - st) / 1.4, { y: 600, title: 'BRAIN SCAN SAYS...', labels: [[5, 'BUY', '#2FB35A']] });
      stamp(['PREDICTED'], (t - wb) / 0.2, { y: 980, size: 80, col: '#2FB35A' });
    } });
    cue(st, 'slide', { dur: 0.6, gain: 0.4 }); cue(wp, 'pop', { gain: 0.5 }); cue(wb, 'stamp', { gain: 0.6 }); }
  // 9 · "before they pressed the button." BUY button
  { const st = cut(8), wbn = Wd('button.', 8), wpr = Wd('pressed', 8);
    add({ id: 'S09', at: st, note: 'the shopper reaches toward a giant green BUY button; a small brain icon glows green BEFORE the press; press on "button"', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); onlyR(shopper); resetR(); setTag('hi');
      shopper.at(0.2, 0, -3.0); shopper.set({ mood: 'sly', armR: [lerp(40, 95, k), -10], armL: [20, 10], lean: 8, blink: blink(t) });
      shoot(R.scene, castR, V3(-0.3, 1.3, 0.6), V3(-0.1, 1.4, -0.2), V3(1.0, 1.5, -3.0), null, k, { ...LK.room, fov: 52 }, undefined, 0.08);
      blit(); const pressed = t > wbn; buyBtn((t - st) / 0.25, pressed, clamp((t - st - 0.3) / 0.3), 780, 900);
      brain(800, 640, 0.32, (t - st - 0.2) / 0.25, { reward: clamp((t - st - 0.3) / 0.3), t });
      if (pressed) stars(780, 900, (t - wbn) / 0.5); pill('BRAIN DECIDES FIRST', (t - wpr) / 0.25, 260, 'rgba(30,140,70,0.95)', 50);
    } });
    cue(st, 'pop', { gain: 0.5 }); cue(wbn, 'ding', { gain: 0.7 }); }

  // 10a · "So this Black Friday," shoppers rush
  { const st = cut(9), wb = Wd('black', 9);
    add({ id: 'S10a', at: st, note: 'wide crane-down: three shoppers rush across the store with bags, speed lines; ribbon BLACK FRIDAY', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); onlyR(c1, c2, c3); resetR(); setTag('lo'); ped.visible = gift.visible = tagP.visible = false;
      [c1, c2, c3].forEach((p, i) => { p.at(lerp(-1.2, 1.0, clamp(lt / d)) + [0, -1.1, 1.1][i], 0, [-2.6, -3.7, -5.4][i]); p.set({ mood: i === 1 ? 'laugh' : 'happy', legs: 'run', phase: t * 11 + i, armL: [70, -50], holdL: bags, v: 'b' + i, armR: [40, -20], lean: 8 }); });
      shoot(R.scene, castR, V3(0, 3.4, 1.4), V3(0, 2.0, 1.0), V3(0, 1.0, -3.6), null, k, { ...LK.room, fov: 56 });
      blit(); speedLines(0.6, Math.floor(t * 8)); ribbon('BLACK FRIDAY', (t - wb) / 0.3, 330, 90);
    } });
    cue(st, 'whoosh', { gain: 0.5 }); cue(wb + 0.1, 'stamp', { gain: 0.6 }); }
  // 10b · "when a deal feels amazing," tag flips to -50%
  { const st = Wd('when', 9) - 0.1, wd = Wd('deal', 9), wa = Wd('amazing,', 9);
    add({ id: 'S10b', at: st, note: 'the tag flips to a yellow -50%; the shopper laughs and jumps with arms up; confetti; pill 50% OFF!', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); onlyR(shopper); resetR(); setTag(t > wd ? 'lo' : 'hi'); tagP.rotation.z = Math.sin(t * 6) * 0.15;
      shopper.at(-0.4, 0, -3.3); shopper.set({ mood: t > wd ? 'laugh' : 'smug', legs: t > wa ? 'jump' : 'stand', phase: clamp((t - wa) * 2), armR: [150, 0], armL: [150, 0], blink: blink(t) });
      shoot(R.scene, castR, V3(1.2, 1.4, -0.2), V3(0.8, 1.4, -0.7), V3(-0.2, 1.4, -3.5), null, k, { ...LK.room, fov: 54 });
      blit(); confetti(t, wd, 60); pill('50% OFF!', (t - wd) / 0.25, 300, 'rgba(30,140,70,0.95)', 72);
    } });
    cue(wd, 'sparkle', { gain: 0.7 }); }
  // 10c · "remember," loop back to frame 0
  { const st = Wd('remember,', 9) - 0.15;
    add({ id: 'S10c', at: st, note: 'loop: snap back to the frame-0 shot: shocked shopper with the giant $999 tag, pain bolts; hook PRICE = PAIN? returns', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); onlyR(shopper); resetR(); setTag('hi');
      shopper.at(-0.6, 0, -2.6); shopper.set({ mood: 'shock', sweat: 1, armR: [150, -10], holdR: TAG999, v: 'tag', armL: [120, -120], lean: -6, blink: 0 });
      shoot(R.scene, castR, V3(0.0, 1.0, 1.4), V3(-0.2, 1.1, 0.9), V3(-0.6, 1.4, -2.6), null, k, { ...LK.room, fov: 52 }, undefined, -0.06);
      blit(); if (lt < 0.2) speedLines(1 - lt / 0.2, 4); hook(['PRICE', '= PAIN?'], (t - st) / 0.3, { y: 300, size: 140, hiLine: 1 });
      [[330, 560, -0.4], [760, 540, 0.4]].forEach(([x, y, r]) => bolt(x, y, eob(clamp((t - st - 0.2) / 0.3)) * 0.9, r));
    } });
    cue(st, 'whoosh', { gain: 0.5 }); }

  return { shots: S, cues: CUES };
}
