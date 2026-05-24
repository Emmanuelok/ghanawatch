import Anthropic from "@anthropic-ai/sdk";

export function getAnthropic(): Anthropic | null {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return null;
  return new Anthropic({ apiKey: key });
}

export const SYSTEM_PROMPT = `You are GhanaWatch AI Investigator — a forensic-grade assistant for Ghanaians in the diaspora trying to verify investments, projects, and transactions being managed by relatives, friends, contractors, or agents back home in Ghana.

You always assume the user lives outside Ghana, sending money for: real estate purchase, construction, vehicle import, business setup, education, medical care, funerals, agriculture, or general remittance. Your job is to help them detect fraud, verify documents, validate site progress, and build an evidence chain.

Always:
- Be specific about Ghana: agencies (Lands Commission, GRA, MoFA, KEEDA, GLC), regions, Cedi (GHS), and local realities (stool/family land, customs at Tema, Korle Bu Teaching Hospital, etc.).
- Be skeptical but fair — point out red flags and what verification would resolve them.
- Recommend concrete next steps: documents to demand, trustees to engage, cross-checks to run.
- Be concise. Use short paragraphs and bullet points. Cite GhanaWatch features the user can engage (Trustee dispatch, Document forensics, Site verification, Audit ledger, Land registry cross-check, Milestone escrow).
- Never make up document forensics scores — if the user hasn't provided evidence, ask for it.

If a user describes a worrying scenario, draft (a) red flags, (b) verification plan, (c) immediate protective actions.`;

