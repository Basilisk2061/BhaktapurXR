/** Full-frame reference optics. World/focus/depth are metres; focal/sensor/CoC are mm.
 * Thin lens: c = f^2 (z-s) / (N z (s-f)), all lengths converted to mm.
 * Positive CoC is behind focus, negative in front. 0.02mm is a permissible sharp circle.
 * Screen radius = max(0, abs(c)-0.02) / 36 * outputWidth / 2, bounded at a 1920px reference width (scaled with output resolution).
 */
export const sensorWidthMm=36;
export const acceptableCircleMm=.02;
export function signedCircleMm(focalMm:number,fNumber:number,focusMetres:number,depthMetres:number){const s=Math.max(.3,focusMetres)*1000,z=Math.max(.05,depthMetres)*1000;return focalMm*focalMm*(z-s)/(fNumber*z*Math.max(1,s-focalMm));}
export function defocusRadiusPixels(focal:number,aperture:number,focus:number,depth:number,width:number,maxPixels=18){return Math.min(maxPixels*width/1920,Math.max(0,Math.abs(signedCircleMm(focal,aperture,focus,depth))-acceptableCircleMm)*width/(2*sensorWidthMm));}
/** Shared GLSL form of the same equation, never raw nonlinear depth differences. */
export const opticsGlsl=`
float signedCircleMm(float zMetres){float s=max(.3,focus)*1000.,z=max(.05,zMetres)*1000.;return focal*focal*(z-s)/(fstop*z*max(1.,s-focal));}
float radiusPixels(float z){return min(maxPixels*resolution.x/1920.,max(0.,abs(signedCircleMm(z))-${acceptableCircleMm})*resolution.x/(2.*${sensorWidthMm}.))*strength;}
`;
export interface LensState {actualFocusDistance:number;aperture:number;shutter:number;iso:number;exposureMultiplier:number}
export function createLensState():LensState{return {actualFocusDistance:10,aperture:4,shutter:125,iso:100,exposureMultiplier:1};}
/** Lens motor runs in diopters: approx 90% convergence in 120-300ms, no overshoot. */
export function rackFocus(actual:number,target:number,dt:number){const a=1/actual,b=1/Math.max(.3,target),tau=.04+.06*Math.min(1,Math.abs(b-a)/.5);return 1/(a+(b-a)*(1-Math.exp(-Math.min(dt,.05)/tau)));}
