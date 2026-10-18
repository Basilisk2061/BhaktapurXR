"use client";
import Link from 'next/link';
import {useEffect,useRef,useState,type RefObject,type PointerEvent as ReactPointerEvent} from 'react';
import type {PlayerInput} from '../game/input/player-input';
import type {PlayerRuntime} from '../game/player/player-runtime';
import {readMouseSensitivity} from '../game/input/mouse-sensitivity';
import {playerConfig} from '../game/player/player-config';
import {MouseSensitivitySettings} from './mouse-sensitivity-settings';
import './mobile-controls.css';

export function useTouchDevice(){
 const [touch,setTouch]=useState(false);
 useEffect(()=>{const coarse=matchMedia('(pointer: coarse)'),noHover=matchMedia('(hover: none)');const update=()=>setTouch(coarse.matches||(navigator.maxTouchPoints>0&&noHover.matches));update();coarse.addEventListener('change',update);noHover.addEventListener('change',update);return()=>{coarse.removeEventListener('change',update);noHover.removeEventListener('change',update);};},[]);
 return touch;
}
export function MobileControls({input,runtime}:{input:RefObject<PlayerInput>;runtime:RefObject<PlayerRuntime>}){
 const joystick=useRef<{id:number;x:number;y:number;radius:number}|null>(null),look=useRef<{id:number;x:number;y:number}|null>(null),thumb=useRef<HTMLSpanElement>(null),dialog=useRef<HTMLDialogElement>(null);
 const [prompt,setPrompt]=useState<PlayerRuntime['sitPrompt']>(null),[menu,setMenu]=useState(false),[settings,setSettings]=useState(false),[fullscreen,setFullscreen]=useState(false);
 const reset=()=>{joystick.current=null;look.current=null;input.current.touchMovement={forward:0,right:0,running:false};input.current.jumpRequested=false;input.current.interactRequested=false;input.current.keys.clear();input.current.active=false;if(thumb.current)thumb.current.style.transform='translate(0px,0px)';};
 useEffect(()=>{
  input.current.touchMode=true;input.current.touchMovement={forward:0,right:0,running:false};
  setFullscreen(!!document.fullscreenEnabled&&typeof document.documentElement.requestFullscreen==='function');
  const timer=setInterval(()=>setPrompt(runtime.current.sitPrompt),100);
  const hide=()=>{if(document.hidden)reset();};
  window.addEventListener('blur',reset);document.addEventListener('visibilitychange',hide);
  return()=>{clearInterval(timer);window.removeEventListener('blur',reset);document.removeEventListener('visibilitychange',hide);reset();input.current.touchMode=false;input.current.inputBlocked=false;};
  // Input/runtime refs belong to this Explore session; the reset closure only uses refs.
 },[input,runtime]);
 useEffect(()=>{if(menu&&!dialog.current?.open)dialog.current?.showModal();},[menu]);
 const activate=()=>{if(input.current.inputBlocked)return false;input.current.active=true;return true;};
 const moveStick=(event:ReactPointerEvent<HTMLDivElement>)=>{
  const stick=joystick.current;if(!stick||stick.id!==event.pointerId)return;
  event.preventDefault();const dx=event.clientX-stick.x,dy=event.clientY-stick.y,length=Math.hypot(dx,dy),fraction=Math.min(1,length/stick.radius),magnitude=fraction<.13?0:(fraction-.13)/.87;
  input.current.touchMovement={right:length?dx/length*magnitude:0,forward:length?-dy/length*magnitude:0,running:fraction>=.9};
  if(thumb.current){const scale=length?Math.min(length,stick.radius)/length:0;thumb.current.style.transform=`translate(${dx*scale}px,${dy*scale}px)`;}
 };
 const releaseStick=(event:ReactPointerEvent<HTMLDivElement>)=>{if(joystick.current?.id!==event.pointerId)return;joystick.current=null;input.current.touchMovement={forward:0,right:0,running:false};if(thumb.current)thumb.current.style.transform='translate(0px,0px)';};
 const releaseLook=(event:ReactPointerEvent<HTMLDivElement>)=>{if(look.current?.id===event.pointerId)look.current=null;};
 const openMenu=()=>{reset();input.current.inputBlocked=true;setSettings(false);setMenu(true);};
 return <div className="touch-controls" data-touch-controls>
  <div className="touch-look" aria-hidden="true" onPointerDown={event=>{if(event.pointerType==='mouse'||look.current||!activate())return;event.preventDefault();event.currentTarget.setPointerCapture(event.pointerId);look.current={id:event.pointerId,x:event.clientX,y:event.clientY};}} onPointerMove={event=>{
   const last=look.current;if(!last||last.id!==event.pointerId||input.current.inputBlocked)return;event.preventDefault();
   const sensitivity=readMouseSensitivity(),camera=playerConfig.camera,dx=Math.max(-camera.maxMouseDelta,Math.min(camera.maxMouseDelta,event.clientX-last.x)),dy=Math.max(-camera.maxMouseDelta,Math.min(camera.maxMouseDelta,event.clientY-last.y));
   input.current.yaw=Math.atan2(Math.sin(input.current.yaw-dx*sensitivity),Math.cos(input.current.yaw-dx*sensitivity));input.current.pitch=Math.max(camera.minPitch,Math.min(camera.maxPitch,input.current.pitch+dy*sensitivity));last.x=event.clientX;last.y=event.clientY;
  }} onPointerUp={releaseLook} onPointerCancel={releaseLook} onLostPointerCapture={releaseLook}/>
  <p className="touch-orientation">For the best experience, rotate your device.</p>
  <button type="button" className="touch-menu-button" aria-label="Open game menu" onClick={openMenu}>&#9776;</button>
  <div className="touch-joystick" role="group" aria-label="Movement joystick. Push farther to run." onPointerDown={event=>{if(event.pointerType==='mouse'||joystick.current||!activate())return;event.preventDefault();const rect=event.currentTarget.getBoundingClientRect();joystick.current={id:event.pointerId,x:rect.left+rect.width/2,y:rect.top+rect.height/2,radius:rect.width*.32};event.currentTarget.setPointerCapture(event.pointerId);moveStick(event);}} onPointerMove={moveStick} onPointerUp={releaseStick} onPointerCancel={releaseStick} onLostPointerCapture={releaseStick}><span className="touch-joystick-thumb" ref={thumb}/></div>
  <div className="touch-actions">
   {prompt&&<button type="button" className="touch-action" onPointerDown={event=>{event.preventDefault();if(activate())input.current.interactRequested=true;}} onClick={event=>{if(event.detail===0&&activate())input.current.interactRequested=true;}}>{prompt==='sit'?'Sit':'Stand'}</button>}
   <button type="button" className="touch-jump" aria-label="Jump" onPointerDown={event=>{event.preventDefault();if(activate()&&!input.current.sitting)input.current.jumpRequested=true;}} onClick={event=>{if(event.detail===0&&activate()&&!input.current.sitting)input.current.jumpRequested=true;}}>Jump</button>
  </div>
  <dialog ref={dialog} className="touch-pause" aria-labelledby="touch-menu-title" onClose={()=>{reset();input.current.inputBlocked=false;setMenu(false);}}>
   <h2 id="touch-menu-title">{settings?'Settings':'BhaktapurXR'}</h2>
   {settings?<><MouseSensitivitySettings touch/><button type="button" onClick={()=>setSettings(false)}>Back</button></>:<>
    <button type="button" onClick={()=>dialog.current?.close()}>Resume</button>
    <button type="button" onClick={()=>setSettings(true)}>Settings</button>
    {fullscreen&&<button type="button" onClick={()=>{const operation=document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen();void operation.catch(()=>setFullscreen(false));}}>Toggle fullscreen</button>}
    <Link href="/">Return to Main Menu</Link>
   </>}
  </dialog>
 </div>;
}
