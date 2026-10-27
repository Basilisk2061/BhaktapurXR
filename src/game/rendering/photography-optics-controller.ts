import {Euler,Quaternion} from 'three';
import {automaticExposure} from '../inventory/physical-camera';
import {cameraPerf} from './camera-performance';
import {useEffect,useRef,type RefObject} from 'react';
import {useFrame,useThree} from '@react-three/fiber';
import type {PlayerRuntime} from '../player/player-runtime';
import {apertures,shutters,sensitivities} from '../inventory/photography-settings';
import {rackFocus} from '../inventory/photography-optics';
import {createPhotographyMeter} from './photography-meter';
/** Mutable optical state per frame; only publish UI values at 8Hz. */
export function usePhotographyOptics(runtime:RefObject<PlayerRuntime>){
 const {scene,camera}=useThree(),engine=useRef<{meter:ReturnType<typeof createPhotographyMeter>;elapsed:number;meterAt:number;publishAt:number;ev100:number;last:Quaternion;difference:Quaternion;angles:Euler;tracking:boolean}|null>(null);
 useEffect(()=>{const meter=createPhotographyMeter(scene);engine.current={meter,elapsed:0,meterAt:0,publishAt:0,ev100:11,last:new Quaternion(),difference:new Quaternion(),angles:new Euler(0,0,0,'YXZ'),tracking:false};return()=>{engine.current=null;meter.dispose();};},[scene]);
 useFrame((_,delta)=>{
  const s=runtime.current.photography?.getState(),e=engine.current!;if(!e||!s)return;if(s.preview||(runtime.current.handheldCamera?.view??0)<=0){e.tracking=false;return;}
  const perfStart=process.env.NODE_ENV==='development'?performance.now():0;
  const dt=Math.min(delta,.05);e.elapsed+=dt;const lens=s.lens,physical=s.physical,now=performance.now();
  const motionStart=process.env.NODE_ENV==='development'?performance.now():0;
  if(e.tracking&&delta>0&&delta<.2){e.difference.copy(e.last).invert().multiply(camera.quaternion);e.angles.setFromQuaternion(e.difference,'YXZ');const rate=1-Math.exp(-delta/.06);physical.angularX+=(Math.max(-1,Math.min(1,e.angles.y/delta))-physical.angularX)*rate;physical.angularY+=(Math.max(-1,Math.min(1,e.angles.x/delta))-physical.angularY)*rate;}else{physical.angularX=physical.angularY=0;}
  e.last.copy(camera.quaternion);e.tracking=true;
  if(process.env.NODE_ENV==='development')cameraPerf?.end('Camera motion',motionStart);
  if(process.env.NODE_ENV!=='development'||cameraPerf?.switches.af!==false||s.focusMode==='MF')lens.actualFocusDistance=rackFocus(lens.actualFocusDistance,s.targetFocusDistance,dt);
  if(!physical.aeLocked&&(e.elapsed>=e.meterAt||physical.meterRequested)&&(process.env.NODE_ENV!=='development'||cameraPerf?.switches.meter!==false)){e.meterAt=e.elapsed+.5;e.ev100=e.meter(camera);physical.meterRequested=false;}
  if(s.exposureMode==='M')physical.aeLocked=false;
  const frozen=physical.aeLocked||(process.env.NODE_ENV==='development'&&cameraPerf?.switches.meter===false&&s.exposureMode!=='M');
  let aperture=apertures[s.aperture] as number,shutter=shutters[s.shutter] as number,iso=sensitivities[s.iso] as number;
  if(s.exposureMode!=='M'&&!frozen){
   if(s.exposureMode==='AUTO')aperture=e.ev100>=11?5.6:e.ev100>=9?4:e.ev100>=6?2.8:1.8;
   const auto=automaticExposure(e.ev100-s.ev,s.focal,aperture);shutter=auto.shutter;iso=auto.iso;
  }
  if(frozen){aperture=lens.aperture;shutter=lens.shutter;iso=lens.iso;}
  // Keep the existing gameplay exposure as the baseline; adapt only photographic relative EV.
  const settingEv=Math.log2(aperture*aperture*shutter*100/iso),relative=Math.max(-3,Math.min(3,(s.exposureMode==='M'?11+s.ev:e.ev100)-settingEv));
  const target=2**relative,rate=1-Math.exp(-dt/(physical.engaged ? .08 : .22));if(!frozen)lens.exposureMultiplier=2**(Math.log2(lens.exposureMultiplier)+(Math.log2(target)-Math.log2(lens.exposureMultiplier))*rate);
  lens.aperture=aperture;lens.shutter=shutter;lens.iso=iso;
  physical.meterDeviation=e.ev100-settingEv+(s.exposureMode==='M'?s.ev:0);
  if(s.exposureMode!=='M'&&physical.engaged&&!physical.aeLocked&&(now-physical.pressedAt>=160||physical.releasedAt>0&&now-physical.releasedAt>=60)){physical.aeLocked=true;physical.lockedEv=s.ev;}
  if(e.elapsed>=e.publishAt&&(process.env.NODE_ENV!=='development'||cameraPerf?.switches.hud!==false)){e.publishAt=e.elapsed+.125;const hudStart=process.env.NODE_ENV==='development'?performance.now():0;runtime.current.photography!.setState({actualFocusDistance:lens.actualFocusDistance,opticalRevision:s.opticalRevision+1});if(process.env.NODE_ENV==='development')cameraPerf?.end('HUD publish',hudStart);}
  if(process.env.NODE_ENV==='development')cameraPerf?.end('Optics controller',perfStart);
 },-2);
}
