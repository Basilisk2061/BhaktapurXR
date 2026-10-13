"use client";
import {useEffect,useMemo} from "react";
import {useFrame,useThree} from "@react-three/fiber";
import {Raycaster,Vector2} from "three";
import {EditorNavigation,nextCameraSpeed} from "./navigation";
import {selectionCandidates} from "./selection";
import type {EditorSession} from "./session";
export function EditorViewportInput({session}:{session:EditorSession}){
 const camera=useThree(s=>s.camera),canvas=useThree(s=>s.gl.domElement),navigation=useMemo(()=>new EditorNavigation(),[]);
 useFrame((_,dt)=>navigation.step(camera,dt,session.state.cameraSpeed));
 useEffect(()=>{
  const raycaster=new Raycaster(),pointer=new Vector2();let down:{x:number;y:number;sequence:number}|null=null,lastX=0,lastY=0;
  const stop=()=>{navigation.stop();canvas.style.cursor="";if(document.pointerLockElement===canvas)document.exitPointerLock();if(session.state.navigating)session.update({navigating:false});};
  const onDown=(e:PointerEvent)=>{if(session.state.walk||session.state.dragging)return;if(e.button===0){down={x:e.clientX,y:e.clientY,sequence:session.gizmoSequence};return;}if(e.button!==2)return;e.preventDefault();navigation.start(camera);lastX=e.clientX;lastY=e.clientY;down=null;canvas.style.cursor="none";session.update({navigating:true});try{canvas.setPointerCapture(e.pointerId);}catch{}try{const request=canvas.requestPointerLock?.();if(request)request.catch(()=>{});}catch{}};
  const move=(e:PointerEvent)=>{if(!navigation.active)return;const locked=document.pointerLockElement===canvas;navigation.look(camera,locked?e.movementX:e.clientX-lastX,locked?e.movementY:e.clientY-lastY);lastX=e.clientX;lastY=e.clientY;};
  // A gizmo press increments the sequence even if it finishes before native pointerup.
  const up=(e:PointerEvent)=>{if(e.button===2){stop();return;}if(e.button!==0||!down)return;const start=down;down=null;if(session.state.navigating||session.state.dragging||session.state.walk||start.sequence!==session.gizmoSequence||Math.hypot(e.clientX-start.x,e.clientY-start.y)>4)return;const rect=canvas.getBoundingClientRect();pointer.set((e.clientX-rect.left)/rect.width*2-1,1-(e.clientY-rect.top)/rect.height*2);raycaster.setFromCamera(pointer,camera);const candidates=selectionCandidates(raycaster.intersectObjects([...session.objects.values()].filter(g=>!g.userData.editableId.includes("/")),true),session.entries,session.state.selectionMode);if(candidates.length)session.pick(candidates,e.altKey);else session.select(null);};
  const keyDown=(e:KeyboardEvent)=>{if(!navigation.active)return;if(["KeyW","KeyA","KeyS","KeyD","KeyQ","KeyE","ShiftLeft","ShiftRight"].includes(e.code)){e.preventDefault();navigation.keys.add(e.code);}if(e.code==="Escape")stop();};
  const keyUp=(e:KeyboardEvent)=>navigation.keys.delete(e.code);
  const wheel=(e:WheelEvent)=>{if(navigation.active){e.preventDefault();session.update({cameraSpeed:nextCameraSpeed(session.state.cameraSpeed,e.deltaY)});}};
  const menu=(e:Event)=>e.preventDefault(),lockChange=()=>{if(document.pointerLockElement===canvas&&!navigation.active)document.exitPointerLock();else if(!document.pointerLockElement&&navigation.active)stop();};
  canvas.addEventListener("pointerdown",onDown);canvas.addEventListener("pointermove",move);canvas.addEventListener("pointerup",up);canvas.addEventListener("pointercancel",stop);canvas.addEventListener("contextmenu",menu);canvas.addEventListener("wheel",wheel,{passive:false});window.addEventListener("pointerup",up);window.addEventListener("blur",stop);window.addEventListener("keydown",keyDown);window.addEventListener("keyup",keyUp);document.addEventListener("pointerlockchange",lockChange);
  return ()=>{stop();canvas.removeEventListener("pointerdown",onDown);canvas.removeEventListener("pointermove",move);canvas.removeEventListener("pointerup",up);canvas.removeEventListener("pointercancel",stop);canvas.removeEventListener("contextmenu",menu);canvas.removeEventListener("wheel",wheel);window.removeEventListener("pointerup",up);window.removeEventListener("blur",stop);window.removeEventListener("keydown",keyDown);window.removeEventListener("keyup",keyUp);document.removeEventListener("pointerlockchange",lockChange);};
 },[camera,canvas,navigation,session]);
 return null;
}
