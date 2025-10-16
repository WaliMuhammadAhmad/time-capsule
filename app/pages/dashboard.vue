<template>
  <main class="container mx-auto px-4 py-10 space-y-10">
    <div v-if="!user && !loading">
      <div
        class="rounded-2xl border border-white/10 bg-background/40 backdrop-blur-xl p-6">
        <p class="text-white/80">
          Please
          <NuxtLink to="/login" class="underline">sign in</NuxtLink>
          to access your dashboard.
        </p>
      </div>
    </div>

    <div v-else-if="user">
      <section class="flex items-center justify-between">
        <h1 class="text-3xl font-semibold text-white">Your Dashboard</h1>
        <button
          @click="signOut"
          class="px-4 py-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors">
          Sign out
        </button>
      </section>

      <section class="grid md:grid-cols-2 gap-6">
        <div
          class="rounded-2xl border border-white/10 bg-background/40 backdrop-blur-xl p-6 space-y-3">
          <h2 class="text-xl font-semibold text-white">Profile</h2>
          <input
            v-model="nameInput"
            placeholder="Name"
            class="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-violet-500" />
          <button
            @click="saveProfile"
            :disabled="savingProfile"
            class="px-6 py-2 rounded-full bg-white text-black font-normal text-xs transition-all duration-200 hover:bg-white/90 cursor-pointer disabled:opacity-50">
            {{ savingProfile ? "Saving..." : "Save Profile" }}
          </button>
        </div>

        <div
          class="rounded-2xl border border-white/10 bg-background/40 backdrop-blur-xl p-6 space-y-3">
          <h2 class="text-xl font-semibold text-white">Password</h2>
          <input
            v-model="newPassword"
            placeholder="New password"
            type="password"
            class="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-violet-500" />
          <button
            @click="savePass"
            :disabled="savingPassword || !newPassword"
            class="px-6 py-2 rounded-full bg-white text-black font-normal text-xs transition-all duration-200 hover:bg-white/90 cursor-pointer disabled:opacity-50">
            {{ savingPassword ? "Updating..." : "Update Password" }}
          </button>
        </div>
      </section>

      <section class="space-y-4">
        <h2 class="text-2xl font-semibold text-white">Your Capsules</h2>
        <p v-if="capsules.length === 0" class="text-white/60">
          No capsules yet. Create one from the Capsule page.
        </p>
        <div v-else class="grid md:grid-cols-3 gap-6">
          <div
            v-for="c in capsules"
            :key="c.id"
            class="rounded-2xl border border-white/10 bg-background/40 backdrop-blur-xl p-4 space-y-3">
            <div class="text-sm text-white/60">
              Unlocks {{ new Date(c.unlockAt).toLocaleString() }}
            </div>
            <h3 class="text-lg font-semibold text-white">
              {{ c.title || "Untitled" }}
            </h3>
            <p class="text-white/80 line-clamp-3">{{ c.note }}</p>
            <div class="flex gap-2">
              <button
                @click="setEditing(c)"
                class="px-4 py-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors text-xs">
                Edit
              </button>
              <button
                @click="onDelete(c.id)"
                class="px-4 py-2 rounded-full bg-red-500/20 text-red-300 hover:bg-red-500/30 transition-colors text-xs">
                Delete
              </button>
            </div>
          </div>
        </div>
      </section>

      <section v-if="editing" class="space-y-3">
        <h2 class="text-xl font-semibold text-white">Edit Capsule</h2>
        <CapsuleForm
          :initial="editing"
          @submit="updateCapsule"
          submit-label="Update Capsule" />
        <button
          @click="editing = null"
          class="px-4 py-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors">
          Cancel
        </button>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import { getCapsules, saveCapsules, deleteCapsule } from "~/lib/db";
import type { Capsule } from "~/lib/types";

const { user, signOut, updatePassword, updateProfile, loading } = useAuth();
const capsules = ref<Capsule[]>([]);
const editing = ref<Capsule | null>(null);
const nameInput = ref("");
const newPassword = ref("");
const savingProfile = ref(false);
const savingPassword = ref(false);

const loadCapsules = () => {
  if (!user.value) return;
  capsules.value = getCapsules().filter((c) => c.userId === user.value!.id);
};

const updateCapsule = (data: any) => {
  if (!editing.value) return;
  const updated: Capsule = {
    ...editing.value,
    ...data,
    updatedAt: new Date().toISOString(),
  };
  const list = getCapsules().map((c) =>
    c.id === editing.value!.id ? updated : c
  );
  saveCapsules(list);
  editing.value = null;
  loadCapsules();
};

const onDelete = (id: string) => {
  if (!confirm("Delete this capsule?")) return;
  deleteCapsule(id);
  loadCapsules();
};

const saveProfile = async () => {
  savingProfile.value = true;
  await updateProfile({ name: nameInput.value });
  savingProfile.value = false;
  alert("Profile updated.");
};

const savePass = async () => {
  if (!newPassword.value) return;
  savingPassword.value = true;
  await updatePassword(newPassword.value);
  savingPassword.value = false;
  newPassword.value = "";
  alert("Password updated.");
};

const setEditing = (c: Capsule) => {
  editing.value = c;
};

watch(
  user,
  (newUser) => {
    if (newUser) {
      nameInput.value = newUser.name || "";
      loadCapsules();
    }
  },
  { immediate: true }
);

onMounted(() => {
  loadCapsules();

  const handler = (e: StorageEvent) => {
    if (e.key === "tc_capsules_v1") loadCapsules();
  };
  window.addEventListener("storage", handler);

  onUnmounted(() => {
    window.removeEventListener("storage", handler);
  });
});
</script>
