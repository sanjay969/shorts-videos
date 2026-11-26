// NO ONE CAN READ THIS 600-YEAR-OLD BOOK (the Voynich manuscript, Yale Beinecke MS 408) — Tall Tale 3D, mystery tone, US audience.
// The pages are drawn in code: an invented loopy script, made-up plants, a star wheel and green pools (no copied page art).
import * as THREE from 'three';
import { ctx, clamp, lerp, eo, eio, eob, rnd } from './core/lib.js';
import { L, Le, Wd, T } from './core/timing.js';
import * as WD from './core/world.js';
import { Toon, PROPS, INK } from './core/toon.js';
import { V3, talk, blink, hook, ribbon, pill, stamp, calCard, counter, confetti, flash, tint, speedLines, stars, mark, subscribe, makeShoot, LK } from './jh.js';

const LOOKS = {
  prof: { body: '#8C6FC9', hat: 'none', neck: 'bowtie', neckCol: '#F2C230', pattern: 'vest', patCol: '#5A4A8A', extra: ['glasses', 'mustache'] },
  tech: { body: '#F4EFE4', pattern: 'apron', patCol: '#FFFFFF', hat: 'none', neck: 'collar', neckCol: '#3C6FB6', extra: ['glasses'] },
  cb1: { body: '#6A7A4A', pattern: 'vest', patCol: '#4E5A36', hat: 'cap', hatCol: '#4E5A36', neck: 'tie', neckCol: '#3A3A2A' },
  cb2: { body: '#5C6F8F', pattern: 'plain', hat: 'bun', hatCol: '#3A2A22', neck: 'collar', neckCol: '#F4EFE4', extra: ['glasses'] },
  guy: { body: '#E8734A', pattern: 'stripes', patCol: '#F2C230', hat: 'beanie', hatCol: '#2E8A5A', extra: ['freckles'] },
};
const mk = (k, o) => new Toon({ ...LOOKS[k], extra: [...(LOOKS[k].extra || [])] }, o);

