import { useRef } from 'react'
import type { Post } from '../../data/posts'
import { useExperience } from '../../store/useExperience'
import { useDialog } from '../../lib/useDialog'
import { TechFrame } from './TechFrame'
import { NeonButton } from './NeonButton'

/** In-page reader for a news post with a full body. */
export function PostModal({ post, onClose }: { post: Post | null; onClose: () => void }) {
  const scrollTo = useExperience((s) => s.scrollTo)
  const panelRef = useRef<HTMLDivElement>(null)
  useDialog(!!post, onClose, panelRef)

  if (!post) return null
  const cta = post.cta
  const internal = cta?.href.startsWith('#')

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-void/85 p-4 backdrop-blur-md"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={post.title}
    >
      <div
        ref={panelRef}
        tabIndex={-1}
        className="relative w-full max-w-2xl outline-none"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute -top-2 right-0 z-10 flex h-9 w-9 -translate-y-full items-center justify-center rounded-full border border-white/15 bg-void/60 text-slate-300 backdrop-blur transition hover:border-neon-purple/70 hover:text-white md:-right-2"
        >
          ✕
        </button>
        <TechFrame glow="mix">
          <div className="max-h-[80vh] overflow-y-auto pr-1">
            <div className="flex items-center justify-between gap-3">
              <span className="rounded-full border border-neon-purple/40 bg-void/40 px-2.5 py-1 font-display text-[0.55rem] uppercase tracking-widest2 text-neon-purple">
                {post.category}
              </span>
              <span className="font-mono text-[0.6rem] uppercase tracking-widest2 text-slate-500">
                {post.date}
              </span>
            </div>
            <h3 className="mt-4 font-display text-2xl font-black uppercase leading-tight tracking-tight text-white md:text-3xl">
              {post.title}
            </h3>
            <div className="mt-4 space-y-4">
              {post.body?.map((para, i) => (
                <p key={i} className="leading-relaxed text-slate-300">
                  {para}
                </p>
              ))}
            </div>
            {cta && (
              <div className="mt-7">
                {internal ? (
                  <NeonButton
                    variant="ember"
                    onClick={() => {
                      onClose()
                      scrollTo(cta.href)
                    }}
                  >
                    {cta.label} →
                  </NeonButton>
                ) : (
                  <NeonButton variant="ember" href={cta.href} newTab>
                    {cta.label} ↗
                  </NeonButton>
                )}
              </div>
            )}
          </div>
        </TechFrame>
      </div>
    </div>
  )
}
