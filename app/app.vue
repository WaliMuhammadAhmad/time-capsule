<template>
  <UApp>
    <ShaderBackground>
      <Header />
      <UnlockNotifier />
      <NuxtPage />
      <Toaster position="top-right" />
    </ShaderBackground>
  </UApp>
</template>

<script setup lang="ts">
import { Toaster } from "vue-sonner";
</script>
