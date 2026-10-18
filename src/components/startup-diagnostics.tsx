"use client";
import {useEffect,useRef,useState,useSyncExternalStore} from 'react';
import {readStartup,subscribeStartup,startupDiagnosticsEnabled,startupInfo,startupError} from '../game/startup-diagnostics';
export function StartupDiagnostics(){return startupDiagnosticsEnabled?<DiagnosticPanel/>:null;}
function DiagnosticPanel(){
 const state=useSyncExternalStore(subscribeStartup,readStartup,readStartup),[copy,setCopy]=useState('Copy diagnostics'),[manual,setManual]=useState(false),textArea=useRef<HTMLTextAreaElement>(null);
 useEffect(()=>{
  for(const key of ['hostname','host','origin','protocol'] as const)startupInfo(key,location[key]);
  startupInfo('secure context',window.isSecureContext);startupInfo('userAgent',navigator.userAgent);startupInfo('maxTouchPoints',navigator.maxTouchPoints);startupInfo('devicePixelRatio',devicePixelRatio);
  for(const kind of ['webgl2','webgl'] as const){try{
   const probe=document.createElement('canvas'),gl=probe.getContext(kind) as WebGLRenderingContext|WebGL2RenderingContext|null;
   startupInfo(kind+' context',gl?'YES':'NO');
   if(gl){const debug=gl.getExtension('WEBGL_debug_renderer_info');startupInfo(kind+' renderer',gl.getParameter(debug?debug.UNMASKED_RENDERER_WEBGL:gl.RENDERER));startupInfo(kind+' vendor',gl.getParameter(debug?debug.UNMASKED_VENDOR_WEBGL:gl.VENDOR));gl.getExtension('WEBGL_lose_context')?.loseContext();}
  }catch(error){startupInfo(kind+' probe',String(error));}}
  const error=(event:ErrorEvent)=>startupError(event.error??`${event.message} ${event.filename}:${event.lineno}`,'window error');
  const rejection=(event:PromiseRejectionEvent)=>startupError(event.reason,'unhandled rejection');
  const resource=(event:Event)=>{const target=event.target;if(target instanceof HTMLScriptElement||target instanceof HTMLImageElement)startupError(target.src,'resource error');else if(target instanceof HTMLLinkElement)startupError(target.href,'resource error');};
  window.addEventListener('error',error);window.addEventListener('unhandledrejection',rejection);window.addEventListener('error',resource,true);
  const size=()=>{const canvas=document.querySelector('[data-experience-canvas] canvas');if(canvas){const rect=canvas.getBoundingClientRect();startupInfo('Canvas CSS size',`${Math.round(rect.width)} x ${Math.round(rect.height)}`);}else startupInfo('Canvas CSS size','not in DOM');};size();const timer=setInterval(size,500);
  return()=>{window.removeEventListener('error',error);window.removeEventListener('unhandledrejection',rejection);window.removeEventListener('error',resource,true);clearInterval(timer);};
 },[]);
 useEffect(()=>{if(manual){textArea.current?.focus();textArea.current?.select();}},[manual]);
 const lines=[...Object.entries(state.info).map(([key,value])=>`${key}: ${value}`),'--- Checkpoints (ms since navigation) ---',...Object.entries(state.checks).map(([key,value])=>`${key}: ${value.status}${value.time===undefined?'':` ${value.time}ms`}${value.detail?' - '+value.detail:''}`),'--- Loader resources (latest 8; no event means unobserved) ---',...Object.entries(state.resources).slice(-8).map(([url,value])=>`${value.status} ${value.time}ms ${url}`),'--- Errors ---',...(state.errors.length?state.errors:['None observed'])];
 const text=lines.join('\n');
 return <aside aria-label="Development startup diagnostics" style={{position:'fixed',top:8,left:8,zIndex:1000,width:'min(560px,calc(100vw - 16px))',maxHeight:'calc(100svh - 16px)',overflow:'auto',background:'#111e',color:'#eee',padding:12,font:'12px/1.5 monospace',pointerEvents:'auto',userSelect:'text'}}>
  <strong>Explore startup diagnostics (development only)</strong>
  <p style={{margin:'4px 0'}}>Observational only. WAITING does not establish failure. Frame checkpoints are callbacks before rendering.</p>
  <button type="button" style={{padding:'8px 12px',margin:'6px 0',color:'#111',background:'#ddd'}} onClick={()=>{if(!navigator.clipboard?.writeText){setManual(true);setCopy('Select / copy text below');return;}void navigator.clipboard.writeText(text).then(()=>setCopy('Copied')).catch(()=>{setManual(true);setCopy('Select / copy text below');});}}>{copy}</button>
  {manual&&<textarea ref={textArea} readOnly value={text} aria-label="Select diagnostics to copy" style={{width:'100%',height:160,color:'#eee',background:'#222'}}/>}
  <pre style={{margin:0,whiteSpace:'pre-wrap',overflowWrap:'anywhere',font:'inherit'}}>{text}</pre>
 </aside>;
}
