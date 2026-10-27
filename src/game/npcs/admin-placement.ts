import {createStore} from 'zustand/vanilla';
import type {NpcAgent} from './behavior';
export interface NpcPlacement {position:[number,number,number];rotationY:number}
export interface NpcAdminBridge {agents:NpcAgent[];place:(id:string,p:NpcPlacement)=>boolean;reset:(id:string)=>void}
const storageKey='bhaktapurxr:admin-npc-placements:v1';
/** No production instance or entry point. Stable game IDs, separate from architecture editing. */
export const npcAdmin=process.env.NODE_ENV==='development'?new class {
 store=createStore(()=>({frozen:false,placement:false,selected:null as string|null,revision:0,message:''}));bridge:NpcAdminBridge|null=null;
 private lastPublish=0;
 publish(message?:string){const now=performance.now();if(now-this.lastPublish<100&&(message===undefined||message===this.store.getState().message))return;this.lastPublish=now;this.store.setState(s=>({revision:s.revision+1,...(message===undefined?{}:{message})}));}
 held(id:string){const s=this.store.getState();return s.frozen||s.placement&&s.selected===id;}
 select(id:string|null){this.store.setState({selected:id});}
 setPlacement(placement:boolean){this.store.setState({placement,selected:null});}
 move(id:string,p:NpcPlacement){const ok=this.bridge?.place(id,p)??false;this.publish(ok?'':'Invalid placement ? last valid position kept');return ok;}
 reset(id?:string){for(const a of this.bridge?.agents??[])if(!id||a.id===id)this.bridge?.reset(a.id);this.publish('Original session placement restored');}
 snapshot(){return Object.fromEntries((this.bridge?.agents??[]).map(a=>[a.id,{position:[a.position.x,a.position.y,a.position.z],rotationY:a.yaw}]));}
 save(){try{localStorage.setItem(storageKey,JSON.stringify(this.snapshot()));this.publish('Saved locally in this development browser');}catch{this.publish('Local save failed; use Copy NPC Placements');}}
 reload(){try{const data:unknown=JSON.parse(localStorage.getItem(storageKey)??'null');if(!data||typeof data!=='object'||Array.isArray(data))throw Error();const pending:[string,NpcPlacement][]=[];
  for(const [id,p] of Object.entries(data)){if(!this.bridge?.agents.some(a=>a.id===id))continue;if(!p||!Array.isArray(p.position)||p.position.length!==3||!p.position.every((v:unknown)=>typeof v==='number'&&Number.isFinite(v))||typeof p.rotationY!=='number'||!Number.isFinite(p.rotationY))throw Error();pending.push([id,p]);}
  this.store.setState({frozen:true});let rejected=0;for(const [id,p] of pending)if(!this.bridge?.place(id,p))rejected++;this.publish(`Reloaded local placements; movement frozen${rejected?`; ${rejected} invalid placements skipped`:''}`);
 }catch{this.publish('No valid local NPC placements found');}}
 async copy(){try{await navigator.clipboard.writeText(JSON.stringify(this.snapshot(),null,2));this.publish('NPC placements copied');}catch{this.publish('Clipboard unavailable; use a secure localhost context');}}
}():undefined;
