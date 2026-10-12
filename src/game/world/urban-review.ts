import {architectureReviewSpawns,resolveArchitectureReview,architectureExperienceSpawn} from "./remaining-review.ts";
import type {SpawnPoint} from "../../types/world.ts";
import type {WorldMode} from "./world-mode.ts";
export const urbanReviewSpawns:Record<string,SpawnPoint>={
 "urban-central":{position:[16,.05,30],rotation:[0,.6,0]},
 "urban-east":{position:[31,.05,26],rotation:[0,.12,0]},
 "urban-west":{position:[-98,.05,-24],rotation:[0,2.86,0]},
 "urban-wide":{position:[-72,.05,9],rotation:[0,-1.05,0]},
};
export const allArchitectureReviewSpawns={...architectureReviewSpawns,...urbanReviewSpawns};
export function resolveUrbanReview(value:unknown,development:boolean){return resolveArchitectureReview(value,development)??(development&&typeof value==="string"&&Object.hasOwn(urbanReviewSpawns,value)?value:null);}
export function urbanExperienceSpawn(mode:WorldMode,review:string|null):SpawnPoint{return mode==="BHAKTAPUR"&&review?urbanReviewSpawns[review]??architectureExperienceSpawn(mode,review):architectureExperienceSpawn(mode,review);}
