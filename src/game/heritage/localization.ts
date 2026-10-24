import canonical from "./records.json";
import translations from "./records.ne.json";
import photographs from "./images.json";
import sources from "./sources.json";
import type {HeritageLandmark,HeritageLanguage,HeritageTranslation} from "./types";

type HeritageId=keyof typeof canonical;
/** Adding a canonical landmark requires a complete Nepali presentation. */
const nepali=translations satisfies Record<HeritageId,HeritageTranslation>;
const captions={
 "golden-gate":"सुनको ढोकाको सुनले मढिएको प्रवेश र तोरण।",
 "fifty-five-frontage":"पचपन्न झ्याले दरबारको नक्कासीदार काठको झ्यालमाला।",
 "gallery-frontage":"राष्ट्रिय कला सङ्ग्रहालयको प्रवेशमा रहेका रक्षक मूर्ति।",
 "gopinath-krishna":"पश्चिमी प्रवेश समूहको दुई छाने मन्दिर; परियोजनाको योजना र पुरातत्त्व विभागका अभिलेखबाट गोपीनाथ / द्वारिकाका रूपमा पहिचान गरिएको।",
 "vatsala-durga":"वत्सला दुर्गा र अगाडिको प्राङ्गण, 2026 को तस्बिर।",
 "large-bell":"बायाँ ठूलो घण्टा, पछाडि च्यासिलिन मण्डप। 2015 को यो तस्बिरमा भूकम्पले भत्किएको वत्सलाका अवशेष पनि छन्; यो वर्तमान दृश्य होइन।",
 "malla-column":"ढुङ्गे स्तम्भमाथि भूपतीन्द्र मल्लको प्रतिमा, सजावटी शीर्ष र छत्र।",
 "chyasilin":"अष्टकोणीय च्यासिलिन मण्डपका नक्कासीदार खम्बा र तल्लो तह।",
 "khauma-gate":"भक्तपुर दरबार क्षेत्रको पश्चिमी प्रवेशद्वार।",
 "yaksheshwar":"दुई छाने यक्षेश्वर / पशुपतिनाथ मन्दिर। भूकम्पपछिको यो तस्बिरमा वत्सलाका भग्नावशेष पनि देखिन्छन्।",
 "siddhi-lakshmi":"सिद्धि लक्ष्मी मन्दिर र रक्षक मूर्तिसहितको भर्‍याङ, 2021 को तस्बिर। पृष्ठभूमिको जीर्णोद्धार त्यस समयको सन्दर्भ हो।",
 "silu-mahadev":"पुनर्निर्मित सिलु महादेव / फसी देग र अग्लो तहगत आधार, 2024 को तस्बिर।",
 "gallery-frontage-wide":"राष्ट्रिय कला सङ्ग्रहालयको मोहडा र जोडिएको सेतो भाग, 2014 को तस्बिर।",
 "golden-gate-wide":"दरबारको मोहडाभित्र सुनको ढोका, 2014 को तस्बिर।"
} satisfies Record<keyof typeof photographs,string>;

