import {useEffect,useMemo,useRef,type RefObject} from 'react';
import {useFrame,useThree} from '@react-three/fiber';
import {useRapier} from '@react-three/rapier';
import {Box3,DoubleSide,Plane,Raycaster,Vector2,Vector3,type Group,type Mesh,type Ray} from 'three';
import {npcAdmin} from './admin-placement';
import {npcDefinitions} from './definitions';
import {isEditableTarget} from '../input/player-input';
import type {PlayerRuntime} from '../player/player-runtime';
/** Development-only analytical picking. No visual model raycasts or scene traversal. */
export function NpcAdminPlacement({player}:{player:RefObject<PlayerRuntime>}){
 const {camera,gl}=useThree(),{world,rapier}=useRapier(),helper=useRef<Group>(null),rotationRing=useRef<Mesh>(null);
 const scratch=useMemo(()=>({ray:new Raycaster(),ndc:new Vector2(),box:new Box3(),point:new Vector3(),plane:new Plane(new Vector3(0,1,0),0)}),[]);
 useFrame(()=>{if(!helper.current)return;const s=npcAdmin?.store.getState(),a=npcAdmin?.bridge?.agents.find(a=>a.id===s?.selected);if(s?.placement)npcAdmin?.publish();helper.current.visible=!!s?.placement&&!!a&&(player.current.handheldCamera?.view??0)===0;if(a){helper.current.position.set(a.position.x,a.position.y+.025,a.position.z);helper.current.rotation.y=a.yaw;}if(rotationRing.current)rotationRing.current.visible=s?.tool==='ROTATE';});
 useEffect(()=>{const admin=npcAdmin;if(!admin)return;const canvas=gl.domElement;let dragging:'MOVE'|'ROTATE'|null=null,pointer:number|null=null,lastAngle=0,rotation=0,previousCursor=canvas.style.cursor;
  const available=()=>admin.store.getState().placement&&(player.current.handheldCamera?.view??0)===0&&!document.querySelector('dialog[open]');
  const rayAt=(e:PointerEvent)=>{const r=canvas.getBoundingClientRect();scratch.ndc.set((e.clientX-r.left)/r.width*2-1,1-(e.clientY-r.top)/r.height*2);camera.updateWorldMatrix(true,false);scratch.ray.setFromCamera(scratch.ndc,camera);return scratch.ray.ray;};
  const fixed=(c:import('@dimforge/rapier3d-compat').Collider)=>!c.parent()||c.parent()!.isFixed();
  const surface=(ray:Ray)=>world.castRayAndGetNormal(new rapier.Ray(ray.origin,ray.direction),250,true,rapier.QueryFilterFlags.EXCLUDE_SENSORS,undefined,undefined,undefined,fixed);
  const selected=()=>{const id=admin.store.getState().selected;return admin.bridge?.agents.find(a=>a.id===id);};
  const planeAngle=(ray:Ray,a:NonNullable<ReturnType<typeof selected>>)=>{scratch.plane.constant=-(a.position.y+.035);if(!ray.intersectPlane(scratch.plane,scratch.point))return null;return Math.atan2(scratch.point.x-a.position.x,scratch.point.z-a.position.z);};
  const overRing=(ray:Ray,a:NonNullable<ReturnType<typeof selected>>,limit:number)=>{if(admin.store.getState().tool!=='ROTATE'||planeAngle(ray,a)===null)return false;const radius=Math.hypot(scratch.point.x-a.position.x,scratch.point.z-a.position.z);return radius>=.67&&radius<=.97&&ray.origin.distanceTo(scratch.point)<=limit+.05;};
  const pick=(ray:Ray,limit:number)=>{let best=limit,id:string|null=null;for(const a of admin.bridge?.agents??[]){const h=npcDefinitions[a.character].height;scratch.box.min.set(a.position.x-.4,a.position.y-.15,a.position.z-.4);scratch.box.max.set(a.position.x+.4,a.position.y+h,a.position.z+.4);if(ray.intersectBox(scratch.box,scratch.point)){const distance=ray.origin.distanceTo(scratch.point);if(distance<best){best=distance;id=a.id;}}}return id;};
  const finish=()=>{dragging=null;if(pointer!==null&&canvas.hasPointerCapture(pointer))canvas.releasePointerCapture(pointer);pointer=null;canvas.style.cursor=available()?'crosshair':previousCursor;};
  const unsubscribe=admin.store.subscribe((s,previous)=>{if(s.placement!==previous.placement){if(s.placement){previousCursor=canvas.style.cursor;canvas.style.cursor='crosshair';}else finish();}if(s.tool!==previous.tool||s.selected!==previous.selected)finish();});
  const down=(e:PointerEvent)=>{if(e.button!==0||!available())return;e.preventDefault();e.stopImmediatePropagation();const ray=rayAt(e),limit=surface(ray)?.timeOfImpact??250,a=selected();
   if(a&&overRing(ray,a,limit)){lastAngle=planeAngle(ray,a)!;rotation=a.yaw;dragging='ROTATE';}
   else{const id=pick(ray,limit);admin.select(id);dragging=id&&admin.store.getState().tool==='MOVE'?'MOVE':null;}
   if(dragging){pointer=e.pointerId;canvas.setPointerCapture(e.pointerId);canvas.style.cursor='grabbing';}
  };
  const move=(e:PointerEvent)=>{if(!available()){if(dragging)finish();return;}const ray=rayAt(e),a=selected();
   if(!dragging){const limit=surface(ray)?.timeOfImpact??250;canvas.style.cursor=a&&overRing(ray,a,limit)?'grab':pick(ray,limit)?'pointer':'crosshair';return;}
   if(!a||pointer!==e.pointerId)return;e.preventDefault();e.stopImmediatePropagation();
   if(dragging==='ROTATE'){const angle=planeAngle(ray,a);if(angle===null)return;rotation+=Math.atan2(Math.sin(angle-lastAngle),Math.cos(angle-lastAngle));lastAngle=angle;const step=15*Math.PI/180,yaw=e.shiftKey?Math.round(rotation/step)*step:rotation;admin.move(a.id,{position:[a.position.x,a.position.y,a.position.z],rotationY:yaw});return;}
   const hit=surface(ray);if(!hit||hit.normal.y<.7)return;scratch.point.copy(ray.direction).multiplyScalar(hit.timeOfImpact).add(ray.origin);admin.move(a.id,{position:[scratch.point.x,scratch.point.y,scratch.point.z],rotationY:a.yaw});
  };
  const up=(e:PointerEvent)=>{if(dragging){e.preventDefault();e.stopImmediatePropagation();finish();}};
  const key=(e:KeyboardEvent)=>{if(!available()||isEditableTarget(e.target)||e.ctrlKey||e.metaKey||e.altKey)return;
   if(e.code==='KeyW'||e.code==='KeyR'){e.preventDefault();e.stopImmediatePropagation();admin.store.setState({tool:e.code==='KeyW'?'MOVE':'ROTATE'});return;}
   const a=selected();if(!a||!['KeyQ','KeyE','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code))return;e.preventDefault();e.stopImmediatePropagation();let x=a.position.x,z=a.position.z,yaw=a.yaw;
   if(e.code==='KeyQ'||e.code==='KeyE')yaw+=(e.code==='KeyQ'?1:-1)*(e.shiftKey?15:5)*Math.PI/180;
   else{const step=e.shiftKey ? .5 : .1;camera.getWorldDirection(scratch.point);scratch.point.y=0;scratch.point.normalize();if(e.code==='ArrowDown')scratch.point.negate();if(e.code==='ArrowLeft')scratch.point.set(scratch.point.z,0,-scratch.point.x);if(e.code==='ArrowRight')scratch.point.set(-scratch.point.z,0,scratch.point.x);x+=scratch.point.x*step;z+=scratch.point.z*step;}
   admin.move(a.id,{position:[x,a.position.y,z],rotationY:yaw});
  };
  canvas.addEventListener('pointerdown',down,true);canvas.addEventListener('pointermove',move,true);canvas.addEventListener('pointerup',up,true);canvas.addEventListener('pointercancel',up,true);document.addEventListener('keydown',key,true);
  return()=>{unsubscribe();finish();canvas.style.cursor=previousCursor;canvas.removeEventListener('pointerdown',down,true);canvas.removeEventListener('pointermove',move,true);canvas.removeEventListener('pointerup',up,true);canvas.removeEventListener('pointercancel',up,true);document.removeEventListener('keydown',key,true);};
 },[camera,gl,world,rapier,player,scratch]);
 return <group ref={helper} visible={false} userData={{photographyFocus:false}} name="npc-admin-selection-helper">
  <mesh rotation={[-Math.PI/2,0,0]}><ringGeometry args={[.38,.42,32]}/><meshBasicMaterial color="#e8b86e" transparent opacity={.8} depthWrite={false} side={DoubleSide}/></mesh>
  <mesh ref={rotationRing} rotation={[-Math.PI/2,0,0]} position={[0,.01,0]}><ringGeometry args={[.78,.85,48]}/><meshBasicMaterial color="#72d4b2" transparent opacity={.85} depthWrite={false} side={DoubleSide}/></mesh>
  <mesh position={[0,.015,-.48]}><boxGeometry args={[.035,.025,.38]}/><meshBasicMaterial color="#e8b86e" depthWrite={false}/></mesh>
  <mesh position={[0,.015,-.76]} rotation={[-Math.PI/2,0,0]}><coneGeometry args={[.09,.22,3]}/><meshBasicMaterial color="#e8b86e" depthWrite={false}/></mesh>
 </group>;
}
