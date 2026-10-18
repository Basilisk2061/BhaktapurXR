import {CanvasTexture,SRGBColorSpace,MeshStandardMaterial,DoubleSide,LatheGeometry,Vector2,Shape,ExtrudeGeometry,BufferGeometry,Float32BufferAttribute} from "three";
import type {CentralProfile,CentralShape,CentralRoof} from "./central-model.ts";
import {gopinathRoofGeometry} from "./gopinath-roof-geometry.ts";
import {museumSculptureGeometry} from "./museum-sculptures.ts";
import {goldenSweptCanopy} from "./inside-square-surfaces.ts";
import {applySurfaceFinish,generatedTexture} from "../materials/heritage-materials.ts";
export const centralMaterialDefinitions={exteriorPaving:{color:"#d0b79e",roughness:1},exteriorRoad:{color:"#797974",roughness:1},exteriorSignCafe:{color:"#e2ddcc",roughness:1},exteriorSignExchange:{color:"#e2ddcc",roughness:1},exteriorSignTextiles:{color:"#e2ddcc",roughness:1},exteriorTeal:{color:"#48776b",roughness:.96},exteriorWine:{color:"#77444e",roughness:.97},exteriorOchre:{color:"#ac8b4d",roughness:.97},exteriorBlue:{color:"#556f84",roughness:.96},exteriorLeaf:{color:"#536548",roughness:1},exteriorLeafShade:{color:"#3e503a",roughness:1},exteriorMark:{color:"#b4aa7a",roughness:1},gateBrick:{color:"#eee1d5",roughness:.98},road:{color:"#939189",roughness:1},brick:{color:"#e0cfbc",roughness:.94},timber:{color:"#977452",roughness:.86},stone:{color:"#c3b9a4",roughness:.97,flatShading:true},roof:{color:"#b3a699",roughness:.93,flatShading:true},paving:{color:"#d2c6b4",roughness:.97},recess:{color:"#3a3025",roughness:1},gold:{color:"#b29a60",roughness:.65,metalness:.72},bronze:{color:"#66604a",roughness:.76,metalness:.62},plaster:{color:"#d6cfbb",roughness:.98},neutral:{color:"#716255",roughness:1},shutter:{color:"#724438",roughness:.92}} as const;
export function createCentralMaterials(){const maps=new Map<string,ReturnType<typeof generatedTexture>>();const texture=(kind:Parameters<typeof generatedTexture>[0])=>{let map=maps.get(kind);if(!map){map=generatedTexture(kind);maps.set(kind,map);}return map;};return Object.fromEntries(Object.entries(centralMaterialDefinitions).map(([id,p])=>{const map=id==="exteriorRoad"?texture("stone"):id==="exteriorPaving"?texture("paving"):id==="gateBrick"?texture("gateBrick"):id==="road"?texture("stone"):id==="brick"||id==="roof"||id==="paving"?texture(id):id==="stone"||id==="timber"?texture(id):null;const mat=new MeshStandardMaterial({...p,map,side:DoubleSide});
 if(id.startsWith("exteriorSign")){const canvas=document.createElement("canvas");canvas.width=512;canvas.height=96;const ctx=canvas.getContext("2d")!;ctx.fillStyle="#e4dfd1";ctx.fillRect(0,0,512,96);ctx.strokeStyle="#8c887c";ctx.strokeRect(5,5,502,86);ctx.fillStyle="#4c4b45";ctx.font="27px serif";ctx.textAlign="center";ctx.fillText(id==="exteriorSignCafe"?"COURTYARD CAFE":id==="exteriorSignExchange"?"TRAVEL & EXCHANGE":"LOCAL TEXTILES & CRAFTS",256,58);mat.map=new CanvasTexture(canvas);mat.map.colorSpace=SRGBColorSpace;}

 if(id==="exteriorRoad"||id==="exteriorPaving"||id==="exteriorMark")mat.userData.exteriorGround=true;
 // Box instances receive metre-scaled tiling; large facades never stretch one brick tile.
 mat.onBeforeCompile=shader=>{if(id.startsWith("exteriorSign"))return;shader.vertexShader=shader.vertexShader.replace('#include <uv_vertex>',`#include <uv_vertex>
 #if defined(USE_MAP) && defined(USE_INSTANCING)
 vec3 extent=vec3(length(instanceMatrix[0].xyz),length(instanceMatrix[1].xyz),length(instanceMatrix[2].xyz));
 vec2 metreScale=abs(normal.y)>0.5 ? extent.xz/2.0 : abs(normal.x)>0.5 ? extent.zy/2.0 : extent.xy/2.0;
 vMapUv *= metreScale;
 #ifdef USE_BUMPMAP
 vBumpMapUv *= metreScale;
 #endif
 #endif`);};applySurfaceFinish(mat,id==="exteriorRoad"?"stone":id==="exteriorPaving"?"paving":id==="gateBrick"?"brick":id==="road"?"stone":id);mat.customProgramCacheKey=()=>"central-metre-uv-v2:"+id;return [id,mat]})) as Record<keyof typeof centralMaterialDefinitions,MeshStandardMaterial>;}
