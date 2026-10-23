import {useMemo} from "react";
import {buildTalejuWorldData} from "./taleju/precinct";
import {CentralHeritageEnvironment} from "./central-environment";
import type {ComponentProps} from "react";
export default function CompleteEnvironment(props:Omit<ComponentProps<typeof CentralHeritageEnvironment>,"data">){
 const data=useMemo(()=>buildTalejuWorldData(),[]);
 return <CentralHeritageEnvironment {...props} data={data}/>;
}
