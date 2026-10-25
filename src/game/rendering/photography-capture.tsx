import {useEffect,type RefObject} from 'react';
import {addAfterEffect,useThree} from '@react-three/fiber';
import {Vector3,type PerspectiveCamera} from 'three';
import type {PlayerRuntime} from '../player/player-runtime';
import {environmentStore} from '../world/time-of-day';
import {apertures,shutters,sensitivities} from '../inventory/photography-settings';
import {capturePhotograph,downloadPhotograph,type PhotographMetadata} from '../inventory/photograph';
/** Reads only the completed main render; never takes render-loop ownership or renders again. */
export function PhotographyCapture({runtime}:{runtime:RefObject<PlayerRuntime>}){
 const {gl,camera}=useThree();
 useEffect(()=>{const direction=new Vector3();return addAfterEffect(()=>{
  const motion=runtime.current,settings=motion.photography,s=settings?.getState();if(!settings||!s?.shutterRequested)return;
  settings.setState({shutterRequested:false});
  const fail=(error:unknown)=>{console.error('BhaktapurXR photo save failed:',error);settings.setState({shutterBusy:false,photoMessage:'PHOTO SAVE FAILED',photoUntil:Date.now()+1400});};
  if((motion.handheldCamera?.view??0)<.999){fail(new Error('Camera was lowered before capture'));return;}
  const c=camera as PerspectiveCamera,clock=environmentStore.getState(),timestamp=new Date().toISOString();c.getWorldDirection(direction);
  const metadata:PhotographMetadata={timestamp,sequence:s.photoSequence,focalLength:36/(2*c.aspect*Math.tan(c.fov*Math.PI/360)),requestedFocalLength:s.focal,fov:c.fov,aperture:s.manual?apertures[s.aperture]:4,shutterSeconds:1/(s.manual?shutters[s.shutter]:125),iso:s.manual?sensitivities[s.iso]:100,ev:s.ev,focusDistance:s.focus,manualFocus:s.manualFocus,cameraPosition:[c.position.x,c.position.y,c.position.z],cameraQuaternion:[c.quaternion.x,c.quaternion.y,c.quaternion.z,c.quaternion.w],cameraDirection:[direction.x,direction.y,direction.z],gameHour:clock.hour,timeMode:clock.mode,rendererExposure:gl.toneMappingExposure,width:gl.domElement.width,height:gl.domElement.height};
  // toBlob snapshots the current canvas here; its asynchronous result needs no world freeze.
  void capturePhotograph(gl.domElement,metadata).then(photo=>{downloadPhotograph(photo);settings.setState({shutterBusy:false,photoMessage:'PHOTO SAVED',photoUntil:Date.now()+1300});}).catch(fail);
 });},[gl,camera,runtime]);
 return null;
}
