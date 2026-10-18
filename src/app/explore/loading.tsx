"use client";
import {useEffect} from 'react';
import {ExperienceLoading} from '../../components/experience-loading';
import {startupMark,startupInfo} from '../../game/startup-diagnostics';
export default function Loading(){
 useEffect(()=>{startupMark('Route loading shell hydrated');startupInfo('Route shell','server route is pending; Experience may not have been delivered yet');},[]);
 return <div className="relative h-screen"><ExperienceLoading/></div>;
}
