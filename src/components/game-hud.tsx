"use client";
import Link from 'next/link';
import {useEffect,useRef,useState,type RefObject} from 'react';
import {gameplayCodes,isEditableTarget,type PlayerInput,type PointerStatus} from '../game/input/player-input';
import {MouseSensitivitySettings} from './mouse-sensitivity-settings';
import {GraphicsQualitySettings} from './graphics-quality-settings';
import './exploration-menu.css';
export function GameHud({ready,pointerStatus,input}:{ready:boolean;pointerStatus:PointerStatus;input:RefObject<PlayerInput>}){
 const [hintVisible,setHintVisible]=useState(true),[menu,setMenu]=useState(false);
 const dialog=useRef<HTMLDialogElement>(null),previousFocus=useRef<HTMLElement|null>(null);
 useEffect(()=>{if(!ready)return;const timer=setTimeout(()=>setHintVisible(false),pointerStatus==='locked'?3500:12000);return()=>clearTimeout(timer);},[ready,pointerStatus]);
 const clear=()=>{const controls=input.current;controls.keys.clear();controls.jumpRequested=false;controls.interactRequested=false;controls.lastSpacePress=null;controls.active=false;};
 const close=()=>{clear();input.current.inputBlocked=false;setMenu(false);dialog.current?.close();previousFocus.current?.focus({preventScroll:true});};
 useEffect(()=>{
  if(!menu)return;
  dialog.current?.showModal();
  const key=(event:KeyboardEvent)=>{if(event.code==='Escape')return;if(gameplayCodes.has(event.code)&&!isEditableTarget(event.target)){event.stopImmediatePropagation();if(event.code!=='Space')event.preventDefault();}};
  const release=(event:KeyboardEvent)=>{input.current.keys.delete(event.code);};
  document.addEventListener('keydown',key,true);document.addEventListener('keyup',release,true);
  return()=>{document.removeEventListener('keydown',key,true);document.removeEventListener('keyup',release,true);input.current.inputBlocked=false;};
 },[menu,input]);
 if(!ready)return null;
 return <div className="game-hud">
  <button type="button" className="exploration-menu-trigger" aria-haspopup="dialog" aria-label="Open game menu" onClick={()=>{previousFocus.current=document.activeElement instanceof HTMLElement?document.activeElement:null;clear();input.current.inputBlocked=true;if(document.pointerLockElement)void document.exitPointerLock();setMenu(true);}}><span aria-hidden="true">&#9776;</span> Menu</button>
  <dialog ref={dialog} className="exploration-pause" aria-labelledby="desktop-game-menu-title" onCancel={event=>{event.preventDefault();close();}} onClose={()=>{if(menu)close();}}>
   <h2 id="desktop-game-menu-title">BhaktapurXR</h2><button type="button" onClick={close}>Resume</button>
   <GraphicsQualitySettings/><MouseSensitivitySettings/>
   <Link href="/" onClick={()=>{clear();input.current.inputBlocked=false;}}>Return to Main Menu</Link>
  </dialog>
  {hintVisible&&<p className="game-control-hint" role="status">{pointerStatus==='fallback'?'Drag to look':'Click to look'}<span>WASD &middot; Move &nbsp; Shift &middot; Run &nbsp; Space &middot; Jump &nbsp; Esc &middot; Release</span></p>}
 </div>;
}
