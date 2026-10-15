import {Suspense,useEffect,useMemo,useRef,useState,type RefObject} from 'react';
import {useFrame} from '@react-three/fiber';
import {useGLTF} from '@react-three/drei';
import {CapsuleCollider,RigidBody,useBeforePhysicsStep,useRapier,type RapierRigidBody} from '@react-three/rapier';
import {AnimationMixer,LoopRepeat,Vector3,type Group} from 'three';
import {clone} from 'three/addons/utils/SkeletonUtils.js';
import type {KinematicCharacterController} from '@dimforge/rapier3d-compat';
import manifest from '../../../public/assets/characters/npcs/manifest.json';
import type {TransformOverrides} from '../../features/world-editor/transforms';
import type {PlayerRuntime} from '../player/player-runtime';
import {arcadeSeatSpans} from '../player/arcade-sitting';
import {dampAngle} from '../player/movement';
import {createNpcNavigationProbe} from './physics-navigation';
import {pedestrianGraph,type NavigationProbe,type WalkGraph} from './navigation';
import {npcDefinitions,npcInstances} from './definitions';
import {NpcSimulation,type NpcAgent} from './behavior';
import {npcAnimationLibrary} from './animation-library';
const radius=.26;
type ActorBinding={body:RapierRigidBody;controller:KinematicCharacterController};
function NpcActor({agent,register}:{agent:NpcAgent;register:(id:string,binding:ActorBinding|null)=>void}){
 const definition=npcDefinitions[agent.character],asset=useGLTF(definition.asset,false,false),player=useGLTF('/assets/characters/player/player.glb',false,false),{world}=useRapier();
 const runtime=useRef(agent),body=useRef<RapierRigidBody>(null),visual=useRef<Group>(null),lastRole=useRef('');
 const model=useMemo(()=>{const instance=clone(asset.scene);instance.traverse(o=>{o.castShadow=true;o.receiveShadow=true;});return instance;},[asset.scene]);
 const library=useMemo(()=>npcAnimationLibrary(definition,asset.scene,asset.animations,player.scene,player.animations),[definition,asset,player]);
 const mixer=useMemo(()=>new AnimationMixer(model),[model]);
 const actions=useMemo(()=>Object.fromEntries(Object.entries(library).map(([role,clip])=>[role,mixer.clipAction(clip!).setLoop(LoopRepeat,Infinity)])),[library,mixer]);
 const records=manifest as Record<string,{sitVisualY:number}>,sitOffset=definition.sitPoseOffsetY??records[definition.id].sitVisualY;
 useEffect(()=>{
  const controller=world.createCharacterController(.015);controller.setSlideEnabled(true);controller.disableAutostep();controller.enableSnapToGround(.18);controller.setMaxSlopeClimbAngle(.4);controller.setApplyImpulsesToDynamicBodies(false);
  register(agent.id,{body:body.current!,controller});lastRole.current='';
  return ()=>{register(agent.id,null);world.removeCharacterController(controller);mixer.stopAllAction();};
 },[world,register,agent.id,mixer]);
 useFrame((_,delta)=>{
  const agent=runtime.current;
  const role=agent.state==='SITTING'?'sit':agent.state==='WALKING'&&agent.actualSpeed>.02?'walk':'idle';
  if(lastRole.current!==role){actions[lastRole.current]?.fadeOut(.2);const action=actions[role].reset();if(!lastRole.current){action.time=agent.phase*action.getClip().duration;action.play();}else action.fadeIn(.2).play();lastRole.current=role;}
  mixer.update(role==='walk'?agent.walked/definition.gaitSpeed:Math.min(delta,.1));agent.walked=0;
  if(visual.current){visual.current.rotation.y=agent.yaw;visual.current.position.y=agent.state==='SITTING'?sitOffset:0;visual.current.userData.state=agent.state;visual.current.userData.animation=role;}
 });
 return <RigidBody ref={body} type="kinematicPosition" colliders={false} enabledRotations={[false,false,false]} position={[agent.position.x,agent.position.y+definition.height/2+.015,agent.position.z]} name={'npc-body:'+agent.id}>
  <CapsuleCollider args={[definition.height/2-radius,radius]}/>
  <group ref={visual} name={'npc:'+agent.id} userData={{npcId:agent.id,character:agent.character}}><primitive object={model} position={[0,-definition.height/2,0]} dispose={null}/></group>
 </RigidBody>;
}
function Population({graph,probe,transforms,player}:{graph:WalkGraph;probe:NavigationProbe;transforms?:TransformOverrides;player:RefObject<PlayerRuntime>}){
 const {rapier}=useRapier(),bindings=useRef(new Map<string,ActorBinding>()),span=useMemo(()=>arcadeSeatSpans(transforms)[0],[transforms]);
 const [simulation]=useState(()=>new NpcSimulation(graph,span,probe,npcInstances));
 const simulationRef=useRef(simulation);
 const register=useMemo(()=>(id:string,binding:ActorBinding|null)=>{if(binding)bindings.current.set(id,binding);else bindings.current.delete(id);},[]);
 useEffect(()=>()=>simulation.dispose(),[simulation]);
 const playerPoint=useMemo(()=>new Vector3(),[]);
 useBeforePhysicsStep(()=>{
  const simulation=simulationRef.current;
  const delta=1/60,motion=player.current;playerPoint.set(motion.nextPosition.x,motion.nextPosition.y-.875,motion.nextPosition.z);
  for(const agent of simulation.agents){const binding=bindings.current.get(agent.id);if(!binding)continue;const position=binding.body.translation();agent.position.set(position.x,position.y-npcDefinitions[agent.character].height/2-.015,position.z);}
  simulation.tick(delta,playerPoint,motion.seat);
  for(const agent of simulation.agents){const binding=bindings.current.get(agent.id);if(!binding)continue;const {body,controller}=binding,definition=npcDefinitions[agent.character];
   if(agent.state==='SITTING'){body.setNextKinematicTranslation({x:agent.position.x,y:agent.position.y+definition.height/2+.015,z:agent.position.z});agent.actualSpeed=0;continue;}
   // Standing from a seat is a checked placement onto the same clear plaza exit as the player.
   const position=body.translation();if(Math.abs(position.y-definition.height/2-.015-agent.position.y)>.3){const next={x:agent.position.x,y:agent.position.y+definition.height/2+.015,z:agent.position.z};body.setTranslation(next,true);body.setNextKinematicTranslation(next);}
   const desired=simulation.displacement(agent,delta,playerPoint),collider=body.collider(0);controller.computeColliderMovement(collider,{x:desired.x,y:-.5*delta,z:desired.z},rapier.QueryFilterFlags.EXCLUDE_SENSORS);
   const movement=controller.computedMovement(),current=body.translation();
   // This network is plaza-only: keep soles on its validated floor, never autostep onto plinths.
   const floor=graph.nodes.find(n=>n.id===agent.node)!.point.y;
   body.setNextKinematicTranslation({x:current.x+movement.x,y:Math.max(current.y+movement.y,floor+definition.height/2+.015),z:current.z+movement.z});const distance=Math.hypot(movement.x,movement.z);agent.walked+=distance;agent.actualSpeed=distance/delta;
   if(distance>.0001)agent.yaw=dampAngle(agent.yaw,Math.atan2(-movement.x,-movement.z),8,delta);
   if(current.y< -2){const safe=graph.nodes.find(n=>n.id===agent.node)!.point;body.setTranslation({x:safe.x,y:safe.y+definition.height/2+.015,z:safe.z},true);}
  }
 });
 return <group name="npc-population" userData={{nodeCount:graph.nodes.length,edgeCount:graph.edges.length,expectedCount:4,availableCount:simulation.agents.length}}>{simulation.agents.map(agent=><Suspense key={agent.id} fallback={null}><NpcActor agent={agent} register={register}/></Suspense>)}</group>;
}
export function NpcPopulation({transforms,player}:{transforms?:TransformOverrides;player:RefObject<PlayerRuntime>}){
 const {world,rapier}=useRapier(),[graph,setGraph]=useState<WalkGraph|null>(null),warmup=useRef(0),span=useMemo(()=>arcadeSeatSpans(transforms)[0],[transforms]);
 const probe=useMemo(()=>createNpcNavigationProbe(world,rapier),[world,rapier]);
 useBeforePhysicsStep(()=>{if(graph||++warmup.current<3)return;const result=pedestrianGraph(span,probe);if(result.nodes.length<4)throw Error('NPC route zone is blocked by current architecture/editor transforms');setGraph(result);});
 return graph?<Population graph={graph} probe={probe} transforms={transforms} player={player}/>:null;
}
