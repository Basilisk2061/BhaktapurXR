import type {CentralModel,CentralMaterial} from './central-model.ts';
import {box,profile,shape} from './architecture-primitives.ts';
/** Owner's two Chyasilin photographs: visual form PHOTO_INFERRED; dimensions
 * RECONSTRUCTED_APPROXIMATE. V2 reallocates local heights (9.55 -> 10.70 m).
 * No parent placement/scale or other architecture is changed. */
export function rebuildChyasilin(m:CentralModel){
 m.boxes=[];m.profiles=[];m.shapes=[];m.roofs=[];m.colliders=[];m.volumes=[];m.polygonRoofs=[];m.renderOwnership='WHOLE_ASSEMBLY';
 m.materialTints={stone:'#968d7d',agedBrick:'#a36a50',redMasonry:'#814735',carvedTimber:'#5c402e',timber:'#826047',roof:'#a87853',recess:'#211b16',shutter:'#a74333',gold:'#94805a'};
 const point=(x:number,y:number,z:number):[number,number,number]=>[m.origin[0]+x*Math.cos(m.yaw)+z*Math.sin(m.yaw),y,m.origin[1]-x*Math.sin(m.yaw)+z*Math.cos(m.yaw)];
 const slab=(y:number,r:number,h:number,mat:CentralMaterial,role:string)=>profile(m,0,y,0,[[0,0],[r,0],[r,h],[0,h]],mat,role,8);
 const hull=(y:number,rings:readonly (readonly [number,number])[],height:number)=>{
  const vertices:number[]=[];for(const [r,h] of rings)for(let i=0;i<8;i++){const a=Math.PI/8+i*Math.PI/4,[x,,z]=point(Math.cos(a)*r,0,Math.sin(a)*r);vertices.push(x-m.origin[0],h,z-m.origin[1]);}
  m.colliders.push({position:point(0,y,0),size:[1,height,1],yaw:0,vertices});
 };
 const beam=(a:[number,number,number],b:[number,number,number],w:number,d:number,role:string)=>{const dx=b[0]-a[0],dy=b[1]-a[1],dz=b[2]-a[2],len=Math.hypot(dx,dy,dz);box(m,(a[0]+b[0])/2,(a[1]+b[1])/2,(a[2]+b[2])/2,w,len,d,'timber',role,false,Math.atan2(dx,dz),Math.acos(dy/len));};
 const face=(i:number,r:number)=>{
  const a=Math.PI/8+i*Math.PI/4,b=a+Math.PI/4,ax=Math.cos(a)*r,az=Math.sin(a)*r,bx=Math.cos(b)*r,bz=Math.sin(b)*r,len=Math.hypot(bx-ax,bz-az),tx=(bx-ax)/len,tz=(bz-az)/len,nx=Math.cos((a+b)/2),nz=Math.sin((a+b)/2),cx=(ax+bx)/2,cz=(az+bz)/2,yaw=-Math.atan2(tz,tx);
  return {len,nx,nz,yaw,put:(u:number,y:number,out:number,w:number,h:number,d:number,mat:CentralMaterial,role:string,collision=false)=>box(m,cx+tx*u+nx*out,y,cz+tz*u+nz*out,w,h,d,mat,role,collision,yaw),arch:(u:number,y:number,out:number,w:number,h:number)=>{
   const x=cx+tx*u+nx*out,z=cz+tz*u+nz*out;
   shape(m,x,y,z,[[-w/2,0],[-w/2,h*.72],[-w*.36,h*.91],[0,h],[w*.36,h*.91],[w/2,h*.72],[w/2,0]],.055,'recess','pavilion-main-arched-opening',yaw);
   shape(m,x,y,z,[[-w/2-.055,0],[-w/2-.055,h*.74],[-w*.43,h*.95],[0,h+.075],[w*.43,h*.95],[w/2+.055,h*.74],[w/2+.055,0],[w/2,0],[w/2,h*.72],[w*.36,h*.91],[0,h],[-w*.36,h*.91],[-w/2,h*.72],[-w/2,0]],.095,'timber','pavilion-main-arch-carved-frame',yaw);
  }};
 };
 // Same octagonal footprint and stair reach: mostly earthy brick, thin stone cap.
 slab(0,2.7,.24,'agedBrick','pavilion-platform');slab(.24,2.6,.1,'redMasonry','pavilion-platform-recessed-course');slab(.34,2.53,.44,'agedBrick','pavilion-platform-masonry');slab(.78,2.67,.12,'stone','pavilion-landing');hull(0,[[2.7,0],[2.7,.9]],.9);
 for(let i=0;i<5;i++){const h=(i+1)*.18;box(m,0,h/2,3.35-i*.28,1.4,h,.3,'stone','pavilion-stair',true);}
 // Substantial eight-post ground storey and a deeper carved-looking bracket zone.
 for(let i=0;i<8;i++){
  const a=Math.PI/8+i*Math.PI/4,x=Math.cos(a)*2.18,z=Math.sin(a)*2.18,f=face(i,2.18);
  box(m,x,1.02,z,.38,.24,.38,'carvedTimber','pavilion-column-foot');box(m,x,2.25,z,.27,2.7,.27,'carvedTimber','pavilion-post',true);
  for(const [y,w,h] of [[1.2,.31,.12],[3.24,.31,.13],[3.45,.43,.23]])box(m,x,y,z,w,h,w,'timber','pavilion-column-capital');
  for(const [y,h,d] of [[3.54,.24,.36],[3.76,.15,.42],[3.94,.18,.4]])f.put(0,y,.02,f.len+.2,h,d,'carvedTimber','pavilion-bracket-ring-beam',y===3.54);
  for(const side of [-1,1]){
   shape(m,x,3.04,z,[[0,0],[side*.12,.02],[side*.22,.12],[side*.32,.16],[side*.4,.38],[side*.46,.62],[0,.62]],.23,'timber','pavilion-column-stepped-corbel',f.yaw);
   beam([x,3.08,z],[x+f.nx*.3+side*.22,3.64,z+f.nz*.3],.12,.15,'pavilion-bracket-diagonal');
  }
  for(const u of [-.5,0,.5])f.put(u,3.72,.19,.2,.22,.24,'timber','pavilion-bracket-carved-block');
 }
 slab(3.78,2.48,.12,'carvedTimber','pavilion-main-floor-beam');slab(3.9,2.42,.1,'agedBrick','pavilion-main-floor-apron');slab(4,2.48,.12,'timber','pavilion-main-floor-cornice');hull(3.78,[[2.42,0],[2.42,.34]],.34);
 // Tall framed main level: large central projecting bays and narrow arched flanks.
 for(let i=0;i<8;i++){
  const f=face(i,2.18),a=Math.PI/8+i*Math.PI/4,x=Math.cos(a)*2.18,z=Math.sin(a)*2.18,principal=i%2===1;
  box(m,x,5.225,z,.23,2.35,.23,'carvedTimber','pavilion-main-storey-post',true);
  for(const [y,h,d,out] of [[4.19,.14,.32,.06],[4.38,.14,.3,.12],[6.12,.16,.34,.05],[6.31,.18,.4,.08]])f.put(0,y,out,f.len+.18,h,d,'timber','pavilion-main-window-band');
  for(const u of [-.64,0,.64]){
   const central=u===0,w=central?.66:.27,projection=central&&principal?.34:.08;
   if(central)f.put(0,5.28,-.1,w,1.48,.055,'recess','pavilion-main-central-window-recess');else f.arch(u,4.48,-.045,w,1.5);
   for(const side of [-1,1])f.put(u+side*(w/2+.045),5.26,projection,.09,1.62,central&&principal?.46:.19,'timber','pavilion-main-window-jamb');
   f.put(u,4.43,projection,w+.23,.15,principal&&central?.62:.31,'carvedTimber','pavilion-main-window-sill');f.put(u,6.07,projection,w+.22,.17,.3,'timber','pavilion-main-window-header');
   if(central&&principal){
    f.put(0,4.26,.32,1.02,.17,.68,'carvedTimber','pavilion-main-projecting-bay-console');f.put(0,6.22,.34,1.08,.14,.68,'carvedTimber','pavilion-main-projecting-bay-cornice');
    for(const side of [-1,1])f.put(side*.43,5.26,.2,.12,1.85,.46,'carvedTimber','pavilion-main-projecting-bay-return');
   }
  }
  for(const u of [-.6,-.3,0,.3,.6])f.put(u,4.25,.2,.14,.14,.1,'timber','pavilion-main-carved-panel');
 }
 /** Shared custom-surface path: five radial rings, four divisions per octagon
  * edge. Lift varies along each edge, so only corners turn up (not a raised cone). */
 const roof=(y:number,r:number,rise:number,inner:number,lift:number,tag:string)=>{
  const n=32,ringPoint=(i:number,radius:number,h:number,corner:number)=>{
   const edge=Math.floor(i/4)%8,t=(i%4)/4,a=Math.PI/8+edge*Math.PI/4,b=a+Math.PI/4,k=Math.pow(Math.abs(t-.5)*2,4);
   return [(Math.cos(a)*(1-t)+Math.cos(b)*t)*radius,h+corner*k,(Math.sin(a)*(1-t)+Math.sin(b)*t)*radius] as [number,number,number];
  };
  const surface=(rings:readonly (readonly [number,number,number])[],material:CentralMaterial,role:string)=>{
   const positions:number[]=[],indices:number[]=[],uvs:number[]=[];
   for(const [radius,h,corner] of rings)for(let i=0;i<=n;i++){const p=ringPoint(i,radius,h,corner);positions.push(...p);uvs.push(i/n*r*3.061,(r-radius+h)/2);}
   for(let row=0;row<rings.length-1;row++)for(let i=0;i<n;i++){const a=row*(n+1)+i,b=a+n+1;indices.push(a,b,a+1,a+1,b,b+1);}
   m.profiles.push({position:point(0,y,0),yaw:m.yaw,profile:[[0,0],[r,rise]],segments:8,material,role,sculptedSurface:{positions,indices,uvs}});
  };
  surface([[r,.06,lift],[r*.92,.12,lift*.3],[r*.73,rise*.28,lift*.08],[r*.42,rise*.8,0],[inner,rise,0],[0,rise+.08,0]],'roof',`pavilion-${tag}-tile-roof`);
  surface([[r,.055,lift],[r,-.16,lift]],'carvedTimber',`pavilion-${tag}-roof-fascia`);
  surface([[r,-.16,lift],[r*.8,-.34,lift*.1],[tag==='main'?2.05:.95,-.48,0],[0,-.4,0]],'carvedTimber',`pavilion-${tag}-roof-soffit`);
  // Continuous red edge with a slightly irregular hem, not identical hanging cubes.
  const positions:number[]=[],indices:number[]=[];
  for(let row=0;row<2;row++)for(let i=0;i<=n;i++){const p=ringPoint(i,r*1.002,row===0?-.02:-.17-(i%3)*.018,lift);positions.push(...p);}
  for(let i=0;i<n;i++){indices.push(i,n+1+i,i+1,i+1,n+1+i,n+2+i);}
  m.profiles.push({position:point(0,y,0),yaw:m.yaw,profile:[[0,0],[r,.2]],segments:8,material:'shutter',role:`pavilion-${tag}-red-eave-hem`,sculptedSurface:{positions,indices}});
  hull(y,[[r,-.16],[r,.06+lift],[inner,rise],[0,rise+.08]],rise+.3);
  const postR=tag==='main'?2.18:1.08;
  for(let i=0;i<8;i++){
   const a=Math.PI/8+i*Math.PI/4,b=a+Math.PI/8;
   beam([Math.cos(a)*postR,y-.7,Math.sin(a)*postR],[Math.cos(a)*r*.96,y+lift*.8,Math.sin(a)*r*.96],.13,.16,`pavilion-${tag}-roof-corner-strut`);
   beam([Math.cos(b)*postR*.92,y-.42,Math.sin(b)*postR*.92],[Math.cos(b)*r*.92,y-.07,Math.sin(b)*r*.92],.09,.13,`pavilion-${tag}-roof-rafter`);
  }
 };
 roof(6.4,3.4,1.45,1.15,.3,'main');
 // Compact framed upper chamber: wall panels and small recesses replace gazebo gaps.
 slab(7.62,1.22,.18,'carvedTimber','pavilion-upper-floor');hull(7.62,[[1.22,0],[1.22,.18]],.18);
 for(let i=0;i<8;i++){
  const a=Math.PI/8+i*Math.PI/4,x=Math.cos(a)*1.08,z=Math.sin(a)*1.08,f=face(i,1.08);
  box(m,x,8.2,z,.18,.8,.18,'timber','pavilion-upper-post',true);
  f.put(0,8.2,-.025,f.len-.08,.69,.1,'carvedTimber','pavilion-upper-timber-panel',true);
  f.put(0,8.25,.035,f.len*.43,.45,.045,'recess','pavilion-upper-small-window');
  for(const side of [-1,1])f.put(side*f.len*.25,8.25,.08,.055,.55,.12,'timber','pavilion-upper-window-frame');
  f.put(0,7.85,.035,f.len+.16,.18,.24,'timber','pavilion-upper-sill-band');f.put(0,8.57,.035,f.len+.18,.18,.26,'timber','pavilion-upper-head-band');
 }
 roof(8.65,1.8,1.65,.2,.22,'upper');
 profile(m,0,10.38,0,[[0,0],[.11,0],[.14,.06],[.085,.13],[.06,.21],[0,.32]],'gold','pavilion-finial',8);
}
