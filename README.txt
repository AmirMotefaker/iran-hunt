IdehJo P4 — Scrape Operations Center

From C:\Project\iran-hunt on feat/p4-scrape-operations-center:
$temp="$env:TEMP\idehjo-p4"
Remove-Item $temp -Recurse -Force -ErrorAction SilentlyContinue
Expand-Archive "$HOME\Downloads\idehjo-p4-scrape-operations-center.zip" -DestinationPath $temp -Force
Copy-Item "$temp\*" "C:\Project\iran-hunt\" -Recurse -Force

bun test
bun run type-check
bun run build
