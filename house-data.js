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
[['Back court','open',0,2.5,0,24.5],
['Bedroom 1','room',2.5,13.5,0,11.5],['Bath 1','wet',2.5,7.5,11.5,17],['','room',7.5,13.5,11.5,17],['Bedroom 2','room',2.5,13.5,17,24.5],
['Living','room',13.5,35,0,10.5],['Passage','room',13.5,16.5,10.5,18],['Courtyard','open',16.5,26,10.5,18],['Dining','room',26,35,10.5,18],
['Common bath','wet',13.5,17.5,18,24.5],['Kitchen','wet',17.5,31,18,24.5],['Foyer','room',31,35,18,24.5],
['Shop','shop',35,60,0,11.5],['Common stair','stair',35,41,11.5,19.5],['Shop','shop',41,60,11.5,21.2],
['Passage','path',41,60,21.2,24.5],['','path',35,41,19.5,24.5]],
[['','air',0,2.5,0,24.5],
['Master bed','room',2.5,13.5,0,11.5],['','room',13.5,16.5,0,10.5],['Master bath','wet',2.5,7.5,11.5,17],['Dress','room',7.5,13.5,11.5,17],['Office','room',2.5,13.5,17,24.5],
['Bedroom 3','room',16.5,31,0,10.5],['Bedroom 3 wardrobe','room',31,35,0,7],['Hall','room',31,35,7,10.5],['Study','room',13.5,16.5,10.5,20.5],['Bath 2','wet',13.5,17.5,20.5,24.5],['Void','void',16.5,26,10.5,18],
['Gallery','room',16.5,26,18,20.5],['Laundry','wet',17.5,21.5,20.5,24.5],['Family nook','room',21.5,26,20.5,24.5],['Lounge','room',26,35,10.5,18],['Lobby','room',26,35,18,24.5],
['Bath 3','wet',35,44,0,7],['Hall','room',35,44,7,11.5],['Linen','room',41,44,11.5,19.5],['Stair','stair',35,41,11.5,19.5],['Upper lobby','room',35,44,19.5,24.5],
['Bedroom 4','room',44,56,0,12.25],['Deck','open',56,60,0,12.25],['Sit-out','open',44,60,12.25,24.5]]];
const BASE=[0,10.5,21];
// Door openings: [level, 'x' or 'z' (which coordinate the wall sits on), wall position, from, to]
const gaps=[
[0,'z',0,35,60], // owner, 14 Nov 2026: no wall of our own on the north-west side of the front shop (ground floor)
[0,'x',35,21.5,23.5],[0,'z',19.5,36,40],[0,'z',16,24,27],[0,'x',60,3,9],[0,'x',60,14,19],
[1,'x',35,19.6,21.4],[1,'z',19.5,36,40],[1,'z',18,31,35],[1,'z',10.5,13.5,16.5],[1,'z',10.5,26.5,35],[1,'z',10.5,23,25.8],[1,'z',18,26.3,30.9],[1,'x',26,12.5,15],
[1,'x',2.5,5,7.5],[1,'x',13.5,7.8,10.3],[1,'z',11.5,4,6.5],[1,'x',13.5,14,16.8],[1,'z',17,7.5,13.5],[1,'z',18,13.8,16.2],
[1,'z',21.2,48,52],[1,'z',11.5,45,49],
[2,'z',18,26,35],[2,'x',35,20,24],[2,'z',19.5,36,40],[2,'x',44,20,23],[2,'x',35,7.3,10.3],[2,'z',10.5,31,33.8],[2,'x',31,7.5,10.2],[2,'x',31,4,6.5],[2,'x',13.5,0,10.5],[2,'z',7,39,42],[2,'x',44,8,11],[2,'z',11.5,41.4,43.9],[2,'x',56,4,7],
[2,'x',13.5,12,14.5],[2,'z',11.5,8.5,11.5],[2,'x',7.5,13,16],[2,'x',13.5,17.4,20.1],[2,'z',20.5,13.8,16.2],[2,'x',16.5,18.2,20.3],[2,'x',26,18.2,20.3],[2,'z',20.5,18,20.5],[2,'z',20.5,21.9,25.6]];
// Walls forced to glass: same format as gaps
const glassE=[];
// Walls forced solid even if they face an open space: [level,'x'|'z',fixed,from,to]
const solidE=[[1,'x',2.5,11.5,17],[2,'x',2.5,11.5,17]];

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
const spots=[['Entrance view',1,34,20.5,22,13,0],['Living',1,32,4,18,13,0],['Courtyard',1,19,12,25,17,9],['Dining',1,34,13,20,12,0],['Kitchen',1,30,21.5,20,19,0],['Bedroom 1',1,12.5,9.5,2.5,4,0],['Bedroom 2',1,12.8,14.6,5,21.5,0],['Master bed',2,15.8,9.6,6,3,0],['Bedroom 3',2,30.2,9.6,22,3,0],['Upper lobby',2,42,22,30,14,0],['Study by void',2,15,14,26,14.5,-2],['Family lounge',2,33.5,17,28.5,11,0],['Bedroom 4',2,45,10,60,4,0],['Sit-out',2,45.5,23,60,13,0]];

