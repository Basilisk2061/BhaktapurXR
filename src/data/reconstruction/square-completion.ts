import type {Point} from "./types.ts";
// Completion envelope in the accepted local frame: whole main square, not only a walking corridor.
// Eastern limit deliberately stops before the separate Khwopa/guest-house precinct.
export const phase9cBoundary:Point[]=[[-148,-80],[78,-80],[78,49],[-148,49],[-148,-80]];
export const phase9cZones=["A Khauma / Old Town entrance","B Western shrine cluster","C Museum / western palace approach","D Golden Gate / palace frontage","E Central monument field","F Southern edge / Yaksheshwar","G Eastern square / Siddhi / Fasidega","H Royal Palace depth","I Contextual edge architecture"];
export const phase9cEvidence={
 baseline:"6c06fd4458bb23353da09e27735f5afe1bbef084",
 geometry:"Existing calibrated geographic frame / source footprint topology; no approved monument transform changes",
 appearance:"PHOTO_INFERRED Newar brick/timber/tile vocabulary; restrained ordinary elevations and storeys RECONSTRUCTED_APPROXIMATE",
 palace:"PLAN_INFERRED exterior volume of mapped palace envelope 18962138; all three source court holes preserved; no invented accessible interiors or exposed Taleju",
 sources:[
  {id:"local-plan",url:"reference/bhaktapur/digital-himalaya/map.jpg",use:"Ordering, palace court voids and main region; schematic, not survey"},
  {id:"owner-views",url:"reference/khauma-gate/inside-square-reference.mp4",use:"Entrance/long covered sitting edge; sampled frames, no metric depth from pan"},
  {id:"local-palace",url:"reference/khauma-gate/golden-gate-palace-westward-view.jpg",use:"Approved frontage and contrasting roof/material relationships"},
  {id:"nhdp-layku",url:"https://danam.cats.uni-heidelberg.de/4259eb80-deb6-402a-8413-0c2771c98893/l%C4%81yk%C5%AB-phalc%C4%81-bhaktapur/",use:"Two-storey L-shaped eastern arcade, restored 2020; not the southern Yetachapari"},
  {id:"doa-2018",url:"https://whc.unesco.org/document/165534",use:"Separate eastern Yantra Vatsala and four-post Rameshwar; temple identity conflict kept explicit"},
  {id:"nhdp-vatsala",url:"https://danam.cats.uni-heidelberg.de/aea67ec1-6cb8-4171-997f-1d6791011183/vatsal%C4%81-mandira-bhaktapur/",use:"Multiple Vatsala temples; retained central twelve-column stone temple"},
  {id:"silu-2025",url:"https://commons.wikimedia.org/wiki/File:Silu_Mahadev_Temple.jpg",use:"Re-inspected cached current image; restored tower preserved, nearby small brick shikhara form"},
 ],
 unresolved:["Exact private elevations/storeys","House of Malla individual binding","Eastern Vatsala/Yantra name-to-footprint correspondence","Layku-to-source-lot correspondence","Jagannath identity/form/placement","Hidden palace interiors"],
} as const;
export function phase9cZone([x,z]:Point){return z< -27&&x> -80?"H":x< -117?"A":x< -80?"B":x< -58&&z<0?"C":z>25?"F":x>16?"G":z>9?"F":"I";}
