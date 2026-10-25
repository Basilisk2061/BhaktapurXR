export type HeritageEvidence="VERIFIED"|"PHOTO_INFERRED"|"APPROXIMATE"|"PROVISIONAL"|"UNKNOWN";
export interface HeritageImage {src:string;alt:string;caption?:string;credit?:string;sourceUrl?:string;license?:string;licenseUrl?:string;originalUrl?:string;sourceDate?:string;modifications?:string;attributionRequired?:string}
export interface HeritageSource {id?:string;title:string;organization?:string;url?:string;note?:string}
export interface HeritageResearch {reviewed:string;claims:{id:string;field:string;statement:string;sourceIds:string[];locator:string}[];conflicts:string[];unresolved:string[]}
export interface HeritageReconstructionEvidence {identity?:HeritageEvidence;placement?:HeritageEvidence;architecture?:HeritageEvidence;dimensions?:HeritageEvidence;note?:string}
export interface HeritageQuickFact {label:string;value:string;sourceIds:string[]}
export interface HeritageTimelineEvent {date:string;event:string;sourceIds:string[]}
export type HeritageLanguage="en"|"ne";
/** Presentation only: provenance, rights and evidence classifications stay canonical. */
export interface HeritageTranslation {
 name:string;localName?:string;alternateNames:string[];period:string;
 story:string;purpose:string;patron:string;culturalRole:string;architecture:string;
 whatToNotice:string[];restoration:string;significance:string;
 quickFacts:{label:string;value:string}[];timeline:{date:string;event:string}[];
 reconstructionDetail?:string;
}
export interface HeritageLandmark {
 id:string;name:string;localName?:string;alternateNames?:string[];
 category:"TEMPLE"|"PALACE"|"GATE"|"MONUMENT"|"PAVILION"|"MUSEUM"|"OTHER";
 developmentSample?:boolean;period?:string;overview?:string;history?:string;architecture?:string;significance?:string;restoration?:string;
 quickFacts?:HeritageQuickFact[];timeline?:HeritageTimelineEvent[];story?:string;purpose?:string;patron?:string;culturalRole?:string;whatToNotice?:string[];
 images?:HeritageImage[];sources?:HeritageSource[];reconstruction?:HeritageReconstructionEvidence;research?:HeritageResearch;
}
export type HeritageSpatialArea={kind:"frontage";start:[number,number,number];end:[number,number,number];front:[number,number,number];depth:number}|{kind:"footprint";vertices:[number,number,number][];margin:number};
export interface HeritageInteractionZone {area?:HeritageSpatialArea;visibleFrom?:(position:{x:number;y:number;z:number},target:[number,number,number])=>boolean;landmarkId:string;heritageId:string;position:[number,number,number];radius:number;label?:string}
