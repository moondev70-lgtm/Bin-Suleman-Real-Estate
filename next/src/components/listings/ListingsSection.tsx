'use client';

import { useState, useEffect } from 'react';

import {
  listings as staticListings,
  phase5Listings as staticPhase5,
  formatPKR,
  scheduleOf,
} from '@/content/listings';
import { site } from '@/content/site';
import { useListings } from '@/hooks/useListings';
import { parseDisplayDate } from '@/lib/format';
import type { PublicListing } from '@/lib/listings';
import ListingDetailModal from '@/components/listings/ListingDetailModal';

/** Photo header at the top of a card (renders nothing when there are no photos). */
function CardPhotos({ photos, alt }: { photos: string[]; alt: string }) {
  if (!photos.length) return null;
  return (
    <div className="relative -mx-6 sm:-mx-7 -mt-6 sm:-mt-7 mb-6 overflow-hidden rounded-t-3xl bg-slate-100">
      <img src={photos[0]} alt={alt} loading="lazy" className="w-full h-44 sm:h-52 object-cover" />
      {photos.length > 1 && (
        <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/65 text-white font-label-caps text-label-caps uppercase tracking-wider">
          +{photos.length - 1} photos
        </span>
      )}
    </div>
  );
}

/** One pricing-style plot card (mirrors the design mock). */
function ListingCard({ listing, onOpen }: { listing: PublicListing & { demand: number }; onOpen: (e?: React.MouseEvent<HTMLElement>) => void }) {
  const { downPayment, monthlyInstallment, ballot, balloon, possession } = scheduleOf(listing.demand);
  const pkr = (n: number) => `PKR ${formatPKR(n)}`;

  return (
    <article
      onClick={onOpen}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpen(); } }}
      tabIndex={0}
      role="button"
      className={
        listing.featured
          ? 'flex flex-col bg-white rounded-3xl border-2 border-[#e07b0c] p-6 sm:p-7 shadow-[0_24px_50px_-24px_rgba(0,0,0,0.6)] cursor-pointer'
          : 'flex flex-col bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-[0_24px_50px_-28px_rgba(0,0,0,0.5)] cursor-pointer'
      }
    >
      <CardPhotos photos={listing.photos} alt={listing.title} />

      {/* Block badge + recorded date */}
      <div className="flex items-start justify-between gap-3">
        <span className="inline-block px-4 py-2 rounded-full bg-[#d3820f] text-white font-label-caps text-label-caps uppercase tracking-wider text-center">
          {listing.block}
        </span>
        <span className="font-label-caps text-label-caps uppercase text-slate-400 pt-1.5 shrink-0">
          {listing.date}
        </span>
      </div>

      {/* Title + total price */}
      <div className="flex items-start justify-between gap-4 mt-5">
        <div className="min-w-0">
          <h3 className="font-headline-md text-headline-md text-slate-900 leading-tight break-words">
            {listing.title}
          </h3>
          <p className="font-body-sm text-body-sm text-slate-500 mt-1">{listing.subtitle}</p>
        </div>
        <div className="text-right shrink-0">
          <span className="block font-label-caps text-label-caps uppercase text-slate-400">Total Price</span>
          <span className="block font-headline-sm text-headline-sm font-extrabold text-[#e07b0c] mt-0.5">PKR</span>
          <span className="block font-headline-md text-headline-md font-extrabold text-[#e07b0c] leading-tight">
            {formatPKR(listing.demand)}
          </span>
        </div>
      </div>

      {/* Down payment / monthly installment box */}
      <div className="mt-5 rounded-2xl bg-[#fdf7ea] border border-[#f3e2c0] grid grid-cols-2 divide-x divide-[#f0e2c6]">
        <div className="p-4">
          <span className="block font-label-caps text-label-caps uppercase text-slate-500 leading-relaxed">
            Down Payment (20%)
          </span>
          <span className="block mt-2 font-headline-sm text-headline-sm font-bold text-[#e07b0c]">
            {pkr(downPayment)}
          </span>
        </div>
        <div className="p-4">
          <span className="block font-label-caps text-label-caps uppercase text-slate-500 leading-relaxed">
            Monthly Installment
          </span>
          <span className="block mt-2 font-headline-sm text-headline-sm font-bold text-slate-900">
            {pkr(monthlyInstallment)}
          </span>
          <span className="block font-body-sm text-body-sm text-slate-400">(1%)</span>
        </div>
      </div>

      {/* Schedule rows */}
      <div className="mt-5 pt-5 border-t border-slate-200 flex flex-col gap-3 flex-1">
        <div className="flex items-start justify-between gap-4">
          <span className="font-body-md text-body-md text-slate-500">Ballot Payment (10%):</span>
          <span className="font-label-lg text-label-lg font-bold text-slate-900 text-right">{pkr(ballot)}</span>
        </div>
        <div className="flex items-start justify-between gap-4">
          <span className="font-body-md text-body-md text-slate-500">4 Balloon Payments (5%):</span>
          <span className="font-label-lg text-label-lg font-bold text-slate-900 text-right">{pkr(balloon)} ea</span>
        </div>
        <div className="flex items-start justify-between gap-4">
          <span className="font-body-md text-body-md text-slate-500">Possession (20%):</span>
          <span className="font-label-lg text-label-lg font-bold text-slate-900 text-right">{pkr(possession)}</span>
        </div>
      </div>

      <a
        href={`https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(
          `I'm interested in the ${listing.ref} plot, DHA Phase 9 Prism. Please share details.`
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        className="mt-7 inline-flex items-center justify-center gap-2 w-full px-6 py-4 rounded-xl bg-[#25D366] text-[#062b16] font-label-lg text-label-lg uppercase font-bold tracking-wide hover:bg-[#1ebe57] active:scale-[0.99] transition-all"
      >
        <span className="material-symbols-outlined text-xl" aria-hidden="true">chat</span>
        Contact on WhatsApp
      </a>
    </article>
  );
}

