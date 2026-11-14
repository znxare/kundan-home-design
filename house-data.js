// ============================================================
// HOUSE DATA - edit this file to change the house.
// Units: feet. x runs from the back (0, south-west) to the road (60, north-east).
// z runs from the north-west neighbour wall (0) to the south-east wall (24.5).
// Room row: [name, type, x0, x1, z0, z1]
// Types: room, wet (bath/kitchen/utility), shop, stair (common), istair (family),
//        path (corridor), open (open to sky with floor), air/void (no floor), godown
// Levels: 0 = ground, 1 = first floor, 2 = second floor.
// ============================================================
const LV=[
[['Godown','godown',0,35,0,24.5],['Toilet','wet',22,30,16,24.5],
['Shop','shop',35,60,0,11.5],['Common stair','stair',35,41,11.5,19.5],['Shop','shop',41,60,11.5,21.2],
['Back entry corridor','path',41,60,21.2,24.5],['','path',35,41,19.5,24.5]],
[['Back court','open',0,4,0,24.5],
['Bedroom 1','room',4,15,0,15],['Bath','wet',4,10,15,24.5],['Dress','room',10,15,15,24.5],
['Living','room',15,35,0,9],['Display wall','room',15,19,9,17],['Courtyard','open',19,27,9,17],['Dining','room',27,35,9,17],
['Home stair','istair',15,21,17,24.5],['Wet kitchen','wet',21,27,17,24.5],['Dry kitchen','room',27,31,17,24.5],['WC','wet',31,35,17,20.5],['Foyer','room',31,35,20.5,24.5],
['Shop','shop',35,60,0,11.5],['Common stair','stair',35,41,11.5,19.5],['Shop','shop',41,60,11.5,21.2],
['Passage','path',41,60,21.2,24.5],['','path',35,41,19.5,24.5]],
[['','air',0,4,0,24.5],
['Master bed','room',4,15,0,15],['Bath','wet',4,10,15,24.5],['Dress','room',10,15,15,24.5],
['Bedroom 2','room',15,27,0,9],['Study','room',15,19,9,17],['Void','void',19,27,9,17],
['Home stair','istair',15,21,17,24.5],['Gallery','room',21,27,17,19.5],['Bath 2','wet',21,27,19.5,24.5],['Lounge','room',27,35,0,17],['Lobby','room',27,35,17,24.5],
['Bath 3','wet',35,44,0,7],['Hall','room',35,44,7,17.5],['Utility','wet',35,44,17.5,24.5],
['Bedroom 3','room',44,56,0,12.25],['Deck','open',56,60,0,12.25],['Sit-out','open',44,60,12.25,24.5]]];
const BASE=[0,10.5,21];
// Door openings: [level, 'x' or 'z' (which coordinate the wall sits on), wall position, from, to]
const gaps=[
[0,'z',0,35,60], // owner, 14 Nov 2026: no wall of our own on the north-west side of the front shop (ground floor)
[0,'x',35,21.5,23.5],[0,'z',19.5,36,40],[0,'z',16,24,27],[0,'x',60,3,9],[0,'x',60,14,19],
[1,'x',35,21.5,23.5],[1,'z',19.5,36,40],[1,'z',17,27,31],[1,'x',31,20.5,24.5],[1,'z',17,15,19],[1,'z',9,15,19],[1,'z',9,28,35],
[1,'x',15,10.5,13.5],[1,'z',21.2,48,52],[1,'z',11.5,45,49],[1,'z',20.5,32,34],[1,'x',27,21,23.5],[1,'x',27,12,14.5],[1,'x',4,5,7.5],[1,'x',10,18,20.5],[1,'z',15,11,14],
[2,'z',17,27,35],[2,'x',35,8,16],[2,'x',44,8,11],[2,'z',17.5,38,41],[2,'z',7,39,42],[2,'z',17,15,19],[2,'z',9,16,18.5],[2,'x',15,10,13],
[2,'x',21,17.2,19.3],[2,'x',27,17.2,19.3],[2,'z',19.5,22,24.5],[2,'x',56,4,7],[2,'x',44,13,15.5],[2,'x',10,18,20.5],[2,'z',15,11,14]];
// Walls forced to glass: same format as gaps
const glassE=[[1,'x',27,17.5,24]];
// Walls forced solid even if they face an open space: [level,'x'|'z',fixed,from,to]
const solidE=[];

// Extra walls not made by a room's edges: [level, 'x' or 'z' (which coordinate the wall sits on), wall position, from, to]
// Owner, 14 Nov 2026: the shop corridor has an outer wall along the south-east side on the ground and 1st floors.
const extraWalls=[[0,'z',24.5,35,60],[1,'z',24.5,35,60]];

// Walls built only part of their height on site today (shown with "Site today" ticked):
// [level, 'x' or 'z', wall position, from, to, height built so far in ft]
// Owner, 14 Nov 2026: the corridor's outer wall is about half-height on the ground and 1st floors.
const siteHalf=[[0,'z',24.5,35,60,5],[1,'z',24.5,35,60,5]];

// Wall changes made in the model's Edit mode and made permanent (pasted from "Copy my changes"):
// {op:'del'|'h'|'add', lv:level, ax:'x' (wall runs along x) or 'z', f: fixed coordinate, a0..a1: extent, h: height ft}
const wallEdits=[];

// Look-inside viewpoints: [button name, level, eye x, eye z, look-at x, look-at z, look up/down]
const spots=[['Entrance view',1,34,23,23,13,0],['Living',1,32,4.5,22,13,0],['Courtyard',1,20,10,26,16,9],['Dining',1,34,15,20,12,0],['Dry kitchen',1,30.5,21.5,22,12,0],['Wet kitchen',1,26,23,21,17,0],['Bedroom 1',1,14,12,3,4,0],['Master bed',2,14,12,3,4,0],['Study by void',2,16.5,12,27,13,-2],['Family lounge',2,33,15,22,6,0],['Bedroom 3',2,45,10,60,4,0],['Sit-out',2,45.5,23,60,13,0]];
