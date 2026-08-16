const MODES = ['Sleep', 'Walk', 'Study', 'Work'];

export default function ModeButtons({ activeMode, onSelectMode }) {
  return (
    <div style={{ display: 'flex', gap: '10px', margin: '20px 0' }}>
      {MODES.map((mode) => (
        <button
          key={mode}
          onClick={() => onSelectMode(mode)}
          style={{
            padding: '10px 20px',
            borderRadius: '8px',
            border: activeMode === mode ? '2px solid #4f46e5' : '1px solid #ccc',
            background: activeMode === mode ? '#eef2ff' : '#fff',
            fontWeight: activeMode === mode ? 'bold' : 'normal',
            cursor: 'pointer',
          }}
        >
          {mode}
        </button>
      ))}
    </div>
  );
}
