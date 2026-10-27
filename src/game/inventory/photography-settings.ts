import {createPhysicalCamera} from './physical-camera';
import {createLensState} from './photography-optics';
import type {CapturedPhotograph} from './photograph';
import {createStore} from 'zustand/vanilla';
export const apertures=[1.8,2.8,4,5.6,8,11,16] as const;
export const shutters=[30,60,125,250,500,1000] as const;
export const sensitivities=[100,200,400,800,1600,3200] as const;
export function createPhotographySettings(){return createStore(()=>({exposureMode:"AUTO" as "AUTO"|"A"|"M",focal:35,aperture:2,shutter:2,iso:0,ev:0,grid:false,panel:false,row:0,targetFocusDistance:10,actualFocusDistance:10,lens:createLensState(),physical:createPhysicalCamera(),opticalRevision:0,afState:"SEARCHING" as "SEARCHING"|"ACQUIRED"|"STEADY",focusMode:"AF" as "AF"|"MF",focusRequested:false,focusUntil:0,focusFailed:false,modeUntil:0,shutterRequested:false,shutterBusy:false,nextShutterAt:0,shutterUntil:0,photoMessage:"",photoUntil:0,photoSequence:0,preview:null as CapturedPhotograph|null}));}
export type PhotographySettings=ReturnType<typeof createPhotographySettings>;
/** Effective settings are published at 8Hz; the mutable lens is stepped without React updates. */
export function effectivePhotography(s:ReturnType<PhotographySettings['getState']>){return s.lens;}
export function photographyExposure(s:ReturnType<PhotographySettings['getState']>){return s.lens.exposureMultiplier;}
export function nextExposureMode(mode:'AUTO'|'A'|'M'){return mode==='AUTO'?'A':mode==='A'?'M':'AUTO';}

/** Responsive photographic aiming, without acceleration or input lag. */
export function photographyLookScale(focal:number){if(focal<=50)return 1-.15*Math.max(0,focal-24)/26;if(focal<=85)return .85-.15*(focal-50)/35;return Math.max(.58,.7-.12*(focal-85)/50);}
