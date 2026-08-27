$ErrorActionPreference = "Stop"

$packagePath = Join-Path (Get-Location) "package.json"
$dailyPath = Join-Path (Get-Location) ".github/workflows/daily-scrape.yml"
$nightlyPath = Join-Path (Get-Location) ".github/workflows/nightly-ai.yml"

$pkg = Get-Content $packagePath -Raw | ConvertFrom-Json
$pkg.scripts | Add-Member -NotePropertyName "corpus:update" -NotePropertyValue "bun src/scripts/update-corpus.ts" -Force
$pkg.scripts | Add-Member -NotePropertyName "corpus:audit" -NotePropertyValue "bun src/scripts/audit-corpus.ts" -Force
$pkg | ConvertTo-Json -Depth 20 | Set-Content $packagePath -Encoding utf8

$daily = Get-Content $dailyPath -Raw
if ($daily -notmatch "Update persistent corpus") {
  $daily = $daily.Replace(
    "      - name: Commit scrape result",
    "      - name: Update persistent corpus`n        run: bun run corpus:update`n`n      - name: Audit corpus health`n        run: bun run corpus:audit`n`n      - name: Commit scrape result"
  )
  Set-Content $dailyPath $daily -Encoding utf8
}

$nightly = Get-Content $nightlyPath -Raw
if ($nightly -notmatch "Audit corpus after enrichment") {
  $nightly = $nightly.Replace(
    "      - name: Commit data",
    "      - name: Audit corpus after enrichment`n        run: bun run corpus:audit`n`n      - name: Commit data"
  )
  Set-Content $nightlyPath $nightly -Encoding utf8
}

Write-Host "P36 automation wiring applied." -ForegroundColor Green
