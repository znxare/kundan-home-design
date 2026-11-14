
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
const cam=new T.PerspectiveCamera(38,1,1,700);
R.outputEncoding=T.sRGBEncoding;R.toneMapping=T.ACESFilmicToneMapping;R.toneMappingExposure=1.05;
const hemi=new T.HemisphereLight(0xdfeeff,0x8a7a66,0.55);S.add(hemi);
const sun=new T.DirectionalLight(0xfff0d8,2.2);
sun.castShadow=true;{const big=!(window.matchMedia&&matchMedia('(max-width:900px)').matches);sun.shadow.mapSize.set(big?4096:2048,big?4096:2048);}sun.shadow.radius=3;
const sc=sun.shadow.camera;sc.left=-55;sc.right=55;sc.top=55;sc.bottom=-55;sc.near=1;sc.far=330;sun.shadow.bias=-0.0004;sun.shadow.normalBias=0.03;
S.add(sun);sun.target.position.set(30,0,12);S.add(sun.target);
const C={wall:0xf3f0e8,room:0xdcc6a2,wet:0xc9dde2,shop:0xbdbbb4,stair:0xa89c8e,path:0xcac3b5,open:0x8fb46f,glass:0x9fcfe6,jaali:0xc0663a,shutter:0x6c7075,wood:0x8a5a34,slab:0xe9e6df,leaf:0x5d8f45};
// ---------- procedural textures (no image files needed) ----------
let seed=7;const rnd=()=>{seed=(seed*16807)%2147483647;return (seed-1)/2147483646;};
const maxAniso=R.capabilities.getMaxAnisotropy?R.capabilities.getMaxAnisotropy():1;
function tex(draw,n){n=n||512;const c=document.createElement('canvas');c.width=c.height=n;const g=c.getContext('2d');draw(g,n);const t=new T.CanvasTexture(c);t.wrapS=t.wrapT=T.RepeatWrapping;t.encoding=T.sRGBEncoding;t.anisotropy=Math.min(8,maxAniso);return t;}
const noise=(g,n,a,dark,cnt)=>{for(let i=0;i<(cnt||6000);i++){g.fillStyle=(rnd()<0.5?(dark||'rgba(0,0,0,'):'rgba(255,255,255,')+(a*rnd())+')';const s=1+rnd()*2;g.fillRect(rnd()*n,rnd()*n,s,s);}};
const slabs=(g,n,k,base,vary,joint)=>{const s=n/k;for(let i=0;i<k;i++)for(let j=0;j<k;j++){const l=vary*(rnd()-0.5);g.fillStyle=base(l);g.fillRect(i*s,j*s,s,s);}noise(g,n,0.06);g.strokeStyle=joint;g.lineWidth=3;for(let i=0;i<=k;i++){g.beginPath();g.moveTo(i*s,0);g.lineTo(i*s,n);g.stroke();g.beginPath();g.moveTo(0,i*s);g.lineTo(n,i*s);g.stroke();}};
const TX={
wood:tex((g,n)=>{const rows=7,h=n/rows;for(let r=0;r<rows;r++){let x=-rnd()*n;while(x<n){const w=n*(0.45+rnd()*0.5);const l=40+rnd()*18;g.fillStyle=`hsl(28,45%,${l}%)`;g.fillRect(x,r*h,w,h);for(let k=0;k<14;k++){g.strokeStyle=`rgba(60,30,10,${0.05+rnd()*0.12})`;g.lineWidth=1+rnd()*1.5;const y=r*h+rnd()*h;g.beginPath();g.moveTo(x,y);g.bezierCurveTo(x+w*0.3,y+rnd()*6-3,x+w*0.6,y+rnd()*6-3,x+w,y);g.stroke();}g.fillStyle='rgba(40,20,5,0.55)';g.fillRect(x,r*h,2,h);x+=w;}g.fillStyle='rgba(40,20,5,0.5)';g.fillRect(0,r*h,n,2);}}),
darkwood:tex((g,n)=>{g.fillStyle='#6b4528';g.fillRect(0,0,n,n);for(let k=0;k<160;k++){g.strokeStyle=`rgba(30,15,5,${0.08+rnd()*0.15})`;g.lineWidth=1+rnd()*2;const y=rnd()*n;g.beginPath();g.moveTo(0,y);g.bezierCurveTo(n*0.3,y+rnd()*10-5,n*0.6,y+rnd()*10-5,n,y);g.stroke();}}),
tile:tex((g,n)=>slabs(g,n,2,l=>`hsl(195,10%,${86+l}%)`,4,'#a9b2b4')),
vitrified:tex((g,n)=>{const s=n/2;for(let i=0;i<2;i++)for(let j=0;j<2;j++){g.fillStyle=`hsl(38,22%,${86+(rnd()-0.5)*2}%)`;g.fillRect(i*s,j*s,s,s);}
for(let k=0;k<26;k++){g.strokeStyle=`rgba(120,105,85,${0.04+rnd()*0.07})`;g.lineWidth=1+rnd()*2.5;g.beginPath();let x=rnd()*n,y=rnd()*n;g.moveTo(x,y);for(let q=0;q<5;q++){x+=(rnd()-0.3)*n*0.25;y+=(rnd()-0.5)*n*0.18;g.lineTo(x,y);}g.stroke();}
noise(g,n,0.03,null,5000);g.strokeStyle='rgba(150,138,120,0.55)';g.lineWidth=2;for(let i=0;i<=2;i++){g.beginPath();g.moveTo(i*s,0);g.lineTo(i*s,n);g.stroke();g.beginPath();g.moveTo(0,i*s);g.lineTo(n,i*s);g.stroke();}},1024),
shoptile:tex((g,n)=>slabs(g,n,2,l=>`hsl(40,8%,${88+l}%)`,3,'#c9c5bd')),
plaster:tex((g,n)=>{g.fillStyle='#e6e0d5';g.fillRect(0,0,n,n);noise(g,n,0.05,null,9000);}),
stone:tex((g,n)=>slabs(g,n,3,l=>`hsl(35,14%,${66+l}%)`,10,'#8c8579')),
kota:tex((g,n)=>slabs(g,n,2,l=>`hsl(120,6%,${58+l}%)`,8,'#6f756d')),
concrete:tex((g,n)=>{g.fillStyle='#b9b5ad';g.fillRect(0,0,n,n);noise(g,n,0.09,null,14000);}),
ground:tex((g,n)=>{g.fillStyle='#b8ad97';g.fillRect(0,0,n,n);noise(g,n,0.12,null,16000);}),
road:tex((g,n)=>{g.fillStyle='#4a4b4d';g.fillRect(0,0,n,n);noise(g,n,0.18,null,20000);}),
leaf:tex((g,n)=>{g.fillStyle='#3f6e2f';g.fillRect(0,0,n,n);for(let i=0;i<900;i++){g.fillStyle=`hsla(${90+rnd()*30},45%,${25+rnd()*30}%,0.8)`;g.beginPath();g.ellipse(rnd()*n,rnd()*n,6+rnd()*8,3+rnd()*4,rnd()*3,0,7);g.fill();}}),
fabric:tex((g,n)=>{g.fillStyle='#55657a';g.fillRect(0,0,n,n);for(let i=0;i<n;i+=4){g.fillStyle='rgba(255,255,255,0.05)';g.fillRect(i,0,2,n);g.fillStyle='rgba(0,0,0,0.06)';g.fillRect(0,i,n,2);}}),
linen:tex((g,n)=>{g.fillStyle='#f4f1ea';g.fillRect(0,0,n,n);for(let i=0;i<n;i+=6){g.fillStyle='rgba(0,0,0,0.025)';g.fillRect(0,i,n,2);}}),
shutter:tex((g,n)=>{g.fillStyle='#7d8287';g.fillRect(0,0,n,n);for(let i=0;i<n;i+=16){g.fillStyle='rgba(0,0,0,0.25)';g.fillRect(0,i,n,3);g.fillStyle='rgba(255,255,255,0.15)';g.fillRect(0,i+4,n,2);}}),
jaali:tex((g,n)=>{g.fillStyle='#b5603a';g.fillRect(0,0,n,n);noise(g,n,0.1);g.globalCompositeOperation='destination-out';const s=n/8;for(let i=0;i<8;i++)for(let j=0;j<8;j++){g.beginPath();g.arc(i*s+s/2,j*s+s/2,s*0.32,0,7);g.fill();}g.globalCompositeOperation='source-over';})
};
// colour key -> realistic material recipe [texture, world size of one texture tile in ft, roughness, metalness]
const RL={[C.room]:['vitrified',4,0.22],[C.wet]:['tile',4,0.3],[C.wall]:['plaster',6,0.92],[C.open]:['stone',6,0.85],[C.shop]:['shoptile',4,0.3],[C.path]:['kota',4,0.7],
0xb9b2a3:['concrete',8,0.9],[C.slab]:['concrete',8,0.9],[C.stair]:['stone',3,0.7],[C.wood]:['wood',3,0.6],0x9b6b43:['darkwood',3,0.55],[C.jaali]:['jaali',2.5,0.9],
[C.leaf]:['leaf',3,0.9],0x5b6b7a:['fabric',2,0.95],0xf2efe8:['linen',3,0.95],0x9a958c:['concrete',4,0.9],[C.shutter]:['shutter',3,0.5,0.4],0xd6d1c6:['ground',12,1],0x404244:['road',12,0.95],
0x2b2b2b:[null,1,0.4,0.7],0x7a7c80:['kota',3,0.35],0xe6e2da:['shoptile',3,0.25],0xb8bcc0:[null,1,0.3,0.6]};
let REAL=true;
const mats={};
const M=(c,o)=>{o=o===undefined?1:o;const k=c+'_'+o;if(mats[k])return mats[k];let m;
if(c===C.glass||c===0xbfe3f2)m=new T.MeshStandardMaterial({color:0xd6ebf5,transparent:true,opacity:Math.min(o,0.28),roughness:0.04,metalness:0.25,depthWrite:false,envMapIntensity:1.4});
else{const r=RL[c];m=new T.MeshStandardMaterial({color:r&&r[0]?0xffffff:c,map:r&&r[0]?TX[r[0]]:null,roughness:r?r[2]:0.8,metalness:r&&r[3]?r[3]:0,transparent:o<1,opacity:o,depthWrite:o>=0.6,envMapIntensity:0.6});
if(r){m.userData.ts=r[1];if(r[0]&&!['art1','art2','art3','vitrified'].includes(r[0])){m.bumpMap=TX[r[0]];m.bumpScale=['fabric','linen','curtain','bs1','bs2','bs3','rug'].includes(r[0])?0.006:0.018;}}if(c===C.jaali){m.alphaTest=0.5;m.transparent=false;m.opacity=1;m.depthWrite=true;m.side=T.DoubleSide;}}
mats[k]=m;return m;};
function uvScale(geo,w,h,d,ts){const uv=geo.attributes.uv;for(let i=0;i<uv.count;i++){const f=Math.floor(i/4);const [su,sv]=f<2?[d,h]:f<4?[w,d]:[w,h];uv.setXY(i,uv.getX(i)*su/ts,uv.getY(i)*sv/ts);}uv.needsUpdate=true;}
const box=(g,x0,x1,y0,y1,z0,z1,c,o)=>{o=o===undefined?1:o;const mat=M(c,o);const geo=new T.BoxGeometry(x1-x0,y1-y0,z1-z0);if(mat.userData.ts){const hh=(y1-y0)===1?10:(y1-y0);uvScale(geo,x1-x0,hh,z1-z0,mat.userData.ts);}const m=new T.Mesh(geo,mat);m.position.set((x0+x1)/2,(y0+y1)/2,(z0+z1)/2);if(o>=0.6||c===C.jaali){m.castShadow=true;m.receiveShadow=true;}g.add(m);return m;};
// sky background + reflections
{const c=document.createElement('canvas');c.width=4;c.height=256;const g=c.getContext('2d');const gr=g.createLinearGradient(0,0,0,256);gr.addColorStop(0,'#5b95d6');gr.addColorStop(0.55,'#a9cbea');gr.addColorStop(1,'#e9eef0');g.fillStyle=gr;g.fillRect(0,0,4,256);const bg=new T.CanvasTexture(c);bg.encoding=T.sRGBEncoding;S.background=bg;
const es=new T.Scene();const sg=new T.SphereGeometry(100,32,16);const col=[];const p=sg.attributes.position;for(let i=0;i<p.count;i++){const y=p.getY(i)/100;const cc=new T.Color(y>0?0x9cc4ec:0x8a7a66).lerp(new T.Color(0xf2f2ee),y>0?Math.max(0,1-y*1.4):0.3);col.push(cc.r,cc.g,cc.b);}sg.setAttribute('color',new T.Float32BufferAttribute(col,3));es.add(new T.Mesh(sg,new T.MeshBasicMaterial({vertexColors:true,side:T.BackSide})));
try{const pm=new T.PMREMGenerator(R);S.environment=pm.fromScene(es,0.04).texture;}catch(e){}}


