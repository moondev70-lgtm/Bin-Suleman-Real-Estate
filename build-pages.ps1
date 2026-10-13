# Build root pages from Stitch code.html: local images, wired nav, favicon, promo video
$ErrorActionPreference = 'Stop'
$root = 'C:\Users\lenovo\Downloads\AI Generated pics Moon\Bin Suleman Official Website'
$map = (Get-Content "$root\assets\image-map.json" -Raw | ConvertFrom-Json)
$urls = Get-Content "$root\urls.txt"
$posterUrl = $urls[8]          # 9th unique image (gate photo) as video poster
$poster = $map.$posterUrl
$pages = [ordered]@{
  'home_bin_suleman_real_estate\code.html'              = 'index.html'
  'about_us_bin_suleman_real_estate\code.html'          = 'about.html'
  'services_bin_suleman_real_estate\code.html'          = 'services.html'
  'blog_market_insights_bin_suleman_real_estate\code.html' = 'blog.html'
  'contact_us_bin_suleman_real_estate\code.html'        = 'contact.html'
}
$navMap = [ordered]@{
  'Home'        = 'index.html'
  'Listings'    = 'listings.html'
  'About Us'    = 'about.html'
  'Services'    = 'services.html'
  'Blog'        = 'blog.html'
  'Contact Us'  = 'contact.html'
}
$titles = @{
  'index.html'    = 'Bin Suleman Real Estate &amp; Builders | DHA Phase 9 Prism Lahore'
  'about.html'    = 'About Us | Bin Suleman Real Estate &amp; Builders'
  'services.html' = 'Services | Bin Suleman Real Estate &amp; Builders'
  'blog.html'     = 'DHA Phase 9 Prism Market Intelligence &amp; News | Bin Suleman Real Estate'
  'contact.html'  = 'Contact Us - Bin Suleman Real Estate &amp; Builders'
}
$desc = @{
  'index.html'    = 'Official sales partner for DHA Phase 9 Prism Lahore. Verified residential and commercial plots, file transfers and turnkey construction with institutional diligence.'
  'about.html'    = 'Bin Suleman Real Estate &amp; Builders — fiduciary DHA Lahore advisory built on transparency, on-ground verification and document diligence.'
  'services.html' = 'Residential plot advisory, commercial file trading, DHA document verification and turnkey architectural construction in DHA Phase 9 Prism.'
  'blog.html'     = 'DHA Phase 9 Prism market intelligence: possession roadmaps, sector progress, plot rates and overseas investor guides.'
  'contact.html'  = 'Book a private advisory session with Bin Suleman Real Estate &amp; Builders at DHA Phase 9 Prism, Lahore.'
}
  # 2b. normalize header pill -> in-flow (scrolls away with content)
  # 2b. normalize header pill -> in-flow (scrolls away with content)
