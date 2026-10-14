import { getSupabase } from './supabase/client';
import { formatDbDate } from './format';

/** DB row for `public.blog_posts` (supabase/migrations/0003_blog.sql). */
export interface BlogPostRow {
  id: string;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  body: string;
  cover_path: string | null;
  author: string;
  read_time: string;
  badge: string;
  featured: boolean;
  published: boolean;
  sort_order: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

/** Card fields shared by Supabase posts and the hardcoded fallback articles. */
export interface BlogCardData {
  id: string;
  title: string;
  desc: string;
  cat: string;
  badge: string | null;
  meta: string;
  /** Bottom-left label on the card — the display date for DB posts. */
  tag: string;
}

/** Public URL for a cover object in the public `blog` bucket. */
export function blogCoverUrl(path: string | null): string | null {
  if (!path) return null;
  const supabase = getSupabase();
  if (!supabase) return null;
  return supabase.storage.from('blog').getPublicUrl(path).data.publicUrl;
}

/** DB row → card model (`published_at` wins over the insert time for the date). */
export function mapBlogPost(row: BlogPostRow): BlogCardData {
  const author = row.author?.trim() || 'Bin Suleman';
  const readTime = row.read_time?.trim();
  return {
    id: row.id,
    title: row.title,
    desc: row.excerpt ?? '',
    cat: row.category || 'News',
    badge: row.badge?.trim() || null,
    meta: `By ${author}${readTime ? ` • ${readTime}` : ''}`,
    tag: formatDbDate(row.published_at ?? row.created_at.slice(0, 10)),
  };
}

/**
 * Published posts only (RLS also enforces this for anon; the explicit filter
 * keeps a signed-in admin from seeing drafts on the public page). Returns null
 * on any failure so the caller renders the hardcoded fallback articles — the
 * same contract as the listings fetch in useListings.
 */
export async function fetchBlogPosts(): Promise<BlogCardData[] | null> {
  const supabase = getSupabase();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('published', true)
    .order('sort_order', { ascending: true })
    .order('published_at', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false });
  if (error || !data) {
    console.warn('[blog] Supabase fetch failed, using fallback:', error?.message);
    return null;
  }
  return (data as unknown as BlogPostRow[]).map(mapBlogPost);
}
