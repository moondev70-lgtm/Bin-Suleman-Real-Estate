'use client';

import { useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabase } from '@/lib/supabase/client';
import { blogCoverUrl, type BlogPostRow } from '@/lib/blogs';

export type BlogFormValues = {
  title: string;
  /** URL-safe id; auto-generated from the title until edited by hand. */
  slug: string;
  category: string;
  excerpt: string;
  body: string;
  author: string;
  read_time: string;
  badge: string;
  /** Raw <input type=date> value; '' means "show the created date on the card". */
  published_at: string;
  sort_order: number;
  featured: boolean;
  published: boolean;
};

export const EMPTY_BLOG: BlogFormValues = {
  title: '',
  slug: '',
  category: 'Sector Analysis',
  excerpt: '',
  body: '',
  author: 'Bin Suleman',
  read_time: '',
  badge: '',
  published_at: '',
  sort_order: 0,
  featured: false,
  published: true,
};

/** DB row → form values (raw strings, no display formatting). */
export const blogValuesFromRow = (row: BlogPostRow): BlogFormValues => ({
  title: row.title,
  slug: row.slug,
  category: row.category,
  excerpt: row.excerpt ?? '',
  body: row.body ?? '',
  author: row.author ?? 'Bin Suleman',
  read_time: row.read_time ?? '',
  badge: row.badge ?? '',
  published_at: row.published_at ?? '',
  sort_order: row.sort_order,
  featured: row.featured,
  published: row.published,
});

const cls =
  'rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-on-surface placeholder:text-slate-400 focus:border-[#d4af37] focus:outline-none focus:ring-4 focus:ring-[#d4af37]/15 w-full';
const labelCls = 'block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5';

/** Chips shown on the public /blog page — keep in sync with BlogGrid's `cats`. */
const BLOG_CATEGORIES = [
  'Sector Analysis',
  'Possession & Infrastructure',
  'Overseas Pakistani Guides',
  'Construction & Architecture',
  'Price Trends & Valuations',
] as const;

const segBtn = (active: boolean) =>
  `px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wide border transition-all ${
    active
      ? 'bg-[#0b1329] text-[#fed65b] border-[#0b1329] shadow-md'
      : 'bg-white text-slate-500 border-slate-200 hover:border-[#d4af37] hover:text-[#d4af37]'
  }`;

/** 'The Ultimate Guide to Sector J' → 'the-ultimate-guide-to-sector-j' */
const slugify = (text: string): string =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);

/** ~200 wpm — fills Read Time automatically when left blank. */
const guessReadTime = (body: string): string => {
  const words = body.trim() ? body.trim().split(/\s+/).length : 0;
  return `${Math.max(1, Math.round(words / 200))} min read`;
};

