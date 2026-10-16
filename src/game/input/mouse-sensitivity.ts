import {playerConfig} from '../player/player-config.ts';
export const mouseSensitivitySetting={key:'bhaktapurxr.mouse-sensitivity',event:'bhaktapurxr:mouse-sensitivity',min:25,max:250,default:100} as const;
type StorageAccess=Pick<Storage,'getItem'|'setItem'>;
let fallback=100;
export function normalizeSensitivityPercent(value:number){return Number.isFinite(value)?Math.min(mouseSensitivitySetting.max,Math.max(mouseSensitivitySetting.min,value)):mouseSensitivitySetting.default;}
export function readSensitivityPercent(storage?:StorageAccess){
 try{const source=storage??(typeof window!=='undefined'?window.localStorage:undefined),value=source?.getItem(mouseSensitivitySetting.key);return value===null?mouseSensitivitySetting.default:value===undefined?fallback:normalizeSensitivityPercent(Number(value));}catch{return fallback;}
}
export function readMouseSensitivity(){return playerConfig.camera.sensitivity*readSensitivityPercent()/100;}
export function setSensitivityPercent(value:number,storage?:StorageAccess){
 fallback=normalizeSensitivityPercent(value);
 try{(storage??(typeof window!=='undefined'?window.localStorage:undefined))?.setItem(mouseSensitivitySetting.key,String(fallback));}catch{/* Private browsing can still use the preference in this tab. */}
 if(typeof window!=='undefined')window.dispatchEvent(new Event(mouseSensitivitySetting.event));
}
export function subscribeSensitivity(change:()=>void){
 window.addEventListener('storage',change);window.addEventListener(mouseSensitivitySetting.event,change);
 return()=>{window.removeEventListener('storage',change);window.removeEventListener(mouseSensitivitySetting.event,change);};
}
