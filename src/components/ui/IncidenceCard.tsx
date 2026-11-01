import Link from "next/link";
import { AlertTriangle, CheckCircle2, Clock, TrainFront, TramFront, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { KIND_LABEL, getCommunity, linePath, type Line } from "@/lib/transit-data";
import type { LineStatus } from "@/lib/status";
import { STATUS_META } from "@/lib/status-meta";

const KIND_ICON = {
  cercanias: TrainFront,
  metro: TramFront,
  ave: Zap,
  ouigo: Zap,
  iryo: Zap,
} as const;

const LEVEL_ICON = {
  ok: CheckCircle2,
  delay: Clock,
  incident: AlertTriangle,
} as const;

export default function IncidenceCard({
  line,
  status,
}: {
  line: Line;
  status: LineStatus;
}) {
  const meta = STATUS_META[status.level];
  const KindIcon = KIND_ICON[line.kind];
  const LevelIcon = LEVEL_ICON[status.level];
  return (
    <Link
      href={linePath(line)}
      className="group block rounded-xl border border-white/10 bg-slate-900/60 p-4 transition hover:border-white/25 hover:bg-slate-900"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span
            className="flex h-9 min-w-9 items-center justify-center rounded-lg px-2 text-sm font-bold text-white"
            style={{ backgroundColor: line.color }}
          >
            {line.label}
          </span>
          <div>
            <p className="text-sm font-semibold text-white group-hover:underline">{line.name}</p>
            <p className="flex items-center gap-1 text-xs text-slate-400">
              <KindIcon className="h-3 w-3" aria-hidden />
              {KIND_LABEL[line.kind]} · {getCommunity(line.community)?.name}
            </p>
          </div>
        </div>
        <span
          className={cn(
            "inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ring-1",
            meta.badge,
          )}
        >
          <LevelIcon className="h-3.5 w-3.5" aria-hidden />
          {meta.label}
          {status.delayMin > 0 && ` · ${status.delayMin} min`}
        </span>
      </div>
      <p className="mt-3 text-sm text-slate-300">{status.message}</p>
    </Link>
  );
}
