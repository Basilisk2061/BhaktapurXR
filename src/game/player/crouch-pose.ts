import {Quaternion,Vector3,type Object3D} from 'three';
/** Visual stance is independent of the 1.25 m gameplay capsule; never move the model root. */
export const crouchVisual={hipDrop:.27,cameraDrop:.33,strideReduction:.15} as const;
/** Restrained model-frame additive pose. Idle/Walk supply all breathing and foot motion. */
export function createCrouchPose(model:Object3D){
 const hips=model.getObjectByName('mixamorigHips');
 // Both limbs use the same anatomical/model-space pitch despite different bind frames.
 const definitions=[['Spine',6],['Spine1',4],['Neck',-7],['Head',-3],['LeftUpLeg',-24],['RightUpLeg',-24],['LeftLeg',35],['RightLeg',35],['LeftFoot',-11],['RightFoot',-11]] as const;
 const entries=definitions.flatMap(([name,degrees])=>{const bone=model.getObjectByName('mixamorig'+name);return bone?.parent?[{bone,angle:degrees*Math.PI/180,leg:/Leg|Foot/.test(name),base:bone.quaternion.clone(),neutral:bone.quaternion.clone()}]:[];});
 const hipPosition=new Vector3(),hipWorld=new Vector3(),right=new Vector3(),forward=new Vector3(),axis=new Vector3(),temp=new Vector3();
 const orientation=new Quaternion(),parent=new Quaternion(),offset=new Quaternion();let applied=false;
 return {supported:!!hips&&entries.length===definitions.length,
  restore(){if(applied){for(const e of entries)e.bone.quaternion.copy(e.base);hips!.position.copy(hipPosition);}applied=false;},
  apply(weight:number,walking=false){
   if(weight<=0||!hips||entries.length!==definitions.length)return;
   hipPosition.copy(hips.position);for(const e of entries)e.base.copy(e.bone.quaternion);applied=true;
   model.getWorldQuaternion(orientation);right.set(1,0,0).applyQuaternion(orientation);forward.set(0,0,1).applyQuaternion(orientation);
   hips.getWorldPosition(hipWorld);temp.copy(hipWorld);temp.y-=crouchVisual.hipDrop*weight;temp.addScaledVector(forward,-.025*weight);hips.parent!.worldToLocal(temp);hips.position.copy(temp);hips.updateWorldMatrix(true,false);
   for(const e of entries){
    // Dampen a little gait excursion; no foot targets, knee aiming or leg-length solving.
    if(walking&&e.leg)e.bone.quaternion.slerp(e.neutral,crouchVisual.strideReduction*weight);
    e.bone.parent!.getWorldQuaternion(parent).invert();axis.copy(right).applyQuaternion(parent);
    offset.setFromAxisAngle(axis,e.angle*weight);e.bone.quaternion.premultiply(offset);
   }
  }
 };
}
