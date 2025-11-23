import { DurableObject } from "cloudflare:workers";

export interface UserState {
    userId: string;
    currentLanguage: string;
    currentTopic: string;
    masteredConcepts: string[];
    struggleAreas: string[];
    conversationHistory: { role: 'user' | 'assistant'; content: string }[];
    skillLevel: 'beginner' | 'intermediate' | 'advanced';
}

export class LearningState extends DurableObject {

    constructor(ctx: DurableObjectState, env: any) {
        super(ctx, env);
    }

    async getState(): Promise<UserState> {
        const stored = await this.ctx.storage.get<UserState>('data');
        return stored || {
            userId: 'unknown',
            currentLanguage: 'General',
            currentTopic: 'Intro',
            masteredConcepts: [],
            struggleAreas: [],
            conversationHistory: [],
            skillLevel: 'beginner'
        };
    }

    async addInteraction(userMessage: string, aiResponse: string) {
        const data = await this.getState();
        data.conversationHistory.push({ role: 'user', content: userMessage });
        data.conversationHistory.push({ role: 'assistant', content: aiResponse });

        // Keep history manageable (last 20 messages)
        if (data.conversationHistory.length > 20) {
            data.conversationHistory = data.conversationHistory.slice(-20);
        }

        await this.ctx.storage.put('data', data);
    }

    async updateProgress(updates: Partial<UserState>) {
        const data = await this.getState();
        const newData = { ...data, ...updates };
        await this.ctx.storage.put('data', newData);
    }
}
