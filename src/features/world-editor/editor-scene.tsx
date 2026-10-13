"use client";
import {useEffect,useMemo,useRef,useSyncExternalStore,type RefObject} from "react";
import {useFrame,useThree} from "@react-three/fiber";
import {OrbitControls,TransformControls} from "@react-three/drei";
import {Box3,BoxHelper,Vector3} from "three";
import type {OrbitControls as OrbitImpl} from "three-stdlib";
import {World} from "../../game/world/world";
import {Player} from "../../game/player/player";
import type {PlayerInput,PointerStatus} from "../../game/input/player-input";
import type {PlayerRuntime} from "../../game/player/player-runtime";
import type {SpawnPoint} from "../../types/world";
import {EditorSession} from "./session";
export function useEditorSnapshot(session:EditorSession){return useSyncExternalStore(session.subscribe,session.getSnapshot,session.getSnapshot);}
export function EditorScene({session,input,runtime,onPointerStatus,spawn}:{session:EditorSession;input:RefObject<PlayerInput>;runtime:RefObject<PlayerRuntime>;onPointerStatus:(s:PointerStatus)=>void;spawn:SpawnPoint}){
 const state=useEditorSnapshot(session),camera=useThree(s=>s.camera),orbit=useRef<OrbitImpl>(null),focused=useRef(0),object=state.selectedId?session.objects.get(state.selectedId):undefined;
 const walkSpawn=useMemo(()=>state.walk?{position:[camera.position.x,.05,camera.position.z] as [number,number,number],rotation:[0,input.current.yaw,0] as [number,number,number]}:spawn,[state.walk,camera,input,spawn]);
 const helper=useMemo(()=>object&&!state.walk?new BoxHelper(object,0xf2bc39):null,[object,state.walk]);
 useEffect(()=>()=>{helper?.geometry.dispose();(helper?.material as import("three").Material|undefined)?.dispose();},[helper]);
 useFrame(()=>helper?.update());
 useEffect(()=>{if(!state.walk){camera.position.set(-35,18,42);orbit.current?.target.set(-25,3,-12);orbit.current?.update();}},[camera,state.walk]);
 useEffect(()=>{if(!state.focusSequence||!object||state.walk||focused.current===state.focusSequence)return;focused.current=state.focusSequence;const bounds=new Box3().setFromObject(object),centre=bounds.getCenter(new Vector3()),size=bounds.getSize(new Vector3()).length(),direction=camera.position.clone().sub(orbit.current?.target??centre).normalize();if(direction.length()<.1)direction.set(0,.35,1).normalize();camera.position.copy(centre).addScaledVector(direction,Math.max(7,size*1.2));orbit.current?.target.copy(centre);orbit.current?.update();},[state.focusSequence,object,state.walk,camera]);
 const preview=()=>{if(!object||!state.selectedId)return;const valid=session.preview(state.selectedId,{position:object.position.toArray(),rotation:[object.rotation.x,object.rotation.y,object.rotation.z],scale:object.scale.toArray()});if(!valid){const t=session.getSnapshot().transforms[state.selectedId];object.position.fromArray(t.position);object.rotation.set(...t.rotation);object.scale.fromArray(t.scale);}};
 return <>
 <World mode="BHAKTAPUR" assemblyEditor={{ids:session.ids,transforms:state.transforms,hidden:state.hidden,walk:state.walk,dragging:state.dragging,select:session.select,register:session.register}}/>
 {state.walk?<Player reviewCamera={false} spawn={walkSpawn} input={input} runtime={runtime} onPointerStatus={onPointerStatus}/>:<OrbitControls ref={orbit} makeDefault enabled={!state.dragging} maxDistance={300} minDistance={1}/>}
 {!state.walk&&helper&&<primitive object={helper} dispose={null}/>}
 {!state.walk&&object&&!state.locked[object.userData.editableId]&&<TransformControls object={object} mode={state.mode} space={state.space} translationSnap={state.translationSnap} rotationSnap={state.rotationSnap} onMouseDown={()=>session.begin(object.userData.editableId,true)} onObjectChange={preview} onMouseUp={()=>session.complete()}/>}
 </>;
}
