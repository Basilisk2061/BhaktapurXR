import {useState,type RefObject} from "react";
import {Html} from "@react-three/drei";
import {useFrame} from "@react-three/fiber";
import type {PlayerInput} from "../input/player-input";
import type {PlayerRuntime} from "./player-runtime";
const screenCentre=(_:unknown,__:unknown,size:{width:number;height:number})=>[size.width/2,size.height/2];
const screenOverlay=()=>{};
export function ArcadeSittingPrompt({runtime,input}:{runtime:RefObject<PlayerRuntime>;input?:RefObject<PlayerInput>}){
 const [prompt,setPrompt]=useState<"sit"|"stand"|null>(null);
 useFrame(()=>{const next=input?.current.touchMode?null:runtime.current.sitPrompt;if(next!==prompt)setPrompt(next);});
 // A screen HUD: its visibility is independent of the world origin/camera heading.
 return prompt?<Html fullscreen calculatePosition={screenCentre} onOcclude={screenOverlay} zIndexRange={[10,10]} style={{pointerEvents:"none"}}><div style={{position:"absolute",bottom:28,left:"50%",transform:"translateX(-50%)",padding:"6px 12px",borderRadius:4,background:"#171916bb",color:"white",fontSize:14}}>[E] {prompt==="sit"?"Sit":"Stand"}</div></Html>:null;
}
