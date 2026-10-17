import {use,useContext,useEffect,useMemo,useRef,useState} from "react";
import {useFrame} from "@react-three/fiber";
import {Texture,Vector3} from "three";
import {loadEntrance,loadZone} from "../world/zone-assets";
import {zoneDistance,streamingDistances} from "../world/streaming-zones";
import {StreamingReadiness,NpcReadiness} from "../world/streaming-readiness";
import {CentralHeritageEnvironment} from "./central-environment";
import {createCentralMaterials} from "./central-visual-assets";
import {finishPalacePalette} from "./palace-palette";
import {finishMuseumMaterials} from "./museum-sign";
import {finishCentralStoneMaterials} from "./central-stone-materials";
import {finishInsideSquarePaving} from "./inside-square-surfaces";
import {polishDaylightPalette} from "./daylight-palette";
import type {TransformOverrides} from "../../features/world-editor/transforms";
import type {CentralModel} from "./central-model";
export function StreamedEnvironment({manualOverrides}:{manualOverrides?:TransformOverrides}){
 const initial=use(loadEntrance()),[loaded,setLoaded]=useState(initial.models),[active,setActive]=useState(()=>new Set(initial.models.keys())),[error,setError]=useState<Error|null>(null),pending=useRef(new Set<string>()),alive=useRef(true),clock=useRef(0),blocked=useRef(false),report=useContext(StreamingReadiness),reportNpcs=useContext(NpcReadiness);
 const point=useMemo(()=>new Vector3(),[]);
 const materials=useMemo(()=>{const m=finishCentralStoneMaterials(finishMuseumMaterials(finishPalacePalette(createCentralMaterials())));finishInsideSquarePaving(m.paving);polishDaylightPalette(m);return m;},[]);
 useEffect(()=>{alive.current=true;return()=>{alive.current=false;report(false);const maps=new Set<Texture>();Object.values(materials).forEach(m=>{Object.values(m).forEach(v=>{if(v instanceof Texture)maps.add(v);});m.dispose();});maps.forEach(t=>t.dispose());};},[materials,report]);
 useFrame(({scene,camera},dt)=>{
  clock.current+=dt;if(clock.current<.1)return;clock.current=0;
  const body=scene.getObjectByName("player-body");if(body)body.getWorldPosition(point);else point.copy(camera.position);
  let waiting=false;
  const changedOverrides=JSON.stringify(manualOverrides??{})!==initial.manifest.overridesSignature;
  for(const entry of initial.manifest.zones){

   // Saved part/assembly moves can cross source bounds. Any override is conservative: preload all.
   const distance=zoneDistance(entry.bounds,point.x,point.z);
   if(!loaded.has(entry.id)&&(distance<=streamingDistances.preload||changedOverrides)){
    if(!pending.current.has(entry.id)){pending.current.add(entry.id);void loadZone(entry).then(models=>{if(alive.current)setLoaded(previous=>new Map(previous).set(entry.id,models));}).catch(e=>{if(alive.current)setError(e);});}
   }
   if(loaded.has(entry.id)&&!active.has(entry.id)&&(distance<=streamingDistances.active||changedOverrides))setActive(previous=>new Set(previous).add(entry.id));
   if(!active.has(entry.id)&&distance<streamingDistances.safety)waiting=true;
  }
  reportNpcs(active.size===initial.manifest.zones.length);
  if(waiting!==blocked.current){blocked.current=waiting;report(waiting);}
 });
 if(error)throw error;
 const entries=[...loaded].filter(([id])=>active.has(id));
 return <>{entries.map(([id,models],i)=><Zone key={id} patches={initial.manifest.groundPatches} models={models} ground={i===0} materials={materials} overrides={manualOverrides}/>)}</>;
}
function Zone({patches,models,ground,materials,overrides}:{patches:{x:number;z:number;width:number;depth:number}[];models:CentralModel[];ground:boolean;materials:ReturnType<typeof finishCentralStoneMaterials>;overrides?:TransformOverrides}){
 const data=useMemo(()=>({models,urban:{models:[],groundPatches:ground?patches:[]}}),[models,ground,patches]);
 return <CentralHeritageEnvironment data={data} includeGround={ground} sharedMaterials={materials} manualOverrides={overrides}/>;
}
