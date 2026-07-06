import { useRef } from 'react'
import { embedUrl, type Video } from '../../data/videos'
import { useDialog } from '../../lib/useDialog'
import { TechFrame } from './TechFrame'

/** Lightbox for embeddable videos (YouTube/Vimeo). */
export function VideoModal({ video, onClose }: { video: Video | null; onClose: () => void }) {
  const panelRef = useRef<HTMLDivElement>(null)
  useDialog(!!video, onClose, panelRef)

  if (!video) return null
  const src = embedUrl(video)

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-void/85 p-4 backdrop-blur-md"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${video.title} video`}
    >
      <div
        ref={panelRef}
        tabIndex={-1}
        className="w-full max-w-4xl outline-none"
        onClick={(e) => e.stopPropagation()}
      >
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
          <div className="aspect-video w-full bg-black">
            {video.file ? (
              <video
                src={video.file}
                poster={video.cover}
                controls
                autoPlay
                playsInline
                className="h-full w-full"
              />
            ) : src ? (
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
