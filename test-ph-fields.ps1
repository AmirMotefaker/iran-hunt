$envContent = Get-Content .env.local -Raw
if ($envContent -match 'PH_API_TOKEN=(.+)') {
    $token = $Matches[1].Trim()
}

# Query رو مستقیم توی body بذاریم
$body = @{
    query = "query { posts(first: 3) { edges { node { name tagline votesCount url featuredAt website } } } }"
} | ConvertTo-Json

Write-Host "Sending request to PH API..." -ForegroundColor Cyan

$res = Invoke-RestMethod -Uri "https://api.producthunt.com/v2/api/graphql" `
    -Method POST `
    -Headers @{
        "Content-Type" = "application/json"
        "Authorization" = "Bearer $token"
    } `
    -Body $body

Write-Host "=== PH API Response ===" -ForegroundColor Green
$res | ConvertTo-Json -Depth 10
