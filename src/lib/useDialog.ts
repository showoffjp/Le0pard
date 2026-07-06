import { useEffect, type RefObject } from 'react'

// Everything the browser lets a user Tab onto, minus explicitly-removed nodes.
const FOCUSABLE =
  'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),' +
  'textarea:not([disabled]),iframe,[tabindex]:not([tabindex="-1"])'

/**
 * Modal accessibility in one place, matching the ØMEGA overlay's behavior:
 *   • Escape closes.
 *   • Body scroll is locked — saved and restored (not cleared) so a modal opened
 *     over another modal doesn't release the underlying lock on close.
 *   • Focus moves into the dialog on open and returns to the trigger on close.
 *   • Tab is trapped inside the dialog so focus can't wander to the page behind.
 *
 * `containerRef` must point at the dialog panel (give it tabIndex={-1} so it can
 * receive focus). Call unconditionally, before any early return, and pass the
 * open state as `active`.
 */
export function useDialog(
  active: boolean,
  onClose: () => void,
  containerRef: RefObject<HTMLElement | null>,
) {
  useEffect(() => {
    if (!active) return
    const container = containerRef.current
    const prevFocus = document.activeElement as HTMLElement | null
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    // Move focus into the panel itself so assistive tech enters the dialog.
    container?.focus()

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }
      if (e.key !== 'Tab' || !container) return
      const nodes = container.querySelectorAll<HTMLElement>(FOCUSABLE)
      if (nodes.length === 0) {
        e.preventDefault()
        container.focus()
        return
      }
      const first = nodes[0]
      const last = nodes[nodes.length - 1]
      const activeEl = document.activeElement
      if (e.shiftKey) {
        if (activeEl === first || activeEl === container) {
          e.preventDefault()
          last.focus()
        }
      } else if (activeEl === last) {
        e.preventDefault()
        first.focus()
      }
    }

    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
      prevFocus?.focus?.()
    }
  }, [active, onClose, containerRef])
}
