# GhanaWatch

**Diaspora Trust & Verification Intelligence Platform** — the AI SaaS for Ghanaians abroad to verify every cedi, every document, and every brick of their investments back home.

## What problem this solves

Ghana received **GHS 7.79B in remittances in 2025** (6% of GDP, second largest in sub-Saharan Africa). A **Commonwealth Secretariat survey** found that **56% of diaspora Africans cite corruption and mismanagement as the #1 barrier** to investing back home. The Supreme Court has documented single land plots sold to as many as **13 different buyers**. Ghost construction, fake receipts, inflated funeral bills, and "auntie said it's all going well" stories drain billions of remittance value yearly.

Existing services (DiasporaBuild, Pencil Home, House of Diaspora, ToSi) are narrow agency-style providers — you hand over your project to them. **No one offers a forensic verification intelligence layer that works alongside whoever the diaspora user already trusts on the ground.**

That's GhanaWatch.

## Features

- **AI Document Forensics** — receipts, invoices, indentures, BoLs, permits scored for font consistency, pixel tampering, AI-generation probability, EXIF metadata integrity, duplicate-hash detection.
- **Geo-stamped Site Verification** — every photo GPS + time anchored, scene-matched against prior verified imagery.
- **Lands Commission Cross-Check** — surface overlapping title claims, stool consent gaps, surveyor authenticity.
- **Immutable Audit Ledger** — every event hash-chained; no retroactive edits.
- **Vetted Trustee Network** — licensed surveyors, QSs, lawyers, clearing agents, doctors, ag-extension officers dispatched in <72h.
- **Milestone Escrow** — funds release only on verified evidence + trustee attestation.
- **AI Investigator** — conversational forensic assistant grounded in Ghanaian agencies & norms.
- **Court-Admissible Evidence Packs** — sealed, hash-anchored PDFs for litigation / insurance / police.
- **Cross-sector**: real estate, construction, vehicle import, business, education, medical, funeral, agriculture, remittance.

## Tech stack

- Next.js 15 (App Router) + React 19
- TypeScript + Tailwind CSS
- Anthropic Claude (Sonnet 4.6 for the Investigator, Haiku 4.5 for forensic JSON)
- Vercel deployment

## Run locally

```bash
pnpm install
pnpm dev
# open http://localhost:3000
```

## Deploy to Vercel

1. Push this repository to GitHub.
2. In Vercel, click **New Project** → import the repo.
3. (Optional) Add `ANTHROPIC_API_KEY` in **Environment Variables** to enable live AI forensic reasoning. Without it, the platform runs in deterministic demo mode.
4. Deploy.

## Pages

- `/` — landing
- `/dashboard` — diaspora user dashboard
- `/projects` — portfolio
- `/projects/[id]` — project deep dive (docs, photos, milestones, ledger, trustee)
- `/verify` — standalone document verification engine
- `/investigator` — AI investigator chat
- `/network` — trustee network
- `/sectors` — sector coverage
- `/research` — the evidence base

## License

Demo / prototype. Adapt freely.
