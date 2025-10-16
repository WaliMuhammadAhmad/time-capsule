<template>
  <div
    ref="containerRef"
    class="min-h-screen bg-black relative overflow-hidden">
    <!-- SVG Filters -->
    <svg class="absolute inset-0 w-0 h-0">
      <defs>
        <filter id="glass-effect" x="-50%" y="-50%" width="200%" height="200%">
          <feTurbulence baseFrequency="0.005" numOctaves="1" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="0.3" />
          <feColorMatrix
            type="matrix"
            values="1 0 0 0 0.02
                    0 1 0 0 0.02
                    0 0 1 0 0.05
                    0 0 0 0.9 0"
            result="tint" />
        </filter>
        <filter id="gooey-filter" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
          <feColorMatrix
            in="blur"
            mode="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
            result="gooey" />
          <feComposite in="SourceGraphic" in2="gooey" operator="atop" />
        </filter>
      </defs>
    </svg>

    <!-- Background Shaders - Canvas based mesh gradient -->
    <div ref="vantaRef" class="absolute inset-0 w-full h-full"></div>
    <div class="absolute inset-0 w-full h-full opacity-60 pointer-events-none">
      <canvas ref="wireframeRef" class="w-full h-full"></canvas>
    </div>

    <slot />
  </div>
</template>

<script setup lang="ts">
const containerRef = ref<HTMLDivElement | null>(null);
const vantaRef = ref<HTMLDivElement | null>(null);
const wireframeRef = ref<HTMLCanvasElement | null>(null);
let vantaEffect: any = null;

onMounted(async () => {
  if (process.server) return;

  try {
    // Dynamically import VANTA and THREE
    const THREE = (await import("three")) as any;
    const VANTA = (await import("vanta/dist/vanta.halo.min.js")) as any;

    // Initialize Vanta.js HALO effect with violet/purple theme
    if (vantaRef.value) {
      vantaEffect = (VANTA as any).default({
        el: vantaRef.value,
        THREE: THREE,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.0,
        minWidth: 200.0,
        baseColor: 0x8b5cf6, // violet-500 (primary color from theme)
        backgroundColor: 0x000000, // black background
        size: 1.5,
        amplitudeFactor: 1.0,
        xOffset: 0.0,
        yOffset: 0.0,
        speed: 1.0,
      });
    }

    // Create wireframe effect on second canvas
    createWireframeEffect();
  } catch (error) {
    console.error("Failed to load Vanta:", error);
    // Fallback to CSS-based animation
    useFallbackAnimation();
  }
});

onUnmounted(() => {
  if (vantaEffect) {
    vantaEffect.destroy();
  }
});

const createWireframeEffect = () => {
  const canvas = wireframeRef.value;
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // Set canvas size
  const resizeCanvas = () => {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  // Wireframe animation
  let time = 0;
  const animate = () => {
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "rgba(139, 92, 246, 0.2)"; // violet-500 with transparency
    ctx.lineWidth = 1.5;

    // Draw animated mesh
    const gridSize = 50;
    for (let x = 0; x < canvas.width; x += gridSize) {
      for (let y = 0; y < canvas.height; y += gridSize) {
        const offset = Math.sin(time + x * 0.01 + y * 0.01) * 10;
        ctx.beginPath();
        ctx.moveTo(x, y + offset);
        ctx.lineTo(x + gridSize, y + offset);
        ctx.lineTo(x + gridSize, y + gridSize + offset);
        ctx.stroke();
      }
    }

    time += 0.01;
    requestAnimationFrame(animate);
  };

  animate();
};

const useFallbackAnimation = () => {
  // Fallback to CSS gradient animations with Tailwind colors if Vanta fails
  if (vantaRef.value) {
    vantaRef.value.innerHTML = `
      <div class="absolute inset-0 w-full h-full bg-gradient-to-br from-black via-violet-500/20 to-black animate-gradient"></div>
      <div class="absolute inset-0 w-full h-full">
        <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse-slower"></div>
        <div class="absolute top-1/2 left-1/2 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl animate-float"></div>
      </div>
    `;
  }
};
</script>

<style scoped>
@keyframes gradient {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

@keyframes pulse-slow {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.3;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.2;
  }
}

@keyframes pulse-slower {
  0%,
  100% {
    transform: scale(1.1);
    opacity: 0.2;
  }
  50% {
    transform: scale(1);
    opacity: 0.3;
  }
}

@keyframes float {
  0%,
  100% {
    transform: translate(-50%, -50%) translateY(0px);
  }
  50% {
    transform: translate(-50%, -50%) translateY(-20px);
  }
}

.animate-gradient {
  animation: gradient 8s ease-in-out infinite;
}

.animate-pulse-slow {
  animation: pulse-slow 4s ease-in-out infinite;
}

.animate-pulse-slower {
  animation: pulse-slower 6s ease-in-out infinite;
}

.animate-float {
  animation: float 8s ease-in-out infinite;
}
</style>
