# AI Prompts Used During Development

This document contains all AI prompts used during the development of the CF AI CodeMentor application. This is required by the Cloudflare assignment to demonstrate transparency in AI-assisted development.

## Initial Project Setup Prompt

**Prompt:**
```
Build a Cloudflare AI-powered application called "CF_AI_CodeMentor" - a personalized coding tutor for exam prep.

Requirements from Cloudflare:
- Must use LLM (Workers AI with Llama 3.3)
- Must have workflow/coordination (use Durable Objects for state)
- Must have user input via chat interface (use Cloudflare Pages)
- Must have memory/state (persistent learning progress)
- Repo name must be `cf_ai_codementor`
- Must include README.md with setup instructions
- Must include PROMPTS.md documenting AI prompts used during development

Core Features:
1. Chat Interface (Cloudflare Pages - React/Vue)
   - Simple chat UI where users can ask coding questions
   - Display user's current learning progress
   - Show mastered concepts and areas to review

2. Personalized Learning State (Durable Objects)
   - Track current language (C++, Rust, Python, etc.)
   - Track current topic being learned
   - Store list of mastered concepts
   - Store struggle areas that need review
   - Store conversation history

3. AI Tutor Logic (Worker + Workers AI)
   - Use Llama 3.3 to answer coding questions
   - Adapt explanations based on user's skill level
   - Generate practice problems
   - Review code submissions and provide feedback
   - Ask follow-up questions to verify understanding

4. Key Interactions:
   - "I'm learning C++ pointers" → AI explains, then quizzes user
   - "Give me a practice problem on inheritance" → AI generates challenge
   - User submits code → AI reviews and explains mistakes
   - "I have an exam in 3 days on OOP" → AI creates study plan

Technical Stack:
- Frontend: React with Cloudflare Pages
- Backend: Cloudflare Workers
- State: Durable Objects (stores user learning progress)
- AI: Workers AI with @cf/meta/llama-3.3-70b-instruct-fp8-fast
```

## Architecture Design Prompts

### Durable Object Design

**Prompt:**
```
Create a Durable Object TypeScript class for storing user learning state with:
- UserState interface containing:
  - userId, currentLanguage, currentTopic
  - masteredConcepts[], struggleAreas[]
  - conversationHistory with Message[]
  - skillLevel (beginner/intermediate/advanced)
  - timestamps
- Methods for:
  - Getting current state
  - Updating state
  - Adding messages to conversation history
  - Updating concept mastery (master/struggle/remove)
  - Resetting state
- Proper error handling
- Limit conversation history to last 50 messages
```

### AI Tutor Implementation

**Prompt:**
```
Create an AI Tutor class that:
- Takes Cloudflare AI binding in constructor
- Implements chat method that:
  - Builds system prompt based on user state
  - Includes recent conversation history (last 10 messages)
  - Calls Workers AI with Llama 3.3
  - Returns response and suggested state updates
- Implements generatePractice method for practice problems
- Implements reviewCode method for code review
- Uses appropriate temperature settings (0.7 for chat, 0.8 for practice, 0.6 for review)
- Extracts learning insights from conversations (language, topic, struggle indicators)
```

### Worker API Design

**Prompt:**
```
Create a Cloudflare Worker that:
- Exports the LearningState Durable Object
- Defines Env interface with LEARNING_STATE and AI bindings
- Implements CORS headers for frontend
- Routes requests to:
  - GET /api/health - health check
  - GET /api/state - get user state
  - POST /api/state - update user state
  - POST /api/chat - send message and get AI response
  - POST /api/practice - generate practice problem
  - POST /api/review - review code
  - POST /api/reset - reset user progress
- Uses userId query parameter
- Proper error handling with try-catch
```

## Frontend Development Prompts

### React Components

**Prompt:**
```
Create React components for:

1. ChatMessage component:
   - Props: role, content, timestamp
   - Display user vs assistant messages with different styling
   - Format timestamps

2. ChatInput component:
   - Textarea for message input
   - Send button
   - Handle Enter key (Shift+Enter for new line)
   - Disabled state when loading

3. StatePanel component:
   - Display and edit user learning profile
   - Input fields for language, topic, skill level
   - Display mastered concepts as tags
   - Display struggle areas as tags
   - Show stats (message count, last updated)
```

### Main App Component

**Prompt:**
```
Create main App component that:
- Manages state for UserState, messages, loading, error
- Loads user state on mount
- Syncs messages with state.conversationHistory
- Implements handlers for:
  - Sending messages
  - Updating state
  - Generating practice problems
  - Resetting progress
- Auto-scrolls to latest message
- Shows welcome message when no messages
- Shows loading indicator when AI is responding
```

### API Service

