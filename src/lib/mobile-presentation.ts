/** Browser presentation is optional; gameplay navigation must survive API rejection. */
let orientationOwned=false;
type LockableOrientation=ScreenOrientation & {lock?:(orientation:'landscape')=>Promise<void>};
export function isTouchPresentation(){return typeof window!=='undefined'&&(window.matchMedia('(pointer: coarse)').matches||(navigator.maxTouchPoints>0&&window.matchMedia('(hover: none)').matches));}
export async function enterMobilePresentation(){
 try{
  if(!document.fullscreenElement){
   if(!document.fullscreenEnabled||typeof document.documentElement.requestFullscreen!=='function')return;
   await document.documentElement.requestFullscreen();
  }
  const orientation=screen.orientation as LockableOrientation|undefined;
  if(document.fullscreenElement&&typeof orientation?.lock==='function'){
   try{await orientation.lock('landscape');orientationOwned=true;}catch{/* Manual rotation remains available. */}
  }
 }catch{/* Unsupported or denied fullscreen must not block navigation. */}
}
function releaseOrientation(){
 if(!orientationOwned)return;
 try{screen.orientation?.unlock?.();}catch{/* Optional API. */}finally{orientationOwned=false;}
}
export async function leaveMobilePresentation(){
 try{if(document.fullscreenElement&&typeof document.exitFullscreen==='function')await document.exitFullscreen();}
 catch{/* Navigation still proceeds. */}
 finally{releaseOrientation();}
}
