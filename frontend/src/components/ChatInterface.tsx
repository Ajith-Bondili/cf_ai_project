import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

interface ChatInterfaceProps {
    userId: string;
    onInteraction: () => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ userId, onInteraction }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMsg: Message = { role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const response = await fetch('https://cf_ai_codementor.ajithbon05.workers.dev/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, message: userMsg.content }),
            });

            const data = await response.json();
            setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
            onInteraction();
        } catch (error) {
            console.error('Error sending message:', error);
            setMessages(prev => [...prev, { role: 'assistant', content: "Error connecting to tutor." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-transparent">
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
                <AnimatePresence>
                    {messages.map((m, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 50, rotate: m.role === 'user' ? 5 : -5 }}
                            animate={{ opacity: 1, y: 0, rotate: 0 }}
                            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`
                                max-w-[85%] p-6 border-4 border-black shadow-neo font-mono text-base md:text-lg relative
                                ${m.role === 'user'
                                    ? 'bg-neo-accent rounded-3xl rounded-tr-none mr-4'
                                    : 'bg-white rounded-3xl rounded-tl-none ml-4'}
                            `}>
                                <div className={`absolute top-0 ${m.role === 'user' ? '-right-4' : '-left-4'} w-0 h-0 
                                    border-t-[20px] border-t-black
                                    ${m.role === 'user' ? 'border-l-[20px] border-l-transparent' : 'border-r-[20px] border-r-transparent'}
                                `}></div>

                                <strong className="block text-xs font-black uppercase tracking-widest mb-2 opacity-100 border-b-2 border-black pb-1">
                                    {m.role === 'user' ? 'YOU' : 'DORKSENSE AI'}
                                </strong>
                                <p className="whitespace-pre-wrap font-bold leading-relaxed">{m.content}</p>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
                {loading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex justify-start pl-4"
                    >
                        <div className="bg-neo-black text-white p-4 rounded-xl border-4 border-black shadow-neo flex gap-2 items-center">
                            <span className="w-3 h-3 bg-neo-primary rounded-full animate-bounce"></span>
                            <span className="w-3 h-3 bg-neo-secondary rounded-full animate-bounce delay-100"></span>
                            <span className="w-3 h-3 bg-neo-accent rounded-full animate-bounce delay-200"></span>
                            <span className="font-mono ml-2 uppercase">Thinking...</span>
                        </div>
                    </motion.div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-neo-bg-2 border-t-4 border-black">
                <div className="flex gap-4 items-end">
                    <div className="flex-1 relative">
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    sendMessage();
                                }
                            }}
                            placeholder="TYPE YOUR QUERY HERE..."
                            className="w-full p-4 border-4 border-black shadow-neo focus:shadow-neo-hover focus:translate-x-[2px] focus:translate-y-[2px] transition-all font-mono font-bold bg-white resize-none h-20 outline-none text-lg placeholder:text-gray-400"
                        />
                        <div className="absolute -top-3 left-4 bg-neo-secondary border-2 border-black px-2 text-xs font-bold text-white transform -rotate-2">
                            INPUT TERMINAL
                        </div>
                    </div>
                    <button
                        onClick={sendMessage}
                        disabled={loading}
                        className="bg-neo-primary text-white font-black px-8 h-20 border-4 border-black shadow-neo hover:shadow-neo-hover hover:translate-x-[2px] hover:translate-y-[2px] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider text-xl flex items-center justify-center gap-2"
                    >
                        <span>SEND</span>
                        <span className="text-2xl">➤</span>
                    </button>
                </div>
            </div>
        </div>
    );
};
