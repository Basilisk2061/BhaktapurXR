import {MainMenu} from '@/components/home/main-menu';
import './main-menu.css';

function TextileBorders(){return <>{['left','right'].map(side=><div className={`menu-textile menu-textile-${side}`} key={side} aria-hidden="true"/>)}</>;}
export default function HomePage(){return <main className="main-menu">
 <TextileBorders/>
 <MainMenu/>
 <footer className="menu-status"><p>Reconstruction in progress</p><span>Bhaktapur Durbar Square &middot; Nepal</span></footer>
</main>;}
