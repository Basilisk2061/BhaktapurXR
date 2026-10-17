import {readFile} from "node:fs/promises";
import type {TransformOverrides} from "./transforms";
/** Files are validated by the editor save API; normal page reads need no architecture registry. */
export async function readRuntimeOverrides():Promise<TransformOverrides>{
 const read=async(name:string)=>{try{return JSON.parse(await readFile("src/features/bhaktapur/data/"+name,"utf8"));}catch(e){if((e as NodeJS.ErrnoException).code==="ENOENT")return {};throw e;}};
 const state=await read("world-editor-state.json");return state.transforms??await read("manual-transform-overrides.json");
}
