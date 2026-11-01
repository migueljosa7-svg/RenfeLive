export type TransitKind = "cercanias" | "metro" | "ave" | "ouigo" | "iryo";
export type StatusLevel = "ok" | "delay" | "incident";

export interface Community {
  slug: string;
  name: string;
  description: string;
}

export interface Station {
  slug: string;
  name: string;
  city: string;
  lat: number;
  lon: number;
}

export interface Line {
  /** Slug usado en la URL, p. ej. "linea-c3" */
  slug: string;
  community: string;
  kind: TransitKind;
  /** Etiqueta corta, p. ej. "C-3" */
  label: string;
  name: string;
  color: string;
  stations: string[];
}

export const KIND_LABEL: Record<TransitKind, string> = {
  cercanias: "Cercanías",
  metro: "Metro",
  ave: "AVE",
  ouigo: "Ouigo",
  iryo: "Iryo",
};

export const COMMUNITIES: Community[] = [
  { slug: "madrid", name: "Madrid", description: "Cercanías Madrid y Metro de Madrid" },
  { slug: "cataluna", name: "Cataluña", description: "Rodalies de Catalunya y Metro de Barcelona" },
  { slug: "valencia", name: "Comunitat Valenciana", description: "Cercanías Valencia y Metrovalencia" },
  { slug: "andalucia", name: "Andalucía", description: "Cercanías Sevilla, Málaga y Cádiz" },
  { slug: "alta-velocidad", name: "Alta Velocidad", description: "AVE, Ouigo e Iryo entre grandes ciudades" },
];

