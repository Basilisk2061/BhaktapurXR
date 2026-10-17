import {mkdir,writeFile,readFile,readdir,unlink} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {buildCompletedSquareModels,buildCompletedSquareEdge} from '../src/game/architecture/square-completion.ts';
import {Box3,Vector3,Matrix4,PerspectiveCamera,Frustum} from 'three';
import {partitionArchitecturalParts} from "../src/features/world-editor/parts.ts";
import {partWorldDelta,overrideMatrix} from '../src/features/world-editor/transforms.ts';
const emitted=new Set();const dir='public/world-data';await mkdir(dir,{recursive:true});
const saved=JSON.parse(await readFile('src/features/bhaktapur/data/world-editor-state.json','utf8')),legacy=JSON.parse(await readFile('src/features/bhaktapur/data/manual-transform-overrides.json','utf8')),overrides=saved.transforms??legacy;
const urban=buildCompletedSquareEdge(),models=[...buildCompletedSquareModels(),...urban.models];
function bounds(m){const b=new Box3();for(const p of [...m.boxes,...m.profiles,...m.shapes,...m.roofs]){const r='size'in p?Math.hypot(...p.size)/2:'profile'in p?Math.max(...p.profile.map(([r,y])=>Math.hypot(r,y))):'width'in p?Math.hypot(p.width,p.depth,p.rise):Math.max(...p.points.map(([x,y])=>Math.hypot(x,y)),p.depth);const v=new Vector3(...p.position);b.expandByPoint(v.clone().addScalar(r));b.expandByPoint(v.clone().addScalar(-r));}for(const v of m.volumes??[])for(const r of v.rings)for(const [x,z]of r){b.expandByPoint(new Vector3(x,v.baseY,z));b.expandByPoint(new Vector3(x,v.baseY+v.height,z));}if(b.isEmpty())b.expandByPoint(new Vector3(m.origin[0],0,m.origin[1]));const source={position:[m.origin[0],0,m.origin[1]],rotation:[0,m.yaw,0],scale:[1,1,1]};const original=b.clone();if(overrides[m.id])b.applyMatrix4(overrideMatrix(source,overrides[m.id]));for(const part of partitionArchitecturalParts(m))if(overrides[part.id])b.union(original.clone().applyMatrix4(partWorldDelta(source,overrides[m.id]??source,part.source,overrides[part.id])));return b;}
await writeFile('src/game/world/generated-seat-source.json',JSON.stringify(urban.models.find(m=>m.id==='edge:yetachapari:1160027594')));
const boxes=new Map();
for(const m of models)boxes.set(m.id,bounds(m));
async function asset(value){const text=JSON.stringify(value),hash=createHash('sha256').update(text).digest('hex').slice(0,16),name='chunk-'+hash+'.json';emitted.add(name);if(await readFile(dir+'/'+name,'utf8').catch(()=>null)!==text)await writeFile(dir+'/'+name,text);return '/world-data/'+name;}
// Keep large homepage sculpted surfaces in reusable content-hashed assets.
for(const m of models)for(const p of m.profiles)if(p.sculptedSurface)p.sculptedSurface={url:await asset(p.sculptedSurface)};
// Keep the existing three compositions; include only conservative view-frustum candidates, no physics.
const shots=[[[-131,4.8,-43],[-119,4,-30]],[[-35,5,8],[-8,5,-12]],[[-120,5,1],[-100,3,-17]]];
const frusta=shots.map(([position,target])=>{const c=new PerspectiveCamera(48,3,.1,350);c.position.fromArray(position);c.lookAt(new Vector3(...target));c.updateMatrixWorld();return new Frustum().setFromProjectionMatrix(new Matrix4().multiplyMatrices(c.projectionMatrix,c.matrixWorldInverse));});
const home=models.filter(m=>frusta.some(f=>f.intersectsBox(boxes.get(m.id)))).map(m=>({...m,colliders:[],boxes:m.boxes.filter(b=>!b.role.includes('collision'))}));
await writeFile(dir+'/manifest.json',JSON.stringify({home:await asset(home)}));console.log('Prepared deferred homepage data:',home.length,'visible candidates');

if(process.argv.includes('--prune'))for(const name of await readdir(dir))if(/^chunk-[a-f0-9]{16}\.json$/.test(name)&&!emitted.has(name))await unlink(dir+'/'+name);
