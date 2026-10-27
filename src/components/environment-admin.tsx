'use client';
import './admin-tools.css';
import {NpcAdminControls,NpcAdminPlacementPanel} from './npc-admin-controls';
import {npcAdmin} from '../game/npcs/admin-placement';
import {useEffect,useRef,type RefObject} from 'react';
import {useStore} from 'zustand';
import {environmentStore,type TimeMode,type NpcOverride} from '../game/world/time-of-day';
import type {PlayerInput} from '../game/input/player-input';

/** Mounted only in development. No persistence, authentication or production entry point. */
export function EnvironmentAdmin({input}:{input:RefObject<PlayerInput>}){
 const state=useStore(environmentStore),dialog=useRef<HTMLDialogElement>(null);
 useEffect(()=>{
  let previousBlocked=false,placementBlocked=false,openingAdmin=false;
  const close=()=>{input.current.inputBlocked=npcAdmin?.store.getState().placement?true:previousBlocked;};
  const key=(event:KeyboardEvent)=>{
   if(event.code==='Escape'&&npcAdmin?.store.getState().placement){event.preventDefault();event.stopImmediatePropagation();npcAdmin.setPlacement(false);return;}
   if(event.code!=='F8'||event.repeat)return;
   event.preventDefault();event.stopImmediatePropagation();
   if(dialog.current?.open){dialog.current.close();return;}
   if(npcAdmin?.store.getState().placement){openingAdmin=true;npcAdmin.setPlacement(false);openingAdmin=false;}
   if(document.querySelector('dialog[open]'))return;
   previousBlocked=npcAdmin?.store.getState().placement?placementBlocked:!!input.current.inputBlocked;input.current.inputBlocked=true;
   input.current.keys.clear();input.current.jumpRequested=false;input.current.interactRequested=false;input.current.active=false;
   if(document.pointerLockElement)void document.exitPointerLock();
   dialog.current?.showModal();
  };
  const unsubscribe=npcAdmin?.store.subscribe((s,previous)=>{
   if(s.placement&&!previous.placement){placementBlocked=dialog.current?.open?previousBlocked:!!input.current.inputBlocked;dialog.current?.close();input.current.inputBlocked=true;input.current.active=false;input.current.keys.clear();if(document.pointerLockElement)void document.exitPointerLock();}
   if(!s.placement&&previous.placement){previousBlocked=placementBlocked;input.current.inputBlocked=dialog.current?.open?true:placementBlocked;if(!openingAdmin&&!input.current.inputBlocked&&!document.querySelector('dialog[open]')){const canvas=document.querySelector('canvas');canvas?.focus({preventScroll:true});input.current.active=true;try{void Promise.resolve(canvas?.requestPointerLock?.()).catch(()=>{});}catch{/* Normal click-to-lock remains available. */}}}
  });
  const element=dialog.current;element?.addEventListener('close',close);
  document.addEventListener('keydown',key,true);
  return()=>{unsubscribe?.();document.removeEventListener('keydown',key,true);element?.removeEventListener('close',close);if(element?.open){element.close();close();}};
 },[input]);
 return <><NpcAdminPlacementPanel/><dialog ref={dialog} className="bx-admin" aria-labelledby="environment-admin-title" style={{position:'fixed',inset:'auto 16px 16px auto',margin:0,zIndex:1000}}>
  <header className="bx-admin-header"><div><h2 id="environment-admin-title">BhaktapurXR Admin / Debug</h2><small>Time {String(Math.floor(state.hour)).padStart(2,'0')}:{String(Math.floor(state.hour%1*60)).padStart(2,'0')}</small></div><button className="bx-admin-close" aria-label="Close Admin" onClick={()=>dialog.current?.close()}>&times;</button></header>
  <div className="bx-admin-body"><section className="bx-admin-section"><h3>TIME OF DAY</h3><div className="bx-admin-buttons">{(['AUTO','FORCED_DAY','FORCED_NIGHT'] as TimeMode[]).map((mode,i)=><button key={mode} aria-pressed={state.mode===mode} onClick={()=>state.setMode(mode)}>{['Auto','Day','Night'][i]}</button>)}</div></section>
  <section className="bx-admin-section"><h3>NPC BEHAVIOR</h3><div className="bx-admin-buttons">{(['AUTO','WALK','SIT'] as NpcOverride[]).map((mode,i)=><button key={mode} aria-pressed={state.npcs===mode} onClick={()=>state.setNpcs(mode)}>{['Auto','Force Walk','Force Sit'][i]}</button>)}</div><small>Force Sit seeks available seats through normal navigation.</small></section>
  <NpcAdminControls/></div><footer className="bx-admin-footer"><small>F8 / Esc to close</small></footer>
 </dialog></>;
}
