import type { ArchitectureEntry } from "../../data/architecture/registry.ts";
import { footprintBounds } from "../../data/architecture/registry.ts";
import { architectureParameters as p, architectureQuality } from "../../data/architecture/config.ts";
import type { QualityPreset } from "../../types/quality.ts";
import type { HeritageMaterial } from "../materials/heritage-materials.ts";
import type { SpatialFeature } from "../../types/spatial.ts";
import { insideFootprint, footprintColliders, type SolidBox } from "./geometry.ts";

export interface DetailBox extends SolidBox { material:HeritageMaterial }
export interface RoofSpec { position:[number,number,number]; width:number; depth:number; rise:number; yaw:number }
export interface VolumeSpec { footprint:SpatialFeature; height:number; y:number; material:HeritageMaterial }
export interface ArchitecturalModel { entry:ArchitectureEntry; volumes:VolumeSpec[]; details:DetailBox[]; roofs:RoofSpec[]; colliders:SolidBox[] }

function scaledFootprint(f:SpatialFeature,scale:number):SpatialFeature {
  const b=footprintBounds(f.vertices);
  return {...f,vertices:f.vertices.map(([x,z])=>[b.x+(x-b.x)*scale,b.z+(z-b.z)*scale]),holes:f.holes?.map(r=>r.map(([x,z])=>[b.x+(x-b.x)*scale,b.z+(z-b.z)*scale]))};
}
function addFacades(model:ArchitecturalModel,quality:QualityPreset) {
  const {entry}=model,settings=architectureQuality[quality];
  const detail=(position:DetailBox["position"],size:DetailBox["size"],yaw:number,material:HeritageMaterial)=>model.details.push({position,size,yaw,material});
  for(const ring of [entry.footprint.vertices,...(entry.footprint.holes??[])])ring.forEach((a,i)=>{
    const b=ring[(i+1)%ring.length],dx=b[0]-a[0],dz=b[1]-a[1],length=Math.hypot(dx,dz);if(length<1.5)return;
    const yaw=-Math.atan2(dz,dx),nx=-dz/length,nz=dx/length,mx=(a[0]+b[0])/2,mz=(a[1]+b[1])/2;
    const sign=insideFootprint([mx+nx*.2,mz+nz*.2],entry.footprint)?-1:1;
    const point=(t:number,y:number,out:number):[number,number,number]=>[a[0]+dx*t+nx*sign*out,y,a[1]+dz*t+nz*sign*out];
    for(let floor=0;floor<entry.floors;floor++){
      detail(point(.5,(floor+1)*p.storeyHeight-.15,.08),[length,p.timberBand,.22],yaw,"timber");
      const bays=Math.max(1,Math.floor(length/p.baySpacing));
      for(let bay=0;bay<bays;bay+=entry.accuracy==="PLACEHOLDER"?2:settings.bayStride){
        const t=(bay+.5)/bays,y=floor*p.storeyHeight+1.75,w=Math.min(p.windowWidth,length/bays*.6),h=p.windowHeight;
        detail(point(t,y,.035),[w,h,.10],yaw,"recess");
        detail(point(t,y,.1),[w+.26,h+.28,.13],yaw,"timber");
        detail(point(t,y,.19),[w-.05,h-.05,.09],yaw,"recess");
        detail(point(t,y-h/2-.08,.25),[w+.42,.15,.48],yaw,"timber");
        if(settings.lattice && entry.accuracy!=="PLACEHOLDER"){
          detail(point(t,y,.27),[.055,h,.06],yaw,"timber");
          detail(point(t,y+.2,.27),[w,.06,.06],yaw,"timber");
          detail(point(t,y-.2,.27),[w,.06,.06],yaw,"timber");
        }
      }
    }
    if(length>5){detail(point(.5,p.doorHeight/2,.12),[p.doorWidth+.3,p.doorHeight+.18,.18],yaw,"timber");detail(point(.5,p.doorHeight/2,.23),[p.doorWidth,p.doorHeight,.12],yaw,"recess");}
    // Narrow roof wings follow actual facade edges, retaining courtyard voids.
    const roofDepth=Math.min(p.facadeRoofDepth,length*.6);
    model.roofs.push({position:[mx-nx*sign*(roofDepth/2-.35),entry.bodyHeight,mz-nz*sign*(roofDepth/2-.35)],width:length+.5,depth:roofDepth+2*p.eaveDepth,rise:roofDepth*p.roofRiseRatio,yaw});
    detail(point(.5,entry.bodyHeight-.15,.3),[length+.5,.25,.85],yaw,"timber");
  });
}

