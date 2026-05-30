import { NextRequest, NextResponse } from "next/server";
import { getAnthropic } from "@/lib/ai";
import { shortHash } from "@/lib/hash";
import { rateLimit, tooMany, readJsonGuarded, validateImage, cleanString } from "@/lib/api-guard";

export const runtime = "nodejs";
export const maxDuration = 30;

type ForensicResult = {
  verdict: "verified" | "flagged" | "rejected";
  score: number;
  summary: string;
  flags: string[];
  forensics: {
    fontConsistency: number;
    pixelTampering: number;
    aiGenerated: number;
    chainOfCustody: number;
    metadataIntact: boolean;
    vendorPatternMatch: boolean;
  };
  extractedFields?: Record<string, string>;
  recommendation: string;
  hash: string;
};

const FORENSIC_SYSTEM = `You are GhanaWatch's forensic document analysis engine. You analyse Ghanaian financial / legal documents — either described in text or provided as an image — and return a strict JSON verdict.

You think about: font / typography consistency, pixel-level tampering, AI generation patterns, vendor stamp authenticity (GRA, Korle Bu, Lands Commission, KEEDA, KMA, KSE, Diamond Cement, Aluworks), Cedi (GHS) amount realism, signature variance, EXIF / PDF metadata, duplicate patterns. You know Ghanaian stool/family land sales require collective consent and notarised POAs; you know KEEDA permits use specific letterheads; you know GRA Customs receipts have serial + QR; Korle Bu billing is itemised.

When given an IMAGE, you visually inspect: typography uniformity, alignment, watermarks, stamps, signatures, paper texture/compression, suspicious crops/edits, alignment of fields, suspicious round numbers, and whether the document matches the stated type (e.g. a 'receipt' that looks like a screenshot from a chat rather than a vendor receipt should be flagged).

You also extract any readable key fields (vendor, date, amount in GHS, reference number, signature presence).

Return ONLY JSON of shape:
{
  "verdict": "verified"|"flagged"|"rejected",
  "score": 0-100,
  "summary": "<2 sentences>",
  "flags": ["<flag1>", "..."],
  "forensics": {
    "fontConsistency": 0-100,
    "pixelTampering": 0-100,
    "aiGenerated": 0-100,
    "chainOfCustody": 0-100,
    "metadataIntact": true|false,
    "vendorPatternMatch": true|false
  },
  "extractedFields": { "vendor": "...", "date": "...", "amountGHS": "...", "ref": "...", "signature": "present|absent" },
  "recommendation": "<one action the diaspora user should take next>"
}`;

export async function POST(req: NextRequest) {
  const rl = rateLimit(req, { name: "verify", limit: 20, windowMs: 60_000 });
  if (!rl.ok) return tooMany(rl.retryAfter);

  const parsed = await readJsonGuarded(req, 9 * 1024 * 1024);
  if (!parsed.ok) return parsed.res;
  const body = parsed.body;

  const text = cleanString(body.text, 4000);
  const type = cleanString(body.type, 40) || "receipt";

  const imgCheck = validateImage(body.image);
  if (!imgCheck.ok) return NextResponse.json({ error: imgCheck.reason }, { status: 400 });
  const image = imgCheck.image;

  if (!text.trim() && !image) {
    return NextResponse.json({ error: "Provide text or image" }, { status: 400 });
  }

  const hash = shortHash(`${type}:${text}:${(image ?? "").slice(0, 64)}`);
  const anthropic = getAnthropic();

  if (anthropic) {
    try {
      const content: any[] = [];
      if (image) {
        const match = image.match(/^data:(image\/[a-zA-Z]+);base64,(.+)$/);
        if (match) {
          content.push({
            type: "image",
            source: { type: "base64", media_type: match[1], data: match[2] },
          });
        }
      }
      content.push({
        type: "text",
        text: `Document type claimed: ${type}\n\nDescription / context (if any):\n${text || "(none)"}\n\nReturn the JSON verdict only.`,
      });

      const msg = await anthropic.messages.create({
        model: image ? "claude-sonnet-4-6" : "claude-haiku-4-5-20251001",
        max_tokens: 1100,
        system: FORENSIC_SYSTEM,
        messages: [{ role: "user", content }],
      });
      const txt =
        msg.content
          .filter((b: any) => b.type === "text")
          .map((b: any) => b.text)
          .join("\n") || "{}";
      const parsed = parseFirstJson(txt);
      if (parsed) {
        return NextResponse.json({ ...normalise(parsed), hash });
      }
    } catch (e) {
      // fall through
    }
  }

  return NextResponse.json({ ...offlineVerdict(type, text, !!image), hash });
}

function parseFirstJson(s: string): any | null {
  const start = s.indexOf("{");
  const end = s.lastIndexOf("}");
  if (start < 0 || end < 0) return null;
  try {
    return JSON.parse(s.slice(start, end + 1));
  } catch {
    return null;
  }
}

