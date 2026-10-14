import {useEffect,useMemo} from "react";
import {BufferGeometry,Float32BufferAttribute} from "three";
import {phase9cBoundary} from "../../data/reconstruction/square-completion";
/** Explicit diagnostic envelope: outside grey context remains visible, never hidden by the review. */
export function SquareCompletionBoundary({review}:{review:string|null}){
 const geometry=useMemo(()=>{const g=new BufferGeometry();g.setAttribute("position",new Float32BufferAttribute(phase9cBoundary.flatMap(([x,z])=>[x,.055,z]),3));return g;},[]);
 useEffect(()=>()=>geometry.dispose(),[geometry]);
 return process.env.NODE_ENV==="development"&&review==="9c-full-aerial"?<lineLoop geometry={geometry}><lineBasicMaterial color="#43c5dc" depthTest={false}/></lineLoop>:null;
}
