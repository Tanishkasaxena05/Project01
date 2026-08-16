import { useState, useRef } from 'react';
import { useTimer } from './hooks/useTimer';
import ModeButtons from './components/ModeButtons';
import Clock from './components/Clock';
import WorkTable from './components/WorkTable';
import GoalSettings from './components/GoalSettings';
import Badges from './components/Badges';
import { saveSession, getSessions, getGoals } from './data/storage';
import './App.css';

export default function App() {
  const [activeMode, setActiveMode] = useState(null);
  const { elapsedMs, isRunning, start, stop, reset } = useTimer();
  const sessionStartRef = useRef(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const goals = getGoals();
  const goalMs = activeMode ? (goals[activeMode] || 0) * 60000 : 0;

  const logCurrentSession = () => {
    if (activeMode && sessionStartRef.current) {
      saveSession({
        mode: activeMode,
        startedAt: sessionStartRef.current,
        endedAt: Date.now(),
        durationMs: elapsedMs,
      });
      setRefreshKey((k) => k + 1);
    }
  };

  const handleSelectMode = (mode) => {
    if (activeMode === mode) {
      if (isRunning) {
        logCurrentSession();
        stop();
      } else {
        sessionStartRef.current = Date.now() - elapsedMs;
        start();
      }
      return;
    }

    logCurrentSession();
    reset();
    setActiveMode(mode);
    sessionStartRef.current = Date.now();
    start();
  };

  return (
    <div className="app-shell">
      <div className="app-eyebrow">Daily Rhythm</div>
      <h1 className="app-title">Habit Clock</h1>

      <Clock elapsedMs={elapsedMs} activeMode={activeMode} isRunning={isRunning} goalMs={goalMs} />
      <ModeButtons activeMode={activeMode} onSelectMode={handleSelectMode} />
      <p className="session-count">{getSessions().length} sessions logged</p>

      <WorkTable key={refreshKey} />
      <GoalSettings onGoalsSaved={() => setRefreshKey((k) => k + 1)} />
      <Badges key={`badges-${refreshKey}`} />
    </div>
  );
}