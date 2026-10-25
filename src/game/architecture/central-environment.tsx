import {useBellSession,interactiveBellIds,movableBellRole} from "../bells/bell-session";
import {useGraphicsQuality} from "../../lib/graphics-quality";
import {graphicsPresets} from "../../lib/graphics-presets";
import {polishDaylightPalette} from "./daylight-palette";
import savedEditorScene from "../../features/bhaktapur/data/world-editor-state.json";
const persistedHidden:Record<string,boolean>=Object.fromEntries(savedEditorScene.hiddenObjects.map(id=>[id,true]));
import {audioSurfaceRef,modelAudioSurfaces} from "../audio/audio-surfaces";
import type {WorldRenderData} from "./world-render-data";

import {finishPalacePalette} from "./palace-palette";
import {finishCentralStoneMaterials} from "./central-stone-materials";
import {finishMuseumMaterials} from "./museum-sign";
import {partitionArchitecturalParts,architecturalPartKey,architecturalPartId} from "../../features/world-editor/parts";
import {isEditorEntryVisible} from "../../features/world-editor/visibility";
import {sameTransform,overrideMatrix,transformMatrix,affineCollider,partWorldDelta,type ManualTransform,type TransformOverrides} from "../../features/world-editor/transforms";
import type {AssemblyEditorBinding} from "../../features/world-editor/binding";
import {useEffect,useLayoutEffect,useMemo,useRef} from "react";
import {BoxGeometry,BufferGeometry,DoubleSide,ExtrudeGeometry,Float32BufferAttribute,InstancedMesh,LatheGeometry,Matrix4,MeshStandardMaterial,PlaneGeometry,Quaternion,Shape,Vector2,Vector3,Group} from "three";
import {mergeGeometries} from "three/addons/utils/BufferGeometryUtils.js";
import {CuboidCollider,ConvexHullCollider,RigidBody} from "@react-three/rapier";
import {Html} from "@react-three/drei";
import {centralGround,type CentralBox,type CentralMaterial,type CentralProfile,type CentralRoof,type CentralShape,type CentralModel} from "./central-model";

import {finishInsideSquarePaving} from "./inside-square-surfaces";
import {urbanVolumeGeometry,urbanRoofGeometry} from "./urban-surface-geometry";


