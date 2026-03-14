'use client';

import { useEffect, useRef } from 'react';
import { Link } from '@/i18n/routing';
import type { Category, Destination } from '@/lib/types';

// ─── Category icon SVGs ───────────────────────────────────────────────────────
const CategoryIcon = ({ cat }: { cat: Category }) => {
  switch (cat) {
    case 'mountain':
      return (
        <svg viewBox="0 0 48 48" fill="none" className="w-7 h-7">
          <path d="M4 40 L16 16 L24 28 L32 12 L44 40 Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" fill="currentColor" fillOpacity="0.15"/>
          <path d="M28 20 L32 12 L44 40" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round"/>
          <path d="M4 40 L16 16 L24 28" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round"/>
          <path d="M29 20 L32 12 L35 20" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" fill="white" fillOpacity="0.5"/>
        </svg>
      );
    case 'beach':
      return (
        <svg viewBox="0 0 48 48" fill="none" className="w-7 h-7">
          <circle cx="36" cy="12" r="7" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="2.5"/>
          <path d="M4 32 Q12 26 20 32 Q28 38 36 32 Q44 26 48 32" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
          <path d="M4 38 Q12 32 20 38 Q28 44 36 38 Q44 32 48 38" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.5"/>
          <path d="M12 32 L18 16 M12 32 L28 26" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
        </svg>
      );
    case 'culture':
      return (
        <svg viewBox="0 0 48 48" fill="none" className="w-7 h-7">
          <rect x="6" y="30" width="36" height="12" rx="1" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="2.5"/>
          <path d="M10 30 L10 18 M18 30 L18 18 M30 30 L30 18 M38 30 L38 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <path d="M4 18 L24 6 L44 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M20 30 L20 22 Q24 20 28 22 L28 30" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.2"/>
          <circle cx="24" cy="10" r="2" fill="currentColor"/>
        </svg>
      );
    case 'desert':
      return (
        <svg viewBox="0 0 48 48" fill="none" className="w-7 h-7">
          <path d="M2 36 Q12 20 24 28 Q36 36 46 22" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="currentColor" fillOpacity="0.1"/>
          <path d="M2 42 Q14 30 26 36 Q38 42 46 30" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="currentColor" fillOpacity="0.08"/>
          <circle cx="36" cy="10" r="6" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="2.5"/>
          <path d="M30 10 Q28 8 26 10 Q28 12 30 10Z" fill="currentColor" fillOpacity="0.4"/>
        </svg>
      );
    case 'nature':
      return (
        <svg viewBox="0 0 48 48" fill="none" className="w-7 h-7">
          <path d="M24 40 L24 20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
          <path d="M24 28 Q16 24 12 14 Q20 10 28 18" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.15" strokeLinejoin="round"/>
          <path d="M24 22 Q30 16 38 14 Q38 24 28 26" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.15" strokeLinejoin="round"/>
          <ellipse cx="24" cy="42" rx="8" ry="2" fill="currentColor" fillOpacity="0.2"/>
        </svg>
      );
    case 'food':
      return (
        <svg viewBox="0 0 48 48" fill="none" className="w-7 h-7">
          <path d="M8 12 L8 22 Q8 30 16 30 L16 42" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M8 12 Q12 8 16 12 M16 12 Q20 8 24 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <path d="M32 8 L32 22 Q32 30 36 30 L36 42" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
          <path d="M28 8 Q28 20 36 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      );
  }
};

// ─── Category gradient map ────────────────────────────────────────────────────
const catGradient: Record<Category, string> = {
  mountain: 'from-emerald-500/20 to-green-700/30',
  beach:    'from-sky-400/20 to-blue-600/30',
  culture:  'from-amber-400/20 to-orange-600/30',
  desert:   'from-yellow-400/20 to-orange-500/30',
  nature:   'from-green-400/20 to-emerald-600/30',
  food:     'from-rose-400/20 to-red-600/30',
};
const catColor: Record<Category, string> = {
  mountain: 'text-emerald-400',
  beach:    'text-sky-400',
  culture:  'text-amber-400',
  desert:   'text-yellow-400',
  nature:   'text-green-400',
  food:     'text-rose-400',
};
const catBorder: Record<Category, string> = {
  mountain: 'border-emerald-500/20 hover:border-emerald-400/50',
  beach:    'border-sky-500/20 hover:border-sky-400/50',
  culture:  'border-amber-500/20 hover:border-amber-400/50',
  desert:   'border-yellow-500/20 hover:border-yellow-400/50',
  nature:   'border-green-500/20 hover:border-green-400/50',
  food:     'border-rose-500/20 hover:border-rose-400/50',
};

// ─── CSS-only scenic illustration per destination ─────────────────────────────
function DestinationIllustration({ dest }: { dest: Destination }) {
  const name = dest.name.en.toLowerCase();

  // Pick illustration based on destination name keywords
  if (name.includes('wadi') || name.includes('shab') || name.includes('tiwi') || name.includes('bimmah')) {
    // Wadi - blue water + rocky canyon walls
    return (
      <div className="relative w-full h-full overflow-hidden">
        {/* Sky */}
        <div className="absolute inset-0 bg-gradient-to-b from-sky-400/80 to-sky-200/60" />
        {/* Canyon walls */}
        <div className="absolute bottom-0 left-0 w-2/5 h-3/4 bg-gradient-to-tr from-stone-600/70 to-stone-400/50 rounded-tr-3xl" />
        <div className="absolute bottom-0 right-0 w-2/5 h-3/4 bg-gradient-to-tl from-stone-600/70 to-stone-400/50 rounded-tl-3xl" />
        {/* Water */}
        <div className="absolute bottom-0 inset-x-0 h-2/5 bg-gradient-to-t from-cyan-600/80 to-cyan-300/60 rounded-t-full" />
        {/* Water shimmer */}
        <div className="absolute bottom-4 left-1/4 w-1/2 h-3 bg-white/20 rounded-full blur-sm" />
        <div className="absolute bottom-8 left-1/3 w-1/3 h-2 bg-white/15 rounded-full blur-sm" />
        {/* Greenery */}
        <div className="absolute bottom-10 left-8 w-6 h-10 bg-green-500/60 rounded-t-full" />
        <div className="absolute bottom-10 right-8 w-5 h-8 bg-green-600/60 rounded-t-full" />
      </div>
    );
  }

  if (name.includes('jebel') || name.includes('akhdar') || name.includes('shams') || name.includes('mountain')) {
    // Green mountain
    return (
      <div className="relative w-full h-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-sky-300/60 to-sky-100/40" />
        {/* Far mountains */}
        <div className="absolute bottom-1/3 left-0 right-0">
          <div style={{clipPath:'polygon(0% 100%, 15% 20%, 30% 60%, 45% 10%, 60% 50%, 75% 15%, 90% 55%, 100% 20%, 100% 100%)'}}
               className="w-full h-32 bg-gradient-to-b from-green-700/60 to-green-800/70" />
        </div>
        {/* Near mountains */}
        <div className="absolute bottom-0 left-0 right-0">
          <div style={{clipPath:'polygon(0% 100%, 10% 50%, 25% 80%, 40% 20%, 55% 60%, 70% 25%, 85% 70%, 100% 30%, 100% 100%)'}}
               className="w-full h-40 bg-gradient-to-b from-green-500/80 to-green-700/90" />
        </div>
        {/* Snow cap */}
        <div className="absolute" style={{top:'20%',left:'38%',width:'14%'}}>
          <div style={{clipPath:'polygon(50% 0%, 0% 100%, 100% 100%)'}}
               className="w-full h-8 bg-white/70" />
        </div>
        {/* Clouds */}
        <div className="absolute top-4 left-6 w-16 h-5 bg-white/50 rounded-full blur-sm" />
        <div className="absolute top-6 left-14 w-10 h-4 bg-white/40 rounded-full blur-sm" />
      </div>
    );
  }

  if (name.includes('wahiba') || name.includes('sands') || name.includes('desert') || name.includes('sharqiya')) {
    // Golden dunes
    return (
      <div className="relative w-full h-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-orange-200/70 to-amber-100/50" />
        {/* Sun */}
        <div className="absolute top-4 right-8 w-12 h-12 rounded-full bg-gradient-to-br from-yellow-300/90 to-orange-400/80" />
        {/* Dune layers */}
        <div className="absolute bottom-0 left-0 right-0">
          <div style={{clipPath:'polygon(0% 100%, 0% 55%, 25% 30%, 50% 50%, 75% 20%, 100% 45%, 100% 100%)'}}
               className="w-full h-48 bg-gradient-to-b from-amber-500/80 to-amber-700/90" />
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <div style={{clipPath:'polygon(0% 100%, 0% 70%, 20% 50%, 45% 65%, 70% 40%, 90% 60%, 100% 45%, 100% 100%)'}}
               className="w-full h-36 bg-gradient-to-b from-amber-400/70 to-amber-600/80" />
        </div>
        {/* Ridge highlight */}
        <div className="absolute" style={{bottom:'50%',left:'20%',width:'35%',height:'2px',transform:'rotate(-8deg)'}}>
          <div className="w-full h-0.5 bg-amber-200/60 blur-sm rounded-full" />
        </div>
      </div>
    );
  }

  if (name.includes('nizwa') || name.includes('fort') || name.includes('castle') || name.includes('bahla')) {
    // Fort / architectural
    return (
      <div className="relative w-full h-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-100/60 to-orange-100/40" />
        {/* Sky with sun */}
        <div className="absolute top-3 right-6 w-10 h-10 rounded-full bg-gradient-to-br from-yellow-300/80 to-orange-300/70" />
        {/* Main tower */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 bg-gradient-to-b from-stone-400/80 to-stone-600/90 rounded-t-sm" style={{height:'65%'}} />
        {/* Tower battlements */}
        {[0,1,2,3].map(i => (
          <div key={i} className="absolute bg-stone-400/80 w-3 h-4"
               style={{bottom:'65%', left:`calc(50% - 24px + ${i*14}px)`, transform:'translateY(0)'}} />
        ))}
        {/* Walls left */}
        <div className="absolute bottom-0 left-0 w-2/5 bg-gradient-to-b from-stone-300/70 to-stone-500/80" style={{height:'40%'}} />
        {/* Walls right */}
        <div className="absolute bottom-0 right-0 w-2/5 bg-gradient-to-b from-stone-300/70 to-stone-500/80" style={{height:'35%'}} />
        {/* Ground */}
        <div className="absolute bottom-0 inset-x-0 h-4 bg-amber-700/40" />
        {/* Windows */}
        <div className="absolute w-4 h-5 rounded-t-full bg-dark/30 left-1/2 -translate-x-1/2" style={{bottom:'35%'}} />
        <div className="absolute w-3 h-3 rounded-t-full bg-dark/20 left-1/2 -translate-x-1/2" style={{bottom:'50%'}} />
      </div>
    );
  }

  if (name.includes('muscat') || name.includes('muttrah') || name.includes('city') || name.includes('opera')) {
    // Cityscape
    return (
      <div className="relative w-full h-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/70 to-indigo-700/50" />
        {/* Stars */}
        {[{x:10,y:8},{x:30,y:5},{x:55,y:12},{x:75,y:6},{x:88,y:10}].map((s,i) => (
          <div key={i} className="absolute w-1 h-1 rounded-full bg-white/70"
               style={{left:`${s.x}%`,top:`${s.y}%`}} />
        ))}
        {/* Moon */}
        <div className="absolute top-4 right-6 w-9 h-9 rounded-full bg-amber-100/80" />
        <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-indigo-800/80" style={{transform:'translate(4px,-1px)'}} />
        {/* Buildings */}
        {[
          {l:'5%',w:'12%',h:'45%',color:'from-slate-600/80 to-slate-800/90'},
          {l:'16%',w:'8%',h:'55%',color:'from-slate-500/80 to-slate-700/90'},
          {l:'23%',w:'14%',h:'38%',color:'from-slate-600/70 to-slate-800/80'},
          {l:'36%',w:'10%',h:'65%',color:'from-teal/20 to-teal/40'},
          {l:'45%',w:'12%',h:'50%',color:'from-slate-500/80 to-slate-700/90'},
          {l:'56%',w:'9%',h:'42%',color:'from-slate-600/70 to-slate-800/80'},
          {l:'64%',w:'13%',h:'58%',color:'from-slate-500/80 to-slate-700/90'},
          {l:'76%',w:'10%',h:'40%',color:'from-slate-600/80 to-slate-800/90'},
          {l:'85%',w:'12%',h:'52%',color:'from-slate-500/70 to-slate-700/80'},
        ].map((b,i) => (
          <div key={i} className={`absolute bottom-0 bg-gradient-to-b ${b.color}`}
               style={{left:b.l,width:b.w,height:b.h}} />
        ))}
        {/* Building lights */}
        {[{l:'38%',b:'40%'},{l:'67%',b:'38%'},{l:'18%',b:'35%'}].map((w,i) => (
          <div key={i} className="absolute w-1.5 h-1 bg-amber-300/60 rounded-sm"
               style={{left:w.l,bottom:w.b}} />
        ))}
        {/* Sea reflection */}
        <div className="absolute bottom-0 inset-x-0 h-8 bg-gradient-to-t from-indigo-600/60 to-transparent" />
      </div>
    );
  }

  // Default: nature/lush green
  return (
    <div className="relative w-full h-full overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-green-300/60 to-green-100/40" />
      <div className="absolute bottom-0 left-0 right-0">
        <div style={{clipPath:'polygon(0% 100%, 5% 60%, 15% 80%, 30% 40%, 45% 65%, 60% 35%, 75% 60%, 90% 45%, 100% 65%, 100% 100%)'}}
             className="w-full h-44 bg-gradient-to-b from-green-500/80 to-green-700/90" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-10 bg-green-800/50" />
      {/* Trees */}
      {[15,35,65,82].map((x,i) => (
        <div key={i} className="absolute bottom-8" style={{left:`${x}%`}}>
          <div className="w-0 h-0 border-l-8 border-r-8 border-b-16 border-l-transparent border-r-transparent border-b-green-600/80 mx-auto"
               style={{borderBottomWidth:'24px'}} />
          <div className="w-1 h-4 bg-green-900/60 mx-auto" />
        </div>
      ))}
    </div>
  );
}

// ─── Crowd level indicator ────────────────────────────────────────────────────
function CrowdDots({ level }: { level: number }) {
  return (
    <div className="flex gap-1">
      {[1,2,3,4,5].map(i => (
        <div key={i} className={`w-1.5 h-1.5 rounded-full transition-colors ${
          i <= level ? 'bg-[#00DE51]' : 'bg-white/20'
        }`} />
      ))}
    </div>
  );
}

// ─── Scroll animation hook ────────────────────────────────────────────────────
function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('revealed');
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

// ─── Animated particle ────────────────────────────────────────────────────────
function Particle({ style }: { style: React.CSSProperties }) {
  return <div className="particle absolute rounded-full bg-[#00DE51]" style={style} />;
}

// ─── Hero Section ─────────────────────────────────────────────────────────────
export function HeroSection({ heroTitle, heroSubtitle, heroCta }: {
  heroTitle: string; heroSubtitle: string; heroCta: string;
}) {
  return (
    <section className="relative overflow-hidden hero-bg" style={{minHeight:'88vh',display:'flex',alignItems:'center'}}>
      {/* Animated mesh gradient */}
      <div className="absolute inset-0 mesh-gradient" aria-hidden="true" />

      {/* Floating geometric shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="geo-shape geo-shape-1" />
        <div className="geo-shape geo-shape-2" />
        <div className="geo-shape geo-shape-3" />
        <div className="geo-shape geo-shape-4" />
        <div className="geo-shape geo-shape-5" />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        {[
          {width:'4px',height:'4px',opacity:0.6,top:'15%',left:'10%',animationDelay:'0s',animationDuration:'6s'},
          {width:'3px',height:'3px',opacity:0.4,top:'25%',left:'80%',animationDelay:'1s',animationDuration:'8s'},
          {width:'5px',height:'5px',opacity:0.5,top:'60%',left:'15%',animationDelay:'2s',animationDuration:'7s'},
          {width:'3px',height:'3px',opacity:0.35,top:'70%',left:'75%',animationDelay:'0.5s',animationDuration:'9s'},
          {width:'4px',height:'4px',opacity:0.45,top:'40%',left:'50%',animationDelay:'3s',animationDuration:'6.5s'},
          {width:'2px',height:'2px',opacity:0.6,top:'85%',left:'40%',animationDelay:'1.5s',animationDuration:'10s'},
          {width:'6px',height:'6px',opacity:0.3,top:'10%',left:'60%',animationDelay:'4s',animationDuration:'8s'},
          {width:'3px',height:'3px',opacity:0.5,top:'50%',left:'90%',animationDelay:'2.5s',animationDuration:'7s'},
        ].map((p, i) => <Particle key={i} style={p} />)}
      </div>

      {/* Grid lines overlay */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true"
           style={{
             backgroundImage: 'linear-gradient(rgba(0,222,81,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,222,81,0.04) 1px, transparent 1px)',
             backgroundSize: '60px 60px'
           }} />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-[#00DE51]/30 bg-[#00DE51]/10 backdrop-blur-sm text-[#00DE51] text-sm font-semibold mb-8 hero-badge">
            <svg className="w-4 h-4" viewBox="0 0 40 32" fill="none">
              <path d="M2 2L12 28L22 2" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="30" cy="16" r="9" stroke="currentColor" strokeWidth="3.5"/>
            </svg>
            Visit Oman
          </div>

          {/* Heading */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-tight hero-title">
            {heroTitle}
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-lg sm:text-xl text-white/60 leading-relaxed max-w-2xl mx-auto hero-subtitle">
            {heroSubtitle}
          </p>

          {/* CTA */}
          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center hero-cta">
            <Link
              href="/planner"
              className="group inline-flex items-center justify-center px-8 py-4 rounded-full
                         bg-[#00DE51] text-[#1A1A1A] font-bold text-lg
                         shadow-lg shadow-[#00DE51]/25
                         hover:shadow-xl hover:shadow-[#00DE51]/40
                         hover:scale-105 transition-all duration-300"
            >
              {heroCta}
              <svg className="w-5 h-5 ms-2 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              href="/destinations"
              className="inline-flex items-center justify-center px-8 py-4 rounded-full
                         border border-white/20 text-white font-semibold text-lg
                         backdrop-blur-sm bg-white/5
                         hover:bg-white/10 hover:border-white/40
                         hover:scale-105 transition-all duration-300"
            >
              Explore Destinations
            </Link>
          </div>

          {/* Stats row */}
          <div className="mt-16 grid grid-cols-3 gap-4 max-w-md mx-auto hero-stats">
            {[
              { num: '50+', label: 'Destinations' },
              { num: '6', label: 'Regions' },
              { num: '3', label: 'Trip Styles' },
            ].map(stat => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-bold text-[#00DE51]">{stat.num}</div>
                <div className="text-xs text-white/50 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-[#F5F5F5] to-transparent pointer-events-none" />
    </section>
  );
}

// ─── Category Cards ───────────────────────────────────────────────────────────
export function CategorySection({ categories, translations }: {
  categories: readonly Category[];
  translations: Record<string, string>;
}) {
  const tr = (key: string) => translations[key] ?? key;
  const ref = useScrollReveal();

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
      <div className="text-center mb-14 reveal-section" ref={ref}>
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#00DE51]/10 text-[#00DE51] text-sm font-semibold mb-4">
          Explore by type
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold text-dark">
          {tr('landing.categoriesTitle')}
        </h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.map((cat, i) => (
          <Link
            key={cat}
            href={`/destinations?category=${cat}`}
            className={`group flex flex-col items-center gap-4 p-6 rounded-2xl
                        bg-white border transition-all duration-300
                        hover:scale-105 hover:shadow-xl
                        ${catBorder[cat]}`}
            style={{ animationDelay: `${i * 80}ms` }}
          >
            {/* Icon container */}
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${catGradient[cat]}
                             flex items-center justify-center
                             group-hover:scale-110 group-hover:shadow-lg
                             transition-all duration-300 ${catColor[cat]}`}>
              <CategoryIcon cat={cat} />
            </div>
            <span className="text-sm font-semibold text-dark/70 transition-colors capitalize">
              {tr(`categories.${cat}`)}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

// ─── Featured Destination Card ────────────────────────────────────────────────
function DestCard({ dest, locale, translations, index }: {
  dest: Destination;
  locale: 'en' | 'ar';
  translations: Record<string, string>;
  index: number;
}) {
  const tr = (key: string) => translations[key] ?? key;

  function formatDuration(minutes: number): string {
    if (minutes < 60) return `${minutes} min`;
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hrs}h ${mins}m` : `${hrs}h`;
  }

  return (
    <Link
      href={`/destinations/${dest.id}`}
      className="group block rounded-2xl overflow-hidden bg-white shadow-sm
                 hover:shadow-2xl hover:scale-[1.02]
                 transition-all duration-300 border border-gray-100/80 dest-card"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Illustration */}
      <div className="relative h-48 overflow-hidden bg-gray-100">
        <DestinationIllustration dest={dest} />
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-[#1A1A1A]/0 group-hover:bg-[#1A1A1A]/20 transition-colors duration-300" />
        {/* Category badge */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {dest.categories.slice(0,2).map(cat => (
            <span key={cat}
                  className="text-xs px-2.5 py-1 rounded-full bg-[#1A1A1A]/40 backdrop-blur-sm text-white font-medium">
              {tr(`categories.${cat}`)}
            </span>
          ))}
        </div>
        {/* Crowd level */}
        <div className="absolute top-3 right-3">
          <div className="px-2 py-1 rounded-full bg-[#1A1A1A]/40 backdrop-blur-sm">
            <CrowdDots level={dest.crowd_level} />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-bold text-[#1A1A1A] text-lg leading-tight group-hover:text-[#00DE51] transition-colors duration-200">
              {dest.name[locale]}
            </h3>
            <p className="text-sm text-[#1A1A1A]/50 mt-0.5 flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
              </svg>
              {dest.region[locale]}
            </p>
          </div>
          <div className="text-right shrink-0">
            <div className="text-lg font-bold text-[#00DE51]">
              {dest.ticket_cost_omr === 0
                ? <span className="text-emerald-500">{tr('common.free')}</span>
                : `${dest.ticket_cost_omr.toFixed(3)}`}
            </div>
            {dest.ticket_cost_omr > 0 && (
              <div className="text-xs text-[#1A1A1A]/40">{tr('common.omr')}</div>
            )}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[#1A1A1A]/50 text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            {formatDuration(dest.avg_visit_duration_minutes)}
          </div>
          <span className="text-xs text-[#00DE51] font-semibold flex items-center gap-1">
            View details
            <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}

// ─── Featured Destinations Section ───────────────────────────────────────────
export function FeaturedSection({ featured, locale, translations }: {
  featured: Destination[];
  locale: 'en' | 'ar';
  translations: Record<string, string>;
}) {
  const tr = (key: string) => translations[key] ?? key;
  const ref = useScrollReveal();

  return (
    <section className="bg-[#F0F0F0] py-20 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-12 reveal-section" ref={ref}>
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#00DE51]/10 text-[#00DE51] text-sm font-semibold mb-3">
              Handpicked for you
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1A1A1A]">
              {tr('landing.featuredTitle')}
            </h2>
            <p className="mt-2 text-[#1A1A1A]/50 max-w-lg">
              {tr('landing.featuredSubtitle')}
            </p>
          </div>
          <Link href="/destinations"
                className="mt-4 sm:mt-0 inline-flex items-center gap-1.5 text-[#00DE51] font-semibold transition-all duration-200 shrink-0 hover:underline">
            View all
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((dest, i) => (
            <DestCard key={dest.id} dest={dest} locale={locale} translations={translations} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
