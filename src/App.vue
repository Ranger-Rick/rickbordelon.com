<script setup>
import ThemeToggle from './components/ThemeToggle.vue'
</script>

<template>
  <div class="min-h-screen flex items-center justify-center relative">
    <ThemeToggle class="absolute top-6 right-6" />
    <h1
      class="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter leading-none text-center select-none"
      style="font-family: 'Arial Black', 'Helvetica Neue', sans-serif; letter-spacing: -0.04em;"
    >
      Rick<br/>Bordelon
    </h1>
  </div>
</template>
