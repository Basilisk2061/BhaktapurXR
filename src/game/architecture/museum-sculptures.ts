import {BufferGeometry,Float32BufferAttribute,Vector3,CatmullRomCurve3} from "three";
import type {CentralModel,CentralProfile,CentralMaterial} from "./central-model.ts";
import {profile,shape,box} from "./architecture-primitives.ts";
type Point=[number,number,number];
type Ring=[number,number,number,number,number]; // height, centre x/z, width/depth radii
const lionRole="museum-entrance-lions",figureRole="museum-entrance-figures";
/** Only sculpture surfaces use this path; existing architecture geometry is unchanged. */
export function museumSculptureGeometry(p:CentralProfile){
 if(!p.sculptedSurface)return null;
 const g=new BufferGeometry();g.setAttribute("position",new Float32BufferAttribute(p.sculptedSurface.positions,3));g.setIndex(p.sculptedSurface.indices);g.computeVertexNormals();
 const pos=g.getAttribute("position"),uv:number[]=[];for(let i=0;i<pos.count;i++)uv.push(pos.getX(i)/2,pos.getY(i)/2);
 g.setAttribute("uv",new Float32BufferAttribute(uv,2));g.rotateY(p.yaw);g.translate(...p.position);const flat=g.toNonIndexed();g.dispose();return flat;
}
function surface(m:CentralModel,at:Point,positions:number[],indices:number[],material:CentralMaterial,role:string){
 const [x,y,z]=at,c=Math.cos(m.yaw),s=Math.sin(m.yaw);
 m.profiles.push({position:[m.origin[0]+x*c+z*s,y,m.origin[1]-x*s+z*c],yaw:m.yaw,profile:[[0,0],[.5,1]],segments:20,material,role,sculptedSurface:{positions,indices}});
}
// Explicit elliptical sections produce heavy, continuous stone masses, not stacked spheres.
function loft(m:CentralModel,at:Point,rings:Ring[],material:CentralMaterial,role:string,segments=24){
 const vertices:number[]=[],faces:number[]=[];
 // Smooth only the large masses: preserve crisp small carved ridges and a modest budget.
 const sections:Ring[]=[];
 for(let i=0;i<rings.length-1;i++){
  sections.push(rings[i]);
  if(segments>=20){const a=rings[Math.max(0,i-1)],b=rings[i],c=rings[i+1],d=rings[Math.min(rings.length-1,i+2)];
   sections.push(b.map((v,k)=>k===0?(v+c[k])/2:Math.max(k>2?.001:-Infinity,(-a[k]+9*v+9*c[k]-d[k])/16)) as Ring);}
 }
 sections.push(rings[rings.length-1]);
 sections.forEach(([y,x,z,rx,rz],row)=>{for(let j=0;j<=segments;j++){const a=j*2*Math.PI/segments,relief=1+.012*Math.cos(a*4)+.003*Math.sin(a*7+row*.6);vertices.push(x+rx*Math.cos(a)*relief,y,z+rz*Math.sin(a)*relief);if(row&&j){const b=row*(segments+1)+j;faces.push(b,b-segments-2,b-1,b,b-segments-1,b-segments-2);}}});
 surface(m,at,vertices,faces,material,role);
}
function tube(m:CentralModel,at:Point,points:Point[],radius:number,material:CentralMaterial,role:string,samples=12,sides=8){
 const curve=new CatmullRomCurve3(points.map(p=>new Vector3(...p))),vertices:number[]=[],faces:number[]=[];
 for(let i=0;i<=samples;i++){const t=i/samples,p=curve.getPoint(t),v=curve.getTangent(t),ref=Math.abs(v.y)>.9?new Vector3(1,0,0):new Vector3(0,1,0),a=ref.cross(v).normalize(),b=v.clone().cross(a).normalize(),r=radius*(.85+.15*Math.sin(t*Math.PI));
  for(let j=0;j<=sides;j++){const angle=j*2*Math.PI/sides,q=p.clone().addScaledVector(a,Math.cos(angle)*r).addScaledVector(b,Math.sin(angle)*r);vertices.push(q.x,q.y,q.z);if(i&&j){const k=i*(sides+1)+j;faces.push(k,k-1,k-sides-2,k,k-sides-2,k-sides-1);}}
 }
 surface(m,at,vertices,faces,material,role);
}
function bead(m:CentralModel,at:Point,rx:number,h:number,material:CentralMaterial,role:string){
 loft(m,at,[[0,0,0,.01,.01],[h*.18,0,0,rx*.75,rx*.6],[h*.5,0,0,rx,rx*.75],[h*.82,0,0,rx*.75,rx*.6],[h,0,0,.005,.005]],material,role,12);
}
function curl(m:CentralModel,at:Point,r:number,material:CentralMaterial,role:string){
 const points:Point[]=Array.from({length:15},(_,i)=>{const a=i/14*Math.PI*2.7,rad=r*(1-i/19);return [Math.cos(a)*rad,Math.sin(a)*rad,.025+i*.002];});
 tube(m,at,points,r*.22,material,role,14,6);
}
function band(m:CentralModel,at:Point,rx:number,rz:number,y:number,material:CentralMaterial,role:string,radius=.025){
 const points:Point[]=Array.from({length:25},(_,i)=>{const a=i*Math.PI/12;return [Math.cos(a)*rx,y,Math.sin(a)*rz];});tube(m,at,points,radius,material,role,24,6);
}
export function buildCarvedMuseumLion(m:CentralModel,x:number,y=.95,z=1.62){
 const r=lionRole,stone:CentralMaterial="guardianStone",at:Point=[x,y,z];
 // Reference: broad hanging belly, heavy shoulders, seated rear mass and thick short legs.
 loft(m,at,[[.18,0,-.12,.05,.05],[.36,0,-.12,.39,.43],[.6,0,-.06,.53,.55],[.88,0,.03,.57,.56],[1.13,0,.09,.52,.46],[1.37,0,.15,.4,.36],[1.48,0,.18,.23,.27],[1.52,0,.18,.01,.01]],stone,r+"-body");
 loft(m,[x,y+.45,z+.41],[[0,0,0,.02,.02],[.14,0,0,.36,.22],[.4,0,0,.47,.28],[.66,0,-.05,.43,.24],[.89,0,-.1,.25,.18],[1,0,-.1,.01,.01]],stone,r+"-chest");
 for(const side of [-1,1]){
  loft(m,[x+side*.37,y+.05,z-.37],[[0,0,0,.04,.04],[.13,0,0,.27,.35],[.37,0,-.05,.31,.39],[.65,0,-.04,.28,.36],[.81,0,-.02,.15,.24],[.87,0,0,.01,.01]],stone,r+"-rear-haunch");
  for(const rear of [false,true]){const px=x+side*.33,pz=z+(rear?-.37:.45),h=rear?.42:.98;
   loft(m,[px,y+.07,pz],[[0,0,0,.18,.2],[.12,0,0,.19,.2],[h*.5,0,-.025,.17,.2],[h*.84,0,-.04,.21,.23],[h,0,-.08,.22,.24]],stone,r+"-leg",20);
   loft(m,[px,y,pz+.13],[[0,0,0,.2,.29],[.06,0,0,.23,.3],[.16,0,-.035,.215,.26],[.23,0,-.09,.14,.18],[.25,0,-.12,.01,.01]],stone,r+"-paw",20);
   for(let j=0;j<4;j++)loft(m,[px+(j-1.5)*.105,y+.015,pz+.32],[[0,0,0,.051,.1],[.035,0,0,.057,.14],[.11,0,-.02,.05,.115],[.16,0,-.05,.025,.06],[.17,0,-.05,.001,.001]],stone,r+"-toe",12);
   for(const h of [.19,.36,.55])if(h<(rear?.4:1))band(m,[px,y,pz],.183,.213,h,stone,r+"-leg-carved-band",.011);
  }
  for(let j=0;j<3;j++)tube(m,at,[[side*(.22+j*.105),.04,.77],[side*(.22+j*.105),.09,.81],[side*(.22+j*.105),.14,.76]],.009,"museumRelief",r+"-paw-groove",6,5);
  // Shoulder rosette is visible in both close photographs.
  curl(m,[x+side*.46,y+1.02,z+.36],.105,stone,r+"-shoulder-rosette");
  tube(m,at,[[side*.38,.85,.58],[side*.4,.64,.58],[side*.34,.44,.6]],.035,stone,r+"-shoulder-border");
 }
 // Shallow pectoral/abdominal planes join the chest instead of a single balloon silhouette.
 for(const side of [-1,1]){
  tube(m,at,[[side*.12,1.37,.59],[side*.29,1.15,.67],[side*.34,.92,.66],[side*.2,.76,.6]],.044,stone,r+"-pectoral-ridge",18,8);
  tube(m,at,[[side*.11,.78,.62],[side*.22,.65,.57],[side*.27,.51,.48]],.023,stone,r+"-belly-plane",14,8);
 }
 // Broad head shell opens around a deep dark jaw instead of a painted black rectangle.
 loft(m,[x,y+1.31,z+.4],[[0,0,0,.17,.21],[.12,0,0,.35,.32],[.32,0,0,.45,.35],[.53,0,0,.46,.35],[.68,0,0,.39,.31],[.78,0,0,.19,.2],[.8,0,0,.01,.01]],stone,r+"-head",28);
 // Recess the underlying head mass too, so it cannot protrude through the throat at oblique views.
 const head=m.profiles[m.profiles.length-1].sculptedSurface!;
 for(let i=0;i<head.positions.length;i+=3){const q=(head.positions[i]/.38)**2+((head.positions[i+1]+1.31-1.635)/.24)**2;if(q<1&&head.positions[i+2]>0)head.positions[i+2]-=.28*(1-q);}
 // Recessed bowl: opening, tapering inner walls and rear throat, not a flat dark decal.
 const cavity:number[]=[],cavityFaces:number[]=[];
 for(let row=0;row<5;row++)for(let j=0;j<=32;j++){
  const a=j*Math.PI/16,t=row/4,rx=.365*(1-t*.93),ry=.225*(1-t*.92);
  cavity.push(rx*Math.cos(a),1.635+ry*Math.sin(a),1.065-t*.34);
  if(row&&j){const k=row*33+j;cavityFaces.push(k,k-1,k-34,k,k-34,k-33);}
 }
 const throat=cavity.length/3;cavity.push(0,1.635,.725);for(let j=0;j<32;j++)cavityFaces.push(throat,132+j,133+j);
 surface(m,at,cavity,cavityFaces,"recess",r+"-open-mouth");
 tube(m,at,[[-.36,1.65,1.06],[-.29,1.49,1.08],[0,1.43,1.105],[.29,1.49,1.08],[.36,1.65,1.06]],.041,stone,r+"-mouth-rim",24,10);
 // Extruded upper jaw/lower lip have real depth, broad flattened edges and corner cheeks.
 loft(m,[x,y+1.78,z+.92],[[0,0,0,.3,.12],[.05,0,0,.41,.17],[.13,0,-.02,.38,.19],[.21,0,-.065,.24,.16],[.25,0,-.09,.01,.01]],stone,r+"-upper-jaw",28);
 loft(m,[x,y+1.29,z+.9],[[0,0,0,.16,.11],[.055,0,0,.36,.15],[.12,0,0,.39,.17],[.185,0,0,.32,.15],[.21,0,-.05,.01,.01]],stone,r+"-lower-jaw",28);
 tube(m,at,[[-.33,1.47,1.065],[-.17,1.435,1.087],[0,1.425,1.095],[.17,1.435,1.087],[.33,1.47,1.065]],.031,stone,r+"-lower-lip",20);
 loft(m,[x,y+1.89,z+.91],[[0,0,0,.12,.08],[.06,0,.04,.2,.13],[.12,0,.01,.16,.1],[.14,0,-.03,.03,.02]],stone,r+"-broad-nose",20);
 for(const side of [-1,1]){
  bead(m,[x+side*.09,y+1.9,z+1.024],.04,.035,"recess",r+"-nostril");
  loft(m,[x+side*.23,y+1.945,z+.865],[[0,0,0,.055,.035],[.04,0,0,.17,.105],[.13,0,0,.18,.12],[.21,0,-.02,.1,.06],[.23,0,0,.005,.005]],"museumRelief",r+"-eye-socket",20);
  loft(m,[x+side*.22,y+1.97,z+.90],[[0,0,0,.08,.07],[.045,0,0,.14,.12],[.12,0,0,.12,.1],[.17,0,-.015,.02,.02]],"stone",r+"-bulging-eye",20);
  bead(m,[x+side*.22,y+2.03,z+1.015],.037,.035,"museumRelief",r+"-eye-centre");
  tube(m,at,[[side*.07,2.105,.96],[side*.22,2.16,.95],[side*.37,2.09,.86]],.045,stone,r+"-heavy-brow");
  // Curled elongated ears wrap the cheeks; the reference does not have pointed cat ears.
  tube(m,at,[[side*.37,1.51,.71],[side*.51,1.74,.72],[side*.56,1.98,.58],[side*.51,2.07,.51],[side*.43,2.01,.52],[side*.42,1.87,.64]],.07,stone,r+"-curled-ear",24,10);
  curl(m,[x+side*.47,y+1.99,z+.61],.11,stone,r+"-ear-scroll");
  for(let j=0;j<5;j++)curl(m,[x+side*(.35+.025*Math.sin(j*1.7)),y+1.49+j*.082,z+.78+.025*Math.cos(j)],.05+.007*Math.sin(j),stone,r+"-cheek-scroll");
  loft(m,[x+side*.34,y+1.65,z+.69],[[0,0,0,.04,.035],[.08,0,0,.135,.13],[.22,0,-.025,.145,.135],[.36,0,-.07,.1,.08],[.4,0,-.08,.005,.005]],stone,r+"-cheek-plane",20);
  tube(m,at,[[side*.16,1.91,1.04],[side*.29,1.89,1.035],[side*.37,1.8,.97]],.025,stone,r+"-muzzle-fold",14,8);
  loft(m,[x+side*.28,y+1.48,z+.89],[[0,0,0,.05,.04],[.14,0,-.07,.12,.1],[.33,0,-.13,.1,.11],[.39,0,-.16,.005,.005]],stone,r+"-jaw-corner");
  loft(m,[x+side*.28,y+1.5,z+1.015],[[0,side*.03,.025,.005,.005],[.06,side*.015,.025,.018,.02],[.15,0,.005,.032,.037],[.24,0,-.018,.043,.055],[.28,0,-.05,.02,.025]],stone,r+"-large-fang",16);
 }
 for(let j=0;j<7;j++){const h=.07+.02*Math.cos(j*1.3);profile(m,x+(j-3)*.064,y+1.79-h,z+1.065,[[0,0],[.014,.012],[.025,h*.7],[.023,h]],stone,r+"-upper-teeth",10);}
 for(let j=0;j<5;j++)profile(m,x+(j-2)*.075,y+1.455,z+1.065,[[.025,0],[.023,.04],[.013,.061],[0,.069]],stone,r+"-lower-teeth",10);
 bead(m,[x,y+1.43,z+.99],.14,.055,stone,r+"-tongue");
 // Layered mane tiles wrap the back/sides of the head and descend onto the neck.
 for(let row=0;row<6;row++)for(let j=0;j<9;j++){
  const a=.05+(j+(row%2)*.32)*Math.PI/8,rx=.42+row*.011,rz=.34+row*.015;
  loft(m,[x+Math.cos(a)*rx,y+1.81-row*.125+.014*Math.sin(j*2+row),z+.13-Math.sin(a)*rz],[[0,0,0,.018,.018],[.035,0,0,.076,.06],[.12,0,-.025,.075,.055],[.17,0,-.05,.045,.025],[.18,0,-.05,.001,.001]],stone,r+"-layered-mane",12);
 }
 for(const side of [-1,1])for(let row=0;row<5;row++)curl(m,[x+side*(.45+row*.009),y+1.3-row*.11,z+.18],.065,stone,r+"-neck-scroll");
 tube(m,at,[[-.43,1.34,.46],[-.28,1.24,.64],[0,1.17,.71],[.28,1.24,.64],[.43,1.34,.46]],.04,stone,r+"-necklace",24);
 for(let j=0;j<15;j++){const a=-1.15+j*2.3/14;bead(m,[x+Math.sin(a)*.44,y+1.11+.12*Math.abs(Math.sin(a)),z+.66*Math.cos(a)],.042,.07,stone,r+"-necklace-bead");}
 profile(m,x,y+2.075,z+.36,[[0,0],[.18,0],[.18,.045],[.11,.1],[.12,.15],[.065,.22],[0,.28]],stone,r+"-forehead-top-ornament",20);
 for(let j=0;j<8;j++)curl(m,[x+(j-3.5)*.07,y+2.085,z+.72],.045,stone,r+"-forehead-carving");
 tube(m,at,[[.36,.22,-.57],[.5,.4,-.7],[.48,.61,-.75],[.35,.7,-.68]],.07,stone,r+"-tail");
}
export function buildCarvedMuseumRelief(m:CentralModel,x:number,y=.72,z=.92,turnedPose=false){
 const r=figureRole,stone:CentralMaterial="museumRelief",at:Point=[x,y,z];
 const arch:[number,number][]=[[-.52,0],[-.54,1.64],[-.47,1.94],[-.31,2.2],[0,2.46],[.31,2.2],[.47,1.94],[.54,1.64],[.52,0]];
 shape(m,x,y,z-.3,arch,.28,stone,r+"-relief-backing");
 shape(m,x,y+.08,z+.005,arch.map(([a,b])=>[a*.84,b*.9]),.035,"recess",r+"-recessed-field");
 const border:Point[]=[[-.49,.05,.075],[-.5,1.59,.075],[-.42,1.91,.075],[-.28,2.15,.075],[0,2.38,.075],[.28,2.15,.075],[.42,1.91,.075],[.5,1.59,.075],[.49,.05,.075]];
 tube(m,at,border,.049,stone,r+"-pointed-border",40);
 tube(m,at,border.map(([a,b,c])=>[a*.91,b*.94,c+.028]),.024,stone,r+"-inner-border",40,6);
 for(const side of [-1,1])for(let j=0;j<14;j++){const h=.28+j*.135,px=side*(h<1.6?.495:.495-(h-1.6)*.52);curl(m,[x+px,y+h,z+.12],.031,stone,r+"-border-scroll");}
 // Main figure has a broad torso, spread/bent legs and four visible arms as in the close view.
 loft(m,[x,y+.73,z+.18],[[0,0,0,.16,.08],[.14,0,0,.145,.1],[.34,0,0,.17,.11],[.55,0,0,.27,.115],[.69,0,-.02,.22,.1],[.75,0,0,.08,.065]],stone,r+"-central-figure",24);
 loft(m,[x,y+1.51,z+.2],[[0,0,0,.075,.07],[.045,0,.015,.115,.095],[.14,0,.025,.155,.12],[.23,0,.015,.14,.11],[.28,0,.01,.115,.08],[.31,0,0,.01,.01]],stone,r+"-head",24);
 loft(m,[x,y+1.56,z+.305],[[0,0,0,.05,.025],[.05,0,0,.11,.06],[.15,0,-.01,.12,.065],[.23,0,-.02,.06,.025]],stone,r+"-face",20);
 tube(m,at,[[0,1.71,.387],[0,1.64,.416],[.04,1.62,.39]],.025,stone,r+"-nose",8);
 for(const side of [-1,1]){
  tube(m,at,[[side*.035,1.71,.38],[side*.07,1.725,.385],[side*.108,1.71,.374]],.011,"museumRelief",r+"-eye",8,6);
  tube(m,at,[[side*.035,1.77,.37],[side*.09,1.78,.36],[side*.13,1.73,.34]],.021,stone,r+"-brow",8,6);
  curl(m,[x+side*.18,y+1.61,z+.23],.049,stone,r+"-ear-jewelry");
  tube(m,at,[[side*.2,1.37,.2],[side*.35,1.56,.19],[side*.39,1.82,.2]],.065,stone,r+"-upper-arm",20);
  tube(m,at,[[side*.23,1.24,.21],[side*.37,turnedPose?1.17:1.06,.26],[side*(turnedPose?.27:.4),turnedPose?1.36:1.24,.33]],.058,stone,r+"-lower-arm",18);
  bead(m,[x+side*.39,y+1.8,z+.2],.073,.14,stone,r+"-upper-hand");
  bead(m,[x+side*(turnedPose?.27:.4),y+(turnedPose?1.34:1.22),z+.33],.068,.12,stone,r+"-lower-hand");
  for(let j=0;j<3;j++)tube(m,at,[[side*(.36+j*.028),1.84,.255],[side*(.35+j*.029),1.94,.25]],.013,stone,r+"-finger",4,5);
  const lifted=turnedPose&&side>0;
  tube(m,at,[[side*.13,.82,.2],[side*(lifted?.34:.29),lifted?.72:.59,.24],[side*(lifted?.31:.2),lifted?.57:.4,.28]],.08,stone,r+"-bent-leg",20);
  loft(m,[x+side*(lifted?.31:.2),y+(lifted?.53:.36),z+.32],[[0,0,0,.085,.13],[.045,0,.03,.11,.14],[.1,0,0,.06,.09],[.12,0,-.03,.001,.001]],stone,r+"-foot",16);
  tube(m,at,[[side*.04,.92,.325],[side*.18,.84,.32],[side*.1,.72,.31],[side*.16,.51,.31]],.025,stone,r+"-garment-fold",14,6);
  band(m,[x,y,z+.19],.165,.12,.92,stone,r+"-waist-jewelry");
 }
 for(const side of [-1,1]){
  loft(m,[x+side*.1,y+1.12,z+.26],[[0,0,0,.025,.02],[.1,0,.015,.085,.055],[.22,side*.015,.01,.09,.065],[.29,0,0,.04,.035],[.32,0,0,.002,.002]],stone,r+"-torso-plane",20);
  tube(m,at,[[side*.11,1.49,.29],[side*.23,1.4,.31],[side*.27,1.29,.3]],.031,stone,r+"-shoulder-contour",12,8);
  for(let j=0;j<3;j++)tube(m,at,[[side*(.37+j*.022),1.25,.374],[side*(.36+j*.023),1.29,.39]],.009,stone,r+"-lower-hand-finger",5,5);
  loft(m,[x+side*.12,y+.62,z+.22],[[0,0,0,.02,.025],[.075,side*.04,.015,.075,.065],[.16,side*.025,.025,.09,.07],[.28,0,.015,.065,.06],[.34,0,0,.01,.01]],stone,r+"-draped-hip",20);
  tube(m,at,[[side*.025,.98,.315],[side*.07,.81,.335],[side*.21,.63,.335]],.018,stone,r+"-cloth-relief",16,6);
 }
 tube(m,at,[[-.075,1.6,.37],[0,1.584,.39],[.075,1.6,.37]],.013,stone,r+"-carved-lip",10,6);
 // Only coarse observed held-object silhouettes, without assigning their religious meaning.
 tube(m,at,[[.4,1.26,.36],[.41,1.53,.35]],.02,stone,r+"-held-shaft",8,6);
 profile(m,x+.41,y+1.52,z+.35,[[.025,0],[.048,.06],[.025,.16],[0,.18]],stone,r+"-held-terminal",12);
 for(const h of [1.84,1.91,1.98])profile(m,x,y+h,z+.2,[[0,0],[.17,0],[.17,.05],[.13,.09],[0,.095]],stone,r+"-crown-tier",20);
 for(const side of [-1,0,1])profile(m,x+side*.115,y+2.01,z+.2,[[.035,0],[.05,.06],[.023,.15],[0,.22]],stone,r+"-crown-point",12);
 tube(m,at,[[-.18,1.36,.33],[-.1,1.16,.35],[0,1.08,.35],[.1,1.16,.35],[.18,1.36,.33]],.026,stone,r+"-chest-necklace",20,6);
 for(let j=0;j<9;j++)bead(m,[x+(j-4)*.037,y+1.08+.035*Math.abs(j-4),z+.37],.018,.034,stone,r+"-jewelry-bead");
 // Lower reclining human form under the spread feet: not a blank strip beneath a mannequin.
 tube(m,at,[[-.39,.19,.2],[-.21,.14,.25],[0,.19,.28],[.24,.15,.26],[.4,.21,.2]],.105,stone,r+"-lower-reclining-body",24,12);
 loft(m,[x,y+.16,z+.32],[[0,0,0,.09,.05],[.065,0,.02,.13,.075],[.18,0,0,.11,.07],[.23,0,-.02,.01,.01]],stone,r+"-lower-figure-head",20);
 for(const side of [-1,1])tube(m,at,[[side*.13,.24,.31],[side*.27,.29,.3],[side*.39,.34,.22]],.045,stone,r+"-lower-reclining-arm",14);
 for(let j=0;j<11;j++)curl(m,[x+(j-5)*.082,y+.055,z+.29],.035,stone,r+"-lower-carved-course");
 // Add carved horizontal pedestal courses without altering its placement or collision envelope.
 for(const h of [.18,.42,.61])box(m,x,y-.72+h,z+.5,1.03,.08,.08,"stone",r+"-base-recessed-band");
 for(let j=0;j<12;j++)curl(m,[x+(j-5.5)*.081,y-.27,z+.48],.034,stone,r+"-pedestal-carved-band");
}
