"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Search, TrainFront, MapPin } from "lucide-react";
import {
  KIND_LABEL,
  LINES,
  STATIONS,
  getCommunity,
  linePath,
  stationPath,
} from "@/lib/transit-data";

interface Item {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  type: "line" | "station";
  haystack: string;
}

const normalize = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

const ITEMS: Item[] = [
  ...LINES.map<Item>((l) => ({
    id: `l:${l.community}/${l.slug}`,
    title: `${l.label} · ${l.name}`,
    subtitle: `${KIND_LABEL[l.kind]} · ${getCommunity(l.community)?.name ?? ""}`,
    href: linePath(l),
    type: "line",
    haystack: normalize(`${l.label} ${l.name} ${KIND_LABEL[l.kind]} ${l.community}`),
  })),
  ...STATIONS.map<Item>((s) => ({
    id: `s:${s.slug}`,
    title: s.name,
    subtitle: `Estación · ${s.city}`,
    href: stationPath(s),
    type: "station",
    haystack: normalize(`${s.name} ${s.city}`),
  })),
];

export default function SearchModal() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => {
    const terms = normalize(query).split(/\s+/).filter(Boolean);
    const list = terms.length
      ? ITEMS.filter((i) => terms.every((t) => i.haystack.includes(t)))
      : ITEMS.slice(0, 8);
    return list.slice(0, 10);
  }, [query]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const close = () => {
    setOpen(false);
    setQuery("");
    setActive(0);
  };

  const go = (item: Item | undefined) => {
    if (!item) return;
    close();
    router.push(item.href);
  };

  const onInputKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      go(results[active]);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-lg border border-white/10 bg-slate-900/70 px-3 py-1.5 text-sm text-slate-300 transition hover:border-white/25"
        aria-label="Buscar líneas y estaciones"
      >
        <Search className="h-4 w-4" aria-hidden />
        <span className="hidden sm:inline">Buscar línea o estación</span>
        <kbd className="hidden rounded bg-white/10 px-1.5 py-0.5 text-[10px] sm:inline">Ctrl K</kbd>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 px-4 pt-[15vh] backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Buscador"
              className="w-full max-w-xl overflow-hidden rounded-2xl border border-white/10 bg-slate-900 shadow-2xl"
              initial={{ y: -12, scale: 0.97 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: -12, scale: 0.97 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 border-b border-white/10 px-4">
                <Search className="h-4 w-4 text-slate-400" aria-hidden />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setActive(0);
                  }}
                  onKeyDown={onInputKey}
                  placeholder="Busca C-3, Atocha, AVE Barcelona, Metro L1…"
                  className="w-full bg-transparent py-4 text-sm text-white outline-none placeholder:text-slate-500"
                />
              </div>
              <ul className="max-h-80 overflow-y-auto p-2" role="listbox">
                {results.length === 0 && (
                  <li className="px-3 py-6 text-center text-sm text-slate-400">
                    Sin resultados para «{query}»
                  </li>
                )}
                {results.map((item, i) => (
                  <li key={item.id} role="option" aria-selected={i === active}>
                    <button
                      type="button"
                      onMouseEnter={() => setActive(i)}
                      onClick={() => go(item)}
                      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left ${
                        i === active ? "bg-white/10" : ""
                      }`}
                    >
                      {item.type === "line" ? (
                        <TrainFront className="h-4 w-4 shrink-0 text-sky-400" aria-hidden />
                      ) : (
                        <MapPin className="h-4 w-4 shrink-0 text-emerald-400" aria-hidden />
                      )}
                      <span className="min-w-0">
                        <span className="block truncate text-sm text-white">{item.title}</span>
                        <span className="block truncate text-xs text-slate-400">{item.subtitle}</span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
