import type {SpawnPoint} from "../../types/world.ts";
import {worldSpawns,type WorldMode} from "./world-mode.ts";
export const centralReviewSpawns:Record<string,SpawnPoint>={
 central:{position:[16,.05,30],rotation:[0,.6,0]},
 palace:{position:[-37,.05,43],rotation:[0,-.25,0]},
 composition:{position:[-35,.05,16],rotation:[0,-1.0,0]},
 close:{position:[12,.05,20],rotation:[0,.65,0]},
 wide:{position:[-48,.05,58],rotation:[0,-.52,0]},
};
export function resolveReviewView(value:unknown,development:boolean){return development&&typeof value==="string"&&Object.hasOwn(centralReviewSpawns,value)?value:null;}
export function experienceSpawn(mode:WorldMode,review:string|null):SpawnPoint{return mode==="BHAKTAPUR"&&review?centralReviewSpawns[review]??worldSpawns[mode]:worldSpawns[mode];}
