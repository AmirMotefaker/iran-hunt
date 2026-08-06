export function Logo({ size = 40, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className} role="img" aria-label="لوگوی ایده‌یاب">
      <path d="M24 2.5l7.8 11H16.2l7.8-11z" fill="#ff6154" />
      <path d="M16.8 15.5h14.4c2.3 6.8 2.3 14.2 0 21H16.8c-2.3-6.8-2.3-14.2 0-21z" fill="#ff6154" />
      <circle cx="24" cy="24" r="4.8" fill="#ffffff" />
      <path d="M16.4 28.5L8.5 37l8.4 2.2z" fill="#e0493c" />
      <path d="M31.6 28.5L39.5 37l-8.4 2.2z" fill="#e0493c" />
      <path d="M24 39c-2.7 3.3-2.7 6.6 0 9.9 2.7-3.3 2.7-6.6 0-9.9z" fill="#f59e0b" />
    </svg>
  );
}
