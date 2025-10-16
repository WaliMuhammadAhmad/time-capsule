<template>
  <div></div>
</template>

<script setup lang="ts">
import { getCapsules, saveCapsules, getSessionUserId } from "~/lib/db";
import { toast } from "vue-sonner";

const tick = () => {
  if (process.server) return;

  const now = Date.now();
  const userId = getSessionUserId();
  const caps = getCapsules();
  let changed = false;

  for (const c of caps) {
    if (
      userId &&
      c.userId === userId &&
      !c.notified &&
      new Date(c.unlockAt).getTime() <= now
    ) {
      // "send email" simulation
      toast.success("Your time capsule unlocked", {
        description: `"${c.title || "Untitled"}" is now available.`,
      });
      c.notified = true;
      changed = true;
    }
  }

  if (changed) saveCapsules(caps);
};

onMounted(() => {
  const id = setInterval(tick, 30_000); // check every 30s
  tick();

  onUnmounted(() => {
    clearInterval(id);
  });
});
</script>
