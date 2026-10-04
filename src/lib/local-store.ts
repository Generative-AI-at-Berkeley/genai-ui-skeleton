/**
 * A localStorage-backed value with a subscribe hook, for useSyncExternalStore.
 *
 * A plain useEffect + setState on mount is the obvious way to read a stored
 * preference, but React flags synchronous setState inside an effect because
 * it forces an extra render. useSyncExternalStore is the API React ships for
 * exactly this: read an external store, without a component-owned effect.
 */

type Listener = () => void;

const listenersByKey = new Map<string, Set<Listener>>();

function listenersFor(key: string): Set<Listener> {
  let set = listenersByKey.get(key);
  if (!set) {
    set = new Set();
    listenersByKey.set(key, set);
  }
  return set;
}

export function subscribeLocalStorage(key: string, onChange: Listener): () => void {
  const set = listenersFor(key);
  set.add(onChange);

  // Catches the value changing in another tab. A write from this tab notifies
  // synchronously through writeLocalStorage instead, since the storage event
  // never fires in the tab that made the write.
  const onStorageEvent = (event: StorageEvent) => {
    if (event.key === key) onChange();
  };
  window.addEventListener("storage", onStorageEvent);

  return () => {
    set.delete(onChange);
    window.removeEventListener("storage", onStorageEvent);
  };
}

export function readLocalStorage(key: string): string | null {
  // Private browsing and blocked site data both make this throw.
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function writeLocalStorage(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Losing the preference on the next load is survivable. Blocking the
    // click that set it is not.
  }
  listenersFor(key).forEach((listener) => listener());
}
