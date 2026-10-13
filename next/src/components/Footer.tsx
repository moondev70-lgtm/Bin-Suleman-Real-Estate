import Link from 'next/link';
import { site } from '@/content/site';
import { waLink } from '@/lib/whatsapp';

const FB = 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z';
const YT = 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z';
const TT = 'M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.97v7.54c-.03 2.19-.8 4.38-2.28 6.01-1.69 1.86-4.14 2.89-6.64 2.82-3.13-.08-6.04-1.94-7.3-4.81-1.39-3.17-.67-7.05 1.78-9.45 2.17-2.14 5.37-2.84 8.27-1.92v4.06c-1.44-.57-3.12-.44-4.41.38-1.28.82-2.02 2.3-1.89 3.82.13 1.56 1.11 2.95 2.58 3.5 1.53.57 3.32.28 4.54-.78.78-.67 1.25-1.68 1.29-2.71V.02h-1.26z';
const WA = 'M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z';

const cols: Array<{ title: string; links: string[] }> = [
  { title: 'About', links: ['Find an Office', 'Market Magazine', 'Commercial & Corporate', 'DHA Phase 9 Prism', 'Etihad Town Phase 4', 'Official Accreditation'] },
  { title: 'Investments & Services', links: ['Residential Plots', 'Commercial Investment', 'Turnkey Villa Construction', 'DHA File Verification', 'Legal Transfer & Escrow', 'Plot Valuation Advisory'] },
  { title: 'Support & Advisory', links: ['Get Assistance', 'Schedule On-Site Visit', 'Overseas Pakistani Desk', 'DHA Transfer Fees Guide', 'Tax & FBR Consultation', 'Contact Advisory'] },
  { title: 'Trust & Assurance', links: ['Verified Allotments', 'Direct Developer Authorization', 'Zero Hidden Premiums', 'LDA Approval Status', 'Client Protection Charter'] },
];

const socials: Array<{ label: string; href: string; d: string }> = [
  { label: 'Facebook', href: site.socials.facebook, d: FB },
  { label: 'YouTube', href: site.socials.youtube, d: YT },
  { label: 'TikTok', href: site.socials.tiktok, d: TT },
  { label: 'WhatsApp', href: site.whatsappHref, d: WA },
];

export default function Footer() {
  return (
    <footer className="w-full bg-surface-container-lowest text-on-surface-variant border-t border-surface-container-high">
      <div className="max-w-7xl mx-auto px-gutter pt-space-xl pb-space-lg px-gutter-mobile">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-space-lg pb-space-xl border-b border-surface-container-high">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={site.logo} alt="BSR Golden Emblem" className="h-10 w-auto object-contain drop-shadow" />
            <div>
              <p className="font-headline-sm text-headline-sm font-extrabold text-on-surface">
                {site.brand} <span className="font-medium">{site.brandSuffix}</span>
              </p>
              <p className="font-label-caps text-label-caps uppercase text-secondary tracking-widest">
                Official Sales Partner • DHA Phase 9 Prism Direct Advisory & Construction
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:items-end gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-space-md py-space-sm rounded-full bg-gradient-to-r from-[#d4af37] to-[#e6ca65] text-[#0b1329] font-label-md text-label-md font-bold shadow-md hover:scale-105 transition-transform"
            >
              Schedule Consultation
            </Link>
            <a
              href={waLink('Hello Bin Suleman Real Estate & Builders, I would like to request a consultation.')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-space-md py-space-sm rounded-full bg-[#25D366] text-[#062b16] font-label-md text-label-md font-bold shadow-md hover:scale-105 transition-transform"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true"><path d={WA} /></svg>
              WhatsApp {site.phoneDisplay}
            </a>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-space-xl py-space-xl">
          {cols.map((col) => (
            <div key={col.title} className="flex flex-col gap-space-sm">
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface pb-space-xs">{col.title}</h3>
              {col.links.map((l) => (
                <a key={l} className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer" href="#">
                  {l}
                </a>
              ))}
            </div>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-md border-t border-surface-container-high pt-space-md">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3">
              {socials.map((s) => (
                <a key={s.label} aria-label={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="text-on-surface-variant hover:text-secondary transition-colors">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true"><path d={s.d} /></svg>
                </a>
              ))}
            </div>
            <span className="font-body-sm text-body-sm">🇵🇰 Pakistan (English)</span>
          </div>
          <div className="flex flex-wrap items-center gap-space-md font-label-md text-label-md">
            {['Privacy Policy', 'Investor Charter', 'Sales Terms', 'Terms of Service', 'Careers'].map((l) => (
              <a key={l} href="#" className="hover:text-on-surface transition-colors cursor-pointer">{l}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}