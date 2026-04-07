export function WizlLogo({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M16 4C12 4 9 8 9 14c0 4 2 7 4.5 9.5C15 25 16 28 16 28s1-3 2.5-4.5C21 21 23 18 23 14c0-6-3-10-7-10z" fill="currentColor" opacity="0.9"/>
      <path d="M16 8v12M13 11c1 1 2 3 3 5M19 11c-1 1-2 3-3 5" stroke="rgba(0,0,0,0.3)" strokeWidth="1" strokeLinecap="round"/>
    </svg>
  );
}

export function IconScan({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M3 7V5a2 2 0 012-2h2M17 3h2a2 2 0 012 2v2M21 17v2a2 2 0 01-2 2h-2M7 21H5a2 2 0 01-2-2v-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M12 8v1M12 15v1M8 12h1M15 12h1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}
