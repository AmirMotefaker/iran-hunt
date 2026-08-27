$ErrorActionPreference = "Stop"

$repo = (Get-Location).Path
$page = Join-Path $repo "src/app/page.tsx"
$productPage = Join-Path $repo "src/app/product/[slug]/page.tsx"

if (-not (Test-Path $page)) { throw "src/app/page.tsx not found. Run from repository root." }
if (-not (Test-Path $productPage)) { throw "product page not found. Run from repository root." }

$pageText = Get-Content $page -Raw
if ($pageText -notmatch "loadCorpusProducts") {
  $pageText = $pageText.Replace(
    "import { loadLatest } from '@/lib/storage';",
    "import { loadLatest } from '@/lib/storage';`r`nimport { loadCorpusProducts } from '@/lib/corpus';`r`nimport Link from 'next/link';"
  )

  $pageText = $pageText.Replace(
    "  const data = await loadLatest();`r`n`r`n  const all = data`r`n    ? [...(data.periods.today ?? []), ...(data.periods.yesterday ?? []), ...(data.periods.week ?? []), ...(data.periods.month ?? []), ...(data.periods.year ?? [])]`r`n    : [];",
    "  const [data, corpusProducts] = await Promise.all([loadLatest(), loadCorpusProducts()]);`r`n`r`n  const latestProducts = data`r`n    ? [...(data.periods.today ?? []), ...(data.periods.yesterday ?? []), ...(data.periods.week ?? []), ...(data.periods.month ?? []), ...(data.periods.year ?? [])]`r`n    : [];`r`n  const all = corpusProducts.length ? corpusProducts : latestProducts;"
  )

  $needle = "      </section>`r`n`r`n      <section className=`"relative mx-auto mt-10 max-w-5xl px-4`">"
  $replacement = "        <div className=`"mt-5`">`r`n          <Link href=`"/products`" className=`"text-sm font-black text-[#ff6154] hover:underline`">`r`n            مشاهده آرشیو کامل {all.length.toLocaleString('fa-IR')} محصول ←`r`n          </Link>`r`n        </div>`r`n      </section>`r`n`r`n      <section className=`"relative mx-auto mt-10 max-w-5xl px-4`">"
  $pageText = $pageText.Replace($needle, $replacement)

  Set-Content $page $pageText -Encoding utf8
}

$productText = Get-Content $productPage -Raw
if ($productText -notmatch "loadCorpusProduct") {
  $productText = $productText.Replace(
    "import { loadLatest } from '@/lib/storage';",
    "import { loadLatest } from '@/lib/storage';`r`nimport { loadCorpusProduct } from '@/lib/corpus';"
  )

  $productText = $productText.Replace(
    "  if (!product) {`r`n    return (",
    "  if (!product) product = await loadCorpusProduct(slug);`r`n`r`n  if (!product) {`r`n    return ("
  )

  Set-Content $productPage $productText -Encoding utf8
}

Write-Host "P35 application wiring applied." -ForegroundColor Green
Write-Host "Run: bun run src/scripts/recover-corpus.ts" -ForegroundColor Cyan