function label(g,txt,x,y,z,s){s=s||1;const c=document.createElement('canvas');const ctx=c.getContext('2d');const font='500 40px "Hanken Grotesk",sans-serif';ctx.font=font;const w=Math.ceil(ctx.measureText(txt).width)+36;c.width=w;c.height=64;const x2=c.getContext('2d');x2.font=font;x2.fillStyle='rgba(255,255,255,0.92)';x2.fillRect(0,0,w,64);x2.fillStyle='#111';x2.textBaseline='middle';x2.fillText(txt,18,34);const tx=new T.CanvasTexture(c);tx.minFilter=T.LinearFilter;const sp=new T.Sprite(new T.SpriteMaterial({map:tx,depthTest:false,toneMapped:false}));const h=1.7*s;sp.scale.set(h*w/64,h,1);sp.position.set(x,y,z);sp.renderOrder=10;g.add(sp);return sp;}

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
walls.push({m:m,base:base,lvl:lv,site:site,ax:ax,f:f,a0:a0,a1:a1,orig:m.material,b:ax==='x'?[a0,a1,f-th,f+th]:[f-th,f+th,a0,a1]});
}
function build(level,base,g,lab,lv){
const opens=level.filter(r=>r[1]==='open'||r[1]==='air'||r[1]==='void');
const myg=gaps.filter(q=>q[0]===lv),mye=glassE.filter(q=>q[0]===lv),mys=solidE.filter(q=>q[0]===lv);
level.forEach(r=>{
const n=r[0],t=r[1],x0=r[2],x1=r[3],z0=r[4],z1=r[5];
const fc={room:C.room,wet:C.wet,shop:C.shop,path:C.path,open:C.open,godown:0xb9b2a3}[t];
if(fc!==undefined){box(g,x0,x1,base-0.5,base+(t==='wet'?0.03:0),z0,z1,fc);if(lv>0)box(g,x0,x1,base-0.53,base-0.5,z0,z1,C.wall);}
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
for(let i=0;i<9;i++){const t=base+(i+1)*rh;box(g,9.8-(i+1)*rn,9.8-i*rn,t-0.15,t,17.2,20.8,C.wood);}
for(let j=0;j<9;j++){const t=base+5.25+(j+1)*rh;box(g,4.2+j*rn,4.2+(j+1)*rn,t-0.15,t,20.9,24.3,C.wood);}
box(g,4.1,10,base,base+10.5,20.82,20.88,0x55575a,0.5);}
stairs(G[0],0);stairs(G[1],10.5);stairs(G[2],21);

box(S,-40,100,-0.62,-0.52,-40,65,0xd6d1c6);box(S,63,100,-0.52,-0.5,-40,65,0x404244);box(S,60,63,-0.52,-0.3,-40,65,C.path);
const tree=(g,x,z,b,h,r)=>{const m=new T.Mesh(new T.CylinderGeometry(0.25,0.4,h,10),M(C.wood));m.position.set(x,b+h/2,z);m.castShadow=true;g.add(m);[[0,0,0,1],[0.6,-0.3,0.4,0.75],[-0.6,-0.2,-0.3,0.75],[0.2,0.4,-0.6,0.7],[-0.3,0.3,0.6,0.7],[0,0.7,0,0.6]].forEach(q=>{const s=new T.Mesh(new T.SphereGeometry(r*q[3],16,12),M(C.leaf));s.position.set(x+q[0]*r,b+h+q[1]*r,z+q[2]*r);s.castShadow=true;s.receiveShadow=true;g.add(s);});};
box(G[1],-0.2,0.2,10.5,17.5,0,24.5,C.jaali,0.8);
box(G[1],0,2.5,10.5,31,-0.2,0.2,C.wall);box(G[1],0,2.5,10.5,31,24.3,24.7,C.wall);
box(G[1],1.95,2.25,11,18.5,1,11,C.jaali,0.7);box(G[1],1.95,2.25,11,18.5,17.5,24,C.jaali,0.7);
box(G[1],20.5,25.5,10,10.08,12,14,C.glass,0.7);
// Courtyard centre: rangoli medallion inlaid in the stone floor, tulsi plant + diya niche on the vrindavan, herbs in the planter
{const rt=tex((g,n)=>{const c=n/2;g.fillStyle='#cdbb9c';g.fillRect(0,0,n,n);
const ring=(r,col,w)=>{g.strokeStyle=col;g.lineWidth=w;g.beginPath();g.arc(c,c,r,0,7);g.stroke();};
g.fillStyle='#e9e2d2';g.beginPath();g.arc(c,c,c*0.97,0,7);g.fill();ring(c*0.96,'#3c3a37',8);ring(c*0.86,'#b5603a',5);
for(let i=0;i<48;i++){const a=i/48*Math.PI*2;g.fillStyle=i%2?'#c9a24a':'#3c3a37';g.beginPath();g.arc(c+Math.cos(a)*c*0.91,c+Math.sin(a)*c*0.91,c*0.022,0,7);g.fill();}
const petals=(k,r0,r1,w,col,off)=>{for(let i=0;i<k;i++){const a=(i+(off||0))/k*Math.PI*2;g.save();g.translate(c,c);g.rotate(a);g.fillStyle=col;g.beginPath();g.moveTo(r0,0);g.quadraticCurveTo((r0+r1)/2,-w,r1,0);g.quadraticCurveTo((r0+r1)/2,w,r0,0);g.fill();g.restore();}};
petals(16,c*0.42,c*0.82,c*0.13,'#b5603a',0.5);petals(16,c*0.4,c*0.74,c*0.09,'#f4ecdc');petals(8,c*0.2,c*0.5,c*0.12,'#c9a24a',0.5);petals(8,c*0.18,c*0.44,c*0.07,'#3c3a37');
g.fillStyle='#e9e2d2';g.beginPath();g.arc(c,c,c*0.2,0,7);g.fill();ring(c*0.2,'#3c3a37',5);},1024);rt.wrapS=rt.wrapT=T.ClampToEdgeWrapping;
const rg=new T.Mesh(new T.CircleGeometry(2.9,72),new T.MeshStandardMaterial({map:rt,roughness:0.55,envMapIntensity:0.6}));rg.rotation.x=-Math.PI/2;rg.position.set(21.25,10.53,14.25);rg.receiveShadow=true;G[1].add(rg);
box(G[1],23.5,24.9,10.5,10.7,15.2,16.6,C.stair);box(G[1],23.55,24.85,12.9,13.1,15.25,16.55,C.stair);
const lit=new T.MeshStandardMaterial({color:0xffd9a0,emissive:0xff9a3c,emissiveIntensity:0.9});const dn=new T.Mesh(new T.BoxGeometry(0.06,0.5,0.45),lit);dn.position.set(24.2,11.4,15.27);dn.rotation.y=Math.PI/2;G[1].add(dn);
[[0,0,0,0.26],[0.16,0.14,0.08,0.18],[-0.15,0.12,-0.08,0.17],[0,0.3,0,0.14]].forEach(q=>{const s=new T.Mesh(new T.SphereGeometry(q[3],12,10),M(C.leaf));s.position.set(24.2+q[0],13.25+q[1],15.9+q[2]);s.castShadow=true;G[1].add(s);});
for(let x=18.6;x<24.4;x+=0.9){const s=new T.Mesh(new T.SphereGeometry(0.42+0.12*Math.sin(x*3),10,8),M(C.leaf));s.position.set(x,12.0,17.35);s.scale.y=1.3;s.castShadow=true;G[1].add(s);}
label(LB[1],'Rangoli stone inlay',21.25,12.2,11.6,0.6);}
[4,9,19].forEach(z=>{box(G[1],0.6,1.9,10.5,11.6,z-0.65,z+0.65,0x9a958c);const s=new T.Mesh(new T.SphereGeometry(0.6,12,10),M(C.leaf));s.position.set(1.25,12.0,z);s.castShadow=true;G[1].add(s);});
box(G[1],59.8,60.2,10.5,14,21.2,24.5,C.wall);
box(G[2],1.95,2.25,21.5,30,1,11,C.jaali,0.7);
box(G[2],44,60,21,28,24.3,24.7,C.wall);
const GR=0x2b2b2b;
const vbars=(g,x,z0,z1,y0,y1,sp)=>{for(let z=z0+sp/2;z<z1;z+=sp)box(g,x-0.04,x+0.04,y0,y1,z-0.04,z+0.04,GR);box(g,x-0.06,x+0.06,y0,y0+0.12,z0,z1,GR);box(g,x-0.06,x+0.06,y1-0.12,y1,z0,z1,GR);};
const xbars=(g,z,x0,x1,y0,y1,sp)=>{for(let x=x0+sp/2;x<x1;x+=sp)box(g,x-0.04,x+0.04,y0,y1,z-0.04,z+0.04,GR);box(g,x0,x1,y1-0.12,y1,z-0.06,z+0.06,GR);};
const grid=(g,x0,x1,z0,z1,y,sp)=>{for(let x=x0+sp/2;x<x1;x+=sp)box(g,x-0.05,x+0.05,y,y+0.12,z0,z1,GR);for(let z=z0+sp/2;z<z1;z+=sp)box(g,x0,x1,y,y+0.12,z-0.05,z+0.05,GR);};
vbars(G[2],59.9,0,24.5,21,30.6,0.5);xbars(G[1],19.3,36,40,10.5,17.5,0.35);
xbars(G[2],24.5,44,60,28,30.6,0.5);
grid(G[2],44,60,12.25,24.5,30.6,1);grid(G[2],56,60,0,12.25,30.6,1);
grid(G[2],16.5,26,10.5,18,31.1,1);
grid(G[2],0,2.5,0,24.5,31.1,1);
vbars(G[1],-0.05,0,24.5,17.5,31,0.6);
for(let x=45;x<=59;x+=2)box(gP,x-0.2,x+0.2,30,30.4,12.25,24.5,C.wood);
box(gP,59.2,59.6,21,30,12.6,13,C.wood);box(gP,59.2,59.6,21,30,23.8,24.2,C.wood);

const F=0xf2efe8,W2=0x9b6b43,SO=0x5b6b7a;
const bed=(g,b,x0,x1,z0,z1)=>{box(g,x0,x1,b,b+1.8,z0,z1,F);box(g,x0,x1,b,b+3.6,z0,z0+0.4,W2);box(g,x0+0.5,x1-0.5,b+1.8,b+2.2,z0+0.6,z0+1.8,0xffffff);};
const sofa=(g,b,x0,x1,z0)=>{box(g,x0,x1,b,b+1.5,z0,z0+3,SO);box(g,x0,x1,b,b+3,z0,z0+0.8,SO);};
const FM={wood:0x9b6b43,fabric:0x5b6b7a,linen:0xf2efe8,steel:0xb8bcc0,white:0xfbfbf8,black:0x2b2b2b,counter:0x7a7c80,stone:C.stair,glass:C.glass,plant:C.leaf,concrete:0x9a958c};
FURN.forEach(f=>{const b=BASE[f[0]];box(G[f[0]],f[2],f[3],b+f[6],b+f[6]+f[7],f[4],f[5],f[1]==='Rug'?0x8c3a32:(FM[f[8]]||0x999999),f[8]==='glass'?0.3:1);if(f[9])label(LB[f[0]],f[1],(f[2]+f[3])/2,b+f[6]+f[7]+1.6,(f[4]+f[5])/2,0.6);});
// ---------- Bedroom dressing: bedspreads, pillows, accent wall + painting, lamps, curtains, fans, wardrobe shutters ----------
// Tall items go in TD[level], hidden when that floor is shown cut away (walls at 4 ft) or in x-ray.
const TD=[0,1,2].map(l=>{const g=new T.Group();G[l].add(g);return g;});
{
const pat=(bg,fg,fg2)=>tex((g,n)=>{g.fillStyle=bg;g.fillRect(0,0,n,n);noise(g,n,0.05,null,3000);const s=n/8;for(let i=0;i<8;i++)for(let j=0;j<8;j++){const cx=i*s+s/2,cy=j*s+s/2;g.fillStyle=fg;g.beginPath();g.moveTo(cx,cy-s*0.32);g.lineTo(cx+s*0.32,cy);g.lineTo(cx,cy+s*0.32);g.lineTo(cx-s*0.32,cy);g.fill();g.fillStyle=fg2;g.beginPath();g.arc(cx,cy,s*0.1,0,7);g.fill();}});
TX.bs1=pat('#a5513f','#e9d5b5','#5b2a20');TX.bs2=pat('#34536e','#e8e2d0','#c9a24a');TX.bs3=pat('#6c7a48','#efe6cc','#8a4b2c');
TX.rug=tex((g,n)=>{g.fillStyle='#8c3a32';g.fillRect(0,0,n,n);const s=n/4;for(let i=0;i<4;i++)for(let j=0;j<4;j++){const cx=i*s+s/2,cy=j*s+s/2;[[0.42,'#e3cfa6'],[0.26,'#2f4a63'],[0.1,'#e3cfa6']].forEach(([k,c])=>{g.fillStyle=c;g.beginPath();g.moveTo(cx,cy-s*k);g.lineTo(cx+s*k,cy);g.lineTo(cx,cy+s*k);g.lineTo(cx-s*k,cy);g.fill();});}noise(g,n,0.12,null,9000);});
TX.curtain=tex((g,n)=>{g.fillStyle='#ddd0b4';g.fillRect(0,0,n,n);for(let x=0;x<n;x+=32){const gr=g.createLinearGradient(x,0,x+32,0);gr.addColorStop(0,'rgba(0,0,0,0.13)');gr.addColorStop(0.5,'rgba(255,255,255,0.13)');gr.addColorStop(1,'rgba(0,0,0,0.13)');g.fillStyle=gr;g.fillRect(x,0,32,n);}});
const art=cols=>tex((g,n)=>{g.fillStyle=cols[0];g.fillRect(0,0,n,n);g.globalAlpha=0.8;for(let i=0;i<7;i++){g.fillStyle=cols[1+i%3];g.beginPath();g.arc(rnd()*n,rnd()*n,n*(0.08+rnd()*0.2),0,7);g.fill();}g.globalAlpha=1;g.strokeStyle=cols[3];g.lineWidth=6;g.beginPath();g.moveTo(0,n*0.7);g.bezierCurveTo(n*0.3,n*0.45,n*0.6,n*0.95,n,n*0.6);g.stroke();},256);
TX.art1=art(['#efe4cf','#c8643f','#e0a845','#2f5d6e']);TX.art2=art(['#e6ece6','#4d7f6a','#9fbfa8','#c9824f']);TX.art3=art(['#f2e8dc','#7d4f7a','#d48c6a','#34495e']);
Object.assign(RL,{0xa5513f:['bs1',3,0.95],0x34536e:['bs2',3,0.95],0x6c7a48:['bs3',3,0.95],0x8c3a32:['rug',3,0.98],0xddd0b4:['curtain',2,0.95],0xefe4cf:['art1',4.5,0.7],0xe6ece6:['art2',4.5,0.7],0xf2e8dc:['art3',4.5,0.7]});
const BS=[0xa5513f,0x34536e,0x6c7a48],ACC=[0x6f8467,0x5f7d96,0xa86e52,0x8d7aa3,0xb8924f,0x4f7f78],ART=[0xefe4cf,0xe6ece6,0xf2e8dc];
const roomOf=(l,x,z)=>LV[l].find(r=>x>r[2]&&x<r[3]&&z>r[4]&&z<r[5]);
const shade=new T.MeshStandardMaterial({color:0xfff3dc,emissive:0xffc070,emissiveIntensity:0.6,roughness:0.9});
const cyl=(g,r0,r1,h,x,y,z,mat)=>{const m=new T.Mesh(new T.CylinderGeometry(r0,r1,h,18),mat);m.position.set(x,y,z);m.castShadow=true;g.add(m);return m;};
const bz=(g,x0,x1,y0,y1,za,zb,c)=>box(g,x0,x1,y0,y1,Math.min(za,zb),Math.max(za,zb),c);
let bi=0;
FURN.forEach(f=>{const l=f[0],b=BASE[l];
 if(f[8]==='linen'&&/bed/i.test(f[1])){
  let hb=FURN.find(h=>h[0]===l&&h[1]==='Headboard'&&Math.abs(h[2]-f[2])<0.05&&Math.abs(h[3]-f[3])<0.05),aZ=true;
  if(!hb){hb=FURN.find(h=>h[0]===l&&h[1]==='Headboard'&&Math.abs(h[4]-f[4])<0.05&&Math.abs(h[5]-f[5])<0.05);aZ=false;}
  if(!hb)return;
  // u = across the bed, v = along the bed (from the headboard)
  const u0=aZ?f[2]:f[4],u1=aZ?f[3]:f[5],v0=aZ?f[4]:f[2],v1=aZ?f[5]:f[3];
  const head0=aZ?Math.abs(hb[5]-f[4])<0.05:Math.abs(hb[3]-f[2])<0.05,W=u1-u0,L=v1-v0,dir=head0?1:-1;
  const vv=(a,c)=>head0?[v0+a,v0+c]:[v1-c,v1-a];
  const P=(g,a0,a1,y0,y1,b0,b1,c)=>aZ?box(g,a0,a1,y0,y1,Math.min(b0,b1),Math.max(b0,b1),c):box(g,Math.min(b0,b1),Math.max(b0,b1),y0,y1,a0,a1,c);
  const top=b+f[6]+f[7],c=BS[bi%3];
  let q=vv(L*0.36,L+0.06);P(G[l],u0-0.06,u1+0.06,top,top+0.12,q[0],q[1],c);
  P(G[l],u0-0.08,u0-0.02,top-1,top+0.1,q[0],q[1],c);P(G[l],u1+0.02,u1+0.08,top-1,top+0.1,q[0],q[1],c);
  q=head0?[v1,v1+0.06]:[v0-0.06,v0];P(G[l],u0-0.06,u1+0.06,top-1,top+0.1,q[0],q[1],c);
  q=vv(L-1.5,L-0.4);P(G[l],u0+0.1,u1-0.1,top+0.12,top+0.26,q[0],q[1],ACC[(bi+2)%6]);
  const np=W>=4.8?2:1,pw=(W-0.6-(np-1)*0.2)/np;
  for(let i=0;i<np;i++){const pu=u0+0.3+i*(pw+0.2);q=vv(0.2,1.5);P(G[l],pu,pu+pw,top,top+0.45,q[0],q[1],0xfdfcf8);
   q=vv(1.55,1.95);P(G[l],pu+0.35,pu+pw-0.35,top,top+0.95,q[0],q[1],ACC[bi%6]);}
  const r=roomOf(l,(f[2]+f[3])/2,(f[4]+f[5])/2);
  if(r){const ru0=aZ?r[2]:r[4],ru1=aZ?r[3]:r[5],rv0=aZ?r[4]:r[2],rv1=aZ?r[5]:r[3];
   const ax0=Math.max(ru0+0.2,u0-1.8),ax1=Math.min(ru1-0.2,u1+1.8),wv=head0?rv0+0.2:rv1-0.2;
   P(TD[l],ax0,ax1,b,b+9.8,wv,wv+dir*0.03,ACC[bi%6]);
   const fw=Math.min(4,W-0.4),fu=(u0+u1)/2,fv=wv+dir*0.03;
   P(TD[l],fu-fw/2-0.12,fu+fw/2+0.12,b+5,b+7.5,fv,fv+dir*0.1,0x3a2a1e);
   P(TD[l],fu-fw/2,fu+fw/2,b+5.12,b+7.38,fv+dir*0.1,fv+dir*0.12,ART[bi%3]);}
  bi++;}
 if(f[1]==='Bedside table'){const cx=(f[2]+f[3])/2,cz=(f[4]+f[5])/2,t=b+f[6]+f[7];
  cyl(G[l],0.15,0.22,0.9,cx,t+0.45,cz,M(0x6b5a48));cyl(G[l],0.34,0.48,0.6,cx,t+1.2,cz,shade);}
 if(/wardrobe/i.test(f[1])&&f[6]===0){const r=roomOf(l,(f[2]+f[3])/2,(f[4]+f[5])/2);if(!r)return;
  const t0=b+f[6],t1=t0+f[7],alongZ=(f[3]-f[2])<(f[5]-f[4]);
  const a0=alongZ?f[4]:f[2],a1=alongZ?f[5]:f[3],n=Math.max(2,Math.round((a1-a0)/1.7));
  const fr=alongZ?((f[2]-r[2])>(r[3]-f[3])?f[2]:f[3]):((f[4]-r[4])>(r[5]-f[5])?f[4]:f[5]);
  const piece=(u0,u1,y0,y1,c)=>alongZ?box(G[l],fr-0.03,fr+0.03,y0,y1,u0,u1,c):box(G[l],u0,u1,y0,y1,fr-0.03,fr+0.03,c);
  for(let i=1;i<n;i++){const u=a0+(a1-a0)*i/n;piece(u-0.02,u+0.02,t0+0.1,t1-0.1,0x3b2a1c);piece(u-0.28,u-0.2,t0+3,t0+4.3,0xb8bcc0);piece(u+0.2,u+0.28,t0+3,t0+4.3,0xb8bcc0);}
  piece(a0,a1,t0+5.6,t0+5.64,0x3b2a1c);}
});
// curtains on every bedroom glass wall, and a ceiling fan in each bedroom
LV.forEach((lv,l)=>lv.forEach(r=>{if(r[1]!=='room'||!/bed/i.test(r[0])||/wardrobe/i.test(r[0]))return;const b=BASE[l];
 const opens=lv.filter(o=>['open','air','void'].includes(o[1]));
 [['x',r[2],r[4],r[5],1],['x',r[3],r[4],r[5],-1],['z',r[4],r[2],r[3],1],['z',r[5],r[2],r[3],-1]].forEach(([ax,p,a0,a1,d])=>opens.forEach(o=>{
  const far=ax==='x'?(d>0?o[3]:o[2]):(d>0?o[5]:o[4]);if(Math.abs(far-p)>0.01)return;
  const s0=Math.max(a0,ax==='x'?o[4]:o[2]),s1=Math.min(a1,ax==='x'?o[5]:o[3]);if(s1-s0<2)return;
  const pc=(u0,u1,w0,w1,y0,y1,c)=>ax==='x'?box(TD[l],Math.min(w0,w1),Math.max(w0,w1),y0,y1,u0,u1,c):box(TD[l],u0,u1,y0,y1,Math.min(w0,w1),Math.max(w0,w1),c);
  [[s0+0.2,s0+1.5],[s1-1.5,s1-0.2]].forEach(([c0,c1])=>{for(let k=0;k<4;k++)pc(c0+(c1-c0)*k/4,c0+(c1-c0)*(k+1)/4,p+d*0.25,p+d*(0.42+(k%2)*0.1),b+0.3,b+9.5,0xddd0b4);});
  pc(s0+0.1,s1-0.1,p+d*0.35,p+d*0.4,b+9.55,b+9.65,0x3b2a1c);}));
 if((r[3]-r[2])*(r[5]-r[4])<60)return;
 const cx=(r[2]+r[3])/2,cz=(r[4]+r[5])/2,wm=M(0xfbfbf8);
 cyl(TD[l],0.04,0.04,0.9,cx,b+9.55,cz,wm);cyl(TD[l],0.35,0.3,0.3,cx,b+9.0,cz,wm);
 for(let k=0;k<3;k++){const a=k*2*Math.PI/3,bl=new T.Mesh(new T.BoxGeometry(1.9,0.04,0.42),M(0x9b6b43));bl.position.set(cx+Math.cos(a)*1.25,b+8.95,cz+Math.sin(a)*1.25);bl.rotation.y=-a;bl.castShadow=true;TD[l].add(bl);}
}));
}
// Living room -> courtyard sliding glass door (opening x23-25.8 on the z10.5 glass wall). The panel runs on a track on the
// courtyard side and is shown slid open in front of the fixed glass; glass fanlight above the 7.2 ft frame.
{const b=BASE[1],z=10.5,x0=23,x1=25.8,h=7.2,fr=0x3a3d40,dz=0.18;
box(TD[1],x0,x1,b+h,b+h+0.15,z-0.14,z+0.14,fr);box(TD[1],x0-0.06,x0+0.06,b,b+h,z-0.14,z+0.14,fr);box(TD[1],x1-0.06,x1+0.06,b,b+h,z-0.14,z+0.14,fr);
box(TD[1],x0,x1,b+h+0.15,b+10,z-0.03,z+0.03,C.glass,0.32);
box(TD[1],20.1,x1,b,b+0.06,z+dz-0.08,z+dz+0.08,fr);box(TD[1],20.1,x1,b+h-0.06,b+h,z+dz-0.08,z+dz+0.08,fr);
const px=20.2,w=x1-x0+0.1;box(TD[1],px,px+w,b+0.06,b+h-0.06,z+dz-0.03,z+dz+0.03,C.glass,0.32);
[[px,px+0.12],[px+w-0.12,px+w]].forEach(q=>box(TD[1],q[0],q[1],b+0.06,b+h-0.06,z+dz-0.05,z+dz+0.05,fr));
box(TD[1],px,px+w,b+0.06,b+0.25,z+dz-0.05,z+dz+0.05,fr);box(TD[1],px,px+w,b+h-0.25,b+h-0.06,z+dz-0.05,z+dz+0.05,fr);
box(TD[1],px+w-0.3,px+w-0.25,b+3,b+4.4,z+dz+0.05,z+dz+0.1,0xb8bcc0);
label(LB[1],'Sliding glass door (open)',24.4,b+8.4,11.2,0.6);}
(typeof SHAFTS!=='undefined'?SHAFTS:[]).forEach(sh=>{[0,1,2].forEach(l=>{box(G[l],sh[1]+0.05,sh[2]-0.05,BASE[l]-0.5,BASE[l]+10,sh[3]+0.05,sh[4]-0.05,0x9a958c);});box(gT,sh[1]+0.05,sh[2]-0.05,31.5,34,sh[3]+0.05,sh[4]-0.05,0x9a958c);label(LB[1],sh[0],(sh[1]+sh[2])/2,BASE[1]+11.5,(sh[3]+sh[4])/2,0.6);label(LB[2],sh[0],(sh[1]+sh[2])/2,BASE[2]+11.5,(sh[3]+sh[4])/2,0.6);});
box(G[0],36,58,0,7,0.4,2,0xd9d4c8);box(G[1],36,58,10.5,17.5,0.4,2,0xd9d4c8);
box(G[0],3,20,0,5,1,6,0x9a8a70);box(G[0],3,15,0,4,10,15,0x9a8a70);
S.add(new T.AmbientLight(0xffffff,0.18));
const TY=31.5;
[[2.5,16.5,0,24.5],[16.5,26,0,10.5],[16.5,26,18,24.5],[26,35,0,24.5],[35,44,0,11.5],[35,41,19.5,24.5],[41,44,11.5,24.5],[44,56,0,12.25]].forEach(s=>box(gT,s[0],s[1],TY-0.5,TY,s[2],s[3],C.slab));
[['x',0,2.5,56],['x',24.5,2.5,44],['z',2.5,0,24.5],['z',44,12.25,24.5],['x',12.25,44,56],['z',56,0,12.25]].forEach(p=>{if(p[0]==='x')box(gT,p[2],p[3],TY,TY+3.5,p[1]-0.2,p[1]+0.2,C.wall);else box(gT,p[1]-0.2,p[1]+0.2,TY,TY+3.5,p[2],p[3],C.wall);});
box(gT,35,41,TY,TY+8,11.3,11.7,C.wall);box(gT,35,37,TY,TY+8,19.3,19.7,C.wall);box(gT,39.5,41,TY,TY+8,19.3,19.7,C.wall);box(gT,34.8,35.2,TY,TY+8,11.5,19.5,C.wall);
box(gT,40.8,41.2,TY,TY+8,11.5,19.5,C.glass,0.35);
box(gT,34.6,41.4,TY+8,TY+8.5,11.1,19.9,C.slab);
const tank=new T.Mesh(new T.CylinderGeometry(2,2,4,20),M(0x2a2a2a));tank.position.set(6,TY+9,12);[[4.1,10.1],[7.6,10.1],[4.1,13.6],[7.6,13.6]].forEach(p=>box(gT,p[0],p[0]+0.3,TY,TY+7,p[1],p[1]+0.3,0x55575a));box(gT,3.9,8.1,TY+7,TY+7.2,9.9,14.1,0x55575a);
{const sw=new T.Mesh(new T.BoxGeometry(5,0.2,3),M(0x22344e));sw.position.set(10,TY+1.2,6);sw.rotation.x=0.5;sw.castShadow=true;gT.add(sw);}tank.castShadow=true;gT.add(tank);
[[16.5,10.5],[26,10.5],[16.5,18],[26,18]].forEach(p=>box(gT,p[0]-0.25,p[0]+0.25,TY,TY+3,p[1]-0.25,p[1]+0.25,0x55575a));
[0.8,1.6,2.4].forEach(d=>{const y=TY+d;box(gT,16.5,26,y,y+0.12,10.35,10.65,C.wall);box(gT,16.5,26,y,y+0.12,17.85,18.15,C.wall);box(gT,16.35,16.65,y,y+0.12,10.5,18,C.wall);box(gT,25.85,26.15,y,y+0.12,10.5,18,C.wall);});
box(gT,15.9,26.6,TY+3,TY+3.25,9.9,18.6,0xbfe3f2,0.38);
// ---------- Skylights and high ventilators (light + air for rooms with no window) ----------
{const skyMat=new T.MeshStandardMaterial({color:0xfffdf2,emissive:0xfff3d0,emissiveIntensity:0.9,roughness:1});
(typeof skylights!=='undefined'?skylights:[]).forEach(([n,x0,x1,z0,z1])=>{
box(gT,x0-0.25,x1+0.25,TY,TY+0.6,z0-0.25,z0,C.wall);box(gT,x0-0.25,x1+0.25,TY,TY+0.6,z1,z1+0.25,C.wall);box(gT,x0-0.25,x0,TY,TY+0.6,z0,z1,C.wall);box(gT,x1,x1+0.25,TY,TY+0.6,z0,z1,C.wall);
box(gT,x0,x1,TY+0.6,TY+0.68,z0,z1,C.glass,0.5);
const m=new T.Mesh(new T.BoxGeometry(x1-x0,0.05,z1-z0),skyMat);m.position.set((x0+x1)/2,BASE[2]+9.95,(z0+z1)/2);TD[2].add(m);
label(labT,'Skylight: '+n,(x0+x1)/2,TY+2.2,(z0+z1)/2,0.6);});
(typeof ventilators!=='undefined'?ventilators:[]).forEach(([l,ax,f,a0,a1])=>{const b=BASE[l];
const P=(y0,y1,d,c,o)=>ax==='x'?box(TD[l],f-d,f+d,y0,y1,a0,a1,c,o):box(TD[l],a0,a1,y0,y1,f-d,f+d,c,o);
P(b+7,b+8.5,0.25,0xdfe8ea,0.85);for(let k=1;k<5;k++)P(b+7+k*0.3-0.02,b+7+k*0.3+0.02,0.27,0x8a8f93);});}
for(let i=0;i<3;i++){const gr=new T.Group();gr.position.set(18.5+i*4.5,TY+1.4,4.5);gr.rotation.y=-Math.PI/4;const p=new T.Mesh(new T.BoxGeometry(4,0.12,3),M(0x22344e));p.rotation.x=0.4;p.castShadow=true;gr.add(p);gT.add(gr);}
box(gT,3.5,12.5,TY,TY+1.2,1,2.4,0x9a958c);box(gT,3.5,12.5,TY+1.2,TY+1.8,1,2.4,C.leaf);
box(gT,4.5,12.5,TY,TY+1.2,22.1,23.5,0x9a958c);box(gT,4.5,12.5,TY+1.2,TY+1.8,22.1,23.5,C.leaf);
label(labT,'Courtyard cap',21.25,TY+6.5,14.25);label(labT,'Stair skylight',38,TY+10,15.5);label(labT,'Water tank (SW)',6,TY+13,12);label(labT,'Solar water heater',10,TY+4,6);label(labT,'Solar panels',23,TY+5,4.5);label(labT,'Terrace garden',9.5,TY+4,12);label(labT,'Open sit-out',52,25,18);label(labT,'Shops + godown',50,5,5);

box(gN,0,60,-0.5,34,-14,-0.35,0xb5b3ac,0.28);box(gN,0,60,-0.5,34,24.85,38,0xb5b3ac,0.28);
label(labT,'Steel grille over courtyard',21.25,TY+9,10);label(gC,'Road side · NE',68,2,12);label(gC,'Back · SW',-8,2,12);label(gC,'NW neighbour',30,2,-4);label(gC,'SE neighbour',30,2,29);

// Breeze from the back (SW) through the bedrooms' back windows and open doors, into the courtyard, up and out of the cap louvres
const paths=[[[-8,14,20],[2.5,14,20],[8,14,18.6],[11.5,14,15.2],[14.5,14,15],[18,14.5,14],[21,16,14],[21,TY+1.8,14],[21,TY+1.8,4],[21,TY+9,-2]],
[[-8,14,6],[2.5,14,6],[10,14,8.5],[14,14,9],[19,14,9.6],[24,14,10],[24.4,15,12.5],[24.4,TY+1.8,13],[24.4,TY+1.8,21],[24.4,TY+9,27]],
[[-8,25,6],[2.5,25,6],[9,25,9],[10,25,12.5],[12.5,25,13.2],[15,25,13.5],[19,26,14],[23,TY+1.8,14],[23,TY+1.8,4],[23,TY+9,-2]]];
const cum=p=>{const c=[0];for(let i=1;i<p.length;i++)c.push(c[i-1]+Math.hypot(p[i][0]-p[i-1][0],p[i][1]-p[i-1][1],p[i][2]-p[i-1][2]));return c;};
const at=(p,c,u)=>{const d=u*c[c.length-1];let i=1;while(i<c.length-1&&c[i]<d)i++;const t=(d-c[i-1])/((c[i]-c[i-1])||1);return [0,1,2].map(k=>p[i-1][k]+(p[i][k]-p[i-1][k])*t);};
const pm=new T.MeshBasicMaterial({color:0x2f8ad8,toneMapped:false});const pg=new T.SphereGeometry(0.35,10,8);
const parts=[];
paths.forEach(p=>{const c=cum(p);for(let i=0;i<26;i++){const m=new T.Mesh(pg,pm);air.add(m);const q={p:p,c:c,u:i/26,m:m,sp:0.05};const v=at(p,c,q.u);m.position.set(v[0],v[1],v[2]);parts.push(q);}});

let plan=false,siteOn=false,raining=false,mode='all',showLab=true,season=0,hour=8,xr=false,walk=false,yaw=0,pitch=0;const eye=new T.Vector3();const hb=document.getElementById('hb');
let th=0.75,ph=1.0,rad=115;const tgt=new T.Vector3(30,14,12);
// The camera glides towards th/ph/rad/tgt; cth/cph/crad/ctgt are what is shown this frame.
let cth=th,cph=ph,crad=rad;const ctgt=new T.Vector3(tgt.x,tgt.y,tgt.z);const TAU=Math.PI*2;
const PHMIN=0.02,PHMAX=1.55,RMIN=10,RMAX=260;const clampT=()=>{tgt.x=Math.min(75,Math.max(-15,tgt.x));tgt.z=Math.min(40,Math.max(-15,tgt.z));tgt.y=Math.min(45,Math.max(0,tgt.y));};
const views={all:[0.75,1.0,118,14],0:[0.6,0.75,85,2],1:[0.6,0.72,88,13],2:[0.6,0.72,92,23]};
function apply(){TD.forEach((g,i)=>g.visible=!xr&&(mode==='all'||mode!==i));
G.forEach((g,i)=>{g.visible=mode==='all'||i<=mode;});gT.visible=mode==='all'&&!xr;gP.visible=mode==='all'&&!xr;
walls.forEach(w=>{const cut=mode!=='all'&&w.lvl===mode;let h=cut?4:10;if(w.hh!=null)h=cut?Math.min(4,w.hh):w.hh;if(siteOn&&w.site)h=Math.min(h,w.site);w.m.visible=!w.del;w.m.scale.y=h;w.m.position.y=w.base+h/2;});
LB.forEach((g,i)=>{g.visible=showLab&&mode===i;});labT.visible=showLab&&mode==='all';gC.visible=showLab;
}
function setView(v){if(walk)leaveWalk();mode=v==='all'?'all':+v;const s=views[v];th=s[0];ph=s[1];rad=s[2]*Math.max(1,1.1/(cam.aspect||1));tgt.set(30,s[3],12);if(plan){th=Math.PI/2;ph=0.02;rad=Math.max(85,108/(cam.aspect||1));}th+=TAU*Math.round((cth-th)/TAU);apply();document.querySelectorAll('#views button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.v===String(v))));}
function setX(on){xr=on;walls.forEach(w=>{const o=w.orig;const solid=o.opacity===1;w.m.material=on&&solid?M(o.color.getHex(),0.2):o;w.m.castShadow=!(on&&solid)&&o.opacity>=0.6;});apply();}
document.getElementById('spots').innerHTML=spots.map((s,i)=>'<button data-i="'+i+'" aria-pressed="false">'+s[0]+'</button>').join('');
function goSpot(i){const s=spots[i];const dx=s[4]-s[2],dz=s[5]-s[3];enterWalk(s[0],s[1],s[2],s[3],Math.atan2(dz,dx),Math.atan2(s[6],Math.hypot(dx,dz)));
document.querySelectorAll('#spots button').forEach((b,j)=>b.setAttribute('aria-pressed',String(j===i)));}
function leaveWalk(){walk=false;R.toneMappingExposure=1.05;cam.fov=38;cam.near=1;cam.far=700;cam.updateProjectionMatrix();document.getElementById('walkbar').hidden=true;
document.querySelectorAll('#spots button').forEach(b=>b.setAttribute('aria-pressed','false'));hb.textContent='Drag to turn · right-drag, Shift-drag or two fingers to move · scroll or pinch to zoom · double-tap to look closer';setX(document.getElementById('cX').checked);}
let lvlW=1;const keys={f:0,b:0,l:0,r:0};
const LVLN=['Ground floor','1st floor','2nd floor','Terrace'];
const BLK=[[],[],[],[]];
LV.forEach((l,i)=>l.forEach(r=>{if(r[1]==='void'||r[1]==='air')BLK[i].push([r[2],r[3],r[4],r[5]]);}));
BLK[3].push([16.5,26,10.5,18],[-9,2.5,-9,40],[44,70,12.25,40],[56,70,-9,12.25]);
function eyeY(l){return (l===3?TY:BASE[l])+5.2;}
function free(x,z){const L=lvlW,r=0.6;
if(z<0.4||z>24.1||x<0.4||x>(L===0?78:59.6))return false;
for(const w of walls){if(w.lvl!==L||w.del)continue;const b=w.b;if(x>b[0]-r&&x<b[1]+r&&z>b[2]-r&&z<b[3]+r)return false;}
for(const b of BLK[L]){if(x>b[0]&&x<b[1]&&z>b[2]&&z<b[3])return false;}
return true;}
function step(d){const nx=eye.x+Math.cos(yaw)*d,nz=eye.z+Math.sin(yaw)*d;if(free(nx,nz)){eye.x=nx;eye.z=nz;}else if(free(nx,eye.z))eye.x=nx;else if(free(eye.x,nz))eye.z=nz;}
const inS=(x0,x1,z0,z1)=>eye.x>x0&&eye.x<x1&&eye.z>z0&&eye.z<z1;
function stairOpts(){const c=inS(35,41,11.5,19.5);if(!c)return [null,null];return [lvlW<3?lvlW+1:null,lvlW>0?lvlW-1:null];}
let lastOpt='';
function updWalkUI(){const o=stairOpts();const k=o.join(',')+lvlW;if(k===lastOpt)return;lastOpt=k;
document.getElementById('upF').disabled=o[0]===null;document.getElementById('dnF').disabled=o[1]===null;
document.getElementById('walkfloor').textContent=LVLN[lvlW]+(o[0]!==null||o[1]!==null?' · on the stairs':'');}
function goFloor(i){const o=stairOpts();const t=o[i];if(t===null)return;lvlW=t;eye.y=eyeY(t);lastOpt='';}
function enterWalk(name,l,x,z,yw,pt){R.toneMappingExposure=1.05;mode='all';walk=true;setX(false);LB.forEach(g=>g.visible=false);labT.visible=false;gC.visible=false;
lvlW=l;eye.set(x,eyeY(l),z);yaw=yw;pitch=pt;lastOpt='';
cam.fov=68;cam.near=0.25;cam.far=260;cam.updateProjectionMatrix();
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
sun.intensity=(alt>0?2.4*Math.min(1,alt*4):0)*(raining?0.2:1);hemi.intensity=alt>0?0.55:0.25;
document.getElementById('hrv').textContent=fmt(hour);
const dir=D[Math.round(az/(Math.PI/8))%16];
document.getElementById('sunr').textContent=alt>0?'Sun in the '+dir+', '+Math.round(alt*180/Math.PI)+'° above the horizon':'The sun is below the horizon';
let h;
if(hour<10)h=season===2?'Winter mornings: the sun rises in the south-east, behind the neighbour, so light reaches you mainly from above, through the courtyard cap and the skylights.':'Early sun lands on the road-facing deck, Bedroom 4 and the open sit-out, and comes through the hall’s glass wall into the family lounge.';
else if(hour<14.5)h=season===2?'Winter noon: the sun is lower and from the south, so it lights the upper walls of the courtyard, which bounce light down. Keep those walls white.':'High sun drops straight down the courtyard onto the first-floor living and dining, and the glass blocks pass some to the godown below.';
else h='Low western sun hits the back court. The terracotta jaali filters it into patterned light instead of heat.';
if(raining){h=rainHint;document.getElementById('sunr').textContent='Overcast: monsoon rain, wind from the south-west';}
document.getElementById('hint').textContent=h;
}
function camUp(){if(walk){const c=Math.cos(pitch);cam.position.copy(eye);cam.lookAt(eye.x+Math.cos(yaw)*c,eye.y+Math.sin(pitch),eye.z+Math.sin(yaw)*c);return;}const k=(typeof rm!=='undefined'&&rm)?1:0.2;cth+=(th-cth)*k;cph+=(ph-cph)*k;crad+=(rad-crad)*k;ctgt.lerp(tgt,k);
cam.position.set(ctgt.x+crad*Math.sin(cph)*Math.cos(cth),ctgt.y+crad*Math.cos(cph),ctgt.z+crad*Math.sin(cph)*Math.sin(cth));cam.lookAt(ctgt);}
function size(){const w=fig.clientWidth,h=fig.clientHeight;if(!w||!h)return;R.setSize(w,h,false);cam.aspect=w/h;cam.updateProjectionMatrix();if(typeof realSize==='function')realSize(w,h);}
// ---------- Realistic render: screen-space ambient occlusion (soft shadows where surfaces meet) + FXAA smoothing ----------
const canReal=!!(T.SSAOPass&&T.SSAOPass.OUTPUT&&T.EffectComposer&&T.ShaderPass&&T.FXAAShader);let comp=null,ssao=null,fxaa=null,realOn=false;
function realSize(w,h){if(!comp)return;const pr=R.getPixelRatio();comp.setPixelRatio(pr);comp.setSize(w,h);fxaa.material.uniforms.resolution.value.set(1/(w*pr),1/(h*pr));}
function makeReal(){if(comp||!canReal)return;comp=new T.EffectComposer(R);ssao=new T.SSAOPass(S,cam,fig.clientWidth,fig.clientHeight);
ssao.kernelRadius=1.1;ssao.minDistance=0.0003;ssao.maxDistance=0.006;
ssao.beautyRenderTarget.texture.encoding=T.sRGBEncoding;
ssao.overrideVisibility=function(){const c=this._visibilityCache;this.scene.traverse(o=>{c.set(o,o.visible);if(o.isPoints||o.isLine||o.isSprite||(o.material&&o.material.transparent&&o.material.opacity<0.6))o.visible=false;});};
comp.addPass(ssao);fxaa=new T.ShaderPass(T.FXAAShader);comp.addPass(fxaa);realSize(fig.clientWidth,fig.clientHeight);}
function setReal(on){realOn=on&&canReal;if(realOn)makeReal();const cb=document.getElementById('cReal');if(cb){cb.checked=realOn;cb.disabled=!canReal;}}
function draw(){if(realOn&&comp){const u=ssao.ssaoMaterial.uniforms;u.cameraNear.value=cam.near;u.cameraFar.value=cam.far;u.cameraProjectionMatrix.value.copy(cam.projectionMatrix);u.cameraInverseProjectionMatrix.value.copy(cam.projectionMatrixInverse);comp.render();}else R.render(S,cam);}
new ResizeObserver(size).observe(fig);size();setView('all');cth=th;cph=ph;crad=rad;ctgt.set(tgt.x,tgt.y,tgt.z);

const pts=new Map();let pinch=0;
let panBtn=false;let mid=null;
function pan(dx,dy){const s=crad*0.0016,c=Math.cos(cth),n=Math.sin(cth);
tgt.x+=(-n*dx-c*dy)*s;tgt.z+=(c*dx-n*dy)*s;clampT();}
cv.addEventListener('contextmenu',e=>e.preventDefault());
cv.addEventListener('pointerdown',e=>{try{cv.setPointerCapture(e.pointerId);}catch(_){}pts.set(e.pointerId,[e.clientX,e.clientY]);panBtn=e.button===2||e.button===1||e.shiftKey;mid=null;});
cv.addEventListener('pointermove',e=>{if(!pts.has(e.pointerId))return;const p=pts.get(e.pointerId);
if(pts.size===1){if(walk){yaw+=(e.clientX-p[0])*0.005;pitch=Math.min(1.2,Math.max(-1.2,pitch-(e.clientY-p[1])*0.005));}else if(panBtn)pan(e.clientX-p[0],e.clientY-p[1]);else{th+=(e.clientX-p[0])*0.008;ph=Math.min(PHMAX,Math.max(PHMIN,ph-(e.clientY-p[1])*0.008));}}
pts.set(e.pointerId,[e.clientX,e.clientY]);
if(pts.size===2){const v=[...pts.values()];const d=Math.hypot(v[0][0]-v[1][0],v[0][1]-v[1][1]);if(pinch&&d&&!walk)rad=Math.min(RMAX,Math.max(RMIN,rad*pinch/d));pinch=d;
const m=[(v[0][0]+v[1][0])/2,(v[0][1]+v[1][1])/2];if(mid&&!walk)pan(m[0]-mid[0],m[1]-mid[1]);mid=m;}});
const up=e=>{pts.delete(e.pointerId);pinch=0;mid=null;};
cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',up);
cv.addEventListener('wheel',e=>{e.preventDefault();if(walk){step(-e.deltaY*0.01);return;}rad=Math.min(RMAX,Math.max(RMIN,rad*(1+Math.max(-0.3,Math.min(0.3,e.deltaY*0.001)))));},{passive:false});
// Double-tap / double-click: glide in to look closely at that spot
const frc=new T.Raycaster(),fnd=new T.Vector2();let lastTap=null,downAt=null;
const shown=o=>{while(o){if(!o.visible)return false;o=o.parent;}return true;};
function focusAt(cx,cy){const b=cv.getBoundingClientRect();fnd.set((cx-b.left)/b.width*2-1,-(cy-b.top)/b.height*2+1);frc.setFromCamera(fnd,cam);
const hits=frc.intersectObjects([...G,gT,gP],true).filter(h=>h.object.isMesh&&shown(h.object));let p=hits.length?hits[0].point:null;
if(!p){const y=mode==='all'?0:BASE[mode],o=frc.ray.origin,d=frc.ray.direction;if(Math.abs(d.y)>1e-6){const t=(y-o.y)/d.y;if(t>0)p=o.clone().addScaledVector(d,t);}}
if(!p)return;tgt.copy(p);clampT();rad=Math.max(RMIN+6,Math.min(rad*0.55,45));}
cv.addEventListener('pointerdown',e=>{downAt=[e.clientX,e.clientY];});
cv.addEventListener('pointerup',e=>{if(walk||!downAt||pts.size>0)return;if(Math.hypot(e.clientX-downAt[0],e.clientY-downAt[1])>8){lastTap=null;return;}
const now=performance.now();if(lastTap&&now-lastTap[2]<350&&Math.hypot(e.clientX-lastTap[0],e.clientY-lastTap[1])<30){lastTap=null;focusAt(e.clientX,e.clientY);return;}
lastTap=[e.clientX,e.clientY,now];});
// On-screen buttons: hold to keep turning / tilting / zooming
let ob=null;const orbitEl=document.getElementById('orbit');
if(orbitEl&&orbitEl.querySelectorAll){orbitEl.querySelectorAll('button').forEach(b=>{const o=b.dataset.o;
if(o==='c'){b.addEventListener('click',()=>setView(mode==='all'?'all':String(mode)));return;}
const on=e=>{e.preventDefault();ob=o;orbMove(o,0.22);},off=()=>{ob=null;};b.addEventListener('pointerdown',on);b.addEventListener('pointerup',off);b.addEventListener('pointerleave',off);b.addEventListener('pointercancel',off);});}
function orbMove(o,dt){if(walk)return;if(o==='l')th-=1.3*dt;if(o==='r')th+=1.3*dt;if(o==='u')ph=Math.max(PHMIN,ph-0.9*dt);if(o==='d')ph=Math.min(PHMAX,ph+0.9*dt);
if(o==='i')rad=Math.max(RMIN,rad*(1-1.3*dt));if(o==='o')rad=Math.min(RMAX,rad*(1+1.3*dt));}
function orbStep(dt){if(orbitEl&&orbitEl.hidden!==walk)orbitEl.hidden=walk;if(ob)orbMove(ob,dt);}

document.getElementById('views').addEventListener('click',e=>{const b=e.target.closest('button');if(b)setView(b.dataset.v);});
document.getElementById('seasons').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;season=+b.dataset.s;document.querySelectorAll('#seasons button').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));sunUpdate();});
document.getElementById('hr').addEventListener('input',e=>{hour=+e.target.value;sunUpdate();});
document.getElementById('cAir').addEventListener('change',e=>{air.visible=e.target.checked;});
document.getElementById('cReal').addEventListener('change',e=>setReal(e.target.checked));
setReal(!(window.matchMedia&&matchMedia('(max-width:900px)').matches));
// Save a picture: render this view at twice the screen size and download it as a PNG
document.getElementById('savePic').addEventListener('click',()=>{const w=fig.clientWidth,h=fig.clientHeight,pr=R.getPixelRatio(),k=Math.min(3,Math.max(2,2400/(w*pr)));
R.setPixelRatio(pr*k);R.setSize(w,h,false);realSize(w,h);camUp();draw();
R.domElement.toBlob(b=>{const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='kundan-home-'+(walk?'room':'view')+'.png';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),4000);},'image/png');
R.setPixelRatio(pr);R.setSize(w,h,false);realSize(w,h);});
document.getElementById('cFast').addEventListener('change',e=>{const f=e.target.checked;if(f)setReal(false);sun.castShadow=!f;R.setPixelRatio(f?1:Math.min(2,window.devicePixelRatio||1));size();});
document.getElementById('cNb').addEventListener('change',e=>{gN.visible=e.target.checked;});
document.getElementById('cSite').addEventListener('change',e=>{siteOn=e.target.checked;apply();});
document.getElementById('cPlan').addEventListener('change',e=>{plan=e.target.checked;setView(mode==='all'?'all':String(mode));});
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
const RN=3000,RLEN=1.3,RV=34,RW=0.3; // drops, streak length ft, fall speed ft/s, drift towards +x (NE) per ft of fall
const inQ=(x,z,r)=>x>r[0]&&x<r[1]&&z>r[2]&&z<r[3];
// Where a drop stops: [x0,x1,z0,z1,height]. First match wins.
const rainStops=[
[15.9,26.6,9.9,18.6,TY+3.25],// courtyard cap keeps the courtyard dry
[34.6,41.4,11.1,19.9,TY+8.5],// stair head
[0,2.5,0,24.5,BASE[1]],        // back court: through the roof grid onto the 1st-floor court
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
const k=i*6;rp[k]=d.x;rp[k+1]=d.y;rp[k+2]=d.z;rp[k+3]=d.x-RLEN*RW;rp[k+4]=d.y+RLEN;rp[k+5]=d.z;}
rg.attributes.position.needsUpdate=true;}
rainStep(0);
// Wet, open-to-rain surfaces and the rainwater downpipes (shown only while it rains)
const gWet=new T.Group();gRain.add(gWet);
box(gWet,0.05,2.45,BASE[1]+0.02,BASE[1]+0.07,0.05,24.45,0x6f8aa3,0.45);
box(gWet,56.05,59.95,BASE[2]+0.02,BASE[2]+0.07,0.05,12.2,0x6f8aa3,0.45);
box(gWet,44.05,59.95,BASE[2]+0.02,BASE[2]+0.07,12.3,24.45,0x6f8aa3,0.45);
[[2.5,16.5,0,24.5],[16.5,26,0,10.5],[16.5,26,18,24.5],[26,35,0,24.5],[35,41,0,11.5],[35,41,19.5,24.5],[41,44,0,24.5],[44,56,0,12.25]].forEach(r=>box(gWet,r[0]+0.05,r[1]-0.05,TY+0.02,TY+0.07,r[2]+0.05,r[3]-0.05,0x6f8aa3,0.4));
[[12,-0.45],[40,-0.45],[12,24.95],[40,24.95]].forEach(p=>box(gWet,p[0]-0.2,p[0]+0.2,0,TY+0.3,p[1]-0.2,p[1]+0.2,0x3f6f9a));
label(gWet,'Rainwater downpipe',40,TY-4,-1.5,0.8);label(gWet,'Back court gets wet: slope + drain',1.25,BASE[1]+3,12,0.8);
label(gWet,'Courtyard stays dry under the cap',21.25,TY+5,14.25,0.8);
const rainHint='Monsoon rain, blowing in from the south-west. The courtyard cap keeps the courtyard dry (keep the louvre gap above it narrow, or slanting rain gets in). Rain falls through the steel grids onto the back court, the road deck and the sit-out: give those floors a slight slope, a floor drain and a raised door threshold. The terrace drains through downpipes on the neighbour-wall sides into the rainwater recharge pit.';
document.getElementById('cRain').addEventListener('change',e=>{raining=e.target.checked;S.fog=raining?new T.Fog(0x9aa3ab,90,320):null;sunUpdate();});

