<template>
  <main class="min-h-[80vh] grid place-items-center p-4">
    <div
      class="w-full max-w-md rounded-2xl border border-white/10 bg-background/40 backdrop-blur-xl p-6">
      <h1 class="text-2xl font-semibold mb-2 text-balance text-white">
        Welcome back
      </h1>
      <p class="text-sm text-white/60 mb-6">
        Sign in to continue to TimeCapsule.
      </p>

      <div v-if="error" class="mb-4 text-sm text-red-500">{{ error }}</div>

      <div class="grid gap-3">
        <input
          v-model="email"
          placeholder="Email"
          type="email"
          class="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-violet-500" />
        <input
          v-model="password"
          placeholder="Password"
          type="password"
          class="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-violet-500" />
        <button
          @click="onSubmit"
          :disabled="loading"
          class="w-full px-8 py-3 rounded-full bg-white text-black font-normal text-xs transition-all duration-200 hover:bg-white/90 cursor-pointer disabled:opacity-50">
          {{ loading ? "Signing in..." : "Sign in" }}
        </button>
        <p class="text-sm text-white/60">
          No account?
          <NuxtLink class="underline" to="/signup">Create one</NuxtLink>
        </p>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
const { signIn } = useAuth();
const email = ref("");
const password = ref("");
const error = ref<string | null>(null);
const loading = ref(false);

const onSubmit = async () => {
  loading.value = true;
  const { ok, error: err } = await signIn(email.value, password.value);
  loading.value = false;
  if (!ok) {
    error.value = err || "Failed to sign in";
  } else {
    navigateTo("/dashboard");
  }
};
</script>
