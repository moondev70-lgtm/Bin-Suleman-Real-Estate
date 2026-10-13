'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { site } from '@/content/site';

/**
 * Faithful port of the original top bar + sticky pill nav logic:
 * - bar gains weight after 24px scroll, emblem condenses
 * - gold reading-progress line
 * - sticky nav engages at 320px, shows on scroll-up / hides on scroll-down,
 *   placeholder keeps layout stable, desktop-only +10px gap, inline `top`
 *   applied only while sticky (desktop bugfix) — identical to the site today
 */
export default function SiteHeader() {
  const pathname = usePathname();
  const barRef = useRef<HTMLDivElement>(null);
  const spacerRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement | null>(null);
  const navphRef = useRef<HTMLDivElement>(null);
  const progRef = useRef<HTMLSpanElement>(null);
  const navRefCB = (el: HTMLElement | null) => { navRef.current = el; };
  useEffect(() => {
    const bar = barRef.current;
    const spacer = spacerRef.current;
    const navwrap = navRef.current;
    const navph = navphRef.current;
    const prog = progRef.current;
    if (!bar || !spacer || !navwrap) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const desk = window.matchMedia('(min-width: 640px)');
    /* Nav sits flush against the fixed bar (no gap) */
    const GAP = 0;
    const syncSpacer = () => {
      spacer.style.height = bar.offsetHeight + (desk.matches ? GAP : 0) + 'px';
    };
    /* M2 - sliding gold indicator (desktop pointers only, never on touch) */
    const pill = document.getElementById('bsr-navpill');
    const nav = pill ? pill.querySelector('nav') : null;
    const cleanups: Array<() => void> = [];
    if (!reduce && pill && nav && window.matchMedia('(hover:hover) and (pointer:fine)').matches) {
      const navind = document.createElement('span');
      navind.className = 'bsr-navind';
      navind.setAttribute('aria-hidden', 'true');
      nav.appendChild(navind);
      const move = (a: Element) => {
        navind.style.width = (a as HTMLElement).offsetWidth + 'px';
        navind.style.transform = 'translateX(' + (a as HTMLElement).offsetLeft + 'px)';
        navind.style.opacity = '1';
      };
      const over = (e: Event) => {
        const t = e.target as HTMLElement;
        const a = t.closest ? t.closest('a') : null;
        if (a) move(a);
      };
      const leave = () => { navind.style.opacity = '0'; };
      nav.addEventListener('pointerover', over);
      nav.addEventListener('focusin', over);
      nav.addEventListener('pointerleave', leave);
      cleanups.push(() => {
        nav.removeEventListener('pointerover', over);
        nav.removeEventListener('focusin', over);
        nav.removeEventListener('pointerleave', leave);
      });
    }
    /* S1 + S2 + S3 - rAF-throttled scroll loop (original logic) */
    let last: boolean | null = null;
    let prevY = 0;
    let ticking = false;
    let stickLast = false;
    let navH = 0;
    const measureNav = () => {
      const was = navwrap.classList.contains('bsr-sticky');
      if (was) navwrap.classList.remove('bsr-sticky');
      navH = navwrap.offsetHeight;
      if (navph) navph.style.height = navH + 'px';
      if (was) navwrap.classList.add('bsr-sticky');
    };
    measureNav();
    syncSpacer();
    if (navph) navph.style.display = 'none';
    const frame = () => {
      ticking = false;
      const y = window.pageYOffset || document.documentElement.scrollTop || 0;
      const on = y > 24;
      if (on !== last) {
        bar.classList.toggle('bsr-scrolled', on);
        syncSpacer();
        last = on;
      }
      if (prog) {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        prog.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, y / max) : 0) + ')';
      }
      const stick = y > 320;
      /* inline top only while sticky (or on mobile, preserving its current look) */
      if (stick || !desk.matches) {
        navwrap.style.top = bar.offsetHeight + 'px';
      } else if (navwrap.style.top) {
        navwrap.style.top = '';
      }
      if (stick !== stickLast) {
        navwrap.classList.toggle('bsr-sticky', stick);
        if (navph) {
          navph.style.display = stick ? 'block' : 'none';
          navph.style.height = navH + 'px';
        }
        stickLast = stick;
      }
      if (stick) {
        if (y < prevY - 2) navwrap.classList.add('bsr-show');
        else if (y > prevY + 2) navwrap.classList.remove('bsr-show');
      } else {
        navwrap.classList.remove('bsr-show');
      }
      prevY = y;
    };
    const onScroll = () => {
      if (!ticking) { ticking = true; requestAnimationFrame(frame); }
    };
    const onResize = () => { measureNav(); syncSpacer(); frame(); };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });
    window.addEventListener('load', onResize);
    frame();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('load', onResize);
      cleanups.forEach((fn) => fn());
    };
  }, []);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <>
      <div
        ref={barRef}
        id="bsr-topbar"
        className="fixed top-0 inset-x-0 z-50 w-full bg-[#080d1a]/95 backdrop-blur-md border-b border-[#fed65b]/25"
      >
        <div className="bsr-bar-inner max-w-7xl mx-auto flex items-center justify-between gap-3 px-3 sm:px-6 py-2">
          <Link
            href="/"
            className="flex items-center gap-2 sm:gap-3 min-w-0"
            aria-label="Bin Suleman Real Estate & Builders - Home"
          >
            <span className="bsr-logo-wrap shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                id="bsr-emblem"
                alt="BSR Golden Emblem"
                className="h-5 sm:h-6 w-auto object-contain shrink-0 filter drop-shadow"
                src={site.logo}
              />
            </span>
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#fed65b] whitespace-nowrap">
              <span className="bsr-sheen">Bin Suleman</span>{' '}
              <span className="hidden sm:inline text-slate-200 font-medium">{site.brandSuffix}</span>
            </span>
          </Link>
          <a
            className="bsr-call inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold text-[#fed65b] hover:text-white transition-colors shrink-0"
            href={site.phoneHref}
          >
            <span id="bsr-callicon" className="material-symbols-outlined text-sm sm:text-base">
              call
            </span>
            <span className="whitespace-nowrap">{site.phoneDisplay}</span>
          </a>
        </div>
        <span ref={progRef} id="bsr-progress" aria-hidden="true" />
      </div>
      {/* spacer compensating the fixed bar (height synced by the scroll loop) */}
      <div ref={spacerRef} id="bsr-topspacer" className="h-10 w-full" aria-hidden="true" />
      <header ref={navRefCB} id="bsr-navwrap" className="relative z-40 w-full">
        <div
          id="bsr-navpill"
          className="w-full bg-[#080d1a]/95 backdrop-blur-md border-b border-[#fed65b]/25 px-3 sm:px-6 py-1.5 max-w-full overflow-x-auto scrollbar-none pointer-events-auto flex items-center justify-center"
        >
          <nav className="flex flex-wrap items-center justify-center gap-x-0.5 gap-y-1.5 sm:flex-nowrap sm:gap-1 whitespace-nowrap">
            {site.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? 'page' : undefined}
                className={
                  isActive(item.href)
                    ? 'inline-flex items-center gap-1.5 px-3 py-2 text-[11px] sm:text-xs font-bold text-[#fed65b] shrink-0'
                    : 'inline-flex items-center gap-1.5 px-3 py-2 text-[11px] sm:text-xs font-semibold text-slate-300 hover:text-[#fed65b] transition-colors shrink-0'
                }
              >
                {item.label}
                {item.href === '/listings' && (
                  <span className="bsr-navdot" aria-hidden="true" />
                )}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <div ref={navphRef} id="bsr-navph" aria-hidden="true" />
    </>
  );
}