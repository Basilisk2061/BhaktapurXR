import {usePhotographyOptics} from './photography-optics-controller';
import {createPhotographyAutofocus} from './photography-autofocus';
import {useEffect,type RefObject} from 'react';
import {addAfterEffect,useThree} from '@react-three/fiber';
import {Vector3,type PerspectiveCamera} from 'three';
import type {PlayerRuntime} from '../player/player-runtime';
import {environmentStore} from '../world/time-of-day';
import {effectivePhotography} from '../inventory/photography-settings';
import {capturePhotograph,type PhotographMetadata} from '../inventory/photograph';
/** Reads only the completed main render; never takes render-loop ownership or renders again. */
export function PhotographyCapture({runtime}:{runtime:RefObject<PlayerRuntime>}){
 usePhotographyOptics(runtime);
 const {gl,camera,scene}=useThree();
 useEffect(()=>{const direction=new Vector3(),autofocus=createPhotographyAutofocus(scene);let nextAf=0;const unsubscribe=addAfterEffect(()=>{
  const motion=runtime.current,settings=motion.photography,s=settings?.getState();if(!settings||!s||s.preview)return;
  const now=performance.now(),explicit=s.focusRequested,active=(motion.handheldCamera?.view??0)>=.95;
  if(active&&s.focusMode==='AF'&&(explicit||!s.shutterRequested&&now>=nextAf)){
   nextAf=now+125;const hit=autofocus(camera,gl.domElement.clientWidth,gl.domElement.clientHeight,explicit);
   const changed=hit&&Math.abs(hit.distance-s.targetFocusDistance)>Math.max(.025,hit.distance*.015);
   const steady=hit&&Math.abs(1/s.lens.actualFocusDistance-1/hit.distance)<.015;
   settings.setState({focusRequested:false,afState:hit?(steady?'STEADY':'ACQUIRED'):'SEARCHING',...(changed?{targetFocusDistance:hit.distance}:{}),...(explicit?{focusFailed:!hit,focusUntil:Date.now()+850}:{})});
  }
  if(!s.shutterRequested)return;
  settings.setState({shutterRequested:false});
  const fail=(error:unknown)=>{console.error('BhaktapurXR photo save failed:',error);settings.setState({shutterBusy:false,photoMessage:'PHOTO SAVE FAILED',photoUntil:Date.now()+1400});};
  if((motion.handheldCamera?.view??0)<.999){fail(new Error('Camera was lowered before capture'));return;}
  const c=camera as PerspectiveCamera,clock=environmentStore.getState(),timestamp=new Date().toISOString();c.getWorldDirection(direction);
  const effective=effectivePhotography(s);
  const metadata:PhotographMetadata={timestamp,sequence:s.photoSequence,focalLength:36/(2*c.aspect*Math.tan(c.fov*Math.PI/360)),requestedFocalLength:s.focal,fov:c.fov,aperture:effective.aperture,shutterSeconds:1/effective.shutter,iso:effective.iso,ev:s.ev,focusDistance:s.lens.actualFocusDistance,targetFocusDistance:s.targetFocusDistance,exposureMode:s.exposureMode,manualFocus:s.focusMode==='MF',cameraPosition:[c.position.x,c.position.y,c.position.z],cameraQuaternion:[c.quaternion.x,c.quaternion.y,c.quaternion.z,c.quaternion.w],cameraDirection:[direction.x,direction.y,direction.z],gameHour:clock.hour,timeMode:clock.mode,rendererExposure:gl.toneMappingExposure,width:gl.domElement.width,height:gl.domElement.height};
  // toBlob snapshots the current canvas here; its asynchronous result needs no world freeze.
  void capturePhotograph(gl.domElement,metadata).then(photo=>{settings.setState({shutterBusy:false,preview:photo});}).catch(fail);
 });return()=>{unsubscribe();autofocus.dispose();};},[gl,camera,scene,runtime]);
 return null;
}
