import {buildPhase9a1Models} from "./complete-monuments.ts";
import {spatialCorrections} from "../../data/reconstruction/khauma-spatial-audit.ts";
/** Explicit correction layer. Original source geometry / Phase 6C anchors stay immutable. */
export function buildSpatiallyAuditedModels(){return buildPhase9a1Models().filter(m=>m.id!=="jagannath").map(m=>{
 const correction=spatialCorrections[m.id];if(!correction)return m;
 const corrected=structuredClone(m),origin=correction.coordinate,yaw=correction.yaw??m.yaw,delta=yaw-m.yaw,c=Math.cos(delta),s=Math.sin(delta);
 const point=(position:[number,number,number]):[number,number,number]=>{const x=position[0]-m.origin[0],z=position[2]-m.origin[1];return [origin[0]+x*c+z*s,position[1],origin[1]-x*s+z*c];};
 for(const piece of [...corrected.boxes,...corrected.shapes,...corrected.profiles,...corrected.roofs,...corrected.colliders]){piece.position=point(piece.position);piece.yaw+=delta;}
 if(m.id==="khauma-gate")for(const piece of [...corrected.boxes,...corrected.shapes,...corrected.profiles])if(piece.material==="brick")piece.material="washedBrick";
 corrected.origin=[...origin];corrected.yaw=yaw;corrected.accuracy="RECONSTRUCTED_APPROXIMATE";return corrected;
});}
