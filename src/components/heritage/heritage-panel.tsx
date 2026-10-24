import {useState} from "react";
import type {HeritageLandmark} from "../../game/heritage/types";
const safeUrl=(value?:string)=>value&&/^https?:\/\//i.test(value)?value:undefined;
const safeImage=(value:string)=>/^https?:\/\//i.test(value)||/^\/(?!\/)/.test(value)?value:undefined;
function Identity({record}:{record:HeritageLandmark}){
 return <><p className="heritage-kicker">{record.category.replaceAll("_"," ")} &middot; Bhaktapur Durbar Square</p>{record.period&&<p className="heritage-period">{record.period}</p>}{record.localName&&<p>{record.localName}</p>}{!!record.alternateNames?.length&&<p className="heritage-aliases">{record.alternateNames.join(" / ")}</p>}</>;
}
export function HeritagePanel({record}:{record:HeritageLandmark}){
 const [imageIndex,setImageIndex]=useState(0),[failed,setFailed]=useState<string|null>(null);
 const images=(record.images??[]).filter(i=>safeImage(i.src)),image=images[imageIndex%Math.max(1,images.length)];
 const evidence=record.reconstruction;
 return <article className="heritage-exhibit heritage-book">
  <aside className="heritage-page-left" aria-label="Photographs, quick facts and timeline">
   <header className="heritage-heading">
    {record.developmentSample&&<p className="heritage-sample">Development sample &middot; content not yet published</p>}
    <p className="heritage-page-label">Heritage of Bhaktapur</p>
    <h1 id="heritage-title">{record.name}</h1>
    <div className="heritage-chapter-divider" aria-hidden="true"><span>&#9670;</span></div>
   </header>
   {image&&<>
   <p className="heritage-page-label">From the square / Photographic record</p>
   <figure className="heritage-media">
    {failed===image.src?<p role="status">Photograph unavailable.</p>:/* Preserve the licensed photograph's whole frame. */
     // eslint-disable-next-line @next/next/no-img-element
     <img src={safeImage(image.src)} alt={image.alt} loading="lazy" decoding="async" onError={()=>setFailed(image.src)}/>}
    <figcaption>{image.caption&&<p>{image.caption}</p>}{image.credit&&<p>Photograph: {image.credit}</p>}{image.license&&<p>License: {safeUrl(image.licenseUrl)?<a href={safeUrl(image.licenseUrl)} target="_blank" rel="noopener noreferrer">{image.license}</a>:image.license}</p>}{safeUrl(image.sourceUrl)&&<a href={safeUrl(image.sourceUrl)} target="_blank" rel="noopener noreferrer">Original image &amp; attribution &#8599;</a>}{image.modifications&&<p className="heritage-image-note">{image.modifications}</p>}</figcaption>
   </figure>
   {images.length>1&&<nav className="heritage-gallery" aria-label="Photograph gallery"><button type="button" onClick={()=>setImageIndex(i=>(i-1+images.length)%images.length)}>Previous</button><span aria-live="polite">{imageIndex%images.length+1} / {images.length}</span><button type="button" onClick={()=>setImageIndex(i=>(i+1)%images.length)}>Next</button></nav>}
   </>}
   <div className="heritage-photo-identity"><Identity record={record}/></div>
   {!!record.quickFacts?.length&&<section className="heritage-quick-facts"><h2>Quick facts</h2><dl>{record.quickFacts.map(fact=><div key={fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>)}</dl></section>}
   {!!record.timeline?.length&&<section className="heritage-timeline"><h2>Through time</h2><ol>{record.timeline.map((event,i)=><li key={event.date+i}><p className="heritage-timeline-date">{event.date}</p><p>{event.event}</p></li>)}</ol></section>}
   <p className="heritage-folio">Bhaktapur &middot; The place and its record</p>
  </aside>
  <div className="heritage-content">
   <p className="heritage-page-label">Stories from the royal square</p>
   {([['The story',record.story??[record.overview,record.history].filter(Boolean).join('\n\n')],['Why it was built',record.purpose],['Patronage & makers',record.patron],['Religion & cultural life',record.culturalRole],['Architecture',record.architecture]] as const).map(([label,text])=>text?.trim()?<section key={label}><h2>{label}</h2>{text.split(/\n\s*\n/).map((paragraph,i)=><p key={i}>{paragraph}</p>)}</section>:null)}
   {!!record.whatToNotice?.length&&<section className="heritage-look-for"><h2>Look for</h2><ul>{record.whatToNotice.map(item=><li key={item}>{item}</li>)}</ul></section>}
   {([['What happened to it',record.restoration],['Why it matters',record.significance]] as const).map(([label,text])=>text?.trim()?<section key={label}><h2>{label}</h2>{text.split(/\n\s*\n/).map((paragraph,i)=><p key={i}>{paragraph}</p>)}</section>:null)}
   {evidence&&<section className="heritage-reconstruction"><h2>Reconstruction in BhaktapurXR</h2><dl>{(['identity','placement','architecture','dimensions'] as const).map(key=>evidence[key]?<div key={key}><dt>{key}</dt><dd><span className={`heritage-evidence heritage-evidence-${evidence[key]!.toLowerCase()}`}>{evidence[key]!.replaceAll('_',' ')}</span></dd></div>:null)}</dl>{evidence.note&&<p>{evidence.note}</p>}</section>}
   {(!!record.sources?.length||images.length>0)&&<details className="heritage-sources"><summary>Sources &amp; further reading / Image credits</summary>
    {!!record.sources?.length&&<><h2>Sources &amp; further reading</h2><ol>{record.sources.map((source,i)=><li key={source.id??i}>{source.organization&&<p className="heritage-source-author">{source.organization}</p>}{safeUrl(source.url)?<a href={safeUrl(source.url)} target="_blank" rel="noopener noreferrer">{source.title} &#8599;</a>:<span>{source.title}</span>}{source.note&&<p>{source.note}</p>}</li>)}</ol></>}
    {images.length>0&&<><h2>Image credits</h2><ul>{images.map((entry,i)=><li key={entry.src+i}>{entry.credit??'Credit not yet supplied'}{entry.license&&<> / {safeUrl(entry.licenseUrl)?<a href={safeUrl(entry.licenseUrl)} target="_blank" rel="noopener noreferrer">{entry.license}</a>:entry.license}</>}{safeUrl(entry.sourceUrl)&&<> / <a href={safeUrl(entry.sourceUrl)} target="_blank" rel="noopener noreferrer">Source</a></>}{entry.modifications&&<p>{entry.modifications}</p>}</li>)}</ul></>}
   </details>}
   <p className="heritage-colophon">BhaktapurXR &middot; A record of the square</p>
  </div>
 </article>;
}
