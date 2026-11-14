# CLAUDE.md – Kundan Home design project

## What this project is
A concept design for the owner's family house in **Jamshedpur, Jharkhand, India**, plus an
interactive 3D website of it (three.js, no build step). The owner is not an architect; the model is
for thinking through the design and briefing the architect. It is **not** a construction drawing.

- Building: shops + godown on the ground floor, shops + home on the 1st floor, home on the 2nd floor,
  open terrace on top. A **5-bedroom home** (2 bedrooms on the 1st floor, 3 on the 2nd) around a central courtyard.
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
| `tests/walkability.test.js` | Walks from the street through every door and stair; fails if any room is unreachable, or reachable only through a bedroom |
| `tests/furniture.test.js` | Checks furniture fits its room, clears doors and doesn't overlap |
| `tools/make-plans.js` | Regenerates 2D SVG plans in `docs/plans/` from `house-data.js` |
| `docs/` | Design brief, decision log, site facts, to-do list, the owner's original drawings |

## Commands
- `npm test`: walkability check (must pass after every layout change)
- `npm run plans`: redraw `docs/plans/*.svg`
- `npm run electrical`: regenerate the electrical drawings and `docs/electrical-schedule.md` from the layout
- `npm run check`: both
- `npm run serve`: open http://localhost:8000 to view the site (needs internet for the three.js CDN)

## Coordinate system (feet)
- `x`: 0 = back of plot (south-west) → 60 = road front (north-east). The back court is x0–2.5; the home runs to x35.
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
- Stair zones used by walk mode are hard-coded in `app.js` (`stairOpts`): single common stair x35–41 z11.5–19.5
  (ground ↔ 1st ↔ 2nd ↔ terrace; also in tests/walkability.test.js). There is no internal family stair (owner's decision). Update them if stairs move.
- Furniture and fittings live in `FURN` in `house-data.js` (one line per item; see the header there).
  `npm test` checks every item is inside a room, keeps 2 ft clear at doors and doesn't collide.
  Terrace items, grilles and jaali screens are still hard-coded in `app.js` (search `grid(`, `vbars(`).

## Design rules (agreed with the owner, keep them)
1. **Light and air without side windows.** Neighbours will build on the NW and SE walls, so no room may
   depend on a window in those walls. Light comes from the courtyard, the SW back court, skylights,
   and the NE road front.
2. **Courtyard at the centre** (x16.5–26, z10.5–18, 9.5 × 7.5 ft), open from the 1st floor to the sky; Vastu Brahmasthan.
3. **Security first.** The area is not a gated society. Glass may face only the inside courtyard.
   Every opening reachable from outside or from neighbours' roofs gets fixed steel grilles
   (courtyard and back court grids at roof level, full-height grilles on the road deck and sit-out).
4. **Privacy.** One shared stair. A lockable grille gate on the up-flight at the 1st-floor landing keeps
   shop customers below; the home's 1st-floor door opens off that landing.
5. **Vastu (owner cares about it):** master bedroom SW, kitchen SE, puja NE corner of living, open
   centre, water tank SW on the terrace. (The single stair sits on the NE side by the shops, which Vastu
   does not favour; it was the owner's choice to have only one stair.)
6. **Entrance sequence:** 1st-floor foyer → dining (courtyard tree in view) → living. Never enter through the kitchen.
7. **One efficient parallel kitchen** in the SE band (owner rejected separate wet/dry kitchens): sink under the courtyard
   window, hob + chimney opposite, fridge + pantry at the dining end. A pantry cupboard and a common bath beside it, laundry on the 2nd floor near the sit-out, built-in storage instead of bulky furniture.
8. Climate: hot summers (~40°C+), SW monsoon, mild winters. Breeze enters from the SW back court
   and exhausts up the courtyard (stack effect). Afternoon sun on the SW is shaded with jaali.

## Service rules
- Wet rooms on the 2nd floor must sit over wet rooms on the 1st floor (exception: Bath 3 over a shop, detailed for leaks).
- Every wet room drains and vents through a duct in `SHAFTS`; ducts must stay clear of furniture and doors on every floor (checked by `npm test`).
- Fanlight or ventilator above every internal door; never rely on a neighbour-wall window.

## How to work with the owner
- He writes informally and fast; restate his request clearly before acting. He likes a timestamp note
  on each prompt, and answers grounded in real owner experiences (forums, reviews), not just theory.
- Explain changes in plain language with room names, not coordinates.
- After any layout change: update `house-data.js` → move affected furniture in `app.js` → `npm run check`
  → update `docs/decisions-log.md` (and the brief if a requirement changed).
- Keep the site a static page with no build step, so it can be hosted on GitHub Pages as-is.
