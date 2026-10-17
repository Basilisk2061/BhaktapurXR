import type {MeshStandardMaterial} from "three";
import type {CentralMaterial} from "./central-model";
/** Exploration-only response tuning; shared factory defaults/homepage/NPC assets stay untouched. */
export function polishDaylightPalette(materials:Record<CentralMaterial,MeshStandardMaterial>){
 const colors:Partial<Record<CentralMaterial,string>>={brick:"#c5b7ad",agedBrick:"#b19d90",carvedTimber:"#514033",timber:"#806149",roof:"#aaa099",stone:"#bebeb7",plaster:"#deded7",paving:"#d1c4b6"};
 for(const [id,color]of Object.entries(colors))materials[id as CentralMaterial].color.set(color);
 materials.brick.roughness=.92;materials.agedBrick.roughness=.94;
 materials.timber.roughness=.84;materials.carvedTimber.roughness=.88;
 materials.roof.roughness=.97;materials.plaster.roughness=.98;
}
