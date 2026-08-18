import { db, auth } from '../firebase';
import {
  collection, addDoc, getDocs, query, where,
  doc, setDoc, getDoc
} from 'firebase/firestore';

function uid() {
  return auth.currentUser?.uid;
}

// --- Sessions ---
export async function getSessions() {
  const userId = uid();
  if (!userId) return [];
  const q = query(collection(db, 'sessions'), where('userId', '==', userId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data());
}

export async function saveSession(session) {
  const userId = uid();
  if (!userId) return;
  await addDoc(collection(db, 'sessions'), { ...session, userId });
}

// --- Goals ---
export async function getGoals() {
  const userId = uid();
  if (!userId) return { Sleep: 0, Walk: 0, Study: 0, Work: 0 };
  const ref = doc(db, 'goals', userId);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : { Sleep: 0, Walk: 0, Study: 0, Work: 0 };
}

export async function saveGoals(goals) {
  const userId = uid();
  if (!userId) return;
  await setDoc(doc(db, 'goals', userId), goals);
}

// --- Streaks (same logic, just needs sessions/goals to be awaited first) ---
function dateKey(timestamp) {
  const d = new Date(timestamp);
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

export async function getDailyTotals() {
  const sessions = await getSessions();
  const byDay = {};
  for (const s of sessions) {
    const key = dateKey(s.startedAt);
    if (!byDay[key]) byDay[key] = {};
    byDay[key][s.mode] = (byDay[key][s.mode] || 0) + s.durationMs;
  }
  return byDay;
}

export async function getStreak(mode) {
  const goals = await getGoals();
  const goalMs = (goals[mode] || 0) * 60000;
  if (goalMs <= 0) return 0;

  const dailyTotals = await getDailyTotals();
  let streak = 0;
  let date = new Date();

  while (true) {
    const key = dateKey(date.getTime());
    const dayTotal = dailyTotals[key]?.[mode] || 0;
    if (dayTotal >= goalMs) {
      streak++;
      date.setDate(date.getDate() - 1);
    } else break;
  }
  return streak;
}