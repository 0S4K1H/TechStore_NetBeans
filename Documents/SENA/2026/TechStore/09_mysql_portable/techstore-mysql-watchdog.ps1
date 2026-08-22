$ErrorActionPreference = 'SilentlyContinue'

$Port = 3308
$StartScript = 'C:\Users\mateo\Documents\SENA\2026\TechStore\09_mysql_portable\start-techstore-mysql.bat'

function Test-TechStorePort {
    $connection = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue
    return $null -ne $connection
}

while ($true) {
    if (-not (Test-TechStorePort)) {
        Start-Process -FilePath $StartScript -WindowStyle Hidden
        Start-Sleep -Seconds 10
    }

    Start-Sleep -Seconds 20
}
