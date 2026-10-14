'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import AdminGuard from '@/components/admin/AdminGuard';
import { getSupabase } from '@/lib/supabase/client';
import { formatPKR, formatDbDate } from '@/lib/format';
import type { ListingRow } from '@/lib/listings';
import { blogCoverUrl, type BlogPostRow } from '@/lib/blogs';

/** DB row + first photo (thumbnail) and total photo count. */
type Row = ListingRow & {
  thumb: string | null;
  photo_count: number;
};

/** Blog row + resolved cover URL for the card thumbnail. */
type BlogRow = BlogPostRow & {
  cover_url: string | null;
};

type SortKey = 'newest' | 'oldest' | 'manual';

/** The dashboard's two content types. */
type ViewType = 'listings' | 'blog';

/** Friendly hints for the errors that need a SQL fix, not a code fix. */
const errorHint = (message: string): string | null => {
  if (message.includes('blog_posts')) {
    if (
      message.includes('does not exist') ||
      message.includes('permission denied') ||
      message.includes('row-level security')
    ) {
      return 'Blog CMS is not set up yet — run next/supabase/migrations/0003_blog.sql (and 0002_grants.sql if you have not) in the Supabase SQL editor, then refresh.';
    }
    return null;
  }
  if (message.includes('permission denied')) {
    return 'Missing table grants — run next/supabase/migrations/0002_grants.sql in the Supabase SQL editor, then refresh.';
  }
  if (message.includes('row-level security')) {
    return 'Your user is not an admin yet — run next/supabase/migrations/0002_grants.sql (or the admin grant snippet in the README), then refresh.';
  }
  return null;
};

