import {buildPlazaEnclosure} from "./plaza-enclosure.ts";
import {rectangle,overlaps,monumentEnvelopes} from "./urban-model.ts";
import {buildPhase9Models} from "./west-models.ts";

/** Only the researched western corridor changes; accepted central/eastern context remains untouched. */
export function buildWestEnclosure(models=buildPhase9Models()){
 const base=buildPlazaEnclosure(),envelopes=monumentEnvelopes(models.filter(m=>["khauma-gate","khauma-adjoining-fabric","jagannath","kedarnath","gopinath-krishna","badrinath"].includes(m.id)));
 const corridor=rectangle([-123,-20],6.2,40,-.0235);
 const candidates=new Set(["western-back-edge","western-south-edge","street-west-entrance--1","street-west-entrance-1"]);
 const removed=base.buildings.filter(b=>candidates.has(b.groupId)||envelopes.some(e=>overlaps(b.outline,e,1))||overlaps(b.outline,corridor));
 const removedIds=new Set(removed.map(b=>b.id));
 const buildings=base.buildings.filter(b=>!removedIds.has(b.id));
 const westPlaceholderIds:string[]=[];
 const retainedModels=base.models.filter(m=>!removedIds.has(m.id)).map(m=>{
  const distant=m.anchorId==="west-roof-depth"||(m.anchorId==="north-roof-depth"&&m.origin[0]<-70);
  if(!distant&&m.anchorId!=="palace-west-adjacent")return m;
  const context=structuredClone(m);context.accuracy="PLACEHOLDER";westPlaceholderIds.push(m.id);
  if(distant){
   // Subtract height/width from unsurveyed backdrop masses, leaving separated low roof silhouettes.
   for(const b of [...context.boxes,...context.colliders]){b.position[1]*=.45;b.size[1]*=.45;b.size[0]*=.8;}
   for(const roof of context.roofs){roof.position[1]*=.45;roof.width*=.8;roof.rise*=.7;}
  }
  return context;
 });
 // Remove large pale external paving overlays in the affected western corridor.
 // Underlying Phase 8A traversable brick ground and frozen heritage polygons/collider remain identical.
 const groundPatches=base.groundPatches.flatMap(p=>{
  if(p.x+p.width/2<=-58&&p.z>=-54&&p.z<=42)return [];
  if(p.x-p.width/2<-58&&p.z>=-54&&p.z<=42){const max=p.x+p.width/2;return [{...p,x:(-58+max)/2,width:max+58}];}
  return [p];
 });
 return {...base,buildings,models:retainedModels,groundPatches,westRemovedIds:[...removedIds],westPlaceholderIds,westernBackdropClassification:"PLACEHOLDER" as const};
}
