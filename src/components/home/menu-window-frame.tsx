/** Layered matte timber planes; the surrounding semantic control owns interaction. */
export function MenuWindowFrame(){return <svg className="menu-window-frame" viewBox="0 0 320 124" preserveAspectRatio="none" aria-hidden="true" focusable="false">
 <path className="window-cast-shadow" d="M25 31H303V115H25Z"/>
 <path className="window-timber" d="M24 26H296V104H24Z"/>
 <path className="window-bevel-light" d="M24 26H296L287 35H33V102H24Z"/>
 <path className="window-bevel-dark" d="M296 26V104H24L33 96H287V35Z"/>
 <path className="window-reveal" d="M47 101V48Q61 46 67 39Q82 39 90 32H136Q151 32 160 25Q169 32 184 32H230Q238 39 253 39Q259 46 273 48V101Z"/>
 <path className="window-opening" d="M58 96V55Q72 52 77 45Q91 45 98 39H139Q152 39 160 33Q168 39 181 39H222Q229 45 243 45Q248 52 262 55V96Z"/>
 <path className="window-inner-shadow" d="M58 96V55Q72 52 77 45Q91 45 98 39H139Q152 39 160 33Q168 39 181 39H222Q229 45 243 45Q248 52 262 55L255 59Q239 55 237 51H220Q211 45 180 45Q168 44 160 40Q152 45 138 45H101Q93 51 81 51Q77 58 65 61V96Z"/>
 <path className="window-edge" d="M49 99V49Q63 46 68 40Q82 40 91 34H137Q151 34 160 27Q169 34 183 34H229Q238 40 252 40Q257 46 271 49V99"/>
 <path className="window-cast-shadow" d="M24 27H300V40H24Z"/>
 <path className="window-cap" d="M6 7H314V18L302 24H18L6 18Z"/>
 <path className="window-bevel-light" d="M6 7H314L304 13H16Z"/>
 <path className="window-bevel-dark" d="M16 13H304V22H16Z"/>
 <path className="window-post" d="M22 23H298V33H22Z"/>
 <path className="window-carved-band" d="M30 26H290V30H30Z"/>
 {[32,272].map(x=><g key={x}>
  <path className="window-bevel-dark" d={`M${x-4} 34H${x+21}V102H${x-4}Z`}/>
  <path className="window-post" d={`M${x} 34H${x+16}V99H${x}Z`}/>
  <path className="window-bevel-light" d={`M${x} 34H${x+5}V99H${x}Z`}/>
  <path className="window-bevel-dark" d={`M${x+13} 34H${x+18}V99H${x+13}Z`}/>
  {[43,59,75,91].map(y=><g key={y}>
   <path className="window-bevel-dark" d={`M${x+5} ${y}H${x+12}V${y+7}H${x+5}Z`}/>
   <path className="window-cap" d={`M${x-3} ${y-3}H${x+19}V${y}H${x-3}Z`}/>
   <path className="window-edge" d={`M${x-3} ${y-3}H${x+19}`}/>
  </g>)}
  <path className="window-cap" d={`M${x-6} 32H${x+22}V39H${x-6}ZM${x-7} 97H${x+23}V106H${x-7}Z`}/>
  <path className="window-bevel-light" d={`M${x-7} 97H${x+23}L${x+19} 100H${x-3}Z`}/>
 </g>)}
 <path className="window-cast-shadow" d="M19 111H307V121H19Z"/>
 <path className="window-cap" d="M21 103H299V110H21ZM12 110H308V117H12Z"/>
 <path className="window-bevel-light" d="M21 103H299L305 107H15ZM12 110H308L301 114H19Z"/>
 <path className="window-bevel-dark" d="M19 114H301V120H19Z"/>
 <path className="window-carving" d="M45 18H275M48 108H272M67 25L72 29 77 25M108 25L113 29 118 25M202 25L207 29 212 25M243 25L248 29 253 25"/>
 <path className="window-brand" d="M140 108H180M156 25L160 21 164 25 160 29Z"/>
</svg>;}
