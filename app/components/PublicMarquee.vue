<template>
  <div v-if="items.length > 0" class="relative overflow-hidden">
    <div
      v-for="(row, r) in rows"
      :key="r"
      class="flex gap-4 py-2 [mask-image:linear-gradient(to_right,transparent,black_20%,black_80%,transparent)]"
      :style="{
        animation: `marquee ${30 + r * 8}s linear infinite`,
        animationDirection: r % 2 ? 'reverse' : 'normal',
      }">
      <NuxtLink
        v-for="(c, i) in [...row, ...row]"
        :key="`${c.id}-${i}`"
        to="/capsule"
        class="shrink-0 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md px-3 py-2 hover:bg-white/10 transition-colors"
        style="width: 280px">
        <div class="text-sm font-medium text-white/90 line-clamp-1">
          {{ c.title || "Untitled" }}
        </div>
        <div class="text-xs text-white/60 line-clamp-2">
          {{ c.note || " " }}
        </div>
        <div class="mt-1 text-[10px] text-white/50">
          Unlocks {{ new Date(c.unlockAt).toLocaleString() }}
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getPublicCapsulesRandom } from "~/lib/db";
import type { Capsule } from "~/lib/types";

const items = ref<Capsule[]>([]);

const rows = computed(() => {
  const half = Math.ceil(items.value.length / 2);
  return [items.value.slice(0, half), items.value.slice(half)];
});

const pick = () => {
  items.value = getPublicCapsulesRandom(24);
};

onMounted(() => {
  pick();

  const handler = (e: StorageEvent) => {
    if (e.key === "tc_capsules_v1") pick();
  };
  window.addEventListener("storage", handler);

  const id = setInterval(pick, 20_000);

  onUnmounted(() => {
    window.removeEventListener("storage", handler);
    clearInterval(id);
  });
});
</script>
