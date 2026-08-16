import { useState, useRef } from 'react';
import { useTimer } from './hooks/useTimer';
import ModeButtons from './components/ModeButtons';
import Clock from './components/Clock';
import WorkTable from './components/WorkTable';
import GoalSettings from './components/GoalSettings';
import Badges from './components/Badges';
import { saveSession, getSessions } from './data/storage';

export default function App() {
  const [activeMode, setActiveMode] = useState(null);
  const { elapsedMs, isRunning, start, stop, reset } = useTimer();
  const sessionStartRef = useRef(null);
  const [refreshKey, setRefreshKey] = useState(0);

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
    <div style={{ maxWidth: '480px', margin: '60px auto', textAlign: 'center' }}>
      <h1>Daily Habit Clock</h1>
      <Clock elapsedMs={elapsedMs} activeMode={activeMode} isRunning={isRunning} />
      <ModeButtons activeMode={activeMode} onSelectMode={handleSelectMode} />
      <p style={{ color: '#999', fontSize: '0.9rem' }}>
        {getSessions().length} sessions logged
      </p>
      <WorkTable key={refreshKey} />
      <GoalSettings onGoalsSaved={() => setRefreshKey((k) => k + 1)} />
      <Badges key={`badges-${refreshKey}`} />
    </div>
  );
}