import type { NextConfig } from "next";
import { STATION_ALIASES } from "./src/lib/station-aliases";

const nextConfig: NextConfig = {
  async redirects() {
    return Object.entries(STATION_ALIASES).map(([from, to]) => ({
      source: `/estacion/${from}`,
      destination: `/estacion/${to}`,
      permanent: true,
    }));
  },
};

export default nextConfig;
