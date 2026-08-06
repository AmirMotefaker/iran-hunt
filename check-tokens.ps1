$envContent = Get-Content .env.local -Raw
$ph = if ($envContent -match 'PH_API_TOKEN=(\S+)') { $Matches[1].Trim() } else { '' }
$gk = if ($envContent -match 'GROQ_API_KEY=(\S+)') { $Matches[1].Trim() } else { '' }

Write-Host "PH token length: $($ph.Length) | Groq key length: $($gk.Length)" -ForegroundColor Cyan

try {
    $r = Invoke-RestMethod -Uri "https://api.producthunt.com/v2/api/graphql" -Method POST `
        -Headers @{ "Content-Type"="application/json"; "Authorization"="Bearer $ph" } `
        -Body (@{ query = "query { viewer { name } }" } | ConvertTo-Json)
    Write-Host "PH OK -> logged in as: $($r.data.viewer.name)" -ForegroundColor Green
} catch {
    Write-Host "PH FAIL -> $($_.Exception.Message)" -ForegroundColor Red
}

try {
    $r2 = Invoke-RestMethod -Uri "https://api.groq.com/openai/v1/chat/completions" -Method POST `
        -Headers @{ "Content-Type"="application/json"; "Authorization"="Bearer $gk" } `
        -Body (@{ model="llama-3.1-8b-instant"; messages=@(@{role="user";content="say hi"}); max_tokens=10 } | ConvertTo-Json -Depth 5)
    Write-Host "Groq OK" -ForegroundColor Green
} catch {
    Write-Host "Groq FAIL -> $($_.Exception.Message)" -ForegroundColor Red
}
