import { useCallback, useSyncExternalStore } from 'react';

/**
 * Reads a media query without breaking server rendering or hydration.
 * The server snapshot is always `false`; the client updates after hydration.
 */
export function useMediaQuery(query) {
  const subscribe = useCallback(
    (onStoreChange) => {
      if (typeof window === 'undefined' || !window.matchMedia) {
        return () => {};
      }

      const media = window.matchMedia(query);
      if (media.addEventListener) {
        media.addEventListener('change', onStoreChange);
      } else {
        media.addListener(onStoreChange);
      }

      return () => {
        if (media.removeEventListener) {
          media.removeEventListener('change', onStoreChange);
        } else {
          media.removeListener(onStoreChange);
        }
      };
    },
    [query]
  );

  const getSnapshot = useCallback(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia(query).matches;
  }, [query]);

  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
