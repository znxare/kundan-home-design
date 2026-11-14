// Generates electrical layout drawings (docs/plans/electrical-level-N.svg) and a point schedule
// (docs/electrical-schedule.md) from house-data.js. Points are placed by rules from the rooms,
// doors and furniture, so the drawing follows the design automatically.
// Run: node tools/make-electrical.js   (or: npm run electrical)
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
const src = fs.readFileSync(path.join(root, 'house-data.js'), 'utf8');
const { LV, gaps, FURN, SHAFTS } = new Function(src + '\nreturn { LV, gaps, FURN, SHAFTS };')();

// ---------- symbol types ----------
const T = {
  SW: { label: 'Switchboard', c: '#222', shape: 'rect' },
  L: { label: 'Light point (ceiling)', c: '#e0a800', shape: 'circle' },
  F: { label: 'Ceiling fan', c: '#7b5cd6', shape: 'fan' },
  S: { label: '6A socket (sockets come in pairs)', c: '#1f6fd1', shape: 'sq' },
  P: { label: '16A power socket', c: '#c62828', shape: 'sq' },
  AC: { label: 'AC point 16A + concealed copper pipe & drain', c: '#c62828', shape: 'ac' },
  G: { label: 'Geyser 16A', c: '#c62828', shape: 'g' },
  E: { label: 'Exhaust fan', c: '#555', shape: 'e' },
  D: { label: 'Data / TV / Wi-Fi point', c: '#2e7d32', shape: 'tri' },
  C: { label: 'CCTV camera', c: '#00838f', shape: 'cam' },
  V: { label: 'Video doorbell', c: '#00838f', shape: 'v' },
  DB: { label: 'Distribution board (MCB + RCCB)', c: '#000', shape: 'db' },
  M: { label: 'Meter bank (separate meters)', c: '#000', shape: 'db' },
  EP: { label: 'Earth pit', c: '#2e7d32', shape: 'ep' },
  INV: { label: 'Inverter / battery', c: '#6d4c41', shape: 'db' },
};
const INV_RING = '#ff8f00'; // orange ring = on inverter backup

const pts = []; // [level, type, x, z, room, note, onInverter]
const add = (l, t, x, z, room, note, inv) => pts.push([l, t, x, z, room, note || '', !!inv]);
const roomsOf = l => LV[l].filter(r => r[0] && !['air', 'void'].includes(r[1]));
const roomAt = (l, x, z) => roomsOf(l).find(r => x >= r[2] - 0.01 && x <= r[3] + 0.01 && z >= r[4] - 0.01 && z <= r[5] + 0.01);
// snap a point to the nearest wall of its room (wall-mounted outlets)
function snap(l, x, z) {
  const r = roomAt(l, x, z); if (!r) return [x, z];
  const d = [[Math.abs(x - r[2]), r[2] + 0.25, z], [Math.abs(x - r[3]), r[3] - 0.25, z], [Math.abs(z - r[4]), x, r[4] + 0.25], [Math.abs(z - r[5]), x, r[5] - 0.25]];
  d.sort((a, b) => a[0] - b[0]); return [d[0][1], d[0][2]];
}
const BED = /bed/i, LIVE = /living|lounge|nook|office|study|dining|reading/i;
const FAN_ROOMS = /bed|living|lounge|dining|office|nook|study|reading/i;
const AC_ROOMS = /bed|living|lounge|office/i;

