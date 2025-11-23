import React, { useState, useEffect, useRef } from 'react';

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
            const response = await fetch('http://localhost:8787/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, message: userMsg.content }),
            });

            const data = await response.json();
            setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
            onInteraction(); // Refresh state
        } catch (error) {
            console.error('Error sending message:', error);
            setMessages(prev => [...prev, { role: 'assistant', content: "Error connecting to tutor." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="chat-container">
            <div className="messages">
                {messages.map((m, i) => (
                    <div key={i} className={`message ${m.role}`}>
                        <strong>{m.role === 'user' ? 'You' : 'Tutor'}:</strong>
                        <p>{m.content}</p>
                    </div>
                ))}
                {loading && <div className="message assistant">Thinking...</div>}
                <div ref={messagesEndRef} />
            </div>
            <div className="input-area">
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Ask a coding question..."
                />
                <button onClick={sendMessage} disabled={loading}>Send</button>
            </div>
        </div>
    );
};
