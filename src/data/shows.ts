// Live / tour dates. Drop real shows in the `shows` array and the Live section
// fills itself in — until then it renders a polished "coming soon" state. No
// dates are invented here; add them as they're confirmed.
export type Show = {
  /** Display date, e.g. "Jul 12, 2026". */
  date: string
  city: string
  venue: string
  /** Ticket link (Stripe/DICE/Eventbrite/etc.). Omit for a "Notify" state. */
  ticketsUrl?: string
  soldOut?: boolean
  support?: string
}

export const shows: Show[] = []
