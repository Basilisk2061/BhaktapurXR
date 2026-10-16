"use client";
import dynamic from 'next/dynamic';
import type {TransformOverrides} from '../../features/world-editor/transforms';
const Model=dynamic(()=>import('./hero-model'),{ssr:false,loading:()=>null});
export function HeroArtifact({overrides}:{overrides:TransformOverrides}){return <Model overrides={overrides}/>;}