for (const l of [0, 1, 2]) {
  for (const r of roomsOf(l)) {
    const [name, type, x0, x1, z0, z1] = r;
    const w = x1 - x0, d = z1 - z0, cx = (x0 + x1) / 2, cz = (z0 + z1) / 2, area = w * d;
    if (type === 'open' && l !== 2) continue;
    // lights: one per ~80 sq ft, at least one
    const n = Math.max(1, Math.round(area / 80));
    const cols = Math.max(1, Math.round(Math.sqrt(n * w / d))), rows = Math.max(1, Math.ceil(n / cols));
    for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) add(l, 'L', x0 + w * (i + 0.5) / cols, z0 + d * (j + 0.5) / rows, name, '', true);
    if (FAN_ROOMS.test(name) && type !== 'wet') add(l, 'F', cx + 0.6, cz + 0.6, name, '', true);
    if (AC_ROOMS.test(name) && type !== 'wet') add(l, 'AC', cx, z0 + 0.25, name, 'pipe to nearest duct / terrace');
    if (type === 'wet' && !/kitchen/i.test(name)) {
      add(l, 'E', x0 + 0.3, cz, name, 'into duct');
      if (/bath/i.test(name)) add(l, 'G', x1 - 0.3, z1 - 0.8, name, 'above WC height');
      add(l, 'S', x1 - 0.3, cz, name, 'shaver / hair dryer, IP-rated');
    }
    if (type === 'shop') { add(l, 'P', x1 - 1, z0 + 0.25, name, 'counter / billing'); add(l, 'S', cx, z0 + 0.25, name); add(l, 'S', x0 + 1, z1 - 0.25, name); add(l, 'AC', cx, z1 - 0.25, name); add(l, 'C', x0 + 0.5, z0 + 0.5, name); add(l, 'D', x1 - 1.5, z0 + 0.25, name, 'billing PC / card machine'); }
    if (type === 'godown') { add(l, 'P', x0 + 1, z0 + 0.25, name); add(l, 'S', cx, z1 - 0.25, name); add(l, 'C', x1 - 0.5, z1 - 0.5, name); }
    if (/foyer|lobby|landing|passage|corridor|stair/i.test(name) || type === 'path' || type === 'stair') add(l, 'S', x0 + 0.3, z1 - 0.5, name, 'cleaning / charging');
    if (LIVE.test(name)) { add(l, 'S', x0 + 0.25, cz, name); add(l, 'S', x1 - 0.25, cz, name); }
  }
  // switchboards beside every door, inside each room it serves
  for (const [gl, ax, wpos, a, b] of gaps.filter(g => g[0] === l)) {
    const width = b - a;
    for (const side of [-1, 1]) {
      const px = ax === 'x' ? wpos + side * 0.3 : Math.min(b + 0.4, a + width + 0.4);
      const pz = ax === 'x' ? Math.min(b + 0.4, b + 0.4) : wpos + side * 0.3;
      const r = roomAt(l, px, pz);
      if (r && r[1] !== 'open' && !pts.some(p => p[0] === l && p[1] === 'SW' && p[4] === r[0] && Math.hypot(p[2] - px, p[3] - pz) < 1.5)) add(l, 'SW', px, pz, r[0], width > 4.05 ? 'two-way for open link' : '');
    }
  }
  // outlets driven by furniture
  for (const f of FURN.filter(f => f[0] === l)) {
    const [, nm, x0, x1, z0, z1] = f, cx = (x0 + x1) / 2, cz = (z0 + z1) / 2;
    const at = (t, x, z, note, inv) => { const [sx, sz] = snap(l, x, z); add(l, t, sx, sz, (roomAt(l, x, z) || [''])[0], note, inv); };
    if (nm === 'Headboard') { const vert = (x1 - x0) < (z1 - z0); if (vert) { at('S', cx, z0 - 0.5, 'bedside, with USB'); at('S', cx, z1 + 0.5, 'bedside, with USB', true); } else { at('S', x0 - 0.5, cz, 'bedside, with USB'); at('S', x1 + 0.5, cz, 'bedside, with USB', true); } }
    if (nm === 'TV') { at('S', cx - 0.8, cz, 'TV + set-top box'); at('S', cx + 0.8, cz, 'soundbar / router'); at('D', cx, cz, 'TV + Wi-Fi'); }
    if (/^Sofa$/.test(nm)) { at('S', x0 - 0.3, cz, 'phone charging'); }
    if (/^Desk$/.test(nm)) { at('S', cx - 0.6, cz, 'computer', true); at('S', cx + 0.6, cz, 'printer'); at('D', cx, cz, 'LAN'); }
    if (nm === 'Fridge') at('P', cx, cz, 'fridge', true);
    if (nm === 'Microwave') at('P', cx, cz, 'microwave / OTG');
    if (nm === 'RO purifier') at('S', cx, cz, 'RO purifier', true);
    if (nm === 'Chimney') at('S', cx, cz, 'chimney (high)');
    if (nm === 'Dishwasher slot') at('P', cx, cz, 'dishwasher');
    if (nm === 'Washing machine') at('P', cx, cz, 'washing machine (with earth leakage)');
    if (/counter/i.test(nm) && (x1 - x0) > 4) for (let x = x0 + 1.5; x < x1 - 0.5; x += 3) at('P', x, cz, 'counter appliance (mixer, kettle, induction)');
    if (/Inverter/i.test(nm)) at('INV', cx, cz, 'inverter + batteries (vented)');
    if (/Basin/i.test(nm) && l > 0) {} // covered by room rule
  }
}
// building-level items
add(0, 'M', 58.5, 24.0, 'Back entry corridor', 'meters: Shop ×4, Home, Common (stair lights, pump)');
add(0, 'EP', 61.0, 23.5, 'Footpath', 'earth pit 1 (main)'); add(0, 'EP', 61.0, 21.5, 'Footpath', 'earth pit 2 (main)'); add(0, 'EP', 2.0, 23.5, 'Back', 'earth pit 3 (lightning arrester / solar)');
add(0, 'C', 59.5, 23.5, 'Back entry corridor', 'street gate'); add(0, 'V', 59.6, 22.0, 'Back entry corridor', 'call button at street');
add(0, 'C', 38, 20, 'Common stair', 'stair landing'); add(1, 'C', 38, 20, 'Landing', 'landing + grille gate'); add(2, 'C', 40, 22, 'Upper lobby', 'upper lobby');
add(1, 'V', 35.4, 22.2, 'Landing', 'home door'); add(1, 'DB', 33.9, 12.6, 'Dining', 'Home DB 1st floor (beside Duct E)'); add(2, 'DB', 33.9, 12.6, 'Lounge', 'Home DB 2nd floor (beside Duct E)');
add(0, 'DB', 36, 0.6, 'Shop', 'Shop DBs + common DB at meter bank');
add(1, 'C', 34.5, 18.5, 'Foyer', 'inside home door');

