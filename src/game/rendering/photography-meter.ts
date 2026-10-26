import {acquirePhotographySceneIndex} from './photography-scene-index';
import {AmbientLight,DirectionalLight,HemisphereLight,PointLight,Raycaster,Vector3,type Camera,type Scene} from 'three';
import {daylightAmount,environmentStore} from '../world/time-of-day';
/** Scene-light approximation, not image histogram metering. Roof/sun occlusion accounts for shade. */
export function createPhotographyMeter(scene:Scene){
 const index=acquirePhotographySceneIndex(scene);
 const ray=new Raycaster(),position=new Vector3(),toward=new Vector3(),lightPosition=new Vector3();
 const meter=(camera:Camera)=>{
  camera.getWorldPosition(position);let fill=0,direct=0,local=0,sun:DirectionalLight|null=null;
  for(const object of index.lights){
   let visible=object.visible;for(let parent=object.parent;parent&&visible;parent=parent.parent)visible=parent.visible;if(!visible)continue;
   if(object instanceof AmbientLight||object instanceof HemisphereLight)fill+=object.intensity;
   if(object instanceof DirectionalLight&&object.intensity>direct){direct=object.intensity;sun=object;}
   if(object instanceof PointLight&&object.intensity>0){object.getWorldPosition(lightPosition);local+=Math.min(.25,object.intensity/(1+position.distanceToSquared(lightPosition)));}
  }
  let shaded=false;
  if(sun){(sun as DirectionalLight).getWorldPosition(toward);(sun as DirectionalLight).target.getWorldPosition(lightPosition);toward.sub(lightPosition).normalize();ray.set(position,toward);ray.near=.15;ray.far=80;ray.layers.mask=camera.layers.mask;shaded=!!index.nearest(ray,true);}
  const day=daylightAmount(environmentStore.getState().hour),illumination=Math.max(.003,day*(shaded?.18:1)+local*.15+fill*.005);
  // Daylight EV100 ~11. Shade/sunset/night reduce it; clamp keeps handheld behavior usable.
  return Math.max(2,Math.min(12,11+Math.log2(illumination)));
 };
 return Object.assign(meter,{dispose:()=>index.release()});
}