// ── page art (canvas) ──
function glyphs(c, x0, y0, w, lines, seed, lh = 30) {
  c.strokeStyle = '#4A3A2A'; c.lineWidth = 3; c.lineCap = 'round';
  for (let l = 0; l < lines; l++) { let x = x0; const y = y0 + l * lh; let i = 0;
    while (x < x0 + w - 20) { const r = rnd(seed * 31 + l * 7 + i++); c.beginPath(); const k = Math.floor(r * 5);
      if (k === 0) { c.arc(x + 6, y, 6, 0, 6.3); } else if (k === 1) { c.moveTo(x, y + 6); c.quadraticCurveTo(x + 6, y - 14, x + 12, y + 6); } else if (k === 2) { c.moveTo(x, y); c.lineTo(x + 4, y - 14); c.moveTo(x + 4, y); c.arc(x + 9, y - 2, 5, 3, 9); }
      else if (k === 3) { c.moveTo(x, y - 8); c.bezierCurveTo(x + 14, y - 16, x - 4, y + 8, x + 12, y + 4); } else { c.arc(x + 5, y - 2, 5, 0, 6.3); c.moveTo(x + 10, y - 2); c.lineTo(x + 14, y + 8); }
      c.stroke(); x += 14 + (r > 0.8 ? 12 : 0); } }
}
function page(kind, seed) {
  return WD.canvasTex('vp' + kind + seed, 512, 700, (c) => {
    const g = c.createLinearGradient(0, 0, 512, 700); g.addColorStop(0, '#EBD9AE'); g.addColorStop(1, '#D9C08A'); c.fillStyle = g; c.fillRect(0, 0, 512, 700);
    c.fillStyle = 'rgba(120,80,30,0.08)'; for (let i = 0; i < 30; i++) { c.beginPath(); c.arc(rnd(seed + i) * 512, rnd(seed * 3 + i) * 700, 10 + rnd(i) * 40, 0, 7); c.fill(); }
    if (kind === 'plant') {
      c.strokeStyle = '#3A2A1A'; c.lineWidth = 4; c.fillStyle = '#7FA65A';
      c.beginPath(); c.moveTo(256, 640); c.bezierCurveTo(230, 500, 290, 420, 256, 300); c.stroke();
      [[200, 420, -0.6], [312, 470, 0.7], [196, 340, -0.9], [320, 360, 0.9]].forEach(([x, y, a]) => { c.save(); c.translate(x, y); c.rotate(a); c.beginPath(); c.ellipse(0, 0, 70, 26, 0, 0, 7); c.fill(); c.stroke(); c.restore(); });
      c.fillStyle = '#D86A9A'; [[256, 260, 40], [226, 230, 26], [290, 236, 26]].forEach(([x, y, r]) => { c.beginPath(); c.arc(x, y, r, 0, 7); c.fill(); c.stroke(); });
      c.strokeStyle = '#8A5A3A'; c.lineWidth = 3; for (let i = 0; i < 7; i++) { c.beginPath(); c.moveTo(256, 640); c.quadraticCurveTo(180 + i * 25, 680, 140 + i * 40, 690); c.stroke(); }
      glyphs(c, 40, 60, 440, 5, seed);
    } else if (kind === 'stars') {
      c.strokeStyle = '#3A2A1A'; c.lineWidth = 4; c.fillStyle = '#6A8AC9'; c.beginPath(); c.arc(256, 380, 190, 0, 7); c.fill(); c.stroke();
      c.fillStyle = '#E9D7A5'; c.beginPath(); c.arc(256, 380, 120, 0, 7); c.fill(); c.stroke();
      for (let i = 0; i < 16; i++) { const a = i / 16 * 6.283; c.beginPath(); c.moveTo(256 + Math.cos(a) * 120, 380 + Math.sin(a) * 120); c.lineTo(256 + Math.cos(a) * 190, 380 + Math.sin(a) * 190); c.stroke(); }
      c.fillStyle = '#F2C230'; for (let i = 0; i < 12; i++) { const a = i / 12 * 6.283 + 0.2; const x = 256 + Math.cos(a) * 155, y = 380 + Math.sin(a) * 155; c.beginPath(); for (let j = 0; j < 10; j++) { const rr = j % 2 ? 5 : 12, b = j / 10 * 6.283; c.lineTo(x + Math.cos(b) * rr, y + Math.sin(b) * rr); } c.closePath(); c.fill(); }
      c.fillStyle = '#F2C230'; c.beginPath(); c.arc(256, 380, 40, 0, 7); c.fill(); c.stroke(); glyphs(c, 40, 80, 440, 3, seed);
    } else if (kind === 'pools') {
      c.strokeStyle = '#3A2A1A'; c.lineWidth = 4; c.fillStyle = '#5FB38A';
      [[150, 300, 110, 60], [360, 420, 120, 70], [200, 540, 140, 60]].forEach(([x, y, a, b]) => { c.beginPath(); c.ellipse(x, y, a, b, 0, 0, 7); c.fill(); c.stroke(); });
      c.strokeStyle = '#2E7A9A'; c.lineWidth = 6; c.beginPath(); c.moveTo(260, 300); c.bezierCurveTo(300, 330, 260, 380, 330, 410); c.moveTo(330, 470); c.bezierCurveTo(300, 500, 330, 520, 280, 540); c.stroke();
      glyphs(c, 40, 80, 440, 4, seed); glyphs(c, 60, 630, 400, 2, seed + 9);
    } else glyphs(c, 40, 70, 440, 20, seed);
  });
}

