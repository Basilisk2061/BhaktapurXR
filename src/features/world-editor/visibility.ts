import type {EditorSnapshot} from "./session";
export function isEditorEntryVisible(id:string,parentId:string|undefined,state:Pick<EditorSnapshot,"hidden"|"isolateId">){if(state.hidden[id]||(parentId&&state.hidden[parentId]))return false;const isolate=state.isolateId;return !isolate||id===isolate||parentId===isolate||isolate.startsWith(id+"/");}
