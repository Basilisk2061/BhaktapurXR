import {useEffect,useReducer} from 'react';
import {cameraPerf,type Switch} from '../rendering/camera-performance';
import {isEditableTarget} from '../input/player-input';
/** Mounted only in development. No world/store subscription or production listener. */
export function CameraPerformancePanel({active}:{active:boolean}){
 const [,refresh]=useReducer(n=>n+1,0);
 useEffect(()=>{const perf=cameraPerf;if(!perf)return;perf.setActive(active);perf.listeners.add(refresh);
  let observer:PerformanceObserver|undefined;
  if(active&&typeof PerformanceObserver!=='undefined'&&PerformanceObserver.supportedEntryTypes?.includes('longtask')){perf.longTasksSupported=true;observer=new PerformanceObserver(list=>{for(const e of list.getEntries())perf.longTask(e.duration);});observer.observe({type:'longtask',buffered:false});}
  const key=(event:KeyboardEvent)=>{if(!active||isEditableTarget(event.target)||event.ctrlKey||event.metaKey||event.altKey)return;
   if(event.code!=='KeyP'&&(!perf.open||!['Digit1','Digit2','Digit3','Digit4','Digit5','KeyR'].includes(event.code)))return;
   event.preventDefault();event.stopImmediatePropagation();if(event.repeat)return;
   if(event.code==='KeyP'){perf.open=!perf.open;perf.emit();}else if(event.code==='KeyR')perf.reset();else perf.toggle((['dof','af','dynamic','meter','hud'] as Switch[])[Number(event.code.slice(-1))-1]);
  };
  document.addEventListener('keydown',key,true);return()=>{observer?.disconnect();document.removeEventListener('keydown',key,true);perf.listeners.delete(refresh);perf.setActive(false);};
 },[active]);
 const perf=cameraPerf;if(!active||!perf)return null;
 return <aside style={{position:'fixed',left:12,top:70,zIndex:10000,maxHeight:'70vh',maxWidth:'calc(100vw - 24px)',overflow:'auto',background:'#101010e8',color:'#eee',padding:10,font:'11px/1.4 monospace',pointerEvents:'auto',whiteSpace:'pre-wrap'}} aria-label="Camera performance diagnostics">
 <button onClick={()=>{perf.open=!perf.open;perf.emit();}}>P {perf.open?'Close':'Open'} CAMERA PERF</button>
 {perf.open&&<><div>AVG / MAX ? CPU wall time; nested timings overlap</div>{(['dof','af','dynamic','meter','hud'] as Switch[]).map((k,i)=><button key={k} onClick={()=>perf.toggle(k)} style={{display:'block'}}>{i+1} {['DOF','Continuous AF','Dynamic AF','Metering','HUD Updates'][i]}: {perf.switches[k]?'ON':'OFF'}</button>)}<button onClick={()=>perf.reset()}>R Reset Diagnostics</button>
 {!Object.values(perf.switches).every(Boolean)&&<strong> DIAGNOSTIC OVERRIDES ACTIVE</strong>}
 <pre style={{font:'inherit',margin:0}}>{perf.snapshot}{'\nLast slow BVH: '+perf.slowBvh+'\nLast expensive NPC: '+perf.slowNpc+'\nLAST SPIKE: '+perf.spike}</pre></>}
 </aside>;
}
