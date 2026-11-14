# Kundan Home – 3D design

An interactive 3D model of our house in Jamshedpur: shops and a godown at street level,
a 4-bedroom duplex home on the 1st and 2nd floors around a central courtyard, and a terrace.

Open `index.html` in a browser (it needs an internet connection to load the 3D library).

## What you can do
- **Walk in from the street**: walk through the house on foot. Use the arrow keys or W A S D
  on a computer, or the on-screen arrows on a phone. Drag to look around. Step onto a staircase
  to see the **Go up a floor** / **Go down a floor** buttons.
- **Jump into a room**: go straight to a viewpoint inside a room.
- **View buttons**: see the whole house, or cut away the walls of one floor.
- **Sunlight**: choose the season and time of day to see where the sun falls.
- **X-ray walls, airflow, neighbour houses**: switch these on or off.

## Files
| File | What it is |
| --- | --- |
| `index.html` | The page: layout, buttons, text |
| `house-data.js` | **The house itself** – rooms, doors, viewpoints. Edit this to change the design. |
| `app.js` | The 3D engine that draws the house from the data |
| `CLAUDE.md` | Project notes for Claude Code: design rules, data format, how to work |
| `docs/` | Design brief, decision log, site facts, to-do list, original drawings, 2D plans |
| `tests/walkability.test.js` | Checks every room can still be reached on foot (`npm test`) |
| `tools/make-plans.js` | Redraws the 2D plans in `docs/plans/` from the data (`npm run plans`) |

## Changing the design
All sizes are in feet. `x` runs from the back of the plot (0, south-west) to the road (60, north-east).
`z` runs from the north-west neighbour wall (0) to the south-east wall (24.5).

- A room is one line: `['Bedroom 3','room',44,56,0,12.25]` → name, type, x-from, x-to, z-from, z-to.
- A door is a gap in a wall: `[2,'x',44,8,11]` → floor 2, wall at x = 44, open from z = 8 to z = 11.
- A viewpoint: `['Living',1,32,4.5,22,13,0]` → name, floor, where you stand (x, z), where you look (x, z), look up/down.

The easiest way: open this folder in Claude Code and describe the change in plain words
("make Bedroom 3 bigger", "add a door from the lounge to the sit-out"). Claude Code reads
`CLAUDE.md`, edits the data, runs `npm run check`, and updates the decision log.

## Putting it online with GitHub Pages
1. Create a new repository on GitHub (for example `kundan-home-design`).
2. Upload `index.html`, `app.js`, `house-data.js` and this `README.md` (Add file → Upload files → Commit).
3. Go to **Settings → Pages**, choose **Deploy from a branch**, branch **main**, folder **/ (root)**, and Save.
4. After a minute the site is live at `https://<your-username>.github.io/kundan-home-design/`.
5. To change it later, edit `house-data.js` on GitHub (pencil icon) and commit – the site updates itself.

*Concept model for discussion with the architect: sizes are approximate, structure is simplified.*
