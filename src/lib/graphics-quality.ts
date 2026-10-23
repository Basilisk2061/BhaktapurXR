"use client";
import {useSyncExternalStore} from 'react';
import type {QualityPreset} from '../types/quality';
import {graphicsSetting} from './graphics-presets';
let current:QualityPreset|null=null;
const valid=(value:unknown):value is QualityPreset=>value==='VERY LOW'||value==='LOW'||value==='MEDIUM'||value==='HIGH';
function automaticQuality():QualityPreset{
 const device=navigator as Navigator&{deviceMemory?:number};
 const mobile=matchMedia('(pointer:coarse)').matches||/Android|iPhone|iPad/i.test(navigator.userAgent);
 const memory=device.deviceMemory,cores=device.hardwareConcurrency||0;
 const smallCpu=cores>0&&cores<=4,verySmallCpu=cores>0&&cores<=2;
 const denseScreen=window.devicePixelRatio>=2&&Math.max(screen.width,screen.height)>=800;
 if(memory!==undefined&&memory<=4&&(mobile||smallCpu))return 'VERY LOW';
 if(memory!==undefined&&memory<=6&&smallCpu&&(mobile||verySmallCpu))return 'VERY LOW';
 if(verySmallCpu&&(mobile||denseScreen))return 'VERY LOW';
 if(mobile||smallCpu||(memory!==undefined&&memory<=6))return 'LOW';
 return 'MEDIUM';
}
export function readGraphicsQuality():QualityPreset{
 if(typeof window==='undefined')return 'MEDIUM';
 if(current)return current;
 try{const saved=localStorage.getItem(graphicsSetting.key);if(valid(saved))return current=saved;}catch{/* In-memory settings remain usable. */}
 return current=automaticQuality();
}
export function setGraphicsQuality(value:QualityPreset){
 current=value;
 try{localStorage.setItem(graphicsSetting.key,value);}catch{/* Private browsing can retain the choice for this tab. */}
 window.dispatchEvent(new Event(graphicsSetting.event));
}
function subscribe(change:()=>void){
 const storage=(event:StorageEvent)=>{if(event.key===graphicsSetting.key||event.key===null){current=null;change();}};
 window.addEventListener('storage',storage);window.addEventListener(graphicsSetting.event,change);
 return()=>{window.removeEventListener('storage',storage);window.removeEventListener(graphicsSetting.event,change);};
}
export const useGraphicsQuality=()=>useSyncExternalStore(subscribe,readGraphicsQuality,():QualityPreset=>'MEDIUM');