/** Compact on-request card — DHA Phase 5 pairs and any Prism row without a demand. */
function RequestCard({ listing, tag }: { listing: PublicListing; tag: string }) {
  const context =
    listing.collection === 'phase5'
      ? `I'm interested in the ${listing.ref} plot pair, DHA Phase 5. Please share details.`
      : `I'm interested in the ${listing.ref} plot, DHA Phase 9 Prism. Please share details.`;

  return (
    <article className="flex flex-col bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-[0_24px_50px_-28px_rgba(0,0,0,0.5)]">
      <CardPhotos photos={listing.photos} alt={listing.title} />

      {/* Block badge + phase tag */}
      <div className="flex items-start justify-between gap-3">
        <span className="inline-block px-4 py-2 rounded-full bg-[#d3820f] text-white font-label-caps text-label-caps uppercase tracking-wider text-center">
          {listing.block}
        </span>
        <span className="font-label-caps text-label-caps uppercase text-slate-400 pt-1.5 shrink-0">
          {tag}
        </span>
      </div>

      {/* Title + price on request */}
      <div className="flex items-start justify-between gap-4 mt-5">
        <div className="min-w-0">
          <h3 className="font-headline-md text-headline-md text-slate-900 leading-tight break-words">
            {listing.title}
          </h3>
          <p className="font-body-sm text-body-sm text-slate-500 mt-1">{listing.subtitle}</p>
        </div>
        <div className="text-right shrink-0">
          <span className="block font-label-caps text-label-caps uppercase text-slate-400">Total Price</span>
          <span className="block font-headline-sm text-headline-sm font-extrabold text-[#e07b0c] mt-0.5">
            PKR
          </span>
          <span className="block font-headline-md text-headline-md font-extrabold text-[#e07b0c] leading-tight">
            On Request
          </span>
        </div>
      </div>

      {/* Detail note */}
      <div className="mt-5 rounded-2xl bg-[#fdf7ea] border border-[#f3e2c0] p-4">
        <span className="block font-label-caps text-label-caps uppercase text-slate-500 leading-relaxed">
          {listing.collection === 'phase5' ? 'Pair Availability' : 'Availability'}
        </span>
        <span className="block mt-2 font-headline-sm text-headline-sm font-bold text-slate-900">
          {listing.title} &mdash; {listing.block}
        </span>
        <span className="block font-body-sm text-body-sm text-slate-500 mt-1">
          Contact us for the current demand and payment schedule.
        </span>
      </div>

      <a
        href={`https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(context)}`}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        className="mt-7 inline-flex items-center justify-center gap-2 w-full px-6 py-4 rounded-xl bg-[#25D366] text-[#062b16] font-label-lg text-label-lg uppercase font-bold tracking-wide hover:bg-[#1ebe57] active:scale-[0.99] transition-all"
      >
        <span className="material-symbols-outlined text-xl" aria-hidden="true">chat</span>
        Contact on WhatsApp
      </a>
    </article>
  );
}

