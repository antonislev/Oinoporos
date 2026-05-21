// src/components/views/ModuleReader.jsx
import React, { useEffect, useState } from "react";
import { MODULES } from "../../data/curriculum";

/* ── Matching Activity ── */
function MatchingActivity({ activity, onComplete }) {
  const [leftItems] = useState(() => activity.pairs.map((p, i) => ({ id: i, text: p.left })));
  const [rightItems] = useState(() => [...activity.pairs.map((p, i) => ({ id: i, text: p.right }))].sort(() => Math.random() - 0.5));
  const [selectedLeft, setSelectedLeft] = useState(null);
  const [matches, setMatches] = useState({});
  const [wrongPair, setWrongPair] = useState(null);

  const handleLeftClick = (id) => { if (matches[id] !== undefined) return; setSelectedLeft(id); };
  const handleRightClick = (id) => {
    if (selectedLeft === null) return;
    if (Object.values(matches).includes(id)) return;
    if (selectedLeft === id) {
      const newMatches = { ...matches, [selectedLeft]: id };
      setMatches(newMatches);
      setSelectedLeft(null);
      if (Object.keys(newMatches).length === activity.pairs.length) {
        const score = Math.round((Object.keys(newMatches).length / activity.pairs.length) * 100);
        setTimeout(() => onComplete(score), 600);
      }
    } else {
      setWrongPair({ left: selectedLeft, right: id });
      setTimeout(() => { setWrongPair(null); setSelectedLeft(null); }, 800);
    }
  };

  return (
    <div>
      <p style={{ color: "#8a7a6a", fontSize: 13, marginBottom: 16 }}>{activity.instruction}</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {leftItems.map(item => {
            const matched = matches[item.id] !== undefined;
            const selected = selectedLeft === item.id;
            const wrong = wrongPair?.left === item.id;
            return (
              <button key={item.id} onClick={() => handleLeftClick(item.id)} style={{
                padding: "10px 12px", borderRadius: 8, fontSize: 13, cursor: matched ? "default" : "pointer",
                textAlign: "left", transition: "all 0.2s",
                background: matched ? "rgba(100,200,100,0.12)" : selected ? "rgba(212,165,116,0.2)" : wrong ? "rgba(255,80,60,0.15)" : "rgba(255,255,255,0.04)",
                border: `1px solid ${matched ? "rgba(100,200,100,0.3)" : selected ? "rgba(212,165,116,0.4)" : wrong ? "rgba(255,80,60,0.3)" : "rgba(255,255,255,0.08)"}`,
                color: matched ? "#6aba6a" : "#e8ddd0", opacity: matched ? 0.6 : 1,
              }}>
                {matched ? "✓ " : ""}{item.text}
              </button>
            );
          })}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {rightItems.map(item => {
            const matched = Object.values(matches).includes(item.id);
            const wrong = wrongPair?.right === item.id;
            return (
              <button key={item.id} onClick={() => handleRightClick(item.id)} style={{
                padding: "10px 12px", borderRadius: 8, fontSize: 13, cursor: matched ? "default" : "pointer",
                textAlign: "left", transition: "all 0.2s",
                background: matched ? "rgba(100,200,100,0.12)" : wrong ? "rgba(255,80,60,0.15)" : "rgba(255,255,255,0.04)",
                border: `1px solid ${matched ? "rgba(100,200,100,0.3)" : wrong ? "rgba(255,80,60,0.3)" : "rgba(255,255,255,0.08)"}`,
                color: matched ? "#6aba6a" : "#e8ddd0", opacity: matched ? 0.6 : 1,
              }}>
                {matched ? "✓ " : ""}{item.text}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ── Ordering Activity ── */
function OrderingActivity({ activity, onComplete }) {
  const [items, setItems] = useState(() => [...activity.items].sort(() => Math.random() - 0.5));
  const [submitted, setSubmitted] = useState(false);

  const swap = (i, j) => { const arr = [...items]; [arr[i], arr[j]] = [arr[j], arr[i]]; setItems(arr); };
  const moveUp = (i) => { if (i > 0) swap(i, i - 1); };
  const moveDown = (i) => { if (i < items.length - 1) swap(i, i + 1); };

  const handleSubmit = () => {
    setSubmitted(true);
    let correct = 0;
    items.forEach((item, i) => { if (item === activity.items[i]) correct++; });
    const score = Math.round((correct / items.length) * 100);
    setTimeout(() => onComplete(score), 1500);
  };

  return (
    <div>
      <p style={{ color: "#8a7a6a", fontSize: 13, marginBottom: 16 }}>{activity.instruction}</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 6, maxWidth: 420 }}>
        {items.map((item, i) => {
          const isCorrect = submitted && item === activity.items[i];
          const isWrong = submitted && item !== activity.items[i];
          return (
            <div key={item} style={{
              display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", borderRadius: 8,
              background: isCorrect ? "rgba(100,200,100,0.12)" : isWrong ? "rgba(255,80,60,0.1)" : "rgba(255,255,255,0.04)",
              border: `1px solid ${isCorrect ? "rgba(100,200,100,0.3)" : isWrong ? "rgba(255,80,60,0.25)" : "rgba(255,255,255,0.08)"}`,
            }}>
              <span style={{ color: "#6a5a4a", fontWeight: 700, width: 20, fontSize: 13 }}>{i + 1}.</span>
              <span style={{ flex: 1, fontSize: 13, color: "#e8ddd0" }}>{item}</span>
              {!submitted && (
                <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <button onClick={() => moveUp(i)} disabled={i === 0} style={{ background: "none", border: "none", color: i === 0 ? "#3a2a1a" : "#a89888", cursor: i === 0 ? "default" : "pointer", fontSize: 14, padding: 0, lineHeight: 1 }}>▲</button>
                  <button onClick={() => moveDown(i)} disabled={i === items.length - 1} style={{ background: "none", border: "none", color: i === items.length - 1 ? "#3a2a1a" : "#a89888", cursor: i === items.length - 1 ? "default" : "pointer", fontSize: 14, padding: 0, lineHeight: 1 }}>▼</button>
                </div>
              )}
              {isCorrect && <span style={{ color: "#6aba6a", fontSize: 14 }}>✓</span>}
              {isWrong && <span style={{ color: "#e8834a", fontSize: 11 }}>→ {activity.items[i]}</span>}
            </div>
          );
        })}
      </div>
      {!submitted && (
        <button onClick={handleSubmit} style={{
          marginTop: 14, padding: "10px 24px", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer",
          background: "linear-gradient(135deg, #8B2252, #d4a574)", border: "none", color: "#fff",
        }}>Έλεγχος</button>
      )}
    </div>
  );
}

/* ── Main ModuleReader ── */
export default function ModuleReader({
  data,
  activeModule,
  activeSection,
  setActiveSection,
  markSectionVisited,
  startQuiz,
  setView
}) {
  const mod = MODULES.find(m => m.id === activeModule);
  const sec = mod.sections[activeSection];
  const headingFont = { fontFamily: "'Playfair Display', serif" };
  const [showActivity, setShowActivity] = useState(false);
  const [imgError, setImgError] = useState(false);

  // Reset states on section change
  useEffect(() => {
    setShowActivity(false);
    setImgError(false);
    markSectionVisited(mod.id, activeSection);
  }, [activeModule, activeSection]);

  // Activity view
  if (showActivity && mod.activity) {
    const ActivityComp = mod.activity.type === "ordering" ? OrderingActivity : MatchingActivity;
    return (
      <div style={{ position: "relative", zIndex: 1, maxWidth: 720, margin: "0 auto", padding: "24px 20px" }}>
        <button onClick={() => setShowActivity(false)} style={{ background: "none", border: "none", color: "#a89888", fontSize: 18, cursor: "pointer", marginBottom: 16, padding: 4 }}>← Πίσω στο υλικό</button>
        <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 16, padding: "24px 20px", border: "1px solid rgba(255,255,255,0.06)" }}>
          <h3 style={{ ...headingFont, fontSize: 20, color: "#d4a574", marginTop: 0, marginBottom: 14 }}>{mod.activity.title}</h3>
          <ActivityComp
            activity={mod.activity}
            onComplete={(score) => {
              setTimeout(() => setShowActivity(false), 500);
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: "relative", zIndex: 1, maxWidth: 720, margin: "0 auto", padding: "24px 20px" }}>
      {/* Top bar */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <button onClick={() => setView("home")} style={{ background: "none", border: "none", color: "#a89888", fontSize: 22, cursor: "pointer", padding: 4 }}>←</button>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, color: mod.color, textTransform: "uppercase", letterSpacing: 2 }}>{mod.icon} {mod.title}</div>
        </div>
        <div style={{ fontSize: 12, color: "#6a5a4a" }}>{activeSection + 1} / {mod.sections.length}</div>
      </div>

      {/* Section tabs */}
      <div style={{ display: "flex", gap: 6, marginBottom: 24, overflowX: "auto" }}>
        {mod.sections.map((s, i) => {
          const visited = (data.moduleSections[mod.id] || []).includes(i);
          return (
            <button
              key={i}
              onClick={() => setActiveSection(i)}
              style={{
                padding: "8px 16px", borderRadius: 20, fontSize: 12, cursor: "pointer", whiteSpace: "nowrap",
                background: i === activeSection ? `${mod.color}30` : visited ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.02)",
                border: `1px solid ${i === activeSection ? mod.color + "50" : "rgba(255,255,255,0.06)"}`,
                color: i === activeSection ? "#e8ddd0" : visited ? "#8a7a6a" : "#5a4a3a",
              }}
            >
              {visited && i !== activeSection && "✓ "}{s.title}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 16, padding: "28px 24px", border: "1px solid rgba(255,255,255,0.06)" }}>
        <h2 style={{ ...headingFont, fontSize: 26, color: "#d4a574", marginTop: 0, marginBottom: 20 }}>{sec.title}</h2>

        {/* ── IMAGE ── */}
        {sec.image && !imgError && (
          <div style={{ marginBottom: 20, borderRadius: 12, overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)" }}>
            <img
              src={sec.image}
              alt={sec.imageCaption || sec.title}
              style={{ width: "100%", height: "auto", display: "block", maxHeight: 320, objectFit: "cover" }}
              onError={() => setImgError(true)}
            />
            {sec.imageCaption && (
              <div style={{ padding: "8px 14px", fontSize: 12, color: "#8a7a6a", background: "rgba(0,0,0,0.4)", fontStyle: "italic", lineHeight: 1.4 }}>
                📷 {sec.imageCaption}
              </div>
            )}
          </div>
        )}

        {/* ── TEXT ── */}
        {sec.content.split("\n\n").map((para, i) => (
          <p key={i} style={{ fontSize: 15, lineHeight: 1.8, color: "#c8b8a8", marginBottom: 16 }}>{para}</p>
        ))}

        {/* ── VIDEO ── */}
        {sec.video && (
          <div style={{ marginTop: 20, borderRadius: 12, overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}>
              <iframe
                src={sec.video}
                title={sec.videoCaption || "Video"}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
              />
            </div>
            {sec.videoCaption && (
              <div style={{ padding: "8px 14px", fontSize: 12, color: "#8a7a6a", background: "rgba(0,0,0,0.4)" }}>
                🎬 {sec.videoCaption}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 20, gap: 10, flexWrap: "wrap" }}>
        <button
          onClick={() => activeSection > 0 && setActiveSection(activeSection - 1)}
          disabled={activeSection === 0}
          style={{
            padding: "12px 24px", borderRadius: 10, fontSize: 14, cursor: activeSection === 0 ? "default" : "pointer",
            background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
            color: activeSection === 0 ? "#3a2a1a" : "#a89888", opacity: activeSection === 0 ? 0.4 : 1,
          }}
        >
          ← Προηγ.
        </button>

        {/* Activity button */}
        {mod.activity && (
          <button
            onClick={() => setShowActivity(true)}
            style={{
              padding: "12px 20px", borderRadius: 10, fontSize: 14, cursor: "pointer",
              background: "rgba(212,165,116,0.1)", border: "1px solid rgba(212,165,116,0.2)", color: "#d4a574",
            }}
          >
            🧩 Δραστηριότητα
          </button>
        )}

        {activeSection < mod.sections.length - 1 ? (
          <button
            onClick={() => setActiveSection(activeSection + 1)}
            style={{
              padding: "12px 24px", borderRadius: 10, fontSize: 14, cursor: "pointer", fontWeight: 600,
              background: `linear-gradient(135deg, ${mod.color}, ${mod.color}cc)`, border: "none", color: "#fff",
            }}
          >
            Επόμενο →
          </button>
        ) : (
          <button
            onClick={() => startQuiz(mod.id)}
            style={{
              padding: "12px 24px", borderRadius: 10, fontSize: 14, cursor: "pointer", fontWeight: 600,
              background: "linear-gradient(135deg, #d4a574, #8B2252)", border: "none", color: "#fff",
            }}
          >
            🎯 Quiz Ενότητας
          </button>
        )}
      </div>
    </div>
  );
}