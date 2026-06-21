# CLAUDE.md — LEOPARDØ / DYSTØPIA

Project context and conventions for working in this repo. Read this first.

## What this is

An immersive, scroll-driven 3D experience for the music artist **LEOPARDØ**, built
around the album **DYSTØPIA**. The whole site is one cinematic journey that travels the
album's narrative arc — **UTØPIA → DYSTØPIA** — with a fixed React Three Fiber world
behind the page that adapts to scroll, pointer, and the currently-playing track.

- **Owner:** Jason (jason@pharrgo.com) · GitHub `showoffjp/Le0pard`
- **Source of truth for music:** https://leopardomusic.bandcamp.com/album/dyst-pia
- **Deploy:** Vercel project `leopard` (auto-deploys previews per branch/PR).

## Design language (hard rules)

- **Dark mode only.** Background is near-black (`#04050a`).
- **Primary colors: purple + blue.** Cyan is a secondary accent. **Avoid pink/magenta** —
  prefer violet (`#8b5cf6`) / purple (`#a855f7`). Orange (`#ff6a00`) is a *sparing* heat
  accent only (embers, the album's flame wordmark), never dominant.
- Visual motif from the album art: the **octagonal neon "tech frame"** (`.clip-tech` +
  `TechFrame`). Reuse it. Heavy neon **bloom** is the signature.
- Type: **Orbitron** (display/headlines) + **Rajdhani** (UI/body), self-hosted.
- Respect `prefers-reduced-motion`; keep a lighter path for low-power/mobile.

## Commands

```bash
npm run dev        # local dev (http://localhost:5173)
npm run build      # production build → dist/
npm run preview    # serve the build
npm run typecheck  # tsc --noEmit  (run before committing)
```

Verify visual changes with a headless screenshot (Playwright + SwiftShader WebGL) when
practical — the 3D output is the product.

## Architecture

- **`src/three/`** — the 3D world. `Experience` mounts a fixed full-screen `<Canvas>`;
  `Scene` assembles fog/lights + `Core`, `Shards`, `Particles`, `NeonGrid`, `CameraRig`,
  `Effects`. Components read shared state via `getState()` inside `useFrame` (no re-renders).
- **`src/lib/palette.ts`** — the UTØPIA→DYSTØPIA color "journey". `samplePalette(progress)`
  mutates a reusable object (no per-frame allocations).
- **`src/store/useExperience.ts`** — zustand: scroll `progress`, `pointer`, `ready`,
  `reducedMotion`, `lowPower`, `scrollTo`.
- **`src/store/useAudio.ts`** + **`src/lib/audioSignal.ts`** — the reactive visualizer.
  `useAudio` holds `playing`/`trackIndex`; `audioSignal.ts` synthesizes a per-track
  beat/energy `signal` (driven by `useAudioClock`). The 3D scene + DOM (`NowPlaying`,
  `BeatPulse`) read `signal` every frame.
  - ⚠️ Bandcamp audio is cross-origin and **cannot** be analyzed. The signal is currently
    *synthesized*. To make it real: add hosted preview clips and replace `tickSignal` with
    a WebAudio `AnalyserNode` feed — every consumer stays the same.
- **`src/sections/`** — page sections (Hero, Manifesto, AlbumShowcase, TrackList, Listen,
  Video, Discography, About).
- **`src/components/`** — `layout/` (Loader, Navbar, ScrollHud, NowPlaying, Footer),
  `ui/` (TechFrame, NeonButton, SectionHeading, Reveal, MagicLayer, Marquee, GlitchText),
  `effects/` (BeatPulse).
- **`src/data/`** — `site.ts` + `music.ts` are the single source of truth for content.

## Conventions

- TypeScript, function components, hooks. Keep per-frame work allocation-free.
- New content → edit `src/data/*`, don't hardcode in components.
- New 3D reactivity → read from `signal` / `useExperience.getState()` inside `useFrame`.
- Keep the z-order: canvas `z-0` · content `z-10` · `BeatPulse` `z-30` · dock `z-40` ·
  navbar `z-50` · loader `z-100`.
- Don't commit `node_modules`/`dist`. `playwright` is installed `--no-save` for screenshots.

## Roadmap / ideas

- Real audio: self-hosted previews + WebAudio analyser (replaces synthesized signal).
- Posts / promotions section (futuristic blog/CMS).
- Full video gallery; per-track 3D scenes.
- Merch / store.
