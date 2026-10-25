import {useMemo,useEffect} from 'react';
import {useStore} from 'zustand';
import {Vector3,Matrix4,Quaternion,BoxGeometry,MeshStandardMaterial} from 'three';
import {useGraphicsQuality} from '../../lib/graphics-quality';
import {transformMatrix,overrideMatrix,type ManualTransform,type TransformOverrides} from '../../features/world-editor/transforms';
import {buildCompletedSquareModels} from '../architecture/square-completion';
import {museumEntranceCentre} from '../architecture/museum-entrance';
import {environmentStore,daylightAmount} from './time-of-day';

// Implied entrance/eave illumination, not surveyed real-world lighting locations.
// Local offsets sit near architecture rather than the interaction zones out in the plaza.
// Priority order preserves economy-preset coverage of the entrance and palace.
const areas=[
 {id:'khauma-gate',local:[3,3,.9]},
 {id:'golden-gate',local:[2.2,3.4,1.8]},
 {id:'vatsala-durga',local:[-3.4,4.5,1.7]},
 {id:'silu-mahadev',local:[3,4.8,5.4]},
 {id:'gallery-frontage',local:[2,3.1,1.4]},
 {id:'gopinath-krishna',local:[2.2,4.5,3]},
 {id:'chyasilin',local:[1.8,2.8,1.8]},
 {id:'siddhi-lakshmi',local:[1.9,3.2,3.8]},
 {id:'fifty-five-frontage',local:[-7,5.8,1.6],name:'palaceWestGallery',intensity:135},
 {id:'large-bell',local:[-3,3.2,1.2],name:'largeBellMasonry',intensity:80},
 {id:'fifty-five-frontage',local:[7,5.8,1.6],name:'palaceEastGallery',intensity:115},
 {id:'malla-column',local:[-1.6,2.2,1.2],name:'mallaColumnBase',intensity:65},
 {id:'yaksheshwar',local:[2,3.8,3.2],name:'yaksheshwarEntrance',intensity:95},
 {id:'golden-gate',local:[-2.2,3.4,1.8],name:'goldenGateWestEntrance',intensity:95},
] as const;
const counts={'VERY LOW':3,LOW:6,MEDIUM:10,HIGH:14} as const;
// Five deliberate short segments; never trace whole silhouettes or every roof tier.
const accents=[
 {id:'golden-gate',role:'gate-lintel',name:'goldenGateLintel'},
 {id:'fifty-five-frontage',role:'palace-eaves',name:'palaceEaveSection'},
 {id:'gallery-frontage',role:'museum-entrance-door-carved-lintel',name:'museumDoorLintel'},
 {id:'gopinath-krishna',role:'gopinath-main-lower-fascia-band',name:'gopinathLowerFascia'},
 {id:'chyasilin',role:'pavilion-ring-beam',name:'chyasilinLowerBeam'},
] as const;
const stripCounts={'VERY LOW':0,LOW:2,MEDIUM:4,HIGH:5} as const;
// Retain only source frames, not a second copy of reconstruction geometry.
let frames:Map<string,{source:ManualTransform;doorX:number;strips:Matrix4[]}>|undefined;
function sourceFrames(){
 if(!frames)frames=new Map(buildCompletedSquareModels().filter(model=>areas.some(area=>area.id===model.id)).map(model=>[model.id,{
  source:{position:[model.origin[0],0,model.origin[1]],rotation:[0,model.yaw,0],scale:[1,1,1]} satisfies ManualTransform,
  doorX:model.id==='gallery-frontage'?museumEntranceCentre(model):0,
  strips:accents.filter(accent=>accent.id===model.id).flatMap(accent=>{
   // Existing boxes already carry source-world position/yaw. Follow the fascia's
   // front surface, protruding only 8 mm; retain a short middle section.
   const box=model.boxes.find(box=>box.role===accent.role);if(!box)return [];
   const rotation=new Quaternion().setFromAxisAngle(new Vector3(0,1,0),box.yaw);
   const position=new Vector3(...box.position).add(new Vector3(0,-box.size[1]*.2,box.size[2]/2+.008).applyQuaternion(rotation));
   return [new Matrix4().compose(position,rotation,new Vector3(Math.min(6,box.size[0]*.55),.025,.016))];
  }),
 }]));
 return frames;
}
export function NightLights({overrides}:{overrides?:TransformOverrides}){
 const quality=useGraphicsQuality(),day=useStore(environmentStore,s=>daylightAmount(s.hour));
 const lights=useMemo(()=>areas.flatMap(area=>{
  const {id,local}=area;
  const frame=sourceFrames().get(id);if(!frame)return [];
  const position=new Vector3(local[0]+frame.doorX,local[1],local[2]).applyMatrix4(transformMatrix(overrides?.[id]??frame.source));
  return [{id,name:'name' in area?area.name:id,position,intensity:'intensity' in area?area.intensity:140}];
 }),[overrides]);
 const strips=useMemo(()=>accents.flatMap(accent=>{
  const frame=sourceFrames().get(accent.id);if(!frame)return [];
  const delta=overrideMatrix(frame.source,overrides?.[accent.id]??frame.source);
  return frame.strips.map(matrix=>delta.clone().multiply(matrix));
 }).slice(0,stripCounts[quality]),[overrides,quality]);
 const resources=useMemo(()=>({geometry:new BoxGeometry(1,1,1),material:new MeshStandardMaterial({color:'#352b20',emissive:'#ffd09a',emissiveIntensity:0,transparent:true,opacity:0,depthWrite:false,roughness:.85})}),[]);
 useEffect(()=>()=>{resources.geometry.dispose();resources.material.dispose();},[resources]);
 resources.material.emissiveIntensity=.85*(1-day);resources.material.opacity=1-day;
 return <group name="night-architectural-lighting">
  {strips.length>0&&<instancedMesh name="selective-architectural-accents" visible={day<1} args={[resources.geometry,resources.material,strips.length]} ref={mesh=>{if(mesh){strips.forEach((matrix,i)=>mesh.setMatrixAt(i,matrix));mesh.instanceMatrix.needsUpdate=true;mesh.computeBoundingSphere();}}}/>}
  {day<1&&lights.slice(0,counts[quality]).map(({name,position,intensity})=><pointLight key={name} name={'night-architecture:'+name} position={position} color="#ffdab0" intensity={intensity*(1-day)} distance={30} decay={2} castShadow={false}/>)}
 </group>;
}
