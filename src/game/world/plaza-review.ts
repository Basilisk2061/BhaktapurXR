import {resolveUrbanReview,urbanExperienceSpawn} from "./urban-review.ts";
import type {SpawnPoint} from "../../types/world.ts";
import type {WorldMode} from "./world-mode.ts";
export const plazaReviewSpawns:Record<string,SpawnPoint>={
 plaza:{position:[12,.05,36],rotation:[0,.4,0]},
 arcade:{position:[-58,.05,25],rotation:[0,Math.PI+.9,0]},
 "plaza-wide":{position:[-64,.05,38],rotation:[0,-.62,0]},
};
export function resolvePlazaReview(value:unknown,development:boolean){return resolveUrbanReview(value,development)??(development&&typeof value==="string"&&Object.hasOwn(plazaReviewSpawns,value)?value:null);}
export function plazaExperienceSpawn(mode:WorldMode,review:string|null):SpawnPoint{return mode==="BHAKTAPUR"&&review?plazaReviewSpawns[review]??urbanExperienceSpawn(mode,review):urbanExperienceSpawn(mode,review);}
