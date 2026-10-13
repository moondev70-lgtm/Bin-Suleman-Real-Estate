# Detached production build for the Next.js app; writes next/build-log.txt
$ErrorActionPreference = 'Continue'
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location (Join-Path $root 'next')
npm run build *> build-log.txt
Add-Content -Path build-log.txt -Value "EXITCODE:$LASTEXITCODE"
