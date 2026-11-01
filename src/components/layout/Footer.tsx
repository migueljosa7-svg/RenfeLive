import Link from "next/link";
import { COMMUNITIES } from "@/lib/transit-data";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-white/10 py-8 text-sm text-slate-400">
      <div className="mx-auto max-w-6xl space-y-4 px-4">
        <ul className="flex flex-wrap gap-x-5 gap-y-2">
          {COMMUNITIES.map((c) => (
            <li key={c.slug}>
              <Link href={`/incidencias/${c.slug}`} className="hover:text-white">
                Incidencias {c.name}
              </Link>
            </li>
          ))}
        </ul>
        <p>
          RenfeLive es un proyecto independiente y no está afiliado a Renfe, Ouigo, Iryo ni a ningún
          operador. Los estados mostrados son orientativos; consulta siempre los canales oficiales.
        </p>
      </div>
    </footer>
  );
}
