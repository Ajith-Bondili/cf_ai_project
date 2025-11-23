import { useState } from 'react'
import './App.css'
import { ChatInterface } from './components/ChatInterface'
import { ProgressDashboard } from './components/ProgressDashboard'

function App() {
    const [userId] = useState(`user_${Math.random().toString(36).substr(2, 9)}`);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const handleInteraction = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    return (
        <div className="app-container">
            <header>
                <h1>CF_AI_CodeMentor</h1>
            </header>
            <main>
                <div className="left-panel">
                    <ProgressDashboard userId={userId} refreshTrigger={refreshTrigger} />
                </div>
                <div className="right-panel">
                    <ChatInterface userId={userId} onInteraction={handleInteraction} />
                </div>
            </main>
        </div>
    )
}

export default App
