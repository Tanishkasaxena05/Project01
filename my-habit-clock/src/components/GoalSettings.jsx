import { useState } from 'react';
import { getGoals, saveGoals } from '../data/storage';

const MODES = ['Sleep', 'Walk', 'Study', 'Work'];

export default function GoalSettings({ onGoalsSaved }) {
  const [goals, setGoals] = useState(getGoals());

  const handleChange = (mode, value) => {
    setGoals((prev) => ({ ...prev, [mode]: Number(value) || 0 }));
  };

  const handleSave = () => {
    saveGoals(goals);
    onGoalsSaved?.();
  };

  return (
    <div style={{ marginTop: '30px', textAlign: 'left' }}>
      <h3 style={{ textAlign: 'center' }}>Daily Goals (minutes)</h3>
      {MODES.map((mode) => (
        <div
          key={mode}
          style={{ display: 'flex', justifyContent: 'space-between', margin: '6px 0' }}
        >
          <label>{mode}</label>
          <input
            type="number"
            min="0"
            value={goals[mode]}
            onChange={(e) => handleChange(mode, e.target.value)}
            style={{ width: '80px', padding: '4px', textAlign: 'right' }}
          />
        </div>
      ))}
      <button
        onClick={handleSave}
        style={{
          marginTop: '10px',
          width: '100%',
          padding: '8px',
          borderRadius: '8px',
          border: '1px solid #4f46e5',
          background: '#4f46e5',
          color: '#fff',
          cursor: 'pointer',
        }}
      >
        Save Goals
      </button>
    </div>
  );
}