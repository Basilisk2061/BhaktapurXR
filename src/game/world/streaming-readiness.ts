import {createContext} from "react";
export const StreamingReadiness=createContext<(blocked:boolean)=>void>(()=>{});
export const NpcReadiness=createContext<(ready:boolean)=>void>(()=>{});
