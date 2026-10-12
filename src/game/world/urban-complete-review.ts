import type {SpawnPoint} from "../../types/world.ts";
import type {WorldMode} from "./world-mode.ts";
import {resolveWestReview,westExperienceSpawn} from "./west-review.ts";
export const urbanCompleteReviewSpawns:Record<string,SpawnPoint>={
 "west-urban-aerial":{position:[-145,34,38],rotation:[0,-.85,0]},
 "west-street":{position:[-123,.05,-34],rotation:[0,Math.PI,0]},
 "west-cluster-wide":{position:[-40,.05,1],rotation:[0,1.52,0]},
 "yaksheshwar-complete":{position:[-26,.05,35],rotation:[0,-1.2,0]},
 "west-central-aerial":{position:[-70,35,62],rotation:[0,-.28,0]},
};
export function isUrbanAerialReview(review:string|null){return review==="west-aerial"||review==="west-urban-aerial"||review==="west-central-aerial";}
export function resolveUrbanCompleteReview(value:unknown,development:boolean){return resolveWestReview(value,development)??(development&&typeof value==="string"&&Object.hasOwn(urbanCompleteReviewSpawns,value)?value:null);}
export function urbanCompleteExperienceSpawn(mode:WorldMode,review:string|null):SpawnPoint{return mode==="BHAKTAPUR"&&review?urbanCompleteReviewSpawns[review]??westExperienceSpawn(mode,review):westExperienceSpawn(mode,review);}
