"use client";
import dynamic from 'next/dynamic';
import {useEffect,type ComponentProps} from 'react';
import {ExperienceLoading} from './experience-loading';
import {ExperienceErrorBoundary} from './experience-error-boundary';
import {startupMark,startupError} from '../game/startup-diagnostics';
type ExploreProps=ComponentProps<typeof import('./experience').Experience>;
const ImportedExperience=dynamic<ExploreProps>(()=>{
 startupMark('Experience import requested');
 return import('./experience').then(module=>{
  startupMark('Experience import resolved');
  startupMark('Experience component received');
  return module.Experience;
 }).catch(error=>{
  startupMark('Experience import rejected','ERROR',error instanceof Error?error.message:String(error));
  startupError(error,'Experience import');
  throw error;
 });
},{ssr:false,loading:()=> <ExperienceLoading/>});
export function ExploreClient(props:ExploreProps){
 startupMark('Explore route render attempted');
 useEffect(()=>{startupMark('Explore route client mounted');},[]);
 return <ExperienceErrorBoundary><ImportedExperience {...props}/></ExperienceErrorBoundary>;
}
