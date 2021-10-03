/// <reference types="svelte" />
/// <reference types="vite/client" />

interface ImportMetaEnv extends Readonly<Record<string, string>> {
  readonly FRONT_WS_SERVER: string;
}
