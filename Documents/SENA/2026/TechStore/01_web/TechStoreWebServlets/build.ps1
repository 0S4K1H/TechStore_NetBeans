$ErrorActionPreference = 'Stop'

$ProjectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$RepositoryRoot = Split-Path -Parent (Split-Path -Parent $ProjectRoot)
$TomcatRoot = Join-Path $RepositoryRoot '07_instaladores\apache-tomcat-10.1.57'
$MysqlJar = Join-Path $ProjectRoot 'lib\mysql-connector-j-9.7.0.jar'
$GsonJar = Join-Path $ProjectRoot 'lib\gson-2.11.0.jar'
$BcryptJar = Join-Path $ProjectRoot 'lib\jbcrypt-0.4.jar'
$HikariJar = Join-Path $ProjectRoot 'lib\hikaricp-5.1.0.jar'
$Slf4jApiJar = Join-Path $ProjectRoot 'lib\slf4j-api-2.0.13.jar'
$Slf4jNopJar = Join-Path $ProjectRoot 'lib\slf4j-nop-2.0.13.jar'
$ServletApiJar = Join-Path $TomcatRoot 'lib\servlet-api.jar'
$ReactRoot = Join-Path (Split-Path -Parent $ProjectRoot) 'TechStoreReact'

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

& javac -encoding UTF-8 -cp "$ServletApiJar;$MysqlJar;$GsonJar;$BcryptJar;$HikariJar;$Slf4jApiJar" -d $ClassesDir $javaFiles

Push-Location $ReactRoot
try {
    & npm run build
} finally {
    Pop-Location
}

Copy-Item -Path (Join-Path $WebRoot '*') -Destination $StageDir -Recurse -Force
Copy-Item -Path (Join-Path $ClassesDir '*') -Destination (Join-Path $StageDir 'WEB-INF\classes') -Recurse -Force
Copy-Item -Path $MysqlJar -Destination (Join-Path $StageDir 'WEB-INF\lib') -Force
Copy-Item -Path $GsonJar -Destination (Join-Path $StageDir 'WEB-INF\lib') -Force
Copy-Item -Path $BcryptJar -Destination (Join-Path $StageDir 'WEB-INF\lib') -Force
Copy-Item -Path $HikariJar -Destination (Join-Path $StageDir 'WEB-INF\lib') -Force
Copy-Item -Path $Slf4jApiJar -Destination (Join-Path $StageDir 'WEB-INF\lib') -Force
Copy-Item -Path $Slf4jNopJar -Destination (Join-Path $StageDir 'WEB-INF\lib') -Force
New-Item -ItemType Directory -Force -Path (Join-Path $StageDir 'ui') | Out-Null
Copy-Item -Path (Join-Path $ReactRoot 'dist\*') -Destination (Join-Path $StageDir 'ui') -Recurse -Force

Copy-Item -Path $StageDir -Destination $DeployDir -Recurse -Force

Write-Host "Build y deploy completados en $DeployDir"
