import React from 'react';
import { UserState } from '../services/api';

interface StatePanelProps {
  state: UserState | null;
  onUpdate: (updates: Partial<UserState>) => void;
}

export const StatePanel: React.FC<StatePanelProps> = ({ state, onUpdate }) => {
  if (!state) {
    return <div className="state-panel">Loading...</div>;
  }

  return (
    <div className="state-panel">
      <h2>Your Learning Profile</h2>

      <div className="state-section">
        <label>
          Current Language:
          <input
            type="text"
            value={state.currentLanguage}
            onChange={(e) => onUpdate({ currentLanguage: e.target.value })}
            placeholder="e.g., C++, Python, Rust"
          />
        </label>
      </div>

      <div className="state-section">
        <label>
          Current Topic:
          <input
            type="text"
            value={state.currentTopic}
            onChange={(e) => onUpdate({ currentTopic: e.target.value })}
            placeholder="e.g., pointers, OOP"
          />
        </label>
      </div>

      <div className="state-section">
        <label>
          Skill Level:
          <select
            value={state.skillLevel}
            onChange={(e) => onUpdate({ skillLevel: e.target.value as any })}
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </label>
      </div>

      <div className="state-section">
        <h3>Mastered Concepts ({state.masteredConcepts.length})</h3>
        <div className="concept-list">
          {state.masteredConcepts.length > 0 ? (
            state.masteredConcepts.map((concept, i) => (
              <span key={i} className="concept-tag mastered">
                {concept}
              </span>
            ))
          ) : (
            <p className="empty-state">No mastered concepts yet</p>
          )}
        </div>
      </div>

      <div className="state-section">
        <h3>Struggle Areas ({state.struggleAreas.length})</h3>
        <div className="concept-list">
          {state.struggleAreas.length > 0 ? (
            state.struggleAreas.map((concept, i) => (
              <span key={i} className="concept-tag struggle">
                {concept}
              </span>
            ))
          ) : (
            <p className="empty-state">No struggle areas identified</p>
          )}
        </div>
      </div>

      <div className="state-section">
        <p className="stat-info">
          Messages: {state.conversationHistory.length}
        </p>
        <p className="stat-info">
          Last Updated: {new Date(state.lastUpdated).toLocaleString()}
        </p>
      </div>
    </div>
  );
};
