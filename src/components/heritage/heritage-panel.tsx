import {useState} from "react";
import type {HeritageLandmark} from "../../game/heritage/types";
const safeUrl=(value?:string)=>value&&/^https?:\/\//i.test(value)?value:undefined;
const safeImage=(value:string)=>/^https?:\/\//i.test(value)||/^\/(?!\/)/.test(value)?value:undefined;
export function HeritagePanel({record}:{record:HeritageLandmark}){
 const [imageIndex,setImageIndex]=useState(0),[failed,setFailed]=useState<string|null>(null);
 const images=(record.images??[]).filter(i=>safeImage(i.src)),image=images[imageIndex%Math.max(1,images.length)];
 const evidence=record.reconstruction;
 return <>
  <header className="heritage-heading">
   {record.developmentSample&&<p className="heritage-sample">Development sample &middot; content not yet published</p>}
   <p className="heritage-kicker">{record.category.replaceAll("_"," ")}{record.period?` / ${record.period}`:""}</p>
   <h1 id="heritage-title">{record.name}</h1>
   {record.localName&&<p>{record.localName}</p>}
   {!!record.alternateNames?.length&&<p className="heritage-aliases">{record.alternateNames.join(" / ")}</p>}
  </header>
  <div className={`heritage-exhibit${image?' heritage-with-media':''}`}>
   {image&&<figure className="heritage-media">
    {failed===image.src?<p role="status">Photograph unavailable.</p>:/* Licensed record images are displayed directly; no remote optimization configuration required. */
     // eslint-disable-next-line @next/next/no-img-element
     <img src={safeImage(image.src)} alt={image.alt} onError={()=>setFailed(image.src)}/>}
    <figcaption>{image.caption&&<p>{image.caption}</p>}{image.credit&&<p>{image.credit}</p>}{image.license&&<p>License: {safeUrl(image.licenseUrl)?<a href={safeUrl(image.licenseUrl)} target="_blank" rel="noopener noreferrer">{image.license}</a>:image.license}</p>}{image.modifications&&<p>{image.modifications}</p>}{safeUrl(image.sourceUrl)&&<a href={safeUrl(image.sourceUrl)} target="_blank" rel="noopener noreferrer">Image source</a>}</figcaption>
    {images.length>1&&<div className="heritage-gallery" aria-label="Photograph gallery"><button type="button" onClick={()=>setImageIndex(i=>(i-1+images.length)%images.length)}>Previous</button><span aria-live="polite">{imageIndex%images.length+1} / {images.length}</span><button type="button" onClick={()=>setImageIndex(i=>(i+1)%images.length)}>Next</button></div>}
   </figure>}
   <div className="heritage-content">
    {([['Overview',record.overview],['History',record.history],['Architecture',record.architecture],['Cultural significance',record.significance]] as const).map(([label,text])=>text?.trim()?<section key={label}><h2>{label}</h2><p>{text}</p></section>:null)}
    {evidence&&<section className="heritage-reconstruction"><h2>About this reconstruction</h2><dl>{(['identity','placement','architecture','dimensions'] as const).map(key=>evidence[key]?<div key={key}><dt>{key}</dt><dd><span className={`heritage-evidence heritage-evidence-${evidence[key]!.toLowerCase()}`}>{evidence[key]!.replaceAll('_',' ')}</span></dd></div>:null)}</dl>{evidence.note&&<p>{evidence.note}</p>}</section>}
    {(!!record.sources?.length||images.length>0)&&<details className="heritage-sources"><summary>Sources &amp; image credits</summary>
     {!!record.sources?.length&&<><h2>Sources</h2><ul>{record.sources.map((source,i)=><li key={i}>{source.organization&&<p>{source.organization}</p>}{safeUrl(source.url)?<a href={safeUrl(source.url)} target="_blank" rel="noopener noreferrer">{source.title} &#8599;</a>:<span>{source.title}</span>}{source.note&&<p>{source.note}</p>}</li>)}</ul></>}
     {images.length>0&&<><h2>Image credits</h2><ul>{images.map((entry,i)=><li key={entry.src+i}>{entry.credit??'Credit not yet supplied'}{entry.license&&<> / {safeUrl(entry.licenseUrl)?<a href={safeUrl(entry.licenseUrl)} target="_blank" rel="noopener noreferrer">{entry.license}</a>:entry.license}</>}{safeUrl(entry.sourceUrl)&&<> / <a href={safeUrl(entry.sourceUrl)} target="_blank" rel="noopener noreferrer">Source</a></>}</li>)}</ul></>}
    </details>}
   </div>
  </div>
 </>;
}
