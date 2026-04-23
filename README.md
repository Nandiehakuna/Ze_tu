# Zetu — Send Money Home. Just Say the Word.

> *Zetu* means "ours" in Swahili. This was built for us, by people who know the feeling of sending money home at midnight and spending four hours wondering if it arrived.

---

## What Zetu Is

Zetu is an AI-native Bitcoin remittance service for the African diaspora — built on Lightning Network for instant, near-zero-cost transfers, and Claude AI for the human layer that makes it feel like talking to a trusted family member.

It serves two people simultaneously:

**The sender** — a son in London who opens Telegram, types "send £100 mum", and is done in twenty seconds.

**The recipient** — a grandmother in Kisumu with a basic feature phone who speaks Dholuo, has never downloaded an app, and receives a phone call in her language the moment the money arrives — including her son's recorded voice.

No competitor has built for both of them at once. Zetu does.

---

## The Problem

African diaspora families send over $50 billion home every year. Western Union and similar services take 6–9% of every transfer in fees. On a £200 transfer, that is £14–18 gone before the family sees a shilling.

The technology to do this for under 1% has existed for years. Lightning Network can move value from London to Kisumu in four seconds for fractions of a cent.

The gap is not technical. It is human. Every product built on top of that technology was designed by people who have never felt the specific anxiety of wondering whether your mother received the money you sent at midnight.

Zetu is built by people who know that feeling.

---

## Core Features

### For the Sender (Telegram AI Agent)
- **Conversational transfers** — no forms, no dropdowns, no account numbers typed manually. The entire send flow happens inside a natural conversation
- **Relationship memory** — after the first transfer, Zetu remembers every recipient. "Send £100 mum" is a complete instruction
- **Urgency detection** — messages containing emergency signals in English, Swahili, Sheng, or Dholuo trigger immediate execution with no confirmation step
- **Multilingual response** — Claude detects and responds in whatever language the sender writes in, including mixed Sheng, with no language selection required
- **Conversational FX advisory** — proactive rate intelligence in plain language: "Rate is better than usual today — Grace would receive KSh 400 more than last week"
- **Fraud detection** — if a recipient's M-Pesa number changes unexpectedly, Claude pauses and asks in plain language before executing
- **Voice message attachment** — record a voice note in Telegram that plays to the recipient the moment their money arrives

### For the Recipient (Voice-First, No App Required)
- **Automated voice call on receipt** — the moment Lightning settles, an outbound call fires to the recipient's phone in their preferred language
- **Personal voice message delivery** — the sender's recorded voice plays during the call after the transfer notification
- **USSD menu** (`*384#`) — works on any phone including basic feature phones on 2G with no internet required. Check balance, confirm receipt, replay a voice message
- **IVR callback** — recipients can call back the Zetu number to check balance, confirm transfers, or replay messages using only voice and keypad
- **Hyperlocal language support** — Swahili, English via AI TTS; Kikuyu via hybrid pre-recorded and TTS; Dholuo and Luhya via pre-recorded native speaker audio

### Web Dashboard (Sender)
- **Family hub home screen** — recipient avatars as the hero, not account balance
- **Live send flow** — real-time KES conversion as you type, honest fee display, Lightning settlement animation, success confirmation
- **Savings tracker** — accumulated Bitcoin savings displayed in KES equivalent, never in BTC terms
- **Transaction history** — full receipts including Lightning invoice hash, delivery status, and voice message played confirmation
- **Shared state with Telegram** — everything done in Telegram appears instantly on the dashboard. One database, two interfaces

---

## Architecture

