Write-Host "Copiando archivos..." -ForegroundColor Green
Copy-Item "public/bg.webm" "dist/bg.webm" -Force
Copy-Item "public/mapa.webm" "dist/mapa.webm" -Force
Copy-Item "public/cont_1.webp" "dist/cont_1.webp" -Force
Copy-Item "public/cont_2.webp" "dist/cont_2.webp" -Force
Copy-Item "public/cont_3.webp" "dist/cont_3.webp" -Force
New-Item -ItemType Directory -Force -Path "dist/icons" | Out-Null
Get-ChildItem "public/icons" -Filter "*.webm" | Where-Object { $_.Name -match "^(day|night)-" } | ForEach-Object {
    Copy-Item $_.FullName "dist/icons/$($_.Name)" -Force
}
Write-Host "✓ Copiados" -ForegroundColor Green
