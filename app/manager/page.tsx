import { ManagerBotPreview } from "./manager-client";
import { Smartphone } from "lucide-react";

export const metadata = { title: "Manager Bot — GhanaWatch" };

export default function ManagerPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-10">
      <div>
        <div className="flex items-center gap-2 text-[12px] uppercase tracking-[0.14em] text-ink-muted">
          <Smartphone className="h-3 w-3" /> The ground side
        </div>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">How the manager submits — via WhatsApp.</h1>
        <p className="mt-1 max-w-2xl text-[14px] text-ink-dim">
          GhanaWatch doesn't make your brother / contractor / aunt download a new app. They talk to
          the <strong className="text-ink">GhanaWatch bot</strong> on WhatsApp like a normal person.
          The bot extracts receipts, geo-stamps photos, asks the right follow-up questions, and
          drops verified evidence into your project ledger.
        </p>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_1fr]">
        <ManagerBotPreview />

        <div className="space-y-4">
          <Card title="How it works on the ground">
            <Step n="1" title="One-tap WhatsApp link">
              You invite your manager from the project page. They get a WhatsApp link — no app install.
            </Step>
            <Step n="2" title="Conversational evidence capture">
              Receipts, site photos, vendor invoices, voice notes — the bot accepts everything and
              auto-routes it to the right milestone.
            </Step>
            <Step n="3" title="Forensic vetting before it hits your ledger">
              Every submission runs through document forensics + GPS / scene checks before the
              diaspora user even sees it. Anomalies get a follow-up question on WhatsApp.
            </Step>
            <Step n="4" title="Trustee shadowing">
              Random or alert-triggered trustee visits validate what the manager submitted. Manager
              never knows when a trustee is coming.
            </Step>
          </Card>
          <Card title="What the bot does silently">
            <Bullet>Parses receipt amount + vendor with OCR + Claude vision</Bullet>
            <Bullet>Verifies the receipt against the project's BOQ stage</Bullet>
            <Bullet>Compares price against the regional benchmark</Bullet>
            <Bullet>Pulls EXIF GPS from every photo — flags anything off-parcel</Bullet>
            <Bullet>Scene-matches photos against prior verified site images</Bullet>
            <Bullet>Checks vendor MoMo merchant ID resolves to a real account</Bullet>
            <Bullet>Hash-anchors every submission to the project's audit ledger</Bullet>
            <Bullet>Asks polite clarifying questions if anything looks off — in English, Twi or Pidgin</Bullet>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card p-5">
      <div className="mb-3 text-[14px] font-semibold">{title}</div>
      <div className="space-y-3 text-[13px] text-ink-dim">{children}</div>
    </div>
  );
}

function Step({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-3">
      <div className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-accent-gold/15 text-[11px] font-semibold text-accent-gold">{n}</div>
      <div>
        <div className="text-[13px] font-semibold text-ink">{title}</div>
        <div className="mt-0.5 text-[12px]">{children}</div>
      </div>
    </div>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2">
      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent-gold" />
      <span>{children}</span>
    </div>
  );
}
