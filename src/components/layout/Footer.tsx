export default function Footer() {
  return (
    <footer className="bg-dark text-white/50 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm">
        <div className="flex items-center justify-center gap-2 mb-2">
          <svg width="24" height="20" viewBox="0 0 40 32" fill="none">
            <path d="M2 2L12 28L22 2" stroke="#00DE51" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="30" cy="16" r="9" stroke="#00DE51" strokeWidth="3.5"/>
          </svg>
          <span className="font-semibold text-white/70 tracking-wider uppercase text-xs">Visit Oman</span>
        </div>
        <p>Built for Rihal Codestacker 2026</p>
        <p className="mt-1">&copy; {new Date().getFullYear()} Visit Oman</p>
      </div>
    </footer>
  );
}
