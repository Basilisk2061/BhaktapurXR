import type {CentralModel} from '../central-model.ts';
import {box,shape} from '../architecture-primitives.ts';
import {assembly,talejuPlan,type TalejuPlacement} from './spatial.ts';
import {closedDoor,roofStruts,window} from './details.ts';
import {buildEntranceCourt} from './entrance-court.ts';
import {entranceCourt} from './entrance-plan.ts';

/** Measured heights are unavailable. These restrained ranges follow Paudel's Beko photograph,
 * the palace schematic and the 2024 guide's sequence; all dimensions are APPROXIMATE. */
function range(id:string,origin:[number,number],yaw:number,length:number,depth=2.5){
 const m=assembly(id,origin,yaw,'PHOTO_INFERRED / APPROXIMATE');
 box(m,0,.24,-depth/2,length,.32,depth,'agedBrick','taleju-transition-plinth',true);
 box(m,0,2.98,-depth/2,length,5.16,depth,'agedBrick','taleju-transition-range-body',true);
 box(m,0,2.93,.03,length,.16,.28,'carvedTimber','taleju-transition-floor-band');
 const count=Math.max(2,Math.floor(length/2.65));
 for(let i=0;i<count;i++)window(m,-length/2+(i+.5)*length/count,4.12,.05,i%3===1?1.55:.88,1.18,i%3===1);
 for(let i=0;i<Math.floor(length/5);i++)closedDoor(m,-length/2+2.2+i*5,.03,.90,1.85);
 roofStruts(m,length,5.65,Math.floor(length/1.4));
 m.roofs.push({position:[m.origin[0]-Math.sin(yaw)*depth/2,5.65,m.origin[1]-Math.cos(yaw)*depth/2],width:length+.6,depth:depth+1.1,rise:.9,yaw,material:'roof',role:'taleju-transition-hipped-tile-roof'});
 return m;
}
export function buildTransition(p:TalejuPlacement){
 const entrance=buildEntranceCourt(p);
 const southZ=p.yamNorth[1],northZ=p.entry[1],length=southZ-northZ;
 const beko=assembly('BekoChowk',[p.bekoX,(southZ+northZ)/2],0,'PLAN_DERIVED / APPROXIMATE');
 box(beko,0,.045,0,5.4,.07,length+2.2,'paving','taleju-beko-brick-court-floor',true);
 const east=range('BekoEastRange',[p.bekoX+2.7,(southZ+northZ)/2],-Math.PI/2,length+2.2);
 // Stop short at both ends so the two cross-passages retain their full clear width.
 const west=range('BekoWestRange',[p.bekoX-2.7,(southZ+northZ+.9)/2],Math.PI/2,length-3.5);
 // North bath/inner-court continuation is visibly closed, not an invented traversable royal bath.
 const north=assembly('BekoNorthBoundary',[p.bekoX,northZ-1.1],0,'PROVISIONAL');
 box(north,0,2.6,-.24,5.4,5.2,.48,'agedBrick','taleju-closed-north-boundary',true);
 closedDoor(north,1.1,.03,1.05,2.05);
 box(north,0,5.27,-.24,5.7,.18,.8,'roof','taleju-boundary-tile-cap');
 const passages=assembly('Passageways',[(p.entry[0]+p.bekoX)/2,(p.entry[1]+southZ)/2],0,'PLAN_DERIVED / APPROXIMATE');
 const strip=(a:[number,number],b:[number,number],width:number,covered:boolean,openSouthStart=false)=>{
  const dx=b[0]-a[0],dz=b[1]-a[1],distance=Math.hypot(dx,dz),yaw=-Math.atan2(dz,dx),cx=(a[0]+b[0])/2-passages.origin[0],cz=(a[1]+b[1])/2-passages.origin[1];
  const floor=openSouthStart?entranceCourt.threshold:talejuPlan.floor;
  // The forward doorway's raised passage continues to the Beko landing.
  box(passages,cx,floor-.035,cz,distance,.07,width,'paving','taleju-connector-floor',true,yaw);
  for(const side of [-1,1]){
   // Leave a real T-junction into the entrance court, rather than putting a wall across it.
   const omit=openSouthStart&&side===1?3.5:0;
   box(passages,cx+Math.cos(yaw)*omit/2+Math.sin(yaw)*side*(width/2+.18),1.60,cz-Math.sin(yaw)*omit/2+Math.cos(yaw)*side*(width/2+.18),distance-omit,3.20,.36,'agedBrick','taleju-connector-side-wall',true,yaw);
  }
  // Last three metres at the carved entry are the open photographic ramp/apron.
  if(covered)box(passages,cx+1.5,3.28,cz,distance-3,.16,width+.75,'carvedTimber','taleju-covered-connector-ceiling',true,yaw);
 };
 strip(p.yamNorth,[p.bekoX,southZ],2.20,false,true);
 // Shallow treads join the raised entrance connector to Beko's existing floor.
 for(let i=0;i<3;i++)box(passages,p.bekoX+.15+i*.30-passages.origin[0],talejuPlan.floor+(3-i)*.08/2,southZ-passages.origin[1],.32,(3-i)*.08,2.20,'stone','yam-beko-shallow-landing-steps',true);
 strip([p.entry[0]+.05,northZ],[p.bekoX-2.70,northZ],2.20,true);
 // The stone apron rises to the actual entry floor, rather than requiring a jump.
 const approach=assembly('EastEntryApron',[p.entry[0],p.entry[1]],0,'PHOTO_INFERRED / APPROXIMATE');
 const h=talejuPlan.plinth-talejuPlan.floor,w=1.85,d=3.0;
 // Wedge extends east from Mul Cok's outer doorway; visible shape and hull use identical vertices.
 const vertices=[0,0,-w/2,d,0,-w/2,d,0,w/2,0,0,w/2,0,h,-w/2,d,0,-w/2,d,0,w/2,0,h,w/2];
 const indices=[0,2,1,0,3,2,4,5,6,4,6,7,0,1,5,0,5,4,1,2,6,1,6,5,2,3,7,2,7,6,3,0,4,3,4,7];
 approach.profiles.push({position:[p.entry[0],talejuPlan.floor,p.entry[1]],yaw:0,profile:[[0,0],[.1,1]],segments:4,material:'stone',role:'taleju-entry-ramp',sculptedSurface:{positions:vertices,indices}});
 approach.colliders.push({position:[p.entry[0],talejuPlan.floor,p.entry[1]],size:[d,h,w],yaw:0,vertices});
 // Narrow rim, not an invisible barrier. East frame/portal are left unobstructed.
 for(const side of [-1,1])shape(approach,0,.08,side*.99,[[0,0],[d,0],[d,.10],[0,h+.10]],.10,'stone','taleju-entry-ramp-edge');
 return [...entrance,beko,east,west,north,passages,approach];
}
