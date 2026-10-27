import {Raycaster,Vector2,Vector3,type Camera,type Scene} from 'three';
import {acquirePhotographySceneIndex} from './photography-scene-index';
interface Candidate {id:string;distance:number;score:number;count:number;npc:boolean;center:boolean;priority:number}
/** Five projection-aware rays, deterministic subject grouping and two-evaluation hysteresis. */
export function createPhotographyAutofocus(scene:Scene){
 const index=acquirePhotographySceneIndex(scene);
 const ray=new Raycaster(),ndc=new Vector2(),position=new Vector3(),groups:Candidate[]=[];
 const offsets=[[0,0],[0,-7],[-7,0],[7,0],[0,7]] as const;
 let current='',pending='',pendingCount=0;
 const evaluate=(camera:Camera,width:number,height:number,explicit=false)=>{
  groups.length=0;index.updateDynamicTargets();camera.updateWorldMatrix(true,false);ray.layers.mask=camera.layers.mask;ray.near=.01;ray.far=500;
  for(const [rayIndex,offset]of offsets.entries()){
   ndc.set(offset[0]*2/Math.max(1,width),offset[1]*2/Math.max(1,height));ray.setFromCamera(ndc,camera);
   const hit=index.nearest(ray);if(hit){const mesh=hit.object,npc=hit.npc;
    const distance=Math.max(.3,Math.min(500,ray.ray.origin.distanceTo(hit.point)));
    let group=npc?groups.find(g=>g.id===npc!.uuid):groups.find(g=>!g.npc&&Math.abs(g.distance-distance)<Math.max(.25,distance*.06));
    let bodyWeight=1;if(npc){npc.getWorldPosition(position);const relativeY=hit.point.y-position.y;bodyWeight=relativeY>.25?1.3:relativeY>-.15?1:.45;}
    const score=(rayIndex===0?6:1.5)*bodyWeight;
    if(!group){group={id:npc?.uuid??mesh.uuid,distance,score:0,count:0,npc:!!npc,center:rayIndex===0,priority:0};groups.push(group);}
    group.score+=score;group.count++;if(rayIndex===0)group.center=true;const priority=hit.focusPriority??0;if(priority>group.priority||priority===group.priority&&rayIndex===0){group.priority=priority;group.distance=distance;}
   }
  }
  if(!groups.length)return null;
  // A clearly represented NPC upper body can beat background center hits; tiny limbs cannot.
  const subject=groups.filter(g=>g.npc&&(g.center||g.count>=2&&g.score>=3));
  let best=(subject.length?subject:groups).reduce((a,b)=>a.score>=b.score?a:b);
  const retained=groups.find(g=>g.id===current);
  if(!explicit&&retained&&retained.score>=best.score*.65)best=retained;
  if(!explicit&&current&&best.id!==current){if(pending===best.id)pendingCount++;else{pending=best.id;pendingCount=1;}if(pendingCount<2){if(retained)return retained;return null;}}
  current=best.id;pending='';pendingCount=0;return best;
 };
 return Object.assign(evaluate,{dispose:()=>index.release()});
}
