import { getStreak } from '../data/storage';

const MODES = ['Sleep', 'Walk', 'Study', 'Work'];
const MILESTONES = [3, 7, 14, 30]; // day thresholds for badges

export default function Badges() {
  return (
    <div style={{ marginTop: '30px' }}>
      <h3 style={{ textAlign: 'center' }}>Streaks & Badges</h3>
      {MODES.map((mode) => {
        const streak = getStreak(mode);
        const earnedBadges = MILESTONES.filter((m) => streak >= m);

        return (
          <div key={mode} style={{ marginBottom: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <strong>{mode}</strong>
              <span style={{ color: streak > 0 ? '#16a34a' : '#999' }}>
                {streak} day{streak === 1 ? '' : 's'} streak
              </span>
            </div>
            <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
              {MILESTONES.map((m) => (
                <span
                  key={m}
                  style={{
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '0.75rem',
                    background: earnedBadges.includes(m) ? '#4f46e5' : '#eee',
                    color: earnedBadges.includes(m) ? '#fff' : '#999',
                  }}
                >
                  {m}-Day
                </span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}