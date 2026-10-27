/** Transient, mutable capture mechanics; never persisted as player preferences. */
export function createPhysicalCamera(){return {engaged:false,held:false,pressedAt:0,releasedAt:0,afLocked:false,aeLocked:false,meterRequested:false,lockedEv:0,angularX:0,angularY:0,meterDeviation:0};}
export type PhysicalCamera=ReturnType<typeof createPhysicalCamera>;
/** Choose ISO-100 shutter closest to metered light, then protect a focal-dependent floor. */
export function automaticExposure(ev100:number,focal:number,fstop:number){
 const speeds=[30,60,125,250,500,1000],isos=[100,200,400,800,1600,3200];
 const safe=ev100<5?Math.max(30,focal*.6):Math.max(60,focal*1.5);
 const ideal=2**ev100/(fstop*fstop);
 const floor=speeds.find(s=>s>=safe)??1000;
 const wanted=Math.min(1000,Math.max(floor,ideal));
 const shutter=speeds.reduce((a,b)=>Math.abs(Math.log2(b/wanted))<Math.abs(Math.log2(a/wanted))?b:a);
 const required=Math.max(100,100*shutter/Math.max(.01,ideal));
 const iso=isos.reduce((a,b)=>Math.abs(Math.log2(b/required))<Math.abs(Math.log2(a/required))?b:a);
 return {shutter,iso};
}
/** Angular motion becomes a bounded directional image displacement, never a uniform Gaussian. */
export function photographicConsequences(focal:number,shutter:number,iso:number,aperture:number,angularX:number,angularY:number,width:number,height:number,steady:boolean){
 const seconds=1/shutter,pixelsPerRadian=width*focal/36;
 const risk=Math.min(1.5,Math.max(.15,focal/shutter));
 const strength=.3+.45*risk;
 let x=angularX*seconds*pixelsPerRadian*strength,y=angularY*seconds*pixelsPerRadian*strength;
 const length=Math.hypot(x,y),cap=width/1920*7;
 if(length>cap){x*=cap/length;y*=cap/length;}
 const noise=iso<=200?0:iso<=400?.5:iso<=800?1.2:iso<=1600?2.4:4;
 const vignette=Math.max(.002,.085*(1.8/aperture)**1.8)*(focal<=35?1:.85);
 return {shakePixels:[x,y] as [number,number],noise,vignette,angularMotion:[angularX,angularY] as [number,number],stabilized:steady,width,height};
}
