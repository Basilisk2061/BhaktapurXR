'use client';
import {requestPhotograph} from './photograph';
import {CameraViewfinder} from './camera-viewfinder';
import {useEffect,useId,useRef,type RefObject} from 'react';
import {useStore} from 'zustand';
import {isEditableTarget,type PointerStatus,type PlayerInput} from '../input/player-input';
import type {PlayerRuntime} from '../player/player-runtime';
import {inventoryItems,inventorySlots,type ItemSession} from './inventory-store';
import {InventoryItemIcon} from './inventory-item-icon';
import './inventory.css';
export function InventoryHud({session,input,runtime,touch,pointerStatus}:{session:ItemSession;input:RefObject<PlayerInput>;runtime:RefObject<PlayerRuntime>;touch:boolean;pointerStatus:PointerStatus}){
 const state=useStore(session.inventory),cursor=useRef({x:0,y:0}),wheelId=useId();
 useEffect(()=>{
  const canvas=document.querySelector('canvas');if(!canvas)return;
  const modal=()=>!!document.querySelector('dialog[open],.game-menu[open]');
  const playable=()=>input.current.active&&!input.current.inputBlocked&&!input.current.inventoryOpen&&!runtime.current.bellAction&&!document.hidden&&!modal();
  const close=(commit:boolean,resume=true)=>{
   if(!session.inventory.getState().expanded)return;
   input.current.inventoryOpen=false;session.inventory.getState().close(commit);
   input.current.active=resume&&!input.current.inputBlocked&&!modal()&&!document.hidden&&(document.pointerLockElement===canvas||pointerStatus==='fallback');
  };
  const lowerCamera=()=>{if(runtime.current.handheldCamera)runtime.current.handheldCamera.using=false;};
  const useItem=()=>{const item=inventorySlots[session.inventory.getState().selected];if(!playable()||runtime.current.seat||runtime.current.bellAction||input.current.flying)return;if(item==='camera'){const held=runtime.current.handheldCamera;if(held?.wanted&&held.hold>=.99){if(held.using&&held.view>=.999)requestPhotograph(session.photography);else held.using=true;}}else if(item==='birdFood')session.food.request();};
  let pendingWheel=0;
  const openWheel=()=>{cursor.current={x:0,y:0};input.current.inventoryOpen=true;input.current.active=false;input.current.keys.clear();input.current.jumpRequested=false;input.current.interactRequested=false;session.inventory.getState().open();};
  const waitForLower=()=>{if(input.current.inputBlocked||document.hidden){pendingWheel=0;return;}if(input.current.cameraView)pendingWheel=requestAnimationFrame(waitForLower);else{pendingWheel=0;openWheel();}};
  const keyDown=(event:KeyboardEvent)=>{
   const expanded=session.inventory.getState().expanded;
   if(event.code==='Escape')lowerCamera();
   if(event.code==='Escape'&&expanded){close(false,false);return;}
   if((!expanded&&!playable())||isEditableTarget(event.target)||event.ctrlKey||event.metaKey||event.altKey)return;
   if(event.code==='Tab'){
    event.preventDefault();if(event.repeat||expanded||touch)return;
    lowerCamera();if(input.current.cameraView){pendingWheel=requestAnimationFrame(waitForLower);return;}openWheel();
   }
   const slot=/^Digit([1-5])$/.exec(event.code);if(slot&&!event.repeat){event.preventDefault();const index=Number(slot[1])-1;if(expanded)session.inventory.getState().highlight(index);session.inventory.getState().select(index);}
  };
  const keyUp=(event:KeyboardEvent)=>{if(event.code==='Tab'&&pendingWheel){cancelAnimationFrame(pendingWheel);pendingWheel=0;}if(event.code==='Tab'&&session.inventory.getState().expanded){event.preventDefault();close(true);}};
  const move=(event:MouseEvent)=>{
   if(!session.inventory.getState().expanded)return;
   if(input.current.inputBlocked||modal()){close(false,false);return;}
   if(document.pointerLockElement===canvas){cursor.current.x+=event.movementX;cursor.current.y+=event.movementY;const length=Math.hypot(cursor.current.x,cursor.current.y);if(length>140){cursor.current.x*=140/length;cursor.current.y*=140/length;}}
   else{cursor.current.x=event.clientX-window.innerWidth/2;cursor.current.y=event.clientY-window.innerHeight/2;}
   if(Math.hypot(cursor.current.x,cursor.current.y)>24){const angle=(Math.atan2(cursor.current.y,cursor.current.x)+Math.PI/2+Math.PI*2)%(Math.PI*2);session.inventory.getState().highlight(Math.round(angle/(Math.PI*2/5))%5);}else session.inventory.getState().highlight(-1);
  };
  let pending:{x:number;y:number;eligible:boolean;locked:boolean}|null=null;
  const down=(event:PointerEvent)=>{
   if(event.button===2&&input.current.cameraView){event.preventDefault();event.stopImmediatePropagation();lowerCamera();return;}
   if(event.button!==0||event.pointerType==='touch')return;
   const locked=document.pointerLockElement===canvas;
   pending={x:event.clientX,y:event.clientY,eligible:playable()&&(locked||pointerStatus==='fallback'),locked};
   if(pending.eligible&&locked){useItem();pending=null;}
  };
  const up=(event:PointerEvent)=>{if(pending?.eligible&&!pending.locked&&Math.hypot(event.clientX-pending.x,event.clientY-pending.y)<5)useItem();pending=null;};
  const reset=()=>{cancelAnimationFrame(pendingWheel);pendingWheel=0;pending=null;lowerCamera();close(false,false);};
  const visibility=()=>{if(document.hidden)reset();};
  const lock=()=>{if(session.inventory.getState().expanded&&document.pointerLockElement!==canvas)reset();};
  const unsubscribe=session.inventory.subscribe((next,previous)=>{if(next.selected!==previous.selected){const motion=runtime.current,item=inventorySlots[next.selected];motion.itemAction=null;
    const held=motion.handheldCamera??={wanted:false,using:false,hold:0,view:0,elapsed:0,pendingFood:false};
    held.using=false;held.wanted=item==='camera';if(held.wanted)held.elapsed=0;
    held.pendingFood=item==='birdFood'&&held.hold>0;motion.itemEquipRequested=item==='birdFood'&&!held.pendingFood;}});
  const context=(event:MouseEvent)=>{if(input.current.cameraView)event.preventDefault();};
  canvas.addEventListener('contextmenu',context);
  document.addEventListener('keydown',keyDown);document.addEventListener('keyup',keyUp);document.addEventListener('mousemove',move);canvas.addEventListener('pointerdown',down,true);document.addEventListener('pointerup',up);window.addEventListener('blur',reset);document.addEventListener('visibilitychange',visibility);document.addEventListener('pointerlockchange',lock);
  return()=>{canvas.removeEventListener('contextmenu',context);document.removeEventListener('keydown',keyDown);document.removeEventListener('keyup',keyUp);document.removeEventListener('mousemove',move);canvas.removeEventListener('pointerdown',down,true);document.removeEventListener('pointerup',up);window.removeEventListener('blur',reset);document.removeEventListener('visibilitychange',visibility);document.removeEventListener('pointerlockchange',lock);unsubscribe();reset();input.current.inventoryOpen=false;};
 },[session,input,runtime,pointerStatus,touch]);
 const item=inventorySlots[state.selected],selectedItem=item?inventoryItems[item]:null,highlighted=inventorySlots[state.highlighted],details=highlighted?inventoryItems[highlighted]:null;
 return <>
  <CameraViewfinder runtime={runtime} input={input} session={session} touch={touch}/>
  {state.expanded&&!touch&&<div className="inventory-wheel-screen" aria-label="Item selection wheel"><svg className="inventory-wheel" viewBox="-200 -200 400 400" role="group" aria-label="Five quick slots">{inventorySlots.map((item,index)=>{
   const point=(radius:number,angle:number)=>[Math.cos(angle)*radius,Math.sin(angle)*radius],angle=-Math.PI/2+index*Math.PI*2/5,start=angle-Math.PI/5+.025,end=angle+Math.PI/5-.025,a=point(180,start),b=point(180,end),c=point(85,end),d=point(85,start),label=point(132,angle),path=`M ${a} A 180 180 0 0 1 ${b} L ${c} A 85 85 0 0 0 ${d} Z`,clipId=`${wheelId}-slot-${index}`;
   return <g key={index} className={`inventory-segment${index===state.highlighted?' is-highlighted':''}${item?'':' is-empty'}`} aria-label={`Slot ${index+1}: ${item?inventoryItems[item].label:'Empty'}`}><defs><clipPath id={clipId}><path d={path}/></clipPath></defs><foreignObject x="-200" y="-200" width="400" height="400" clipPath={`url(#${clipId})`}><div className="inventory-wood"/></foreignObject><path className="inventory-segment-shadow" d={path}/><path className="inventory-segment-edge" d={path}/>{item&&<InventoryItemIcon icon={inventoryItems[item].icon} x={label[0]-12} y={label[1]-44} width={24} height={24}/>}<text x={label[0]} y={label[1]-5} textAnchor="middle">{index+1}</text><text x={label[0]} y={label[1]+15} textAnchor="middle" className="inventory-slot-label">{item?inventoryItems[item].label:'Empty'}</text></g>;
  })}<circle r="80" className="inventory-wheel-ring"/><circle r="74" className="inventory-wheel-center"/><foreignObject x="-73" y="-73" width="146" height="146"><div className="inventory-wheel-details" aria-live="polite">
   {details&&<InventoryItemIcon icon={details.icon} className="inventory-detail-icon"/>}<strong>{details?.label??(state.highlighted<0?'Inventory':'Empty')}</strong><p>{details?.description??(state.highlighted<0?'Move the mouse to choose an item.':'No item assigned.')}</p>{state.highlighted>=0&&<small>Slot {state.highlighted+1}</small>}{details&&<span className="inventory-detail-action">{details.actionHint}</span>}
  </div></foreignObject></svg><p>Move mouse to choose · Release Tab to equip · 1–5 select</p></div>}
  {!state.expanded&&selectedItem&&<aside className={`inventory-selected${touch?' inventory-selected-touch':''}`} aria-label="Selected item"><InventoryItemIcon icon={selectedItem.icon}/><span>{selectedItem.label}</span></aside>}
  {touch&&<aside className="inventory-hud" aria-label="Mobile inventory actions">
   {touch&&<div className="inventory-touch-actions"><button type="button" onClick={()=>{if(!input.current.inputBlocked&&!document.querySelector('dialog[open]')){input.current.active=true;state.select((state.selected+1)%5);}}}>Item</button>{item&&<button type="button" onClick={()=>{if(!input.current.inputBlocked&&!runtime.current.bellAction&&!runtime.current.seat&&!input.current.flying&&!document.querySelector('dialog[open]')){input.current.active=true;if(item==='camera'){const held=runtime.current.handheldCamera;if(held&&held.hold>=.99)held.using=!held.using;}else session.food.request();}}}>{item==='camera'?'Use / Lower Camera':'Throw grain'}</button>}</div>}
  </aside>}
 </>;
}
