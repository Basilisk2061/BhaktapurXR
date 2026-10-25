import {mergeTransformOverrides} from "./resolve-transforms.ts";
import {readFile} from "node:fs/promises";
import savedState from "../bhaktapur/data/world-editor-state.json";
import savedLegacy from "../bhaktapur/data/manual-transform-overrides.json";
import type {TransformOverrides} from "./transforms";
/** Files are validated by the editor save API; normal page reads need no architecture registry. */
export async function readRuntimeOverrides():Promise<TransformOverrides>{
 // Production is an immutable deployment: bundle the exact saved transforms instead
 // of reading a project directory that does not exist in the Workers filesystem.
 // Next development retains live filesystem reads and the existing editor save API.
 if(process.env.NODE_ENV!=="development")return mergeTransformOverrides(savedLegacy,savedState.transforms);
 const read=async(name:string)=>{try{return JSON.parse(await readFile("src/features/bhaktapur/data/"+name,"utf8"));}catch(e){if((e as NodeJS.ErrnoException).code==="ENOENT")return {};throw e;}};
 const [state,manual]=await Promise.all([read("world-editor-state.json"),read("manual-transform-overrides.json")]);return mergeTransformOverrides(manual,state.transforms);
}
