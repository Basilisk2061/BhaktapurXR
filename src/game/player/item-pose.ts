import {Quaternion,Vector3,type Object3D} from 'three';
import type {ItemAction} from './player-runtime';
const ease=(t:number)=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);};
export const itemActionDuration={equip:1.08,throw:1.05} as const;
export const grainReleaseTime=.46;
// Model-space additive poses, converted through the same parent frames as bell-pose.
const bones=['mixamorigSpine','mixamorigSpine1','mixamorigSpine2','mixamorigRightShoulder','mixamorigRightArm','mixamorigRightForeArm','mixamorigRightHand'] as const;
type Pose=readonly (readonly [number,number,number])[];
const zero:Pose=bones.map(()=>[0,0,0]);
// Equip arm contact is solved from the live hip/thigh landmarks below, rather
// than hoping fixed model-space elbow angles put the hand beside the pocket.
const pocket:Pose=[[.025,-.035,-.018],[.025,-.035,-.018],[.02,-.025,-.012],[-.08,0,.025],[0,0,0],[0,0,0],[-.12,.08,-.04]];
const pocketPick:Pose=[[.025,-.035,-.018],[.025,-.035,-.018],[.02,-.025,-.012],[-.08,0,.025],[0,0,0],[0,0,0],[-.18,.1,-.04]];
const holding:Pose=[[0,.02,0],[0,.02,0],[0,.02,0],[.05,0,0],[.18,-.04,-.04],[.68,0,0],[.1,0,0]];
const prep:Pose=[[.035,-.045,0],[.035,-.045,0],[.025,-.03,0],[-.06,0,.025],[-.3,.02,.06],[.3,0,0],[-.1,0,0]];
const toss:Pose=[[-.035,.06,0],[-.035,.06,0],[-.025,.035,0],[.12,0,0],[.82,-.025,-.04],[.35,0,0],[.16,0,0]];
const follow:Pose=[[-.02,.045,0],[-.02,.045,0],[-.015,.03,0],[.08,0,0],[.94,-.035,-.05],[.15,0,0],[.12,0,0]];
export function createItemPose(model:Object3D){
 model.updateWorldMatrix(true,true);
 const modelRotation=model.getWorldQuaternion(new Quaternion()),q=new Quaternion(),offset=new Quaternion();
 const entries=bones.flatMap((name,index)=>{
  const bone=model.getObjectByName(name);if(!bone?.parent)return [];
  const frame=bone.parent.getWorldQuaternion(new Quaternion()).invert().multiply(modelRotation);
  return [{bone,index,base:bone.quaternion.clone(),axes:[new Vector3(1,0,0),new Vector3(0,1,0),new Vector3(0,0,1)].map(axis=>axis.applyQuaternion(frame))}];
 });
 // A two-link procedural reach, scoped ONLY to equip. It changes rotations,
 // never bone translations/lengths, and the normal entry bases restore it fully.
 const hips=model.getObjectByName('mixamorigHips'),rightHip=model.getObjectByName('mixamorigRightUpLeg'),leftHip=model.getObjectByName('mixamorigLeftUpLeg');
 const arm=model.getObjectByName('mixamorigRightArm'),forearm=model.getObjectByName('mixamorigRightForeArm'),hand=model.getObjectByName('mixamorigRightHand');
 const shoulder=new Vector3(),elbow=new Vector3(),wrist=new Vector3(),hip=new Vector3(),thigh=new Vector3(),side=new Vector3(),up=new Vector3(),forward=new Vector3(),target=new Vector3(),direction=new Vector3(),bend=new Vector3(),joint=new Vector3(),from=new Vector3(),to=new Vector3();
 const worldRotation=new Quaternion(),parentRotation=new Quaternion(),desiredRotation=new Quaternion(),deltaRotation=new Quaternion();
 const aim=(bone:Object3D,child:Object3D,goal:Vector3,weight:number)=>{
  bone.getWorldPosition(from);child.getWorldPosition(to);to.sub(from).normalize();from.copy(goal).sub(bone.getWorldPosition(joint)).normalize();
  deltaRotation.setFromUnitVectors(to,from);bone.getWorldQuaternion(worldRotation);
  bone.parent!.getWorldQuaternion(parentRotation).invert();desiredRotation.copy(parentRotation).multiply(deltaRotation).multiply(worldRotation);
  bone.quaternion.slerp(desiredRotation,weight);bone.updateWorldMatrix(true,true);
 };
 const reachPocket=(time:number)=>{
  if(!hips||!rightHip||!leftHip||!arm?.parent||!forearm?.parent||!hand)return;
  const weight=ease(time/.454)*(1-ease((time-.907)/.173));if(weight<=0)return;
  model.updateWorldMatrix(true,true);model.getWorldQuaternion(worldRotation);up.set(0,1,0).applyQuaternion(worldRotation);
  hips.getWorldPosition(hip);rightHip.getWorldPosition(thigh);leftHip.getWorldPosition(side);side.subVectors(thigh,side);side.addScaledVector(up,-side.dot(up)).normalize();forward.crossVectors(up,side).normalize();
  arm.getWorldPosition(shoulder);forearm.getWorldPosition(elbow);hand.getWorldPosition(wrist);
  const upper=shoulder.distanceTo(elbow),lower=elbow.distanceTo(wrist);if(upper<.001||lower<.001)return;
  // Palm at the outer upper pocket; wrist sits one palm-length above contact.
  target.copy(thigh);from.subVectors(hip,thigh);target.addScaledVector(up,from.dot(up)*.8+lower*.36).addScaledVector(side,upper*.32).addScaledVector(forward,upper*.1);
  const withdraw=ease((time-.648)/.259);target.addScaledVector(forward,withdraw*upper*.7).addScaledVector(up,withdraw*lower*.65);
  direction.subVectors(target,shoulder);const distance=Math.max(Math.abs(upper-lower)+.001,Math.min((upper+lower)*.94,direction.length()));direction.normalize();target.copy(shoulder).addScaledVector(direction,distance);
  // Keep the elbow outside the torso and slightly behind the hand's approach.
  bend.copy(side).multiplyScalar(.45).addScaledVector(forward,-.85);bend.addScaledVector(direction,-bend.dot(direction)).normalize();
  const along=(upper*upper-lower*lower+distance*distance)/(2*distance),height=Math.sqrt(Math.max(0,upper*upper-along*along));
  elbow.copy(shoulder).addScaledVector(direction,along).addScaledVector(bend,height);
  aim(arm,forearm,elbow,weight);aim(forearm,hand,target,weight);
 };
 let applied=false;
 const restore=()=>{if(applied){entries.forEach(entry=>entry.bone.quaternion.copy(entry.base));applied=false;}};
 return {supported:entries.length===bones.length,restore,
  apply(action:ItemAction|null|undefined){
   if(!action||action.elapsed>=itemActionDuration[action.kind])return;
   const frames=action.kind==='equip'?[[0,zero],[.454,pocket],[.648,pocketPick],[.907,holding],[1.08,zero]] as const:[[0,zero],[.22,prep],[.46,toss],[.64,follow],[1.05,zero]] as const;
   let index=1;while(index<frames.length-1&&action.elapsed>frames[index][0])index++;
   const [start,a]=frames[index-1],[end,b]=frames[index],weight=ease((action.elapsed-start)/(end-start));
   for(const entry of entries){entry.base.copy(entry.bone.quaternion);offset.identity();entry.axes.forEach((axis,i)=>{q.setFromAxisAngle(axis,a[entry.index][i]+(b[entry.index][i]-a[entry.index][i])*weight);offset.multiply(q);});entry.bone.quaternion.premultiply(offset);}
   if(action.kind==='equip')reachPocket(action.elapsed);
   applied=true;
  }};
}
