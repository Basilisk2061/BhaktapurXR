import {BoxGeometry,CylinderGeometry,Group,Mesh,MeshStandardMaterial,Quaternion,Vector3,type Object3D} from 'three';
import type {HandheldCameraState} from './player-runtime';
/** One small prop, no extra scene, textures or render target. Local front is -Z. */
export function createHandheldCamera(){
 const group=new Group(),box=new BoxGeometry(1,1,1),cylinder=new CylinderGeometry(1,1,1,16);
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
 const sides=['Right','Left'].map(side=>({side,arm:find(side+'Arm'),fore:find(side+'ForeArm'),hand:find(side+'Hand'),finger:find(side+'HandMiddle1')}));
 const entries=sides.flatMap(s=>[s.arm,s.fore,s.hand].filter((b):b is Object3D=>!!b)).map(b=>({b,q:b.quaternion.clone()}));
 const a=new Vector3(),b=new Vector3(),c=new Vector3(),right=new Vector3(),up=new Vector3(),forward=new Vector3(),centre=new Vector3(),target=new Vector3(),elbow=new Vector3(),direction=new Vector3(),bend=new Vector3(),temp=new Vector3();
 const q=new Quaternion(),parent=new Quaternion(),delta=new Quaternion(),orientation=new Quaternion();let applied=false;
 const aim=(bone:Object3D,child:Object3D,goal:Vector3,weight:number)=>{bone.getWorldPosition(a);child.getWorldPosition(b);b.sub(a).normalize();c.subVectors(goal,a).normalize();delta.setFromUnitVectors(b,c);bone.getWorldQuaternion(q);bone.parent!.getWorldQuaternion(parent).invert();q.premultiply(delta).premultiply(parent);bone.quaternion.slerp(q,weight);bone.updateWorldMatrix(true,true);};
 return {restore(){if(applied)for(const e of entries)e.b.quaternion.copy(e.q);applied=false;},apply(state:HandheldCameraState,dt:number,blocked=false){
  state.hold=Math.max(0,Math.min(1,state.hold+(state.wanted?dt/.8:-dt/.45)));state.elapsed=state.wanted?state.elapsed+dt:0;
  prop.visible=state.hold>0&&(!state.wanted||state.elapsed>.3);
  if(blocked||!head||!hips||sides.some(s=>!s.arm||!s.fore||!s.hand)||state.hold<=0){prop.visible=false;return;}
  for(const e of entries)e.q.copy(e.b.quaternion);applied=true;model.updateWorldMatrix(true,true);
  const R=sides[0],L=sides[1];R.arm!.getWorldPosition(right);L.arm!.getWorldPosition(temp);right.sub(temp).normalize();head.getWorldPosition(up);hips.getWorldPosition(centre);up.sub(centre).normalize();forward.crossVectors(up,right).normalize();
  head.getWorldPosition(temp);const torso=centre.distanceTo(temp),raise=smooth(state.view),carry=smooth(state.hold);
  // Pocket -> lower chest -> eye. The two grip targets travel with this same prop frame.
  centre.addScaledVector(up,torso*(.23+.43*carry+.22*raise)).addScaledVector(forward,.12+.13*carry-.08*raise).addScaledVector(right,.17*(1-carry));
  model.getWorldQuaternion(orientation);prop.position.copy(centre);model.worldToLocal(prop.position);model.getWorldQuaternion(parent).invert();prop.quaternion.copy(parent).multiply(orientation);prop.scale.setScalar(1/model.getWorldScale(temp).x);prop.updateWorldMatrix(true,true);
  for(const s of sides){const arm=s.arm!,fore=s.fore!,hand=s.hand!,sign=s.side==='Right'?1:-1;
   target.copy(centre).addScaledVector(right,sign>0?.068:-.045).addScaledVector(forward,sign>0?-.005:.055).addScaledVector(up,-.018);
   arm.getWorldPosition(a);fore.getWorldPosition(b);hand.getWorldPosition(c);const upper=a.distanceTo(b),lower=b.distanceTo(c);direction.subVectors(target,a);const distance=Math.max(Math.abs(upper-lower)+.001,Math.min((upper+lower)*.97,direction.length()));direction.normalize();target.copy(a).addScaledVector(direction,distance);
   bend.copy(right).multiplyScalar(sign*.7).addScaledVector(up,-1).addScaledVector(forward,-.2);bend.addScaledVector(direction,-bend.dot(direction)).normalize();const along=(upper*upper-lower*lower+distance*distance)/(2*distance);elbow.copy(a).addScaledVector(direction,along).addScaledVector(bend,Math.sqrt(Math.max(0,upper*upper-along*along)));
   const weight=smooth(state.hold/.35);aim(arm,fore,elbow,weight);aim(fore,hand,target,weight);
   if(s.finger){temp.copy(target).addScaledVector(forward,.06).addScaledVector(up,sign>0?-.03:0);aim(hand,s.finger,temp,weight);}
  }
 }};
}
