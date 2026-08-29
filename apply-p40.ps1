$ErrorActionPreference='Stop'
$pkgPath=Join-Path (Get-Location) 'package.json'
$pkg=Get-Content $pkgPath -Raw | ConvertFrom-Json
$pkg.scripts | Add-Member -NotePropertyName 'enrich:backlog' -NotePropertyValue 'bun src/scripts/enrich-today.ts' -Force
$json=$pkg | ConvertTo-Json -Depth 20
[System.IO.File]::WriteAllText($pkgPath,$json+"`n",[System.Text.UTF8Encoding]::new($false))
Write-Host "P40 package script added."
