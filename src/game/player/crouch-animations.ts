import {AnimationClip,AnimationMixer,Quaternion,QuaternionKeyframeTrack,Vector3,VectorKeyframeTrack,type Bone,type Object3D} from 'three';
import {clone} from 'three/addons/utils/SkeletonUtils.js';
import {crouchAnimation} from './crouch-animation-config.ts';
const required=['Hips','Spine','Spine1','Spine2','Neck','Head','LeftUpLeg','LeftLeg','LeftFoot','RightUpLeg','RightLeg','RightFoot','LeftShoulder','LeftArm','LeftForeArm','RightShoulder','RightArm','RightForeArm'] as const;
/** Author in-place clip assets ONCE from the actual rig. No pose solver runs during playback.
 * Joint keyframes are calibrated to measured limb lengths and authored contact/passing poses,
 * rather than copying Euler guesses into this character's asymmetric local bind frames.
 */
export function createCrouchAnimations(model:Object3D,references:readonly AnimationClip[]):AnimationClip[]{
 const rig=clone(model),bones:Bone[]=[];rig.position.set(0,0,0);rig.traverse(o=>{if(o.type==='Bone')bones.push(o as Bone);});
 const byName=new Map(bones.map(b=>[b.name,b])),missing=required.filter(name=>!byName.has('mixamorig'+name));
 const idle=references.find(c=>c.name==='Idle'),walk=references.find(c=>c.name==='Walk');
 if(missing.length||!idle||!walk){const message=`Cannot author player crouch clips: missing ${missing.join(', ')||'Idle/Walk reference'}`;if(process.env.NODE_ENV==='development')console.warn(message);throw Error(message);}
 const bone=(name:string)=>byName.get('mixamorig'+name)!,hips=bone('Hips');
 const rest=bones.map(b=>({bone:b,p:b.position.clone(),q:b.quaternion.clone(),s:b.scale.clone()}));
 const mixer=new AnimationMixer(rig),idleAction=mixer.clipAction(idle),walkAction=mixer.clipAction(walk);
 const sample=(clip:AnimationClip,time:number)=>{mixer.stopAllAction();for(const e of rest){e.bone.position.copy(e.p);e.bone.quaternion.copy(e.q);e.bone.scale.copy(e.s);}const action=clip===idle?idleAction:walkAction;action.reset().play();action.time=time;mixer.update(0);rig.updateMatrixWorld(true);};
 sample(idle,0);
 const neutral=bones.map(b=>b.quaternion.clone()),hipNeutral=hips.getWorldPosition(new Vector3());
 const rigRotation=rig.getWorldQuaternion(new Quaternion()),forward=new Vector3(0,0,1).applyQuaternion(rigRotation),right=new Vector3(1,0,0).applyQuaternion(rigRotation);
 const legs=['Left','Right'].map((side,index)=>{const upper=bone(side+'UpLeg'),lower=bone(side+'Leg'),foot=bone(side+'Foot'),a=upper.getWorldPosition(new Vector3()),b=lower.getWorldPosition(new Vector3()),c=foot.getWorldPosition(new Vector3());return {upper,lower,foot,side:index===0?1:-1,upperLength:a.distanceTo(b),lowerLength:b.distanceTo(c),plant:c.clone(),orientation:foot.getWorldQuaternion(new Quaternion()),sampleOrientation:new Quaternion(),target:new Vector3()};});
 const centre=legs[0].plant.clone().add(legs[1].plant).multiplyScalar(.5);
 // A shallow, proportion-derived hip drop; shoes retain the measured Idle contact level.
 const hipDrop=(legs[0].upperLength+legs[0].lowerLength+legs[1].upperLength+legs[1].lowerLength)/2*.17;
 for(const l of legs){const lateral=l.plant.clone().sub(centre).dot(right),level=l.plant.y;l.plant.copy(centre).addScaledVector(right,lateral*1.04);l.plant.y=level;}
 const hipPoint=new Vector3(),a=new Vector3(),b=new Vector3(),direction=new Vector3(),bend=new Vector3(),knee=new Vector3(),from=new Vector3(),to=new Vector3(),origin=new Vector3(),axis=new Vector3();
 const parent=new Quaternion(),q=new Quaternion(),delta=new Quaternion();
 const aim=(joint:Object3D,child:Object3D,target:Vector3)=>{joint.getWorldPosition(origin);child.getWorldPosition(from);from.sub(origin).normalize();to.subVectors(target,origin).normalize();delta.setFromUnitVectors(from,to);joint.getWorldQuaternion(q);joint.parent!.getWorldQuaternion(parent).invert();joint.quaternion.copy(q.premultiply(delta).premultiply(parent));joint.updateWorldMatrix(true,true);};
 const pitch=(joint:Object3D,angle:number)=>{joint.parent!.getWorldQuaternion(parent).invert();axis.copy(right).applyQuaternion(parent);q.setFromAxisAngle(axis,angle);joint.quaternion.premultiply(q);joint.updateWorldMatrix(true,true);};
 const author=(walking:boolean)=>{
  const duration=walking?1:2.4,steps=walking?32:24,times:number[]=[],values=bones.map(()=>[] as number[]),positions:number[]=[];
  for(let frame=0;frame<=steps;frame++){
   const u=frame/steps,phase=2*Math.PI*u;times.push(u*duration);
   sample(walking?walk:idle,walking?((u+.383333/walk.duration)%1)*walk.duration:(u%1)*idle.duration);
   for(const l of legs)l.foot.getWorldQuaternion(l.sampleOrientation);
   for(let i=0;i<bones.length;i++){const name=bones[i].name,arm=/Shoulder|Arm|Hand/.test(name);q.copy(bones[i].quaternion);bones[i].quaternion.slerpQuaternions(neutral[i],q,walking?(arm ? .55 : .15):.3);}
   hipPoint.copy(centre).addScaledVector(forward,-.025);hipPoint.y=hipNeutral.y-hipDrop+(walking ? .006*Math.sin(phase*2):.002*Math.sin(phase));hipPoint.addScaledVector(right,(walking ? .008 : .002)*Math.sin(phase));hips.parent!.worldToLocal(hipPoint);hips.position.copy(hipPoint);hips.updateWorldMatrix(true,true);
   pitch(bone('Spine'),.075);pitch(bone('Spine1'),.05);pitch(bone('Spine2'),.015);pitch(bone('Neck'),-.095);pitch(bone('Head'),-.045);
   for(const l of legs){
    l.target.copy(l.plant);
    if(walking){const p=(u+(l.side===1?0:.5))%1,stance=p<.5,stride=crouchAnimation.walkSpeed*duration/4;
     const travel=stance?stride*(1-4*p):-stride*Math.cos((p-.5)*2*Math.PI);
     l.target.addScaledVector(forward,travel);if(!stance)l.target.y+=.045*Math.sin((p-.5)*2*Math.PI)**2;
    }
    // Construction-time joint coordinates become fixed quaternion keyframes, not runtime IK.
    l.upper.getWorldPosition(a);direction.subVectors(l.target,a);const distance=direction.length(),safe=Math.max(Math.abs(l.upperLength-l.lowerLength)+.001,Math.min((l.upperLength+l.lowerLength)*.995,distance));direction.normalize();
    bend.copy(forward).addScaledVector(right,l.side*.025);bend.addScaledVector(direction,-bend.dot(direction)).normalize();const along=(l.upperLength*l.upperLength-l.lowerLength*l.lowerLength+safe*safe)/(2*safe);
    knee.copy(a).addScaledVector(direction,along).addScaledVector(bend,Math.sqrt(Math.max(0,l.upperLength*l.upperLength-along*along)));
    aim(l.upper,l.lower,knee);aim(l.lower,l.foot,l.target);
    l.foot.parent!.getWorldQuaternion(parent).invert();q.copy(l.orientation);if(walking)q.slerp(l.sampleOrientation,.12);l.foot.quaternion.copy(parent.multiply(q));l.foot.updateWorldMatrix(true,true);
   }
   for(let i=0;i<bones.length;i++){const rotation=bones[i].quaternion.normalize();if(!rotation.toArray().every(Number.isFinite))throw Error('Invalid authored crouch quaternion');values[i].push(rotation.x,rotation.y,rotation.z,rotation.w);}
   positions.push(hips.position.x,hips.position.y,hips.position.z);
  }
  // Exact loop seams, including the local hip sway. No accumulated root displacement.
  for(const v of values)v.splice(v.length-4,4,...v.slice(0,4));positions.splice(positions.length-3,3,...positions.slice(0,3));
  const tracks=bones.map((b,i)=>new QuaternionKeyframeTrack(b.name+'.quaternion',times,values[i]));
  return new AnimationClip(walking?'Player_CrouchWalk':'Player_CrouchIdle',duration,[...tracks,new VectorKeyframeTrack(hips.name+'.position',times,positions)]);
 };
 const clips=[author(false),author(true)];mixer.stopAllAction();mixer.uncacheRoot(rig);return clips;
}
