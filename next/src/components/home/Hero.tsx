/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { site } from '@/content/site';

export default function Hero() {
  return (
    <section className="relative w-full min-h-screen min-h-[100svh] min-h-[100dvh] overflow-hidden bg-[#080d1a] text-white flex flex-col items-center justify-center">
      {/* Soft radial glow behind the logo */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-[#fed65b]/10 rounded-full blur-[120px] sm:w-[50vw] sm:h-[50vw]" />
      </div>

      {/* Architectural arched doorway watermark — CSS only, low-opacity gold */}
      <div
        className="absolute inset-0 z-0 pointer-events-none select-none"
        style={{
          backgroundImage: `
            radial-gradient(
              circle at 50% 30px,
              transparent 20px,
              rgba(254, 214, 91, 0.045) 21px,
              rgba(254, 214, 91, 0.045) 23px,
              transparent 24px
            ),
            linear-gradient(to right, rgba(254, 214, 91, 0.035) 1px, transparent 1px)
          `,
          backgroundSize: '140px 240px',
        }}
      />

      {/* Thin gold frame inset 12-20px with L-shaped corner brackets */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <div className="absolute inset-3 sm:inset-4 md:inset-5 border border-[#fed65b]/35">
          {/* L-shaped corner brackets */}
          <span className="absolute -top-[1px] -left-[1px] w-7 h-7 border-t border-l border-[#fed65b]" />
          <span className="absolute -top-[1px] -right-[1px] w-7 h-7 border-t border-r border-[#fed65b]" />
          <span className="absolute -bottom-[1px] -left-[1px] w-7 h-7 border-b border-l border-[#fed65b]" />
          <span className="absolute -bottom-[1px] -right-[1px] w-7 h-7 border-b border-r border-[#fed65b]" />
        </div>
      </div>

      {/* Hero content */}
      <div className="relative z-20 flex flex-col items-center text-center px-4 sm:px-6 pt-[100px] sm:pt-[120px] pb-[96px]">
        {/* Logo */}
        <div className="relative mb-6 sm:mb-8">
          <div className="absolute inset-0 bg-[#fed65b]/15 blur-[48px] rounded-full scale-90 pointer-events-none" />
          <img
            src={site.logo}
            alt="Bin Suleman Real Estate & Builders Emblem"
            className="relative w-[90px] sm:w-[110px] md:w-[130px] lg:w-[150px] h-auto object-contain mx-auto drop-shadow-[0_12px_24px_rgba(0,0,0,0.7)]"
          />
        </div>

        {/* Tagline */}
        <p className="text-xs sm:text-sm font-semibold tracking-[0.26em] uppercase text-[#fed65b]/90 mb-5 sm:mb-7">
          WE BUILD YOUR DREAMS.
        </p>

        {/* H1 */}
        <h1
          className="font-extrabold tracking-tight text-white leading-tight mb-7 sm:mb-9"
          style={{
            fontFamily: 'Manrope, sans-serif',
            fontSize: 'clamp(2.25rem, 6vw, 4.5rem)',
            letterSpacing: '0.02em',
            wordSpacing: '0.1em',
          }}
        >
          BIN SULEMAN
          <br />
          REAL ESTATE
        </h1>

        {/* Gold gradient button */}
        <Link
          href="/listings"
          className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#FED65B] to-[#c9a43a] text-[#0b1329] font-bold uppercase tracking-[0.08em] shadow-xl shadow-[#d4af37]/30 hover:scale-105 hover:shadow-[#d4af37]/50 transition-all duration-300 min-h-[44px]"
        >
          EXPLORE LUXURY LISTINGS
        </Link>
      </div>
    </section>
  );
}