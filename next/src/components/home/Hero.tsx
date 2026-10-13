/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import Icon from '@/components/Icon';
import { site } from '@/content/site';
import { waLink } from '@/lib/whatsapp';

const stats = [
  { value: '15+', label: 'Years Prism Advisory' },
  { value: '1,200+', label: 'Verified Investors' },
  { value: '100%', label: 'NDC Clean Title' },
  { value: 'PKR 48B+', label: 'Managed Volume' },
];

export default function Hero() {
  return (
    <section className="relative w-full overflow-hidden bg-[#0a101d] text-white pt-28 sm:pt-36 lg:pt-40 pb-16 sm:pb-24 border-b border-secondary/20">
      <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
        <img
          src="/images/img-22-ab6axucpsm4v.jpg"
          alt="DHA Phase 9 Prism Monument Gate"
          className="w-full h-full object-cover object-center opacity-30 md:opacity-40 filter brightness-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a101d] via-[#0a101d]/75 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a101d] via-[#0a101d]/85 to-transparent" />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 flex flex-col justify-between">
        <div className="max-w-3xl flex flex-col gap-4 sm:gap-6 mt-2 sm:mt-6">
          <div className="flex items-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-secondary-container/40 shadow-inner">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary-container opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary-container" />
              </span>
              <Icon name="verified" className="text-secondary-container text-sm" />
              <span className="text-[11px] sm:text-xs text-secondary-container uppercase tracking-wider font-bold">
                Authorized Direct Real Estate
              </span>
              <span className="text-[11px] sm:text-xs text-slate-200 font-medium">• DHA Phase 9 Prism</span>
            </div>
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight sm:leading-[1.15]">
            Buying property is a big decision.
            <br />
            <span className="bg-gradient-to-r from-secondary-fixed via-secondary-container to-secondary-fixed-dim bg-clip-text text-transparent">
              Let&apos;s make it an informed one.
            </span>
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-slate-200 max-w-2xl leading-relaxed font-normal">
            Explore DHA Phase 9 Prism with an institutional advisory team that helps you analyze genuine plot
            values, inspect on-ground contours, and execute secure official transfers.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-gradient-to-r from-[#d4af37] to-[#e6ca65] text-[#0b1329] font-label-lg text-label-lg font-bold shadow-xl hover:scale-105 transition-transform min-h-[44px]"
            >
              <Icon name="calendar_month" className="text-xl" />
              Plan Office Visit
            </Link>
            <a
              href={waLink('Hello! I would like to speak with a Bin Suleman advisor about DHA Phase 9 Prism.')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white font-label-lg text-label-lg font-semibold hover:bg-white/20 transition-colors min-h-[44px]"
            >
              <Icon name="chat" className="text-xl text-secondary-container" />
              <span>
                Speak with an Advisor<span className="hidden sm:inline"> · {site.phoneDisplay}</span>
              </span>
            </a>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mt-10 sm:mt-16">
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 px-4 py-4 sm:px-5 sm:py-5">
              <p className="text-2xl sm:text-3xl font-extrabold text-secondary-container font-[Manrope]">{s.value}</p>
              <p className="text-[11px] sm:text-xs text-slate-300 uppercase tracking-wider font-semibold mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}