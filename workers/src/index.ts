import { LearningState } from './durable-objects/LearningState';
import { tutorLogic } from './ai/tutor';

export interface Env {
    LEARNING_STATE: DurableObjectNamespace;
    AI: Ai;
}

export { LearningState };

export default {
    async fetch(request: Request, env: Env): Promise<Response> {
        const url = new URL(request.url);
        const path = url.pathname;

        // CORS headers
        const corsHeaders = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        };

        if (request.method === 'OPTIONS') {
            return new Response(null, { headers: corsHeaders });
        }

        try {
            // Route: /api/chat
            if (path === '/api/chat' && request.method === 'POST') {
                const body = await request.json() as { userId: string; message: string };
                if (!body.userId || !body.message) {
                    return new Response('Missing userId or message', { status: 400, headers: corsHeaders });
                }

                const id = env.LEARNING_STATE.idFromName(body.userId);
                const stub = env.LEARNING_STATE.get(id);

                // Get current state
                const state = await stub.getState();

                // Generate AI response
                const aiResponse = await tutorLogic(env.AI, body.message, state);

                // Update state with new interaction
                await stub.addInteraction(body.message, aiResponse);

                return new Response(JSON.stringify({ response: aiResponse }), {
                    headers: { 'Content-Type': 'application/json', ...corsHeaders },
                });
            }

            // Route: /api/state
            if (path === '/api/state') {
                const userId = url.searchParams.get('userId');
                if (!userId) {
                    return new Response('Missing userId', { status: 400, headers: corsHeaders });
                }

                const id = env.LEARNING_STATE.idFromName(userId);
                const stub = env.LEARNING_STATE.get(id);
                const state = await stub.getState();

                return new Response(JSON.stringify(state), {
                    headers: { 'Content-Type': 'application/json', ...corsHeaders },
                });
            }

            return new Response('Not Found', { status: 404, headers: corsHeaders });

        } catch (error) {
            console.error(error);
            return new Response('Internal Server Error', { status: 500, headers: corsHeaders });
        }
    },
};
