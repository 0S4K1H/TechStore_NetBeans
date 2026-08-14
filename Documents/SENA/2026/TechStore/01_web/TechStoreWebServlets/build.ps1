$ErrorActionPreference = 'Stop'

$ProjectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$TomcatRoot = 'C:\Users\mateo\Documents\SENA\2026\TechStore\07_instaladores\apache-tomcat-10.1.57'
$MysqlJar = Join-Path $ProjectRoot 'lib\mysql-connector-j-9.7.0.jar'
$ServletApiJar = Join-Path $TomcatRoot 'lib\servlet-api.jar'

$SourceRoot = Join-Path $ProjectRoot 'src\main\java'
$WebRoot = Join-Path $ProjectRoot 'src\main\webapp'
$BuildRoot = Join-Path $ProjectRoot 'target'
$ClassesDir = Join-Path $BuildRoot 'classes'
$StageDir = Join-Path $BuildRoot 'TechStoreWeb'
$DeployDir = Join-Path $TomcatRoot 'webapps\TechStoreWeb'

if (Test-Path $BuildRoot) {
    Remove-Item $BuildRoot -Recurse -Force
}
if (Test-Path $DeployDir) {
    Remove-Item $DeployDir -Recurse -Force
}

New-Item -ItemType Directory -Force -Path $ClassesDir | Out-Null
New-Item -ItemType Directory -Force -Path $StageDir | Out-Null
New-Item -ItemType Directory -Force -Path (Join-Path $StageDir 'WEB-INF\classes') | Out-Null
New-Item -ItemType Directory -Force -Path (Join-Path $StageDir 'WEB-INF\lib') | Out-Null

$javaFiles = Get-ChildItem -Path $SourceRoot -Recurse -Filter *.java | Select-Object -ExpandProperty FullName
if (-not $javaFiles) {
    throw "No se encontraron archivos Java en $SourceRoot"
}

& javac -encoding UTF-8 -cp "$ServletApiJar;$MysqlJar" -d $ClassesDir $javaFiles

Copy-Item -Path (Join-Path $WebRoot '*') -Destination $StageDir -Recurse -Force
Copy-Item -Path (Join-Path $ClassesDir '*') -Destination (Join-Path $StageDir 'WEB-INF\classes') -Recurse -Force
Copy-Item -Path $MysqlJar -Destination (Join-Path $StageDir 'WEB-INF\lib') -Force

Copy-Item -Path $StageDir -Destination $DeployDir -Recurse -Force

Write-Host "Build y deploy completados en $DeployDir"
