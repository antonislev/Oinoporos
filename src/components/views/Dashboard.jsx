import React from "react";
import { MODULES } from "../../data/curriculum";

export default function Dashboard({ data, overallProgress, getModuleStatus, setView }) {
  const headingFont = { fontFamily: "'Playfair Display', serif" };
  const minutes = Math.round(data.totalTimeSpent / 60);

  return (
    <div style={{ position: "relative", zIndex: 1, maxWidth: 700, margin: "0 auto", padding: "32px 20px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
        <button onClick={() => setView("home")} style={{ background: "none", border: "none", color: "#a89888", fontSize: 22, cursor: "pointer" }}>←</button>
        <h2 style={{ ...headingFont, fontSize: 28, color: "#d4a574", margin: 0 }}>Στατιστικά Προόδου</h2>
      </div>

      {/* Overview cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12, marginBottom: 28 }}>
        {[
          { label: "Πρόοδος", value: `${overallProgress}%`, icon: "📈" },
          { label: "Quiz", value: data.quizAttempts, icon: "🎯" },
          { label: "Χρόνος", value: `${minutes} λ.`, icon: "⏱" },
          { label: "Τελικό", value: data.finalScores.length > 0 ? `${data.finalScores[data.finalScores.length - 1]}%` : "—", icon: "🏆" },
        ].map((c, i) => (
          <div key={i} style={{
            background: "rgba(255,255,255,0.04)", borderRadius: 14, padding: "18px 16px", textAlign: "center",
            border: "1px solid rgba(255,255,255,0.06)",
          }}>
            <div style={{ fontSize: 24, marginBottom: 6 }}>{c.icon}</div>
            <div style={{ ...headingFont, fontSize: 26, color: "#d4a574" }}>{c.value}</div>
            <div style={{ fontSize: 12, color: "#6a5a4a", marginTop: 4 }}>{c.label}</div>
          </div>
        ))}
      </div>

      {/* Module details */}
      <h3 style={{ ...headingFont, fontSize: 20, color: "#e8ddd0", marginBottom: 16 }}>Αποτελέσματα ανά ενότητα</h3>
      {MODULES.map(mod => {
        const scores = data.moduleScores[mod.id] || [];
        const visited = (data.moduleSections[mod.id] || []).length;
        const status = getModuleStatus(mod.id);
        const best = scores.length > 0 ? Math.max(...scores) : null;

        return (
          <div key={mod.id} style={{
            background: "rgba(255,255,255,0.03)", borderRadius: 14, padding: "18px 20px", marginBottom: 12,
            border: "1px solid rgba(255,255,255,0.06)",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <div>
                <span style={{ fontSize: 18, marginRight: 8 }}>{mod.icon}</span>
                <span style={{ ...headingFont, fontSize: 17, color: "#e8ddd0" }}>{mod.title}</span>
              </div>
              <span style={{
                fontSize: 11, padding: "4px 10px", borderRadius: 12,
                background: status === "mastered" ? "rgba(100,200,100,0.12)" : status === "needs_review" ? "rgba(255,140,60,0.12)" : "rgba(255,255,255,0.04)",
                color: status === "mastered" ? "#6aba6a" : status === "needs_review" ? "#e8834a" : "#6a5a4a",
              }}>
                {status === "mastered" ? "Κατακτημένο" : status === "needs_review" ? "Χρειάζεται επανάληψη" : status === "in_progress" ? "Σε εξέλιξη" : status === "new" ? "Νέο" : "Έτοιμο"}
              </span>
            </div>

            <div style={{ fontSize: 13, color: "#8a7a6a", display: "flex", gap: 20 }}>
              <span>Υλικό: {visited}/{mod.sections.length}</span>
              <span>Προσπάθειες: {scores.length}</span>
              {best !== null && <span>Καλύτερο: <strong style={{ color: best >= 80 ? "#6aba6a" : "#d4a574" }}>{best}%</strong></span>}
            </div>

            {/* Score history bar chart */}
            {scores.length > 0 && (
              <div style={{ display: "flex", alignItems: "end", gap: 4, marginTop: 12, height: 40 }}>
                {scores.map((s, i) => (
                  <div key={i} style={{
                    flex: 1, maxWidth: 28, height: `${(s / 100) * 40}px`, borderRadius: "4px 4px 0 0",
                    background: s >= 80 ? "#6aba6a" : s >= 60 ? "#d4a574" : "#e8834a",
                    opacity: 0.7, position: "relative",
                  }}>
                    <div style={{ position: "absolute", top: -16, left: "50%", transform: "translateX(-50%)", fontSize: 10, color: "#8a7a6a" }}>{s}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}

      {/* Final quiz history */}
      {data.finalScores.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <h3 style={{ ...headingFont, fontSize: 20, color: "#e8ddd0", marginBottom: 12 }}>Τελικό Quiz — Ιστορικό</h3>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {data.finalScores.map((s, i) => (
              <div key={i} style={{
                padding: "10px 18px", borderRadius: 10,
                background: s >= 80 ? "rgba(100,200,100,0.1)" : "rgba(255,140,60,0.1)",
                border: `1px solid ${s >= 80 ? "rgba(100,200,100,0.2)" : "rgba(255,140,60,0.2)"}`,
                fontSize: 14, color: s >= 80 ? "#6aba6a" : "#e8834a", fontWeight: 600,
              }}>
                #{i + 1}: {s}%
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}