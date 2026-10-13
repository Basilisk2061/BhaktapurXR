import type {Group} from "three";
import type {EditorSnapshot} from "./session";
import type {TransformOverrides} from "./transforms";
export interface AssemblyEditorBinding {ids:Set<string>;state:EditorSnapshot;activePartParent:string|null;transforms:TransformOverrides;hidden:Record<string,boolean>;walk:boolean;dragging:boolean;select:(id:string|null)=>void;register:(id:string,group:Group|null)=>void}
