import { NextResponse, type NextRequest } from "next/server";
import { applyOverrides, getLineStatus, type LineStatus } from "@/lib/status";
import { LINES, getCommunity, lineKey } from "@/lib/transit-data";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

interface AlertEntity {
  alert?: {
    header_text?: { translation?: { text?: string }[] };
    description_text?: { translation?: { text?: string }[] };
  };
}

const norm = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

/**
 * Descarga alertas (GTFS-RT en JSON) de RENFE_ALERTS_URL y marca como "incidencia"
 * las líneas cuyo texto de alerta menciona su etiqueta y su zona. Es una heurística:
 * para precisión real, mapea route_id GTFS -> línea.
 */
async function fetchAlertTexts(): Promise<string[]> {
  const url = process.env.RENFE_ALERTS_URL;
  if (!url) return [];
  const res = await fetch(url, { cache: "no-store", signal: AbortSignal.timeout(10_000) });
  if (!res.ok) throw new Error(`Alertas: HTTP ${res.status}`);
  const json = (await res.json()) as { entity?: AlertEntity[] };
  return (json.entity ?? []).map((e) =>
    [e.alert?.header_text, e.alert?.description_text]
      .flatMap((t) => t?.translation?.map((x) => x.text ?? "") ?? [])
      .join(" "),
  );
}

export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let alerts: string[] = [];
  let sourceError: string | null = null;
  try {
    alerts = (await fetchAlertTexts()).map(norm);
  } catch (e) {
    sourceError = e instanceof Error ? e.message : "error desconocido";
  }

  const now = new Date().toISOString();
  const updates: LineStatus[] = [];
  for (const line of LINES) {
    const label = norm(line.label).replace(/-/g, "[- ]?");
    const zone = norm(getCommunity(line.community)?.name ?? "");
    const re = new RegExp(`\\b${label}\\b`);
    const hit = alerts.find((a) => re.test(a) && a.includes(zone.split(" ")[0]));
    if (hit) {
      updates.push({
        key: lineKey(line),
        level: "incident",
        delayMin: 30,
        message: "Alerta oficial activa en la línea. Consulta el operador para más detalles.",
        updatedAt: now,
        source: "cron",
      });
    }
  }
  applyOverrides(updates);

  return NextResponse.json({
    ok: sourceError === null,
    sourceConfigured: Boolean(process.env.RENFE_ALERTS_URL),
    sourceError,
    alertsRead: alerts.length,
    linesUpdated: updates.length,
    sample: LINES[0] ? getLineStatus(LINES[0]).source : null,
    syncedAt: now,
  });
}
