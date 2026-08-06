export function Logo({ size = 40, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className} role="img" aria-label="لوگوی ایده‌یاب">
      <defs>
        <linearGradient id="body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ff7a6b" />
          <stop offset="100%" stopColor="#e5412f" />
        </linearGradient>
        <linearGradient id="flame" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffd166" />
          <stop offset="60%" stopColor="#ff9f1c" />
          <stop offset="100%" stopColor="#f77f00" />
        </linearGradient>
        <radialGradient id="win" cx="0.5" cy="0.4" r="0.6">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#cde3ff" />
        </radialGradient>
      </defs>

      {/* Nose */}
      <path d="M32 3 L42 17 H22 Z" fill="url(#body)" />

      {/* Body */}
      <path d="M22 17 H42 C44.5 27 44.5 37 42 47 H22 C19.5 37 19.5 27 22 17 Z" fill="url(#body)" />

      {/* Body highlight */}
      <path d="M25 18 C24 28 24 36 25 45" stroke="#ffffff" strokeWidth="1.2" strokeOpacity="0.45" strokeLinecap="round" fill="none" />

      {/* Window */}
      <circle cx="32" cy="30" r="6.2" fill="url(#win)" />
      <circle cx="32" cy="30" r="6.2" fill="none" stroke="#e5412f" strokeWidth="1" />
      <circle cx="30" cy="28" r="1.6" fill="#ffffff" opacity="0.9" />

      {/* Left fin */}
      <path d="M21.5 38 L11 49 L22 51 Z" fill="#b8311f" />
      <path d="M21.5 38 L11 49 L22 51 Z" fill="url(#body)" opacity="0.6" />

      {/* Right fin */}
      <path d="M42.5 38 L53 49 L42 51 Z" fill="#b8311f" />
      <path d="M42.5 38 L53 49 L42 51 Z" fill="url(#body)" opacity="0.6" />

      {/* Flame */}
      <path d="M32 47 C28 52 28 58 32 62 C36 58 36 52 32 47 Z" fill="url(#flame)" />
      <path d="M32 50 C30.2 53 30.2 57 32 60 C33.8 57 33.8 53 32 50 Z" fill="#fff2b0" />
    </svg>
  );
}
