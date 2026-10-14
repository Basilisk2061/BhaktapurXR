import type {SpawnPoint} from "../../types/world.ts";
const pose=(position:[number,number,number],target:[number,number,number],fov=58)=>{
 const dx=target[0]-position[0],dy=target[1]-position[1],dz=target[2]-position[2];
 return {position,height:position[1],yaw:Math.atan2(-dx,-dz),pitch:Math.atan2(dy,Math.hypot(dx,dz)),fov};
};
/** Photo comparison poses are approximate perspectives, not evidence coordinates. */
export const insideSquareReviews={
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
export function insideSquareReviewCamera(review:string|null){return review&&Object.hasOwn(insideSquareReviews,review)?insideSquareReviews[review as keyof typeof insideSquareReviews]:null;}
export function insideSquareReviewSpawn(review:string|null):SpawnPoint|null{
 const p=insideSquareReviewCamera(review);return p?{position:[p.position[0]+Math.sin(p.yaw)*2,review==="9b-aerial"?35:.05,p.position[2]+Math.cos(p.yaw)*2],rotation:[0,p.yaw,0]}:null;
}