// Deterministic fallback "AI" for demo without an API key.
export function offlineInvestigatorReply(userMessage: string): string {
  const msg = userMessage.toLowerCase();
  const sections: string[] = [];

  if (msg.includes("land") || msg.includes("plot") || msg.includes("title") || msg.includes("indenture")) {
    sections.push(`### Red flags to watch on Ghana land deals
- **Stool / family land sold by one person** — these almost always require collective consent; demand a Council of Elders resolution.
- **No site plan stamped by a licensed surveyor** — every legitimate Ghana parcel has one.
- **Seller refuses Lands Commission cross-check** — this is the most common signal of a double-sale scheme (cases on record of 1 plot sold to 13 buyers).
- **Power of attorney without notarisation or apostille** — fake POAs are the #1 vector used against diaspora buyers.

### Verification plan
1. Run a Lands Commission search (parcel reference + boundary coordinates).
2. Engage a GhanaWatch licensed surveyor (Akua Yawson, Esi Ofori) for boundary + title due diligence.
3. Cross-check seller's prior transactions for duplicate signatures.
4. Lock the deal under milestone escrow until title registration is anchored.

### Immediate protective actions
- Freeze any further payment.
- Demand original indenture for forensic upload.
- Open a forensic case from your dashboard.`);
  } else if (msg.includes("build") || msg.includes("construction") || msg.includes("house") || msg.includes("home") || msg.includes("cement")) {
    sections.push(`### Construction red flags
- **Receipts from one phone, one handwriting** — vendors should issue diverse receipts.
- **Progress photos with stripped EXIF** — legitimate phones embed time + GPS by default.
- **Material quantities not matching BOQ stage** — e.g. 45 bags of cement for blockwork at first-floor stage is unusual.
- **Cash payments above GHS 5,000** — push everything through traceable channels.

### Verification plan
1. Upload every receipt to Document Forensics — we check font, vendor pattern, duplicate hashes.
2. Require all site photos via the GhanaWatch app (geo-stamped, hash-anchored).
3. Schedule a Trustee QS visit at every milestone boundary (we recommend Kojo Owusu for Greater Accra/Central/Eastern).
4. Release funds only via milestone escrow — never lump-sum.

### Immediate actions
- Pause the next disbursement.
- Request the BOQ rev. that matches today's stage.
- Dispatch a trustee for an unscheduled visit.`);
  } else if (msg.includes("car") || msg.includes("vehicle") || msg.includes("tema") || msg.includes("customs") || msg.includes("duty")) {
    sections.push(`### Vehicle import red flags
- **Duty quoted without GRA HS code calculation** — GRA publishes a transparent duty calculator; any agent dodging it is suspect.
- **'Penalty' fees with no GRA receipt** — every penalty has a serialised GRA receipt with QR.
- **VIN not matching Bill of Lading** — the most common substitution scam.
- **Clearing agent without GRA Customs ID** — verify license # against the Customs Division registry.

### Verification plan
1. Cross-match VIN on shipping doc, GRA portal, and dashboard photo.
2. Run duty receipt through Document Forensics (we anchor against GRA's stamp pattern).
3. Confirm clearing agent is on the GRA whitelist (we maintain a copy).
4. Require a yard photo with VIN visible before final payment.

### Immediate actions
- Demand the GRA Duty Calculation Worksheet.
- Hold final payment until vehicle is photographed with VIN clear.`);
  } else if (msg.includes("hospital") || msg.includes("medical") || msg.includes("korle") || msg.includes("surgery") || msg.includes("sick")) {
    sections.push(`### Medical bill red flags
- **Round-number bills with no itemisation** — Ghanaian teaching hospitals issue itemised bills.
- **Pressure to pay outside the hospital cashier** — never. Always pay via the official cashier or portal.
- **Body release ransom** — discuss with hospital social work; document everything.
- **Drugs purchased outside the hospital pharmacy at inflated prices** — flag for comparison.

### Verification plan
1. Cross-check every receipt against the hospital's official receipt format (we hold templates).
2. Engage a Medical Care Coordinator trustee (Dr. Nana Akoto) for ward visits + receipt validation.
3. Push payments directly to the hospital cashier where possible.

### Immediate actions
- Request itemised bill in PDF.
- Dispatch a trustee for a same-day ward visit.`);
  } else if (msg.includes("business") || msg.includes("shop") || msg.includes("invest")) {
    sections.push(`### Business / venture red flags
- **No vendor invoices for stock** — demand the supplier's GRA TIN on every invoice.
- **Auntie/uncle handling everything alone** — rotate trustee audits.
- **Rent receipts without a landlord letterhead** — always a flag in Ghana.
- **Cash takings 'spent on running costs'** — require daily till photos via the app.

### Verification plan
1. Upload all rent + supplier docs to Document Forensics.
2. Schedule monthly trustee audits (mystery shopper + books inspection).
3. Mirror the till to a daily SMS / WhatsApp ledger.`);
  } else if (msg.includes("funeral")) {
    sections.push(`### Funeral cost red flags
- **Inflated mortuary fees** — published fee schedule exists; demand the printed list.
- **Caterer + canopy receipts without phone-confirmable contacts** — call every vendor.
- **'Family levy' with no record of contributors** — require a contributor ledger.

### Verification plan
1. Upload the mortuary, canopy, casket, and catering invoices to Document Forensics.
2. Engage a local trustee to attend planning meetings and audit the contributor ledger.
3. Pay each vendor directly via mobile money traceable to their MoMo merchant ID.`);
  } else {
    sections.push(`### How I can help
I'm GhanaWatch's AI Investigator. Tell me what's going on — for example:
- "My brother is building a house in Kasoa and the receipts look strange."
- "I'm about to buy a plot in East Legon Hills, what do I check?"
- "My clearing agent says duty went up by GHS 8,000 last minute — is that normal?"
- "Auntie hasn't sent photos of the shop fit-out in 3 weeks."

I'll draft red flags, a verification plan, and the immediate actions you should take — grounded in Ghanaian agencies and norms.`);
  }

  sections.push(`---
*Demo mode — set ANTHROPIC_API_KEY in your Vercel project to enable live AI forensic reasoning.*`);
  return sections.join("\n\n");
}
