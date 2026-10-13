import type {CentralModel} from "./central-model.ts";
import {box,shape} from "./remaining-models.ts";
/** Limited gallery west-return articulation from the inspected 2014 west-oblique photograph.
 * Existing frontage, occupied body, roof, anchor and colliders remain intact. Exact modern openings unmeasured. */
export function articulateGalleryWestReturn(gallery:CentralModel):CentralModel {
 const m=structuredClone(gallery),body=m.boxes.find(b=>b.role==="palace-masonry")!;
 const x=-body.size[0]/2,z=-body.size[2]/2,role="gallery-west-return-photo-";
 const opening=(cz:number,y:number,w:number,h:number,arched=false)=>{
  box(m,x-.04,y,cz,w,h,.06,"recess",role+"window-recess",false,-Math.PI/2);
  for(const side of [-1,1])box(m,x-.11,y,cz+side*(w/2+.07),.14,h+.18,.16,"timber",role+"window-jamb",false,-Math.PI/2);
  for(const side of [-1,1])box(m,x-.13,y+side*h/2,cz,w+.38,.14,.24,"timber",role+"window-head-sill",false,-Math.PI/2);
  for(let i=1;i<5;i++)box(m,x-.12,y,cz-w/2+i*w/5,.032,h,.06,"timber",role+"window-lattice",false,-Math.PI/2);
  if(arched)shape(m,x-.2,y+h/2+.03,cz,[[-w*.6,0],[-w*.5,.22],[-w*.24,.43],[0,.53],[w*.24,.43],[w*.5,.22],[w*.6,0]],.15,"timber",role+"upper-arched-window-head",-Math.PI/2);
 };
 // One upper timber opening and restrained middle slits are visible on the west return.
 opening(z,7.2,1.12,1.35,true);for(const dz of [-1.25,1.25])opening(z+dz,4.45,.46,.9);
 for(const y of [3.02,6.05])box(m,x-.07,y,z,body.size[2],.14,.22,"stone",role+"continuing-floor-band",false,-Math.PI/2);
 box(m,x-.22,8.48,z,body.size[2]+1.4,.16,.38,"timber",role+"eave-head",false,-Math.PI/2);
 for(const dz of [-1.7,0,1.7])box(m,x-.4,8.14,z+dz,.12,Math.hypot(.55,.7),.13,"timber",role+"eave-strut",false,-Math.PI/2,Math.atan2(.7,.55));
 return m;
}
