# Product photos — drop them here

Drop a product image named by its **product id** and it appears on that product
automatically (card, quick-view modal, and featured shelf). No code change needed.

```
src/assets/merch/tee-dystopia.jpg      → DYSTØPIA Album Tee
src/assets/merch/hoodie-orbit.webp     → Orbit Rings Hoodie
src/assets/merch/track-tee-1.png       → UTØPIA — Track Tee
src/assets/merch/tumbler-cover.jpg     → DYSTØPIA Insulated Tumbler
```

- **Find a product's id** in `src/data/store.ts` (the `id:` field).
- **Supported:** `.jpg .jpeg .png .webp .avif`
- **Best results:** square (1:1), ~1200×1200, on a dark background to match the site.
- Vite optimizes + cache-busts each file at build time.
- An explicit `image: '...'` on a `MerchItem` still wins over the auto-wired file.

This folder ships with a **generated neon mockup** (`<id>.svg`) for every product,
so the store already looks like a full catalog of product shots. To replace one
with a real photo, just drop a raster file (`.jpg/.png/.webp/.avif`) with the same
id — a real photo always wins over the generated `.svg` sample. Regenerate all
mockups any time with `node scripts/genMerchMockups.mjs`.
