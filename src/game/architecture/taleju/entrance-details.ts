import type {CentralMaterial,CentralModel} from '../central-model.ts';
import {box,shape,profile} from '../architecture-primitives.ts';
import {entranceCourt as plan} from './entrance-plan.ts';

/** Photo A/B plaster profiles; these are not the gilded toranas of the deeper shrine. */
export function plasterArch(m:CentralModel,x:number,y:number,z:number,w:number,h:number){
 const arch=(r:number)=>Array.from({length:13},(_,i)=>{const a=Math.PI-i*Math.PI/12;return [r*Math.cos(a),h+r*.30*Math.sin(a)] as [number,number]});
 shape(m,x,y,z,[[-w*.62,0],[-w*.62,h],...arch(w*.62),[w*.62,0],[w*.49,0],[w*.49,h],...arch(w*.49).reverse(),[-w*.49,0]],.07,'plaster','yam-plaster-arched-surround');
}

/** Narrow upright, recessed carved shutter: forward focal window in photographs A/B. */
export function uprightWindow(m:CentralModel,x:number,y:number,z:number,w:number,h:number,plaster=true){
 box(m,x,y,z,w+.23,h+.20,.16,'carvedTimber','yam-upright-nested-frame');
 box(m,x,y,z+.09,w-.09,h-.08,.08,'recess','yam-upright-dark-reveal');
 for(const side of [-1,1]){
  box(m,x+side*w*.5,y,z+.22,.10,h+.22,.18,'timber','yam-upright-carved-jamb');
  box(m,x,y+side*h*.5,z+.22,w+.32,.11,.25,'carvedTimber','yam-upright-carved-lintel-sill');
 }
 for(let i=1;i<5;i++)box(m,x-w/2+i*w/5,y,z+.22,.045,h-.15,.055,'timber','yam-upright-shutter-slats');
 box(m,x,y-.15,z+.25,w,.08,.07,'carvedTimber','yam-upright-cross-rail');
 box(m,x,y+.36,z+.25,w,.06,.07,'carvedTimber','yam-upright-cross-rail');
 if(plaster){plasterArch(m,x,y-h/2-.13,z+.08,w+.25,h+.28);box(m,x,y-h/2-.17,z+.16,w+.63,.12,.42,'plaster','yam-upright-plaster-sill');}
}

/** Recessed mid-level lattice with stepped projecting frame, A/B right facade. */
export function smallLattice(m:CentralModel,x:number,y:number,z:number,w:number,h:number,material:CentralMaterial='carvedTimber'){
 box(m,x,y,z,w+.28,h+.21,.16,material,'yam-small-stepped-frame');
 box(m,x,y,z+.09,w,h,.09,'recess','yam-small-lattice-shadow');
 for(const side of [-1,1])box(m,x,y+side*(h/2+.09),z+.22,w+.52,.12,.34,material,'yam-small-projecting-head-sill');
 for(let i=1;i<7;i++)box(m,x-w/2+i*w/7,y,z+.19,.026,h,.04,material,'yam-small-lattice-bars');
 for(let i=1;i<5;i++)box(m,x,y-h/2+i*h/5,z+.20,w,.026,.04,material,'yam-small-lattice-bars');
}

/** Layered cornice and low relief. No unreadable sacred text or deity images are invented. */
export function carvedBand(m:CentralModel,width:number,y:number,z:number,height=.30){
 box(m,0,y,z,width,height,.22,'carvedTimber','yam-carved-band-shadow');
 for(const side of [-1,1])box(m,0,y+side*height*.48,z+.12,width+.08,.055,.34,'timber','yam-carved-band-moulding');
 const n=Math.floor(width/.30);
 for(let i=0;i<n;i++){
  const x=-width/2+(i+.5)*width/n;
  shape(m,x,y-height*.32,z+.15,[[-.085,0],[-.12,height*.26],[0,height*.65],[.12,height*.26],[.085,0]],.055,'timber','yam-band-relief-scallop');
 }
}

