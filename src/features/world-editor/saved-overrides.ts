import savedState from '../bhaktapur/data/world-editor-state.json' with {type:'json'};
import manual from '../bhaktapur/data/manual-transform-overrides.json' with {type:'json'};
import {mergeTransformOverrides} from './resolve-transforms.ts';
/** Build/client architecture shares exactly the runtime reader's precedence. */
export const currentOverrides=()=>mergeTransformOverrides(manual,savedState.transforms);
