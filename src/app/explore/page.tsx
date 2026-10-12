import type { Metadata } from "next";
import Link from "next/link";
import { resolveWorldMode } from "@/game/world/world-mode";
import {resolveReviewView} from "@/game/world/review-spawn";
import { Experience } from "@/components/experience";

export const metadata: Metadata = { title: "Explore" };

export default async function ExplorePage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const query=await searchParams;
  const mode = resolveWorldMode(query.world);
  const review=mode==="BHAKTAPUR"?resolveReviewView(query.review,process.env.NODE_ENV==="development"):null;
  const architecturalDebug=process.env.NODE_ENV==="development"&&query.architectureDebug==="1";
  return (
    <main className="flex h-svh min-h-[480px] flex-col">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-300 px-6 py-4">
        <Link href="/" className="font-semibold tracking-tight">BhaktapurXR</Link>
        <span className="text-xs uppercase tracking-wider text-stone-600">{mode === "ENGINEERING" ? "Development · Engineering course" : "Early 3D heritage reconstruction"}</span>
        {process.env.NODE_ENV === "development" && <nav aria-label="Development worlds" className="flex gap-3 text-xs"><Link href="/explore?world=engineering">Engineering</Link><Link href="/explore?world=bhaktapur">Bhaktapur</Link><Link href="/reconstruction">Trace review</Link>{["central","palace","composition","close","wide"].map(view=><Link key={view} href={`/explore?world=bhaktapur&review=${view}`}>{view}</Link>)}</nav>}
      </header>
      <div className="relative min-h-0 flex-1"><Experience mode={mode} review={review} architecturalDebug={architecturalDebug} /></div>
      <footer className="flex flex-wrap justify-between gap-2 px-6 py-4 text-xs leading-relaxed text-stone-600">
        <p>Click to look · WASD move · Shift run · Space jump · Esc release mouse</p>
        <p>{mode === "ENGINEERING" ? "PLACEHOLDER engineering course" : "APPROXIMATE architecture · Source-derived layout"} · 1 unit = 1 metre · +Y up</p>
      </footer>
    </main>
  );
}