/** Photo B and Theill B64: arched lattice gallery with substantial carved piers/panel depth. */
export function galleryLight(m:CentralModel,x:number,y:number,w:number,h:number,z:number){
 box(m,x,y,z,w,h,.22,'recess','yam-gallery-recess');
 const arch=Array.from({length:17},(_,i)=>{const a=Math.PI-i*Math.PI/16;return [Math.cos(a)*w*.49,Math.sin(a)*.25] as [number,number]});
 shape(m,x,y+h/2-.23,z+.12,[[-w*.59,-.10],...arch.map(([a,b])=>[a,b+.07] as [number,number]),[w*.59,-.10],...arch.slice().reverse().map(([a,b])=>[a*.90,b-.05] as [number,number])],.12,'timber','yam-gallery-arched-lattice-head');
 // Diagonal open lattice, rather than a modern square grille. All strips merge per owner.
 const hw=w*.47,bottom=-h*.5+.02,top=h*.5-.20;
 for(const slope of [-1,1])for(let k=-12;k<=12;k++){
  const intercept=k*.13,hits:[number,number][]=[];
  for(const xx of [-hw,hw]){const yy=slope*xx+intercept;if(yy>=bottom&&yy<=top)hits.push([xx,yy]);}
  for(const yy of [bottom,top]){const xx=(yy-intercept)/slope;if(xx>-hw&&xx<hw)hits.push([xx,yy]);}
  if(hits.length===2){const [a,b]=hits,t=.012;
   shape(m,x,y,z+.20,[[a[0]-t,a[1]],[a[0]+t,a[1]],[b[0]+t,b[1]],[b[0]-t,b[1]]],.025,'timber','yam-gallery-diagonal-lattice');
  }
 }
 for(const side of [-1,1]){
  box(m,x+side*w*.55,y+.02,z+.18,.22,h+.35,.42,'carvedTimber','yam-gallery-major-pier');
  for(let j=0;j<4;j++)box(m,x+side*w*.55,y-h*.43+j*h*.29,z+.36,.25,.075,.14,'timber','yam-gallery-pier-carved-courses');
 }
 for(const side of [-1,1]){
  box(m,x+side*w*.55,y+.02,z+.40,.10,h*.72,.055,'timber','yam-gallery-pier-nested-panel');
  box(m,x+side*w*.55,y+h*.47,z+.40,.32,.13,.24,'timber','yam-gallery-pier-capital');
 }
 // Broad lobed crest silhouette is visible; figurative carving is deliberately omitted.
 shape(m,x,y+h*.54,z+.18,[[-w*.59,0],[-w*.48,.30],[-w*.22,.42],[0,.60],[w*.22,.42],[w*.48,.30],[w*.59,0],...arch.slice().reverse().map(([a,b])=>[a,b+.025] as [number,number])],.10,'carvedTimber','yam-gallery-lobed-crest');
 box(m,x,y-h/2-.20,z+.08,w,.29,.23,'carvedTimber','yam-gallery-lower-relief-panel');
 shape(m,x,y-h/2-.31,z+.23,[[-w*.40,.18],[-w*.24,0],[0,.09],[w*.24,0],[w*.40,.18]],.07,'timber','yam-gallery-panel-relief');
}

