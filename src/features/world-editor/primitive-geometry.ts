import {BoxGeometry,CylinderGeometry,SphereGeometry,type BufferGeometry} from 'three';
import type {Triple} from './transforms.ts';
export function createPrimitiveGeometries(){return {Block:new BoxGeometry(1,1,1),Cylinder:new CylinderGeometry(.5,.5,1,16),Plane:new BoxGeometry(1,.02,1),Sphere:new SphereGeometry(.5,16,8)};}
/** Bake nonuniform scale before Rapier applies the same XYZ rotation/position as the mesh. */
export function primitiveHull(geometry:BufferGeometry,scale:Triple){const p=geometry.getAttribute('position'),vertices=new Float32Array(p.count*3);for(let i=0;i<p.count;i++){vertices[i*3]=p.getX(i)*scale[0];vertices[i*3+1]=p.getY(i)*scale[1];vertices[i*3+2]=p.getZ(i)*scale[2];}return vertices;}