// ============================================================
// FURNITURE AND FITTINGS
// [level, name, x0, x1, z0, z1, height above floor, item height, material, show label (1/0), span (1 = may cross an open boundary)]
// Materials: wood, fabric, linen, steel, white, black, counter, stone, glass, plant, concrete
// ============================================================
const FURN=[];
const F_=(l,n,x0,x1,z0,z1,y,h,m,lab,span)=>FURN.push([l,n,x0,x1,z0,z1,y,h,m,lab||0,span||0]);
// bed with headboard against the z0 wall (queen ~5.5 x 6.6 ft)
const bedAt=(l,x0,x1,z0,z1,lab)=>{F_(l,lab||'Bed',x0,x1,z0,z1,0,1.8,'linen',1);F_(l,'Headboard',x0,x1,z0-0.4,z0,0,3.6,'wood');};

// ---------- 1st floor ----------
// Living: TV on the north-west wall, sofa facing it, puja niche in the north corner
F_(1,'TV unit',16.7,23.7,0.25,1.7,0,1.5,'wood');F_(1,'TV',17.7,22.7,0.25,0.4,2.5,3.2,'black',1);
F_(1,'Sofa',16.7,22.7,7.1,10.1,0,1.5,'fabric',1);F_(1,'Sofa back',16.7,22.7,9.5,10.1,1.5,1.5,'fabric');
F_(1,'Coffee table',17.7,21.7,4,6,0,1.3,'wood');F_(1,'Rug',16.2,23.2,3,7,0,0.03,'linen');
F_(1,'Armchair',24,26,1.5,3.5,0,2.6,'fabric');F_(1,'Armchair',24,26,4,6,0,2.6,'fabric');
F_(1,'Puja niche',33.2,34.8,0.3,2.2,0,4,'wood',1);
// Dining: 9 x 7.5 ft, 6-seater, opens fully to the living room and to the courtyard
F_(1,'Dining table (6-seater)',28.1,33.6,12.3,15.3,0,2.5,'wood',1);
[29.1,31,32.9].forEach(x=>{F_(1,'Chair',x-0.5,x+0.5,11.9,12.25,0,1.6,'fabric');F_(1,'Chair',x-0.5,x+0.5,15.35,15.95,0,1.6,'fabric');});
F_(1,'Crockery sideboard',26.2,27.2,16.2,17.9,0,3,'wood',1);
// Foyer: shoe bench and tall shoe tower
F_(1,'Shoe bench',31.3,32.6,20.1,22.9,0,1.5,'wood',1);F_(1,'Shoe tower',31.3,32.6,23,24.3,0,7,'wood');
// Kitchen (13.5 x 6.5 ft parallel): sink + dishwasher under the courtyard window, hob + chimney opposite,
// fridge + tall pantry at the dining end, tall storage unit at the duct end
F_(1,'Sink counter',18.2,25.8,18.2,19.8,0,3,'counter');F_(1,'Sink',20,21.6,18.4,19.5,3,0.1,'steel',1);F_(1,'Dishwasher slot',21.8,23.1,19.8,19.85,0,2.6,'steel',1);
F_(1,'Hob counter',19.1,29.1,22.7,24.3,0,3,'counter');F_(1,'Hob',22,24.2,23,24,3,0.1,'black',1);
F_(1,'Chimney',22,24.2,23.2,24.3,5.8,2,'steel',1);F_(1,'Chimney duct to Duct K',19.1,22,23.8,24.3,7.8,0.6,'steel');
F_(1,'LPG cabinet (vented)',25.4,26.6,22.62,22.68,0,2.6,'wood',1);F_(1,'Microwave',26.3,27.9,23.2,24.2,3,1,'steel',1);F_(1,'RO purifier',28.2,29,23.9,24.3,3.9,1,'white',1);
F_(1,'Wall cabinets',24.5,29.1,23.4,24.3,5,2.5,'white');F_(1,'Wall cabinets',19.1,21.8,23.4,24.3,5,2.5,'white');
F_(1,'Fridge',29.3,30.9,22.4,24.4,0,6,'steel',1);F_(1,'Tall pantry',29.3,30.9,20.4,22.3,0,7,'wood',1);F_(1,'Tall storage unit',17.6,19,19.9,22.9,0,7,'wood',1);
// Common bath: towel niche, basin, WC, shower
F_(1,'Towel & linen niche',13.8,14.9,20.6,21.8,0,7,'wood');F_(1,'Basin',16.1,17.3,20.2,21.4,2.6,0.5,'white');
F_(1,'WC',15.9,17.3,22.9,24.3,0,1.3,'white');F_(1,'Shower glass',15.6,15.65,22.4,24.5,0,6.5,'glass');
// Bedroom 1 (parents)
bedAt(1,5.5,11,0.6,7.2,'Bed');F_(1,'Wardrobe',7.5,11.3,9.6,11.4,0,7,'wood',1);
// Bath 1 (en suite to Bedroom 1)
F_(1,'Shower glass',4.9,4.95,15,16.9,0,6.5,'glass');F_(1,'WC',5.9,7.3,15.4,16.8,0,1.3,'white');F_(1,'Basin',2.8,4.1,13.6,14.8,2.6,0.5,'white');
// Inverter + cleaning cupboard: in the foyer corner (vented), since the old lobby is now part of Bedroom 2
F_(1,'Inverter & cleaning cupboard',33.4,34.9,22,24.4,0,7,'wood',1);
// Bedroom 2
// Bedroom 2: 11 x 7.5 ft sleeping area + 6 x 5.5 ft dressing/study nook (the unnamed room x7.5-13.5, z11.5-17, was the lobby)
F_(1,'Bed (5 x 6.5 ft)',3.2,8.2,17.6,24.1,0,1.8,'linen',1);F_(1,'Headboard',3.2,8.2,24.1,24.4,0,3.6,'wood');F_(1,'Bedside table',8.4,9.6,22.6,24.2,0,1.8,'wood');
F_(1,'Reading chair',11,12.9,21.4,23.4,0,2.6,'fabric');F_(1,'Rug',8.6,12.8,18.4,21,0,0.03,'fabric');
F_(1,'Wardrobe',7.7,13.3,11.6,13.6,0,7,'wood',1);F_(1,'Study desk',7.7,9.3,14,16.8,0,2.5,'wood',1);F_(1,'Desk chair',9.5,10.8,14.8,16,0,2.8,'fabric');
// Back court drying rack; courtyard drains
F_(1,'Drying rack',0.4,2.1,9,15,5.5,0.1,'steel',1);
F_(1,'Floor drain 1 (100 mm)',16.8,17.5,10.8,11.5,0,0.03,'steel',1);F_(1,'Floor drain 2 (overflow)',25,25.7,17,17.7,0,0.03,'steel',1);
// ---------- 2nd floor ----------
// Master bedroom: 14 x 11.5 ft (the unnamed room x13.5-16.5 is its bay, open to it; grew into the old Bedroom 3 corner). King bed, bedside tables, wardrobe + easy chair in the bay
bedAt(2,6.5,12.5,0.6,7.2,'Master bed (king)');F_(2,'Bedside table',5,6.3,0.5,2,0,1.8,'wood');F_(2,'Bedside table',12.7,13.4,0.5,2,0,1.8,'wood');
F_(2,'Wardrobe',14.4,16.4,0.3,6.5,0,7,'wood',1);F_(2,'Easy chair',14.4,16.2,7.4,9.4,0,2.6,'fabric');F_(2,'Rug',5.5,13.4,7.4,9.4,0,0.03,'fabric');
F_(2,'Wardrobe',9.7,13.3,15.3,16.9,0,7,'wood',1);
F_(2,'WC',2.8,4.3,11.8,13.2,0,1.3,'white');F_(2,'Basin',4.1,5.4,15.7,16.9,2.6,0.5,'white');
F_(2,'Desk',2.9,6.9,17.3,19.3,0,2.5,'wood',1);F_(2,'Office chair',4.1,5.5,19.6,20.9,0,2.8,'fabric');
F_(2,'Files & suitcase shelves',2.8,11,23.4,24.3,0,7,'wood',1);F_(2,'Sofa-cum-bed',7.5,11.3,20.2,22.6,0,1.6,'fabric',1);
F_(2,'WC',15.9,17.3,23,24.3,0,1.3,'white');F_(2,'Corner basin',14.9,15.8,23.3,24.3,2.6,0.5,'white');
F_(2,'Washing machine',19.2,20.9,22.7,24.3,0,3,'white',1);F_(2,'Dryer (stacked)',19.2,20.9,22.7,24.3,3,2.8,'white');
F_(2,'Utility sink',20.6,21.4,20.7,22.4,0,3,'counter');F_(2,'Pulley drying rack',17.8,21.2,20.8,22.4,7.2,0.1,'steel',1);
F_(2,'Sofa',22,25.6,22.6,24.3,0,1.6,'fabric',1);
// Bedroom 3: 14.5 x 10.5 ft with a 4 x 7 ft walk-in wardrobe; study desk at the void window
bedAt(2,21.5,27,0.6,7.2,'Bed');F_(2,'Bedside table',20,21.3,0.5,2,0,1.8,'wood');F_(2,'Bedside table',27.2,28.5,0.5,2,0,1.8,'wood');
F_(2,'Study desk',18.1,21.6,8.8,10.3,0,2.5,'wood',1);F_(2,'Desk chair',19.2,20.6,7.2,8.5,0,2.8,'fabric');F_(2,'Rug',21,27.5,7.4,9.6,0,0.03,'fabric');
F_(2,'Wardrobe',31.2,34.8,0.2,2.2,0,7,'wood',1);F_(2,'Wardrobe',33.2,34.8,2.4,6.8,0,7,'wood');
// Lounge (9 x 7.5 ft, open to the lobby): TV on the Bedroom 3 wall, sofa facing it
F_(2,'Sofa',26.6,31.4,15.4,17.8,0,1.5,'fabric',1);F_(2,'Sofa back',26.6,31.4,17.2,17.8,1.5,1.5,'fabric');
F_(2,'Coffee table',27.7,30.3,13,14.5,0,1.3,'wood');F_(2,'TV unit',26.8,30.6,10.6,11.9,0,1.5,'wood');F_(2,'TV',27.2,30.2,10.6,10.75,2.6,3.2,'black',1);
F_(2,'WC',35.3,36.8,0.5,2,0,1.3,'white');F_(2,'Basin',39.8,41.4,0.3,1.5,2.6,0.5,'white');F_(2,'Shower glass',38,38.05,3.8,6.8,0,6.5,'glass');
F_(2,'Linen shelves',41.2,43.8,15,19.3,0,7,'wood');
bedAt(2,47,53,0.6,7.2,'Bed');F_(2,'Wardrobe',44.2,46.1,0.5,7,0,7,'wood');
F_(2,'Planter',46,58,23,24.2,0,1.5,'concrete');F_(2,'Pulley drying rack',53,59,17,21,7,0.1,'steel',1);
F_(2,'Chair',47.2,48.8,14.2,15.8,0,1.6,'wood');F_(2,'Chair',51.2,52.8,14.2,15.8,0,1.6,'wood');F_(2,'Side table',49.3,50.7,14.3,15.7,0,2,'wood');

// ============================================================
// SERVICE DUCTS: run from the ground floor to above the terrace
// [name, x0, x1, z0, z1, what runs inside]
// ============================================================
const SHAFTS=[
['Duct A',2.5,3.9,15.6,17,'Bath 1 + Master bath: soil/waste stack, vent, exhaust'],
['Duct B',13.5,14.8,23.2,24.5,'Common bath + Bath 2: soil/waste stack, vent, exhaust'],
['Duct K',17.5,19,23,24.5,'Kitchen chimney duct, kitchen + laundry waste, AC drains'],
['Duct C',42.6,44,0,1.4,'Bath 3: soil/waste stack, vent, exhaust (boxed through the shop below)'],
['Duct E',33.9,35,11.1,12.3,'Electrical riser: meters to floor boards, inverter, solar, CCTV, data']];