/** Miter the north courtyard corners; south side ends abut the frozen gate roof, not a fourth wing. */
export function entranceRoof(m:CentralModel,w:number,northEnd:-1|0|1){
 const d=plan.rangeDepth,edge=w/2,front=plan.eave,top=plan.ridge;
 const extent=(side:-1|1,tier:'front'|'ridge'|'back')=>{
  const miter=northEnd===0||northEnd===side;
  return side*(edge+(miter?(tier==='front'?-.75:tier==='ridge'?d/2:d+.45):.15));
 };
 const p=[[extent(-1,'front'),front,.75],[extent(1,'front'),front,.75],
  [extent(-1,'ridge'),top,-d/2],[extent(1,'ridge'),top,-d/2],
  [extent(-1,'back'),front,-d-.45],[extent(1,'back'),front,-d-.45]];
 const indices=[0,1,3,0,3,2,2,3,5,2,5,4];
 for(const under of [false,true])m.profiles.push({position:[m.origin[0],0,m.origin[1]],yaw:m.yaw,profile:[[0,0],[.1,1]],segments:4,material:under?'carvedTimber':'roof',role:under?'yam-roof-dark-soffit':'yam-roof-tile-surface',sculptedSurface:{positions:p.flatMap(([x,y,z])=>[x,y-(under?.12:0),z]),indices,uvs:p.flatMap(([x,y,z])=>[x/2,(z+y)/2])}});
 box(m,0,9.0,-d/2,w,.55,d,'carvedTimber','yam-roof-enclosed-wall-plate');
 const a=extent(-1,'front'),b=extent(1,'front');
 box(m,(a+b)/2,front-.11,.75,b-a,.20,.20,'carvedTimber','yam-deep-eave-fascia');
 box(m,(a+b)/2,front-.04,.86,b-a,.08,.045,'shutter','yam-muted-red-eave-edge');
 const n=Math.floor(w/.85);
 for(let i=0;i<n;i++){
  const x=-w/2+(i+.5)*w/n;
  box(m,x,front-.48,.32,.13,1.0,.18,'carvedTimber','yam-eave-structural-strut',false,0,-.52);
  box(m,x,front-.84,.08,.26,.18,.25,'carvedTimber','yam-eave-bracket-foot');
 }
}

/** One visible wedge and the same convex hull, with vertices in this owner's yaw frame. */
export function entranceRamp(m:CentralModel,x:number,z:number,w:number,run:number,rise:number){
 const vertices=[-w/2,0,0,w/2,0,0,w/2,0,run,-w/2,0,run,-w/2,rise,0,w/2,rise,0];
 const indices=[0,1,2,0,2,3,0,5,1,0,4,5,4,2,5,4,3,2,0,3,4,1,5,2];
 const c=Math.cos(m.yaw),s=Math.sin(m.yaw),at:[number,number,number]=[m.origin[0]+x*c+z*s,plan.floor,m.origin[1]-x*s+z*c];
 m.profiles.push({position:at,yaw:m.yaw,profile:[[0,0],[.1,1]],segments:4,material:'stone',role:'yam-entry-stone-ramp',sculptedSurface:{positions:vertices,indices}});
 const world=vertices.flatMap((_,i)=>i%3===0?[vertices[i]*c+vertices[i+2]*s,vertices[i+1],-vertices[i]*s+vertices[i+2]*c]:[]);
 m.colliders.push({position:at,size:[w,rise,run],yaw:0,vertices:world});
}

/** Only the unidentified visible silhouette is reproduced; no claimed deity, bell or ritual function. */
export function courtyardMetalFeature(m:CentralModel,x:number,z:number){
 profile(m,x,.08,z,[[0,0],[.43,0],[.47,.05],[.43,.14],[.38,.32],[.31,.66],[.26,.72],[0,.72]],'bronze','yam-unidentified-metal-base',20);
 profile(m,x,.80,z,[[.17,0],[.25,.04],[.22,.12],[.14,.18],[.10,.23],[.21,.28],[.18,.38],[.11,.43],[.07,.49],[.14,.55],[.12,.64],[.06,.69],[0,.76]],'gold','yam-unidentified-stacked-finial',16);
 const c=Math.cos(m.yaw),s=Math.sin(m.yaw),vertices:number[]=[];
 for(const [y,r] of [[0,.47],[.72,.26]])for(let i=0;i<16;i++){const a=i*Math.PI/8;vertices.push(Math.cos(a)*r,y,Math.sin(a)*r);}
 m.colliders.push({position:[m.origin[0]+x*c+z*s,.08,m.origin[1]-x*s+z*c],size:[.94,.72,.94],yaw:0,vertices});
}
