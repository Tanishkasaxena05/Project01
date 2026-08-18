import { useState, useRef, useEffect, useCallback } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebase';
import { useTimer } from './hooks/useTimer';
import ModeButtons from './components/ModeButtons';
import Clock from './components/Clock';
import WorkTable from './components/WorkTable';
import GoalSettings from './components/GoalSettings';
import Badges from './components/Badges';
import AuthScreen from './components/AuthScreen';
import { saveSession, getSessions, getGoals } from './data/storage';
import './App.css';

export default function App() {
  const [user, setUser] = useState(undefined);
  const [activeMode, setActiveMode] = useState(null);
  const { elapsedMs, isRunning, start, stop, reset } = useTimer();
  const sessionStartRef = useRef(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const [sessionCount, setSessionCount] = useState(0);
  const [goalMs, setGoalMs] = useState(0);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return unsub;
  }, []);

  // Reload session count + active mode's goal whenever data changes or mode switches
  useEffect(() => {
    if (!user) return;
    (async () => {
      const sessions = await getSessions();
      setSessionCount(sessions.length);

      const goals = await getGoals();
      setGoalMs(activeMode ? (goals[activeMode] || 0) * 60000 : 0);
    })();
  }, [user, activeMode, refreshKey]);

  const logCurrentSession = useCallback(async () => {
    if (activeMode && sessionStartRef.current) {
      await saveSession({
        mode: activeMode,
        startedAt: sessionStartRef.current,
        endedAt: Date.now(),
        durationMs: elapsedMs,
      });
      setRefreshKey((k) => k + 1);
    }
  }, [activeMode, elapsedMs]);

  const handleSelectMode = async (mode) => {
    if (activeMode === mode) {
      if (isRunning) {
        await logCurrentSession();
        stop();
      } else {
        sessionStartRef.current = Date.now() - elapsedMs;
        start();
      }
      return;
    }
    await logCurrentSession();
    reset();
    setActiveMode(mode);
    sessionStartRef.current = Date.now();
    start();
  };

  if (user === undefined) {
    return <div className="app-shell"><p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</p></div>;
  }

  if (!user) {
    return <AuthScreen />;
  }

  return (
    <div className="app-shell">
      <div className="app-eyebrow">Daily Rhythm</div>
      <h1 className="app-title">Habit Clock</h1>
      <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '-30px', marginBottom: '30px' }}>
        {user.email} · <span style={{ textDecoration: 'underline', cursor: 'pointer' }} onClick={() => signOut(auth)}>Log out</span>
      </p>

      <Clock elapsedMs={elapsedMs} activeMode={activeMode} isRunning={isRunning} goalMs={goalMs} />
      <ModeButtons activeMode={activeMode} onSelectMode={handleSelectMode} />
      <p className="session-count">{sessionCount} sessions logged</p>

      <WorkTable key={refreshKey} />
      <GoalSettings onGoalsSaved={() => setRefreshKey((k) => k + 1)} />
      <Badges key={`badges-${refreshKey}`} />
    </div>
  );
}