/** Native touch activation must not depend on a compatibility mouse click. */
interface TapEvent {
 pointerId:number;button:number;isPrimary?:boolean;clientX:number;clientY:number;
 preventDefault:()=>void;stopPropagation:()=>void;
 currentTarget:{setPointerCapture?:(id:number)=>void;getBoundingClientRect?:()=>{left:number;right:number;top:number;bottom:number}};
}
export function createPointerTap(action:()=>void) {
 let pointer:number|null=null,x=0,y=0,moved=false,ignoreClick=false;
 const stop=(e:{preventDefault:()=>void;stopPropagation:()=>void})=>{e.preventDefault();e.stopPropagation();};
 return {
  onPointerDown(e:TapEvent){stop(e);if(e.button!==0||e.isPrimary===false||pointer!==null)return;ignoreClick=true;pointer=e.pointerId;x=e.clientX;y=e.clientY;moved=false;e.currentTarget.setPointerCapture?.(e.pointerId);},
  onPointerMove(e:TapEvent){if(pointer===e.pointerId&&Math.hypot(e.clientX-x,e.clientY-y)>12)moved=true;},
  onPointerUp(e:TapEvent){stop(e);if(pointer!==e.pointerId)return;pointer=null;const r=e.currentTarget.getBoundingClientRect?.();const inside=!r||(e.clientX>=r.left&&e.clientX<=r.right&&e.clientY>=r.top&&e.clientY<=r.bottom);if(!moved&&inside)action();},
  onPointerCancel(){pointer=null;},
  onLostPointerCapture(){pointer=null;},
  onKeyDown(e:{key:string}){if(e.key==='Enter'||e.key===' ')ignoreClick=false;},
  onClick(e:{detail:number;nativeEvent?:unknown;preventDefault:()=>void;stopPropagation:()=>void}){stop(e);if(ignoreClick){ignoreClick=false;return;}const native=e.nativeEvent as {pointerType?:string}|undefined;if(e.detail===0&&!native?.pointerType)action();},
 };
}
/** Includes icons/labels inside controls; empty look/viewfinder space is not marked. */
export function isInteractiveGameplayTarget(target:EventTarget|null) {
 const element=target as {closest?:(selector:string)=>unknown}|null;
 return !!element?.closest?.('[data-gameplay-ui],button,input,select,textarea,dialog[open],a[href]');
}
export function canStartTouchLook(target:EventTarget|null,input:{inputBlocked?:boolean;inventoryOpen?:boolean},modalOpen=false) {
 return !input.inputBlocked&&!input.inventoryOpen&&!modalOpen&&!isInteractiveGameplayTarget(target);
}
/** The desktop radial wheel's mouse emulation must never close the native touch picker. */
export function tracksInventoryMouse(touch:boolean,expanded:boolean) {return !touch&&expanded;}
