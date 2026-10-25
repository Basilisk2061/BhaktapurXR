import {Mesh,Raycaster,SkinnedMesh,Vector2,type Camera,type Object3D,type Scene,type Intersection} from 'three';
/** Focus only on rendered depth-writing subjects, using the final photography projection. */
export function createPhotographyAutofocus(){
 const ray=new Raycaster(),centre=new Vector2(0,0),targets:Object3D[]=[],hits:Intersection[]=[];
 const eligible=(object:Object3D)=>{for(let p:Object3D|null=object;p;p=p.parent)if(!p.visible||p.name==='player-character'||p.userData.photographyFocus===false||/helper|debug|collision|sky|stars/i.test(p.name))return false;return true;};
 return (scene:Scene,camera:Camera)=>{
  targets.length=0;hits.length=0;camera.updateWorldMatrix(true,false);ray.layers.mask=camera.layers.mask;ray.near=.01;ray.far=500;ray.setFromCamera(centre,camera);
  scene.traverseVisible(object=>{if(object instanceof Mesh&&eligible(object)){if(object instanceof SkinnedMesh){object.computeBoundingSphere();if(object.boundingBox)object.computeBoundingBox();}targets.push(object);}});
  ray.intersectObjects(targets,false,hits);
  for(const hit of hits){const mesh=hit.object as Mesh,material=Array.isArray(mesh.material)?mesh.material[hit.face?.materialIndex??0]:mesh.material;if(!material?.visible||material.opacity<.05||!material.depthWrite)continue;
   return {distance:Math.max(.3,Math.min(500,ray.ray.origin.distanceTo(hit.point))),name:mesh.name,point:hit.point};
  }
  return null;
 };
}
