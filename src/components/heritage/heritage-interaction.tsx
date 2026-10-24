"use client";
import {useEffect,useMemo,useRef,type RefObject} from "react";
import {useStore} from "zustand";
import type {TransformOverrides} from "../../features/world-editor/transforms";
import {gameplayCodes,isEditableTarget,type PlayerInput} from "../../game/input/player-input";
import type {PlayerRuntime} from "../../game/player/player-runtime";
import {heritageLandmarks} from "../../game/heritage/landmarks";
import {heritageInteractionZones,nearestHeritageZone} from "../../game/heritage/interactions";
import {createHeritageStore} from "../../game/heritage/store";
import {setHeritageLanguage,useHeritageLanguage} from "../../game/heritage/language";
import {heritageLabels} from "../../game/heritage/localization";
import {HeritagePanel} from "./heritage-panel";
import "./heritage.css";

export function HeritageInteraction({input,runtime,overrides,touch,onOpenChange}:{input:RefObject<PlayerInput>;runtime:RefObject<PlayerRuntime>;overrides?:TransformOverrides;touch:boolean;onOpenChange:(open:boolean)=>void}){
 const language=useHeritageLanguage(),labels=heritageLabels(language);
 const store=useMemo(()=>createHeritageStore(),[]),zones=useMemo(()=>heritageInteractionZones(overrides),[overrides]);
 const nearest=useStore(store,s=>s.nearest),openId=useStore(store,s=>s.openId);
 const dialog=useRef<HTMLDialogElement>(null),actions=useRef({open:()=>{},close:()=>{}});
 useEffect(()=>{
  const controls=input.current,held=new Set<string>();let previousFocus:HTMLElement|null=null,wasActive=false;
  const clear=()=>{controls.keys.clear();controls.jumpRequested=false;controls.interactRequested=false;controls.lastSpacePress=null;controls.active=false;if(controls.touchMovement)controls.touchMovement={forward:0,right:0,running:false};};
  const poll=()=>{
   if(store.getState().openId)return;
   const blocked=controls.inputBlocked||document.hidden||!!document.querySelector('dialog[open], .game-menu[open]');
   store.getState().setNearest(blocked?null:nearestHeritageZone(runtime.current.nextPosition,zones,id=>!!heritageLandmarks[id]));
  };
  const open=()=>{
   poll();const zone=store.getState().nearest;
   if(!zone||controls.inputBlocked||store.getState().openId||document.querySelector('dialog[open]'))return;
   previousFocus=document.activeElement instanceof HTMLElement?document.activeElement:null;wasActive=controls.active;
   for(const key of controls.keys)held.add(key);
   controls.inputBlocked=true;clear();runtime.current.velocity.x=0;runtime.current.velocity.z=0;
   if(controls.flying)runtime.current.velocity.y=0;
   if(document.pointerLockElement)document.exitPointerLock();
   store.getState().open(zone.heritageId);onOpenChange(true);
  };
  const close=()=>{
   if(!store.getState().openId)return;
   clear();controls.inputBlocked=false;store.getState().close();onOpenChange(false);
   dialog.current?.close();
   const canvas=document.querySelector('canvas');
   if(!controls.touchMode&&wasActive&&canvas){canvas.focus({preventScroll:true});controls.active=true;}
   else if(previousFocus?.isConnected)previousFocus.focus({preventScroll:true});
   poll();
  };
  actions.current={open,close};
  const keyDown=(event:KeyboardEvent)=>{
   if(held.has(event.code)){event.preventDefault();event.stopImmediatePropagation();return;}
   if(store.getState().openId){
    if(event.code==='Escape'){event.preventDefault();event.stopImmediatePropagation();held.add(event.code);close();}
    else if(gameplayCodes.has(event.code)&&(event.code!=='Space'||!isEditableTarget(event.target))){held.add(event.code);event.preventDefault();event.stopImmediatePropagation();}
    return;
   }
   if(event.code!=='KeyE'||event.repeat||event.ctrlKey||event.altKey||event.metaKey||!controls.active||isEditableTarget(event.target))return;
   poll();if(!store.getState().nearest)return;
   event.preventDefault();event.stopImmediatePropagation();held.add(event.code);open();
  };
  const keyUp=(event:KeyboardEvent)=>{if(held.delete(event.code)){event.preventDefault();event.stopImmediatePropagation();controls.keys.delete(event.code);}};
  const blur=()=>{held.clear();clear();};
  const timer=window.setInterval(poll,100);poll();
  document.addEventListener('keydown',keyDown,true);document.addEventListener('keyup',keyUp,true);window.addEventListener('blur',blur);
  return()=>{clearInterval(timer);document.removeEventListener('keydown',keyDown,true);document.removeEventListener('keyup',keyUp,true);window.removeEventListener('blur',blur);if(store.getState().openId){clear();controls.inputBlocked=false;onOpenChange(false);}actions.current={open:()=>{},close:()=>{}};};
 },[input,runtime,zones,store,onOpenChange]);
 useEffect(()=>{if(openId&&!dialog.current?.open)dialog.current?.showModal();},[openId]);
 const record=openId?heritageLandmarks[openId]:null;
 return <>
  {!openId&&nearest&&<button type="button" className={`heritage-prompt${touch?' heritage-prompt-touch':''}`} aria-label={`Explore history: ${heritageLandmarks[nearest.heritageId]?.name??nearest.label??'Landmark'}`} aria-haspopup="dialog" aria-controls="heritage-panel" onClick={()=>actions.current.open()}>{!touch&&<kbd>E</kbd>}<span className="heritage-prompt-copy"><span>Explore History</span><strong>{heritageLandmarks[nearest.heritageId]?.name??nearest.label??'Landmark'}</strong></span></button>}
  <dialog ref={dialog} id="heritage-panel" className="heritage-dialog" lang={language} aria-labelledby="heritage-title" onCancel={event=>{event.preventDefault();actions.current.close();}} onClose={()=>actions.current.close()}>
   <div className="heritage-toolbar"><span>BhaktapurXR / {labels.heritage}</span>
    <div className="heritage-language" role="group" aria-label={labels.language}>
     <button type="button" lang="en" aria-label="Read the heritage book in English" aria-pressed={language==="en"} onClick={()=>setHeritageLanguage("en")}>English</button>
     <span aria-hidden="true">|</span>
     <button type="button" lang="ne" aria-label="सम्पदा पुस्तक नेपालीमा पढ्नुहोस्" aria-pressed={language==="ne"} onClick={()=>setHeritageLanguage("ne")}>नेपाली</button>
    </div>
    <button type="button" className="heritage-close" aria-label={labels.closeLabel} onClick={()=>actions.current.close()}>{labels.close} <span aria-hidden="true">&#215;</span></button></div>
   {record&&<HeritagePanel key={record.id} record={record} language={language}/>}
  </dialog>
 </>;
}
