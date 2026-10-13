import Icon from '@/components/Icon';
import { site } from '@/content/site';
import { waLink } from '@/lib/whatsapp';

const groups = [
  { label: 'Ready / Early Possession', items: [['Sec A', '1 Kanal • 2 Kanal', '95% Complete'], ['Sec B', '1 Kanal • Ring Rd', '90% Complete'], ['Sec C', '1 Kanal • Boulevard', '88% Complete'], ['Sec D', '1 Kanal • Golf Facing', '82% Complete']] },
  { label: 'Heavy Machinery Active', items: [['Sec J', '1 Kanal • Sector Park', '70% Complete']] },
  { label: 'Earthwork & Balloting', items: [['Sec Q', '10 Marla • 1 Kanal', '55% Complete']] },
];

export default function BlogRadar() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-10 sm:py-16 w-full">
      <div className="rounded-3xl bg-surface-container-low border border-slate-200/70 p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-container/20 text-[#745c00] text-xs uppercase font-bold tracking-wider mb-3">
              Ground Reality Radar
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
              Phase 9 Prism Sector Possession Breakdown
            </h2>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          {groups.map((g) => (
            <div key={g.label} className="rounded-2xl bg-white border border-slate-200/80 p-4">
              <p className="text-[11px] uppercase tracking-widest font-bold text-secondary mb-3">{g.label}</p>
              <div className="flex flex-col gap-3">
                {g.items.map(([sec, detail, pct]) => (
                  <div key={sec}>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-on-surface">{sec}</span>
                      <span className="text-on-surface-variant">{pct}</span>
                    </div>
                    <p className="text-[11px] text-on-surface-variant">{detail}</p>
                    <div className="h-1.5 rounded-full bg-surface-container-high mt-1 overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-[#d4af37] to-[#e6ca65]" style={{ width: pct.replace('% Complete', '') + '%' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 p-5 rounded-2xl bg-white border border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <p className="flex items-center gap-2 text-sm font-bold text-on-surface"><Icon name="domain" className="text-xl text-secondary" /> On-Ground Headquarters</p>
            <p className="text-xs text-on-surface-variant mt-1 max-w-xl">
              Visiting DHA Phase 9 Prism? Meet Our Executive Advisory Team at Main Boulevard. Inspect your target plot
              in person with escorted four-wheel drive sector tours and direct sessions with DHA licensed town
              planners.
            </p>
            <p className="text-xs text-on-surface-variant mt-2 flex items-center gap-2">
              <Icon name="pin_drop" className="text-base text-secondary" /> Suite 104, Main Commercial Boulevard, Phase 9 Prism
              <span className="hidden sm:inline">•</span>
              <Icon name="access_time" className="text-base text-secondary" /> Mon–Sat: 10:00 AM – 7:00 PM
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <a href={site.whatsappHref} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-[#25D366] text-[#062b16] text-xs font-bold hover:scale-105 transition-transform">
              <Icon name="chat" className="text-base" /> Schedule WhatsApp Consultation
            </a>
            <a href={waLink('Hello! I would like to reach the Bin Suleman direct hotline.')} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-slate-100 hover:bg-secondary-fixed text-on-surface text-xs font-bold transition-colors">
              <Icon name="chat" className="text-base text-secondary" /> Direct Hotline: {site.phoneDisplay}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}