import { getSessions, getGoals } from '../data/storage';

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

  const modes = ['Sleep', 'Walk', 'Study', 'Work'];

  return (
    <div style={{ marginTop: '30px', textAlign: 'left' }}>
      <h3 style={{ textAlign: 'center' }}>Today's Breakdown</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <tbody>
          {modes.map((mode) => {
            const totalMs = totals[mode] || 0;
            const goalMs = (goals[mode] || 0) * 60000;
            const met = goalMs > 0 && totalMs >= goalMs;
            const hasGoal = goalMs > 0;

            return (
              <tr key={mode} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '8px 4px', fontWeight: 'bold' }}>{mode}</td>
                <td
                  style={{
                    padding: '8px 4px',
                    textAlign: 'right',
                    fontFamily: 'monospace',
                    color: hasGoal ? (met ? '#16a34a' : '#dc2626') : '#333',
                  }}
                >
                  {formatDuration(totalMs)}
                  {hasGoal && (met ? ' ✓' : ` / ${goals[mode]}m`)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}