import {remainingSpecificationById} from "../../data/reconstruction/architecture/remaining-specifications";
import {createCentralMaterials,profileGeometry,shapeGeometry,roofGeometry} from "./central-visual-assets";
export {createCentralMaterials,centralMaterialDefinitions} from "./central-visual-assets";
function InstanceBatch({boxes,material,geometry,name,basis,partIds,shadow,receive}:{shadow:boolean;receive:boolean;partIds?:string[];basis?:Matrix4;boxes:CentralBox[];material:MeshStandardMaterial;geometry:BoxGeometry;name:string}){const ref=useRef<InstancedMesh>(null);useLayoutEffect(()=>{if(!ref.current)return;const matrix=new Matrix4(),q=new Quaternion(),tilt=new Quaternion(),axis=new Vector3(0,1,0),xaxis=new Vector3(1,0,0),position=new Vector3(),scale=new Vector3();boxes.forEach((b,i)=>{q.setFromAxisAngle(axis,b.yaw);if(b.tilt)q.multiply(tilt.setFromAxisAngle(xaxis,b.tilt));matrix.compose(position.fromArray(b.position),q,scale.fromArray(b.size));if(basis)matrix.premultiply(basis);ref.current!.setMatrixAt(i,matrix)});ref.current.instanceMatrix.needsUpdate=true;ref.current.computeBoundingSphere();ref.current.computeBoundingBox();},[boxes,basis]);return boxes.length?<instancedMesh matrixAutoUpdate={false} frustumCulled ref={ref} name={name} userData={{graphicsShadowManaged:true,...(partIds?{partIds}:{})}} args={[geometry,material,boxes.length]} castShadow={shadow&&!material.userData.exteriorGround} receiveShadow={receive} dispose={null}/>:null;}
// Shadow-only presentation budget: every architectural box remains visible and
// keeps its original transform/part ID. Small details simply skip the shadow pass.
function Instances(props:{partIds?:string[];basis?:Matrix4;boxes:CentralBox[];material:MeshStandardMaterial;geometry:BoxGeometry;name:string}){
 const quality=useGraphicsQuality(),budget=graphicsPresets[quality];
 const batches=useMemo(()=>{
  const casting:CentralBox[]=[],details:CentralBox[]=[],castingIds:string[]=[],detailIds:string[]=[];
  props.boxes.forEach((box,i)=>{
   const dimensions=[...box.size].sort((a,b)=>b-a);
   const casts=budget.shadows&&dimensions[0]>=budget.shadowMinRadius&&dimensions[0]*dimensions[1]>=budget.shadowMinRadius*.6&&!/lattice|woven|window-division/.test(box.role);
   (casts?casting:details).push(box);
   if(props.partIds)(casts?castingIds:detailIds).push(props.partIds[i]);
  });
  return {casting,details,castingIds,detailIds};
 },[props.boxes,props.partIds,budget]);
 return <><InstanceBatch {...props} name={props.name+":shadow"} boxes={batches.casting} partIds={props.partIds?batches.castingIds:undefined} shadow={budget.shadows} receive={budget.shadows}/><InstanceBatch {...props} name={props.name+":detail"} boxes={batches.details} partIds={props.partIds?batches.detailIds:undefined} shadow={false} receive={budget.shadows}/></>;
}
function GeometryBatches({model,owner,materials,box,basis,selectable}:{model:CentralModel;owner:CentralModel;materials:Record<CentralMaterial,MeshStandardMaterial>;box:BoxGeometry;basis:Matrix4;selectable:boolean}){
 const pieces=useMemo(()=>Object.keys(materials).flatMap(key=>{const material=key as CentralMaterial,items=[...model.profiles.filter(p=>p.material===material).map(p=>({p,g:profileGeometry(p)})),...model.shapes.filter(p=>p.material===material).map(p=>({p,g:shapeGeometry(p)})),...model.roofs.filter(p=>p.material===material).map(p=>({p,g:roofGeometry(p)})),...(model.volumes??[]).filter(p=>p.material===material).map(p=>({p,g:urbanVolumeGeometry(p)})),...(model.polygonRoofs??[]).filter(p=>p.material===material).map(p=>({p,g:urbanRoofGeometry(p)}))];if(!items.length)return [];const flat=items.map(({g})=>g.index?g.toNonIndexed():g);const geometry=mergeGeometries(flat,false)!.applyMatrix4(basis);geometry.computeBoundingBox();geometry.computeBoundingSphere();if(selectable){let end=0;geometry.userData.partRanges=flat.map((g,i)=>({end:end+=g.getAttribute("position").count/3,id:architecturalPartId(owner,architecturalPartKey(owner,items[i].p))}));}new Set([...items.map(i=>i.g),...flat]).forEach(g=>g.dispose());return [{material,geometry}];}),[model,owner,materials,basis,selectable]);
 const batches=useMemo(()=>Object.keys(materials).map(key=>{const boxes=model.boxes.filter(b=>b.material===key&&!b.role.includes("collision"));return {material:key as CentralMaterial,boxes,partIds:selectable?boxes.map(b=>architecturalPartId(owner,architecturalPartKey(owner,b))):undefined};}),[model,owner,materials,selectable]);
 useEffect(()=>()=>pieces.forEach(p=>p.geometry.dispose()),[pieces]);
 return <>{batches.map(b=><Instances key={b.material} boxes={b.boxes} material={materials[b.material]} geometry={box} name={`${model.id}:${b.material}`} basis={basis} partIds={b.partIds}/>)}{pieces.map(p=><mesh matrixAutoUpdate={false} frustumCulled key={p.material} geometry={p.geometry} material={materials[p.material]} castShadow receiveShadow dispose={null}/>)}</>;
}
function RegisteredGroup({id,transform,visible,register,children}:{id:string;transform:ManualTransform;visible:boolean;register?:AssemblyEditorBinding["register"];children:React.ReactNode}){
 const ref=useRef<Group>(null);useLayoutEffect(()=>{register?.(id,ref.current);return ()=>register?.(id,null);},[register,id]);return <group ref={ref} name={id} position={transform.position} rotation={transform.rotation} scale={transform.scale} visible={visible} userData={{editableId:id}}>{children}</group>;
}
function AssemblyCollision({id,model,delta,unchanged,visible}:{id:string;model:CentralModel;delta:Matrix4;unchanged:boolean;visible:boolean}){
 const hulls=useMemo(()=>unchanged?null:model.colliders.map(c=>affineCollider(c,delta)),[model,delta,unchanged]);return visible?<RigidBody type="fixed" colliders={false} name={`assembly-collision:${id}`}>{hulls?hulls.map((h,i)=><ConvexHullCollider ref={audioSurfaceRef(modelAudioSurfaces(model)[i])} key={i} args={[h.vertices]} position={h.position}/>):model.colliders.map((c,i)=>c.vertices?<ConvexHullCollider ref={audioSurfaceRef(modelAudioSurfaces(model)[i])} key={i} args={[c.vertices]} position={c.position}/>:<CuboidCollider ref={audioSurfaceRef(modelAudioSurfaces(model)[i])} key={i} args={[c.size[0]/2,c.size[1]/2,c.size[2]/2]} position={c.position} rotation={[0,c.yaw,0]}/>)}</RigidBody>:null;
}
function HeritageAssembly({model,materials,box,editor,overrides}:{model:CentralModel;materials:Record<CentralMaterial,MeshStandardMaterial>;box:BoxGeometry;editor?:AssemblyEditorBinding;overrides:TransformOverrides}){
 // Owner-local colours share all existing maps and shader hooks. No global palette changes.
 const localPalette=useMemo(()=>{
  if(!model.materialTints)return {materials,clones:[] as MeshStandardMaterial[]};
  const result={...materials},clones:MeshStandardMaterial[]=[];
  const used=new Set([...model.boxes,...model.profiles,...model.shapes,...model.roofs,...(model.volumes??[]),...(model.polygonRoofs??[])].map(p=>p.material));
  for(const [id,color] of Object.entries(model.materialTints)){
   const key=id as CentralMaterial;if(!used.has(key))continue;
   const base=materials[key],copy=base.clone();
   copy.color.set(color);copy.onBeforeCompile=base.onBeforeCompile;copy.customProgramCacheKey=base.customProgramCacheKey;
   result[key]=copy;clones.push(copy);
  }
  return {materials:result,clones};
 },[materials,model]);
 useEffect(()=>()=>localPalette.clones.forEach(m=>m.dispose()),[localPalette]);
 const source=useMemo(()=>({position:[model.origin[0],0,model.origin[1]],rotation:[0,model.yaw,0],scale:[1,1,1]} as ManualTransform),[model]),parts=useMemo(()=>partitionArchitecturalParts(model),[model]);
 const bellSession=useBellSession();
 const transforms=editor?.transforms??overrides,current=transforms[model.id]??source,visibilityState=editor?.state??{hidden:persistedHidden,isolateId:null},visible=isEditorEntryVisible(model.id,undefined,visibilityState);
 const active=editor?.activePartParent===model.id||parts.some(p=>p.id===editor?.state.isolateId);
 // Split only inspected or modified parts; ownership metadata handles clicks on batched assemblies.
 const splitKey=parts.filter(p=>active||visibilityState.hidden[p.id]||(transforms[p.id]&&!sameTransform(p.source,transforms[p.id]))).map(p=>p.id).join("|");
 const bundles=useMemo(()=>{const ids=new Set(splitKey.split("|")),split=parts.filter(p=>ids.has(p.id)),rest=parts.filter(p=>!ids.has(p.id));const remainder={...model,boxes:rest.flatMap(p=>p.model.boxes),profiles:rest.flatMap(p=>p.model.profiles),shapes:rest.flatMap(p=>p.model.shapes),roofs:rest.flatMap(p=>p.model.roofs),colliders:rest.flatMap(p=>p.model.colliders),volumes:rest.flatMap(p=>p.model.volumes??[]),polygonRoofs:rest.flatMap(p=>p.model.polygonRoofs??[])};return {split,remainder};},[model,parts,splitKey]);
 const bellEnabled=!!bellSession&&!editor&&visible&&interactiveBellIds.includes(model.id)&&model.profiles.some(p=>p.role.endsWith('hollow-bell'))&&model.boxes.some(p=>p.role==='bell-suspension')&&!parts.some(p=>[...p.model.profiles,...p.model.boxes].some(piece=>movableBellRole(piece.role))&&visibilityState.hidden[p.id]);
 const fixedRemainder=useMemo(()=>bellEnabled?withoutMovableBell(bundles.remainder):bundles.remainder,[bellEnabled,bundles]);
 const local=useMemo(()=>transformMatrix(source).invert(),[source]),delta=useMemo(()=>overrideMatrix(source,current),[source,current]);
 const partAssets=useMemo(()=>bundles.split.map(p=>({...p,basis:transformMatrix(p.source).invert().multiply(transformMatrix(source).invert())})),[bundles,source]);
 return <group name={`assembly:${model.id}`}>
 <RegisteredGroup id={model.id} transform={current} visible={visible} register={editor?.register}>
 {bellEnabled&&<MovableBell model={model} parts={parts} transforms={transforms} source={source} current={current} materials={localPalette.materials} box={box}/>}
 <GeometryBatches model={fixedRemainder} owner={model} materials={localPalette.materials} box={box} basis={local} selectable={!!editor}/>
 {partAssets.map(p=><RegisteredGroup key={p.id} id={p.id} transform={transforms[p.id]??p.source} visible={isEditorEntryVisible(p.id,model.id,visibilityState)} register={editor?.register}><GeometryBatches model={bellEnabled?withoutMovableBell(p.model):p.model} owner={model} materials={localPalette.materials} box={box} basis={p.basis} selectable={!!editor}/></RegisteredGroup>)}
 </RegisteredGroup>
 <AssemblyCollision id={model.id} model={bundles.remainder} delta={delta} unchanged={sameTransform(source,current)} visible={visible}/>
 {partAssets.map(p=><PartCollision key={p.id} part={p} source={source} current={current} transform={transforms[p.id]??p.source} visible={visible&&isEditorEntryVisible(p.id,model.id,visibilityState)}/>)}
 </group>;
}
function withoutMovableBell(model:CentralModel):CentralModel{return {...model,boxes:model.boxes.filter(p=>!movableBellRole(p.role)),profiles:model.profiles.filter(p=>!movableBellRole(p.role))};}
function MovableBell({model,parts,transforms,source,current,materials,box}:{model:CentralModel;parts:ReturnType<typeof partitionArchitecturalParts>;transforms:TransformOverrides;source:ManualTransform;current:ManualTransform;materials:Record<CentralMaterial,MeshStandardMaterial>;box:BoxGeometry}){
 const session=useBellSession(),pivot=useRef<Group>(null);
 const data=useMemo(()=>{
  const inverse=transformMatrix(source).invert();
  // Exactly the renderer's existing parent * currentPart * inverse(sourcePart)
  // * inverse(sourceParent) chain; saved part overrides are never discarded.
  const movableParts=parts.filter(p=>[...p.model.boxes,...p.model.profiles].some(piece=>movableBellRole(piece.role))).map(p=>({id:p.id,
   model:{...p.model,boxes:p.model.boxes.filter(piece=>movableBellRole(piece.role)),profiles:p.model.profiles.filter(piece=>movableBellRole(piece.role)),shapes:[],roofs:[],colliders:[],volumes:[],polygonRoofs:[]},
   basis:transformMatrix(transforms[p.id]??p.source).multiply(transformMatrix(p.source).invert()).multiply(inverse)
  }));
  const suspensionPart=movableParts.find(p=>p.model.boxes.some(piece=>piece.role==='bell-suspension'))!,bodyPart=movableParts.find(p=>p.model.profiles.some(piece=>piece.role.endsWith('hollow-bell')))!;
  const suspension=suspensionPart.model.boxes.find(p=>p.role==='bell-suspension')!,body=bodyPart.model.profiles.find(p=>p.role.endsWith('hollow-bell'))!;
  const localPivot=new Vector3(...suspension.position);localPivot.y+=suspension.size[1]/2;localPivot.applyMatrix4(suspensionPart.basis);
  const bodyLocal=new Vector3(...body.position).applyMatrix4(bodyPart.basis),radius=Math.max(...body.profile.map(p=>p[0]));
  const anchor=bodyLocal.clone().add(new Vector3(0,-1.8,radius+.5)).applyMatrix4(transformMatrix(current)),target=bodyLocal.clone().add(new Vector3(0,.35,0)).applyMatrix4(transformMatrix(current));
  const relative=new Matrix4().makeTranslation(-localPivot.x,-localPivot.y,-localPivot.z);
  return {localPivot,anchor,target,batches:movableParts.map(p=>({...p,basis:relative.clone().multiply(p.basis)}))};
 },[model,parts,transforms,source,current]);
 useEffect(()=>{if(!session||!pivot.current)return;return session.register({id:model.id,name:model.id==='large-bell'?'Large heritage bell':'Small Vatsala bell',anchor:data.anchor,target:data.target,radius:model.id==='large-bell'?1.9:1.6,verticalTolerance:1,pivot:pivot.current,angle:0,time:5,cooldown:0,amplitude:(model.id==='large-bell'?12:16)*Math.PI/180,frequency:model.id==='large-bell'?5.2:6.4});},[session,model.id,data]);
 return <group ref={pivot} name={'bell-top-pivot:'+model.id} position={data.localPivot}>{data.batches.map(part=><GeometryBatches key={part.id} model={part.model} owner={model} materials={materials} box={box} basis={part.basis} selectable={false}/>)}</group>;
}
// Physics hulls stay outside the transformed visual parent; the exact composed affine matrix is baked once.
function PartCollision({part,source,current,transform,visible}:{part:ReturnType<typeof partitionArchitecturalParts>[number];source:ManualTransform;current:ManualTransform;transform:ManualTransform;visible:boolean}){const delta=useMemo(()=>partWorldDelta(source,current,part.source,transform),[source,current,part,transform]);return <AssemblyCollision id={part.id} model={part.model} delta={delta} unchanged={sameTransform(source,current)&&sameTransform(part.source,transform)} visible={visible}/>;}
export function CentralHeritageEnvironment({data,sharedMaterials,includeGround=true,debug=false,silhouette=false,assemblyEditor,manualOverrides={}}:{data:WorldRenderData;sharedMaterials?:Record<CentralMaterial,MeshStandardMaterial>;includeGround?:boolean;debug?:boolean;silhouette?:boolean;assemblyEditor?:AssemblyEditorBinding;manualOverrides?:TransformOverrides}){const groupingKey=(assemblyEditor?Array.from(assemblyEditor.ids).filter(id=>!id.startsWith("Editor_")):[...Object.keys(manualOverrides),...savedEditorScene.hiddenObjects].map(id=>id.startsWith("vatsala/")?"vatsala-durga":id.split("/")[0])).sort().join("|");const assets=useMemo(()=>{const models=data.models,urban=data.urban,allModels=[...models,...urban.models],groupIds=new Set([...interactiveBellIds,...(groupingKey?groupingKey.split("|"):[]),...allModels.filter(m=>m.renderOwnership==="WHOLE_ASSEMBLY").map(m=>m.id)]),groupedModels=allModels.filter(m=>groupIds.has(m.id)),sceneModels=allModels.filter(m=>!groupIds.has(m.id)),materials=sharedMaterials??finishCentralStoneMaterials(finishMuseumMaterials(finishPalacePalette(createCentralMaterials()))),box=new BoxGeometry(1,1,1),keys=Object.keys(materials) as CentralMaterial[];const instances=keys.map(material=>({material,boxes:sceneModels.flatMap(m=>m.boxes.filter(b=>b.material===material&&!b.role.includes("collision")))}));const merged=keys.flatMap(material=>{const pieces=sceneModels.flatMap(m=>[...m.profiles.filter(p=>p.material===material).map(profileGeometry),...m.shapes.filter(p=>p.material===material).map(shapeGeometry),...m.roofs.filter(p=>p.material===material).map(roofGeometry),...(m.volumes??[]).filter(p=>p.material===material).map(urbanVolumeGeometry),...(m.polygonRoofs??[]).filter(p=>p.material===material).map(urbanRoofGeometry)]);if(!pieces.length)return [];const nonindexed=pieces.map(g=>g.index?g.toNonIndexed():g);const geometry=mergeGeometries(nonindexed,false)!;geometry.computeBoundingBox();geometry.computeBoundingSphere();new Set([...pieces,...nonindexed]).forEach(g=>g.dispose());return [{material,geometry}];});const paving=new PlaneGeometry(centralGround.size,centralGround.size),uv=paving.getAttribute("uv");for(let i=0;i<uv.count;i++)uv.setXY(i,uv.getX(i)*centralGround.size/2,uv.getY(i)*centralGround.size/2);const flat=process.env.NODE_ENV==="development"?new MeshStandardMaterial({color:"#b7b6ae",roughness:1,flatShading:true,side:DoubleSide}):null;const urbanGround=new BufferGeometry(),positions:number[]=[];for(const p of urban.groundPatches){const x=p.x,z=p.z,w=p.width/2,d=p.depth/2;positions.push(x-w,.018,z-d,x+w,.018,z+d,x+w,.018,z-d,x-w,.018,z-d,x-w,.018,z+d,x+w,.018,z+d);}urbanGround.setAttribute("position",new Float32BufferAttribute(positions,3));urbanGround.setAttribute("uv",new Float32BufferAttribute(positions.flatMap((v,i)=>i%3===0?[v/2]:i%3===2?[v/2]:[]),2));urbanGround.computeVertexNormals();if(!sharedMaterials){finishInsideSquarePaving(materials.paving);polishDaylightPalette(materials);}return {models,urban,sceneModels,groupedModels,urbanGround,materials,flat,box,instances,merged,paving};},[groupingKey,data,sharedMaterials]);
 useEffect(()=>()=>{assets.urbanGround.dispose();assets.flat?.dispose();assets.box.dispose();assets.paving.dispose();assets.merged.forEach(m=>m.geometry.dispose());!sharedMaterials&&Object.values(assets.materials).forEach(m=>{m.map?.dispose();m.dispose()})},[assets,sharedMaterials]);
 const flat=process.env.NODE_ENV==="development"&&silhouette;
 const material=(key:CentralMaterial)=>flat&&assets.flat?assets.flat:assets.materials[key];
 const assemblyMaterials=useMemo(()=>flat&&assets.flat?Object.fromEntries(Object.keys(assets.materials).map(key=>[key,assets.flat])) as Record<CentralMaterial,MeshStandardMaterial>:assets.materials,[flat,assets]);
 return <group name="phase7a-central-reconstruction" userData={{phase:"9C",...data.diagnostics,silhouette:flat}}>
 {includeGround&&<RigidBody type="fixed" colliders={false} name="central-plaza-ground" friction={.8}><CuboidCollider args={[centralGround.size/2,.25,centralGround.size/2]} position={[centralGround.centre[0],-.25,centralGround.centre[1]]}/><mesh name="continuous-central-plaza" rotation={[-Math.PI/2,0,0]} position={[centralGround.centre[0],centralGround.surfaceY,centralGround.centre[1]]} geometry={assets.paving} material={material("paving")} receiveShadow dispose={null}/></RigidBody>}
 {!assemblyEditor?.state.isolateId&&<RigidBody type="fixed" colliders={false} name="central-architecture-collision">{assets.sceneModels.flatMap(m=>m.colliders.map((c,i)=>c.vertices?<ConvexHullCollider ref={audioSurfaceRef(modelAudioSurfaces(m)[i])} key={`${m.id}:${i}`} args={[c.vertices]} position={c.position}/>:<CuboidCollider ref={audioSurfaceRef(modelAudioSurfaces(m)[i])} key={`${m.id}:${i}`} args={[c.size[0]/2,c.size[1]/2,c.size[2]/2]} position={c.position} rotation={[0,c.yaw,0]}/>))}</RigidBody>}
 {assets.urban.groundPatches.length>0&&<mesh name="urban-context-ground" geometry={assets.urbanGround} material={material("paving")} receiveShadow dispose={null}/>}
 {assets.groupedModels.filter(model=>!model.id.startsWith("taleju:")).map(model=><HeritageAssembly key={model.id} model={model} materials={assemblyMaterials} box={assets.box} editor={assemblyEditor} overrides={manualOverrides}/>)}
 <group name="TalejuPrecinct">{assets.groupedModels.filter(model=>model.id.startsWith("taleju:")).map(model=><HeritageAssembly key={model.id} model={model} materials={assemblyMaterials} box={assets.box} editor={assemblyEditor} overrides={manualOverrides}/>)}</group>
 <group visible={!assemblyEditor?.state.isolateId}>
 {assets.instances.map(i=><Instances key={i.material} boxes={i.boxes} material={material(i.material)} geometry={assets.box} name={`central-instances:${i.material}`}/>)}
 {assets.merged.map(m=><mesh matrixAutoUpdate={false} frustumCulled key={m.material} name={`central-silhouettes:${m.material}`} geometry={m.geometry} material={material(m.material)} castShadow receiveShadow dispose={null}/>)}
 </group>
 {debug&&process.env.NODE_ENV==="development"&&[{id:"gallery-frontage/west-return",name:"National Art Gallery",classification:"PHOTO_INFERRED",x:-62.62,z:-23.04},{id:"source:1159393573",name:"Former Police-side proxy suppressed",classification:"UNRESOLVED",x:-76.134,z:-31.205},{id:"entrance:khauma-masonry-return",name:"Low sitting edge only",classification:"PHOTO_INFERRED",x:-121.43,z:-27.4}].map(e=><group key={e.id} position={[e.x,1.6,e.z]}><Html center><span className="whitespace-nowrap rounded bg-white/90 px-2 text-xs text-purple-900">{e.id} / {e.name} / {e.classification}</span></Html></group>)}
 {debug&&process.env.NODE_ENV==="development"&&assets.models.map(m=><group key={m.id} position={[m.origin[0],.08,m.origin[1]]}><axesHelper args={[1.5]}/><mesh rotation={[-Math.PI/2,0,0]}><ringGeometry args={[.55,.62,24]}/><meshBasicMaterial color="#b63bc1"/></mesh><Html position={[0,1,0]} center><span className="whitespace-nowrap rounded bg-white/90 px-2 text-xs text-purple-900">{remainingSpecificationById[m.id]?.canonicalName??m.id} / {m.accuracy} / {m.id==="palace-corner-shrine-unresolved"?"UNRESOLVED_IDENTITY":remainingSpecificationById[m.id]?.reconstructionState??"CENTRAL_BASELINE"} / source anchor; audit corrections apply</span></Html></group>)}
 </group>;
}

// Shared visual builders for the homepage preview; gameplay geometry is unchanged.
export {profileGeometry,shapeGeometry,roofGeometry};
