import {
  getSessionUserId,
  getUsers,
  saveUsers,
  setSessionUserId,
} from "~/lib/db";
import type { User } from "~/lib/types";

async function hashPassword(password: string) {
  const enc = new TextEncoder().encode(password);
  const buf = await crypto.subtle.digest("SHA-256", enc);
  const arr = Array.from(new Uint8Array(buf));
  return arr.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export const useAuth = () => {
  const user = useState<User | null>("auth-user", () => null);
  const loading = useState<boolean>("auth-loading", () => true);

  const load = () => {
    if (process.server) return;
    const id = getSessionUserId();
    const users = getUsers();
    const u = users.find((x) => x.id === id) || null;
    user.value = u;
    loading.value = false;
  };

  const signIn = async (email: string, password: string) => {
    const users = getUsers();
    const u = users.find((x) => x.email.toLowerCase() === email.toLowerCase());
    if (!u) return { ok: false, error: "Account not found" };
    const hash = await hashPassword(password);
    if (u.passwordHash !== hash)
      return { ok: false, error: "Invalid credentials" };
    setSessionUserId(u.id);
    user.value = u;
    return { ok: true };
  };

  const signUp = async (email: string, password: string, name?: string) => {
    const users = getUsers();
    const exists = users.some(
      (x) => x.email.toLowerCase() === email.toLowerCase()
    );
    if (exists) return { ok: false, error: "Email already registered" };
    const hash = await hashPassword(password);
    const u: User = {
      id: crypto.randomUUID(),
      email,
      name,
      passwordHash: hash,
      createdAt: new Date().toISOString(),
    };
    users.push(u);
    saveUsers(users);
    setSessionUserId(u.id);
    user.value = u;
    return { ok: true };
  };

  const signOut = () => {
    setSessionUserId(null);
    user.value = null;
  };

  const updatePassword = async (newPassword: string) => {
    if (!user.value) return { ok: false, error: "Not authenticated" };
    const users = getUsers();
    const idx = users.findIndex((x) => x.id === user.value!.id);
    if (idx < 0) return { ok: false, error: "User not found" };
    const foundUser = users[idx];
    if (foundUser) {
      foundUser.passwordHash = await hashPassword(newPassword);
      saveUsers(users);
    }
    return { ok: true };
  };

  const updateProfile = async ({ name }: { name?: string }) => {
    if (!user.value) return { ok: false, error: "Not authenticated" };
    const users = getUsers();
    const idx = users.findIndex((x) => x.id === user.value!.id);
    if (idx < 0) return { ok: false, error: "User not found" };
    const foundUser = users[idx];
    if (foundUser) {
      if (typeof name !== "undefined") foundUser.name = name;
      saveUsers(users);
      user.value = foundUser;
    }
    return { ok: true };
  };

  // Load on mount (client-side only)
  onMounted(() => {
    load();

    const handler = (e: StorageEvent) => {
      if (e.key === "tc_users_v1" || e.key === "tc_session_v1") {
        load();
      }
    };
    window.addEventListener("storage", handler);

    onUnmounted(() => {
      window.removeEventListener("storage", handler);
    });
  });

  return {
    user: readonly(user),
    loading: readonly(loading),
    signIn,
    signUp,
    signOut,
    updatePassword,
    updateProfile,
  };
};
