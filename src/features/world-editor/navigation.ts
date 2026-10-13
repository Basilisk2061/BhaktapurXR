import {Euler,Vector3,type Camera} from "three";
export const cameraSpeeds=[.5,1,2,4];
export class EditorNavigation {
 active=false;keys=new Set<string>();velocity=new Vector3();yaw=0;pitch=0;
 start(camera:Camera){const e=new Euler().setFromQuaternion(camera.quaternion,"YXZ");this.yaw=e.y;this.pitch=e.x;this.active=true;this.keys.clear();this.velocity.set(0,0,0);}
 stop(){this.active=false;this.keys.clear();this.velocity.set(0,0,0);}
 look(camera:Camera,dx:number,dy:number){if(!this.active)return;this.yaw-=dx*.002;this.pitch=Math.max(-Math.PI/2+.01,Math.min(Math.PI/2-.01,this.pitch-dy*.002));camera.quaternion.setFromEuler(new Euler(this.pitch,this.yaw,0,"YXZ"));}
 step(camera:Camera,delta:number,speed:number){if(!this.active)return;const dt=Math.min(delta,.05),axis=(positive:string,negative:string)=>Number(this.keys.has(positive))-Number(this.keys.has(negative)),forward=new Vector3(0,0,-1).applyQuaternion(camera.quaternion),right=new Vector3(1,0,0).applyQuaternion(camera.quaternion),target=forward.multiplyScalar(axis("KeyW","KeyS")).addScaledVector(right,axis("KeyD","KeyA")).add(new Vector3(0,axis("KeyE","KeyQ"),0));if(target.lengthSq()>1)target.normalize();target.multiplyScalar(6*speed*(this.keys.has("ShiftLeft")||this.keys.has("ShiftRight")?4:1));this.velocity.lerp(target,1-Math.exp(-18*dt));camera.position.addScaledVector(this.velocity,dt);}
}
export function nextCameraSpeed(speed:number,delta:number){const index=cameraSpeeds.indexOf(speed);return cameraSpeeds[Math.max(0,Math.min(cameraSpeeds.length-1,index+(delta<0?1:-1)))];}
