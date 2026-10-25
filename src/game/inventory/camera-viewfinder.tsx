'use client';
import {useEffect,useRef,useState,type RefObject} from 'react';
import {useStore} from 'zustand';
import type {PlayerRuntime} from '../player/player-runtime';
import type {PlayerInput} from '../input/player-input';
import {isEditableTarget} from '../input/player-input';
import type {ItemSession} from './inventory-store';
import {apertures,shutters,sensitivities} from './photography-settings';
export function CameraViewfinder({runtime,input,session,touch}:{runtime:RefObject<PlayerRuntime>;input:RefObject<PlayerInput>;session:ItemSession;touch:boolean}){
 const settings=useStore(session.photography),[active,setActive]=useState(false),last=useRef(false);
 useEffect(()=>{if(!settings.focusUntil)return;const timer=setTimeout(()=>session.photography.setState({focusUntil:0}),Math.max(0,settings.focusUntil-Date.now()));return()=>clearTimeout(timer);},[settings.focusUntil,session]);
 useEffect(()=>{
  runtime.current.photography=session.photography;
  let frame=0;const update=()=>{const enabled=(runtime.current.handheldCamera?.view??0)>=.95;if(last.current!==enabled){last.current=enabled;setActive(enabled);}document.documentElement.toggleAttribute('data-camera-viewfinder',(runtime.current.handheldCamera?.view??0)>0);frame=requestAnimationFrame(update);};frame=requestAnimationFrame(update);
  const ready=()=>input.current.cameraView&&!input.current.inputBlocked&&!input.current.inventoryOpen;
  const key=(e:KeyboardEvent)=>{
   if(!ready()||isEditableTarget(e.target)||e.ctrlKey||e.metaKey||e.altKey)return;
   if(e.code==='KeyE'){e.preventDefault();e.stopImmediatePropagation();return;}
   const s=session.photography.getState();if(!['KeyG','KeyF','KeyM','KeyC','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code))return;
   if(e.code.startsWith('Arrow')&&!s.panel)return;e.preventDefault();e.stopImmediatePropagation();if(e.repeat&&!e.code.startsWith('Arrow'))return;
   if(e.code==='KeyG')session.photography.setState({grid:!s.grid});
   if(e.code==='KeyC')session.photography.setState({panel:!s.panel});
   if(e.code==='KeyM')session.photography.setState({manual:!s.manual});
   if(e.code==='KeyF')session.photography.setState({focusRequested:true});
   if(e.code==='ArrowUp'||e.code==='ArrowDown')session.photography.setState({row:(s.row+(e.code==='ArrowDown'?1:4))%5});
   if(e.code==='ArrowLeft'||e.code==='ArrowRight'){
    const d=e.code==='ArrowRight'?1:-1,clamp=(n:number,min:number,max:number)=>Math.max(min,Math.min(max,n));
    if(s.row===3)session.photography.setState({ev:clamp(s.ev+d*.5,-3,3)});
    if(!s.manual)return;
    if(s.row===0)session.photography.setState({aperture:clamp(s.aperture+d,0,apertures.length-1)});
    if(s.row===1)session.photography.setState({shutter:clamp(s.shutter+d,0,shutters.length-1)});
    if(s.row===2)session.photography.setState({iso:clamp(s.iso+d,0,sensitivities.length-1)});
    if(s.row===4)session.photography.setState({focus:clamp(s.focus*2**(d/4),.3,500),manualFocus:true});
   }
  };
  const wheel=(e:WheelEvent)=>{if(!ready())return;e.preventDefault();e.stopImmediatePropagation();const s=session.photography.getState();session.photography.setState({focal:Math.max(24,Math.min(135,s.focal*Math.exp(Math.max(-100,Math.min(100,e.deltaY))*.002)))});};
  const lower=(e:PointerEvent)=>{if(e.button!==2||!ready())return;e.preventDefault();e.stopImmediatePropagation();if(runtime.current.handheldCamera)runtime.current.handheldCamera.using=false;};
  const context=(e:MouseEvent)=>{if(ready())e.preventDefault();};
  document.addEventListener('pointerdown',lower,true);document.addEventListener('contextmenu',context,true);
  document.addEventListener('keydown',key,true);document.addEventListener('wheel',wheel,{passive:false,capture:true});
  return()=>{cancelAnimationFrame(frame);document.documentElement.removeAttribute('data-camera-viewfinder');document.removeEventListener('pointerdown',lower,true);document.removeEventListener('contextmenu',context,true);document.removeEventListener('keydown',key,true);document.removeEventListener('wheel',wheel,true);};
 },[runtime,input,session]);
 const f=settings.manual?apertures[settings.aperture]:4,t=settings.manual?shutters[settings.shutter]:125,iso=settings.manual?sensitivities[settings.iso]:100;
 const focus=`${settings.manualFocus?'MF':'AF'} ${settings.focus.toFixed(1)}m`,rows=[`Aperture  F${f.toFixed(1)}`,`Shutter  1/${t}`,`ISO  ${iso}`,`EV  ${settings.ev>=0?'+':''}${settings.ev.toFixed(1)}`,`Focus  ${focus}`];
 return <div hidden={!active} className="camera-viewfinder" aria-label="Photography viewfinder">
  <span className="camera-mode-label">{settings.manual?'M':'AUTO'} <small>{Math.round(settings.focal)}mm</small></span>
  <i className={`camera-focus${settings.focusUntil>Date.now()?' is-focused':''}`}/><div className="camera-frame"/>
  {settings.grid&&<div className="camera-thirds" aria-label="Rule of thirds grid"/>}
  <div className="camera-exposure-strip"><span>1/{t}</span><span>F{f.toFixed(1)}</span><span>ISO {iso}</span><span>EV {settings.ev.toFixed(1)}</span><span>{focus}</span></div>
  <button type="button" className="camera-help-toggle" onPointerDown={event=>event.preventDefault()} onClick={()=>session.photography.setState({panel:!settings.panel})}>Controls{touch?'':' [C]'}</button>
  {settings.panel&&<section className="camera-control-panel" onPointerDown={event=>event.preventDefault()} aria-label="Camera controls"><strong>Camera Controls</strong><p>{settings.manual?'MANUAL':'AUTO'} | {Math.round(settings.focal)}mm | Grid {settings.grid?'Thirds':'Off'}</p><ul>{rows.map((text,i)=><li key={i} className={settings.row===i?'is-current':''}>{text}{!settings.manual&&i!==3?' | Auto':''}</li>)}</ul><p>Up/Down: Select | Left/Right: Adjust<br/>Wheel: Zoom | F: Autofocus<br/>G: Grid | M: Auto/Manual<br/>C: Controls | Right click: Lower</p><small>Focus distance stored; no depth-of-field.</small>{touch&&<div><button onClick={()=>session.photography.setState({grid:!settings.grid})}>Grid</button><button onClick={()=>session.photography.setState({focusRequested:true})}>Focus</button></div>}</section>}
  {touch&&<button type="button" className="camera-lower" onPointerDown={event=>event.preventDefault()} onClick={()=>{if(runtime.current.handheldCamera)runtime.current.handheldCamera.using=false;}}>Lower Camera</button>}
 </div>;
}
