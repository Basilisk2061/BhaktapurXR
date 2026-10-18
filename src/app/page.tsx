import {MainMenu} from '@/components/home/main-menu';
import './main-menu.css';

function TextileBorders(){return <>{['left','right'].map(side=><div className={`menu-textile menu-textile-${side}`} key={side} aria-hidden="true"><svg width="100%" height="100%"><defs><pattern id={`weave-${side}`} width="48" height="96" patternUnits="userSpaceOnUse"><path d="M6 0V96M42 0V96M11 0V96M37 0V96" stroke="#792332" strokeWidth="1"/><path d="M24 9L33 24 24 39 15 24ZM24 57L33 72 24 87 15 72Z" fill="none" stroke="#9d3547" strokeWidth="2"/><path d="M24 18L28 24 24 30 20 24ZM24 66L28 72 24 78 20 72Z" fill="#8b2b3c"/><path d="M15 46L18 50 21 46 24 50 27 46 30 50 33 46" stroke="#c7bfb0" strokeWidth="1" fill="none"/></pattern></defs><rect width="100%" height="100%" fill={`url(#weave-${side})`}/></svg></div>)}</>;}
export default function HomePage(){return <main className="main-menu">
 <TextileBorders/>
 <MainMenu/>
 <footer className="menu-status"><p>Reconstruction in progress</p><span>Bhaktapur Durbar Square &middot; Nepal</span></footer>
</main>;}
