'use client';
import {useEffect,useRef,useState,type RefObject} from 'react';
import {useStore} from 'zustand';
import type {PlayerRuntime} from '../player/player-runtime';
import type {PlayerInput} from '../input/player-input';
import {isEditableTarget} from '../input/player-input';
import type {ItemSession} from './inventory-store';
import {PhotoPreview} from './photo-preview';
import {requestPhotograph} from './photograph';
import {apertures,shutters,sensitivities} from './photography-settings';
export function CameraViewfinder({runtime,input,session,touch}:{runtime:RefObject<PlayerRuntime>;input:RefObject<PlayerInput>;session:ItemSession;touch:boolean}){
 const settings=useStore(session.photography),[active,setActive]=useState(false),[hint,setHint]=useState(false),last=useRef(false);
 useEffect(()=>{if(!active){setHint(false);return;}setHint(true);const timer=setTimeout(()=>setHint(false),5000);return()=>clearTimeout(timer);},[active]);
 useEffect(()=>{if(!settings.shutterUntil)return;const timer=setTimeout(()=>session.photography.setState({shutterUntil:0}),Math.max(0,settings.shutterUntil-Date.now()));return()=>clearTimeout(timer);},[settings.shutterUntil,session]);
 useEffect(()=>{if(!settings.photoUntil)return;const timer=setTimeout(()=>session.photography.setState({photoUntil:0,photoMessage:''}),Math.max(0,settings.photoUntil-Date.now()));return()=>clearTimeout(timer);},[settings.photoUntil,session]);
 useEffect(()=>{if(!settings.modeUntil)return;const timer=setTimeout(()=>session.photography.setState({modeUntil:0}),Math.max(0,settings.modeUntil-Date.now()));return()=>clearTimeout(timer);},[settings.modeUntil,session]);
 useEffect(()=>{if(!settings.focusUntil)return;const timer=setTimeout(()=>session.photography.setState({focusUntil:0}),Math.max(0,settings.focusUntil-Date.now()));return()=>clearTimeout(timer);},[settings.focusUntil,session]);
 useEffect(()=>{
  runtime.current.photography=session.photography;
  let frame=0;const update=()=>{const enabled=(runtime.current.handheldCamera?.view??0)>=.95;if(last.current!==enabled){last.current=enabled;setActive(enabled);}document.documentElement.toggleAttribute('data-camera-viewfinder',(runtime.current.handheldCamera?.view??0)>0);frame=requestAnimationFrame(update);};frame=requestAnimationFrame(update);
  const ready=()=>input.current.cameraView&&!input.current.inputBlocked&&!input.current.inventoryOpen&&!session.photography.getState().preview;
  const key=(e:KeyboardEvent)=>{
   if(!ready()||isEditableTarget(e.target)||e.ctrlKey||e.metaKey||e.altKey)return;
   if(e.code==='KeyE'){e.preventDefault();e.stopImmediatePropagation();return;}
   const s=session.photography.getState();if(!['KeyG','KeyF','KeyM','KeyC','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code))return;
   if(e.code.startsWith('Arrow')&&!s.panel)return;e.preventDefault();e.stopImmediatePropagation();if(e.repeat&&!e.code.startsWith('Arrow'))return;
   if(e.code==='KeyG')session.photography.setState({grid:!s.grid});
   if(e.code==='KeyC')session.photography.setState({panel:!s.panel});
   if(e.code==='KeyM')session.photography.setState({manual:!s.manual,modeUntil:Date.now()+1000});
   if(e.code==='KeyF')session.photography.setState({focusRequested:true,focusMode:'AF',row:Math.min(s.row,4)});
   if(e.code==='ArrowUp'||e.code==='ArrowDown')session.photography.setState({row:(s.row+(e.code==='ArrowDown'?1:(s.focusMode==='MF'?5:4)))%(s.focusMode==='MF'?6:5)});
   if(e.code==='ArrowLeft'||e.code==='ArrowRight'){
    const d=e.code==='ArrowRight'?1:-1,clamp=(n:number,min:number,max:number)=>Math.max(min,Math.min(max,n));
    if(s.row===3)session.photography.setState({ev:clamp(s.ev+d*.5,-3,3)});
    if(s.row===4){const mode=s.focusMode==='AF'?'MF':'AF';session.photography.setState({focusMode:mode,focusRequested:mode==='AF'});return;}
    if(s.row===5&&s.focusMode==='MF'){session.photography.setState({focus:clamp(s.focus*2**(d/4),.3,500)});return;}
    if(!s.manual)return;
    if(s.row===0)session.photography.setState({aperture:clamp(s.aperture+d,0,apertures.length-1)});
    if(s.row===1)session.photography.setState({shutter:clamp(s.shutter+d,0,shutters.length-1)});
    if(s.row===2)session.photography.setState({iso:clamp(s.iso+d,0,sensitivities.length-1)});
   }
  };
  const wheel=(e:WheelEvent)=>{if(!ready())return;e.preventDefault();e.stopImmediatePropagation();const s=session.photography.getState();session.photography.setState({focal:Math.max(24,Math.min(135,s.focal*Math.exp(-Math.max(-100,Math.min(100,e.deltaY*(e.deltaMode===1?16:e.deltaMode===2?window.innerHeight:1)))*.002)))});};
  const lower=(e:PointerEvent)=>{if(e.button!==2||!ready())return;e.preventDefault();e.stopImmediatePropagation();if(runtime.current.handheldCamera)runtime.current.handheldCamera.using=false;};
  const context=(e:MouseEvent)=>{if(ready())e.preventDefault();};
  document.addEventListener('pointerdown',lower,true);document.addEventListener('contextmenu',context,true);
  document.addEventListener('keydown',key,true);document.addEventListener('wheel',wheel,{passive:false,capture:true});
  return()=>{cancelAnimationFrame(frame);document.documentElement.removeAttribute('data-camera-viewfinder');document.removeEventListener('pointerdown',lower,true);document.removeEventListener('contextmenu',context,true);document.removeEventListener('keydown',key,true);document.removeEventListener('wheel',wheel,true);};
 },[runtime,input,session]);
 const f=settings.manual?apertures[settings.aperture]:4,t=settings.manual?shutters[settings.shutter]:125,iso=settings.manual?sensitivities[settings.iso]:100;
 const focus=settings.focusMode==='MF'?`MF ${settings.focus.toFixed(1)}m`:'AF',rows=[['Exposure Mode',settings.manual?'MANUAL':'AUTO'],['Focal Length',`${Math.round(settings.focal)}mm`],['Aperture',`F${f.toFixed(1)}`],['Shutter',`1/${t}`],['ISO',String(iso)],['EV',settings.ev.toFixed(1)],['Focus Mode',settings.focusMode],...(settings.focusMode==='MF'?[['Focus Distance',`${settings.focus.toFixed(1)}m`]]:[]),['Grid',settings.grid?'Thirds':'Off']];
 if(settings.preview)return <PhotoPreview photo={settings.preview} session={session} input={input} runtime={runtime} touch={touch}/>;
 return <div hidden={!active} className="camera-viewfinder" aria-label="Photography viewfinder">
  <span className="camera-mode-label"><b>{settings.manual?'M':'AUTO'}</b><small>{Math.round(settings.focal)}mm</small></span>
  <i className={`camera-focus${settings.focusUntil>Date.now()?(settings.focusFailed?' is-focus-failed':' is-focused'):''}`}><b/><b/><b/><b/></i>
  {settings.grid&&<div className="camera-thirds" aria-label="Rule of thirds grid"><i/><i/><i/><i/></div>}
  <div className="camera-exposure-strip"><span>1/{t}</span><span>F{f.toFixed(1)}</span><span>ISO {iso}</span><span>EV {settings.ev>=0?'+':''}{settings.ev.toFixed(1)}</span><span>{focus}</span></div>
  <div className="camera-status-area"><span className="camera-battery" aria-label="Decorative battery indicator" title="Decorative status only"><i/><i/><i/></span><button type="button" className="camera-help-toggle" onPointerDown={event=>event.preventDefault()} onClick={()=>session.photography.setState({panel:!settings.panel})}>C Settings</button></div>
  {settings.panel&&<section className="camera-control-panel" onPointerDown={event=>event.preventDefault()} aria-label="Camera settings"><strong>CAMERA SETTINGS</strong><ul>{rows.map(([label,value],i)=><li key={label} className={i===settings.row+2?'is-current':''}><span>{label}</span><span>{value}</span></li>)}</ul><small>Up/Down Select | Left/Right Adjust</small>{touch&&<div><button onClick={()=>session.photography.setState({grid:!settings.grid})}>Grid</button><button onClick={()=>session.photography.setState({focusRequested:true,focusMode:'AF',row:Math.min(settings.row,4)})}>Focus</button></div>}</section>}
  {(hint||settings.panel)&&<div className={`camera-discovery-hint${settings.panel?' is-pinned':''}`} role="note"><span>Wheel <b>Zoom</b></span><span>F <b>Autofocus</b></span><span>M <b>Auto / Manual Exposure</b></span><span>G <b>Grid</b></span><span>C <b>Settings</b></span><span>LMB <b>Shutter</b></span><span>RMB <b>Lower Camera</b></span></div>}
  {settings.modeUntil>Date.now()&&<span className="camera-mode-feedback" role="status">{settings.manual?'MANUAL':'AUTO'}</span>}
  {settings.focusUntil>Date.now()&&<span className="camera-af-feedback" role="status">{settings.focusFailed?'AF FAILED':`AF ${settings.focus.toFixed(1)}m`}</span>}
  {settings.shutterUntil>Date.now()&&<div className="camera-shutter-feedback" aria-hidden="true"/>}
  {settings.photoUntil>Date.now()&&<span className="camera-photo-toast" role="status">{settings.photoMessage}</span>}
  {touch&&<button type="button" className="camera-shutter-button" onPointerDown={event=>event.preventDefault()} onClick={()=>{if((runtime.current.handheldCamera?.view??0)>=.999&&!input.current.inputBlocked)requestPhotograph(session.photography);}}>Shutter</button>}
  {touch&&<button type="button" className="camera-lower" onPointerDown={event=>event.preventDefault()} onClick={()=>{if(runtime.current.handheldCamera)runtime.current.handheldCamera.using=false;}}>Lower Camera</button>}
 </div>;
}
