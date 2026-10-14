import {BufferGeometry,Float32BufferAttribute,DataTexture,RGBAFormat,RepeatWrapping,SRGBColorSpace,LinearFilter,LinearMipmapLinearFilter,type MeshStandardMaterial} from "three";
import type {CentralRoof} from "./central-model.ts";
/** Shallow swept metal sheet, rather than the generic four-sided tiled hip. */
export function goldenSweptCanopy(r:CentralRoof){
 const pos:number[]=[],uv:number[]=[],nx=24,nz=8;
 const point=(i:number,j:number,under=false)=>{
  const x=(i/nx-.5)*r.width,z=(j/nz-.5)*r.depth;
  const y=r.rise*Math.pow(1-j/nz,2)+.32*Math.pow(Math.abs(x)/(r.width/2),5)-(under?.06:0);
  return [x,y,z];
 };
 const face=(a:number[],b:number[],c:number[])=>{for(const p of [a,b,c]){pos.push(...p);uv.push(p[0]/2,p[2]/2);}};
 for(let i=0;i<nx;i++)for(let j=0;j<nz;j++)for(const under of [false,true]){
  const a=point(i,j,under),b=point(i+1,j,under),c=point(i+1,j+1,under),d=point(i,j+1,under);
  if(under){face(a,c,b);face(a,d,c);}else{face(a,b,c);face(a,c,d);}
 }
 for(let i=0;i<nx;i++)for(const j of [0,nz]){const a=point(i,j),b=point(i+1,j),c=point(i+1,j,true),d=point(i,j,true);face(a,b,c);face(a,c,d);}
 for(let j=0;j<nz;j++)for(const i of [0,nx]){const a=point(i,j),b=point(i,j+1),c=point(i,j+1,true),d=point(i,j,true);face(a,b,c);face(a,c,d);}
 const g=new BufferGeometry();g.setAttribute("position",new Float32BufferAttribute(pos,3));g.setAttribute("uv",new Float32BufferAttribute(uv,2));g.computeVertexNormals();g.rotateY(r.yaw);g.translate(...r.position);return g;
}
/** 2m repeated patch; one replacement map, no extra material/texture allocation. */
export function insideSquarePavingTexture(){
 const size=256,data=new Uint8Array(size*size*4),mod=(n:number)=>((n%16)+16)%16;
 const brick=(x:number,y:number)=>{const s=((x+y)%4+4)%4;return s<2?[mod(x-s),mod(y),0]:[mod(x),mod(y-(s-2)),1];};
 const hash=(x:number,y:number)=>((Math.imul(x+17,374761393)^Math.imul(y+31,668265263))>>>0)/4294967295;
 for(let y=0;y<size;y++)for(let x=0;x<size;x++){
  const ix=Math.floor(x/16),iy=Math.floor(y/16),b=brick(ix,iy),joint=(x%16===0&&brick(ix-1,iy).join()!==b.join())||(y%16===0&&brick(ix,iy-1).join()!==b.join());
  const variation=(hash(b[0],b[1])-.5)*13+(hash(x,y)-.5)*4,base=joint?[112,103,88]:[159,124,97],k=(y*size+x)*4;
  for(let c=0;c<3;c++)data[k+c]=Math.round(base[c]+(joint?0:variation));data[k+3]=255;
 }
 const t=new DataTexture(data,size,size,RGBAFormat);t.wrapS=t.wrapT=RepeatWrapping;t.colorSpace=SRGBColorSpace;t.magFilter=LinearFilter;t.minFilter=LinearMipmapLinearFilter;t.generateMipmaps=true;t.anisotropy=4;t.needsUpdate=true;return t;
}
export function finishInsideSquarePaving(material:MeshStandardMaterial){material.map?.dispose();material.map=insideSquarePavingTexture();material.bumpMap=material.map;material.bumpScale=.012;material.roughness=.98;material.needsUpdate=true;}
