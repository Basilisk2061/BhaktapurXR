import type {Metadata} from 'next';
import Link from 'next/link';
import {SiteNav} from '../../components/home/site-nav';
import {MouseSensitivitySettings} from '../../components/mouse-sensitivity-settings';
import {PUBLIC_EXPLORE_HREF} from '../../game/world/world-mode';
import '../home.css';
export const metadata:Metadata={title:'Settings'};
export default function SettingsPage(){return <main className="home settings-page"><SiteNav settings/><div className="settings-content"><div className="settings-heading"><h1>Settings</h1><p>Adjust how BhaktapurXR feels to explore.</p></div><MouseSensitivitySettings/><p className="settings-note">Your preference stays in this browser.</p><Link className="settings-back" href={PUBLIC_EXPLORE_HREF} prefetch={false}>Back to the square <span aria-hidden="true">&#8599;</span></Link></div></main>;}
