import type { Metadata } from "next";
import { notFound } from "next/navigation";
import IncidenceCard from "@/components/ui/IncidenceCard";
import AdSlot from "@/components/ui/AdSlot";
import { getLineStatus, worst } from "@/lib/status";
import { STATUS_META } from "@/lib/status-meta";
import { STATIONS, getLinesForStation, getStation } from "@/lib/transit-data";

export const revalidate = 60;
export const dynamicParams = false;

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return STATIONS.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const st = getStation(slug);
  if (!st) return {};
  const title = `Estación de ${st.name}: trenes, retrasos e incidencias hoy`;
  return {
    title,
    description: `Estado en tiempo real de las líneas que pasan por ${st.name} (${st.city}): retrasos, incidencias y alternativas.`,
    alternates: { canonical: `/estacion/${slug}` },
  };
}

export default async function StationPage({ params }: { params: Params }) {
  const { slug } = await params;
  const st = getStation(slug);
  if (!st) notFound();
  const lines = getLinesForStation(slug).map((l) => ({ line: l, status: getLineStatus(l) }));
  const overall = STATUS_META[worst(lines.map((x) => x.status.level))];
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-extrabold text-white">{st.name}: estado en directo</h1>
      <p className="flex items-center gap-2 text-slate-300">
        <span className={`h-2.5 w-2.5 rounded-full ${overall.dot}`} />
        {overall.label} · {lines.length} {lines.length === 1 ? "línea" : "líneas"} en {st.city}
      </p>
      <div className="grid gap-3 md:grid-cols-2">
        {lines.map(({ line, status }) => (
          <IncidenceCard key={`${line.community}/${line.slug}`} line={line} status={status} />
        ))}
      </div>
      <AdSlot slot="station" height={250} />
    </div>
  );
}
