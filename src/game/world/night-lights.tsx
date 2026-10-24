import {useMemo,useEffect} from 'react';
import {useStore} from 'zustand';
import {BoxGeometry,MeshStandardMaterial,Matrix4,Vector3,Quaternion} from 'three';
import {useGraphicsQuality} from '../../lib/graphics-quality';
import type {TransformOverrides} from '../../features/world-editor/transforms';
import {heritageInteractionZones} from '../heritage/interactions';
import {environmentStore,daylightAmount} from './time-of-day';

// Interpretation for navigation, not a claim about surveyed real-world lamp locations.
// Priority order gives economy presets entrance, palace and central-square coverage.
const areas=['khauma-gate','golden-gate','vatsala-durga','silu-mahadev','gallery-frontage','gopinath-krishna','chyasilin','siddhi-lakshmi'];
const counts={'VERY LOW':2,LOW:4,MEDIUM:6,HIGH:8} as const;
export function NightLights({overrides}:{overrides?:TransformOverrides}){
 const quality=useGraphicsQuality(),day=useStore(environmentStore,s=>daylightAmount(s.hour));
 const fixtures=useMemo(()=>{
  const zones=heritageInteractionZones(overrides);
  return areas.flatMap(id=>{const zone=zones.find(z=>z.landmarkId===id);return zone?[{id,position:new Vector3(zone.position[0],0,zone.position[2])}]:[];});
 },[overrides]);
 const resources=useMemo(()=>({geometry:new BoxGeometry(1,1,1),metal:new MeshStandardMaterial({color:'#403b32',roughness:.85}),glow:new MeshStandardMaterial({color:'#bfa16d',emissive:'#ffbb66',emissiveIntensity:0,roughness:.65})}),[]);
 useEffect(()=>()=>{resources.geometry.dispose();resources.metal.dispose();resources.glow.dispose();},[resources]);
 resources.glow.emissiveIntensity=3*(1-day);
 const matrices=useMemo(()=>fixtures.map(({position})=>({
  pole:new Matrix4().compose(position.clone().add(new Vector3(0,1.9,0)),new Quaternion(),new Vector3(.065,3.8,.065)),
  lamp:new Matrix4().compose(position.clone().add(new Vector3(0,3.85,0)),new Quaternion(),new Vector3(.22,.32,.22))
 })),[fixtures]);
 return <group name="night-navigation-lamps">
  <instancedMesh args={[resources.geometry,resources.metal,fixtures.length]} ref={mesh=>{if(mesh){matrices.forEach((m,i)=>mesh.setMatrixAt(i,m.pole));mesh.instanceMatrix.needsUpdate=true;mesh.computeBoundingSphere();}}}/>
  <instancedMesh args={[resources.geometry,resources.glow,fixtures.length]} ref={mesh=>{if(mesh){matrices.forEach((m,i)=>mesh.setMatrixAt(i,m.lamp));mesh.instanceMatrix.needsUpdate=true;mesh.computeBoundingSphere();}}}/>
  {day<1&&fixtures.slice(0,counts[quality]).map(({id,position})=><pointLight key={id} name={'night-lamp:'+id} position={[position.x,3.85,position.z]} color="#ffd099" intensity={210*(1-day)} distance={24} decay={2} castShadow={false}/>)}
 </group>;
}
