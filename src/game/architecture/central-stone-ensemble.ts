import {frozenArchitectureAnchors} from "../../data/reconstruction/architecture/specifications.ts";
import {carvedLoft,carvedCurve,stairGuardian,mallaFigure} from "./ensemble-sculptures.ts";
import type {CentralModel,CentralMaterial} from "./central-model.ts";
import {box,profile,shape} from "./remaining-models.ts";
import editorFrames from "./central-ensemble-editor-frames.json" with {type:"json"};
const stone:CentralMaterial="heritageStone",shade:CentralMaterial="heritageStoneShade",metal:CentralMaterial="ensembleBronze";
export const centralEnsembleIds=["vatsala-durga","large-bell","malla-column","vatsala-bell"] as const;
export const centralEnsembleVisualCorrections={
 "large-bell":{oldPosition:[-14.082263006873802,5.484746931956687],newPosition:[-12.9,3.0],oldYaw:0,newYaw:0,classification:"VISUAL_CORRECTION_APPROXIMATE",evidence:"Phase 6C central-forecourt: no identifiable bell footprint, 6m qualitative allowance; spatial audit places roofed bell northwest of Vatsala. Both front photographs and opposed side view separate its masonry platform on the northern/left flank. The north/east render offset separates the enlarged bell platform from the temple and retained column without moving the source point; its ~2.75m displacement is a working interpretation, not a photo measurement."},
 "vatsala-bell":{oldPosition:[-13.993626212805736,9.258540586377714],newPosition:[-13.993626212805736,10.2],oldYaw:0,newYaw:-Math.PI/2,classification:"PHOTO_INFERRED",evidence:"Phase 6C small bell has no traced footprint; western/southwestern terrace relation is approximate. All supplied front/side photos show the arch opening toward the western plaza/stair facade, not along the north/south axis. The frame is moved ~0.94m outboard/south in the visual layer so its near post no longer masks the photographed right stair guardian; the untraced source centre remains unchanged."},
 "malla-column":{oldPosition:[-16.370175677944573,4.531584033885247],newPosition:[-17.5,3.2],oldYaw:0,newYaw:0,classification:"PHOTO_INFERRED",evidence:"APPROXIMATE visual correction: retain the Digital Himalaya icon association/west-of-temple relationship; shift the rendered footing ~1.75m west/north from the previous interpretation, outside the enlarged bell terrace and off its pier axis. The new bell-detail and both front photographs show an independent foreground column. This is within the existing 4m qualitative allowance, not a surveyed footing correction."}
} as const;
export const centralEnsembleEvidence={classification:"PHOTO_INFERRED",dimensions:"APPROXIMATE",references:["reference/vatsala-area/large-bell-detail-reference.jpg","reference/vatsala-area/vatsala-front-composition-reference.png","reference/vatsala-area/malla-column-detail-reference.png","reference/vatsala-area/vatsala-front-reference.jpg","reference/vatsala-area/vatsala-side-reference.jpg"],spatial:"Phase 6C source coordinates unchanged; documented approximate bell/column render corrections and the west-facing small-arch yaw are applied here; the new two-pier photograph overrides the earlier four-support form interpretation",stairs:"West-facing entrance, stair facade, guardians and tower niche reconciled using all supplied views; no metre dimensions inferred from a single photo"};
function fresh(source:CentralModel):CentralModel{
 return {...source,editorPartSources:editorFrames[source.id as keyof typeof editorFrames],boxes:[],profiles:[],shapes:[],roofs:[],colliders:[],volumes:[],polygonRoofs:[]} as CentralModel;
}
function course(m:CentralModel,y:number,h:number,w:number,d:number,role:string,slot=false){
 // Three solids leave the west stair channel genuinely open, including in the collision model.
 const cut=-2.05,half=1.12;
 if(slot){for(const sign of [-1,1])box(m,0,y,sign*(d/2+half)/2,w,h,d/2-half,stone,role,true);box(m,(cut+w/2)/2,y,0,w/2-cut,h,half*2,stone,role,true);}
 else box(m,0,y,0,w,h,d,stone,role,true);
}
function moulding(m:CentralModel,y:number,width:number,depth:number,role:string){
 for(const [dy,h,p]of [[0,.08,0],[.095,.11,.1],[.205,.14,.16]] as const)box(m,0,y+dy,0,width+p,h,depth+p,stone,role);
}
function mouldingAt(m:CentralModel,x:number,y:number,z:number,width:number,role:string){box(m,x,y,z,width,.16,width,stone,role);box(m,x,y+.11,z,width*.92,.08,width*.92,stone,role);}
function facePoint(x:number,z:number,yaw:number):[number,number]{return [x*Math.cos(yaw)+z*Math.sin(yaw),-x*Math.sin(yaw)+z*Math.cos(yaw)];}
function niche(m:CentralModel,x:number,y:number,z:number,w:number,h:number,role:string,yaw=0,relief=true){
 const outer:[number,number][]=[[-w*.63,0],[-w*.63,h*.68],[-w*.45,h*.81],[0,h],[w*.45,h*.81],[w*.63,h*.68],[w*.63,0],[w*.4,0],[w*.4,h*.61],[0,h*.79],[-w*.4,h*.61],[-w*.4,0]];
 shape(m,x,y,z,outer,.14,stone,role+"-framed-niche",yaw);
 const [dx,dz]=facePoint(0,-.025,yaw);shape(m,x+dx,y,z+dz,[[-w*.4,0],[-w*.4,h*.61],[0,h*.79],[w*.4,h*.61],[w*.4,0]],.025,"recess",role+"-niche-recess",yaw);
 const [fx,fz]=facePoint(0,.035,yaw);if(relief)profile(m,x+fx,y+.08,z+fz,[[0,0],[w*.17,0],[w*.18,h*.2],[w*.11,h*.44],[w*.14,h*.53],[0,h*.64]],stone,role+"-niche-relief",12);
}
function miniatureTower(m:CentralModel,x:number,y:number,z:number){
 box(m,x,y+.11,z,.92,.22,.92,shade,"vatsala-subsidiary-spire-base");
 for(const sx of [-1,1])for(const sz of [-1,1])profile(m,x+sx*.28,y+.22,z+sz*.28,[[.11,0],[.12,.08],[.065,.13],[.065,.62],[.13,.7],[0,.73]],stone,"vatsala-subsidiary-spire-columns",12);
 for(const face of [0,Math.PI/2,Math.PI,Math.PI*1.5]){const [dx,dz]=facePoint(0,.24,face);niche(m,x+dx,y+.25,z+dz,.29,.62,"vatsala-subsidiary-spire",face);}
 for(const [dy,w]of [[.94,1.03],[1.08,1.08],[1.23,.94]] as const)box(m,x,y+dy,z,w,.15,w,stone,"vatsala-subsidiary-spire-cornice");
 profile(m,x,y+1.3,z,[[0,0],[.57,0],[.58,.09],[.48,.17],[.49,.27],[.4,.35],[.42,.45],[.34,.55],[.35,.64],[.26,.75],[.28,.84],[.18,.96],[.2,1.04],[.09,1.16],[0,1.21]],stone,"vatsala-subsidiary-spire-crown",8);
 for(const h of [.2,.47,.73])profile(m,x,y+1.3+h,z,[[.5-h*.3,0],[.53-h*.3,.05],[.5-h*.3,.1]],shade,"vatsala-subsidiary-spire-stepped-course",8);
 profile(m,x,y+2.48,z,[[.1,0],[.14,.07],[.065,.19],[0,.31]],metal,"vatsala-subsidiary-spire-finial",16);
}
function temple(m:CentralModel){
 const base=3.1;
 // Three setbacks, each with a differently weighted foot, ashlar field and coping.
 for(let tier=0;tier<3;tier++){
  const y=tier*.84,w=5.8-tier*.42,d=6.05-tier*.42;
  for(const [dy,h,projection]of [[0,.14,0],[.14,.13,-.09],[.27,.4,-.17],[.67,.1,-.1],[.77,.07,.035]] as const)course(m,y+dy+h/2,h,w+projection,d+projection,"vatsala-stepped-base-course",true);
 }
 course(m,2.63,.22,4.7,4.85,"vatsala-platform-neck",true);course(m,2.86,.24,4.82,4.97,"vatsala-platform-coping",true);course(m,3.04,.12,4.7,4.85,"vatsala-platform-landing",true);
 const stairCourses=[...Array.from({length:4},(_,i)=>({x:-6.1+i*.23,top:(i+1)*.17,width:2.55})),...Array.from({length:12},(_,i)=>({x:-4.68+i*.23,top:.68+(i+1)*(base-.68)/12,width:2.05}))];
 for(const {x,top,width}of stairCourses){box(m,x,top/2,0,.245,top,width,stone,"vatsala-west-access-stair",true);box(m,x-.007,top-.025,0,.26,.05,width+.05,stone,"vatsala-west-stair-nosing");for(const side of [-1,1])box(m,x,top/2,side*(width/2+.11),.24,top,.15,shade,"vatsala-west-stair-cheek",true);}
 box(m,-5.04,.34,0,.5,.68,2.6,stone,"vatsala-west-stair-intermediate-landing",true);
 box(m,-2.12,base-.065,0,.72,.13,2.1,stone,"vatsala-west-stair-landing",true);
 box(m,0,base+1.62,0,2.34,3.24,2.34,shade,"vatsala-sanctum",true);
 const columns:[number,number][]=[];for(const x of [-1.82,1.82])for(const z of [-1.65,-.55,.55,1.65])columns.push([x,z]);for(const z of [-1.82,1.82])for(const x of [-.6,.6])columns.push([x,z]);
 for(const [x,z]of columns){
  box(m,x,base+.1,z,.48,.2,.48,shade,"vatsala-column-foot");
  profile(m,x,base+.2,z,[[.23,0],[.27,.12],[.23,.2],[.17,.32],[.16,2.22],[.21,2.35],[.28,2.45],[.3,2.55],[.24,2.65],[0,2.7]],stone,"vatsala-twelve-column",16);
  box(m,x,base+2.98,z,.5,.26,.5,stone,"vatsala-column-abacus");box(m,x,base+1.6,z,.34,3.2,.34,stone,"vatsala-column-collision",true);
  for(const h of [.38,.51,2.45])profile(m,x,base+h,z,[[.18,0],[.2,.035],[.18,.07]],shade,"vatsala-column-carved-collar",16);
 }
 for(const face of [0,Math.PI/2,Math.PI,Math.PI*1.5]){
  for(const offset of [-1.1,0,1.1]){const [x,z]=facePoint(offset,1.82,face);shape(m,x,base+2.6,z,[[-.55,0],[-.55,.59],[.55,.59],[.55,0],[.46,.08],[.38,.15],[.28,.18],[.22,.28],[.1,.32],[0,.4],[-.1,.32],[-.22,.28],[-.28,.18],[-.38,.15],[-.46,.08]],.28,stone,"vatsala-columned-lobed-arch",face);}
 }
 niche(m,-1.2,base+.12,0,1.08,2.76,"vatsala-west-sanctum-door",-Math.PI/2,false);
 for(const side of [-1,1]){box(m,-1.33,base+1.33,side*.64,.19,2.52,.13,shade,"vatsala-doorway-carved-jamb");for(let i=0;i<10;i++)profile(m,-1.44,base+.3+i*.21,side*.64,[[0,0],[.045,.025],[.05,.07],[0,.1]],stone,"vatsala-doorway-band-relief",10);}
 box(m,-1.37,base+.08,0,.52,.16,1.3,stone,"vatsala-doorway-threshold",true);
 for(const side of [-1,1]){box(m,-3.28,.64,side*1.51,1.05,1.28,1.04,shade,"vatsala-stair-guardian-pedestal",true);mouldingAt(m,-3.28,1.26,side*1.51,1.12,"vatsala-stair-guardian-plinth");stairGuardian(m,-3.28,1.43,side*1.51);box(m,-3.28,2.16,side*1.51,.9,1.46,.76,shade,"vatsala-stair-guardian-collision",true);}
 for(const [y,w]of [[6.28,4.12],[6.54,4.46],[6.81,4.67],[7.08,4.38]] as const)moulding(m,y,w,w,"vatsala-colonnade-entablature");
 for(const face of [0,Math.PI/2,Math.PI,Math.PI*1.5])for(let i=0;i<19;i++){
  const [x,z]=facePoint((i-9)*.225,2.3,face);box(m,x,6.75,z,.09,.13,.12,shade,"vatsala-cornice-dentil",false,face);
  const [a,b]=facePoint((i-9)*.225,2.23,face);profile(m,a,7.01,b,[[0,0],[.065,.025],[.075,.08],[.045,.13],[0,.15]],stone,"vatsala-carved-rosette-band",10);
 }
 const y0=7.35,height=5.65;
 const radius=(t:number)=>2.13*(1-.57*t-.12*Math.sin(t*Math.PI*.9));
 const rings:[number,number][]=[[0,0]];for(let i=0;i<=20;i++){const t=i/20;rings.push([radius(t),height*t]);}rings.push([0,height]);profile(m,0,y0,0,rings,stone,"vatsala-main-shikhara",4);
 for(const t of [.06,.23,.42,.61,.79,.93]){const r=radius(t);profile(m,0,y0+height*t,0,[[r,0],[r+.022,.025],[r+.022,.055],[r,.08]],stone,"vatsala-shikhara-course-band",4);}
 for(const face of [0,Math.PI/2,Math.PI,Math.PI*1.5])for(const off of [-.72,.72]){
  const rings:[number,number,number,number,number][]=Array.from({length:17},(_,j)=>{const t=j/16,half=radius(t)/Math.SQRT2,[x,z]=facePoint(off*half,half,face),w=(off===0?.095:.06)*(1-.3*t);return [height*t,x,z,face%Math.PI===0?w:.055,face%Math.PI===0?.055:w];});
  carvedLoft(m,[0,y0,0],rings,shade,"vatsala-shikhara-major-ratha",0,10);
 }
 // Columned front niche with a lobed head and stepped cap, rather than a pointed generic aperture.
 box(m,-1.54,7.43,0,.5,.16,1.65,stone,"vatsala-shikhara-front-niche-base");
 shape(m,-1.56,7.5,0,[[-.52,0],[-.52,1.45],[0,1.7],[.52,1.45],[.52,0]],.025,"recess","vatsala-shikhara-front-niche-recess",-Math.PI/2);
 for(const side of [-1,1]){profile(m,-1.69,7.51,side*.61,[[.15,0],[.17,.1],[.11,.22],[.1,1.42],[.16,1.53],[.18,1.64],[0,1.7]],stone,"vatsala-shikhara-front-niche-column",16);box(m,-1.69,9.27,side*.61,.35,.2,.35,stone,"vatsala-shikhara-front-niche-capital");}
 shape(m,-1.75,8.74,0,[[-.68,0],[-.68,.59],[.68,.59],[.68,0],[.51,.09],[.39,.25],[.2,.31],[0,.43],[-.2,.31],[-.39,.25],[-.51,.09]],.18,stone,"vatsala-shikhara-front-framed-niche",-Math.PI/2);
 carvedLoft(m,[-1.68,7.61,0],[[0,0,0,.11,.07],[.23,0,0,.15,.09],[.55,0,0,.13,.09],[.79,0,0,.2,.1],[.91,0,0,.08,.07]],stone,"vatsala-shikhara-front-human-torso",-Math.PI/2,20);
 carvedLoft(m,[-1.7,8.51,0],[[0,0,0,.07,.06],[.07,0,0,.11,.09],[.22,0,0,.12,.09],[.3,0,0,.08,.07],[.32,0,0,.001,.001]],stone,"vatsala-shikhara-front-human-head",-Math.PI/2,20);
 for(const side of [-1,1]){carvedCurve(m,[-1.73,7.61,0],[[0,.76,side*.17],[-.04,.54,side*.25],[-.1,.44,side*.12]],.045,stone,"vatsala-shikhara-front-human-arm");carvedLoft(m,[-1.73,7.57,side*.075],[[0,0,0,.05,.07],[.2,0,0,.055,.07],[.36,0,0,.065,.075]],stone,"vatsala-shikhara-front-human-leg",-Math.PI/2,12);}
 for(const [h,w,d]of [[9.45,1.48,.3],[9.62,1.62,.34],[9.83,1.42,.28]] as const)box(m,-1.53,h,0,d,.13,w,stone,"vatsala-shikhara-front-niche-cornice");
 box(m,-.91,10.33,0,.28,.12,.54,shade,"vatsala-shikhara-upper-relief-console");
 carvedLoft(m,[-1.01,10.37,0],[[0,0,0,.12,.08],[.18,0,0,.15,.1],[.42,0,0,.13,.1],[.62,0,0,.19,.1],[.72,0,0,.07,.06]],shade,"vatsala-shikhara-upper-front-relief",-Math.PI/2,20);
 carvedLoft(m,[-1.02,11.07,0],[[0,0,0,.07,.06],[.08,0,0,.12,.09],[.23,0,0,.11,.09],[.3,0,0,.001,.001]],shade,"vatsala-shikhara-upper-relief-head",-Math.PI/2,20);
 for(const side of [-1,1])carvedCurve(m,[-1.07,10.37,0],[[0,.61,side*.16],[-.05,.41,side*.23],[-.13,.36,side*.12]],.045,shade,"vatsala-shikhara-upper-relief-arm");
 for(const side of [-1,1])shape(m,-1.25,9.92,side*.86,[[0,0],[side*.18,.1],[side*.3,.31],[side*.26,.57],[side*.39,.71],[side*.47,.67],[side*.4,.45],[side*.46,.25],[side*.35,.03],[side*.12,-.09]],.18,shade,"vatsala-shikhara-shoulder-carved-projection",-Math.PI/2);
 for(const x of [-1.48,1.48])for(const z of [-1.48,1.48])miniatureTower(m,x,y0,z);
 moulding(m,12.95,1.55,1.55,"vatsala-shikhara-crown-transition");
 profile(m,0,13.22,0,[[0,0],[.63,0],[.61,.18],[.53,.34],[.48,.48],[.46,.65],[.5,.72],[0,.78]],stone,"vatsala-pinnacle-stone-neck",32);
 for(let i=0;i<12;i++){const a=i*Math.PI/6;profile(m,Math.cos(a)*.52,13.35,Math.sin(a)*.52,[[0,0],[.07,.04],[.09,.2],[.06,.3],[0,.34]],shade,"vatsala-pinnacle-neck-carving",12);}
 profile(m,0,13.97,0,[[0,0],[.53,0],[.56,.08],[.39,.18],[.38,.27],[.46,.36],[.48,.47],[.43,.57],[.3,.65],[.25,.72],[.33,.81],[.36,.91],[.32,1.01],[.2,1.09],[.17,1.17],[.24,1.26],[.26,1.36],[.2,1.46],[.11,1.53],[.09,1.61],[.14,1.69],[.1,1.78],[0,1.9]],metal,"vatsala-pinnacle",32);
 profile(m,0,15.83,0,[[.05,0],[.09,.07],[.04,.22],[0,.31]],metal,"vatsala-finial",16);
}
function bellBody(m:CentralModel,y:number,r:number,height:number){
 const h=height;profile(m,0,y,0,[[r*.85,0],[r*1.07,.035*h],[r*1.09,.09*h],[r,.14*h],[r*.82,.28*h],[r*.62,.7*h],[r*.55,.86*h],[r*.3,.97*h],[.055,h],[.055,h*.88],[r*.45,h*.8],[r*.54,h*.4],[r*.8,h*.13],[r*.85,0]],"agedBellBronze",m.id==="large-bell"?"large-hollow-bell":"small-hollow-bell",32);
 for(const t of [.13,.3,.73])profile(m,0,y+h*t,0,[[r*(t<.4?.97:.62),0],[r*(t<.4?1.01:.65),.035],[r*(t<.4?.97:.62),.07]],metal,"bell-relief-ring",32);
 box(m,0,y+.05,0,.075,.4,.075,"agedBellBronze","bell-clapper");profile(m,0,y+h,0,[[.09,0],[.15,.08],[.12,.2],[.07,.24],[0,.25]],metal,"bell-crown-hanger",16);
}
export const bellTerraceDimensions={width:7.2,northEdge:.8,top:2.6,depthRange:[3.43,4.05],classification:"APPROXIMATE",connection:"Coursed south edge follows the northern Vatsala plinth setbacks; distinct coping and a narrow construction joint, no shared featureless slab"} as const;
function largeBell(m:CentralModel){
 const templeAnchor=frozenArchitectureAnchors.find(a=>a.id==="vatsala-durga")!.position!,front=bellTerraceDimensions.northEdge;
 // The new authoritative local photograph resolves TWO masonry blades, not four separate columns.
 // Each course butts against the temple's northern setback at the same elevation.
 const courses:{bottom:number;top:number;depth:number}[]=[];
 for(let tier=0;tier<3;tier++)for(const [dy,h,projection]of [[0,.14,0],[.14,.13,-.09],[.27,.4,-.17],[.67,.1,-.1],[.77,.07,.035]] as const)courses.push({bottom:tier*.84+dy,top:tier*.84+dy+h,depth:6.05-tier*.42+projection});
 courses.push({bottom:2.52,top:2.6,depth:4.85});
 for(const {bottom,top,depth:d}of courses){const south=templeAnchor[1]-d/2-.012,depth=south-front,z=(south+front)/2-m.origin[1];box(m,0,(bottom+top)/2,z,7.2,top-bottom,depth,"bellTerraceMasonry",top===2.6?"bell-terrace-coping":"bell-terrace-course",true);}
 for(const side of [-1,1]){
  const r=side<0?"bell-left-pier":"bell-right-pier",x=side*1.65;
  box(m,x,2.71,0,1.3,.22,1.7,"bellPierStone",r+"-foot");
  box(m,x,5.1,0,1.1,4.78,1.5,"bellPierStone",r+"-shaft",true);
  box(m,x,7.48,0,1.32,.2,1.72,"bellPierStone",r+"-capital");
 }
 box(m,0,7.72,0,4.9,.3,2.05,"carvedTimber","bell-head-beam");
 for(const x of [-1.65,1.65])for(const side of [-1,1])shape(m,x,7.16,side*.64,[[-.13,0],[-.38,.4],[-.57,.49],[-.52,.62],[.15,.62],[.15,0]],.28,"carvedTimber","bell-roof-bracket");
 m.roofs.push({position:[m.origin[0],7.9,m.origin[1]],width:6.45,depth:3.95,rise:.65,yaw:m.yaw,material:"roof",role:"large-bell-deep-tile-roof"});
 box(m,0,7.88,0,6.4,.15,3.9,"carvedTimber","bell-roof-collision",true);
 for(const side of [-1,1]){
  box(m,0,7.86,side*1.98,6.45,.15,.09,"shutter","bell-roof-dark-red-fascia");
  box(m,side*3.2,7.86,0,.09,.15,3.95,"shutter","bell-roof-end-fascia");
  for(let j=0;j<18;j++)box(m,(j-8.5)*.35,7.67,side*1.55,.085,.3,.76,"carvedTimber","bell-roof-exposed-rafters");
 }
 for(const side of [-1,1])for(const end of [-1,1])shape(m,side*3.08,7.9,end*1.87,[[0,0],[side*.23,.07],[side*.43,.35],[side*.34,.51],[side*.14,.2],[-side*.1,.1]],.12,"roof","bell-roof-swept-corner");
 bellBody(m,4.35,.96,2.2);box(m,0,7.13,0,.1,.72,.1,"agedBellBronze","bell-suspension");
 // No dedicated bell stair: access and the major stair hierarchy belong to Vatsala.
}
function smallBell(m:CentralModel){
 for(const [y,w,d,h]of [[.1,1.8,1.05,.2],[.3,1.68,.95,.2],[.44,1.82,1.08,.08]] as const)box(m,0,y,0,w,h,d,stone,"small-bell-platform-course",true);
 for(const side of [-1,1]){profile(m,side*.68,.48,0,[[.24,0],[.25,.15],[.18,.27],[.14,2.1],[.21,2.25],[.28,2.4],[0,2.45]],stone,"bell-arch-column",16);box(m,side*.68,1.7,0,.3,2.44,.36,stone,"bell-arch-column-collision",true);}
 shape(m,0,2.95,0,[[-1,0],[-1,.62],[-.7,.72],[-.37,.66],[0,.91],[.37,.66],[.7,.72],[1,.62],[1,0],[.48,0],[.36,.16],[0,.37],[-.36,.16],[-.48,0]],.38,stone,"bell-ornate-lobed-lintel");
 for(const x of [-.7,.7])profile(m,x,3.2,.4,[[0,0],[.13,.02],[.15,.1],[.08,.18],[0,.2]],shade,"bell-carved-rosette",12);
 profile(m,0,3.79,0,[[.18,0],[.23,.08],[.15,.18],[.13,.3],[0,.41]],stone,"bell-arch-central-crown",16);
 bellBody(m,1.55,.33,1.1);box(m,0,3.11,0,.05,.5,.05,metal,"bell-suspension");
}
function column(m:CentralModel){
 for(const [y,w,h]of [[.07,1.26,.14],[.2,1.17,.12],[.34,1.05,.16],[.45,1.2,.06]] as const)box(m,0,y,0,w,h,w,stone,"malla-plinth-course",true);
 profile(m,0,.48,0,[[0,0],[.44,0],[.45,.17],[.34,.29],[.3,.4],[.275,5.55],[.36,5.67],[.43,5.75],[0,5.77]],"bellPierStone","malla-shaft",20);box(m,0,3.26,0,.55,5.56,.55,stone,"malla-column-collision",true);
 // One fluted pot/lotus capital with a narrow neck, not a pile of spherical beads.
 carvedLoft(m,[0,6.08,0],[[0,0,0,.32,.32],[.1,0,0,.46,.46],[.22,0,0,.62,.62],[.38,0,0,.72,.72],[.61,0,0,.75,.75],[.8,0,0,.69,.69],[.93,0,0,.58,.58],[1.03,0,0,.47,.47],[1.12,0,0,.46,.46]],metal,"malla-lotus-capital",0,64,.025);
 for(const [h,r]of [[6.1,.4],[6.32,.64],[6.96,.67],[7.14,.49]] as const)profile(m,0,h,0,[[r,0],[r+.035,.035],[r+.035,.085],[r,.12]],metal,"malla-capital-ornamental-band",40);
 for(let i=0;i<14;i++){const a=i*Math.PI/7,c=Math.cos(a),s=Math.sin(a);
  carvedLoft(m,[c*.4,5.91,s*.4],[[0,0,0,.07,.07],[.07,0,0,.14,.13],[.17,0,0,.15,.14],[.28,0,0,.1,.1],[.31,0,0,.025,.025]],metal,"malla-lotus-support-petal",0,16);
  const points:[number,number,number][]=Array.from({length:13},(_,j)=>{const t=j/12*Math.PI*2;return [c*(.735+.016*Math.cos(t))-s*.09*Math.sin(t),.54+.1*Math.cos(t),s*(.735+.016*Math.cos(t))+c*.09*Math.sin(t)];});carvedCurve(m,[0,6.08,0],points,.014,metal,"malla-capital-carved-medallion",6);
 }
 profile(m,0,7.13,0,[[.48,0],[.56,.04],[.58,.1],[.5,.17],[0,.19]],metal,"malla-capital-upper-rim",32);
 box(m,0,7.3,0,1.18,.16,1.12,metal,"malla-royal-seat");
 for(const side of [-1,1]){shape(m,0,7.35,side*.45,[[-.51,0],[-.48,.2],[-.22,.15],[0,.24],[.22,.15],[.48,.2],[.51,0]],.07,metal,"malla-royal-seat-drapery");}
 mallaFigure(m,7.42);
 // Statue broadly faces palace/north as noted in Phase 6C; the pole is continuous to its seat.
 box(m,.4,8.5,.16,.025,2.26,.025,metal,"malla-parasol-stem");
 profile(m,.4,9.55,.16,[[0,0],[.31,0],[.32,.025],[.27,.07],[.22,.14],[.2,.25],[.14,.31],[.16,.36],[.09,.44],[.1,.48],[.035,.57],[0,.63]],metal,"malla-parasol",32);

}
/** Replaces the four assemblies, never overlays legacy geometry or modifies evidence anchors. */
export function refineCentralStoneEnsemble(source:CentralModel){
 if(!centralEnsembleIds.includes(source.id as typeof centralEnsembleIds[number]))return source;
 const m=fresh(source);
 if(m.id==="large-bell")m.origin=[...centralEnsembleVisualCorrections["large-bell"].newPosition];
 if(m.id==="malla-column")m.origin=[...centralEnsembleVisualCorrections["malla-column"].newPosition];
 if(m.id==="vatsala-bell"){m.origin=[...centralEnsembleVisualCorrections["vatsala-bell"].newPosition];m.yaw=centralEnsembleVisualCorrections["vatsala-bell"].newYaw;}
 if(m.id==="vatsala-durga")temple(m);else if(m.id==="large-bell")largeBell(m);else if(m.id==="vatsala-bell")smallBell(m);else column(m);return m;
}
