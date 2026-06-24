/**
 * Zero-config product photos.
 *
 * Drop an image named by the product's `id` into `src/assets/merch/` and it
 * shows up on that product automatically — no code change needed. For example:
 *
 *   src/assets/merch/tee-dystopia.jpg   → DYSTØPIA Album Tee
 *   src/assets/merch/hoodie-orbit.webp  → Orbit Rings Hoodie
 *   src/assets/merch/track-tee-1.png    → UTØPIA — Track Tee
 *
 * (Find a product's id in src/data/store.ts.) Vite hashes + optimizes the file
 * at build time. An explicit `image` on the MerchItem still takes priority.
 *
 * Supported extensions: jpg jpeg png webp avif.
 */
const modules = import.meta.glob('../assets/merch/*.{jpg,jpeg,png,webp,avif,svg}', {
  eager: true,
  import: 'default',
}) as Record<string, string>

// A real raster photo (jpg/png/webp/avif) for an id always wins over a generated
// .svg sample of the same id — so dropping in a real shot replaces the mockup.
const byId: Record<string, string> = {}
const rank: Record<string, number> = {}
for (const [path, url] of Object.entries(modules)) {
  const file = path.split('/').pop() ?? ''
  const id = file.replace(/\.(jpe?g|png|webp|avif|svg)$/i, '')
  if (!id) continue
  const pr = /\.svg$/i.test(file) ? 0 : 1
  if (byId[id] === undefined || pr >= (rank[id] ?? -1)) {
    byId[id] = url
    rank[id] = pr
  }
}

/** Resolve a product photo by id (undefined when none has been dropped in). */
export function merchPhoto(id: string): string | undefined {
  return byId[id]
}

/** How many product photos are wired (handy for "X real photos" copy/debug). */
export const merchPhotoCount = Object.keys(byId).length