export const STATIONS: Station[] = [
  // Madrid
  { slug: "atocha-cercanias", name: "Madrid Atocha Cercanías", city: "Madrid", lat: 40.4065, lon: -3.6892 },
  { slug: "chamartin", name: "Madrid Chamartín-Clara Campoamor", city: "Madrid", lat: 40.4722, lon: -3.6826 },
  { slug: "sol", name: "Madrid Sol", city: "Madrid", lat: 40.4169, lon: -3.7035 },
  { slug: "nuevos-ministerios", name: "Nuevos Ministerios", city: "Madrid", lat: 40.4466, lon: -3.6926 },
  { slug: "principe-pio", name: "Príncipe Pío", city: "Madrid", lat: 40.4212, lon: -3.7203 },
  { slug: "alcala-de-henares", name: "Alcalá de Henares", city: "Alcalá de Henares", lat: 40.4818, lon: -3.3636 },
  { slug: "getafe-centro", name: "Getafe Centro", city: "Getafe", lat: 40.3057, lon: -3.7326 },
  { slug: "mostoles-el-soto", name: "Móstoles-El Soto", city: "Móstoles", lat: 40.3223, lon: -3.8669 },
  { slug: "aeropuerto-t4", name: "Aeropuerto T4", city: "Madrid", lat: 40.4915, lon: -3.5933 },
  { slug: "fuenlabrada", name: "Fuenlabrada", city: "Fuenlabrada", lat: 40.2842, lon: -3.7943 },
  { slug: "aranjuez", name: "Aranjuez", city: "Aranjuez", lat: 40.0333, lon: -3.602 },
  { slug: "guadalajara", name: "Guadalajara", city: "Guadalajara", lat: 40.6347, lon: -3.162 },
  { slug: "parla", name: "Parla", city: "Parla", lat: 40.237, lon: -3.767 },
  { slug: "alcobendas", name: "Alcobendas-San Sebastián de los Reyes", city: "Alcobendas", lat: 40.533, lon: -3.642 },
  // Cataluña
  { slug: "barcelona-sants", name: "Barcelona Sants", city: "Barcelona", lat: 41.3791, lon: 2.14 },
  { slug: "passeig-de-gracia", name: "Passeig de Gràcia", city: "Barcelona", lat: 41.3922, lon: 2.1649 },
  { slug: "plaza-catalunya", name: "Plaça Catalunya", city: "Barcelona", lat: 41.387, lon: 2.17 },
  { slug: "arc-de-triomf", name: "Arc de Triomf", city: "Barcelona", lat: 41.3917, lon: 2.1807 },
  { slug: "sant-andreu-arenal", name: "Sant Andreu Arenal", city: "Barcelona", lat: 41.4357, lon: 2.19 },
  { slug: "mataro", name: "Mataró", city: "Mataró", lat: 41.5381, lon: 2.4445 },
  { slug: "sitges", name: "Sitges", city: "Sitges", lat: 41.2358, lon: 1.811 },
  { slug: "girona", name: "Girona", city: "Girona", lat: 41.9794, lon: 2.8189 },
  { slug: "tarragona", name: "Tarragona", city: "Tarragona", lat: 41.1119, lon: 1.2531 },
  { slug: "lleida", name: "Lleida Pirineus", city: "Lleida", lat: 41.6176, lon: 0.62 },
  // Comunitat Valenciana
  { slug: "valencia-nord", name: "València Nord", city: "Valencia", lat: 39.4659, lon: -0.3774 },
  { slug: "valencia-joaquin-sorolla", name: "València Joaquín Sorolla", city: "Valencia", lat: 39.454, lon: -0.382 },
  { slug: "xativa", name: "Xàtiva", city: "Xàtiva", lat: 38.9903, lon: -0.519 },
  { slug: "gandia", name: "Gandia", city: "Gandia", lat: 38.9677, lon: -0.18 },
  { slug: "castellon", name: "Castelló de la Plana", city: "Castellón", lat: 39.9864, lon: -0.0513 },
  { slug: "alicante-terminal", name: "Alicante Terminal", city: "Alicante", lat: 38.3452, lon: -0.4965 },
  // Andalucía
  { slug: "sevilla-santa-justa", name: "Sevilla Santa Justa", city: "Sevilla", lat: 37.3921, lon: -5.9753 },
  { slug: "dos-hermanas", name: "Dos Hermanas", city: "Dos Hermanas", lat: 37.283, lon: -5.921 },
  { slug: "malaga-maria-zambrano", name: "Málaga María Zambrano", city: "Málaga", lat: 36.7119, lon: -4.4313 },
  { slug: "fuengirola", name: "Fuengirola", city: "Fuengirola", lat: 36.542, lon: -4.62 },
  { slug: "cordoba", name: "Córdoba Central", city: "Córdoba", lat: 37.8923, lon: -4.7907 },
  { slug: "cadiz", name: "Cádiz", city: "Cádiz", lat: 36.5297, lon: -6.293 },
  { slug: "jerez", name: "Jerez de la Frontera", city: "Jerez", lat: 36.687, lon: -6.13 },
  // Otras grandes estaciones
  { slug: "zaragoza-delicias", name: "Zaragoza Delicias", city: "Zaragoza", lat: 41.659, lon: -0.911 },
  { slug: "albacete", name: "Albacete Los Llanos", city: "Albacete", lat: 38.999, lon: -1.856 },
  { slug: "valladolid-campo-grande", name: "Valladolid Campo Grande", city: "Valladolid", lat: 41.6444, lon: -4.727 },
  { slug: "a-coruna", name: "A Coruña San Cristóbal", city: "A Coruña", lat: 43.3523, lon: -8.4129 },
  { slug: "bilbao-abando", name: "Bilbao Abando", city: "Bilbao", lat: 43.261, lon: -2.9253 },
  { slug: "granada", name: "Granada", city: "Granada", lat: 37.1836, lon: -3.609 },
];

const L = (
  slug: string,
  community: string,
  kind: TransitKind,
  label: string,
  name: string,
  color: string,
  stations: string[],
): Line => ({ slug, community, kind, label, name, color, stations });

