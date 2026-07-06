import { useState } from 'react'
import { posts, featuredPromo, type Post, type PostCategory } from '../data/posts'
import { useExperience } from '../store/useExperience'
import { SectionHeading } from '../components/ui/SectionHeading'
import { TechFrame } from '../components/ui/TechFrame'
import { TiltCard } from '../components/ui/TiltCard'
import { NeonButton } from '../components/ui/NeonButton'
import { Reveal } from '../components/ui/Reveal'
import { PostModal } from '../components/ui/PostModal'
import { cn } from '../lib/cn'

const CAT: Record<PostCategory, { glow: 'purple' | 'blue' | 'cyan' | 'ember' | 'mix'; text: string }> = {
  DROP: { glow: 'ember', text: 'text-neon-ember border-neon-ember/40' },
  VIDEO: { glow: 'cyan', text: 'text-neon-cyan border-neon-cyan/40' },
  NEWS: { glow: 'blue', text: 'text-neon-blue border-neon-blue/40' },
  PROMO: { glow: 'purple', text: 'text-neon-purple border-neon-purple/40' },
  SHOW: { glow: 'purple', text: 'text-neon-violet border-neon-violet/40' },
}

export function Posts() {
  const scrollTo = useExperience((s) => s.scrollTo)
  const [active, setActive] = useState<Post | null>(null)
  return (
    <section id="posts" className="relative z-10 mx-auto max-w-7xl scroll-mt-24 px-5 py-24 md:px-8">
      <Reveal>
        <SectionHeading index="08" kicker="Signals from the Front" title="News & Drops" />
      </Reveal>

      {/* Featured promo */}
      <Reveal>
        <TechFrame glow="mix" className="mb-8">
          <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-neon-ember/40 bg-void/50 px-3 py-1 font-display text-[0.6rem] uppercase tracking-widest2 text-neon-ember">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-neon-ember shadow-[0_0_10px_#ff6a00]" />
                {featuredPromo.badge}
              </span>
              <h3 className="mt-4 font-display text-2xl font-black uppercase leading-tight tracking-tight text-white md:text-4xl">
                {featuredPromo.title}
              </h3>
              <p className="mt-3 max-w-xl leading-relaxed text-slate-400">{featuredPromo.body}</p>
            </div>
            <NeonButton href={featuredPromo.cta.href} variant="ember" newTab>
              ▶ {featuredPromo.cta.label}
            </NeonButton>
          </div>
        </TechFrame>
      </Reveal>

      {/* Feed */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post, i) => {
          const cat = CAT[post.category]
          const Card = (
            <TechFrame glow={cat.glow} className="h-full" innerClassName="flex h-full flex-col">
              <div className="flex items-center justify-between">
                <span
                  className={cn(
                    'rounded-full border bg-void/40 px-2.5 py-1 font-display text-[0.55rem] uppercase tracking-widest2',
                    cat.text,
                  )}
                >
                  {post.category}
                </span>
                <span className="font-mono text-[0.6rem] uppercase tracking-widest2 text-slate-500">
                  {post.date}
                </span>
              </div>
              <h4 className="mt-4 font-display text-lg font-bold uppercase leading-tight tracking-tight text-white">
                {post.title}
              </h4>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-400">{post.excerpt}</p>
              <span
                className={cn(
                  'mt-5 inline-flex items-center gap-2 font-display text-[0.62rem] uppercase tracking-widest2 transition',
                  post.body || post.href ? 'text-neon-cyan group-hover:gap-3' : 'text-slate-600',
                )}
              >
                {post.body
                  ? 'Read →'
                  : post.href
                    ? post.href.startsWith('#')
                      ? 'Shop ↗'
                      : 'Read ↗'
                    : 'Soon'}
              </span>
            </TechFrame>
          )

          const internal = post.href?.startsWith('#')
          return (
            <Reveal key={post.id} delay={i * 80}>
              <TiltCard className="h-full">
                {post.body ? (
                  <button
                    type="button"
                    onClick={() => setActive(post)}
                    aria-label={`Read: ${post.title}`}
                    className="group block h-full w-full cursor-pointer text-left"
                  >
                    {Card}
                  </button>
                ) : post.href ? (
                  internal ? (
                    <a
                      href={post.href}
                      onClick={(e) => {
                        e.preventDefault()
                        scrollTo(post.href!)
                      }}
                      className="group block h-full cursor-pointer"
                    >
                      {Card}
                    </a>
                  ) : (
                    <a
                      href={post.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block h-full"
                    >
                      {Card}
                    </a>
                  )
                ) : (
                  <div className="group h-full">{Card}</div>
                )}
              </TiltCard>
            </Reveal>
          )
        })}
      </div>

      <PostModal post={active} onClose={() => setActive(null)} />
    </section>
  )
}
