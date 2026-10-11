import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { BoxGeometry, InstancedMesh, Matrix4, Quaternion, Vector3, PlaneGeometry } from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { CuboidCollider, RigidBody } from "@react-three/rapier";
import { contextArchitecture, sourceArchitecture, supplementalArchitecture } from "@/data/architecture/registry";
import { architectureQuality } from "@/data/architecture/config";
import { DEFAULT_QUALITY_PRESET } from "@/lib/quality-config";
import { createHeritageMaterials, disposeHeritageMaterials, type HeritageMaterials, type HeritageMaterial } from "@/game/materials/heritage-materials";
import { buildArchitecturalModel, type DetailBox } from "./model";
import { hipRoofGeometry, volumeGeometry, profileGeometry } from "./geometry";
import { bhaktapurGround } from "@/data/world/map-measurements";

function DetailInstances({boxes,material,geometry,name}:{boxes:DetailBox[];material:HeritageMaterials[HeritageMaterial];geometry:BoxGeometry;name:string}) {
  const ref=useRef<InstancedMesh>(null);
  useLayoutEffect(()=>{
    if(!ref.current)return;
    const matrix=new Matrix4(),q=new Quaternion(),axis=new Vector3(0,1,0),position=new Vector3(),scale=new Vector3();
    boxes.forEach((b,i)=>{q.setFromAxisAngle(axis,b.yaw);matrix.compose(position.fromArray(b.position),q,scale.fromArray(b.size));ref.current!.setMatrixAt(i,matrix);});
    ref.current.instanceMatrix.needsUpdate=true;ref.current.computeBoundingSphere();
  },[boxes]);
  if(!boxes.length)return null;
  return <instancedMesh ref={ref} name={name} args={[geometry,material,boxes.length]} castShadow receiveShadow dispose={null} />;
}

export function HeritageEnvironment() {
  const assets=useMemo(()=>{
    const quality=DEFAULT_QUALITY_PRESET;
    const entries=[...sourceArchitecture,...supplementalArchitecture,...contextArchitecture.filter((_,i)=>i%architectureQuality[quality].contextStride===0)];
    const models=entries.map(entry=>buildArchitecturalModel(entry,quality));
    const materials=createHeritageMaterials(),box=new BoxGeometry(1,1,1);
    const details=Object.fromEntries(Object.keys(materials).map(key=>[key,models.flatMap(m=>m.details.filter(d=>d.material===key))])) as Record<HeritageMaterial,DetailBox[]>;
    const volumes=models.flatMap(m=>m.volumes.map((v,i)=>({...v,id:`${m.entry.id}:volume-${i}`,geometry:volumeGeometry(v.footprint,v.height),accuracy:m.entry.accuracy,sourceIds:m.entry.sourceIds})));
    const roofs=models.flatMap(m=>m.roofs.map((r,i)=>({...r,id:`${m.entry.id}:roof-${i}`,geometry:hipRoofGeometry(r.width,r.depth,r.rise)})));
    const mergedVolumes=(["brick","stone","timber"] as const).map(material=>{
      const pieces=volumes.filter(v=>v.material===material).map(v=>v.geometry.clone().translate(0,v.y,0));
      const geometry=pieces.length?mergeGeometries(pieces,false)!:null;pieces.forEach(g=>g.dispose());return {material,geometry};
    }).filter((v): v is {material:typeof v.material;geometry:NonNullable<typeof v.geometry>}=>v.geometry!==null);
    const mergedProfiles=(Object.keys(materials) as HeritageMaterial[]).map(material=>{
      const pieces=models.flatMap(m=>m.pieces.filter(p=>p.material===material).map(profileGeometry));
      const geometry=pieces.length?mergeGeometries(pieces,false)!:null;pieces.forEach(g=>g.dispose());return {material,geometry};
    }).filter((v): v is {material:typeof v.material;geometry:NonNullable<typeof v.geometry>}=>v.geometry!==null);
    const roofPieces=roofs.map(r=>r.geometry.clone().rotateY(r.yaw).translate(...r.position));
    const mergedRoofs=mergeGeometries(roofPieces,false)!;roofPieces.forEach(g=>g.dispose());
    volumes.forEach(v=>v.geometry.dispose());roofs.forEach(r=>r.geometry.dispose());
    const paving=new PlaneGeometry(bhaktapurGround.size,bhaktapurGround.size);const uv=paving.getAttribute("uv");for(let i=0;i<uv.count;i++)uv.setXY(i,uv.getX(i)*bhaktapurGround.size/2,uv.getY(i)*bhaktapurGround.size/2);
    return {models,materials,box,details,mergedVolumes,mergedProfiles,roofs,mergedRoofs,paving};
  },[]);
  useEffect(()=>()=>{disposeHeritageMaterials(assets.materials);assets.box.dispose();assets.paving.dispose();[...assets.mergedVolumes,...assets.mergedProfiles].forEach(v=>v.geometry.dispose());assets.mergedRoofs.dispose();},[assets]);
  return <group name="procedural-heritage-environment" userData={{accuracy:"APPROXIMATE",interpretation:"Architectural heights/details are procedural assumptions; context is PLACEHOLDER"}}>
    <RigidBody type="fixed" colliders={false} name="heritage-plaza-ground" friction={.8}>
      <CuboidCollider args={[bhaktapurGround.size/2,.25,bhaktapurGround.size/2]} position={[0,-.25,0]} />
      <mesh name="plaza-paving" rotation={[-Math.PI/2,0,0]} position={[0,.01,0]} geometry={assets.paving} material={assets.materials.paving} receiveShadow dispose={null} />
    </RigidBody>
    <RigidBody type="fixed" colliders={false} name="heritage-architecture-collision">
      {assets.models.flatMap(m=>m.colliders.map((c,i)=><CuboidCollider key={`${m.entry.id}:${i}`} args={[c.size[0]/2,c.size[1]/2,c.size[2]/2]} position={c.position} rotation={[0,c.yaw,0]} />))}
      {assets.roofs.map(r=><CuboidCollider key={r.id} args={[r.width/2,.13,r.depth/2]} position={[r.position[0],r.position[1]+.13,r.position[2]]} rotation={[0,r.yaw,0]} />)}
    </RigidBody>
    {assets.mergedVolumes.map(v=><mesh key={v.material} name={`heritage-volumes:${v.material}`} geometry={v.geometry} material={assets.materials[v.material]} castShadow receiveShadow dispose={null} userData={{entries:assets.models.map(m=>({id:m.entry.id,accuracy:m.entry.accuracy,sourceIds:m.entry.sourceIds})),heightClaim:"APPROXIMATE ARCHITECTURAL PARAMETER"}} />)}
    <mesh name="heritage-roofs" geometry={assets.mergedRoofs} material={assets.materials.roof} castShadow receiveShadow dispose={null} />
    {assets.mergedProfiles.map(v=><mesh key={v.material} name={`landmark-profiles:${v.material}`} geometry={v.geometry} material={assets.materials[v.material]} castShadow receiveShadow dispose={null} />)}
    {(Object.keys(assets.details) as HeritageMaterial[]).map(k=><DetailInstances key={k} boxes={assets.details[k]} material={assets.materials[k]} geometry={assets.box} name={`architectural-details:${k}`} />)}
  </group>;
}
