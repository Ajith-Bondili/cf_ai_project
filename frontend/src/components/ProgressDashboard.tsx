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
                const response = await fetch(`https://cf_ai_codementor.ajithbon05.workers.dev/api/state?userId=${userId}`);
                const data = await response.json();
                setState(data);
            } catch (error) {
                console.error('Error fetching state:', error);
            }
        };
        fetchState();
    }, [userId, refreshTrigger]);

    if (!state) return <div className="p-4 font-mono animate-pulse">Loading neural link...</div>;

    return (
        <div className="space-y-6 font-mono">
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-neo-accent p-4 border-4 border-black shadow-neo transform hover:-rotate-2 transition-transform">
                    <h3 className="text-xs uppercase font-black mb-1 opacity-100 border-b-2 border-black pb-1">Language</h3>
                    <p className="text-xl font-black truncate">{state.currentLanguage}</p>
                </div>
                <div className="bg-neo-primary text-white p-4 border-4 border-black shadow-neo transform hover:rotate-2 transition-transform">
                    <h3 className="text-xs uppercase font-black mb-1 opacity-100 border-b-2 border-black pb-1">Level</h3>
                    <p className="text-xl font-black">{state.skillLevel}</p>
                </div>
            </div>

            <div className="bg-white p-4 border-4 border-black shadow-neo relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-neo-secondary w-16 h-16 transform rotate-45 translate-x-8 -translate-y-8 border-l-4 border-b-4 border-black"></div>
                <h3 className="text-xs uppercase font-black mb-2 bg-black text-white inline-block px-2 py-1 transform -rotate-1">Current Topic</h3>
                <p className="text-lg font-bold border-l-4 border-neo-secondary pl-3">{state.currentTopic}</p>
            </div>

            <div className="space-y-6">
                <div>
                    <h3 className="text-sm font-black uppercase border-b-4 border-black mb-4 pb-1 flex justify-between items-center">
                        <span>Mastered</span>
                        <span className="bg-neo-green text-black px-2 py-0.5 text-xs border-2 border-black rounded-full">{state.masteredConcepts.length}</span>
                    </h3>
                    <ul className="space-y-3">
                        {state.masteredConcepts.length > 0 ? (
                            state.masteredConcepts.map((c, i) => (
                                <li key={i} className="flex items-center gap-3 text-sm font-bold bg-white p-2 border-2 border-black shadow-sm hover:translate-x-1 transition-transform">
                                    <div className="bg-neo-green border-2 border-black w-6 h-6 flex items-center justify-center text-xs">✓</div>
                                    {c}
                                </li>
                            ))
                        ) : (
                            <li className="text-gray-500 italic text-sm border-2 border-dashed border-gray-400 p-2">No concepts mastered yet.</li>
                        )}
                    </ul>
                </div>

                <div>
                    <h3 className="text-sm font-black uppercase border-b-4 border-black mb-4 pb-1 text-neo-primary flex justify-between items-center">
                        <span>Needs Review</span>
                        <span className="bg-neo-primary text-white px-2 py-0.5 text-xs border-2 border-black rounded-full">{state.struggleAreas.length}</span>
                    </h3>
                    <ul className="space-y-3">
                        {state.struggleAreas.length > 0 ? (
                            state.struggleAreas.map((c, i) => (
                                <li key={i} className="flex items-center gap-3 text-sm font-bold bg-white p-2 border-2 border-black shadow-sm hover:translate-x-1 transition-transform">
                                    <div className="bg-neo-primary text-white border-2 border-black w-6 h-6 flex items-center justify-center text-xs">!</div>
                                    {c}
                                </li>
                            ))
                        ) : (
                            <li className="text-gray-500 italic text-sm border-2 border-dashed border-gray-400 p-2">No struggle areas.</li>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
};