// ---------- drawing ----------
const S = 22, PAD = 40, W = 75 * S + PAD * 2, H = 24.5 * S + PAD * 2 + 120;
const X = x => PAD + (x + 4) * S, Y = z => PAD + 30 + z * S;
const esc = t => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;');
function sym(t, x, z, inv) {
  const k = T[t], px = X(x), py = Y(z); let o = '';
  if (inv) o += `<circle cx="${px}" cy="${py}" r="8.5" fill="none" stroke="${INV_RING}" stroke-width="2"/>`;
  switch (k.shape) {
    case 'circle': o += `<circle cx="${px}" cy="${py}" r="5" fill="${k.c}" stroke="#000" stroke-width="0.6"/>`; break;
    case 'fan': o += `<circle cx="${px}" cy="${py}" r="6" fill="#fff" stroke="${k.c}" stroke-width="1.6"/><path d="M${px - 4} ${py}L${px + 4} ${py}M${px} ${py - 4}L${px} ${py + 4}" stroke="${k.c}" stroke-width="1.6"/>`; break;
    case 'sq': o += `<rect x="${px - 4.5}" y="${py - 4.5}" width="9" height="9" fill="${k.c}" stroke="#000" stroke-width="0.5"/>`; break;
    case 'rect': o += `<rect x="${px - 6}" y="${py - 3.5}" width="12" height="7" fill="${k.c}"/>`; break;
    case 'ac': o += `<rect x="${px - 9}" y="${py - 4}" width="18" height="8" fill="#fff" stroke="${k.c}" stroke-width="1.4"/><text x="${px}" y="${py + 3}" font-size="7" text-anchor="middle" fill="${k.c}" font-weight="bold">AC</text>`; break;
    case 'g': o += `<rect x="${px - 5}" y="${py - 5}" width="10" height="10" fill="#fff" stroke="${k.c}" stroke-width="1.4"/><text x="${px}" y="${py + 3}" font-size="8" text-anchor="middle" fill="${k.c}" font-weight="bold">G</text>`; break;
    case 'e': o += `<circle cx="${px}" cy="${py}" r="5.5" fill="#fff" stroke="${k.c}" stroke-width="1.4"/><text x="${px}" y="${py + 3}" font-size="7.5" text-anchor="middle" fill="${k.c}" font-weight="bold">E</text>`; break;
    case 'tri': o += `<path d="M${px} ${py - 6}L${px + 6} ${py + 5}L${px - 6} ${py + 5}Z" fill="${k.c}"/>`; break;
    case 'cam': o += `<rect x="${px - 6}" y="${py - 4}" width="9" height="8" fill="${k.c}"/><path d="M${px + 3} ${py}L${px + 7} ${py - 4}L${px + 7} ${py + 4}Z" fill="${k.c}"/>`; break;
    case 'v': o += `<rect x="${px - 4}" y="${py - 6}" width="8" height="12" rx="2" fill="${k.c}"/>`; break;
    case 'db': o += `<rect x="${px - 8}" y="${py - 6}" width="16" height="12" fill="#fff" stroke="${k.c}" stroke-width="1.6"/><text x="${px}" y="${py + 3}" font-size="6.5" text-anchor="middle" font-weight="bold">${t}</text>`; break;
    case 'ep': o += `<path d="M${px - 7} ${py}L${px + 7} ${py}M${px - 5} ${py + 3}L${px + 5} ${py + 3}M${px - 3} ${py + 6}L${px + 3} ${py + 6}M${px} ${py - 6}L${px} ${py}" stroke="${k.c}" stroke-width="1.8"/>`; break;
  }
  return o;
}
const NAMES = ['Ground floor', 'First floor', 'Second floor'];
const counts = {};
for (const l of [0, 1, 2]) {
  let o = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" font-family="Arial, sans-serif"><rect width="100%" height="100%" fill="#fff"/>`;
  o += `<text x="${PAD}" y="${PAD}" font-size="18" font-weight="bold">Electrical layout – ${NAMES[l]}</text><text x="${W - PAD}" y="${PAD}" font-size="11" text-anchor="end" fill="#555">Concept for the electrician – positions are indicative; final heights and circuits by a licensed electrician</text>`;
  for (const r of LV[l]) {
    const [nm, ty, x0, x1, z0, z1] = r; if (ty === 'air') continue;
    o += `<rect x="${X(x0)}" y="${Y(z0)}" width="${(x1 - x0) * S}" height="${(z1 - z0) * S}" fill="${ty === 'open' ? '#eef6e8' : ty === 'void' ? '#fff' : ty === 'wet' ? '#eef5f7' : ty === 'shop' ? '#f1f0ec' : '#fbf8f2'}" stroke="#888" stroke-width="1.2"${ty === 'void' ? ' stroke-dasharray="6 4"' : ''}/>`;
    if (nm) o += `<text x="${X(x0) + 4}" y="${Y(z1) - 4}" font-size="10" fill="#666">${esc(nm)}</text>`;
  }
  for (const [gl, ax, wpos, a, b] of gaps.filter(g => g[0] === l)) { const [x1, y1, x2, y2] = ax === 'x' ? [X(wpos), Y(a), X(wpos), Y(b)] : [X(a), Y(wpos), X(b), Y(wpos)]; o += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#fff" stroke-width="4"/>`; }
  for (const sh of SHAFTS || []) o += `<rect x="${X(sh[1])}" y="${Y(sh[3])}" width="${(sh[2] - sh[1]) * S}" height="${(sh[4] - sh[3]) * S}" fill="#cfc9bd" stroke="#555"/><text x="${X(sh[1]) + 2}" y="${Y(sh[3]) + 10}" font-size="7" fill="#333">${sh[0]}</text>`;
  for (const p of pts.filter(p => p[0] === l)) { o += sym(p[1], p[2], p[3], p[6]); counts[p[1]] = counts[p[1]] || [0, 0, 0]; counts[p[1]][l]++; }
  // legend
  let lx = PAD, ly = H - 95; o += `<text x="${lx}" y="${ly - 10}" font-size="11" font-weight="bold">Key</text>`;
  Object.keys(T).forEach((k, i) => { const col = i % 4, row = Math.floor(i / 4); const sx = lx + 12 + col * 380, sy = ly + 8 + row * 20; o += sym(k, (sx - PAD) / S - 4, (sy - PAD - 30) / S, false) + `<text x="${sx + 16}" y="${sy + 4}" font-size="10.5">${esc(T[k].label)}</text>`; });
  o += `<circle cx="${lx + 12}" cy="${ly + 88}" r="8" fill="none" stroke="${INV_RING}" stroke-width="2"/><text x="${lx + 28}" y="${ly + 92}" font-size="10.5">Orange ring = on inverter backup (lights, fans, one bedside socket, fridge, RO, Wi-Fi, CCTV, computer)</text>`;
  o += `</svg>`;
  fs.writeFileSync(path.join(root, 'docs', 'plans', `electrical-level-${l}.svg`), o);
}
// ---------- schedule ----------
let md = `# Electrical point schedule\n\nGenerated from \`house-data.js\` by \`tools/make-electrical.js\`. Counts are a planning baseline for the electrician; positions are shown in \`docs/plans/electrical-level-*.svg\`.\n\n## Totals\n\n| Point | Ground | 1st floor | 2nd floor | Total |\n| --- | ---: | ---: | ---: | ---: |\n`;
for (const k of Object.keys(T)) { const c = counts[k] || [0, 0, 0]; md += `| ${T[k].label} | ${c[0]} | ${c[1]} | ${c[2]} | ${c[0] + c[1] + c[2]} |\n`; }
md += `\n## By room\n\n| Floor | Room | Points |\n| --- | --- | --- |\n`;
const by = {}; pts.forEach(p => { const k = p[0] + '|' + p[4]; by[k] = by[k] || {}; by[k][p[1]] = (by[k][p[1]] || 0) + 1; });
Object.keys(by).sort().forEach(k => { const [l, rm] = k.split('|'); md += `| ${NAMES[l]} | ${rm || '–'} | ${Object.entries(by[k]).map(([t, n]) => `${n}× ${T[t].label.split(' (')[0]}`).join(', ')} |\n`; });
md += `
## Rules behind the layout
- **Meters:** one meter bank at the street end of the ground-floor corridor: a separate meter for each shop, the home, and common services (stair lights, water pump, CCTV).
- **Boards:** each shop has its own board; the home has one board per floor beside **Duct E** (electrical riser), each with MCBs and a 30 mA RCCB, plus surge protection at the main board.
- **Inverter:** dedicated inverter wiring for lights, fans, one bedside socket per bed, fridge, RO, Wi-Fi router, CCTV recorder and the office computer (orange rings). Batteries sit in the 1st-floor lobby cupboard, which needs a vent.
- **Sockets:** pairs of 6A sockets beside beds (with USB), at TV walls, desks, sofas and in every passage; 16A sockets for fridge, microwave, dishwasher, washing machine, geysers and every 3 ft of kitchen counter. Over-providing is cheap now and expensive later.
- **AC:** 16A point with concealed copper pipe and drain sleeve in every bedroom, living room, lounge and office; pipes run in the ceiling to the nearest duct and up to outdoor units on the terrace, never onto a neighbour wall.
- **Earthing:** at least 2 earth pits at the front and 1 at the back for the lightning arrester and solar; every 16A circuit earthed.
- **Wet areas:** exhaust fans into the ducts, geysers on 16A, splash-proof sockets only; no sockets inside shower zones.
- **Security & data:** CCTV at the street gate, every stair landing, inside the home door, each shop and the godown; video doorbell at the home door with a call button at the street; data points at TVs, desks and shop counters; Wi-Fi access point on each floor near Duct E.
- **Solar:** keep an empty 32 mm conduit from the terrace through Duct E to the main board for future solar.
`;
fs.writeFileSync(path.join(root, 'docs', 'electrical-schedule.md'), md);
console.log('Wrote electrical drawings for 3 floors and docs/electrical-schedule.md (' + pts.length + ' points).');
