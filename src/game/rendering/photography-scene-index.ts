import {Box3,BufferGeometry,InstancedMesh,Light,Matrix4,Mesh,Ray,Raycaster,Scene,SkinnedMesh,Sphere,Vector3,type Intersection,type Object3D} from 'three';
import {MeshBVH} from 'three-mesh-bvh';
interface Node {box:Box3;left?:Node;right?:Node;ids?:number[]}
interface Entry {mesh:Mesh;npc:Object3D|null;geometry:BufferGeometry;tree?:MeshBVH;instances?:Node;version:number;count:number;queued:boolean;bounds:Box3;matrix:Matrix4}
export interface FocusHit {object:Mesh;npc:Object3D|null;distance:number;point:Vector3}
const indices=new WeakMap<Scene,PhotographySceneIndex>();
/** Event-maintained target registry. The BVH package is already locked via Drei.
 * Trees are private/indirect: no geometry indices, global raycasts or scene content are changed.
 */
export class PhotographySceneIndex {
 private entries=new Map<Mesh,Entry>();readonly lights=new Set<Light>();private watched=new Set<Object3D>();private queue:Entry[]=[];
 private trees=new WeakMap<BufferGeometry,MeshBVH>();private users=0;private timer:ReturnType<typeof setTimeout>|null=null;
 private idle:number|null=null;private instanceRay=new Ray();private skinBounds=new Sphere();private skinBox=new Box3();private skinSize=new Vector3();
 private inverse=new Matrix4();private matrix=new Matrix4();private instance=new Matrix4();private localRay=new Ray();private point=new Vector3();private candidate=new Vector3();private sphere=new Sphere();private skinHits:Intersection[]=[];
 private add=(event:{child:Object3D})=>this.watch(event.child);private remove=(event:{child:Object3D})=>this.unwatch(event.child);
 constructor(private scene:Scene){this.watch(scene);}
 retain(){this.users++;return this;}
 release(){if(--this.users>0)return;if(this.timer!==null)clearTimeout(this.timer);if(this.idle!==null)cancelIdleCallback(this.idle);for(const o of this.watched){o.removeEventListener('childadded',this.add);o.removeEventListener('childremoved',this.remove);}this.watched.clear();this.entries.clear();this.lights.clear();this.queue.length=0;indices.delete(this.scene);}
 private watch(root:Object3D){root.traverse(o=>{if(this.watched.has(o))return;this.watched.add(o);o.addEventListener('childadded',this.add);o.addEventListener('childremoved',this.remove);if(o instanceof Light)this.lights.add(o);if(!(o instanceof Mesh))return;
  let npc:Object3D|null=null;for(let p:Object3D|null=o;p;p=p.parent){if(p.name==='player-character'||p.userData.photographyFocus===false||/helper|debug|collision|sky|stars/i.test(p.name))return;if(p.userData.npcId)npc=p;}
  const e:Entry={mesh:o,npc,geometry:o.geometry,version:-1,count:0,queued:false,bounds:new Box3(),matrix:new Matrix4()};this.entries.set(o,e);if(!(o instanceof SkinnedMesh))this.prepare(e);
 });}
 private unwatch(root:Object3D){root.traverse(o=>{o.removeEventListener('childadded',this.add);o.removeEventListener('childremoved',this.remove);this.watched.delete(o);if(o instanceof Mesh)this.entries.delete(o);if(o instanceof Light)this.lights.delete(o);});}
 private prepare(e:Entry){if(e.queued)return;e.queued=true;this.queue.push(e);this.schedule();}
 private schedule(){if(this.timer!==null||this.idle!==null)return;if(typeof requestIdleCallback==='function')this.idle=requestIdleCallback(()=>{this.idle=null;this.drain();});else this.timer=setTimeout(this.drain,16);}
 /** Bounded jobs during normal scene mounting, never constructed from an AF evaluation. */
 private drain=()=>{this.timer=null;const until=performance.now()+5;while(this.queue.length&&performance.now()<until){const e=this.queue.shift()!;e.queued=false;if(this.entries.get(e.mesh)!==e)continue;const mesh=e.mesh,geometry=mesh.geometry;e.geometry=geometry;if(!geometry.getAttribute('position'))continue;
   let tree=this.trees.get(geometry);if(!tree){const options={indirect:true,setBoundingBox:false,maxLeafTris:12,verbose:false};tree=new MeshBVH(geometry,options);this.trees.set(geometry,tree);}e.tree=tree;
   if(!geometry.boundingBox)geometry.computeBoundingBox();
   if(mesh instanceof InstancedMesh){const boxes:Box3[]=[];for(let i=0;i<mesh.count;i++){mesh.getMatrixAt(i,this.instance);boxes.push(geometry.boundingBox!.clone().applyMatrix4(this.instance));}e.instances=this.build(boxes,boxes.map((_,i)=>i));e.version=mesh.instanceMatrix.version;e.count=mesh.count;}
   e.matrix.elements.fill(NaN);
  }if(this.queue.length)this.schedule();
 };
 private build(boxes:Box3[],ids:number[]):Node {const box=new Box3();for(const id of ids)box.union(boxes[id]);if(ids.length<=8)return {box,ids};const size=box.getSize(this.point),axis=size.x>=size.y&&size.x>=size.z?'x':size.y>=size.z?'y':'z';ids.sort((a,b)=>(boxes[a].min[axis]+boxes[a].max[axis])-(boxes[b].min[axis]+boxes[b].max[axis]));const half=ids.length>>1;return {box,left:this.build(boxes,ids.slice(0,half)),right:this.build(boxes,ids.slice(half))};}
 private visible(o:Object3D){for(let p:Object3D|null=o;p;p=p.parent)if(!p.visible||p.userData.photographyFocus===false)return false;return true;}
 /** First-hit BVH queries, instance hierarchy pruning, and only candidate NPC triangle tests. */
 nearest(raycaster:Raycaster,shadeOnly=false):FocusHit|null {
  let best:FocusHit|null=null,bestDistance=raycaster.far;const origin=raycaster.ray.origin;
  for(const e of this.entries.values()){
   const mesh=e.mesh;if(!this.visible(mesh)||!mesh.layers.test(raycaster.layers)||shadeOnly&&(!mesh.castShadow||e.npc))continue;
   if(mesh instanceof SkinnedMesh){if(!e.npc)continue;e.npc.getWorldPosition(this.sphere.center);this.sphere.radius=1.75;if(!raycaster.ray.intersectsSphere(this.sphere))continue;
    // Conservative bone-free broad bound: no all-vertex skinning scan every 125ms.
    const oldSphere=mesh.boundingSphere,oldBox=mesh.boundingBox;this.inverse.copy(mesh.matrixWorld).invert();mesh.boundingSphere=this.skinBounds.copy(this.sphere).applyMatrix4(this.inverse);mesh.boundingBox=this.skinBox.setFromCenterAndSize(this.skinBounds.center,this.skinSize.setScalar(this.skinBounds.radius*2));this.skinHits.length=0;
    try{mesh.raycast(raycaster,this.skinHits);}finally{mesh.boundingSphere=oldSphere;mesh.boundingBox=oldBox;}
    for(const hit of this.skinHits)if(hit.distance<bestDistance&&this.materialVisible(mesh,hit)){bestDistance=hit.distance;best={object:mesh,npc:e.npc,distance:hit.distance,point:hit.point.clone()};}continue;
   }
   if(mesh.geometry!==e.geometry||mesh instanceof InstancedMesh&&(mesh.instanceMatrix.version!==e.version||mesh.count!==e.count)){this.prepare(e);continue;}
   if(!e.tree||e.queued)continue;
   if(!e.matrix.equals(mesh.matrixWorld)){e.matrix.copy(mesh.matrixWorld);e.bounds.copy(mesh instanceof InstancedMesh?e.instances!.box:e.geometry.boundingBox!).applyMatrix4(mesh.matrixWorld);}
   if(!e.bounds.containsPoint(origin)&&(!raycaster.ray.intersectBox(e.bounds,this.point)||origin.distanceToSquared(this.point)>=bestDistance*bestDistance))continue;
   const test=(world:Matrix4)=>{this.inverse.copy(world).invert();this.localRay.copy(raycaster.ray).applyMatrix4(this.inverse);const scale=this.point.copy(this.localRay.origin).add(this.localRay.direction).applyMatrix4(world).distanceTo(origin);const hit=e.tree!.raycastFirst(this.localRay,mesh.material,raycaster.near/scale,bestDistance/scale);if(!hit||!this.materialVisible(mesh,hit))return;this.candidate.copy(hit.point).applyMatrix4(world);const distance=origin.distanceTo(this.candidate);if(distance<raycaster.near||distance>=bestDistance)return;bestDistance=distance;best={object:mesh,npc:e.npc,distance,point:this.candidate.clone()};};
   if(mesh instanceof InstancedMesh&&e.instances){this.inverse.copy(mesh.matrixWorld).invert();const instanceRay=this.instanceRay.copy(raycaster.ray).applyMatrix4(this.inverse);const visit=(node:Node)=>{if(!instanceRay.intersectsBox(node.box))return;if(node.ids){for(const id of node.ids){mesh.getMatrixAt(id,this.instance);this.matrix.multiplyMatrices(mesh.matrixWorld,this.instance);test(this.matrix);}}else{visit(node.left!);visit(node.right!);}};visit(e.instances);}else test(mesh.matrixWorld);
  }
  return best;
 }
 private materialVisible(mesh:Mesh,hit:Intersection){const material=Array.isArray(mesh.material)?mesh.material[hit.face?.materialIndex??0]:mesh.material;return !!material?.visible&&material.opacity>.05&&material.depthWrite;}
}
export function acquirePhotographySceneIndex(scene:Scene){let index=indices.get(scene);if(!index){index=new PhotographySceneIndex(scene);indices.set(scene,index);}return index.retain();}
