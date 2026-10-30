'use client';
import {PointerActionButton} from '../input/pointer-action-button';
import {useEffect,useRef,useState,type RefObject} from 'react';
import {useStore} from 'zustand';
import {inventoryItems,inventorySlots,type ItemSession} from './inventory-store';
import {InventoryItemIcon} from './inventory-item-icon';
import {clearTouchInput,itemActionLabel,useEquippedItem} from './touch-camera-actions';
import type {PlayerInput} from '../input/player-input';
import type {PlayerRuntime} from '../player/player-runtime';
export function MobileItemControls({session,input,runtime}:{session:ItemSession;input:RefObject<PlayerInput>;runtime:RefObject<PlayerRuntime>}){
 const state=useStore(session.inventory),dialog=useRef<HTMLDialogElement>(null),[cameraReady,setCameraReady]=useState(false);
 const item=inventorySlots[state.selected]??null,label=itemActionLabel(item);
 useEffect(()=>{if(state.expanded&&!dialog.current?.open)dialog.current?.showModal();else if(!state.expanded)dialog.current?.close();},[state.expanded]);
 useEffect(()=>{if(item!=='camera'){setCameraReady(false);return;}const update=()=>{const available=(runtime.current.handheldCamera?.hold??0)>=.99;setCameraReady(available);return available;};if(update())return;const timer=setInterval(()=>{if(update())clearInterval(timer);},100);return()=>clearInterval(timer);},[item,runtime]);
 const close=()=>{session.inventory.getState().close(false);input.current.inventoryOpen=false;clearTouchInput(input.current);dialog.current?.close();};
 const open=()=>{if(input.current.inputBlocked||document.querySelector('dialog[open]'))return;clearTouchInput(input.current,false);input.current.inventoryOpen=true;session.inventory.getState().open();};
 const use=()=>{if(document.querySelector('dialog[open]'))return;input.current.active=!input.current.inputBlocked;useEquippedItem(item,session,input.current,runtime.current);};
 return <>
  <aside className="inventory-hud inventory-mobile" data-gameplay-ui aria-label="Mobile inventory actions" onPointerDown={e=>e.stopPropagation()} onPointerUp={e=>e.stopPropagation()}>
   <PointerActionButton className="inventory-open" action={open} aria-label="Inventory"><svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 8h14l1 12H4L5 8Zm3 0V6a4 4 0 0 1 8 0v2M9 12v3m6-3v3" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg><small>Items</small></PointerActionButton>
   {label&&item&&<PointerActionButton disabled={item==='camera'&&!cameraReady} className="inventory-use" aria-label={item==='camera'?(cameraReady?'Enter Camera Mode':'Preparing camera'):'Use Bird Food'} action={use}><InventoryItemIcon icon={inventoryItems[item].icon}/><strong>{item==='camera'&&!cameraReady?'Preparing':label}</strong></PointerActionButton>}
  </aside>
  <dialog ref={dialog} className="inventory-touch-picker" data-gameplay-ui aria-labelledby="touch-inventory-title" onPointerDown={e=>e.stopPropagation()} onPointerUp={e=>e.stopPropagation()} onCancel={e=>{e.preventDefault();close();}} onClose={()=>{if(session.inventory.getState().expanded)close();}}>
   <header><h2 id="touch-inventory-title">Inventory</h2><PointerActionButton action={close} className="inventory-tray-close" aria-label="Close inventory"><span aria-hidden="true">&#215;</span></PointerActionButton></header>
   <div className="inventory-touch-slots">{inventorySlots.map((item,index)=><PointerActionButton key={index} className={item?'is-filled':'is-empty'} aria-pressed={state.selected===index} action={()=>{session.inventory.getState().select(index);close();}}>{item&&<InventoryItemIcon icon={inventoryItems[item].icon}/>}<span>{item?inventoryItems[item].label:'Empty'}</span></PointerActionButton>)}</div>
   <p>Tap an item to equip</p>
  </dialog>
 </>;
}
