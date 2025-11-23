import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { StatePanel } from './components/StatePanel';
import { api, UserState, Message } from './services/api';
import './App.css';

function App() {
  const [state, setState] = useState<UserState | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadState();
  }, []);

  useEffect(() => {
    if (state) {
      setMessages(state.conversationHistory);
    }
  }, [state]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadState = async () => {
    try {
      const userState = await api.getState();
      setState(userState);
    } catch (err) {
      setError('Failed to load user state');
      console.error(err);
    }
  };

  const handleSendMessage = async (message: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.chat(message);

      // Reload state to get updated conversation history
      await loadState();
    } catch (err) {
      setError('Failed to send message. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStateUpdate = async (updates: Partial<UserState>) => {
    try {
      const updatedState = await api.updateState(updates);
      setState(updatedState);
    } catch (err) {
      setError('Failed to update state');
      console.error(err);
    }
  };

  const handlePractice = async () => {
    setLoading(true);
    setError(null);

    try {
      const practice = await api.generatePractice();
      // Add practice problem as an assistant message
      await handleSendMessage(`Generate a practice problem for ${state?.currentTopic || 'general programming'}`);
    } catch (err) {
      setError('Failed to generate practice problem');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    if (confirm('Are you sure you want to reset your learning progress?')) {
      try {
        await api.reset();
        await loadState();
      } catch (err) {
        setError('Failed to reset state');
        console.error(err);
      }
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>CF AI CodeMentor</h1>
        <p>Your Personalized Coding Tutor</p>
      </header>

      <div className="app-content">
        <div className="chat-container">
          <div className="chat-header">
            <h2>Chat with AI Tutor</h2>
            <div className="chat-actions">
              <button onClick={handlePractice} disabled={loading}>
                Generate Practice Problem
              </button>
              <button onClick={handleReset} disabled={loading} className="reset-btn">
                Reset Progress
              </button>
            </div>
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="messages">
            {messages.length === 0 && (
              <div className="welcome-message">
                <h3>Welcome to CF AI CodeMentor!</h3>
                <p>I'm your personalized coding tutor. Here's what I can help you with:</p>
                <ul>
                  <li>Answer coding questions and explain concepts</li>
                  <li>Generate practice problems for exam prep</li>
                  <li>Review your code and provide feedback</li>
                  <li>Track your learning progress</li>
                </ul>
                <p>Try asking: "I'm learning C++ pointers" or "Give me a practice problem on OOP"</p>
              </div>
            )}
            {messages.map((msg, i) => (
              <ChatMessage
                key={i}
                role={msg.role}
                content={msg.content}
                timestamp={msg.timestamp}
              />
            ))}
            {loading && (
              <div className="loading-indicator">
                AI is thinking...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <ChatInput onSend={handleSendMessage} disabled={loading} />
        </div>

        <StatePanel state={state} onUpdate={handleStateUpdate} />
      </div>
    </div>
  );
}

export default App;
