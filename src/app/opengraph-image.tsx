import { ImageResponse } from "next/og";

export const alt = "renfe-live · Estado de Cercanías, AVE y Metro en directo";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "#020617",
          color: "#fff",
        }}
      >
        <div style={{ display: "flex", fontSize: 96, fontWeight: 800 }}>
          <span>renfe-</span>
          <span style={{ color: "#ef4444" }}>live</span>
        </div>
        <div style={{ fontSize: 44, marginTop: 24, color: "#cbd5e1" }}>
          Retrasos e incidencias de Cercanías, AVE y Metro en directo
        </div>
      </div>
    ),
    size,
  );
}
