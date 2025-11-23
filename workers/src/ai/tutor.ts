import { UserState } from '../durable-objects/LearningState';

export async function tutorLogic(ai: any, userMessage: string, state: UserState): Promise<string> {
    const systemPrompt = `
You are a personalized coding tutor helping students prepare for exams.
Your student is currently learning ${state.currentLanguage} and focusing on ${state.currentTopic}.
Their skill level is ${state.skillLevel}.
Mastered concepts: ${state.masteredConcepts.join(', ')}.
Struggling with: ${state.struggleAreas.join(', ')}.

- Adapt explanations to the user's skill level.
- After explaining, ask questions to verify understanding.
- Generate practice problems appropriate to their level.
- When reviewing code, be constructive and educational.
- Keep responses concise and helpful.
`;

    const messages = [
        { role: 'system', content: systemPrompt },
        ...state.conversationHistory.map(m => ({ role: m.role, content: m.content })),
        { role: 'user', content: userMessage }
    ];

    console.log('Sending to AI:', JSON.stringify(messages, null, 2));

    try {
        const response = await ai.run('@cf/meta/llama-3-8b-instruct', {
            messages,
        });
        return response.response;
    } catch (e) {
        console.error('AI Error:', e);
        return "I'm having trouble connecting to my brain right now. Please try again.";
    }
}
