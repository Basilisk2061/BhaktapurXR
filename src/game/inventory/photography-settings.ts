import {createStore} from 'zustand/vanilla';
export const apertures=[1.8,2.8,4,5.6,8,11,16] as const;
export const shutters=[30,60,125,250,500,1000] as const;
export const sensitivities=[100,200,400,800,1600,3200] as const;
export function createPhotographySettings(){return createStore(()=>({manual:false,focal:35,aperture:2,shutter:2,iso:0,ev:0,grid:false,panel:false,row:0,focus:10,manualFocus:false,focusRequested:false,focusUntil:0,focusFailed:false,modeUntil:0,shutterRequested:false,shutterBusy:false,nextShutterAt:0,shutterUntil:0,photoMessage:"",photoUntil:0,photoSequence:0}));}
export type PhotographySettings=ReturnType<typeof createPhotographySettings>;
/** Relative to F4, 1/125, ISO100. Bounded exposure; DOF is separate, no motion blur/noise. */
export function photographyExposure(s:ReturnType<PhotographySettings['getState']>){return Math.max(.125,Math.min(8,2**s.ev*(s.manual?(4/apertures[s.aperture])**2*(125/shutters[s.shutter])*(sensitivities[s.iso]/100):1)));}

/** Responsive photographic aiming, without acceleration or input lag. */
export function photographyLookScale(focal:number){if(focal<=50)return 1-.15*Math.max(0,focal-24)/26;if(focal<=85)return .85-.15*(focal-50)/35;return Math.max(.58,.7-.12*(focal-85)/50);}
