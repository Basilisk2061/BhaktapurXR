import type {MeshStandardMaterial} from "three";
import type {CentralMaterial} from "./central-model";
/** Exploration-only response tuning; shared factory defaults/homepage/NPC assets stay untouched. */
export function polishDaylightPalette(materials:Record<CentralMaterial,MeshStandardMaterial>){
 const colors:Partial<Record<CentralMaterial,string>>={brick:"#c6ada1",agedBrick:"#b59b8d",carvedTimber:"#5b4434",timber:"#896950",roof:"#9c8c7f",stone:"#c0c2bd",plaster:"#e0dfd8",paving:"#c4b8aa"};
 for(const [id,color]of Object.entries(colors))materials[id as CentralMaterial].color.set(color);
 materials.brick.roughness=.90;materials.agedBrick.roughness=.92;
 materials.timber.roughness=.76;materials.carvedTimber.roughness=.80;
 materials.roof.roughness=.94;materials.plaster.roughness=.96;materials.stone.roughness=.90;
 materials.gold.roughness=.44;materials.gold.metalness=.68;
 materials.ensembleBronze.roughness=.66;
 // Reuse existing world-position variation: no extra varyings, samples, passes or geometry.
 for(const id of ["brick","agedBrick","timber","carvedTimber","roof","heritageStone","heritageStoneShade"] as const){
  const material=materials[id],compile=material.onBeforeCompile,key=material.customProgramCacheKey;
  if(id==="heritageStone"||id==="heritageStoneShade")material.roughness=.90;
  material.onBeforeCompile=(shader,renderer)=>{
   compile.call(material,shader,renderer);
   if(id==="brick"||id==="agedBrick")shader.fragmentShader=shader.fragmentShader.replace("mix(0.88,1.0,smoothstep(0.0,1.8", "mix(0.82,1.0,smoothstep(0.0,1.4");
   else if(id==="heritageStone"||id==="heritageStoneShade")shader.fragmentShader=shader.fragmentShader.replace(".91,1.0);", ".87,.99);");
   else shader.fragmentShader=shader.fragmentShader.replace("diffuseColor.rgb *= 0.98+age*0.025;", "diffuseColor.rgb *= (0.98+age*0.025)*mix(.90,1.0,smoothstep(0.0,1.0,vHeritagePosition.y));");
  };
  material.customProgramCacheKey=()=>key.call(material)+":daylight-depth-v1";
 }
}
