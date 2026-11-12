Add-Type -AssemblyName System.Drawing
$filePath = "C:\Users\arshi\.gemini\antigravity\brain\19edca05-fe52-44fc-9013-97fe4a643e65\.user_uploaded\media_1794394525838_53108017.jpg"
$bmp = New-Object System.Drawing.Bitmap($filePath)

# Background color at (10, 10)
$bg = $bmp.GetPixel(10, 10)
Write-Host "BG color: R=$($bg.R), G=$($bg.G), B=$($bg.B)"

function IsBg($c) {
    # Check if close to off-white bg (e.g. R>235, G>235, B>235 and diff between channels small)
    return ($c.R > 235 -and $c.G > 235 -and $c.B > 235 -and [Math]::Abs($c.R - $c.G) -lt 15 -and [Math]::Abs($c.G - $c.B) -lt 15)
}

# Find bounds for Top-Left (Fraganote) in region X: 20..512, Y: 20..300
$fMinX = 1000; $fMaxX = 0; $fMinY = 1000; $fMaxY = 0
for ($y = 20; $y -lt 300; $y += 2) {
    for ($x = 20; $x -lt 512; $x += 2) {
        $c = $bmp.GetPixel($x, $y)
        if (-not (IsBg $c)) {
            if ($x -lt $fMinX) { $fMinX = $x }
            if ($x -gt $fMaxX) { $fMaxX = $x }
            if ($y -lt $fMinY) { $fMinY = $y }
            if ($y -gt $fMaxY) { $fMaxY = $y }
        }
    }
}
Write-Host "Fraganote bounds: X=[$fMinX, $fMaxX], Y=[$fMinY, $fMaxY]"

# Find bounds for Top-Right (Chime) in region X: 512..1000, Y: 20..300
$cMinX = 1000; $cMaxX = 0; $cMinY = 1000; $cMaxY = 0
for ($y = 20; $y -lt 300; $y += 2) {
    for ($x = 512; $x -lt 1000; $x += 2) {
        $c = $bmp.GetPixel($x, $y)
        if (-not (IsBg $c)) {
            if ($x -lt $cMinX) { $cMinX = $x }
            if ($x -gt $cMaxX) { $cMaxX = $x }
            if ($y -lt $cMinY) { $cMinY = $y }
            if ($y -gt $cMaxY) { $cMaxY = $y }
        }
    }
}
Write-Host "Chime bounds: X=[$cMinX, $cMaxX], Y=[$cMinY, $cMaxY]"

# Find bounds for Bottom (Blinkit) in region X: 100..900, Y: 290..560
$bMinX = 1000; $bMaxX = 0; $bMinY = 1000; $bMaxY = 0
for ($y = 290; $y -lt 560; $y += 2) {
    for ($x = 100; $x -lt 900; $x += 2) {
        $c = $bmp.GetPixel($x, $y)
        if (-not (IsBg $c)) {
            if ($x -lt $bMinX) { $bMinX = $x }
            if ($x -gt $bMaxX) { $bMaxX = $x }
            if ($y -lt $bMinY) { $bMinY = $y }
            if ($y -gt $bMaxY) { $bMaxY = $y }
        }
    }
}
Write-Host "Blinkit bounds: X=[$bMinX, $bMaxX], Y=[$bMinY, $bMaxY]"

$bmp.Dispose()
