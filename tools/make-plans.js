// Draws 2D floor plans (SVG) from house-data.js into docs/plans/.
// Run: node tools/make-plans.js   (or: npm run plans)
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const src = fs.readFileSync(path.join(root, 'house-data.js'), 'utf8');
const { LV, gaps } = new Function(src + '\nreturn { LV, gaps };')();

const S = 14;            // pixels per foot
const PAD = 40;
const W = 60 * S + PAD * 2, H = 24.5 * S + PAD * 2 + 40;
const FILL = { room: '#f3ead9', wet: '#dcebef', shop: '#d9d7d0', stair: '#cfc6bb', istair: '#e2cdb3',
  path: '#ebe7df', open: '#cfe5c0', air: '#ffffff', void: '#ffffff', godown: '#e2ddd2' };
const NAMES = ['Ground floor', 'First floor', 'Second floor'];
const X = x => PAD + x * S, Y = z => PAD + 30 + z * S;
const esc = t => t.replace(/&/g, '&amp;').replace(/</g, '&lt;');

LV.forEach((level, i) => {
  let out = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" font-family="Arial, sans-serif">\n`;
  out += `<rect width="100%" height="100%" fill="#fff"/>\n`;
  out += `<text x="${PAD}" y="${PAD}" font-size="18" font-weight="bold">${NAMES[i]}</text>`;
  out += `<text x="${W - PAD}" y="${PAD}" font-size="12" text-anchor="end" fill="#555">Back (SW) on the left · Road (NE) on the right · sizes in feet</text>\n`;
  for (let x = 0; x <= 60; x += 5) out += `<line x1="${X(x)}" y1="${Y(0)}" x2="${X(x)}" y2="${Y(24.5)}" stroke="#eee"/>`;
  level.forEach(([name, type, x0, x1, z0, z1]) => {
    const dashed = type === 'air' || type === 'void';
    out += `<rect x="${X(x0)}" y="${Y(z0)}" width="${(x1 - x0) * S}" height="${(z1 - z0) * S}" fill="${FILL[type] || '#fff'}" stroke="#333" stroke-width="1.5"${dashed ? ' stroke-dasharray="6 4"' : ''}/>\n`;
    if (name) {
      const cx = X((x0 + x1) / 2), cy = Y((z0 + z1) / 2);
      out += `<text x="${cx}" y="${cy}" font-size="12" text-anchor="middle">${esc(name)}</text>`;
      out += `<text x="${cx}" y="${cy + 14}" font-size="10" text-anchor="middle" fill="#666">${(x1 - x0).toFixed(1)}' × ${(z1 - z0).toFixed(1)}'</text>\n`;
    }
  });
  gaps.filter(g => g[0] === i).forEach(([, ax, f, a, b]) => {
    const [x1, y1, x2, y2] = ax === 'x' ? [X(f), Y(a), X(f), Y(b)] : [X(a), Y(f), X(b), Y(f)];
    out += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#fff" stroke-width="4"/><line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#d85a30" stroke-width="1.5" stroke-dasharray="3 2"/>\n`;
  });
  out += `<text x="${PAD}" y="${H - 12}" font-size="11" fill="#d85a30">Orange dashes = door openings</text></svg>\n`;
  const file = path.join(root, 'docs', 'plans', `level-${i}-${NAMES[i].toLowerCase().replace(' ', '-')}.svg`);
  fs.writeFileSync(file, out);
  console.log('Wrote', path.relative(root, file));
});
