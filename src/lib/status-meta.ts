import type { StatusLevel } from "@/lib/transit-data";

export const STATUS_META: Record<
  StatusLevel,
  { label: string; text: string; dot: string; badge: string; hex: string }
> = {
  ok: {
    label: "A tiempo",
    text: "text-emerald-400",
    dot: "bg-emerald-400",
    badge: "bg-emerald-400/10 text-emerald-300 ring-emerald-400/30",
    hex: "#34d399",
  },
  delay: {
    label: "Retraso",
    text: "text-amber-400",
    dot: "bg-amber-400",
    badge: "bg-amber-400/10 text-amber-300 ring-amber-400/30",
    hex: "#fbbf24",
  },
  incident: {
    label: "Incidencia",
    text: "text-red-400",
    dot: "bg-red-400",
    badge: "bg-red-400/10 text-red-300 ring-red-400/30",
    hex: "#f87171",
  },
};
