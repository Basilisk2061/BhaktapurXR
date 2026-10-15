import {CatmullRomCurve3,Vector3} from "three";
import type {CentralModel,CentralMaterial} from "./central-model.ts";
type P=[number,number,number];type Ring=[number,number,number,number,number];
/** Moderate carved surfaces shared by this ensemble only; no school/museum asset changes. */
export function carvedLoft(m:CentralModel,at:P,rings:Ring[],material:CentralMaterial,role:string,yaw=0,sides=20,flutes=0){
 const positions:number[]=[],indices:number[]=[];for(let row=0;row<rings.length;row++){const [y,x,z,rx,rz]=rings[row];for(let j=0;j<=sides;j++){const a=j*2*Math.PI/sides,k=1+flutes*Math.cos(a*12);positions.push(x+rx*Math.cos(a)*k,y,z+rz*Math.sin(a)*k);if(row&&j){const b=row*(sides+1)+j;indices.push(b,b-sides-2,b-1,b,b-sides-1,b-sides-2);}}}
 const c=Math.cos(m.yaw),s=Math.sin(m.yaw);m.profiles.push({position:[m.origin[0]+at[0]*c+at[2]*s,at[1],m.origin[1]-at[0]*s+at[2]*c],yaw:m.yaw+yaw,profile:[[0,0],[.01,.01]],segments:sides,material,role,sculptedSurface:{positions,indices}});
}
export function carvedCurve(m:CentralModel,at:P,points:P[],radius:number,material:CentralMaterial,role:string,sides=8){
 const curve=new CatmullRomCurve3(points.map(p=>new Vector3(...p))),positions:number[]=[],indices:number[]=[],samples=16;
 for(let i=0;i<=samples;i++){const t=i/samples,p=curve.getPoint(t),v=curve.getTangent(t),a=new Vector3(Math.abs(v.y)>.9?1:0,Math.abs(v.y)>.9?0:1,0).cross(v).normalize(),b=v.clone().cross(a).normalize(),r=radius*(.8+.2*Math.sin(t*Math.PI));for(let j=0;j<=sides;j++){const angle=j*2*Math.PI/sides,q=p.clone().addScaledVector(a,Math.cos(angle)*r).addScaledVector(b,Math.sin(angle)*r);positions.push(q.x,q.y,q.z);if(i&&j){const k=i*(sides+1)+j;indices.push(k,k-1,k-sides-2,k,k-sides-2,k-sides-1);}}}
 const c=Math.cos(m.yaw),s=Math.sin(m.yaw);m.profiles.push({position:[m.origin[0]+at[0]*c+at[2]*s,at[1],m.origin[1]-at[0]*s+at[2]*c],yaw:m.yaw,profile:[[0,0],[.01,.01]],segments:sides,material,role,sculptedSurface:{positions,indices}});
}
export function stairGuardian(m:CentralModel,x:number,y:number,z:number){
 const material:CentralMaterial="heritageStoneShade",at:P=[x,y,z],yaw=-Math.PI/2,r="vatsala-stair-guardian";
 carvedLoft(m,at,[[0,0,-.12,.25,.36],[.2,0,-.1,.34,.4],[.55,0,-.06,.31,.34],[.92,0,.07,.24,.24],[1.04,0,.14,.17,.16]],material,r+"-seated-body",yaw,20);
 carvedLoft(m,[x,y+.88,z],[[0,0,.12,.15,.17],[.13,0,.17,.28,.25],[.3,0,.2,.3,.27],[.45,0,.18,.24,.21],[.51,0,.15,.08,.1],[.53,0,.15,.001,.001]],material,r+"-head",yaw,24);
 for(const side of [-1,1]){
  const local=(a:number,b:number,c:number):P=>[x-c,y+b,z+a];
  carvedLoft(m,local(side*.21,0,.28),[[0,0,0,.12,.24],[.1,0,0,.14,.23],[.22,0,-.04,.11,.15],[.65,0,-.09,.1,.12],[.79,0,-.13,.15,.15]],material,r+"-front-leg",yaw,16);
  carvedLoft(m,local(side*.27,.04,-.25),[[0,0,0,.16,.22],[.22,0,0,.21,.26],[.48,0,0,.19,.23],[.62,0,0,.08,.12],[.64,0,0,.001,.001]],material,r+"-haunch",yaw,16);
  carvedLoft(m,local(side*.23,1.26,.14),[[0,0,0,.09,.05],[.1,0,0,.1,.07],[.2,0,-.04,.04,.03],[.23,0,-.05,.001,.001]],material,r+"-ear",yaw,12);
  for(let j=0;j<3;j++)carvedLoft(m,local(side*.21+(j-1)*.07,.015,.45),[[0,0,0,.035,.07],[.06,0,0,.04,.085],[.12,0,-.02,.02,.05],[.14,0,-.04,.001,.001]],material,r+"-toe",yaw,10);
 }
 carvedLoft(m,[x-.4,y+1.08,z],[[0,0,0,.14,.08],[.08,0,.02,.2,.13],[.16,0,-.025,.19,.14],[.2,0,-.06,.1,.07]],material,r+"-muzzle",yaw,20);
 carvedLoft(m,[x-.39,y+.98,z],[[0,0,0,.08,.06],[.05,0,0,.17,.11],[.09,0,-.04,.15,.08]],material,r+"-jaw",yaw,16);
 for(let j=0;j<9;j++){const a=j*Math.PI/4.5;carvedLoft(m,[x+.04+Math.sin(a)*.12,y+.88+j*.016,z+Math.cos(a)*.29],[[0,0,0,.05,.04],[.1,0,0,.075,.06],[.2,0,0,.04,.04],[.22,0,0,.001,.001]],material,r+"-carved-mane",yaw,10);}
}
export function mallaFigure(m:CentralModel,y:number){
 const r="malla-royal-figure",mat:CentralMaterial="ensembleBronze";
 carvedLoft(m,[0,y,0],[[0,0,0,.38,.27],[.12,0,0,.4,.29],[.24,0,-.03,.25,.21],[.42,0,-.02,.22,.17],[.76,0,0,.26,.16],[.85,0,0,.14,.12],[.9,0,0,.09,.08]],mat,r+"-torso",0,24);
 carvedLoft(m,[0,y+.88,0],[[0,0,0,.08,.08],[.06,0,0,.12,.1],[.14,0,-.02,.17,.14],[.32,0,0,.16,.13],[.4,0,.01,.1,.08],[.43,0,0,.001,.001]],mat,r+"-head",0,24);
 carvedLoft(m,[0,y+1.22,0],[[0,0,0,.15,.12],[.08,0,0,.17,.13],[.18,0,0,.11,.09],[.25,0,.02,.08,.06],[.29,0,0,.001,.001]],mat,r+"-headdress",0,20);
 for(const side of [-1,1]){
  carvedCurve(m,[0,y,0],[[side*.16,.23,0],[side*.39,.12,-.16],[side*.27,.06,-.32],[side*.04,.08,-.33]],.12,mat,r+"-folded-leg",10);
  carvedCurve(m,[0,y,0],[[side*.21,.73,0],[side*.3,.53,-.12],[side*.14,.63,-.29],[side*.055,.88,-.29]],.07,mat,r+"-praying-arm",10);
  carvedLoft(m,[side*.04,y+.82,-.3],[[0,0,0,.025,.035],[.13,0,0,.035,.04],[.2,0,0,.018,.025],[.22,0,0,.001,.001]],mat,r+"-joined-hand",0,12);
 }
}
