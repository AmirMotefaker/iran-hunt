import { Lightbulb, TrendingUp } from 'lucide-react';
import type { Product } from '@/types';

export function ProductCard({ product }: { product: Product }) {
  const eq = product.iranEquivalent;

  return (
    <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 font-bold text-white">
              {product.rank}
            </span>
            <h2 className="text-xl font-bold">{product.name}</h2>
          </div>
          <p className="mt-2 text-gray-600">{product.tagline}</p>
        </div>
        <div className="flex items-center gap-1 rounded-lg bg-orange-50 px-3 py-1 text-orange-600">
          <TrendingUp size={16} />
          <span className="font-semibold">{product.votes}</span>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {product.category.split('•').map((c) => (
          <span
            key={c}
            className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700"
          >
            {c.trim()}
          </span>
        ))}
      </div>

      {product.description && (
        <p className="mt-4 text-sm leading-6 text-gray-700">{product.description}</p>
      )}

      <div className="mt-4 flex gap-4 text-sm">
        <a
          href={product.url}
          target="_blank"
          rel="noreferrer"
          className="text-orange-600 hover:underline"
        >
          مشاهده در ProductHunt ↗
        </a>
        {product.websiteUrl && (
          <a
            href={product.websiteUrl}
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 hover:underline"
          >
            وب‌سایت رسمی ↗
          </a>
        )}
      </div>

      {eq && (
        <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-4">
          <div className="flex items-center gap-2">
            <Lightbulb className="text-green-700" size={20} />
            <h3 className="font-bold text-green-800">
              💡 مشابه ایرانی: {eq.productName}
            </h3>
          </div>
          <p className="mt-2 text-sm leading-6 text-green-900">{eq.description}</p>

          <div className="mt-3 grid gap-2 text-sm text-green-900 sm:grid-cols-2">
            <div>
              <strong>🎯 بازار:</strong> {eq.marketOpportunity}
            </div>
            <div>
              <strong>💰 بودجه:</strong> {eq.estimatedBudget}
            </div>
            <div>
              <strong>👥 مخاطب:</strong> {eq.targetAudience}
            </div>
            <div>
              <strong>📊 اطمینان:</strong> {eq.confidence}٪
            </div>
          </div>

          {eq.challenges.length > 0 && (
            <div className="mt-3">
              <strong className="text-sm text-green-900">⚠️ چالش‌ها:</strong>
              <ul className="mt-1 list-inside list-disc text-sm text-green-900">
                {eq.challenges.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </article>
  );
}
