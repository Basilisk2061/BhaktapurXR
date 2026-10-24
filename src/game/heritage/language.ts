"use client";
import {useSyncExternalStore} from "react";
import type {HeritageLanguage} from "./types";

const key="bhaktapurxr.heritage-language",eventName="bhaktapurxr:heritage-language";
let memory:HeritageLanguage|undefined;
function snapshot():HeritageLanguage {
 if(memory)return memory;
 try {return window.localStorage.getItem(key)==="ne"?"ne":"en";} catch {return "en";}
}
function subscribe(notify:()=>void){
 const storage=(event:StorageEvent)=>{if(event.key===key||event.key===null){memory=undefined;notify();}};
 window.addEventListener(eventName,notify);window.addEventListener("storage",storage);
 return()=>{window.removeEventListener(eventName,notify);window.removeEventListener("storage",storage);};
}
export function setHeritageLanguage(language:HeritageLanguage){
 memory=language;
 try {window.localStorage.setItem(key,language);} catch {/* Keep the preference for this visit when storage is unavailable. */}
 window.dispatchEvent(new Event(eventName));
}
export function useHeritageLanguage(){return useSyncExternalStore(subscribe,snapshot,():HeritageLanguage=>"en");}
