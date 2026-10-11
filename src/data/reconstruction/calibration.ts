import type {Point} from "./types.ts";
export const planCalibration={
 id:"dh-main-square-constraint-001",sourceId:"dh-plan",image:{width:1201,height:620,sha256:"ee7993703ada74aaabb2b7f6eb0c7af08977146f52032b00bfda91fcc142f763"},
 origin:[265,350] as Point,westEastExtent:[[265,350],[1020,350]] as [Point,Point],
 metresPerPixel:190/755,northBearingDegrees:0,
 accuracyClass:"APPROXIMATE",scaleSource:"ancient-nepal",
 method:"Uniform scale from explicitly chosen main-strip west/east limits (755 px) and published approximate 190 m length. No independent scale bar or geospatial tie. X east, second coordinate south; north from plan compass.",
 uncertainty:"Extent choice, schematic plan, pre-earthquake state and published rounding all uncertain. 190 m is an INPUT constraint, not independently verified. No anisotropic width/area fitting. Test 180–200 m length sensitivity; all metric positions/areas change with it.",
};
export function planToMetres([x,y]:Point):Point{return [(x-planCalibration.origin[0])*planCalibration.metresPerPixel,(y-planCalibration.origin[1])*planCalibration.metresPerPixel];}
export function metresToPlan([x,z]:Point):Point{return [x/planCalibration.metresPerPixel+265,z/planCalibration.metresPerPixel+350];}
export function polygonArea(ring:Point[]):number{return Math.abs(ring.reduce((s,a,i)=>{const b=ring[(i+1)%ring.length];return s+a[0]*b[1]-b[0]*a[1];},0))/2;}
export function bounds(ring:Point[]){const xs=ring.map(p=>p[0]),zs=ring.map(p=>p[1]);return {width:Math.max(...xs)-Math.min(...xs),depth:Math.max(...zs)-Math.min(...zs)};}
export function centre(ring:Point[]):Point{return [ring.reduce((n,p)=>n+p[0],0)/ring.length,ring.reduce((n,p)=>n+p[1],0)/ring.length];}
export function bearing(a:Point,b:Point){return (Math.atan2(b[0]-a[0],-(b[1]-a[1]))*180/Math.PI+360)%360;}

/** OLD overlay uses two common control centres. It is a comparison registration,
 * not a new UNESCO calibration. No original values are mutated. Other residuals
 * deliberately remain visible rather than being warped to fit. */
export const comparisonControls=[{id:"rameshwar",oldSourcePixel:[869,1295] as Point,newPlanPixel:[367,282] as Point},{id:"vatsala",oldSourcePixel:[1061.5,1340] as Point,newPlanPixel:[762.5,386] as Point}];
export function registerOldPoint(point:Point,oldControls:[Point,Point],fitScale=false):Point{
 const [a,b]=oldControls,[u,v]=comparisonControls.map(c=>planToMetres(c.newPlanPixel));
 const dx=b[0]-a[0],dz=b[1]-a[1],ux=v[0]-u[0],uz=v[1]-u[1],den=dx*dx+dz*dz;
 const fittedReal=(ux*dx+uz*dz)/den,fittedImag=(uz*dx-ux*dz)/den,norm=fitScale?1:Math.hypot(fittedReal,fittedImag);
 const real=fittedReal/norm,imag=fittedImag/norm;
 return [u[0]+real*(point[0]-a[0])-imag*(point[1]-a[1]),u[1]+imag*(point[0]-a[0])+real*(point[1]-a[1])];
}
