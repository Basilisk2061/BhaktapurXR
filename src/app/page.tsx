import {MainMenu} from '@/components/home/main-menu';
import './main-menu.css';
import {TextileBorders} from '@/components/home/textile-borders';

export default function HomePage(){return <main className="main-menu">
 <TextileBorders/>
 <MainMenu/>
 <footer className="menu-status menu-development" aria-labelledby="development-build-title"><strong id="development-build-title">Early Development Build</strong><p>BhaktapurXR is currently in active development. The environment, architecture, interactions, and gameplay are still being expanded and refined. Some areas may be incomplete or approximate.</p></footer>
</main>;}

