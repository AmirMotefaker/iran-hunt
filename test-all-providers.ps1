$envContent = Get-Content .env.local -Raw

# Read all keys
$keys = @{}
foreach ($line in $envContent.Split("`n")) {
    if ($line -match '^([A-Z_]+)=(.+)$') {
        $keys[$matches[1]] = $matches[2].Trim()
    }
}

$body = @{
    messages = @(
        @{ role = "user"; content = "Say hello in Persian in 10 words. Respond only with the greeting." }
    )
    max_tokens = 50
} | ConvertTo-Json -Depth 5

Write-Host "=== Testing AI Providers ===" -ForegroundColor Cyan
Write-Host ""

# --- 1. OpenRouter (recommended) ---
if ($keys.OPENROUTER_API_KEY) {
    $models = @(
        "deepseek/deepseek-chat-v3.1:free",
        "meta-llama/llama-3.3-70b-instruct:free",
        "google/gemini-2.0-flash-exp:free",
        "qwen/qwen-2.5-72b-instruct:free"
    )
    
    foreach ($model in $models) {
        try {
            $bodyModel = @{
                model = $model
                messages = @(
                    @{ role = "user"; content = "Say hello in Persian in 10 words" }
                )
                max_tokens = 50
            } | ConvertTo-Json -Depth 5
            
            $res = Invoke-RestMethod `
                -Uri "https://openrouter.ai/api/v1/chat/completions" `
                -Method POST `
                -Headers @{
                    "Content-Type" = "application/json"
                    "Authorization" = "Bearer $($keys.OPENROUTER_API_KEY)"
                    "HTTP-Referer" = "https://iranhunt.vercel.app"
                } `
                -Body $bodyModel -ErrorAction Stop
            
            $text = $res.choices[0].message.content
            Write-Host "[OpenRouter] OK  $model" -ForegroundColor Green
            Write-Host "              -> $text" -ForegroundColor DarkGray
        } catch {
            Write-Host "[OpenRouter] X   $model -> $($_.Exception.Message)" -ForegroundColor Red
        }
    }
}

Write-Host ""

# --- 2. Groq ---
if ($keys.GROQ_API_KEY) {
    $models = @("llama-3.3-70b-versatile", "llama-3.1-8b-instant", "gemma2-9b-it")
    
    foreach ($model in $models) {
        try {
            $bodyModel = @{
                model = $model
                messages = @(
                    @{ role = "user"; content = "Say hello in Persian in 10 words" }
                )
                max_tokens = 50
            } | ConvertTo-Json -Depth 5
            
            $res = Invoke-RestMethod `
                -Uri "https://api.groq.com/openai/v1/chat/completions" `
                -Method POST `
                -Headers @{
                    "Content-Type" = "application/json"
                    "Authorization" = "Bearer $($keys.GROQ_API_KEY)"
                    "User-Agent" = "Mozilla/5.0"
                } `
                -Body $bodyModel -ErrorAction Stop
            
            $text = $res.choices[0].message.content
            Write-Host "[Groq]       OK  $model" -ForegroundColor Green
            Write-Host "              -> $text" -ForegroundColor DarkGray
        } catch {
            Write-Host "[Groq]       X   $model -> $($_.Exception.Message)" -ForegroundColor Red
        }
    }
}

Write-Host ""

# --- 3. Gemini (با صبر کردن برای rate limit) ---
if ($keys.GEMINI_API_KEY) {
    $models = @("gemini-2.5-flash", "gemini-2.0-flash-exp", "gemini-1.5-flash")
    
    foreach ($model in $models) {
        try {
            $url = "https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=$($keys.GEMINI_API_KEY)"
            
            $bodyModel = @{
                contents = @(@{ parts = @(@{ text = "Say hello in Persian in 10 words" }) })
                generationConfig = @{ maxOutputTokens = 50 }
            } | ConvertTo-Json -Depth 5
            
            $res = Invoke-RestMethod -Uri $url -Method POST `
                -Headers @{"Content-Type"="application/json"} -Body $bodyModel -ErrorAction Stop
            
            $text = $res.candidates[0].content.parts[0].text
            Write-Host "[Gemini]     OK  $model" -ForegroundColor Green
            Write-Host "              -> $text" -ForegroundColor DarkGray
        } catch {
            Write-Host "[Gemini]     X   $model -> $($_.Exception.Message)" -ForegroundColor Red
        }
    }
}

Write-Host ""

# --- 4. xAI Grok ---
if ($keys.XAI_API_KEY) {
    $models = @("grok-2", "grok-2-latest")
    
    foreach ($model in $models) {
        try {
            $bodyModel = @{
                model = $model
                messages = @(
                    @{ role = "user"; content = "Say hello in Persian in 10 words" }
                )
                max_tokens = 50
            } | ConvertTo-Json -Depth 5
            
            $res = Invoke-RestMethod `
                -Uri "https://api.x.ai/v1/chat/completions" `
                -Method POST `
                -Headers @{
                    "Content-Type" = "application/json"
                    "Authorization" = "Bearer $($keys.XAI_API_KEY)"
                } `
                -Body $bodyModel -ErrorAction Stop
            
            $text = $res.choices[0].message.content
            Write-Host "[Grok/xAI]   OK  $model" -ForegroundColor Green
            Write-Host "              -> $text" -ForegroundColor DarkGray
        } catch {
            Write-Host "[Grok/xAI]   X   $model -> $($_.Exception.Message)" -ForegroundColor Red
        }
    }
}

Write-Host ""
Write-Host "=== Done ===" -ForegroundColor Cyan
Write-Host "Choose the FIRST provider that shows OK and tell me!" -ForegroundColor Yellow
