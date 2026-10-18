export type HeritageEvidence="VERIFIED"|"PHOTO_INFERRED"|"APPROXIMATE"|"PROVISIONAL"|"UNKNOWN";
export interface HeritageImage {src:string;alt:string;caption?:string;credit?:string;sourceUrl?:string;license?:string;licenseUrl?:string;originalUrl?:string;sourceDate?:string;modifications?:string;attributionRequired?:string}
export interface HeritageSource {id?:string;title:string;organization?:string;url?:string;note?:string}
export interface HeritageResearch {reviewed:string;claims:{id:string;field:string;statement:string;sourceIds:string[];locator:string}[];conflicts:string[];unresolved:string[]}
export interface HeritageReconstructionEvidence {identity?:HeritageEvidence;placement?:HeritageEvidence;architecture?:HeritageEvidence;dimensions?:HeritageEvidence;note?:string}
export interface HeritageLandmark {
 id:string;name:string;localName?:string;alternateNames?:string[];
 category:"TEMPLE"|"PALACE"|"GATE"|"MONUMENT"|"PAVILION"|"MUSEUM"|"OTHER";
 developmentSample?:boolean;period?:string;overview?:string;history?:string;architecture?:string;significance?:string;
 images?:HeritageImage[];sources?:HeritageSource[];reconstruction?:HeritageReconstructionEvidence;research?:HeritageResearch;
}
export interface HeritageInteractionZone {landmarkId:string;heritageId:string;position:[number,number,number];radius:number;label?:string}
