
{
const fig=document.getElementById('fig');
const start=()=>{
if(!window.THREE){document.getElementById('err').hidden=false;return;}
const T=THREE;
let R;
try{R=new T.WebGLRenderer({antialias:true,alpha:true});}catch(e){document.getElementById('err').hidden=false;return;}
R.setPixelRatio(Math.min(2,window.devicePixelRatio||1));
R.shadowMap.enabled=true;R.shadowMap.type=T.PCFSoftShadowMap;
fig.appendChild(R.domElement);
const cv=R.domElement;
const S=new T.Scene();
const cam=new T.PerspectiveCamera(38,1,1,1200);
S.add(new T.HemisphereLight(0xffffff,0x8a8274,0.62));
const sun=new T.DirectionalLight(0xfff1d6,0.9);
sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);
const sc=sun.shadow.camera;sc.left=-55;sc.right=55;sc.top=55;sc.bottom=-55;sc.near=1;sc.far=330;sun.shadow.bias=-0.0006;
S.add(sun);sun.target.position.set(30,0,12);S.add(sun.target);

const mats={};
const M=(c,o)=>{o=o===undefined?1:o;const k=c+'_'+o;if(!mats[k])mats[k]=new T.MeshLambertMaterial({color:c,transparent:o<1,opacity:o,depthWrite:o>=0.6});return mats[k];};
const box=(g,x0,x1,y0,y1,z0,z1,c,o)=>{o=o===undefined?1:o;const m=new T.Mesh(new T.BoxGeometry(x1-x0,y1-y0,z1-z0),M(c,o));m.position.set((x0+x1)/2,(y0+y1)/2,(z0+z1)/2);if(o>=0.6){m.castShadow=true;m.receiveShadow=true;}g.add(m);return m;};
const C={wall:0xf3f0e8,room:0xdcc6a2,wet:0xc9dde2,shop:0xbdbbb4,stair:0xa89c8e,path:0xcac3b5,open:0x8fb46f,glass:0x9fcfe6,jaali:0xc0663a,shutter:0x6c7075,wood:0x8a5a34,slab:0xe9e6df,leaf:0x5d8f45};


function label(g,txt,x,y,z,s){s=s||1;const c=document.createElement('canvas');const ctx=c.getContext('2d');const font='500 40px "Hanken Grotesk",sans-serif';ctx.font=font;const w=Math.ceil(ctx.measureText(txt).width)+36;c.width=w;c.height=64;const x2=c.getContext('2d');x2.font=font;x2.fillStyle='rgba(255,255,255,0.92)';x2.fillRect(0,0,w,64);x2.fillStyle='#111';x2.textBaseline='middle';x2.fillText(txt,18,34);const tx=new T.CanvasTexture(c);tx.minFilter=T.LinearFilter;const sp=new T.Sprite(new T.SpriteMaterial({map:tx,depthTest:false}));const h=1.7*s;sp.scale.set(h*w/64,h,1);sp.position.set(x,y,z);sp.renderOrder=10;g.add(sp);return sp;}

const walls=[];
const inR=(p,r)=>p[0]>r[2]&&p[0]<r[3]&&p[1]>r[4]&&p[1]<r[5];
function seg(g,ax,f,a0,a1,base,k,t,lv){
const fx=ax==='x'?'z':'x';
const hs=(typeof siteHalf!=='undefined'?siteHalf:[]).filter(q=>q[0]===lv&&q[1]===fx&&Math.abs(q[2]-f)<1e-6&&q[3]<a1&&q[4]>a0);
if(!hs.length){seg0(g,ax,f,a0,a1,base,k,t,lv,0);return;}
const cuts=[a0,a1];hs.forEach(q=>{if(q[3]>a0)cuts.push(q[3]);if(q[4]<a1)cuts.push(q[4]);});
cuts.sort((p,q)=>p-q);
for(let i=0;i<cuts.length-1;i++){const p0=cuts[i],p1=cuts[i+1];if(p1-p0<1e-6)continue;const mid=(p0+p1)/2;
const q=hs.find(q=>mid>q[3]&&mid<q[4]);seg0(g,ax,f,p0,p1,base,k,t,lv,q?q[5]:0);}
}
function seg0(g,ax,f,a0,a1,base,k,t,lv,site){
let c=k==='glass'?C.glass:C.wall,o=k==='glass'?0.32:1;
if(t==='shop'&&ax==='z'&&f===60){if(lv===0)c=C.shutter;else{c=C.glass;o=0.32;}}
const th=0.2;
const m=ax==='x'?box(g,a0,a1,0,1,f-th,f+th,c,o):box(g,f-th,f+th,0,1,a0,a1,c,o);
walls.push({m:m,base:base,lvl:lv,site:site,orig:m.material,b:ax==='x'?[a0,a1,f-th,f+th]:[f-th,f+th,a0,a1]});
}
function build(level,base,g,lab,lv){
const opens=level.filter(r=>r[1]==='open'||r[1]==='air'||r[1]==='void');
const myg=gaps.filter(q=>q[0]===lv),mye=glassE.filter(q=>q[0]===lv),mys=solidE.filter(q=>q[0]===lv);
level.forEach(r=>{
const n=r[0],t=r[1],x0=r[2],x1=r[3],z0=r[4],z1=r[5];
const fc={room:C.room,wet:C.wet,shop:C.shop,path:C.path,open:C.open,godown:0xb9b2a3}[t];
if(fc!==undefined)box(g,x0,x1,base-0.5,base+(t==='wet'?0.03:0),z0,z1,fc);
if(n)label(lab,n,(x0+x1)/2,base+5,(z0+z1)/2,0.9);
if(t==='open'||t==='air'||t==='void'||t==='path')return;
const edges=[['x',z0,x0,x1,0,-1],['x',z1,x0,x1,0,1],['z',x0,z0,z1,-1,0],['z',x1,z0,z1,1,0]];
edges.forEach(e=>{
const ax=e[0],f=e[1],a0=e[2],a1=e[3],nx=e[4],nz=e[5];const fixed=ax==='x'?'z':'x';
let run=null;const st=0.25;
const flush=end=>{if(run){seg(g,ax,f,run.a,end,base,run.k,t,lv);run=null;}};
for(let a=a0;a<a1-1e-6;a+=st){
const m=a+st/2;
const p=ax==='x'?[m,f+nz*0.3]:[f+nx*0.3,m];
let k='solid';
if(myg.some(q=>q[1]===fixed&&Math.abs(q[2]-f)<1e-6&&m>q[3]&&m<q[4]))k=null;
else if(mys.some(q=>q[1]===fixed&&Math.abs(q[2]-f)<1e-6&&m>q[3]&&m<q[4]))k='solid';
else if(mye.some(q=>q[1]===fixed&&Math.abs(q[2]-f)<1e-6&&m>q[3]&&m<q[4]))k='glass';
else if(opens.some(o=>inR(p,o)))k='glass';
if(!run||run.k!==k){flush(a);if(k)run={a:a,k:k};}
}
flush(a1);
});
});
(typeof extraWalls!=='undefined'?extraWalls:[]).filter(q=>q[0]===lv).forEach(q=>seg(g,q[1]==='z'?'x':'z',q[2],q[3],q[4],base,'solid','path',lv));
}
const G=[new T.Group(),new T.Group(),new T.Group()],LB=[new T.Group(),new T.Group(),new T.Group()];
const gT=new T.Group(),gP=new T.Group(),gN=new T.Group(),air=new T.Group(),labT=new T.Group(),gC=new T.Group();
G.concat(LB,[gT,gP,gN,air,labT,gC]).forEach(g=>S.add(g));
LV.forEach((l,i)=>build(l,BASE[i],G[i],LB[i],i));

function stairs(g,base){const rh=10.5/18,rn=0.845;
for(let i=0;i<9;i++)box(g,35.2,38,base,base+(i+1)*rh,19.3-(i+1)*rn,19.3-i*rn,C.stair);
for(let j=0;j<9;j++)box(g,38,40.8,base,base+5.25+(j+1)*rh,11.7+j*rn,11.7+(j+1)*rn,C.stair);}
function istair(g,base){const rh=10.5/18,rn=0.62;
for(let i=0;i<9;i++){const t=base+(i+1)*rh;box(g,15.2+i*rn,15.2+(i+1)*rn,t-0.15,t,17.2,20.8,C.wood);}
for(let j=0;j<9;j++){const t=base+5.25+(j+1)*rh;box(g,20.8-(j+1)*rn,20.8-j*rn,t-0.15,t,20.9,24.3,C.wood);}
box(g,15.1,21,base,base+10.5,20.82,20.88,0x55575a,0.5);}
stairs(G[0],0);istair(G[1],10.5);istair(G[2],21);

box(S,-40,100,-0.62,-0.52,-40,65,0xd6d1c6);
const tree=(g,x,z,b,h,r)=>{const m=new T.Mesh(new T.CylinderGeometry(0.3,0.4,h,10),M(C.wood));m.position.set(x,b+h/2,z);m.castShadow=true;g.add(m);const s=new T.Mesh(new T.SphereGeometry(r,18,14),M(C.leaf));s.position.set(x,b+h,z);s.castShadow=true;s.receiveShadow=true;g.add(s);};
box(G[1],-0.2,0.2,10.5,17.5,0,24.5,C.jaali,0.8);
box(G[1],0,4,10.5,31,-0.2,0.2,C.wall);box(G[1],0,4,10.5,31,24.3,24.7,C.wall);
box(G[1],3.45,3.75,11,18.5,1,14,C.jaali,0.7);
box(G[1],20.5,25.5,10,10.08,10,12,C.glass,0.7);
box(G[1],21,25,10.5,12,13,16,0x9a958c);tree(G[1],23,14.5,12,8,2.6);
tree(G[1],2,6,10.5,5,1.4);
box(G[1],59.8,60.2,10.5,14,21.2,24.5,C.wall);
box(G[2],3.45,3.75,21.5,30,1,14,C.jaali,0.7);
box(G[2],44,60,21,28,24.3,24.7,C.wall);
const GR=0x2b2b2b;
const vbars=(g,x,z0,z1,y0,y1,sp)=>{for(let z=z0+sp/2;z<z1;z+=sp)box(g,x-0.04,x+0.04,y0,y1,z-0.04,z+0.04,GR);box(g,x-0.06,x+0.06,y0,y0+0.12,z0,z1,GR);box(g,x-0.06,x+0.06,y1-0.12,y1,z0,z1,GR);};
const xbars=(g,z,x0,x1,y0,y1,sp)=>{for(let x=x0+sp/2;x<x1;x+=sp)box(g,x-0.04,x+0.04,y0,y1,z-0.04,z+0.04,GR);box(g,x0,x1,y1-0.12,y1,z-0.06,z+0.06,GR);};
const grid=(g,x0,x1,z0,z1,y,sp)=>{for(let x=x0+sp/2;x<x1;x+=sp)box(g,x-0.05,x+0.05,y,y+0.12,z0,z1,GR);for(let z=z0+sp/2;z<z1;z+=sp)box(g,x0,x1,y,y+0.12,z-0.05,z+0.05,GR);};
vbars(G[2],59.9,0,24.5,21,30.6,0.5);
xbars(G[2],24.5,44,60,28,30.6,0.5);
grid(G[2],44,60,12.25,24.5,30.6,1);grid(G[2],56,60,0,12.25,30.6,1);
grid(G[2],19,27,9,17,31.1,1);
grid(G[2],0,4,0,24.5,31.1,1);
vbars(G[1],-0.05,0,24.5,17.5,31,0.6);
box(G[2],46,58,21,22.5,23,24.2,0x9a958c);box(G[2],46,58,22.5,23,23,24.2,C.leaf);
for(let x=45;x<=59;x+=2)box(gP,x-0.2,x+0.2,30,30.4,12.25,24.5,C.wood);
box(gP,59.2,59.6,21,30,12.6,13,C.wood);box(gP,59.2,59.6,21,30,23.8,24.2,C.wood);

const F=0xf2efe8,W2=0x9b6b43,SO=0x5b6b7a;
const bed=(g,b,x0,x1,z0,z1)=>{box(g,x0,x1,b,b+1.8,z0,z1,F);box(g,x0,x1,b,b+3.6,z0,z0+0.4,W2);box(g,x0+0.5,x1-0.5,b+1.8,b+2.2,z0+0.6,z0+1.8,0xffffff);};
bed(G[1],10.5,7,12.5,0.6,7.2);bed(G[2],21,6.5,13,0.6,7.2);bed(G[2],21,22,26.5,0.6,7);bed(G[2],21,47,53,0.6,7.2);
const sofa=(g,b,x0,x1,z0)=>{box(g,x0,x1,b,b+1.5,z0,z0+3,SO);box(g,x0,x1,b,b+3,z0,z0+0.8,SO);};
sofa(G[1],10.5,23,31,0.4);sofa(G[2],21,28,34.5,0.4);
box(G[1],25,29,10.5,11.9,4.5,6.5,W2);
box(G[1],29,33.5,10.5,13,11.2,14.8,W2);[29.6,31.2,32.8].forEach(x=>{box(G[1],x-0.5,x+0.5,10.5,12,10.2,11,SO);box(G[1],x-0.5,x+0.5,10.5,12,15,15.8,SO);});
box(G[1],21.3,26.7,10.5,13.4,22.3,24.3,0x7a7c80);box(G[1],21.3,23.3,10.5,13.4,18,22.3,0x7a7c80);box(G[1],21.3,26.7,16,18.5,22.8,24.3,0xe6e2da);
box(G[1],27.6,30.6,10.5,13.5,17.7,19.6,0xe6e2da);box(G[1],27.3,29.2,10.5,17,22.3,24.3,0xb8bcc0);box(G[1],29.2,30.8,10.5,17.5,22.3,24.3,W2);
box(G[1],33.2,34.8,10.5,14.5,0.3,2.2,W2);label(LB[1],'Puja',34,15.5,1.2,0.9);
box(G[2],36,38.5,21,24,22,24.3,0xffffff);
box(G[1],15.3,16.5,10.5,14,11,15,W2);
box(G[1],10.3,14.7,10.5,17.5,23.3,24.3,W2);box(G[2],10.3,14.7,21,28,23.3,24.3,W2);
box(G[2],15.3,17.5,21,23.5,10,16,W2);
box(G[0],36,58,0,7,0.4,2,0xd9d4c8);box(G[1],36,58,10.5,17.5,0.4,2,0xd9d4c8);
box(G[0],3,20,0,5,1,6,0x9a8a70);box(G[0],3,15,0,4,10,15,0x9a8a70);
[[48,15],[52,15]].forEach(p=>box(G[2],p[0]-0.8,p[0]+0.8,21,22.6,p[1]-0.8,p[1]+0.8,W2));box(G[2],49.3,50.7,21,23,14.3,15.7,W2);
S.add(new T.AmbientLight(0xffffff,0.12));
const TY=31.5;
[[4,15,0,24.5],[15,19,0,17],[19,27,0,9],[21,27,17,24.5],[27,44,0,24.5],[44,56,0,12.25]].forEach(s=>box(gT,s[0],s[1],TY-0.5,TY,s[2],s[3],C.slab));
[['x',0,4,56],['x',24.5,4,15],['x',24.5,21,44],['z',4,0,24.5],['z',44,12.25,24.5],['x',12.25,44,56],['z',56,0,12.25]].forEach(p=>{if(p[0]==='x')box(gT,p[2],p[3],TY,TY+3.5,p[1]-0.2,p[1]+0.2,C.wall);else box(gT,p[1]-0.2,p[1]+0.2,TY,TY+3.5,p[2],p[3],C.wall);});
box(gT,15,21,TY,TY+8,16.8,17.2,C.wall);box(gT,15,21,TY,TY+8,24.3,24.7,C.wall);box(gT,14.8,15.2,TY,TY+8,17,24.5,C.wall);
box(gT,20.8,21.2,TY,TY+8,17,24.5,C.glass,0.35);
box(gT,14.6,21.4,TY+8,TY+8.5,16.6,24.9,C.slab);
const tank=new T.Mesh(new T.CylinderGeometry(2,2,4,20),M(0x2a2a2a));tank.position.set(7.5,TY+9,12);[[5.6,10.1],[9.1,10.1],[5.6,13.6],[9.1,13.6]].forEach(p=>box(gT,p[0],p[0]+0.3,TY,TY+7,p[1],p[1]+0.3,0x55575a));box(gT,5.4,9.6,TY+7,TY+7.2,9.9,14.1,0x55575a);
{const sw=new T.Mesh(new T.BoxGeometry(5,0.2,3),M(0x22344e));sw.position.set(11.5,TY+1.2,6);sw.rotation.x=0.5;sw.castShadow=true;gT.add(sw);}tank.castShadow=true;gT.add(tank);
[[19,9],[27,9],[19,17],[27,17]].forEach(p=>box(gT,p[0]-0.25,p[0]+0.25,TY,TY+3,p[1]-0.25,p[1]+0.25,0x55575a));
[0.8,1.6,2.4].forEach(d=>{const y=TY+d;box(gT,19,27,y,y+0.12,8.85,9.15,C.wall);box(gT,19,27,y,y+0.12,16.85,17.15,C.wall);box(gT,18.85,19.15,y,y+0.12,9,17,C.wall);box(gT,26.85,27.15,y,y+0.12,9,17,C.wall);});
box(gT,18.4,27.6,TY+3,TY+3.25,8.4,17.6,0xbfe3f2,0.38);
box(gT,36.5,43.5,TY,TY+0.4,9,15,C.glass,0.5);
for(let i=0;i<3;i++){const gr=new T.Group();gr.position.set(34+i*4.5,TY+1.4,4.5);gr.rotation.y=-Math.PI/4;const p=new T.Mesh(new T.BoxGeometry(4,0.12,3),M(0x22344e));p.rotation.x=0.4;p.castShadow=true;gr.add(p);gT.add(gr);}
box(gT,5,14,TY,TY+1.2,1,2.4,0x9a958c);box(gT,5,14,TY+1.2,TY+1.8,1,2.4,C.leaf);
box(gT,5,14,TY,TY+1.2,22.1,23.5,0x9a958c);box(gT,5,14,TY+1.2,TY+1.8,22.1,23.5,C.leaf);
label(labT,'Courtyard cap',23,TY+6.5,13);label(labT,'Home stair skylight',18,TY+10,20.8);label(labT,'Water tank (SW)',7.5,TY+13,12);label(labT,'Solar water heater',11.5,TY+4,6);label(labT,'Solar panels',38.5,TY+5,4.5);label(labT,'Terrace garden',9.5,TY+4,12);label(labT,'Hall skylight',40,TY+3,12);label(labT,'Open sit-out',52,25,18);label(labT,'Shops + godown',50,5,5);

box(gN,0,60,-0.5,34,-14,-0.35,0xb5b3ac,0.28);box(gN,0,60,-0.5,34,24.85,38,0xb5b3ac,0.28);
label(labT,'Steel grille over courtyard',23,TY+9,9);label(gC,'Road side · NE',68,2,12);label(gC,'Back · SW',-8,2,12);label(gC,'NW neighbour',30,2,-4);label(gC,'SE neighbour',30,2,29);

const paths=[[[-8,14,12],[3,14,12],[16,14.5,12.5],[23,15,13],[23,TY+1.8,13],[23,TY+1.8,4],[23,TY+9,-2]],[[-8,25,7],[3,25,7],[12,25,8],[23,26,12],[23,TY+1.8,12.5],[23,TY+1.8,21],[23,TY+9,27]]];
const cum=p=>{const c=[0];for(let i=1;i<p.length;i++)c.push(c[i-1]+Math.hypot(p[i][0]-p[i-1][0],p[i][1]-p[i-1][1],p[i][2]-p[i-1][2]));return c;};
const at=(p,c,u)=>{const d=u*c[c.length-1];let i=1;while(i<c.length-1&&c[i]<d)i++;const t=(d-c[i-1])/((c[i]-c[i-1])||1);return [0,1,2].map(k=>p[i-1][k]+(p[i][k]-p[i-1][k])*t);};
const pm=new T.MeshBasicMaterial({color:0x2f8ad8});const pg=new T.SphereGeometry(0.35,10,8);
const parts=[];
paths.forEach(p=>{const c=cum(p);for(let i=0;i<26;i++){const m=new T.Mesh(pg,pm);air.add(m);const q={p:p,c:c,u:i/26,m:m,sp:0.05};const v=at(p,c,q.u);m.position.set(v[0],v[1],v[2]);parts.push(q);}});

let siteOn=false,raining=false,mode='all',showLab=true,season=0,hour=8,xr=false,walk=false,yaw=0,pitch=0;const eye=new T.Vector3();const hb=document.getElementById('hb');
let th=0.75,ph=1.0,rad=115;const tgt=new T.Vector3(30,14,12);
const views={all:[0.75,1.0,118,14],0:[0.6,0.75,85,2],1:[0.6,0.72,88,13],2:[0.6,0.72,92,23]};
function apply(){
G.forEach((g,i)=>{g.visible=mode==='all'||i<=mode;});gT.visible=mode==='all'&&!xr;gP.visible=mode==='all'&&!xr;
walls.forEach(w=>{let h=(mode!=='all'&&w.lvl===mode)?4:10;if(siteOn&&w.site)h=Math.min(h,w.site);w.m.scale.y=h;w.m.position.y=w.base+h/2;});
LB.forEach((g,i)=>{g.visible=showLab&&mode===i;});labT.visible=showLab&&mode==='all';gC.visible=showLab;
}
function setView(v){if(walk)leaveWalk();mode=v==='all'?'all':+v;const s=views[v];th=s[0];ph=s[1];rad=s[2];tgt.y=s[3];apply();document.querySelectorAll('#views button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.v===String(v))));}
function setX(on){xr=on;walls.forEach(w=>{const o=w.orig;const solid=o.opacity===1;w.m.material=on&&solid?M(o.color.getHex(),0.2):o;w.m.castShadow=!(on&&solid)&&o.opacity>=0.6;});apply();}
document.getElementById('spots').innerHTML=spots.map((s,i)=>'<button data-i="'+i+'" aria-pressed="false">'+s[0]+'</button>').join('');
function goSpot(i){const s=spots[i];const dx=s[4]-s[2],dz=s[5]-s[3];enterWalk(s[0],s[1],s[2],s[3],Math.atan2(dz,dx),Math.atan2(s[6],Math.hypot(dx,dz)));
document.querySelectorAll('#spots button').forEach((b,j)=>b.setAttribute('aria-pressed',String(j===i)));}
function leaveWalk(){walk=false;cam.fov=38;cam.near=1;cam.updateProjectionMatrix();document.getElementById('walkbar').hidden=true;
document.querySelectorAll('#spots button').forEach(b=>b.setAttribute('aria-pressed','false'));hb.textContent='Drag to rotate · scroll to zoom';setX(document.getElementById('cX').checked);}
let lvlW=1;const keys={f:0,b:0,l:0,r:0};
const LVLN=['Ground floor','1st floor','2nd floor','Terrace'];
const BLK=[[],[],[],[]];
LV.forEach((l,i)=>l.forEach(r=>{if(r[1]==='void'||r[1]==='air')BLK[i].push([r[2],r[3],r[4],r[5]]);}));
BLK[3].push([19,27,9,17],[-9,4,-9,40],[44,70,12.25,40],[56,70,-9,12.25]);
function eyeY(l){return (l===3?TY:BASE[l])+5.2;}
function free(x,z){const L=lvlW,r=0.6;
if(z<0.4||z>24.1||x<0.4||x>(L===0?78:59.6))return false;
for(const w of walls){if(w.lvl!==L)continue;const b=w.b;if(x>b[0]-r&&x<b[1]+r&&z>b[2]-r&&z<b[3]+r)return false;}
for(const b of BLK[L]){if(x>b[0]&&x<b[1]&&z>b[2]&&z<b[3])return false;}
return true;}
function step(d){const nx=eye.x+Math.cos(yaw)*d,nz=eye.z+Math.sin(yaw)*d;if(free(nx,nz)){eye.x=nx;eye.z=nz;}else if(free(nx,eye.z))eye.x=nx;else if(free(eye.x,nz))eye.z=nz;}
const inS=(x0,x1,z0,z1)=>eye.x>x0&&eye.x<x1&&eye.z>z0&&eye.z<z1;
function stairOpts(){const c=inS(35,41,11.5,19.5),h=inS(15,21,17,24.5);
if(lvlW===0)return [c?1:null,null];
if(lvlW===1)return [h?2:null,c?0:null];
if(lvlW===2)return [h?3:null,h?1:null];
return [null,h?2:null];}
let lastOpt='';
function updWalkUI(){const o=stairOpts();const k=o.join(',')+lvlW;if(k===lastOpt)return;lastOpt=k;
document.getElementById('upF').disabled=o[0]===null;document.getElementById('dnF').disabled=o[1]===null;
document.getElementById('walkfloor').textContent=LVLN[lvlW]+(o[0]!==null||o[1]!==null?' · on the stairs':'');}
function goFloor(i){const o=stairOpts();const t=o[i];if(t===null)return;lvlW=t;eye.y=eyeY(t);lastOpt='';}
function enterWalk(name,l,x,z,yw,pt){mode='all';walk=true;setX(false);LB.forEach(g=>g.visible=false);labT.visible=false;gC.visible=false;
lvlW=l;eye.set(x,eyeY(l),z);yaw=yw;pitch=pt;lastOpt='';
cam.fov=68;cam.near=0.25;cam.updateProjectionMatrix();
document.getElementById('walkbar').hidden=false;document.getElementById('walkname').textContent=name;
document.querySelectorAll('#views button').forEach(b=>b.setAttribute('aria-pressed','false'));
hb.textContent='Arrow keys or W A S D to walk · drag to look around';}
const D=['north','north-north-east','north-east','east-north-east','east','east-south-east','south-east','south-south-east','south','south-south-west','south-west','west-south-west','west','west-north-west','north-west','north-north-west'];
const fmt=h=>{const H=Math.floor(h),m=Math.round((h-H)*60);const hh=H>12?H-12:H;return hh+':'+String(m).padStart(2,'0')+(H>=12?' pm':' am');};
function sunUpdate(){
const lat=22.8*Math.PI/180,dec=[23.44,0,-23.44][season]*Math.PI/180,H=(hour-12)*15*Math.PI/180;
const sa=Math.sin(lat)*Math.sin(dec)+Math.cos(lat)*Math.cos(dec)*Math.cos(H);
const alt=Math.asin(Math.max(-1,Math.min(1,sa)));
const ca=(Math.sin(dec)-Math.sin(alt)*Math.sin(lat))/(Math.cos(alt)*Math.cos(lat));
let az=Math.acos(Math.max(-1,Math.min(1,ca)));if(H>0)az=2*Math.PI-az;
const r2=Math.SQRT1_2;const hx=Math.cos(az)*r2+Math.sin(az)*r2,hz=-Math.cos(az)*r2+Math.sin(az)*r2;
sun.position.set(30+Math.cos(alt)*hx*150,Math.sin(alt)*150,12+Math.cos(alt)*hz*150);
sun.intensity=(alt>0?0.95*Math.min(1,alt*4):0)*(raining?0.2:1);
document.getElementById('hrv').textContent=fmt(hour);
const dir=D[Math.round(az/(Math.PI/8))%16];
document.getElementById('sunr').textContent=alt>0?'Sun in the '+dir+', '+Math.round(alt*180/Math.PI)+'° above the horizon':'The sun is below the horizon';
let h;
if(hour<10)h=season===2?'Winter mornings: the sun rises in the south-east, behind the neighbour, so light reaches you mainly from above, through the courtyard cap and the skylights.':'Early sun lands on the road-facing deck, Bedroom 3 and the open sit-out, and comes through the hall’s glass wall into the family lounge.';
else if(hour<14.5)h=season===2?'Winter noon: the sun is lower and from the south, so it lights the upper walls of the courtyard, which bounce light down. Keep those walls white.':'High sun drops straight down the courtyard onto the first-floor living and dining, and the glass blocks pass some to the godown below.';
else h='Low western sun hits the back court. The terracotta jaali filters it into patterned light instead of heat.';
if(raining){h=rainHint;document.getElementById('sunr').textContent='Overcast: monsoon rain, wind from the south-west';}
document.getElementById('hint').textContent=h;
}
function camUp(){if(walk){const c=Math.cos(pitch);cam.position.copy(eye);cam.lookAt(eye.x+Math.cos(yaw)*c,eye.y+Math.sin(pitch),eye.z+Math.sin(yaw)*c);return;}cam.position.set(tgt.x+rad*Math.sin(ph)*Math.cos(th),tgt.y+rad*Math.cos(ph),tgt.z+rad*Math.sin(ph)*Math.sin(th));cam.lookAt(tgt);}
function size(){const w=fig.clientWidth,h=fig.clientHeight;if(!w||!h)return;R.setSize(w,h,false);cam.aspect=w/h;cam.updateProjectionMatrix();}
new ResizeObserver(size).observe(fig);size();

const pts=new Map();let pinch=0;
cv.addEventListener('pointerdown',e=>{try{cv.setPointerCapture(e.pointerId);}catch(_){}pts.set(e.pointerId,[e.clientX,e.clientY]);});
cv.addEventListener('pointermove',e=>{if(!pts.has(e.pointerId))return;const p=pts.get(e.pointerId);
if(pts.size===1){if(walk){yaw+=(e.clientX-p[0])*0.005;pitch=Math.min(1.2,Math.max(-1.2,pitch-(e.clientY-p[1])*0.005));}else{th+=(e.clientX-p[0])*0.008;ph=Math.min(1.5,Math.max(0.12,ph-(e.clientY-p[1])*0.008));}}
pts.set(e.pointerId,[e.clientX,e.clientY]);
if(pts.size===2){const v=[...pts.values()];const d=Math.hypot(v[0][0]-v[1][0],v[0][1]-v[1][1]);if(pinch&&d&&!walk)rad=Math.min(220,Math.max(25,rad*pinch/d));pinch=d;}});
const up=e=>{pts.delete(e.pointerId);pinch=0;};
cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',up);
cv.addEventListener('wheel',e=>{e.preventDefault();if(walk){step(-e.deltaY*0.01);return;}rad=Math.min(220,Math.max(25,rad*(1+e.deltaY*0.001)));},{passive:false});

document.getElementById('views').addEventListener('click',e=>{const b=e.target.closest('button');if(b)setView(b.dataset.v);});
document.getElementById('seasons').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;season=+b.dataset.s;document.querySelectorAll('#seasons button').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));sunUpdate();});
document.getElementById('hr').addEventListener('input',e=>{hour=+e.target.value;sunUpdate();});
document.getElementById('cAir').addEventListener('change',e=>{air.visible=e.target.checked;});
document.getElementById('cNb').addEventListener('change',e=>{gN.visible=e.target.checked;});
document.getElementById('cSite').addEventListener('change',e=>{siteOn=e.target.checked;apply();});
document.getElementById('cLab').addEventListener('change',e=>{showLab=e.target.checked;apply();});
document.getElementById('reset').addEventListener('click',()=>setView(mode));
document.getElementById('spots').addEventListener('click',e=>{const b=e.target.closest('button');if(b)goSpot(+b.dataset.i);});
document.getElementById('cX').addEventListener('change',e=>{if(!walk)setX(e.target.checked);});
document.querySelectorAll('#pad button').forEach(b=>{const k=b.dataset.k;const on=e=>{e.preventDefault();keys[k]=1;};const off=()=>{keys[k]=0;};
b.addEventListener('pointerdown',on);b.addEventListener('pointerup',off);b.addEventListener('pointerleave',off);b.addEventListener('pointercancel',off);});
const KM={ArrowUp:'f',KeyW:'f',ArrowDown:'b',KeyS:'b',ArrowLeft:'l',KeyA:'l',ArrowRight:'r',KeyD:'r'};
window.addEventListener('keydown',e=>{if(!walk||!KM[e.code])return;e.preventDefault();keys[KM[e.code]]=1;});
window.addEventListener('keyup',e=>{if(KM[e.code])keys[KM[e.code]]=0;});
document.getElementById('upF').addEventListener('click',()=>goFloor(0));
document.getElementById('dnF').addEventListener('click',()=>goFloor(1));
document.getElementById('walkStart').addEventListener('click',()=>{enterWalk('Walking in from the street',0,70,22.8,Math.PI,0);document.querySelectorAll('#spots button').forEach(b=>b.setAttribute('aria-pressed','false'));});
document.getElementById('exitw').addEventListener('click',()=>setView('all'));
gN.visible=false;
setView('all');sunUpdate();


