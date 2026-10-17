import {createContext} from "react";
export const StreamingReadiness=createContext<(blocked:boolean)=>void>(()=>{});
export const NpcReadiness=createContext<(ready:boolean)=>void>(()=>{});
export const StreamingPlayerSpawn=createContext<readonly [number,number]>([0,0]);
