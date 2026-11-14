# CLAUDE.md – Kundan Home design project

## What this project is
A concept design for the owner's family house in **Jamshedpur, Jharkhand, India**, plus an
interactive 3D website of it (three.js, no build step). The owner is not an architect; the model is
for thinking through the design and briefing the architect. It is **not** a construction drawing.

- Building: shops + godown on the ground floor, shops + home on the 1st floor, home on the 2nd floor,
  open terrace on top. A **4-bedroom duplex home** (1st + 2nd floor) around a central courtyard.
- Household: a couple and their son; grandparents visit and use Bedroom 1 on the 1st floor (no stairs).
- Live design brief (Claude Docs): https://claude.ai/artifact/ErsdY67Fp5bZ7CyDLRq9bj
  (private to the owner's Claude account). A copy is in `docs/design-brief.md`.
- If this repo is public (needed for free GitHub Pages), keep personal details out of committed files.

## Files
| Path | Purpose |
| --- | --- |
| `index.html` | Page layout, controls, text, CSS |
| `house-data.js` | **The design**: rooms, doors, glass/solid wall overrides, viewpoints. Most edits happen here. |
| `app.js` | 3D engine: builds walls from room rectangles, furniture, terrace, grilles, sun, airflow, walk mode |
| `tests/walkability.test.js` | Walks from the street through every door and stair; fails if any room is unreachable |
| `tools/make-plans.js` | Regenerates 2D SVG plans in `docs/plans/` from `house-data.js` |
| `docs/` | Design brief, decision log, site facts, to-do list, the owner's original drawings |

## Commands
- `npm test`: walkability check (must pass after every layout change)
- `npm run plans`: redraw `docs/plans/*.svg`
- `npm run check`: both
- `npm run serve`: open http://localhost:8000 to view the site (needs internet for the three.js CDN)

## Coordinate system (feet)
- `x`: 0 = back of plot (south-west) → 60 = road front (north-east)
- `z`: 0 = north-west neighbour wall → 24.5 = south-east neighbour wall
- Levels: 0 ground (y 0), 1 first (y 10.5), 2 second (y 21), terrace slab at y 31.5. Floor-to-floor 10.5 ft.
- Compass: north lies between +x and −z; east between +x and +z. The sun model in `app.js` uses latitude 22.8°.

## Data format (`house-data.js`)
- Room: `[name, type, x0, x1, z0, z1]`. Types: `room`, `wet`, `shop`, `stair` (common stair),
  `istair` (family stair), `path`, `open` (open to sky with a floor), `air`/`void` (no floor), `godown`.
- Walls are generated automatically on every edge of every non-open room. An edge that faces an
  open/air/void space becomes glass automatically.
- `gaps`: door openings `[level, 'x'|'z', wallPosition, from, to]`. `'x'` means the wall sits at x = wallPosition.
- `glassE` / `solidE`: force a wall stretch to glass / solid (same format as gaps).
- `spots`: "Jump into a room" viewpoints `[name, level, eyeX, eyeZ, lookX, lookZ, lookUp]`.
- Stair zones used by walk mode are hard-coded in `app.js` (`stairOpts`): common stair x35–41 z11.5–19.5
  (ground ↔ 1st only), family stair x15–21 z17–24.5 (1st ↔ 2nd ↔ terrace). Update them if stairs move.
- Furniture, terrace items, grilles and jaali screens are hard-coded boxes in `app.js` (search for `bed(`,
  `sofa(`, `grid(`, `vbars(`). Moving a room may require moving its furniture too.

## Design rules (agreed with the owner, keep them)
1. **Light and air without side windows.** Neighbours will build on the NW and SE walls, so no room may
   depend on a window in those walls. Light comes from the courtyard, the SW back court, skylights,
   and the NE road front.
2. **Courtyard at the centre** (x19–27, z9–17), open from the 1st floor to the sky; Vastu Brahmasthan.
3. **Security first.** The area is not a gated society. Glass may face only the inside courtyard.
   Every opening reachable from outside or from neighbours' roofs gets fixed steel grilles
   (courtyard and back court grids at roof level, full-height grilles on the road deck and sit-out).
4. **Privacy.** Shop customers use the common stair, which stops at the 1st floor. The family uses
   its own stair. A lockable door separates the shop landing from the home.
5. **Vastu (owner cares about it):** master bedroom SW, kitchen SE, puja NE corner of living, open
   centre, water tank SW on the terrace, family stair on the south side climbing clockwise.
6. **Entrance view:** from the 1st-floor foyer you must see the courtyard tree, not a wall.
7. **Wet + dry kitchen**, laundry on the 2nd floor near the sit-out, built-in storage instead of bulky furniture.
8. Climate: hot summers (~40°C+), SW monsoon, mild winters. Breeze enters from the SW back court
   and exhausts up the courtyard (stack effect). Afternoon sun on the SW is shaded with jaali.

## How to work with the owner
- He writes informally and fast; restate his request clearly before acting. He likes a timestamp note
  on each prompt, and answers grounded in real owner experiences (forums, reviews), not just theory.
- Explain changes in plain language with room names, not coordinates.
- After any layout change: update `house-data.js` → move affected furniture in `app.js` → `npm run check`
  → update `docs/decisions-log.md` (and the brief if a requirement changed).
- Keep the site a static page with no build step, so it can be hosted on GitHub Pages as-is.
