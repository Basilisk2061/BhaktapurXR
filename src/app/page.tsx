import {HeroArtifact} from '@/components/home/hero-artifact';
import {MainMenu} from '@/components/home/main-menu';
import {readRuntimeOverrides} from '@/features/world-editor/runtime-overrides';
import './main-menu.css';

export default async function HomePage(){
 const overrides=await readRuntimeOverrides();
 return <main className="main-menu">
  <div className="menu-background" aria-hidden="true"><HeroArtifact overrides={overrides}/></div>
  <div className="menu-scrim" aria-hidden="true"/>
  <MainMenu/>
  <footer className="menu-status"><p>Reconstruction in progress</p><span>Bhaktapur Durbar Square ? Nepal</span></footer>
 </main>;
}
