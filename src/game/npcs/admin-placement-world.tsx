import {useEffect,useMemo,useRef,type RefObject} from 'react';
import {useFrame,useThree} from '@react-three/fiber';
import {useRapier} from '@react-three/rapier';
import {Box3,Raycaster,Vector2,Vector3,type Mesh} from 'three';
import {npcAdmin} from './admin-placement';
import {npcDefinitions} from './definitions';
import {isEditableTarget} from '../input/player-input';
import type {PlayerRuntime} from '../player/player-runtime';
/** Development-only selection uses analytical boxes and physics queries, never visual mesh raycasts. */
export function NpcAdminPlacement({player}:{player:RefObject<PlayerRuntime>}){
 const {camera,gl}=useThree(),{world,rapier}=useRapier(),ring=useRef<Mesh>(null);
 const scratch=useMemo(()=>({ray:new Raycaster(),ndc:new Vector2(),box:new Box3(),point:new Vector3()}),[]);
 useFrame(()=>{if(!ring.current)return;const s=npcAdmin?.store.getState(),a=npcAdmin?.bridge?.agents.find(a=>a.id===s?.selected);if(s?.placement)npcAdmin?.publish();ring.current.visible=!!s?.placement&&!!a&&(player.current.handheldCamera?.view??0)===0;if(a)ring.current.position.set(a.position.x,a.position.y+.025,a.position.z);});
 useEffect(()=>{const admin=npcAdmin;if(!admin)return;const canvas=gl.domElement;let dragging=false;
  const available=()=>admin.store.getState().placement&&(player.current.handheldCamera?.view??0)===0&&!document.querySelector('dialog[open]');
  const rayAt=(e:PointerEvent)=>{const r=canvas.getBoundingClientRect();scratch.ndc.set((e.clientX-r.left)/r.width*2-1,1-(e.clientY-r.top)/r.height*2);camera.updateWorldMatrix(true,false);scratch.ray.setFromCamera(scratch.ndc,camera);return scratch.ray.ray;};
  const fixed=(c:import('@dimforge/rapier3d-compat').Collider)=>!c.parent()||c.parent()!.isFixed();
  const surface=(ray:import('three').Ray)=>world.castRayAndGetNormal(new rapier.Ray(ray.origin,ray.direction),250,true,rapier.QueryFilterFlags.EXCLUDE_SENSORS,undefined,undefined,undefined,fixed);
  const down=(e:PointerEvent)=>{if(e.button!==0||!available())return;e.preventDefault();e.stopImmediatePropagation();const ray=rayAt(e),obstacle=surface(ray);let best=obstacle?.timeOfImpact??250,id:string|null=null;
   for(const a of admin.bridge?.agents??[]){const h=npcDefinitions[a.character].height;scratch.box.min.set(a.position.x-.4,a.position.y-.15,a.position.z-.4);scratch.box.max.set(a.position.x+.4,a.position.y+h,a.position.z+.4);const hit=ray.intersectBox(scratch.box,scratch.point);if(hit){const distance=ray.origin.distanceTo(hit);if(distance<best){best=distance;id=a.id;}}}
   admin.select(id);dragging=!!id;if(dragging)canvas.setPointerCapture(e.pointerId);
  };
  const move=(e:PointerEvent)=>{if(!dragging||!available())return;const id=admin.store.getState().selected,a=admin.bridge?.agents.find(a=>a.id===id);if(!a)return;e.preventDefault();e.stopImmediatePropagation();const ray=rayAt(e),hit=surface(ray);if(!hit||hit.normal.y<.7)return;scratch.point.copy(ray.direction).multiplyScalar(hit.timeOfImpact).add(ray.origin);admin.move(a.id,{position:[scratch.point.x,scratch.point.y,scratch.point.z],rotationY:a.yaw});};
  const up=()=>{dragging=false;};
  const key=(e:KeyboardEvent)=>{if(!available()||isEditableTarget(e.target)||e.ctrlKey||e.metaKey||e.altKey)return;const id=admin.store.getState().selected,a=admin.bridge?.agents.find(a=>a.id===id);if(!a)return;if(!['KeyQ','KeyE','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code))return;e.preventDefault();e.stopImmediatePropagation();let x=a.position.x,z=a.position.z,yaw=a.yaw;
   if(e.code==='KeyQ'||e.code==='KeyE')yaw+=(e.code==='KeyQ'?1:-1)*(e.shiftKey?15:5)*Math.PI/180;
   else{const step=e.shiftKey ? .5 : .1;camera.getWorldDirection(scratch.point);scratch.point.y=0;scratch.point.normalize();if(e.code==='ArrowDown')scratch.point.negate();if(e.code==='ArrowLeft')scratch.point.set(scratch.point.z,0,-scratch.point.x);if(e.code==='ArrowRight')scratch.point.set(-scratch.point.z,0,scratch.point.x);x+=scratch.point.x*step;z+=scratch.point.z*step;}
   admin.move(a.id,{position:[x,a.position.y,z],rotationY:yaw});
  };
  canvas.addEventListener('pointerdown',down,true);canvas.addEventListener('pointermove',move,true);canvas.addEventListener('pointerup',up);canvas.addEventListener('pointercancel',up);document.addEventListener('keydown',key,true);
  return()=>{canvas.removeEventListener('pointerdown',down,true);canvas.removeEventListener('pointermove',move,true);canvas.removeEventListener('pointerup',up);canvas.removeEventListener('pointercancel',up);document.removeEventListener('keydown',key,true);};
 },[camera,gl,world,rapier,player,scratch]);
 return <mesh ref={ring} visible={false} rotation={[-Math.PI/2,0,0]} userData={{photographyFocus:false}} name="npc-admin-selection-helper"><ringGeometry args={[.38,.42,32]}/><meshBasicMaterial color="#e8b86e" transparent opacity={.65} depthWrite={false}/></mesh>;
}
