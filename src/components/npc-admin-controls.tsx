import {useEffect,useRef,useState} from 'react';
import {useStore} from 'zustand';
import {npcAdmin} from '../game/npcs/admin-placement';

function NumberField({label,value,commit}:{label:string;value:number;commit:(v:number)=>void}){
 const [text,setText]=useState(String(value)),focused=useRef(false);
 useEffect(()=>{if(!focused.current)setText(value.toFixed(3));},[value]);
 return <label>{label} <input type="number" step="0.1" value={text} onFocus={()=>{focused.current=true;}} onChange={e=>setText(e.target.value)} onKeyDown={e=>{if(e.key==='Enter')e.currentTarget.blur();}} onBlur={()=>{focused.current=false;const n=Number(text);if(text.trim()&&Number.isFinite(n))commit(n);setText(value.toFixed(3));}}/></label>;
}
const names:Record<string,string>={'female-a':'Female A','female-b':'Female B','old-a':'Old Man A','old-b':'Old Man B'};
export function NpcAdminControls({editor=false}:{editor?:boolean}){
 const admin=npcAdmin!;const s=useStore(admin.store),a=admin.bridge?.agents.find(a=>a.id===s.selected);
 const place=(axis:number,value:number)=>{if(!a)return;const position:[number,number,number]=[a.position.x,a.position.y,a.position.z];position[axis]=value;admin.move(a.id,{position,rotationY:a.yaw});};
 return <>
 <section className="bx-admin-section"><h3>{editor?'NPC MOVEMENT':'NPC PLACEMENT'}</h3>
 <div className="bx-admin-row"><span>Movement</span><div className="bx-admin-buttons"><button aria-pressed={!s.frozen} onClick={()=>admin.store.setState({frozen:false})}>ON</button><button aria-pressed={s.frozen} onClick={()=>admin.store.setState({frozen:true})}>FROZEN</button></div></div>
 {!editor&&<button className="bx-admin-primary" onClick={()=>admin.setPlacement(true)}>ENTER PLACEMENT MODE</button>}
 {editor&&<><div className="bx-admin-buttons" role="group" aria-label="Placement tool">{(['MOVE','ROTATE'] as const).map(tool=><button key={tool} aria-pressed={s.tool===tool} onClick={()=>admin.store.setState({tool})}>{tool==='MOVE'?'W  Move':'R  Rotate'}</button>)}</div>
 <div className="bx-admin-selected"><h3>SELECTED NPC</h3><strong>{a?names[a.id]??a.id:'None selected'}</strong>
 {a?<><div className="bx-admin-numbers">{['X','Y','Z'].map((axis,i)=><NumberField key={a.id+axis} label={axis} value={a.position.getComponent(i)} commit={v=>place(i,v)}/>)}</div><NumberField key={a.id+'yaw'} label="Rotation Y (degrees)" value={a.yaw*180/Math.PI} commit={v=>admin.move(a.id,{position:[a.position.x,a.position.y,a.position.z],rotationY:v*Math.PI/180})}/><div className="bx-admin-buttons"><button onClick={()=>admin.reset(a.id)}>Reset selected</button><button onClick={()=>admin.select(null)}>Deselect</button></div></>:<p className="bx-admin-hint">Click an NPC in the scene to begin.</p>}
 </div></>}
 </section>
 <section className="bx-admin-section"><h3>PLACEMENT DATA</h3><span className="bx-admin-status">{s.dirty?'Unsaved changes':s.saved?'Saved locally':'No local save this session'}</span>
 <div className="bx-admin-buttons"><button onClick={()=>admin.save()}>Save</button><button onClick={()=>admin.reload()}>Reload</button><button onClick={()=>void admin.copy()}>Copy JSON</button></div><small>Development browser only. No source files are written.</small><p className="bx-admin-status" role="status">{s.message}</p></section>
 {!editor&&<details className="bx-admin-danger"><summary>Reset placements</summary><button onClick={()=>admin.reset()}>RESET ALL NPC PLACEMENTS</button></details>}
 </>;
}
/** Compact nonmodal editor; all exits are directly available here. */
export function NpcAdminPlacementPanel(){
 const s=useStore(npcAdmin!.store);if(!s.placement)return null;
 const exit=()=>npcAdmin!.setPlacement(false);
 return <aside className="bx-admin bx-admin-placement" aria-label="NPC placement editor"><header className="bx-admin-header"><div><h2>NPC PLACEMENT</h2><span className="bx-admin-badge">DEVELOPMENT ONLY</span></div><button className="bx-admin-close" aria-label="Close NPC placement" onClick={exit}>&times;</button></header><div className="bx-admin-body"><NpcAdminControls editor/></div><footer className="bx-admin-footer"><p className="bx-admin-hint">Click NPC to select. Move: drag or arrows (Shift = 0.5 m). Rotate: drag ring (Shift = 15 deg). Q/E: 5 deg.</p><button className="bx-admin-exit" onClick={exit}>EXIT PLACEMENT</button><small>Esc exits | F8 opens Admin. NPC movement stays as set.</small></footer></aside>;
}
