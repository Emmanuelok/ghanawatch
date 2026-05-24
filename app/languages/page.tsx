"use client";
import { useState } from "react";
import { Languages, Check, MessageCircle, ScanFace, Banknote } from "lucide-react";

type Lang = "en" | "tw" | "ga" | "ee" | "ha" | "pidgin";

const LANG_META: Record<Lang, { label: string; flag: string; speakers: string }> = {
  en: { label: "English", flag: "🇬🇧", speakers: "Official" },
  tw: { label: "Twi (Akan)", flag: "🇬🇭", speakers: "~9.1M speakers" },
  ga: { label: "Ga", flag: "🇬🇭", speakers: "~750K speakers" },
  ee: { label: "Ewe", flag: "🇬🇭", speakers: "~3.6M speakers" },
  ha: { label: "Hausa", flag: "🇬🇭🇳🇬", speakers: "~70M speakers (regional)" },
  pidgin: { label: "Ghanaian Pidgin", flag: "🇬🇭", speakers: "Widely understood" },
};

const SAMPLES: Record<string, Record<Lang, string>> = {
  welcome: {
    en: "Welcome back, Akosua. You're watching 8 projects across 6 regions.",
    tw: "Akwaaba bio, Akosua. Wohwɛ nnwuma 8 wɔ ɔman ho 6 mu.",
    ga: "Mli baa nyɛɛnyɛɛ, Akosua. Onyɛɛ nitsumɔi 8 yɛ kpɛŋ 6 mli.",
    ee: "Woezɔ ŋutɔ, Akosua. Èle dɔwɔnu 8 nu kpɔm le nuto 6 me.",
    ha: "Maraba da dawowa, Akosua. Kana kallon ayyuka 8 a yankuna 6.",
    pidgin: "Welcome back, Akosua. You dey watch 8 projects for 6 regions.",
  },
  alert: {
    en: "Off-site photo detected. The photo is 1.18 km from the registered parcel.",
    tw: "Mfonin a ɛnnyɛ baabi a wɔafa ho ahuhu. Mfonin no firi asaase no anim km 1.18.",
    ga: "Adesa fɔto a nɔ taoolɛ ko. Fɔto lɛ jɛ shɔŋŋ lɛ tɛŋŋ km 1.18 yɛ.",
    ee: "Wo de dze ƒe foto si mete kple anyigba la o. Foto la le agbɔ km 1.18 tso anyigba la gbɔ.",
    ha: "An gano hoto a ƙetare wurin. Hoton yana da nisan 1.18 km daga shafin da aka rajista.",
    pidgin: "We catch one photo wey no dey for the right place. The photo dey 1.18 km from your real plot.",
  },
  release: {
    en: "Milestone 4 verified by trustee. GHS 140,000 released from escrow.",
    tw: "Trustee no abɔ nsoroma 4 anwena. GHS 140,000 afiri escrow mu apue.",
    ga: "Trustee lɛ etsɔɔ ŋkpamɔ 4 lɛ. GHS 140,000 ekũ kɛjɛ escrow.",
    ee: "Trustee la kpɔ nukpɔnu 4 dzi da. GHS 140,000 dzo le escrow me.",
    ha: "Trustee ya tabbatar da Milestone 4. An sake GHS 140,000 daga escrow.",
    pidgin: "Trustee don check Milestone 4. GHS 140,000 don comot from escrow.",
  },
};

export default function LanguagesPage() {
  const [lang, setLang] = useState<Lang>("tw");

  return (
    <div className="mx-auto max-w-5xl px-5 py-10">
      <div>
        <div className="flex items-center gap-2 text-[12px] uppercase tracking-[0.14em] text-ink-muted">
          <Languages className="h-3 w-3" /> Localisation
        </div>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">Speak the language your family speaks.</h1>
        <p className="mt-1 max-w-2xl text-[14px] text-ink-dim">
          Critical alerts in Twi, mediation notes in Ewe, manager-bot prompts in Pidgin. The
          diaspora user reads in English; the manager on the ground reads in their language. We
          translate at send-time and verify with native reviewers.
        </p>
      </div>

      <div className="mt-8 grid gap-2 md:grid-cols-3 lg:grid-cols-6">
        {(Object.keys(LANG_META) as Lang[]).map((l) => (
          <button
            key={l}
            onClick={() => setLang(l)}
            className={`card card-hover p-4 text-left ${lang === l ? "border-accent-gold/60" : ""}`}
          >
            <div className="flex items-center gap-2">
              <span className="text-[20px]">{LANG_META[l].flag}</span>
              <div className="min-w-0">
                <div className="truncate text-[13px] font-semibold">{LANG_META[l].label}</div>
                <div className="truncate text-[10px] text-ink-muted">{LANG_META[l].speakers}</div>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-8 space-y-4">
        <Sample icon={ScanFace} title="Welcome screen" en={SAMPLES.welcome.en} translated={SAMPLES.welcome[lang]} lang={lang} />
        <Sample icon={MessageCircle} title="Critical alert (WhatsApp / SMS)" en={SAMPLES.alert.en} translated={SAMPLES.alert[lang]} lang={lang} />
        <Sample icon={Banknote} title="Milestone release notification" en={SAMPLES.release.en} translated={SAMPLES.release[lang]} lang={lang} />
      </div>

      <div className="mt-10 card p-6">
        <div className="mb-2 text-[14px] font-semibold">How we ensure quality</div>
        <ul className="space-y-1.5 text-[13px] text-ink-dim">
          <li className="flex items-start gap-2"><Check className="mt-0.5 h-3.5 w-3.5 text-accent-green" /> Native-speaker translators review every template change.</li>
          <li className="flex items-start gap-2"><Check className="mt-0.5 h-3.5 w-3.5 text-accent-green" /> Manager-side messages auto-translate to the manager's selected language.</li>
          <li className="flex items-start gap-2"><Check className="mt-0.5 h-3.5 w-3.5 text-accent-green" /> Trustee notes auto-translate to English in the diaspora user's view.</li>
          <li className="flex items-start gap-2"><Check className="mt-0.5 h-3.5 w-3.5 text-accent-green" /> Twi, Ewe, Ga, Hausa, Dagbani, Frafra, Pidgin currently shipping.</li>
        </ul>
      </div>
    </div>
  );
}

function Sample({ icon: Icon, title, en, translated, lang }: any) {
  return (
    <div className="card p-5">
      <div className="mb-3 flex items-center gap-2">
        <Icon className="h-4 w-4 text-accent-gold" />
        <div className="text-[14px] font-semibold">{title}</div>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded-md border border-line bg-bg-elev/40 p-3">
          <div className="text-[10px] uppercase tracking-[0.12em] text-ink-muted">🇬🇧 English</div>
          <div className="mt-1 text-[13px] text-ink">{en}</div>
        </div>
        <div className="rounded-md border border-accent-gold/30 bg-accent-gold/5 p-3">
          <div className="text-[10px] uppercase tracking-[0.12em] text-ink-muted">{LANG_META[lang as keyof typeof LANG_META]?.flag} {LANG_META[lang as keyof typeof LANG_META]?.label}</div>
          <div className="mt-1 text-[13px] text-ink">{translated}</div>
        </div>
      </div>
    </div>
  );
}
