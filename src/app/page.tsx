import Link from "next/link";
import LiveDashboard from "@/components/LiveDashboard";
import AdSlot from "@/components/ui/AdSlot";
import { getSnapshot } from "@/lib/status";
import { COMMUNITIES, getLinesByCommunity } from "@/lib/transit-data";

export const revalidate = 60;

export default function HomePage() {
  const snapshot = getSnapshot();
  return (
    <div className="space-y-10">
      <section className="space-y-3">
        <h1 className="text-3xl font-extrabold tracking-tight text-white md:text-5xl">
          Estado de Cercanías, AVE y Metro <span className="text-red-500">en directo</span>
        </h1>
        <p className="max-w-2xl text-slate-300">
          Retrasos, incidencias y rutas alternativas de Cercanías Madrid, Rodalies Barcelona,
          Cercanías Valencia, AVE, Ouigo, Iryo y Metro. Pulsa Ctrl+K para buscar tu línea o estación.
        </p>
      </section>

      <LiveDashboard initial={snapshot} />

      <section aria-labelledby="comunidades">
        <h2 id="comunidades" className="mb-4 text-xl font-bold text-white">
          Explora por zona
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {COMMUNITIES.map((c) => (
            <Link
              key={c.slug}
              href={`/incidencias/${c.slug}`}
              className="rounded-xl border border-white/10 bg-slate-900/60 p-4 transition hover:border-white/25"
            >
              <p className="font-semibold text-white">{c.name}</p>
              <p className="text-sm text-slate-400">{c.description}</p>
              <p className="mt-2 text-xs text-slate-500">{getLinesByCommunity(c.slug).length} líneas</p>
            </Link>
          ))}
        </div>
      </section>

      <AdSlot slot="home-bottom" height={250} />
    </div>
  );
}
