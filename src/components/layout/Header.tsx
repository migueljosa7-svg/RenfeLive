import Link from "next/link";
import { TrainFront } from "lucide-react";
import SearchModal from "@/components/ui/SearchModal";
import { COMMUNITIES } from "@/lib/transit-data";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-bold text-white">
          <TrainFront className="h-5 w-5 text-red-500" aria-hidden />
          Renfe<span className="text-red-500">Live</span>
        </Link>
        <nav aria-label="Comunidades" className="hidden gap-4 text-sm text-slate-300 md:flex">
          {COMMUNITIES.map((c) => (
            <Link key={c.slug} href={`/incidencias/${c.slug}`} className="hover:text-white">
              {c.name}
            </Link>
          ))}
        </nav>
        <SearchModal />
      </div>
    </header>
  );
}
