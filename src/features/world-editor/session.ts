import {copyTransform,sameTransform,validateTransform,type ManualTransform,type TransformOverrides} from "./transforms.ts";
import type {EditableAssembly} from "./registry.ts";
import type {Group} from "three";
interface Operation {id:string;before:ManualTransform;after:ManualTransform}
export interface EditorSnapshot {selectedId:string|null;transforms:TransformOverrides;locked:Record<string,boolean>;hidden:Record<string,boolean>;mode:"translate"|"rotate"|"scale";space:"world"|"local";translationSnap:number|null;rotationSnap:number|null;uniformScale:boolean;dragging:boolean;walk:boolean;focusSequence:number;revision:number;past:Operation[];future:Operation[];saved:TransformOverrides;message:string}
export class EditorSession {
 registry:EditableAssembly[];ids:Set<string>;objects=new Map<string,Group>();listeners=new Set<()=>void>();state:EditorSnapshot;operation:{id:string;before:ManualTransform}|null=null;
 constructor(registry:EditableAssembly[],overrides:TransformOverrides={}){this.registry=registry;this.ids=new Set(registry.map(r=>r.id));this.state={selectedId:null,transforms:Object.fromEntries(registry.map(r=>[r.id,copyTransform(overrides[r.id]??r.source)])),locked:Object.fromEntries(registry.map(r=>[r.id,r.defaultLocked])),hidden:{},mode:"translate",space:"world",translationSnap:null,rotationSnap:null,uniformScale:false,dragging:false,walk:false,focusSequence:0,revision:0,past:[],future:[],saved:structuredClone(overrides),message:""};}
 getSnapshot=()=>this.state;
 subscribe=(listener:()=>void)=>{this.listeners.add(listener);return ()=>{this.listeners.delete(listener);};};
 update=(patch:Partial<EditorSnapshot>)=>{this.state={...this.state,...patch};this.listeners.forEach(fn=>fn());};
 select=(id:string|null)=>{if(id===null||this.ids.has(id))this.update({selectedId:id,message:""});};
 register=(id:string,group:Group|null)=>{if(!this.ids.has(id))return;if(group)this.objects.set(id,group);else this.objects.delete(id);this.update({revision:this.state.revision+1});};
 setLocked=(id:string,locked:boolean)=>{if(!this.ids.has(id)||this.state.dragging)return;this.update({locked:{...this.state.locked,[id]:locked}});};
 begin=(id:string,drag=false)=>{if(!this.ids.has(id)||this.state.locked[id]||this.state.walk)return false;this.operation={id,before:copyTransform(this.state.transforms[id])};this.update({dragging:drag,message:""});return true;};
 preview=(id:string,value:unknown)=>{if(!this.ids.has(id)||this.state.locked[id]||this.state.walk)return false;try{const t=validateTransform(value);this.update({transforms:{...this.state.transforms,[id]:t},message:""});return true;}catch{this.update({message:"Invalid transform: finite positions/angles and positive scale required"});return false;}};
 complete=()=>{const op=this.operation;this.operation=null;let past=this.state.past,future=this.state.future;if(op&&!sameTransform(op.before,this.state.transforms[op.id])){past=[...past,{...op,after:copyTransform(this.state.transforms[op.id])}].slice(-50);future=[];}this.update({dragging:false,past,future});};
 change=(id:string,t:ManualTransform)=>{if(!this.begin(id))return false;const changed=this.preview(id,t);this.complete();return changed;};
 editAxis=(kind:keyof ManualTransform,axis:number,value:number)=>{const id=this.state.selectedId;if(!id)return;const t=copyTransform(this.state.transforms[id]),step=kind==="position"?this.state.translationSnap:kind==="rotation"?this.state.rotationSnap:null;const n=step?Math.round(value/step)*step:value;if(kind==="scale"&&this.state.uniformScale)t.scale=[n,n,n];else t[kind][axis]=n;this.preview(id,t);};
 undo=()=>{if(this.state.dragging||this.state.walk)return;const op=this.state.past.at(-1);if(!op)return;if(this.state.locked[op.id]){this.update({message:"Unlock the operation's object before undo"});return;}this.update({selectedId:op.id,transforms:{...this.state.transforms,[op.id]:copyTransform(op.before)},past:this.state.past.slice(0,-1),future:[...this.state.future,op],message:""});};
 redo=()=>{if(this.state.dragging||this.state.walk)return;const op=this.state.future.at(-1);if(!op)return;if(this.state.locked[op.id]){this.update({message:"Unlock the operation's object before redo"});return;}this.update({selectedId:op.id,transforms:{...this.state.transforms,[op.id]:copyTransform(op.after)},past:[...this.state.past,op].slice(-50),future:this.state.future.slice(0,-1),message:""});};
 reset=()=>{const r=this.registry.find(r=>r.id===this.state.selectedId);if(r)this.change(r.id,r.source);};
 focus=()=>{if(this.state.selectedId)this.update({focusSequence:this.state.focusSequence+1});};
 hide=()=>{const id=this.state.selectedId;if(id&&!this.state.dragging)this.update({hidden:{...this.state.hidden,[id]:true},selectedId:null});};
 showAll=()=>this.update({hidden:{}});
 copy=()=>{const id=this.state.selectedId;return id?JSON.stringify(this.state.transforms[id],null,2):"";};
 markSaved=(id:string,transform:ManualTransform)=>{const source=this.registry.find(r=>r.id===id)!.source,saved={...this.state.saved};if(sameTransform(source,transform))delete saved[id];else saved[id]=copyTransform(transform);this.update({saved,message:sameTransform(transform,this.state.transforms[id])?"Saved \u2713":"Saved snapshot; current edits unsaved"});};
}
