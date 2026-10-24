function WovenStrip({side,compact=false}:{side:string;compact?:boolean}){
 const id=`menu-weave-${side}-${compact?'compact':'full'}`;
 return <svg className={compact?'textile-compact':'textile-full'} width={compact?14:88} height="100%" aria-hidden="true" focusable="false">
  {/* Fixed user-space repeat pitch; each diamond scales uniformly about its own centre. */}
  <defs><pattern id={id} width={compact?14:88} height={compact?112:140} patternUnits="userSpaceOnUse" patternContentUnits="userSpaceOnUse">
   {compact?<>
    <path d="M1 0V112M13 0V112" stroke="#3f7475" strokeWidth="1"/>
    <path d="M7 0V42M7 70V112" stroke="#927747" strokeWidth="1"/>
    <g transform="translate(7 56) scale(1.2)"><path d="M0 -10L5 0 0 10 -5 0Z" fill="none" stroke="#ac4c60" strokeWidth="1.4"/></g>
   </>:<>
    <path d="M3 0V140M85 0V140" stroke="#aa8a4e" strokeWidth=".9"/>
    <path d="M9 0V140M79 0V140" stroke="#3d797b" strokeWidth="1.8"/>
    {[20,68].map(x=><g key={x}>
     <path d={`M${x} 0V49M${x} 91V140`} stroke="#743348" strokeWidth="1.5"/>
     <g transform={`translate(${x} 70) scale(1.4)`}>
      <path d="M0 -15L8 0 0 15 -8 0Z" fill="none" stroke="#a94b60" strokeWidth="2.2"/>
      <path d="M0 -5L3 0 0 5 -3 0Z" fill="#733042"/>
     </g>
    </g>)}
    <path d="M32 0V40L37 55 32 70 37 85 32 100V140M56 0V40L51 55 56 70 51 85 56 100V140" fill="none" stroke="#d4c9b5" strokeWidth="1.5" strokeDasharray="4 3"/>
    <path d="M44 0V50.4M44 89.6V140" stroke="#b4824a" strokeWidth="1"/>
    <g transform="translate(44 70) scale(1.4)"><path d="M0 -14L6 0 0 14 -6 0Z" fill="none" stroke="#b4824a" strokeWidth="1.7"/></g>
    <path d="M18 0H22M66 0H70M43 0H45M18 140H22M66 140H70M43 140H45" stroke="#d8cdbb" strokeWidth="2"/>
   </>}
  </pattern></defs>
  <rect width="100%" height="100%" fill={`url(#${id})`}/>
 </svg>;
}
/** Symmetric repeating borders; viewport height changes count, never motif aspect ratio. */
export function TextileBorders(){return <>{['left','right'].map(side=><div className={`menu-textile menu-textile-${side}`} key={side} aria-hidden="true"><WovenStrip side={side}/><WovenStrip side={side} compact/></div>)}</>;}
