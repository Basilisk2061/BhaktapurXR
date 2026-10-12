import {centralReviewSpawns,resolveReviewView,experienceSpawn} from "./review-spawn.ts";
import {worldSpawns,type WorldMode} from "./world-mode.ts";
import type {SpawnPoint} from "../../types/world.ts";
// Existing five preset definitions stay byte-for-byte unchanged in their baseline module.
export const remainingReviewSpawns:Record<string,SpawnPoint>={
 east:{position:[39,.05,21],rotation:[0,.19,0]},
 west:{position:[-91,.05,-37],rotation:[0,2.87,0]},
 "7b-wide":{position:[-28,.05,105],rotation:[0,.08,0]},
};
export const architectureReviewSpawns={...centralReviewSpawns,...remainingReviewSpawns};
export function resolveArchitectureReview(value:unknown,development:boolean){return resolveReviewView(value,development)??(development&&typeof value==="string"&&Object.hasOwn(remainingReviewSpawns,value)?value:null);}
export function architectureExperienceSpawn(mode:WorldMode,review:string|null):SpawnPoint{return mode==="BHAKTAPUR"&&review?(remainingReviewSpawns[review]??experienceSpawn(mode,review)):worldSpawns[mode];}
