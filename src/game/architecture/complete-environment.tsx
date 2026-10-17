import {useMemo} from "react";
import {buildCompletedSquareModels,buildCompletedSquareEdge} from "./square-completion";
import {CentralHeritageEnvironment} from "./central-environment";
import type {ComponentProps} from "react";
export default function CompleteEnvironment(props:Omit<ComponentProps<typeof CentralHeritageEnvironment>,"data">){
 const data=useMemo(()=>({models:buildCompletedSquareModels(),urban:buildCompletedSquareEdge()}),[]);
 return <CentralHeritageEnvironment {...props} data={data}/>;
}
