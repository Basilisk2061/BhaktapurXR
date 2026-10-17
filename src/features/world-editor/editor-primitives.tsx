"use client";
import {useEffect,useLayoutEffect,useMemo,useRef} from "react";
import {type BoxGeometry,type CylinderGeometry,type SphereGeometry,Color,type Group,type MeshStandardMaterial} from "three";
import {RigidBody,ConvexHullCollider} from "@react-three/rapier";
import {createCentralMaterials} from "../../game/architecture/central-visual-assets";
import {finishPalacePalette} from "../../game/architecture/palace-palette";
import {finishMuseumMaterials} from "../../game/architecture/museum-sign";
import {finishCentralStoneMaterials} from "../../game/architecture/central-stone-materials";
import type {CreatedObject,EditorMaterial} from "./scene-data";
import {createPrimitiveGeometries,primitiveHull} from "./primitive-geometry";
import type {EditorSession} from "./session";
function Primitive({object,materials,geometry,session}:{object:CreatedObject;materials:Record<EditorMaterial,MeshStandardMaterial>;geometry:BoxGeometry|CylinderGeometry|SphereGeometry;session?:EditorSession}){
 const ref=useRef<Group>(null),material=useMemo(()=>{const base=materials[object.materialId],m=base.clone();m.onBeforeCompile=(shader,renderer)=>{base.onBeforeCompile(shader,renderer);shader.vertexShader=shader.vertexShader.replace('#include <uv_vertex>',`#include <uv_vertex>
 #if defined(USE_MAP) && !defined(USE_INSTANCING)
 vec3 editorExtent=vec3(length(modelMatrix[0].xyz),length(modelMatrix[1].xyz),length(modelMatrix[2].xyz));
 vec2 editorTiles=abs(normal.y)>.5?editorExtent.xz/2.0:abs(normal.x)>.5?editorExtent.zy/2.0:editorExtent.xy/2.0;
 vMapUv *= editorTiles;
 #ifdef USE_BUMPMAP
 vBumpMapUv *= editorTiles;
 #endif
 #endif`);};m.customProgramCacheKey=()=>base.customProgramCacheKey()+":editor";if(object.colorOverride)m.color.multiply(new Color(object.colorOverride));return m;},[materials,object.materialId,object.colorOverride]);
 const hull=useMemo(()=>primitiveHull(geometry,object.scale),[geometry,object.scale]);
 useLayoutEffect(()=>{session?.register(object.id,ref.current);return ()=>session?.register(object.id,null);},[session,object.id]);useEffect(()=>()=>material.dispose(),[material]);
 return <><group ref={ref} name={object.id} userData={{editableId:object.id}} position={object.position} rotation={object.rotation} scale={object.scale}><mesh geometry={geometry} material={material} castShadow receiveShadow dispose={null}/></group><RigidBody key={JSON.stringify([object.position,object.rotation,object.scale])} type="fixed" colliders={false} position={object.position} rotation={object.rotation} name={`editor-collision:${object.id}`}><ConvexHullCollider args={[hull]}/></RigidBody></>;
}
function Objects({objects,session}:{objects:CreatedObject[];session?:EditorSession}){
 const assets=useMemo(()=>({materials:finishCentralStoneMaterials(finishMuseumMaterials(finishPalacePalette(createCentralMaterials()))),geometries:createPrimitiveGeometries()}),[]);
 useEffect(()=>()=>{Object.values(assets.geometries).forEach(g=>g.dispose());const maps=new Set(Object.values(assets.materials).flatMap(m=>m.map?[m.map]:[]));maps.forEach(m=>m.dispose());Object.values(assets.materials).forEach(m=>m.dispose());},[assets]);
 return <>{objects.map(o=><Primitive key={o.id} object={o} materials={assets.materials} geometry={assets.geometries[o.primitiveType]} session={session}/>)}</>;
}
export function EditorPrimitives({objects,session}:{objects:CreatedObject[];session?:EditorSession}){return objects.length?<Objects objects={objects} session={session}/>:null;}
