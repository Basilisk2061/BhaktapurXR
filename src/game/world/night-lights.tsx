import {useMemo} from 'react';
import {useStore} from 'zustand';
import {Vector3} from 'three';
import {useGraphicsQuality} from '../../lib/graphics-quality';
import {transformMatrix,type ManualTransform,type TransformOverrides} from '../../features/world-editor/transforms';
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
] as const;
const counts={'VERY LOW':2,LOW:4,MEDIUM:6,HIGH:8} as const;
// Retain only source frames, not a second copy of reconstruction geometry.
let frames:Map<string,{source:ManualTransform;doorX:number}>|undefined;
function sourceFrames(){
 if(!frames)frames=new Map(buildCompletedSquareModels().filter(model=>areas.some(area=>area.id===model.id)).map(model=>[model.id,{
  source:{position:[model.origin[0],0,model.origin[1]],rotation:[0,model.yaw,0],scale:[1,1,1]} satisfies ManualTransform,
  doorX:model.id==='gallery-frontage'?museumEntranceCentre(model):0,
 }]));
 return frames;
}
export function NightLights({overrides}:{overrides?:TransformOverrides}){
 const quality=useGraphicsQuality(),day=useStore(environmentStore,s=>daylightAmount(s.hour));
 const lights=useMemo(()=>areas.flatMap(({id,local})=>{
  const frame=sourceFrames().get(id);if(!frame)return [];
  const position=new Vector3(local[0]+frame.doorX,local[1],local[2]).applyMatrix4(transformMatrix(overrides?.[id]??frame.source));
  return [{id,position}];
 }),[overrides]);
 return <group name="night-architectural-lighting">
  {day<1&&lights.slice(0,counts[quality]).map(({id,position})=><pointLight key={id} name={'night-architecture:'+id} position={position} color="#ffdab0" intensity={140*(1-day)} distance={30} decay={2} castShadow={false}/>)}
 </group>;
}
