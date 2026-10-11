import type { ArchitectureEntry } from "../../data/architecture/registry.ts";

import { architectureParameters as p, architectureQuality } from "../../data/architecture/config.ts";
import type { QualityPreset } from "../../types/quality.ts";
import type { HeritageMaterial } from "../materials/heritage-materials.ts";
import type { SpatialFeature } from "../../types/spatial.ts";
import { insideFootprint, footprintColliders, type SolidBox } from "./geometry.ts";
import { buildLandmarkFamily, addPalaceFrontage, type ProfilePiece } from "./landmark-families.ts";

export interface DetailBox extends SolidBox { material:HeritageMaterial }
export interface RoofSpec { position:[number,number,number]; width:number; depth:number; rise:number; yaw:number }
export interface VolumeSpec { footprint:SpatialFeature; height:number; y:number; material:HeritageMaterial }
export interface ArchitecturalModel { entry:ArchitectureEntry; volumes:VolumeSpec[]; details:DetailBox[]; roofs:RoofSpec[]; colliders:SolidBox[]; pieces:ProfilePiece[] }

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
      const bays=Math.max(1,Math.floor(length/(entry.architectureType==="PALACE_FACADE"?3.1:p.baySpacing)));
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
  const model:ArchitecturalModel={entry,volumes:[],details:[],roofs:[],colliders:[],pieces:[]};
  if(entry.style==="building"||entry.style==="courtyard"){
    model.volumes.push({footprint:entry.footprint,height:entry.bodyHeight,y:0,material:"brick"});
    model.colliders=footprintColliders(entry.footprint,entry.bodyHeight);
    addFacades(model,quality);
    if(entry.architectureType==="PALACE_FACADE")addPalaceFrontage(model,quality);
    return model;
  }
  buildLandmarkFamily(model);
  return model;
}
