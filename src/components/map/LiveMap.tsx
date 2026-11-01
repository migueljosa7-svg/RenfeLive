"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { MAP_H, MAP_W, SPAIN_PATH, project } from "@/lib/geo";
import { STATIONS, stationPath, type StatusLevel } from "@/lib/transit-data";
import { STATUS_META } from "@/lib/status-meta";

interface Props {
  stations: Record<string, StatusLevel>;
}

export default function LiveMap({ stations }: Props) {
  const [hover, setHover] = useState<string | null>(null);
  const hovered = STATIONS.find((s) => s.slug === hover);

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60">
      <svg
        viewBox={`0 0 ${MAP_W} ${MAP_H}`}
        className="h-auto w-full"
        role="img"
        aria-label="Mapa de España con el estado de las estaciones en tiempo real"
      >
        <motion.path
          d={SPAIN_PATH}
          fill="rgba(56,189,248,0.06)"
          stroke="rgba(148,163,184,0.5)"
          strokeWidth={1.5}
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.6, ease: "easeInOut" }}
        />
        {STATIONS.map((st, i) => {
          const level = stations[st.slug] ?? "ok";
          const meta = STATUS_META[level];
          const [x, y] = project(st.lat, st.lon);
          return (
            <Link
              key={st.slug}
              href={stationPath(st)}
              aria-label={`${st.name}: ${meta.label}`}
              onMouseEnter={() => setHover(st.slug)}
              onMouseLeave={() => setHover(null)}
              onFocus={() => setHover(st.slug)}
              onBlur={() => setHover(null)}
            >
              {level !== "ok" && (
                <motion.circle
                  cx={x}
                  cy={y}
                  fill={meta.hex}
                  initial={{ r: 4, opacity: 0.6 }}
                  animate={{ r: [4, 14], opacity: [0.6, 0] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
                />
              )}
              <motion.circle
                cx={x}
                cy={y}
                r={5}
                fill={meta.hex}
                stroke="#0f172a"
                strokeWidth={1.5}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.6 + i * 0.02, type: "spring", stiffness: 300 }}
                style={{ transformOrigin: `${x}px ${y}px`, cursor: "pointer" }}
                whileHover={{ scale: 1.6 }}
              />
            </Link>
          );
        })}
      </svg>

      <div className="pointer-events-none absolute left-3 top-3 min-h-[2.5rem] rounded-lg bg-slate-950/80 px-3 py-2 text-xs text-slate-300 backdrop-blur">
        {hovered ? (
          <>
            <span className="font-semibold text-white">{hovered.name}</span>{" "}
            <span className={STATUS_META[stations[hovered.slug] ?? "ok"].text}>
              · {STATUS_META[stations[hovered.slug] ?? "ok"].label}
            </span>
          </>
        ) : (
          "Pasa el cursor por una estación"
        )}
      </div>

      <ul className="absolute bottom-3 left-3 flex gap-3 rounded-lg bg-slate-950/80 px-3 py-2 text-xs text-slate-300 backdrop-blur">
        {(Object.keys(STATUS_META) as StatusLevel[]).map((k) => (
          <li key={k} className="flex items-center gap-1.5">
            <span className={`h-2.5 w-2.5 rounded-full ${STATUS_META[k].dot}`} />
            {STATUS_META[k].label}
          </li>
        ))}
      </ul>
    </div>
  );
}
