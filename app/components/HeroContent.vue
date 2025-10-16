<template>
  <main class="absolute bottom-8 left-8 z-20 max-w-lg">
    <div class="text-left">
      <div
        class="inline-flex items-center px-3 py-1 rounded-full bg-white/5 backdrop-blur-sm mb-4 relative"
        style="filter: url(#glass-effect)">
        <div
          class="absolute top-0 left-1 right-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full" />
        <span class="text-white/90 text-xs font-light relative z-10"
          >✨ Preserve Your Moments</span
        >
      </div>

      <!-- Main Heading -->
      <h1
        class="text-5xl md:text-6xl md:leading-16 tracking-tight font-light text-white mb-4">
        <span class="font-medium italic instrument">Beautiful</span> Time
        <br />
        <span class="font-light tracking-tight text-white">Capsules</span>
      </h1>

      <!-- Description -->
      <p class="text-xs font-light text-white/70 mb-4 leading-relaxed">
        Create stunning time capsules with notes and media. Set future unlock
        dates and choose to keep them private or share publicly. Preserve your
        memories for the perfect moment.
      </p>

      <!-- Buttons -->
      <div class="flex items-center gap-4 flex-wrap">
        <NuxtLink
          to="/about"
          class="px-8 py-3 rounded-full bg-transparent border border-white/30 text-white font-normal text-xs transition-all duration-200 hover:bg-white/10 hover:border-white/50 cursor-pointer">
          Learn More
        </NuxtLink>
        <NuxtLink
          to="/capsule"
          class="px-8 py-3 rounded-full bg-white text-black font-normal text-xs transition-all duration-200 hover:bg-white/90 cursor-pointer">
          Get Started
        </NuxtLink>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts"></script>
