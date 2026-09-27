$ErrorActionPreference = 'Stop'

$ProjectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$RepositoryRoot = Split-Path -Parent (Split-Path -Parent $ProjectRoot)
$TomcatRoot = Join-Path $RepositoryRoot '07_instaladores\apache-tomcat-10.1.57'

if ($env:JAVA_HOME) {
    $env:Path = "$env:JAVA_HOME\bin;$env:Path"
}

& "$PSScriptRoot\build.ps1"

$catalina = Join-Path $TomcatRoot 'bin\catalina.bat'
Start-Process -FilePath $catalina -ArgumentList 'run' -WorkingDirectory (Join-Path $TomcatRoot 'bin') -WindowStyle Hidden

Start-Sleep -Seconds 12
Write-Host "Servidor iniciado. Abre http://localhost:8080/techstore-web-servlets/ui/"
