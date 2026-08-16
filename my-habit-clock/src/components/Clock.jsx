import { MODE_COLORS } from '../theme';

function formatElapsed(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}

export default function Clock({ elapsedMs, activeMode, isRunning, goalMs }) {
  const color = activeMode ? MODE_COLORS[activeMode] : '#2e3244';
  const progress = goalMs > 0 ? Math.min(elapsedMs / goalMs, 1) : isRunning ? 0.05 : 0;
  const angle = Math.round(progress * 360);

  return (
    <div
      className="dial"
      style={{ background: `conic-gradient(${color} ${angle}deg, #2e3244 ${angle}deg)` }}
    >
      <div className="dial-inner">
        <div className="dial-time">{formatElapsed(elapsedMs)}</div>
        <div className="dial-status">
          {activeMode ? (isRunning ? `Tracking ${activeMode}` : `Paused · ${activeMode}`) : 'Select a mode'}
        </div>
        {goalMs > 0 && <div className="dial-progress">{Math.round(progress * 100)}% of goal</div>}
      </div>
    </div>
  );
}