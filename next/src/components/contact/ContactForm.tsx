'use client';

import { useState } from 'react';
import Icon from '@/components/Icon';
import { site } from '@/content/site';
import { openWhatsApp, waLink } from '@/lib/whatsapp';

const focus = ['Residential Plot (5M, 10M, 1K, 2K)', 'Commercial Zone & Boulevard Strip', 'Turnkey Luxury Villa Construction', 'Sell My DHA Prism File / Plot', 'General Portfolio Realignment'];
const sectors = ['Open to Recommended S-Tier Block', 'Sector A & B (Possession Ready)', 'Sector C & D (Ring Road Strategic)', 'Sector J, K, L (Central Boulevard)', 'Sector Q & R (High Growth Vector)', 'Main Commercial Avenue Parcels'];
const budgets = [['Under 1.5 Cr', '5 Marla / Files'], ['1.5 – 3.0 Cr', '10M & 1K Mid'], ['3.0 – 5.0 Cr', '1K Corner/Park'], ['5.0 Cr+', 'Commercial / 2K']];
const modes = [['store', 'Office Visit & Map Review'], ['chat', 'WhatsApp Dossier'], ['phone_in_talk', 'Private Advisory Call']];

export default function ContactForm() {
  const [sent, setSent] = useState(false);
  const [waHref, setWaHref] = useState('');
  const [budget, setBudget] = useState(0);
  const [mode, setMode] = useState(0);
  const cls = 'rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-on-surface placeholder:text-slate-400 focus:border-[#d4af37] focus:outline-none focus:ring-4 focus:ring-[#d4af37]/15 w-full';
  const hero = (
    <div className="lg:col-span-5 flex flex-col gap-5">
      <span className="inline-flex items-center gap-2 self-start px-3 py-1 rounded-full bg-secondary-container/20 text-[#745c00] text-xs uppercase font-bold tracking-wider">
        Authorized DHA Phase 9 Advisory
      </span>
      <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-on-surface leading-tight">
        Let&apos;s Discuss Your <span className="text-secondary">Property Requirements</span>
      </h1>
      <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed">
        Visit our corporate office directly at DHA Phase 9 Prism Main Commercial Avenue, or schedule an in-depth
        portfolio review with our senior advisory team.
      </p>
      <div className="flex flex-col gap-3 mt-2">
        <span className="inline-flex items-center gap-2 text-sm font-bold text-on-surface">
          <Icon name="verified_user" className="text-xl text-secondary" /> 100% Direct File Diligence
        </span>
        <p className="text-xs text-on-surface-variant pl-7">Zero hidden premiums or duplicate allocations</p>
        <span className="inline-flex items-center gap-2 text-sm font-bold text-on-surface mt-2">
          <Icon name="calendar_month" className="text-xl text-secondary" /> Book Private Advisory Session
        </span>
      </div>
    </div>
  );

  const form = (
    <div className="lg:col-span-7">
      <div className="rounded-3xl bg-white border border-slate-200/80 shadow-xl p-6 sm:p-8">
        {sent ? (
          <div className="h-full min-h-[320px] flex flex-col items-center justify-center gap-4 text-center">
            <Icon name="check_circle" className="text-5xl text-secondary" />
            <p className="text-sm sm:text-base text-on-surface-variant max-w-md">
              Your consultation details are prepared for WhatsApp{' '}
              <strong className="text-on-surface">{site.phoneDisplay}</strong>. Send the pre-filled message and our
              Principal Prism Advisor will reply within 2 business hours.
            </p>
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#25D366] text-[#062b16] font-label-lg text-label-lg font-bold shadow-xl hover:scale-[1.02] transition-transform min-h-[44px]"
            >
              <Icon name="chat" className="text-lg" /> Open WhatsApp · {site.phoneDisplay}
            </a>
            <a
              href={site.phoneHref}
              className="text-xs font-semibold text-on-surface-variant hover:text-secondary transition-colors"
            >
              or call {site.phoneDisplay}
            </a>
          </div>
        ) : (
          <form
            className="flex flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              const d = new FormData(e.currentTarget);
              const msg = [
                'Hello Bin Suleman Real Estate & Builders, I would like to schedule a consultation from your website.',
                '',
                `Name: ${String(d.get('name') ?? '')}`,
                `Phone / WhatsApp: ${String(d.get('phone') ?? '')}`,
                `Property Focus: ${String(d.get('focus') ?? '')}`,
                `Sector / Block: ${String(d.get('sector') ?? '')}`,
                `Budget: ${budgets[budget][0]} (${budgets[budget][1]})`,
                `Preferred Discussion: ${modes[mode][1]}`,
                `Notes: ${String(d.get('notes') ?? '') || '-'}`,
              ].join('\n');
              setWaHref(waLink(msg));
              setSent(true);
              openWhatsApp(msg);
            }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input required name="name" placeholder="Full Name *" className={cls} />
              <input required name="phone" placeholder="Contact Phone / WhatsApp *" className={cls} />
            </div>
            <select name="focus" defaultValue="" required className={cls}>
              <option value="" disabled>Primary Property Focus</option>
              {focus.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
            <select name="sector" defaultValue="" required className={cls}>
              <option value="" disabled>Target Sector / Block</option>
              {sectors.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
            <div>
              <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wide mb-2">Allocated Budget Scope</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {budgets.map((b, i) => (
                  <button type="button" key={b[0]} onClick={() => setBudget(i)} className={`rounded-xl px-2 py-2.5 text-center text-[11px] font-bold transition-colors ${budget === i ? 'bg-slate-900 text-secondary-container' : 'bg-surface-container-low border border-slate-200 text-on-surface-variant hover:border-[#d4af37]'}`}>
                    <span className="block">{b[0]}</span>
                    <span className="block font-medium opacity-80">{b[1]}</span>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wide mb-2">Preferred Mode of Discussion</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {modes.map((m, i) => (
                  <button type="button" key={m[1]} onClick={() => setMode(i)} className={`rounded-xl px-3 py-2.5 text-xs font-bold flex items-center justify-center gap-2 transition-colors ${mode === i ? 'bg-slate-900 text-secondary-container' : 'bg-surface-container-low border border-slate-200 text-on-surface-variant hover:border-[#d4af37]'}`}>
                    <Icon name={m[0]} className="text-base" /> {m[1]}
                  </button>
                ))}
              </div>
            </div>
            <textarea name="notes" rows={3} placeholder="Plot Specifics or Construction Notes (Optional)" className={cls} />
            <p className="text-[11px] text-on-surface-variant flex items-start gap-2">
              <Icon name="shield" className="text-secondary text-base shrink-0 mt-0.5" />
              Institutional Integrity: No cold spam or persistent marketing calls. Only straightforward plot figures
              and verifiable DHA documentation.
            </p>
            <button type="submit" className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-gradient-to-r from-[#d4af37] to-[#e6ca65] text-[#0b1329] font-label-lg text-label-lg font-bold shadow-xl hover:scale-[1.02] transition-transform min-h-[44px]">
              Schedule Consultation on WhatsApp <Icon name="chat" className="text-lg" />
            </button>
          </form>
        )}
      </div>
    </div>
  );

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-10 sm:py-16 w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {hero}
        {form}
      </div>
    </section>
  );
}