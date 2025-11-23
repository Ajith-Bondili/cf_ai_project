import { AITutor } from './ai/tutor';
import { LearningState } from './durable-objects/LearningState';

export { LearningState };

export interface Env {
  LEARNING_STATE: DurableObjectNamespace;
  AI: Ai;
}

// CORS headers for frontend
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function handleCORS(request: Request): Response | null {
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  return null;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // Handle CORS preflight
    const corsResponse = handleCORS(request);
    if (corsResponse) return corsResponse;

    const url = new URL(request.url);
    const path = url.pathname;

    try {
      // Get or create Durable Object instance for this user
      // In production, you'd use actual user authentication
      const userId = url.searchParams.get('userId') || 'default-user';
      const id = env.LEARNING_STATE.idFromName(userId);
      const stub = env.LEARNING_STATE.get(id);

      // Route to appropriate handler
      if (path === '/api/chat' && request.method === 'POST') {
        return await handleChat(request, env, stub);
      }

      if (path === '/api/state' && request.method === 'GET') {
        const response = await stub.fetch(new Request('http://do/state'));
        const data = await response.json();
        return new Response(JSON.stringify(data), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      if (path === '/api/state' && request.method === 'POST') {
        const body = await request.text();
        const response = await stub.fetch(new Request('http://do/state', {
          method: 'POST',
          body
        }));
        const data = await response.json();
        return new Response(JSON.stringify(data), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      if (path === '/api/practice' && request.method === 'POST') {
        return await handlePractice(request, env, stub);
      }

      if (path === '/api/review' && request.method === 'POST') {
        return await handleReview(request, env, stub);
      }

      if (path === '/api/reset' && request.method === 'POST') {
        const response = await stub.fetch(new Request('http://do/reset', {
          method: 'POST'
        }));
        const data = await response.json();
        return new Response(JSON.stringify(data), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // Health check endpoint
      if (path === '/api/health') {
        return new Response(JSON.stringify({
          status: 'healthy',
          timestamp: Date.now()
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      return new Response(JSON.stringify({ error: 'Not Found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    } catch (error) {
      console.error('Worker error:', error);
      return new Response(JSON.stringify({
        error: error instanceof Error ? error.message : 'Internal Server Error'
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  },
};

async function handleChat(request: Request, env: Env, stub: DurableObjectStub): Promise<Response> {
  const { message } = await request.json() as { message: string };

  if (!message) {
    return new Response(JSON.stringify({ error: 'Message is required' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  // Get current user state
  const stateResponse = await stub.fetch(new Request('http://do/state'));
  const userState = await stateResponse.json();

  // Add user message to history
  await stub.fetch(new Request('http://do/message', {
    method: 'POST',
    body: JSON.stringify({
      role: 'user',
      content: message
    })
  }));

  // Get AI response
  const tutor = new AITutor(env.AI);
  const tutorResponse = await tutor.chat({
    message,
    userState
  });

  // Add AI response to history
  await stub.fetch(new Request('http://do/message', {
    method: 'POST',
    body: JSON.stringify({
      role: 'assistant',
      content: tutorResponse.response
    })
  }));

  // Apply suggested updates to user state
  if (tutorResponse.suggestedUpdates) {
    await stub.fetch(new Request('http://do/state', {
      method: 'POST',
      body: JSON.stringify(tutorResponse.suggestedUpdates)
    }));
  }

  return new Response(JSON.stringify({
    response: tutorResponse.response,
    updates: tutorResponse.suggestedUpdates
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function handlePractice(request: Request, env: Env, stub: DurableObjectStub): Promise<Response> {
  const { topic, difficulty } = await request.json() as {
    topic?: string;
    difficulty?: string;
  };

  // Get current user state
  const stateResponse = await stub.fetch(new Request('http://do/state'));
  const userState = await stateResponse.json();

  const useTopic = topic || userState.currentTopic || 'general programming';
  const useDifficulty = difficulty || userState.skillLevel || 'beginner';
  const useLanguage = userState.currentLanguage || 'Python';

  const tutor = new AITutor(env.AI);
  const problem = await tutor.generatePractice(useTopic, useDifficulty, useLanguage);

  return new Response(JSON.stringify({
    problem,
    topic: useTopic,
    difficulty: useDifficulty,
    language: useLanguage
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function handleReview(request: Request, env: Env, stub: DurableObjectStub): Promise<Response> {
  const { code, topic, language } = await request.json() as {
    code: string;
    topic?: string;
    language?: string;
  };

  if (!code) {
    return new Response(JSON.stringify({ error: 'Code is required' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  // Get current user state
  const stateResponse = await stub.fetch(new Request('http://do/state'));
  const userState = await stateResponse.json();

  const useTopic = topic || userState.currentTopic || 'general';
  const useLanguage = language || userState.currentLanguage || 'Python';

  const tutor = new AITutor(env.AI);
  const review = await tutor.reviewCode(code, useTopic, useLanguage);

  return new Response(JSON.stringify({
    review,
    topic: useTopic,
    language: useLanguage
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}