// ---------- Rain (monsoon from the south-west) ----------

const gRain=new T.Group();S.add(gRain);gRain.visible=false;
const RN=3000,RL=1.3,RV=34,RW=0.3; // drops, streak length ft, fall speed ft/s, drift towards +x (NE) per ft of fall
const inQ=(x,z,r)=>x>r[0]&&x<r[1]&&z>r[2]&&z<r[3];
// Where a drop stops: [x0,x1,z0,z1,height]. First match wins.
const rainStops=[
[19,27,9,17,TY+3.25],        // courtyard cap keeps the courtyard dry
[14.6,21.4,16.6,24.9,TY+8.5],// home stair head
[0,4,0,24.5,BASE[1]],        // back court: through the roof grid onto the 1st-floor court
[56,60,0,12.25,BASE[2]],     // road deck: through the grille roof
[44,60,12.25,24.5,BASE[2]],  // sit-out: through the pergola grille
[0,60,0,24.5,TY]];           // everything else: the terrace
function rainFloor(x,z){
if(gN.visible&&x>0&&x<60&&((z>-14&&z<-0.35)||(z>24.85&&z<38)))return 34;
for(const r of rainStops)if(inQ(x,z,r))return r[4];return 0;}
const rp=new Float32Array(RN*6),rd=[];
function dropReset(i,top){const d=rd[i]||(rd[i]={});d.x=-14+Math.random()*80;d.z=-10+Math.random()*44;d.y=top?58+Math.random()*6:rainFloor(d.x,d.z)+Math.random()*(58-rainFloor(d.x,d.z));}
for(let i=0;i<RN;i++)dropReset(i,false);
const rg=new T.BufferGeometry();rg.setAttribute('position',new T.BufferAttribute(rp,3));
const rLines=new T.LineSegments(rg,new T.LineBasicMaterial({color:0x8fa6bd,transparent:true,opacity:0.55,depthWrite:false}));rLines.frustumCulled=false;gRain.add(rLines);
function rainStep(dt){
for(let i=0;i<RN;i++){const d=rd[i];d.y-=RV*dt;d.x+=RV*RW*dt;
if(d.y<=rainFloor(d.x,d.z))dropReset(i,true);
const k=i*6;rp[k]=d.x;rp[k+1]=d.y;rp[k+2]=d.z;rp[k+3]=d.x-RL*RW;rp[k+4]=d.y+RL;rp[k+5]=d.z;}
rg.attributes.position.needsUpdate=true;}
rainStep(0);
// Wet, open-to-rain surfaces and the rainwater downpipes (shown only while it rains)
const gWet=new T.Group();gRain.add(gWet);
box(gWet,0.05,3.95,BASE[1]+0.02,BASE[1]+0.07,0.05,24.45,0x6f8aa3,0.45);
box(gWet,56.05,59.95,BASE[2]+0.02,BASE[2]+0.07,0.05,12.2,0x6f8aa3,0.45);
box(gWet,44.05,59.95,BASE[2]+0.02,BASE[2]+0.07,12.3,24.45,0x6f8aa3,0.45);
[[4,15,0,24.5],[15,19,0,17],[19,27,0,9],[21,27,17,24.5],[27,44,0,24.5],[44,56,0,12.25]].forEach(r=>box(gWet,r[0]+0.05,r[1]-0.05,TY+0.02,TY+0.07,r[2]+0.05,r[3]-0.05,0x6f8aa3,0.4));
[[12,-0.45],[40,-0.45],[12,24.95],[40,24.95]].forEach(p=>box(gWet,p[0]-0.2,p[0]+0.2,0,TY+0.3,p[1]-0.2,p[1]+0.2,0x3f6f9a));
label(gWet,'Rainwater downpipe',40,TY-4,-1.5,0.8);label(gWet,'Back court gets wet: slope + drain',2,BASE[1]+3,12,0.8);
label(gWet,'Courtyard stays dry under the cap',23,TY+5,13,0.8);
const rainHint='Monsoon rain, blowing in from the south-west. The courtyard cap keeps the courtyard dry (keep the louvre gap above it narrow, or slanting rain gets in). Rain falls through the steel grids onto the back court, the road deck and the sit-out: give those floors a slight slope, a floor drain and a raised door threshold. The terrace drains through downpipes on the neighbour-wall sides into the rainwater recharge pit.';
document.getElementById('cRain').addEventListener('change',e=>{raining=e.target.checked;S.fog=raining?new T.Fog(0x9aa3ab,90,320):null;sunUpdate();});
const rm=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
let last=performance.now();
function loop(now){const dt=Math.min(0.05,(now-last)/1000);last=now;
if(air.visible&&!rm)parts.forEach(q=>{q.u=(q.u+dt*q.sp)%1;const v=at(q.p,q.c,q.u);q.m.position.set(v[0],v[1],v[2]);});
gRain.visible=raining&&(mode==='all'||walk);if(gRain.visible)rainStep(rm?0:dt);
if(walk){const sp=6*dt;if(keys.f)step(sp);if(keys.b)step(-sp);if(keys.l)yaw-=1.6*dt;if(keys.r)yaw+=1.6*dt;updWalkUI();}
camUp();R.render(S,cam);requestAnimationFrame(loop);}
requestAnimationFrame(loop);
};
(document.fonts&&document.fonts.ready?document.fonts.ready:Promise.resolve()).then(start,start);
}
