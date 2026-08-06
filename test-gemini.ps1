$envContent = Get-Content .env.local -Raw
if ($envContent -match 'GEMINI_API_KEY=(.+)') {
    $key = $Matches[1].Trim()
}

Write-Host "Testing Gemini API with key length: $($key.Length)" -ForegroundColor Cyan

$url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=$key"

$body = @{
    contents = @(
        @{ parts = @(@{ text = "Say hello in Persian" }) }
    )
    generationConfig = @{
        temperature = 0.7
        maxOutputTokens = 100
    }
} | ConvertTo-Json -Depth 5

$res = Invoke-RestMethod -Uri $url -Method POST -Headers @{"Content-Type"="application/json"} -Body $body

Write-Host "Gemini works!" -ForegroundColor Green
Write-Host "Response: $($res.candidates[0].content.parts[0].text)"
