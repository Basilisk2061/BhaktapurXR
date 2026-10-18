"use client";
import Link from 'next/link';
import {useEffect,useRef,useState} from 'react';
import {MouseSensitivitySettings} from '../mouse-sensitivity-settings';
import {PUBLIC_EXPLORE_HREF} from '../../game/world/world-mode';

const panels={about:'About the Reconstruction',heritage:'Heritage & History',settings:'Settings',credits:'Credits'} as const;
type Panel=keyof typeof panels;
export function MainMenu(){
 const [panel,setPanel]=useState<Panel|null>(null);
 const dialog=useRef<HTMLDialogElement>(null);
 useEffect(()=>{if(panel&&!dialog.current?.open)dialog.current?.showModal();},[panel]);
 return <>
  <section className="menu-content" aria-labelledby="menu-title">
   <h1 id="menu-title">BHAKTAPURXR</h1>
   <p className="menu-subtitle">3D HERITAGE EXPLORATION</p>
   <p className="menu-intro">Explore an evolving digital interpretation<br className="menu-desktop-break"/> of Bhaktapur Durbar Square, Nepal.</p>
   <Link className="menu-explore" href={PUBLIC_EXPLORE_HREF} prefetch={false}>Explore Bhaktapur <span aria-hidden="true">?</span></Link>
   <nav className="menu-options" aria-label="Main menu">
    {(Object.entries(panels) as [Panel,string][]).map(([key,label])=><button key={key} type="button" aria-haspopup="dialog" aria-controls="menu-panel" onClick={()=>setPanel(key)}><span aria-hidden="true" className="menu-marker">?</span>{label}</button>)}
   </nav>
  </section>
  <dialog id="menu-panel" ref={dialog} className="menu-dialog" aria-labelledby="menu-panel-title" onClose={()=>setPanel(null)} onClick={event=>{if(event.target===dialog.current){const rect=event.currentTarget.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)dialog.current.close();}}}>
   <header className="menu-dialog-header"><p>BhaktapurXR</p><form method="dialog"><button type="submit" aria-label="Close panel">Close <span aria-hidden="true">?</span></button></form></header>
   <div className="menu-dialog-content">
    <h2 id="menu-panel-title">{panel?panels[panel]:''}</h2>
    {panel==='about'&&<>
     <p>BhaktapurXR is an independent digital heritage project that recreates the experience and character of Bhaktapur Durbar Square as an interactive 3D environment.</p>
     <p>BhaktapurXR is an evolving digital interpretation of Bhaktapur Durbar Square. It aims to recreate the atmosphere, spatial experience and heritage character of the site, but some architecture, dimensions, placements and details are approximate and may differ from the real monuments.</p>
     <p>The reconstruction draws on available maps, photographs, published references, documentation and research material. Evidence varies between landmarks; visual interpretation is sometimes necessary where reliable information is limited.</p>
     <p>The reconstruction will improve as better evidence becomes available. It should not be treated as a perfectly accurate digital twin of the heritage site.</p>
    </>}
    {panel==='heritage'&&<>
     <p>Monument and historical information will expand throughout development. This prototype focuses on exploring the reconstructed environment.</p>
     <p>Historical and cultural information in BhaktapurXR is provided for educational context. It is compiled from publicly available references and research-assisted material, including AI-assisted research, and may contain omissions or inaccuracies. Where possible, authoritative references are identified.</p>
    </>}
    {panel==='settings'&&<><MouseSensitivitySettings/><p className="menu-panel-note">Your preference stays in this browser.</p></>}
    {panel==='credits'&&<>
     <p>BhaktapurXR<br/>Independent digital heritage reconstruction project</p>
     <h3>Built with</h3><p>Next.js ? React ? Three.js<br/>React Three Fiber ? React Three Rapier</p>
     <h3>Reference acknowledgement</h3><p>Publicly available maps, photographs and heritage documentation inform the reconstruction. Reference use does not imply participation or endorsement.</p>
     <p><a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">Map data ? OpenStreetMap contributors <span aria-hidden="true">?</span></a></p>
    </>}
   </div>
  </dialog>
 </>;
}
