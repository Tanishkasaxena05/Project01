import { useState, useEffect } from 'react';
import { getStreak } from '../data/storage';
import { MODES, MODE_COLORS } from '../theme';

const MILESTONES = [3, 7, 14, 30];

export default function Badges() {
  const [streaks, setStreaks] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const entries = await Promise.all(
        MODES.map(async (mode) => [mode, await getStreak(mode)])
      );
      setStreaks(Object.fromEntries(entries));
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <div className="panel">
        <div className="panel-header"><span className="bar" /><h3 className="panel-title">Streaks & Badges</h3></div>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Loading...</p>
      </div>
    );
  }

  return (
    <div className="panel">
      <h3 className="panel-title">Streaks & Badges</h3>
      {MODES.map((mode) => {
        const streak = streaks[mode] || 0;
        const earned = MILESTONES.filter((m) => streak >= m);

        return (
          <div className="streak-row" key={mode}>
            <div className="streak-head">
              <strong>{mode}</strong>
              <span className="streak-count">{streak} day{streak === 1 ? '' : 's'}</span>
            </div>
            <div className="badge-pills">
              {MILESTONES.map((m) => (
                <span
                  key={m}
                  className={`badge-pill${earned.includes(m) ? ' earned' : ''}`}
                  style={{ '--mode-color': MODE_COLORS[mode] }}
                >
                  {m}d
                </span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}