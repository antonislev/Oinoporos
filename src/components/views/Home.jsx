// src/components/views/Home.jsx
import React from "react";
import { MODULES } from "../../data/curriculum";

export default function Home({
  data,
  overallProgress,
  getRecommendation,
  getModuleStatus,
  setView,
  openModule,
  startFinalQuiz,
  setData,
  defaultData,
  onOpenMap
}) {
  const rec = getRecommendation();
  const headingFont = { fontFamily: "'Playfair Display', serif" };

  return (
    <>
      <div style={{ position: "relative", zIndex: 1, maxWidth: 800, margin: "0 auto", padding: "32px 20px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ fontSize: 48, marginBottom: 4 }}>🍷</div>
          <h1 style={{ ...headingFont, fontSize: 36, margin: 0, color: "#d4a574" }}>ΟΙΝΟΠΟΡΟΣ</h1>
          <p style={{ color: "#8a7a6a", fontSize: 13, letterSpacing: 3, marginTop: 4 }}>ΟΙΝΟΤΟΥΡΙΣΤΙΚΗ ΕΞΕΡΕΥΝΗΣΗ ΤΟΥ ΠΟΡΟΥ</p>
          <p style={{ color: "#a89888", fontSize: 15, marginTop: 12 }}>Καλώς ήρθες, <strong style={{ color: "#d4a574" }}>{data.username}</strong></p>
        </div>

        {/* Progress bar */}
        <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 12, padding: "16px 20px", marginBottom: 24, border: "1px solid rgba(212,165,116,0.1)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#8a7a6a", marginBottom: 8 }}>
            <span>Συνολική πρόοδος</span>
            <span style={{ color: "#d4a574", fontWeight: 600 }}>{overallProgress}%</span>
          </div>
          <div style={{ height: 6, background: "rgba(0,0,0,0.3)", borderRadius: 3 }}>
            <div style={{ height: 6, borderRadius: 3, width: `${overallProgress}%`, background: "linear-gradient(90deg, #8B2252, #d4a574)", transition: "width 0.5s" }} />
          </div>
        </div>

        {/* Recommendation */}
        {rec && (
          <div
            onClick={() => {
              if (rec.type === "final") startFinalQuiz();
              else openModule(rec.moduleId);
            }}
            style={{
              background: "linear-gradient(135deg, rgba(139,34,82,0.2), rgba(212,165,116,0.1))",
              borderRadius: 12, padding: "16px 20px", marginBottom: 24,
              border: "1px solid rgba(212,165,116,0.2)", cursor: "pointer",
              display: "flex", alignItems: "center", gap: 12,
            }}
          >
            <span style={{ fontSize: 22 }}>{rec.type === "review" ? "🔄" : rec.type === "final" ? "🏆" : "→"}</span>
            <div>
              <div style={{ fontSize: 12, color: "#d4a574", textTransform: "uppercase", letterSpacing: 1, marginBottom: 2 }}>Πρόταση</div>
              <div style={{ fontSize: 15, fontWeight: 600 }}>{rec.text}</div>
            </div>
          </div>
        )}

        {/* Modules */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {MODULES.map((mod, i) => {
            const status = getModuleStatus(mod.id);
            const scores = data.moduleScores[mod.id] || [];
            const lastScore = scores.length > 0 ? scores[scores.length - 1] : null;
            const visited = (data.moduleSections[mod.id] || []).length;
            
            return (
              <div
                key={mod.id}
                onClick={() => openModule(mod.id)}
                style={{
                  background: "rgba(255,255,255,0.03)", borderRadius: 14, padding: "20px 22px",
                  border: `1px solid ${status === "mastered" ? "rgba(100,200,100,0.2)" : status === "needs_review" ? "rgba(255,140,60,0.2)" : "rgba(255,255,255,0.06)"}`,
                  cursor: "pointer", transition: "all 0.2s",
                  display: "flex", alignItems: "center", gap: 16,
                }}
              >
                <div style={{
                  width: 52, height: 52, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 26, background: `linear-gradient(135deg, ${mod.color}40, ${mod.color}20)`,
                  border: `1px solid ${mod.color}30`,
                }}>
                  {mod.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, color: "#8a7a6a", marginBottom: 2 }}>ΕΝΟΤΗΤΑ {i + 1}</div>
                  <div style={{ ...headingFont, fontSize: 18, color: "#e8ddd0", marginBottom: 3 }}>{mod.title}</div>
                  <div style={{ fontSize: 13, color: "#8a7a6a" }}>{mod.subtitle}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  {status === "mastered" && <div style={{ fontSize: 12, color: "#6aba6a", fontWeight: 600 }}>✓ {lastScore}%</div>}
                  {status === "needs_review" && <div style={{ fontSize: 12, color: "#e8834a", fontWeight: 600 }}>↻ {lastScore}%</div>}
                  {status === "in_progress" && <div style={{ fontSize: 12, color: "#a89888" }}>{visited}/{mod.sections.length}</div>}
                  {status === "new" && <div style={{ fontSize: 12, color: "#6a5a4a" }}>Νέο</div>}
                </div>
              </div>
            );
          })}

          {/* Final Quiz */}
          <div
            onClick={() => {
              const allDone = MODULES.every(m => (data.moduleScores[m.id] || []).length > 0);
              if (allDone) startFinalQuiz();
            }}
            style={{
              background: MODULES.every(m => (data.moduleScores[m.id] || []).length > 0)
                ? "linear-gradient(135deg, rgba(139,34,82,0.15), rgba(212,165,116,0.08))"
                : "rgba(255,255,255,0.02)",
              borderRadius: 14, padding: "20px 22px",
              border: "1px solid rgba(212,165,116,0.12)",
              cursor: MODULES.every(m => (data.moduleScores[m.id] || []).length > 0) ? "pointer" : "default",
              opacity: MODULES.every(m => (data.moduleScores[m.id] || []).length > 0) ? 1 : 0.4,
              display: "flex", alignItems: "center", gap: 16,
            }}
          >
            <div style={{ width: 52, height: 52, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, background: "rgba(212,165,116,0.1)", border: "1px solid rgba(212,165,116,0.15)" }}>🏆</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: "#8a7a6a", marginBottom: 2 }}>ΤΕΛΙΚΗ ΑΞΙΟΛΟΓΗΣΗ</div>
              <div style={{ ...headingFont, fontSize: 18 }}>Τελικό Quiz</div>
              <div style={{ fontSize: 13, color: "#8a7a6a" }}>Ολοκλήρωσε πρώτα όλα τα quiz ενοτήτων</div>
            </div>
            {data.finalScores.length > 0 && (
              <div style={{ fontSize: 12, color: "#d4a574", fontWeight: 600 }}>{data.finalScores[data.finalScores.length - 1]}%</div>
            )}
          </div>
        </div>

        {/* Bottom nav */}
        <div style={{ display: "flex", justifyContent: "center", gap: 12, marginTop: 32, flexWrap: "wrap" }}>
          <button onClick={onOpenMap} style={{ background: "rgba(212,165,116,0.1)", border: "1px solid rgba(212,165,116,0.2)", borderRadius: 10, padding: "10px 22px", color: "#d4a574", fontSize: 14, cursor: "pointer" }}>
            🗺️ Wine Route
          </button>
          <button onClick={() => setView("dashboard")} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "10px 22px", color: "#a89888", fontSize: 14, cursor: "pointer" }}>
            📊 Στατιστικά
          </button>
          <button onClick={() => { if(confirm("Θέλεις σίγουρα να διαγράψεις όλη σου την πρόοδο;")) { setData(defaultData()); } }} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 10, padding: "10px 22px", color: "#6a5a4a", fontSize: 14, cursor: "pointer" }}>
            🗑 Επαναφορά
          </button>
        </div>
      </div>
    </>
  );
}