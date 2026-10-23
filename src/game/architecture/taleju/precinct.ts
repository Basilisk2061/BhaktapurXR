import {buildCompletedSquareModels,buildCompletedSquareEdge} from '../square-completion.ts';
import type {WorldRenderData} from '../world-render-data.ts';
import {placeTaleju} from './spatial.ts';
import {buildTalejuWings} from './wings.ts';
import {buildCourtyard} from './courtyard.ts';
import {buildTransition} from './transition.ts';
import {replaceLegacyInterior} from './legacy-integration.ts';

export function reconstructTaleju(data:WorldRenderData):WorldRenderData{
 const gate=data.models.find(m=>m.id==='golden-gate');
 if(!gate)throw new Error('Taleju precinct requires the established Golden Gate anchor');
 const placement=placeTaleju(gate);
 const interiorSourceIds=new Set(['context:9c:18962138','context:9c:1159393576']);
 const wings=buildTalejuWings(placement),transition=buildTransition(placement);
 const east=wings.find(m=>m.id==='taleju:EastWing')!,apron=transition.find(m=>m.id==='taleju:EastEntryApron')!;
 east.boxes.push(...apron.boxes);east.profiles.push(...apron.profiles);east.shapes.push(...apron.shapes);east.colliders.push(...apron.colliders);
 const models=data.urban.models.map(m=>interiorSourceIds.has(m.id)?replaceLegacyInterior(m,placement):m);
 return {...data,urban:{...data.urban,models:[...models,buildCourtyard(placement),...wings,...transition.filter(m=>m!==apron)]}};
}

/** Shared by runtime and editor, so selectable ownership matches the rendered reconstruction. */
export function buildTalejuWorldData(){
 const models=buildCompletedSquareModels(),urban=buildCompletedSquareEdge();
 const rebuilt=reconstructTaleju({models,urban});
 return {models,urban:{...urban,models:rebuilt.urban.models}};
}
