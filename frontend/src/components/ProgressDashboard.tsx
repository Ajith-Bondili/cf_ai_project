import React, { useEffect, useState } from 'react';

interface UserState {
    currentLanguage: string;
    currentTopic: string;
    masteredConcepts: string[];
    struggleAreas: string[];
    skillLevel: string;
}

interface ProgressDashboardProps {
    userId: string;
    refreshTrigger: number;
}

export const ProgressDashboard: React.FC<ProgressDashboardProps> = ({ userId, refreshTrigger }) => {
    const [state, setState] = useState<UserState | null>(null);

    useEffect(() => {
        const fetchState = async () => {
            try {
                const response = await fetch(`http://localhost:8787/api/state?userId=${userId}`);
                const data = await response.json();
                setState(data);
            } catch (error) {
                console.error('Error fetching state:', error);
            }
        };
        fetchState();
    }, [userId, refreshTrigger]);

    if (!state) return <div>Loading progress...</div>;

    return (
        <div className="dashboard">
            <h2>Learning Progress</h2>
            <div className="stat-card">
                <h3>Current Focus</h3>
                <p>{state.currentLanguage} - {state.currentTopic}</p>
            </div>
            <div className="stat-card">
                <h3>Skill Level</h3>
                <p>{state.skillLevel}</p>
            </div>
            <div className="lists">
                <div className="list">
                    <h3>Mastered Concepts</h3>
                    <ul>
                        {state.masteredConcepts.map((c, i) => <li key={i}>{c}</li>)}
                    </ul>
                </div>
                <div className="list">
                    <h3>Areas to Review</h3>
                    <ul>
                        {state.struggleAreas.map((c, i) => <li key={i}>{c}</li>)}
                    </ul>
                </div>
            </div>
        </div>
    );
};
