import type {CentralModel,CentralMaterial} from './central-model.ts';
import {box,profile,shape} from './architecture-primitives.ts';
/** Supplied owner photograph: form PHOTO_INFERRED; all dimensions APPROXIMATE.
 * Preserve the existing base/roof envelope and 9.55 m top, not survey precision.
 * The saved parent transform is applied by the renderer, never baked here. */
export function rebuildChyasilin(m:CentralModel){
 m.boxes=[];m.profiles=[];m.shapes=[];m.roofs=[];m.colliders=[];m.volumes=[];m.polygonRoofs=[];
 m.renderOwnership='WHOLE_ASSEMBLY';
 m.materialTints={stone:'#b5ab99',agedBrick:'#9b7760',carvedTimber:'#483123',roof:'#a16f4f',recess:'#241d18',shutter:'#8d3c30',plaster:'#c9b99e',gold:'#a18a5a'};
 const slab=(y:number,r:number,h:number,material:CentralMaterial,role:string)=>profile(m,0,y,0,[[0,0],[r,0],[r,h],[0,h]],material,role,8);
 const point=(x:number,y:number,z:number):[number,number,number]=>[m.origin[0]+x*Math.cos(m.yaw)+z*Math.sin(m.yaw),y,m.origin[1]-x*Math.sin(m.yaw)+z*Math.cos(m.yaw)];
 const floorCollider=(y:number,r:number,h:number)=>{
  const vertices:number[]=[];for(const height of [-h/2,h/2])for(let i=0;i<8;i++){const a=Math.PI/8+i*Math.PI/4,[x,,z]=point(Math.sin(a)*r,0,Math.cos(a)*r);vertices.push(x-m.origin[0],height,z-m.origin[1]);}
  m.colliders.push({position:point(0,y+h/2,0),size:[1,h,1],yaw:0,vertices});
 };
 // Keep this role and zero elevation: heritage derives the real octagonal outline.
 slab(0,2.7,.16,'stone','pavilion-platform');slab(.16,2.6,.16,'stone','pavilion-platform-recessed-course');slab(.32,2.53,.42,'agedBrick','pavilion-platform-masonry');slab(.74,2.67,.16,'stone','pavilion-landing');floorCollider(0,2.7,.9);
 for(let i=0;i<5;i++){const h=(i+1)*.18;box(m,0,h/2,3.35-i*.28,1.4,h,.3,'stone','pavilion-stair',true);}
 const face=(i:number,r:number)=>{
  const a=Math.PI/8+i*Math.PI/4,b=a+Math.PI/4,ax=Math.cos(a)*r,az=Math.sin(a)*r,bx=Math.cos(b)*r,bz=Math.sin(b)*r,len=Math.hypot(bx-ax,bz-az),tx=(bx-ax)/len,tz=(bz-az)/len,nx=Math.cos((a+b)/2),nz=Math.sin((a+b)/2),cx=(ax+bx)/2,cz=(az+bz)/2,yaw=-Math.atan2(tz,tx);
  return {len,nx,nz,yaw,put:(u:number,y:number,out:number,w:number,h:number,d:number,mat:CentralMaterial,role:string,collision=false)=>box(m,cx+tx*u+nx*out,y,cz+tz*u+nz*out,w,h,d,mat,role,collision,yaw),arch:(u:number,y:number,out:number,w:number,h:number,role:string)=>shape(m,cx+tx*u+nx*out,y,cz+tz*u+nz*out,[[-w/2,0],[-w/2,h*.68],[-w*.36,h*.87],[0,h],[w*.36,h*.87],[w/2,h*.68],[w/2,0]],.07,'recess',role,yaw)};
 };
 // Eight open structural posts. No former ground-level rails/window infill survive.
 for(let i=0;i<8;i++){
  const a=Math.PI/8+i*Math.PI/4,x=Math.cos(a)*2.18,z=Math.sin(a)*2.18;
  box(m,x,.98,z,.28,.16,.28,'carvedTimber','pavilion-column-foot');
  box(m,x,2.06,z,.19,2.32,.19,'carvedTimber','pavilion-post',true);
  for(const [y,w,h] of [[1.14,.23,.1],[2.92,.23,.12],[3.13,.34,.2]])box(m,x,y,z,w,h,w,'carvedTimber','pavilion-column-capital');
  const f=face(i,2.18);f.put(0,3.25,0,f.len+.14,.26,.28,'carvedTimber','pavilion-column-ring-beam',true);
  // Small opposed corbel silhouettes, not individual carving meshes.
  for(const side of [-1,1])shape(m,x,2.78,z,[[0,0],[side*.12,.06],[side*.3,.25],[side*.35,.42],[0,.42]],.16,'carvedTimber','pavilion-column-bracket',f.yaw);
 }
 slab(3.35,2.46,.13,'carvedTimber','pavilion-main-floor-beam');slab(3.48,2.4,.26,'plaster','pavilion-main-floor-pale-apron');slab(3.74,2.48,.12,'carvedTimber','pavilion-main-floor-cornice');floorCollider(3.35,2.42,.51);
 // Main storey has triple bays on every face, central projection on principal faces.
 for(let i=0;i<8;i++){
  const f=face(i,2.18),a=Math.PI/8+i*Math.PI/4,x=Math.cos(a)*2.18,z=Math.sin(a)*2.18;
  box(m,x,4.72,z,.19,1.78,.19,'carvedTimber','pavilion-main-storey-post',true);
  for(const [y,h,d,out] of [[3.94,.16,.29,.03],[4.13,.11,.23,.06],[5.48,.16,.28,.03],[5.65,.2,.33,.05]])f.put(0,y,out,f.len+.15,h,d,'carvedTimber','pavilion-main-window-band');
  for(const u of [-.52,0,.52]){
   const central=u===0,w=central?.49:.35,projection=central&&i%2===1?.18:.06;
   if(central)f.put(u,4.78,-.07,w,1.1,.06,'recess','pavilion-main-central-window-recess');
   else f.arch(u,4.22,-.035,w,1.12,'pavilion-main-recessed-arch');
   for(const side of [-1,1])f.put(u+side*(w/2+.045),4.76,projection,.07,1.2,.16,'carvedTimber','pavilion-main-carved-window-jamb');
   f.put(u,4.17,projection,w+.2,.12,.29,'carvedTimber','pavilion-main-projecting-sill');f.put(u,5.39,projection,w+.18,.14,.24,'carvedTimber','pavilion-main-carved-window-head');
   if(central&&i%2===1){f.put(0,4.05,.2,.8,.13,.4,'carvedTimber','pavilion-main-projecting-bay-console');for(const side of [-1,1])f.put(side*.34,4.76,.11,.09,1.35,.34,'carvedTimber','pavilion-main-projecting-bay-return');}
  }
  // Restrained panel and bracket rhythm, without unsupported figurative iconography.
  for(const u of [-.58,-.29,0,.29,.58])f.put(u,3.99,.16,.12,.11,.08,'carvedTimber','pavilion-main-carved-panel-block');
 }
 const roof=(y:number,r:number,rise:number,inner:number,tag:string)=>{
  // Eight faceted tile planes with a flattened/flared eave transition, not a cone.
  profile(m,0,y,0,[[0,0],[r,.02],[r,.13],[r*.96,.19],[r*.82,.28],[inner,rise],[0,rise+.08]],'roof',`pavilion-${tag}-tile-roof`,8);
  slab(y-.12,r,.14,'carvedTimber',`pavilion-${tag}-roof-soffit`);
  slab(y-.015,r,.07,'shutter',`pavilion-${tag}-roof-red-fascia`);
  // One simplified convex roof volume, replacing all obsolete tiny roof boxes.
  const vertices:number[]=[];
  for(const [radius,height] of [[r,-.12],[r,.13],[inner,rise]])for(let i=0;i<8;i++){const a=Math.PI/8+i*Math.PI/4,[x,,z]=point(Math.sin(a)*radius,0,Math.cos(a)*radius);vertices.push(x-m.origin[0],height,z-m.origin[1]);}
  vertices.push(0,rise+.08,0);m.colliders.push({position:point(0,y,0),size:[1,rise+.2,1],yaw:0,vertices});
  for(let i=0;i<8;i++){
   const f=face(i,r);
   for(const t of [-.34,-.11,.11,.34]){
    f.put(t*f.len,y-.16,-.08,.075,.12,.28,'carvedTimber',`pavilion-${tag}-eave-rafter`);
    f.put(t*f.len,y-.12,.035,.13,.1,.045,'shutter',`pavilion-${tag}-eave-fringe`);
   }
   // Radial inclined struts run from the storey's posts to the soffit.
   const angle=Math.PI/8+i*Math.PI/4,innerRadius=tag==='main'?2.18:1.03,reach=r*.91-innerRadius;
   shape(m,Math.cos(angle)*innerRadius,y-.6,Math.sin(angle)*innerRadius,[[0,0],[.11,0],[reach,.5],[reach-.1,.58]],.13,'carvedTimber',`pavilion-${tag}-roof-strut`,-angle);
  }
 };
 roof(5.8,3.4,.95,1.15,'main');
 // Distinct raised upper pavilion between roofs, with genuinely open bays.
 slab(6.72,1.2,.18,'carvedTimber','pavilion-upper-floor');floorCollider(6.72,1.2,.18);
 for(let i=0;i<8;i++){
  const a=Math.PI/8+i*Math.PI/4,x=Math.cos(a)*1.03,z=Math.sin(a)*1.03,f=face(i,1.03);
  box(m,x,7.47,z,.14,1.24,.14,'carvedTimber','pavilion-upper-post',true);
  f.put(0,6.98,0,f.len+.08,.15,.16,'carvedTimber','pavilion-upper-sill');f.put(0,8.04,0,f.len+.13,.16,.22,'carvedTimber','pavilion-upper-head');
  f.put(0,7.15,-.025,f.len-.14,.22,.08,'carvedTimber','pavilion-upper-recessed-apron');
 }
 roof(8.1,1.8,1.0,.34,'upper');
 profile(m,0,9.18,0,[[0,0],[.12,0],[.16,.06],[.1,.13],[.075,.2],[.09,.25],[0,.37]],'gold','pavilion-finial',8);
}
