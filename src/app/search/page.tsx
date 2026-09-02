import { Suspense } from 'react';
import SearchClient from './SearchClient';

export const dynamic = 'force-dynamic';

function SearchFallback() {
  return (
    <main className="min-h-[70vh]">
      <section className="border-b border-gray-200/70 bg-gradient-to-b from-orange-50/70 to-white px-4 py-14 dark:border-gray-800 dark:from-orange-950/20 dark:to-gray-950 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <div className="h-7 w-40 animate-pulse rounded-full bg-gray-200 dark:bg-gray-800" />
          <div className="mt-5 h-12 max-w-2xl animate-pulse rounded-2xl bg-gray-200 dark:bg-gray-800" />
          <div className="mt-4 h-6 max-w-xl animate-pulse rounded-xl bg-gray-100 dark:bg-gray-900" />
          <div className="mt-8 h-14 max-w-3xl animate-pulse rounded-2xl bg-gray-200 dark:bg-gray-800" />
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-10 sm:py-14">
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-28 animate-pulse rounded-3xl bg-gray-100 dark:bg-gray-900"
            />
          ))}
        </div>
      </section>
    </main>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchFallback />}>
      <SearchClient />
    </Suspense>
  );
}
