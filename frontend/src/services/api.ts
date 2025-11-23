const API_BASE = '/api';

export interface UserState {
  userId: string;
  currentLanguage: string;
  currentTopic: string;
  masteredConcepts: string[];
  struggleAreas: string[];
  conversationHistory: Message[];
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
  createdAt: number;
  lastUpdated: number;
}

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

export interface ChatResponse {
  response: string;
  updates?: Partial<UserState>;
}

export interface PracticeResponse {
  problem: string;
  topic: string;
  difficulty: string;
  language: string;
}

export interface ReviewResponse {
  review: string;
  topic: string;
  language: string;
}

export const api = {
  async chat(message: string, userId: string = 'default-user'): Promise<ChatResponse> {
    const response = await fetch(`${API_BASE}/chat?userId=${userId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });

    if (!response.ok) {
      throw new Error('Failed to send message');
    }

    return response.json();
  },

  async getState(userId: string = 'default-user'): Promise<UserState> {
    const response = await fetch(`${API_BASE}/state?userId=${userId}`);

    if (!response.ok) {
      throw new Error('Failed to get state');
    }

    return response.json();
  },

  async updateState(updates: Partial<UserState>, userId: string = 'default-user'): Promise<UserState> {
    const response = await fetch(`${API_BASE}/state?userId=${userId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });

    if (!response.ok) {
      throw new Error('Failed to update state');
    }

    return response.json();
  },

  async generatePractice(
    topic?: string,
    difficulty?: string,
    userId: string = 'default-user'
  ): Promise<PracticeResponse> {
    const response = await fetch(`${API_BASE}/practice?userId=${userId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic, difficulty })
    });

    if (!response.ok) {
      throw new Error('Failed to generate practice');
    }

    return response.json();
  },

  async reviewCode(
    code: string,
    topic?: string,
    language?: string,
    userId: string = 'default-user'
  ): Promise<ReviewResponse> {
    const response = await fetch(`${API_BASE}/review?userId=${userId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, topic, language })
    });

    if (!response.ok) {
      throw new Error('Failed to review code');
    }

    return response.json();
  },

  async reset(userId: string = 'default-user'): Promise<void> {
    const response = await fetch(`${API_BASE}/reset?userId=${userId}`, {
      method: 'POST'
    });

    if (!response.ok) {
      throw new Error('Failed to reset state');
    }
  }
};
