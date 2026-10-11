import type {GeographicPosition,Point,GeographicAnchor} from "./types.ts";

export const geographicFrame={origin:{latitude:27.67205,longitude:85.42856},datum:"WGS84",accuracyClass:"APPROXIMATE",sourceReferences:["chyasilin-wikidata"],method:"Local equirectangular tangent approximation, X east / Z south, WGS84 ellipsoid radii evaluated at fixed origin. Suitable for ~200 m site; no altitude/survey accuracy."} as const;
const radians=Math.PI/180,phi=geographicFrame.origin.latitude*radians;
const a=6378137,e2=6.69437999014e-3,d=1-e2*Math.sin(phi)**2;
const eastMetresPerDegree=a/Math.sqrt(d)*Math.cos(phi)*radians;
const northMetresPerDegree=a*(1-e2)/d**1.5*radians;
export function validateGeographic(p:GeographicPosition){if(!Number.isFinite(p.latitude)||!Number.isFinite(p.longitude)||Math.abs(p.latitude)>90||Math.abs(p.longitude)>180)throw new Error("Invalid WGS84 coordinate");}
export function geographicToLocal(p:GeographicPosition):Point{validateGeographic(p);return [(p.longitude-geographicFrame.origin.longitude)*eastMetresPerDegree,-(p.latitude-geographicFrame.origin.latitude)*northMetresPerDegree];}
export function localToGeographic([x,z]:Point):GeographicPosition{if(!Number.isFinite(x)||!Number.isFinite(z))throw new Error("Invalid local point");const p={latitude:geographicFrame.origin.latitude-z/northMetresPerDegree,longitude:geographicFrame.origin.longitude+x/eastMetresPerDegree};validateGeographic(p);return p;}
export type FitMode="TRANSLATION"|"RIGID"|"SIMILARITY";
export interface SimilarityFit {mode:FitMode;real:number;imaginary:number;translation:Point;scale:number;rotationDegrees:number;anchorIds:string[];rmsResidual:number;meanResidual:number;maximumResidual:number}
export function applyFit(p:Point,f:SimilarityFit):Point{return [f.real*p[0]-f.imaginary*p[1]+f.translation[0],f.imaginary*p[0]+f.real*p[1]+f.translation[1]];}
export function inverseFit(p:Point,f:SimilarityFit):Point{const x=p[0]-f.translation[0],z=p[1]-f.translation[1],den=f.real**2+f.imaginary**2;return [(f.real*x+f.imaginary*z)/den,(-f.imaginary*x+f.real*z)/den];}
export function duplicateCoordinateIds(anchors:GeographicAnchor[]){const groups=new Map<string,string[]>();for(const a of anchors){const key=`${a.coordinate.latitude.toFixed(6)}:${a.coordinate.longitude.toFixed(6)}`;groups.set(key,[...(groups.get(key)??[]),a.id]);}return new Set([...groups.values()].filter(ids=>ids.length>1).flat());}
export function usableAnchors(anchors:GeographicAnchor[]){const duplicates=duplicateCoordinateIds(anchors.filter(a=>a.evidence.role!=="CAMERA_LOCATION"));return anchors.filter(a=>a.fitEligible&&a.evidence.role==="OBJECT_LOCATION"&&!duplicates.has(a.id)&&!["OUTLIER","DUPLICATED_SUSPECT","UNRESOLVED","CAMERA_POSITION_ONLY","UNASSESSED"].includes(a.status));}
export function fitGeoreference(anchors:GeographicAnchor[],positions:Record<string,Point>,mode:FitMode):SimilarityFit {
 const used=usableAnchors(anchors);if(used.length<2)throw new Error("At least two usable object anchors required");
 const pairs=used.map(anchor=>{const p=positions[anchor.monumentId];if(!p||!p.every(Number.isFinite))throw new Error("Missing finite plan anchor");return {anchor,p,q:geographicToLocal(anchor.coordinate)};});
 const mean=(key:"p"|"q",axis:number)=>pairs.reduce((n,p)=>n+p[key][axis],0)/pairs.length;
 const px=mean("p",0),pz=mean("p",1),qx=mean("q",0),qz=mean("q",1);
 let den=0,re=0,im=0;for(const {p,q} of pairs){const x=p[0]-px,z=p[1]-pz,u=q[0]-qx,v=q[1]-qz;den+=x*x+z*z;re+=x*u+z*v;im+=x*v-z*u;}
 if(den<1e-12)throw new Error("Degenerate plan control geometry");re/=den;im/=den;
 if(mode==="TRANSLATION"){re=1;im=0;}else if(mode==="RIGID"){const norm=Math.hypot(re,im);if(norm<1e-12)throw new Error("Degenerate geographic control geometry");re/=norm;im/=norm;}
 const scale=Math.hypot(re,im);if(!Number.isFinite(scale)||scale<1e-9)throw new Error("Invalid similarity scale");
 const fit:SimilarityFit={mode,real:re,imaginary:im,translation:[qx-re*px+im*pz,qz-im*px-re*pz],scale,rotationDegrees:Math.atan2(im,re)/radians,anchorIds:used.map(a=>a.id),rmsResidual:0,meanResidual:0,maximumResidual:0};
 const residuals=pairs.map(({p,q})=>{const n=applyFit(p,fit);return Math.hypot(n[0]-q[0],n[1]-q[1]);});
 fit.rmsResidual=Math.sqrt(residuals.reduce((n,r)=>n+r*r,0)/residuals.length);fit.meanResidual=residuals.reduce((n,r)=>n+r,0)/residuals.length;fit.maximumResidual=Math.max(...residuals);return fit;
}
