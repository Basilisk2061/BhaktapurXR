import {buildCompletedSquareModels,buildCompletedSquareEdge} from '../square-completion.ts';
import type {WorldRenderData} from '../world-render-data.ts';
import {gatePoint,placeTaleju} from './spatial.ts';
import {buildTalejuWings} from './wings.ts';
import {buildCourtyard} from './courtyard.ts';
import {buildTransition} from './transition.ts';
import {replaceLegacyInterior} from './legacy-integration.ts';
import {separatePalaceInterior} from './entrance-integration.ts';
import {entranceCourt} from './entrance-plan.ts';

export function reconstructTaleju(data:WorldRenderData):WorldRenderData{
 const gate=data.models.find(m=>m.id==='golden-gate');
 if(!gate)throw new Error('Taleju precinct requires the established Golden Gate anchor');
 const placement=placeTaleju(gate);
 // Only the entrance connector changes; Mul dimensions, placement and wings remain fixed.
 placement.yamNorth=gatePoint(gate,0,-(entranceCourt.front+entranceCourt.rangeDepth/2));
 const interiorSourceIds=new Set(['context:9c:18962138','context:9c:1159393576']);
 const wings=buildTalejuWings(placement),transition=buildTransition(placement);
 const east=wings.find(m=>m.id==='taleju:EastWing')!,apron=transition.find(m=>m.id==='taleju:EastEntryApron')!;
 east.boxes.push(...apron.boxes);east.profiles.push(...apron.profiles);east.shapes.push(...apron.shapes);east.colliders.push(...apron.colliders);
 const models=data.urban.models.map(m=>interiorSourceIds.has(m.id)?replaceLegacyInterior(m,placement):m);
 const shells=new Set(['gallery-frontage','fifty-five-frontage','golden-gate']);
 return {...data,models:data.models.map(m=>shells.has(m.id)?separatePalaceInterior(m,placement):m),urban:{...data.urban,models:[...models,buildCourtyard(placement),...wings,...transition.filter(m=>m!==apron)]}};
}

/** Shared by runtime and editor, so selectable ownership matches the rendered reconstruction. */
export function buildTalejuWorldData(){
 const models=buildCompletedSquareModels(),urban=buildCompletedSquareEdge();
 const rebuilt=reconstructTaleju({models,urban});
 return {models:rebuilt.models,urban:{...urban,models:rebuilt.urban.models}};
}
