export const startupDiagnosticsEnabled=process.env.NODE_ENV==='development';
export type StartupStatus='WAITING'|'OK'|'ERROR';
const names=['Explore route render attempted','Explore route client mounted','Experience import requested','Experience import resolved','Experience import rejected','Experience component received','Experience render attempted','Experience mounted','Canvas requested','Canvas module loaded','Canvas component mounted','Canvas onCreated','Renderer available','Camera available','Critical scene committed','Physics/world committed','First frame callback','Second frame callback','Readiness callback','Loading overlay dismissed','Player assets (nonblocking)','NPC module (after readiness)'];
export interface DiagnosticEntry{status:StartupStatus;time?:number;detail?:string}
interface Snapshot{checks:Record<string,DiagnosticEntry>;info:Record<string,string>;errors:string[];resources:Record<string,DiagnosticEntry>}
let snapshot:Snapshot={checks:Object.fromEntries(names.map(name=>[name,{status:'WAITING' as const}])),info:{},errors:[],resources:{}};
const listeners=new Set<()=>void>();
const notify=()=>queueMicrotask(()=>listeners.forEach(fn=>fn()));
export const subscribeStartup=(fn:()=>void)=>{listeners.add(fn);return()=>{listeners.delete(fn);};};
export const readStartup=()=>snapshot;
export function startupMark(name:string,status:StartupStatus='OK',detail?:string){
 if(!startupDiagnosticsEnabled||typeof window==='undefined')return;
 const old=snapshot.checks[name];if(old?.status===status&&old.detail===detail)return;
 snapshot={...snapshot,checks:{...snapshot.checks,[name]:{status,time:Math.round(performance.now()),detail}}};notify();
}
export function startupInfo(name:string,value:unknown){
 if(!startupDiagnosticsEnabled||typeof window==='undefined'||snapshot.info[name]===String(value))return;
 snapshot={...snapshot,info:{...snapshot.info,[name]:String(value)}};notify();
}
export function startupError(error:unknown,source='runtime'){
 if(!startupDiagnosticsEnabled||typeof window==='undefined')return;
 const detail=error instanceof Error?error.message+'\n'+(error.stack?.split('\n').slice(0,4).join('\n')??''):String(error);
 snapshot={...snapshot,errors:[...snapshot.errors,source+': '+detail].slice(-10)};notify();
}
export function startupResource(url:string,status:StartupStatus){
 if(!startupDiagnosticsEnabled||typeof window==='undefined')return;
 const prior=snapshot.resources[url];if(prior?.status==='ERROR')return;
 snapshot={...snapshot,resources:{...snapshot.resources,[url]:{status,time:Math.round(performance.now())}}};
 if(url.includes('/characters/player/'))startupMark('Player assets (nonblocking)',status,url);
 notify();
}
