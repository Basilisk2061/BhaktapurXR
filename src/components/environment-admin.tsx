'use client';
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
  let previousBlocked=false,placementBlocked=false;
  const close=()=>{input.current.inputBlocked=npcAdmin?.store.getState().placement?true:previousBlocked;};
  const key=(event:KeyboardEvent)=>{
   if(event.code!=='F8'||event.repeat)return;
   event.preventDefault();event.stopImmediatePropagation();
   if(dialog.current?.open){dialog.current.close();return;}
   if(document.querySelector('dialog[open]'))return;
   previousBlocked=npcAdmin?.store.getState().placement?placementBlocked:!!input.current.inputBlocked;input.current.inputBlocked=true;
   input.current.keys.clear();input.current.jumpRequested=false;input.current.interactRequested=false;input.current.active=false;
   if(document.pointerLockElement)void document.exitPointerLock();
   dialog.current?.showModal();
  };
  const unsubscribe=npcAdmin?.store.subscribe((s,previous)=>{
   if(s.placement&&!previous.placement){placementBlocked=dialog.current?.open?previousBlocked:!!input.current.inputBlocked;dialog.current?.close();input.current.inputBlocked=true;input.current.active=false;input.current.keys.clear();if(document.pointerLockElement)void document.exitPointerLock();}
   if(!s.placement&&previous.placement){previousBlocked=placementBlocked;input.current.inputBlocked=dialog.current?.open?true:placementBlocked;}
  });
  const element=dialog.current;element?.addEventListener('close',close);
  document.addEventListener('keydown',key,true);
  return()=>{unsubscribe?.();document.removeEventListener('keydown',key,true);element?.removeEventListener('close',close);if(element?.open){element.close();close();}};
 },[input]);
 return <><NpcAdminPlacementPanel/><dialog ref={dialog} aria-labelledby="environment-admin-title" style={{position:'fixed',inset:'auto 16px 16px auto',margin:0,maxWidth:'calc(100vw - 32px)',maxHeight:'85dvh',overflow:'auto',padding:20,background:'#202824',color:'#f4f0df',border:'1px solid #879080',borderRadius:6,zIndex:1000}}>
  <h2 id="environment-admin-title">BhaktapurXR Admin / Debug</h2>
  <p>Environment · Time: {String(Math.floor(state.hour)).padStart(2,'0')}:{String(Math.floor(state.hour%1*60)).padStart(2,'0')}</p>
  <fieldset><legend>Time of day</legend>{(['AUTO','FORCED_DAY','FORCED_NIGHT'] as TimeMode[]).map((mode,i)=><button key={mode} aria-pressed={state.mode===mode} onClick={()=>state.setMode(mode)} style={{padding:10,border:state.mode===mode?'2px solid #e4bf77':'2px solid transparent'}}>{['Auto','Day','Night'][i]}</button>)}</fieldset>
  <fieldset><legend>NPC behavior</legend>{(['AUTO','WALK','SIT'] as NpcOverride[]).map((mode,i)=><button key={mode} aria-pressed={state.npcs===mode} onClick={()=>state.setNpcs(mode)} style={{padding:10,border:state.npcs===mode?'2px solid #e4bf77':'2px solid transparent'}}>{['Auto','Force Walk','Force Sit'][i]}</button>)}</fieldset>
  <NpcAdminControls/>
  <p>Force Sit seeks available seats through normal navigation.</p>
  <button style={{padding:10}} onClick={()=>dialog.current?.close()}>Close (F8 / Esc)</button>
 </dialog></>;
}
