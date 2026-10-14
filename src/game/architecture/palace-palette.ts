import type {MeshStandardMaterial} from "three";
import type {CentralMaterial} from "./central-model.ts";
/** Photo-inferred palette. Reuses existing maps; no downloaded texture/PBR dependency. */
type PalaceMaterial=Exclude<CentralMaterial,"museumSign"|"museumStone"|"museumRelief">;
type FoundationMaterial=Exclude<PalaceMaterial,"agedBrick"|"redMasonry"|"carvedTimber">;
export function finishPalacePalette(materials:Record<FoundationMaterial,MeshStandardMaterial>){
 const palette=materials as Record<PalaceMaterial,MeshStandardMaterial>;
 const shared=(source:FoundationMaterial,id:PalaceMaterial,color:string)=>{const base=materials[source],m=base.clone();m.onBeforeCompile=base.onBeforeCompile;m.customProgramCacheKey=()=>base.customProgramCacheKey()+":palace:"+id;m.color.set(color);palette[id]=m;};
 shared("brick","agedBrick","#b59983");
 shared("plaster","redMasonry","#a44936");
 shared("timber","carvedTimber","#443024");
 materials.brick.color.set("#cbb29b");
 materials.timber.color.set("#78583d");
 materials.plaster.color.set("#e4dece");
 materials.shutter.color.set("#943e34");
 materials.stone.color.set("#bfbeb3");
 materials.roof.color.set("#c09c83");
 materials.paving.color.set("#e0c6aa");
 materials.bronze.color.set("#9d8865");materials.bronze.metalness=.5;
 materials.gold.color.set("#c0a05f");materials.gold.metalness=.62;materials.gold.roughness=.58;
 return palette;
}
