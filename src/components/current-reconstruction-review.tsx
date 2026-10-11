"use client";
import Link from "next/link";
import {useState} from "react";
import {currentObjects,plazaHoles,squareMetrics,vatsalaDimensions,unresolvedResearch,spatialRelationships} from "@/data/reconstruction/bhaktapur-current";
import {planCalibration,comparisonControls,registerOldPoint,bounds} from "@/data/reconstruction/calibration";
import type {Point,AccuracyClass,ReconstructionObject} from "@/data/reconstruction/types";
import {spatialFeatures} from "@/data/world/spatial-registry";
import {mapCalibrations} from "@/data/world/map-measurements";
import {mapPointToLocal} from "@/lib/map-calibration";
const colors:Record<AccuracyClass,string>={VERIFIED:"#166534",SOURCE_DERIVED:"#2563a6",PHOTO_INFERRED:"#7e22ce",APPROXIMATE:"#b45309",PLACEHOLDER:"#64748b",UNRESOLVED:"#b91c1c"};
// Stable serialization avoids Node/Chromium libm differences in SVG hydration.
const displayNumber=(n:number)=>n.toFixed(6);
const polygon=(ring:Point[],close=true)=>ring.map((p,i)=>`${i?"L":"M"}${p[0].toFixed(6)},${p[1].toFixed(6)}`).join(" ")+(close?" Z":"");
const labelLayout:Record<string,{text:string;offset:Point}>={"main-plaza":{text:"Main palace square",offset:[-48,18]},"gallery-frontage":{text:"Art Gallery frontage",offset:[-8,-5]},"fifty-five-frontage":{text:"55 Window frontage",offset:[-3,-5]},"golden-gate":{text:"Golden Gate",offset:[-7,-10]},"malla-column":{text:"Malla column",offset:[-18,-3]},"chyasilin":{text:"Chyasilin Mandap",offset:[-3,7]}};
const oldControls=comparisonControls.map(c=>mapPointToLocal(c.oldSourcePixel,mapCalibrations[0])) as [Point,Point];
function title(o:ReconstructionObject){return `${o.canonicalName}\n${o.accuracyClass} / ${o.confidence}\n${o.footprintEvidence.method}\n${o.rotation.state}: ${o.rotation.bearingDegrees?.toFixed(2)??"unresolved"}\n${o.notes}`;}
export function CurrentReconstructionReview(){
 const [old,setOld]=useState(false),[fit,setFit]=useState(false),[source,setSource]=useState(false),[labels,setLabels]=useState(true),[grid,setGrid]=useState(true),[opacity,setOpacity]=useState(.35),[selected,setSelected]=useState("main-plaza");
 const current=currentObjects.find(o=>o.id===selected)!;
 const s=planCalibration.metresPerPixel;
 return <main className="min-h-svh bg-stone-100 p-5 text-stone-900">
  <header className="flex flex-wrap items-center gap-4 text-sm"><h1 className="font-semibold">Phase 6A · Main royal palace square spatial review</h1><Link href="/explore?world=bhaktapur">Phase 5B gameplay</Link><Link href="/reconstruction">Original UNESCO review</Link></header>
  <p className="my-3 text-sm">Present-day target · 2006 schematic plan geometry · constraint-calibrated scale · human approval pending. Blue outlines are source-derived; metric placement remains approximate. No final architecture.</p>
  <div className="flex flex-wrap gap-4 text-sm">
   <label><input type="checkbox" checked={old} onChange={e=>setOld(e.target.checked)}/> Old UNESCO overlay</label>
   <label><input type="checkbox" checked={fit} onChange={e=>setFit(e.target.checked)}/> Fit old overlay scale (comparison only)</label>
   <label><input type="checkbox" checked={source} onChange={e=>setSource(e.target.checked)}/> Digital Himalaya source plan</label>
   <label>Plan opacity <input type="range" aria-label="Plan opacity" min="0" max="1" step=".05" value={opacity} onChange={e=>setOpacity(Number(e.target.value))}/></label>
   <label><input type="checkbox" checked={labels} onChange={e=>setLabels(e.target.checked)}/> Labels</label>
   <label><input type="checkbox" checked={grid} onChange={e=>setGrid(e.target.checked)}/> 10 m grid</label>
  </div>
  <p className="my-2 text-xs">Old overlay: {fit?"two-anchor similarity fit; alters display scale":"rigid registration at Rameshwar, retaining original metre scale"}. Candidate Rameshwar/Vatsala control centres align map directions. Registration is not a geospatial correction; original traces are unchanged.</p>
  <svg data-current-review viewBox="-18 -55 230 118" className="h-[66svh] w-full border border-stone-300 bg-white" aria-label="Current main square reconstruction dataset from above">
   <defs><marker id="front-arrow" markerWidth="4" markerHeight="4" refX="3" refY="2" orient="auto"><path d="M0,0 L4,2 L0,4" fill="#b45309"/></marker><pattern id="ten-metre-grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M10 0H0V10" fill="none" stroke="#d6d3d1" strokeWidth=".12"/></pattern></defs>
   {grid&&<rect x="-18" y="-55" width="230" height="118" fill="url(#ten-metre-grid)"/>}
   {source&&<image href="/api/dev/reconstruction-plan" x={displayNumber(-265*s)} y={displayNumber(-350*s)} width={displayNumber(1201*s)} height={displayNumber(620*s)} opacity={opacity}/>}
   {currentObjects.map(o=>{const point=o.position!,edge=o.footprintRole==="PUBLIC_EDGE",label=labelLayout[o.id]??{text:o.canonicalName,offset:[1,2.9]};return <g key={o.id} data-reconstruction-id={o.id} onClick={()=>setSelected(o.id)} style={{cursor:"pointer"}}>
    <title>{title(o)}</title>
    {o.footprint&&<path d={polygon(o.footprint,!edge)+(o.category==="PLAZA"?plazaHoles.map(h=>" "+polygon(h)).join(""):"")} fill={edge?"none":o.category==="PLAZA"?"#dcfce7":"#dbeafe"} fillOpacity={source?.45:.85} fillRule="evenodd" stroke={selected===o.id?"#0f172a":colors[o.accuracyClass]} strokeWidth={edge?.85:.35}/>}
    <circle cx={displayNumber(point[0])} cy={displayNumber(point[1])} r={o.category==="COLUMN"?.8:.45} fill={colors[o.positionEvidence.accuracyClass]}/>
    {o.rotation.bearingDegrees!==null&&o.category!=="PLAZA"&&<path data-orientation-state={o.rotation.state} d={`M${point.map(displayNumber)} l${displayNumber(5*Math.sin(o.rotation.bearingDegrees*Math.PI/180))},${displayNumber(-5*Math.cos(o.rotation.bearingDegrees*Math.PI/180))}`} stroke="#b45309" strokeWidth=".3" strokeDasharray={o.rotation.state==="AXIS_ONLY"?"1 .6":undefined} markerEnd="url(#front-arrow)"/>}
    {o.rotation.bearingDegrees===null&&<text x={displayNumber(point[0]+.7)} y={displayNumber(point[1]-1)} fontSize="1.8" fill="#b91c1c">?</text>}
    {labels&&<text x={displayNumber(point[0]+label.offset[0])} y={displayNumber(point[1]+label.offset[1])} fontSize={o.category==="PLAZA"?2.5:1.8} fill="#172554">{label.text}</text>}
   </g>})}
   {old&&spatialFeatures.filter(f=>f.kind==="building-footprint"||f.kind==="open-square").map(f=><path key={f.id} data-old-feature-id={f.id} d={[f.vertices,...(f.holes??[])].map(r=>polygon(r.map(p=>registerOldPoint(p,oldControls,fit)))).join(" ")} fill="none" stroke="#be185d" strokeWidth=".4" strokeDasharray="1 .7"><title>{f.id} · OLD APPROXIMATE · comparison registration only</title></path>)}
   <path d="M-8 -35V-45" stroke="#111827" strokeWidth=".5" markerEnd="url(#front-arrow)"/><text x="-9" y="-47" fontSize="3">N</text>
   <path d="M0 48H10M0 47V49M10 47V49" stroke="#111827" strokeWidth=".5"/><text x="1" y="52" fontSize="2.5">10 m</text>
  </svg>
  <p className="my-2 text-xs">Digital Himalaya, metadata 2006 · <a href="https://commons.wikimedia.org/wiki/File:Map_of_Bhaktapur_Durbar_Square.jpg">source</a> · <a href="https://creativecommons.org/licenses/by-sa/3.0/">CC BY-SA 3.0</a>. New tracing/calibration is an adaptation; metric scale and present-day applicability are unverified.</p>
  <div className="flex flex-wrap gap-4 text-xs">{Object.entries(colors).map(([label,color])=><span key={label}><span style={{color}}>●</span> {label}</span>)}<span>Pink dashed: old trace · Orange solid: documented facing/frontage · Orange dashed: axis only · ?: facing unresolved</span></div>
  <p className="my-3 text-sm">Length input {squareMetrics.length.toFixed(1)} m · sampled widths {squareMetrics.typicalWidthSamples.map(s=>s.width.toFixed(1)).join(" / ")} m · gross {squareMetrics.grossArea.toFixed(0)} m² · partial net {squareMetrics.netArea.toFixed(0)} m² versus published ~4,750 m². Maximum irregular N–S extent {squareMetrics.maxNorthSouthExtent.toFixed(1)} m. No area fitting applied.</p>
  <section className="grid gap-5 md:grid-cols-2">
   <div className="rounded border border-stone-300 bg-white p-4 text-sm"><label>Select datum <select aria-label="Select datum" value={selected} onChange={e=>setSelected(e.target.value)} className="ml-2 border p-1">{currentObjects.map(o=><option key={o.id} value={o.id}>{o.canonicalName}</option>)}</select></label><p className="mt-3">{current.notes}</p><p>Centre: {current.position?.map(n=>n.toFixed(2)).join(", ")} m · {current.confidence} · {current.accuracyClass}</p><p>Orientation: {current.rotation.bearingDegrees?.toFixed(2)??"UNRESOLVED"}° · {current.rotation.state}</p><p>Footprint: {current.footprintRole} {current.footprint&&current.footprint.length>2?`· ${bounds(current.footprint).width.toFixed(1)} × ${bounds(current.footprint).depth.toFixed(1)} m outline bounds`:"· depth/extent unresolved"}</p><p>Sources: {current.sourceReferences.join(", ")}</p><p className="mt-2">{current.positionEvidence.uncertainty}</p></div>
   <div className="rounded border border-stone-300 bg-white p-4 text-sm"><h2 className="font-semibold">Uncertainty to review</h2><p>Vatsala: {vatsalaDimensions.superstructureMetres} m superstructure + {vatsalaDimensions.platformMetres} m platform; plinth {vatsalaDimensions.plinthReportedMetres.join(" or ")} m. No single total selected. South-facing documentation and west stair descent retained separately.</p><ul className="mt-2">{unresolvedResearch.map(r=><li key={r.id}>{r.canonicalName}: {r.notes}</li>)}</ul></div>
  </section>
  <details className="my-4 text-sm"><summary>Recorded spatial relationships and scale caveats</summary><p>{squareMetrics.note}</p><p>{planCalibration.uncertainty}</p><ul>{spatialRelationships.map(r=><li key={`${r.from}:${r.to}`}>{r.from} → {r.to}: {r.relation}</li>)}</ul></details>
 </main>;
}
