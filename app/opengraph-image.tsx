import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "#09090b",
          color: "white",
          padding: "72px",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: 18,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#3b82f6",
            fontSize: 44,
            fontWeight: 800,
            marginBottom: 44,
          }}
        >
          P
        </div>
        <div style={{ fontSize: 68, fontWeight: 800, letterSpacing: 0 }}>
          ProStockCharts
        </div>
        <div
          style={{
            marginTop: 24,
            maxWidth: 860,
            color: "#a1a1aa",
            fontSize: 34,
            lineHeight: 1.25,
          }}
        >
          Fast, free, professional market charts for research and education.
        </div>
      </div>
    ),
    size
  );
}

