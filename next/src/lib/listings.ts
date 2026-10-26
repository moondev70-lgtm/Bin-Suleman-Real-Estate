import { formatDbDate } from '@/lib/format';

/** Section of the listings page a row belongs to. */
export type Collection = 'prism9' | 'phase5';

/** Raw `public.listings` row as returned by Supabase. */
export type ListingRow = {
  id: string;
  ref: string;
  block: string;
  title: string;
  subtitle: string | null;
  category: string;
  collection: string;
  location: string;
  demand: number | null;
  demand_date: string | null;
  is_final: boolean;
  featured: boolean;
  description: string | null;
  features: string[] | null;
  details: { label: string; value: string }[] | null;
  published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

/** Raw `public.listing_photos` row (lightweight projection used for fetches). */
export type PhotoRow = {
  id: string;
  listing_id: string;
  storage_path: string;
  alt: string | null;
  position: number;
};

/**
 * Presentation shape consumed by the card components. Maps 1:1 onto the old
 * static `Listing` / `Phase5Listing` types plus id, photos and collection.
 * `demand === null` renders the "Price on Request" card variant.
 */
export type PublicListing = {
  id: string;
  ref: string;
  block: string;
  title: string;
  subtitle: string;
  demand: number | null;
  /** Formatted display date, e.g. '05 Oct 2026' (may be ''). */
  date: string;
  /** ISO created-at timestamp ('YYYY-MM-DD' for static fallback) — sorts newest/oldest. */
  created_at: string;
  final: boolean;
  featured: boolean;
  photos: string[];
  collection: Collection;
  features: string[];
  details: { label: string; value: string }[];
};

/** Map a DB row + its public photo URLs to the card presentation shape. */
export const rowToListing = (row: ListingRow, photos: string[] = []): PublicListing => ({
  id: row.id,
  ref: row.ref,
  block: row.block,
  title: row.title,
  subtitle: row.subtitle ?? '',
  demand: row.demand,
  date: formatDbDate(row.demand_date),
  created_at: row.created_at,
  final: row.is_final,
  featured: row.featured,
  photos,
  collection: row.collection === 'phase5' ? 'phase5' : 'prism9',
  features: Array.isArray(row.features) ? row.features.filter((x): x is string => typeof x === 'string') : [],
  details: Array.isArray(row.details)
    ? row.details
        .filter((d): d is { label: string; value: string } => !!d && typeof d === 'object')
        .map((d) => ({ label: String((d as any).label ?? ''), value: String((d as any).value ?? '') }))
    : [],
});