export function buildShots(E) {
  const S = [], CUES = [], add = (o) => (S.push(o), o), cue = (t, type, o = {}) => CUES.push({ t: +Math.max(0, t).toFixed(3), type, ...o });
  const cut = (i) => (i === 0 ? 0 : L(i) - 0.06);
  const { shoot } = makeShoot(E);
  const shake = (t, t0, a = 0.08) => { const k = t - t0; if (k < 0 || k > 0.35) return V3(0, 0, 0); const f = (1 - k / 0.35) * a; return V3(Math.sin(k * 90) * f, Math.cos(k * 70) * f, 0); };

  // ── LIBRARY with a giant book on a lectern ──
  const R = WD.interior(E, { w: 10, depth: 8, h: 4.4, wall: '#5A3A2A', motif: '#6A4A36', floor: '#7A4A2E', ceiling: '#3A2A20', signText: null, picture: false, counterOn: false, litter: false });
  R.sun.key.target.position.set(0, 0, -4); R.sun.key.position.set(2, 6, 0);
  // shelves on the back wall
  const shelfM = WD.mat({ color: '#4A2E1E' }); for (let r = 0; r < 4; r++) { const sh = new THREE.Mesh(new THREE.BoxGeometry(8, 0.08, 0.5), shelfM); sh.position.set(0, 0.6 + r * 0.9, -7.6); R.scene.add(sh);
    for (let i = 0; i < 26; i++) { const h = 0.5 + rnd(r * 30 + i) * 0.3; const b = new THREE.Mesh(new THREE.BoxGeometry(0.22, h, 0.4), WD.mat({ color: ['#8A2E2E', '#2E4E3F', '#3C4F8A', '#B5853A', '#5A3A6A'][(i + r) % 5] })); b.position.set(-3.8 + i * 0.3, 0.64 + r * 0.9 + h / 2, -7.6); R.scene.add(b); } }
  const lect = new THREE.Group(); const lw = WD.mat({ color: '#6A3A22' });
  const post = new THREE.Mesh(new THREE.BoxGeometry(0.3, 1.0, 0.3), lw); post.position.y = 0.5; lect.add(post);
  const top = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.08, 1.1), lw); top.position.y = 1.05; top.rotation.x = 0.45; lect.add(top);
  [post, top].forEach((m) => (m.castShadow = true)); lect.position.set(0, 0, -3.5); R.scene.add(lect);
  // book: pages in the XY plane, spine along y at x 0; tilted onto the lectern
  const book = new THREE.Group(); const pm = (tex) => new THREE.MeshStandardMaterial({ map: tex, roughness: 0.9, side: THREE.DoubleSide });
  const cover = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.0, 0.05), WD.mat({ color: '#B89A6A' })); cover.position.z = -0.04; book.add(cover);
  const kinds = { text: page('text', 1), text2: page('text', 2), plant: page('plant', 3), stars: page('stars', 4), pools: page('pools', 5) };
  const left = new THREE.Mesh(new THREE.PlaneGeometry(0.7, 0.96), pm(kinds.text)); left.position.set(-0.36, 0, 0); book.add(left);
  const right = new THREE.Mesh(new THREE.PlaneGeometry(0.7, 0.96), pm(kinds.plant)); right.position.set(0.36, 0, 0); book.add(right);
  const flipP = new THREE.Group(); book.add(flipP); const flip = new THREE.Mesh(new THREE.PlaneGeometry(0.7, 0.96), pm(kinds.text2)); flip.position.set(0.36, 0, 0.01); flipP.add(flip);
  book.position.set(0, 1.16, -3.5); book.rotation.x = -Math.PI / 2 + 0.45 + 0.02; R.scene.add(book);
  const setPages = (l, r) => { left.material.map = kinds[l]; right.material.map = kinds[r]; left.material.needsUpdate = right.material.needsUpdate = true; };
  const glow = new THREE.PointLight('#FFD9A0', 3, 4); glow.position.set(0, 2.2, -2.8); R.scene.add(glow);
  // glass case for the vault shot (hidden otherwise)
  const caseG = new THREE.Mesh(new THREE.BoxGeometry(1.9, 1.0, 1.4), new THREE.MeshStandardMaterial({ color: '#BFE6F5', transparent: true, opacity: 0.18, roughness: 0.05 })); caseG.position.set(0, 1.55, -3.5); R.scene.add(caseG);
  const prof = mk('prof'), tech = mk('tech'), cb1 = mk('cb1'), cb2 = mk('cb2'), guy = mk('guy');
  const cast = [prof, tech, cb1, cb2, guy]; cast.forEach((p) => R.scene.add(p.group));
  const only = (...keep) => cast.forEach((p) => (p.group.visible = keep.includes(p)));
  const reset = () => { flipP.rotation.y = 0; flip.visible = false; caseG.visible = false; glow.intensity = 3; };
  const tube = (g, x, y) => { g.save(); g.translate(x, y - 40); g.rotate(0.2); g.strokeStyle = INK; g.lineWidth = 5; g.fillStyle = 'rgba(190,230,255,0.85)'; g.beginPath(); g.roundRect(-14, -60, 28, 110, 12); g.fill(); g.stroke(); g.fillStyle = '#C9A13B'; g.beginPath(); g.roundRect(-14, 10, 28, 40, [0, 0, 12, 12]); g.fill(); g.restore(); };
  const BOOK = V3(0, 1.2, -3.5);

  // ═══ SHOTS ═══
  // 1a · frame 0: the glowing open book full of strange script; a professor squints at it; hook UNREADABLE BOOK?
  { const st = 0, wr = Wd('read', 0);
    add({ id: 'S01a', at: st, note: 'frame 0: over-the-shoulder push-in on a giant open old book on a lectern, pages full of loopy unknown script and a strange plant; a professor squints at it; hook UNREADABLE BOOK?', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); reset(); only(prof); setPages('text', 'plant');
      prof.at(-1.3, 0, -3.0); prof.set({ mood: 'worried', armL: [20, 10], armR: [70, -90], look: [0.6, 0.4], blink: blink(t) });
      shoot(R.scene, cast, V3(0.9, 2.3, -1.4), V3(0.6, 2.1, -1.9), BOOK, null, k, { ...LK.room, fov: 56 });
      blit(); hook(['UNREADABLE', 'BOOK?'], 1, { y: 300, size: 130, hiLine: 1 }); mark('?', 260, 760, (t - wr) / 0.3);
    } });
    cue(0, 'pop', { gain: 0.5 }); cue(wr, 'boing', { gain: 0.5 }); }
  // 1b · "and it's six hundred years old." dust puffs, counter 600 YEARS OLD slams
  { const st = Wd('and', 0) - 0.1, w6 = Wd('six', 0);
    add({ id: 'S01b', at: st, note: 'top-down on the open book, the camera drops toward it; a counter ticks to 600 YEARS OLD with a camera shake', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); reset(); only(); setPages('text', 'plant');
      shoot(R.scene, cast, V3(0.3, 3.4, -2.6).add(shake(t, w6 + 0.5)), V3(0.1, 2.6, -3.0), BOOK, null, k, { ...LK.room, fov: 54 }, undefined, lerp(0, 0.2, k));
      blit(); counter(Math.round(lerp(0, 600, eo(clamp((t - w6) / 0.6)))) + ' YEARS', (t - st) / 0.25, 'OLD (ABOUT)', 330, 640);
    } });
    cue(w6 + 0.5, 'slam', { gain: 0.8 }); }

  // 2 · "It's called the Voynich manuscript," orbit around the lectern; ribbon THE VOYNICH MANUSCRIPT
  { const st = cut(1), wv = Wd('voynich', 1);
    add({ id: 'S02', at: st, note: 'slow low orbit around the lectern and the glowing book in the dark library; gold ribbon THE VOYNICH MANUSCRIPT', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); reset(); only(); setPages('text', 'plant');
      const a = lerp(0.7, 0.2, k), cp = V3(Math.sin(a) * 3.2, 1.3, -3.5 + Math.cos(a) * 3.2); shoot(R.scene, cast, cp, cp, V3(0, 1.3, -3.5), null, 0, { ...LK.room, fov: 52 });
      blit(); ribbon('THE VOYNICH MANUSCRIPT', (t - wv) / 0.3, 330, 64);
    } });
    cue(st, 'whoosh', { gain: 0.5 }); cue(wv + 0.1, 'stamp', { gain: 0.6 }); }

  // 3a · "about two hundred and forty pages" pages flip fast; counter 240 PAGES
  { const st = cut(2), w2 = Wd('two', 2);
    add({ id: 'S03a', at: st, note: 'close on the book as pages flip over fast one after another; counter ticks to 240 PAGES', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); reset(); only(); flip.visible = true; const f = (lt * 3) % 1; flipP.rotation.y = -eio(f) * Math.PI; setPages(['text', 'stars', 'text2', 'pools'][Math.floor(lt * 3) % 4], 'text2');
      shoot(R.scene, cast, V3(0.0, 2.2, -2.0), V3(0.2, 2.0, -2.3), BOOK, null, k, { ...LK.room, fov: 52 });
      blit(); counter(String(Math.round(lerp(1, 240, eo(clamp((t - w2) / 0.9))))), (t - st) / 0.25, 'PAGES (ABOUT)', 330, 520);
    } });
    cue(st, 'zip', { dur: 0.8, gain: 0.5 }); cue(w2 + 0.9, 'ding', { gain: 0.6 }); }
  // 3b · "in a language nobody knows," the professor scratches his head; ?s pop; pill UNKNOWN WRITING
  { const st = Wd('in', 2) - 0.1, wl = Wd('language', 2), wn = Wd('nobody', 2);
    add({ id: 'S03b', at: st, note: 'medium: the professor leans over the book scratching his head, sweating; three ? marks pop one after another; pill UNKNOWN WRITING', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); reset(); only(prof); setPages('text', 'text2');
      prof.at(-1.3, 0, -2.3); prof.set({ mood: 'worried', sweat: 1, lean: 10, armR: [150, -100], armL: [20, 10], look: [0.7, 0.5], blink: blink(t) });
      shoot(R.scene, cast, V3(-0.3, 1.6, 1.6), V3(-0.5, 1.6, 0.8), V3(-0.9, 1.4, -2.8), null, k, { ...LK.room, fov: 50 });
      blit(); pill('UNKNOWN WRITING', (t - wl) / 0.25, 300, 'rgba(160,30,40,0.92)', 60); [[300, 520], [760, 470], [540, 640]].forEach(([x, y], i) => mark('?', x, y, (t - wn - i * 0.18) / 0.3));
    } });
    cue(wl, 'pop', { gain: 0.6 }); cue(wn, 'boing', { gain: 0.5 }); }

  // 4 · "next to plants that don't seem to exist," the plant page; ribbon / stamp NO SUCH PLANT?
  { const st = cut(3), wp = Wd('plants', 3), we = Wd('exist', 3);
    add({ id: 'S04', at: st, note: 'top-down push onto the page with a made-up pink flowering plant with tangled roots; stamp NO SUCH PLANT? on "exist"', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); reset(); only(); setPages('text2', 'plant');
      shoot(R.scene, cast, V3(0.9, 2.6, -2.3), V3(0.45, 2.1, -2.9), V3(0.36, 1.2, -3.5), null, k, { ...LK.room, fov: 48 }, undefined, lerp(-0.1, 0.05, k));
      blit(); stars(620, 760, (t - wp) / 0.7); stamp(['NO SUCH', 'PLANT?'], (t - we) / 0.2, { y: 380, size: 80, col: '#B5372E' });
    } });
    cue(wp, 'sparkle', { gain: 0.5 }); cue(we, 'stamp', { gain: 0.7 }); }

  // 5a · "star maps," the room goes dark blue, star-wheel page, twinkles
  { const st = cut(4), ws = Wd('star', 4);
    add({ id: 'S05a', at: st, note: 'the lamp dims to night blue; a page turns to a star wheel; gold stars twinkle on screen', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); reset(); only(); glow.intensity = 1; flip.visible = lt < 0.4; flipP.rotation.y = -eio(clamp(lt / 0.4)) * Math.PI; setPages('text', 'stars');
      shoot(R.scene, cast, V3(1.4, 2.2, -2.0), V3(1.0, 2.3, -2.4), V3(0.3, 1.2, -3.5), null, k, { ...LK.room, fov: 50 });
      blit(); tint(1, '#1A2A6A'); for (let i = 0; i < 7; i++) stars(160 + i * 130, 260 + (i % 3) * 120, ((t - ws - i * 0.1) % 1 + 1) % 1);
    } });
    cue(st, 'slide', { dur: 0.4, gain: 0.4 }); cue(ws, 'sparkle', { gain: 0.7 }); }
  // 5b · "and strange green pools." green pools page; green tint; bubbles
  { const st = Wd('and', 4) - 0.1, wg = Wd('green', 4);
    add({ id: 'S05b', at: st, note: 'whip to the left page: strange green pools joined by blue pipes; green glow and bubbles rising on screen', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); reset(); only(); setPages('pools', 'stars');
      shoot(R.scene, cast, V3(-1.0, 2.3, -2.2), V3(-0.6, 2.1, -2.6), V3(-0.36, 1.2, -3.5), null, k, { ...LK.room, fov: 48 }, undefined, lerp(0.08, 0, k));
      blit(); tint(0.9, '#2E9A5A'); if (lt < 0.15) speedLines(1 - lt / 0.15, 6);
      for (let i = 0; i < 10; i++) { const q = ((lt * 0.8 + i * 0.1) % 1); ctx.save(); ctx.globalAlpha = 1 - q; ctx.strokeStyle = '#BFF5D0'; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(150 + i * 85, 1100 - q * 700, 16 + (i % 3) * 8, 0, 7); ctx.stroke(); ctx.restore(); }
    } });
    cue(wg, 'bubbles', { dur: 1.2, gain: 0.5 }); }

  // 6a · "Carbon dating puts it" a lab tech holds up a tiny sample tube next to the book; pill CARBON DATING
  { const st = cut(5), wc = Wd('carbon', 5);
    add({ id: 'S06a', at: st, note: 'a scientist in a white coat walks in holding up a little sample tube, smug; pill CARBON DATING (2009)', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); reset(); only(tech); setPages('text', 'plant');
      tech.at(lerp(-2.4, -1.4, eo(clamp(lt / 0.8))), 0, -2.6); tech.set({ mood: 'smug', armR: [150, 0], holdR: tube, v: 't', armL: [20, 10], legs: lt < 0.8 ? 'walk' : 'stand', phase: t * 7, blink: blink(t) });
      shoot(R.scene, cast, V3(0.2, 1.5, 1.0), V3(-0.3, 1.5, 0.3), V3(-1.0, 1.4, -3.0), null, k, { ...LK.room, fov: 50 });
      blit(); pill('CARBON DATING (2009)', (t - wc) / 0.25, 300, 'rgba(31,28,51,0.9)', 56);
    } });
    cue(wc, 'pop', { gain: 0.6 }); }
  // 6b · "in the early fourteen hundreds." calendar 1404-1438 slams
  { const st = Wd('in', 5) - 0.1, wf = Wd('fourteen', 5);
    add({ id: 'S06b', at: st, note: 'push-in past the scientist to the book; calendar card EARLY 1400s slams with a shake; pill 1404-1438', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); reset(); only(tech); setPages('text', 'plant');
      tech.at(-1.4, 0, -2.6); tech.set({ mood: 'shock', armR: [150, 0], holdR: tube, v: 't', armL: [150, 0], blink: 0 });
      shoot(R.scene, cast, V3(0.8, 1.8, -0.6).add(shake(t, wf + 0.1)), V3(0.5, 1.8, -1.4), V3(-0.4, 1.4, -3.2), null, k, { ...LK.room, fov: 52 });
      blit(); calCard('MADE IN THE', '1400s', 540, 440, eob(clamp((t - wf) / 0.25)), -0.05); pill('1404 - 1438', (t - wf - 0.4) / 0.25, 700, 'rgba(160,30,40,0.92)', 60);
    } });
    cue(wf + 0.1, 'slam', { gain: 0.7 }); }

  // 7 · "Follow for more unsolved mysteries." the professor points at the viewer
  { const st = cut(6);
    add({ id: 'S07', at: st, note: 'the professor turns to the viewer and points, grinning, the glowing book behind him; SUBSCRIBE button pressed', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); reset(); only(prof); setPages('text', 'plant');
      prof.at(-0.9, 0, -2.0); prof.set({ mood: 'happy', armR: [95, 0], armL: [20, 10], talk: talk(t), blink: blink(t) });
      shoot(R.scene, cast, V3(-1.4, 1.5, 1.6), V3(-1.1, 1.5, 0.8), V3(-0.7, 1.4, -2.4), null, k, { ...LK.room, fov: 50 });
      blit(); subscribe(lt / 0.45 + (lt > 0.8 ? (lt - 0.8) * 1.4 : 0), t, 330);
    } });
    cue(st, 'pop', { gain: 0.6 }); cue(st + 1.25, 'ding', { gain: 0.6 }); }

  // 8a · "Top World War Two codebreakers tried to crack it," two 1940s codebreakers attack the book, papers fly
  { const st = cut(7), wc = Wd('codebreakers', 7);
    add({ id: 'S08a', at: st, note: 'sepia flashback: two 1940s codebreakers (one in an army cap) scribble furiously beside the book, papers flying; ribbon WWII CODEBREAKERS', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); reset(); only(cb1, cb2); setPages('text', 'text2');
      cb1.at(-1.0, 0, -2.7); cb1.set({ mood: 'angry', armR: [lerp(60, 130, Math.abs(Math.sin(t * 9))), -40], holdR: PROPS.paper('A=?'), v: 'p', armL: [40, -40], lean: 8, blink: blink(t) });
      cb2.at(1.0, 0, -2.8); cb2.set({ mood: 'worried', sweat: 1, armL: [lerp(60, 130, Math.abs(Math.sin(t * 8 + 1))), -40], holdL: PROPS.paper('B=?'), v: 'p2', armR: [40, -40], lean: -8, blink: blink(t, 1) });
      shoot(R.scene, cast, V3(0.2, 1.7, 3.0), V3(-0.1, 1.8, 2.3), V3(0, 1.3, -3.2), null, k, { ...LK.room, fov: 54 });
      blit(); ctx.save(); ctx.globalCompositeOperation = 'color'; ctx.globalAlpha = 0.4; ctx.fillStyle = '#8A6A3A'; ctx.fillRect(0, 0, 1080, 1920); ctx.restore();
      ribbon('WWII CODEBREAKERS', (t - wc) / 0.3, 330, 70);
      for (let i = 0; i < 5; i++) { const q = ((lt * 1.4 + i * 0.21) % 1); ctx.save(); ctx.translate(220 + i * 160 + Math.sin(q * 6 + i) * 40, 1000 - q * 560); ctx.rotate(q * 4 + i); ctx.fillStyle = '#FFFDF4'; ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.globalAlpha = 1 - q; ctx.fillRect(-40, -50, 80, 100); ctx.strokeRect(-40, -50, 80, 100); ctx.restore(); }
    } });
    cue(st, 'zip', { dur: 0.6, gain: 0.5 }); cue(wc, 'stamp', { gain: 0.6 }); }
  // 8b · "and failed." they slump; stamp FAILED
  { const st = Wd('and', 7) - 0.1, wf = Wd('failed', 7);
    add({ id: 'S08b', at: st, note: 'high angle: both codebreakers slump, arms down, exhausted; red stamp FAILED slams', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); reset(); only(cb1, cb2); setPages('text', 'text2');
      cb1.at(-0.75, 0, -2.2); cb1.set({ mood: 'sad', armR: [10, 0], armL: [10, 0], lean: -4, tears: 1 }); cb2.at(0.75, 0, -2.3); cb2.set({ mood: 'tired', sweat: 1, armL: [10, 0], armR: [150, -110] });
      shoot(R.scene, cast, V3(0, 3.4, 2.2).add(shake(t, wf)), V3(0, 3.1, 1.6), V3(0, 0.9, -2.6), null, k, { ...LK.room, fov: 54 });
      blit(); ctx.save(); ctx.globalCompositeOperation = 'color'; ctx.globalAlpha = 0.4; ctx.fillStyle = '#8A6A3A'; ctx.fillRect(0, 0, 1080, 1920); ctx.restore();
      stamp(['FAILED'], (t - wf) / 0.2, { y: 420, size: 110, col: '#E3262E' });
    } });
    cue(wf, 'slam', { gain: 0.8 }); }

  // 9 · "Today it sits in a vault at Yale," the book under a glass case in the dark; pill YALE UNIVERSITY
  { const st = cut(8), wy = Wd('yale', 8);
    add({ id: 'S09', at: st, note: 'the book closed under a glass case on the lectern, cool blue light, camera dollies in; pill YALE UNIVERSITY LIBRARY', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); reset(); only(); caseG.visible = true; glow.intensity = 1.5; setPages('text', 'plant');
      shoot(R.scene, cast, V3(-2.0, 1.4, 1.2), V3(-1.2, 1.5, 0.0), V3(0, 1.4, -3.5), null, k, { ...LK.room, fov: 50 });
      blit(); tint(0.7, '#2A4AA0'); pill('YALE UNIVERSITY LIBRARY', (t - wy) / 0.25, 300, 'rgba(31,28,51,0.9)', 54);
    } });
    cue(st, 'slide', { dur: 0.6, gain: 0.4 }); cue(wy, 'ding', { gain: 0.5 }); }

  // 10 · "and every few years, someone says they've solved it." year cards fly; a guy jumps with SOLVED! paper; confetti
  { const st = cut(9), wy = Wd('years', 9), ws = Wd('solved', 9);
    add({ id: 'S10', at: st, note: 'calendar cards fly past with changing years; a young guy in a striped shirt jumps holding a paper SOLVED!, confetti bursts', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); reset(); only(guy); setPages('text', 'plant');
      guy.at(-1.2, 0, -2.6); guy.set({ mood: t > ws ? 'laugh' : 'smug', armR: [150, 0], holdR: PROPS.paper('SOLVED!'), v: 's', armL: t > ws ? [150, 10] : [20, 10], legs: t > ws ? 'jump' : 'stand', phase: clamp((t - ws) * 2), blink: blink(t) });
      shoot(R.scene, cast, V3(-0.2, 1.2, 1.6), V3(-0.6, 1.4, 0.6), V3(-1.0, 1.5, -2.6), null, k, { ...LK.room, fov: 50 });
      blit(); const yr = 1998 + Math.floor(clamp((t - st) / (ws - st)) * 26);
      if (t < ws) for (let i = 0; i < 3; i++) { const pk = (lt * 2 + i * 0.33) % 1; calCard('YEAR', String(yr - 2 + i * 2), 540 + (pk - 0.5) * 900, 430, 0.8, (pk - 0.5) * 0.8); }
      confetti(t, ws, 60);
    } });
    cue(wy, 'zip', { gain: 0.5 }); cue(ws, 'sparkle', { gain: 0.7 }); }

  // 11a · "They never have." stamp NOPE over the guy, now sad
  { const st = cut(10), wn = Wd('never', 10);
    add({ id: 'S11a', at: st, note: 'Dutch tilt: the guy\'s face falls, the SOLVED! paper droops; red stamp NOPE.', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); reset(); only(guy); setPages('text', 'plant');
      guy.at(-1.2, 0, -2.6); guy.set({ mood: 'sad', armR: [40, 0], holdR: PROPS.paper('SOLVED!'), v: 's', armL: [10, 0], blink: blink(t) });
      shoot(R.scene, cast, V3(-0.6, 1.5, 0.9).add(shake(t, wn)), V3(-0.8, 1.5, 0.4), V3(-1.2, 1.4, -2.6), null, k, { ...LK.room, fov: 50 }, undefined, 0.12);
      blit(); stamp(['NOPE.'], (t - wn) / 0.2, { y: 420, size: 120, col: '#E3262E' });
    } });
    cue(wn, 'stamp', { gain: 0.8 }); }
  // 11b · "So, for now," back to the frame-0 shot -> loops into "Nobody on Earth can read this book"
  { const st = Wd('so', 10) - 0.1, wf = Wd('now', 10);
    add({ id: 'S11b', at: st, note: 'loop: back to the opening over-the-shoulder view of the glowing book with the squinting professor; hook UNREADABLE BOOK? returns', draw(lt, d, t, blit) {
      const k = eio(clamp(lt / d)); reset(); only(prof); setPages('text', 'plant');
      prof.at(-1.3, 0, -3.0); prof.set({ mood: 'worried', armL: [20, 10], armR: [70, -90], look: [0.6, 0.4], blink: blink(t) });
      shoot(R.scene, cast, V3(1.3, 2.5, -0.6), V3(0.9, 2.3, -1.4), BOOK, null, k, { ...LK.room, fov: 56 });
      blit(); if (lt < 0.2) speedLines(1 - lt / 0.2, 4); hook(['UNREADABLE', 'BOOK?'], (t - wf) / 0.3, { y: 300, size: 130, hiLine: 1 });
    } });
    cue(st, 'whoosh', { gain: 0.5 }); cue(wf, 'pop', { gain: 0.6 }); }

  return { shots: S, cues: CUES };
}
