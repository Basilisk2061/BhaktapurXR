import {useMemo,useEffect} from 'react';
import {useStore} from 'zustand';
import {Vector3,Matrix4,Quaternion,BoxGeometry,MeshStandardMaterial} from 'three';
import {useGraphicsQuality} from '../../lib/graphics-quality';
import {transformMatrix,overrideMatrix,type ManualTransform,type TransformOverrides} from '../../features/world-editor/transforms';
import {buildCompletedSquareModels} from '../architecture/square-completion';
import {buildEntranceCourt} from '../architecture/taleju/entrance-court';
import {placeTaleju} from '../architecture/taleju/spatial';
import {museumEntranceCentre} from '../architecture/museum-entrance';
import {environmentStore,daylightAmount} from './time-of-day';

// Implied entrance/eave illumination, not surveyed real-world lighting locations.
// Local offsets sit near architecture rather than the interaction zones out in the plaza.
// Priority order preserves economy-preset coverage of the entrance and palace.
const areas=[
 {id:'khauma-gate',local:[3,3,.9]},
 {id:'golden-gate',local:[4.7,4.1,2.8],name:'goldenGateEastFacade',intensity:70,range:18},
 {id:'golden-gate',local:[-4.7,4.1,2.8],name:'goldenGateWestFacade',intensity:65,range:18},
 {id:'vatsala-durga',local:[-3.4,4.5,1.7]},
 // West range is the player's left while entering northward through Golden Gate.
 {id:'taleju:YamWestRange',local:[-3,3.7,1.6],name:'yamInnerLeftEntranceWash',intensity:55,range:11},
 // From the plaza (+Z facing -Z), local -X is visual left of this gate.
 {id:'golden-gate',local:[-11,4.7,3.1],name:'goldenGateVisualLeftFrontage',intensity:90,range:20},
 {id:'silu-mahadev',local:[3,4.8,5.4]},
 {id:'gallery-frontage',local:[2,3.1,1.4],intensity:95,range:18},
 {id:'gopinath-krishna',local:[2.2,4.5,3]},
 {id:'chyasilin',local:[1.8,3.8,1.8],intensity:90,range:24},
 {id:'siddhi-lakshmi',local:[1.9,3.2,3.8]},
 {id:'fifty-five-frontage',local:[-7,5.8,1.6],name:'palaceWestGallery',intensity:75,range:18},
 {id:'large-bell',local:[-3,3.2,1.2],name:'largeBellMasonry',intensity:80},
 {id:'fifty-five-frontage',local:[7,5.8,1.6],name:'palaceEastGallery',intensity:70,range:18},
 {id:'malla-column',local:[-1.6,2.2,1.2],name:'mallaColumnBase',intensity:65},
 {id:'yaksheshwar',local:[2,3.8,3.2],name:'yaksheshwarEntrance',intensity:95},
 // Secondary entrances bridge west-cluster and eastern-square transitions.
 {id:'badrinath',local:[1.8,3.8,2.6],name:'badrinathLowerEntrance',intensity:65,range:23},
 {id:'kedarnath',local:[-3.2,4.2,1.3],name:'kedarnathLowerPlatform',intensity:80,range:25},
 {id:'rameshwar',local:[1.6,3.6,2.1],name:'rameshwarPavilionEntrance',intensity:60,range:22},
 {id:'east:small-shikhara-unresolved',local:[1.3,3.3,1.8],name:'easternSmallShrineEntrance',intensity:55,range:20},
] as const;
const counts={'VERY LOW':4,LOW:9,MEDIUM:13,HIGH:20} as const;
// Visual interpretation: only plain straight timber edges, never carved lintels,
// window headers, gilded ornament or full roof silhouettes.
interface Accent {id:string;role:string;name:string;index?:number;gateEnd?:boolean;length?:number}
const accents:readonly Accent[]=[
 {id:'gallery-frontage',role:'palace-deep-eave-fascia',name:'museumPalaceGateSideEave',gateEnd:true,length:8},
 {id:'fifty-five-frontage',role:'palace-deep-eave-fascia',name:'palaceGateSideEave',gateEnd:true,length:8},
 {id:'gopinath-krishna',role:'gopinath-main-lower-fascia-band',name:'gopinathLowerFascia'},
 {id:'chyasilin',role:'pavilion-ring-beam',name:'chyasilinLowerBeam'},
 {id:'chyasilin',role:'pavilion-ring-beam',name:'chyasilinAdjacentLowerBeam',index:1},
 {id:'gallery-frontage',role:'palace-pale-wing-eaves',name:'museumPaleWingPlainEave',gateEnd:true,length:8},
];
const stripCounts={'VERY LOW':0,LOW:2,MEDIUM:5,HIGH:6} as const;
// Retain only source frames, not a second copy of reconstruction geometry.
let frames:Map<string,{source:ManualTransform;doorX:number;strips:{name:string;matrix:Matrix4}[]}>|undefined;
function sourceFrames(){
 if(!frames){
 const models=buildCompletedSquareModels(),gate=models.find(model=>model.id==='golden-gate');
 // Reuse the same entrance builder as the rendered Taleju transition, not an
 // outside-gate proxy. Only source frames survive this one-time construction.
 if(gate)models.push(...buildEntranceCourt(placeTaleju(gate)));
 frames=new Map(models.filter(model=>areas.some(area=>area.id===model.id)).map(model=>[model.id,{
  source:{position:[model.origin[0],0,model.origin[1]],rotation:[0,model.yaw,0],scale:[1,1,1]} satisfies ManualTransform,
  doorX:model.id==='gallery-frontage'?museumEntranceCentre(model):0,
  strips:accents.filter(accent=>accent.id===model.id).flatMap(accent=>{
   // Follow a complete selected straight edge, inset 4 cm from its ends.
   // Long palace fascias use only the continuous end section nearest the gate.
   const box=model.boxes.filter(box=>box.role===accent.role)[accent.index??0];if(!box)return [];
   // These role-selected support boxes are plain geometry even when the shared
   // palette calls their material carvedTimber. Material identity is not geometry.
   const rotation=new Quaternion().setFromAxisAngle(new Vector3(0,1,0),box.yaw);
   const length=Math.min(accent.length??box.size[0],box.size[0]-.08);
   const along=new Vector3(1,0,0).applyQuaternion(rotation);
   const toGate=gate?new Vector3(gate.origin[0],box.position[1],gate.origin[1]).sub(new Vector3(...box.position)):along;
   const shift=accent.gateEnd?Math.sign(toGate.dot(along))*(box.size[0]-length-.08)/2:0;
   const normal=new Vector3(0,0,1).applyQuaternion(rotation);
   const radial=new Vector3(box.position[0]-model.origin[0],0,box.position[2]-model.origin[1]);
   const outward=normal.dot(radial)<0?-1:1; // Octagonal beam yaw can face inward.
   const position=new Vector3(...box.position).add(new Vector3(shift,-box.size[1]*.2,outward*(box.size[2]/2+.018)).applyQuaternion(rotation));
   return [{name:accent.name,matrix:new Matrix4().compose(position,rotation,new Vector3(length,.065,.024))}];
  }),
 }]));
 }
 return frames;
}
export function NightLights({overrides}:{overrides?:TransformOverrides}){
 const quality=useGraphicsQuality(),day=useStore(environmentStore,s=>daylightAmount(s.hour));
 const lights=useMemo(()=>areas.flatMap(area=>{
  const {id,local}=area;
  const frame=sourceFrames().get(id);if(!frame)return [];
  const position=new Vector3(local[0]+frame.doorX,local[1],local[2]).applyMatrix4(transformMatrix(overrides?.[id]??frame.source));
  return [{id,name:'name' in area?area.name:id,position,intensity:'intensity' in area?area.intensity:110,range:'range' in area?area.range:30}];
 }),[overrides]);
 const strips=useMemo(()=>accents.flatMap(accent=>{
  const frame=sourceFrames().get(accent.id);if(!frame)return [];
  const delta=overrideMatrix(frame.source,overrides?.[accent.id]??frame.source);
  return frame.strips.filter(strip=>strip.name===accent.name).map(strip=>delta.clone().multiply(strip.matrix));
 }).slice(0,stripCounts[quality]),[overrides,quality]);
 const resources=useMemo(()=>({geometry:new BoxGeometry(1,1,1),material:new MeshStandardMaterial({color:'#000000',emissive:'#f2cc9f',toneMapped:false,emissiveIntensity:0,transparent:true,opacity:0,depthWrite:false,roughness:.85})}),[]);
 useEffect(()=>()=>{resources.geometry.dispose();resources.material.dispose();},[resources]);
 resources.material.emissiveIntensity=1.1*(1-day);resources.material.opacity=1-day;
 return <group name="night-architectural-lighting">
  {strips.length>0&&<instancedMesh name="selective-architectural-accents" visible={day<1} args={[resources.geometry,resources.material,strips.length]} ref={mesh=>{if(mesh){strips.forEach((matrix,i)=>mesh.setMatrixAt(i,matrix));mesh.instanceMatrix.needsUpdate=true;mesh.computeBoundingSphere();}}}/>}
  {day<1&&lights.slice(0,counts[quality]).map(({name,position,intensity,range})=><pointLight key={name} name={'night-architecture:'+name} position={position} color="#ffdab0" intensity={intensity*(1-day)} distance={range} decay={2} castShadow={false}/>)}
 </group>;
}
