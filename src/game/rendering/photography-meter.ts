import {AmbientLight,DirectionalLight,HemisphereLight,Mesh,PointLight,Raycaster,Vector3,type Camera,type Object3D,type Scene} from 'three';
import {daylightAmount,environmentStore} from '../world/time-of-day';
/** Scene-light approximation, not image histogram metering. Roof/sun occlusion accounts for shade. */
export function createPhotographyMeter(){
 const ray=new Raycaster(),position=new Vector3(),toward=new Vector3(),lightPosition=new Vector3(),targets:Object3D[]=[];
 return (scene:Scene,camera:Camera)=>{
  camera.getWorldPosition(position);targets.length=0;let fill=0,direct=0,local=0,sun:DirectionalLight|null=null;
  scene.traverseVisible(object=>{
   if(object instanceof AmbientLight||object instanceof HemisphereLight)fill+=object.intensity;
   if(object instanceof DirectionalLight&&object.intensity>direct){direct=object.intensity;sun=object;}
   if(object instanceof PointLight&&object.intensity>0){object.getWorldPosition(lightPosition);local+=Math.min(.25,object.intensity/(1+position.distanceToSquared(lightPosition)));}
   if(object instanceof Mesh&&object.castShadow){let allowed=true;for(let p:Object3D|null=object;p;p=p.parent)if(p.name==='player-character'||p.userData.npcId||/helper|sky|debug/i.test(p.name)){allowed=false;break;}if(allowed)targets.push(object);}
  });
  let shaded=false;
  if(sun){(sun as DirectionalLight).getWorldPosition(toward);(sun as DirectionalLight).target.getWorldPosition(lightPosition);toward.sub(lightPosition).normalize();ray.set(position,toward);ray.near=.15;ray.far=80;shaded=ray.intersectObjects(targets,false).some(hit=>{const m=hit.object as Mesh;return !Array.isArray(m.material)&&m.material.visible&&m.material.opacity>.5;});}
  const day=daylightAmount(environmentStore.getState().hour),illumination=Math.max(.003,day*(shaded?.18:1)+local*.15+fill*.005);
  // Daylight EV100 ~11. Shade/sunset/night reduce it; clamp keeps handheld behavior usable.
  return Math.max(2,Math.min(12,11+Math.log2(illumination)));
 };
}
