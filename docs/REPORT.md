# GST Saathi — Project Report

**Course project (AI course)**
**Team:** Aksh Juneja, Shruti Agnihotri
**Repository:** https://github.com/Aksh28/gst-saathi
**Submission date:** 25 October 2026

---

## 1. Executive Summary

GST Saathi is an AI-powered tool that explains Indian GST (Goods and Services
Tax) filings, invoices, and department notices in plain, jargon-free language
for small shopkeepers. This submission is **v1 (Explainer)**: a working
prototype that takes GST-related text and returns a plain-language
explanation. A second mode, **Auditor** (cross-checking a filing against a
shopkeeper's real invoices to catch errors), is scoped as future work and is
intentionally not part of this build — the reasoning for that scope line is
in Section 6.

The long-term goal is not purely academic: the problem is real, evidence of
it is strong, and the intention is to keep building this into a product
small shopkeepers would actually pay for, beyond the course deadline.

---

## 2. Problem Statement

Small and medium shopkeepers in India are legally required to file GST
returns, but almost none of them do it themselves. They hire a Chartered
Accountant (CA) to handle the filing and have no independent way to verify
what was filed in their name, whether it was filed correctly, or what it
actually means for their money.

This is not a hypothetical problem. Industry reporting on small-business GST
compliance (a study of small-business practices around Bengaluru CA firms)
found that **77% of small businesses depend entirely on their accountant for
GST**, with no verification step of their own, and that **reconciling Input
Tax Credit (ITC)** — the credit a business can claim back on tax it already
paid to its suppliers — is consistently the single hardest part of the
process for them to understand. GST rule changes (such as the September 2025
rate-cut pass-through) have also generated visible waves of consumer and
small-business confusion and complaints.

The core failure is not that filing tools don't exist — it's that **existing
tools solve the wrong side of the problem**.

---

## 3. Market and Target Users

**Primary user:** a small shopkeeper or micro-business owner in India who
files GST exclusively through a CA and cannot read, verify, or make sense of
the filing documents themselves.

**Market size context:** India has tens of millions of GST-registered small
businesses, the overwhelming majority of which are CA-dependent for
compliance (per the 77% figure above). This is a large, recurring-need
market — GST filing happens monthly, not once.

**Existing competition and why it doesn't solve this:**

| Tool | What it solves | What it doesn't solve |
|---|---|---|
| ClearTax, Zoho Books, Tally | Filing mechanics *for the CA/business* | Whether the shopkeeper understands or trusts what was filed |
| Generic chatbots / search | General tax Q&A | Explaining *this specific* filing document, in context |
| Insurance-claim-dispute startups (Insurance Samadhan, ClaimBuddy, etc.) | A similar "person vs. confusing paperwork" problem, but in insurance | Different domain; already well-funded and saturated — validated the pattern, not a competitor here |
| Government scheme-discovery tools (Haqdarshak, etc.) | Benefit discovery for individuals | Different domain (welfare, not GST); also validated the pattern |

No existing product was found that sits on the shopkeeper's side of the GST
relationship and simply explains, in their own language, what their
accountant filed. That is the specific gap GST Saathi targets.

**Commercialization path (long-term, beyond this course submission):**
B2C/freemium to shopkeepers directly, with a plausible future B2B channel
(CA firms offering it to their own clients as a transparency/trust feature).
No real pilot users have been engaged yet — the next concrete step after
this submission is finding 2–3 real shopkeepers or CAs to validate with.

---

## 4. Solution Overview

### v1 — Explainer (built, this submission)
- User pastes GST filing / invoice / department-notice text, or selects one
  of three pre-loaded **synthetic sample documents** (a GSTR-3B monthly
  return, a B2B purchase invoice, and a department discrepancy notice).
- An LLM (Anthropic Claude, with an OpenAI fallback path already wired)
  returns a plain-language explanation: what the document is, what it means
  for the shopkeeper's money, and what's worth double-checking with their
  accountant.
- The tool **explains**. It does not audit, verify, or certify the filing,
  and it never asserts that a filing or an accountant is right or wrong.

### v2 — Auditor (future work, not built here)
- Cross-check a CA's actual filing against the shopkeeper's real invoices
  and sales records, and flag mismatches, missed ITC claims, or possible
  overbilling.
- Deliberately excluded from this submission (see Section 6).

---

## 5. Technical Approach

- **Stack:** Next.js (App Router) + TypeScript + Tailwind CSS, deployed as a
  single web app with one API route.
- **AI layer:** `/api/explain` route accepts the document text, an optional
  provider selection (Anthropic or OpenAI), and an optional user-supplied API
  key; it calls the corresponding LLM with a system prompt that constrains
  the model to *explain only* (explicitly instructed never to judge
  correctness or accuse anyone of error).
- **Frontend:** a single page with a disclaimer banner, three pre-loaded
  sample documents, a free-text input, and a plain-language output panel.
  A provider/API-key toggle (Anthropic vs. OpenAI, optional personal key) was
  added as a second, independent feature.
- **Data handling:** the prototype does not persist, log, or transmit
  uploaded documents beyond the active session. No real shopkeeper or CA
  data was used anywhere in building or testing this version — all sample
  documents are synthetic.
- **Why this architecture:** it needed to be demoable without any real
  third-party financial documents (none were available yet), which is why
  explainer-mode-on-synthetic-data was chosen as the buildable slice for
  this submission, with auditor mode (which *requires* real documents)
  deferred.

---

## 6. Scope Decisions and Why

Two modes were considered from the start: **Explainer** and **Auditor**.
Building both in the time available for this submission was deliberately
rejected, for two reasons:

1. **Risk of an unfinished demo.** Auditor mode requires real invoices and
   filings to be meaningful, which the team does not yet have access to
   (no CA or shopkeeper contacts have been established). Attempting it now
   would have produced a half-working feature instead of one solid one.
2. **A distinct compliance question.** Auditor mode would implicitly
   critique a licensed professional's (the CA's) filed work. Before that
   ships against real data, it needs: confidence-scored, "discrepancy not
   accusation" framing (to avoid defamation-adjacent claims about a real
   person's professional work); compliance with India's DPDP Act 2023 once
   real invoices/PII are involved; the CA's own consent before their work
   product is processed; and stronger liability terms before any real
   financial decision could ride on the tool's output. None of this blocks
   explainer mode on synthetic data, so it was tracked for later rather than
   treated as a blocker now.