function Dashboard() {
  const [view, setView] = useState<ViewType>('listings');
  const [rows, setRows] = useState<Row[] | null>(null);
  const [blogRows, setBlogRows] = useState<BlogRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  /** Blog-specific error — never blocks the listings table (0003 may be pending). */
  const [blogError, setBlogError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<SortKey>('newest');

  const load = useCallback(async () => {
    const supabase = getSupabase();
    if (!supabase) return;
    const { data, error: err } = await supabase
      .from('listings')
      .select('*')
      .order('collection', { ascending: true })
      .order('sort_order', { ascending: true });
    if (err) {
      setError(err.message);
      return;
    }

    const listingRows = data as unknown as ListingRow[];

    // One extra query: thumbnail + photo count per listing.
    const photosByListing: Record<string, string[]> = {};
    const ids = listingRows.map((r) => r.id);
    if (ids.length) {
      const { data: photoRows } = await supabase
        .from('listing_photos')
        .select('listing_id, storage_path, position')
        .in('listing_id', ids)
        .order('position', { ascending: true });
      for (const photo of photoRows ?? []) {
        const { data: pub } = supabase.storage.from('listings').getPublicUrl(photo.storage_path);
        (photosByListing[photo.listing_id] ??= []).push(pub.publicUrl);
      }
    }

    setError(null);
    setRows(
      listingRows.map((r) => ({
        ...r,
        thumb: photosByListing[r.id]?.[0] ?? null,
        photo_count: photosByListing[r.id]?.length ?? 0,
      })),
    );

    // Blog posts — loaded separately so a missing 0003_blog.sql migration
    // never breaks the listings table.
    const { data: blogData, error: blogErr } = await supabase
      .from('blog_posts')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('published_at', { ascending: false, nullsFirst: false });
    if (blogErr) {
      setBlogError(blogErr.message);
      setBlogRows([]);
    } else {
      setBlogError(null);
      setBlogRows(
        (blogData as unknown as BlogPostRow[]).map((r) => ({
          ...r,
          cover_url: blogCoverUrl(r.cover_path),
        })),
      );
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const togglePublished = async (row: Row) => {
    const supabase = getSupabase();
    if (!supabase || busy) return;
    setBusy(true);
    const { error: err } = await supabase.from('listings').update({ published: !row.published }).eq('id', row.id);
    setBusy(false);
    if (err) setError(err.message);
    else await load();
  };

  const remove = async (row: Row) => {
    const supabase = getSupabase();
    if (!supabase || busy) return;
    if (!window.confirm(`Delete ${row.title} permanently (including its photos)?`)) return;
    setBusy(true);
    setError(null);
    const { data: photos } = await supabase.from('listing_photos').select('storage_path').eq('listing_id', row.id);
    if (photos?.length) {
      await supabase.storage.from('listings').remove(photos.map((p) => p.storage_path));
    }
    const { error: err } = await supabase.from('listings').delete().eq('id', row.id);
    setBusy(false);
    if (err) setError(err.message);
    else await load();
  };

  const toggleBlogPublished = async (row: BlogRow) => {
    const supabase = getSupabase();
    if (!supabase || busy) return;
    setBusy(true);
    const { error: err } = await supabase.from('blog_posts').update({ published: !row.published }).eq('id', row.id);
    setBusy(false);
    if (err) setBlogError(err.message);
    else await load();
  };

  const removeBlog = async (row: BlogRow) => {
    const supabase = getSupabase();
    if (!supabase || busy) return;
    if (!window.confirm(`Delete "${row.title}" permanently?`)) return;
    setBusy(true);
    setBlogError(null);
    const { error: err } = await supabase.from('blog_posts').delete().eq('id', row.id);
    if (!err && row.cover_path) {
      await supabase.storage.from('blog').remove([row.cover_path]);
    }
    setBusy(false);
    if (err) setBlogError(err.message);
    else await load();
  };

  const signOut = async () => {
    const supabase = getSupabase();
    if (supabase) await supabase.auth.signOut();
  };

  /** Search across every listing field, then apply the Newest/Oldest filter. */
  const visibleListings = useMemo(() => {
    if (!rows) return null;
    const q = query.trim().toLowerCase();
    let out = rows.filter((r) => {
      if (!q) return true;
      const haystack = [
        r.ref,
        r.title,
        r.block,
        r.subtitle,
        r.location,
        r.category,
        r.demand != null ? String(r.demand) : '',
        r.demand != null ? formatPKR(r.demand) : '',
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });
    if (sort === 'newest') out = [...out].sort((a, b) => b.created_at.localeCompare(a.created_at));
    else if (sort === 'oldest') out = [...out].sort((a, b) => a.created_at.localeCompare(b.created_at));
    return out;
  }, [rows, query, sort]);

  /** Same treatment for blog posts (display date = published_at ?? created_at). */
  const visibleBlog = useMemo(() => {
    if (!blogRows) return null;
    const q = query.trim().toLowerCase();
    const out = blogRows.filter((r) => {
      if (!q) return true;
      const haystack = [r.title, r.category, r.author, r.excerpt, r.slug, r.badge].join(' ').toLowerCase();
      return haystack.includes(q);
    });
    if (sort === 'newest') {
      return [...out].sort((a, b) => (b.published_at ?? b.created_at).localeCompare(a.published_at ?? a.created_at));
    }
    if (sort === 'oldest') {
      return [...out].sort((a, b) => (a.published_at ?? a.created_at).localeCompare(b.published_at ?? b.created_at));
    }
    return out;
  }, [blogRows, query, sort]);

  const hint = error ? errorHint(error) : null;
  const blogHint = blogError ? errorHint(blogError) : null;

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            {view === 'blog' ? 'Blog' : 'Listings'}
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            {view === 'blog'
              ? blogRows
                ? `${blogRows.length} total · changes go live instantly`
                : 'Loading…'
              : rows
                ? `${rows.length} total · changes go live instantly`
                : 'Loading…'}
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href={view === 'blog' ? '/admin/editor?type=blog' : '/admin/editor'}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#fed65b] text-[#0b1329] text-sm font-bold uppercase tracking-wide hover:brightness-105 transition-all"
          >
            <span className="material-symbols-outlined text-lg" aria-hidden="true">add</span>
            {view === 'blog' ? 'New Blog' : 'New Listing'}
          </Link>
          <button
            onClick={signOut}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-600 text-slate-300 text-sm font-bold uppercase tracking-wide hover:border-[#fed65b] hover:text-[#fed65b] transition-all"
          >
            <span className="material-symbols-outlined text-lg" aria-hidden="true">logout</span>
            Sign Out
          </button>
        </div>
      </div>

      {/* Search bar */}
      <div className="relative mb-4">
        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true">
          search
        </span>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={view === 'blog' ? 'Search: sector j investment' : 'Search: 10 marla phase 6 corner'}
          aria-label={view === 'blog' ? 'Search blog posts' : 'Search listings'}
          className="w-full rounded-2xl bg-white border border-slate-200 pl-12 pr-4 py-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#d4af37] focus:outline-none focus:ring-4 focus:ring-[#d4af37]/15"
        />
      </div>

      {/* Filters row: [Listings | Blog] switch + Newest/Oldest select */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="inline-flex rounded-xl border border-slate-400/40 overflow-hidden">
          {(['listings', 'blog'] as const).map((t) => (
            <button
              key={t}
              type="button"
              aria-pressed={view === t}
              onClick={() => setView(t)}
              className={`px-4 py-3 text-sm font-bold uppercase tracking-wide transition-colors ${
                view === t ? 'bg-[#fed65b] text-[#0b1329]' : 'text-slate-300 hover:text-[#fed65b]'
              }`}
            >
              {t === 'listings' ? 'Listings' : 'Blog'}
            </button>
          ))}
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          aria-label="Sort listings"
          className="px-4 py-3 rounded-xl border border-slate-400/40 bg-[#0f1937] text-slate-200 text-sm font-semibold focus:border-[#fed65b] focus:outline-none min-w-[10rem]"
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="manual">Section order</option>
        </select>
      </div>

      {error && view === 'listings' && (
        <div className="mb-4 rounded-xl bg-red-500/10 border border-red-500/40 px-4 py-3 text-sm text-red-300">
          {error}
          {hint && <p className="mt-1.5 text-xs text-red-200/80">{hint}</p>}
        </div>
      )}
      {blogError && view === 'blog' && (
        <div className="mb-4 rounded-xl bg-red-500/10 border border-red-500/40 px-4 py-3 text-sm text-red-300">
          {blogError}
          {blogHint && <p className="mt-1.5 text-xs text-red-200/80">{blogHint}</p>}
        </div>
      )}

      <p className="text-sm text-slate-400 mb-4">
        {view === 'blog'
          ? visibleBlog
            ? `${visibleBlog.length} post${visibleBlog.length === 1 ? '' : 's'}`
            : ' '
          : visibleListings
            ? `${visibleListings.length} listing${visibleListings.length === 1 ? '' : 's'}`
            : ' '}
      </p>

      <div className="flex flex-col gap-4">
        {view === 'blog' ? (
          <>
            {visibleBlog === null && !blogError && (
              <div className="rounded-2xl bg-white/5 border border-white/10 px-5 py-8 text-center text-slate-400 text-sm">
                Loading posts…
              </div>
            )}
            {visibleBlog?.length === 0 && (
              <div className="rounded-2xl bg-white/5 border border-white/10 px-5 py-8 text-center text-slate-400 text-sm">
                {blogRows?.length === 0 ? 'No posts yet — create your first one.' : 'No posts match your search.'}
              </div>
            )}
            {visibleBlog?.map((row) => (
              <div key={row.id} className="rounded-2xl bg-white p-4 sm:p-5 flex flex-col sm:flex-row gap-4 shadow-lg">
                {/* Cover thumbnail */}
                <div className="w-full sm:w-40 h-32 sm:h-28 rounded-xl overflow-hidden bg-slate-100 shrink-0 flex items-center justify-center">
                  {row.cover_url ? (
                    <img src={row.cover_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="material-symbols-outlined text-4xl text-slate-300" aria-hidden="true">article</span>
                  )}
                </div>
                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 rounded-full bg-[#d3820f] text-white text-[10px] font-bold uppercase tracking-wider">{row.category}</span>
                        {row.featured && (
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#e07b0c]">★ Featured</span>
                        )}
                        {row.badge && (
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{row.badge}</span>
                        )}
                      </div>
                      <p className="font-bold text-slate-900 mt-1 text-lg leading-snug">{row.title}</p>
                      {row.excerpt && <p className="text-sm text-slate-500">{row.excerpt}</p>}
                      <p className="text-xs text-slate-400 mt-0.5">
                        {row.author || 'Bin Suleman'}
                        {row.read_time ? ` · ${row.read_time}` : ''}
                        {' · '}
                        {formatDbDate(row.published_at ?? row.created_at.slice(0, 10))}
                        {' · '}
                        /blog/{row.slug}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider shrink-0 ${
                        row.published
                          ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-100 text-slate-500 border border-slate-200'
                      }`}
                    >
                      {row.published ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  {/* Actions */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    <button
                      onClick={() => toggleBlogPublished(row)}
                      disabled={busy}
                      className="px-3.5 py-2 rounded-lg border border-slate-300 text-xs font-bold uppercase tracking-wide text-slate-600 hover:border-[#d4af37] hover:text-[#d4af37] transition-all disabled:opacity-50"
                    >
                      {row.published ? 'Unpublish' : 'Publish'}
                    </button>
                    <Link
                      href={`/admin/editor?type=blog&id=${row.id}`}
                      className="px-3.5 py-2 rounded-lg border border-slate-300 text-xs font-bold uppercase tracking-wide text-slate-600 hover:border-[#d4af37] hover:text-[#d4af37] transition-all"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => removeBlog(row)}
                      disabled={busy}
                      className="px-3.5 py-2 rounded-lg border border-red-200 text-xs font-bold uppercase tracking-wide text-red-500 hover:bg-red-50 transition-all disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </>
        ) : (
          <>
            {visibleListings === null && !error && (
              <div className="rounded-2xl bg-white/5 border border-white/10 px-5 py-8 text-center text-slate-400 text-sm">
                Loading listings…
              </div>
            )}
            {visibleListings?.length === 0 && (
              <div className="rounded-2xl bg-white/5 border border-white/10 px-5 py-8 text-center text-slate-400 text-sm">
                {rows?.length === 0 ? 'No listings yet — create your first one.' : 'No listings match your search.'}
              </div>
            )}
            {visibleListings?.map((row) => (
              <div key={row.id} className="rounded-2xl bg-white p-4 sm:p-5 flex flex-col sm:flex-row gap-4 shadow-lg">
                {/* Thumbnail */}
                <div className="w-full sm:w-40 h-32 sm:h-28 rounded-xl overflow-hidden bg-slate-100 shrink-0 flex items-center justify-center">
                  {row.thumb ? (
                    <img src={row.thumb} alt={row.title} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs font-semibold text-slate-400">No photo</span>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{row.ref}</span>
                        <span className="px-2 py-0.5 rounded-full bg-[#d3820f] text-white text-[10px] font-bold uppercase tracking-wider">
                          {row.collection === 'phase5' ? 'Phase 5' : 'Prism 9'}
                        </span>
                        {row.featured && (
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#e07b0c]">★ Featured</span>
                        )}
                      </div>
                      <p className="font-bold text-slate-900 mt-1 text-lg leading-snug">{row.title}</p>
                      <p className="text-sm text-slate-500">{row.block} · {row.subtitle}</p>
                      <p className="text-sm font-bold text-[#e07b0c] mt-1">
                        {row.demand != null ? `Demand: PKR ${formatPKR(row.demand)}` : 'Demand: On Request'}
                        {row.demand_date && <span className="font-normal text-slate-400"> · {formatDbDate(row.demand_date)}</span>}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {row.photo_count ? `${row.photo_count} photo${row.photo_count > 1 ? 's' : ''}` : 'No photos'}
                        {' · '}
                        {row.category}
                      </p>
                    </div>

                    <span
                      className={`px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider shrink-0 ${
                        row.published
                          ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-100 text-slate-500 border border-slate-200'
                      }`}
                    >
                      {row.published ? 'Available' : 'Draft'}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    <button
                      onClick={() => togglePublished(row)}
                      disabled={busy}
                      className="px-3.5 py-2 rounded-lg border border-slate-300 text-xs font-bold uppercase tracking-wide text-slate-600 hover:border-[#d4af37] hover:text-[#d4af37] transition-all disabled:opacity-50"
                    >
                      {row.published ? 'Unpublish' : 'Publish'}
                    </button>
                    <Link
                      href={`/admin/editor?id=${row.id}`}
                      className="px-3.5 py-2 rounded-lg border border-slate-300 text-xs font-bold uppercase tracking-wide text-slate-600 hover:border-[#d4af37] hover:text-[#d4af37] transition-all"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => remove(row)}
                      disabled={busy}
                      className="px-3.5 py-2 rounded-lg border border-red-200 text-xs font-bold uppercase tracking-wide text-red-500 hover:bg-red-50 transition-all disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </>
  );
}

export default function AdminPage() {
  return (
    <AdminGuard>
      <Dashboard />
    </AdminGuard>
  );
}


