import { UserState, Message } from '../durable-objects/LearningState';

export interface TutorRequest {
  message: string;
  userState: UserState;
}

export interface TutorResponse {
  response: string;
  suggestedUpdates?: {
    currentLanguage?: string;
    currentTopic?: string;
    masteredConcepts?: string[];
    struggleAreas?: string[];
    skillLevel?: 'beginner' | 'intermediate' | 'advanced';
  };
}

export class AITutor {
  private ai: Ai;

  constructor(ai: Ai) {
    this.ai = ai;
  }

  async chat(request: TutorRequest): Promise<TutorResponse> {
    const { message, userState } = request;

    // Build system prompt based on user state
    const systemPrompt = this.buildSystemPrompt(userState);

    // Build conversation history
    const messages: Array<{ role: string; content: string }> = [
      { role: 'system', content: systemPrompt }
    ];

    // Add recent conversation history (last 10 messages)
    const recentHistory = userState.conversationHistory.slice(-10);
    messages.push(...recentHistory.map(msg => ({
      role: msg.role,
      content: msg.content
    })));

    // Add current user message
    messages.push({ role: 'user', content: message });

    try {
      // Call Workers AI with Llama 3.3
      const response = await this.ai.run('@cf/meta/llama-3.3-70b-instruct-fp8-fast', {
        messages,
        temperature: 0.7,
        max_tokens: 1024
      }) as { response: string };

      // Extract any learning insights from the conversation
      const suggestedUpdates = this.extractLearningInsights(message, response.response, userState);

      return {
        response: response.response,
        suggestedUpdates
      };
    } catch (error) {
      console.error('AI Error:', error);
      throw new Error('Failed to get AI response');
    }
  }

  async generatePractice(topic: string, difficulty: string, language: string): Promise<string> {
    const prompt = `Generate a ${difficulty} practice problem for ${topic} in ${language}.

Include:
1. Problem statement
2. Example input/output
3. Constraints
4. Hints (optional)

Make it educational and appropriate for exam preparation.`;

    try {
      const response = await this.ai.run('@cf/meta/llama-3.3-70b-instruct-fp8-fast', {
        messages: [
          { role: 'system', content: 'You are a coding tutor creating practice problems for students.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.8,
        max_tokens: 1024
      }) as { response: string };

      return response.response;
    } catch (error) {
      console.error('Practice generation error:', error);
      throw new Error('Failed to generate practice problem');
    }
  }

  async reviewCode(code: string, topic: string, language: string): Promise<string> {
    const prompt = `Review this ${language} code for ${topic}:

\`\`\`${language}
${code}
\`\`\`

Provide:
1. What's correct
2. What needs improvement
3. Best practices to follow
4. Specific suggestions for fixes

Be constructive and educational.`;

    try {
      const response = await this.ai.run('@cf/meta/llama-3.3-70b-instruct-fp8-fast', {
        messages: [
          { role: 'system', content: 'You are a coding tutor reviewing student code. Be helpful and encouraging.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.6,
        max_tokens: 1024
      }) as { response: string };

      return response.response;
    } catch (error) {
      console.error('Code review error:', error);
      throw new Error('Failed to review code');
    }
  }

  private buildSystemPrompt(userState: UserState): string {
    let prompt = `You are a personalized coding tutor helping students prepare for exams.

Student Profile:
- Skill Level: ${userState.skillLevel}
- Current Language: ${userState.currentLanguage || 'Not specified'}
- Current Topic: ${userState.currentTopic || 'Not specified'}`;

    if (userState.masteredConcepts.length > 0) {
      prompt += `\n- Mastered Concepts: ${userState.masteredConcepts.join(', ')}`;
    }

    if (userState.struggleAreas.length > 0) {
      prompt += `\n- Struggling With: ${userState.struggleAreas.join(', ')}`;
    }

    prompt += `

Your Teaching Approach:
- Adapt explanations to the student's skill level
- After explaining concepts, ask questions to verify understanding
- Generate practice problems appropriate to their level
- When reviewing code, be constructive and educational
- Help identify which concepts they've mastered vs struggling with
- For exam preparation, focus on practical application and common patterns
- Be encouraging but honest about areas needing improvement

Remember: Your goal is to help them succeed in their exams through clear explanations and targeted practice.`;

    return prompt;
  }

  private extractLearningInsights(
    userMessage: string,
    aiResponse: string,
    currentState: UserState
  ): TutorResponse['suggestedUpdates'] {
    const updates: TutorResponse['suggestedUpdates'] = {};

    // Simple keyword-based detection (in production, could use more sophisticated NLP)
    const lowerMessage = userMessage.toLowerCase();

    // Detect language mentions
    const languages = ['c++', 'cpp', 'rust', 'python', 'java', 'javascript', 'go', 'typescript'];
    for (const lang of languages) {
      if (lowerMessage.includes(lang)) {
        updates.currentLanguage = lang === 'cpp' ? 'C++' : lang.charAt(0).toUpperCase() + lang.slice(1);
        break;
      }
    }

    // Detect topic mentions
    const topics = [
      'pointers', 'references', 'inheritance', 'polymorphism', 'templates',
      'ownership', 'borrowing', 'lifetimes', 'async', 'concurrency',
      'data structures', 'algorithms', 'oop', 'functional programming'
    ];
    for (const topic of topics) {
      if (lowerMessage.includes(topic)) {
        updates.currentTopic = topic;
        break;
      }
    }

    // Detect struggle indicators
    if (lowerMessage.includes("don't understand") ||
        lowerMessage.includes("confused") ||
        lowerMessage.includes("struggling")) {
      // Could mark current topic as struggle area
      // This would be enhanced in production
    }

    return Object.keys(updates).length > 0 ? updates : undefined;
  }
}
