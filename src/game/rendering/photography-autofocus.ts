import {Mesh,Raycaster,SkinnedMesh,Vector2,Vector3,type Camera,type Object3D,type Scene,type Intersection} from 'three';
interface Candidate {id:string;distance:number;score:number;count:number;npc:boolean;center:boolean}
/** Five projection-aware rays, deterministic subject grouping and two-evaluation hysteresis. */
export function createPhotographyAutofocus(){
 const ray=new Raycaster(),ndc=new Vector2(),position=new Vector3(),targets:Object3D[]=[],hits:Intersection[]=[],groups:Candidate[]=[];
 const offsets=[[0,0],[0,-7],[-7,0],[7,0],[0,7]] as const;
 let current='',pending='',pendingCount=0;
 const eligible=(object:Object3D)=>{for(let p:Object3D|null=object;p;p=p.parent)if(!p.visible||p.name==='player-character'||p.userData.photographyFocus===false||/helper|debug|collision|sky|stars/i.test(p.name))return false;return true;};
 return (scene:Scene,camera:Camera,width:number,height:number,explicit=false)=>{
  targets.length=0;groups.length=0;camera.updateWorldMatrix(true,false);ray.layers.mask=camera.layers.mask;ray.near=.01;ray.far=500;
  scene.traverseVisible(object=>{if(object instanceof Mesh&&eligible(object)){if(object instanceof SkinnedMesh){object.computeBoundingSphere();if(object.boundingBox)object.computeBoundingBox();}targets.push(object);}});
  for(const [index,offset]of offsets.entries()){
   ndc.set(offset[0]*2/Math.max(1,width),offset[1]*2/Math.max(1,height));ray.setFromCamera(ndc,camera);hits.length=0;ray.intersectObjects(targets,false,hits);
   for(const hit of hits){const mesh=hit.object as Mesh,material=Array.isArray(mesh.material)?mesh.material[hit.face?.materialIndex??0]:mesh.material;if(!material?.visible||material.opacity<.05||!material.depthWrite)continue;
    let npc:Object3D|null=null;for(let p:Object3D|null=mesh;p;p=p.parent)if(typeof p.userData.npcId==='string'){npc=p;break;}
    const distance=Math.max(.3,Math.min(500,ray.ray.origin.distanceTo(hit.point)));
    let group=npc?groups.find(g=>g.id===npc!.uuid):groups.find(g=>!g.npc&&Math.abs(g.distance-distance)<Math.max(.25,distance*.06));
    let bodyWeight=1;if(npc){npc.getWorldPosition(position);const relativeY=hit.point.y-position.y;bodyWeight=relativeY>.25?1.3:relativeY>-.15?1:.45;}
    const score=(index===0?6:1.5)*bodyWeight;
    if(!group){group={id:npc?.uuid??mesh.uuid,distance,score:0,count:0,npc:!!npc,center:index===0};groups.push(group);}
    group.score+=score;group.count++;if(index===0){group.center=true;group.distance=distance;}
    break; // Only the front visible surface for each ray.
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
}
