import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Bot, Route } from "lucide-react";
import IncidenceCard from "@/components/ui/IncidenceCard";
import AdSlot from "@/components/ui/AdSlot";
import { analyzeLine, getLineStatus } from "@/lib/status";
import { STATUS_META } from "@/lib/status-meta";
import {
  KIND_LABEL,
  LINES,
  getAlternatives,
  getCommunity,
  getLine,
  getStation,
  stationPath,
} from "@/lib/transit-data";
import { SITE_URL } from "@/lib/utils";
import { buildMetadata, jsonLdString } from "@/lib/seo";

export const revalidate = 60;
export const dynamicParams = false;

type Params = Promise<{ comunidad: string; linea: string }>;

export function generateStaticParams() {
  return LINES.map((l) => ({ comunidad: l.community, linea: l.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { comunidad, linea } = await params;
  const line = getLine(comunidad, linea);
  const community = getCommunity(comunidad);
  if (!line || !community) return {};
  const status = getLineStatus(line);
  const title = `Estado y Retrasos Renfe en ${line.name} hoy en directo`;
  const description = `${KIND_LABEL[line.kind]} ${line.label} ${community.name}: ${STATUS_META[status.level].label.toLowerCase()}. Retrasos, averías e incidencias en directo y rutas alternativas.`;
  return buildMetadata({ title, description, path: `/incidencias/${comunidad}/${linea}` });
}

export default async function LinePage({ params }: { params: Params }) {
  const { comunidad, linea } = await params;
  const line = getLine(comunidad, linea);
  const community = getCommunity(comunidad);
  if (!line || !community) notFound();

  const status = getLineStatus(line);
  const meta = STATUS_META[status.level];
  const analysis = analyzeLine(line, status);
  const alternatives = getAlternatives(line);

  const pageUrl = `${SITE_URL}/incidencias/${comunidad}/${linea}`;
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: community.name, item: `${SITE_URL}/incidencias/${community.slug}` },
      { "@type": "ListItem", position: 3, name: line.name, item: pageUrl },
    ],
  };
  // Con incidencia activa: LiveBlogPosting; en normalidad: Service.
  const main =
    status.level === "ok"
      ? {
          "@context": "https://schema.org",
          "@type": "Service",
          name: `Servicio ${line.name}`,
          serviceType: KIND_LABEL[line.kind],
          areaServed: community.name,
          description: analysis.headline,
          url: pageUrl,
        }
      : {
          "@context": "https://schema.org",
          "@type": "LiveBlogPosting",
          headline: analysis.headline,
          url: pageUrl,
          inLanguage: "es-ES",
          datePublished: status.updatedAt,
          dateModified: new Date().toISOString(),
          coverageStartTime: status.updatedAt,
          about: { "@type": "Service", name: line.name, areaServed: community.name },
          publisher: { "@type": "Organization", name: "renfe-live", url: SITE_URL },
          liveBlogUpdate: [
            {
              "@type": "BlogPosting",
              headline: status.message,
              datePublished: status.updatedAt,
              articleBody: analysis.paragraphs.join(" "),
            },
          ],
        };
  const jsonLd = [breadcrumb, main];

  return (
    <article className="space-y-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }}
      />
      <nav aria-label="Migas de pan" className="text-sm text-slate-400">
        <Link href="/" className="hover:text-white">Inicio</Link> ›{" "}
        <Link href={`/incidencias/${community.slug}`} className="hover:text-white">{community.name}</Link> ›{" "}
        <span className="text-slate-200">{line.label}</span>
      </nav>

      <header className="space-y-3">
        <h1 className="text-3xl font-extrabold text-white md:text-4xl">
          {line.name}: estado e incidencias en directo
        </h1>
        <p className="flex flex-wrap items-center gap-3 text-slate-300">
          <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ring-1 ${meta.badge}`}>
            <span className={`h-2 w-2 rounded-full ${meta.dot}`} />
            {meta.label}
            {status.delayMin > 0 && ` · ${status.delayMin} min`}
          </span>
          <span>{KIND_LABEL[line.kind]} · {community.name}</span>
        </p>
      </header>

      <IncidenceCard line={line} status={status} />

      <section aria-labelledby="analisis" className="rounded-2xl border border-white/10 bg-slate-900/60 p-6">
        <h2 id="analisis" className="mb-3 flex items-center gap-2 text-lg font-bold text-white">
          <Bot className="h-5 w-5 text-sky-400" aria-hidden /> Análisis automático de retrasos
        </h2>
        <p className="font-semibold text-white">{analysis.headline}</p>
        {analysis.paragraphs.map((p) => (
          <p key={p} className="mt-2 text-slate-300">{p}</p>
        ))}
        <p className="mt-3 rounded-lg bg-white/5 p-3 text-sm text-slate-200">
          <b>Recomendación:</b> {analysis.recommendation}
        </p>
      </section>

      <AdSlot slot="line-mid" height={250} />

      <section aria-labelledby="paradas">
        <h2 id="paradas" className="mb-3 text-lg font-bold text-white">Estaciones de la línea</h2>
        <ol className="flex flex-wrap gap-2">
          {line.stations.map((slug) => {
            const st = getStation(slug);
            return st ? (
              <li key={slug}>
                <Link
                  href={stationPath(st)}
                  className="rounded-full border border-white/10 px-3 py-1 text-sm text-slate-200 hover:border-white/30"
                >
                  {st.name}
                </Link>
              </li>
            ) : null;
          })}
        </ol>
      </section>

      <section aria-labelledby="alternativas">
        <h2 id="alternativas" className="mb-3 flex items-center gap-2 text-lg font-bold text-white">
          <Route className="h-5 w-5 text-emerald-400" aria-hidden /> Rutas alternativas
        </h2>
        {alternatives.length === 0 ? (
          <p className="text-slate-400">No hay líneas alternativas que compartan tramo con esta.</p>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {alternatives.map((alt) => (
              <IncidenceCard key={`${alt.community}/${alt.slug}`} line={alt} status={getLineStatus(alt)} />
            ))}
          </div>
        )}
      </section>
    </article>
  );
}
