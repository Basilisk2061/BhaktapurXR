import type {ItemSession} from './inventory-store';
import type {PlayerInput} from '../input/player-input';
import type {PlayerRuntime} from '../player/player-runtime';
import type {PhotographySettings} from './photography-settings';

/** Invalidate captured joystick/look pointers as well as their current input values. */
export const clearTouchEvent = 'bhaktapurxr:clear-touch-input';
export function clearTouchInput(input: PlayerInput, active = true) {
  if(typeof window !== 'undefined')window.dispatchEvent(new Event(clearTouchEvent));
  input.keys.clear();input.jumpRequested=false;input.interactRequested=false;input.crouchRequested=false;input.lastSpacePress=null;
  if(input.touchMovement)input.touchMovement={forward:0,right:0,running:false};
  input.active=active&&!input.inputBlocked;
}
export function itemActionLabel(item: string | null) {
  return item==='camera'?'CAMERA':item==='birdFood'?'USE':null;
}
/** Same item semantics on desktop and touch; no alternate food/camera engine. */
export function useEquippedItem(item:string|null,session:ItemSession,input:PlayerInput,motion:PlayerRuntime) {
  if(!input.active||input.inputBlocked||input.inventoryOpen||motion.seat||motion.bellAction||input.flying)return false;
  if(item==='camera'){
    const held=motion.handheldCamera;if(!held?.wanted||held.hold<.99)return false;
    held.using=true;return true;
  }
  if(item==='birdFood'){session.food.request();return true;}
  return false;
}
export function requestCameraFocus(settings:PhotographySettings) {
  const s=settings.getState();settings.setState({focusRequested:true,focusMode:'AF',row:Math.min(s.row,5)});
}
export function setCameraFocal(settings:PhotographySettings,value:number) {
  if(Number.isFinite(value))settings.setState({focal:Math.max(24,Math.min(135,value))});
}
export function focusSliderValue(distance:number) {return Math.log(Math.max(.3,Math.min(500,distance))/.3)/Math.log(500/.3);}
export function setManualFocus(settings:PhotographySettings,value:number) {
  if(Number.isFinite(value))settings.setState({targetFocusDistance:.3*(500/.3)**Math.max(0,Math.min(1,value))});
}
export function setCameraFocusMode(settings:PhotographySettings,mode:'AF'|'MF') {
  const s=settings.getState();s.physical.afLocked=false;settings.setState({focusMode:mode,focusRequested:mode==='AF',focusUntil:0,afState:'SEARCHING'});
}
export function leaveCameraMode(settings:PhotographySettings,input:PlayerInput,motion:PlayerRuntime,cancel:()=>void) {
  cancel();const s=settings.getState();Object.assign(s.physical,{engaged:false,held:false,afLocked:false,aeLocked:false});
  settings.setState({panel:false});if(motion.handheldCamera)motion.handheldCamera.using=false;
  clearTouchInput(input);
}
