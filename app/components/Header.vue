<template>
  <header class="relative z-20 flex items-center justify-between p-6">
    <!-- Logo -->
    <div class="flex items-center">
      <NuxtLink
        to="/"
        class="px-6 py-2 rounded-full bg-white text-black font-normal text-xs transition-all duration-300 hover:bg-white/90 cursor-pointer h-8 flex items-center z-10">
        Capsule
      </NuxtLink>
    </div>

    <!-- Navigation -->
    <nav class="flex items-center space-x-2">
      <NuxtLink
        to="/"
        class="text-white/80 hover:text-white text-xs font-light px-3 py-2 rounded-full hover:bg-white/10 transition-all duration-200">
        Home
      </NuxtLink>
      <NuxtLink
        to="/capsule"
        class="text-white/80 hover:text-white text-xs font-light px-3 py-2 rounded-full hover:bg-white/10 transition-all duration-200">
        Capsule
      </NuxtLink>
      <NuxtLink
        to="/about"
        class="text-white/80 hover:text-white text-xs font-light px-3 py-2 rounded-full hover:bg-white/10 transition-all duration-200">
        About
      </NuxtLink>
      <NuxtLink
        to="/privacy-policy"
        class="text-white/80 hover:text-white text-xs font-light px-3 py-2 rounded-full hover:bg-white/10 transition-all duration-200">
        Privacy
      </NuxtLink>
    </nav>

    <!-- Login Button Group -->
    <div id="gooey-btn" class="relative flex items-center group">
      <div v-if="user" class="flex items-center gap-2">
        <NuxtLink
          to="/dashboard"
          class="px-6 py-2 rounded-full bg-white text-black font-normal text-xs transition-all duration-300 hover:bg-white/90 cursor-pointer h-8 flex items-center z-10">
          Dashboard
        </NuxtLink>
        <button
          @click="signOut"
          class="px-3 py-2 rounded-full bg-white/90 text-black font-normal text-xs transition-all duration-300 hover:bg-white cursor-pointer h-8 flex items-center z-10">
          Sign out
        </button>
      </div>
      <div v-else class="relative flex items-center">
        <button
          class="absolute right-0 px-2.5 py-2 rounded-full bg-white text-black font-normal text-xs transition-all duration-300 hover:bg-white/90 cursor-pointer h-8 flex items-center justify-center -translate-x-10 group-hover:-translate-x-19 z-0"
          aria-label="Arrow">
          <svg
            class="w-3 h-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M7 17L17 7M17 7H7M17 7V17" />
          </svg>
        </button>
        <NuxtLink
          to="/login"
          class="px-6 py-2 rounded-full bg-white text-black font-normal text-xs transition-all duration-300 hover:bg-white/90 cursor-pointer h-8 flex items-center z-10">
          Login
        </NuxtLink>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
const { user, signOut } = useAuth();
</script>
