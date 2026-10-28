'use client';
import {CameraTouchControls} from './camera-touch-controls';
import {cameraPerf} from '../rendering/camera-performance';
import {CameraPerformancePanel} from './camera-performance-panel';
import {useEffect,useRef,useState,type RefObject} from 'react';
import {useStore} from 'zustand';
import type {PlayerRuntime} from '../player/player-runtime';
import type {PlayerInput} from '../input/player-input';
import {isEditableTarget} from '../input/player-input';
import type {ItemSession} from './inventory-store';
import {PhotoPreview} from './photo-preview';
import {cancelShutterPress} from './photograph';
import {apertures,shutters,sensitivities,effectivePhotography,nextExposureMode} from './photography-settings';
export function CameraViewfinder({runtime,input,session,touch}:{runtime:RefObject<PlayerRuntime>;input:RefObject<PlayerInput>;session:ItemSession;touch:boolean}){
 const settings=useStore(session.photography),[active,setActive]=useState(false),[hint,setHint]=useState(false),last=useRef(false);
 useEffect(()=>{if(!active){setHint(false);return;}setHint(true);const timer=setTimeout(()=>setHint(false),5000);return()=>clearTimeout(timer);},[active]);
 useEffect(()=>{if(!settings.shutterUntil)return;const timer=setTimeout(()=>session.photography.setState({shutterUntil:0}),Math.max(0,settings.shutterUntil-Date.now()));return()=>clearTimeout(timer);},[settings.shutterUntil,session]);
 useEffect(()=>{if(!settings.photoUntil)return;const timer=setTimeout(()=>session.photography.setState({photoUntil:0,photoMessage:''}),Math.max(0,settings.photoUntil-Date.now()));return()=>clearTimeout(timer);},[settings.photoUntil,session]);
 useEffect(()=>{if(!settings.modeUntil)return;const timer=setTimeout(()=>session.photography.setState({modeUntil:0}),Math.max(0,settings.modeUntil-Date.now()));return()=>clearTimeout(timer);},[settings.modeUntil,session]);
 useEffect(()=>{if(!settings.focusUntil)return;const timer=setTimeout(()=>session.photography.setState({focusUntil:0}),Math.max(0,settings.focusUntil-Date.now()));return()=>clearTimeout(timer);},[settings.focusUntil,session]);
 useEffect(()=>{
  runtime.current.photography=session.photography;
  let frame=0;const update=()=>{const enabled=(runtime.current.handheldCamera?.view??0)>=.95;if(!enabled)cancelShutterPress(session.photography);if(last.current!==enabled){last.current=enabled;setActive(enabled);}document.documentElement.toggleAttribute('data-camera-viewfinder',(runtime.current.handheldCamera?.view??0)>0);frame=requestAnimationFrame(update);};frame=requestAnimationFrame(update);
  const ready=()=>input.current.cameraView&&!input.current.inputBlocked&&!input.current.inventoryOpen&&!session.photography.getState().preview;
  const key=(e:KeyboardEvent)=>{
   if(!ready()||isEditableTarget(e.target)||e.ctrlKey||e.metaKey||e.altKey)return;
   if(e.code==='KeyE'){e.preventDefault();e.stopImmediatePropagation();return;}
   const s=session.photography.getState();if(!['KeyG','KeyF','KeyM','KeyV','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code))return;
   if(e.code.startsWith('Arrow')&&!s.panel)return;e.preventDefault();e.stopImmediatePropagation();if(e.repeat&&!e.code.startsWith('Arrow'))return;
   if(e.code==='KeyG')session.photography.setState({grid:!s.grid});
   if(e.code==='KeyV')session.photography.setState({panel:!s.panel});
   if(e.code==='KeyM')session.photography.setState({exposureMode:nextExposureMode(s.exposureMode),modeUntil:Date.now()+1000});
   if(e.code==='KeyF'&&(process.env.NODE_ENV!=='development'||cameraPerf?.switches.af!==false))session.photography.setState({focusRequested:true,focusMode:'AF',row:Math.min(s.row,5)});
   if(e.code==='ArrowUp'||e.code==='ArrowDown')session.photography.setState({row:(s.row+(e.code==='ArrowDown'?1:(s.focusMode==='MF'?6:5)))%(s.focusMode==='MF'?7:6)});
   if(e.code==='ArrowLeft'||e.code==='ArrowRight'){
    const d=e.code==='ArrowRight'?1:-1,clamp=(n:number,min:number,max:number)=>Math.max(min,Math.min(max,n));
    if(s.row===0){const modes=['AUTO','A','M'] as const;session.photography.setState({exposureMode:modes[(modes.indexOf(s.exposureMode)+d+3)%3],modeUntil:Date.now()+1000});return;}
    if(s.row===4)session.photography.setState({ev:clamp(s.ev+d*.5,-3,3)});
    if(s.row===5){s.physical.afLocked=false;const mode=s.focusMode==='AF'?'MF':'AF';session.photography.setState({focusMode:mode,focusRequested:mode==='AF',focusUntil:0,afState:'SEARCHING'});return;}
    if(s.row===6&&s.focusMode==='MF'){session.photography.setState({targetFocusDistance:clamp(s.targetFocusDistance*2**(d/4),.3,500)});return;}
    if(s.row===1&&s.exposureMode!=='AUTO')session.photography.setState({aperture:clamp(s.aperture+d,0,apertures.length-1)});
    if(s.exposureMode!=='M')return;
    if(s.row===2)session.photography.setState({shutter:clamp(s.shutter+d,0,shutters.length-1)});
    if(s.row===3)session.photography.setState({iso:clamp(s.iso+d,0,sensitivities.length-1)});
   }
  };
  const wheel=(e:WheelEvent)=>{if(!ready())return;e.preventDefault();e.stopImmediatePropagation();const s=session.photography.getState();session.photography.setState({focal:Math.max(24,Math.min(135,s.focal*Math.exp(-Math.max(-100,Math.min(100,e.deltaY*(e.deltaMode===1?16:e.deltaMode===2?window.innerHeight:1)))*.002)))});};
  const lower=(e:PointerEvent)=>{if(e.button!==2||!ready())return;e.preventDefault();e.stopImmediatePropagation();cancelShutterPress(session.photography);if(runtime.current.handheldCamera)runtime.current.handheldCamera.using=false;};
  const context=(e:MouseEvent)=>{if(ready())e.preventDefault();};
  document.addEventListener('pointerdown',lower,true);document.addEventListener('contextmenu',context,true);
  document.addEventListener('keydown',key,true);document.addEventListener('wheel',wheel,{passive:false,capture:true});
  return()=>{cancelAnimationFrame(frame);document.documentElement.removeAttribute('data-camera-viewfinder');document.removeEventListener('pointerdown',lower,true);document.removeEventListener('contextmenu',context,true);document.removeEventListener('keydown',key,true);document.removeEventListener('wheel',wheel,true);};
 },[runtime,input,session]);
 const effective=effectivePhotography(settings),f=effective.aperture,t=effective.shutter,iso=effective.iso;
 const focus=settings.physical.afLocked?'AF LOCK':settings.focusMode==='MF'?`MF ${settings.actualFocusDistance.toFixed(1)}m`:'AF';
 const rows=[{label:'Exposure Mode',value:settings.exposureMode,key:0},{label:'Focal Length',value:`${Math.round(settings.focal)}mm`,key:-1},{label:'Aperture',value:`F${f.toFixed(1)}`,key:1},{label:'Shutter',value:`1/${t}`,key:2},{label:'ISO',value:String(iso),key:3},{label:'EV',value:settings.ev.toFixed(1),key:4},{label:'Focus Mode',value:settings.focusMode,key:5},...(settings.focusMode==='MF'?[{label:'Focus Distance',value:`${settings.targetFocusDistance.toFixed(1)}m`,key:6}]:[]),{label:'Grid',value:settings.grid?'Thirds':'Off',key:-1}];
 if(settings.preview)return <PhotoPreview photo={settings.preview} session={session} input={input} runtime={runtime} touch={touch}/>;
 return <div hidden={!active} className={`camera-viewfinder${touch?' is-touch':''}`} aria-label="Photography viewfinder">
  {process.env.NODE_ENV==='development'&&<CameraPerformancePanel active={active}/>}
  <span className="camera-mode-label"><b>{settings.exposureMode}</b><small>{Math.round(settings.focal)}mm</small></span>
  <i className={`camera-focus${settings.focusUntil>Date.now()?(settings.focusFailed?' is-focus-failed':' is-focused'):(settings.focusMode==='AF'&&settings.afState!=='SEARCHING'?' is-focused':'')}`}><b/><b/><b/><b/></i>
  {settings.focusMode==='MF'&&<div className="camera-mf-scale" aria-label="Manual focus distance scale">{[.3,.5,1,2,5,10,50].map(distance=><span key={distance} style={{left:`${Math.log(distance/.3)/Math.log(50/.3)*100}%`}}>{distance===50?'∞':distance}</span>)}<i style={{left:`${Math.log(Math.min(50,settings.actualFocusDistance)/.3)/Math.log(50/.3)*100}%`}}/></div>}
  {settings.grid&&<div className="camera-thirds" aria-label="Rule of thirds grid"><i/><i/><i/><i/></div>}
  <div className="camera-exposure-strip"><span>1/{t}</span><span>F{f.toFixed(1)}</span><span>ISO {iso}</span><span>EV {settings.ev>=0?'+':''}{settings.ev.toFixed(1)}</span><span>{focus}</span>{settings.exposureMode==='M'&&<span>Meter {settings.physical.meterDeviation>=0?'+':''}{settings.physical.meterDeviation.toFixed(1)}</span>}</div>
  <div className="camera-status-area"><span className="camera-battery" aria-label="Decorative battery indicator" title="Decorative status only"><i/><i/><i/></span><button type="button" className="camera-help-toggle" onPointerDown={event=>event.preventDefault()} onClick={()=>session.photography.setState({panel:!settings.panel})}>V Settings</button></div>
  {settings.panel&&!touch&&<section className="camera-control-panel" onPointerDown={event=>event.preventDefault()} aria-label="Camera settings"><strong>CAMERA SETTINGS</strong><ul>{rows.map(row=><li key={row.label} className={row.key===settings.row?'is-current':''}><span>{row.label}</span><span>{row.value}</span></li>)}</ul><small>Up/Down Select | Left/Right Adjust</small></section>}
  {!touch&&(hint||settings.panel)&&<div className={`camera-discovery-hint${settings.panel?' is-pinned':''}`} role="note"><span>Wheel <b>Zoom</b></span><span>F <b>Autofocus</b></span><span>M <b>Exposure AUTO / A / M</b></span><span>G <b>Grid</b></span><span>V <b>Settings</b></span><span>LMB <b>Hold focus / Release shutter</b></span><span>RMB <b>Lower Camera</b></span></div>}
  {settings.modeUntil>Date.now()&&<span className="camera-mode-feedback" role="status">{settings.exposureMode}</span>}
  {settings.focusUntil>Date.now()&&<span className="camera-af-feedback" role="status">{settings.focusFailed?'AF FAILED':`AF ${settings.targetFocusDistance.toFixed(1)}m`}</span>}
  {settings.shutterUntil>Date.now()&&<div className="camera-shutter-feedback" aria-hidden="true"/>}
  {settings.photoUntil>Date.now()&&<span className="camera-photo-toast" role="status">{settings.photoMessage}</span>}
  {touch&&<CameraTouchControls session={session} input={input} runtime={runtime} active={active}/>}
 </div>;
}
