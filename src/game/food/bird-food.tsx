import {useEffect,useMemo,useRef,type RefObject} from 'react';
import {useFrame} from '@react-three/fiber';
import {useRapier} from '@react-three/rapier';
import {BoxGeometry,InstancedMesh,MeshStandardMaterial,Object3D,Vector3} from 'three';
import type {PlayerInput} from '../input/player-input';
import type {PlayerRuntime} from '../player/player-runtime';
import {playerConfig} from '../player/player-config';
import {seededRandom} from '../npcs/definitions';
import {inventorySlots,type ItemSession} from '../inventory/inventory-store';

/** A single bounded instanced scatter. Seeds are visual instances, not entities. */
export function BirdFood({session,input,player}:{session:ItemSession;input:RefObject<PlayerInput>;player:RefObject<PlayerRuntime>}){
 const {world,rapier}=useRapier(),mesh=useRef<InstancedMesh>(null);
 const resources=useMemo(()=>({geometry:new BoxGeometry(.012,.005,.025),material:new MeshStandardMaterial({color:'#c2a36c',roughness:1}),dummy:new Object3D(),target:new Vector3(),origin:new Vector3(),direction:new Vector3(),point:new Vector3(),rotation:{x:0,y:0,z:0,w:1},ball:new rapier.Ball(.3),seeds:Array.from({length:28},(_,i)=>{const random=seededRandom(721+i*431),angle=random()*Math.PI*2,r=Math.sqrt(random())*.7;return {x:Math.cos(angle)*r,z:Math.sin(angle)*r,yaw:random()*Math.PI,size:.7+random()*.6};})}),[rapier]);
 useEffect(()=>()=>{resources.geometry.dispose();resources.material.dispose();session.food.clear();},[resources,session]);
 useFrame((_,delta)=>{
  const food=session.food,r=resources,motion=player.current;food.tick(Math.min(delta,.1));
  const fixed=(c:import('@dimforge/rapier3d-compat').Collider)=>!c.parent()||c.parent()!.isFixed();
  const height=(x:number,z:number)=>{
   const hit=world.castRayAndGetNormal(new rapier.Ray({x,y:motion.nextPosition.y+3,z},{x:0,y:-1,z:0}),8,true,rapier.QueryFilterFlags.EXCLUDE_SENSORS,undefined,undefined,undefined,fixed);
   if(!hit||hit.normal.y<.95)return null;
   const y=motion.nextPosition.y+3-hit.timeOfImpact,feet=motion.nextPosition.y-playerConfig.height/2;
   return y>feet+.3||y<feet-.6?null:y;
  };
  if(food.requested){
   food.requested=false;
   if(input.current.active&&!input.current.inputBlocked&&!input.current.flying&&!motion.seat&&!motion.bellAction&&inventorySlots[session.inventory.getState().selected]==='birdFood'){
    r.direction.set(-Math.sin(motion.facingYaw),0,-Math.cos(motion.facingYaw));r.target.set(motion.nextPosition.x,0,motion.nextPosition.z).addScaledVector(r.direction,3);
    const obstruction=world.castRay(new rapier.Ray(motion.nextPosition,r.direction),3,true,rapier.QueryFilterFlags.EXCLUDE_SENSORS,undefined,undefined,undefined,fixed),y=height(r.target.x,r.target.z);
    if(!obstruction&&y!==null&&!world.intersectionWithShape({x:r.target.x,y:y+.4,z:r.target.z},r.rotation,r.ball,rapier.QueryFilterFlags.EXCLUDE_SENSORS)){
     let valid=true;
     for(const [dx,dz] of [[-.7,-.7],[-.7,.7],[.7,-.7],[.7,.7]]){const other=height(r.target.x+dx,r.target.z+dz);if(other===null||Math.abs(other-y)>.05)valid=false;}
     if(valid){r.target.y=y+.015;r.origin.copy(motion.nextPosition);r.origin.y+=.15;food.add(r.target,r.origin);}
    }
   }
  }
  if(!mesh.current)return;let index=0;
  for(const patch of food.patches){
   const t=Math.min(1,(food.time-patch.created)/.35),fade=Math.min(1,(patch.expires-food.time)/.4),angle=patch.id*2.399,cos=Math.cos(angle),sin=Math.sin(angle);
   for(const seed of r.seeds){
    r.point.copy(patch.position);r.point.x+=seed.x*cos-seed.z*sin;r.point.z+=seed.x*sin+seed.z*cos;
    r.dummy.position.lerpVectors(patch.origin,r.point,t);r.dummy.position.y+=Math.sin(t*Math.PI)*.45;r.dummy.rotation.set(0,seed.yaw+angle,0);r.dummy.scale.setScalar(seed.size*fade);r.dummy.updateMatrix();mesh.current.setMatrixAt(index++,r.dummy.matrix);
   }
  }
  mesh.current.count=index;mesh.current.instanceMatrix.needsUpdate=true;
 });
 return <instancedMesh ref={mesh} args={[resources.geometry,resources.material,84]} frustumCulled={false} dispose={null}/>;
}
