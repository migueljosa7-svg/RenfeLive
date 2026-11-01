import {
  LINES,
  STATIONS,
  SEVERITY,
  getLinesForStation,
  lineKey,
  type Line,
  type StatusLevel,
} from "@/lib/transit-data";

export interface LineStatus {
  key: string;
  level: StatusLevel;
  delayMin: number;
  message: string;
  updatedAt: string;
  source: "simulated" | "cron";
}

export interface Snapshot {
  updatedAt: string;
  lines: LineStatus[];
  stations: Record<string, StatusLevel>;
}

const WINDOW_MS = 5 * 60 * 1000;

function hash(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

const INCIDENT_MESSAGES = [
  "Avería en la infraestructura: circulación interrumpida en un tramo.",
  "Incidencia en la catenaria: trenes con retrasos y supresiones.",
  "Fallo de señalización: circulación con marcha restringida.",
  "Persona en la vía: servicio detenido temporalmente.",
];
const DELAY_MESSAGES = [
  "Retrasos por aumento de tiempos de viaje.",
  "Retrasos por orden de circulación en la línea.",
  "Demoras por incidencia previa ya resuelta.",
];

/** Estado determinista por ventana de 5 minutos. Se sustituye por datos reales vía cron. */
function simulate(line: Line, now: number): LineStatus {
  const key = lineKey(line);
  const bucket = Math.floor(now / WINDOW_MS);
  const h = hash(`${key}:${bucket}`);
  const roll = h % 100;
  let level: StatusLevel = "ok";
  if (roll >= 90) level = "incident";
  else if (roll >= 68) level = "delay";
  const delayMin =
    level === "ok" ? 0 : level === "delay" ? 5 + (h % 21) : 25 + (h % 36);
  const message =
    level === "ok"
      ? "Circulación normal."
      : level === "delay"
        ? DELAY_MESSAGES[h % DELAY_MESSAGES.length]
        : INCIDENT_MESSAGES[h % INCIDENT_MESSAGES.length];
  return {
    key,
    level,
    delayMin,
    message,
    updatedAt: new Date(bucket * WINDOW_MS).toISOString(),
    source: "simulated",
  };
}

type Store = { overrides: Map<string, LineStatus>; syncedAt: string | null };
const g = globalThis as unknown as { __renfeStore?: Store };
const store: Store = (g.__renfeStore ??= { overrides: new Map(), syncedAt: null });

/** Aplica el resultado de una sincronización (cron). Las entradas caducan a los 15 min. */
export function applyOverrides(items: LineStatus[]) {
  for (const it of items) store.overrides.set(it.key, it);
  store.syncedAt = new Date().toISOString();
}

export function getSyncedAt() {
  return store.syncedAt;
}

const OVERRIDE_TTL_MS = 15 * 60 * 1000;

export function getLineStatus(line: Line, now = Date.now()): LineStatus {
  const o = store.overrides.get(lineKey(line));
  if (o && now - Date.parse(o.updatedAt) < OVERRIDE_TTL_MS) return o;
  return simulate(line, now);
}

export function worst(levels: StatusLevel[]): StatusLevel {
  return levels.reduce<StatusLevel>(
    (a, b) => (SEVERITY[b] > SEVERITY[a] ? b : a),
    "ok",
  );
}

export function getSnapshot(now = Date.now()): Snapshot {
  const lines = LINES.map((l) => getLineStatus(l, now));
  const byKey = new Map(lines.map((s) => [s.key, s.level]));
  const stations: Record<string, StatusLevel> = {};
  for (const st of STATIONS) {
    stations[st.slug] = worst(
      getLinesForStation(st.slug).map((l) => byKey.get(lineKey(l)) ?? "ok"),
    );
  }
  return { updatedAt: new Date(now).toISOString(), lines, stations };
}

export interface Analysis {
  headline: string;
  paragraphs: string[];
  recommendation: string;
}

/** Análisis automático basado en reglas sobre el estado actual (no usa un LLM). */
export function analyzeLine(line: Line, status: LineStatus): Analysis {
  if (status.level === "ok") {
    return {
      headline: `La ${line.name} circula con normalidad`,
      paragraphs: [
        `No se detectan retrasos relevantes en la ${line.label}. La frecuencia y los tiempos de viaje son los habituales para esta franja horaria.`,
      ],
      recommendation: "Puedes planificar tu viaje con los horarios oficiales sin margen extra.",
    };
  }
  if (status.level === "delay") {
    return {
      headline: `Retrasos de unos ${status.delayMin} min en la ${line.name}`,
      paragraphs: [
        status.message,
        `Con una demora media estimada de ${status.delayMin} minutos, las conexiones ajustadas en los puntos de transbordo (${line.stations.length} estaciones en la línea) están en riesgo.`,
      ],
      recommendation: `Añade al menos ${Math.ceil(status.delayMin * 1.5)} minutos de margen si debes enlazar con otro tren.`,
    };
  }
  return {
    headline: `Incidencia en la ${line.name}: servicio afectado`,
    paragraphs: [
      status.message,
      `La incidencia puede provocar retrasos superiores a ${status.delayMin} minutos y supresiones puntuales. Se espera recuperación gradual una vez resuelta la causa.`,
    ],
    recommendation: "Valora una ruta alternativa (ver más abajo) o retrasa tu salida hasta que se normalice el servicio.",
  };
}
