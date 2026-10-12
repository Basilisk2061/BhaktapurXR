import type {CentralModel,CentralBox,CentralMaterial} from "./central-model.ts";
export const arcadeSpecification={id:"sitting-edge-arcade",classification:"CONTEXT_APPROXIMATE",dimensionEvidence:["PHOTO_PROPORTION","ARCHITECTURAL_INFERENCE"],origin:[-28,45] as [number,number],yaw:Math.PI,length:46,depth:7,platformHeight:.54,columnCount:17,bayCount:16,notes:"Approximate long sitting-edge assembly replacing generic context, not a surveyed footprint or named heritage reconstruction"};
export function buildSittingArcade():CentralModel{
 const s=arcadeSpecification,m:CentralModel={id:s.id,anchorId:s.id,origin:[...s.origin],yaw:s.yaw,boxes:[],profiles:[],shapes:[],roofs:[],colliders:[],accuracy:s.classification,neutral:false};
 const point=(x:number,y:number,z:number):[number,number,number]=>[s.origin[0]-x,y,s.origin[1]-z];
 const box=(x:number,y:number,z:number,w:number,h:number,d:number,material:CentralMaterial,role:string,collision=false)=>{const b:CentralBox={position:point(x,y,z),size:[w,h,d],yaw:s.yaw,material,role};m.boxes.push(b);if(collision)m.colliders.push({position:b.position,size:b.size,yaw:b.yaw});};
 for(let i=0;i<3;i++)box(0,(i+.5)*.18,0,s.length-i*.12,.18,s.depth-i*.12,i===2?"stone":"brick","arcade-raised-platform",true);
 box(0,.45,2.98,s.length,.18,.8,"stone","arcade-continuous-sitting-ledge");
 box(0,3.5,-2.8,s.length,5.92,.4,"brick","arcade-solid-rear-wall",true);
 for(const x of [-17.875,1.375,17.875])for(let i=0;i<3;i++)box(x,(i+1)*.18/2,4.2-i*.28,1.8,(i+1)*.18,.3,"stone","arcade-platform-access",true);
 const spacing=44/(s.columnCount-1);
 for(let i=0;i<s.columnCount;i++){const x=-22+i*spacing;box(x,2.5,2.1,.36,3.92,.36,"timber","arcade-heavy-timber-column",true);box(x,.68,2.1,.65,.28,.65,"stone","arcade-column-base");box(x,.98,2.1,.48,.2,.48,"timber","arcade-carved-base");box(x,4.32,2.1,.62,.28,.62,"timber","arcade-carved-capital");
  if(i<s.bayCount){const centre=x+spacing/2;m.shapes.push({position:point(centre,3.72,2.1),points:[[-spacing/2,0],[-spacing/2,.68],[spacing/2,.68],[spacing/2,0],[spacing*.33,.04],[spacing*.2,.31],[0,.43],[-spacing*.2,.31],[-spacing*.33,.04]],depth:.14,material:"timber",yaw:s.yaw,role:"arcade-open-bay-bracket"});}
 }
 box(0,4.48,2.1,s.length+.4,.38,.5,"timber","arcade-continuous-carved-band");box(0,4.69,0,s.length,.2,5.7,"timber","arcade-upper-floor",true);box(0,5.54,0,s.length,1.5,5.4,"brick","arcade-upper-gallery-body",true);
 for(let i=0;i<s.bayCount;i++){const x=-22+(i+.5)*spacing;box(x,5.56,2.76,2.12,1.35,.12,"timber","arcade-upper-window-frame");box(x,5.56,2.85,1.86,1.1,.065,"recess","arcade-upper-gallery-window");for(const dx of [-.65,-.32,0,.32,.65])box(x+dx,5.56,2.9,.03,1.1,.035,"timber","arcade-upper-gallery-lattice");box(x,5.02,2.92,2.2,.12,.28,"timber","arcade-gallery-sill");}
 box(0,6.38,2.7,s.length+.3,.2,.45,"timber","arcade-gallery-header");box(0,6.435,0,s.length+2.1,.24,9.7,"timber","arcade-deep-projecting-eave");m.roofs.push({position:point(0,6.55,0),width:s.length+2.4,depth:10,rise:1.25,yaw:s.yaw,material:"roof",role:"arcade-long-continuous-tiled-roof"});return m;
}
