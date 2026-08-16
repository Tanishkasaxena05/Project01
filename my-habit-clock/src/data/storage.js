const STORAGE_KEY = 'habit-clock-sessions';
const GOALS_KEY = 'habit-clock-goals';

export function getSessions() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function saveSession(session) {
  const sessions = getSessions();
  sessions.push(session);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}

export function clearSessions() {
  localStorage.removeItem(STORAGE_KEY);
}

// Goals are stored as { Sleep: 480, Walk: 30, Study: 180, Work: 240 }
// values are in MINUTES per day
export function getGoals() {
  const raw = localStorage.getItem(GOALS_KEY);
  return raw ? JSON.parse(raw) : { Sleep: 0, Walk: 0, Study: 0, Work: 0 };
}

export function saveGoals(goals) {
  localStorage.setItem(GOALS_KEY, JSON.stringify(goals));
}