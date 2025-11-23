# CF AI CodeMentor

A personalized AI-powered coding tutor built on Cloudflare's platform for exam preparation. This application helps students learn programming concepts through interactive chat, practice problems, code review, and personalized progress tracking.

## Features

- **AI-Powered Chat**: Interact with an AI tutor powered by Llama 3.3 on Workers AI
- **Personalized Learning**: Tracks your language, topics, skill level, and learning progress
- **Practice Problems**: Generate custom practice problems for exam prep
- **Code Review**: Submit code for AI-powered feedback and suggestions
- **Persistent State**: Uses Durable Objects to maintain your learning history
- **Real-time Interface**: React-based chat interface with live updates

## Architecture

This application demonstrates all required Cloudflare AI components:

1. **LLM**: Workers AI with `@cf/meta/llama-3.3-70b-instruct-fp8-fast`
2. **Workflow/Coordination**: Cloudflare Workers + Durable Objects for state management
3. **User Input**: React chat interface served via Cloudflare Pages (or local dev)
4. **Memory/State**: Durable Objects store user progress, conversation history, and learning state

## Project Structure

```
cf_ai_project/
├── README.md                    # This file
├── PROMPTS.md                   # AI prompts used during development
├── workers/                     # Cloudflare Worker backend
│   ├── src/
│   │   ├── index.ts            # Main worker entry point
│   │   ├── durable-objects/
│   │   │   └── LearningState.ts # Durable Object for user state
│   │   └── ai/
│   │       └── tutor.ts        # AI tutor logic
│   ├── wrangler.toml           # Worker configuration
│   ├── package.json
│   └── tsconfig.json
└── frontend/                    # React frontend
    ├── src/
    │   ├── main.tsx            # Entry point
    │   ├── App.tsx             # Main app component
    │   ├── App.css             # Styles
    │   ├── components/         # React components
    │   │   ├── ChatMessage.tsx
    │   │   ├── ChatInput.tsx
    │   │   └── StatePanel.tsx
    │   └── services/
    │       └── api.ts          # API client
    ├── index.html
    ├── vite.config.ts
    ├── package.json
    └── tsconfig.json
```

## Prerequisites

- Node.js 18+ and npm
- Cloudflare account (free tier works)
- Wrangler CLI (`npm install -g wrangler`)

## Local Setup

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd cf_ai_project
```

### 2. Install Worker Dependencies

```bash
cd workers
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

### 4. Authenticate with Cloudflare

```bash
wrangler login
```

### 5. Run the Worker Locally

```bash
cd ../workers
npm run dev
```

The worker will start on `http://localhost:8787`

### 6. Run the Frontend Locally

In a new terminal:

```bash
cd frontend
npm run dev
```

The frontend will start on `http://localhost:3000`

### 7. Test the Application

Open your browser to `http://localhost:3000` and start chatting with the AI tutor!

**Try these example prompts:**
- "I'm learning C++ pointers"
- "Give me a practice problem on inheritance"
- "Review this code: [paste code]"
- "I have an exam in 3 days on OOP concepts"

## Deployment

### Deploy the Worker

1. Update `wrangler.toml` if needed (name, routes, etc.)

2. Deploy to Cloudflare:

```bash
cd workers
npm run deploy
```

This will deploy your worker and Durable Objects to Cloudflare's global network.

3. Note the deployed URL (e.g., `https://cf-ai-codementor.your-subdomain.workers.dev`)

### Deploy the Frontend

#### Option 1: Cloudflare Pages

1. Update the API endpoint in `frontend/src/services/api.ts` to your deployed worker URL

2. Build the frontend:

```bash
cd frontend
npm run build
```

3. Deploy to Cloudflare Pages:

```bash
npx wrangler pages deploy dist --project-name cf-ai-codementor
```

#### Option 2: Manual Pages Deployment

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to Pages
3. Create a new project
4. Connect your Git repository
5. Set build settings:
   - Build command: `cd frontend && npm install && npm run build`
   - Build output directory: `frontend/dist`
6. Deploy

### Environment Configuration

For production, you may want to:

1. Add authentication (currently uses default user ID)
2. Configure custom domains
3. Set up rate limiting
4. Add monitoring with Workers Analytics

## API Endpoints

The worker exposes these endpoints:

- `GET /api/health` - Health check
- `GET /api/state?userId=<id>` - Get user learning state
- `POST /api/state?userId=<id>` - Update user state
- `POST /api/chat?userId=<id>` - Send chat message
- `POST /api/practice?userId=<id>` - Generate practice problem
- `POST /api/review?userId=<id>` - Review code
- `POST /api/reset?userId=<id>` - Reset user progress

## How It Works

### User State Management (Durable Objects)

Each user's learning state is stored in a Durable Object instance:

```typescript
interface UserState {
  userId: string;
  currentLanguage: string;        // Current programming language
  currentTopic: string;           // Current topic being learned
  masteredConcepts: string[];     // Concepts user has mastered
  struggleAreas: string[];        // Topics user struggles with
  conversationHistory: Message[]; // Chat history
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
}
```

### AI Integration

The AI tutor uses Llama 3.3 on Workers AI:

- Adapts explanations based on skill level
- Maintains conversation context
- Generates personalized practice problems
- Reviews code with constructive feedback
- Automatically detects topics and concepts from conversations

### Example Workflow

1. User: "I'm learning C++ pointers"
2. AI: [Explains pointers based on user's skill level]
3. System: Updates `currentLanguage` to "C++" and `currentTopic` to "pointers"
4. User: "Give me a practice problem"
5. AI: [Generates pointer practice problem appropriate to skill level]
6. User: [Submits solution code]
7. AI: [Reviews code and provides feedback]
8. System: May update `masteredConcepts` or `struggleAreas` based on interaction

## Troubleshooting

### Worker not starting locally

- Ensure you're authenticated: `wrangler login`
- Check that port 8787 is not in use
- Verify wrangler.toml configuration

### Frontend can't connect to worker

- Check that worker is running on port 8787
- Verify proxy configuration in `vite.config.ts`
- Check browser console for CORS errors

### AI responses not working

- Ensure your Cloudflare account has Workers AI enabled
- Check worker logs: `wrangler tail`
- Verify AI binding in wrangler.toml

### Durable Objects errors

- Ensure migrations are configured in wrangler.toml
- Try redeploying: `wrangler deploy`
- Check Cloudflare dashboard for Durable Objects status

## Development Notes

- The application uses a simple userId query parameter for demo purposes
- In production, implement proper authentication (e.g., Cloudflare Access, OAuth)
- Conversation history is limited to last 50 messages to manage storage
- AI context window uses last 10 messages for better response quality

## License

MIT

## Contributing

This project was created as part of a Cloudflare AI application assignment. Feel free to fork and enhance!

## Support

For issues or questions:
1. Check the Troubleshooting section
2. Review [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
3. Review [Workers AI Docs](https://developers.cloudflare.com/workers-ai/)
4. Review [Durable Objects Docs](https://developers.cloudflare.com/durable-objects/)
