import type {CentralModel} from "../architecture/central-model";
import type {ZoneId} from "./streaming-zones";
export interface ZoneEntry {id:ZoneId;url:string;bounds:number[]}
interface Manifest {zones:ZoneEntry[];modelBounds:Record<string,number[]>;groundPatches:{x:number;z:number;width:number;depth:number}[];home:string;overridesSignature:string}
async function json<T>(url:string,priority:RequestPriority="auto"):Promise<T>{const r=await fetch(url,{priority});if(!r.ok)throw Error("World data unavailable: "+r.status);return r.json();}
const surfaces=new Map<string,Promise<unknown>>();
async function hydrate(models:CentralModel[],priority:RequestPriority="auto"){
 await Promise.all(models.flatMap(m=>m.profiles.map(async p=>{const ref=p.sculptedSurface as unknown as {url?:string};if(!ref?.url)return;let data=surfaces.get(ref.url);if(!data){data=json(ref.url,priority);surfaces.set(ref.url,data);}p.sculptedSurface=await data as typeof p.sculptedSurface;})));
 return models;
}
let manifest:Promise<Manifest>|undefined,home:Promise<CentralModel[]>|undefined;
const chunks=new Map<string,Promise<CentralModel[]>>();
export const loadWorldManifest=()=>manifest??=json<Manifest>("/world-data/manifest.json").catch(e=>{manifest=undefined;throw e;});
export function loadZone(entry:ZoneEntry){let p=chunks.get(entry.url);if(!p){p=json<CentralModel[]>(entry.url).then(models=>hydrate(models)).catch(e=>{chunks.delete(entry.url);throw e;});chunks.set(entry.url,p);}return p;}
export const loadHomeModels=()=>home??=loadWorldManifest().then(m=>json<CentralModel[]>(m.home,"low").then(models=>hydrate(models,"low")));
let initial:Promise<{manifest:Manifest;models:Map<string,CentralModel[]>}>|undefined;
export const loadEntrance=()=>initial??=loadWorldManifest().then(async manifest=>{const entries=manifest.zones.filter(e=>e.id==="KHAUMA_EXTERIOR"||e.id==="KHAUMA_ENTRANCE"||e.id==="WESTERN_SQUARE");return {manifest,models:new Map(await Promise.all(entries.map(async e=>[e.id,await loadZone(e)] as const)))};});
