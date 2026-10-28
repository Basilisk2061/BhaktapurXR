import {createPointerTap,canStartTouchLook,isInteractiveGameplayTarget,tracksInventoryMouse} from '../src/game/input/gameplay-ui-pointer.ts';
import assert from 'node:assert/strict';
import {test} from 'node:test';
import {readFileSync,existsSync} from 'node:fs';
import path from 'node:path';
import ts from 'typescript';
import {clearTouchInput,itemActionLabel,useEquippedItem,requestCameraFocus,setCameraFocal,setCameraFocusMode,focusSliderValue,setManualFocus,leaveCameraMode} from '../src/game/inventory/touch-camera-actions.ts';
import {createPlayerInput} from '../src/game/input/player-input.ts';
import {createPlayerRuntime} from '../src/game/player/player-runtime.ts';
// Resolve this project's extensionless local TS imports without modifying production files.
const modules=new Map();
function moduleUrl(file){file=path.resolve(file);if(modules.has(file))return modules.get(file);let code=ts.transpileModule(readFileSync(file,'utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext}}).outputText;code=code.replace(/from\s+(['"])([^'"]+)\1/g,(_,quote,spec)=>{let url;if(spec.startsWith('.')){let p=path.resolve(path.dirname(file),spec);if(!existsSync(p))p+='.ts';url=moduleUrl(p)}else url=import.meta.resolve(spec);return 'from '+JSON.stringify(url)});const url='data:text/javascript;base64,'+Buffer.from(code).toString('base64');modules.set(file,url);return url;}
const {createPhotographySettings}=await import(moduleUrl('src/game/inventory/photography-settings.ts'));
const {beginShutterPress,releaseShutterPress,cancelShutterPress}=await import(moduleUrl('src/game/inventory/photograph.ts'));
function fixture(){const input=createPlayerInput(0,0),motion=createPlayerRuntime();input.active=true;input.touchMode=true;input.touchMovement={forward:0,right:0,running:false};let throws=0;const session={photography:createPhotographySettings(),food:{request:()=>throws++}};return {input,motion,session,throws:()=>throws};}
test('contextual item actions exist only for actionable slots and reuse food/camera logic',()=>{
 const f=fixture();assert.equal(itemActionLabel('camera'),'CAMERA');assert.equal(itemActionLabel('birdFood'),'USE');assert.equal(itemActionLabel(null),null);assert.equal(itemActionLabel('empty'),null);
 assert.equal(useEquippedItem(null,f.session,f.input,f.motion),false);assert.equal(f.throws(),0);
 assert.equal(useEquippedItem('birdFood',f.session,f.input,f.motion),true);assert.equal(f.throws(),1);
 f.motion.handheldCamera={wanted:true,using:false,hold:.4,view:0,elapsed:0,pendingFood:false};assert.equal(useEquippedItem('camera',f.session,f.input,f.motion),false);f.motion.handheldCamera.hold=1;assert.equal(useEquippedItem('camera',f.session,f.input,f.motion),true);assert.equal(f.motion.handheldCamera.using,true);
 for(const field of ['inputBlocked','inventoryOpen','flying']){f.input[field]=true;assert.equal(useEquippedItem('birdFood',f.session,f.input,f.motion),false);f.input[field]=false;}
 f.motion.seat={};assert.equal(useEquippedItem('camera',f.session,f.input,f.motion),false);f.motion.seat=null;f.motion.bellAction={};assert.equal(useEquippedItem('birdFood',f.session,f.input,f.motion),false);
});
test('AF requests existing center AF without shutter; zoom clamps to the real focal-length state',()=>{
 const {session}=fixture(),p=session.photography;requestCameraFocus(p);assert.equal(p.getState().focusRequested,true);assert.equal(p.getState().focusMode,'AF');assert.equal(p.getState().shutterRequested,false);
 for(const [value,want]of [[0,24],[24,24],[85,85],[135,135],[999,135]]){setCameraFocal(p,value);assert.equal(p.getState().focal,want)}setCameraFocal(p,NaN);assert.equal(p.getState().focal,135);
});
test('manual focus uses the full nonlinear 0.3500m system and mode switching unlocks AF',()=>{
 const p=fixture().session.photography;for(const distance of [.3,1,10,100,500]){setManualFocus(p,focusSliderValue(distance));assert.ok(Math.abs(p.getState().targetFocusDistance-distance)<1e-8)}
 p.getState().physical.afLocked=true;setCameraFocusMode(p,'MF');assert.equal(p.getState().focusMode,'MF');assert.equal(p.getState().physical.afLocked,false);setCameraFocusMode(p,'AF');assert.equal(p.getState().focusRequested,true);
});
test('real shutter press/release preserves hold, capture request, cooldown and cancellation',()=>{
 const p=fixture().session.photography;assert.equal(beginShutterPress(p),true);assert.equal(p.getState().physical.held,true);assert.equal(p.getState().shutterRequested,false);assert.equal(p.getState().physical.meterRequested,true);
 releaseShutterPress(p);assert.equal(p.getState().physical.held,false);assert.equal(p.getState().shutterRequested,true);assert.equal(p.getState().shutterBusy,true);assert.ok(p.getState().physical.releasedAt>0);assert.equal(p.getState().photoSequence,1);
 cancelShutterPress(p);assert.equal(p.getState().shutterRequested,false);assert.equal(p.getState().physical.afLocked,false);
 p.setState({preview:{blob:new Blob(['photo']),metadata:{}}});assert.equal(beginShutterPress(p),false);
});
test('camera exit cancels press/locks and clears movement/look values without changing aim or crouch',()=>{
 const f=fixture();f.motion.handheldCamera={wanted:true,using:true,hold:1,view:1,elapsed:0,pendingFood:false};f.motion.crouchWanted=true;f.input.yaw=.6;f.input.pitch=.2;f.input.keys.add('KeyW');f.input.jumpRequested=true;f.input.touchMovement.forward=1;
 f.session.photography.setState({panel:true});beginShutterPress(f.session.photography);leaveCameraMode(f.session.photography,f.input,f.motion,()=>cancelShutterPress(f.session.photography));
 assert.equal(f.motion.handheldCamera.using,false);assert.equal(f.motion.handheldCamera.wanted,true);assert.equal(f.session.photography.getState().panel,false);assert.equal(f.session.photography.getState().physical.engaged,false);assert.equal(f.input.keys.size,0);assert.equal(f.input.touchMovement.forward,0);assert.equal(f.input.yaw,.6);assert.equal(f.input.pitch,.2);assert.equal(f.motion.crouchWanted,true);
 f.input.inputBlocked=true;clearTouchInput(f.input);assert.equal(f.input.active,false);
});
test('touch UI isolates pointers above look, exposes keyboard-free settings and preserves actual Blob preview',()=>{
 const read=p=>readFileSync(p,'utf8'),ui=read('src/game/inventory/camera-touch-controls.tsx'),css=read('src/game/inventory/inventory.css'),preview=read('src/game/inventory/photo-preview.tsx'),mobile=read('src/components/mobile-controls.tsx'),desktop=read('src/game/inventory/camera-viewfinder.tsx');
 assert.match(css,/inventory-mobile\{[^}]*z-index:41/);assert.match(css,/camera-viewfinder.is-touch\{z-index:41/);assert.match(css,/camera-touch-shutter\{[^}]*width:72px;height:72px/);assert.match(ui,/onPointerDown=.*stopPropagation/s);assert.match(ui,/setPointerCapture/);assert.match(ui,/onPointerUp=.*releaseShutterPress/s);assert.match(ui,/onPointerCancel=\{cancel\}/);assert.match(mobile,/addEventListener\(clearTouchEvent,reset\)/);
 for(const control of ['Exposure mode','Aperture','Shutter speed','ISO','Focus mode','Manual focus distance','Done'])assert.ok(ui.includes(control));assert.ok(ui.includes('showModal()'));assert.ok(ui.includes('leaveCameraMode'));assert.match(preview,/downloadPhotograph\(photo\)/);assert.match(preview,/createObjectURL\(photo.blob\)/);assert.match(preview,/controls.inputBlocked=true/);assert.match(preview,/SAVE/);assert.match(preview,/RETAKE/);
 for(const key of ['KeyF','KeyV','KeyM','KeyG'])assert.ok(desktop.includes(key));assert.match(desktop,/e.deltaY/);assert.match(read('src/game/input/player-input.ts'),/code==="KeyC"/);
 const index=read('src/game/rendering/photography-scene-index.ts');assert.match(index,/this.proxies.add/);assert.match(index,/if\(o instanceof SkinnedMesh\)return/);
});

const {createItemSession}=await import(moduleUrl('src/game/inventory/inventory-store.ts'));
function touchEvent(overrides={}){return {pointerType:'touch',pointerId:12,isPrimary:true,button:0,clientX:24,clientY:24,prevented:false,stopped:false,preventDefault(){this.prevented=true;},stopPropagation(){this.stopped=true;},currentTarget:{setPointerCapture(id){this.captured=id;},getBoundingClientRect:()=>({left:0,right:100,top:0,bottom:60})},...overrides};}
function compatibilityClick(tap){tap.onClick({detail:1,nativeEvent:{pointerType:'touch'},preventDefault(){},stopPropagation(){}});}
test('touch Camera/Bird Food/empty slots select once even with intervening compatibility mousemove',()=>{
 for(const slot of [1,0,2]){const session=createItemSession(),input=createPlayerInput(0,0);session.inventory.getState().open();input.inventoryOpen=true;let selections=0;
 const unsubscribe=session.inventory.subscribe((a,b)=>{if(a.selected!==b.selected)selections++;});
 const tap=createPointerTap(()=>{session.inventory.getState().select(slot);session.inventory.getState().close(false);input.inventoryOpen=false;});
 const down=touchEvent();tap.onPointerDown(down);assert.equal(down.prevented,true);assert.equal(down.stopped,true);assert.equal(down.currentTarget.captured,12);
 // Real regression: old desktop mousemove handler would close on its own modal before click.
 if(tracksInventoryMouse(true,session.inventory.getState().expanded))session.inventory.getState().close(false);
 assert.equal(session.inventory.getState().expanded,true);assert.equal(session.inventory.getState().selected,-1);
 tap.onPointerUp(touchEvent());compatibilityClick(tap);assert.equal(selections,1);assert.equal(session.inventory.getState().selected,slot);assert.equal(input.inventoryOpen,false);assert.equal(session.food.requested,false);assert.equal(session.photography.getState().shutterRequested,false);unsubscribe();
 }assert.equal(tracksInventoryMouse(false,true),true);assert.equal(tracksInventoryMouse(false,false),false);
});
test('touch CAMERA/USE pointer down/up activates exactly once, not on selection or synthetic click',()=>{
 for(const item of ['camera','birdFood']){const f=fixture();let uses=0;f.motion.handheldCamera={wanted:true,using:false,hold:1,view:0,elapsed:0,pendingFood:false};const tap=createPointerTap(()=>{uses++;useEquippedItem(item,f.session,f.input,f.motion)});
 tap.onPointerDown(touchEvent());assert.equal(uses,0);tap.onPointerUp(touchEvent());compatibilityClick(tap);assert.equal(uses,1);if(item==='camera')assert.equal(f.motion.handheldCamera.using,true);else assert.equal(f.throws(),1);
 }
});
test('UI descendants cannot initiate gameplay look; empty viewfinder can, except while modal/inventory open',()=>{
 const icon={closest:()=>({dataset:{gameplayUi:''}})},empty={closest:()=>null},input=createPlayerInput(0,0);
 assert.equal(isInteractiveGameplayTarget(icon),true);assert.equal(canStartTouchLook(icon,input),false);assert.equal(canStartTouchLook(empty,input),true);
 input.inventoryOpen=true;assert.equal(canStartTouchLook(empty,input),false);input.inventoryOpen=false;assert.equal(canStartTouchLook(empty,input,true),false);input.inputBlocked=true;assert.equal(canStartTouchLook(empty,input),false);
 const mobile=readFileSync('src/components/mobile-controls.tsx','utf8');assert.ok(mobile.indexOf('!canStartTouchLook')<mobile.indexOf('look.current={id:event.pointerId'));assert.ok(readFileSync('src/game/inventory/inventory-hud.tsx','utf8').includes('if(!tracksInventoryMouse(touch,session.inventory.getState().expanded))return;'));
});
test('cancel, foreign pointer, drag and release outside cannot select; mouse and keyboard still activate once',()=>{
 let count=0;const tap=createPointerTap(()=>count++);tap.onPointerDown(touchEvent());tap.onPointerUp(touchEvent({pointerId:99}));assert.equal(count,0);tap.onPointerCancel();tap.onPointerUp(touchEvent());assert.equal(count,0);
 tap.onPointerDown(touchEvent());tap.onPointerMove(touchEvent({clientX:60}));tap.onPointerUp(touchEvent({clientX:60}));assert.equal(count,0);compatibilityClick(tap);
 tap.onPointerDown(touchEvent());tap.onPointerUp(touchEvent({clientX:120}));assert.equal(count,0);compatibilityClick(tap);
 tap.onPointerDown(touchEvent({pointerType:'mouse'}));tap.onPointerUp(touchEvent({pointerType:'mouse'}));compatibilityClick(tap);assert.equal(count,1);
 tap.onKeyDown({key:'Enter'});tap.onClick({detail:0,nativeEvent:{},preventDefault(){},stopPropagation(){}});assert.equal(count,2);
});
test('touch AF and zoom operate without starting look or taking a photograph',()=>{
 const f=fixture(),ui={closest:()=>({})};const af=createPointerTap(()=>requestCameraFocus(f.session.photography));af.onPointerDown(touchEvent());af.onPointerUp(touchEvent());compatibilityClick(af);assert.equal(f.session.photography.getState().focusRequested,true);assert.equal(f.session.photography.getState().shutterRequested,false);assert.equal(canStartTouchLook(ui,f.input),false);
 setCameraFocal(f.session.photography,85);assert.equal(f.session.photography.getState().focal,85);assert.equal(canStartTouchLook(ui,f.input),false);
});
test('touch shutter down/hold/up uses existing press and release, while every discrete camera button shares pointer routing',()=>{
 const p=fixture().session.photography,down=touchEvent(),up=touchEvent();down.preventDefault();beginShutterPress(p);assert.equal(p.getState().physical.held,true);assert.equal(p.getState().shutterRequested,false);up.preventDefault();releaseShutterPress(p);assert.equal(p.getState().shutterRequested,true);assert.equal(p.getState().photoSequence,1);
 for(const [file,labels]of [['src/game/inventory/mobile-item-controls.tsx',['action={open}','action={use}','select(index)']],['src/game/inventory/camera-touch-controls.tsx',['camera-touch-exit','camera-touch-settings','camera-touch-af','action={closePanel}']],['src/game/inventory/photo-preview.tsx',['finish(true)','finish(false)']]]){const source=readFileSync(file,'utf8');assert.ok(source.includes('PointerActionButton'));for(const label of labels)assert.ok(source.includes(label));}
});