```
Sender (Telegram) ──────────────────────────────────────────┐
                                                             ▼
                                                    Next.js API Routes
                                                             │
                              ┌──────────────────────────────┤
                              │                              │
                         Claude API                   Bitnob Testnet
                    (AI brain, memory,           (Lightning invoice
                     language, urgency)           creation + settlement)
                              │                              │
                              └──────────────────────────────┘
                                                             │
                                                     Supabase (PostgreSQL)
                                              (users, recipients, transactions,
                                               messages, voice_messages)
                                                             │
                              ┌──────────────────────────────┤
                              │                              │
                    Africa's Talking                   Web Dashboard
                  (Voice calls, USSD,              (Next.js App Router,
                   SMS, IVR, audio               React, Tailwind, Supabase
                      playback)                       Realtime)
                              │
                    ┌─────────┴──────────┐
                    │                    │
             Recipient phone      Supabase Storage
           (feature phone, 2G)   (voice messages,
                                  pre-recorded audio
                                    by language)
```

### Data Flow — One Complete Transfer

1. Sender types "send £100 mum" in Telegram
2. Telegram webhook hits `POST /api/telegram`
3. Claude receives message with full sender context injected — recipient memory, transaction history, current FX rate
4. Claude confirms: "Sending £100 to Grace — she'll receive KSh 16,840. Confirm?"
5. Sender confirms
6. Backend calls Bitnob to create Lightning invoice on testnet
7. Bitnob settles invoice, fires webhook to `POST /api/bitnob`
8. Backend constructs recipient call flow based on Grace's language preference (Dholuo)
9. Africa's Talking places outbound call to Grace's feature phone
10. Call plays: transfer notification in Dholuo → sender's recorded voice message
11. Grace presses 1 to confirm
12. Transaction status updates in Supabase
13. Sender receives Telegram message: "Grace confirmed she received it and heard your message"
14. Dashboard updates in real time via Supabase realtime subscription

---

## Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Framework | Next.js 15 (App Router) | API routes and frontend in one repo, one deployment |
| Language | TypeScript | Type safety across the entire stack |
| Styling | Tailwind CSS | Rapid UI development, consistent design tokens |
| AI | Claude API (claude-sonnet-4-20250514) | Conversation, language detection, urgency, memory |
| Bitcoin | Bitnob API (testnet) | Lightning invoice creation and settlement |
| Voice / USSD / SMS | Africa's Talking | Outbound calls, IVR, USSD sessions, SMS |
| Database | Supabase (PostgreSQL) | Single source of truth for both Telegram and web |
| Auth | Supabase Auth | Phone number OTP — same number links Telegram and dashboard |
| Storage | Supabase Storage | Voice messages, pre-recorded language audio |
| Messaging | Telegram Bot API | Primary sender interface — already trusted, already installed |
| FX Rates | ExchangeRate-API | Live GBP/KES rate, cached every 10 minutes |
| Deployment | Vercel | Native Next.js hosting, public URL for webhooks |
| Audio Processing | ffmpeg | OGG to MP3 conversion for voice messages |

**Total infrastructure cost: zero.** Every service used in this MVP has a free tier sufficient for development and demonstration.

---

## Language Support

| Language | Speakers | Method | Status |
|---|---|---|---|
| English | Diaspora senders | Claude AI + Africa's Talking TTS | Full |
| Swahili | Urban Kenya | Claude AI + Africa's Talking TTS | Full |
| Sheng | Urban diaspora | Claude AI detection and response | Full |
| Kikuyu | Central Kenya | Pre-recorded + TTS hybrid | MVP |
| Dholuo | Western Kenya | Pre-recorded native speaker audio | MVP |
| Luhya | Western Kenya | Pre-recorded native speaker audio | MVP |

The grandmother in Kisumu who speaks only Dholuo and has never used a smartphone receives a phone call in her language the moment her money arrives. She presses 1 to confirm. She hears her son's voice from London. She has never opened an app. She never will. Zetu works for her anyway.

---

## Project Structure