// ---------- Wall editor: tap a wall to delete it or change its height; add new walls ----------
const EDK='kundan-wall-edits-v1';
let edits=[];try{edits=JSON.parse(localStorage.getItem(EDK)||'[]')||[];}catch(_){edits=[];}
const r2=v=>Math.round(v*100)/100;
const wkey=(lv,ax,f,a0,a1)=>[lv,ax,r2(f),r2(a0),r2(a1)].join('|');
const wk=w=>wkey(w.lvl,w.ax,w.f,w.a0,w.a1);
const ek=e=>wkey(e.lv,e.ax,e.f,e.a0,e.a1);
const SIDE={nw:'north-west',se:'south-east',sw:'back (south-west)',ne:'road (north-east)'};
function roomAt(lv,x,z){if(z<0)return SIDE.nw;if(z>24.5)return SIDE.se;if(x<0)return SIDE.sw;if(x>60)return SIDE.ne;
const r=LV[lv].find(r=>x>r[2]&&x<r[3]&&z>r[4]&&z<r[5]);return r?(r[0]||({path:'corridor',air:'open air',void:'void',open:'open court'}[r[1]]||r[1])):'open space';}
function wallName(w){const m=(w.a0+w.a1)/2;
const A=w.ax==='x'?roomAt(w.lvl,m,w.f-0.6):roomAt(w.lvl,w.f-0.6,m),B=w.ax==='x'?roomAt(w.lvl,m,w.f+0.6):roomAt(w.lvl,w.f+0.6,m);
const out=Object.values(SIDE);let s;
if(out.includes(A)&&!out.includes(B))s='Outer wall of '+B+', '+A+' side';
else if(out.includes(B)&&!out.includes(A))s='Outer wall of '+A+', '+B+' side';
else if(A===B&&w.added)s='Wall inside '+A;else if(A===B)s='Wall between the two '+A+' spaces';else s='Wall between '+A+' and '+B;
return LVLN[w.lvl]+': '+s+' ('+(Math.round((w.a1-w.a0)*10)/10)+' ft long)';}
function addWall(lv,ax,f,a0,a1){seg0(G[lv],ax,f,a0,a1,BASE[lv],'solid','room',lv,0);const w=walls[walls.length-1];w.added=true;return w;}
function applyEdit(e){
if(e.op==='add'){const w=addWall(e.lv,e.ax,e.f,e.a0,e.a1);if(e.h!=null)w.hh=e.h;return;}
const k=ek(e);walls.forEach(w=>{if(wk(w)!==k)return;if(e.op==='del')w.del=true;if(e.op==='h')w.hh=e.h;});}
(typeof wallEdits!=='undefined'?wallEdits:[]).forEach(applyEdit);
edits.forEach(applyEdit);
const $=id=>document.getElementById(id);
function edCount(){const n=edits.length;$('edN').textContent=n?n+' change'+(n>1?'s':'')+' saved in this browser':'No changes yet';$('edCopy').disabled=!n;$('edUndoAll').disabled=!n;}
function saveEd(){try{localStorage.setItem(EDK,JSON.stringify(edits));}catch(_){}edCount();}
let editOn=false,sel=null,adding=0,addStart=null;
const hiMat=new T.MeshLambertMaterial({color:0xffc400});
const marker=box(S,-0.4,0.4,0,3,-0.4,0.4,0xffc400);marker.visible=false;
function msg(t){$('edMsg').textContent=t;}
function unsel(){if(sel){const o=sel.orig;sel.m.material=xr&&o.opacity===1?M(o.color.getHex(),0.2):o;}sel=null;$('edPanel').hidden=true;}
function select(w){unsel();sel=w;w.m.material=hiMat;$('edPanel').hidden=false;
$('edInfo').textContent=wallName(w)+(w.added?' · added by you':'');
const h=w.hh!=null?w.hh:10;$('edH').value=h;$('edHv').textContent=h+' ft';$('edRestore').disabled=!!w.added;}
function upsert(op,w,h){const k=wk(w);
if(w.added){const a=edits.find(e=>e.op==='add'&&ek(e)===k);if(op==='del')edits=edits.filter(e=>e!==a);else if(a)a.h=h;saveEd();return;}
edits=edits.filter(e=>!(e.op===op&&ek(e)===k));
edits.push(Object.assign({op:op,lv:w.lvl,ax:w.ax,f:r2(w.f),a0:r2(w.a0),a1:r2(w.a1)},op==='h'?{h:h}:{}));saveEd();}
$('cEdit').addEventListener('change',e=>{editOn=e.target.checked;$('edTools').hidden=!editOn;
if(!editOn){unsel();adding=0;marker.visible=false;}
msg(editOn?'Tap a wall to select it. Tip: choose Ground, 1st floor or 2nd floor under View first, so that floor\'s walls are easy to reach.':'');});
$('edDel').addEventListener('click',()=>{if(!sel)return;const w=sel;unsel();w.del=true;if(!w.added){const k=wk(w);edits=edits.filter(e=>!(e.op==='h'&&ek(e)===k));}upsert('del',w);
if(w.added){if(w.m.parent)w.m.parent.remove(w.m);walls.splice(walls.indexOf(w),1);}
apply();msg('Wall deleted. "Undo all my changes" brings everything back.');});
$('edH').addEventListener('input',e=>{if(!sel)return;const h=+e.target.value;sel.hh=h;$('edHv').textContent=h+' ft';upsert('h',sel,h);apply();});
$('edRestore').addEventListener('click',()=>{if(!sel||sel.added)return;const k=wk(sel);edits=edits.filter(e=>ek(e)!==k);sel.hh=null;saveEd();select(sel);apply();msg('Wall is back to the original design.');});
$('edAdd').addEventListener('click',()=>{if(mode==='all'){msg('First choose Ground, 1st floor or 2nd floor under View, then press "Add a wall" again.');return;}
unsel();adding=1;msg('Tap on the floor where the new wall starts ('+LVLN[mode]+').');});
$('edUndoAll').addEventListener('click',()=>{if(!confirm('Remove all your wall changes and go back to the original design?'))return;edits=[];saveEd();location.reload();});
$('edCopy').addEventListener('click',()=>{
const lines=edits.map(e=>{const n=wallName({lvl:e.lv,ax:e.ax,f:e.f,a0:e.a0,a1:e.a1});
return e.op==='del'?'- Delete: '+n:e.op==='h'?'- Make '+e.h+' ft high: '+n:'- Add new wall: '+n+(e.h!=null?', '+e.h+' ft high':'');});
const txt='My wall changes in the 3D model:\n'+lines.join('\n')+'\n\nDATA '+JSON.stringify(edits);
const ta=$('edOut');ta.hidden=false;ta.value=txt;ta.select();
const manual=()=>msg('Select all the text in the box below, copy it, and paste it to Claude.');
try{navigator.clipboard.writeText(txt).then(()=>msg('Copied. Paste it into the chat with Claude to make these changes permanent.'),manual);}catch(_){manual();}});
edCount();
const rc=new T.Raycaster(),ndc=new T.Vector2();let tap=null;
cv.addEventListener('pointerdown',e=>{tap=[e.clientX,e.clientY];});
cv.addEventListener('pointerup',e=>{if(!editOn||walk||!tap||e.button>0)return;if(Math.hypot(e.clientX-tap[0],e.clientY-tap[1])>6)return;
const b=cv.getBoundingClientRect();ndc.set((e.clientX-b.left)/b.width*2-1,-(e.clientY-b.top)/b.height*2+1);rc.setFromCamera(ndc,cam);
if(adding){const y=BASE[mode],o=rc.ray.origin,d=rc.ray.direction;if(Math.abs(d.y)<1e-6)return;const t=(y-o.y)/d.y;if(t<0)return;
const px=Math.round((o.x+d.x*t)*2)/2,pz=Math.round((o.z+d.z*t)*2)/2;
if(adding===1){addStart=[px,pz];marker.position.set(px,y+1.5,pz);marker.visible=true;adding=2;msg('Now tap where the wall ends. It is drawn as a straight line.');return;}
const dx=px-addStart[0],dz=pz-addStart[1];let w;
if(Math.abs(dx)>=Math.abs(dz)){if(Math.abs(dx)<1){msg('Too short. Tap a point further away.');return;}w={ax:'x',f:addStart[1],a0:Math.min(px,addStart[0]),a1:Math.max(px,addStart[0])};}
else{if(Math.abs(dz)<1){msg('Too short. Tap a point further away.');return;}w={ax:'z',f:addStart[0],a0:Math.min(pz,addStart[1]),a1:Math.max(pz,addStart[1])};}
const nw=addWall(mode,w.ax,w.f,w.a0,w.a1);edits.push({op:'add',lv:mode,ax:w.ax,f:r2(w.f),a0:r2(w.a0),a1:r2(w.a1)});saveEd();
adding=0;marker.visible=false;apply();select(nw);msg('Wall added. Change its height below, or delete it.');return;}
const objs=walls.filter(w=>!w.del&&w.m.visible&&G[w.lvl].visible).map(w=>w.m);const hit=rc.intersectObjects(objs,false)[0];
if(!hit){unsel();msg('No wall there. Tap directly on a wall.');return;}
select(walls.find(w=>w.m===hit.object));msg('');});
apply();

const rm=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
let last=performance.now();
function loop(now){const dt=Math.min(0.05,(now-last)/1000);last=now;
if(air.visible&&!rm)parts.forEach(q=>{q.u=(q.u+dt*q.sp)%1;const v=at(q.p,q.c,q.u);q.m.position.set(v[0],v[1],v[2]);});
gRain.visible=raining&&(mode==='all'||walk);if(gRain.visible)rainStep(rm?0:dt);
if(walk){const sp=6*dt;if(keys.f)step(sp);if(keys.b)step(-sp);if(keys.l)yaw-=1.6*dt;if(keys.r)yaw+=1.6*dt;updWalkUI();}
orbStep(dt);camUp();draw();requestAnimationFrame(loop);}
requestAnimationFrame(loop);
};
(document.fonts&&document.fonts.ready?document.fonts.ready:Promise.resolve()).then(start,start);
}
