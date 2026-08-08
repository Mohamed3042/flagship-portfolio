param(
    [Parameter(Mandatory = $true)]
    [ValidatePattern('^NFX-A-\d{3}$')]
    [string]$ClipId
)

$WanDirectory = $PSScriptRoot
$InputPath = Join-Path $WanDirectory "accepted\$ClipId.mp4"
$OutputPath = Join-Path $WanDirectory "endframes\$ClipId-end.png"

if (-not (Test-Path -LiteralPath $InputPath)) {
    throw "Accepted clip not found: $InputPath"
}

New-Item -ItemType Directory -Force -Path (Split-Path -Parent $OutputPath) | Out-Null

& ffmpeg -hide_banner -loglevel error -y -nostdin -sseof -0.04 -i $InputPath -frames:v 1 $OutputPath
if ($LASTEXITCODE -ne 0) {
    throw "ffmpeg failed with exit code $LASTEXITCODE"
}

Write-Host "Saved $OutputPath"
