<template>
  <div class="absolute bottom-8 right-8 z-30">
    <div class="relative w-20 h-20 flex items-center justify-center">
      <!-- Pulsing Border Circle -->
      <div
        class="absolute inset-0 rounded-full animate-pulse-border"
        style="
          background: linear-gradient(
            45deg,
            #beecff,
            #e77edc,
            #ff4c3e,
            #00ff88,
            #ffd700
          );
          background-size: 400% 400%;
        " />
      <div class="absolute inset-[3px] rounded-full bg-black" />

      <!-- Rotating Text Around the Circle -->
      <svg
        class="absolute inset-0 w-full h-full animate-spin-slow"
        viewBox="0 0 100 100"
        style="transform: scale(1.6)">
        <defs>
          <path
            id="circle"
            d="M 50, 50 m -38, 0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0" />
        </defs>
        <text class="text-[4px] fill-white/80 instrument">
          <textPath href="#circle" startOffset="0%">
            TimeCapsule • TimeCapsule • TimeCapsule • TimeCapsule •
          </textPath>
        </text>
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
@keyframes pulse-border {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.05);
  }
}

@keyframes spin-slow {
  from {
    transform: scale(1.6) rotate(0deg);
  }
  to {
    transform: scale(1.6) rotate(360deg);
  }
}

.animate-pulse-border {
  animation: pulse-border 3s ease-in-out infinite;
}

.animate-spin-slow {
  animation: spin-slow 20s linear infinite;
}
</style>
