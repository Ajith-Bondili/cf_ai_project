# AI Prompts

This file documents the AI prompts used throughout the development of **CF_AI_CodeMentor**. The development process was iterative, using AI to unblock specific technical challenges and brainstorm design ideas.

## 1. Project Setup & Architecture
**Prompt:**
> "I'm planning to build a coding tutor app on Cloudflare. I need to use Workers AI for the LLM and I want to store user progress (like which topics they've mastered).
>
> Should I use KV or Durable Objects for the user state? I want it to be consistent and fast. Also, how do I set up the initial `wrangler.toml` to bind these together?"

## 2. Backend Development (Workers & Durable Objects)
**Prompt:**
> "I'm writing the Durable Object class in TypeScript. I need a `fetch` handler that takes a request, reads the user's current 'skill level' from storage, and then passes it to the AI model.
>
> Can you show me a pattern for:
> 1. Reading state from `this.state.storage`.
> 2. Calling `@cf/meta/llama-3.3-70b-instruct-fp8-fast`.
> 3. Updating the state based on the AI's response?"

## 3. Debugging State Persistence ("Account Glitch")
**Prompt:**
> "I'm running into a weird issue where the user state seems to reset randomly or not save immediately.
>
> I'm using `await this.state.storage.put('data', data)`. Is there a race condition here? Or do I need to handle the promise differently? Sometimes I get a 500 error when multiple requests come in fast. How do I ensure the write lock is handled correctly in a Durable Object?"

## 4. Frontend Design (Neobrutalism)
**Prompt:**
> "I want the frontend to stand out. I'm thinking of a 'Neobrutalist' or 'Dorksense' aesthetic—bold black borders, hard shadows, and vibrant pastel colors (pink, teal, yellow).
>
> Can you give me some Tailwind CSS utility classes that create:
> 1. A card with a thick black border and a hard drop shadow.
> 2. A button that looks like a physical block and presses down when clicked.
> 3. A layout that feels like a retro dashboard?"

## 5. Deployment & Configuration
**Prompt:**
> "I'm ready to deploy. I'm getting an error about `workers_dev = true` conflicting with my route configuration in `wrangler.toml`.
>
> How do I properly configure this to deploy the Worker to a `workers.dev` subdomain for testing, and how do I connect the React frontend (Pages) to this backend URL without CORS issues?"
