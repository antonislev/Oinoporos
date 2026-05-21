import React from "react";

export default function Register({ updateData }) {
  const headingFont = { fontFamily: "'Playfair Display', serif" };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: 20 }}>
      <div style={{ textAlign: "center", maxWidth: 460 }}>
        <div style={{ fontSize: 64, marginBottom: 12 }}>🍷</div>
        <h1 style={{ ...headingFont, fontSize: 42, margin: 0, color: "#d4a574", letterSpacing: 2 }}>ΟΙΝΟΠΟΡΟΣ</h1>
        <p style={{ fontSize: 16, color: "#a89080", marginTop: 8, letterSpacing: 4, textTransform: "uppercase" }}>
          Οινοτουριστική Εξερεύνηση του Πόρου
        </p>
        <div style={{ marginTop: 48, background: "rgba(255,255,255,0.04)", borderRadius: 16, padding: "36px 32px", border: "1px solid rgba(212,165,116,0.15)" }}>
          <p style={{ fontSize: 15, color: "#b8a898", marginBottom: 24 }}>Γράψε το όνομά σου για να ξεκινήσεις</p>
          <input
            type="text"
            placeholder="Το όνομά σου..."
            style={{
              width: "100%", padding: "14px 18px", fontSize: 17, borderRadius: 10,
              background: "rgba(0,0,0,0.3)", border: "1px solid rgba(212,165,116,0.25)",
              color: "#e8ddd0", outline: "none", boxSizing: "border-box",
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.target.value.trim()) {
                updateData(d => ({ ...d, username: e.target.value.trim() }));
              }
            }}
            id="nameInput"
          />
          <button
            onClick={() => {
              const v = document.getElementById("nameInput")?.value?.trim();
              if (v) updateData(d => ({ ...d, username: v }));
            }}
            style={{
              marginTop: 16, width: "100%", padding: "14px", fontSize: 16, fontWeight: 600,
              borderRadius: 10, border: "none", cursor: "pointer",
              background: "linear-gradient(135deg, #8B2252, #d4a574)", color: "#fff",
            }}
          >
            Ξεκίνα →
          </button>
        </div>
      </div>
    </div>
  );
}