**Prompt:**
```
Create TypeScript API service with:
- Interface definitions matching worker types
- Methods for all API endpoints:
  - chat(message, userId)
  - getState(userId)
  - updateState(updates, userId)
  - generatePractice(topic, difficulty, userId)
  - reviewCode(code, topic, language, userId)
  - reset(userId)
- Proper error handling
- TypeScript types for all responses
```

### Styling

**Prompt:**
```
Create modern CSS styling for the app with:
- Gradient header (purple/blue)
- Two-column layout (chat + state panel)
- Responsive design (stack on mobile)
- Distinct styling for user vs assistant messages
- Smooth transitions and hover effects
- Color-coded concept tags (green for mastered, red for struggle)
- Professional color palette
- Good spacing and typography
```

## Configuration Prompts

### Wrangler Configuration

**Prompt:**
```
Create wrangler.toml configuration with:
- Worker name: cf-ai-codementor
- Main entry: src/index.ts
- Compatibility date: 2024-11-18
- AI binding
- Durable Objects binding for LearningState
- Migration configuration for Durable Objects
```

### Package Configuration

**Prompt:**
```
Create package.json files for:

Workers:
- TypeScript and Wrangler dependencies
- Scripts for dev, deploy, tail
- Cloudflare Workers types

Frontend:
- React 18+ and React DOM
- TypeScript and type definitions
- Vite for build tooling
- Scripts for dev, build, preview
```

### TypeScript Configuration

**Prompt:**
```
Create TypeScript configurations:

Workers tsconfig.json:
- Target ES2022
- Cloudflare Workers types
- Strict mode enabled
- Module resolution for Workers

Frontend tsconfig.json:
- Target ES2020
- React JSX support
- DOM types
- Vite bundler module resolution
- Strict mode enabled
```

## Documentation Prompts

### README Creation

**Prompt:**
```
Create comprehensive README.md with:
- Project description and features
- Architecture explanation of all Cloudflare components
- Project structure tree
- Prerequisites
- Local setup instructions (step by step)
- Deployment instructions for both worker and frontend
- API endpoint documentation
- How it works section explaining state management and AI
- Example workflow
- Troubleshooting section
- Development notes
```

### PROMPTS.md (This File)

**Prompt:**
```
Create PROMPTS.md documenting:
- Initial project setup prompt
- All architecture design prompts
- Frontend development prompts
- Configuration prompts
- Documentation prompts
- System prompts used in the AI tutor
- Any other prompts used during development
```

## AI System Prompts (Used in Production)

### Main Tutor System Prompt

The following system prompt is dynamically generated based on user state and used in production:

```
You are a personalized coding tutor helping students prepare for exams.

Student Profile:
- Skill Level: {skillLevel}
- Current Language: {currentLanguage}
- Current Topic: {currentTopic}
- Mastered Concepts: {masteredConcepts}
- Struggling With: {struggleAreas}

Your Teaching Approach:
- Adapt explanations to the student's skill level
- After explaining concepts, ask questions to verify understanding
- Generate practice problems appropriate to their level
- When reviewing code, be constructive and educational
- Help identify which concepts they've mastered vs struggling with
- For exam preparation, focus on practical application and common patterns
- Be encouraging but honest about areas needing improvement

Remember: Your goal is to help them succeed in their exams through clear explanations and targeted practice.
```

### Practice Problem Generation Prompt

```
Generate a {difficulty} practice problem for {topic} in {language}.

Include:
1. Problem statement
2. Example input/output
3. Constraints
4. Hints (optional)

Make it educational and appropriate for exam preparation.
```

### Code Review Prompt

```
Review this {language} code for {topic}:

```{language}
{code}
```

Provide:
1. What's correct
2. What needs improvement
3. Best practices to follow
4. Specific suggestions for fixes

Be constructive and educational.
```

## Additional Development Prompts

### Debugging Prompts

During development, these types of debugging prompts were used:

```
- "Fix TypeScript error in LearningState.ts"
- "Add proper error handling to API calls"
- "Update CORS headers to allow frontend requests"
- "Fix state synchronization between Durable Object and frontend"
```

### Enhancement Prompts

```
- "Add loading indicator while AI is responding"
- "Implement auto-scroll to latest message"
- "Add welcome message for new users"
- "Improve styling for mobile responsiveness"
```

### Testing Prompts

```
- "Create example user interactions to test the chat flow"
- "Test Durable Object state persistence"
- "Verify Workers AI integration"
- "Test all API endpoints"
```

## Conclusion

All prompts above were used to develop this application using AI assistance (Claude Code). The development process followed an iterative approach:

1. Start with architecture design
2. Implement backend (Worker + Durable Objects + AI)
3. Implement frontend (React + API integration)
4. Create configuration files
5. Write comprehensive documentation
6. Test and refine

This transparency in AI-assisted development demonstrates how modern tools can accelerate development while maintaining code quality and following best practices.
