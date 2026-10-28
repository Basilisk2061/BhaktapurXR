'use client';
import {useEffect,useRef,useState,type RefObject} from 'react';
import {useStore} from 'zustand';
import type {ItemSession} from './inventory-store';
import type {PlayerInput} from '../input/player-input';
import type {PlayerRuntime} from '../player/player-runtime';
import {beginShutterPress,releaseShutterPress,cancelShutterPress} from './photograph';
import {apertures,shutters,sensitivities} from './photography-settings';
import {clearTouchInput,leaveCameraMode,requestCameraFocus,setCameraFocal,setCameraFocusMode,focusSliderValue,setManualFocus} from './touch-camera-actions';
import {cameraPerf} from '../rendering/camera-performance';
const discoverySeen=new WeakSet<ItemSession>();
export function CameraTouchControls({session,input,runtime,active}:{session:ItemSession;input:RefObject<PlayerInput>;runtime:RefObject<PlayerRuntime>;active:boolean}){
 const s=useStore(session.photography),dialog=useRef<HTMLDialogElement>(null),shutter=useRef<number|null>(null),[hint,setHint]=useState(false);
 const cancel=()=>{shutter.current=null;cancelShutterPress(session.photography);};
 const closePanel=()=>{session.photography.setState({panel:false});clearTouchInput(input.current);};
 const exit=()=>leaveCameraMode(session.photography,input.current,runtime.current,cancel);
 const ready=()=>active&&(runtime.current.handheldCamera?.view??0)>=.999&&!input.current.inputBlocked&&!input.current.inventoryOpen&&!session.photography.getState().preview&&!session.photography.getState().panel;
 useEffect(()=>{if(!active){setHint(false);return;}if(discoverySeen.has(session))return;discoverySeen.add(session);setHint(true);const timer=setTimeout(()=>setHint(false),4500);return()=>clearTimeout(timer);},[active,session]);
 useEffect(()=>{if(active&&s.panel){clearTouchInput(input.current);runtime.current.velocity.x=runtime.current.velocity.z=0;cancelShutterPress(session.photography);if(!dialog.current?.open)dialog.current?.showModal();}else dialog.current?.close();},[active,s.panel,input,runtime,session]);
 useEffect(()=>{if(!active){shutter.current=null;cancelShutterPress(session.photography);}},[active,session]);
 return <div className="camera-touch-ui" data-gameplay-ui onPointerDown={e=>{e.stopPropagation();setHint(false);}} onPointerUp={e=>e.stopPropagation()}>
  <button type="button" className="camera-touch-exit" onClick={exit} aria-label="Exit Camera Mode">&#8592; Back</button>
  <button type="button" className="camera-touch-settings" aria-label="Open camera settings" aria-haspopup="dialog" onClick={()=>session.photography.setState({panel:true})}>Settings</button>
  <div className="camera-touch-zoom"><label htmlFor="camera-touch-focal">{Math.round(s.focal)}mm</label><input id="camera-touch-focal" aria-label="Zoom focal length, 24 to 135 millimetres" type="range" min="24" max="135" step="1" value={s.focal} onChange={e=>setCameraFocal(session.photography,Number(e.target.value))}/><span>24135mm</span></div>
  <button type="button" className="camera-touch-af" aria-label="Autofocus without taking a photo" onClick={()=>{if(ready()&&(process.env.NODE_ENV!=='development'||cameraPerf?.switches.af!==false))requestCameraFocus(session.photography);}}>AF</button>
  <button type="button" className="camera-touch-shutter" aria-label="Shutter: hold to focus, release to capture" disabled={s.shutterBusy} onPointerDown={e=>{e.preventDefault();e.stopPropagation();if(shutter.current!==null||!ready())return;if(beginShutterPress(session.photography)){shutter.current=e.pointerId;e.currentTarget.setPointerCapture(e.pointerId);}}} onPointerUp={e=>{e.preventDefault();e.stopPropagation();if(shutter.current!==e.pointerId)return;shutter.current=null;if(ready())releaseShutterPress(session.photography);else cancelShutterPress(session.photography);}} onPointerCancel={cancel} onLostPointerCapture={()=>{if(shutter.current!==null)cancel();}} onClick={e=>{if(e.detail===0&&ready()&&beginShutterPress(session.photography))releaseShutterPress(session.photography);}}><span aria-hidden="true"/></button>
  {hint&&active&&<p className="camera-touch-hint" role="note">Drag to aim · Hold shutter to focus · Release to capture</p>}
  <dialog ref={dialog} className="camera-touch-panel" aria-labelledby="camera-touch-settings-title" onCancel={e=>{e.preventDefault();closePanel();}} onClose={()=>{if(session.photography.getState().panel)closePanel();}} onKeyDown={e=>e.stopPropagation()}>
   <header><h2 id="camera-touch-settings-title">Camera settings</h2><button type="button" onClick={closePanel}>Done</button></header>
   <div className="camera-touch-fields">
    <label>Exposure mode<select value={s.exposureMode} onChange={e=>session.photography.setState({exposureMode:e.target.value as 'AUTO'|'A'|'M',modeUntil:Date.now()+1000})}><option>AUTO</option><option>A</option><option>M</option></select></label>
    {s.exposureMode!=='AUTO'&&<label>Aperture<select value={s.aperture} onChange={e=>session.photography.setState({aperture:Number(e.target.value)})}>{apertures.map((a,i)=><option value={i} key={a}>F{a.toFixed(1)}</option>)}</select></label>}
    {s.exposureMode==='M'&&<><label>Shutter speed<select value={s.shutter} onChange={e=>session.photography.setState({shutter:Number(e.target.value)})}>{shutters.map((v,i)=><option value={i} key={v}>1/{v} s</option>)}</select></label><label>ISO<select value={s.iso} onChange={e=>session.photography.setState({iso:Number(e.target.value)})}>{sensitivities.map((v,i)=><option value={i} key={v}>{v}</option>)}</select></label></>}
    <label>Exposure compensation <output>{s.ev>0?'+':''}{s.ev.toFixed(1)} EV</output><input type="range" min="-3" max="3" step="0.5" value={s.ev} onChange={e=>session.photography.setState({ev:Number(e.target.value)})}/></label>
    <label>Focus mode<select value={s.focusMode} onChange={e=>setCameraFocusMode(session.photography,e.target.value as 'AF'|'MF')}><option>AF</option><option>MF</option></select></label>
    {s.focusMode==='MF'&&<label>Focus distance <output>{s.targetFocusDistance.toFixed(1)} m</output><input aria-label="Manual focus distance, 0.3 to 500 metres" type="range" min="0" max="1" step="0.001" value={focusSliderValue(s.targetFocusDistance)} onChange={e=>setManualFocus(session.photography,Number(e.target.value))}/><small>0.3 m  500 m</small></label>}
    <label className="camera-touch-grid"><input type="checkbox" checked={s.grid} onChange={e=>session.photography.setState({grid:e.target.checked})}/>Rule of thirds grid</label>
   </div>
  </dialog>
 </div>;
}

