import type { ReactNode } from 'react';
import { DiscoveryReturnLink } from '@/components/DiscoveryReturnLink';

export default function ProductLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="mx-auto max-w-4xl px-4 pt-8">
        <DiscoveryReturnLink />
      </div>
      {children}
    </>
  );
}
