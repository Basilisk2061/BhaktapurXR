import {useEffect,useRef,useState} from 'react';
import {useStore} from 'zustand';
import {npcAdmin} from '../game/npcs/admin-placement';

function NumberField({label,value,commit}:{label:string;value:number;commit:(v:number)=>void}){
 const [text,setText]=useState(String(value)),focused=useRef(false);
 useEffect(()=>{if(!focused.current)setText(value.toFixed(3));},[value]);
 return <label style={{display:'block'}}>{label} <input type="number" step="0.1" value={text} style={{width:105,color:'#111',background:'#fff'}} onFocus={()=>{focused.current=true;}} onChange={e=>setText(e.target.value)} onKeyDown={e=>{if(e.key==='Enter')e.currentTarget.blur();}} onBlur={()=>{focused.current=false;const n=Number(text);if(text.trim()&&Number.isFinite(n))commit(n);setText(value.toFixed(3));}}/></label>;
}
export function NpcAdminControls(){
 const admin=npcAdmin!;const s=useStore(admin.store),a=admin.bridge?.agents.find(a=>a.id===s.selected);
 const place=(axis:number,value:number)=>{if(!a)return;const position:[number,number,number]=[a.position.x,a.position.y,a.position.z];position[axis]=value;admin.move(a.id,{position,rotationY:a.yaw});};
 return <fieldset><legend>NPC CONTROL</legend>
 <button onClick={()=>admin.store.setState({frozen:!s.frozen})}>NPC Movement: {s.frozen?'FROZEN':'ON'}</button>{' '}
 <button onClick={()=>admin.setPlacement(!s.placement)}>Placement Mode: {s.placement?'ON':'OFF'}</button>
 <p>Selected NPC: {a?`${a.character==='female_01'?'Female':'Old Man'} (${a.id})`:'None'}</p>
 {a&&<><output>Position: {a.position.x.toFixed(2)}, {a.position.y.toFixed(2)}, {a.position.z.toFixed(2)} | Yaw {(a.yaw*180/Math.PI).toFixed(1)}?</output>{['X','Y','Z'].map((axis,i)=><NumberField key={a.id+axis} label={axis} value={a.position.getComponent(i)} commit={v=>place(i,v)}/>)}<NumberField key={a.id+'yaw'} label="Rotation Y (degrees)" value={a.yaw*180/Math.PI} commit={v=>admin.move(a.id,{position:[a.position.x,a.position.y,a.position.z],rotationY:v*Math.PI/180})}/><button onClick={()=>admin.select(null)}>Deselect / release</button><button onClick={()=>admin.reset(a.id)}>RESET NPC</button></>}
 <p><button onClick={()=>admin.reset()}>RESET ALL NPC PLACEMENTS</button></p>
 <button onClick={()=>admin.save()}>SAVE NPC PLACEMENTS (LOCAL)</button>{' '}<button onClick={()=>admin.reload()}>RELOAD NPC PLACEMENTS</button>{' '}<button onClick={()=>void admin.copy()}>COPY NPC PLACEMENTS</button>
 <p style={{fontSize:11}}>Click/drag NPC ? Q/E rotate 5? (Shift 15?) ? Arrows move 0.1 m (Shift 0.5 m). Ground-snapped. Saves are development-browser local, never source files.</p>
 <p role="status">{s.message}</p>
 </fieldset>;
}
/** F8 stays modal normally. Placement uses a separate nonmodal control strip for world access. */
export function NpcAdminPlacementPanel(){
 const s=useStore(npcAdmin!.store);
 if(!s.placement)return null;
 return <aside aria-label="NPC admin placement" style={{position:'fixed',right:12,top:60,zIndex:1100,maxWidth:360,maxHeight:'80dvh',overflow:'auto',background:'#202824ed',color:'#f4f0df',padding:12,pointerEvents:'auto'}}><NpcAdminControls/></aside>;
}
