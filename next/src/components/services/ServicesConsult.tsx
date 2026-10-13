'use client';

import { useState } from 'react';
import Icon from '@/components/Icon';
import { site } from '@/content/site';
import { openWhatsApp, waLink } from '@/lib/whatsapp';

const focus = [
  'Residential Plot Purchase (A to R)',
  'Commercial Plots (4M / 8M)',
  'Architectural Planning & Construction',
  'Legal Transfer & Surcharge Auditing',
];
const residency = [
  'Resident Pakistani (Active Filer)',
  'Resident Pakistani (Non-Filer)',
  'Overseas Pakistani (NICOP / POC)',
  'Institutional / Corporate Entity',
];

export default function ServicesConsult() {
  const [sent, setSent] = useState(false);
  const [waHref, setWaHref] = useState('');
  const cls =
    'rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-on-surface placeholder:text-slate-400 focus:border-[#d4af37] focus:outline-none focus:ring-4 focus:ring-[#d4af37]/15';
  return (
    <section id="booking-section" className="w-full bg-[#0a101d] text-white py-12 sm:py-20 border-y border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-5 flex flex-col gap-5">
          <span className="inline-flex items-center gap-2 self-start px-3 py-1 rounded-full bg-secondary-container/20 text-secondary-container text-xs uppercase font-bold tracking-wider">
            1-on-1 Executive Consultation
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold leading-tight">
            Schedule Your DHA Phase 9 Prism <span className="text-secondary-container">Site Briefing</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Meet our senior acquisition partners at our Main Boulevard Prism office or connect via private
            Zoom/WhatsApp conference for overseas expatriates.
          </p>
          <div className="flex flex-col gap-3 mt-2">
            <div className="flex items-start gap-3">
              <Icon name="pin_drop" className="text-secondary-container text-xl mt-0.5" />
              <div><p className="text-sm font-bold">Physical HQ</p><p className="text-xs text-slate-400">Suite 104, Main Commercial Boulevard, DHA 9 Prism, Lahore</p></div>
            </div>
            <div className="flex items-start gap-3">
              <Icon name="call" className="text-secondary-container text-xl mt-0.5" />
              <div><p className="text-sm font-bold">Direct Line</p><p className="text-xs text-slate-400">{site.phoneDisplay}</p></div>
            </div>
            <a
              href={waLink('Hello! I have a question about your DHA Phase 9 Prism advisory services.')}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3 hover:opacity-80 transition-opacity"
            >
              <Icon name="chat" className="text-secondary-container text-xl mt-0.5" />
              <div><p className="text-sm font-bold">Fast Response Desk</p><p className="text-xs text-slate-400">Instant WhatsApp Concierge → {site.whatsappDisplay}</p></div>
            </a>
          </div>
          <p className="flex items-start gap-2 text-xs text-slate-400 border-t border-white/10 pt-4">
            <Icon name="verified_user" className="text-secondary-container text-base shrink-0" />
            All inquiries are bound by non-disclosure investor privacy agreements.
          </p>
        </div>
        <div className="lg:col-span-7">
          <div className="rounded-2xl bg-white p-6 sm:p-8 text-on-surface shadow-2xl">
            {sent ? (
              <div className="h-full min-h-[300px] flex flex-col items-center justify-center gap-4 text-center">
                <Icon name="check_circle" className="text-5xl text-secondary" />
                <p className="text-sm sm:text-base text-on-surface-variant max-w-md leading-relaxed">
                  Your advisory docket is prepared for WhatsApp{' '}
                  <strong className="text-on-surface">{site.phoneDisplay}</strong>. Send the pre-filled message and a
                  DHA 9 Prism lead partner will respond within 2 business hours.
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
                    'Hello Bin Suleman Real Estate & Builders, I am submitting a direct plot advisory request from your website.',
                    '',
                    `Name: ${String(d.get('name') ?? '')}`,
                    `Phone / WhatsApp: ${String(d.get('phone') ?? '')}`,
                    `Service Focus: ${String(d.get('service') ?? '')}`,
                    `Investor Residency: ${String(d.get('residency') ?? '')}`,
                    `Sector / Budget Preferences: ${String(d.get('notes') ?? '') || '-'}`,
                  ].join('\n');
                  setWaHref(waLink(msg));
                  setSent(true);
                  openWhatsApp(msg);
                }}
              >
                <div>
                  <h3 className="text-lg sm:text-xl font-bold">Direct Plot Advisory Request</h3>
                  <p className="text-xs text-on-surface-variant mt-1">
                    Submit your plot specifications and an authorized Bin Suleman senior partner will contact you with
                    verified map allocations within 2 business hours.
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input required name="name" placeholder="Full Name" className={cls} />
                  <input required name="phone" placeholder="Phone / WhatsApp" className={cls} />
                </div>
                <select name="service" defaultValue="" required className={cls}>
                  <option value="" disabled>Service Focus</option>
                  {focus.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
                <select name="residency" defaultValue="" required className={cls}>
                  <option value="" disabled>Investor Residency</option>
                  {residency.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
                <textarea name="notes" rows={3} placeholder="Specific Sector / Budget Preferences" className={cls} />
                <button type="submit" className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-gradient-to-r from-[#d4af37] to-[#e6ca65] text-[#0b1329] font-label-lg text-label-lg font-bold shadow-xl hover:scale-[1.02] transition-transform min-h-[44px]">
                  Transmit Advisory Request on WhatsApp <Icon name="chat" className="text-lg" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}