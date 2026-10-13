# BSR site asset pipeline: download Stitch images locally, copy brand assets, build root pages
$ErrorActionPreference = 'Stop'
$root = 'C:\Users\lenovo\Downloads\AI Generated pics Moon\Bin Suleman Official Website'
$parent = 'C:\Users\lenovo\Downloads\AI Generated pics Moon'
New-Item -ItemType Directory -Force -Path "$root\assets\images" | Out-Null
New-Item -ItemType Directory -Force -Path "$root\assets\video" | Out-Null

# 1. Copy real brand assets
Copy-Item "$parent\BSR NAME.png" "$root\assets\images\bsr-name.png" -Force
Copy-Item "$parent\a2c40840cf95dde8784132e3897449b8.mp4" "$root\assets\video\promo.mp4" -Force

# 2. Download all Stitch-hosted images with stable short names
$urls = Get-Content "$root\urls.txt"
$map = @{}
$i = 0
foreach ($u in $urls) {
  $i++
  $id = ($u -split '/')[-1].Substring(0, 12).ToLower()
  $existing = Get-ChildItem "$root\assets\images" -File -Filter "img-$i-*" -ErrorAction SilentlyContinue | Select-Object -First 1
  if ($existing) {
    $map[$u] = "assets/images/$($existing.Name)"
    Write-Host "SKIP $u -> $($existing.Name)"
    continue
  }
  $tmp = "$root\assets\images\dl-$id"
  try {
    Invoke-WebRequest -Uri $u -OutFile $tmp -UseBasicParsing -TimeoutSec 60
    $bytes = [System.IO.File]::ReadAllBytes($tmp)
    $ext = 'jpg'
    if ($bytes.Length -ge 8 -and $bytes[0] -eq 0x89 -and $bytes[1] -eq 0x50) { $ext = 'png' }
    elseif ($bytes.Length -ge 3 -and $bytes[0] -eq 0xFF -and $bytes[1] -eq 0xD8) { $ext = 'jpg' }
    elseif ($bytes.Length -ge 12 -and $bytes[8] -eq 0x57 -and $bytes[9] -eq 0x45) { $ext = 'webp' }
    $name = "img-$i-$id.$ext"
    Move-Item $tmp "$root\assets\images\$name" -Force
    $map[$u] = "assets/images/$name"
    Write-Host "OK  $name"
  } catch {
    Write-Host "FAIL $u :: $($_.Exception.Message)"
    if (Test-Path $tmp) { Remove-Item $tmp -Force }
  }
}
$map | ConvertTo-Json -Depth 2 | Set-Content "$root\assets\image-map.json"
Write-Host "Downloaded $($map.Count) of $($urls.Count)"

# 3. Regenerate every brand logo file (bsr-logo.png x2 + favicon.ico x3) from
#    the golden emblem — see make-brand-logo.ps1 for details.
& "$root\make-brand-logo.ps1"
