'use client';
import {useEffect,type RefObject} from 'react';
import {useStore} from 'zustand';
import {isEditableTarget,type PointerStatus,type PlayerInput} from '../input/player-input';
import type {PlayerRuntime} from '../player/player-runtime';
import {inventoryItems,inventorySlots,type ItemSession} from './inventory-store';
import './inventory.css';
export function InventoryHud({session,input,runtime,touch,pointerStatus}:{session:ItemSession;input:RefObject<PlayerInput>;runtime:RefObject<PlayerRuntime>;touch:boolean;pointerStatus:PointerStatus}){
 const state=useStore(session.inventory);
 useEffect(()=>{
  const canvas=document.querySelector('canvas');if(!canvas)return;
  const playable=()=>input.current.active&&!input.current.inputBlocked&&!runtime.current.bellAction&&!document.hidden&&!document.querySelector('dialog[open],.game-menu[open]');
  const useItem=()=>{const item=inventorySlots[session.inventory.getState().selected];if(playable()&&!runtime.current.seat&&!input.current.flying&&item&&inventoryItems[item].action==='throwGrain')session.food.request();};
  const keyDown=(event:KeyboardEvent)=>{
   if(!playable()||isEditableTarget(event.target)||event.ctrlKey||event.metaKey||event.altKey)return;
   if(event.code==='Tab'){event.preventDefault();session.inventory.getState().expand(true);}
   const slot=/^Digit([1-5])$/.exec(event.code);if(slot&&!event.repeat){event.preventDefault();session.inventory.getState().select(Number(slot[1])-1);}
  };
  const keyUp=(event:KeyboardEvent)=>{if(event.code==='Tab'){if(session.inventory.getState().expanded)event.preventDefault();session.inventory.getState().expand(false);}};
  let pending:{x:number;y:number;eligible:boolean;locked:boolean}|null=null;
  const down=(event:PointerEvent)=>{
   if(event.button!==0||event.pointerType==='touch')return;
   const locked=document.pointerLockElement===canvas;
   // Capture-phase read precedes the existing camera's activation handler.
   pending={x:event.clientX,y:event.clientY,eligible:playable()&&(locked||pointerStatus==='fallback'),locked};
   if(pending.eligible&&locked){useItem();pending=null;}
  };
  const up=(event:PointerEvent)=>{if(pending?.eligible&&!pending.locked&&Math.hypot(event.clientX-pending.x,event.clientY-pending.y)<5)useItem();pending=null;};
  const reset=()=>{pending=null;session.inventory.getState().expand(false);};
  const visibility=()=>{if(document.hidden)reset();};
  document.addEventListener('keydown',keyDown);document.addEventListener('keyup',keyUp);canvas.addEventListener('pointerdown',down,true);document.addEventListener('pointerup',up);window.addEventListener('blur',reset);document.addEventListener('visibilitychange',visibility);
  return()=>{document.removeEventListener('keydown',keyDown);document.removeEventListener('keyup',keyUp);canvas.removeEventListener('pointerdown',down,true);document.removeEventListener('pointerup',up);window.removeEventListener('blur',reset);document.removeEventListener('visibilitychange',visibility);reset();};
 },[session,input,runtime,pointerStatus]);
 const item=inventorySlots[state.selected],label=item?inventoryItems[item].label:'Empty';
 return <aside className={`inventory-hud${touch?' inventory-touch':''}`} aria-label="Quick inventory">
  {state.expanded?<div className="inventory-slots">{inventorySlots.map((item,index)=><button type="button" key={index} aria-pressed={index===state.selected} onClick={()=>state.select(index)}><kbd>{index+1}</kbd>{item&&<span className="grain-icon" aria-hidden="true">⁙</span>}<span>{item?inventoryItems[item].label:'Empty'}</span></button>)}</div>:<div className="inventory-active"><kbd>{state.selected+1}</kbd> {label}<small>{touch?'Items':'Hold Tab · 1–5 select'}{item&&!touch?' · Click to throw grain':''}</small></div>}
  {touch&&<div className="inventory-touch-actions"><button type="button" onClick={()=>state.select((state.selected+1)%5)}>Item</button>{item&&<button type="button" onClick={()=>{if(!input.current.inputBlocked&&!runtime.current.bellAction&&!runtime.current.seat&&!input.current.flying&&!document.querySelector('dialog[open]')){input.current.active=true;session.food.request();}}}>Throw grain</button>}</div>}
 </aside>;
}