/* ---------------------------------------------------------------------------
 * Static fallback — rendered until Supabase responds (and whenever Supabase
 * is unreachable), so the page always looks identical to the current design.
 * ------------------------------------------------------------------------- */
const fallbackPrism: any[] = staticListings.map((l, i) => ({
  id: `static-prism-${i}`,
  ref: l.ref,
  block: l.block,
  title: l.title,
  subtitle: l.subtitle,
  demand: l.demand,
  date: l.date,
  created_at: parseDisplayDate(l.date),
  final: l.final ?? false,
  featured: l.featured ?? false,
  photos: [],
  collection: 'prism9',
}));

const fallbackPhase5: any[] = staticPhase5.map((l, i) => ({
  id: `static-phase5-${i}`,
  ref: l.ref,
  block: l.block,
  title: l.title,
  subtitle: l.subtitle,
  demand: null,
  date: '',
  created_at: '',
  final: false,
  featured: false,
  photos: [],
  collection: 'phase5',
}));

/**
 * The Listings page sections — DHA Prism 9 Plots then DHA Phase 5
 * requirements. Data comes live from Supabase (client-side, so static export
 * still works) with the hardcoded inventory as graceful fallback.
 */
export default function ListingsSection() {
  const { listings: liveListings } = useListings();
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<'newest' | 'oldest'>('newest');
  const [modalRef, setModalRef] = useState<string | null>(null);
  const [clickedCard, setClickedCard] = useState<HTMLElement | null>(null);

  /** Case-insensitive match across every field a visitor would search. */
  const matches = (l: PublicListing): boolean => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return [
      l.ref,
      l.title,
      l.block,
      l.subtitle,
      l.date,
      l.demand != null ? String(l.demand) : '',
      l.demand != null ? formatPKR(l.demand) : '',
    ]
      .join(' ')
      .toLowerCase()
      .includes(q);
  };

  const bySort = (a: PublicListing, b: PublicListing) =>
    sort === 'newest' ? b.created_at.localeCompare(a.created_at) : a.created_at.localeCompare(b.created_at);

  const base = liveListings ?? [...fallbackPrism, ...fallbackPhase5];
  const modalListing = modalRef ? base.find((l) => l.ref === modalRef) ?? null : null;

  // Deep link via URL hash
  useEffect(() => {
    const openFromHash = () => {
      const hash = window.location.hash.replace(/^#/, '');
      if (hash) setModalRef(hash);
    };
    openFromHash();
    const onHash = () => {
      const hash = window.location.hash.replace(/^#/, '');
      if (!hash) setModalRef(null);
      else setModalRef(hash);
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  useEffect(() => {
    if (modalRef) {
      if (window.location.hash.replace(/^#/, '') !== modalRef) {
        window.history.replaceState(null, '', `#${modalRef}`);
      }
    } else {
      if (window.location.hash) {
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
      }
    }
  }, [modalRef]);
  const prism = base.filter((l) => l.collection === 'prism9' && matches(l)).sort(bySort);
  const phase5 = base.filter((l) => l.collection === 'phase5' && matches(l)).sort(bySort);
  const totalMatches = prism.length + phase5.length;
  const searching = query.trim() !== '';

  const priced = (l: PublicListing): l is PublicListing & { demand: number } => l.demand !== null;

  return (
    <>
      {/* Browse toolbar — search bar, then Newest/Oldest filter, then the plots */}
      <div className="w-full bg-[#0b1329] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-gutter-mobile sm:px-gutter py-6 flex flex-col gap-4">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true">
              search
            </span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search: 10 marla phase 6 corner"
              aria-label="Search listings"
              className="w-full rounded-2xl bg-white border border-slate-200 pl-12 pr-4 py-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#d4af37] focus:outline-none focus:ring-4 focus:ring-[#d4af37]/15"
            />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-white/25 text-slate-300 text-xs font-bold uppercase tracking-wide">
              <span className="material-symbols-outlined text-base" aria-hidden="true">filter_alt</span>
              Filters
            </span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as 'newest' | 'oldest')}
              aria-label="Sort listings"
              className="px-4 py-2.5 rounded-xl border border-white/25 bg-[#0f1937] text-slate-200 text-xs font-bold uppercase tracking-wide focus:border-[#fed65b] focus:outline-none"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>
            <span className="text-sm text-slate-400">
              {totalMatches} listing{totalMatches === 1 ? '' : 's'}
            </span>
          </div>
        </div>
      </div>

      {totalMatches === 0 && (
        <div className="w-full bg-[#0b1329] pb-space-xl">
          <div className="max-w-7xl mx-auto px-gutter-mobile sm:px-gutter">
            <div className="rounded-2xl bg-white/5 border border-white/10 px-5 py-10 text-center text-slate-400 text-sm">
              {searching ? `No plots match “${query.trim()}”. Try a ref like A-356, a block, or a phase.` : 'No plots available right now — WhatsApp us for current requirements.'}
            </div>
          </div>
        </div>
      )}

      {/* DHA Prism 9 — active inventory */}
      {prism.length > 0 && (
      <section id="listing-grid" aria-label="DHA Prism 9 Plots" className="relative w-full overflow-hidden bg-[#0b1329] py-space-xl lg:py-24">
      {/* Ambient glows */}
      <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-secondary-container/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-16 h-[420px] w-[420px] rounded-full bg-[#e07b0c]/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-gutter-mobile sm:px-gutter">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 px-space-md py-space-xs rounded-full bg-secondary-container/15 text-secondary-container font-label-caps text-label-caps uppercase tracking-wider">
            Current Inventory &bull; Direct Plots
          </span>
          <h2 className="font-headline-lg text-headline-lg text-surface-bright mt-space-xs">
            DHA Prism 9 Plots
          </h2>
          <p className="font-body-md text-body-md text-slate-300 mt-space-sm">
            All active listings currently on our desk &mdash; every card shows the plot reference, the date the
            demand was recorded, and the full schedule of payments &mdash; 20% down payment, 1% monthly
            installment, 10% ballot, four 5% balloon payments and 20% on possession. Tap the WhatsApp button on
            any plot to reach us directly with a pre-filled enquiry.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6 mt-space-lg items-start">
          {prism.map((listing) =>
            priced(listing) ? (
              <ListingCard key={listing.id} listing={listing} onOpen={(e) => { setClickedCard(e!.currentTarget as HTMLElement); setModalRef(listing.ref); }} />
            ) : (
              <RequestCard key={listing.id} listing={listing} tag="DHA Phase 9 Prism" />
            )
          )}
        </div>
      </div>
      </section>
      )}

      {/* DHA Phase 5 — requirements (below the Prism section) */}
      {phase5.length > 0 && (
      <section
        id="phase5-grid"
        aria-label="DHA Phase 5"
        className="relative w-full overflow-hidden bg-[#0e1630] border-t border-[#fed65b]/20 py-space-xl lg:py-24"
      >
        {/* Ambient glows */}
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-secondary-container/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-16 h-[420px] w-[420px] rounded-full bg-[#e07b0c]/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-gutter-mobile sm:px-gutter">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 px-space-md py-space-xs rounded-full bg-secondary-container/15 text-secondary-container font-label-caps text-label-caps uppercase tracking-wider">
              Requirements &bull; Pair Plots
            </span>
            <h2 className="font-headline-lg text-headline-lg text-surface-bright mt-space-xs">
              DHA Phase 5
            </h2>
            <p className="font-body-md text-body-md text-slate-300 mt-space-sm">
              M Block pair plots currently available on requirement &mdash; plot #46 + 47 and #180 + 181.
              Tap the WhatsApp button on any pair to reach us directly with a pre-filled enquiry.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6 mt-space-lg items-start">
            {phase5.map((listing) => (
              <RequestCard key={listing.id} listing={listing} tag="DHA Phase 5" />
            ))}
          </div>
        </div>
      </section>
      )}
      {modalListing && (
        <ListingDetailModal listing={modalListing} onClose={() => { setModalRef(null); setClickedCard(null); }} returnTo={clickedCard} />
      )}
    </>
  );
}






