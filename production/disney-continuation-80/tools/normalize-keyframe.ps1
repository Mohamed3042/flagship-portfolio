param(
  [Parameter(Mandatory = $true)][string]$InputPath,
  [Parameter(Mandatory = $true)][string]$OutputPath
)

$ErrorActionPreference = 'Stop'

$resolvedInput = (Resolve-Path -LiteralPath $InputPath).Path
$resolvedOutput = [System.IO.Path]::GetFullPath($OutputPath)
$outputDirectory = Split-Path -Parent $resolvedOutput
New-Item -ItemType Directory -Force -Path $outputDirectory | Out-Null

$ffmpeg = Get-Command ffmpeg -ErrorAction Stop
& $ffmpeg.Source -hide_banner -loglevel error -y -i $resolvedInput `
  -vf 'scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:960,setsar=1' `
  -frames:v 1 $resolvedOutput
if ($LASTEXITCODE -ne 0) {
  throw "ffmpeg failed with exit code $LASTEXITCODE"
}

Add-Type -AssemblyName System.Drawing
$image = [System.Drawing.Image]::FromFile($resolvedOutput)
try {
  if ($image.Width -ne 1920 -or $image.Height -ne 960) {
    throw "Unexpected normalized dimensions: $($image.Width)x$($image.Height)"
  }
} finally {
  $image.Dispose()
}

Write-Output "NORMALIZED_OK $resolvedOutput 1920x960"
