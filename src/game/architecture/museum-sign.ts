import {CanvasTexture,MeshStandardMaterial,SRGBColorSpace} from "three";
import {museumEntrance} from "./museum-entrance.ts";
import type {CentralMaterial} from "./central-model.ts";
export function finishMuseumMaterials(materials:Record<Exclude<CentralMaterial,"museumSign"|"museumStone"|"museumRelief"|"guardianStone"|"heritageStone"|"heritageStoneShade"|"ensembleBronze">,MeshStandardMaterial>){
 const museumStone=materials.stone.clone();museumStone.color.set("#9f9586");museumStone.roughness=1;museumStone.flatShading=false;
 museumStone.onBeforeCompile=materials.stone.onBeforeCompile;museumStone.customProgramCacheKey=()=>materials.stone.customProgramCacheKey()+":museum-stone";
 const guardianStone=museumStone.clone();guardianStone.color.set("#afa28f");guardianStone.roughness=.98;guardianStone.onBeforeCompile=museumStone.onBeforeCompile;guardianStone.customProgramCacheKey=()=>museumStone.customProgramCacheKey()+":guardian";
 const museumRelief=museumStone.clone();museumRelief.color.set("#81776a");museumRelief.onBeforeCompile=museumStone.onBeforeCompile;museumRelief.customProgramCacheKey=()=>museumStone.customProgramCacheKey()+":relief";
 return {...materials,museumStone,museumRelief,guardianStone,museumSign:createMuseumSignMaterial()};
}
/** One small locally generated board, with system Devanagari fallback; no web font. */
export function createMuseumSignMaterial(){
 const canvas=document.createElement("canvas");canvas.width=1024;canvas.height=256;
 const context=canvas.getContext("2d")!;
 context.fillStyle="#e6d5b3";context.fillRect(0,0,1024,256);
 context.strokeStyle="#5b3d28";context.lineWidth=7;context.strokeRect(12,12,1000,232);
 context.textAlign="center";context.textBaseline="middle";context.fillStyle="#7d2824";
 context.font='bold 57px "Nirmala UI", "Mangal", sans-serif';context.fillText(museumEntrance.signLines[0],512,88,950);
 context.font='bold 49px Georgia, serif';context.fillText(museumEntrance.signLines[1],512,181,950);
 const map=new CanvasTexture(canvas);map.colorSpace=SRGBColorSpace;map.anisotropy=4;
 return new MeshStandardMaterial({map,roughness:.95});
}
