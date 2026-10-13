import Icon from '@/components/Icon';
import { site } from '@/content/site';
import { waLink } from '@/lib/whatsapp';

const expect = [
  { n: '01', icon: 'map', title: 'Unreleased Blueprint Access', desc: 'Examine large-format master town-planning maps, official contour levels, upcoming ring road ramps, and private investor inventory sheets before plots hit general marketing.' },
  { n: '02', icon: 'explore', title: 'Target Plot Site Escort', desc: 'Depart directly from our office in our private consultation vehicle to inspect the ground-level status, electrical cabling depth, sewerage grid, and sunlight orientation in Sector A–R.' },
  { n: '03', icon: 'fact_check', title: 'Full DHA Verification Record', desc: 'Receive verified legal records and intimation checks directly coordinated with the DHA Lahore Main Sub-Office before any financial tokens or deposits change hands.' },
];
export default function ContactSections() {
  return (
    <>
      <section className="w-full bg-surface-container-low border-y border-slate-200/70 py-10 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="rounded-3xl bg-slate-900 text-white p-6 sm:p-8 flex flex-col gap-4 relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full bg-secondary-container/10 blur-2xl" />
            <span className="inline-flex self-start px-3 py-1 rounded-full bg-white/10 text-secondary-container text-[11px] uppercase font-bold tracking-widest">Direct Gateway Access</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold">Suite 104, Prism Boulevard Hub</h2>
            <p className="text-xs text-slate-400">2 Minutes from DHA Phase 9 Main Monument Gate</p>
            <div className="flex flex-col gap-3 mt-2">
              <div className="flex items-start gap-3"><Icon name="pin_drop" className="text-secondary-container text-xl mt-0.5" /><div><p className="text-sm font-bold">Physical Office Address</p><p className="text-xs text-slate-400">Bin Suleman Real Estate &amp; Builders, Main Commercial Avenue (Adjacent Sector A Executive Strip), DHA Phase 9 Prism, Lahore, Pakistan.</p></div></div>
              <div className="flex items-start gap-3"><Icon name="schedule" className="text-secondary-container text-xl mt-0.5" /><div><p className="text-sm font-bold">Executive Office Timings</p><p className="text-xs text-slate-400">Mon – Sat: 10:00 AM – 8:00 PM • Sunday: By Prior Appointment</p></div></div>
              <div className="flex items-start gap-3"><Icon name="directions_car" className="text-secondary-container text-xl mt-0.5" /><div><p className="text-sm font-bold">DHA PRISM 9</p><p className="text-xs text-slate-400">12 Mins from Allama Iqbal Airport • Get Route</p></div></div>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="rounded-3xl bg-white border border-slate-200/80 p-6 flex flex-col gap-4">
              <p className="font-headline-sm text-headline-sm font-bold text-on-surface">Direct Response Line</p>
              <p className="text-xs text-on-surface-variant -mt-2">Avg. Response: 7 Mins</p>
              <a href={site.whatsappHref} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 rounded-2xl bg-surface-container-low hover:bg-secondary-fixed/40 transition-colors">
                <Icon name="forum" className="text-2xl text-secondary" />
                <div><p className="text-sm font-bold text-on-surface">Instant WhatsApp Desk</p><p className="text-xs text-on-surface-variant">{site.whatsappDisplay}</p></div>
              </a>
              <a href={waLink('Hello! I would like to reach the Bin Suleman direct response line.')} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 rounded-2xl bg-surface-container-low hover:bg-secondary-fixed/40 transition-colors">
                <Icon name="chat" className="text-2xl text-secondary" />
                <div><p className="text-sm font-bold text-on-surface">Direct Line (Call / WhatsApp)</p><p className="text-xs text-on-surface-variant">{site.phoneDisplay}</p></div>
              </a>
            </div>
            <div className="rounded-3xl bg-[#0a101d] text-white p-6 flex flex-col gap-3">
              <span className="inline-flex self-start px-3 py-1 rounded-full bg-secondary-container/20 text-secondary-container text-[11px] uppercase font-bold tracking-widest">Overseas Pakistani Concierge Desk</span>
              <p className="text-[11px] uppercase tracking-widest text-slate-400 font-bold">UK • UAE • USA • CANADA</p>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Based abroad? We orchestrate verified Power of Attorney (POA) transfers, real-time 4K video drone plot
                audits, and direct DHA accounts without requiring you to fly into Lahore.
              </p>
              <a href={site.whatsappHref} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 self-start px-5 py-3 rounded-full bg-[#25D366] text-[#062b16] text-xs font-bold hover:scale-105 transition-transform">
                <Icon name="chat" className="text-base" /> Connect via Overseas WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-10 sm:py-16 w-full">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-container/20 text-[#745c00] text-xs uppercase font-bold tracking-wider mb-3">
            The Bin Suleman Standard
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-on-surface tracking-tight leading-tight">
            What to Expect During Your Office Visit
          </h2>
          <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed mt-4">
            A structured, analytical session free from high-pressure sales maneuvers. We treat real estate investment
            as wealth preservation.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 mt-8 sm:mt-10">
          {expect.map((e) => (
            <div key={e.n} className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-extrabold text-secondary-container/70">{e.n}</span>
                <div className="w-10 h-10 rounded-lg bg-slate-900 text-white flex items-center justify-center">
                  <Icon name={e.icon} className="text-xl" />
                </div>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-on-surface leading-snug">{e.title}</h3>
              <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">{e.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}