export default function BlogForm({
  postId,
  initial,
  initialCover,
}: {
  postId: string | null;
  initial: BlogFormValues;
  /** Storage path of the saved cover image in the 'blog' bucket, if any. */
  initialCover: string | null;
}) {
  const router = useRouter();
  const coverInputRef = useRef<HTMLInputElement>(null);
  const [values, setValues] = useState<BlogFormValues>(initial);
  /** Current cover object; upload happens immediately (PhotoUploader pattern). */
  const [cover, setCover] = useState<{ path: string; url: string } | null>(
    initialCover ? { path: initialCover, url: blogCoverUrl(initialCover) ?? '' } : null,
  );
  const [coverBusy, setCoverBusy] = useState(false);
  const [coverError, setCoverError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  /** Keeps the auto-slug in sync with the title until the user edits it. */
  const [slugTouched, setSlugTouched] = useState(postId !== null);

  const set = <K extends keyof BlogFormValues>(key: K, value: BlogFormValues[K]) =>
    setValues((v) => ({ ...v, [key]: value }));

  const isCustomCategory =
    values.category !== '' && !BLOG_CATEGORIES.includes(values.category as (typeof BLOG_CATEGORIES)[number]);

  const onPickCover = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    const supabase = getSupabase();
    if (!supabase || !file) return;
    setCoverBusy(true);
    setCoverError(null);
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const path = `${crypto.randomUUID()}.${ext}`;
    const { error: upErr } = await supabase.storage.from('blog').upload(path, file, {
      cacheControl: '3600',
      upsert: false,
    });
    setCoverBusy(false);
    if (upErr) {
      setCoverError(`Upload failed: ${upErr.message}`);
      return;
    }
    const { data } = supabase.storage.from('blog').getPublicUrl(path);
    setCover({ path, url: data.publicUrl });
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const supabase = getSupabase();
    if (!supabase) {
      setError('Supabase is not configured.');
      return;
    }
    setBusy(true);
    setError(null);

    const title = values.title.trim();
    if (!title) {
      setError('Title is required.');
      setBusy(false);
      return;
    }
    const slug = values.slug.trim() || slugify(title);
    if (!slug) {
      setError('Slug must contain at least one letter or number.');
      setBusy(false);
      return;
    }

    const payload = {
      slug,
      title,
      category: values.category.trim() || 'Sector Analysis',
      excerpt: values.excerpt.trim(),
      body: values.body,
      author: values.author.trim() || 'Bin Suleman',
      read_time: values.read_time.trim() || guessReadTime(values.body),
      badge: values.badge.trim(),
      published_at: values.published_at || null,
      sort_order: Number.isFinite(values.sort_order) ? values.sort_order : 0,
      featured: values.featured,
      published: values.published,
      cover_path: cover?.path ?? null,
    };

    try {
      if (postId) {
        const { error: updErr } = await supabase.from('blog_posts').update(payload).eq('id', postId);
        if (updErr) throw updErr;
      } else {
        const { error: insErr } = await supabase.from('blog_posts').insert(payload).select('id').single();
        if (insErr) throw insErr;
      }

      // The replaced/removed cover object is deleted only once the row is safe.
      if (initialCover && initialCover !== (cover?.path ?? null)) {
        await supabase.storage.from('blog').remove([initialCover]);
      }

      router.push('/admin');
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(
        msg.includes('blog_posts_slug_key')
          ? 'That slug is already in use — change the Slug field and save again.'
          : msg,
      );
      setBusy(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="rounded-3xl bg-white p-6 sm:p-8 shadow-xl flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-extrabold text-slate-900">{postId ? 'Edit Post' : 'New Post'}</h2>
        <a
          href="/admin"
          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-slate-500 hover:text-[#d4af37] transition-colors"
        >
          <span className="material-symbols-outlined text-sm" aria-hidden="true">arrow_back</span>
          Back to dashboard
        </a>
      </div>

      {/* Content — title, slug, category chips, excerpt, body */}
      <section className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 sm:p-5 flex flex-col gap-4">
        <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-2">
          <span className="material-symbols-outlined text-base text-[#d4af37]" aria-hidden="true">article</span>
          Content
        </h3>
        <div>
          <label className={labelCls} htmlFor="b-title">Title *</label>
          <input
            id="b-title"
            required
            className={cls}
            placeholder="The Ultimate Guide to Buying a 1 Kanal Plot in Sector J"
            value={values.title}
            onChange={(e) => {
              set('title', e.target.value);
              if (!slugTouched) set('slug', slugify(e.target.value));
            }}
          />
        </div>
        <div>
          <label className={labelCls} htmlFor="b-slug">Slug</label>
          <input
            id="b-slug"
            className={cls}
            placeholder="auto-generated from the title"
            value={values.slug}
            onChange={(e) => {
              setSlugTouched(true);
              set('slug', e.target.value);
            }}
          />
          <p className="text-xs text-slate-400 mt-1.5">Kept for future article pages and SEO — no need to change it.</p>
        </div>
        <div>
          <span className={labelCls}>Category *</span>
          <div className="flex flex-wrap gap-2">
            {BLOG_CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                aria-pressed={values.category === c && !isCustomCategory}
                onClick={() => set('category', c)}
                className={segBtn(values.category === c && !isCustomCategory)}
              >
                {c}
              </button>
            ))}
            <button
              type="button"
              aria-pressed={isCustomCategory}
              onClick={() => set('category', '')}
              className={segBtn(isCustomCategory)}
            >
              Custom…
            </button>
          </div>
          {isCustomCategory && (
            <input
              className={`${cls} mt-2`}
              placeholder="e.g. Balloting Results"
              value={values.category}
              onChange={(e) => set('category', e.target.value)}
            />
          )}
        </div>
        <div>
          <label className={labelCls} htmlFor="b-excerpt">Excerpt * (shown on the card)</label>
          <textarea
            id="b-excerpt"
            rows={2}
            className={cls}
            placeholder="One or two lines summarising the article"
            value={values.excerpt}
            onChange={(e) => set('excerpt', e.target.value)}
          />
        </div>
        <div>
          <label className={labelCls} htmlFor="b-body">Article Body</label>
          <textarea
            id="b-body"
            rows={10}
            className={cls}
            placeholder="Full article text…"
            value={values.body}
            onChange={(e) => set('body', e.target.value)}
          />
          <p className="text-xs text-slate-400 mt-1.5">
            Stored for future article pages — the public blog is card-only today, so only the excerpt is shown.
          </p>
        </div>
      </section>

      {/* Details — author, read time, badge, date, sort */}
      <section className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 sm:p-5 flex flex-col gap-4">
        <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-2">
          <span className="material-symbols-outlined text-base text-[#d4af37]" aria-hidden="true">tune</span>
          Details
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls} htmlFor="b-author">Author</label>
            <input id="b-author" className={cls} placeholder="Bin Suleman"
              value={values.author} onChange={(e) => set('author', e.target.value)} />
          </div>
          <div>
            <label className={labelCls} htmlFor="b-read">Read Time</label>
            <input id="b-read" className={cls} placeholder="auto: '6 min read'"
              value={values.read_time} onChange={(e) => set('read_time', e.target.value)} />
          </div>
          <div>
            <label className={labelCls} htmlFor="b-badge">Badge</label>
            <input id="b-badge" className={cls} placeholder="optional, e.g. NEW"
              value={values.badge} onChange={(e) => set('badge', e.target.value)} />
          </div>
          <div>
            <label className={labelCls} htmlFor="b-date">Published Date</label>
            <input id="b-date" type="date" className={cls}
              value={values.published_at} onChange={(e) => set('published_at', e.target.value)} />
          </div>
          <div>
            <label className={labelCls} htmlFor="b-sort">Sort Order</label>
            <input id="b-sort" type="number" className={cls}
              value={values.sort_order} onChange={(e) => set('sort_order', Number(e.target.value))} />
          </div>
        </div>
        <p className="text-xs text-slate-400">
          Leave Read Time blank to auto-fill it from the body length. Sort Order 0 (default) means newest-first by date.
        </p>
      </section>

      {/* Cover — single image, uploads immediately to the public 'blog' bucket */}
      <section className="flex flex-col gap-3">
        <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-2">
          <span className="material-symbols-outlined text-base text-[#d4af37]" aria-hidden="true">add_photo_alternate</span>
          Cover Image
          <span className="font-normal normal-case text-slate-400 text-xs">(optional — shown in the dashboard)</span>
        </h3>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          {coverError && <p className="text-xs text-red-600 mb-3">{coverError}</p>}
          {cover ? (
            <div className="relative rounded-lg overflow-hidden border border-slate-200 group w-full max-w-md">
              <img src={cover.url} alt="" className="w-full h-44 object-cover" />
              <button
                type="button"
                onClick={() => setCover(null)}
                disabled={coverBusy}
                className="absolute inset-0 flex items-center justify-center bg-black/55 text-white opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-30"
                aria-label="Remove cover image"
              >
                <span className="material-symbols-outlined">delete</span>
              </button>
            </div>
          ) : (
            <p className="text-xs text-slate-400">No cover image yet (optional).</p>
          )}
          <input
            ref={coverInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onPickCover}
            disabled={coverBusy}
          />
          <button
            type="button"
            onClick={() => coverInputRef.current?.click()}
            disabled={coverBusy}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-300 text-xs font-bold uppercase tracking-wide text-slate-600 hover:border-[#d4af37] hover:text-[#d4af37] transition-all disabled:opacity-50 mt-3"
          >
            <span className="material-symbols-outlined text-sm" aria-hidden="true">
              {coverBusy ? 'progress_activity' : 'add_photo_alternate'}
            </span>
            {coverBusy ? 'Uploading…' : cover ? 'Replace Cover' : 'Upload Cover'}
          </button>
        </div>
      </section>

      {/* Status — toggle buttons, not checkboxes */}
      <section className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 sm:p-5 flex flex-col gap-4">
        <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-2">
          <span className="material-symbols-outlined text-base text-[#d4af37]" aria-hidden="true">flag</span>
          Status
        </h3>
        <div className="flex flex-wrap gap-2">
          {(
            [
              ['published', 'Published'],
              ['featured', 'Featured'],
            ] as const
          ).map(([key, text]) => (
            <button
              key={key}
              type="button"
              aria-pressed={values[key]}
              onClick={() => set(key, !values[key])}
              className={segBtn(values[key])}
            >
              {values[key] && <span aria-hidden="true">✓ </span>}
              {text}
            </button>
          ))}
        </div>
      </section>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={busy}
        className="inline-flex items-center justify-center gap-2 w-full px-6 py-4 rounded-xl bg-[#0b1329] text-[#fed65b] font-label-lg text-label-lg uppercase font-bold tracking-wide hover:bg-[#131d3d] active:scale-[0.99] transition-all disabled:opacity-60"
      >
        <span className="material-symbols-outlined text-xl" aria-hidden="true">save</span>
        {busy ? 'Saving…' : postId ? 'Save Changes' : 'Create Post'}
      </button>
    </form>
  );
}
