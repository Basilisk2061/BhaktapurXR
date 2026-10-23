import {box} from '../architecture-primitives.ts';
import {assembly,courtPoint,talejuPlan as plan,type TalejuPlacement} from './spatial.ts';

export function buildCourtyard(p:TalejuPlacement){
 const m=assembly('Courtyard',p.centre,plan.yaw,'PLAN_DERIVED / PHOTO_INFERRED');
 box(m,0,.045,0,plan.width,.07,plan.depth,'paving','taleju-court-continuous-brick-floor',true);
 // Shallow stone edge channels are a photographic inference, not a surveyed drainage network.
 for(const side of [-1,1]){
  box(m,side*(plan.width/2-.18),.086,0,.16,.012,plan.depth-.35,'stone','taleju-edge-drain-course');
  box(m,0,.086,side*(plan.depth/2-.18),plan.width-.35,.012,.16,'stone','taleju-edge-drain-course');
 }
 // Unlabelled southwest rectangle in the dimensioned plan: plain platform, no ritual identity.
 box(m,-5.7,.22,5.1,5.0,.28,5.0,'agedBrick','taleju-plan-derived-unidentified-platform',true);
 box(m,-5.7,.39,5.1,5.14,.06,5.14,'stone','taleju-plan-derived-platform-cap',true);
 return m;
}
export function talejuReviewPoints(p:TalejuPlacement){
 const at=(name:string,x:number,z:number,lookX:number,lookZ:number)=>{const a=courtPoint(p,x,z),b=courtPoint(p,lookX,lookZ);return {name,position:[a[0],1.8,a[1]],target:[b[0],2.8,b[1]]};};
 return [
  {name:'Golden Gate exterior',position:[p.gate.origin[0],1.8,p.gate.origin[1]+7],target:[p.gate.origin[0],2,p.gate.origin[1]]},
  {name:'Inside Golden Gate',position:[p.gate.origin[0],1.8,p.gate.origin[1]-5],target:[p.bekoX,2,p.yamNorth[1]]},
  at('Court centre / south shrine',0,0,0,plan.depth/2),at('North wing',0,3,0,-plan.depth/2),
  at('South wing',0,-4,0,plan.depth/2),at('East wing',-4,0,plan.width/2,0),at('West wing',4,0,-plan.width/2,0),
  at('Closed sacred threshold',0,5.5,0,plan.depth/2),
 ];
}
