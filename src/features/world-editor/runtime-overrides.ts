import {readFile} from "node:fs/promises";
import savedState from "../bhaktapur/data/world-editor-state.json";
import savedLegacy from "../bhaktapur/data/manual-transform-overrides.json";
import type {TransformOverrides} from "./transforms";
/** Files are validated by the editor save API; normal page reads need no architecture registry. */
export async function readRuntimeOverrides():Promise<TransformOverrides>{
 // Production is an immutable deployment: bundle the exact saved transforms instead
 // of reading a project directory that does not exist in the Workers filesystem.
 // Next development retains live filesystem reads and the existing editor save API.
 if(process.env.NODE_ENV!=="development")return (savedState.transforms??savedLegacy) as unknown as TransformOverrides;
 const read=async(name:string)=>{try{return JSON.parse(await readFile("src/features/bhaktapur/data/"+name,"utf8"));}catch(e){if((e as NodeJS.ErrnoException).code==="ENOENT")return {};throw e;}};
 const state=await read("world-editor-state.json");return state.transforms??await read("manual-transform-overrides.json");
}
