import { MODES, MODE_COLORS } from '../theme';

export default function ModeButtons({ activeMode, onSelectMode }) {
  return (
    <div className="mode-row">
      {MODES.map((mode) => (
        <button
          key={mode}
          className={`mode-btn${activeMode === mode ? ' active' : ''}`}
          style={{ '--mode-color': MODE_COLORS[mode] }}
          onClick={() => onSelectMode(mode)}
        >
          <span className="dot" />
          {mode}
        </button>
      ))}
    </div>
  );
}