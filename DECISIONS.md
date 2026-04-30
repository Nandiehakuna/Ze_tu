# Implementation Decisions

## 2026-04-29

- Used Telegram `/link +phone` command to bind `telegram_chat_id` because onboarding cannot discover Telegram chat IDs directly.
- Implemented Bitnob settlement as webhook-authoritative (`/api/bitnob`) and removed in-route `setTimeout` settlement simulation from transfer creation.
- Marked transaction as `delivered` when Africa's Talking call request succeeds, then `confirmed` when keypad `1` is received in voice callback.
- Added `voice-messages` Supabase Storage bucket/public URL flow for Telegram voice notes; fallback preserves original Telegram file URL when upload fails.
- Implemented multilingual recipient call prompts with full Swahili + Dholuo support and English fallback.
- Added fraud guardrail that pauses transfer if message includes known recipient name with a different phone number.
- Added minimal Node test files using built-in test runner with `--experimental-strip-types` due missing package manager tooling in this environment.
