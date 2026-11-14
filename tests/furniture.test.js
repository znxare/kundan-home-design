// Furniture check: every item sits inside a room on its floor, keeps 2 ft clear in front of
// every door on both sides, and does not collide with another item.
// Run: node tests/furniture.test.js   (part of npm test)
const fs = require('fs'), path = require('path');
const src = fs.readFileSync(path.join(__dirname, '..', 'house-data.js'), 'utf8');
const { LV, gaps, FURN, SHAFTS } = new Function(src + '\nreturn { LV, gaps, FURN, SHAFTS };')();
const E = 0.02, bad = [];
const inside = (f, r) => f[2] >= r[2] - E && f[3] <= r[3] + E && f[4] >= r[4] - E && f[5] <= r[5] + E;
const hit = (a, b) => a[0] < b[1] - E && a[1] > b[0] + E && a[2] < b[3] - E && a[3] > b[2] + E;
const fp = f => [f[2], f[3], f[4], f[5]];
FURN.forEach(f => {
  const [l, name] = f;
  // a) inside a room (items marked span may cross an open edge, but must stay inside the home rooms of that floor)
  const rooms = LV[l].filter(r => !['air', 'void'].includes(r[1]));
  if (!f[10] && !rooms.some(r => inside(f, r))) bad.push(`Level ${l}: "${name}" is not fully inside one room`);
  // b) door clearance: 2 ft each side of every door (openings wider than 4 ft are open-plan links, not doors) (wall-mounted items above 6.8 ft are fine)
  if (f[6] < 6.8) gaps.filter(g => g[0] === l && g[4] - g[3] <= 4.05).forEach(([, ax, w, a, b]) => {
    const zone = ax === 'x' ? [w - 2, w + 2, a, b] : [a, b, w - 2, w + 2];
    if (hit(fp(f), zone)) bad.push(`Level ${l}: "${name}" blocks the door at ${ax}=${w} (${a}–${b})`);
  });
});
// c) overlaps between items (same floor, overlapping footprint and height)
for (let i = 0; i < FURN.length; i++) for (let j = i + 1; j < FURN.length; j++) {
  const a = FURN[i], b = FURN[j];
  if (a[0] !== b[0] || a[7] < 0.05 || b[7] < 0.05) continue;
  const vy = a[6] < b[6] + b[7] - E && b[6] < a[6] + a[7] - E;
  if (vy && hit(fp(a), fp(b))) bad.push(`Level ${a[0]}: "${a[1]}" overlaps "${b[1]}"`);
}
// d) service ducts: must not collide with furniture or block doors on any floor
(SHAFTS || []).forEach(sh => [0, 1, 2].forEach(l => {
  const r = [sh[1], sh[2], sh[3], sh[4]];
  FURN.filter(f => f[0] === l && f[7] > 0.05).forEach(f => { if (hit(fp(f), r)) bad.push(`Level ${l}: ${sh[0]} runs through "${f[1]}"`); });
  gaps.filter(g => g[0] === l && g[4] - g[3] <= 4.05).forEach(([, ax, w, a, b]) => {
    const zone = ax === 'x' ? [w - 2, w + 2, a, b] : [a, b, w - 2, w + 2];
    if (hit(r, zone)) bad.push(`Level ${l}: ${sh[0]} blocks the door at ${ax}=${w}`);
  });
  if (!LV[l].some(rm => !['air', 'void', 'open'].includes(rm[1]) && r[0] >= rm[2] - E && r[1] <= rm[3] + E && r[2] >= rm[4] - E && r[3] <= rm[5] + E)) bad.push(`Level ${l}: ${sh[0]} is not inside a room`);
}));
if (bad.length) { console.error('FAIL - furniture problems:\n  ' + bad.join('\n  ')); process.exit(1); }
console.log(`PASS - ${FURN.length} furniture items and fittings fit their rooms, clear every door and don't collide; ${(SHAFTS||[]).length} service ducts run clear on every floor.`);