const sourceNotes={
 "doa19":"स्मारकअनुसारका जीर्णोद्धार विवरण। PDF का पृष्ठ नम्बर 1 बाट गनिएका छन्।",
 "doa22":"स्मारकअनुसारका संरक्षण परियोजना विवरण। PDF का पृष्ठ नम्बर 1 बाट गनिएका छन्।",
 "cambridge":"संस्थागत व्याख्या र पहिचान खुलाइएका तस्बिर।",
 "palace06":"संरक्षण विवरण; प्रस्ताव हुनु पछि काम सकिएको प्रमाण होइन।",
 "ntb-bhaktapur":"दरबारको सामान्य कालक्रम विशिष्ट संरक्षण विवरणभन्दा फरक छ।",
 "ntb-museum":"संस्थाको स्थापना र सङ्ग्रहको जानकारी। आपसमा नमिलेका शिलालेखका मिति समावेश गरिएका छैनन्।",
 "ntb-cultural":"खोजी सूचीबाट मात्र थप पुष्टि; प्रत्यक्ष PDF प्राप्त भएन। प्रकाशित दाबीको एकमात्र स्रोत बनाइएको छैन।",
 "mandap":"2015 को प्रत्यक्ष पुनर्निर्माण अनुभव; Kapil Bisht को 2014 को लेखबाट विस्तार गरिएको।",
 "local-gopi":"स्थानीय द्वितीयक विवरण; देवताका नाम विभागको विवरणभन्दा फरक छन्।",
 "local-museum":"भवनको नामबारे स्थानीय द्वितीयक प्रमाण; सङ्ग्रहालयको स्थापना मितिबाट छुट्याइएको।",
 "local-vatsala":"द्वितीयक कालक्रम विभागसँग मिल्दैन; भिन्नता नखुलाई मिलाइएको छैन।",
 "local-yak":"भक्तपुरको स्मारक हो, काठमाडौँको मन्दिर परिसर होइन।",
 "local-bell":"स्थापना गराउनेबारे स्थानीय द्वितीयक स्रोतको दाबी र उल्लेख गरिएको अभिलेख; ठ्याक्कै दिन स्वतन्त्र अभिलेखीय जाँचबाट पुष्टि गरिएको छैन।",
 "local-column":"स्थानीय द्वितीयक व्याख्या उपलब्ध इजाजतप्राप्त नजिकको तस्बिरसँग तुलना गरिएको; सनसनीपूर्ण कथा हटाइएका छन्।",
 "ntb-world":"भक्तपुर खण्ड, छापिएको पृष्ठ 8। दरबार वा स्थानको सामान्य इतिहास हरेक बाँचेको झ्यालको मिति होइन।",
 "nhdp-vatsala":"भूपतीन्द्र / 1699 सम्बन्ध, बाह्र स्तम्भ र तीन तहको आधार। नगरपालिकाको पुनर्निर्माण 2020 मा सम्पन्न।",
 "getty-vatsala":"1696 मा जितामित्रको संरक्षण र अठारौँ शताब्दीको सुरुतिर पुनर्निर्माण। पुरानो ‘काम जारी’ स्थिति वर्तमान अवस्थाको प्रमाण होइन।",
 "rubin-siddhi":"2023 को लेख। भक्तपुरसम्बन्धी अनुच्छेदले सत्रौँ शताब्दीको मन्दिरलाई न्यातपोलबाट छुट्याउँछ। पाटनका अनुष्ठान र देखाइएको धातुमूर्ति यहाँ लागू गरिएका छैनन्।",
 "slusser82":"पृष्ठ 207 को खोजी-सूची अंश हेरियो; पूरा स्क्यानले 403 दियो। स्तम्भ स्थापना गराउनेको लिखित प्रमाण नभएको स्पष्ट छ; रणजितको परम्परा उल्लेख छ। 1737 को घण्टा र 1753 को ढोका प्रतिष्ठापन। अस्पष्ट बद्रीनाथ / गोपीनाथ अंश यस नमुनाको स्थापना प्रमाण बनाइएको छैन।",
 "doa-inventory":"सूचीको पृष्ठ 28 को खोजी-अंश हेरियो; पूरा फाइल प्राप्तिको आकार सीमाभन्दा ठूलो छ। सिलु / फसी देग सम्पन्न, आर्थिक वर्ष 2078/79 वि.सं. को टिप्पणी; गोपीनाथ / द्वारिका सम्पन्न। ठ्याक्कै दिनका विवरण मिलान वा रूपान्तरण गरिएको छैन।"
} satisfies Record<keyof typeof sources,string>;

function knownId(id:string):id is HeritageId {return Object.hasOwn(nepali,id);}
function sourceId(id:string):id is keyof typeof sourceNotes {return Object.hasOwn(sourceNotes,id);}
export function localizeHeritage(record:HeritageLandmark,language:HeritageLanguage):HeritageLandmark {
 if(language==="en"||!knownId(record.id))return record;
 const copy:HeritageTranslation=nepali[record.id];
 return {...record,...copy,
  // Preserve claim references and all non-translated metadata from the canonical record.
  quickFacts:record.quickFacts?.map((fact,i)=>({...fact,...copy.quickFacts[i]})),
  timeline:record.timeline?.map((event,i)=>({...event,...copy.timeline[i]})),
  images:record.images?.map(image=>{
   const photoKey=(Object.keys(photographs) as (keyof typeof photographs)[]).find(key=>photographs[key].src===image.src);
   return {...image,...(photoKey?{alt:captions[photoKey],caption:captions[photoKey]}:{}),
    modifications:image.modifications?"Commons को वेब आकारको प्रतिरूप; वास्तु वा दृश्यमा कुनै फेरबदल छैन।":undefined};
  }),
  sources:record.sources?.map(source=>({...source,note:source.id&&sourceId(source.id)?sourceNotes[source.id]:
   source.id?.startsWith("photo:")?"तस्बिर वास्तुको स्वरूपको प्रमाण मात्र हो; निर्माण मिति वा संरक्षकको प्रामाणिक स्रोत होइन।":source.note})),
  reconstruction:record.reconstruction?{...record.reconstruction,note:
   "पहिचानले यहाँ प्रतिनिधित्व गरिएको स्मारक जनाउँछ; नापजाँचबाट प्रमाणित स्थान वा हुबहु निर्माण होइन। मूल स्रोतको ज्यामिति, सुधार तह र सुरक्षित सम्पादक रूपान्तरण यथावत् छन्।"+
   (copy.reconstructionDetail?" "+copy.reconstructionDetail:"")}:undefined
 };
}

