'use client';

import { useState } from 'react';
import Icon from '@/components/Icon';
import { site } from '@/content/site';
import { openWhatsApp, waLink } from '@/lib/whatsapp';

const interested = [
  '1 Kanal Residential (Sector A, B, C, D)',
  '10 Marla Residential (Sector D, J, K)',
  '5 Marla Residential (Sector J, K, R)',
  '4 or 8 Marla Commercial (CCA 1 / 2)',
  'Turnkey Villa Construction',
];
const residency = [
  'Resident Pakistani (Lahore / Outstation)',
  'Overseas Pakistani (UK / Europe)',
  'Overseas Pakistani (Gulf / UAE / KSA)',
  'Overseas Pakistani (USA / Canada)',
];

export default function HomeConsult() {
  const [sent, setSent] = useState(false);
  const [waHref, setWaHref] = useState('');
  return (
    <section
      id="consultation-desk"
      className="relative bg-[#0c1322] text-on-primary py-12 sm:py-20 w-full overflow-hidden border-y border-white/10"
    >
      <div
        className="absolute inset-0 w-full h-full pointer-events-none opacity-20 bg-cover bg-center"
        style={{ backgroundImage: `url('${site.poster}')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0c1322] via-[#0c1322]/90 to-[#0c1322]" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="bg-white/5 backdrop-blur-2xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 border border-white/10 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            <div className="lg:col-span-5 flex flex-col gap-5">
              <div className="inline-flex items-center gap-2 self-start px-3 py-1 rounded-full bg-secondary-container/20 text-secondary-container text-xs uppercase font-bold tracking-wider">
                <span className="w-2 h-2 rounded-full bg-secondary-container" />
                <span>Prism Corporate Advisory Suite</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight">
                Let&apos;s discuss your next step in <span className="text-secondary-container">DHA Phase 9.</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Whether you are an overseas Pakistani planning a future residence, or an institutional investor
                seeking high-growth files, our direct consultants are ready to assist.
              </p>
              <div className="bg-white/10 p-4 rounded-xl flex flex-col gap-2 border border-white/10">
                <div className="flex items-center gap-2 text-secondary-container">
                  <Icon name="apartment" className="text-xl" />
                  <span className="text-sm font-bold">Bin Suleman RE Executive Office</span>
                </div>
                <p className="text-xs text-slate-300">Suite 104, Main Commercial Boulevard, DHA Phase 9 Prism, Lahore.</p>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 pt-1 text-xs text-white">
                  <span><strong>Hotline:</strong> {site.phoneDisplay}</span>
                  <span className="hidden sm:inline">•</span>
                  <span>Mon–Sat (10am – 7pm PKT)</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={site.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-[#25D366] text-[#062b16] text-xs sm:text-sm font-bold hover:scale-105 transition-transform min-h-[44px]"
                >
                  <Icon name="chat" className="text-lg" /> Instant WhatsApp Desk
                </a>
                <a
                  href={waLink('Hello! I would like to speak with a Bin Suleman advisory partner about DHA Phase 9 Prism.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-white/10 border border-white/20 text-white text-xs sm:text-sm font-semibold hover:bg-white/20 transition-colors min-h-[44px]"
                >
                  <Icon name="chat" className="text-lg text-secondary-container" /> Call Advisory · {site.phoneDisplay}
                </a>
              </div>
            </div>
            <div className="lg:col-span-7">
              {sent ? (
                <div className="h-full min-h-[320px] flex flex-col items-center justify-center gap-4 text-center rounded-2xl border border-white/10 bg-white/5 p-8">
                  <Icon name="check_circle" className="text-5xl text-secondary-container" />
                  <p className="text-sm sm:text-base text-white max-w-md leading-relaxed">
                    Your inquiry is prepared for WhatsApp{' '}
                    <strong className="text-secondary-container">{site.phoneDisplay}</strong>. Send the pre-filled
                    message and our senior Phase 9 Prism consultant desk will reply shortly.
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
                    className="text-xs font-semibold text-slate-300 hover:text-secondary-container transition-colors"
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
                      'Hello Bin Suleman Real Estate & Builders, I would like to book a private consultation from your website.',
                      '',
                      `Name: ${String(d.get('name') ?? '')}`,
                      `Phone / WhatsApp: ${String(d.get('phone') ?? '')}`,
                      `Interested In: ${String(d.get('interest') ?? '')}`,
                      `Residency: ${String(d.get('residency') ?? '')}`,
                      `Notes: ${String(d.get('notes') ?? '') || '-'}`,
                    ].join('\n');
                    setWaHref(waLink(msg));
                    setSent(true);
                    openWhatsApp(msg);
                  }}
                >
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-white">Book Private Consultation</h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Fill in your requirements. Our Senior Specialist will reply within 30 minutes.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input required name="name" placeholder="Your Full Name" className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-secondary-container focus:outline-none" />
                    <input required name="phone" placeholder="Phone / WhatsApp" className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-secondary-container focus:outline-none" />
                  </div>
                  <select name="interest" defaultValue="" required className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300 focus:border-secondary-container focus:outline-none">
                    <option value="" disabled>Interested In</option>
                    {interested.map((o) => <option key={o} className="text-on-surface" value={o}>{o}</option>)}
                  </select>
                  <select name="residency" defaultValue="" required className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300 focus:border-secondary-container focus:outline-none">
                    <option value="" disabled>Investor Residency</option>
                    {residency.map((o) => <option key={o} className="text-on-surface" value={o}>{o}</option>)}
                  </select>
                  <textarea
                    name="notes"
                    rows={3}
                    placeholder="Specific Questions or Preferred Sector"
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-secondary-container focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-gradient-to-r from-[#d4af37] to-[#e6ca65] text-[#0b1329] font-label-lg text-label-lg font-bold shadow-xl hover:scale-[1.02] transition-transform min-h-[44px]"
                  >
                    Submit Consultation on WhatsApp
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}