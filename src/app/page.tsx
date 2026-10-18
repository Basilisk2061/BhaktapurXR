import {MainMenu} from '@/components/home/main-menu';
import './main-menu.css';
import {TextileBorders} from '@/components/home/textile-borders';

export default function HomePage(){return <main className="main-menu">
 <TextileBorders/>
 <MainMenu/>
 <footer className="menu-status"><p>Reconstruction in progress</p><span>Bhaktapur Durbar Square &middot; Nepal</span></footer>
</main>;}
