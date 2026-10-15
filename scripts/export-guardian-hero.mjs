/** Regenerate the isolated hero from the rendered school guardian; never imports world code in the browser. */
import fs from 'node:fs';
import {BoxGeometry,LatheGeometry,ExtrudeGeometry,Shape,Vector2} from 'three';
import {mergeGeometries,mergeVertices} from 'three/addons/utils/BufferGeometryUtils.js';
import {schoolEntrance} from '../src/game/architecture/khauma-interior-correction.ts';
import {museumSculptureGeometry} from '../src/game/architecture/museum-sculptures.ts';
const model=schoolEntrance({id:'edge:khauma-north-flank:1158762014',origin:[0,0],yaw:0}),centre=[8.75,0,3.2],buckets=new Map();
const selected=p=>p.role.startsWith('school-left-guardian')&&!p.role.includes('collision')||(p.role.startsWith('school-pedestals')&&Math.abs(p.position[0]-centre[0])<1.2);
const add=(g,material)=>{g.translate(-centre[0],0,-centre[2]);g.deleteAttribute('uv');const list=buckets.get(material)??[];list.push(g.index?g.toNonIndexed():g);if(g.index)g.dispose();buckets.set(material,list);};
for(const p of model.profiles.filter(selected)){let g=museumSculptureGeometry(p);if(!g){g=new LatheGeometry(p.profile.map(p=>new Vector2(...p)),p.segments);g.rotateY(p.yaw+(p.segments===4?Math.PI/4:Math.PI/8));g.translate(...p.position);}add(g,p.material);}
for(const p of model.boxes.filter(selected)){const g=new BoxGeometry(...p.size);g.rotateY(p.yaw);g.translate(...p.position);add(g,p.material);}
for(const p of model.shapes.filter(selected)){const g=new ExtrudeGeometry(new Shape(p.points.map(p=>new Vector2(...p))),{depth:p.depth,bevelEnabled:false,steps:1,curveSegments:1});g.rotateY(p.yaw);g.translate(...p.position);add(g,p.material);}
const meshes=[...buckets].map(([material,parts])=>{const merged=mergeGeometries(parts,false),g=mergeVertices(merged,1e-5),round=a=>Array.from(a,v=>+v.toFixed(4)),result={material,positions:round(g.getAttribute('position').array),normals:round(g.getAttribute('normal').array),indices:Array.from(g.index.array)};parts.forEach(p=>p.dispose());merged.dispose();g.dispose();return result;});
const asset={source:'edge:khauma-north-flank:1158762014/left-guardian + existing left pedestal; generated from schoolEntrance',meshes};
fs.writeFileSync('src/components/home/guardian-lion.json',JSON.stringify(asset));console.log(JSON.stringify({meshes:meshes.length,triangles:meshes.reduce((n,m)=>n+m.indices.length/3,0),bytes:JSON.stringify(asset).length}));
