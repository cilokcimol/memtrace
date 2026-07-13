# MemTrace

A persistent AI debugging assistant that stores every bug fix, architectural decision, and failure pattern to Walrus Mainnet. The agent recalls this history automatically at the start of every session, eliminating repeated context-building and enabling compounding knowledge across a project lifetime.

Submitted for Walrus Sessions 5 hackathon.

## What It Does

Standard AI chat sessions reset on close. Every question requires re-explaining the stack, the error context, and the history. MemTrace solves this by writing structured memory to Walrus Mainnet after every resolved bug and decision. The next session starts with full context already loaded.

The agent:

- Recalls relevant past bugs and fixes before replying to the first message
- Cross-references new errors against stored error signatures and classes
- Structures confirmed fixes in a format optimised for retrieval
- Stores architectural decisions with rejected alternatives and rationale
- Synthesises recurring failure patterns after three or more bugs in a session
- Generates a full session summary on close

## Memory Architecture

Memory is stored per user across four namespaces on Walrus Mainnet:

| Namespace | Contents |
|---|---|
| bugs-{username} | Error descriptions, stack traces, reproduction context |
| fixes-{username} | Confirmed working solutions with root cause and lesson |
| decisions-{username} | Technology and architecture choices with reasoning |
| patterns-{username} | Recurring failure patterns identified across sessions |

Each username is completely isolated. No data is shared between users.

## Tech Stack

- Next.js 16 App Router with TypeScript
- Walrus Memory SDK for on-chain storage and retrieval
- Google Gemini with multi-key rotation for zero-downtime inference
- Vanilla CSS with custom design tokens

## Project Structure

```
src/
  app/
    page.tsx          Landing page
    chat/page.tsx     Chat interface with sidebar, history, and session management
    prompt/page.tsx   System prompt documentation page
    layout.tsx        Root layout with metadata
    globals.css       Design system and component styles
    api/
      chat/route.ts   Core inference and memory write endpoint
      memory/route.ts Memory read and write utility endpoint
      stats/route.ts  Blob count endpoint
  lib/
    counter.ts        Persistent blob count tracker
  components/
    Nav.tsx           Navigation component
scripts/
  seed-memories.mjs   Walrus memory seed script for demo data
public/
  logo.png            Brand logo
data/
  blob-count.json     Local blob count state
```

## Running Locally

Clone the repository and install dependencies:

```bash
npm install
```

Create a `.env.local` file in the project root with the following variables:

```
MEMWAL_PRIVATE_KEY=your_walrus_private_key
MEMWAL_ACCOUNT_ID=your_walrus_account_id
MEMWAL_SERVER_URL=https://relayer.memory.walrus.xyz
GEMINI_KEY_1=your_gemini_api_key
GEMINI_KEY_2=your_gemini_api_key_2
GEMINI_KEY_3=your_gemini_api_key_3
GEMINI_KEY_4=your_gemini_api_key_4
GEMINI_KEY_5=your_gemini_api_key_5
GEMINI_KEY_6=your_gemini_api_key_6
```

Start the development server:

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

## Seeding Demo Memory

To populate Walrus Mainnet with demonstration data before presenting:

```bash
node scripts/seed-memories.mjs
```

This writes 17 blobs across all four namespaces using the configured account.

## Deploying to Netlify

Build the project:

```bash
npm run build
```

Deploy via Netlify CLI or drag the source folder (excluding `node_modules` and `.env.local`) to Netlify. The `netlify.toml` in the project root configures the build command and publish directory automatically.

Set the same environment variables listed above in Netlify under Site settings, Environment variables.

## Environment Variables Reference

| Variable | Description |
|---|---|
| MEMWAL_PRIVATE_KEY | Walrus account private key for signing memory writes |
| MEMWAL_ACCOUNT_ID | Walrus account identifier |
| MEMWAL_SERVER_URL | Walrus relayer endpoint |
| GEMINI_KEY_1 through GEMINI_KEY_6 | Gemini API keys for rotation |

## Hackathon

Built for Walrus Sessions 5 Memory Prompt Jam. The account ID for verifying on-chain writes is `0xbad2a5a0114e936bdf40ff1ffb3b0ee48621ca3a32708d8bbae783547e8df983`.