const english={
 heritage:"Heritage",close:"Close",closeLabel:"Close heritage information",language:"Heritage book language",
 leftPage:"Photographs, quick facts and timeline",sample:"Development sample · content not yet published",
 heading:"Heritage of Bhaktapur",photoRecord:"From the square / Photographic record",unavailable:"Photograph unavailable.",
 photograph:"Photograph",license:"License",original:"Original image & attribution ↗",gallery:"Photograph gallery",
 previous:"Previous",next:"Next",facts:"Quick facts",timeline:"Through time",folio:"Bhaktapur · The place and its record",
 stories:"Stories from the royal square",story:"The story",purpose:"Why it was built",patron:"Patronage & makers",
 culture:"Religion & cultural life",architecture:"Architecture",look:"Look for",restoration:"What happened to it",
 significance:"Why it matters",reconstruction:"Reconstruction in BhaktapurXR",
 sourcesSummary:"Sources & further reading / Image credits",sources:"Sources & further reading",credits:"Image credits",
 missingCredit:"Credit not yet supplied",source:"Source",colophon:"BhaktapurXR · A record of the square",
 square:"Bhaktapur Durbar Square",
 categories:{TEMPLE:"TEMPLE",PALACE:"PALACE",GATE:"GATE",MONUMENT:"MONUMENT",PAVILION:"PAVILION",MUSEUM:"MUSEUM",OTHER:"OTHER"},
 evidenceKeys:{identity:"identity",placement:"placement",architecture:"architecture",dimensions:"dimensions"},
 evidence:{VERIFIED:"VERIFIED",PHOTO_INFERRED:"PHOTO INFERRED",APPROXIMATE:"APPROXIMATE",PROVISIONAL:"PROVISIONAL",UNKNOWN:"UNKNOWN"}
};
type BookLabels=typeof english;
const nepaliLabels:BookLabels={
 heritage:"सम्पदा",close:"बन्द गर्नुहोस्",closeLabel:"सम्पदा पुस्तक बन्द गर्नुहोस्",language:"सम्पदा पुस्तकको भाषा",
 leftPage:"तस्बिर, मुख्य जानकारी र कालक्रम",sample:"विकासका क्रममा रहेको नमुना · सामग्री अझै प्रकाशित छैन",
 heading:"भक्तपुरको सम्पदा",photoRecord:"दरबार क्षेत्रबाट / तस्बिर अभिलेख",unavailable:"तस्बिर उपलब्ध छैन।",
 photograph:"तस्बिर",license:"प्रयोग अनुमति",original:"मूल तस्बिर र श्रेय ↗",gallery:"तस्बिर सङ्ग्रह",
 previous:"अघिल्लो",next:"अर्को",facts:"मुख्य जानकारी",timeline:"समयसँगै",folio:"भक्तपुर · स्थान र यसको अभिलेख",
 stories:"राजकीय प्राङ्गणका कथा",story:"यसको कथा",purpose:"किन बनाइयो",patron:"संरक्षक र निर्माता",
 culture:"धर्म र सांस्कृतिक जीवन",architecture:"वास्तुकला",look:"ध्यान दिएर हेर्नुहोस्",restoration:"क्षति र संरक्षण",
 significance:"यसको महत्त्व",reconstruction:"BhaktapurXR मा पुनर्निर्माण",
 sourcesSummary:"स्रोत र थप अध्ययन / तस्बिरको श्रेय",sources:"स्रोत र थप अध्ययन",credits:"तस्बिरको श्रेय",
 missingCredit:"श्रेय अझै उपलब्ध छैन",source:"स्रोत",colophon:"BhaktapurXR · दरबार क्षेत्रको अभिलेख",
 square:"भक्तपुर दरबार क्षेत्र",
 categories:{TEMPLE:"मन्दिर",PALACE:"दरबार",GATE:"प्रवेशद्वार",MONUMENT:"स्मारक",PAVILION:"मण्डप",MUSEUM:"सङ्ग्रहालय",OTHER:"अन्य"},
 evidenceKeys:{identity:"पहिचान",placement:"स्थान",architecture:"वास्तु स्वरूप",dimensions:"आकार र मापन"},
 evidence:{VERIFIED:"प्रमाणित",PHOTO_INFERRED:"तस्बिरबाट अनुमानित",APPROXIMATE:"अनुमानित",PROVISIONAL:"अस्थायी पहिचान",UNKNOWN:"अज्ञात"}
};
export function heritageLabels(language:HeritageLanguage):BookLabels {return language==="ne"?nepaliLabels:english;}

