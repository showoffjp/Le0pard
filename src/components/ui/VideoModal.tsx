import { useEffect } from 'react'
import { embedUrl, type Video } from '../../data/videos'
import { TechFrame } from './TechFrame'

/** Lightbox for embeddable videos (YouTube/Vimeo). */
export function VideoModal({ video, onClose }: { video: Video | null; onClose: () => void }) {
  useEffect(() => {
    if (!video) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [video, onClose])

  if (!video) return null
  const src = embedUrl(video)

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-void/85 p-4 backdrop-blur-md"
      onClick={onClose}
    >
      <div className="w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-display text-sm font-bold uppercase tracking-widest2 text-white">
            {video.title}
          </h3>
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-slate-300 transition hover:border-neon-purple/70 hover:text-white"
          >
            ✕
          </button>
        </div>
        <TechFrame glow="mix" padded={false}>
          <div className="aspect-video w-full">
            {src ? (
              <iframe
                title={video.title}
                src={src}
                className="h-full w-full"
                style={{ border: 0 }}
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
              />
            ) : null}
          </div>
        </TechFrame>
      </div>
    </div>
  )
}
