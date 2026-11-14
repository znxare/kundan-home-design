// Walkability test: walks a grid from the street through every door and stair
// and fails if any named room (or the terrace) cannot be reached.
// Run: node tests/walkability.test.js   (or: npm test)
const fs=require('fs');
const U=()=>new Proxy(function(){},{get:(t,k)=>{if(k in t)return t[k];if(k==='then')return undefined;t[k]=U();return t[k];},apply:()=>U(),construct:()=>U(),set:(t,k,v)=>{t[k]=v;return true;}});
class V3{constructor(x=0,y=0,z=0){this.x=x;this.y=y;this.z=z;}set(x,y,z){this.x=x;this.y=y;this.z=z;return this;}copy(v){return this.set(v.x,v.y,v.z);}}
class Mat{constructor(p={}){Object.assign(this,{opacity:1},p);this.color={getHex:()=>p.color};}}
class Obj{constructor(){this.position=new V3();this.scale=new V3(1,1,1);this.rotation={x:0,y:0,z:0};this.children=[];}add(c){this.children.push(c);}}
global.THREE=new Proxy({Vector3:V3,BufferGeometry:class{constructor(){this.attributes={};}setAttribute(k,v){this.attributes[k]=v;}},MeshLambertMaterial:Mat,MeshBasicMaterial:Mat,SpriteMaterial:Mat,Mesh:class extends Obj{constructor(g,m){super();this.material=m;}},Group:Obj,Scene:Obj,Sprite:Obj,
 DirectionalLight:class extends Obj{constructor(){super();this.shadow={mapSize:{set(){}},camera:{}};this.target=new Obj();}},
 PerspectiveCamera:class extends Obj{lookAt(){}updateProjectionMatrix(){}},
 WebGLRenderer:class{constructor(){this.shadowMap={};this.domElement=el();}setPixelRatio(){}setSize(){}render(){}}},{get:(t,k)=>k in t?t[k]:class extends Obj{}});
function el(){const e={style:{},hidden:false,disabled:false,textContent:'',dataset:{},innerHTML:'',checked:false,clientWidth:800,clientHeight:600,
 addEventListener(){},setAttribute(){},appendChild(){},setPointerCapture(){},closest(){return null},getContext(){return {measureText:()=>({width:100}),fillRect(){},fillText(){}}}};return e;}
const els={};
global.window=global;global.addEventListener=()=>{};global.devicePixelRatio=1;
global.document={getElementById:id=>els[id]||(els[id]=el()),querySelectorAll:()=>[],createElement:()=>el()};
global.ResizeObserver=class{observe(){}};global.matchMedia=()=>({matches:true});global.requestAnimationFrame=()=>{};global.performance={now:()=>0};
let src=fs.readFileSync(require('path').join(__dirname,'..','house-data.js'),'utf8')+'\n'+fs.readFileSync(require('path').join(__dirname,'..','app.js'),'utf8');
src=src.replace('let lvlW=1;','let lvlW=1;window.__set=l=>{lvlW=l};window.__LV=LV;window.__free=(x,z)=>free(x,z);');
eval(src);
setTimeout(()=>{
 const free=window.__free,set=window.__set;
 // BFS over grid per level, using stair transitions
 const step=0.5;const key=(l,x,z)=>l+','+x+','+z;const seen=new Set();const q=[[0,70,22.5]];seen.add(key(0,70,22.5));
 const inS=(x,z,a)=>x>a[0]&&x<a[1]&&z>a[2]&&z<a[3];const CS=[35,41,11.5,19.5],HS=[15,21,17,24.5];
 while(q.length){const [l,x,z]=q.shift();set(l);
  for(const [dx,dz] of [[step,0],[-step,0],[0,step],[0,-step]]){const nx=x+dx,nz=z+dz;const k=key(l,nx,nz);if(seen.has(k))continue;set(l);if(free(nx,nz)){seen.add(k);q.push([l,nx,nz]);}}
  const tr=[];if(inS(x,z,CS)){if(l===0)tr.push(1);if(l===1)tr.push(0);} if(inS(x,z,HS)){if(l===1)tr.push(2);if(l===2)tr.push(1,3);if(l===3)tr.push(2);}
  for(const t of tr){const k=key(t,x,z);if(!seen.has(k)){set(t);if(free(x,z)){seen.add(k);q.push([t,x,z]);}}}
 }
 const LVd=window.__LV;const bad=[];
 LVd.forEach((lv,i)=>lv.forEach(r=>{if(!r[0]||['air','void'].includes(r[1]))return;let ok=false;for(const k of seen){const [l,x,z]=k.split(',').map(Number);if(l===i&&x>r[2]&&x<r[3]&&z>r[4]&&z<r[5]){ok=true;break;}}if(!ok){bad.push('Level '+i+': '+r[0]);}}));
 const t=[...seen].filter(k=>k.startsWith('3,')).length;if(!t)bad.push('Terrace');
 if(bad.length){console.error('FAIL - cannot walk to:\n  '+bad.join('\n  '));process.exit(1);}
 console.log('PASS - every room, the shops and the terrace can be reached on foot from the street ('+seen.size+' walkable spots checked).');
},50);
