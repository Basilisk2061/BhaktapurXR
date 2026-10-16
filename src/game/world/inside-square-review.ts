import {khaumaExteriorReviews} from "../architecture/khauma-exterior.ts";
import {squareCompletionReviewCamera,squareCompletionReviewSpawn} from "./square-completion-review.ts";
import type {SpawnPoint} from "../../types/world.ts";
const pose=(position:[number,number,number],target:[number,number,number],fov=58)=>{
 const dx=target[0]-position[0],dy=target[1]-position[1],dz=target[2]-position[2];
 return {position,height:position[1],yaw:Math.atan2(-dx,-dz),pitch:Math.atan2(dy,Math.hypot(dx,dz)),fov};
};
/** Photo comparison poses are approximate perspectives, not evidence coordinates. */
export const insideSquareReviews={
 ...Object.fromEntries(Object.entries(khaumaExteriorReviews).map(([id,c])=>[id,pose(c.position,c.target,c.fov)])),
 "9b-gate-entry":pose([-116.6,1.65,-33.6],[-43,4,-7]),
 "9b-reference-match":pose([-92,1.65,-14],[-13,4,5],54),
 "9b-western-square":pose([-113,1.65,-18],[-90,4,-12],66),
 "9b-western-shrines":pose([-86,1.65,-20],[-107,3,-15],68),
 "9b-palace-approach":pose([-68,1.65,-7],[-31,4,-17]),
 "9b-palace-edge":pose([-25,1.65,1],[-19,4,-17],66),
 "9b-central-composition":pose([-30,1.65,2],[-8,4,0],66),
 "9b-arcade":pose([-47,1.65,2],[-45,3,12],64),
 "9b-aerial":pose([-65,35,58],[-47,0,-6],66),
 "9b-back-to-khauma":pose([-62,1.65,-12],[-121.5,3,-34.3]),
} as const;
export const palaceCorrectionReviews={
 "9b1-map-west":pose([-110,25,24],[-80,0,-19],66),
 "9b1-palace-photo":pose([-13.5,7,6.5],[-22,6,-17],84),
 "9b1-golden-gate-close":pose([-21,1.65,-5],[-16,3.5,-17],68),
 "9b1-plan-aerial":pose([-43,75,8],[-43,0,-2],70),
} as const;
export const museumEntranceReview=pose([-39.7,2.2,-11.2],[-40,2.75,-18.75],58);
export const museumSculpturesCloseReview=pose([-40.8,2.35,-13.7],[-38.45,2.25,-17.75],52);
export function insideSquareReviewCamera(review:string|null){const complete=squareCompletionReviewCamera(review);if(complete)return complete;if(review==="9b2-museum-sculptures-close")return museumSculpturesCloseReview;if(review==="9b2-museum-entrance")return museumEntranceReview;if(review&&Object.hasOwn(palaceCorrectionReviews,review))return palaceCorrectionReviews[review as keyof typeof palaceCorrectionReviews];return review&&Object.hasOwn(insideSquareReviews,review)?insideSquareReviews[review as keyof typeof insideSquareReviews]:null;}
export function insideSquareReviewSpawn(review:string|null):SpawnPoint|null{
 const complete=squareCompletionReviewSpawn(review);if(complete)return complete;const p=insideSquareReviewCamera(review);if(p&&review==="9b1-palace-photo")return {position:[-8.9,6.4,10.1],rotation:[0,p.yaw,0]};return p?{position:[p.position[0]+Math.sin(p.yaw)*2,review==="9b-aerial"?35:review?.startsWith("9b1-")&&p.height>5?p.height:.05,p.position[2]+Math.cos(p.yaw)*2],rotation:[0,p.yaw,0]}:null;
}
