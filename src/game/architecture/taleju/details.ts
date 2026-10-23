import type {CentralModel,CentralMaterial} from '../central-model.ts';
import {box,profile,shape} from '../architecture-primitives.ts';

/** Relief frames, not a claim to reproduce undocumented deity iconography or inscriptions. */
export function window(m:CentralModel,x:number,y:number,z:number,w:number,h:number,combined=false){
 box(m,x,y,z,w+.22,h+.20,.19,'carvedTimber','taleju-window-frame');
 box(m,x,y,z+.12,w-.12,h-.10,.07,'recess','taleju-window-recess');
 for(const a of [-1,1])box(m,x+a*w/2,y,z+.21,.09,h+.30,.18,'carvedTimber','taleju-window-jamb');
 for(const a of [-1,1])box(m,x,y+a*h/2,z+.20,w+.42,.12,.32,'carvedTimber','taleju-window-cornice');
 const count=combined?11:5;
 for(let i=1;i<count;i++)box(m,x-w/2+i*w/count,y,z+.22,.025,h-.12,.035,'timber','taleju-window-lattice');
 for(let i=1;i<5;i++)box(m,x,y-h/2+i*h/5,z+.24,w-.12,.025,.035,'timber','taleju-window-lattice');
 if(combined)for(const a of [-1,1])box(m,x+a*w/3,y,z+.26,.09,h+.18,.11,'carvedTimber','taleju-window-compound-mullion');
}
export function closedDoor(m:CentralModel,x:number,z:number,w=1.0,h=2.0){
 box(m,x,.50+h/2,z,w,h,.12,'carvedTimber','taleju-closed-door',true);
 for(const side of [-1,1])box(m,x+side*(w/2+.08),.50+h/2,z+.08,.14,h+.20,.22,'carvedTimber','taleju-door-jamb');
 box(m,x,h+.62,z+.08,w+.38,.18,.28,'carvedTimber','taleju-door-lintel');
 box(m,x,.50+h/2,z+.09,.04,h,.04,'bronze','taleju-door-seam');
}
export function doorwayFrame(m:CentralModel,x:number,z:number,w:number,h:number,ornate=false,material:CentralMaterial='carvedTimber'){
 for(const side of [-1,1])for(let j=0;j<(ornate?4:2);j++)box(m,x+side*(w/2+.07+j*.09),.50+h/2,z+.08+j*.035,.10,h+.22+j*.06,.22,material,'taleju-portal-nested-jamb');
 box(m,x,h+.62,z+.16,w+(ornate?.92:.45),.23,.40,material,'taleju-portal-lintel');
 if(ornate){
  const a=w*.77;
  shape(m,x,h+.73,z+.08,[[-a,0],[-a*.98,.32],[-a*.80,.65],[-a*.56,.80],[-a*.35,1.03],[0,1.32],[a*.35,1.03],[a*.56,.80],[a*.80,.65],[a*.98,.32],[a,0]],.20,material,'taleju-portal-lobed-torana');
  // Broad rosette relief and border hierarchy; exact carved figures are not invented.
  for(let i=0;i<9;i++){const t=Math.PI*i/8;profile(m,x+Math.cos(t)*a*.70,h+.88+Math.sin(t)*.77,z+.27,[[.065,0],[.085,.045],[.05,.10],[0,.13]],material,'taleju-portal-relief-rosette',8);}
 }
}
export function roofStruts(m:CentralModel,w:number,eave:number,count:number){
 for(let i=0;i<count;i++){
  const x=-w/2+(i+.5)*w/count;
  box(m,x,eave-.42,.23,.12,.98,.14,'carvedTimber','taleju-roof-strut',false,0,-.43);
  box(m,x,eave-.80,.04,.22,.16,.26,'carvedTimber','taleju-roof-strut-foot');
 }
}
/** A mitered wing roof: adjoining wings share corner edges, not overlapping hip meshes. */
export function wingRoof(m:CentralModel,innerWidth:number,depth:number,gildedWidth=0){
 const front=innerWidth/2-.65,back=innerWidth/2+depth+.50,ridge=innerWidth/2+depth*.5;
 const p=[[-front,6.10,.65],[front,6.10,.65],[-ridge,7.50,-depth*.5],[ridge,7.50,-depth*.5],[-back,6.10,-depth-.50],[back,6.10,-depth-.50]];
 const faces=[0,1,3,0,3,2,2,3,5,2,5,4];
 const surface=(points:number[][],indices:number[],material:CentralMaterial,role:string)=>m.profiles.push({position:[m.origin[0],0,m.origin[1]],yaw:m.yaw,profile:[[0,0],[.1,1]],segments:4,material,role,sculptedSurface:{positions:points.flat(),indices,uvs:points.flatMap(([x,y,z])=>[x/2,(z+y)/2])}});
 if(gildedWidth){
  // Only the photographed central, court-facing shrine roof is gilded. Unseen rear stays tile.
  const g=gildedWidth/2;
  surface([p[0],[-g,6.10,.65],p[2],[-g,7.50,-depth*.5]],[0,1,3,0,3,2],'roof','taleju-wing-roof');
  surface([[g,6.10,.65],p[1],[g,7.50,-depth*.5],p[3]],[0,1,3,0,3,2],'roof','taleju-wing-roof');
  surface([[-g,6.10,.65],[g,6.10,.65],[-g,7.50,-depth*.5],[g,7.50,-depth*.5]],[0,1,3,0,3,2],'gold','taleju-shrine-gilded-roof');
  surface(p,[2,3,5,2,5,4],'roof','taleju-wing-roof');
 }else surface(p,faces,'roof','taleju-wing-roof');
 const under=p.map(([x,y,z])=>[x,y-.10,z]);
 m.profiles.push({position:[m.origin[0],0,m.origin[1]],yaw:m.yaw,profile:[[0,0],[.1,1]],segments:4,material:'carvedTimber',role:'taleju-wing-roof-soffit',sculptedSurface:{positions:under.flat(),indices:faces}});
 box(m,0,6.03,.65,innerWidth-1.3,.15,.18,'carvedTimber','taleju-front-eave-fascia');
 if(gildedWidth){
  box(m,0,7.50,-depth*.5,gildedWidth,.12,.22,'gold','taleju-shrine-roof-ridge');
  for(const side of [-1,1])box(m,side*(gildedWidth+innerWidth+depth)/4,7.50,-depth*.5,(innerWidth+depth-gildedWidth)/2,.12,.22,'roof','taleju-wing-roof-ridge');
 }else box(m,0,7.50,-depth*.5,innerWidth+depth,.12,.22,'roof','taleju-wing-roof-ridge');
}
