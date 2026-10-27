/** Development diagnostics only. Every hot-path call site is compile-time guarded. */
export type PerfKey = 'AF'|'AF static query'|'AF dynamic query'|'Metering'|'Shade query'|'Scene index update'|'Index job'|'BVH build'|'BVH refit/update'|'Skinned bounds'|'NPC exact test'|'Optics controller'|'HUD publish'|'DOF CPU/setup'|'DOF passes (CPU)'|'Render-target resize'|'Capture';
export const perfKeys:PerfKey[]=['AF','AF static query','AF dynamic query','Metering','Shade query','Scene index update','Index job','BVH build','BVH refit/update','Skinned bounds','NPC exact test','Optics controller','HUD publish','DOF CPU/setup','DOF passes (CPU)','Render-target resize','Capture'];
export type Switch = 'dof'|'af'|'dynamic'|'meter'|'hud';
type Stat={calls:number;total:number;max:number};
const empty=()=>Object.fromEntries(perfKeys.map(k=>[k,{calls:0,total:0,max:0}])) as Record<PerfKey,Stat>;
const defaults=()=>({dof:true,af:true,dynamic:true,meter:true,hud:true});
export const cameraPerf=process.env.NODE_ENV==='development'?new class {
 active=false;open=false;switches=defaults();stats=empty();recent=empty();listeners=new Set<()=>void>();
 queue=0;captures=0;slowBvh='none';slowNpc='none';spike='none';snapshot='Waiting for frames';renderer='';
 private start=0;private previous=0;private frames=0;private total=0;private max=0;private long=0;private severe=0;private tasks=0;private taskMax=0;
 longTasksSupported=false;
 now(){return performance.now();}
 end(key:PerfKey,start:number,identity=''){if(!this.active)return;const ms=performance.now()-start;this.record(key,ms);if(key==='Capture')this.captures++;if(key==='BVH build'&&ms>16)this.slowBvh=`${identity} ${ms.toFixed(1)}ms`;if(key==='NPC exact test'&&ms>8)this.slowNpc=`${identity} ${ms.toFixed(1)}ms`;}
 record(key:PerfKey,ms:number){if(!this.active)return;const s=this.stats[key],r=this.recent[key];s.calls++;s.total+=ms;s.max=Math.max(s.max,ms);r.calls++;r.total+=ms;r.max=Math.max(r.max,ms);}
 sceneCalls=0;sceneTriangles=0;
 setActive(active:boolean){if(active===this.active)return;this.active=active;this.open=false;this.reset();}
 reset(){this.switches=defaults();this.stats=empty();this.recent=empty();this.previous=0;this.start=performance.now();this.frames=this.total=this.max=this.long=this.severe=this.tasks=this.taskMax=this.captures=0;this.spike='none';this.slowBvh=this.slowNpc='none';this.snapshot='Waiting for frames';this.emit();}
 emit(){for(const listener of this.listeners)listener();}
 toggle(key:Switch){this.switches[key]=!this.switches[key];this.emit();}
 longTask(duration:number){this.tasks++;this.taskMax=Math.max(this.taskMax,duration);}
 frame(info:{render:{calls:number;triangles:number};memory:{textures:number;geometries:number};programs?:unknown[]|null}){
  if(!this.active)return;const now=performance.now();if(!this.previous){this.previous=now;this.start=now;return;}const dt=now-this.previous;this.previous=now;this.frames++;this.total+=dt;this.max=Math.max(this.max,dt);if(dt>33)this.long++;if(dt>50){this.severe++;this.spike=`${dt.toFixed(1)}ms\n`+perfKeys.filter(k=>this.recent[k].calls).map(k=>`${k}: ${this.recent[k].max.toFixed(1)}ms`).join('\n');}for(const k of perfKeys){const s=this.recent[k];s.calls=s.total=s.max=0;}
  const seconds=(now-this.start)/1000;if(seconds<1)return;
  const memory=(performance as Performance & {memory?:{usedJSHeapSize:number;totalJSHeapSize:number}}).memory;
  this.snapshot=`FPS ${(this.frames/seconds).toFixed(1)} | Frame avg ${(this.total/this.frames).toFixed(1)}ms | max ${this.max.toFixed(1)}ms\n>33ms ${this.long} | >50ms ${this.severe}\nLong tasks/s ${this.longTasksSupported?(this.tasks/seconds).toFixed(1):'unsupported'} | max ${this.taskMax.toFixed(1)}ms\n`+perfKeys.map(k=>{const s=this.stats[k];return `${k.padEnd(22)} ${(s.calls/seconds).toFixed(1).padStart(5)}/s ${(s.calls?s.total/s.calls:0).toFixed(2)} / ${s.max.toFixed(2)}ms`;}).join('\n')+`\nIndex queue / pending jobs: ${this.queue}\nCapture calls (session): ${this.captures}\nHeap used/total: ${memory?`${(memory.usedJSHeapSize/1048576).toFixed(1)} / ${(memory.totalJSHeapSize/1048576).toFixed(1)} MB`:'unavailable'}\nDraw calls ${this.sceneCalls||info.render.calls} | triangles ${this.sceneTriangles||info.render.triangles}\nTextures ${info.memory.textures} | geometries ${info.memory.geometries} | programs ${info.programs?.length??0}`;
  this.stats=empty();this.start=now;this.frames=this.total=this.max=this.long=this.severe=this.tasks=this.taskMax=0;this.emit();
 }
}():undefined;