export const LINES: Line[] = [
  // Cercanías Madrid
  L("linea-c1", "madrid", "cercanias", "C-1", "Príncipe Pío – Aeropuerto T4", "#5aa9e6", ["principe-pio", "atocha-cercanias", "nuevos-ministerios", "chamartin", "aeropuerto-t4"]),
  L("linea-c2", "madrid", "cercanias", "C-2", "Guadalajara – Getafe Centro", "#2e9d4f", ["guadalajara", "alcala-de-henares", "chamartin", "nuevos-ministerios", "atocha-cercanias", "getafe-centro"]),
  L("linea-c3", "madrid", "cercanias", "C-3", "Aranjuez – Chamartín", "#a855f7", ["aranjuez", "getafe-centro", "atocha-cercanias", "sol", "nuevos-ministerios", "chamartin"]),
  L("linea-c4", "madrid", "cercanias", "C-4", "Parla – Alcobendas", "#1d4ed8", ["parla", "getafe-centro", "atocha-cercanias", "sol", "nuevos-ministerios", "chamartin", "alcobendas"]),
  L("linea-c5", "madrid", "cercanias", "C-5", "Móstoles-El Soto – Atocha", "#facc15", ["mostoles-el-soto", "fuenlabrada", "getafe-centro", "atocha-cercanias"]),
  L("linea-c7", "madrid", "cercanias", "C-7", "Alcalá de Henares – Príncipe Pío", "#dc2626", ["alcala-de-henares", "atocha-cercanias", "chamartin", "principe-pio"]),
  L("linea-c10", "madrid", "cercanias", "C-10", "Chamartín – Príncipe Pío", "#84cc16", ["chamartin", "nuevos-ministerios", "atocha-cercanias", "principe-pio"]),
  // Metro Madrid
  L("metro-l1", "madrid", "metro", "L1", "Metro Madrid L1", "#38bdf8", ["chamartin", "nuevos-ministerios", "sol", "atocha-cercanias"]),
  L("metro-l6", "madrid", "metro", "L6", "Metro Madrid L6 (circular)", "#9ca3af", ["principe-pio", "nuevos-ministerios", "sol"]),
  L("metro-l10", "madrid", "metro", "L10", "Metro Madrid L10", "#1e3a8a", ["principe-pio", "nuevos-ministerios", "chamartin"]),
  // Cataluña
  L("linea-r1", "cataluna", "cercanias", "R1", "Rodalies R1 Barcelona – Mataró", "#7cb5ec", ["barcelona-sants", "passeig-de-gracia", "arc-de-triomf", "sant-andreu-arenal", "mataro"]),
  L("linea-r2", "cataluna", "cercanias", "R2", "Rodalies R2 Sitges – Sant Andreu", "#34d399", ["sitges", "barcelona-sants", "passeig-de-gracia", "sant-andreu-arenal"]),
  L("linea-r11", "cataluna", "cercanias", "R11", "Rodalies R11 Barcelona – Girona", "#1d4ed8", ["barcelona-sants", "passeig-de-gracia", "girona"]),
  L("linea-r14", "cataluna", "cercanias", "R14", "Rodalies R14 Tarragona – Barcelona", "#a855f7", ["tarragona", "sitges", "barcelona-sants"]),
  L("linea-r13", "cataluna", "cercanias", "R13", "Rodalies R13 Lleida – Barcelona", "#d946ef", ["lleida", "tarragona", "barcelona-sants"]),
  L("metro-l1-bcn", "cataluna", "metro", "L1", "Metro Barcelona L1", "#dc2626", ["plaza-catalunya", "arc-de-triomf", "sant-andreu-arenal"]),
  L("metro-l3-bcn", "cataluna", "metro", "L3", "Metro Barcelona L3", "#16a34a", ["plaza-catalunya", "passeig-de-gracia", "barcelona-sants"]),
  L("metro-l5-bcn", "cataluna", "metro", "L5", "Metro Barcelona L5", "#2563eb", ["barcelona-sants", "passeig-de-gracia", "sant-andreu-arenal"]),
  // Comunitat Valenciana
  L("linea-c1-valencia", "valencia", "cercanias", "C-1", "Cercanías Valencia València – Gandia", "#38bdf8", ["valencia-nord", "gandia"]),
  L("linea-c2-valencia", "valencia", "cercanias", "C-2", "Cercanías Valencia València – Xàtiva", "#22c55e", ["valencia-nord", "xativa"]),
  L("linea-c6-valencia", "valencia", "cercanias", "C-6", "Cercanías Valencia València – Castelló", "#a855f7", ["valencia-nord", "castellon"]),
  L("metro-l3-valencia", "valencia", "metro", "L3", "Metrovalencia L3", "#ef4444", ["valencia-nord", "valencia-joaquin-sorolla"]),
  L("metro-l5-valencia", "valencia", "metro", "L5", "Metrovalencia L5", "#14b8a6", ["valencia-nord", "valencia-joaquin-sorolla"]),
  // Andalucía
  L("linea-c1-sevilla", "andalucia", "cercanias", "C-1", "Cercanías Sevilla Santa Justa – Dos Hermanas", "#38bdf8", ["sevilla-santa-justa", "dos-hermanas"]),
  L("linea-c1-malaga", "andalucia", "cercanias", "C-1", "Cercanías Málaga – Fuengirola", "#22c55e", ["malaga-maria-zambrano", "fuengirola"]),
  L("linea-c1-cadiz", "andalucia", "cercanias", "C-1", "Cercanías Cádiz – Jerez", "#f59e0b", ["cadiz", "jerez"]),
  // Alta velocidad
  L("ave-madrid-barcelona", "alta-velocidad", "ave", "AVE", "AVE Madrid – Barcelona", "#c4002f", ["atocha-cercanias", "zaragoza-delicias", "tarragona", "barcelona-sants"]),
  L("ave-madrid-sevilla", "alta-velocidad", "ave", "AVE", "AVE Madrid – Sevilla", "#c4002f", ["atocha-cercanias", "cordoba", "sevilla-santa-justa"]),
  L("ave-madrid-malaga", "alta-velocidad", "ave", "AVE", "AVE Madrid – Málaga", "#c4002f", ["atocha-cercanias", "cordoba", "malaga-maria-zambrano"]),
  L("ave-madrid-valencia", "alta-velocidad", "ave", "AVE", "AVE Madrid – Valencia", "#c4002f", ["atocha-cercanias", "albacete", "valencia-joaquin-sorolla"]),
  L("ave-madrid-granada", "alta-velocidad", "ave", "AVE", "AVE Madrid – Granada", "#c4002f", ["atocha-cercanias", "cordoba", "granada"]),
  L("ave-madrid-galicia", "alta-velocidad", "ave", "AVE", "AVE Madrid – A Coruña", "#c4002f", ["chamartin", "valladolid-campo-grande", "a-coruna"]),
  L("ave-madrid-bilbao", "alta-velocidad", "ave", "AVE", "Alvia Madrid – Bilbao", "#c4002f", ["chamartin", "valladolid-campo-grande", "bilbao-abando"]),
  L("ouigo-madrid-barcelona", "alta-velocidad", "ouigo", "Ouigo", "Ouigo Madrid – Barcelona", "#e6007e", ["atocha-cercanias", "zaragoza-delicias", "tarragona", "barcelona-sants"]),
  L("ouigo-madrid-valencia", "alta-velocidad", "ouigo", "Ouigo", "Ouigo Madrid – Valencia", "#e6007e", ["atocha-cercanias", "albacete", "valencia-joaquin-sorolla"]),
  L("ouigo-madrid-sevilla", "alta-velocidad", "ouigo", "Ouigo", "Ouigo Madrid – Sevilla", "#e6007e", ["atocha-cercanias", "cordoba", "sevilla-santa-justa"]),
  L("iryo-madrid-barcelona", "alta-velocidad", "iryo", "Iryo", "Iryo Madrid – Barcelona", "#a21caf", ["atocha-cercanias", "zaragoza-delicias", "barcelona-sants"]),
  L("iryo-madrid-sevilla", "alta-velocidad", "iryo", "Iryo", "Iryo Madrid – Sevilla", "#a21caf", ["atocha-cercanias", "cordoba", "sevilla-santa-justa"]),
  L("iryo-madrid-malaga", "alta-velocidad", "iryo", "Iryo", "Iryo Madrid – Málaga", "#a21caf", ["atocha-cercanias", "cordoba", "malaga-maria-zambrano"]),
  L("iryo-madrid-valencia", "alta-velocidad", "iryo", "Iryo", "Iryo Madrid – Valencia", "#a21caf", ["atocha-cercanias", "albacete", "valencia-joaquin-sorolla"]),
];

