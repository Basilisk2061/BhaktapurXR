import {Sphere,Vector3,type Mesh,type Object3D,type Raycaster} from 'three';
import {npcDefinitions} from '../npcs/definitions';
import {cameraPerf} from './camera-performance';
interface Volume {sphere:Sphere;bone:Object3D|null;offset:Vector3;priority:number}
interface Subject {root:Object3D;mesh:Mesh;npc:boolean;volumes:Volume[]}
export interface ProxyFocusHit {object:Mesh;npc:Object3D|null;point:Vector3;distance:number;focusPriority:number}
/** Photography-only analytical volumes: no scene nodes, rendered meshes or skin evaluation. */
export class PhotographyFocusProxies {
 private subjects=new Map<Object3D,Subject>();private point=new Vector3();
 private hit:ProxyFocusHit={object:null! ,npc:null,point:new Vector3(),distance:0,focusPriority:0};
 add(root:Object3D,mesh:Mesh,npc:boolean){
  if(this.subjects.has(root))return;
  const bones=new Map<string,Object3D>();
  if(npc)root.traverse(o=>{if(o.type==='Bone')bones.set(o.name.replace(/^mixamorig\d*[:_]?/i,'').toLowerCase(),o);});
  const height=npcDefinitions[root.userData.character]?.height??1.68;
  const volume=(names:string[],radius:number,y:number,priority:number,head=false):Volume=>{
   const bone=names.map(name=>bones.get(name)).find(Boolean)??null;
   return {sphere:new Sphere(new Vector3(),radius*height/1.68),bone,offset:new Vector3(0,bone?(head ? .07 : 0):y*height,0),priority};
  };
  const volumes=npc?[
   volume(['head','neck'],.145,.43,3,true),
   volume(['spine2','chest','spine1'],.23,.27,2),
   volume(['spine','hips'],.26,.08,1),
  ]:[{sphere:new Sphere(new Vector3(),.15),bone:null,offset:new Vector3(0,.15,.015),priority:0}];
  this.subjects.set(root,{root,mesh,npc,volumes});
 }
 remove(object:Object3D){for(const [root,s] of this.subjects)if(root===object||s.mesh===object)this.subjects.delete(root);}
 clear(){this.subjects.clear();}
 /** Once per AF evaluation; cached bone references follow standing, sitting and phone animation. */
 update(){
  const start=process.env.NODE_ENV==='development'?performance.now():0;
  for(const s of this.subjects.values())for(const v of s.volumes){
   if(v.bone){v.bone.getWorldPosition(v.sphere.center);v.sphere.center.add(v.offset);}
   else {v.sphere.center.copy(v.offset);s.root.localToWorld(v.sphere.center);}
  }
  if(process.env.NODE_ENV==='development')cameraPerf?.end('Dynamic proxy update',start);
 }
 private visible(root:Object3D){for(let p:Object3D|null=root;p;p=p.parent)if(!p.visible||p.userData.photographyFocus===false)return false;return true;}
 /** Static distance is an occlusion limit. Priority applies within the visible NPC silhouette. */
 nearest(ray:Raycaster,limit:number):ProxyFocusHit|null {
  let found=false,best=limit,npcMs=0,pigeonMs=0;
  for(const s of this.subjects.values()){
   const start=process.env.NODE_ENV==='development'?performance.now():0;
   try{
    if(!this.visible(s.root)||!s.mesh.layers.test(ray.layers))continue;
    const material=Array.isArray(s.mesh.material)?s.mesh.material[0]:s.mesh.material;
    if(!material?.visible||material.opacity<=.05)continue;
    // Pigeons are useful near subjects; distant wings must never become triangle targets.
    if(!s.npc&&ray.ray.origin.distanceToSquared(s.volumes[0].sphere.center)>60*60)continue;
    for(const v of s.volumes){
     if(!ray.ray.intersectSphere(v.sphere,this.point))continue;
     const distance=ray.ray.origin.distanceTo(this.point);
     if(distance<ray.near||distance>=best)continue;
     best=distance;found=true;this.hit.object=s.mesh;this.hit.npc=s.npc?s.root:null;this.hit.distance=distance;this.hit.point.copy(this.point);this.hit.focusPriority=v.priority;
     break; // Head > upper torso > torso, before considering another subject.
    }
   }finally{if(process.env.NODE_ENV==='development'){const ms=performance.now()-start;if(s.npc)npcMs+=ms;else pigeonMs+=ms;}}
  }
  if(process.env.NODE_ENV==='development'){cameraPerf?.record('NPC proxy query',npcMs);cameraPerf?.record('Pigeon proxy query',pigeonMs);}
  return found?this.hit:null;
 }
}
