/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Sviluppo: origine del proxy Vite (Apache + WordPress in /cms). Es. http://127.0.0.1 */
  readonly VITE_WP_PROXY_TARGET?: string;
  readonly VITE_WP_API_URL?: string;
  readonly VITE_WP_API_VERSION?: string;
  readonly VITE_WP_URL?: string;
}
