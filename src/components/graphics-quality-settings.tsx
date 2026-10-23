"use client";
import {setGraphicsQuality,useGraphicsQuality} from '../lib/graphics-quality';
import type {QualityPreset} from '../types/quality';
export function GraphicsQualitySettings(){
 const quality=useGraphicsQuality();
 const choices:[QualityPreset,string][]=[['VERY LOW','Maximum performance for older phones and PCs'],['LOW','Performance'],['MEDIUM','Balanced'],['HIGH','Best visuals']];
 return <section className="graphics-settings" aria-label="Graphics quality"><h2>Graphics Quality</h2><div className="graphics-choices" role="group" aria-label="Graphics quality preset">{choices.map(([value,description])=><button type="button" key={value} aria-pressed={quality===value} onClick={()=>setGraphicsQuality(value)}><strong>{value}</strong><span>{description}</span></button>)}</div></section>;
}
