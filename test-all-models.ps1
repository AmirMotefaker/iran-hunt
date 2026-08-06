$envContent = Get-Content .env.local -Raw
if ($envContent -match 'GEMINI_API_KEY=(.+)') {
    $key = $Matches[1].Trim()
}

Write-Host "Testing Gemini models..." -ForegroundColor Cyan

$models = @(
    "gemini-2.5-flash",
    "gemini-2.5-pro",
    "gemini-2.0-flash",
    "gemini-1.5-flash",
    "gemini-1.5-pro",
    "gemini-pro"
)

$body = @{
    contents = @(
        @{ parts = @(@{ text = "Say hello in Persian in 10 words" }) }
    )
    generationConfig = @{
        temperature = 0.7
        maxOutputTokens = 100
    }
} | ConvertTo-Json -Depth 5

foreach ($model in $models) {
    $url = "https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=$key"
    
    try {
        $res = Invoke-RestMethod -Uri $url -Method POST -Headers @{"Content-Type"="application/json"} -Body $body -ErrorAction Stop
        $text = $res.candidates[0].content.parts[0].text
        Write-Host "OK  $model -> $text" -ForegroundColor Green
    } catch {
        Write-Host "X  $model -> $($_.Exception.Message)" -ForegroundColor Red
    }
}
