import {createStore} from "zustand/vanilla";
import type {HeritageInteractionZone} from "./types";
/** One store per Explore session; no state lives on monument meshes or leaks across routes. */
export function createHeritageStore(){return createStore<{
 nearest:HeritageInteractionZone|null;openId:string|null;
 setNearest:(zone:HeritageInteractionZone|null)=>void;open:(id:string)=>void;close:()=>void;
}>((set,get)=>({nearest:null,openId:null,
 setNearest:zone=>{if(get().nearest!==zone)set({nearest:zone});},
 open:id=>set({openId:id}),close:()=>set({openId:null})
}));}
