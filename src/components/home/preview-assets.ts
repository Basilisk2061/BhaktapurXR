import {BoxGeometry,Group,InstancedMesh,Matrix4,Mesh,PlaneGeometry,Quaternion,Vector3,Texture,type BufferGeometry} from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
import {createCentralMaterials,profileGeometry,shapeGeometry,roofGeometry} from '../../game/architecture/central-environment';
import {finishPalacePalette} from '../../game/architecture/palace-palette';
import {finishCentralStoneMaterials} from '../../game/architecture/central-stone-materials';
import {finishMuseumMaterials} from '../../game/architecture/museum-sign';
import {finishInsideSquarePaving} from '../../game/architecture/inside-square-surfaces';
import {urbanVolumeGeometry,urbanRoofGeometry} from '../../game/architecture/urban-surface-geometry';
import {buildCompletedSquareModels,buildCompletedSquareEdge} from '../../game/architecture/square-completion';
import {centralGround,type CentralMaterial} from '../../game/architecture/central-model';
import {partitionArchitecturalParts} from '../../features/world-editor/parts';
import {partWorldDelta,type ManualTransform,type TransformOverrides} from '../../features/world-editor/transforms';
/** One set of current architecture buffers, shared by the homepage's scissored camera views. No physics/NPCs. */
export function buildPreviewAssets(overrides:TransformOverrides){
 const materials=finishCentralStoneMaterials(finishMuseumMaterials(finishPalacePalette(createCentralMaterials())));
 finishInsideSquarePaving(materials.paving);
 const root=new Group(),box=new BoxGeometry(1,1,1),pieces=new Map<CentralMaterial,BufferGeometry[]>(),instances=new Map<CentralMaterial,Matrix4[]>();
 for(const model of [...buildCompletedSquareModels(),...buildCompletedSquareEdge().models]){
  const source:ManualTransform={position:[model.origin[0],0,model.origin[1]],rotation:[0,model.yaw,0],scale:[1,1,1]};
  for(const part of partitionArchitecturalParts(model)){
   const delta=partWorldDelta(source,overrides[model.id]??source,part.source,overrides[part.id]??part.source);
   for(const b of part.model.boxes){if(b.role.includes('collision'))continue;
    const q=new Quaternion().setFromAxisAngle(new Vector3(0,1,0),b.yaw);if(b.tilt)q.multiply(new Quaternion().setFromAxisAngle(new Vector3(1,0,0),b.tilt));
    const matrix=delta.clone().multiply(new Matrix4().compose(new Vector3(...b.position),q,new Vector3(...b.size)));
    const list=instances.get(b.material)??[];list.push(matrix);instances.set(b.material,list);
   }
   const items=[...part.model.profiles.map(p=>({material:p.material,geometry:profileGeometry(p)})),...part.model.shapes.map(p=>({material:p.material,geometry:shapeGeometry(p)})),...part.model.roofs.map(p=>({material:p.material,geometry:roofGeometry(p)})),...(part.model.volumes??[]).map(p=>({material:p.material,geometry:urbanVolumeGeometry(p)})),...(part.model.polygonRoofs??[]).map(p=>({material:p.material,geometry:urbanRoofGeometry(p)}))];
   for(const item of items){const geometry=item.geometry.index?item.geometry.toNonIndexed():item.geometry;if(geometry!==item.geometry)item.geometry.dispose();geometry.applyMatrix4(delta);const list=pieces.get(item.material)??[];list.push(geometry);pieces.set(item.material,list);}
  }
 }
 for(const [material,matrices]of instances){const mesh=new InstancedMesh(box,materials[material],matrices.length);matrices.forEach((m,i)=>mesh.setMatrixAt(i,m));mesh.instanceMatrix.needsUpdate=true;mesh.castShadow=true;mesh.receiveShadow=true;root.add(mesh);}
 for(const [material,geometries]of pieces){const geometry=mergeGeometries(geometries,false)!;geometries.forEach(g=>g.dispose());const mesh=new Mesh(geometry,materials[material]);mesh.castShadow=true;mesh.receiveShadow=true;root.add(mesh);}
 const ground=new PlaneGeometry(centralGround.size,centralGround.size),uv=ground.getAttribute('uv');for(let i=0;i<uv.count;i++)uv.setXY(i,uv.getX(i)*centralGround.size/2,uv.getY(i)*centralGround.size/2);
 const paving=new Mesh(ground,materials.paving);paving.rotation.x=-Math.PI/2;paving.position.set(centralGround.centre[0],centralGround.surfaceY,centralGround.centre[1]);paving.receiveShadow=true;root.add(paving);
 return {root,dispose(){const geometries=new Set<BufferGeometry>(),textures=new Set<Texture>();root.traverse(o=>{if(o instanceof Mesh)geometries.add(o.geometry);});geometries.forEach(g=>g.dispose());for(const material of Object.values(materials)){for(const value of Object.values(material))if(value instanceof Texture)textures.add(value);material.dispose();}textures.forEach(t=>t.dispose());}};
}
