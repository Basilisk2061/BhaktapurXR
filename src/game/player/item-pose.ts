import {Quaternion,Vector3,type Object3D} from 'three';
import type {ItemAction} from './player-runtime';
const ease=(t:number)=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);};
export const itemActionDuration={equip:1.08,throw:1.05} as const;
export const grainReleaseTime=.46;
// Model-space additive poses, converted through the same parent frames as bell-pose.
const bones=['mixamorigSpine','mixamorigSpine1','mixamorigSpine2','mixamorigRightShoulder','mixamorigRightArm','mixamorigRightForeArm','mixamorigRightHand'] as const;
type Pose=readonly (readonly [number,number,number])[];
const zero:Pose=bones.map(()=>[0,0,0]);
// Upper arm draws the elbow back beside the hip; the opposing 66-degree
// forearm flex folds the hand down/forward to the outer trouser-pocket area.
// This rig's upper/forearm lengths are ~.21/.19 m; keep lateral offsets modest.
const pocket:Pose=[[.025,-.035,-.018],[.025,-.035,-.018],[.02,-.025,-.012],[-.08,0,.025],[-.58,.045,.09],[1.15,0,.025],[-.12,.08,-.04]];
const pocketPick:Pose=[[.025,-.035,-.018],[.025,-.035,-.018],[.02,-.025,-.012],[-.08,0,.025],[-.58,.045,.09],[1.15,0,.025],[-.18,.1,-.04]];
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
 let applied=false;
 const restore=()=>{if(applied){entries.forEach(entry=>entry.bone.quaternion.copy(entry.base));applied=false;}};
 return {supported:entries.length===bones.length,restore,
  apply(action:ItemAction|null|undefined){
   if(!action||action.elapsed>=itemActionDuration[action.kind])return;
   const frames=action.kind==='equip'?[[0,zero],[.432,pocket],[.626,pocketPick],[.886,holding],[1.08,zero]] as const:[[0,zero],[.22,prep],[.46,toss],[.64,follow],[1.05,zero]] as const;
   let index=1;while(index<frames.length-1&&action.elapsed>frames[index][0])index++;
   const [start,a]=frames[index-1],[end,b]=frames[index],weight=ease((action.elapsed-start)/(end-start));
   for(const entry of entries){entry.base.copy(entry.bone.quaternion);offset.identity();entry.axes.forEach((axis,i)=>{q.setFromAxisAngle(axis,a[entry.index][i]+(b[entry.index][i]-a[entry.index][i])*weight);offset.multiply(q);});entry.bone.quaternion.premultiply(offset);}applied=true;
  }};
}
