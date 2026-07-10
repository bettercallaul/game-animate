$ErrorActionPreference = "Stop"

$ProjectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$Node = "C:\Users\HP\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
$Port = 4173

Set-Location $ProjectRoot
Write-Host "MBG Food Delivery running at http://127.0.0.1:$Port/web/"
Write-Host "Keep this terminal open while playing. Press Ctrl+C to stop."
& $Node "serve.js"
