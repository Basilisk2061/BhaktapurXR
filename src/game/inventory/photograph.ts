import type {PhotographySettings} from './photography-settings';
/** Device-only capture result, reusable by a future local gallery/scoring layer. */
export interface PhotographMetadata {
 timestamp:string;focalLength:number;requestedFocalLength:number;fov:number;aperture:number;shutterSeconds:number;iso:number;ev:number;focusDistance:number;manualFocus:boolean;
 cameraPosition:[number,number,number];cameraQuaternion:[number,number,number,number];cameraDirection:[number,number,number];
 gameHour:number;timeMode:string;rendererExposure:number;width:number;height:number;sequence:number;
}
export interface CapturedPhotograph {blob:Blob;metadata:PhotographMetadata}
export function requestPhotograph(settings:PhotographySettings){
 const s=settings.getState(),now=Date.now();if(s.preview||s.shutterBusy||s.shutterRequested||now<s.nextShutterAt)return;
 settings.setState({shutterRequested:true,shutterBusy:true,photoMessage:"",photoUntil:0,nextShutterAt:now+650,shutterUntil:now+85,photoSequence:s.photoSequence+1});
}
/** Call immediately after the normal WebGL render, before the drawing buffer is discarded. */
export function capturePhotograph(canvas:HTMLCanvasElement,metadata:PhotographMetadata):Promise<CapturedPhotograph>{
 return new Promise((resolve,reject)=>{try{canvas.toBlob(blob=>blob?resolve({blob,metadata}):reject(new Error('Canvas returned no image data')),'image/png');}catch(error){reject(error);}});
}
export function downloadPhotograph({blob,metadata}:{blob:Blob;metadata:PhotographMetadata}){
 const date=new Date(metadata.timestamp),pad=(n:number,width=2)=>String(n).padStart(width,'0');
 const stamp=`${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())}_${pad(date.getHours())}-${pad(date.getMinutes())}-${pad(date.getSeconds())}-${pad(date.getMilliseconds(),3)}`;
 const url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download=`BhaktapurXR_${stamp}_${pad(metadata.sequence,3)}.png`;
 try{document.body.append(link);link.click();}finally{link.remove();setTimeout(()=>URL.revokeObjectURL(url),30000);}
}
