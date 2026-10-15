import {DataTexture,RGBAFormat,RepeatWrapping,SRGBColorSpace,MeshStandardMaterial,DoubleSide,BackSide,LinearFilter,LinearMipmapLinearFilter} from "three";
import type {CentralMaterial} from "./central-model.ts";
export type EnsembleMaterial="heritageStone"|"heritageStoneShade"|"ensembleBronze"|"bellPierStone"|"bellTerraceMasonry"|"agedBellBronze";
/** One 128px generated mineral grain shared by the ensemble; no photographic pixels. */
export function finishCentralStoneMaterials(materials:Record<Exclude<CentralMaterial,EnsembleMaterial>,MeshStandardMaterial>){
 const data=new Uint8Array(128*128*4);let seed=1741;for(let i=0;i<128*128;i++){seed=(Math.imul(seed,1664525)+1013904223)>>>0;const x=i%128,y=Math.floor(i/128),n=Math.round(232+3*Math.sin(x*.23)*Math.sin(y*.17)+(seed>>>30)-((seed&2047)<8?16:0));data.set([n,Math.min(255,n+1),n,255],i*4);}
 const map=new DataTexture(data,128,128,RGBAFormat);map.colorSpace=SRGBColorSpace;map.wrapS=map.wrapT=RepeatWrapping;map.minFilter=LinearMipmapLinearFilter;map.magFilter=LinearFilter;map.generateMipmaps=true;map.anisotropy=4;map.needsUpdate=true;
 const stone=(color:string,pier=false)=>{const material=new MeshStandardMaterial({color,map,bumpMap:map,bumpScale:.003,roughness:.97,side:DoubleSide,shadowSide:BackSide});
  material.onBeforeCompile=shader=>{
   shader.vertexShader="varying vec3 vAgedStone; varying vec3 vStoneAxis;\n"+shader.vertexShader;shader.vertexShader=shader.vertexShader.replace("#include <project_vertex>",`#include <project_vertex>
    vec4 stonePosition=vec4(transformed,1.0);
    #ifdef USE_INSTANCING
     stonePosition=instanceMatrix*stonePosition;
    #endif
    vAgedStone=(modelMatrix*stonePosition).xyz;
    vStoneAxis=normal;`);
   shader.fragmentShader=`varying vec3 vAgedStone; varying vec3 vStoneAxis;
 float stoneHash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
 float stoneNoise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);return mix(mix(stoneHash(i),stoneHash(i+vec2(1.,0.)),f.x),mix(stoneHash(i+vec2(0.,1.)),stoneHash(i+vec2(1.,1.)),f.x),f.y);}
 `+shader.fragmentShader;
   shader.fragmentShader=shader.fragmentShader.replace("#include <color_fragment>",`#include <color_fragment>
    float row=floor(vAgedStone.y/.29);
    float horizontal=abs(vStoneAxis.x)>abs(vStoneAxis.z)?vAgedStone.z:vAgedStone.x;
    vec2 stoneUv=abs(vStoneAxis.y)>.7?vAgedStone.xz/vec2(.91,1.13):vec2((horizontal+mod(row,3.0)*.31)/.93,vAgedStone.y/.29);
    vec2 cell=floor(stoneUv);
    vec2 edge=min(fract(stoneUv),1.0-fract(stoneUv));
    float joint=(1.0-smoothstep(.004,.014,min(edge.x,edge.y)))*.025;
    float block=fract(sin(dot(vec3(cell,row),vec3(12.9898,78.233,37.719)))*43758.5453);
    float course=1.0-smoothstep(.008,.022,mod(vAgedStone.y,.29));
    float age=sin(vAgedStone.x*.79+vAgedStone.y*.37)*sin(vAgedStone.z*.67);
    float streak=sin(horizontal*5.1+sin(vAgedStone.y*.83)*.22)*sin(horizontal*2.7+.8);
    diffuseColor.rgb *= mix(vec3(.96,.985,1.015),vec3(1.035,1.005,.96),block);
    ${pier?"float monolithAge=stoneNoise(vec2(horizontal*3.2,vAgedStone.y*.22));diffuseColor.rgb*=mix(vec3(.77,.78,.73),vec3(1.04,1.035,1.01),smoothstep(.12,.85,monolithAge));":"diffuseColor.rgb *= 0.89+block*.14+age*.045-course*.045-joint;"}
    diffuseColor.rgb *= mix(.77,1.0,smoothstep(0.0,3.4,vAgedStone.y));
    diffuseColor.rgb *= (vStoneAxis.y<-.3?.79:1.0)*(1.0+streak*${pier?".075":".025"});`);
  shader.fragmentShader=shader.fragmentShader.replace("#include <roughnessmap_fragment>",`#include <roughnessmap_fragment>
 roughnessFactor=clamp(roughnessFactor+(block-.5)*.055,.91,1.0);`);
  };material.customProgramCacheKey=()=>"aged-heritage-stone-v4:"+pier;return material;
 };
 const agedBellBronze=new MeshStandardMaterial({color:"#625444",roughness:.82,metalness:.7,side:DoubleSide});
 agedBellBronze.onBeforeCompile=shader=>{shader.vertexShader="varying vec3 vOldBronze;\n"+shader.vertexShader;shader.vertexShader=shader.vertexShader.replace("#include <project_vertex>",`#include <project_vertex>
 vOldBronze=(modelMatrix*vec4(transformed,1.0)).xyz;`);shader.fragmentShader="varying vec3 vOldBronze;\n"+shader.fragmentShader;shader.fragmentShader=shader.fragmentShader.replace("#include <color_fragment>",`#include <color_fragment>
 float bronzeAge=sin(vOldBronze.y*13.0+sin(vOldBronze.x*7.0))*sin(vOldBronze.z*9.0);
 diffuseColor.rgb*=mix(vec3(.83,.89,.85),vec3(1.03,1.0,.94),bronzeAge*.5+.5);`);};agedBellBronze.customProgramCacheKey=()=>"ensemble-aged-bronze-v1";
 return {...materials,heritageStone:stone("#858276"),heritageStoneShade:stone("#666459"),bellPierStone:stone("#96968b",true),bellTerraceMasonry:stone("#8c8271"),agedBellBronze,ensembleBronze:new MeshStandardMaterial({color:"#82705a",roughness:.73,metalness:.7,side:DoubleSide})};
}
