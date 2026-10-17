import type {CentralModel} from "../architecture/central-model";
async function json<T>(url:string):Promise<T>{const r=await fetch(url,{priority:"low"});if(!r.ok)throw Error("Homepage data unavailable: "+r.status);return r.json();}
const surfaces=new Map<string,Promise<unknown>>();
let home:Promise<CentralModel[]>|undefined;
export const loadHomeModels=()=>home??=json<{home:string}>("/world-data/manifest.json").then(async manifest=>{
 const models=await json<CentralModel[]>(manifest.home);
 await Promise.all(models.flatMap(m=>m.profiles.map(async p=>{
  const ref=p.sculptedSurface as unknown as {url?:string};if(!ref?.url)return;
  let data=surfaces.get(ref.url);if(!data){data=json(ref.url);surfaces.set(ref.url,data);}
  p.sculptedSurface=await data as typeof p.sculptedSurface;
 })));
 return models;
});
