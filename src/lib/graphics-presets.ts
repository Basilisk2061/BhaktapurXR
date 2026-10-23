import type {QualityPreset} from '../types/quality';
export interface GraphicsBudget {
 dpr:[number,number];mobileDpr:number;shadows:boolean;shadowSize:number;shadowExtent:number;
 shadowMinRadius:number;sky:'flat'|'gradient'|'cheap'|'hdr';sun:number;hemisphere:number;ambient:number;
 exposure:number;post:boolean;anisotropy:number;bump:boolean;
}
export const graphicsPresets:Record<QualityPreset,GraphicsBudget>={
 'VERY LOW':{dpr:[.55,.75],mobileDpr:.7,shadows:false,shadowSize:0,shadowExtent:32,shadowMinRadius:Infinity,sky:'cheap',sun:2.9,hemisphere:1.65,ambient:0,exposure:1,post:false,anisotropy:1,bump:false},
 LOW:{dpr:[.75,1],mobileDpr:1,shadows:false,shadowSize:1024,shadowExtent:32,shadowMinRadius:Infinity,sky:'flat',sun:2.9,hemisphere:1.65,ambient:.3,exposure:1,post:false,anisotropy:1,bump:false},
 MEDIUM:{dpr:[1,1.35],mobileDpr:1.25,shadows:true,shadowSize:2048,shadowExtent:42,shadowMinRadius:1,sky:'gradient',sun:3.35,hemisphere:1.55,ambient:.27,exposure:1,post:false,anisotropy:2,bump:true},
 HIGH:{dpr:[1,2],mobileDpr:1.5,shadows:true,shadowSize:4096,shadowExtent:48,shadowMinRadius:.45,sky:'hdr',sun:3.25,hemisphere:.28,ambient:.02,exposure:.98,post:true,anisotropy:8,bump:true},
};
export const graphicsSetting={key:'bhaktapurxr.graphics-quality.v1',event:'bhaktapurxr:graphics-quality'} as const;
