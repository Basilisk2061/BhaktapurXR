import type {Group} from "three";
import type {TransformOverrides} from "./transforms";
export interface AssemblyEditorBinding {ids:Set<string>;transforms:TransformOverrides;hidden:Record<string,boolean>;walk:boolean;dragging:boolean;select:(id:string|null)=>void;register:(id:string,group:Group|null)=>void}
