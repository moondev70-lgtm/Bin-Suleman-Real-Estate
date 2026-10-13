'use client';

import { useState } from 'react';
import Icon from '@/components/Icon';
import { site } from '@/content/site';
import { openWhatsApp, waLink } from '@/lib/whatsapp';

const perks = ['Daily WhatsApp PDF Rate Card', 'Real-Time Possession Alerts', 'Direct Owner Sell Mandates', 'No Broker Spam Policy'];
const sectors = [
  'All Sectors (Full Phase 9 Master Sheet)',
  'Sector A, B, C & D (Prime Possession Focus)',
  'Sector E, F, G & H (10 Marla & 1 Kanal)',
  'Sector J, K & L (Mid-Term Value Growth)',
  'Commercial Boulevard Zone (4 & 8 Marla)',
  'Sector Q & R (High Leverage Investment Files)',
];

export default function BlogNewsletter() {
  const [sent, setSent] = useState(false);
  const [waHref, setWaHref] = useState('');
  const cls = 'rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-on-surface placeholder:text-slate-400 focus:border-[#d4af37] focus:outline-none focus:ring-4 focus:ring-[#d4af37]/15';
  return (
    <section className="w-full bg-[#0a101d] text-white py-12 sm:py-20 border-y border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div className="flex flex-col gap-5">
          <span className="inline-flex items-center gap-2 self-start px-3 py-1 rounded-full bg-secondary-container/20 text-secondary-container text-xs uppercase font-bold tracking-wider">
            <Icon name="verified_user" className="text-base" /> Zero Speculation • Verified Rates Only
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold leading-tight">
            Get Daily DHA Phase 9 Prism Plot <span className="text-secondary-container">Rate Sheets</span> Sent
            Directly to You
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Join over 4,800+ overseas investors and verified DHA property owners who receive our morning trading
            bulletin: confirmed deal prices across Sectors A through R, commercial auction notices, and raw land file
            trends.
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {perks.map((p) => (
              <li key={p} className="flex items-center gap-2 text-xs sm:text-sm text-slate-200">
                <Icon name="check_circle" className="text-secondary-container text-base shrink-0" /> {p}
              </li>
            ))}
          </ul>
          <p className="text-xs text-slate-400">Choose Your Preferred Dispatch Channel — Instant WhatsApp PDF broadcast or morning email intelligence digest.</p>
        </div>
        <div className="rounded-2xl bg-white p-6 sm:p-8 text-on-surface shadow-2xl">
          {sent ? (
            <div className="h-full min-h-[260px] flex flex-col items-center justify-center gap-4 text-center">
              <Icon name="check_circle" className="text-5xl text-secondary" />
              <p className="text-sm text-on-surface-variant max-w-sm">
                Your subscription request is prepared for WhatsApp{' '}
                <strong className="text-on-surface">{site.phoneDisplay}</strong>. Send the pre-filled message and your
                first Phase 9 Prism rate sheet arrives tomorrow morning.
              </p>
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#25D366] text-[#062b16] font-label-lg text-label-lg font-bold shadow-xl hover:scale-[1.02] transition-transform min-h-[44px]"
              >
                <Icon name="chat" className="text-lg" /> Open WhatsApp · {site.phoneDisplay}
              </a>
            </div>
          ) : (
            <form
              className="flex flex-col gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                const d = new FormData(e.currentTarget);
                const msg = [
                  'Hello Bin Suleman Real Estate & Builders, please add me to your daily DHA Phase 9 Prism rate sheet broadcast.',
                  '',
                  `Name: ${String(d.get('name') ?? '')}`,
                  `WhatsApp Number: ${String(d.get('whatsapp') ?? '')}`,
                  `Email: ${String(d.get('email') ?? '') || '-'}`,
                  `Primary Sector of Interest: ${String(d.get('sector') ?? '')}`,
                ].join('\n');
                setWaHref(waLink(msg));
                setSent(true);
                openWhatsApp(msg);
              }}
            >
              <input required name="name" placeholder="Full Name" className={cls} />
              <input required name="whatsapp" placeholder="WhatsApp Number" className={cls} />
              <input name="email" placeholder="Email Address (Optional)" className={cls} />
              <select name="sector" defaultValue="" required className={cls}>
                <option value="" disabled>Primary Sector of Interest</option>
                {sectors.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <button type="submit" className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-gradient-to-r from-[#d4af37] to-[#e6ca65] text-[#0b1329] font-label-lg text-label-lg font-bold shadow-xl hover:scale-[1.02] transition-transform min-h-[44px]">
                <Icon name="chat" className="text-lg" /> Subscribe to Daily Rate Sheet on WhatsApp
              </button>
              <p className="text-[11px] text-on-surface-variant flex items-center gap-1">
                🔒 We respect your privacy. No marketing unsolicited calls. Direct advisory only.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}