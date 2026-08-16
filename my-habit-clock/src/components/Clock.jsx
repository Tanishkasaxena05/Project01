function formatElapsed(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}

export default function Clock({ elapsedMs, activeMode, isRunning }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '3rem', fontFamily: 'monospace' }}>
        {formatElapsed(elapsedMs)}
      </div>
      <div style={{ color: '#666' }}>
        {activeMode ? `${isRunning ? 'Tracking' : 'Paused'}: ${activeMode}` : 'No mode selected'}
      </div>
    </div>
  );
}