'use client';
import {useEffect,useRef,type RefObject} from 'react';
import {useStore} from 'zustand';
import {isEditableTarget,type PointerStatus,type PlayerInput} from '../input/player-input';
import type {PlayerRuntime} from '../player/player-runtime';
import {inventoryItems,inventorySlots,type ItemSession} from './inventory-store';
import './inventory.css';
export function InventoryHud({session,input,runtime,touch,pointerStatus}:{session:ItemSession;input:RefObject<PlayerInput>;runtime:RefObject<PlayerRuntime>;touch:boolean;pointerStatus:PointerStatus}){
 const state=useStore(session.inventory),cursor=useRef({x:0,y:0});
 useEffect(()=>{
  const canvas=document.querySelector('canvas');if(!canvas)return;
  const modal=()=>!!document.querySelector('dialog[open],.game-menu[open]');
  const playable=()=>input.current.active&&!input.current.inputBlocked&&!input.current.inventoryOpen&&!runtime.current.bellAction&&!document.hidden&&!modal();
  const close=(commit:boolean,resume=true)=>{
   if(!session.inventory.getState().expanded)return;
   input.current.inventoryOpen=false;session.inventory.getState().close(commit);
   input.current.active=resume&&!input.current.inputBlocked&&!modal()&&!document.hidden&&(document.pointerLockElement===canvas||pointerStatus==='fallback');
  };
  const useItem=()=>{const item=inventorySlots[session.inventory.getState().selected];if(playable()&&!runtime.current.seat&&!input.current.flying&&item&&inventoryItems[item].action==='throwGrain')session.food.request();};
  const keyDown=(event:KeyboardEvent)=>{
   const expanded=session.inventory.getState().expanded;
   if(event.code==='Escape'&&expanded){close(false,false);return;}
   if((!expanded&&!playable())||isEditableTarget(event.target)||event.ctrlKey||event.metaKey||event.altKey)return;
   if(event.code==='Tab'){
    event.preventDefault();if(event.repeat||expanded||touch)return;
    cursor.current={x:0,y:0};input.current.inventoryOpen=true;input.current.active=false;input.current.keys.clear();input.current.jumpRequested=false;input.current.interactRequested=false;session.inventory.getState().open();
   }
   const slot=/^Digit([1-5])$/.exec(event.code);if(slot&&!event.repeat){event.preventDefault();const index=Number(slot[1])-1;if(expanded)session.inventory.getState().highlight(index);session.inventory.getState().select(index);}
  };
  const keyUp=(event:KeyboardEvent)=>{if(event.code==='Tab'&&session.inventory.getState().expanded){event.preventDefault();close(true);}};
  const move=(event:MouseEvent)=>{
   if(!session.inventory.getState().expanded)return;
   if(input.current.inputBlocked||modal()){close(false,false);return;}
   if(document.pointerLockElement===canvas){cursor.current.x+=event.movementX;cursor.current.y+=event.movementY;const length=Math.hypot(cursor.current.x,cursor.current.y);if(length>140){cursor.current.x*=140/length;cursor.current.y*=140/length;}}
   else{cursor.current.x=event.clientX-window.innerWidth/2;cursor.current.y=event.clientY-window.innerHeight/2;}
   if(Math.hypot(cursor.current.x,cursor.current.y)>24){const angle=(Math.atan2(cursor.current.y,cursor.current.x)+Math.PI/2+Math.PI*2)%(Math.PI*2);session.inventory.getState().highlight(Math.round(angle/(Math.PI*2/5))%5);}
  };
  let pending:{x:number;y:number;eligible:boolean;locked:boolean}|null=null;
  const down=(event:PointerEvent)=>{
   if(event.button!==0||event.pointerType==='touch')return;
   const locked=document.pointerLockElement===canvas;
   pending={x:event.clientX,y:event.clientY,eligible:playable()&&(locked||pointerStatus==='fallback'),locked};
   if(pending.eligible&&locked){useItem();pending=null;}
  };
  const up=(event:PointerEvent)=>{if(pending?.eligible&&!pending.locked&&Math.hypot(event.clientX-pending.x,event.clientY-pending.y)<5)useItem();pending=null;};
  const reset=()=>{pending=null;close(false,false);};
  const visibility=()=>{if(document.hidden)reset();};
  const lock=()=>{if(session.inventory.getState().expanded&&document.pointerLockElement!==canvas)reset();};
  const unsubscribe=session.inventory.subscribe((next,previous)=>{if(next.selected!==previous.selected){runtime.current.itemAction=null;runtime.current.itemEquipRequested=inventorySlots[next.selected]==='birdFood';}});
  document.addEventListener('keydown',keyDown);document.addEventListener('keyup',keyUp);document.addEventListener('mousemove',move);canvas.addEventListener('pointerdown',down,true);document.addEventListener('pointerup',up);window.addEventListener('blur',reset);document.addEventListener('visibilitychange',visibility);document.addEventListener('pointerlockchange',lock);
  return()=>{document.removeEventListener('keydown',keyDown);document.removeEventListener('keyup',keyUp);document.removeEventListener('mousemove',move);canvas.removeEventListener('pointerdown',down,true);document.removeEventListener('pointerup',up);window.removeEventListener('blur',reset);document.removeEventListener('visibilitychange',visibility);document.removeEventListener('pointerlockchange',lock);unsubscribe();reset();input.current.inventoryOpen=false;};
 },[session,input,runtime,pointerStatus,touch]);
 const item=inventorySlots[state.selected],label=item?inventoryItems[item].label:'Empty',highlighted=inventorySlots[state.highlighted];
 return <>
  {state.expanded&&!touch&&<div className="inventory-wheel-screen" aria-label="Item selection wheel"><svg className="inventory-wheel" viewBox="-200 -200 400 400" role="group" aria-label="Five quick slots">{inventorySlots.map((item,index)=>{
   const point=(radius:number,angle:number)=>[Math.cos(angle)*radius,Math.sin(angle)*radius],angle=-Math.PI/2+index*Math.PI*2/5,start=angle-Math.PI/5+.025,end=angle+Math.PI/5-.025,a=point(180,start),b=point(180,end),c=point(85,end),d=point(85,start),label=point(132,angle);
   return <g key={index} className={`inventory-segment${index===state.highlighted?' is-highlighted':''}`} aria-label={`Slot ${index+1}: ${item?inventoryItems[item].label:'Empty'}`}><path d={`M ${a} A 180 180 0 0 1 ${b} L ${c} A 85 85 0 0 0 ${d} Z`}/><text x={label[0]} y={label[1]-5} textAnchor="middle">{index+1}{item?' · ⁙':''}</text><text x={label[0]} y={label[1]+15} textAnchor="middle" className="inventory-slot-label">{item?inventoryItems[item].label:'Empty'}</text></g>;
  })}<circle r="79" className="inventory-wheel-center"/><text textAnchor="middle" y="-17" className="inventory-center-number">{state.highlighted+1}</text><text textAnchor="middle" y="5" className="inventory-center-title">{highlighted?inventoryItems[highlighted].label:'Empty'}</text><text textAnchor="middle" y="24" className="inventory-center-hint">{highlighted?'Throw grain for pigeons':'No item equipped'}</text></svg><p>Move mouse to choose · Release Tab to equip · 1–5 select</p></div>}
  <aside className={`inventory-hud${touch?' inventory-touch':''}`} aria-label="Quick inventory">
   {!state.expanded&&<div className="inventory-active"><kbd>{state.selected+1}</kbd> {label}<small>{touch?'Items':'Hold Tab · 1–5 select'}{item&&!touch?' · Click to throw grain':''}</small></div>}
   {touch&&<div className="inventory-touch-actions"><button type="button" onClick={()=>{if(!input.current.inputBlocked&&!document.querySelector('dialog[open]')){input.current.active=true;state.select((state.selected+1)%5);}}}>Item</button>{item&&<button type="button" onClick={()=>{if(!input.current.inputBlocked&&!runtime.current.bellAction&&!runtime.current.seat&&!input.current.flying&&!document.querySelector('dialog[open]')){input.current.active=true;session.food.request();}}}>Throw grain</button>}</div>}
  </aside>
 </>;
}
