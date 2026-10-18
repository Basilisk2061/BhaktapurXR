function WovenStrip({side,compact=false}:{side:string;compact?:boolean}){
 const id=`menu-weave-${side}-${compact?'compact':'full'}`;
 return <svg className={compact?'textile-compact':'textile-full'} width="100%" height="100%" aria-hidden="true" focusable="false">
  <defs><pattern id={id} width="100%" height="160" patternUnits="userSpaceOnUse" viewBox={compact?'0 0 18 160':'0 0 96 160'} preserveAspectRatio="none">
   {compact?<>
    <path d="M1 0V160M17 0V160" stroke="#3f7475" strokeWidth="1"/>
    <path d="M9 0V20M9 60V100M9 140V160" stroke="#927747" strokeWidth="1"/>
    <path d="M9 20L15 40 9 60 3 40ZM9 100L15 120 9 140 3 120Z" fill="none" stroke="#ac4c60" strokeWidth="1.4"/>
   </>:<>
    <path d="M3 0V160M93 0V160" stroke="#aa8a4e" strokeWidth=".9"/>
    <path d="M9 0V160M87 0V160" stroke="#3d797b" strokeWidth="1.8"/>
    <path d="M24 0V10M24 70V90M24 150V160M72 0V10M72 70V90M72 150V160" stroke="#743348" strokeWidth="1.5"/>
    <path d="M24 10L35 40 24 70 13 40ZM24 90L35 120 24 150 13 120ZM72 10L83 40 72 70 61 40ZM72 90L83 120 72 150 61 120Z" fill="none" stroke="#a94b60" strokeWidth="2.2"/>
    <path d="M24 30L28 40 24 50 20 40ZM72 30L76 40 72 50 68 40Z" fill="#733042"/>
    <path d="M39 0L45 20 39 40 45 60 39 80 45 100 39 120 45 140 39 160M57 0L51 20 57 40 51 60 57 80 51 100 57 120 51 140 57 160" fill="none" stroke="#d4c9b5" strokeWidth="1.5" strokeDasharray="4 3"/>
    <path d="M48 0L54 40 48 80 42 40ZM48 80L54 120 48 160 42 120Z" fill="none" stroke="#b4824a" strokeWidth="1.7"/>
    <path d="M22 80H26M70 80H74M47 0H49M47 80H49M47 160H49" stroke="#d8cdbb" strokeWidth="2"/>
   </>}
  </pattern></defs>
  <rect width="100%" height="100%" fill={`url(#${id})`}/>
 </svg>;
}
/** One uninterrupted SVG surface per edge; only its internal woven lanes repeat. */
export function TextileBorders(){return <>{['left','right'].map(side=><div className={`menu-textile menu-textile-${side}`} key={side} aria-hidden="true"><WovenStrip side={side}/><WovenStrip side={side} compact/></div>)}</>;}
