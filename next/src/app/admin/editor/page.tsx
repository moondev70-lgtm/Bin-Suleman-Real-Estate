'use client';

import { useEffect, useState } from 'react';
import AdminGuard from '@/components/admin/AdminGuard';
import ListingForm, { type FormValues } from '@/components/admin/ListingForm';
import BlogForm, { EMPTY_BLOG, blogValuesFromRow } from '@/components/admin/BlogForm';
import { getSupabase } from '@/lib/supabase/client';
import type { ListingRow, PhotoRow } from '@/lib/listings';
import type { BlogPostRow } from '@/lib/blogs';

const blankForm: FormValues = {
  ref: '',
  block: '',
  title: '',
  subtitle: '',
  category: 'residential plot',
  collection: 'prism9',
  location: 'DHA Phase 9 Prism, Lahore',
  demand: '',
  demand_date: '',
  is_final: false,
  featured: false,
  published: true,
  sort_order: 0,
  description: '',
};

const toFormValues = (row: ListingRow): FormValues => ({
  ref: row.ref,
  block: row.block,
  title: row.title,
  subtitle: row.subtitle ?? '',
  category: row.category,
  collection: row.collection === 'phase5' ? 'phase5' : 'prism9',
  location: row.location,
  demand: row.demand == null ? '' : String(row.demand),
  demand_date: row.demand_date ?? '',
  is_final: row.is_final,
  featured: row.featured,
  published: row.published,
  sort_order: row.sort_order,
  description: row.description ?? '',
});

function Editor() {
  // Read ?id= and ?type= from the URL after mount (no dynamic route possible
  // under output:'export', and window.location avoids useSearchParams/Suspense).
  const [id, setId] = useState<string | null>(null);
  const [isBlog, setIsBlog] = useState(false);
  const [row, setRow] = useState<ListingRow | null>(null);
  const [photos, setPhotos] = useState<PhotoRow[]>([]);
  const [blogRow, setBlogRow] = useState<BlogPostRow | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const listingId = params.get('id');
    const blog = params.get('type') === 'blog';
    setIsBlog(blog);
    setId(listingId);
    if (!listingId) {
      setLoading(false);
      return;
    }
    const supabase = getSupabase();
    if (!supabase) {
      setError('Supabase is not configured.');
      setLoading(false);
      return;
    }
    (async () => {
      if (blog) {
        const { data, error: blogErr } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('id', listingId)
          .single();
        if (blogErr) {
          setError(blogErr.message);
        } else {
          setBlogRow(data as BlogPostRow);
        }
        setLoading(false);
        return;
      }
      const { data, error: rowErr } = await supabase
        .from('listings')
        .select('*')
        .eq('id', listingId)
        .single();
      if (rowErr) {
        setError(rowErr.message);
        setLoading(false);
        return;
      }
      setRow(data as ListingRow);
      const { data: photoRows } = await supabase
        .from('listing_photos')
        .select('*')
        .eq('listing_id', listingId)
        .order('position', { ascending: true });
      setPhotos((photoRows as PhotoRow[]) ?? []);
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <span className="material-symbols-outlined text-4xl text-[#fed65b] animate-spin">progress_activity</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl bg-red-500/10 border border-red-500/40 px-5 py-6 text-sm text-red-300">
        {error}
      </div>
    );
  }

  if (id && (isBlog ? !blogRow : !row)) {
    return (
      <div className="rounded-2xl bg-white/5 border border-white/10 px-5 py-6 text-sm text-slate-400">
        {isBlog ? 'Post not found.' : 'Listing not found.'}
      </div>
    );
  }

  if (isBlog) {
    return (
      <BlogForm
        key={id ?? 'new-blog'}
        postId={id}
        initial={blogRow ? blogValuesFromRow(blogRow) : EMPTY_BLOG}
        initialCover={blogRow?.cover_path ?? null}
      />
    );
  }

  return (
    <ListingForm key={id ?? 'new'} listingId={id} initial={row ? toFormValues(row) : blankForm} initialPhotos={photos} />
  );
}

export default function AdminEditorPage() {
  return (
    <AdminGuard>
      <Editor />
    </AdminGuard>
  );
}
