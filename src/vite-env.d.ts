/// <reference types="vite/client" />

declare module '*.jpg' {
  const src: string;
  export default src;
}

declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.svg' {
  const src: string;
  export default src;
}

declare interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly [key: string]: string;
}

declare interface ImportMeta {
  readonly env: ImportMetaEnv;
}
