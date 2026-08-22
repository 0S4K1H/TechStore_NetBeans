$studioPath = "C:\Program Files\Android\Android Studio\bin\studio64.exe"
$projectPath = Join-Path $PSScriptRoot "android-layouts"

if (-not (Test-Path $studioPath)) {
    Write-Host "No se encontro Android Studio en la ruta esperada:" -ForegroundColor Red
    Write-Host $studioPath -ForegroundColor Yellow
    exit 1
}

if (-not (Test-Path $projectPath)) {
    Write-Host "No se encontro la carpeta del proyecto Android:" -ForegroundColor Red
    Write-Host $projectPath -ForegroundColor Yellow
    exit 1
}

Start-Process -FilePath $studioPath -ArgumentList "`"$projectPath`""
Write-Host "Abriendo proyecto Android TechStore Mobile..." -ForegroundColor Green
