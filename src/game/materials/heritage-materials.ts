import { DataTexture, RepeatWrapping, SRGBColorSpace, RGBAFormat, MeshStandardMaterial, DoubleSide, LinearFilter, LinearMipmapLinearFilter } from "three";

export const materialDefinitions = {
  brick: { color:"#d8c7b7", roughness:.94 }, timber: { color:"#4c3628", roughness:.87 },
  stone: { color:"#a8a090", roughness:.97 }, roof: { color:"#c1b3a3", roughness:.93 },
  paving: { color:"#cabbaa", roughness:.98 }, recess: { color:"#30271e", roughness:1 },
  gold: { color:"#bb9144", roughness:.8, metalness:.65 },
} as const;
export type HeritageMaterial = keyof typeof materialDefinitions;
export type HeritageMaterials = Record<HeritageMaterial,MeshStandardMaterial>;

/** Generated visual surfaces, not source photography. One deterministic 256px tile per material. */
export function generatedTexture(kind:"gateBrick"|"brick"|"roof"|"paving"|"stone"|"timber") {
  const size=256,data=new Uint8Array(size*size*4);
  const hash=(x:number,y:number)=>((Math.imul(x+17,374761393)^Math.imul(y+31,668265263))>>>0)/4294967295;
  for(let y=0;y<size;y++)for(let x=0;x<size;x++){
    // Basket-weave patches give paving a denser, traditional laying rhythm at 2m UV scale.
    const rotated=kind==="paving"&&(Math.floor(x/64)+Math.floor(y/64))%2===1;
    const u=rotated?y:x,v=rotated?x:y;
    const height=kind==="roof"?16:kind==="paving"?16:12,width=kind==="roof"?16:32;
    const row=Math.floor(v/height),offset=kind==="paving"?0:row%2?width/2:0;
    const col=Math.floor((u+offset)/width),joint=(u+offset)%width<1||v%height<1;
    const cell=(hash(col,row)-.5)*20;
    const grain=(hash(x,y)-.5)*5;
    const weather=Math.sin(x*Math.PI/128)*Math.sin(y*Math.PI/128)*3;
    const base=kind==="paving"?[153,113,89]:kind==="roof"?[127,102,83]:kind==="brick"?[168,119,94]:kind==="gateBrick"?[194,157,137]:[231,226,215];
    const i=(y*size+x)*4;
    for(let c=0;c<3;c++) {
      const value=kind==="timber"?220+Math.sin(x*.55+Math.sin(y*Math.PI/128)*.6)*5+weather+grain
        :kind==="stone"?base[c]+weather+grain+(hash(Math.floor(x/32),Math.floor(y/32))-.5)*7
        :joint?(kind==="gateBrick"?[166,153,134]:[104,95,82])[c]:base[c]+cell+grain+weather;
      data[i+c]=Math.round(value);
    }
    data[i+3]=255;
  }
  const texture=new DataTexture(data,size,size,RGBAFormat);texture.wrapS=texture.wrapT=RepeatWrapping;texture.colorSpace=SRGBColorSpace;
  texture.minFilter=LinearMipmapLinearFilter;texture.magFilter=LinearFilter;texture.generateMipmaps=true;texture.anisotropy=4;texture.needsUpdate=true;return texture;
}

/** Surface-only variation; shared by all instances, with no extra texture or draw allocation. */
export function applySurfaceFinish(material:MeshStandardMaterial,kind:string) {
  if(!["brick","stone","timber","paving","roof"].includes(kind))return;
  material.userData.heritageSurface=kind;
  const highPbrDetail={value:0};material.userData.highPbrDetail=highPbrDetail;
  material.bumpMap=material.map;
  material.bumpScale=kind==="paving"?.012:kind==="brick"?.008:kind==="roof"?.012:.003;
  const previous=material.onBeforeCompile;
  material.onBeforeCompile=(shader,renderer)=>{
    previous.call(material,shader,renderer);
    shader.uniforms.heritagePbrDetail=highPbrDetail;
    shader.vertexShader="varying vec3 vHeritagePosition;\n"+shader.vertexShader;
    shader.vertexShader=shader.vertexShader.replace("#include <project_vertex>",`#include <project_vertex>
      vec4 heritagePosition=vec4(transformed,1.0);
      #ifdef USE_INSTANCING
        heritagePosition=instanceMatrix*heritagePosition;
      #endif
      vHeritagePosition=(modelMatrix*heritagePosition).xyz;`);
    shader.fragmentShader="uniform float heritagePbrDetail;varying vec3 vHeritagePosition;\n"+shader.fragmentShader;
    shader.fragmentShader=shader.fragmentShader.replace("#include <color_fragment>",`#include <color_fragment>
      float age=sin(vHeritagePosition.x*0.19)*sin(vHeritagePosition.z*0.23);
      diffuseColor.rgb *= 0.98+age*0.025;
      ${kind==="brick"?"diffuseColor.rgb *= mix(0.88,1.0,smoothstep(0.0,1.8,vHeritagePosition.y));":""}`);
    shader.fragmentShader=shader.fragmentShader.replace("#include <roughnessmap_fragment>",`#include <roughnessmap_fragment>
      // Keep photographic roughness variation inside a dry, heritage-safe range on HIGH.
      if(heritagePbrDetail>0.5)roughnessFactor=0.80+0.18*roughnessFactor;
      roughnessFactor=clamp(roughnessFactor+age*0.02,0.8,1.0);`);
  };
  material.customProgramCacheKey=()=>`heritage-surface-${kind}-v2`;
}
export function createHeritageMaterials(): HeritageMaterials {
  return Object.fromEntries(Object.entries(materialDefinitions).map(([id,config])=>[id,new MeshStandardMaterial({...config,side:DoubleSide,
    map:id==="brick"||id==="roof"||id==="paving"?generatedTexture(id):null,
  })])) as HeritageMaterials;
}
export function disposeHeritageMaterials(materials:HeritageMaterials) {
  for(const material of Object.values(materials)){material.map?.dispose();material.dispose();}
}
