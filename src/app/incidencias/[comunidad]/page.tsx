import type { Metadata } from "next";
import { notFound } from "next/navigation";
import IncidenceCard from "@/components/ui/IncidenceCard";
import AdSlot from "@/components/ui/AdSlot";
import { getLineStatus } from "@/lib/status";
import { COMMUNITIES, getCommunity, getLinesByCommunity } from "@/lib/transit-data";

export const revalidate = 60;
export const dynamicParams = false;

type Params = Promise<{ comunidad: string }>;

export function generateStaticParams() {
  return COMMUNITIES.map((c) => ({ comunidad: c.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { comunidad } = await params;
  const c = getCommunity(comunidad);
  if (!c) return {};
  const title = `Incidencias y retrasos hoy en ${c.name}`;
  return {
    title,
    description: `${c.description}: estado en tiempo real de todas las líneas, retrasos e incidencias.`,
    alternates: { canonical: `/incidencias/${comunidad}` },
  };
}

export default async function CommunityPage({ params }: { params: Params }) {
  const { comunidad } = await params;
  const c = getCommunity(comunidad);
  if (!c) notFound();
  const lines = getLinesByCommunity(comunidad);
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-extrabold text-white">Incidencias en {c.name}</h1>
      <p className="text-slate-300">{c.description}. Estado de {lines.length} líneas en directo.</p>
      <div className="grid gap-3 md:grid-cols-2">
        {lines.map((l) => (
          <IncidenceCard key={l.slug} line={l} status={getLineStatus(l)} />
        ))}
      </div>
      <AdSlot slot="community" height={250} />
    </div>
  );
}
