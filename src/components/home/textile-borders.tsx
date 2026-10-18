function WovenStrip({side,compact=false}:{side:string;compact?:boolean}){
 const id=`menu-weave-${side}-${compact?'compact':'full'}`;
 return <svg className={compact?'textile-compact':'textile-full'} width={compact?14:88} height="100%" aria-hidden="true" focusable="false">
  {/* Numeric user-space units: a taller container reveals more repeats, never taller symbols. */}
  <defs><pattern id={id} width={compact?14:88} height={compact?96:120} patternUnits="userSpaceOnUse" patternContentUnits="userSpaceOnUse">
   {compact?<>
    <path d="M1 0V96M13 0V96" stroke="#3f7475" strokeWidth="1"/>
    <path d="M7 0V14M7 34V62M7 82V96" stroke="#927747" strokeWidth="1"/>
    <path d="M7 14L12 24 7 34 2 24ZM7 62L12 72 7 82 2 72Z" fill="none" stroke="#ac4c60" strokeWidth="1.4"/>
   </>:<>
    <path d="M3 0V120M85 0V120" stroke="#aa8a4e" strokeWidth=".9"/>
    <path d="M9 0V120M79 0V120" stroke="#3d797b" strokeWidth="1.8"/>
    <path d="M20 0V15M20 45V75M20 105V120M68 0V15M68 45V75M68 105V120" stroke="#743348" strokeWidth="1.5"/>
    <path d="M20 15L28 30 20 45 12 30ZM20 75L28 90 20 105 12 90ZM68 15L76 30 68 45 60 30ZM68 75L76 90 68 105 60 90Z" fill="none" stroke="#a94b60" strokeWidth="2.2"/>
    <path d="M20 25L23 30 20 35 17 30ZM68 25L71 30 68 35 65 30Z" fill="#733042"/>
    <path d="M32 0L37 15 32 30 37 45 32 60 37 75 32 90 37 105 32 120M56 0L51 15 56 30 51 45 56 60 51 75 56 90 51 105 56 120" fill="none" stroke="#d4c9b5" strokeWidth="1.5" strokeDasharray="4 3"/>
    <path d="M44 0V16M44 44V76M44 104V120" stroke="#b4824a" strokeWidth="1"/>
    <path d="M44 16L50 30 44 44 38 30ZM44 76L50 90 44 104 38 90Z" fill="none" stroke="#b4824a" strokeWidth="1.7"/>
    <path d="M18 60H22M66 60H70M43 0H45M43 60H45M43 120H45" stroke="#d8cdbb" strokeWidth="2"/>
   </>}
  </pattern></defs>
  <rect width="100%" height="100%" fill={`url(#${id})`}/>
 </svg>;
}
/** One continuous surface per side, filled with fixed-size, seamless motif units. */
export function TextileBorders(){return <>{['left','right'].map(side=><div className={`menu-textile menu-textile-${side}`} key={side} aria-hidden="true"><WovenStrip side={side}/><WovenStrip side={side} compact/></div>)}</>;}
