import {AnimationClip,AnimationMixer,Quaternion,QuaternionKeyframeTrack,Vector3,VectorKeyframeTrack} from 'three';
import {clone} from 'three/addons/utils/SkeletonUtils.js';
// Actual Motifect names -> verified target names. Neck2 is collapsed into Head's world delta.
export const motifectPlayerMap={Hips:'mixamorigHips',Spine1:'mixamorigSpine',Spine2:'mixamorigSpine1',Chest:'mixamorigSpine2',Neck1:'mixamorigNeck',Head:'mixamorigHead',LeftShoulder:'mixamorigLeftShoulder',LeftArm:'mixamorigLeftArm',LeftForeArm:'mixamorigLeftForeArm',LeftHand:'mixamorigLeftHand',RightShoulder:'mixamorigRightShoulder',RightArm:'mixamorigRightArm',RightForeArm:'mixamorigRightForeArm',RightHand:'mixamorigRightHand',LeftLeg:'mixamorigLeftUpLeg',LeftShin:'mixamorigLeftLeg',LeftFoot:'mixamorigLeftFoot',RightLeg:'mixamorigRightUpLeg',RightShin:'mixamorigRightLeg',RightFoot:'mixamorigRightFoot',LeftToeBase:'mixamorigLeftToeBase',RightToeBase:'mixamorigRightToeBase'};
function bindRig(root){const copy=clone(root);copy.updateMatrixWorld(true);copy.traverse(o=>{if(o.isSkinnedMesh)o.skeleton.pose();});copy.updateMatrixWorld(true);const frames=new Map();copy.traverse(o=>{if(o.isBone)frames.set(o.name,{bone:o,rotation:o.getWorldQuaternion(new Quaternion()),position:o.getWorldPosition(new Vector3())});});return {root:copy,frames};}
export function retargetMotifectCrouch(source,target){
 if(source.animations.length!==1)throw Error('Expected one authoritative Motifect crouch clip');
 const input=source.animations[0];if(!Number.isFinite(input.duration)||input.duration<=0)throw Error('Invalid Motifect duration');
 const from=bindRig(source),to=bindRig(target),pairs=Object.entries(motifectPlayerMap);
 for(const [s,t] of pairs)if(!from.frames.has(s)||!to.frames.has(t))throw Error(`Missing essential mapping ${s} -> ${t}`);
 for(const [s,t] of pairs){let ancestor=from.frames.get(s).bone.parent;while(ancestor?.isBone&&!Object.hasOwn(motifectPlayerMap,ancestor.name))ancestor=ancestor.parent;const expected=ancestor?.isBone?motifectPlayerMap[ancestor.name]:null,actual=to.frames.get(t).bone.parent;if((actual?.isBone?actual.name:null)!==expected)throw Error('Incompatible mapped hierarchy '+s+' -> '+t);}
 if(!from.frames.has('Neck2'))throw Error('Expected discovered Motifect Neck2 chain');
 for(const track of input.tracks){if(!Array.from(track.times).every(Number.isFinite)||!Array.from(track.values).every(Number.isFinite))throw Error('Non-finite source track '+track.name);if(!track.name.endsWith('.quaternion')&&track.name!=='Hips.position')throw Error('Unexpected source translation/scale '+track.name);}
 const length=(rig,a,b,c)=>rig.frames.get(a).position.distanceTo(rig.frames.get(b).position)+rig.frames.get(b).position.distanceTo(rig.frames.get(c).position);
 const sourceReference=(length(from,'LeftLeg','LeftShin','LeftFoot')+length(from,'RightLeg','RightShin','RightFoot'))/2;
 const targetReference=(length(to,'mixamorigLeftUpLeg','mixamorigLeftLeg','mixamorigLeftFoot')+length(to,'mixamorigRightUpLeg','mixamorigRightLeg','mixamorigRightFoot'))/2;
 const scale=targetReference/sourceReference;if(!Number.isFinite(scale)||scale<=0)throw Error('Invalid measured translation scale');
 const times=[...new Set(input.tracks.filter(t=>pairs.some(([name])=>t.name===name+'.quaternion')||t.name==='Neck2.quaternion'||t.name==='Hips.position').flatMap(t=>Array.from(t.times)))].sort((a,b)=>a-b);
 const rotations=pairs.map(()=>[]),positions=[],desired=new Map(),q=new Quaternion(),parent=new Quaternion(),sourcePosition=new Vector3();
 const mixer=new AnimationMixer(from.root),action=mixer.clipAction(input).play();
 const sourceHip=from.frames.get('Hips'),targetHip=to.frames.get('mixamorigHips');
 // Full world-delta conversion includes the extra Neck2 when evaluating source Head.
 for(const time of times){action.time=time;mixer.update(0);from.root.updateMatrixWorld(true);desired.clear();
  for(let i=0;i<pairs.length;i++){const [s,t]=pairs[i],a=from.frames.get(s),b=to.frames.get(t);
   a.bone.getWorldQuaternion(q);q.multiply(a.rotation.clone().invert()).multiply(b.rotation).normalize();desired.set(t,q.clone());
   const p=b.bone.parent;parent.copy(desired.get(p?.name)??p.getWorldQuaternion(new Quaternion())).invert();
   q.premultiply(parent).normalize();if(!q.toArray().every(Number.isFinite))throw Error('Invalid output rotation '+t);rotations[i].push(q.x,q.y,q.z,q.w);
  }
  sourceHip.bone.getWorldPosition(sourcePosition);
  // Existing player clips use ground-based absolute hip Y. Keep scaled source pelvis motion;
  // use only measured bind-origin correction, never a hand-selected crouch height.
  const y=targetHip.position.y+(sourcePosition.y-sourceHip.position.y)*scale;
  positions.push(0,y,0);
 }
 mixer.stopAllAction();mixer.uncacheRoot(from.root);
 const tracks=pairs.map(([,t],i)=>new QuaternionKeyframeTrack(t+'.quaternion',times,rotations[i]));tracks.push(new VectorKeyframeTrack('mixamorigHips.position',times,positions));
 const clip=new AnimationClip('CrouchIdle',input.duration,tracks);if(!clip.validate()||tracks.length<20)throw Error('Invalid imported crouch');
 const ignored=[...from.frames.keys()].filter(n=>!Object.hasOwn(motifectPlayerMap,n)&&n!=='Neck2');
 return {clip,report:{source:'incoming/player-character/crouch_idle.fbx',sourceClip:input.name,duration:input.duration,sourceTracks:input.tracks.length,sourceRoot:source.name||'(unnamed FBX group)',sourceHips:'Hips',targetRoot:target.name||'(unnamed FBX group)',targetHips:'mixamorigHips',compatibility:'CASE C',caseEvidence:{sourceUpperLegRest:from.frames.get('LeftLeg').rotation.toArray(),targetUpperLegRest:to.frames.get('mixamorigLeftUpLeg').rotation.toArray(),sourceNeckChain:['Chest','Neck1','Neck2','Head'],targetNeckChain:['mixamorigSpine2','mixamorigNeck','mixamorigHead']},reference:'average upper-leg + lower-leg chain length in each file units',sourceReference,targetReference,scaleRatio:scale,mappedBones:pairs.length,collapsedBones:['Neck2 -> target Head world delta'],ignoredOptionalBones:ignored,outputClip:clip.name,outputTracks:tracks.length,horizontalLocomotionRemoved:true}};
}
