import Link from 'next/link';
import {PUBLIC_EXPLORE_HREF} from '../../game/world/world-mode';
export function SiteNav({settings=false}:{settings?:boolean}){return <header className="site-nav"><Link href="/" className="site-brand">BhaktapurXR</Link><nav aria-label="Main navigation"><Link href="/#reconstruction">Reconstruction</Link><Link href="/#notice">Notice</Link><Link href="/settings" aria-current={settings?'page':undefined}>Settings</Link><Link className="nav-explore" href={PUBLIC_EXPLORE_HREF} prefetch={false}>Explore <span aria-hidden="true">&#8599;</span></Link></nav></header>;}
