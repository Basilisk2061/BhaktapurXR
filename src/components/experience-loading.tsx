"use client";
import {StartupDiagnostics} from "./startup-diagnostics";
export function ExperienceLoading({ready=false}:{ready?:boolean}){
 if(ready)return null;
 return <div className="absolute inset-0 z-10 flex items-center justify-center bg-gradient-to-b from-[#102333] to-[#1e302d] text-stone-200" role="status" aria-live="polite" data-experience-loading><StartupDiagnostics/><div className="px-6 text-center"><p className="font-semibold tracking-wide">BhaktapurXR</p><p className="mt-3 text-sm text-stone-300">Entering the square?</p></div></div>;
}
