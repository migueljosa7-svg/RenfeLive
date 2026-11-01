import { cn } from "@/lib/utils";

/**
 * Bloque de publicidad con altura reservada (evita CLS).
 * Sustituye el contenido por tu etiqueta de AdSense/afiliación usando NEXT_PUBLIC_ADSENSE_CLIENT.
 */
export default function AdSlot({
  slot,
  className,
  height = 120,
}: {
  slot: string;
  className?: string;
  height?: number;
}) {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  return (
    <aside
      aria-label="Publicidad"
      data-ad-slot={slot}
      data-ad-client={client}
      style={{ minHeight: height }}
      className={cn(
        "flex items-center justify-center rounded-xl border border-dashed border-white/15 bg-white/[0.02] text-xs uppercase tracking-widest text-slate-500",
        className,
      )}
    >
      Publicidad
    </aside>
  );
}
