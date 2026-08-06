'use client';

import { useState } from 'react';

export function Screenshot({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className="h-auto w-full object-cover"
      onError={() => setFailed(true)}
    />
  );
}