# top bar + navbar animations (entrance, ambient, hover, scroll)
$barAnimStyle = @'
<style id="bsr-bar-anim">
:root{--bsr-gold:#fed65b;--bsr-ease:cubic-bezier(.16,1,.3,1)}

/* ============ 1. ENTRANCE (one-shot on load) ============ */
/* E1 - top bar slides down from above */
#bsr-topbar{transform:translateY(-100%);animation:bsrBarDrop .55s var(--bsr-ease) forwards,bsrBorderPulse 4s ease-in-out 1.4s infinite}
@keyframes bsrBarDrop{to{transform:translateY(0)}}
/* E2 - emblem reveal (transform lives on the WRAPPER so the scroll-condense can scale the img) */
.bsr-logo-wrap{display:inline-flex;align-items:center;opacity:0;animation:bsrEmblem .6s var(--bsr-ease) .12s both}
@keyframes bsrEmblem{from{opacity:0;transform:scale(.85) rotate(-6deg)}to{opacity:1;transform:scale(1) rotate(0)}}
#bsr-topbar .bsr-sheen,#bsr-topbar .bsr-call{opacity:0;animation:bsrFadeUp .5s var(--bsr-ease) .22s forwards}
@keyframes bsrFadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
/* E3 - nav pill drops in after the bar lands */
#bsr-navpill{opacity:0;animation:bsrNavDrop .45s var(--bsr-ease) .18s forwards}
@keyframes bsrNavDrop{from{opacity:0;transform:translateY(-10px) scale(.97)}to{opacity:1;transform:translateY(0) scale(1)}}
/* E4 - nav links stagger in (no fill-forwards so :hover transform still works) */
#bsr-navpill nav a{animation:bsrFadeUp .45s var(--bsr-ease) backwards}
#bsr-navpill nav a:nth-child(1){animation-delay:.26s}
#bsr-navpill nav a:nth-child(2){animation-delay:.33s}
#bsr-navpill nav a:nth-child(3){animation-delay:.4s}
#bsr-navpill nav a:nth-child(4){animation-delay:.47s}
#bsr-navpill nav a:nth-child(5){animation-delay:.54s}
#bsr-navpill nav a:nth-child(6){animation-delay:.61s}
/* E5 - active gold pill wipes in left-to-right */
#bsr-navpill nav a[aria-current="page"]{animation:bsrPillSweep .5s var(--bsr-ease) .62s backwards}
@keyframes bsrPillSweep{from{clip-path:inset(0 100% 0 0 round 9999px)}to{clip-path:inset(0 0 0 0 round 9999px)}}
/* Blinking golden dot (nav Listings badge) */
.bsr-navdot{display:inline-block;width:7px;height:7px;border-radius:9999px;background:#fed65b;box-shadow:0 0 6px rgba(254,214,91,.9);animation:bsrDotBlink 1.3s ease-in-out infinite}
@keyframes bsrDotBlink{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.25;transform:scale(.7)}}

/* ============ 2. AMBIENT ============ */
/* A1 - gold sheen sweeping across "Bin Suleman" */
#bsr-topbar .bsr-sheen{background-image:linear-gradient(100deg,#fed65b 0%,#fff9e0 42%,#fed65b 58%,#fed65b 100%);background-size:250% 100%;background-position:150% 0;-webkit-background-clip:text;background-clip:text;color:transparent;animation:bsrFadeUp .5s var(--bsr-ease) .22s forwards,bsrSheen 6s linear 1.5s infinite}
@keyframes bsrSheen{0%{background-position:150% 0}55%,100%{background-position:-60% 0}}
/* A3 - phone icon micro-wiggle every ~6s */
#bsr-callicon{display:inline-block;transform-origin:50% 50%;animation:bsrWiggle 6s ease-in-out 2.2s infinite}
@keyframes bsrWiggle{0%,86%,100%{transform:rotate(0)}88%{transform:rotate(-10deg)}90%{transform:rotate(10deg)}92%{transform:rotate(-7deg)}94%{transform:rotate(7deg)}96%{transform:rotate(0)}}
/* A4 - gold bottom border breathes */
@keyframes bsrBorderPulse{0%,100%{border-bottom-color:rgba(254,214,91,.25)}50%{border-bottom-color:rgba(254,214,91,.62)}}

/* ============ 3. HOVER MICRO-INTERACTIONS ============ */
#bsr-navpill nav{position:relative}
#bsr-navpill nav a{position:relative;transition:transform .25s var(--bsr-ease),background-color .25s,color .25s,text-shadow .25s}
#bsr-navpill nav a:hover{transform:translateY(-1px);text-shadow:0 0 10px rgba(254,214,91,.55)}
/* M1 - gold underline slides in (hidden on the active pill, which is already gold) */
#bsr-navpill nav a::after{content:'';position:absolute;left:12px;right:12px;bottom:4px;height:2px;border-radius:9999px;background:linear-gradient(90deg,#d4af37,#e6ca65);transform:scaleX(0);transform-origin:left;transition:transform .3s var(--bsr-ease)}
#bsr-navpill nav a:hover::after{transform:scaleX(1)}
#bsr-navpill nav a[aria-current="page"]::after{display:none}
/* M2 - sliding gold indicator (positioned by the script) */
.bsr-navind{position:absolute;left:0;bottom:4px;top:auto;height:2px;border-radius:0;pointer-events:none;opacity:0;background:linear-gradient(90deg,#d4af37,#fed65b);transition:transform .28s var(--bsr-ease),width .28s var(--bsr-ease),opacity .2s}

/* ============ 4. SCROLL-REACTIVE ============ */
/* S1 - the bar gains weight on scroll. Only colour/shadow/scale change, so there is NO layout shift. */
#bsr-topbar{transition:background-color .3s var(--bsr-ease),box-shadow .3s var(--bsr-ease),border-bottom-color .3s}
#bsr-topbar.bsr-scrolled{background-color:rgba(8,13,26,.98);box-shadow:0 10px 28px -10px rgba(0,0,0,.65)}
#bsr-emblem{transition:transform .3s var(--bsr-ease)}
#bsr-topbar.bsr-scrolled #bsr-emblem{transform:scale(.88)}
/* S2 - gold reading-progress line pinned to the bar's bottom edge */
#bsr-progress{position:absolute;left:0;bottom:-1px;height:2px;width:100%;transform:scaleX(0);transform-origin:left;background:linear-gradient(90deg,#d4af37,#fed65b,#fff3c4);pointer-events:none;will-change:transform}
/* ============ 5. STICKY NAV (S3) ============ */
/* becomes fixed under the top bar, slides down on scroll-up and away on scroll-down */
#bsr-navwrap.bsr-sticky{position:fixed;left:0;right:0;z-index:45;will-change:transform;transform:translateY(-200%);transition:transform .35s var(--bsr-ease)}
#bsr-navwrap.bsr-sticky.bsr-show{transform:translateY(0)}
#bsr-navph{display:none}

/* ============ 7. PAGE TRANSITION (B1) ============ */
/* pure CSS arrival (lifts even if the script never runs) + class-driven departure */
#bsr-wipe{position:fixed;inset:0;z-index:70;pointer-events:none;background:linear-gradient(150deg,#080d1a 0%,#151c2e 55%,#080d1a 100%);border-bottom:2px solid rgba(254,214,91,.5);transform:scaleY(1);transform-origin:top;animation:bsrWipeAway .45s var(--bsr-ease) .04s forwards}
@keyframes bsrWipeAway{to{transform:scaleY(0)}}
html.bsr-leaving #bsr-wipe{animation:none;transform:scaleY(0);transform-origin:bottom;border-bottom:0;border-top:2px solid rgba(254,214,91,.5)}
html.bsr-leaving.bsr-go #bsr-wipe{transform:scaleY(1);transition:transform .4s var(--bsr-ease)}

/* ============ 8. ACCESSIBILITY FLOOR ============ */
@media (prefers-reduced-motion: reduce){
#bsr-topbar,#bsr-topbar *,#bsr-navpill,#bsr-navpill *,.bsr-logo-wrap,#bsr-navwrap{animation:none!important;transition:none!important}
#bsr-topbar,#bsr-emblem,#bsr-navpill,#bsr-navpill nav a,#bsr-topbar .bsr-sheen,#bsr-topbar .bsr-call,.bsr-logo-wrap,#bsr-navwrap.bsr-sticky{transform:none;opacity:1;clip-path:none}
#bsr-progress,.bsr-navind{display:none}
.bsr-navdot{animation:none}
#bsr-wipe{display:none}
}
</style>
'@
$barAnimJs = @'
<script id="bsr-bar-anim-js">
(function(){try{
  var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var bar=document.getElementById('bsr-topbar');
  if(!bar)return;
  var pill=document.getElementById('bsr-navpill');
  var prog=document.getElementById('bsr-progress');
  var spacer=document.getElementById('bsr-topspacer');
  var navwrap=document.getElementById('bsr-navwrap');
  var desk=window.matchMedia?window.matchMedia('(min-width:640px)'):null;
  var GAP=0; /* nav sits flush against the fixed bar */

  /* keep the flow spacer exactly as tall as the fixed bar (+ extra gap on desktop only) */
  function syncSpacer(){var g=(desk&&desk.matches)?GAP:0;if(spacer)spacer.style.height=(bar.offsetHeight+g)+'px';}
  syncSpacer();
  window.addEventListener('resize',syncSpacer,{passive:true});
  window.addEventListener('load',syncSpacer);

  /* M2 - sliding gold indicator: desktop pointers only, never on touch */
  if(!reduce&&pill&&window.matchMedia&&window.matchMedia('(hover:hover) and (pointer:fine)').matches){
    var nav=pill.querySelector('nav');
    if(nav){
      var ind=document.createElement('span');
      ind.className='bsr-navind';ind.setAttribute('aria-hidden','true');
      nav.appendChild(ind);
      var move=function(a){ind.style.width=a.offsetWidth+'px';ind.style.transform='translateX('+a.offsetLeft+'px)';ind.style.opacity='1';};
      nav.addEventListener('pointerover',function(e){var a=e.target.closest('a');if(a)move(a);});
      nav.addEventListener('focusin',function(e){var a=e.target.closest('a');if(a)move(a);});
      nav.addEventListener('pointerleave',function(){ind.style.opacity='0';});
    }
  }

  /* B1 - page transition. Cosmetic only, and skipped entirely when motion is reduced. */
  if(!reduce){
    var wipe=document.getElementById('bsr-wipe');
    if(wipe){
      document.addEventListener('click',function(e){
        try{
          if(e.defaultPrevented||e.button||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
          var a=e.target&&e.target.closest?e.target.closest('a[href]'):null;
          if(!a||a.target==='_blank'||a.hasAttribute('download'))return;
          var href=a.getAttribute('href')||'';
          if(!href||href.charAt(0)==='#')return;
          if(!/\.html(\?|#|$)/i.test(href))return;
          if(a.host&&a.host!==location.host)return;
          e.preventDefault();
          document.documentElement.classList.add('bsr-leaving');
          requestAnimationFrame(function(){requestAnimationFrame(function(){
            document.documentElement.classList.add('bsr-go');
            setTimeout(function(){location.href=href;},380);
          });});
        }catch(err){}
      });
      /* back/forward-cache restore must never leave the curtain up */
      window.addEventListener('pageshow',function(){
        document.documentElement.classList.remove('bsr-leaving','bsr-go');
      });
    }
  }

  if(reduce)return;

  /* S3 - sticky nav needs a placeholder so the page never jumps when the nav goes fixed */
  var navph=null,navH=0,stickLast=false;
  if(navwrap){
    navph=document.createElement('div');
    navph.id='bsr-navph';navph.setAttribute('aria-hidden','true');
    navwrap.parentNode.insertBefore(navph,navwrap.nextSibling);
    navH=navwrap.offsetHeight;
    navph.style.height=navH+'px';
  }
  function remeasure(){
    if(!navwrap)return;
    var was=navwrap.classList.contains('bsr-sticky');
    if(was)navwrap.classList.remove('bsr-sticky');
    navH=navwrap.offsetHeight;
    if(navph)navph.style.height=navH+'px';
    if(was)navwrap.classList.add('bsr-sticky');
  }
  window.addEventListener('resize',remeasure,{passive:true});
  window.addEventListener('resize',frame,{passive:true});

  /* S1 + S2 + S3 - rAF-throttled scroll loop */
  var last=null,prevY=0,ticking=false;
  function frame(){
    ticking=false;
    var y=window.pageYOffset||document.documentElement.scrollTop||0;
    var on=y>24;
    if(on!==last){bar.classList.toggle('bsr-scrolled',on);syncSpacer();last=on;}
    if(prog){
      var max=document.documentElement.scrollHeight-window.innerHeight;
      prog.style.transform='scaleX('+(max>0?Math.min(1,y/max):0)+')';
    }
    if(navwrap){
      var stick=y>320;
      /* the inline top may only apply while sticky (or on mobile, preserving its
         current look): on desktop the nav is position:relative in flow, and a
         leftover top value would visually shove it down over the page content */
      if(stick||!desk||!desk.matches){navwrap.style.top=bar.offsetHeight+'px';}
      else if(navwrap.style.top){navwrap.style.top='';}
      if(stick!==stickLast){
        navwrap.classList.toggle('bsr-sticky',stick);
        if(navph){navph.style.display=stick?'block':'none';navph.style.height=navH+'px';}
        stickLast=stick;
      }
      if(stick){
        if(y<prevY-2)navwrap.classList.add('bsr-show');
        else if(y>prevY+2)navwrap.classList.remove('bsr-show');
      }else{
        navwrap.classList.remove('bsr-show');
      }
    }
    prevY=y;
  }
  window.addEventListener('scroll',function(){if(!ticking){ticking=true;requestAnimationFrame(frame);}},{passive:true});
  frame();
}catch(e){}});
</script>
'@
  $outer = '<header id="bsr-navwrap" class="relative z-40 w-full">'
$logoBar = @'
<!-- STATIONARY TOP LOGO BAR (fixed; stays on scroll) -->
<div id="bsr-topbar" class="fixed top-0 inset-x-0 z-50 w-full bg-[#080d1a]/95 backdrop-blur-md border-b border-[#fed65b]/25">
  <div class="bsr-bar-inner max-w-7xl mx-auto flex items-center justify-between gap-3 px-3 sm:px-6 py-2">
    <a href="index.html" class="flex items-center gap-2 sm:gap-3 min-w-0" aria-label="Bin Suleman Real Estate &amp; Builders - Home">
      <span class="bsr-logo-wrap shrink-0"><img id="bsr-emblem" alt="BSR Golden Emblem" class="h-5 sm:h-6 w-auto object-contain shrink-0 filter drop-shadow" src="__LOGO__"></span>
      <span class="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#fed65b] whitespace-nowrap"><span class="bsr-sheen">Bin Suleman</span> <span class="text-slate-200 font-medium">Real Estate &amp; Builders</span></span>
    </a>
    <a class="bsr-call inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold text-[#fed65b] hover:text-white transition-colors shrink-0" href="tel:+923009484188">
      <span id="bsr-callicon" class="material-symbols-outlined text-sm sm:text-base">call</span>
      <span class="hidden sm:inline">+92 300 9484188</span>
      <span class="sm:hidden">Call</span>
    </a>
  </div>
  <span id="bsr-progress" aria-hidden="true"></span>
</div>
<div id="bsr-wipe" aria-hidden="true"></div><!-- spacer compensating the fixed bar -->
<div id="bsr-topspacer" class="h-10 w-full" aria-hidden="true"></div>
 class="h-10 w-full" aria-hidden="true"></div>
'@
$logoBar = $logoBar.Replace('__LOGO__', 'assets/images/img-1-ab6axuaiqxcc.png')
# pulsing WhatsApp floating button (bottom-right) injected before </body> on every page
$waFloat = @'
<!-- ===== BSR WhatsApp Floating Button (pulsing, bottom-right, all pages) ===== -->
<div id="bsr-whatsapp-float" class="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[60] flex flex-col items-end gap-2">
  <span id="bsr-wa-hint" class="hidden sm:inline-block opacity-0 translate-x-2 transition-all duration-300 pointer-events-none bg-[#080d1a]/95 border border-[#fed65b]/40 text-[#fed65b] text-[11px] font-semibold rounded-full px-3 py-1.5 shadow-xl whitespace-nowrap">Chat on WhatsApp</span>
  <a id="bsr-wa-btn" href="https://wa.me/923009484188?text=Hello%20Bin%20Suleman%20Real%20Estate%20%26%20Builders%2C%20I%20would%20like%20to%20inquire%20about%20DHA%20Phase%209%20Prism." target="_blank" rel="noopener noreferrer" aria-label="Chat with Bin Suleman Real Estate &amp; Builders on WhatsApp" class="bsr-wa-btn group relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full shrink-0">
    <span class="bsr-wa-ring" aria-hidden="true"></span>
    <span class="bsr-wa-ring bsr-wa-ring-delay" aria-hidden="true"></span>
    <svg class="relative z-10 w-7 h-7 sm:w-8 sm:h-8 fill-current" viewBox="0 0 24 24" aria-hidden="true"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"></path></svg>
  </a>
</div>
<style>
  #bsr-whatsapp-float { -webkit-tap-highlight-color: transparent; }
  .bsr-wa-btn { background: linear-gradient(135deg,#25D366 0%,#1EBE5A 100%); color: #ffffff; box-shadow: 0 10px 25px -5px rgba(37,211,102,.55), 0 0 0 1px rgba(254,214,91,.35) inset; transition: transform .25s ease, box-shadow .25s ease; animation: bsrWaBreathe 2.4s ease-in-out infinite; }
  .bsr-wa-btn:hover { transform: scale(1.08); box-shadow: 0 14px 34px -6px rgba(37,211,102,.75), 0 0 0 1px rgba(254,214,91,.65) inset; }
  .bsr-wa-ring { position: absolute; inset: 0; border-radius: 9999px; background: #25D366; opacity: .5; animation: bsrWaPulse 2.2s cubic-bezier(.24,.1,.36,1) infinite; }
  .bsr-wa-ring-delay { animation-delay: 1.1s; }
  #bsr-whatsapp-float:hover #bsr-wa-hint { opacity: 1; transform: translateX(0); }
  @keyframes bsrWaPulse { 0% { transform: scale(1); opacity: .5; } 70% { transform: scale(1.85); opacity: 0; } 100% { transform: scale(1.85); opacity: 0; } }
  @keyframes bsrWaBreathe { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.06); } }
  @media (prefers-reduced-motion: reduce) { .bsr-wa-ring { animation: none; opacity: 0; } .bsr-wa-btn { animation: none; } }
</style>
'@
  $outer = '<header id="bsr-navwrap" class="relative z-40 w-full">'
$videoBlock = @'
<!-- 7.5 OFFICIAL PROMO SHOWREEL -->
<section class="w-full py-12 sm:py-16 bg-white border-b border-slate-200/70">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
    <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6 sm:mb-8">
      <div>
        <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-container/20 text-[#745c00] text-xs uppercase font-bold tracking-wider mb-3">Official Showreel</span>
        <h2 class="text-2xl sm:text-4xl font-extrabold text-on-surface tracking-tight">Experience DHA Phase 9 Prism.</h2>
      </div>
      <p class="text-xs sm:text-sm text-on-surface-variant max-w-md">A guided visual tour of Lahore's most ambitious master-planned community — presented by Bin Suleman Real Estate &amp; Builders.</p>
    </div>
    <div class="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl bg-[#0b1329] border border-slate-200">
      <div class="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl bg-[#0b1329] border border-slate-200">
      <img src="__POSTER__" alt="DHA Phase 9 Prism official showreel thumbnail" class="w-full h-auto max-h-[80vh] object-cover">
      <button type="button" data-yt="oKLqG8-YquY" aria-label="Play the DHA Phase 9 Prism showreel on YouTube" onclick="(function(b){var c=b.parentNode,f=document.createElement('iframe');f.title='DHA Phase 9 Prism showreel';f.src='https://www.youtube.com/embed/'+b.getAttribute('data-yt')+'?autoplay=1&amp;rel=0';f.allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';f.allowFullscreen=true;f.style.cssText='position:absolute;inset:0;width:100%;height:100%;border:0;z-index:10';c.appendChild(f);b.style.display='none';})(this)" class="absolute inset-0 w-full flex items-center justify-center group cursor-pointer" style="border:0;padding:0;background:transparent">
        <span class="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-secondary-container/95 shadow-2xl group-hover:scale-110 transition-transform">
          <span class="material-symbols-outlined text-3xl sm:text-4xl text-[#0b1329]">play_arrow</span>
        </span>
      </button>
    </div>
    </div>
  </div>
</section>
'@

foreach ($src in $pages.Keys) {
  $out = $pages[$src]
  $html = Get-Content "$root\$src" -Raw -Encoding UTF8
  # 1. localise images
  foreach ($u in $urls) {
    if ($map.PSObject.Properties[$u]) { $html = $html.Replace($u, $map.$u) }
  }
  # 2. wire nav links by label
  foreach ($label in $navMap.Keys) {
    $target = $navMap[$label]
    $pattern = '<a([^>]*href=")[^"]*("[^>]*>' + [regex]::Escape($label) + '</a>)'
    $html = [regex]::Replace($html, $pattern, ('<a$1' + $target + '$2'))
  }
  # 2b. normalize responsive header pill -> in-flow so it scrolls away with the page
  $outer = '<header id="bsr-navwrap" class="relative z-40 w-full">'
  $links = ''
  foreach ($label in $navMap.Keys) {
    $target = $navMap[$label]
    $active = ($target -eq $out)
    $cls = if ($active) { 'inline-flex items-center gap-1.5 px-3 py-2 text-[11px] sm:text-xs font-bold text-[#fed65b] shrink-0' }
           else { 'inline-flex items-center gap-1.5 px-3 py-2 text-[11px] sm:text-xs font-semibold text-slate-300 hover:text-[#fed65b] transition-colors shrink-0' }
    $aria = if ($active) { ' aria-current="page"' } else { '' }
    $dot = if ($target -eq 'listings.html') { '<span class="bsr-navdot" aria-hidden="true"></span>' } else { '' }
    $links += ('<a href="' + $target + '"' + $aria + ' class="' + $cls + '">' + $label + $dot + '</a>')
  }
  $newHeader = $outer + '<div id="bsr-navpill" class="w-full bg-[#080d1a]/95 backdrop-blur-md border-b border-[#fed65b]/25 px-3 sm:px-6 py-1.5 max-w-full overflow-x-auto scrollbar-none pointer-events-auto flex items-center justify-center"><nav class="flex flex-wrap items-center justify-center gap-x-0.5 gap-y-1.5 sm:flex-nowrap sm:gap-1 whitespace-nowrap">' + $links + '</nav></div></header>'
  $html = [regex]::Replace($html, '<header\b.*?</header>', $newHeader, 'Singleline')
  # 2c. remove legacy announcement/logo bars (index fixed aside, blog in-flow div)
  $html = [regex]::Replace($html, '<aside aria-label="Official Partnership Notice".*?</aside>\s*', '', 'Singleline')
  $html = [regex]::Replace($html, '<!-- 1\. TOP ANNOUNCEMENT BAR -->\s*', '')
  $html = [regex]::Replace($html, '<!-- 1\. Top Announcement Bar -->\s*<div class="w-full bg-\[#0b1329\][^>]*>.*?</div></div></div>\s*', '', 'Singleline')
  # 2d. inject stationary top logo bar (fixed) + spacer right after <body>
  $html = [regex]::Replace($html, '(<body[^>]*>)', ('$1' + $logoBar), 'Singleline')
  # 2e. drop any stray pre-header bars/comments between the spacer and <header>
  $html = [regex]::Replace($html, '(<!-- spacer compensating the fixed bar -->\s*<div[^>]*></div>).*?(?=<header)', '$1', 'Singleline')
  # 2g. inject pulsing WhatsApp floating button before </body> (idempotent)
  if ($html -notmatch 'id="bsr-whatsapp-float"') {
    $html = $html.Replace('</body>', ($waFloat + "`r`n" + '</body>'))
  }
  # 2h. top bar + nav animations: CSS into <head>, script before </body> (idempotent)
  if ($html -notmatch 'id="bsr-bar-anim"') {
    $html = $html.Replace('</head>', ($barAnimStyle + "`r`n" + '</head>'))
  }
  if ($html -notmatch 'id="bsr-bar-anim-js"') {
    $html = $html.Replace('</body>', ($barAnimJs + "`r`n" + '</body>'))
  }
  # 2f. canonical business social links everywhere
  $tiktok = 'https://www.tiktok.com/@binsulemanrealestate?is_from_webapp=1&sender_device=pc'
  $youtube = 'https://www.youtube.com/@BinSulemanRealEstate'
  $instagram = 'https://www.instagram.com/binsulemanrealestate/'
  $facebook = 'https://www.facebook.com/BinSulemanRealEstateOfficial'
  # placeholder URLs pointing at bare domains
  $html = [regex]::Replace($html, 'https?://(www\.)?tiktok\.com[^"''>\s]*', $tiktok)
  $html = [regex]::Replace($html, 'https?://(www\.)?youtube\.com/(?!embed/)[^"''>\s]*', $youtube)
  # footer social icons with dead href="#" placeholders
  $html = [regex]::Replace($html, '(<a[^>]*aria-label="TikTok"[^>]*?)href="#"', ('$1href="' + $tiktok + '" target="_blank" rel="noopener"'))
  $html = [regex]::Replace($html, '(<a[^>]*aria-label="YouTube"[^>]*?)href="#"', ('$1href="' + $youtube + '" target="_blank" rel="noopener"'))
  $html = [regex]::Replace($html, '(<a[^>]*aria-label="Instagram"[^>]*?)href="#"', ('$1href="' + $instagram + '" target="_blank" rel="noopener"'))
  $html = [regex]::Replace($html, 'https?://(www\.)?facebook\.com[^"''>\s]*', $facebook)
  $html = [regex]::Replace($html, '(<a[^>]*aria-label="Facebook"[^>]*?)href="#"', ('$1href="' + $facebook + '" target="_blank" rel="noopener"'))
  # 3. favicon after viewport meta
  $favicon = '<link rel="icon" type="image/x-icon" href="assets/images/favicon.ico"><link rel="shortcut icon" href="favicon.ico"><link rel="apple-touch-icon" href="assets/images/bsr-logo.png">'
  if ($html -notmatch 'rel="icon"') {
    $html = [regex]::Replace($html, '(<meta content="width=device-width[^>]*>)', ('$1' + $favicon))
  }
  # 4. title + description
  if ($html -notmatch '<title>') {
    $html = [regex]::Replace($html, '(<meta content="width=device-width[^>]*>)', ('$1<title>' + $titles[$out] + '</title>'))
  }
  if ($html -notmatch 'name="description"') {
    $html = [regex]::Replace($html, '(</title>)', ('$1<meta name="description" content="' + $desc[$out] + '">'))
  }
  # 5. promo video block on home page
  if ($out -eq 'index.html' -and $html -notmatch 'oKLqG8-YquY') {
    $block = $videoBlock.Replace('__POSTER__', $poster)
    $html = $html.Replace('<!-- 8. OFFICE VISIT & CALL CONSULTATION CTA SECTION -->', ($block + "`r`n" + '<!-- 8. OFFICE VISIT & CALL CONSULTATION CTA SECTION -->'))
  }
  Set-Content -Path "$root\$out" -Value $html -Encoding UTF8 -NoNewline
  Write-Host "BUILT $out"
}
Write-Host 'PAGES DONE'
