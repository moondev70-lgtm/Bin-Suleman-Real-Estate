-- ============================================================================
-- 0004 — Seed the six demo articles as real blog_posts rows
--
-- The original /blog page shipped with six hardcoded fallback articles
-- (next/src/components/blog/BlogGrid.tsx). They were never database rows, so
-- the Blog CMS dashboard correctly showed "0 posts" while the public page
-- rendered the static fallback set. This script inserts all six as published
-- rows so they appear in /admin → Blog (editable/publishable/deletable) and
-- on the public /blog grid as live posts.
--
-- Run in the Supabase SQL editor after 0003_blog.sql.
-- Idempotent: seeds only while blog_posts is empty, and each row also carries
-- on conflict (slug) do nothing. Deleting the seeded posts later and re-running
-- this file will NOT resurrect them (the table is no longer empty).
--
-- Body text starts with the card copy; the public blog is card-only today, so
-- write the full article body in the dashboard whenever you're ready.
-- ============================================================================

insert into public.blog_posts
  (slug, title, category, excerpt, body, cover_path, author, read_time,
   badge, featured, published, sort_order, published_at)
select v.slug, v.title, v.category, v.excerpt, v.body, null, v.author,
       v.read_time, v.badge, v.featured, true, v.sort_order, v.published_at::date
from (values
  ('sector-j-vs-sector-c-1-kanal-guide',
   'The Ultimate Guide to Buying a 1 Kanal Plot in Sector J vs. Sector C: Pros, Cons & Price Gap',
   'Sector Comparative',
   'Sector C offers direct connectivity to the Phase 9 Main Boulevard and Ring Road, while Sector J features peaceful perimeter living near the civic center. We evaluate yield horizons, ground elevation levels, and realistic possession timing.',
   'The Ultimate Guide to Buying a 1 Kanal Plot in Sector J vs. Sector C: Pros, Cons & Price Gap

Sector C offers direct connectivity to the Phase 9 Main Boulevard and Ring Road, while Sector J features peaceful perimeter living near the civic center. We evaluate yield horizons, ground elevation levels, and realistic possession timing.',
   'Investment Desk', '6 min read', 'Price Delta: PKR 65 Lacs', true, 1, '2026-10-05'),

  ('open-files-vs-allocated-plots-pitfalls',
   'Avoiding Common Pitfalls When Buying Open DHA Files vs. Allocated Plots',
   'Risk Management',
   'Understand the direct legal difference between un-balloted file affidavits, allocation letters, and possession plots. Learn how to verify DHA verification slips, avoid counterfeit NDVP forms, and lock safe transfer fees.',
   'Avoiding Common Pitfalls When Buying Open DHA Files vs. Allocated Plots

Understand the direct legal difference between un-balloted file affidavits, allocation letters, and possession plots. Learn how to verify DHA verification slips, avoid counterfeit NDVP forms, and lock safe transfer fees.',
   'DHA Transfer Advisory', '5 min read', 'High Importance', false, 2, '2026-09-21'),

  ('ring-road-interchange-commercial-valuations',
   'How the New Ring Road Interchange Impacts Commercial Plot Valuations in Phase 9',
   'Infrastructure Impact',
   'The operational commissioning of the Southern Loop connection slashes transit times to Allama Iqbal International Airport to 12 minutes. Why commercial boulevard plots along 150-ft main roads are experiencing high corporate demand.',
   'How the New Ring Road Interchange Impacts Commercial Plot Valuations in Phase 9

The operational commissioning of the Southern Loop connection slashes transit times to Allama Iqbal International Airport to 12 minutes. Why commercial boulevard plots along 150-ft main roads are experiencing high corporate demand.',
   'Infrastructure Desk', '7 min read', 'Commercial Zone Hub', false, 3, '2026-09-04'),

  ('dha-transfers-guide-overseas-pakistanis',
   'Step-by-Step Guide to DHA Lahore Property Transfers for Non-Resident Pakistanis',
   'Overseas Protocol',
   'Complete walkthrough for buyers in the UK, UAE, USA, and Canada. How special power of attorney (SPA), embassy attestation, Roshan Digital Account (RDA) payments, and remote DHA sub-office transfers work seamlessly.',
   'Step-by-Step Guide to DHA Lahore Property Transfers for Non-Resident Pakistanis

Complete walkthrough for buyers in the UK, UAE, USA, and Canada. How special power of attorney (SPA), embassy attestation, Roshan Digital Account (RDA) payments, and remote DHA sub-office transfers work seamlessly.',
   'Overseas Desk', '9 min read', 'Overseas Desk #1', false, 4, '2026-08-18'),

  ('turnkey-villa-construction-cost-guide',
   'Turnkey Villa Construction Cost Guide: Material Rates & DHA By-Laws',
   'Construction & Architecture',
   'Understand DG/Maple Leaf cement price fluctuations, DHA Lahore by-laws, and architectural vetting procedures before groundbreaking.',
   'Turnkey Villa Construction Cost Guide: Material Rates & DHA By-Laws

Understand DG/Maple Leaf cement price fluctuations, DHA Lahore by-laws, and architectural vetting procedures before groundbreaking.',
   'Construction Desk', '8 min read', 'Villa Builders', false, 5, '2026-07-30'),

  ('prism-sector-classification-tier-1-vs-tier-2',
   'DHA Phase 9 Prism Sector Classification: Tier 1 vs Tier 2 Plots for 36-Month Capital Gain',
   'Monthly Barometer',
   'Where to park capital right now. We segment low-density park-facing residential plots in Sector E & F against commercial clusters in Zone 2 to maximize ROI ahead of full possession handovers.',
   'DHA Phase 9 Prism Sector Classification: Tier 1 vs Tier 2 Plots for 36-Month Capital Gain

Where to park capital right now. We segment low-density park-facing residential plots in Sector E & F against commercial clusters in Zone 2 to maximize ROI ahead of full possession handovers.',
   'Investment Desk', '6 min read', 'Projected 3-Yr ROI +44% to +58%', false, 6, '2026-07-12')
) as v(slug, title, category, excerpt, body, author, read_time, badge,
       featured, sort_order, published_at)
where not exists (select 1 from public.blog_posts)
on conflict (slug) do nothing;