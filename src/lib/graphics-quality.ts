"use client";
import {useSyncExternalStore} from 'react';
import type {QualityPreset} from '../types/quality';
import {graphicsSetting} from './graphics-presets';
let current:QualityPreset|null=null;
const valid=(value:unknown):value is QualityPreset=>value==='LOW'||value==='MEDIUM'||value==='HIGH';
function automaticQuality():QualityPreset{
 const device=navigator as Navigator&{deviceMemory?:number};
 const mobile=matchMedia('(pointer:coarse)').matches||/Android|iPhone|iPad/i.test(navigator.userAgent);
 const weak=(device.deviceMemory!==undefined&&device.deviceMemory<=4)||(device.hardwareConcurrency>0&&device.hardwareConcurrency<=4);
 return weak||(mobile&&(!device.deviceMemory||device.deviceMemory<=4))?'LOW':'MEDIUM';
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
