"use client";
import dynamic from 'next/dynamic';
import {Suspense,useEffect,useState} from 'react';
import {useRouter} from 'next/navigation';
import {PUBLIC_EXPLORE_HREF} from '../../game/world/world-mode';
import type {TransformOverrides} from '../../features/world-editor/transforms';
const Model=dynamic(()=>import('./hero-model'),{ssr:false,loading:()=>null});
export function HeroArtifact({overrides}:{overrides:TransformOverrides}){const [start,setStart]=useState(false),router=useRouter();useEffect(()=>{
 const start=()=>{setStart(true);router.prefetch(PUBLIC_EXPLORE_HREF);};
 if(window.requestIdleCallback){const idle=window.requestIdleCallback(start,{timeout:1800});return()=>window.cancelIdleCallback(idle);}
 const timer=setTimeout(start,900);return()=>clearTimeout(timer);
 },[router]);return start?<Suspense fallback={null}><Model overrides={overrides}/></Suspense>:null;}
