import type { Capsule, User } from "./types";

const USERS_KEY = "tc_users_v1";
const CAPSULES_KEY = "tc_capsules_v1";
const SESSION_KEY = "tc_session_v1";

function read<T>(key: string, fallback: T): T {
  if (process.server) return fallback;
  try {
    const v = localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  if (process.server) return;
  localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new StorageEvent("storage", { key }));
}

export function getUsers(): User[] {
  return read<User[]>(USERS_KEY, []);
}

export function saveUsers(users: User[]) {
  write<User[]>(USERS_KEY, users);
}

export function getCapsules(): Capsule[] {
  return read<Capsule[]>(CAPSULES_KEY, []);
}

export function saveCapsules(capsules: Capsule[]) {
  write<Capsule[]>(CAPSULES_KEY, capsules);
}

export function getSessionUserId(): string | null {
  return read<string | null>(SESSION_KEY, null);
}

export function setSessionUserId(id: string | null) {
  write<string | null>(SESSION_KEY, id);
}

export function upsertCapsule(c: Capsule) {
  const list = getCapsules();
  const idx = list.findIndex((x) => x.id === c.id);
  if (idx >= 0) {
    list[idx] = c;
  } else {
    list.unshift(c);
  }
  saveCapsules(list);
}

export function deleteCapsule(id: string) {
  const list = getCapsules().filter((c) => c.id !== id);
  saveCapsules(list);
}

export function getPublicCapsulesRandom(limit = 20): Capsule[] {
  const pubs = getCapsules().filter((c) => c.isPublic);
  // random sample
  return pubs
    .map((c) => ({ c, r: Math.random() }))
    .sort((a, b) => a.r - b.r)
    .slice(0, limit)
    .map((x) => x.c);
}
