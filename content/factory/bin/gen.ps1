#requires -Version 5.1
<#
.SYNOPSIS
  WIZL Content Factory — generate an asset from a recipe.

.DESCRIPTION
  Reads recipes/{Recipe}.md, fills in variables from -Vars,
  composes the prompt from nodes/style.txt + nodes/character.txt + nodes/worlds/{World}.txt,
  and calls `higgsfield generate create --wait` with the right model + aspect.

  Output goes to content/posts/{Date}-{Slug}/.

.EXAMPLE
  ./gen.ps1 -Recipe strain-of-day -Vars @{ Strain='Blue Dream'; Type='Hybrid'; World='secret-garden'; THC='21' }

.EXAMPLE
  ./gen.ps1 -Recipe wisdom-card -Vars @{ Quote='Terpenes tell you more than THC ever will.'; World='rooftop'; Action='sitting cross-legged with the book' }
#>
[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [ValidateSet('strain-of-day', 'wisdom-card', 'sticker-monster', 'shop-visit-video', 'celebrity-tag', 'story-background', 'terpene-school', 'strain-battle')]
    [string]$Recipe,

    [Parameter(Mandatory = $true)]
    [hashtable]$Vars,

    [string]$Date = (Get-Date -Format 'yyyy-MM-dd'),

    [string]$ProjectRoot = (Resolve-Path "$PSScriptRoot/../../..").Path,

    [switch]$DryRun
)

$ErrorActionPreference = 'Stop'

$FactoryRoot = Join-Path $ProjectRoot 'content/factory'
$PostsRoot   = Join-Path $ProjectRoot 'content/posts'
$MascotRef   = Join-Path $ProjectRoot 'public/mascot.png'  # canonical Wizl — drives style via reference, do not override with style-fanaticism in prompts

function Read-Node([string]$relative) {
    $p = Join-Path $FactoryRoot $relative
    if (-not (Test-Path $p)) { throw "Missing node: $p" }
    (Get-Content $p -Raw).Trim()
}

function Get-Slug([string]$text) {
    ($text -replace '[^a-zA-Z0-9]+', '-').ToLower().Trim('-')
}

# --- Compose prompt -----------------------------------------------------------
$style     = Read-Node 'nodes/style.txt'
$character = Read-Node 'nodes/character.txt'
$worldName = $Vars.World
$world     = if ($worldName) { Read-Node "nodes/worlds/$worldName.txt" } else { '' }