const stationMap = new Map(STATIONS.map((s) => [s.slug, s]));
const communityMap = new Map(COMMUNITIES.map((c) => [c.slug, c]));

export const getStation = (slug: string) => stationMap.get(slug);
export const getCommunity = (slug: string) => communityMap.get(slug);
export const getLine = (community: string, slug: string) =>
  LINES.find((l) => l.community === community && l.slug === slug);
export const getLinesByCommunity = (community: string) =>
  LINES.filter((l) => l.community === community);
export const getLinesForStation = (stationSlug: string) =>
  LINES.filter((l) => l.stations.includes(stationSlug));
export const lineKey = (l: Pick<Line, "community" | "slug">) => `${l.community}/${l.slug}`;
export const linePath = (l: Pick<Line, "community" | "slug">) =>
  `/incidencias/${l.community}/${l.slug}`;
export const stationPath = (s: Pick<Station, "slug">) => `/estacion/${s.slug}`;

/** Líneas que comparten al menos 2 estaciones con la dada (rutas alternativas). */
export function getAlternatives(line: Line): Line[] {
  const own = new Set(line.stations);
  return LINES.filter(
    (l) => l !== line && l.stations.filter((s) => own.has(s)).length >= 2,
  ).slice(0, 6);
}

export const SEVERITY: Record<StatusLevel, number> = { ok: 0, delay: 1, incident: 2 };
