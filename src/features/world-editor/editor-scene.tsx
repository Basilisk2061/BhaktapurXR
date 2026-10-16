"use client";
import {EditorPrimitives} from "./editor-primitives";
import {useEffect,useMemo,useRef,useSyncExternalStore,type RefObject} from "react";
import {useFrame,useThree} from "@react-three/fiber";
import {TransformControls} from "@react-three/drei";
import {Box3,BoxHelper,Vector3} from "three";
import {EditorViewportInput} from "./editor-navigation";
import {World} from "../../game/world/world";
import {Player} from "../../game/player/player";
import type {PlayerInput,PointerStatus} from "../../game/input/player-input";
import type {PlayerRuntime} from "../../game/player/player-runtime";
import type {SpawnPoint} from "../../types/world";
import {EditorSession} from "./session";
export function useEditorSnapshot(session:EditorSession){return useSyncExternalStore(session.subscribe,session.getSnapshot,session.getSnapshot);}
export function EditorScene({session,input,runtime,onPointerStatus,spawn}:{session:EditorSession;input:RefObject<PlayerInput>;runtime:RefObject<PlayerRuntime>;onPointerStatus:(s:PointerStatus)=>void;spawn:SpawnPoint}){
 const state=useEditorSnapshot(session),camera=useThree(s=>s.camera),focused=useRef(0),object=state.selectedId?session.objects.get(state.selectedId):undefined;
 const walkSpawn=useMemo(()=>state.walk?{position:[camera.position.x,.05,camera.position.z] as [number,number,number],rotation:[0,input.current.yaw,0] as [number,number,number]}:spawn,[state.walk,camera,input,spawn]);
 useEffect(()=>{session.setSpawnPosition(()=>{const p=camera.position.clone().addScaledVector(camera.getWorldDirection(new Vector3()),5);p.y=Math.max(.6,p.y);return p.toArray() as [number,number,number];});return ()=>session.setSpawnPosition(null);},[session,camera]);
 const helper=useMemo(()=>object&&!state.walk?new BoxHelper(object,0xf2bc39):null,[object,state.walk]);
 useEffect(()=>()=>{helper?.geometry.dispose();(helper?.material as import("three").Material|undefined)?.dispose();},[helper]);
 useFrame(()=>helper?.update());
 useEffect(()=>{if(!state.walk){camera.position.set(-35,18,42);camera.lookAt(-25,3,-12);}},[camera,state.walk]);
 useEffect(()=>{if(!state.focusSequence||!object||state.walk||focused.current===state.focusSequence)return;focused.current=state.focusSequence;object.updateWorldMatrix(true,true);const bounds=new Box3().setFromObject(object),centre=bounds.getCenter(new Vector3()),size=bounds.getSize(new Vector3()).length(),direction=camera.getWorldDirection(new Vector3()).negate();direction.y=Math.max(.15,direction.y);direction.normalize();const obstacles=[...session.objects].filter(([id,g])=>!id.includes("/")&&g.visible).map(([,g])=>{g.updateWorldMatrix(true,true);return new Box3().setFromObject(g);});const directions=[direction,new Vector3(0,.7,1).normalize(),new Vector3(1,.7,0).normalize(),new Vector3(-1,.7,0).normalize(),new Vector3(0,1,0)];let destination:Vector3|null=null;for(const multiplier of [1,1.5,2.5]){for(const d of directions){const candidate=centre.clone().addScaledVector(d,Math.max(3,size*1.6)*multiplier);candidate.y=Math.max(1.5,candidate.y);if(!obstacles.some(b=>b.containsPoint(candidate))){destination=candidate;break;}}if(destination)break;}camera.position.copy(destination??centre.clone().add(new Vector3(0,Math.max(3,size*4),0)));camera.lookAt(centre);},[state.focusSequence,object,state.walk,camera,session]);
 const entry=session.entries.find(r=>r.id===state.selectedId),activePartParent=state.selectionMode==="part"?(entry?.parentId??state.selectedId):null;
 const preview=()=>{if(!object||!state.selectedId)return;const valid=session.preview(state.selectedId,{position:object.position.toArray(),rotation:[object.rotation.x,object.rotation.y,object.rotation.z],scale:object.scale.toArray()});if(!valid){const t=session.getSnapshot().transforms[state.selectedId];object.position.fromArray(t.position);object.rotation.set(...t.rotation);object.scale.fromArray(t.scale);}};
 return <>
 <World mode="BHAKTAPUR" assemblyEditor={{ids:session.ids,state,activePartParent,transforms:state.transforms,hidden:state.hidden,walk:state.walk,dragging:state.dragging,select:session.select,register:session.register}}/>
 <EditorPrimitives objects={state.createdObjects.map(o=>({...o,...state.transforms[o.id]}))} session={session}/>
 {state.walk?<Player sittingEnabled seatingTransforms={state.transforms} reviewCamera={false} spawn={walkSpawn} input={input} runtime={runtime} onPointerStatus={onPointerStatus}/>:<EditorViewportInput session={session}/>}
 {!state.walk&&helper&&<primitive object={helper} dispose={null}/>}
 {!state.walk&&!state.navigating&&object&&!state.locked[object.userData.editableId]&&<TransformControls object={object} mode={state.mode} space={state.space} size={.85} translationSnap={state.translationSnap} rotationSnap={state.rotationSnap} onMouseDown={()=>session.begin(object.userData.editableId,true)} onObjectChange={preview} onMouseUp={()=>session.complete()}/>}
 </>;
}
