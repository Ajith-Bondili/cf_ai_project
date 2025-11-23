import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChatInterface } from './components/ChatInterface';
import { ProgressDashboard } from './components/ProgressDashboard';

function App() {
    const [userId] = useState(`user_${Math.random().toString(36).substr(2, 9)}`);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const handleInteraction = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    return (
        <div className="min-h-screen p-4 md:p-6 font-sans flex flex-col max-w-[1800px] mx-auto">
            <motion.header
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="mb-6 flex flex-col md:flex-row justify-between items-center gap-4 shrink-0"
            >
                <div className="relative group cursor-default">
                    <h1 className="text-5xl md:text-8xl font-black text-neo-white tracking-tighter transition-transform group-hover:scale-105"
                        style={{
                            textShadow: '6px 6px 0px #000',
                            WebkitTextStroke: '2px black'
                        }}>
                        CodeMentor
                    </h1>
                    <div className="absolute -top-2 -right-6 rotate-12 bg-neo-accent border-4 border-black px-3 py-0.5 font-black shadow-neo transform group-hover:rotate-6 transition-all">
                        BETA
                    </div>
                </div>

                <div className="flex gap-4">
                    <div className="bg-neo-secondary border-4 border-black px-4 py-2 font-bold shadow-neo transform -rotate-2 text-white text-lg hover:rotate-0 transition-transform">
                        AI TUTOR v1.0
                    </div>
                    <div className="bg-neo-primary border-4 border-black px-4 py-2 font-bold shadow-neo transform rotate-2 text-white text-lg hover:rotate-0 transition-transform">
                        USER: {userId.slice(0, 4)}
                    </div>
                </div>
            </motion.header>

            <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0 pb-4">
                {/* Left Panel: Dashboard */}
                <motion.div
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="lg:col-span-3 flex flex-col gap-4 h-full overflow-hidden"
                >
                    <div className="bg-neo-white border-4 border-black shadow-neo p-1 flex flex-col h-full">
                        <div className="bg-neo-secondary border-b-4 border-black p-3 flex justify-between items-center shrink-0">
                            <h2 className="text-xl font-black uppercase tracking-widest text-white text-stroke">Stats</h2>
                            <div className="w-4 h-4 bg-black rounded-full border-2 border-white animate-pulse"></div>
                        </div>
                        <div className="p-3 overflow-y-auto flex-1 custom-scrollbar">
                            <ProgressDashboard userId={userId} refreshTrigger={refreshTrigger} />
                        </div>
                    </div>
                </motion.div>

                {/* Right Panel: Chat */}
                <motion.div
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="lg:col-span-9 flex flex-col h-full overflow-hidden"
                >
                    <div className="flex-1 bg-neo-white border-4 border-black shadow-neo flex flex-col overflow-hidden relative">
                        {/* Window Header */}
                        <div className="bg-neo-primary border-b-4 border-black p-3 flex justify-between items-center shrink-0">
                            <div className="flex gap-2">
                                <div className="w-3 h-3 rounded-full bg-white border-2 border-black hover:bg-red-400"></div>
                                <div className="w-3 h-3 rounded-full bg-white border-2 border-black hover:bg-yellow-400"></div>
                                <div className="w-3 h-3 rounded-full bg-white border-2 border-black hover:bg-green-400"></div>
                            </div>
                            <h2 className="text-lg font-black uppercase tracking-widest text-white text-stroke">Live Session</h2>
                            <div className="flex gap-1">
                                <div className="h-1 w-4 bg-black"></div>
                                <div className="h-1 w-4 bg-black"></div>
                                <div className="h-1 w-4 bg-black"></div>
                            </div>
                        </div>

                        {/* Chat Content */}
                        <div className="flex-1 overflow-hidden relative flex flex-col">
                            <div className="absolute inset-0 opacity-5 pointer-events-none"
                                style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '10px 10px' }}>
                            </div>
                            <ChatInterface userId={userId} onInteraction={handleInteraction} />
                        </div>
                    </div>
                </motion.div>
            </main>
        </div>
    );
}

export default App;
