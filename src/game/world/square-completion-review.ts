import type {SpawnPoint} from "../../types/world.ts";
const pose=(position:[number,number,number],target:[number,number,number],fov=64)=>{const dx=target[0]-position[0],dy=target[1]-position[1],dz=target[2]-position[2];return {position,height:position[1],yaw:Math.atan2(-dx,-dz),pitch:Math.atan2(dy,Math.hypot(dx,dz)),fov};};
export const squareCompletionReviews={
 "9c-khauma-entry":pose([-132,1.65,-35.7],[-96,3,-30.7],64),
 "9c-western-cluster":pose([-110,1.65,-18],[-92,4,-12],72),
 "9c-museum-approach":pose([-65,1.65,-9],[-38,4,-18]),
 "9c-palace-frontage":pose([-28,1.65,0],[-13,4,-17],78),
 "9c-golden-gate":pose([-21,1.65,-5],[-16,3.5,-17],68),
 "9c-central-west":pose([-30,1.65,2],[-8,4,0],66),
 "9c-central-east":pose([1,1.65,-1],[-16,4,6],70),
 "9c-southern-edge":pose([-28,1.65,5],[-27,4,21],76),
 "9c-eastern-square":pose([22,1.65,-3],[28,5,-20],76),
 "9c-fasidega":pose([21,1.65,-20],[36,13,-40],72),
 "9c-arcade":pose([-46,1.65,1],[-44,3.4,14],68),
 "9c-palace-depth":pose([-60,25,-9],[-27,3,-46],76),
 "9c-aerial-west":pose([-115,25,28],[-100,0,-18],74),
 "9c-aerial-central":pose([-24,25,25],[-14,0,-10],76),
 "9c-aerial-east":pose([43,27,17],[27,0,-21],78),
 "9c-full-aerial":pose([-50,125,35],[-38,0,-17],78),
 "9c-back-to-khauma":pose([-68,1.65,-10],[-122,3,-34],68),
} as const;
export function squareCompletionReviewCamera(review:string|null){return review&&Object.hasOwn(squareCompletionReviews,review)?squareCompletionReviews[review as keyof typeof squareCompletionReviews]:null;}
export function squareCompletionReviewSpawn(review:string|null):SpawnPoint|null{const p=squareCompletionReviewCamera(review);return p?{position:[p.position[0]+Math.sin(p.yaw)*2,p.height>5?p.height:.05,p.position[2]+Math.cos(p.yaw)*2],rotation:[0,p.yaw,0]}:null;}
