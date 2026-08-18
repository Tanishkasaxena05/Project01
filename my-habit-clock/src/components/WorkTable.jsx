import { useState, useEffect } from 'react';
import { getSessions, getGoals } from '../data/storage';
import { MODES, MODE_COLORS } from '../theme';

function formatDuration(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours}h ${minutes}m ${seconds}s`;
}

function isToday(timestamp) {
  const d = new Date(timestamp);
  const now = new Date();
  return (
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear()
  );
}

export default function WorkTable() {
  const [totals, setTotals] = useState({});
  const [goals, setGoals] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [sessions, goalsData] = await Promise.all([getSessions(), getGoals()]);
      const todaySessions = sessions.filter((s) => isToday(s.startedAt));

      const computedTotals = todaySessions.reduce((acc, s) => {
        acc[s.mode] = (acc[s.mode] || 0) + s.durationMs;
        return acc;
      }, {});

      setTotals(computedTotals);
      setGoals(goalsData);
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <div className="panel">
        <h3 className="panel-title">Today's Breakdown</h3>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Loading...</p>
      </div>
    );
  }

  return (
    <div className="panel">
      <h3 className="panel-title">Today's Breakdown</h3>
      {MODES.map((mode) => {
        const totalMs = totals[mode] || 0;
        const goalMs = (goals[mode] || 0) * 60000;
        const hasGoal = goalMs > 0;
        const met = hasGoal && totalMs >= goalMs;

        return (
          <div className="row-line" key={mode}>
            <span className="row-label">
              <span className="row-dot" style={{ background: MODE_COLORS[mode] }} />
              {mode}
            </span>
            <span className={`row-value${hasGoal ? (met ? ' met' : ' missed') : ''}`}>
              {formatDuration(totalMs)}
              {hasGoal && (met ? ' ✓' : ` / ${goals[mode]}m`)}
            </span>
          </div>
        );
      })}
    </div>
  );
}