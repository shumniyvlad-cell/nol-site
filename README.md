# НОЛЬ — production site

Next.js 16 / React 19 implementation of the approved V2 visual system for the
Russian bankruptcy-support and editorial brand «НОЛЬ».

The visual source of truth is `design/concepts-v2/`. Implementation decisions,
responsive rules and screenshot gates are recorded in:

- `design/PRODUCTION_SPEC_V2.md`
- `design/FIDELITY_LEDGER.md`
- `design/PRODUCTION_ASSET_PROMPTS.md`

## Local run

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Open `http://localhost:3000`.

## Required production configuration

Lead collection is intentionally blocked in production until all of the
following are configured:

- `NEXT_PUBLIC_COMPANY_LEGAL_NAME`
- `NEXT_PUBLIC_COMPANY_INN`
- `NEXT_PUBLIC_COMPANY_EMAIL`
- `LEADS_WEBHOOK_URL`

The real Telegram URL and remaining company details should also be provided.
The site never substitutes fictional requisites or contacts.

`LEADS_WEBHOOK_TOKEN` is optional. When present, it is sent as a Bearer token
to the lead webhook. In development, accepted QA submissions are kept only in
a bounded in-memory store and disappear on restart.

The privacy and consent routes expose their configuration status. Their wording
must receive final legal review after the real operator, CRM, retention period
and contact channel are known.

## Verification

```bash
pnpm lint
pnpm typecheck
pnpm build
pnpm test:e2e
```

Manual visual gates cover 1586×992, 1024×900 and 390×844. Screenshot paths and
section-by-section corrections are listed in `design/FIDELITY_LEDGER.md`.

## Lead endpoint

`POST /api/leads` accepts two validated payloads:

- `type: "diagnostic"` — contact details, all seven answers and optional UTM;
- `type: "premiere"` — email subscription.

The endpoint includes:

- Zod server validation;
- honeypot rejection;
- bounded in-memory IP rate limiting;
- 90-second duplicate guard;
- production webhook adapter;
- no logging of submitted personal data.

For a multi-instance deployment, replace the in-memory limiter and duplicate
store with a shared durable store before public traffic.
