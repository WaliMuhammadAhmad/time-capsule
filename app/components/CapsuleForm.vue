<template>
  <div
    class="rounded-2xl border border-white/10 bg-background/40 backdrop-blur-xl p-4 md:p-6 space-y-4">
    <div class="grid gap-3">
      <label for="title" class="text-sm font-medium text-white/90">Title</label>
      <input
        id="title"
        v-model="title"
        placeholder="A message to future me"
        class="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-violet-500" />
    </div>

    <div class="grid gap-3">
      <label for="note" class="text-sm font-medium text-white/90">Note</label>
      <textarea
        id="note"
        v-model="note"
        rows="5"
        placeholder="Write your note..."
        class="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-violet-500" />
    </div>

    <div class="grid md:grid-cols-3 gap-4">
      <div class="grid gap-2">
        <label for="unlockAt" class="text-sm font-medium text-white/90"
          >Unlock date</label
        >
        <input
          id="unlockAt"
          v-model="unlockAt"
          type="datetime-local"
          class="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-violet-500" />
        <p class="text-xs text-white/60">
          The capsule remains locked until this date and time.
        </p>
      </div>

      <div class="flex items-center gap-3">
        <input
          id="isPublic"
          v-model="isPublic"
          type="checkbox"
          class="w-4 h-4 rounded bg-white/5 border border-white/10 text-violet-500 focus:ring-2 focus:ring-violet-500" />
        <label for="isPublic" class="text-sm font-medium text-white/90"
          >Make public</label
        >
      </div>

      <div class="grid gap-2">
        <label for="media" class="text-sm font-medium text-white/90"
          >Media (images, audio, video)</label
        >
        <input
          id="media"
          type="file"
          multiple
          accept="image/*,audio/*,video/*"
          @change="onFiles"
          class="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:bg-violet-500 file:text-white hover:file:bg-violet-600" />
        <p class="text-xs text-white/60">Max ~5MB per file in this demo.</p>
      </div>
    </div>

    <div v-if="media.length > 0" class="grid md:grid-cols-3 gap-4">
      <div
        v-for="m in media"
        :key="m.id"
        class="rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-sm">
        <div class="text-xs text-white/70 mb-2">{{ m.name }}</div>
        <MediaPreview :media-type="m.type" :data-url="m.dataUrl" />
        <button
          @click="removeMedia(m.id)"
          class="mt-2 px-3 py-1 text-xs rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors">
          Remove
        </button>
      </div>
    </div>

    <div class="pt-2">
      <button
        @click="handleSubmit"
        class="w-full md:w-auto px-8 py-3 rounded-full bg-white text-black font-normal text-xs transition-all duration-200 hover:bg-white/90 cursor-pointer">
        {{ submitLabel }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Capsule, CapsuleMedia } from "~/lib/types";

const props = defineProps<{
  initial?: Partial<Capsule>;
  submitLabel?: string;
}>();

const emit = defineEmits<{
  submit: [
    data: Omit<
      Capsule,
      "id" | "userId" | "createdAt" | "updatedAt" | "notified"
    >
  ];
}>();

const title = ref(props.initial?.title || "");
const note = ref(props.initial?.note || "");
const unlockAt = ref(
  props.initial?.unlockAt
    ? props.initial.unlockAt.slice(0, 16)
    : new Date(Date.now() + 3600_000).toISOString().slice(0, 16)
);
const isPublic = ref(Boolean(props.initial?.isPublic));
const media = ref<CapsuleMedia[]>(props.initial?.media || []);

const onFiles = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const files = target.files;
  if (!files) return;

  const next: CapsuleMedia[] = [];
  for (const f of Array.from(files)) {
    // limit ~5MB for demo
    if (f.size > 5 * 1024 * 1024) {
      continue;
    }
    const dataUrl = await fileToDataUrl(f);
    next.push({
      id: crypto.randomUUID(),
      name: f.name,
      type: f.type || "application/octet-stream",
      dataUrl,
      size: f.size,
    });
  }
  media.value = [...media.value, ...next];
};

const removeMedia = (id: string) => {
  media.value = media.value.filter((x) => x.id !== id);
};

const handleSubmit = () => {
  emit("submit", {
    title: title.value,
    note: note.value,
    unlockAt: new Date(unlockAt.value).toISOString(),
    isPublic: isPublic.value,
    media: media.value,
  } as any);
};

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
</script>
