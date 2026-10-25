# GST Saathi — Internal Design Doc (v1, Submission Night)

Compiled by Donna (COO) from Aniket's v1 spec and Harvey's compliance read, 2026-10-25, under a same-night course deadline. This is a tight one-pager by design, not the full venture-grade doc — that follows once Aksh has bandwidth post-submission.

## 1. Problem & Evidence
Small shopkeepers in India depend entirely on their accountant (CA) to file GST, with no independent way to verify the filing. Bengaluru study: 77% of small businesses rely fully on their CA with no verification mechanism; ITC (Input Tax Credit) reconciliation is their single hardest pain point. Existing tools (ClearTax, Zoho, Tally) solve *filing* for the CA — nobody solves "can the shopkeeper trust what was just filed in their name."

## 2. Target User
A small shopkeeper who files GST through a CA and cannot read or verify the filing themselves.

## 3. V1 Scope — Built Tonight
- **Explainer only.** Takes a GST filing and produces a plain-language explanation via LLM (Anthropic/OpenAI), reusing the chat API pattern from the `legitimix-mvp` repo.
- **2–3 pre-loaded synthetic sample GST documents.** No live upload, no live parsing — this de-risks the demo per Aniket's call.
- **No real shopkeeper or CA data used anywhere in this build.**
- Disclaimer banner present in UI and report (text below).

## 4. Explicitly Out of Scope Tonight
- Auditor mode (cross-checking a CA's filing against the shopkeeper's actual invoices).
- Live document upload / parsing of arbitrary real filings.
- Any ingestion of real third-party financial data.

Aniket's call, and the right one: bundling both modes tonight is scope creep that breaks the demo. Explainer is the whole deliverable.

## 5. V2 Roadmap — Auditor Mode (Not Tonight)
Cross-check the CA's filing against the shopkeeper's real invoices, flag discrepancies (overbilling, missed ITC claims, errors). Per Harvey, before this ships with real data it needs:
- Confidence-scoring and "discrepancy not accusation" framing — raw defamation/professional-critique exposure otherwise, since the tool is effectively critiquing a licensed CA's work product.
- DPDP Act 2023 compliance once real invoices are involved — consent and purpose limitation obligations.
- The CA's own consent before their work product is processed by the tool.
- E&O-style liability caps and stronger ToS before any real financial decision rides on the tool's output.

None of this blocks tonight. All of it blocks auditor mode going anywhere near a real shopkeeper or real money.

## 6. Compliance Language — Going In Tonight, Verbatim (Harvey)
**UI banner:**
> "This is an educational tool using sample data. It explains filings in plain language — it is not tax, legal, or financial advice. Always verify with a registered tax professional before acting."

**Report:**
> "This prototype uses synthetic GST data for demonstration only. It is an AI explainer, not a compliance or audit tool, and does not replace a qualified Chartered Accountant."

**README data-handling line:**
> "This prototype does not persist, log, or transmit uploaded documents beyond the active session. No real shopkeeper or CA data should be used with this version."

## 7. Risks
**Tonight — none rated as blockers.** Both Aniket and Harvey returned clean. Residual risk is generic LLM-output-accuracy, mitigated by the disclaimer above.

**Post-submission / v2 — tracked, not urgent tonight:**
- Defamation / professional-critique exposure once auditor mode critiques a CA's work.
- DPDP Act 2023 obligations the moment real invoices enter the system.
- Financial-harm liability if a wrong explanation drives a real decision.
- CA consent requirement before their filings are processed by auditor mode.

## 8. Open Items — Carried to Post-Submission Session
- Aksh has zero real CA/shopkeeper contacts. First real-world task once tonight is done.
- Teammate's actual skillset and whether they're bought in on the long-term commercialization angle, or here for the grade only — not yet confirmed.
- Course requirements for the rest of the term beyond tonight's ad hoc submission — unknown.
- Full multi-section design doc and Aniket's complete requirements breakdown — deferred to when there's breathing room.

## 9. Process Note
Louis has not reviewed this document. It is being compiled and shipped under an explicit deadline exception at Aksh's and the coordinator's direction. Flagging for retroactive review once tonight's submission is in — do not treat this doc as having cleared the normal review gate.
