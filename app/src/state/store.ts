import { signal, computed, effect } from "@preact/signals";

const CHECKLIST_KEY = "hdv:checklist";
const BOOKMARKS_KEY = "hdv:bookmarks";

function loadSet(key: string): Set<string> {
  try {
    const raw = localStorage.getItem(key);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

export const checkedItems = signal<Set<string>>(loadSet(CHECKLIST_KEY));
export const bookmarks = signal<Set<string>>(loadSet(BOOKMARKS_KEY));
export const isOnline = signal<boolean>(navigator.onLine);

effect(() => {
  localStorage.setItem(CHECKLIST_KEY, JSON.stringify([...checkedItems.value]));
});

effect(() => {
  localStorage.setItem(BOOKMARKS_KEY, JSON.stringify([...bookmarks.value]));
});

window.addEventListener("online", () => (isOnline.value = true));
window.addEventListener("offline", () => (isOnline.value = false));

export function toggleChecked(id: string) {
  const next = new Set(checkedItems.value);
  if (next.has(id)) next.delete(id);
  else next.add(id);
  checkedItems.value = next;
}

export function toggleBookmark(id: string) {
  const next = new Set(bookmarks.value);
  if (next.has(id)) next.delete(id);
  else next.add(id);
  bookmarks.value = next;
}

export function isChecked(id: string) {
  return computed(() => checkedItems.value.has(id));
}