export function profileGeometry(p:CentralProfile){const sculpted=museumSculptureGeometry(p);if(sculpted)return sculpted;const g=new LatheGeometry(p.profile.map(([r,y])=>new Vector2(r,y)),p.segments);const v=g.toNonIndexed();g.dispose();
 // Metre tiling for the new large brick towers; accepted central UVs stay unchanged.
 if(p.material==="gateBrick"||(p.material==="brick"&&/^(silu|badri|kedar)-/.test(p.role))){const uv=v.getAttribute("uv"),position=v.getAttribute("position"),radius=Math.max(...p.profile.map(([r])=>r)),perimeter=radius*(p.segments===4?4*Math.SQRT2:2*Math.PI);for(let i=0;i<uv.count;i++)uv.setXY(i,uv.getX(i)*perimeter/2,position.getY(i)/2);}
 v.rotateY(p.yaw+(p.segments===4?Math.PI/4:Math.PI/8));v.translate(...p.position);return v;}
export function shapeGeometry(s:CentralShape){const shape=new Shape();s.points.forEach(([x,y],i)=>i?shape.lineTo(x,y):shape.moveTo(x,y));shape.closePath();const g=new ExtrudeGeometry(shape,{depth:s.depth,bevelEnabled:!!s.sculpturalBevel,bevelSize:s.sculpturalBevel??0,bevelThickness:s.sculpturalBevel??0,bevelSegments:2,steps:1,curveSegments:1});if(s.material==="gateBrick"){const uv=g.getAttribute("uv");for(let i=0;i<uv.count;i++)uv.setXY(i,uv.getX(i)/2,uv.getY(i)/2);if(s.role==="khauma-brick-arch-voussoir-ring"){const positions=g.getAttribute("position");for(let i=0;i<uv.count;i++){const x=positions.getX(i),y=positions.getY(i)-3.15;uv.setXY(i,Math.atan2(x,y)*1.1,Math.hypot(x,y)/2);}}}g.rotateY(s.yaw);g.translate(...s.position);return g;}
export function roofGeometry(r:CentralRoof){
 if(/^gopinath-reference-(main|upper)-tile-shell$/.test(r.role))return gopinathRoofGeometry(r);
 if(r.role==="phase9b-golden-gate-swept-canopy")return goldenSweptCanopy(r);
 if(r.family==="SOFFIT"){
  const w=r.width/2,d=r.depth/2,iw=r.innerWidth!/2,id=r.innerDepth!/2,drop=r.drop!,points=[[-w,0,-d],[w,0,-d],[w,0,d],[-w,0,d],[-iw,-drop,-id],[iw,-drop,-id],[iw,-drop,id],[-iw,-drop,id]],faces=[[0,4,5],[0,5,1],[1,5,6],[1,6,2],[2,6,7],[2,7,3],[3,7,4],[3,4,0]],pos:number[]=[],uv:number[]=[];
  for(const f of faces)for(const i of f){pos.push(...points[i]);uv.push(points[i][0]/2,points[i][2]/2);}
  const g=new BufferGeometry();g.setAttribute("position",new Float32BufferAttribute(pos,3));g.setAttribute("uv",new Float32BufferAttribute(uv,2));g.computeVertexNormals();g.rotateY(r.yaw);g.translate(...r.position);return g;
 }
 const w=r.width/2,d=r.depth/2,ridge=Math.max(0,w-d*(r.family==="PAGODA"?1:.5)),points=[[-w,.12,-d],[w,.12,-d],[w,.12,d],[-w,.12,d],[-ridge,r.rise,0],[ridge,r.rise,0],[-w*.86,0,-d*.86],[w*.86,0,-d*.86],[w*.86,0,d*.86],[-w*.86,0,d*.86]],faces=[[6,7,1],[6,1,0],[7,8,2],[7,2,1],[8,9,3],[8,3,2],[9,6,0],[9,0,3],[0,1,5],[0,5,4],[1,2,5],[2,3,4],[2,4,5],[3,0,4]],pos:number[]=[],uv:number[]=[];for(const f of faces)for(const i of f){pos.push(...points[i]);uv.push(points[i][0]/2,(points[i][2]+points[i][1])/2);}const g=new BufferGeometry();g.setAttribute("position",new Float32BufferAttribute(pos,3));g.setAttribute("uv",new Float32BufferAttribute(uv,2));g.computeVertexNormals();g.rotateY(r.yaw);g.translate(...r.position);return g;}
