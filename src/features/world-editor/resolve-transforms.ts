import {validateTransform,type TransformOverrides} from './transforms.ts';
/** Complementary maps: newer editor entries override only matching manual keys.
 * Validate the winning JSON values at the boundary; never invent placements. */
export function mergeTransformOverrides(manual?:Readonly<Record<string,unknown>>|null,editor?:Readonly<Record<string,unknown>>|null):TransformOverrides{
 return Object.fromEntries(Object.entries({...manual,...editor}).map(([id,value])=>[id,validateTransform(value)]));
}
