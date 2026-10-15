"use client";
import dynamic from "next/dynamic";
const Model=dynamic(()=>import("./hero-model"),{ssr:false,loading:()=> <div className="model-loading" aria-label="Loading decorative pagoda miniature"/>});
export function HeroArtifact(){return <Model/>;}
