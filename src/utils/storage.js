// src/utils/storage.js
const STORAGE_KEY = "oinoporos_data";

export const getStoredData = () => {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || null; } catch { return null; }
};

export const saveData = (data) => {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch {}
};

export const defaultData = () => ({
  username: "",
  moduleScores: {},
  moduleSections: {},
  finalScores: [],
  lastVisit: Date.now(),
  totalTimeSpent: 0,
  quizAttempts: 0,
});