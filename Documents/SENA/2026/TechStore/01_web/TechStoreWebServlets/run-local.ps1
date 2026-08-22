$ErrorActionPreference = 'Stop'

$TomcatRoot = 'C:\Users\mateo\Documents\SENA\2026\TechStore\07_instaladores\apache-tomcat-10.1.57'
$JavaHome = 'C:\Users\mateo\Downloads\TechStore_Setup\OpenJDK21U-jdk_x64_windows_hotspot_21\jdk-21.0.11+10'

$env:JAVA_HOME = $JavaHome
$env:Path = "$JavaHome\bin;$env:Path"

& "$PSScriptRoot\build.ps1"

$catalina = Join-Path $TomcatRoot 'bin\catalina.bat'
Start-Process -FilePath $catalina -ArgumentList 'run' -WorkingDirectory (Join-Path $TomcatRoot 'bin') -WindowStyle Hidden

Start-Sleep -Seconds 12
Write-Host "Servidor iniciado. Abre http://localhost:8080/techstore-web-servlets/ui/"
