import { ExternalLink, Lightbulb, TrendingUp } from 'lucide-react';
import type { Product } from '@/types';

export function ProductCard({ product }: { product: Product }) {
  const eq = product.iranEquivalent;

  return (
    <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-pink-500 font-bold text-white shadow">
              {product.rank}
            </span>
            <h2 className="text-xl font-bold">{product.name}</h2>
          </div>
          <p className="mt-2 text-gray-600 leading-relaxed">{product.tagline}</p>
        </div>
        <div className="flex items-center gap-1 rounded-lg bg-orange-50 px-3 py-2 text-orange-600">
          <TrendingUp size={16} />
          <span className="font-semibold">{product.votes}</span>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {product.category.split('•').map((c) => (
          <span key={c} className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
            {c.trim()}
          </span>
        ))}
      </div>

      {product.description && product.description !== product.tagline && (
        <p className="mt-4 text-sm leading-6 text-gray-700 border-t border-gray-100 pt-4">
          {product.description}
        </p>
      )}

      <div className="mt-4 flex gap-4 text-sm">
        <a href={product.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-orange-600 hover:underline">
          <ExternalLink size={14} /> ProductHunt
        </a>
        {product.websiteUrl && (
          <a href={product.websiteUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-blue-600 hover:underline">
            <ExternalLink size={14} /> وب‌سایت رسمی
          </a>
        )}
      </div>

      {eq && eq.confidence > 0 && (
        <div className="mt-6 rounded-xl border border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="text-green-700" size={20} />
            <h3 className="font-bold text-green-900 text-lg">
              💡 مشابه ایرانی: {eq.productName}
            </h3>
          </div>
          {eq.description && (
            <p className="text-sm leading-6 text-green-900 mb-3">{eq.description}</p>
          )}
          <div className="grid gap-2 text-sm text-green-900 sm:grid-cols-2 mb-3">
            {eq.marketOpportunity && <div><strong>🎯 بازار:</strong> {eq.marketOpportunity}</div>}
            {eq.estimatedBudget && <div><strong>💰 بودجه:</strong> {eq.estimatedBudget}</div>}
            {eq.targetAudience && <div><strong>👥 مخاطب:</strong> {eq.targetAudience}</div>}
            <div><strong>📊 اطمینان:</strong> {eq.confidence}%</div>
          </div>
          {eq.challenges.length > 0 && (
            <div className="mt-3 pt-3 border-t border-green-200">
              <strong className="text-sm text-green-900">⚠️ چالش‌ها:</strong>
              <ul className="mt-1 list-inside list-disc text-sm text-green-900">
                {eq.challenges.map((c) => <li key={c}>{c}</li>)}
              </ul>
            </div>
          )}
        </div>
      )}
    </article>
  );
}