export function buildArchitecturalModel(entry:ArchitectureEntry,quality:QualityPreset):ArchitecturalModel {
  const model:ArchitecturalModel={entry,volumes:[],details:[],roofs:[],colliders:[]};
  if(entry.style==="building"||entry.style==="courtyard"){
    model.volumes.push({footprint:entry.footprint,height:entry.bodyHeight,y:0,material:"brick"});
    model.colliders=footprintColliders(entry.footprint,entry.bodyHeight);
    addFacades(model,quality);return model;
  }
  const b=footprintBounds(entry.footprint.vertices),baseHeight=p.plinthSteps*p.stairRise;
  for(let step=0;step<p.plinthSteps;step++){
    const f=scaledFootprint(entry.footprint,1-step*p.plinthShrinkPerStep);
    model.volumes.push({footprint:f,height:p.stairRise,y:step*p.stairRise,material:"stone"});
    model.colliders.push(...footprintColliders(f,p.stairRise).map(c=>({...c,position:[c.position[0],c.position[1]+step*p.stairRise,c.position[2]] as [number,number,number]})));
  }
  // Entrance faces the engineering origin; this is an approximate access choice.
  const edges=entry.footprint.vertices.map((a,i)=>{const e=entry.footprint.vertices[(i+1)%entry.footprint.vertices.length];return {a,e,x:(a[0]+e[0])/2,z:(a[1]+e[1])/2};});
  const edge=edges.sort((a,b)=>Math.hypot(a.x,a.z)-Math.hypot(b.x,b.z))[0],dx=edge.e[0]-edge.a[0],dz=edge.e[1]-edge.a[1],length=Math.hypot(dx,dz);
  let nx=-dz/length,nz=dx/length;if(insideFootprint([edge.x+nx*.2,edge.z+nz*.2],entry.footprint)){nx=-nx;nz=-nz;}
  for(let step=0;step<p.plinthSteps;step++){
    const depth=(p.plinthSteps-step)*p.stairTread,height=(step+1)*p.stairRise;
    const stair:SolidBox={position:[edge.x+nx*depth/2,height/2,edge.z+nz*depth/2],size:[Math.min(p.stairWidth,length*.65),height,depth],yaw:-Math.atan2(dz,dx)};
    model.details.push({...stair,material:"stone"});model.colliders.push(stair);
  }
  const shrine=scaledFootprint(entry.footprint,p.shrineBodyRatio);
  model.volumes.push({footprint:shrine,height:entry.bodyHeight,y:baseHeight,material:entry.style==="stone-shrine"?"stone":"brick"});
  model.colliders.push(...footprintColliders(shrine,entry.bodyHeight).map(c=>({...c,position:[c.position[0],c.position[1]+baseHeight,c.position[2]] as [number,number,number]})));
  const size=Math.min(b.width,b.depth)*.78;
  let y=baseHeight+entry.bodyHeight;
  for(let tier=0;tier<entry.tiers;tier++){
    const width=size*Math.pow(p.tierShrink,tier)+p.eaveDepth*2,rise=width*p.roofRiseRatio;
    const spacing=rise+p.tierSpacing*p.tierClearanceRatio;
    model.roofs.push({position:[b.x,y,b.z],width,depth:width,rise,yaw:0});
    model.details.push({position:[b.x,y-.12,b.z],size:[width,.24,width],yaw:0,material:"timber"});
    if(tier<entry.tiers-1){const next=size*Math.pow(p.tierShrink,tier+1)*p.tierBodyRatio;const upper:SolidBox={position:[b.x,y+spacing/2,b.z],size:[next,spacing,next],yaw:0};model.details.push({...upper,material:"brick"});model.colliders.push(upper);}
    for(const x of [-1,1])for(const z of [-1,1])model.details.push({position:[b.x+x*size*.26*Math.pow(p.tierShrink,tier),y-p.postHeight/2,b.z+z*size*.26*Math.pow(p.tierShrink,tier)],size:[p.postWidth,p.postHeight,p.postWidth],yaw:0,material:"timber"});
    if(tier===entry.tiers-1)model.details.push({position:[b.x,y+rise+p.finialHeight/2,b.z],size:[p.postWidth,p.finialHeight,p.postWidth],yaw:0,material:"stone"});
    y+=spacing;
  }
  // Simplified front timber opening; no claim of verified entrance identity.
  const doorX=b.x+(edge.x-b.x)*p.shrineBodyRatio,doorZ=b.z+(edge.z-b.z)*p.shrineBodyRatio;
  model.details.push({position:[doorX+nx*.08,baseHeight+p.doorHeight/2,doorZ+nz*.08],size:[p.doorWidth+.25,p.doorHeight+.15,.18],yaw:-Math.atan2(dz,dx),material:"timber"});
  model.details.push({position:[doorX+nx*.2,baseHeight+p.doorHeight/2,doorZ+nz*.2],size:[p.doorWidth,p.doorHeight,.1],yaw:-Math.atan2(dz,dx),material:"recess"});
  return model;
}
