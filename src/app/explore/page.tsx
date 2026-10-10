import type { Metadata } from "next";
import Link from "next/link";
import { Experience } from "@/components/experience";

export const metadata: Metadata = { title: "Explore" };

export default function ExplorePage() {
  return (
    <main className="flex h-svh min-h-[480px] flex-col">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-300 px-6 py-4">
        <Link href="/" className="font-semibold tracking-tight">BhaktapurXR</Link>
        <span className="text-xs uppercase tracking-wider text-stone-600">Phase 2 · Player engineering test</span>
      </header>
      <div className="relative min-h-0 flex-1"><Experience /></div>
      <footer className="flex flex-wrap justify-between gap-2 px-6 py-4 text-xs leading-relaxed text-stone-600">
        <p>Click to look · WASD move · Shift run · Esc release mouse</p>
        <p>Temporary player proxy · PLACEHOLDER world · 1 unit = 1 metre · +Y up</p>
      </footer>
    </main>
  );
}
