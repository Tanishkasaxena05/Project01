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

export function getGoals() {
  const raw = localStorage.getItem(GOALS_KEY);
  return raw ? JSON.parse(raw) : { Sleep: 0, Walk: 0, Study: 0, Work: 0 };
}

export function saveGoals(goals) {
  localStorage.setItem(GOALS_KEY, JSON.stringify(goals));
}

// Returns a date string like "2026-08-16" for grouping sessions by day
function dateKey(timestamp) {
  const d = new Date(timestamp);
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

// Groups all sessions by day, then by mode, summing durations.
// Returns: { "2026-08-16": { Study: 3600000, Work: 1800000 }, ... }
export function getDailyTotals() {
  const sessions = getSessions();
  const byDay = {};

  for (const s of sessions) {
    const key = dateKey(s.startedAt);
    if (!byDay[key]) byDay[key] = {};
    byDay[key][s.mode] = (byDay[key][s.mode] || 0) + s.durationMs;
  }

  return byDay;
}

// Calculates current consecutive-day streak for a given mode,
// counting backward from today. Stops at the first day the goal was missed.
export function getStreak(mode) {
  const goals = getGoals();
  const goalMs = (goals[mode] || 0) * 60000;
  if (goalMs <= 0) return 0; // no goal set, no streak possible

  const dailyTotals = getDailyTotals();
  let streak = 0;
  let date = new Date();

  while (true) {
    const key = dateKey(date.getTime());
    const dayTotal = dailyTotals[key]?.[mode] || 0;

    if (dayTotal >= goalMs) {
      streak++;
      date.setDate(date.getDate() - 1); // go back one day
    } else {
      break;
    }
  }

  return streak;
}