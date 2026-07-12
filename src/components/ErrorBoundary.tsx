import { Component, type ErrorInfo, type ReactNode } from 'react'

type Props = {
  children: ReactNode
  /** Rendered in place of the subtree once it has errored. Defaults to nothing. */
  fallback?: ReactNode
  /** Label for the console diagnostic (e.g. "3D world"). */
  label?: string
}

type State = { failed: boolean }

/**
 * Catches render/runtime errors in a subtree so one failing branch can't unmount
 * the whole React root and blank the page. The most likely offender is the WebGL
 * world on an old GPU / lost context / a failed chunk load — wrapping it lets the
 * rest of the site keep working (the static `.react-bg` shows behind it), instead
 * of a white screen for the whole experience.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { failed: false }

  static getDerivedStateFromError(): State {
    return { failed: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Surface it for debugging; never rethrow (that would defeat the boundary).
    console.error(
      `[ErrorBoundary${this.props.label ? ` · ${this.props.label}` : ''}]`,
      error,
      info.componentStack,
    )
  }

  render() {
    if (this.state.failed) return this.props.fallback ?? null
    return this.props.children
  }
}
