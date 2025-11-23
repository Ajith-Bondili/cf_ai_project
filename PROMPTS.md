# AI Prompts

This file contains the prompts used to generate the code for this project, as required by the assignment instructions.

## Initial Prompt
Build a Cloudflare AI-powered application called "CF_AI_CodeMentor" - a personalized coding tutor for exam prep.

Requirements from Cloudflare:
- Must use LLM (Workers AI with Llama 3.3)
- Must have workflow/coordination (use Durable Objects for state)
- Must have user input via chat interface (use Cloudflare Pages)
- Must have memory/state (persistent learning progress)
- Repo name must be cf_ai_codementor
- Must include README.md with setup instructions
- Must include PROMPTS.md documenting AI prompts used during development

Core Features:
- Chat Interface (Cloudflare Pages - React/Vue)
- Personalized Learning State (Durable Objects)
- AI Tutor Logic (Worker + Workers AI)

Technical Stack:
- Frontend: React with Cloudflare Pages
- Backend: Cloudflare Workers
- State: Durable Objects
- AI: Workers AI with @cf/meta/llama-3.3-70b-instruct-fp8-fast

