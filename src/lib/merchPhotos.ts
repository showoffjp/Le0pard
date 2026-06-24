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
const modules = import.meta.glob('../assets/merch/*.{jpg,jpeg,png,webp,avif}', {
  eager: true,
  import: 'default',
}) as Record<string, string>

const byId: Record<string, string> = {}
for (const [path, url] of Object.entries(modules)) {
  const file = path.split('/').pop() ?? ''
  const id = file.replace(/\.(jpe?g|png|webp|avif)$/i, '')
  if (id) byId[id] = url
}

/** Resolve a product photo by id (undefined when none has been dropped in). */
export function merchPhoto(id: string): string | undefined {
  return byId[id]
}

/** How many product photos are wired (handy for "X real photos" copy/debug). */
export const merchPhotoCount = Object.keys(byId).length
