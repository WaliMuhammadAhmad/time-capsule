<template>
  <main class="container mx-auto px-4 py-10 space-y-10">
    <section class="space-y-4">
      <h1 class="text-3xl font-semibold text-balance text-white">
        Create a Time Capsule
      </h1>
      <div
        v-if="!user && !loading"
        class="rounded-2xl border border-white/10 bg-background/40 backdrop-blur-xl p-6">
        <p class="text-white/80">
          Please
          <NuxtLink to="/login" class="underline">sign in</NuxtLink>
          or
          <NuxtLink to="/signup" class="underline">create an account</NuxtLink>
          to add a capsule.
        </p>
      </div>
      <CapsuleForm
        v-else
        @submit="createCapsule"
        submit-label="Create Capsule" />
    </section>

    <section class="space-y-4">
      <h2 class="text-2xl font-semibold text-white">Public Capsules</h2>
      <p v-if="publicCaps.length === 0" class="text-white/60">
        No public capsules yet.
      </p>
      <div v-else class="grid md:grid-cols-3 gap-6">
        <CapsuleCard v-for="c in publicCaps" :key="c.id" :capsule="c" />
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { getCapsules, saveCapsules, getPublicCapsulesRandom } from "~/lib/db";
import type { Capsule } from "~/lib/types";

const { user, loading } = useAuth();
const publicCaps = ref<Capsule[]>([]);

const loadPublicCaps = () => {
  publicCaps.value = getPublicCapsulesRandom(18);
};

const createCapsule = (
  data: Omit<Capsule, "id" | "userId" | "createdAt" | "updatedAt" | "notified">
) => {
  if (!user.value) return;

  const now = new Date().toISOString();
  const c: Capsule = {
    id: crypto.randomUUID(),
    userId: user.value.id,
    title: data.title,
    note: data.note,
    media: data.media,
    isPublic: data.isPublic,
    unlockAt: data.unlockAt,
    createdAt: now,
    updatedAt: now,
  };

  const list = getCapsules();
  list.unshift(c);
  saveCapsules(list);
  alert("Capsule saved.");
  loadPublicCaps();
};

onMounted(() => {
  loadPublicCaps();

  const handler = (e: StorageEvent) => {
    if (e.key === "tc_capsules_v1") loadPublicCaps();
  };
  window.addEventListener("storage", handler);

  onUnmounted(() => {
    window.removeEventListener("storage", handler);
  });
});
</script>
