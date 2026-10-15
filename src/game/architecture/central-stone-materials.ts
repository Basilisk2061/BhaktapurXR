import {DataTexture,RGBAFormat,RepeatWrapping,SRGBColorSpace,MeshStandardMaterial,DoubleSide,BackSide,LinearFilter,LinearMipmapLinearFilter} from "three";
import type {CentralMaterial} from "./central-model.ts";
export type EnsembleMaterial="heritageStone"|"heritageStoneShade"|"ensembleBronze";
/** One 128px generated mineral grain shared by the ensemble; no photographic pixels. */
export function finishCentralStoneMaterials(materials:Record<Exclude<CentralMaterial,EnsembleMaterial>,MeshStandardMaterial>){
 const data=new Uint8Array(128*128*4);let seed=1741;for(let i=0;i<128*128;i++){seed=(Math.imul(seed,1664525)+1013904223)>>>0;const x=i%128,y=Math.floor(i/128),n=Math.round(235+2*Math.sin(x*.23)*Math.sin(y*.17)+(seed>>>30));data.set([n,Math.min(255,n+1),n,255],i*4);}
 const map=new DataTexture(data,128,128,RGBAFormat);map.colorSpace=SRGBColorSpace;map.wrapS=map.wrapT=RepeatWrapping;map.minFilter=LinearMipmapLinearFilter;map.magFilter=LinearFilter;map.generateMipmaps=true;map.anisotropy=4;map.needsUpdate=true;
 const stone=(color:string)=>{const material=new MeshStandardMaterial({color,map,bumpMap:map,bumpScale:.001,roughness:.97,side:DoubleSide,shadowSide:BackSide});
  material.onBeforeCompile=shader=>{
   shader.vertexShader="varying vec3 vAgedStone;\n"+shader.vertexShader;shader.vertexShader=shader.vertexShader.replace("#include <project_vertex>",`#include <project_vertex>
    vec4 stonePosition=vec4(transformed,1.0);
    #ifdef USE_INSTANCING
     stonePosition=instanceMatrix*stonePosition;
    #endif
    vAgedStone=(modelMatrix*stonePosition).xyz;`);
   shader.fragmentShader="varying vec3 vAgedStone;\n"+shader.fragmentShader;
   shader.fragmentShader=shader.fragmentShader.replace("#include <color_fragment>",`#include <color_fragment>
    float row=floor(vAgedStone.y/.29);
    vec2 cell=floor((vAgedStone.xz+vec2(mod(row,3.0)*.31)) / vec2(.83,1.07));
    float block=fract(sin(dot(vec3(cell,row),vec3(12.9898,78.233,37.719)))*43758.5453);
    float course=1.0-smoothstep(.008,.022,mod(vAgedStone.y,.29));
    float age=sin(vAgedStone.x*.79+vAgedStone.y*.37)*sin(vAgedStone.z*.67);
    diffuseColor.rgb *= (0.95+block*.07+age*.018-course*.012)*mix(.91,1.0,smoothstep(0.0,2.4,vAgedStone.y));`);
  };material.customProgramCacheKey=()=>"aged-heritage-stone-v1";return material;
 };
 return {...materials,heritageStone:stone("#ada38f"),heritageStoneShade:stone("#928875"),ensembleBronze:new MeshStandardMaterial({color:"#66533a",roughness:.77,metalness:.68,side:DoubleSide})};
}
