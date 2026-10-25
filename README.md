# GST Saathi (v1 — Explainer)

AI course project. A plain-language explainer for GST filings, invoices, and
notices, built for small shopkeepers in India who currently depend entirely on
their accountant (CA) and have no way to understand or verify what is filed in
their name.

## Problem statement

A Bengaluru small-business study found that 77% of small shopkeepers depend
entirely on their accountant for GST compliance, and reconciling input tax
credit (ITC) is their single hardest pain point. Existing tools (ClearTax,
Zoho Books, Tally) solve the *filing* mechanics for the accountant — none of
them solve the shopkeeper's actual problem: understanding, in their own
language, what was filed on their behalf and what it means for their money.

## What this version does (v1 — Explainer)

- Shopkeeper pastes (or picks a pre-loaded sample) GST filing / invoice /
  department notice text.
- An LLM (Anthropic Claude, OpenAI fallback) explains it in plain,
  jargon-free language: what the document is, what it means for their money,
  and what's worth double-checking with their accountant.
- It explains. It does **not** audit, verify, or certify anything, and it
  never claims a filing or an accountant is right or wrong.
- A provider/API-key toggle lets the explainer run against either Anthropic
  or OpenAI, with an optional user-supplied key sent directly with the
  request (never stored or logged).

## What this version deliberately does not do (v2 — future)

An **Auditor** mode — cross-checking a CA's actual filing against the
shopkeeper's real invoices to catch mismatches or missed ITC claims — is the
planned next step, not part of this submission. It needs real documents,
deeper GST domain logic, and a separate compliance review (it implicitly
critiques a licensed professional's work, which is a different risk
conversation than explaining a document in plain language).

## Disclaimers

> This prototype uses synthetic GST data for demonstration only. It is an AI
> explainer, not a compliance or audit tool, and does not replace a qualified
> Chartered Accountant.

> This prototype does not persist, log, or transmit uploaded documents beyond
> the active session. No real shopkeeper or CA data should be used with this
> version.

## Running locally

```bash
npm install
cp .env.local.example .env.local   # add your ANTHROPIC_API_KEY (or OPENAI_API_KEY)
npm run dev
```

Open http://localhost:3000.

## Tech

Next.js (App Router) + TypeScript + Tailwind CSS, with a single API route
(`/api/explain`) calling Anthropic Claude (OpenAI as a fallback provider).
