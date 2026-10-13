# make-brand-logo.ps1 — regenerate every BSR logo file from the single source image.
#
# Source:  assets/images/img-1-ab6axuaiqxcc.png (golden emblem on solid black)
# Outputs: assets/images/bsr-logo.png        (black keyed to transparent)
#          next/public/images/bsr-logo.png   (same — feeds Next header, footer,
#                                             apple-touch icon + PWA manifest)
#          favicon.ico at repo root, assets/images/, next/public/images/
#                                              (PNG-in-ICO, 256x256)
#
# The black background must become transparent because the Next.js footer is
# white; the topbars are near-black so either version works there.
# Idempotent — safe to re-run any time. Called at the end of build-assets.ps1.
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$srcPath = Join-Path $root 'assets\images\img-1-ab6axuaiqxcc.png'
if (-not (Test-Path $srcPath)) { throw "Source emblem missing: $srcPath" }

# --- 1. Key black -> transparent (alpha = max channel, keeps gold + soft glow) ---
$src = New-Object System.Drawing.Bitmap($srcPath)
$bmp = New-Object System.Drawing.Bitmap($src.Width, $src.Height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.DrawImage($src, 0, 0, $src.Width, $src.Height)
$g.Dispose()
$src.Dispose()

$rect = New-Object System.Drawing.Rectangle(0, 0, $bmp.Width, $bmp.Height)
$data = $bmp.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::ReadWrite, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$bytes = New-Object byte[] ($data.Stride * $bmp.Height)
[System.Runtime.InteropServices.Marshal]::Copy($data.Scan0, $bytes, 0, $bytes.Length)
for ($i = 0; $i -lt $bytes.Length; $i += 4) {
  $b = [int]$bytes[$i]; $gr = [int]$bytes[$i + 1]; $r = [int]$bytes[$i + 2]
  $bytes[$i + 3] = [byte][Math]::Min(255, [Math]::Max($r, [Math]::Max($gr, $b)))
}
[System.Runtime.InteropServices.Marshal]::Copy($bytes, 0, $data.Scan0, $bytes.Length)
$bmp.UnlockBits($data)

# --- 2. Save the keyed emblem to both public locations ---
foreach ($rel in @('assets\images\bsr-logo.png', 'next\public\images\bsr-logo.png')) {
  $out = Join-Path $root $rel
  $bmp.Save($out, [System.Drawing.Imaging.ImageFormat]::Png)
  Write-Host "OK  $rel"
}

# --- 3. 256x256 PNG-in-ICO for every favicon location ------------------------
# Favicon keeps the solid black background (gold-on-black stays legible at
# 16px on light browser chrome); only the bsr-logo.png copies are keyed.
$icoSrc = New-Object System.Drawing.Bitmap(256, 256, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g = [System.Drawing.Graphics]::FromImage($icoSrc)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$flat = New-Object System.Drawing.Bitmap($srcPath)
$g.DrawImage($flat, 0, 0, 256, 256)
$g.Dispose()
$flat.Dispose()

$pngTmp = Join-Path $env:TEMP 'bsr-favicon.png'
$icoSrc.Save($pngTmp, [System.Drawing.Imaging.ImageFormat]::Png)
$icoSrc.Dispose()
$bmp.Dispose()
$png = [System.IO.File]::ReadAllBytes($pngTmp)

foreach ($rel in @('favicon.ico', 'assets\images\favicon.ico', 'next\public\images\favicon.ico')) {
  $out = Join-Path $root $rel
  $fs = [System.IO.File]::Create($out)
  $w = New-Object System.IO.BinaryWriter($fs)
  $w.Write([uint16]0)      # reserved
  $w.Write([uint16]1)      # type: icon
  $w.Write([uint16]1)      # one image
  $w.Write([byte]0)        # width 256
  $w.Write([byte]0)        # height 256
  $w.Write([byte]0)        # colors: 0
  $w.Write([byte]0)        # reserved
  $w.Write([uint16]1)      # planes
  $w.Write([uint16]32)     # bit count
  $w.Write([uint32]$png.Length)
  $w.Write([uint32]22)     # header(6) + entry(16)
  $w.Write($png)
  $w.Close()
  $fs.Close()
  Write-Host "OK  $rel"
}
Remove-Item $pngTmp -Force
Write-Host 'Brand logo regeneration complete.'
