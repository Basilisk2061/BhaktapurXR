import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-svh max-w-6xl flex-col px-6 sm:px-12">
      <header className="flex items-center justify-between border-b border-stone-300 py-7">
        <span className="text-lg font-semibold tracking-tight">BhaktapurXR</span>
        <span className="text-xs uppercase tracking-widest text-stone-600">Digital heritage · Nepal</span>
      </header>
      <section className="flex flex-1 flex-col justify-center py-20">
        <p className="mb-6 text-xs font-semibold uppercase tracking-[0.2em] text-stone-600">A place. A living heritage.</p>
        <h1 className="max-w-3xl font-serif text-5xl leading-tight sm:text-7xl">Experience Bhaktapur<br />in a new dimension.</h1>
        <p className="mt-7 max-w-xl text-lg leading-relaxed text-stone-600">An interactive 3D digital heritage experience of Bhaktapur Durbar Square, Nepal.</p>
        <div className="mt-10"><Link href="/explore" className="inline-flex items-center gap-6 rounded-sm bg-[#34473c] px-6 py-4 font-medium text-white transition-colors hover:bg-[#25372e]">Explore Bhaktapur <span aria-hidden="true">↗</span></Link></div>
        <p className="mt-5 max-w-lg text-sm leading-relaxed text-stone-600">Early development · The current experience is an engineering test scene. Reconstruction of the square has not begun.</p>
      </section>
      <footer className="border-t border-stone-300 py-6 text-sm text-stone-600">Built with respect for place, people, and historical accuracy.</footer>
    </main>
  );
}
