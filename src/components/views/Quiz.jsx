import React from "react";
import { MODULES, FINAL_QUIZ } from "../../data/curriculum";

export default function Quiz({
  view,
  activeModule,
  quizState,
  answerQuiz,
  nextQuestion,
  setView,
  openModule,
  startQuiz,
  startFinalQuiz
}) {
  const headingFont = { fontFamily: "'Playfair Display', serif" };
  const questions = view === "final" ? FINAL_QUIZ : MODULES.find(m => m.id === activeModule).quiz;
  const mod = view === "final" ? null : MODULES.find(m => m.id === activeModule);
  const { current, answers, showResult, selectedAnswer } = quizState;

  if (showResult) {
    const score = Math.round((answers.filter(Boolean).length / answers.length) * 100);
    const passed = score >= 60;
    const mastered = score >= 80;
    
    return (
      <div style={{ position: "relative", zIndex: 1, maxWidth: 560, margin: "0 auto", padding: "60px 20px", textAlign: "center" }}>
        <div style={{ fontSize: 72, marginBottom: 16 }}>{mastered ? "🏆" : passed ? "👍" : "📚"}</div>
        <h2 style={{ ...headingFont, fontSize: 32, color: "#d4a574", marginBottom: 8 }}>
          {view === "final" ? "Τελικό Quiz" : mod.title}
        </h2>
        <div style={{
          fontSize: 64, fontWeight: 700, color: mastered ? "#6aba6a" : passed ? "#d4a574" : "#e8834a",
          ...headingFont, margin: "20px 0",
        }}>
          {score}%
        </div>
        <p style={{ fontSize: 16, color: "#a89888", marginBottom: 8 }}>
          {answers.filter(Boolean).length} / {answers.length} σωστές
        </p>
        <p style={{ fontSize: 15, color: "#8a7a6a", marginBottom: 36 }}>
          {mastered ? "Εξαιρετικά! Έχεις κατακτήσει αυτή την ενότητα." :
           passed ? "Καλά πάει! Λίγη ακόμα μελέτη και θα το κατακτήσεις." :
           "Χρειάζεται επανάληψη. Διάβασε ξανά το υλικό και ξαναδοκίμασε."}
        </p>

        {/* Per-question breakdown */}
        <div style={{ textAlign: "left", marginBottom: 32 }}>
          {questions.map((q, i) => (
            <div key={i} style={{
              padding: "12px 16px", marginBottom: 8, borderRadius: 10,
              background: answers[i] ? "rgba(100,200,100,0.06)" : "rgba(255,100,60,0.06)",
              border: `1px solid ${answers[i] ? "rgba(100,200,100,0.15)" : "rgba(255,100,60,0.15)"}`,
            }}>
              <div style={{ fontSize: 13, color: answers[i] ? "#6aba6a" : "#e8834a", marginBottom: 4 }}>
                {answers[i] ? "✓" : "✗"} {q.q}
              </div>
              {!answers[i] && (
                <div style={{ fontSize: 12, color: "#8a7a6a" }}>
                  Σωστή: {q.options[q.correct]} — {q.explanation}
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={() => setView("home")} style={{
            padding: "12px 28px", borderRadius: 10, fontSize: 15, cursor: "pointer",
            background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#a89888",
          }}>
            Αρχική
          </button>
          {!mastered && view !== "final" && (
            <button onClick={() => openModule(activeModule)} style={{
              padding: "12px 28px", borderRadius: 10, fontSize: 15, cursor: "pointer",
              background: "linear-gradient(135deg, #8B2252, #d4a574)", border: "none", color: "#fff", fontWeight: 600,
            }}>
              Επανάληψη υλικού
            </button>
          )}
          <button onClick={() => {
            if (view === "final") startFinalQuiz();
            else startQuiz(activeModule);
          }} style={{
            padding: "12px 28px", borderRadius: 10, fontSize: 15, cursor: "pointer",
            background: "rgba(212,165,116,0.15)", border: "1px solid rgba(212,165,116,0.25)", color: "#d4a574", fontWeight: 600,
          }}>
            Ξαναδοκίμασε
          </button>
        </div>
      </div>
    );
  }

  const q = questions[current];
  
  return (
    <div style={{ position: "relative", zIndex: 1, maxWidth: 620, margin: "0 auto", padding: "32px 20px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <button onClick={() => setView("home")} style={{ background: "none", border: "none", color: "#a89888", fontSize: 22, cursor: "pointer" }}>←</button>
        <div style={{ flex: 1, fontSize: 13, color: "#8a7a6a" }}>
          {view === "final" ? "Τελικό Quiz" : `Quiz: ${mod.title}`}
        </div>
        <div style={{ fontSize: 13, color: "#d4a574", fontWeight: 600 }}>{current + 1}/{questions.length}</div>
      </div>

      {/* Progress dots */}
      <div style={{ display: "flex", gap: 4, marginBottom: 32 }}>
        {questions.map((_, i) => (
          <div key={i} style={{
            flex: 1, height: 4, borderRadius: 2,
            background: i < current ? (answers[i] ? "#6aba6a" : "#e8834a") : i === current ? "#d4a574" : "rgba(255,255,255,0.08)",
          }} />
        ))}
      </div>

      {/* Question */}
      <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 16, padding: "28px 24px", border: "1px solid rgba(255,255,255,0.06)", marginBottom: 20 }}>
        <h3 style={{ ...headingFont, fontSize: 22, color: "#e8ddd0", marginTop: 0, marginBottom: 24, lineHeight: 1.4 }}>{q.q}</h3>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {q.options.map((opt, i) => {
            let bg = "rgba(255,255,255,0.03)";
            let borderColor = "rgba(255,255,255,0.08)";
            let textColor = "#c8b8a8";

            if (selectedAnswer !== null) {
              if (i === q.correct) { bg = "rgba(100,200,100,0.12)"; borderColor = "rgba(100,200,100,0.3)"; textColor = "#6aba6a"; }
              else if (i === selectedAnswer && i !== q.correct) { bg = "rgba(255,100,60,0.12)"; borderColor = "rgba(255,100,60,0.3)"; textColor = "#e8834a"; }
            }

            return (
              <button
                key={i}
                onClick={() => answerQuiz(i)}
                style={{
                  padding: "14px 18px", borderRadius: 10, fontSize: 15, cursor: selectedAnswer !== null ? "default" : "pointer",
                  background: bg, border: `1px solid ${borderColor}`, color: textColor,
                  textAlign: "left", transition: "all 0.2s",
                }}
              >
                <span style={{ color: "#6a5a4a", marginRight: 10, fontWeight: 600 }}>{String.fromCharCode(65 + i)}.</span>
                {opt}
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {selectedAnswer !== null && (
          <div style={{
            marginTop: 16, padding: "14px 16px", borderRadius: 10,
            background: selectedAnswer === q.correct ? "rgba(100,200,100,0.06)" : "rgba(255,140,60,0.06)",
            border: `1px solid ${selectedAnswer === q.correct ? "rgba(100,200,100,0.12)" : "rgba(255,140,60,0.12)"}`,
            fontSize: 14, color: "#a89888", lineHeight: 1.6,
          }}>
            {q.explanation}
          </div>
        )}
      </div>

      {selectedAnswer !== null && (
        <div style={{ textAlign: "right" }}>
          <button
            onClick={nextQuestion}
            style={{
              padding: "12px 28px", borderRadius: 10, fontSize: 15, cursor: "pointer", fontWeight: 600,
              background: "linear-gradient(135deg, #8B2252, #d4a574)", border: "none", color: "#fff",
            }}
          >
            {current + 1 >= questions.length ? "Δες το αποτέλεσμα" : "Επόμενη →"}
          </button>
        </div>
      )}
    </div>
  );
}