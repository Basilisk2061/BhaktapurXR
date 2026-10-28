import {AnimationClip,AnimationMixer,Quaternion,QuaternionKeyframeTrack,Vector3,VectorKeyframeTrack} from 'three';
import {clone} from 'three/addons/utils/SkeletonUtils.js';
// Discovered Meshy body mapping; no optional finger or end-bone motion required.
export const playerMap=Object.fromEntries(['Hips','Spine','Spine1','Spine2','Neck','Head','LeftShoulder','LeftArm','LeftForeArm','LeftHand','RightShoulder','RightArm','RightForeArm','RightHand','LeftUpLeg','LeftLeg','LeftFoot','RightUpLeg','RightLeg','RightFoot','LeftToeBase','RightToeBase'].map(n=>['smartrig'+n,'mixamorig'+n]));
export function bindRig(root){const copy=clone(root);copy.traverse(o=>{if(o.isBone&&!o.parent.isBone){o.parent.position.set(0,0,0);o.parent.quaternion.identity();o.parent.scale.set(1,1,1);}});copy.updateMatrixWorld(true);copy.traverse(o=>{if(o.isSkinnedMesh)o.skeleton.pose();});copy.updateMatrixWorld(true);const frames=new Map();copy.traverse(o=>{if(o.isBone)frames.set(o.name,{bone:o,rotation:o.getWorldQuaternion(new Quaternion()),position:o.getWorldPosition(new Vector3())});});return {root:copy,frames};}
export function retargetPlayerCrouch(source,target,reference,options={}){
 if(source.animations.length!==1)throw Error('Expected one authoritative Meshy crouch clip');
 for(const rig of [source,reference]){let hasBind=false;rig.traverse(o=>{if(o.isSkinnedMesh&&o.skeleton.boneInverses.length===o.skeleton.bones.length)hasBind=true;});if(!hasBind)throw Error('Meshy skin bind matrices required');}
 const input=source.animations[0];if(!Number.isFinite(input.duration)||input.duration<=0)throw Error('Invalid Meshy duration');
 const from=bindRig(source),to=bindRig(target),ref=bindRig(reference),pairs=Object.entries(playerMap);
 if(from.frames.size!==ref.frames.size)throw Error('Meshy reference bone count differs');
 for(const [name,a] of from.frames){const b=ref.frames.get(name);if(!b||a.bone.parent.name!==b.bone.parent.name||a.bone.position.distanceTo(b.bone.position)>1e-4||a.bone.quaternion.clone().normalize().angleTo(b.bone.quaternion.clone().normalize())>1e-4)throw Error('Meshy reference bind mismatch: '+name);}
 const animated=clone(source);animated.updateMatrixWorld(true);
 const animatedBones=new Map();animated.traverse(o=>{if(o.isBone)animatedBones.set(o.name,o);});
 for(const [s,t] of pairs)if(!from.frames.has(s)||!to.frames.has(t))throw Error(`Missing essential mapping ${s} -> ${t}`);
 for(const [s,t] of pairs){let ancestor=from.frames.get(s).bone.parent;while(ancestor?.isBone&&!Object.hasOwn(playerMap,ancestor.name))ancestor=ancestor.parent;const expected=ancestor?.isBone?playerMap[ancestor.name]:null,actual=to.frames.get(t).bone.parent;if((actual?.isBone?actual.name:null)!==expected)throw Error('Incompatible mapped hierarchy '+s+' -> '+t);}

 for(const track of input.tracks){if(!Array.from(track.times).every(Number.isFinite)||!Array.from(track.values).every(Number.isFinite))throw Error('Non-finite source track '+track.name);if(!/\.(position|quaternion|scale)$/.test(track.name))throw Error('Unexpected source track '+track.name);}
 const length=(rig,a,b,c)=>rig.frames.get(a).position.distanceTo(rig.frames.get(b).position)+rig.frames.get(b).position.distanceTo(rig.frames.get(c).position);
 const sourceReference=(length(from,'smartrigLeftUpLeg','smartrigLeftLeg','smartrigLeftFoot')+length(from,'smartrigRightUpLeg','smartrigRightLeg','smartrigRightFoot'))/2;
 const targetReference=(length(to,'mixamorigLeftUpLeg','mixamorigLeftLeg','mixamorigLeftFoot')+length(to,'mixamorigRightUpLeg','mixamorigRightLeg','mixamorigRightFoot'))/2;
 const scale=targetReference/sourceReference;if(!Number.isFinite(scale)||scale<=0)throw Error('Invalid measured translation scale');
 const start=options.start??0,end=options.end??input.duration;
 if(start<0||end>input.duration||end<=start)throw Error('Invalid source cycle range');
 const times=[...new Set([start,end,...input.tracks.flatMap(t=>Array.from(t.times)).filter(t=>t>=start&&t<=end)])].sort((a,b)=>a-b);
 const rotations=pairs.map(()=>[]),positions=[],desired=new Map(),q=new Quaternion(),parent=new Quaternion(),sourcePosition=new Vector3();
 const mixer=new AnimationMixer(animated),action=mixer.clipAction(input).play();
 const targetHip=to.frames.get('mixamorigHips');
 const sampleHip=time=>{action.time=time;mixer.update(0);animated.updateMatrixWorld(true);return animatedBones.get('smartrigHips').getWorldPosition(new Vector3());};
 const travelStart=sampleHip(start),travelEnd=sampleHip(end),travel=travelEnd.clone().sub(travelStart);travel.y=0;
 const fullStart=sampleHip(0),fullEnd=sampleHip(input.duration),fullTravel=fullEnd.clone().sub(fullStart);fullTravel.y=0;
 // Transfer source motion relative to authoritative skin bind matrices, not frame zero.
 for(const time of times){action.time=time;mixer.update(0);animated.updateMatrixWorld(true);desired.clear();
  for(let i=0;i<pairs.length;i++){const [s,t]=pairs[i],a=from.frames.get(s),b=to.frames.get(t);
   animatedBones.get(s).getWorldQuaternion(q);q.multiply(a.rotation.clone().invert()).multiply(b.rotation).normalize();desired.set(t,q.clone());
   const p=b.bone.parent;parent.copy(desired.get(p?.name)??p.getWorldQuaternion(new Quaternion())).invert();
   q.premultiply(parent).normalize();if(!q.toArray().every(Number.isFinite))throw Error('Invalid output rotation '+t);rotations[i].push(q.x,q.y,q.z,q.w);
  }
  animatedBones.get('smartrigHips').getWorldPosition(sourcePosition);
  // Existing player clips use ground-based absolute hip Y. Keep scaled source pelvis motion;
  // use only measured bind-origin correction, never a hand-selected crouch height.
  const y=targetHip.position.y+sourcePosition.y*scale;
  if(!Number.isFinite(y))throw Error('Invalid pelvis output');
  // Walk only: remove endpoint-to-endpoint accumulated travel, retaining cyclic residuals.
  const fraction=(time-start)/(end-start);
  positions.push(options.inPlace?(sourcePosition.x-travelStart.x-travel.x*fraction)*scale:0,y,options.inPlace?(sourcePosition.z-travelStart.z-travel.z*fraction)*scale:0);
 }
 mixer.stopAllAction();mixer.uncacheRoot(animated);
 const outputTimes=options.inPlace?times.map(t=>t-start):times;
 const tracks=pairs.map(([,t],i)=>new QuaternionKeyframeTrack(t+'.quaternion',outputTimes,rotations[i]));tracks.push(new VectorKeyframeTrack('mixamorigHips.position',outputTimes,positions));
 const clip=new AnimationClip(options.name??'CrouchIdle',options.inPlace?tracks[0].times.at(-1):input.duration,tracks);if(!clip.validate()||tracks.length<20)throw Error('Invalid imported crouch');
 const ignored=[...from.frames.keys()].filter(n=>!Object.hasOwn(playerMap,n));
 return {clip,report:{provider:'Meshy',source:options.source??'incoming/player-character/crouch_idle_meshy_mixamo.fbx',referenceSource:options.reference??'incoming/player-character/meshy_mixamo_character_reference.fbx',referenceMatches:true,sourceClip:input.name,duration:input.duration,sourceTracks:input.tracks.length,sourceFPS:30,sourceRoot:'SmartRigArmature',sourceHips:'smartrigHips',sourceBoneCount:from.frames.size,sourceSkeleton:'smartrig (Mixamo-template export)',targetRoot:target.name||'(unnamed FBX group)',targetHips:'mixamorigHips',compatibility:'CASE C',mappingMethod:'rest-relative world quaternion transfer',restBindSource:'animation skin inverse-bind matrices; normalized armature; cross-checked reference local bind transforms',reference:'average upper-leg + lower-leg bind chain in exported world units',sourceReference,targetReference,scaleRatio:scale,mappedBones:pairs.length,boneMapping:playerMap,ignoredOptionalBones:ignored,translationPolicy:options.inPlace?'target limb rest translations; source world Y preserved/scaled; horizontal linear trend removed, cyclic residuals preserved':'target limb rest translations; source ground-based world pelvis Y scaled to target units plus target bind origin; X/Z zero',outputClip:clip.name,outputTracks:tracks.length,horizontalLocomotionRemoved:true,...(options.inPlace?{rootMotion:{sourceWorldUnits:'exported centimetres',storedIn:'smartrigHips.position; armature stationary',strategy:'remove linear X/Z travel trend over selected coherent gait cycle; retain cyclic residuals and Y',sourceForwardAxis:'+Z with small +X drift',fullStart:fullStart.toArray(),fullEnd:fullEnd.toArray(),fullDistance:fullTravel.length(),fullTargetDistance:fullTravel.length()*scale,fullTargetSpeed:fullTravel.length()*scale/input.duration,cycleStart:start,cycleEnd:end,cycleDuration:end-start,cycleStartPosition:travelStart.toArray(),cycleEndPosition:travelEnd.toArray(),cycleDistance:travel.length(),cycleTargetDistance:travel.length()*scale,cycleTargetSpeed:travel.length()*scale/(end-start),remainingHorizontalDisplacement:Math.hypot(positions.at(-3)-positions[0],positions.at(-1)-positions[2]),loopNote:'Trim five leading and four trailing source frames; preserve all retained rotations. Small residual seam remains.'},outputDuration:clip.duration}: {})}};
}





