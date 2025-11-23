export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

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

export class LearningState implements DurableObject {
  private state: DurableObjectState;
  private userState: UserState | null = null;

  constructor(state: DurableObjectState, env: Env) {
    this.state = state;
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    try {
      if (path === '/state' && request.method === 'GET') {
        return this.getState();
      }

      if (path === '/state' && request.method === 'POST') {
        const updates = await request.json();
        return this.updateState(updates);
      }

      if (path === '/message' && request.method === 'POST') {
        const message = await request.json();
        return this.addMessage(message);
      }

      if (path === '/concept' && request.method === 'POST') {
        const data = await request.json();
        return this.updateConcept(data);
      }

      if (path === '/reset' && request.method === 'POST') {
        return this.resetState();
      }

      return new Response('Not Found', { status: 404 });
    } catch (error) {
      return new Response(JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  private async getState(): Promise<Response> {
    if (!this.userState) {
      this.userState = await this.state.storage.get<UserState>('userState');

      if (!this.userState) {
        // Initialize default state
        this.userState = {
          userId: this.state.id.toString(),
          currentLanguage: '',
          currentTopic: '',
          masteredConcepts: [],
          struggleAreas: [],
          conversationHistory: [],
          skillLevel: 'beginner',
          createdAt: Date.now(),
          lastUpdated: Date.now()
        };
        await this.state.storage.put('userState', this.userState);
      }
    }

    return new Response(JSON.stringify(this.userState), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  private async updateState(updates: Partial<UserState>): Promise<Response> {
    await this.getState(); // Ensure state is loaded

    this.userState = {
      ...this.userState!,
      ...updates,
      lastUpdated: Date.now()
    };

    await this.state.storage.put('userState', this.userState);

    return new Response(JSON.stringify(this.userState), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  private async addMessage(message: Message): Promise<Response> {
    await this.getState();

    const messageWithTimestamp = {
      ...message,
      timestamp: Date.now()
    };

    this.userState!.conversationHistory.push(messageWithTimestamp);

    // Keep only last 50 messages to avoid excessive storage
    if (this.userState!.conversationHistory.length > 50) {
      this.userState!.conversationHistory = this.userState!.conversationHistory.slice(-50);
    }

    this.userState!.lastUpdated = Date.now();
    await this.state.storage.put('userState', this.userState);

    return new Response(JSON.stringify({ success: true, message: messageWithTimestamp }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  private async updateConcept(data: {
    concept: string;
    action: 'master' | 'struggle' | 'remove'
  }): Promise<Response> {
    await this.getState();

    const { concept, action } = data;

    if (action === 'master') {
      if (!this.userState!.masteredConcepts.includes(concept)) {
        this.userState!.masteredConcepts.push(concept);
      }
      // Remove from struggle areas if it was there
      this.userState!.struggleAreas = this.userState!.struggleAreas.filter(c => c !== concept);
    } else if (action === 'struggle') {
      if (!this.userState!.struggleAreas.includes(concept)) {
        this.userState!.struggleAreas.push(concept);
      }
    } else if (action === 'remove') {
      this.userState!.masteredConcepts = this.userState!.masteredConcepts.filter(c => c !== concept);
      this.userState!.struggleAreas = this.userState!.struggleAreas.filter(c => c !== concept);
    }

    this.userState!.lastUpdated = Date.now();
    await this.state.storage.put('userState', this.userState);

    return new Response(JSON.stringify(this.userState), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  private async resetState(): Promise<Response> {
    this.userState = {
      userId: this.state.id.toString(),
      currentLanguage: '',
      currentTopic: '',
      masteredConcepts: [],
      struggleAreas: [],
      conversationHistory: [],
      skillLevel: 'beginner',
      createdAt: Date.now(),
      lastUpdated: Date.now()
    };

    await this.state.storage.put('userState', this.userState);

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
