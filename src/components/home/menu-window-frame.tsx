/** Decorative only: the surrounding link/button owns interaction and its accessible name. */
export function MenuWindowFrame(){return <svg className="menu-window-frame" viewBox="0 0 320 116" preserveAspectRatio="none" aria-hidden="true" focusable="false">
 <path className="window-timber" d="M24 25H296V101H24Z"/>
 <path className="window-opening" d="M53 96V48Q64 46 68 40Q83 40 89 34H136Q151 34 160 27Q169 34 184 34H231Q237 40 252 40Q256 46 267 48V96Z"/>
 <path className="window-inset" d="M58 92V51Q72 48 74 44Q89 44 94 39H137Q151 39 160 33Q169 39 183 39H226Q231 44 246 44Q248 48 262 51V92"/>
 <path className="window-cap" d="M5 7H315L307 17H13ZM15 19H305L296 28H24ZM29 30H291V35H29Z"/>
 <path className="window-edge" d="M13 17H307M24 28H296M31 35H289M26 103H294M18 110H302"/>
 {[32,274].map(x=><g key={x}>
  <path className="window-post" d={`M${x} 34H${x+14}V94H${x}Z`}/>
  <path className="window-edge" d={`M${x+4} 38V91M${x+10} 38V91`}/>
  {[42,53,64,75,86].map(y=><path className="window-carving" key={y} d={`M${x} ${y}H${x+14}M${x+2} ${y+3}H${x+12}`}/>)}
  <path className="window-cap" d={`M${x-4} 32H${x+18}V38H${x-4}ZM${x-5} 93H${x+19}V101H${x-5}Z`}/>
 </g>)}
 <path className="window-cap" d="M21 100H299V106H21ZM13 106H307L302 113H18Z"/>
 <path className="window-carving" d="M40 24H280M48 102H272M50 11H270M71 22L75 25 79 22M112 22L116 25 120 22M200 22L204 25 208 22M241 22L245 25 249 22"/>
 <path className="window-brand" d="M143 101H177M156 23L160 19 164 23 160 27Z"/>
</svg>;}
