/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Form-POST endpoint for the Signal List email capture (Formspree/Getform). */
  readonly VITE_SUBSCRIBE_ENDPOINT?: string
  /** Hosted URL of the reactive launch film (overrides src/assets/video/launch.*). */
  readonly VITE_LAUNCH_VIDEO_URL?: string
  /** Hosted URL of the lighter mobile launch film (overrides launch-mobile.*). */
  readonly VITE_LAUNCH_VIDEO_MOBILE_URL?: string
  /** Hosted URL of the launch-film poster frame. */
  readonly VITE_LAUNCH_POSTER_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
