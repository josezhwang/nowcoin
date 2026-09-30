/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Absolute API base URL for production builds, e.g. https://api.nowcoin.digital/api */
  readonly VITE_API_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