```
zetu/
  src/
    app/
      api/
        telegram/        # Telegram webhook — entry point for all sender messages
          route.ts
        bitnob/          # Lightning settlement webhook
          route.ts
        africastalking/  # Voice, USSD, SMS callbacks
          voice/route.ts
          ussd/route.ts
          sms/route.ts
        transfer/        # Core transfer execution logic
          route.ts
      dashboard/         # Web app — family hub
        page.tsx
      page.tsx           # Landing page
    lib/
      claude.ts          # Claude client, system prompt, context injection
      bitnob.ts          # Bitnob API wrapper
      africastalking.ts  # AT voice, USSD, SMS wrappers
      supabase.ts        # Database client (server + client)
      fx.ts              # Exchange rate fetching and caching
      voice.ts           # Call flow builder, audio stitching by language
      urgency.ts         # Urgency detection classifier
    types/
      index.ts           # Shared TypeScript interfaces
```

---

## Environment Variables

```bash
# AI
ANTHROPIC_API_KEY=

# Bitcoin / Lightning
BITNOB_API_KEY=
BITNOB_WEBHOOK_SECRET=

# Messaging
TELEGRAM_BOT_TOKEN=

# Voice / USSD / SMS
AFRICASTALKING_API_KEY=
AFRICASTALKING_USERNAME=

# Database
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# FX
EXCHANGERATE_API_KEY=
```

---

## Database Schema

```sql
-- Senders
create table users (
  id uuid primary key default gen_random_uuid(),
  phone text unique not null,
  name text,
  telegram_chat_id text unique,
  language text default 'english',
  created_at timestamptz default now()
);

-- Recipients (the family on the other side)
create table recipients (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid references users(id),
  name text not null,
  relationship text,              -- 'mum', 'sister', 'uncle'
  mpesa_number text not null,
  language text default 'swahili',-- preferred call language
  voice_method text default 'tts',-- 'tts', 'pre-recorded', 'hybrid'
  usual_amount numeric,
  usual_send_day integer,         -- day of month
  created_at timestamptz default now()
);

-- Transactions
create table transactions (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid references users(id),
  recipient_id uuid references recipients(id),
  amount_gbp numeric not null,
  amount_kes numeric not null,
  fee_gbp numeric not null,
  fx_rate numeric not null,
  lightning_invoice text,
  lightning_hash text,
  status text default 'pending',  -- pending, settled, delivered, confirmed
  voice_message_url text,         -- sender's recorded voice note
  voice_played boolean default false,
  created_at timestamptz default now()
);

-- Conversation history (Claude context)
create table messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id),
  role text not null,             -- 'user' or 'assistant'
  content text not null,
  created_at timestamptz default now()
);
```

---

## The Demo

Three journeys. Three minutes. One panel that understands why this has never existed before.

**Journey 1 — First time sender (English)**
Types "I want to send money to my mum in Kisumu." Claude walks them through adding Grace's M-Pesa number conversationally. Quotes the rate. Executes. Grace's phone rings.

**Journey 2 — Returning sender (twenty seconds)**
Types "send £100 mum." Claude responds with confirmation. One tap. Done. The relationship memory makes repeat use instant.

**Journey 3 — Emergency transfer (Swahili)**
Types "baba yuko hospitalini nataka kutuma haraka." Urgency detected. Claude executes without asking for confirmation. Real-time updates every thirty seconds. Grace's phone rings immediately. She hears her son's voice.

---

## Why This Cannot Be Copied

**Relationship data compounds.** Every transfer makes the AI smarter for that specific sender. After six months, the product knows your family. That is not a feature. That is a relationship.

**Cultural AI cannot be replicated by outsiders.** Detecting urgency in Sheng, responding appropriately in Dholuo, knowing when to be warm versus when to be fast — this requires cultural knowledge that a London or San Francisco product team cannot buy.

**The recipient has never been served.** Every remittance product is built for the sender. Zetu is the first product that treats the grandmother in Kisumu as a first-class user — with her own interface, her own language, her own experience — even though she has never heard of Bitcoin and never will.

---

## Built For

AI and Bitcoin Residency Capstone Project — demonstrating the convergence of Lightning Network infrastructure and conversational AI in service of real financial inclusion for African diaspora families.

---

*The name Zetu means "ours." The vision is a financial system that actually belongs to the people who use it — built in their language, designed for their reality, remembering their family's names.*
