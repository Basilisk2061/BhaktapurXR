import type {QualityPreset} from '../../types/quality';

/** Small texture-only glTF views reference the original GLB buffer, not duplicate geometry files. */
export function characterAsset(asset:string,quality:QualityPreset){
 return quality==='VERY LOW'&&asset.endsWith('.glb')?asset.slice(0,-4)+'-very-low.gltf':asset;
}