# Recipe-specific assembly
switch ($Recipe) {
    'strain-of-day' {
        $strain = $Vars.Strain
        $slug   = Get-Slug $strain
        $outDir = Join-Path $PostsRoot "$Date-$slug"
        $prompt = @"
$character

WIZL is examining a glass jar labeled "$strain" — he holds a single bud up to the emerald light of his staff, expression curious and delighted. The orange cat in his satchel sniffs the jar with interest. Setting: $world

$style
"@
        $model  = 'seedream_v4_5'
        $aspect = '3:4'
    }

    'wisdom-card' {
        $quote  = $Vars.Quote
        $action = if ($Vars.Action) { $Vars.Action } else { 'sitting cross-legged with the open magical book' }
        $slug   = Get-Slug ($quote.Substring(0, [Math]::Min(40, $quote.Length)))
        $outDir = Join-Path $PostsRoot "$Date-wisdom-$slug"
        $prompt = @"
Square editorial poster card. Deep navy #0B1218 background with smoky haze drifting across top and bottom. WIZL mascot on the left third, in the setting below. Right two-thirds reserved for the quote text.

QUOTE:
"$quote"
— WIZL

Quote in Montserrat Black 56px, cream #F2E8D4, italic emphasis on the most important word. "— WIZL" attribution in 18px Montserrat Light, neon green #99F788, letter-spacing 0.3em. Bottom-right tiny: "wizl.space" in 12px muted grey, letter-spacing 0.1em.

CHARACTER: $character
He is $action.

WORLD: $world

STYLE: $style

Soft drifting cannabis-leaf doodles and faint firefly particles around the quote. Whimsical storybook charm, never corporate.
"@
        $model  = 'seedream_v4_5'
        $aspect = '1:1'
    }

    'sticker-monster' {
        $strain      = $Vars.Strain
        $personality = $Vars.Personality
        $colors      = $Vars.Colors
        $number      = $Vars.Number
        $slug        = Get-Slug $strain
        $outDir      = Join-Path $PostsRoot "$Date-sticker-$slug"
        $prompt = @"
Cute monster character for "$strain" cannabis strain. The monster is $personality. Small round creature, big expressive eyes, $colors color scheme. Collectible vinyl toy style — like a Kidrobot Dunny crossed with a soft plush. Dark background #0a0a0e. Tiny text "wizl.space — $number" at the bottom center in muted grey, letter-spacing 0.1em. NO cannabis leaves, NO red eyes, NO weed stereotypes. Sticker-ready design with slight drop shadow. Storybook charm meets street culture. Subtle grain texture.
"@
        $model  = 'nano_banana_flash'
        $aspect = '1:1'
    }

    'shop-visit-video' {
        $shop   = $Vars.Shop
        $action = $Vars.Action
        $dur    = if ($Vars.Duration) { [int]$Vars.Duration } else { 8 }
        $slug   = Get-Slug $shop
        $outDir = Join-Path $PostsRoot "$Date-shop-$slug"
        Write-Host "shop-visit-video is a 2-step recipe: first generates a start frame, then animates."
        Write-Host "Run: ./gen.ps1 -Recipe shop-visit-frame   (then) ./gen.ps1 -Recipe shop-visit-animate"
        return
    }

    'celebrity-tag' {
        $celeb  = $Vars.Celebrity
        $pose   = $Vars.Pose
        $slug   = Get-Slug $celeb
        $outDir = Join-Path $PostsRoot "$Date-tag-$slug"
        $prompt = @"
$character

WIZL is $pose. The scene suggests gentle curiosity, never aggressive — daydreaming, wondering, thinking aloud. The orange cat in his satchel matches the mood. Cozy intimate composition. Setting: $world

$style
"@
        $model  = 'seedream_v4_5'
        $aspect = '1:1'
    }

    'story-background' {
        $mood = $Vars.Mood
        $tod  = $Vars.TimeOfDay
        $slug = "$worldName-$mood"
        $outDir = Join-Path $FactoryRoot "stories-pack"
        $prompt = @"
$character

WIZL is in the setting below at $tod, posed at the bottom 30% of the frame so the top 60% remains atmospheric and clean for text overlay. Looking thoughtful, never blocking the upper space. Mood: $mood. Setting: $world

$style

Vertical 9:16 composition. Wizl bottom-center, small in frame. Bokeh smoke, drifting fireflies, soft glow at edges. Top portion deliberately quiet and uncluttered.
"@
        $model  = 'seedream_v4_5'
        $aspect = '9:16'
    }

    default {
        throw "Recipe '$Recipe' not yet implemented in gen.ps1. See recipes/$Recipe.md for the spec."
    }
}

if (-not (Test-Path $outDir)) {
    New-Item -ItemType Directory -Path $outDir | Out-Null
}

$promptFile = Join-Path $outDir 'prompt.txt'
$prompt | Out-File -Encoding utf8 -FilePath $promptFile

Write-Host ""
Write-Host "=== WIZL Factory ==="
Write-Host "Recipe: $Recipe"
Write-Host "Model:  $model"
Write-Host "Aspect: $aspect"
Write-Host "Output: $outDir"
Write-Host "Prompt: $promptFile"
Write-Host ""

if ($DryRun) {
    Write-Host "DRY RUN — not calling higgsfield."
    Write-Host "Prompt preview:"
    Write-Host ($prompt.Substring(0, [Math]::Min(500, $prompt.Length)) + '...')
    return
}

# Use mascot.png as reference for all character-bearing recipes
$useRef = $Recipe -in @('strain-of-day', 'wisdom-card', 'celebrity-tag', 'story-background')

$args = @(
    'generate', 'create', $model,
    '--prompt', $prompt,
    '--aspect_ratio', $aspect,
    '--wait',
    '--wait-timeout', '10m'
)

if ($useRef -and (Test-Path $MascotRef)) {
    $args += @('--image', $MascotRef)
}

Write-Host "Calling: higgsfield $($args -join ' ')"
Write-Host ""

& higgsfield @args
