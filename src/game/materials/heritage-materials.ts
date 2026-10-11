import { DataTexture, RepeatWrapping, SRGBColorSpace, RGBAFormat, MeshStandardMaterial, DoubleSide, LinearFilter, LinearMipmapLinearFilter } from "three";

export const materialDefinitions = {
  brick: { color:"#d8c7b7", roughness:.94 }, timber: { color:"#4c3628", roughness:.87 },
  stone: { color:"#a8a090", roughness:.97 }, roof: { color:"#c1b3a3", roughness:.93 },
  paving: { color:"#cabbaa", roughness:.98 }, recess: { color:"#30271e", roughness:1 },
  gold: { color:"#bb9144", roughness:.8, metalness:.65 },
} as const;
export type HeritageMaterial = keyof typeof materialDefinitions;
export type HeritageMaterials = Record<HeritageMaterial,MeshStandardMaterial>;

/** GENERATED VISUAL MATERIALS, not source photography. Deterministic 256px/2m tiles. */
export function generatedTexture(kind:"brick"|"roof"|"paving") {
  const size=256,data=new Uint8Array(size*size*4);
  const rowHeight=kind==="roof"?16:kind==="paving"?20:12;
  const brickWidth=kind==="roof"?12:kind==="paving"?40:32;
  for(let y=0;y<size;y++)for(let x=0;x<size;x++){
    const row=Math.floor(y/rowHeight),offset=row%2?brickWidth/2:0;
    const col=Math.floor((x+offset)/brickWidth),line=(x+offset)%brickWidth<1 || y%rowHeight<1;
    const noise=((Math.imul(x+1,374761393)^Math.imul(y+1,668265263))>>>0)%17-8;
    const variation=((row*31+col*17)%13)-6;
    const base=kind==="paving"?[150,96,74]:kind==="roof"?[133,102,82]:[180,124,98];
    const i=(y*size+x)*4;
    for(let c=0;c<3;c++) data[i+c]=line?(kind==="roof"?62:110):base[c]+noise+variation;
    data[i+3]=255;
  }
  const texture=new DataTexture(data,size,size,RGBAFormat);texture.wrapS=texture.wrapT=RepeatWrapping;texture.colorSpace=SRGBColorSpace;
  texture.minFilter=LinearMipmapLinearFilter;texture.magFilter=LinearFilter;texture.generateMipmaps=true;texture.anisotropy=4;texture.needsUpdate=true;return texture;
}
export function createHeritageMaterials(): HeritageMaterials {
  return Object.fromEntries(Object.entries(materialDefinitions).map(([id,config])=>[id,new MeshStandardMaterial({...config,side:DoubleSide,
    map:id==="brick"||id==="roof"||id==="paving"?generatedTexture(id):null,
  })])) as HeritageMaterials;
}
export function disposeHeritageMaterials(materials:HeritageMaterials) {
  for(const material of Object.values(materials)){material.map?.dispose();material.dispose();}
}
