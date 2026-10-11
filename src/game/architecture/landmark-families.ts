import type { ArchitecturalModel, DetailBox } from "./model.ts";
import type { SpatialFeature } from "../../types/spatial.ts";
import type { QualityPreset } from "../../types/quality.ts";
import type { HeritageMaterial } from "../materials/heritage-materials.ts";
import { footprintBounds } from "../../data/architecture/registry.ts";
import { landmarkProportions as proportions } from "../../data/architecture/monuments.ts";
import { architectureParameters as p, architectureQuality } from "../../data/architecture/config.ts";
import { footprintColliders, insideFootprint, type SolidBox } from "./geometry.ts";

/** Faceted radial profiles: stone spires, column and eight-sided pavilion roofs.
 * All dimensions are APPROXIMATE; these are silhouettes, never sculptural replicas. */
export interface ProfilePiece {
  position:[number,number,number]; profile:[number,number][]; segments:number;
  material:HeritageMaterial; role:"shikhara"|"satellite-spire"|"octagonal-roof"|"column"|"statue"|"terracotta-spire";
}
function scaled(f:SpatialFeature,scale:number):SpatialFeature {
  const b=footprintBounds(f.vertices);
  return {...f,vertices:f.vertices.map(([x,z])=>[b.x+(x-b.x)*scale,b.z+(z-b.z)*scale])};
}
function box(m:ArchitecturalModel,position:SolidBox["position"],size:SolidBox["size"],material:HeritageMaterial,yaw=0,collision=false) {
  const d:DetailBox={position,size,material,yaw};m.details.push(d);if(collision)m.colliders.push({position,size,yaw});
}
function volume(m:ArchitecturalModel,f:SpatialFeature,height:number,y:number,material:HeritageMaterial) {
  m.volumes.push({footprint:f,height,y,material});
  m.colliders.push(...footprintColliders(f,height).map(c=>({...c,position:[c.position[0],c.position[1]+y,c.position[2]] as [number,number,number]})));
}
function entrance(m:ArchitecturalModel) {
  const f=m.entry.footprint;
  const edges=f.vertices.map((a,i)=>{const e=f.vertices[(i+1)%f.vertices.length];return {a,e,x:(a[0]+e[0])/2,z:(a[1]+e[1])/2};});
  // Access direction is an assumption, independent of identity and source geometry.
  const e=edges.sort((a,b)=>Math.hypot(a.x,a.z)-Math.hypot(b.x,b.z))[0];
  const dx=e.e[0]-e.a[0],dz=e.e[1]-e.a[1],length=Math.hypot(dx,dz);
  let nx=-dz/length,nz=dx/length;if(insideFootprint([e.x+nx*.2,e.z+nz*.2],f)){nx=-nx;nz=-nz;}
  return {...e,nx,nz,length,yaw:-Math.atan2(dz,dx),tx:dx/length,tz:dz/length};
}
function platform(m:ArchitecturalModel,steps:number) {
  const original=entrance(m),b=footprintBounds(m.entry.footprint.vertices),height=steps*p.stairRise;
  const topScale=steps>4?1-(steps-1)*(steps>10?.022:.04):1;
  const e={...original,x:b.x+(original.x-b.x)*topScale,z:b.z+(original.z-b.z)*topScale};
  // Stairs first preserves the existing controller's source-monument regression fixture.
  for(let step=0;step<steps;step++) {
    const depth=(steps-step)*p.stairTread,h=(step+1)*p.stairRise;
    box(m,[e.x+e.nx*depth/2,h/2,e.z+e.nz*depth/2],[Math.min(p.stairWidth,e.length*.65),h,depth],"stone",e.yaw,true);
  }
  for(let step=0;step<steps;step++)volume(m,scaled(m.entry.footprint,1-step*(steps>10?.022:.04)),p.stairRise,step*p.stairRise,"stone");
  // The conservative polygon grid leaves narrow edge gaps. An inscribed landing
  // connects the flight to the centre without a gap that could trap the capsule.
  const landingScale=1-(steps-1)*(steps>10?.022:.04),lx=b.x+(original.x-b.x)*landingScale,lz=b.z+(original.z-b.z)*landingScale;
  m.colliders.push({position:[(b.x+lx)/2,height-p.stairRise/2,(b.z+lz)/2],size:[Math.min(p.stairWidth,e.length*.65),p.stairRise,Math.hypot(b.x-lx,b.z-lz)+.1],yaw:e.yaw});
  return {height,e};
}
function spire(m:ArchitecturalModel,x:number,z:number,y:number,r:number,h:number,role:ProfilePiece["role"]="shikhara",material:HeritageMaterial="stone") {
  m.pieces.push({position:[x,y,z],segments:16,material,role,profile:[[r,0],[r, .12*h],[r*.91,.17*h],[r*.86,.35*h],[r*.7,.58*h],[r*.47,.77*h],[r*.24,.9*h],[r*.29,.92*h],[r*.29,.95*h],[r*.1,.97*h],[0,h]]});
}
function shikhara(m:ArchitecturalModel,siddhi:boolean) {
  const b=footprintBounds(m.entry.footprint.vertices),settings=siddhi?proportions.siddhi:proportions.vatsala;
  const {height,e}=platform(m,settings.platformSteps),f=scaled(m.entry.footprint,siddhi?.43:.52),body=settings.bodyHeight;
  volume(m,f,body,height,"stone");
  const width=Math.min(b.width,b.depth)*(siddhi?.43:.52),h=width*settings.spireHeightToWidth;
  for(const band of [.18,.48,.92])box(m,[b.x,height+body*band,b.z],[width+.25,.15,width+.25],"stone");
  for(const sx of [-1,1])for(const sz of [-1,1])box(m,[b.x+sx*width*.46,height+body/2,b.z+sz*width*.46],[.24,body,.24],"stone");
  // Square sanctum and faceted taper with projecting ribs; no timber hip roofs.
  spire(m,b.x,b.z,height+body,width*.57,h);
  m.colliders.push({position:[b.x,height+body+h*.32,b.z],size:[width*.65,h*.64,width*.65],yaw:0});
  for(let i=0;i<8;i++) {
    const a=i*Math.PI/4,r=width*.47;
    box(m,[b.x+Math.sin(a)*r,height+body+h*.27,b.z+Math.cos(a)*r],[.16,h*.54,.18],"stone",a);
  }
  for(const sx of [-1,1])for(const sz of [-1,1])spire(m,b.x+sx*width*.41,b.z+sz*width*.41,height+body,width*.16,h*.38,"satellite-spire");
  const doorway=entrance(m),bodyScale=siddhi?.43:.52;
  box(m,[b.x+(doorway.x-b.x)*bodyScale+e.nx*.13,height+1.05,b.z+(doorway.z-b.z)*bodyScale+e.nz*.13],[1.2,2.1,.2],"recess",e.yaw);
  if(siddhi)for(let pair=0;pair<proportions.siddhi.guardianPairs;pair++)for(const side of [-1,1]) {
    const along=(proportions.siddhi.platformSteps-2-pair*3)*p.stairTread,level=(2+pair*3)*p.stairRise;
    const x=e.x+e.nx*along+e.tx*side*1.65,z=e.z+e.nz*along+e.tz*side*1.65;
    box(m,[x,level+.15,z],[.65,.3,.9],"stone",e.yaw);
    box(m,[x,level+.52,z],[.38,.45,.6],"stone",e.yaw);
    box(m,[x,level+.83,z],[.27,.25,.28],"stone",e.yaw);
  }
}
function mandap(m:ArchitecturalModel) {
  const b=footprintBounds(m.entry.footprint.vertices),{height}=platform(m,proportions.mandap.platformSteps);
  let y=height;
  for(let tier=0;tier<2;tier++) {
    const r=Math.min(b.width,b.depth)*.5*(tier===0?1:.68),postHeight=tier===0?2.3:2;
    for(let i=0;i<8;i++) {
      const a=Math.PI/8+i*Math.PI/4,x=b.x+Math.cos(a)*r*.77,z=b.z+Math.sin(a)*r*.77;
      box(m,[x,y+postHeight/2,z],[.18,postHeight,.18],"timber",0,true);
      const next=a+Math.PI/4,mx=b.x+(Math.cos(a)+Math.cos(next))*r*.77/2,mz=b.z+(Math.sin(a)+Math.sin(next))*r*.77/2;
      box(m,[mx,y+postHeight-.14,mz],[r*.77*Math.sqrt(2-Math.sqrt(2)),.23,.19],"timber",-a-Math.PI/8-Math.PI/2);
    }
    y+=postHeight;
    m.pieces.push({position:[b.x,y,b.z],profile:[[0,0],[r+.45,0],[r+.45,.1],[r*.72,.45],[r*.23,1],[0,1.1]],segments:8,material:"roof",role:"octagonal-roof"});
    m.colliders.push(...footprintColliders(scaled(m.entry.footprint,tier===0?1.1:.8),.2).map(c=>({...c,position:[c.position[0],c.position[1]+y,c.position[2]] as [number,number,number]})));
    // Upper floor supported above lower roof; eight-sided volume, not a closed temple body.
    if(tier===0){y+=.9;volume(m,scaled(m.entry.footprint,.65),.16,y,"timber");y+=.16;}
  }
  box(m,[b.x,y+1.4,b.z],[.12,.6,.12],"timber");
}
function column(m:ArchitecturalModel) {
  const b=footprintBounds(m.entry.footprint.vertices);volume(m,m.entry.footprint,.35,0,"stone");
  m.pieces.push({position:[b.x,.35,b.z],profile:[[.45,0],[.45,.25],[.24,.4],[.24,5.6],[.38,5.8],[.42,6],[0,6]],segments:12,material:"stone",role:"column"});
  m.colliders.push({position:[b.x,3.35,b.z],size:[.5,6,.5],yaw:0});
  m.pieces.push({position:[b.x,6.35,b.z],profile:[[.35,0],[.3,.18],[.19,.3],[.2,.65],[.12,.72],[.15,.82],[.12,.99],[0,1.05]],segments:8,material:"stone",role:"statue"});
}
function pagoda(m:ArchitecturalModel) {
  const b=footprintBounds(m.entry.footprint.vertices),{height,e}=platform(m,4),s=proportions.yaksheshwar;
  volume(m,scaled(m.entry.footprint,.57),s.bodyHeight,height,"brick");
  for(const side of [-1,1])for(let bay=0;bay<3;bay++) {
    const x=b.x+(bay-1)*Math.min(b.width,b.depth)*.14,z=b.z+side*b.depth*.285;
    box(m,[x,height+1.6,z],[.9,1.5,.16],"timber");
    box(m,[x,height+1.6,z+side*.12],[.65,1.22,.12],"recess");
  }
  let y=height+s.bodyHeight;
  for(let tier=0;tier<s.tiers;tier++) {
    const width=Math.min(b.width,b.depth)*.91*Math.pow(.66,tier),rise=width*s.roofRiseRatio;
    m.roofs.push({position:[b.x,y,b.z],width,depth:width,rise,yaw:e.yaw});
    box(m,[b.x,y-.16,b.z],[width,.3,width],"timber",e.yaw);
    if(tier===0){const next=width*.39;box(m,[b.x,y+(rise+s.tierGap)/2,b.z],[next,rise+s.tierGap,next],"brick",e.yaw,true);}
    y+=rise+s.tierGap;
  }
  box(m,[b.x,y-.7,b.z],[.18,.9,.18],"gold");
  box(m,[b.x+(e.x-b.x)*.57+e.nx*.12,height+1.1,b.z+(e.z-b.z)*.57+e.nz*.12],[1.45,2.2,.22],"timber",e.yaw);
}
function smallShrine(m:ArchitecturalModel,terracotta:boolean) {
  const b=footprintBounds(m.entry.footprint.vertices),{height,e}=platform(m,4),w=Math.min(b.width,b.depth);
  if(terracotta){volume(m,scaled(m.entry.footprint,.65),1.25,height,"brick");spire(m,b.x,b.z,height+1.25,w*.35,w*.9,"terracotta-spire","brick");}
  else {
    // Open roofed shrine with a low central sanctum/altar; not another multi-tier pagoda.
    volume(m,scaled(m.entry.footprint,.38),1.65,height,"stone");
    for(const x of [-1,1])for(const z of [-1,1])box(m,[b.x+x*w*.32,height+1.65,b.z+z*w*.32],[.22,3.3,.22],"timber",0,true);
    m.roofs.push({position:[b.x,height+3.3,b.z],width:w*.95,depth:w*.95,rise:w*.2,yaw:e.yaw});
  }
}
export function buildLandmarkFamily(m:ArchitecturalModel) {
  switch(m.entry.architectureType) {
    case "SHIKHARA_STONE":shikhara(m,m.entry.monumentId==="siddhi-lakshmi");break;
    case "OCTAGONAL_MANDAP":mandap(m);break;
    case "COLUMN_MONUMENT":column(m);break;
    case "NEWAR_PAGODA":pagoda(m);break;
    case "SMALL_NEPALI_SHRINE":smallShrine(m,false);break;
    case "TERRACOTTA_SHRINE":smallShrine(m,true);break;
    default:volume(m,m.entry.footprint,.18,0,"stone"); // Unresolved symbols: no invented upper architecture.
  }
}
export function addPalaceFrontage(m:ArchitecturalModel,quality:QualityPreset) {
  const ring=m.entry.footprint.vertices;
  // Source vertices define the southern eastern wing and adjoining entrance seam.
  // Select those edges geometrically; never rewrite the UNESCO trace to fit the facade.
  const edges=ring.map((a,i)=>({a,b:ring[(i+1)%ring.length]}));
  const south=edges.filter(e=>e.a[1]>-25&&e.b[1]>-25&&Math.abs(e.a[0]-e.b[0])>20&&Math.abs(e.a[1]-e.b[1])<5);
  for(const e of south) {
    const dx=e.b[0]-e.a[0],dz=e.b[1]-e.a[1],length=Math.hypot(dx,dz),yaw=-Math.atan2(dz,dx);
    const nx=-dz/length,nz=dx/length,sign=insideFootprint([(e.a[0]+e.b[0])/2+nx*.2,(e.a[1]+e.b[1])/2+nz*.2],m.entry.footprint)?-1:1;
    const point=(t:number,y:number,out:number):[number,number,number]=>[e.a[0]+dx*t+nx*sign*out,y,e.a[1]+dz*t+nz*sign*out];
    box(m,point(.5,7.1,.23),[length,2.15,.3],"timber",yaw);
    const bays=Math.floor(length/proportions.palace.upperWindowSpacing);
    for(let i=0;i<bays;i+=architectureQuality[quality].bayStride) {
      const t=(i+.5)/bays;
      box(m,point(t,7.1,.42),[.78,1.7,.12],"recess",yaw);
      box(m,point(t,6.19,.55),[1,.16,.65],"timber",yaw);
      box(m,point(t,8.02,.55),[1,.18,.62],"timber",yaw);
      if(architectureQuality[quality].lattice)for(const offset of [-.28,0,.28])box(m,point(t,7.1+offset,.51),[.8,.055,.07],"timber",yaw);
      box(m,point(t,7.1,.53),[.055,1.65,.08],"timber",yaw);
    }
  }
  const seam=south.sort((a,b)=>Math.min(a.a[0],a.b[0])-Math.min(b.a[0],b.b[0]))[0];
  if(seam) {
    const dx=seam.b[0]-seam.a[0],dz=seam.b[1]-seam.a[1],yaw=-Math.atan2(dz,dx);
    const t=seam.a[0]>seam.b[0]?.08:.92,x=seam.a[0]+dx*t,z=seam.a[1]+dz*t+.35;
    box(m,[x,1.55,z],[2.1,3.1,.28],"recess",yaw);
    for(const side of [-1,1])box(m,[x+side*1.2*Math.cos(yaw),1.65,z-side*1.2*Math.sin(yaw)],[.32,3.3,.4],"gold",yaw);
    box(m,[x,3.4,z],[2.75,.38,.5],"gold",yaw);
    box(m,[x,3.8,z],[2.15,.35,.45],"gold",yaw);
    box(m,[x,4.1,z],[1.15,.25,.4],"gold",yaw);
  }
}
