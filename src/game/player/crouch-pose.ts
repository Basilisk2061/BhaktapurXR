import {Quaternion,Vector3,type Object3D} from 'three';
/** Visual stance is independent of the 1.25 m gameplay capsule; never move the model root. */
export const crouchVisual={hipDrop:.18,cameraDrop:.33,strideReduction:.15} as const;
/** Restrained model-frame additive pose. Idle/Walk supply all breathing and foot motion. */
export function createCrouchPose(model:Object3D){
 const hips=model.getObjectByName('mixamorigHips');
 // Both limbs use the same restrained model-space pitch. Feet are deliberately absent:
 // ankle rotations/translations remain entirely owned by the original animation.
 const definitions=[['Spine',6],['Spine1',4],['Neck',-7],['Head',-3],['LeftUpLeg',-12],['RightUpLeg',-12],['LeftLeg',18],['RightLeg',18]] as const;
 const entries=definitions.flatMap(([name,degrees])=>{const bone=model.getObjectByName('mixamorig'+name);return bone?.parent?[{bone,angle:degrees*Math.PI/180,leg:/Leg/.test(name),base:bone.quaternion.clone(),neutral:bone.quaternion.clone()}]:[];});
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
