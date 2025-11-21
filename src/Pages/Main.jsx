// Legacy component retained for backwards compatibility. The new chat
// experience now lives in `src/App.tsx` and uses TypeScript + Tailwind v4.
// This module intentionally throws if imported so that future refactors
// surface usage quickly rather than silently duplicating UI logic.

export default function DeprecatedMain() {
  throw new Error(
    'Main.jsx has been deprecated. Please use the Vite + TypeScript entrypoint located at src/App.tsx.'
  );
}