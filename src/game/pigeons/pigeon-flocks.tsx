import type {BirdFoodSystem} from '../food/bird-food-system';
import {useEffect,useMemo,useRef,type RefObject} from 'react';
import {useFrame,useThree} from '@react-three/fiber';
import {useRapier} from '@react-three/rapier';
import {Frustum,Group,MathUtils,Matrix4,Vector3} from 'three';
import {useGraphicsQuality} from '../../lib/graphics-quality';
import type {PlayerRuntime} from '../player/player-runtime';
import {daylightAmount,environmentStore} from '../world/time-of-day';
import {PigeonSimulation,type BirdProbe} from './pigeon-behavior';
import {pigeonCounts,pigeonZones,pigeonAirTargets} from './pigeon-config';
import {createPigeonResources,createPigeonVisual} from './pigeon-model';

/** One ambient-life owner; no bird physics bodies, input handlers or React frame state. */
export function PigeonFlocks({player,food}:{player:RefObject<PlayerRuntime>;food?:BirdFoodSystem}){
 const quality=useGraphicsQuality(),{world,rapier}=useRapier(),camera=useThree(state=>state.camera);
 const view=useMemo(()=>({frustum:new Frustum(),matrix:new Matrix4(),elapsed:1}),[]);
 const probe=useMemo<BirdProbe>(()=>{
  const occupied=new rapier.Ball(.4),sweep=new rapier.Ball(.18),rotation={x:0,y:0,z:0,w:1},direction=new Vector3();
  const fixed=(c:import('@dimforge/rapier3d-compat').Collider)=>!c.parent()||c.parent()!.isFixed();
  return {
   ground(x,z){
    // Read topmost fixed surface, rejecting roofs/steps rather than spawning under them.
    const hit=world.castRay(new rapier.Ray({x,y:30,z},{x:0,y:-1,z:0}),40,true,rapier.QueryFilterFlags.EXCLUDE_SENSORS,undefined,undefined,undefined,fixed);
    if(!hit)return null;const y=30-hit.timeOfImpact;if(y<-.08||y>.12)return null;
    // Includes dynamic NPC/player colliders for spawn and landing occupancy only.
    return world.intersectionWithShape({x,y:y+.49,z},rotation,occupied,rapier.QueryFilterFlags.EXCLUDE_SENSORS)?null:y;
   },
   clear(from,to){
    direction.copy(to).sub(from);const length=direction.length();if(length<.001)return true;direction.divideScalar(length);
    return !world.castShape({x:from.x,y:from.y+.22,z:from.z},rotation,direction,sweep,0,length,true,rapier.QueryFilterFlags.EXCLUDE_SENSORS,undefined,undefined,undefined,fixed);
   },
   appear(point){return Math.hypot(point.x-player.current.nextPosition.x,point.z-player.current.nextPosition.z)>7||!view.frustum.containsPoint(point);},
  };
 },[world,rapier,player,view]);
 const simulation=useMemo(()=>new PigeonSimulation(probe,food),[probe,food]),resources=useMemo(()=>createPigeonResources(),[]);
 // Construct the whole owned graph atomically. Strict Mode replays memo factories:
 // reusing roots from a separate memo would move them into the discarded group,
 // leaving the retained/rendered flock empty (Object3D.add reparents children).
 const {flock,visuals}=useMemo(()=>{
  const flock=new Group();flock.name='ambient-pigeon-flocks';
  const visuals=simulation.birds.map(bird=>createPigeonVisual(resources,bird.variant));
  visuals.forEach((visual,i)=>{visual.root.name='pigeon:'+i;flock.add(visual.root);});
  return {flock,visuals};
 },[simulation,resources]);
 const elapsed=useRef(0),point=useMemo(()=>new Vector3(),[]);
 useEffect(()=>()=>resources.dispose(),[resources]);
 useFrame((_,delta)=>{
  const dt=Math.min(delta,.05),motion=player.current;elapsed.current+=dt;view.elapsed+=dt;
  if(view.elapsed>.15){view.matrix.multiplyMatrices(camera.projectionMatrix,camera.matrixWorldInverse);view.frustum.setFromProjectionMatrix(view.matrix);view.elapsed=0;}
  const far=pigeonZones.every(zone=>Math.hypot(zone.x-motion.nextPosition.x,zone.z-motion.nextPosition.z)>65);
  if(far&&elapsed.current<.15)return;
  point.set(motion.nextPosition.x,motion.nextPosition.y,motion.nextPosition.z);
  const simulationDelta=elapsed.current;
  simulation.update(elapsed.current,point,motion.movement==='RUN',daylightAmount(environmentStore.getState().hour),pigeonCounts[quality],pigeonAirTargets[quality]);elapsed.current=0;
  for(const bird of simulation.birds){
   const visual=visuals[bird.id],visible=bird.initialized&&bird.fade>=.012;
   visual.root.visible=visible;if(!visible)continue;
   const walking=bird.state==='GROUND_WALK',air=bird.state==='TAKEOFF'?Math.min(1,bird.age/.2):bird.state==='FLYING'?1:bird.state==='LANDING'?Math.min(1,(bird.flightDuration-bird.flightTime)/.22):0;
   const hop=walking?.018*Math.abs(Math.sin(simulation.time*12+bird.phase)):0;
   visual.root.position.copy(bird.position);visual.root.position.y+=hop+(air===0?.0015*Math.sin(simulation.time*2+bird.phase):0);visual.root.scale.setScalar(bird.size);visual.root.rotation.set(bird.pitch,bird.yaw,bird.bank);
   const peck=(bird.state==='GROUND_PECK'||bird.state==='FEEDING')?Math.max(0,Math.sin(bird.age*Math.PI/.325)):0;
   visual.head.position.set(0,.12,-.04);
   visual.head.rotation.set(-1.38*peck+(walking?.045*Math.sin(simulation.time*12+bird.phase):0)+(bird.state==='ALERT'?.08:0),.08*Math.sin(simulation.time*1.7+bird.phase),0);
   const glide=bird.airLeg&&bird.state==='FLYING'&&Math.sin(simulation.time*1.1+bird.phase)>.9;
   const frequency=bird.state==='TAKEOFF'?45:bird.state==='LANDING'?38:27+4*Math.sin(simulation.time*.7+bird.phase);
   bird.wingPhase=(bird.wingPhase+frequency*simulationDelta)%(Math.PI*2);bird.glide=MathUtils.damp(bird.glide,glide?1:0,10,simulationDelta);
   const flap=MathUtils.lerp(Math.sin(bird.wingPhase),.12,bird.glide);
   for(const wing of visual.wings){wing.hinge.rotation.y=MathUtils.lerp(-1.35,0,air);wing.hinge.rotation.z=MathUtils.lerp(-.18,flap*(bird.state==='TAKEOFF'?1.05:.8),air);}
   const index=Math.min(7,Math.max(0,Math.floor(bird.fade*8)));
   if(index!==visual.material){for(const mesh of visual.meshes)mesh.material=resources.palettes[bird.variant][index];visual.material=index;}
  }
 });
 return <primitive object={flock} dispose={null}/>;
}
