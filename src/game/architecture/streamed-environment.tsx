import {use,useContext,useEffect,useMemo,useRef,useState} from "react";
import {useFrame} from "@react-three/fiber";
import {Texture,Vector3} from "three";
import {loadEntrance,loadZone} from "../world/zone-assets";
import {zoneDistance,streamingDistances,keepStreamed} from "../world/streaming-zones";
import {StreamingReadiness,NpcReadiness,StreamingPlayerSpawn} from "../world/streaming-readiness";
import {CentralHeritageEnvironment} from "./central-environment";
import {createCentralMaterials} from "./central-visual-assets";
import {finishPalacePalette} from "./palace-palette";
import {finishMuseumMaterials} from "./museum-sign";
import {finishCentralStoneMaterials} from "./central-stone-materials";
import {finishInsideSquarePaving} from "./inside-square-surfaces";
import {polishDaylightPalette} from "./daylight-palette";
import type {TransformOverrides} from "../../features/world-editor/transforms";
import type {CentralModel} from "./central-model";
const emptyModels:CentralModel[]=[],emptyPatches:{x:number;z:number;width:number;depth:number}[]=[];
export function StreamedEnvironment({manualOverrides}:{manualOverrides?:TransformOverrides}){
 const spawn=useContext(StreamingPlayerSpawn);
 const initial=use(loadEntrance()),[loaded,setLoaded]=useState(initial.models),[active,setActive]=useState(()=>new Set([...initial.models.values()].flat().filter(m=>zoneDistance(initial.manifest.modelBounds[m.id],...spawn)<=streamingDistances.preload).map(m=>m.id))),[error,setError]=useState<Error|null>(null),pending=useRef(new Set<string>()),alive=useRef(true),clock=useRef(0),blocked=useRef(false),report=useContext(StreamingReadiness),reportNpcs=useContext(NpcReadiness);
 const point=useMemo(()=>new Vector3(),[]);
 const materials=useMemo(()=>{const m=finishCentralStoneMaterials(finishMuseumMaterials(finishPalacePalette(createCentralMaterials())));finishInsideSquarePaving(m.paving);polishDaylightPalette(m);return m;},[]);
 useEffect(()=>{alive.current=true;return()=>{alive.current=false;report(false);const maps=new Set<Texture>();Object.values(materials).forEach(m=>{Object.values(m).forEach(v=>{if(v instanceof Texture)maps.add(v);});m.dispose();});maps.forEach(t=>t.dispose());};},[materials,report]);
 useFrame(({scene},dt)=>{
  clock.current+=dt;if(clock.current<.1)return;clock.current=0;
  const body=scene.getObjectByName("player-body");if(body)body.getWorldPosition(point);else point.set(spawn[0],0,spawn[1]);
  let waiting=false;const next=new Set(active);
  for(const entry of initial.manifest.zones){
   const distance=zoneDistance(entry.bounds,point.x,point.z);
   if(!loaded.has(entry.id)&&distance<=streamingDistances.unload&&!pending.current.has(entry.id)){
    pending.current.add(entry.id);void loadZone(entry).then(models=>{if(alive.current)setLoaded(previous=>new Map(previous).set(entry.id,models));}).catch(e=>{if(alive.current)setError(e);});
   }
   if(!loaded.has(entry.id)&&distance<streamingDistances.safety)waiting=true;
   // Fetch neighboring chunks ahead of the 75 m visibility band; only mount nearby footprints.
   // The required area is 50 m; retain mounted geometry to 100 m to avoid boundary churn.
   for(const {id} of loaded.get(entry.id)??[]){
    const d=zoneDistance(initial.manifest.modelBounds[id],point.x,point.z);
    if(d<=streamingDistances.preload||keepStreamed(d,active.has(id)))next.add(id);else next.delete(id);
    if(d<streamingDistances.safety&&!active.has(id))waiting=true;
   }
  }
  if(next.size!==active.size||[...next].some(id=>!active.has(id)))setActive(next);
  if(!waiting)reportNpcs(true);

  if(waiting!==blocked.current){blocked.current=waiting;report(waiting);}
 });
 const entries=useMemo(()=>[...loaded].map(([id,models])=>[id,models.filter(m=>active.has(m.id))] as const).filter(([,models])=>models.length),[loaded,active]);
 if(error)throw error;
 return <><Zone patches={initial.manifest.groundPatches} models={emptyModels} ground={true} materials={materials} overrides={manualOverrides}/>{entries.map(([id,models])=><Zone key={id} patches={emptyPatches} models={models} ground={false} materials={materials} overrides={manualOverrides}/>)}</>;
}
function Zone({patches,models,ground,materials,overrides}:{patches:{x:number;z:number;width:number;depth:number}[];models:CentralModel[];ground:boolean;materials:ReturnType<typeof finishCentralStoneMaterials>;overrides?:TransformOverrides}){
 const data=useMemo(()=>({models,urban:{models:[],groundPatches:ground?patches:[]}}),[models,ground,patches]);
 return <CentralHeritageEnvironment data={data} includeGround={ground} sharedMaterials={materials} manualOverrides={overrides}/>;
}
