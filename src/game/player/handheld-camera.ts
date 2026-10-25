import {BoxGeometry,CylinderGeometry,Group,Mesh,MeshStandardMaterial,Matrix4,Quaternion,Vector3,type Object3D} from 'three';
import type {HandheldCameraState} from './player-runtime';
/** One small prop, no extra scene, textures or render target. Local front is -Z. */
export function createHandheldCamera(){
 const group=new Group();
 // Camera-local convention: right +X, top +Y, lens -Z, rear +Z.
 const anchor=(name:string,position:[number,number,number])=>{const o=new Group();o.name=name;o.position.fromArray(position);group.add(o);return o;};
 anchor('RightGripTarget',[.076,-.006,-.005]);anchor('LeftSupportTarget',[-.012,-.047,-.052]);anchor('EyeViewfinderTarget',[0,.04,.055]);
 const box=new BoxGeometry(1,1,1),cylinder=new CylinderGeometry(1,1,1,16);
 const body=new MeshStandardMaterial({color:'#292a29',roughness:.76}),metal=new MeshStandardMaterial({color:'#41423e',roughness:.42,metalness:.55}),glass=new MeshStandardMaterial({color:'#162d34',roughness:.18,metalness:.45});
 const block=(x:number,y:number,z:number,w:number,h:number,d:number,material=body)=>{const m=new Mesh(box,material);m.position.set(x,y,z);m.scale.set(w,h,d);group.add(m);};
 block(0,0,0,.14,.085,.055);block(.064,-.006,-.012,.026,.075,.065);block(0,.049,0,.045,.024,.035);block(-.012,-.004,.03,.082,.052,.004,glass);
 for(const [z,r,d]of [[-.043,.034,.03],[-.064,.03,.022],[-.079,.026,.01]] as const){const m=new Mesh(cylinder,metal);m.rotation.x=Math.PI/2;m.scale.set(r,d,r);m.position.set(-.012,0,z);group.add(m);}
 const lens=new Mesh(cylinder,glass);lens.rotation.x=Math.PI/2;lens.scale.set(.023,.002,.023);lens.position.set(-.012,0,-.085);group.add(lens);
 block(.047,.046,-.005,.018,.009,.016,metal);block(.054,-.007,.031,.012,.018,.005,metal);
 group.traverse(o=>{o.castShadow=true;});group.visible=false;
 return {group,dispose(){box.dispose();cylinder.dispose();body.dispose();metal.dispose();glass.dispose();}};
}
const smooth=(n:number)=>{n=Math.max(0,Math.min(1,n));return n*n*(3-2*n);};
/** Two-link arm IK from the live skeleton. Restore rotations before each mixer update. */
export function createCameraPose(model:Object3D,prop:Group){
 const find=(n:string)=>model.getObjectByName('mixamorig'+n),head=find('Head'),hips=find('Hips');
 const sides=['Right','Left'].map(side=>({side,arm:find(side+'Arm'),fore:find(side+'ForeArm'),hand:find(side+'Hand'),finger:find(side+'HandIndex1'),thumb:find(side+'HandThumb1')}));
 const entries=sides.flatMap(s=>[s.arm,s.fore,s.hand].filter((b):b is Object3D=>!!b)).map(b=>({b,q:b.quaternion.clone()}));
 const a=new Vector3(),b=new Vector3(),c=new Vector3(),right=new Vector3(),up=new Vector3(),forward=new Vector3(),centre=new Vector3(),target=new Vector3(),elbow=new Vector3(),direction=new Vector3(),bend=new Vector3(),temp=new Vector3();
 const q=new Quaternion(),parent=new Quaternion(),delta=new Quaternion(),orientation=new Quaternion(),basis=new Matrix4(),back=new Vector3(),fingerAxis=new Vector3(),thumbAxis=new Vector3(),normal=new Vector3();
 // Calibrate full hand frames from actual index/thumb landmarks, including palm offset.
 const grips=sides.map(s=>{const index=s.finger?.position.clone()??new Vector3(0,.06,0),thumb=s.thumb?.position.clone()??new Vector3(.03,.03,0);fingerAxis.copy(index).normalize();thumbAxis.copy(thumb).addScaledVector(fingerAxis,-thumb.dot(fingerAxis)).normalize();normal.crossVectors(thumbAxis,fingerAxis).normalize();const inverse=new Quaternion().setFromRotationMatrix(basis.makeBasis(thumbAxis,fingerAxis,normal)).invert();
  const fingers=s.side==='Right'?new Vector3(0,1,-.12).normalize():new Vector3(1,.1,0).normalize(),across=new Vector3(0,0,1);across.addScaledVector(fingers,-across.dot(fingers)).normalize();normal.crossVectors(across,fingers).normalize();
  const frame=new Quaternion().setFromRotationMatrix(basis.makeBasis(across,fingers,normal)).multiply(inverse),node=prop.getObjectByName(s.side==='Right'?'RightGripTarget':'LeftSupportTarget')!;node.quaternion.copy(frame);return {node,palm:index.multiplyScalar(.55)};});let applied=false;
 const aim=(bone:Object3D,child:Object3D,goal:Vector3,weight:number)=>{bone.getWorldPosition(a);child.getWorldPosition(b);b.sub(a).normalize();c.subVectors(goal,a).normalize();delta.setFromUnitVectors(b,c);bone.getWorldQuaternion(q);bone.parent!.getWorldQuaternion(parent).invert();q.premultiply(delta).premultiply(parent);bone.quaternion.slerp(q,weight);bone.updateWorldMatrix(true,true);};
 return {restore(){if(applied)for(const e of entries)e.b.quaternion.copy(e.q);applied=false;},apply(state:HandheldCameraState,dt:number,blocked=false){
  state.hold=Math.max(0,Math.min(1,state.hold+(state.wanted?dt/.8:-dt/.45)));state.elapsed=state.wanted?state.elapsed+dt:0;
  prop.visible=state.hold>0&&(!state.wanted||state.elapsed>.3);
  if(blocked||!head||!hips||sides.some(s=>!s.arm||!s.fore||!s.hand)||state.hold<=0){prop.visible=false;return;}
  for(const e of entries)e.q.copy(e.b.quaternion);applied=true;model.updateWorldMatrix(true,true);
  // The inspected GLB root has a 180-degree yaw; use its outer character-facing frame.
  model.parent!.getWorldQuaternion(orientation);right.set(1,0,0).applyQuaternion(orientation);up.set(0,1,0).applyQuaternion(orientation);forward.crossVectors(up,right).normalize();back.copy(forward).negate();orientation.setFromRotationMatrix(basis.makeBasis(right,up,back));
  hips.getWorldPosition(centre);head.getWorldPosition(temp);const torso=centre.distanceTo(temp),raise=smooth(state.view),carry=smooth(state.hold);
  // Chest-ready -> forward/up arc -> small inward finish. Lower follows the same path.
  centre.addScaledVector(up,torso*(.22+.38*carry)).addScaledVector(forward,.12+.10*carry).addScaledVector(right,.17*(1-carry));
  const pitch=state.view>0?(state.view*(state.view)*(3-2*state.view)):0;
  q.setFromAxisAngle(right,-(state.pitch??0)*pitch);orientation.premultiply(q);
  // Align the prop's rear viewfinder landmark just in front of the actual head.
  head.getWorldPosition(temp);temp.addScaledVector(up,.06).addScaledVector(forward,.1);target.copy(prop.getObjectByName('EyeViewfinderTarget')!.position).applyQuaternion(orientation);temp.sub(target);
  centre.lerp(temp,raise).addScaledVector(forward,.055*Math.sin(Math.PI*raise));
  prop.position.copy(centre);model.worldToLocal(prop.position);model.getWorldQuaternion(parent).invert();prop.quaternion.copy(parent).multiply(orientation);prop.scale.setScalar(1/model.getWorldScale(temp).x);prop.updateWorldMatrix(true,true);
  // Project the shared prop into both arms' reach, rather than clamping wrists away
  // from the camera. Small bounded passes also handle live walk/run shoulder motion.
  for(let pass=0;pass<3;pass++)for(const [i,s] of sides.entries()){
   const grip=grips[i];grip.node.getWorldPosition(target);grip.node.getWorldQuaternion(orientation);const scale=s.hand!.getWorldScale(temp).x;temp.copy(grip.palm).multiplyScalar(scale).applyQuaternion(orientation);target.sub(temp);
   s.arm!.getWorldPosition(a);s.fore!.getWorldPosition(b);s.hand!.getWorldPosition(c);const reach=(a.distanceTo(b)+b.distanceTo(c))*.96,distance=a.distanceTo(target);
   if(distance>reach){temp.subVectors(a,target).multiplyScalar(1-reach/distance);centre.add(temp);prop.position.copy(centre);model.worldToLocal(prop.position);prop.updateWorldMatrix(true,true);}
  }
  for(const [i,s] of sides.entries()){const arm=s.arm!,fore=s.fore!,hand=s.hand!,sign=s.side==='Right'?1:-1;
   const grip=grips[i];grip.node.getWorldPosition(target);grip.node.getWorldQuaternion(orientation);const palmScale=hand.getWorldScale(temp).x;temp.copy(grip.palm).multiplyScalar(palmScale).applyQuaternion(orientation);target.sub(temp);
   arm.getWorldPosition(a);fore.getWorldPosition(b);hand.getWorldPosition(c);const upper=a.distanceTo(b),lower=b.distanceTo(c);direction.subVectors(target,a);const distance=Math.max(Math.abs(upper-lower)+.001,Math.min((upper+lower)*.97,direction.length()));direction.normalize();target.copy(a).addScaledVector(direction,distance);
   bend.copy(right).multiplyScalar(sign*(.85-.2*raise)).addScaledVector(up,-1).addScaledVector(forward,-.35);bend.addScaledVector(direction,-bend.dot(direction)).normalize();const along=(upper*upper-lower*lower+distance*distance)/(2*distance);elbow.copy(a).addScaledVector(direction,along).addScaledVector(bend,Math.sqrt(Math.max(0,upper*upper-along*along)));
   const weight=smooth(state.hold/.35);aim(arm,fore,elbow,weight);aim(fore,hand,target,weight);
   hand.parent!.getWorldQuaternion(parent).invert();q.copy(parent).multiply(orientation);hand.quaternion.slerp(q,weight);hand.updateWorldMatrix(true,true);
  }
 }};
}
