# Patch every static page + Stitch source so form submissions open
# WhatsApp chat with the business number (+92 300 9484188) with prefilled details.
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$waNumber = '923009484188'

$helper = @'
<script>
/* BSR: route every form submission to WhatsApp +92 300 9484188 */
function bsrWaSubmit(f) {
  try {
    var m = 'Hello Bin Suleman Real Estate & Builders, I submitted a form on your website (' + document.title + ').\n\n';
    var els = f.querySelectorAll('input,select,textarea');
    for (var i = 0; i < els.length; i++) {
      var el = els[i], t = el.type;
      if (t === 'hidden' || t === 'submit' || t === 'button') continue;
      if ((t === 'checkbox' || t === 'radio') && !el.checked) continue;
      var v = (el.value || '').trim();
      if (!v) continue;
      var k = el.name || '';
      if (!k) {
        var p = el.parentElement, n = 0;
        while (p && !k && n < 3) {
          var l = p.querySelector('label');
          if (l) k = l.textContent || '';
          p = p.parentElement;
          n++;
        }
      }
      if (!k) k = el.getAttribute('placeholder') || '';
      if (!k) k = (el.tagName === 'SELECT' ? 'Selection' : 'Detail');
      k = String(k).replace(/\s+/g, ' ').replace(/\s*\*+$/, '').trim();
      m += k + ': ' + v + '\n';
    }
    var u = 'https://wa.me/__WANUM__?text=' + encodeURIComponent(m);
    var w = null;
    try { w = window.open(u, '_blank'); } catch (e) {}
    if (!w) { location.href = u; }
  } catch (e) {}
}
</script>
'@
$helper = $helper.Replace('__WANUM__', $waNumber)

$files = @('index.html', 'contact.html', 'services.html', 'blog.html', 'about.html', 'listings.html') |
  ForEach-Object { Join-Path $root $_ }
$files += Get-ChildItem -Path $root -Directory |
  Where-Object { $_.Name -like '*_bin_suleman_real_estate' } |
  ForEach-Object { Join-Path $_.FullName 'code.html' }

$report = @()
foreach ($path in $files) {
  if (-not (Test-Path $path -PathType Leaf)) { continue }
  $html = Get-Content -Path $path -Raw
  $orig = $html
  # 1) append the WhatsApp routing call at the end of every inline onsubmit handler,
  #    keeping the page's original feedback (banner/alert) behaviour intact
  $html = [regex]::Replace($html, 'onsubmit="([^"]*)"', 'onsubmit="$1; bsrWaSubmit(this);"')
  # 2) inject the helper once, right before </body>
  if ($html -notmatch 'function bsrWaSubmit') {
    $html = $html -replace '(?i)</body>', ($helper + "`n</body>")
  }
  if ($html -ne $orig) {
    Set-Content -Path $path -Value $html -Encoding UTF8 -NoNewline
    $report += "PATCHED: $path"
  } else {
    $report += "unchanged: $path"
  }
}
$report | Out-File -FilePath (Join-Path $root 'patch-static-log.txt') -Encoding utf8
