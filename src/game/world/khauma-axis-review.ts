import type {SpawnPoint} from "../../types/world.ts";
import type {WorldMode} from "./world-mode.ts";
import {KHAUMA_GATE_VIEW_AXIS} from "../../data/reconstruction/khauma-spatial-audit.ts";
import {resolveUrbanCompleteReview,urbanCompleteExperienceSpawn,isUrbanAerialReview} from "./urban-complete-review.ts";
const centre=KHAUMA_GATE_VIEW_AXIS.proposedCentre;
const target=[-10.012564711790674,7.277097845494605],length=Math.hypot(target[0]-centre[0],target[1]-centre[1]);
export const gateViewDirection:[number,number]=[(target[0]-centre[0])/length,(target[1]-centre[1])/length];
const yaw=Math.atan2(-gateViewDirection[0],-gateViewDirection[1]);
const spawn=(distance:number):SpawnPoint=>({position:[centre[0]+gateViewDirection[0]*distance,.05,centre[1]+gateViewDirection[1]*distance],rotation:[0,yaw,0]});
// Diagnostic source-axis views: show the corrected gate and still expose surrounding registration limits.
// Kept separate from context's protected spawn list so adding cameras changes no building geometry.
export const khaumaAxisReviewSpawns:Record<string,SpawnPoint>={
 "khauma-real-axis-outside":spawn(-3),
 "khauma-real-axis-inside":spawn(9),
 "square-edge-west":{position:[-75,.05,-18],rotation:[0,1.53,0]},
 "square-edge-central":{position:[-21,.05,-2],rotation:[0,Math.PI/2,0]},
 "square-edge-aerial":{position:[-76,34,68],rotation:[0,-.38,0]},
 "context-transition":{position:[-106,16,52],rotation:[0,.08,0]},
};
export function isSpatialAerialReview(review:string|null){return isUrbanAerialReview(review)||review==="square-edge-aerial"||review==="context-transition";}
export function resolveKhaumaAxisReview(value:unknown,development:boolean){return resolveUrbanCompleteReview(value,development)??(development&&typeof value==="string"&&Object.hasOwn(khaumaAxisReviewSpawns,value)?value:null);}
export function khaumaAxisExperienceSpawn(mode:WorldMode,review:string|null):SpawnPoint{return mode==="BHAKTAPUR"&&review?(review==="west-gate-outside"?khaumaAxisReviewSpawns["khauma-real-axis-outside"]:review==="west-gate-inside"?khaumaAxisReviewSpawns["khauma-real-axis-inside"]:khaumaAxisReviewSpawns[review])??urbanCompleteExperienceSpawn(mode,review):urbanCompleteExperienceSpawn(mode,review);}