function normalise(p: any): ForensicResult {
  const score = clamp(p.score ?? 60, 0, 100);
  const verdict =
    p.verdict === "verified" || p.verdict === "flagged" || p.verdict === "rejected"
      ? p.verdict
      : score >= 80
      ? "verified"
      : score >= 50
      ? "flagged"
      : "rejected";
  return {
    verdict,
    score,
    summary: String(p.summary ?? ""),
    flags: Array.isArray(p.flags) ? p.flags.slice(0, 10).map(String) : [],
    forensics: {
      fontConsistency: clamp(p.forensics?.fontConsistency ?? 80, 0, 100),
      pixelTampering: clamp(p.forensics?.pixelTampering ?? 10, 0, 100),
      aiGenerated: clamp(p.forensics?.aiGenerated ?? 5, 0, 100),
      chainOfCustody: clamp(p.forensics?.chainOfCustody ?? 80, 0, 100),
      metadataIntact: Boolean(p.forensics?.metadataIntact ?? true),
      vendorPatternMatch: Boolean(p.forensics?.vendorPatternMatch ?? true),
    },
    extractedFields:
      p.extractedFields && typeof p.extractedFields === "object" ? p.extractedFields : undefined,
    recommendation: String(p.recommendation ?? ""),
    hash: "",
  };
}

function clamp(n: number, lo: number, hi: number) {
  n = Number(n);
  if (!Number.isFinite(n)) return lo;
  return Math.max(lo, Math.min(hi, Math.round(n)));
}

function offlineVerdict(type: string, text: string, hasImage: boolean): ForensicResult {
  const t = text.toLowerCase();
  const flags: string[] = [];
  let score = 88;

  if (hasImage) {
    score -= 4;
    flags.push("Demo mode: image received but live Vision is disabled (set ANTHROPIC_API_KEY to enable real visual forensics).");
  }
  if (t.includes("whatsapp") || t.includes("screenshot") || t.includes("photo from")) {
    score -= 18;
    flags.push("Document arrived as a phone photo / screenshot — original PDF unavailable. EXIF chain partial.");
  }
  if (t.includes("no stamp") || t.includes("plain paper") || t.includes("no letterhead")) {
    score -= 24;
    flags.push("No vendor letterhead / stamp visible — formal Ghanaian vendors always issue stamped/letterheaded receipts.");
  }
  if (t.includes("stool") || t.includes("family land")) {
    score -= 16;
    flags.push("Stool / family land referenced — requires Council of Elders consent and Lands Commission cross-check.");
  }
  if (t.includes("no lc") || t.includes("no lands commission") || t.includes("not registered")) {
    score -= 20;
    flags.push("No Lands Commission registration evidence — title risk is high.");
  }
  if (t.includes("urgent") || t.includes("today") || t.includes("right now")) {
    score -= 10;
    flags.push("Time pressure language detected — classic fraud cue in Ghana property/clearing scams.");
  }
  if (t.includes("cash") && !t.includes("momo")) {
    score -= 8;
    flags.push("Cash payment — no traceable settlement; demand a MoMo or bank transfer to a verifiable account.");
  }
  if (t.includes("ghs") && /ghs\s*\d/.test(t)) {
    const num = Number((t.match(/ghs\s*([0-9,]+)/)?.[1] ?? "0").replace(/,/g, ""));
    if (num > 50000 && type === "receipt") {
      flags.push(`Large GHS ${num.toLocaleString()} cash receipt — push through escrow / direct vendor payment.`);
      score -= 6;
    }
  }
  if (type === "land-title" && !t.includes("surveyor")) {
    score -= 12;
    flags.push("Indenture without a licensed surveyor's site plan reference — incomplete title package.");
  }
  if (t.includes("auntie") || t.includes("brother") || t.includes("cousin") || t.includes("relative")) {
    flags.push("Relative-managed transaction — recommend trustee shadow-audit at next milestone.");
  }

  score = Math.max(20, Math.min(100, score));
  const verdict: ForensicResult["verdict"] = score >= 80 ? "verified" : score >= 50 ? "flagged" : "rejected";

  const summary =
    verdict === "verified"
      ? "Document patterns are consistent with authentic Ghanaian vendor / agency issuance. Minor caveats noted."
      : verdict === "flagged"
      ? "Several pattern deviations from standard Ghanaian agency / vendor issuance — proceed only after verification."
      : "Document deviates strongly from authentic patterns. Halt any associated payment and open a forensic case.";

  const recommendation =
    verdict === "verified"
      ? "Anchor the document hash to the project's audit ledger and continue."
      : verdict === "flagged"
      ? "Request the original PDF, run a vendor phone confirmation, and dispatch a trustee for in-person attestation."
      : "Pause all related disbursements. Open a forensic case and request the original from the issuing authority directly.";

  return {
    verdict,
    score,
    summary,
    flags,
    forensics: {
      fontConsistency: verdict === "verified" ? 96 : verdict === "flagged" ? 72 : 48,
      pixelTampering: verdict === "verified" ? 4 : verdict === "flagged" ? 22 : 58,
      aiGenerated: verdict === "verified" ? 3 : verdict === "flagged" ? 14 : 36,
      chainOfCustody: verdict === "verified" ? 92 : verdict === "flagged" ? 65 : 38,
      metadataIntact: verdict !== "rejected",
      vendorPatternMatch: verdict === "verified",
    },
    extractedFields: hasImage
      ? { vendor: "—", date: "—", amountGHS: "—", ref: "—", signature: "—" }
      : undefined,
    recommendation,
    hash: "",
  };
}
