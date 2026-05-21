// App.jsx
import { useState, useEffect, useCallback, useMemo } from "react";
import { MODULES, FINAL_QUIZ } from "./data/curriculum";
import { getStoredData, saveData, defaultData } from "./utils/storage";
import AppContainer from "./components/layout/AppContainer";
import Register from "./components/views/Register";
import Home from "./components/views/Home";
import ModuleReader from "./components/views/ModuleReader";
import Quiz from "./components/views/Quiz";
import Dashboard from "./components/views/Dashboard";
import WineMap from "./components/views/WineMap";

export default function OinoPoros() {
  const [data, setData] = useState(() => getStoredData() || defaultData());
  const [view, setView] = useState("home"); 
  const [activeModule, setActiveModule] = useState(null);
  const [activeSection, setActiveSection] = useState(0);
  const [quizState, setQuizState] = useState({ current: 0, answers: [], showResult: false, selectedAnswer: null });
  const [showMap, setShowMap] = useState(false);

  // persist
  useEffect(() => { saveData(data); }, [data]);

  // track time
  useEffect(() => {
    const interval = setInterval(() => {
      setData(d => ({ ...d, totalTimeSpent: d.totalTimeSpent + 10, lastVisit: Date.now() }));
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const updateData = useCallback((fn) => setData(d => { const n = fn(d); return { ...n }; }), []);

  // ── ADAPTIVE LOGIC ──
  const getModuleStatus = (modId) => {
    const scores = data.moduleScores[modId] || [];
    const visited = data.moduleSections[modId] || [];
    const mod = MODULES.find(m => m.id === modId);
    const allSections = mod ? mod.sections.length : 0;
    
    if (scores.length === 0 && visited.length === 0) return "new";
    if (scores.length > 0 && scores[scores.length - 1] >= 80) return "mastered";
    if (scores.length > 0 && scores[scores.length - 1] < 60) return "needs_review";
    if (visited.length < allSections) return "in_progress";
    
    return "ready_for_quiz";
  };

  const getRecommendation = () => {
    for (const mod of MODULES) {
      const st = getModuleStatus(mod.id);
      if (st === "needs_review") return { text: `Επανάληψη: ${mod.title}`, moduleId: mod.id, type: "review" };
    }
    for (const mod of MODULES) {
      const st = getModuleStatus(mod.id);
      if (st === "new" || st === "in_progress") return { text: `Συνέχισε: ${mod.title}`, moduleId: mod.id, type: "continue" };
    }
    
    const allMastered = MODULES.every(m => getModuleStatus(m.id) === "mastered");
    if (allMastered && data.finalScores.length === 0) return { text: "Έτοιμος για το τελικό quiz!", moduleId: null, type: "final" };
    
    return null;
  };

  const overallProgress = useMemo(() => {
    let total = 0;
    let done = 0;
    
    MODULES.forEach(m => {
      total += m.sections.length + 1; // sections + quiz
      const visited = (data.moduleSections[m.id] || []).length;
      const quizDone = (data.moduleScores[m.id] || []).length > 0 ? 1 : 0;
      done += visited + quizDone;
    });
    
    if (data.finalScores.length > 0) done += 1;
    total += 1; // final quiz
    
    return Math.round((done / total) * 100);
  }, [data]);

  // ── HANDLERS ──
  const openModule = (modId) => {
    setActiveModule(modId);
    setActiveSection(0);
    setView("module");
  };

  const markSectionVisited = (modId, secIdx) => {
    updateData(d => {
      const existing = d.moduleSections[modId] || [];
      if (!existing.includes(secIdx)) {
        return { ...d, moduleSections: { ...d.moduleSections, [modId]: [...existing, secIdx] } };
      }
      return d;
    });
  };

  const startQuiz = (modId) => {
    setActiveModule(modId);
    setQuizState({ current: 0, answers: [], showResult: false, selectedAnswer: null });
    setView("quiz");
  };

  const startFinalQuiz = () => {
    setActiveModule(null);
    setQuizState({ current: 0, answers: [], showResult: false, selectedAnswer: null });
    setView("final");
  };

  const answerQuiz = (idx) => {
    if (quizState.selectedAnswer !== null) return;
    setQuizState(s => ({ ...s, selectedAnswer: idx }));
  };

  const nextQuestion = () => {
    const questions = view === "final" ? FINAL_QUIZ : MODULES.find(m => m.id === activeModule).quiz;
    const isCorrect = quizState.selectedAnswer === questions[quizState.current].correct;
    const newAnswers = [...quizState.answers, isCorrect];

    if (quizState.current + 1 >= questions.length) {
      const score = Math.round((newAnswers.filter(Boolean).length / newAnswers.length) * 100);
      
      if (view === "final") {
        updateData(d => ({ ...d, finalScores: [...d.finalScores, score], quizAttempts: d.quizAttempts + 1 }));
      } else {
        updateData(d => ({
          ...d,
          moduleScores: { ...d.moduleScores, [activeModule]: [...(d.moduleScores[activeModule] || []), score] },
          quizAttempts: d.quizAttempts + 1,
        }));
      }
      
      setQuizState(s => ({ ...s, answers: newAnswers, showResult: true }));
    } else {
      setQuizState(s => ({ ...s, current: s.current + 1, answers: newAnswers, selectedAnswer: null }));
    }
  };

  // check if registered
  const needsRegister = !data.username;

  if (needsRegister) {
    return <AppContainer><Register updateData={updateData} /></AppContainer>;
  }

  let content;
  switch (view) {
    case "home":
    content = <Home data={data} overallProgress={overallProgress} getRecommendation={getRecommendation} getModuleStatus={getModuleStatus} setView={setView} openModule={openModule} startFinalQuiz={startFinalQuiz} setData={setData} defaultData={defaultData} onOpenMap={() => setShowMap(true)}/>;
    break;
    case "module":
      content = <ModuleReader data={data} activeModule={activeModule} activeSection={activeSection} setActiveSection={setActiveSection} markSectionVisited={markSectionVisited} startQuiz={startQuiz} setView={setView} />;
      break;
    case "quiz":
    case "final":
      content = <Quiz data={data} view={view} activeModule={activeModule} quizState={quizState} answerQuiz={answerQuiz} nextQuestion={nextQuestion} setView={setView} openModule={openModule} startQuiz={startQuiz} startFinalQuiz={startFinalQuiz} />;
      break;
    case "dashboard":
      content = <Dashboard data={data} overallProgress={overallProgress} getModuleStatus={getModuleStatus} setView={setView} />;
      break;
    default:
      content = <Home data={data} overallProgress={overallProgress} getRecommendation={getRecommendation} getModuleStatus={getModuleStatus} setView={setView} openModule={openModule} startFinalQuiz={startFinalQuiz} setData={setData} defaultData={defaultData} />;
  }

  return (
  <AppContainer>
    {content}
    {showMap && <WineMap onClose={() => setShowMap(false)} />}
  </AppContainer>
);
}