"use client";
import dynamic from 'next/dynamic';
import type {ComponentProps} from 'react';
import {ExperienceLoading} from './experience-loading';
import {ExperienceErrorBoundary} from './experience-error-boundary';
type ExploreProps=ComponentProps<typeof import('./experience').Experience>;
const ImportedExperience=dynamic<ExploreProps>(()=>import('./experience').then(module=>module.Experience),{
 ssr:false,
 loading:()=> <ExperienceLoading/>,
});
export function ExploreClient(props:ExploreProps){
 return <ExperienceErrorBoundary><ImportedExperience {...props}/></ExperienceErrorBoundary>;
}
