// src/components/views/WineMap.jsx
import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import { MAP_POINTS } from "../../data/curriculum";

/* ── Custom emoji icons for each point type ── */
const makeIcon = (emoji, size = 32) =>
  L.divIcon({
    html: `<div style="
      font-size:${size}px;
      text-align:center;
      line-height:${size + 6}px;
      width:${size + 6}px;
      height:${size + 6}px;
      filter: drop-shadow(0 2px 4px rgba(0,0,0,0.4));
    ">${emoji}</div>`,
    className: "",
    iconSize: [size + 6, size + 6],
    iconAnchor: [(size + 6) / 2, (size + 6) / 2],
    popupAnchor: [0, -(size / 2)],
  });

const ICONS = {
  winery: makeIcon("🍷"),
  nature: makeIcon("🌿"),
  transit: makeIcon("⛵"),
  cultural: makeIcon("🏛️"),
};

/* ── Styles ── */
const H = { fontFamily: "'Playfair Display', serif" };

const popupStyle = `
  .wine-popup .leaflet-popup-content-wrapper {
    background: rgba(26, 15, 30, 0.95);
    color: #e8ddd0;
    border: 1px solid rgba(212, 165, 116, 0.3);
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.5);
    padding: 0;
  }
  .wine-popup .leaflet-popup-tip {
    background: rgba(26, 15, 30, 0.95);
    border: 1px solid rgba(212, 165, 116, 0.2);
  }
  .wine-popup .leaflet-popup-content {
    margin: 0;
    font-family: 'Source Sans 3', sans-serif;
    min-width: 200px;
  }
  .wine-popup .leaflet-popup-close-button {
    color: #8a7a6a !important;
    font-size: 18px !important;
    top: 6px !important;
    right: 8px !important;
  }
  .wine-popup .leaflet-popup-close-button:hover {
    color: #d4a574 !important;
  }
`;

/* ── FlyTo helper: centers map on a point when clicked from sidebar ── */
function FlyToPoint({ center, zoom }) {
  const map = useMap();
  if (center) {
    map.flyTo(center, zoom, { duration: 0.8 });
  }
  return null;
}

