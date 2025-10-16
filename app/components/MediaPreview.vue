<template>
  <div>
    <img
      v-if="mediaType.startsWith('image/')"
      :src="dataUrl"
      alt="Uploaded"
      class="rounded-lg w-full h-40 object-cover" />
    <audio v-else-if="mediaType.startsWith('audio/')" controls class="w-full">
      <source :src="dataUrl" />
    </audio>
    <video
      v-else-if="mediaType.startsWith('video/')"
      controls
      class="w-full h-40 rounded-lg object-cover">
      <source :src="dataUrl" />
    </video>
    <div v-else class="text-xs text-white/60">Unsupported media preview</div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  mediaType: string;
  dataUrl: string;
}>();
</script>
