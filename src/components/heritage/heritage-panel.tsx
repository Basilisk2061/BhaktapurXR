import {useState} from "react";
import type {HeritageLandmark,HeritageLanguage} from "../../game/heritage/types";
import {heritageLabels,localizeHeritage} from "../../game/heritage/localization";
const safeUrl=(value?:string)=>value&&/^https?:\/\//i.test(value)?value:undefined;
const safeImage=(value:string)=>/^https?:\/\//i.test(value)||/^\/(?!\/)/.test(value)?value:undefined;
function Identity({record,language}:{record:HeritageLandmark;language:HeritageLanguage}){
 const labels=heritageLabels(language);
 return <><p className="heritage-kicker">{labels.categories[record.category]} &middot; {labels.square}</p>{record.period&&<p className="heritage-period">{record.period}</p>}{record.localName&&<p>{record.localName}</p>}{!!record.alternateNames?.length&&<p className="heritage-aliases">{record.alternateNames.join(" / ")}</p>}</>;
}
export function HeritagePanel({record:canonical,language="en"}:{record:HeritageLandmark;language?:HeritageLanguage}){
 const record=localizeHeritage(canonical,language),labels=heritageLabels(language);
 const [imageIndex,setImageIndex]=useState(0),[failed,setFailed]=useState<string|null>(null);
 const images=(record.images??[]).filter(i=>safeImage(i.src)),image=images[imageIndex%Math.max(1,images.length)];
 const evidence=record.reconstruction;
 return <article className="heritage-exhibit heritage-book" lang={language}>
  <aside className="heritage-page-left" aria-label={labels.leftPage}>
   <header className="heritage-heading">
    {record.developmentSample&&<p className="heritage-sample">{labels.sample}</p>}
    <p className="heritage-page-label">{labels.heading}</p>
    <h1 id="heritage-title">{record.name}</h1>
    <div className="heritage-chapter-divider" aria-hidden="true"><span>&#9670;</span></div>
   </header>
   {image&&<>
   <p className="heritage-page-label">{labels.photoRecord}</p>
   <figure className="heritage-media">
    {failed===image.src?<p role="status">{labels.unavailable}</p>:/* Preserve the licensed photograph's whole frame. */
     // eslint-disable-next-line @next/next/no-img-element
     <img src={safeImage(image.src)} alt={image.alt} loading="lazy" decoding="async" onError={()=>setFailed(image.src)}/>}
    <figcaption>{image.caption&&<p>{image.caption}</p>}{image.credit&&<p>{labels.photograph}: <span lang="en">{image.credit}</span></p>}{image.license&&<p>{labels.license}: {safeUrl(image.licenseUrl)?<a href={safeUrl(image.licenseUrl)} target="_blank" rel="noopener noreferrer" lang="en">{image.license}</a>:<span lang="en">{image.license}</span>}</p>}{safeUrl(image.sourceUrl)&&<a href={safeUrl(image.sourceUrl)} target="_blank" rel="noopener noreferrer">{labels.original}</a>}{image.modifications&&<p className="heritage-image-note">{image.modifications}</p>}</figcaption>
   </figure>
   {images.length>1&&<nav className="heritage-gallery" aria-label={labels.gallery}><button type="button" onClick={()=>setImageIndex(i=>(i-1+images.length)%images.length)}>{labels.previous}</button><span aria-live="polite">{imageIndex%images.length+1} / {images.length}</span><button type="button" onClick={()=>setImageIndex(i=>(i+1)%images.length)}>{labels.next}</button></nav>}
   </>}
   <div className="heritage-photo-identity"><Identity record={record} language={language}/></div>
   {!!record.quickFacts?.length&&<section className="heritage-quick-facts"><h2>{labels.facts}</h2><dl>{record.quickFacts.map(fact=><div key={fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>)}</dl></section>}
   {!!record.timeline?.length&&<section className="heritage-timeline"><h2>{labels.timeline}</h2><ol>{record.timeline.map((event,i)=><li key={event.date+i}><p className="heritage-timeline-date">{event.date}</p><p>{event.event}</p></li>)}</ol></section>}
   <p className="heritage-folio">{labels.folio}</p>
  </aside>
  <div className="heritage-content">
   <p className="heritage-page-label">{labels.stories}</p>
   {([[labels.story,record.story??[record.overview,record.history].filter(Boolean).join('\n\n')],[labels.purpose,record.purpose],[labels.patron,record.patron],[labels.culture,record.culturalRole],[labels.architecture,record.architecture]] as const).map(([label,text])=>text?.trim()?<section key={label}><h2>{label}</h2>{text.split(/\n\s*\n/).map((paragraph,i)=><p key={i}>{paragraph}</p>)}</section>:null)}
   {!!record.whatToNotice?.length&&<section className="heritage-look-for"><h2>{labels.look}</h2><ul>{record.whatToNotice.map(item=><li key={item}>{item}</li>)}</ul></section>}
   {([[labels.restoration,record.restoration],[labels.significance,record.significance]] as const).map(([label,text])=>text?.trim()?<section key={label}><h2>{label}</h2>{text.split(/\n\s*\n/).map((paragraph,i)=><p key={i}>{paragraph}</p>)}</section>:null)}
   {evidence&&<section className="heritage-reconstruction"><h2>{labels.reconstruction}</h2><dl>{(['identity','placement','architecture','dimensions'] as const).map(key=>evidence[key]?<div key={key}><dt>{labels.evidenceKeys[key]}</dt><dd><span className={`heritage-evidence heritage-evidence-${evidence[key]!.toLowerCase()}`}>{labels.evidence[evidence[key]!]}</span></dd></div>:null)}</dl>{evidence.note&&<p>{evidence.note}</p>}</section>}
   {(!!record.sources?.length||images.length>0)&&<details className="heritage-sources"><summary>{labels.sourcesSummary}</summary>
    {!!record.sources?.length&&<><h2>{labels.sources}</h2><ol>{record.sources.map((source,i)=><li key={source.id??i}>{source.organization&&<p className="heritage-source-author" lang="en">{source.organization}</p>}{safeUrl(source.url)?<a href={safeUrl(source.url)} target="_blank" rel="noopener noreferrer" lang="en">{source.title} &#8599;</a>:<span lang="en">{source.title}</span>}{source.note&&<p>{source.note}</p>}</li>)}</ol></>}
    {images.length>0&&<><h2>{labels.credits}</h2><ul>{images.map((entry,i)=><li key={entry.src+i}>{entry.credit?<span lang="en">{entry.credit}</span>:labels.missingCredit}{entry.license&&<> / {safeUrl(entry.licenseUrl)?<a href={safeUrl(entry.licenseUrl)} target="_blank" rel="noopener noreferrer" lang="en">{entry.license}</a>:<span lang="en">{entry.license}</span>}</>}{safeUrl(entry.sourceUrl)&&<> / <a href={safeUrl(entry.sourceUrl)} target="_blank" rel="noopener noreferrer">{labels.source}</a></>}{entry.modifications&&<p>{entry.modifications}</p>}</li>)}</ul></>}
   </details>}
   <p className="heritage-colophon">{labels.colophon}</p>
  </div>
 </article>;
}
