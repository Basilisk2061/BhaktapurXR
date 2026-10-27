import type {PhotographMetadata} from './photograph';
import {cameraPerf} from '../rendering/camera-performance';
/** Snapshot immediately; all work is capture-only and preview/download share the resulting PNG. */
export function processPhotograph(source:HTMLCanvasElement,metadata:PhotographMetadata){
 const start=process.env.NODE_ENV==='development'?performance.now():0;
 const image=document.createElement('canvas');image.width=source.width;image.height=source.height;
 const context=image.getContext('2d',{willReadFrequently:true});if(!context)throw Error('Photo processing canvas unavailable');
 context.drawImage(source,0,0);
 const [dx,dy]=metadata.effects.shakePixels;
 if(Math.hypot(dx,dy)>.25){
  const sharp=document.createElement('canvas');sharp.width=image.width;sharp.height=image.height;const copy=sharp.getContext('2d');if(!copy)throw Error('Photo motion canvas unavailable');copy.drawImage(image,0,0);
  context.clearRect(0,0,image.width,image.height);context.globalCompositeOperation='lighter';context.globalAlpha=1/7;
  for(let i=-3;i<=3;i++)context.drawImage(sharp,dx*i/6,dy*i/6);
  context.globalAlpha=1;context.globalCompositeOperation='source-over';
 }
 const pixels=context.getImageData(0,0,image.width,image.height),data=pixels.data,noise=metadata.effects.noise,vignette=metadata.effects.vignette;
 let seed=(metadata.sequence*2654435761)>>>0;
 const random=()=>{seed^=seed<<13;seed^=seed>>>17;seed^=seed<<5;return (seed>>>0)/4294967296;};
 for(let y=0;y<image.height;y++)for(let x=0;x<image.width;x++){
  const i=(y*image.width+x)*4,luminance=(data[i]*.2126+data[i+1]*.7152+data[i+2]*.0722)/255;
  const radius=((x/image.width-.5)**2+(y/image.height-.5)**2)*2;
  const shade=1-vignette*radius*radius;
  const grain=noise?(random()+random()-1)*noise*(1.45-.8*luminance):0;
  const chroma=noise?(random()-.5)*noise*.1:0;
  data[i]=data[i]*shade+grain+chroma;data[i+1]=data[i+1]*shade+grain;data[i+2]=data[i+2]*shade+grain-chroma;data[i+3]=255;
 }
 context.putImageData(pixels,0,0);
 if(process.env.NODE_ENV==='development')cameraPerf?.end('Photo Process',start);
 return image;
}