/* ── Main WineMap component ── */
export default function WineMap({ onClose }) {
  const [activePoint, setActivePoint] = useState(null);
  const [flyTo, setFlyTo] = useState(null);

  const routePath = MAP_POINTS.map((p) => [p.lat, p.lng]);

  const handlePointClick = (point) => {
    setActivePoint(point.id);
    setFlyTo([point.lat, point.lng]);
  };

  const typeLabels = {
    winery: "Οινοποιείο/ Εστιατόριo",
    nature: "Φύση/ Μονή",
    transit: "Μεταφορά",
    cultural: "Πολιτισμός",
  };
  const typeColors = {
    winery: "#d4a574",
    nature: "#6aba6a",
    transit: "#5a9fd4",
    cultural: "#c4a0d4",
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.9)",
        zIndex: 999,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <style>{popupStyle}</style>

      {/* ── Header ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 20px",
          borderBottom: "1px solid rgba(212,165,116,0.15)",
          background: "rgba(26,15,30,0.8)",
          backdropFilter: "blur(10px)",
        }}
      >
        <div>
          <h2
            style={{
              ...H,
              fontSize: 22,
              color: "#d4a574",
              margin: 0,
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            🗺️ Wine Route: Πόρος – Τροιζηνία
          </h2>
          <p
            style={{
              fontSize: 12,
              color: "#6a5a4a",
              margin: "4px 0 0 0",
              letterSpacing: 1,
            }}
          >
            9 ΣΤΑΣΕΙΣ ΟΙΝΟΤΟΥΡΙΣΤΙΚΗΣ ΔΙΑΔΡΟΜΗΣ
          </p>
        </div>
        <button
          onClick={onClose}
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "#a89888",
            fontSize: 20,
            cursor: "pointer",
            borderRadius: 8,
            width: 36,
            height: 36,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          ✕
        </button>
      </div>

      {/* ── Main content: Map + Sidebar ── */}
      <div style={{ flex: 1, display: "flex", minHeight: 0 }}>
        {/* Map */}
        <div style={{ flex: 1, position: "relative" }}>
          <MapContainer
            center={[37.500, 23.44]}
            zoom={12}
            style={{ height: "100%", width: "100%" }}
            scrollWheelZoom={true}
            zoomControl={true}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
            />

            {/* Route polyline */}
            <Polyline
              positions={routePath}
              color="#d4a574"
              weight={3}
              opacity={0.7}
              dashArray="10,8"
            />

            {/* Markers */}
            {MAP_POINTS.map((p) => (
              <Marker
                key={p.id}
                position={[p.lat, p.lng]}
                icon={ICONS[p.type] || ICONS.winery}
                eventHandlers={{
                  click: () => setActivePoint(p.id),
                }}
              >
                <Popup className="wine-popup" maxWidth={260}>
                  <div style={{ padding: "14px 16px" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        marginBottom: 8,
                      }}
                    >
                      <span
                        style={{
                          background: "rgba(212,165,116,0.15)",
                          border: "1px solid rgba(212,165,116,0.3)",
                          borderRadius: 6,
                          width: 26,
                          height: 26,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 13,
                          fontWeight: 700,
                          color: "#d4a574",
                          flexShrink: 0,
                        }}
                      >
                        {p.id}
                      </span>
                      <strong
                        style={{
                          ...H,
                          fontSize: 16,
                          color: "#e8ddd0",
                        }}
                      >
                        {p.name}
                      </strong>
                    </div>
                    <p
                      style={{
                        fontSize: 13,
                        color: "#a89888",
                        margin: 0,
                        lineHeight: 1.5,
                      }}
                    >
                      {p.desc}
                    </p>
                    <div
                      style={{
                        marginTop: 8,
                        display: "inline-block",
                        padding: "3px 8px",
                        borderRadius: 4,
                        fontSize: 10,
                        fontWeight: 600,
                        letterSpacing: 0.5,
                        textTransform: "uppercase",
                        color: typeColors[p.type],
                        background: `${typeColors[p.type]}15`,
                        border: `1px solid ${typeColors[p.type]}30`,
                      }}
                    >
                      {typeLabels[p.type]}
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}

            {/* FlyTo on sidebar click */}
            {flyTo && <FlyToPoint center={flyTo} zoom={15} />}
          </MapContainer>
        </div>

        {/* Sidebar — stop list */}
        <div
          style={{
            width: 300,
            background: "rgba(26,15,30,0.95)",
            borderLeft: "1px solid rgba(212,165,116,0.1)",
            overflowY: "auto",
            padding: "16px 14px",
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <p
            style={{
              fontSize: 11,
              color: "#6a5a4a",
              textTransform: "uppercase",
              letterSpacing: 2,
              margin: "0 0 8px 4px",
            }}
          >
            Στάσεις διαδρομής
          </p>

          {MAP_POINTS.map((p, i) => {
            const isActive = activePoint === p.id;
            return (
              <div key={p.id}>
                <button
                  onClick={() => handlePointClick(p)}
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    borderRadius: 10,
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.2s",
                    background: isActive
                      ? "rgba(212,165,116,0.12)"
                      : "rgba(255,255,255,0.03)",
                    border: `1px solid ${
                      isActive
                        ? "rgba(212,165,116,0.3)"
                        : "rgba(255,255,255,0.06)"
                    }`,
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 10,
                  }}
                >
                  {/* Step number */}
                  <span
                    style={{
                      background: isActive
                        ? "rgba(212,165,116,0.2)"
                        : "rgba(255,255,255,0.06)",
                      border: `1px solid ${
                        isActive
                          ? "rgba(212,165,116,0.4)"
                          : "rgba(255,255,255,0.1)"
                      }`,
                      borderRadius: 6,
                      width: 28,
                      height: 28,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 13,
                      fontWeight: 700,
                      color: isActive ? "#d4a574" : "#6a5a4a",
                      flexShrink: 0,
                      marginTop: 1,
                    }}
                  >
                    {p.id}
                  </span>
                  <div>
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: isActive ? "#d4a574" : "#c8b8a8",
                        marginBottom: 3,
                      }}
                    >
                      {p.name}
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: "#7a6a5a",
                        lineHeight: 1.4,
                      }}
                    >
                      {p.desc}
                    </div>
                    <span
                      style={{
                        display: "inline-block",
                        marginTop: 6,
                        padding: "2px 6px",
                        borderRadius: 4,
                        fontSize: 9,
                        fontWeight: 600,
                        letterSpacing: 0.5,
                        textTransform: "uppercase",
                        color: typeColors[p.type],
                        background: `${typeColors[p.type]}12`,
                        border: `1px solid ${typeColors[p.type]}25`,
                      }}
                    >
                      {typeLabels[p.type]}
                    </span>
                  </div>
                </button>

                {/* Connector line between stops */}
                {i < MAP_POINTS.length - 1 && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-start",
                      paddingLeft: 18,
                      height: 16,
                    }}
                  >
                    <div
                      style={{
                        width: 1,
                        height: "100%",
                        background:
                          "linear-gradient(to bottom, rgba(212,165,116,0.2), rgba(212,165,116,0.05))",
                      }}
                    />
                  </div>
                )}
              </div>
            );
          })}

          {/* Legend */}
          <div
            style={{
              marginTop: "auto",
              paddingTop: 16,
              borderTop: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <p
              style={{
                fontSize: 10,
                color: "#5a4a3a",
                textTransform: "uppercase",
                letterSpacing: 1,
                margin: "0 0 8px 0",
              }}
            >
              Υπόμνημα
            </p>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 6,
              }}
            >
              {Object.entries(typeLabels).map(([key, label]) => (
                <div
                  key={key}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    fontSize: 11,
                    color: "#7a6a5a",
                  }}
                >
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: typeColors[key],
                      flexShrink: 0,
                    }}
                  />
                  {label}
                </div>
              ))}
            </div>
            <p
              style={{
                fontSize: 10,
                color: "#4a3a2a",
                margin: "10px 0 0 0",
                lineHeight: 1.4,
              }}
            >
              Πάτα πάνω σε σημείο στον χάρτη ή στη λίστα για λεπτομέρειες.
              Η διακεκομμένη γραμμή δείχνει τη διαδρομή.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}