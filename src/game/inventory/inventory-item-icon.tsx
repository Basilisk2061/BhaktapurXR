import type {SVGProps} from 'react';
import type {InventoryIcon} from './inventory-store';
/** One authored vector icon, shared by equipped HUD and highlighted radial item. */
export function InventoryItemIcon({icon,...props}:{icon:InventoryIcon}&SVGProps<SVGSVGElement>){
 return <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" focusable="false" data-item-icon={icon} {...props}>
  {icon==='camera'?<g stroke="#d4b47b" strokeWidth="1.7"><path d="M7 15h9l3-5h11l3 5h8v24H7Z" fill="#513b2c"/><circle cx="25" cy="27" r="8" fill="#21150f"/><circle cx="25" cy="27" r="4"/><path d="M11 19h5M34 19h3M20 13h9"/></g>:<g stroke="#80603b" strokeWidth="1.1">{[[13,15,-30],[25,10,18],[35,19,38],[21,23,-16],[11,31,30],[29,33,-35],[38,34,16]].map(([x,y,angle],i)=><g key={i} transform={`translate(${x} ${y}) rotate(${angle})`}><ellipse rx="3.3" ry="6" fill={i%2?'#d4b47b':'#b98e52'}/><path d="M0 -3.5 Q-1 0 0 3.5" stroke="#edcd91" strokeWidth=".9"/></g>)}</g>}
 </svg>;
}
