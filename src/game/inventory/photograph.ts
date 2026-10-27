import {processPhotograph} from './photograph-processing';
import type {photographicConsequences} from './physical-camera';
import type {PhotographySettings} from './photography-settings';
/** Device-only capture result, reusable by a future local gallery/scoring layer. */
export interface PhotographMetadata {
 timestamp:string;focalLength:number;requestedFocalLength:number;fov:number;aperture:number;shutterSeconds:number;iso:number;ev:number;focusDistance:number;targetFocusDistance:number;exposureMode:"AUTO"|"A"|"M";manualFocus:boolean;
 cameraPosition:[number,number,number];cameraQuaternion:[number,number,number,number];cameraDirection:[number,number,number];
 focusState:string;afLocked:boolean;aeLocked:boolean;meterDeviation:number;effects:ReturnType<typeof photographicConsequences>;
 gameHour:number;timeMode:string;rendererExposure:number;width:number;height:number;sequence:number;
}
export interface CapturedPhotograph {blob:Blob;metadata:PhotographMetadata}
export function beginShutterPress(settings:PhotographySettings){
 const s=settings.getState(),now=Date.now();if(s.preview||s.shutterBusy||now<s.nextShutterAt||s.physical.engaged)return false;
 Object.assign(s.physical,{engaged:true,held:true,pressedAt:performance.now(),releasedAt:0,afLocked:false,aeLocked:false,meterRequested:true,lockedEv:s.ev});
 settings.setState({focusRequested:s.focusMode==='AF',afState:s.focusMode==='AF'?'SEARCHING':s.afState,focusUntil:0,focusFailed:false,opticalRevision:s.opticalRevision+1});return true;
}
export function cancelShutterPress(settings:PhotographySettings){const s=settings.getState();if(!s.physical.engaged)return;Object.assign(s.physical,{engaged:false,held:false,afLocked:false,aeLocked:false});if(s.shutterRequested)settings.setState({shutterRequested:false,shutterBusy:false});}
export function releaseShutterPress(settings:PhotographySettings){const s=settings.getState();if(!s.physical.engaged||!s.physical.held)return;s.physical.held=false;s.physical.releasedAt=performance.now();requestPhotograph(settings);}
export function requestPhotograph(settings:PhotographySettings){
 const s=settings.getState(),now=Date.now();if(s.preview||s.shutterBusy||s.shutterRequested||now<s.nextShutterAt)return;
 settings.setState({shutterRequested:true,shutterBusy:true,photoMessage:"",photoUntil:0,nextShutterAt:now+650,shutterUntil:now+85,photoSequence:s.photoSequence+1});
}
/** Call immediately after the normal WebGL render, before the drawing buffer is discarded. */
export function capturePhotograph(canvas:HTMLCanvasElement,metadata:PhotographMetadata):Promise<CapturedPhotograph>{
 const final=processPhotograph(canvas,metadata);
 return new Promise((resolve,reject)=>{try{final.toBlob(blob=>blob?resolve({blob,metadata}):reject(new Error('Canvas returned no image data')),'image/png');}catch(error){reject(error);}});
}
export function downloadPhotograph({blob,metadata}:{blob:Blob;metadata:PhotographMetadata}){
 const date=new Date(metadata.timestamp),pad=(n:number,width=2)=>String(n).padStart(width,'0');
 const stamp=`${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())}_${pad(date.getHours())}-${pad(date.getMinutes())}-${pad(date.getSeconds())}-${pad(date.getMilliseconds(),3)}`;
 const url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download=`BhaktapurXR_${stamp}_${pad(metadata.sequence,3)}.png`;
 try{document.body.append(link);link.click();}finally{link.remove();setTimeout(()=>URL.revokeObjectURL(url),30000);}
}
