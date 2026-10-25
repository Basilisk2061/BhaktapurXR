'use client';
import {useCallback,useEffect,useRef,useState,type RefObject} from 'react';
import type {PlayerInput} from '../input/player-input';
import type {PlayerRuntime} from '../player/player-runtime';
import type {ItemSession} from './inventory-store';
import {downloadPhotograph,type CapturedPhotograph} from './photograph';
/** One transient photograph, not a gallery. The displayed Blob is also the saved Blob. */
export function PhotoPreview({photo,session,input,runtime,touch}:{photo:CapturedPhotograph;session:ItemSession;input:RefObject<PlayerInput>;runtime:RefObject<PlayerRuntime>;touch:boolean}){
 const dialog=useRef<HTMLDialogElement>(null),[url,setUrl]=useState(''),blocked=useRef(!!input.current.inputBlocked);
 const finish=useCallback((save:boolean)=>{
  if(save){try{downloadPhotograph(photo);}catch(error){console.error('BhaktapurXR photo save failed:',error);session.photography.setState({photoMessage:'PHOTO SAVE FAILED',photoUntil:Date.now()+1400});return;}}
  dialog.current?.close();
  const controls=input.current;controls.inputBlocked=blocked.current;controls.active=!blocked.current;controls.keys.clear();controls.jumpRequested=false;controls.interactRequested=false;
  session.photography.setState({preview:null,photoMessage:save?'SAVED TO DEVICE':'',photoUntil:save?Date.now()+1300:0});
  const canvas=document.querySelector('canvas');canvas?.focus({preventScroll:true});
  if(!touch&&!blocked.current&&canvas?.requestPointerLock){try{void Promise.resolve(canvas.requestPointerLock()).catch(()=>{controls.active=!controls.inputBlocked;});}catch{controls.active=!controls.inputBlocked;}}
 },[photo,session,input,touch]);
 useEffect(()=>{
  const controls=input.current,element=dialog.current,objectUrl=URL.createObjectURL(photo.blob);setUrl(objectUrl);
  controls.inputBlocked=true;controls.active=false;controls.keys.clear();controls.jumpRequested=false;controls.interactRequested=false;controls.lastSpacePress=null;if(controls.touchMovement)controls.touchMovement={forward:0,right:0,running:false};runtime.current.velocity.x=0;runtime.current.velocity.z=0;
  if(document.pointerLockElement)void document.exitPointerLock();element?.showModal();
  const key=(event:KeyboardEvent)=>{event.stopImmediatePropagation();if(event.code==='Escape'){event.preventDefault();finish(false);}};
  document.addEventListener('keydown',key,true);
  return()=>{document.removeEventListener('keydown',key,true);URL.revokeObjectURL(objectUrl);controls.inputBlocked=blocked.current;element?.close();};
 },[photo,input,runtime,finish]);
 const m=photo.metadata;
 return <dialog ref={dialog} className="camera-photo-preview" aria-label="Photo preview" onCancel={event=>{event.preventDefault();finish(false);}}>
  <header>PHOTO PREVIEW</header><div className="camera-preview-image">{url&&<img src={url} alt="Captured Bhaktapur photograph"/>}</div>
  <p>{Math.round(m.focalLength)}mm | F{m.aperture.toFixed(1)} | 1/{Math.round(1/m.shutterSeconds)} | ISO {m.iso}</p>
  <footer><button type="button" onClick={()=>finish(true)}>SAVE</button><button type="button" onClick={()=>finish(false)}>RETAKE</button></footer>
  {session.photography.getState().photoMessage==='PHOTO SAVE FAILED'&&<p role="alert">PHOTO SAVE FAILED</p>}
 </dialog>;
}
