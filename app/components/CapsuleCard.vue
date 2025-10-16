<template>
  <div
    class="rounded-2xl border border-white/10 bg-background/40 backdrop-blur-xl p-4">
    <div class="text-sm text-white/60">
      Unlocks {{ formatDate(capsule.unlockAt) }}
    </div>
    <h3 class="text-lg font-semibold mt-1 text-white">
      {{ capsule.title || "Untitled" }}
    </h3>
    <p class="text-white/80 mt-2">{{ capsule.note }}</p>
    <div v-if="first" class="mt-3">
      <MediaPreview :media-type="first.type" :data-url="first.dataUrl" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Capsule } from "~/lib/types";

const props = defineProps<{
  capsule: Capsule;
}>();

const first = computed(() => props.capsule.media[0]);

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleString();
};
</script>
