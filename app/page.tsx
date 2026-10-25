"use client";

import { useState } from "react";

type SampleDoc = {
  id: string;
  label: string;
  text: string;
};

const SAMPLE_DOCS: SampleDoc[] = [
  {
    id: "gstr3b",
    label: "Sample GSTR-3B summary (monthly return)",
    text: `GSTR-3B Summary Return
GSTIN: 29ABCDE1234F1Z5
Legal Name: Sri Ganesh General Store
Return Period: September 2026

3.1 Outward Supplies
Taxable Value: Rs. 4,85,000
IGST: Rs. 0
CGST: Rs. 43,650
SGST: Rs. 43,650

4. Eligible ITC (Input Tax Credit)
ITC Available (CGST): Rs. 31,200
ITC Available (SGST): Rs. 31,200
ITC Available (IGST): Rs. 8,400

5. Net Tax Payable
CGST Payable: Rs. 12,450
SGST Payable: Rs. 12,450
IGST Payable: Rs. 0
Total Tax Paid in Cash: Rs. 24,900

Filed by: R. Subramanian & Co, Chartered Accountants
Filing Date: 18-10-2026`,
  },
  {
    id: "invoice",
    label: "Sample B2B purchase invoice",
    text: `TAX INVOICE
Invoice No: INV-2026-0914
Date: 12-09-2026
Seller: Shree Wholesale Traders, GSTIN 29AAAAA0000A1Z1
Buyer: Sri Ganesh General Store, GSTIN 29ABCDE1234F1Z5

Item: Packaged Groceries (HSN 2106)
Taxable Value: Rs. 60,000
CGST @ 9%: Rs. 5,400
SGST @ 9%: Rs. 5,400
Total Invoice Value: Rs. 70,800

Payment Terms: 30 days
Place of Supply: Karnataka`,
  },
  {
    id: "notice",
    label: "Sample GST department notice",
    text: `GOODS AND SERVICES TAX DEPARTMENT
Reference: ASMT-10 Notice
GSTIN: 29ABCDE1234F1Z5
Subject: Discrepancy in return filed for August 2026

On scrutiny of the return filed under section 61, a mismatch of Rs. 7,250 has been
noticed between the ITC claimed in GSTR-3B and the ITC reflected in GSTR-2B for the
said tax period. The taxpayer is directed to explain the discrepancy or pay the
differential tax along with applicable interest within 15 days of this notice.`,
  },
];

const PROVIDERS = [
  { id: "anthropic", label: "Anthropic (Claude)" },
  { id: "openai", label: "OpenAI (GPT)" },
] as const;

export default function Home() {
  const [text, setText] = useState("");
  const [explanation, setExplanation] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [provider, setProvider] = useState<(typeof PROVIDERS)[number]["id"]>("anthropic");
  const [apiKey, setApiKey] = useState("");

  async function handleExplain() {
    setError(null);
    setExplanation(null);
    setLoading(true);
    try {
      const res = await fetch("/api/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, provider, apiKey: apiKey.trim() || undefined }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
      } else {
        setExplanation(data.explanation);
      }
    } catch {
      setError("Could not reach the server. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col flex-1 items-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 py-12 sm:px-10">
        <header className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            GST Saathi
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Paste a GST filing, invoice, or notice below and get a plain-language
            explanation of what it means for your business.
          </p>
        </header>

        <section className="flex flex-col gap-2 rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            AI provider
          </span>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <select
              value={provider}
              onChange={(e) => setProvider(e.target.value as (typeof PROVIDERS)[number]["id"])}
              className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
            >
              {PROVIDERS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Optional: use your own API key instead of the server's"
              className="flex-1 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
            />
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-500">
            Your key is sent directly with the request and is never stored or logged.
          </p>
        </section>

        <div className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200">
          This is an educational tool using sample data. It explains filings in
          plain language — it is not tax, legal, or financial advice. Always
          verify with a registered tax professional before acting.
        </div>

        <section className="flex flex-col gap-2">
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Try a sample document
          </span>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_DOCS.map((doc) => (
              <button
                key={doc.id}
                type="button"
                onClick={() => {
                  setText(doc.text);
                  setExplanation(null);
                  setError(null);
                }}
                className="rounded-full border border-zinc-300 px-3 py-1.5 text-sm text-zinc-700 transition-colors hover:border-zinc-500 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
              >
                {doc.label}
              </button>
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-2">
          <label htmlFor="doc-text" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            GST filing / invoice / notice text
          </label>
          <textarea
            id="doc-text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={10}
            placeholder="Paste the text of your GST filing, invoice, or notice here, or pick a sample above..."
            className="w-full rounded-lg border border-zinc-300 bg-white p-3 font-mono text-sm text-zinc-900 outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
          />
          <button
            type="button"
            onClick={handleExplain}
            disabled={loading || !text.trim()}
            className="self-start rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
          >
            {loading ? "Explaining..." : "Explain this in plain language"}
          </button>
        </section>

        {error && (
          <div className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
            {error}
          </div>
        )}

        {explanation && (
          <section className="flex flex-col gap-2 rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              In plain language
            </h2>
            <p className="whitespace-pre-wrap text-zinc-800 dark:text-zinc-200">
              {explanation}
            </p>
          </section>
        )}

        <footer className="mt-auto pt-6 text-xs text-zinc-500 dark:text-zinc-500">
          GST Saathi is a student prototype (v1: explainer). It does not audit,
          verify, or certify any filing — a future version may add that as a
          separate, clearly-labeled feature.
        </footer>
      </main>
    </div>
  );
}
