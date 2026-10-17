import type {CentralModel} from "./central-model";
export interface WorldRenderData {models:CentralModel[];urban:{models:CentralModel[];groundPatches:{x:number;z:number;width:number;depth:number}[]};diagnostics?:Record<string,unknown>}
