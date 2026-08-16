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
  const sessions = getSessions().filter((s) => isToday(s.startedAt));
  const goals = getGoals();

  const totals = sessions.reduce((acc, s) => {
    acc[s.mode] = (acc[s.mode] || 0) + s.durationMs;
    return acc;
  }, {});

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