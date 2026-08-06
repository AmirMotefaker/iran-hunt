$envContent = Get-Content .env.local -Raw
if ($envContent -match 'PH_API_TOKEN=(.+)') {
    $token = $Matches[1].Trim()
}

if (-not $token) {
    Write-Host "ERROR: PH_API_TOKEN not found!" -ForegroundColor Red
    exit 1
}

Write-Host "Testing PH API token..." -ForegroundColor Cyan

$body = @{
    query = "query { posts(first: 5) { edges { node { name votesCount } } } }"
} | ConvertTo-Json

$res = Invoke-RestMethod -Uri "https://api.producthunt.com/v2/api/graphql" `
    -Method POST `
    -Headers @{
        "Content-Type" = "application/json"
        "Authorization" = "Bearer $token"
    } `
    -Body $body

Write-Host "API works! First 5 products:" -ForegroundColor Green
$res.data.posts.edges | ForEach-Object {
    Write-Host "   - $($_.node.name): $($_.node.votesCount) votes"
}
