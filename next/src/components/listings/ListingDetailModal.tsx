'use client';

import { useEffect, useRef, useState } from 'react';

import { site } from '@/content/site';
import { formatPKR } from '@/content/listings';
import { LISTING_FEATURES } from '@/lib/listingFeatures';
import type { PublicListing } from '@/lib/listings';

export default function ListingDetailModal({
  listing,
  onClose,
  returnTo,
}: {
  listing: PublicListing;
  onClose: () => void;
  returnTo?: HTMLElement | null;
}) {
  const [mainIdx, setMainIdx] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const prevFocus = useRef<HTMLElement | null>(null);

  const photos = listing.photos ?? [];
  const priceText = listing.demand === null ? 'Price on Request' : `PKR ${formatPKR(listing.demand)}`;
  const msg = `Inquiry regarding Plot ${listing.ref} (${listing.title}), ${priceText}`;
  const waUrl = `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(msg)}`;

  useEffect(() => {
    prevFocus.current = returnTo ?? (document.activeElement as HTMLElement | null);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const t = setTimeout(() => dialogRef.current?.focus(), 0);
    return () => {
      clearTimeout(t);
      document.body.style.overflow = prevOverflow;
      prevFocus.current?.focus?.();
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (lightboxOpen) setLightboxOpen(false);
        else onClose();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxOpen, onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="listing-modal-title"
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-7"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <span className="inline-block px-4 py-2 rounded-full bg-[#d3820f] text-white font-label-caps text-label-caps uppercase tracking-wider text-center">
            {listing.block}
          </span>
          <span className="font-label-caps text-label-caps uppercase text-slate-400 pt-1.5 shrink-0">{listing.date}</span>
          <button onClick={onClose} aria-label="Close" className="ml-auto text-slate-500 hover:text-slate-900 text-2xl leading-none">
            ×
          </button>
        </div>

        <h2 id="listing-modal-title" className="font-headline-md text-headline-md text-slate-900 mt-5">
          {listing.title}
        </h2>
        <p className="font-body-sm text-body-sm text-slate-500 mt-1">{listing.subtitle}</p>
        <div className="text-right mt-2">
          <span className="block font-label-caps text-label-caps uppercase text-slate-400">Total Price</span>
          <span className="block font-headline-md text-headline-md font-extrabold text-[#e07b0c] leading-tight">{priceText}</span>
        </div>

        {/* Photos */}
        <div className="mt-5">
          {photos.length === 0 ? (
            <div className="h-44 sm:h-52 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">No photos</div>
          ) : (
            <>
              <div className="relative">
                <img src={photos[mainIdx]} alt={listing.title} loading="lazy" className="w-full h-52 sm:h-64 object-cover rounded-2xl" />
                {photos.length > 1 && (
                  <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/65 text-white font-label-caps text-label-caps uppercase tracking-wider">
                    {mainIdx + 1} / {photos.length} Photos
                  </span>
                )}
                {photos.length > 1 && (
                  <button onClick={() => setLightboxOpen(true)} className="absolute bottom-3 right-3 px-3 py-1.5 rounded-full bg-black/65 text-white text-xs font-bold">
                    View All
                  </button>
                )}
              </div>
              {photos.length > 1 && (
                <div className="flex gap-2 mt-3 overflow-x-auto">
                  {photos.map((p, i) => (
                    <button key={i} onClick={() => setMainIdx(i)} className="shrink-0">
                      <img src={p} alt="" loading="lazy" className={`w-16 h-12 object-cover rounded-lg border-2 ${i === mainIdx ? 'border-[#d4af37]' : 'border-transparent'}`} />
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {listing.details && listing.details.length > 0 && (
          <div className="mt-5">
            <h3 className="font-label-caps text-label-caps uppercase text-slate-700 mb-2">Details</h3>
            <div className="grid grid-cols-2 gap-2">
              {listing.details.map((d, i) => (
                <div key={i} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <span className="block text-xs uppercase text-slate-400">{d.label}</span>
                  <span className="block text-sm font-bold text-slate-900">{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {listing.features && listing.features.length > 0 && (
          <div className="mt-5">
            <h3 className="font-label-caps text-label-caps uppercase text-slate-700 mb-2">Plot Highlights &amp; Amenities</h3>
            <div className="grid grid-cols-2 gap-2">
              {listing.features.map((f) => {
                const label = LISTING_FEATURES.find((x) => x.key === f)?.label ?? f;
                return (
                  <div key={f} className="flex items-center gap-2 text-sm text-slate-700">
                    <span className="text-green-600">✓</span>
                    {label}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <a href={waUrl} target="_blank" rel="noopener noreferrer" className="mt-6 w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-[#25D366] text-white font-bold uppercase tracking-wide">
          WhatsApp
        </a>

        {lightboxOpen && (
          <div className="fixed inset-0 z-[60] bg-black/90 flex items-center justify-center p-4" onClick={() => setLightboxOpen(false)}>
            <button onClick={() => setLightboxOpen(false)} className="absolute top-4 right-4 text-white text-3xl" aria-label="Close lightbox">×</button>
            <button onClick={(e) => { e.stopPropagation(); setMainIdx((i) => (i - 1 + photos.length) % photos.length); }} className="absolute left-4 text-white text-3xl">‹</button>
            <img src={photos[mainIdx]} alt="" className="max-h-[80vh] max-w-full object-contain" onClick={(e) => e.stopPropagation()} />
            <button onClick={(e) => { e.stopPropagation(); setMainIdx((i) => (i + 1) % photos.length); }} className="absolute right-4 text-white text-3xl">›</button>
          </div>
        )}
      </div>
    </div>
  );
}