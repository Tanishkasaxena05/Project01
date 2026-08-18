import { useState, useEffect } from 'react';
import { getGoals, saveGoals } from '../data/storage';
import { MODES } from '../theme';

export default function GoalSettings({ onGoalsSaved }) {
  const [goals, setGoals] = useState({ Sleep: 0, Walk: 0, Study: 0, Work: 0 });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const data = await getGoals();
      setGoals(data);
      setLoading(false);
    })();
  }, []);

  const handleChange = (mode, value) => {
    setGoals((prev) => ({ ...prev, [mode]: Number(value) || 0 }));
  };

  const handleSave = async () => {
    setSaving(true);
    await saveGoals(goals);
    setSaving(false);
    onGoalsSaved?.();
  };

  if (loading) {
    return (
      <div className="panel">
        <h3 className="panel-title">Daily Goals (minutes)</h3>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Loading...</p>
      </div>
    );
  }

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
      <button className="save-btn" onClick={handleSave} disabled={saving}>
        {saving ? 'Saving...' : 'Save Goals'}
      </button>
    </div>
  );
}