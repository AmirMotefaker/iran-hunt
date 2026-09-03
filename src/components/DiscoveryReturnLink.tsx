'use client';

import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  buildDiscoverySearchHref,
  decodeDiscoveryContext,
  DISCOVERY_SESSION_STORAGE_KEY,
} from '@/lib/discovery-session-context';

export function DiscoveryReturnLink() {
  const [href, setHref] = useState('/');
  const [label, setLabel] = useState('بازگشت به لیست');

  useEffect(() => {
    const stored = window.sessionStorage.getItem(DISCOVERY_SESSION_STORAGE_KEY);
    const context = stored ? decodeDiscoveryContext(stored) : null;

    if (!context?.query) return;

    setHref(buildDiscoverySearchHref(context.query, context));
    setLabel('بازگشت به مسیر کشف');
  }, []);

  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1 text-sm font-bold text-gray-600 transition hover:text-[#ff6154] dark:text-gray-400"
    >
      <ArrowRight size={16} />
      {label}
    </Link>
  );
}
