import React from 'react';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ role, content, timestamp }) => {
  const isUser = role === 'user';

  return (
    <div className={`message ${isUser ? 'user-message' : 'assistant-message'}`}>
      <div className="message-header">
        <span className="message-role">{isUser ? 'You' : 'AI Tutor'}</span>
        <span className="message-time">
          {new Date(timestamp).toLocaleTimeString()}
        </span>
      </div>
      <div className="message-content">{content}</div>
    </div>
  );
};
