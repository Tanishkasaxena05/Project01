import { useState } from 'react';
import { getGoals, saveGoals } from '../data/storage';
import { MODES } from '../theme';

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
    <div className="panel">
      <h3 className="panel-title">Daily Goals (minutes)</h3>
      {MODES.map((mode) => (
        <div className="goal-row" key={mode}>
          <label>{mode}</label>
          <input
            type="number"
            min="0"
            className="goal-input"
            value={goals[mode]}
            onChange={(e) => handleChange(mode, e.target.value)}
          />
        </div>
      ))}
      <button className="save-btn" onClick={handleSave}>Save Goals</button>
    </div>
  );
}