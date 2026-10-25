import {Vector3} from 'three';
import {seededRandom} from '../npcs/definitions';
export interface FoodPatch {id:number;position:Vector3;origin:Vector3;created:number;ready:number;expires:number;claims:Map<number,Vector3>;responders:Set<number>|null}
/** Session-local food state, independent of UI, bird AI and React frame updates. */
export class BirdFoodSystem {
 patches:FoodPatch[]=[];time=0;requested=false;private serial=0;private lastThrow=-Infinity;
 canThrow(){return this.time-this.lastThrow>=.8;}
 request(){this.requested=true;}
 tick(delta:number){this.time+=delta;this.patches=this.patches.filter(p=>p.expires>this.time);}
 add(position:Vector3,origin:Vector3){
  if(this.time-this.lastThrow<.8)return false;
  this.lastThrow=this.time;const id=++this.serial,random=seededRandom(id*7717);
  if(this.patches.length===3)this.patches.shift();
  this.patches.push({id,position:position.clone(),origin:origin.clone(),created:this.time,ready:this.time+.35,expires:this.time+7.5+random()*1.5,claims:new Map(),responders:null});return true;
 }
 get(id:number){return this.patches.find(p=>p.id===id&&p.expires>this.time);}
 release(bird:number){for(const patch of this.patches)patch.claims.delete(bird);}
 /** Rank once per landed patch: nearby birds first, reserving arrivals for up to three nearby airborne birds.
  * No-nearby fallback is exactly the closest three active eligible birds. */
 chooseResponders(birds:readonly {id:number;position:Vector3;airborne:boolean}[]){
  for(const patch of this.patches){
   // Keep an empty search pending, e.g. while the last recent-scare cooldown
   // clears. Never permanently mark a visible patch as having zero responders.
   if(patch.responders!==null||patch.ready>this.time||birds.length===0)continue;
   const ranked=birds.map(bird=>({bird,distance:bird.position.distanceTo(patch.position)})).sort((a,b)=>a.distance-b.distance),near=ranked.filter(r=>r.distance<=16);
   const aerial=near.filter(r=>r.bird.airborne).slice(0,3);
   const local=[...aerial,...near.filter(r=>!aerial.includes(r))].slice(0,8);
   const selected=near.length>=3?local:near.length?ranked.slice(0,Math.min(4,ranked.length)):ranked.slice(0,3);
   patch.responders=new Set(selected.map(r=>r.bird.id));
  }
 }
 offer(bird:number,position:Vector3,player:Vector3,ground:(x:number,z:number)=>number|null){
  for(const patch of this.patches){
   if(patch.ready>this.time||patch.expires-this.time<1.5||patch.claims.size>=8||!patch.responders?.has(bird))continue;
   const random=seededRandom(patch.id*997+bird*317);
   for(let attempt=0;attempt<18;attempt++){
    const angle=random()*Math.PI*2,r=.35+random()*.75,x=patch.position.x+Math.cos(angle)*r,z=patch.position.z+Math.sin(angle)*r;
    if(Math.hypot(x-player.x,z-player.z)<2.4||[...patch.claims.values()].some(p=>Math.hypot(p.x-x,p.z-z)<.42))continue;
    const y=ground(x,z);if(y===null)continue;
    const point=new Vector3(x,y+.012,z);patch.claims.set(bird,point);return {patch,point};
   }
  }return null;
 }
 clear(){this.patches=[];this.requested=false;}
}
