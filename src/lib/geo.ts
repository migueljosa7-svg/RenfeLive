export const MAP_W = 760;
export const MAP_H = 600;

const LON_MIN = -9.8;
const LAT_MAX = 44;
const K = 54;
const LAT_STRETCH = 1.3;

export function project(lat: number, lon: number): [number, number] {
  return [(lon - LON_MIN) * K, (LAT_MAX - lat) * K * LAT_STRETCH];
}

/** Contorno simplificado de la península ibérica (lat, lon). */
const OUTLINE: [number, number][] = [
  [43.3, -8.9], [43.78, -7.7], [43.55, -5.8], [43.47, -3.8], [43.4, -2.9],
  [43.37, -1.8], [42.8, -0.5], [42.8, 0.7], [42.5, 1.7], [42.35, 3.2],
  [41.8, 3.1], [41.4, 2.2], [41.1, 1.2], [40.7, 0.8], [39.5, -0.3],
  [38.7, 0.2], [38.3, -0.5], [37.6, -0.9], [36.8, -2.4], [36.7, -4.4],
  [36.1, -5.4], [36.0, -5.6], [36.5, -6.3], [37.2, -7.4], [38.0, -7.5],
  [39.7, -7.3], [41.0, -6.9], [41.6, -6.2], [41.9, -6.8], [42.0, -7.2],
  [42.1, -8.8], [42.8, -9.0], [42.9, -9.3], [43.3, -8.9],
];

export const SPAIN_PATH =
  OUTLINE.map(([lat, lon], i) => {
    const [x, y] = project(lat, lon);
    return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ") + " Z";
