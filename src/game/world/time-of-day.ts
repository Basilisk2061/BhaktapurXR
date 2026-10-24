import {createStore} from 'zustand/vanilla';
export type TimeMode='AUTO'|'FORCED_DAY'|'FORCED_NIGHT';
export type NpcOverride='AUTO'|'WALK'|'SIT';
/** A complete simulated day in real seconds. Independent of wall-clock/time zone. */
export const dayCycleSeconds=25*60;
export const environmentStore=createStore<{
 hour:number;mode:TimeMode;npcs:NpcOverride;
 setMode:(mode:TimeMode)=>void;setNpcs:(npcs:NpcOverride)=>void;
}>(set=>({hour:12,mode:'AUTO',npcs:'AUTO',
 setMode:mode=>set(state=>({mode,hour:mode==='FORCED_DAY'?12:mode==='FORCED_NIGHT'?0:state.hour})),
 setNpcs:npcs=>set({npcs})}));
export function advanceEnvironment(seconds:number){
 const state=environmentStore.getState();
 if(state.mode==='AUTO')environmentStore.setState({hour:(state.hour+seconds*24/dayCycleSeconds)%24});
}
const smooth=(a:number,b:number,x:number)=>{const t=Math.max(0,Math.min(1,(x-a)/(b-a)));return t*t*(3-2*t);};
export function daylightAmount(hour:number){return smooth(5,7,hour)*(1-smooth(17,19,hour));}
