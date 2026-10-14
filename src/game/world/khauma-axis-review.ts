import {insideSquareReviewCamera,insideSquareReviewSpawn} from "./inside-square-review.ts";
import type {SpawnPoint} from "../../types/world.ts";
import type {WorldMode} from "./world-mode.ts";
import {KHAUMA_GATE_VIEW_AXIS} from "../../data/reconstruction/khauma-spatial-audit.ts";
import {resolveUrbanCompleteReview,urbanCompleteExperienceSpawn,isUrbanAerialReview} from "./urban-complete-review.ts";
const centre=KHAUMA_GATE_VIEW_AXIS.proposedCentre;
const target=[-10.012564711790674,7.277097845494605],length=Math.hypot(target[0]-centre[0],target[1]-centre[1]);
export const gateViewDirection:[number,number]=[(target[0]-centre[0])/length,(target[1]-centre[1])/length];
const yaw=Math.atan2(-gateViewDirection[0],-gateViewDirection[1]);
const spawn=(distance:number):SpawnPoint=>({position:[centre[0]+gateViewDirection[0]*distance,.05,centre[1]+gateViewDirection[1]*distance],rotation:[0,yaw,0]});
/** Approximate comparison poses. Vertical FOV in degrees; no EXIF/photogrammetric solution. */
export const khaumaPhotoCameras={
 "khauma-photo-outside":{height:1.65,distance:19,yawOffset:KHAUMA_GATE_VIEW_AXIS.proposedYaw-yaw,pitch:.12,fov:40,referenceAspect:650/432},
 "khauma-photo-through":{height:1.65,distance:7.5,yawOffset:-.09,pitch:.12,fov:56,referenceAspect:650/432},
} as const;
const photoAliases:Record<string,string>={"khauma-sightline-outside":"khauma-photo-outside","khauma-sightline-through":"khauma-photo-through"};
export function khaumaPhotoCamera(review:string|null){
 const inside=insideSquareReviewCamera(review);if(inside)return inside;
 review=review?photoAliases[review]??review:null;
 if(!review||!Object.hasOwn(khaumaPhotoCameras,review))return null;
 const settings=khaumaPhotoCameras[review as keyof typeof khaumaPhotoCameras],cameraYaw=yaw+settings.yawOffset;
 return {...settings,yaw:cameraYaw,position:[centre[0]+Math.sin(cameraYaw)*settings.distance,settings.height,centre[1]+Math.cos(cameraYaw)*settings.distance] as [number,number,number]};
}
const photoSpawn=(review:string):SpawnPoint=>{const p=khaumaPhotoCamera(review)!;return {position:[p.position[0]+Math.sin(p.yaw)*2,.05,p.position[2]+Math.cos(p.yaw)*2],rotation:[0,p.yaw,0]};};
// Diagnostic source-axis views: show the corrected gate and still expose surrounding registration limits.
// Kept separate from context's protected spawn list so adding cameras changes no building geometry.
export const khaumaAxisReviewSpawns:Record<string,SpawnPoint>={
 "khauma-sightline-outside":photoSpawn("khauma-sightline-outside"),
 "khauma-sightline-through":photoSpawn("khauma-sightline-through"),
 "khauma-west-sequence":{position:[-106,.05,-28],rotation:[0,-1.95,0]},
 "khauma-west-aerial":{position:[-105,24,29],rotation:[0,.1,0]},
 "khauma-photo-outside":photoSpawn("khauma-photo-outside"),
 "khauma-photo-through":photoSpawn("khauma-photo-through"),
 "khauma-real-axis-outside":spawn(-3),
 "khauma-real-axis-inside":spawn(9),
 "square-edge-west":{position:[-75,.05,-18],rotation:[0,1.53,0]},
 "square-edge-central":{position:[-21,.05,-2],rotation:[0,Math.PI/2,0]},
 "square-edge-aerial":{position:[-76,34,68],rotation:[0,-.38,0]},
 "context-transition":{position:[-106,16,52],rotation:[0,.08,0]},
};
export function isSpatialAerialReview(review:string|null){return review==="9b1-map-west"||review==="9b1-plan-aerial"||review==="9b1-palace-photo"||review==="9b-aerial"||isUrbanAerialReview(review)||review==="square-edge-aerial"||review==="context-transition"||review==="khauma-west-aerial";}
export function resolveKhaumaAxisReview(value:unknown,development:boolean){return (development&&typeof value==="string"&&insideSquareReviewCamera(value)?value:null)??resolveUrbanCompleteReview(value,development)??(development&&typeof value==="string"&&Object.hasOwn(khaumaAxisReviewSpawns,value)?value:null);}
export function khaumaAxisExperienceSpawn(mode:WorldMode,review:string|null):SpawnPoint{return mode==="BHAKTAPUR"&&review?insideSquareReviewSpawn(review)??(review==="west-gate-outside"?khaumaAxisReviewSpawns["khauma-real-axis-outside"]:review==="west-gate-inside"?khaumaAxisReviewSpawns["khauma-real-axis-inside"]:khaumaAxisReviewSpawns[review])??urbanCompleteExperienceSpawn(mode,review):urbanCompleteExperienceSpawn(mode,review);}
