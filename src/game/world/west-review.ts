import type {SpawnPoint} from "../../types/world.ts";
import type {WorldMode} from "./world-mode.ts";
import {resolvePlazaReview,plazaExperienceSpawn} from "./plaza-review.ts";
import {westSpecificationById} from "../../data/reconstruction/architecture/west-specifications.ts";
const gate=westSpecificationById["khauma-gate"].position;
export const westReviewSpawns:Record<string,SpawnPoint>={
 "west-gate-outside":{position:[gate[0],.05,gate[1]-13],rotation:[0,Math.PI,0]},
 "west-gate-inside":{position:[gate[0],.05,gate[1]+13],rotation:[0,0,0]},
 "west-char-dham":{position:[-59,.05,26],rotation:[0,1.02,0]},
 "west-aerial":{position:[-145,31,26],rotation:[0,-.9,0]},
 "west-to-central":{position:[-76,.05,21],rotation:[0,-1.35,0]},
};
export function resolveWestReview(value:unknown,development:boolean){return resolvePlazaReview(value,development)??(development&&typeof value==="string"&&Object.hasOwn(westReviewSpawns,value)?value:null);}
export function westExperienceSpawn(mode:WorldMode,review:string|null):SpawnPoint{return mode==="BHAKTAPUR"&&review?westReviewSpawns[review]??plazaExperienceSpawn(mode,review):plazaExperienceSpawn(mode,review);}
