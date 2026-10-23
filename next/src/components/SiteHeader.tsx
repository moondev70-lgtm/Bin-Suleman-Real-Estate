'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { site } from '@/content/site';

/**
 * Top bar with sticky scroll logic. The original horizontal nav pill has been
 * replaced by a highlighted, floating hamburger menu (top right). All nav
 * links now live inside an overlay drawer opened from that button. The top
 * bar (logo + phone) is kept intact.
 */
export default function SiteHeader() {
  const pathname = usePathname();
  const barRef = useRef<HTMLDivElement>(null);
  const spacerRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement | null>(null);
  const navphRef = useRef<HTMLDivElement>(null);
  const progRef = useRef<HTMLSpanElement>(null);
  const navRefCB = (el: HTMLElement | null) => { navRef.current = el; };
  const [menuOpen, setMenuOpen] = useState(false);
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [menuOpen]);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <>
      <div
        ref={barRef}
        id="bsr-topbar"
        className={
          pathname === '/'
            ? 'absolute top-0 left-0 right-0 z-50 w-full bg-[#080D1A]/90 backdrop-blur-md border-b border-[#fed65b]/25 px-7 sm:px-9 pt-4'
            : 'fixed top-0 inset-x-0 z-50 w-full bg-[#080D1A] border-b border-[#fed65b]/25'
        }
      >
        <div className="bsr-bar-inner max-w-7xl mx-auto flex items-center justify-between gap-3 px-3 sm:px-6 py-1">
          <Link
            href="/"
            className="flex items-center gap-2 sm:gap-3 min-w-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#fed65b]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent rounded"
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
            <span className="flex flex-col leading-tight">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#fed65b] whitespace-nowrap">
                BIN SULEMAN
              </span>
              <span className="text-[8px] sm:text-[9px] font-medium uppercase tracking-[0.2em] text-white/70 whitespace-nowrap">
                REAL ESTATE &amp; BUILDERS
              </span>
            </span>
          </Link>
          {/* Floating hamburger menu — round, gold border, top right */}
          <button
            ref={hamburgerRef}
            id="bsr-hamburger"
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen}
            className="relative z-[60] shrink-0 w-10 h-10 rounded-full border border-[#fed65b]/40 bg-transparent flex flex-col items-center justify-center gap-1 hover:border-[#fed65b] hover:scale-105 transition-all duration-300 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#fed65b]/60"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <span className="w-5 h-[1.5px] bg-[#fed65b] rounded-full block transition-transform duration-300" style={{ transform: menuOpen ? 'rotate(45deg) translate(2px, 2px)' : 'none' }} />
            <span className="w-5 h-[1.5px] bg-[#fed65b] rounded-full block transition-opacity duration-300" style={{ opacity: menuOpen ? 0 : 1 }} />
            <span className="w-5 h-[1.5px] bg-[#fed65b] rounded-full block transition-transform duration-300" style={{ transform: menuOpen ? 'rotate(-45deg) translate(2px, -2px)' : 'none' }} />
          </button>
        </div>
        <span ref={progRef} id="bsr-progress" aria-hidden="true" />
      </div>
      {/* spacer compensating the fixed bar (height synced by the scroll loop) */}
      <div ref={spacerRef} id="bsr-topspacer" className="h-10 w-full" aria-hidden="true" />
      <header ref={navRefCB} id="bsr-navwrap" className="relative z-40 w-full">
        {/* Hamburger drawer overlay — replaces the horizontal nav pill */}
        {menuOpen && (
          <div
            className="fixed inset-0 z-[70] bg-[#080d1a]/98 backdrop-blur-xl flex flex-col items-center justify-center gap-8 sm:gap-12"
            role="dialog"
            aria-modal="true"
            onClick={() => setMenuOpen(false)}
          >
            <button
              aria-label="Close navigation menu"
              className="absolute top-6 right-6 z-10 w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen(false);
              }}
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
            <nav className="flex flex-col items-center gap-4 sm:gap-6 text-center">
              {site.nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                  className="text-xl sm:text-2xl font-bold text-white hover:text-[#fed65b] transition-colors block"
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                  {item.href === '/listings' && <span className="ml-2 text-[#fed65b]">●</span>}
                </Link>
              ))}
            </nav>
            <div className="flex gap-6 sm:gap-8">
              <a
                href={site.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#fed65b] text-[#0b1329] font-bold hover:bg-[#ffe088] transition-colors"
              >
                <span className="material-symbols-outlined text-lg">chat</span>
                WhatsApp
              </a>
            </div>
          </div>
        )}
      </header>
      <div ref={navphRef} id="bsr-navph" aria-hidden="true" />
    </>
  );
}

