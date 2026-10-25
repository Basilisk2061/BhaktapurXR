import {Quaternion,Vector3,type Object3D} from 'three';
const ease=(t:number)=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);};
/** Confirmed in player.glb. Angles are model-space additive offsets, not rig-local guesses. */
const parts=[
 ['mixamorigSpine',-.07,.02,0],['mixamorigSpine1',-.07,-.03,0],['mixamorigSpine2',-.06,.04,0],
 ['mixamorigLeftShoulder',.12,0,-.04],['mixamorigRightShoulder',.17,0,.04],
 ['mixamorigLeftArm',.72,-.08,-.08],['mixamorigRightArm',.94,.06,.06],
 ['mixamorigLeftForeArm',.55,0,0],['mixamorigRightForeArm',.72,0,0],
 ['mixamorigLeftHand',.1,-.06,0],['mixamorigRightHand',.12,.06,0],
] as const;
export function createBellPose(model:Object3D){
 model.updateWorldMatrix(true,true);
 const modelRotation=model.getWorldQuaternion(new Quaternion()),q=new Quaternion(),offset=new Quaternion();
 const entries=parts.flatMap(([name,x,y,z])=>{
  const bone=model.getObjectByName(name);if(!bone?.parent)return [];
  const frame=bone.parent.getWorldQuaternion(new Quaternion()).invert().multiply(modelRotation);
  return [{bone,fore:name.includes('ForeArm'),torso:name.includes('Spine'),base:bone.quaternion.clone(),angles:[x,y,z],axes:[new Vector3(1,0,0),new Vector3(0,1,0),new Vector3(0,0,1)].map(axis=>axis.applyQuaternion(frame))}];
 });
 let applied=false;
 const restore=()=>{if(applied){for(const entry of entries)entry.bone.quaternion.copy(entry.base);applied=false;}};
 return {supported:entries.length===parts.length,restore,
  apply(time:number|undefined){
   if(time===undefined||time>=1.4)return;
   const reach=ease(time/.3),pull=ease((time-.3)/.4),follow=ease((time-.7)/.3),recover=1-ease((time-1)/.4);
   for(const entry of entries){
    entry.base.copy(entry.bone.quaternion);offset.identity();
    const weight=reach*(entry.fore?1+.55*pull-.18*follow:entry.torso?1-1.35*pull+.3*follow:1-.48*pull-.18*follow)*recover;
    entry.axes.forEach((axis,i)=>{q.setFromAxisAngle(axis,entry.angles[i]*weight);offset.multiply(q);});
    entry.bone.quaternion.premultiply(offset);
   }
   applied=true;
  }};
}
