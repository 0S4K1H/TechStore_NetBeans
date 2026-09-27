$ErrorActionPreference = "Stop"
$logFile = Join-Path $PSScriptRoot "reset_mysql_root.log"
Start-Transcript -Path $logFile -Force

$mysqlBin = "C:\Program Files\MySQL\MySQL Server 8.0\bin"
$mysqld = Join-Path $mysqlBin "mysqld.exe"
$mysql = Join-Path $mysqlBin "mysql.exe"
$defaults = "C:\ProgramData\MySQL\MySQL Server 8.0\my.ini"
$service = "MySQL80"
$newPassword = "RootTechstore#2026"
$initFile = "$env:TEMP\mysql-init-reset.sql"

Write-Host "==> Preparando archivo init"
"ALTER USER 'root'@'localhost' IDENTIFIED BY '$newPassword'; FLUSH PRIVILEGES;" | Set-Content -Path $initFile -Encoding ASCII

Write-Host "==> Deteniendo servicio (si esta iniciado)"
sc.exe stop $service | Out-Null
Start-Sleep -Seconds 2

Write-Host "==> Ejecutando reset temporal"
$args = @(
  "--defaults-file=$defaults"
  "--init-file=$initFile"
  "--console"
)
$p = Start-Process -FilePath $mysqld -ArgumentList $args -PassThru -WindowStyle Hidden
Start-Sleep -Seconds 7
if (-not $p.HasExited) {
  Stop-Process -Id $p.Id -Force
}

Write-Host "==> Iniciando servicio normal"
sc.exe start $service | Out-Null
Start-Sleep -Seconds 3

Write-Host "==> Probando acceso root"
& $mysql -u root "-p$newPassword" -e "SELECT 'OK_ROOT' AS estado, VERSION() AS version;"

Write-Host ""
Write-Host "LISTO. Nueva clave root: $newPassword"
Stop-Transcript
