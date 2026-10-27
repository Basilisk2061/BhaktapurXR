import {Quaternion,Vector3,type Object3D} from 'three';
/** Small two-link leg pose layer over live Idle/Walk; not a separate locomotion controller. */
export function createCrouchPose(model:Object3D){
 const find=(name:string)=>model.getObjectByName('mixamorig'+name);
 const hips=find('Hips'),spine=[find('Spine'),find('Spine1'),find('Spine2')],neck=find('Neck');
 const legs=['Left','Right'].map((side,index)=>({up:find(side+'UpLeg'),leg:find(side+'Leg'),foot:find(side+'Foot'),side:index===0?1:-1,target:new Vector3(),orientation:new Quaternion(),upper:0,lower:0}));
 const entries=[hips,...spine,neck,...legs.flatMap(l=>[l.up,l.leg,l.foot])].filter((b):b is Object3D=>!!b).map(b=>({b,q:b.quaternion.clone()}));
 const hipPosition=new Vector3(),hipWorld=new Vector3(),right=new Vector3(),forward=new Vector3(),up=new Vector3(0,1,0),axis=new Vector3(),a=new Vector3(),b=new Vector3(),c=new Vector3(),direction=new Vector3(),bend=new Vector3(),knee=new Vector3(),temp=new Vector3();
 const orientation=new Quaternion(),parent=new Quaternion(),q=new Quaternion(),delta=new Quaternion();let applied=false;
 const aim=(bone:Object3D,child:Object3D,goal:Vector3)=>{bone.getWorldPosition(a);child.getWorldPosition(b);b.sub(a).normalize();c.subVectors(goal,a).normalize();delta.setFromUnitVectors(b,c);bone.getWorldQuaternion(q);bone.parent!.getWorldQuaternion(parent).invert();bone.quaternion.copy(q.premultiply(delta).premultiply(parent));bone.updateWorldMatrix(true,true);};
 const rotate=(bone:Object3D|undefined,angle:number)=>{if(!bone?.parent)return;bone.parent.getWorldQuaternion(parent).invert();axis.copy(right).applyQuaternion(parent);q.setFromAxisAngle(axis,angle);bone.quaternion.premultiply(q);bone.updateWorldMatrix(true,true);};
 return {supported:!!hips&&legs.every(l=>l.up&&l.leg&&l.foot),restore(){if(applied){for(const e of entries)e.b.quaternion.copy(e.q);hips!.position.copy(hipPosition);}applied=false;},apply(weight:number){
  if(weight<=0||!hips||legs.some(l=>!l.up||!l.leg||!l.foot))return;
  for(const e of entries)e.q.copy(e.b.quaternion);hipPosition.copy(hips.position);applied=true;
  model.getWorldQuaternion(orientation);right.set(1,0,0).applyQuaternion(orientation);forward.set(0,0,1).applyQuaternion(orientation);hips.getWorldPosition(hipWorld);
  for(const l of legs){l.up!.getWorldPosition(a);l.leg!.getWorldPosition(b);l.foot!.getWorldPosition(l.target);l.upper=a.distanceTo(b);l.lower=b.distanceTo(l.target);l.foot!.getWorldQuaternion(l.orientation);
   // Retain animation's foot lift/contact, shorten only its fore/aft stride.
   temp.subVectors(l.target,hipWorld);l.target.addScaledVector(forward,-temp.dot(forward)*.3*weight);
  }
  temp.copy(hipWorld).addScaledVector(up,-.43*weight).addScaledVector(forward,-.08*weight);hips.parent!.worldToLocal(temp);hips.position.copy(temp);hips.updateWorldMatrix(true,true);
  for(const bone of spine)rotate(bone,.10*weight);rotate(neck,-.20*weight);
  for(const l of legs){const upper=l.up!,lower=l.leg!,foot=l.foot!;upper.getWorldPosition(a);direction.subVectors(l.target,a);const distance=Math.max(Math.abs(l.upper-l.lower)+.001,Math.min((l.upper+l.lower)*.995,direction.length()));direction.normalize();
   bend.copy(forward).addScaledVector(right,l.side*.08);bend.addScaledVector(direction,-bend.dot(direction)).normalize();const along=(l.upper*l.upper-l.lower*l.lower+distance*distance)/(2*distance);knee.copy(a).addScaledVector(direction,along).addScaledVector(bend,Math.sqrt(Math.max(0,l.upper*l.upper-along*along)));
   aim(upper,lower,knee);aim(lower,foot,l.target);foot.parent!.getWorldQuaternion(parent).invert();foot.quaternion.copy(parent.multiply(l.orientation));foot.updateWorldMatrix(true,true);
  }
 }};
}
