"use client";

import { useEffect, useMemo, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import LiveMap from "@/components/map/LiveMap";
import IncidenceCard from "@/components/ui/IncidenceCard";
import AdSlot from "@/components/ui/AdSlot";
import { LINES, SEVERITY, lineKey } from "@/lib/transit-data";
import type { Snapshot } from "@/lib/status";

async function fetchSnapshot(): Promise<Snapshot> {
  const res = await fetch("/api/status", { cache: "no-store" });
  if (!res.ok) throw new Error("No se pudo actualizar el estado");
  return res.json();
}

export default function LiveDashboard({ initial }: { initial: Snapshot }) {
  const { data = initial, isError } = useQuery({
    queryKey: ["snapshot"],
    queryFn: fetchSnapshot,
    initialData: initial,
    refetchInterval: 30_000,
  });

  const lineMap = useMemo(() => new Map(LINES.map((l) => [lineKey(l), l])), []);
  const problems = useMemo(
    () =>
      data.lines
        .filter((s) => s.level !== "ok")
        .sort((a, b) => SEVERITY[b.level] - SEVERITY[a.level] || b.delayMin - a.delayMin),
    [data],
  );
  const incidents = problems.filter((p) => p.level === "incident").length;
  const delays = problems.length - incidents;
  const okCount = data.lines.length - problems.length;

  const celebrated = useRef(false);
  useEffect(() => {
    if (problems.length === 0 && !celebrated.current) {
      celebrated.current = true;
      import("canvas-confetti").then((m) => m.default({ particleCount: 120, spread: 80 }));
    }
  }, [problems.length]);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <span className="inline-flex items-center gap-2 rounded-full bg-red-500/10 px-3 py-1 font-medium text-red-300 ring-1 ring-red-500/30">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
          </span>
          EN VIVO
        </span>
        <span className="text-slate-400" suppressHydrationWarning>
          Actualizado {new Date(data.updatedAt).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}
          {isError && " · reintentando…"}
        </span>
        <span className="ml-auto flex gap-4 text-slate-300">
          <span><b className="text-emerald-400">{okCount}</b> a tiempo</span>
          <span><b className="text-amber-400">{delays}</b> con retraso</span>
          <span><b className="text-red-400">{incidents}</b> con incidencia</span>
        </span>
      </div>

      <LiveMap stations={data.stations} />

      <AdSlot slot="home-top" height={110} />

      <section aria-labelledby="ultima-hora">
        <h2 id="ultima-hora" className="mb-4 text-xl font-bold text-white">
          Incidencias de última hora
        </h2>
        {problems.length === 0 ? (
          <p className="rounded-xl border border-white/10 p-6 text-slate-300">
            Ahora mismo todas las líneas circulan con normalidad.
          </p>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {problems.slice(0, 12).map((s) => {
              const line = lineMap.get(s.key);
              return line ? <IncidenceCard key={s.key} line={line} status={s} /> : null;
            })}
          </div>
        )}
      </section>
    </div>
  );
}
