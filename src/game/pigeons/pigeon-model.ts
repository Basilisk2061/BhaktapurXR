import {BoxGeometry,BufferGeometry,Color,ConeGeometry,DoubleSide,Float32BufferAttribute,Group,Mesh,MeshStandardMaterial,SphereGeometry,type BufferGeometry as Geometry} from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';

function colored(geometry:Geometry,color:string){
 const c=new Color(color),values:number[]=[];
 for(let i=0;i<geometry.getAttribute('position').count;i++)values.push(c.r,c.g,c.b);
 geometry.setAttribute('color',new Float32BufferAttribute(values,3));return geometry;
}
function ellipsoid(x:number,y:number,z:number,sx:number,sy:number,sz:number,color:string){
 return colored(new SphereGeometry(1,8,6).scale(sx,sy,sz).translate(x,y,z),color);
}
function box(x:number,y:number,z:number,w:number,h:number,d:number,color:string){return colored(new BoxGeometry(w,h,d).translate(x,y,z),color);}
function merge(parts:Geometry[]){const flat=parts.map(p=>p.toNonIndexed()),result=mergeGeometries(flat,false)!;new Set([...parts,...flat]).forEach(p=>p.dispose());return result;}
export function createPigeonResources(){
 const body=merge([
  ellipsoid(0,.145,.015,.089,.085,.125,'#727982'),
  ellipsoid(0,.17,-.06,.072,.085,.073,'#7b8189'),
  box(0,.12,.135,.082,.018,.085,'#444953'),
  ...[-1,1].flatMap(side=>[box(side*.03,.046,.015,.009,.07,.009,'#805e62'),box(side*.03,.005,-.005,.025,.01,.053,'#805e62')]),
 ]);
 // Move the pivot into the chest; inverse geometry offset preserves the resting silhouette.
 const head=merge([
  ellipsoid(0,.012,0,.044,.062,.045,'#4c605c'),
  ellipsoid(0,.083,-.023,.053,.052,.055,'#505660'),
  colored(new ConeGeometry(.014,.044,6).rotateX(-Math.PI/2).translate(0,.076,-.089),'#34343b'),
  ...[-1,1].map(side=>ellipsoid(side*.047,.094,-.04,.006,.006,.007,'#201e20')),
 ]).translate(0,.05,-.035);
 const wing=new BufferGeometry();
 const vertices=[0,0,-.03,.23,-.005,.075,.17,.005,-.095,.025,.005,.085];
 wing.setAttribute('position',new Float32BufferAttribute(vertices,3));wing.setIndex([0,1,2,0,3,1]);wing.computeVertexNormals();colored(wing,'#515965');
 const palettes=['#f3f2ef','#dfE3e7','#eee5dd'].map(tint=>Array.from({length:8},(_,i)=>new MeshStandardMaterial({color:tint,vertexColors:true,roughness:.94,side:DoubleSide,transparent:i<7,opacity:(i+1)/8,depthWrite:i===7})));
 return {body,head,wing,palettes,dispose(){body.dispose();head.dispose();wing.dispose();palettes.flat().forEach(m=>m.dispose());}};
}
export type PigeonResources=ReturnType<typeof createPigeonResources>;
export function createPigeonVisual(resources:PigeonResources,variant:number){
 const root=new Group(),body=new Mesh(resources.body,resources.palettes[variant][7]),head=new Group();
 head.name="neck-pivot";head.position.set(0,.12,-.04);const face=new Mesh(resources.head,body.material);head.add(face);
 const wings=[-1,1].map(side=>{const pivot=new Group(),hinge=new Group(),mesh=new Mesh(resources.wing,body.material);pivot.position.set(side*.065,.18,.005);pivot.scale.x=side;hinge.add(mesh);pivot.add(hinge);root.add(pivot);return {hinge,mesh};});
 root.add(body,head);root.visible=false;
 return {root,head,wings,meshes:[body,face,...wings.map(w=>w.mesh)],material:-1};
}
