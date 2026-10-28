"use client";
import {canStartTouchLook} from '../game/input/gameplay-ui-pointer';
import {clearTouchEvent} from '../game/inventory/touch-camera-actions';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {enterMobilePresentation,leaveMobilePresentation} from '../lib/mobile-presentation';
import {useCallback,useEffect,useRef,useState,type RefObject,type PointerEvent as ReactPointerEvent} from 'react';
import type {PlayerInput} from '../game/input/player-input';
import type {PlayerRuntime} from '../game/player/player-runtime';
import {readMouseSensitivity} from '../game/input/mouse-sensitivity';
import {playerConfig} from '../game/player/player-config';
import {GameSettings} from './game-settings';
import {MenuWindowFrame} from './home/menu-window-frame';
import './mobile-controls.css';
import './exploration-menu.css';

export function useTouchDevice(){
 const [touch,setTouch]=useState(false);
 useEffect(()=>{const coarse=matchMedia('(pointer: coarse)'),noHover=matchMedia('(hover: none)');const update=()=>setTouch(coarse.matches||(navigator.maxTouchPoints>0&&noHover.matches));update();coarse.addEventListener('change',update);noHover.addEventListener('change',update);return()=>{coarse.removeEventListener('change',update);noHover.removeEventListener('change',update);};},[]);
 return touch;
}
export function MobileControls({input,runtime,disabled=false}:{input:RefObject<PlayerInput>;runtime:RefObject<PlayerRuntime>;disabled?:boolean}){
 const router=useRouter();
 const joystick=useRef<{id:number;x:number;y:number;radius:number}|null>(null),look=useRef<{id:number;x:number;y:number}|null>(null),thumb=useRef<HTMLSpanElement>(null),dialog=useRef<HTMLDialogElement>(null);
 const [crouched,setCrouched]=useState(false),[prompt,setPrompt]=useState<PlayerRuntime['sitPrompt']>(null),[menu,setMenu]=useState(false),[settings,setSettings]=useState(false),[fullscreen,setFullscreen]=useState(false);
 const reset=useCallback(()=>{joystick.current=null;look.current=null;input.current.touchMovement={forward:0,right:0,running:false};input.current.jumpRequested=false;input.current.crouchRequested=false;input.current.interactRequested=false;input.current.keys.clear();input.current.active=false;if(thumb.current)thumb.current.style.transform='translate(0px,0px)';},[input]);
 useEffect(()=>{if(disabled)reset();},[disabled,reset]);
 useEffect(()=>{
  input.current.touchMode=true;input.current.touchMovement={forward:0,right:0,running:false};
  setFullscreen(!!document.fullscreenEnabled&&typeof document.documentElement.requestFullscreen==='function');
  const timer=setInterval(()=>{setPrompt(runtime.current.sitPrompt);setCrouched(runtime.current.crouchWeight>0||runtime.current.crouchWanted);},100);
  const hide=()=>{if(document.hidden)reset();};
  window.addEventListener(clearTouchEvent,reset);window.addEventListener('blur',reset);document.addEventListener('visibilitychange',hide);
  return()=>{clearInterval(timer);window.removeEventListener(clearTouchEvent,reset);window.removeEventListener('blur',reset);document.removeEventListener('visibilitychange',hide);reset();input.current.touchMode=false;input.current.inputBlocked=false;};
  // Input/runtime refs belong to this Explore session; the reset closure only uses refs.
 },[input,runtime,reset]);
 useEffect(()=>{if(menu&&!dialog.current?.open)dialog.current?.showModal();},[menu]);
 const activate=()=>{if(input.current.inputBlocked||input.current.inventoryOpen||document.querySelector('dialog[open]'))return false;input.current.active=true;return true;};
 const moveStick=(event:ReactPointerEvent<HTMLDivElement>)=>{
  const stick=joystick.current;if(!stick||stick.id!==event.pointerId)return;
  event.preventDefault();const dx=event.clientX-stick.x,dy=event.clientY-stick.y,length=Math.hypot(dx,dy),fraction=Math.min(1,length/stick.radius),magnitude=fraction<.13?0:(fraction-.13)/.87;
  input.current.touchMovement={right:length?dx/length*magnitude:0,forward:length?-dy/length*magnitude:0,running:fraction>=.9};
  if(thumb.current){const scale=length?Math.min(length,stick.radius)/length:0;thumb.current.style.transform=`translate(${dx*scale}px,${dy*scale}px)`;}
 };
 const releaseStick=(event:ReactPointerEvent<HTMLDivElement>)=>{if(joystick.current?.id!==event.pointerId)return;joystick.current=null;input.current.touchMovement={forward:0,right:0,running:false};if(thumb.current)thumb.current.style.transform='translate(0px,0px)';};
 const releaseLook=(event:ReactPointerEvent<HTMLDivElement>)=>{if(look.current?.id===event.pointerId)look.current=null;};
 const openMenu=()=>{reset();input.current.inputBlocked=true;setSettings(false);setMenu(true);};
 return <div className="touch-controls" data-touch-controls hidden={disabled} inert={disabled}>
  <div className="touch-look" aria-hidden="true" onPointerDown={event=>{if(event.pointerType==='mouse'||look.current||!canStartTouchLook(event.target,input.current,!!document.querySelector('dialog[open]'))||!activate())return;event.preventDefault();event.currentTarget.setPointerCapture(event.pointerId);look.current={id:event.pointerId,x:event.clientX,y:event.clientY};}} onPointerMove={event=>{
   const last=look.current;if(!last||last.id!==event.pointerId)return;if(input.current.inputBlocked||input.current.inventoryOpen){look.current=null;return;}event.preventDefault();
   const sensitivity=readMouseSensitivity()*4*(input.current.cameraView?input.current.cameraLookScale??1:1),camera=playerConfig.camera,dx=Math.max(-camera.maxMouseDelta,Math.min(camera.maxMouseDelta,event.clientX-last.x)),dy=Math.max(-camera.maxMouseDelta,Math.min(camera.maxMouseDelta,event.clientY-last.y));
   input.current.yaw=Math.atan2(Math.sin(input.current.yaw-dx*sensitivity),Math.cos(input.current.yaw-dx*sensitivity));input.current.pitch=Math.max(input.current.cameraView?-1.1:camera.minPitch,Math.min(input.current.cameraView?1.1:camera.maxPitch,input.current.pitch+dy*sensitivity));last.x=event.clientX;last.y=event.clientY;
  }} onPointerUp={releaseLook} onPointerCancel={releaseLook} onLostPointerCapture={releaseLook}/>
  <div className="touch-orientation" role="status"><svg width="64" height="64" viewBox="0 0 64 64" aria-hidden="true"><rect x="22" y="12" width="22" height="40" rx="3" fill="none" stroke="currentColor" strokeWidth="2" transform="rotate(25 33 32)"/><path d="M11 28A23 23 0 0 1 35 8M29 3L36 8 30 14M53 36A23 23 0 0 1 29 56M35 61L28 56 34 50" fill="none" stroke="currentColor" strokeWidth="2"/></svg><h2>Rotate your device</h2><p>BhaktapurXR is best experienced in landscape.</p></div>
  <button type="button" className="exploration-menu-trigger carved-window-control" aria-label="Open game menu" aria-haspopup="dialog" onClick={openMenu}><MenuWindowFrame compact/><span className="menu-window-label"><span aria-hidden="true">&#9776;</span> Menu</span></button>
  <div className="touch-joystick" role="group" aria-label="Movement joystick. Push farther to run." onPointerDown={event=>{if(event.pointerType==='mouse'||joystick.current||!activate())return;event.preventDefault();const rect=event.currentTarget.getBoundingClientRect();joystick.current={id:event.pointerId,x:rect.left+rect.width/2,y:rect.top+rect.height/2,radius:rect.width*.32};event.currentTarget.setPointerCapture(event.pointerId);moveStick(event);}} onPointerMove={moveStick} onPointerUp={releaseStick} onPointerCancel={releaseStick} onLostPointerCapture={releaseStick}><span className="touch-joystick-thumb" ref={thumb}/></div>
  <div className="touch-actions">
   <button type="button" className="touch-crouch" aria-label={crouched?'Stand from crouch':'Crouch'} aria-pressed={crouched} onPointerDown={event=>{event.preventDefault();if(activate()&&!input.current.sitting)input.current.crouchRequested=true;}} onClick={event=>{if(event.detail===0&&activate()&&!input.current.sitting)input.current.crouchRequested=true;}}><svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><circle cx="14" cy="4" r="2" fill="currentColor"/><path d="M13 8L9 12L14 16L10 21M10 12L5 16L3 21M12 9L17 12L21 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg><small>{crouched?'Stand':'Crouch'}</small></button>
   {prompt&&<button type="button" className="touch-action" onPointerDown={event=>{event.preventDefault();if(activate())input.current.interactRequested=true;}} onClick={event=>{if(event.detail===0&&activate())input.current.interactRequested=true;}}>{prompt==='sit'?'Sit':'Stand'}</button>}
   <button type="button" className="touch-jump" aria-label="Jump" onPointerDown={event=>{event.preventDefault();if(activate()&&!input.current.sitting&&!input.current.crouched)input.current.jumpRequested=true;}} onClick={event=>{if(event.detail===0&&activate()&&!input.current.sitting&&!input.current.crouched)input.current.jumpRequested=true;}}>Jump</button>
  </div>
  <dialog ref={dialog} className={`touch-pause${settings?' heritage-settings-dialog':''}`} aria-labelledby="touch-menu-title" onClose={()=>{reset();input.current.inputBlocked=false;setMenu(false);}}>
   <header className="touch-pause-header"><h2 id="touch-menu-title">{settings?'Settings':'BhaktapurXR'}</h2><p className="touch-pause-subtitle">{settings?'Preferences':'Paused'}</p></header>
   <div className="touch-pause-content">
   {settings?<GameSettings touch/>:<>
    <button type="button" onClick={()=>setSettings(true)}>Settings</button>
    {fullscreen&&<button type="button" onClick={()=>{if(document.fullscreenElement)void leaveMobilePresentation();else void enterMobilePresentation();}}>Fullscreen</button>}
    <Link className="touch-return" href="/" onClick={event=>{
     if(event.button!==0||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;
     event.preventDefault();reset();void leaveMobilePresentation().finally(()=>router.push('/'));
    }}>Return to Main Menu</Link>
   </>}
   </div>
   <footer className="touch-pause-actions">
    {settings&&<button type="button" onClick={()=>setSettings(false)}>Back</button>}
    <button type="button" className="touch-resume" onClick={()=>dialog.current?.close()}>Resume</button>
   </footer>
  </dialog>
 </div>;
}
