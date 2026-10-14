'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { fetchBlogPosts, type BlogCardData } from '@/lib/blogs';

export type BlogPostsResult = {
  /** True while the first Supabase fetch has not resolved yet. */
  loading: boolean;
  /** Live published posts; null until first successful fetch (or on failure). */
  posts: BlogCardData[] | null;
  /** True when Supabase is not configured or the fetch failed (render static data). */
  usingFallback: boolean;
};

/**
 * Loads published blog_posts from Supabase in the browser (static export has
 * no server) and keeps them fresh via Postgres realtime. On any failure the
 * hook stays silent and exposes `usingFallback` so the caller can render the
 * hardcoded articles instead. Mirrors useListings.
 */
export function useBlogPosts(): BlogPostsResult {
  const [loading, setLoading] = useState<boolean>(isSupabaseConfigured());
  const [posts, setPosts] = useState<BlogCardData[] | null>(null);
  const mounted = useRef(true);

  const load = useCallback(async () => {
    const rows = await fetchBlogPosts();
    if (!rows) {
      // RLS/network failure or missing table (0003_blog.sql not run yet) →
      // caller keeps rendering the static fallback.
      if (mounted.current) setLoading(false);
      return;
    }
    if (mounted.current) {
      setPosts(rows);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    mounted.current = true;
    load();
    // Refetch when the tab regains focus — realtime safety net.
    const onFocus = () => load();
    window.addEventListener('focus', onFocus);
    return () => {
      mounted.current = false;
      window.removeEventListener('focus', onFocus);
    };
  }, [load]);

  // Realtime: any INSERT/UPDATE/DELETE on blog_posts refreshes the public page.
  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) return;
    const channel = supabase
      .channel('public-blog-posts')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'blog_posts' }, () => load())
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [load]);

  return {
    loading,
    posts,
    usingFallback: posts === null,
  };
}
