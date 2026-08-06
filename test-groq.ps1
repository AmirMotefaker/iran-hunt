$envContent = Get-Content .env.local -Raw
if ($envContent -match 'GROQ_API_KEY=(.+)') {
    $groqKey = $Matches[1].Trim()
}

if (-not $groqKey) {
    Write-Host "ERROR: GROQ_API_KEY not found!" -ForegroundColor Red
    exit 1
}

Write-Host "Testing Groq API..." -ForegroundColor Cyan

$body = @{
    model = "llama-3.3-70b-versatile"
    messages = @(
        @{ role = "user"; content = "Say hello in Persian" }
    )
    max_tokens = 50
} | ConvertTo-Json

$res = Invoke-RestMethod -Uri "https://api.groq.com/openai/v1/chat/completions" `
    -Method POST `
    -Headers @{
        "Content-Type" = "application/json"
        "Authorization" = "Bearer $groqKey"
    } `
    -Body $body

Write-Host "Groq works!" -ForegroundColor Green
Write-Host "Response: $($res.choices[0].message.content)"
