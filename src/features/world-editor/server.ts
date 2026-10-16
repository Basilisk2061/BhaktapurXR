import {validateScene,type SceneSnapshot} from "./scene-data.ts";
import {readFile,writeFile,rename} from "node:fs/promises";
import {join} from "node:path";
import {getEditableEntries} from "./registry.ts";
import {sameTransform,validateTransform,type TransformOverrides} from "./transforms.ts";
export const overrideFilePath="src/features/bhaktapur/data/manual-transform-overrides.json";
const file=join(process.cwd(),overrideFilePath);
async function readLegacyOverrides():Promise<TransformOverrides>{let text:string;try{text=await readFile(file,"utf8");}catch(error){if((error as NodeJS.ErrnoException).code==="ENOENT")return {};throw error;}const parsed:unknown=JSON.parse(text);if(!parsed||typeof parsed!=="object"||Array.isArray(parsed))throw new Error("Invalid override file");const result:TransformOverrides={};if(!Object.keys(parsed).length)return result;const ids=new Set(getEditableEntries().map(r=>r.id));for(const [id,t]of Object.entries(parsed)){if(!ids.has(id))throw new Error("Unregistered saved object");result[id]=validateTransform(t);}return result;}
export function editorRequestAllowed(request:Request,development:boolean){if(!development)return 404;const url=new URL(request.url);if(!["localhost","127.0.0.1","[::1]"].includes(url.hostname))return 403;const origin=request.headers.get("origin");if(origin&&origin!==url.origin)return 403;if(request.method==="POST"&&(request.headers.get("x-world-editor")!=="1"||!request.headers.get("content-type")?.startsWith("application/json")))return 403;return 200;}
let writes:Promise<unknown>=Promise.resolve();
export function saveManualTransform(body:unknown){const execute=async()=>{if(!body||typeof body!=="object"||Array.isArray(body))throw new Error("Invalid request");const payload=body as Record<string,unknown>;if(Object.keys(payload).sort().join(",")!=="id,transform"||typeof payload.id!=="string")throw new Error("Only a registered id and transform are accepted");const entry=getEditableEntries().find(r=>r.id===payload.id);if(!entry)throw new Error("Unregistered editable object");const transform=validateTransform(payload.transform),overrides=await readManualOverrides();if(sameTransform(entry.source,transform))delete overrides[entry.id];else overrides[entry.id]=transform;await writeFile(file,JSON.stringify(overrides,null,2)+"\n","utf8");return {saved:true,id:entry.id,transform};};const pending=writes.then(execute);writes=pending.catch(()=>{});return pending;}

export const sceneFilePath="src/features/bhaktapur/data/world-editor-state.json";
export async function readWorldEditorState():Promise<SceneSnapshot>{
 const legacy=await readLegacyOverrides();let parsed;try{parsed=JSON.parse(await readFile(join(process.cwd(),sceneFilePath),"utf8"));}catch(e){if((e as NodeJS.ErrnoException).code!=="ENOENT")throw e;parsed={};}
 return validateScene({version:1,transforms:parsed.transforms??legacy,createdObjects:parsed.createdObjects??[],hiddenObjects:parsed.hiddenObjects??[]},new Set(getEditableEntries().map(e=>e.id)));
}
export async function readManualOverrides():Promise<TransformOverrides>{return (await readWorldEditorState()).transforms;}
export function saveEditorSnapshot(value:unknown){const execute=async()=>{const snapshot=validateScene(value,new Set(getEditableEntries().map(e=>e.id))),target=join(process.cwd(),sceneFilePath),temp=target+".tmp";await writeFile(temp,JSON.stringify(snapshot,null,2)+"\n","utf8");await rename(temp,target);return {saved:true,snapshot};};const pending=writes.then(execute);writes=pending.catch(()=>{});return pending;}
