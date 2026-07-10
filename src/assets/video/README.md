# Launch film — drop the video here

Drop an optimized web video named **`launch.mp4`** (and optionally `launch.webm`)
into this folder and it becomes the site's launch film:

- It **auto-plays on entry** as the deep backdrop (behind the neon 3D world).
- The whole site **reacts to it** through the same analyser the songs use.
- On the visitor's **first tap/click/keypress** it unmutes and goes fully
  reactive (browsers block autoplay-with-sound until a user gesture — universal,
  not something we can override).

```
src/assets/video/launch.mp4     ← becomes the launch film, zero code changes
```

## Why a file here instead of the Google Drive link

A cross-origin Google Drive iframe **cannot** autoplay with sound and **cannot**
be fed to the WebAudio analyser that powers the reactivity. A self-hosted file
can do both. (The film is still in the Video gallery as a Drive embed regardless,
so it's always watchable.)

## Recommended encode (keep it small — this ships with the site)

You do **not** need the full-resolution master for a looping backdrop:

- **Codec/container:** H.264 (High) in `.mp4`; add a VP9 `.webm` for extra savings.
- **Resolution:** 1920×1080 (or 1280×720 for an even lighter file).
- **Bitrate:** ~2–4 Mbps. Target a final file **under ~15 MB** if possible.
- **Audio:** AAC, 128–160 kbps. Keep the audio — it drives the reactivity.
- **`-movflags +faststart`** so it begins playing before it fully downloads.

Example with ffmpeg:

```bash
ffmpeg -i master.mov \
  -vf "scale=1920:-2" -c:v libx264 -profile:v high -crf 24 -preset slow \
  -c:a aac -b:a 160k -movflags +faststart \
  launch.mp4
```

Then `npm run build` — Vite hashes + serves it automatically.

## Big file? Host it on a CDN instead of committing it

Committing large videos bloats the git history permanently. For anything big,
host it externally and point the site at the URL — nothing lands in the repo.

**Launch film (reactive backdrop)** — set an env var (see `.env.example`):

```
VITE_LAUNCH_VIDEO_URL=https://<your-cdn>/launch.mp4
```

The URL wins over any local `launch.mp4`. Because the film feeds the audio
analyser, the host **must** send an `Access-Control-Allow-Origin` header — the
`<video>` loads with `crossOrigin="anonymous"`. Cloudflare R2 and Vercel Blob
both support this; Google Drive / YouTube do **not** (so they can't be the
reactive source, only gallery embeds).

**Gallery films** (click-to-watch in the lightbox) have no CORS rule — pass a
hosted URL straight into `src/data/videos.ts`:

```ts
film({
  id: 'visual-4', title: 'DYSTØPIA — Visual IV', subtitle: '…', date: '2026',
  key: 'visual4',
  fileUrl: 'https://<your-cdn>/visual4.mp4',   // hosted; nothing in the repo
  coverUrl: 'https://<your-cdn>/visual4.jpg',  // optional poster
})
```

`fileUrl` / `previewUrl` / `coverUrl` override the local-file lookup, and
`driveId` is optional. Encode the same way as above (H.264 mp4, `+faststart`).
