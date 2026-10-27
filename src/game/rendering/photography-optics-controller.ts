import {cameraPerf} from './camera-performance';
import {useEffect,useRef,type RefObject} from 'react';
import {useFrame,useThree} from '@react-three/fiber';
import type {PlayerRuntime} from '../player/player-runtime';
import {apertures,shutters,sensitivities} from '../inventory/photography-settings';
import {rackFocus} from '../inventory/photography-optics';
import {createPhotographyMeter} from './photography-meter';
const nearest=(values:readonly number[],value:number)=>values.reduce((a,b)=>Math.abs(Math.log(b/value))<Math.abs(Math.log(a/value))?b:a);
/** Mutable optical state per frame; only publish UI values at 8Hz. */
export function usePhotographyOptics(runtime:RefObject<PlayerRuntime>){
 const {scene,camera}=useThree(),engine=useRef<{meter:ReturnType<typeof createPhotographyMeter>;elapsed:number;meterAt:number;publishAt:number;ev100:number}|null>(null);
 useEffect(()=>{const meter=createPhotographyMeter(scene);engine.current={meter,elapsed:0,meterAt:0,publishAt:0,ev100:11};return()=>{engine.current=null;meter.dispose();};},[scene]);
 useFrame((_,delta)=>{
  const s=runtime.current.photography?.getState(),e=engine.current!;if(!e||!s||s.preview||(runtime.current.handheldCamera?.view??0)<=0)return;
  const perfStart=process.env.NODE_ENV==='development'?performance.now():0;
  const dt=Math.min(delta,.05);e.elapsed+=dt;const lens=s.lens;
  if(process.env.NODE_ENV!=='development'||cameraPerf?.switches.af!==false||s.focusMode==='MF')lens.actualFocusDistance=rackFocus(lens.actualFocusDistance,s.targetFocusDistance,dt);
  if(e.elapsed>=e.meterAt&&(process.env.NODE_ENV!=='development'||cameraPerf?.switches.meter!==false)){e.meterAt=e.elapsed+.5;e.ev100=e.meter(camera);}
  const frozen=process.env.NODE_ENV==='development'&&cameraPerf?.switches.meter===false&&s.exposureMode!=='M';
  let aperture=apertures[s.aperture] as number,shutter=shutters[s.shutter] as number,iso=sensitivities[s.iso] as number;
  if(s.exposureMode!=='M'&&(process.env.NODE_ENV!=='development'||cameraPerf?.switches.meter!==false)){
   if(s.exposureMode==='AUTO')aperture=e.ev100>=10?4:e.ev100>=7?2.8:1.8;
   const handheld=Math.max(60,Math.min(250,s.focal*2)),desiredSpeed=2**e.ev100/(aperture*aperture);
   shutter=shutters.find(speed=>speed>=Math.max(handheld,desiredSpeed))??shutters[shutters.length-1];iso=nearest(sensitivities,Math.max(100,100*shutter/Math.max(1,desiredSpeed)));
  }
  if(frozen){aperture=lens.aperture;shutter=lens.shutter;iso=lens.iso;}
  // Keep the existing gameplay exposure as the baseline; adapt only photographic relative EV.
  const settingEv=Math.log2(aperture*aperture*shutter*100/iso),relative=Math.max(-3,Math.min(3,11-settingEv+s.ev));
  const target=2**relative,rate=1-Math.exp(-dt/.22);if(!frozen)lens.exposureMultiplier=2**(Math.log2(lens.exposureMultiplier)+(Math.log2(target)-Math.log2(lens.exposureMultiplier))*rate);
  lens.aperture=aperture;lens.shutter=shutter;lens.iso=iso;
  if(e.elapsed>=e.publishAt&&(process.env.NODE_ENV!=='development'||cameraPerf?.switches.hud!==false)){e.publishAt=e.elapsed+.125;const hudStart=process.env.NODE_ENV==='development'?performance.now():0;runtime.current.photography!.setState({actualFocusDistance:lens.actualFocusDistance,opticalRevision:s.opticalRevision+1});if(process.env.NODE_ENV==='development')cameraPerf?.end('HUD publish',hudStart);}
  if(process.env.NODE_ENV==='development')cameraPerf?.end('Optics controller',perfStart);
 },-2);
}
