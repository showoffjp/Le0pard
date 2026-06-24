import { useEffect, useRef, useState } from 'react'

/**
 * Lightweight IntersectionObserver hook used to drive scroll reveals.
 * Returns a ref to attach and a boolean once the element has entered view.
 */
export function useInView<T extends HTMLElement = HTMLDivElement>(options?: {
  threshold?: number
  rootMargin?: string
  once?: boolean
}) {
  // threshold 0 (trigger as soon as any part enters) so TALL blocks still reveal
  // on small screens — a coverage threshold can never be met by an element taller
  // than the viewport, which left whole sections invisible on mobile.
  const { threshold = 0, rootMargin = '0px 0px -12% 0px', once = true } = options ?? {}
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          if (once) observer.disconnect()
        } else if (!once) {
          setInView(false)
        }
      },
      { threshold, rootMargin },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold, rootMargin, once])

  return { ref, inView }
}