---

## 7. Disclaimers and Limitations

> This prototype uses synthetic GST data for demonstration only. It is an AI
> explainer, not a compliance or audit tool, and does not replace a
> qualified Chartered Accountant.

Displayed in-app as:

> "This is an educational tool using sample data. It explains filings in
> plain language — it is not tax, legal, or financial advice. Always verify
> with a registered tax professional before acting."

Known limitations: LLM output can be wrong or incomplete; the tool has not
been tested against real filings; GST rules and rates change over time and
the model's knowledge may not reflect the latest changes.

---

## 8. Team Contributions

- **Aksh Juneja:** problem research, architecture, backend/API integration
  (LLM explainer route, prompt design), core UI, deployment, and this report.
- **Shruti Agnihotri:** provider/API-key toggle feature (frontend) — added a
  provider dropdown (Anthropic/OpenAI) and an optional API-key input to the
  explainer UI, wired through to the existing `/api/explain` route so the
  explainer can run against either provider with a user-supplied key.

Individual commits are visible in the GitHub history at the repository link
above.

---

## 9. Future Work

- Validate the problem with 2–3 real shopkeepers/CAs (not yet done).
- Build Auditor mode once real documents and the compliance prerequisites in
  Section 6 are in place.
- Expand language support (regional languages beyond English).
- Explore a B2B channel through CA firms as a client-transparency feature.

---

## 10. How to Run

```bash
git clone https://github.com/Aksh28/gst-saathi.git
cd gst-saathi
npm install
# create .env.local with: ANTHROPIC_API_KEY=your-key-here
npm run dev
```
Open http://localhost:3000.

---

## 11. Submission Checklist

- [x] GitHub repository (public): https://github.com/Aksh28/gst-saathi
- [x] Working prototype (v1 Explainer)
- [x] README with setup instructions
- [x] This report (`docs/REPORT.md`)
- [x] Internal design/scope doc (`docs/design-doc-v1.md`)
- [ ] Optional: a short screen-recording or screenshots of the app in use,
      if the submission format allows an attachment
